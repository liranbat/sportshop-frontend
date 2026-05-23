type Props = {
  name: string;
  imageUrl: string | null;
};

export function ProductImageSection({ name, imageUrl }: Props) {
  return (
    <div className="flex h-full min-h-0 items-center justify-center rounded-2xl bg-background-card p-6">
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-primary-blue-light">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="h-full w-full object-contain" />
        ) : (
          <span className="text-body-regular text-text-placeholder">Product Image</span>
        )}
      </div>
    </div>
  );
}
