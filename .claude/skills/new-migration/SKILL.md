---
name: new-migration
description: Scaffold a new PostgreSQL migration pair (up + down) with sequential numbering
disable-model-invocation: true
---

# New Migration

Create a new PostgreSQL migration file pair following project conventions.

## Usage

```
/new-migration <description>
```

Example: `/new-migration add_user_preferences`

## Steps

1. Find the current highest migration number in `internal/migrations/sql/`:
   ```bash
   ls internal/migrations/sql/*.up.sql | sort -t_ -k1 -n | tail -1
   ```

2. Calculate the next sequential number (current max + 1).

3. Convert the description argument to lowercase snake_case.

4. Create two files:
   - `internal/migrations/sql/{N}_{description}.up.sql`
   - `internal/migrations/sql/{N}_{description}.down.sql`

5. Populate the UP migration with a commented template:
   ```sql
   -- Migration {N}: {description}
   -- TODO: Add your UP migration SQL here

   ```

6. Populate the DOWN migration with a commented template:
   ```sql
   -- Migration {N}: {description} (rollback)
   -- TODO: Add your DOWN migration SQL here (must fully reverse the UP migration)

   ```

7. Report the created files and remind:
   - Use uppercase SQL keywords (ALTER, CREATE, DROP, TABLE, etc.)
   - Table/column names use PascalCase (e.g., `MCPServerLog`, `project_id`)
   - DOWN migration must fully reverse the UP migration
   - Run `mise run migrate` to apply, `mise run purge` to roll back
   - Run `hack/validate-migrations.sh` to verify pairing and sequencing

## Conventions

- Sequential numbering starting from 0, no gaps
- Each migration must have both `.up.sql` and `.down.sql`
- One logical change per migration
- Foreign keys: `REFERENCES TableName(column_name)`
- Index naming: `idx_{table}_{column}` or `fk_{table}_{column}`
