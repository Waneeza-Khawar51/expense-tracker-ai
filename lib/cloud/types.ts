export type TemplateId =
  | "detailed"
  | "tax-report"
  | "monthly-summary"
  | "category-analysis";

export type DestinationId =
  | "download"
  | "email"
  | "google-sheets"
  | "dropbox"
  | "onedrive";

export type Frequency = "daily" | "weekly" | "monthly";

export interface TemplateResult {
  headers: string[];
  rows: string[][];
}

export interface ExportTemplateMeta {
  id: TemplateId;
  name: string;
  description: string;
}

export interface DestinationMeta {
  id: DestinationId;
  name: string;
  description: string;
  color: string;
  connectable: boolean;
}

export interface ConnectionState {
  connected: boolean;
  lastSyncedAt: string | null;
}

export type Connections = Record<DestinationId, ConnectionState>;

export interface HistoryEntry {
  id: string;
  timestamp: string;
  templateId: TemplateId;
  destinationId: DestinationId;
  recordCount: number;
  detail: string;
}

export interface ScheduledExport {
  id: string;
  templateId: TemplateId;
  destinationId: DestinationId;
  frequency: Frequency;
  active: boolean;
  createdAt: string;
}

export interface ShareLink {
  id: string;
  templateId: TemplateId;
  url: string;
  expiresLabel: string;
  createdAt: string;
  revoked: boolean;
}
