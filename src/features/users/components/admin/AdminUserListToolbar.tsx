import { FilterDropdown, type DropdownOption } from "@/components/FilterDropdown";
import { FilterDropdownLabeled } from "@/components/FilterDropdownLabeled";
import { FilterSearchBar } from "@/components/FilterSearchBar";
import { FilterSort } from "@/components/FilterSort";
import { ListFilterToolbar } from "@/components/ListFilterToolbar";
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
    <ListFilterToolbar
      ariaLabel="Admin user list filters"
      title="Users"
      isRefreshing={isRefreshing}
      hasPendingEdits={hasPendingEdits}
      onApply={onApply}
      onClear={onClear}
      onRefresh={onRefresh}
      refreshAriaLabel="Refresh user list"
    >
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
    </ListFilterToolbar>
  );
}
