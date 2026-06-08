import { cn } from "@/lib/utils";

// Marca gráfica do Inscribing: uma pena (quill) estilizada em line-art,
// alinhada à identidade "pergaminho e pena" do produto.
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Haste da pena */}
      <path d="M19 4C12 5 8 9.5 6 15l-2 5" />
      {/* Plumagem */}
      <path d="M19 4c1.2 5-.8 9.8-4.8 11.8-2.2 1.1-5 1-7.2-.2 1.2-4 3.2-7.6 6.2-9.6 2-1.3 3.8-1.8 5.8-2Z" />
      {/* Barbas */}
      <path d="M8 16h3.5M10 12h3.5M13 8h2.5" />
    </svg>
  );
}

interface LogoProps {
  withWordmark?: boolean;
  className?: string;
  markClassName?: string;
}

// Logo completa (marca + wordmark "Inscribing").
export function Logo({
  withWordmark = true,
  className,
  markClassName,
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <BrandMark className={cn("h-6 w-6 text-foreground", markClassName)} />
      {withWordmark && (
        <span className="text-xl font-semibold tracking-tight text-foreground">
          Inscribing
        </span>
      )}
    </span>
  );
}
