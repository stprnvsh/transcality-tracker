"use client";

import type { Attachment } from "@prisma/client";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";

interface FileUploadProps {
  ticketId: string;
  attachments: Attachment[];
}

export function FileUpload({ ticketId, attachments: initialAttachments }: FileUploadProps) {
  const [attachments, setAttachments] = useState(initialAttachments);
  const [isUploading, setUploading] = useState(false);

  const onFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Files must be under 10MB");
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("ticketId", ticketId);
      setUploading(true);
      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });
        if (!response.ok) {
          throw new Error("Upload failed");
        }
        const { attachment } = await response.json();
        setAttachments((prev) => [...prev, attachment]);
        toast.success("Attachment uploaded");
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setUploading(false);
      }
    },
    [ticketId]
  );

  return (
    <div className="space-y-4 text-sm">
      <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 transition hover:border-brand hover:text-brand dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
        <span className="text-center">
          Drag & drop or click to upload
          <br />
          <span className="text-xs">Maximum file size: 10MB</span>
        </span>
        <input type="file" className="hidden" onChange={onFileChange} disabled={isUploading} />
      </label>
      <ul className="space-y-2">
        {attachments.map((attachment) => (
          <li key={attachment.id} className="flex items-center justify-between rounded-md bg-slate-100 px-3 py-2 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <a href={attachment.url} download className="truncate hover:text-brand">
              {attachment.filename}
            </a>
            <span>{new Date(attachment.createdAt).toLocaleDateString()}</span>
          </li>
        ))}
        {attachments.length === 0 && <p className="text-slate-500">No attachments yet.</p>}
      </ul>
    </div>
  );
}
