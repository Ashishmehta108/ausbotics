"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // import Skeleton

type SheetRow = {
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  status: string;
  callbackBooked: boolean;
  agentMessages: any[];
  data: string;
};

export function GoogleSheetDialog({
  workflowId,
  sheetUrl,
  open,
  setOpen,
}: {
  workflowId: string;
  sheetUrl?: string | null;
  open: boolean;
  setOpen: (val: boolean) => void;
}) {
  const [rows, setRows] = useState<SheetRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [sheetLink, setSheetLink] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      const fetchSheet = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("accessToken");
          const res = await fetch(
            `http://localhost:5000/api/workflows/${workflowId}/sheet`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const data = await res.json();
          setRows(data.data.fetchGooglesheetData || []);
          setSheetLink(data.data.sheetUrl || null);
        } catch (err) {
          console.error("Error fetching sheet:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchSheet();
    }
  }, [open, workflowId]);

  const skeletonRows = Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i}>
      <TableCell>
        <Skeleton className="h-4 w-24 bg-zinc-100 dark:bg-zinc-800" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-36 bg-zinc-100 dark:bg-zinc-800" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24 bg-zinc-100 dark:bg-zinc-800" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16 bg-zinc-100 dark:bg-zinc-800" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-12 bg-zinc-100 dark:bg-zinc-800" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-40 bg-zinc-100 dark:bg-zinc-800" />
      </TableCell>
    </TableRow>
  ));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Google Sheet Data</DialogTitle>
        </DialogHeader>

        {sheetUrl && (
          <Button asChild className="mb-4" variant="outline">
            <a href={sheetUrl} target="_blank" rel="noopener noreferrer">
              Open in Google Sheets
            </a>
          </Button>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Callback</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              skeletonRows
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No sheet data found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.leadName}</TableCell>
                  <TableCell>{row.leadEmail}</TableCell>
                  <TableCell>{row.leadPhone}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.callbackBooked ? "Yes" : "No"}</TableCell>
                  <TableCell>{row.data}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {!loading && rows.length > 0 && sheetLink && (
          <p className="mt-4 text-sm text-gray-500">
            Note: This data is a snapshot and may not reflect real-time updates.
          </p>
        )}
        {!loading && sheetLink && (
          <div className="bg-zinc-100 dark:bg-zinc-800 p-3 mt-4 rounded-full hover:underline max-w-max">
            <a href={sheetLink}>Google Sheet Link</a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
