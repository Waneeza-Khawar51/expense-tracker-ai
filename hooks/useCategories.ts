"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CATEGORY_COLOR_PALETTE,
  Category,
  DEFAULT_CATEGORIES,
  DEFAULT_CATEGORY_COLORS,
} from "@/lib/types";

const STORAGE_KEY = "expense-tracker:categories";

interface StoredCategory {
  name: Category;
  color: string;
}

function defaultCategories(): StoredCategory[] {
  return DEFAULT_CATEGORIES.map((name) => ({
    name,
    color: DEFAULT_CATEGORY_COLORS[name],
  }));
}

function loadCategories(): StoredCategory[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultCategories();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return defaultCategories();
    return parsed;
  } catch {
    return defaultCategories();
  }
}

function saveCategories(categories: StoredCategory[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
}

export function useCategories() {
  const [categories, setCategories] = useState<StoredCategory[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCategories(loadCategories());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveCategories(categories);
    }
  }, [categories, isLoaded]);

  const addCategory = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return null;

      const existing = categories.find(
        (c) => c.name.toLowerCase() === trimmed.toLowerCase()
      );
      if (existing) return existing.name;

      const color =
        CATEGORY_COLOR_PALETTE[categories.length % CATEGORY_COLOR_PALETTE.length];
      setCategories((prev) => {
        if (prev.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
          return prev;
        }
        return [...prev, { name: trimmed, color }];
      });
      return trimmed;
    },
    [categories]
  );

  const categoryNames = useMemo(() => categories.map((c) => c.name), [categories]);

  const categoryColors = useMemo(
    () =>
      categories.reduce<Record<string, string>>((acc, c) => {
        acc[c.name] = c.color;
        return acc;
      }, {}),
    [categories]
  );

  return { categories: categoryNames, categoryColors, addCategory, isLoaded };
}
