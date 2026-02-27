import { httpResource } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import {
  ColumnDef,
  createAngularTable,
  flexRenderComponent,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
} from '@tanstack/angular-table';
import { formatDuration, intervalToDuration } from 'date-fns';
import { combineLatestWith, distinctUntilChanged, map, tap } from 'rxjs';
import { JsonRpcRequest, MCPServerLog } from '../../../../api/mcp-server-log';
import { TableHeadSortButtonComponent } from '../../../components/table/sort-header-button.component';
import { ContextService } from '../../../services/context.service';
import { LogsActionsComponent } from './logs-actions.component';
import { TimestampCellComponent } from './timestamp-cell.component';

import { ActivatedRoute } from '@angular/router';
import { TableComponent } from '../../../components/table/table.component';

@Component({
  host: { class: 'w-full' },
  template: `
    <app-table [columns]="columns" [table]="table" (refresh)="data.reload()">
      <h1 class="text-2xl font-semibold text-foreground">Logs</h1>
      <p class="text-muted-foreground">
        Details about calls to your MCP servers
      </p>
    </app-table>
  `,
  imports: [TableComponent],
})
export class LogsComponent {
  protected readonly columns: ColumnDef<MCPServerLog>[] = [
    {
      accessorKey: 'startedAt',
      id: 'started_at',
      cell: (info) =>
        flexRenderComponent(TimestampCellComponent, {
          inputs: {
            timestamp: info.getValue<string>(),
          },
        }),
      enableSorting: true,
      header: () =>
        flexRenderComponent(TableHeadSortButtonComponent, {
          inputs: {
            header: 'Timestamp',
          },
        }),
    },
    {
      accessorKey: 'duration',
      id: 'duration',
      header: () => flexRenderComponent(TableHeadSortButtonComponent),
      // header: 'Duration (ms)',
      cell: (info) => {
        const durationMs = info.getValue<number>() / 1000 / 1000; // Convert from nanoseconds to milliseconds
        const duration = intervalToDuration({ start: 0, end: durationMs });
        const formatted = formatDuration(duration, {
          format: ['minutes', 'seconds'],
        });
        const rawMs = Math.round(durationMs) + ' ms';
        return `<span title="${rawMs}">${formatted || rawMs}</span>`;
      },
      enableSorting: true,
    },
    {
      accessorKey: 'mcpRequest',
      id: 'mcpRequest',
      header: 'MCP Method',
      cell: (info) =>
        info.getValue<JsonRpcRequest | undefined>()?.method ?? '-',
      enableSorting: false,
    },
    {
      accessorKey: 'mcpRequest',
      id: 'toolName',
      header: 'Tool Name',
      cell: (info) => {
        const request = info.getValue<JsonRpcRequest | undefined>();
        const toolName =
          request?.method.toLowerCase() === 'tools/call'
            ? request.params?.name
            : '-';
        return toolName || '-';
      },
      enableSorting: false,
    },
    {
      accessorKey: 'httpStatusCode',
      id: 'http_status_code',
      header: () =>
        flexRenderComponent(TableHeadSortButtonComponent, {
          inputs: {
            header: 'Status Code',
          },
        }),
      cell: (info) =>
        `<span class="capitalize">${info.getValue<string>()}</span>`,
      enableSorting: true,
    },
    {
      id: 'action',
      enableHiding: false,
      cell: (info) =>
        flexRenderComponent(LogsActionsComponent, {
          inputs: {
            mcpServerLog: info.row.original,
          },
        }),
    },
  ];

  private readonly defaultSorting: SortingState = [
    {
      id: 'started_at',
      desc: true,
    },
  ];
  private readonly _sorting = signal<SortingState>(this.defaultSorting);
  private readonly defaultPagination: PaginationState = {
    pageSize: 10,
    pageIndex: 0,
  };
  private readonly _pagination = signal<PaginationState>(
    this.defaultPagination,
  );

  private readonly route = inject(ActivatedRoute);
  private readonly contextService = inject(ContextService);

  protected readonly query = toSignal(
    toObservable(this.contextService.selectedProject).pipe(
      map((p) => p?.id),
      distinctUntilChanged(),
      tap(() => {
        this._pagination.set(this.defaultPagination);
      }),
      combineLatestWith(
        toObservable(this._pagination),
        toObservable(this._sorting),
        this.route.queryParams.pipe(map((params) => params['id'])),
        this.route.queryParams.pipe(map((params) => params['mcpSessionId'])),
      ),
      map(([projectId, pagination, sorting, id, mcpSessionId]) => {
        return { projectId, pagination, sorting, id, mcpSessionId };
      }),
    ),
  );

  protected readonly data = httpResource(
    () => {
      const query = this.query();
      if (query?.projectId) {
        const { projectId, pagination, sorting, id, mcpSessionId } = query;
        const params: Record<string, string | number> = {
          page: pagination?.pageIndex,
          count: pagination?.pageSize,
          sortOrder: (sorting?.[0]?.desc ?? false) ? 'desc' : 'asc',
          sortBy: sorting?.[0]?.id ?? '',
        };

        if (id) {
          params['id'] = id;
        }

        if (mcpSessionId) {
          params['mcpSessionId'] = mcpSessionId;
        }

        return {
          url: `/api/v1/projects/${projectId}/logs`,
          method: 'GET',
          params,
        };
      } else {
        return undefined;
      }
    },
    {
      parse: (value) => value as MCPServerLog[],
      defaultValue: [],
    },
  );

  protected readonly table = createAngularTable(() => ({
    data: this.data.value(),
    columns: this.columns,
    state: {
      sorting: this._sorting(),
      pagination: this._pagination(),
    },
    manualPagination: true,
    pageCount: -1,
    manualSorting: true,
    enableMultiSort: false,
    onSortingChange: (updater) => {
      if (updater instanceof Function) {
        this._sorting.update(updater);
      } else {
        this._sorting.set(updater);
      }
    },
    onPaginationChange: (updater) => {
      if (updater instanceof Function) {
        this._pagination.update(updater);
      } else {
        this._pagination.set(updater);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  }));
}
