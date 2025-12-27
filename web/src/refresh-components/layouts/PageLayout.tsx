// Wraps all pages with the default, standard CSS styles.

import { cn } from "@/lib/utils";

export default function PageLayout({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className="h-full w-full overflow-y-auto"
      id="page-wrapper-scroll-container"
    >
      {/* WARNING: The id="page-wrapper-scroll-container" above is used by PageHeader.tsx
          to detect scroll position and show/hide the scroll shadow.
          DO NOT REMOVE this ID without updating PageHeader.tsx accordingly. */}
      <div className={cn("h-full flex flex-col items-center", className || "w-[50rem]")}>
        <div {...props} />
      </div>
    </div>
  );
}
