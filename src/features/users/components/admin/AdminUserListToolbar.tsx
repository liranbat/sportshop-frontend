import { Button } from "@/components/Button";
import { FilterDropdown, type DropdownOption } from "@/components/FilterDropdown";
import { FilterDropdownLabeled } from "@/components/FilterDropdownLabeled";
import { FilterSearchBar } from "@/components/FilterSearchBar";
import { FilterSort } from "@/components/FilterSort";
import { RefreshButton } from "@/components/RefreshButton";
import type {
  StagedUserFilters,
  UserRoleFilter,
  UserSortField,
  UserStatusFilter,
} from "@/features/users/filters";

const ROLE_OPTIONS: readonly DropdownOption[] = [
  { value: "ALL", label: "All roles" },
  { value: "ADMIN", label: "Admin" },
  { value: "USER", label: "User" },
];

const STATUS_OPTIONS: readonly DropdownOption[] = [
  { value: "ALL", label: "All statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "DELETED", label: "Deleted" },
];

const SORT_OPTIONS: readonly DropdownOption[] = [
  { value: "id", label: "ID" },
  { value: "name", label: "Name" },
  { value: "email", label: "Email" },
];

function isUserRoleFilter(value: string): value is UserRoleFilter {
  return value === "ADMIN" || value === "USER" || value === "ALL";
}

function isUserStatusFilter(value: string): value is UserStatusFilter {
  return value === "ACTIVE" || value === "DELETED" || value === "ALL";
}

function isUserSortField(value: string): value is UserSortField {
  return value === "id" || value === "name" || value === "email";
}

type Props = {
  staged: StagedUserFilters;
  setStaged: (next: StagedUserFilters) => void;
  hasPendingEdits: boolean;
  isRefreshing: boolean;
  onApply: () => void;
  onClear: () => void;
  onRefresh: () => void;
};

export function AdminUserListToolbar({
  staged,
  setStaged,
  hasPendingEdits,
  isRefreshing,
  onApply,
  onClear,
  onRefresh,
}: Props) {
  return (
    <section aria-label="Admin user list filters" className="relative z-20 flex flex-col gap-1">
      <h1 className="text-body-large font-semibold text-text-primary">Users</h1>

      <div className="flex flex-wrap items-end gap-2">
        <FilterSearchBar
          value={staged.search}
          onChange={(search) => setStaged({ ...staged, search })}
          placeholder="Search name, email, phone..."
          ariaLabel="Search users"
          className="w-72"
        />

        <FilterDropdownLabeled label="ROLE">
          <FilterDropdown
            options={ROLE_OPTIONS}
            value={staged.role}
            onChange={(next) => {
              if (isUserRoleFilter(next)) setStaged({ ...staged, role: next });
            }}
            ariaLabel="Filter by role"
            className="w-36"
          />
        </FilterDropdownLabeled>

        <FilterDropdownLabeled label="STATUS">
          <FilterDropdown
            options={STATUS_OPTIONS}
            value={staged.status}
            onChange={(next) => {
              if (isUserStatusFilter(next)) setStaged({ ...staged, status: next });
            }}
            ariaLabel="Filter by status"
            className="w-36"
          />
        </FilterDropdownLabeled>

        <FilterSort
          options={SORT_OPTIONS}
          field={staged.sortField}
          direction={staged.sortDirection}
          enabled={staged.sortEnabled}
          onFieldChange={(value) => {
            if (isUserSortField(value)) {
              setStaged({ ...staged, sortField: value });
            }
          }}
          onDirectionToggle={() =>
            setStaged({
              ...staged,
              sortDirection: staged.sortDirection === "asc" ? "desc" : "asc",
            })
          }
          onEnabledChange={(sortEnabled) => setStaged({ ...staged, sortEnabled })}
          className="ml-auto"
        />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div className="relative">
          <Button variant="primary" className="h-7 px-3 text-body-small" onClick={onApply}>
            Apply
          </Button>
          {hasPendingEdits && (
            <span
              aria-label="Unapplied filter changes"
              title="Unapplied filter changes"
              className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-error-red ring-2 ring-background-page"
            />
          )}
        </div>
        <Button variant="outlined" className="h-7 px-3 text-body-small" onClick={onClear}>
          Clear
        </Button>
        <div className="ml-auto">
          <RefreshButton
            onClick={onRefresh}
            isPending={isRefreshing}
            ariaLabel="Refresh user list"
          />
        </div>
      </div>
    </section>
  );
}
