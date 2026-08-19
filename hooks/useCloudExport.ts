"use client";

import { useCallback } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import { CONNECTABLE_DESTINATIONS } from "@/lib/cloud/destinations";
import {
  Connections,
  DestinationId,
  Frequency,
  HistoryEntry,
  ScheduledExport,
  ShareLink,
  TemplateId,
} from "@/lib/cloud/types";

const DEFAULT_CONNECTIONS: Connections = Object.fromEntries(
  CONNECTABLE_DESTINATIONS.map((d) => [d.id, { connected: false, lastSyncedAt: null }])
) as Connections;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function newId(): string {
  return crypto.randomUUID().slice(0, 8);
}

export function useCloudExport() {
  const [connections, setConnections] = useLocalStorageState<Connections>(
    "expense-tracker:cloud:connections",
    DEFAULT_CONNECTIONS
  );
  const [history, setHistory] = useLocalStorageState<HistoryEntry[]>(
    "expense-tracker:cloud:history",
    []
  );
  const [schedules, setSchedules] = useLocalStorageState<ScheduledExport[]>(
    "expense-tracker:cloud:schedules",
    []
  );
  const [shareLinks, setShareLinks] = useLocalStorageState<ShareLink[]>(
    "expense-tracker:cloud:share-links",
    []
  );

  const connect = useCallback(
    async (destinationId: DestinationId) => {
      await delay(1100);
      setConnections((prev) => ({
        ...prev,
        [destinationId]: {
          connected: true,
          lastSyncedAt: new Date().toISOString(),
        },
      }));
    },
    [setConnections]
  );

  const disconnect = useCallback(
    (destinationId: DestinationId) => {
      setConnections((prev) => ({
        ...prev,
        [destinationId]: { connected: false, lastSyncedAt: null },
      }));
    },
    [setConnections]
  );

  const markSynced = useCallback(
    (destinationId: DestinationId) => {
      setConnections((prev) => ({
        ...prev,
        [destinationId]: {
          ...prev[destinationId],
          lastSyncedAt: new Date().toISOString(),
        },
      }));
    },
    [setConnections]
  );

  const logHistory = useCallback(
    (entry: Omit<HistoryEntry, "id" | "timestamp">) => {
      setHistory((prev) => [
        {
          ...entry,
          id: newId(),
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
    },
    [setHistory]
  );

  const clearHistory = useCallback(() => setHistory([]), [setHistory]);

  const addSchedule = useCallback(
    (templateId: TemplateId, destinationId: DestinationId, frequency: Frequency) => {
      setSchedules((prev) => [
        {
          id: newId(),
          templateId,
          destinationId,
          frequency,
          active: true,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    },
    [setSchedules]
  );

  const toggleSchedule = useCallback(
    (id: string) => {
      setSchedules((prev) =>
        prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
      );
    },
    [setSchedules]
  );

  const removeSchedule = useCallback(
    (id: string) => {
      setSchedules((prev) => prev.filter((s) => s.id !== id));
    },
    [setSchedules]
  );

  const createShareLink = useCallback(
    (templateId: TemplateId, expiresLabel: string) => {
      const link: ShareLink = {
        id: newId(),
        templateId,
        url: `https://share.example.com/exp/${newId()}`,
        expiresLabel,
        createdAt: new Date().toISOString(),
        revoked: false,
      };
      setShareLinks((prev) => [link, ...prev]);
      return link;
    },
    [setShareLinks]
  );

  const revokeShareLink = useCallback(
    (id: string) => {
      setShareLinks((prev) =>
        prev.map((l) => (l.id === id ? { ...l, revoked: true } : l))
      );
    },
    [setShareLinks]
  );

  return {
    connections,
    connect,
    disconnect,
    markSynced,
    history,
    logHistory,
    clearHistory,
    schedules,
    addSchedule,
    toggleSchedule,
    removeSchedule,
    shareLinks,
    createShareLink,
    revokeShareLink,
  };
}
