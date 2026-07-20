import { Badge } from "@/components/Badge";
import { IconButton } from "@/components/IconButton";
import { STOCK_LABEL, statusBadgeStateForStock } from "@/features/stock/badge";
import type { StockRow } from "@/features/stock/schema";

type Props = {
  row: StockRow;
  onStartEdit: (row: StockRow) => void;
  onRemove: (row: StockRow) => void;
};

export function StockManagementListRow({ row, onStartEdit, onRemove }: Props) {
  const canRemoveSize = row.productIsMultiSize === true;
  return (
    <tr className="border-t border-cart-line-divider hover:bg-primary-blue-light/40">
      <ProductCell row={row} />
      <SizeCell row={row} />
      <td className="px-4 py-3 align-middle text-body-small text-text-primary">{row.quantity}</td>
      <td className="px-4 py-3 align-middle text-body-small text-text-secondary">
        {row.lowStockThreshold === null || row.lowStockThreshold === undefined
          ? "—"
          : `≤${row.lowStockThreshold}`}
      </td>
      <td className="px-4 py-3 align-middle">
        <StockStatusBadge row={row} />
      </td>
      <td className="px-4 py-3 align-middle">
        <div className="flex items-center gap-1">
          <IconButton ariaLabel="Edit stock" title="Edit stock" onClick={() => onStartEdit(row)}>
            <PencilIcon />
          </IconButton>
          {canRemoveSize && (
            <IconButton
              ariaLabel="Remove this size"
              title="Remove size"
              tone="danger"
              onClick={() => onRemove(row)}
            >
              <TrashIcon />
            </IconButton>
          )}
        </div>
      </td>
    </tr>
  );
}

function ProductCell({ row }: { row: StockRow }) {
  return (
    <td className="px-4 py-3 align-middle">
      <div className="flex items-center gap-3">
        <Thumbnail src={row.productImageUrl ?? null} alt={row.productName} />
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-2">
            <span className="truncate text-body-small-bold text-text-primary">
              {row.productName}
            </span>
            {row.productIsArchived && <Badge kind="ARCHIVED" label="Archived" size="sm" />}
          </div>
          <span className="text-caption-regular text-text-secondary">ID: {row.productId}</span>
        </div>
      </div>
    </td>
  );
}

function SizeCell({ row }: { row: StockRow }) {
  return <td className="px-4 py-3 align-middle text-body-small text-text-primary">{row.size}</td>;
}

function StockStatusBadge({ row }: { row: StockRow }) {
  const kind = statusBadgeStateForStock(row.quantity, row.lowStockThreshold ?? null);
  return <Badge kind={kind} label={STOCK_LABEL[kind]} />;
}

function Thumbnail({ src, alt }: { src: string | null; alt: string }) {
  if (!src) {
    return (
      <div
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border-default bg-background-page text-caption-regular text-text-placeholder"
      >
        ?
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className="h-10 w-10 shrink-0 rounded-md border border-border-default bg-background-page object-cover"
      loading="lazy"
    />
  );
}

function PencilIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
