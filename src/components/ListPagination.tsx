import ReactPaginate from "react-paginate";
import { FilterDropdown, type DropdownOption } from "@/components/FilterDropdown";

type Props<T extends number> = {
  ariaLabel: string;
  page: number;
  pageSize: T;
  pageSizeOptions: readonly T[];
  totalPages: number;
  disabled: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: T) => void;
};

export function ListPagination<T extends number>({
  ariaLabel,
  page,
  pageSize,
  pageSizeOptions,
  totalPages,
  disabled,
  onPageChange,
  onPageSizeChange,
}: Props<T>) {
  const dropdownOptions: readonly DropdownOption[] = pageSizeOptions.map((n) => ({
    value: String(n),
    label: `${n} per page`,
  }));
  const optionSet = new Set<number>(pageSizeOptions);

  return (
    <nav
      aria-label={ariaLabel}
      aria-busy={disabled}
      className={`flex items-center gap-2 px-2 py-3 transition-opacity ${
        disabled ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <fieldset disabled={disabled} className="contents">
        <div className="flex-1" />

        <div className="flex flex-1 justify-center">
          {totalPages > 1 && (
            <ReactPaginate
              forcePage={page}
              pageCount={totalPages}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              onPageChange={({ selected }) => onPageChange(selected)}
              previousLabel="‹"
              nextLabel="›"
              breakLabel="…"
              containerClassName="flex items-center gap-1"
              pageClassName=""
              pageLinkClassName="flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-lg border border-border-default bg-background-card px-2 text-body-small text-text-primary hover:bg-primary-blue-light"
              activeLinkClassName="!bg-primary-blue !text-white !border-primary-blue hover:!bg-primary-blue-hover"
              previousLinkClassName="flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-lg border border-border-default bg-background-card px-2 text-body-small text-text-primary hover:bg-primary-blue-light"
              nextLinkClassName="flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-lg border border-border-default bg-background-card px-2 text-body-small text-text-primary hover:bg-primary-blue-light"
              breakLinkClassName="flex h-8 min-w-8 items-center justify-center px-2 text-body-small text-text-secondary"
              disabledLinkClassName="cursor-not-allowed opacity-50 hover:bg-background-card"
              ariaLabelBuilder={(idx, selected) =>
                idx === selected ? `Page ${idx}, current page` : `Page ${idx}`
              }
            />
          )}
        </div>

        <div className="flex flex-1 justify-end">
          <FilterDropdown
            options={dropdownOptions}
            value={String(pageSize)}
            onChange={(next) => {
              const parsed = Number(next);
              if (Number.isFinite(parsed) && optionSet.has(parsed)) {
                onPageSizeChange(parsed as T);
              }
            }}
            ariaLabel="Items per page"
            className="w-32"
            openUpward
          />
        </div>
      </fieldset>
    </nav>
  );
}
