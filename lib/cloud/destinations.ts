import { DestinationMeta } from "./types";

export const DESTINATIONS: DestinationMeta[] = [
  {
    id: "download",
    name: "Download",
    description: "Save a file to this device",
    color: "#475569",
    connectable: false,
  },
  {
    id: "email",
    name: "Email",
    description: "Send as an attachment",
    color: "#0ea5e9",
    connectable: false,
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    description: "Push rows into a spreadsheet",
    color: "#16a34a",
    connectable: true,
  },
  {
    id: "dropbox",
    name: "Dropbox",
    description: "Sync a copy to your Dropbox",
    color: "#2563eb",
    connectable: true,
  },
  {
    id: "onedrive",
    name: "OneDrive",
    description: "Sync a copy to OneDrive",
    color: "#0891b2",
    connectable: true,
  },
];

export const CONNECTABLE_DESTINATIONS = DESTINATIONS.filter(
  (d) => d.connectable
);

export function getDestination(id: string): DestinationMeta {
  const destination = DESTINATIONS.find((d) => d.id === id);
  if (!destination) throw new Error(`Unknown destination: ${id}`);
  return destination;
}
