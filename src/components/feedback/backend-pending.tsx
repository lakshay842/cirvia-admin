import { Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface BackendPendingProps {
  title: string;
  description: string;
  endpoints?: string[];
  note?: string;
}

export function BackendPending({ title, description, endpoints, note }: BackendPendingProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-warning/10 text-warning">
          <Construction className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground">{description}</p>
        {endpoints && endpoints.length > 0 && (
          <ul className="mt-4 space-y-1 text-left text-xs text-muted-foreground">
            {endpoints.map((ep) => (
              <li key={ep}>
                <code>{ep}</code>
              </li>
            ))}
          </ul>
        )}
        {note && <p className="mt-4 text-xs text-muted-foreground">{note}</p>}
      </CardContent>
    </Card>
  );
}
