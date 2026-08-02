"use client";

import { useState } from "react";
import { useCloudExport } from "@/hooks/useCloudExport";
import { EXPORT_TEMPLATES } from "@/lib/cloud/templates";
import { TemplateId } from "@/lib/cloud/types";
import { Button } from "@/components/ui/Button";
import { ShareLinkQr } from "./ShareLinkQr";

const EXPIRY_OPTIONS = ["7 days", "30 days", "Never"];

const selectClasses =
  "block w-full rounded-lg border-0 py-2 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-violet-600 text-sm";

interface ShareTabProps {
  cloud: ReturnType<typeof useCloudExport>;
}

export function ShareTab({ cloud }: ShareTabProps) {
  const [templateId, setTemplateId] = useState<TemplateId>("detailed");
  const [expiry, setExpiry] = useState(EXPIRY_OPTIONS[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleCopy(url: string, id: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(
        () => setCopiedId((current) => (current === id ? null : current)),
        1500
      );
    } catch {
      // Clipboard API unavailable — copy silently fails, link is still selectable.
    }
  }

  const activeLinks = cloud.shareLinks.filter((l) => !l.revoked);
  const revokedLinks = cloud.shareLinks.filter((l) => l.revoked);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">
          Create a share link
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Template
            </label>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value as TemplateId)}
              className={selectClasses}
            >
              {EXPORT_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Expires
            </label>
            <select
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className={selectClasses}
            >
              {EXPIRY_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Button
          className="mt-3"
          onClick={() => cloud.createShareLink(templateId, expiry)}
        >
          Generate link
        </Button>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold text-slate-700">
          Shared links
        </h3>
        {activeLinks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 py-8 text-center text-sm text-slate-400">
            No active share links yet.
          </div>
        ) : (
          <div className="space-y-3">
            {activeLinks.map((link) => {
              const template = EXPORT_TEMPLATES.find(
                (t) => t.id === link.templateId
              )!;
              return (
                <div
                  key={link.id}
                  className="flex items-center gap-4 rounded-lg border border-slate-200 p-3"
                >
                  <ShareLinkQr url={link.url} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800">
                      {template.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-violet-600">
                      {link.url}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Expires: {link.expiresLabel} &middot; Created{" "}
                      {new Date(link.createdAt).toLocaleDateString("en-US")}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(link.url, link.id)}
                        className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
                      >
                        {copiedId === link.id ? "Copied!" : "Copy link"}
                      </button>
                      <button
                        onClick={() => cloud.revokeShareLink(link.id)}
                        className="rounded-md px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Revoke
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {revokedLinks.length > 0 && (
          <div className="mt-3 space-y-1">
            {revokedLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-400"
              >
                <span className="truncate">{link.url}</span>
                <span className="rounded-full bg-slate-200 px-2 py-0.5 font-medium text-slate-500">
                  Revoked
                </span>
              </div>
            ))}
          </div>
        )}

        <p className="mt-3 text-xs text-slate-400">
          Demo mode — this link isn&apos;t publicly reachable. In a hosted
          deployment it would open a read-only, permissioned view of this
          export.
        </p>
      </section>
    </div>
  );
}
