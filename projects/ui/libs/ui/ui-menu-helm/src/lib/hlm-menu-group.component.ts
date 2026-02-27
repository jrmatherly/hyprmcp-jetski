import { CdkMenuGroup } from '@angular/cdk/menu';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'hlm-menu-group',
  host: {
    class: 'block',
  },
  hostDirectives: [CdkMenuGroup],
  template: ` <ng-content /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmMenuGroup {}
