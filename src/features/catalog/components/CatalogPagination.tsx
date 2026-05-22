import ReactPaginate from "react-paginate";
import { FilterDropdown, type DropdownOption } from "@/components/FilterDropdown";
import { PAGE_SIZE_OPTIONS, isPageSize, type PageSize } from "@/features/catalog/filters";

type Props = {
  page: number;
  pageSize: PageSize;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: PageSize) => void;
};

const PAGE_SIZE_DROPDOWN_OPTIONS: readonly DropdownOption[] = PAGE_SIZE_OPTIONS.map((n) => ({
  value: String(n),
  label: `${n} per page`,
}));

export function CatalogPagination({
  page,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: Props) {
  return (
    <nav aria-label="Catalog pagination" className="flex items-center gap-2 px-2 py-3">
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
          options={PAGE_SIZE_DROPDOWN_OPTIONS}
          value={String(pageSize)}
          onChange={(next) => {
            const parsed = Number(next);
            if (Number.isFinite(parsed) && isPageSize(parsed)) {
              onPageSizeChange(parsed);
            }
          }}
          ariaLabel="Items per page"
          className="w-32"
          openUpward
        />
      </div>
    </nav>
  );
}
