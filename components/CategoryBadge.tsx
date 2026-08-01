import { Category, CATEGORY_COLORS } from "@/lib/types";

export function CategoryBadge({ category }: { category: Category }) {
  const color = CATEGORY_COLORS[category];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset"
      style={{
        backgroundColor: `${color}1a`,
        color,
        // @ts-expect-error custom property for ring color
        "--tw-ring-color": `${color}33`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {category}
    </span>
  );
}
