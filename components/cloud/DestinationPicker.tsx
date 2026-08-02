"use client";

import { DESTINATIONS } from "@/lib/cloud/destinations";
import { Connections, DestinationId } from "@/lib/cloud/types";
import { DESTINATION_ICONS } from "./icons";

interface DestinationPickerProps {
  value: DestinationId;
  onChange: (id: DestinationId) => void;
  connections: Connections;
}

export function DestinationPicker({
  value,
  onChange,
  connections,
}: DestinationPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {DESTINATIONS.map((destination) => {
        const active = value === destination.id;
        const Icon = DESTINATION_ICONS[destination.id];
        const connection = connections[destination.id];
        return (
          <button
            key={destination.id}
            type="button"
            onClick={() => onChange(destination.id)}
            className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium ring-1 ring-inset transition-colors ${
              active
                ? "bg-slate-900 text-white ring-slate-900"
                : "bg-white text-slate-600 ring-slate-300 hover:bg-slate-50"
            }`}
          >
            <Icon
              className={`h-4 w-4 ${active ? "text-white" : "text-slate-400"}`}
            />
            {destination.name}
            {destination.connectable && (
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  connection?.connected
                    ? "bg-emerald-400"
                    : active
                      ? "bg-slate-500"
                      : "bg-slate-300"
                }`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
