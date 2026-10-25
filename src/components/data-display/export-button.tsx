"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ExportButtonProps {
  module: string;
}

export function ExportButton({ module }: ExportButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>
          <Button variant="outline" size="sm" disabled className="gap-2" aria-label={`Export ${module} (unavailable)`}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>GET /admin/export not implemented for {module}</p>
      </TooltipContent>
    </Tooltip>
  );
}
