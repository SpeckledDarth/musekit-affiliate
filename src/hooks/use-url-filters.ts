"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useURLFilters(defaults?: Record<string, string>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const search = searchParams.get("q") ?? defaults?.q ?? "";
  const page = parseInt(searchParams.get("page") ?? "1", 10) || 1;

  const filters = useMemo(() => {
    const result: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key !== "q" && key !== "page") {
        result[key] = value;
      }
    });
    if (defaults) {
      for (const [k, v] of Object.entries(defaults)) {
        if (k !== "q" && k !== "page" && !(k in result)) {
          result[k] = v;
        }
      }
    }
    return result;
  }, [searchParams, defaults]);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "" || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const setSearch = useCallback(
    (value: string) => {
      updateParams({ q: value, page: null });
    },
    [updateParams],
  );

  const setFilter = useCallback(
    (key: string, value: string) => {
      updateParams({ [key]: value, page: null });
    },
    [updateParams],
  );

  const setPage = useCallback(
    (p: number) => {
      updateParams({ page: p <= 1 ? null : String(p) });
    },
    [updateParams],
  );

  return { search, filters, page, setSearch, setFilter, setPage };
}
