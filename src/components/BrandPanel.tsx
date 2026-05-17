export function BrandPanel() {
  return (
    <aside
      aria-label="SportShop branding"
      className="hidden h-full w-[648px] shrink-0 flex-col items-center justify-center bg-linear-to-b from-primary-blue to-primary-blue-deep p-10 md:flex"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-heading-brand text-white">SportShop</h1>
        <p className="text-body-large text-white/80">Your one-stop sports gear destination</p>
      </div>
    </aside>
  );
}
