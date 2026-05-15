type Props = {
  name: string;
  iconSrc: string;
};

export function CategoryCard({ name, iconSrc }: Props) {
  return (
    <div className="flex h-44 w-50 shrink-0 snap-start flex-col items-center justify-center gap-3 rounded-xl bg-background-card p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <div className="flex h-19 w-32 items-center justify-center rounded-2xl bg-section-categories">
        <img src={iconSrc} alt="" className="h-12 w-12" />
      </div>
      <span className="text-body-regular text-text-primary">{name}</span>
    </div>
  );
}
