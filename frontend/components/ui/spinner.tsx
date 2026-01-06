import clsx from "clsx";
import { Loader2Icon } from "lucide-react";

function Spinner({
  className,
  ...props
}: React.ComponentProps<typeof Loader2Icon>) {
  return (
    <Loader2Icon
      aria-label="Loading"
      className={clsx("animate-spin", className)}
      role="status"
      {...props}
    />
  );
}

export { Spinner };
