"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ReasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: (reason: string) => void | Promise<void>;
  loading?: boolean;
}

export function ReasonDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  onConfirm,
  loading,
}: ReasonDialogProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = async () => {
    if (reason.trim().length < 3) return;
    await onConfirm(reason.trim());
    setReason("");
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setReason("");
        onOpenChange(next);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        <div className="space-y-2">
          <Label htmlFor="reason">Reason</Label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            minLength={3}
            maxLength={500}
            className="flex w-full rounded-[18px] border border-input bg-background/50 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Enter a reason (min 3 characters)"
          />
          <p className="text-xs text-muted-foreground">{reason.length}/500</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            loading={loading}
            disabled={reason.trim().length < 3}
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
