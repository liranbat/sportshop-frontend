type Props = {
  word: string;
  description: string;
};

// CSS-only flip card: hover the wrapper -> inner div rotates 180deg -> back face shows
export function ValueCard({ word, description }: Props) {
  return (
    <div className="group h-45 w-55 perspective-[1000px]">
      <div className="relative h-full w-full transform-3d transition-transform duration-500 group-hover:transform-[rotateY(180deg)]">
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background-card p-6 shadow-[0_4px_12px_rgba(0,0,0,0.1)] backface-hidden">
          <span className="text-heading-m text-primary-blue">{word}</span>
        </div>

        {/* back face is pre-rotated so it faces the camera once we flip */}
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-primary-blue p-6 shadow-[0_4px_12px_rgba(0,0,0,0.1)] backface-hidden transform-[rotateY(180deg)]">
          <span className="text-center text-body-small text-white">{description}</span>
        </div>
      </div>
    </div>
  );
}
