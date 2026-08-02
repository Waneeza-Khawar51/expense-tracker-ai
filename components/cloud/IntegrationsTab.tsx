"use client";

import { useState } from "react";
import { useCloudExport } from "@/hooks/useCloudExport";
import { CONNECTABLE_DESTINATIONS } from "@/lib/cloud/destinations";
import { DestinationId } from "@/lib/cloud/types";
import { Button } from "@/components/ui/Button";
import { DESTINATION_ICONS } from "./icons";
import { StatusDot } from "./StatusDot";

interface IntegrationsTabProps {
  cloud: ReturnType<typeof useCloudExport>;
}

export function IntegrationsTab({ cloud }: IntegrationsTabProps) {
  const [connectingId, setConnectingId] = useState<DestinationId | null>(null);

  async function handleConnect(id: DestinationId) {
    setConnectingId(id);
    try {
      await cloud.connect(id);
    } finally {
      setConnectingId(null);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {CONNECTABLE_DESTINATIONS.map((destination) => {
        const Icon = DESTINATION_ICONS[destination.id];
        const connection = cloud.connections[destination.id];
        const isConnecting = connectingId === destination.id;

        return (
          <div
            key={destination.id}
            className="rounded-lg border border-slate-200 p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-md text-white"
                  style={{ backgroundColor: destination.color }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {destination.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {destination.description}
                  </p>
                </div>
              </div>
              <StatusDot
                active={connection.connected}
                label={connection.connected ? "Connected" : "Not connected"}
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                {connection.connected && connection.lastSyncedAt
                  ? `Last synced ${new Date(
                      connection.lastSyncedAt
                    ).toLocaleString("en-US")}`
                  : "Never synced"}
              </p>
              {connection.connected ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => cloud.disconnect(destination.id)}
                >
                  Disconnect
                </Button>
              ) : (
                <Button
                  size="sm"
                  disabled={isConnecting}
                  onClick={() => handleConnect(destination.id)}
                >
                  {isConnecting ? "Connecting…" : "Connect"}
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
