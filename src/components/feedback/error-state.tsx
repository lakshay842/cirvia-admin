import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  requestId?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this section. Please try again.",
  requestId,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "glass flex flex-col items-center justify-center rounded-3xl px-6 py-16 text-center",
        className,
      )}
      role="alert"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertCircle className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{message}</p>
      {requestId && (
        <p className="mt-2 text-xs text-muted-foreground">Request ID: {requestId}</p>
      )}
      <div className="mt-6 flex gap-3">
        {onRetry && (
          <Button onClick={onRetry} variant="default">
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
        )}
        <Button variant="outline" asChild>
          <a href="mailto:support@cirvia.com">Contact support</a>
        </Button>
      </div>
    </div>
  );
}
