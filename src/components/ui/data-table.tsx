"use client";

import { useState, useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Card } from "./card";
import { SearchInput } from "./search-input";
import { EmptyState } from "./empty-state";
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { exportToCSV } from "@/lib/csv-export";
import { clsx } from "clsx";

interface Column {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: any) => React.ReactNode;
}

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  onRowClick?: (item: any) => void;
  selectable?: boolean;
  onSelectionChange?: (selectedItems: any[]) => void;
  pageSize?: number;
  loading?: boolean;
  title?: string;
  headerActions?: React.ReactNode;
  exportable?: boolean;
  exportFilename?: string;
  urlPersist?: boolean;
}

type SortDirection = "asc" | "desc" | null;

function DataTableInner({
  columns,
  data,
  emptyMessage = "No data available",
  emptyIcon,
  emptyActionLabel,
  onEmptyAction,
  searchable = false,
  searchPlaceholder = "Search...",
  filters = [],
  onRowClick,
  selectable = false,
  onSelectionChange,
  pageSize = 25,
  loading = false,
  title,
  headerActions,
  exportable = false,
  exportFilename = "export",
  urlPersist = false,
}: DataTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [localSearch, setLocalSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);
  const [localFilterValues, setLocalFilterValues] = useState<Record<string, string>>({});
  const [localPage, setLocalPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const updateURL = useCallback(
    (updates: Record<string, string | null>) => {
      if (!urlPersist) return;
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [urlPersist, searchParams, router, pathname],
  );

  const search = urlPersist ? (searchParams.get("q") ?? "") : localSearch;
  const page = urlPersist ? (parseInt(searchParams.get("page") ?? "1", 10) || 1) : localPage;

  const filterValues = useMemo(() => {
    if (!urlPersist) return localFilterValues;
    const result: Record<string, string> = {};
    filters.forEach((f) => {
      const v = searchParams.get(f.key);
      if (v) result[f.key] = v;
    });
    return result;
  }, [urlPersist, searchParams, localFilterValues, filters]);

  const handleSort = useCallback((key: string) => {
    setSortKey((prev) => {
      if (prev === key) {
        setSortDir((d) => {
          if (d === "asc") return "desc";
          if (d === "desc") { setSortKey(null); return null; }
          return "asc";
        });
        return key;
      }
      setSortDir("asc");
      return key;
    });
    if (urlPersist) {
      updateURL({ page: null });
    } else {
      setLocalPage(1);
    }
  }, [urlPersist, updateURL]);

  const handleFilter = useCallback((key: string, value: string) => {
    if (urlPersist) {
      updateURL({ [key]: value === "all" ? null : value, page: null });
    } else {
      setLocalFilterValues((prev) => ({ ...prev, [key]: value }));
      setLocalPage(1);
    }
  }, [urlPersist, updateURL]);

  const handleSearch = useCallback((value: string) => {
    if (urlPersist) {
      updateURL({ q: value || null, page: null });
    } else {
      setLocalSearch(value);
      setLocalPage(1);
    }
  }, [urlPersist, updateURL]);

  const handleSetPage = useCallback((updater: number | ((prev: number) => number)) => {
    if (urlPersist) {
      const currentPage = parseInt(searchParams.get("page") ?? "1", 10) || 1;
      const next = typeof updater === "function" ? updater(currentPage) : updater;
      updateURL({ page: next <= 1 ? null : String(next) });
    } else {
      setLocalPage(updater);
    }
  }, [urlPersist, updateURL, searchParams]);

  const processedData = useMemo(() => {
    let result = [...data];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((item) =>
        columns.some((col) => {
          const val = item[col.key];
          if (val == null) return false;
          return String(val).toLowerCase().includes(q);
        }),
      );
    }

    for (const [key, value] of Object.entries(filterValues)) {
      if (value && value !== "" && value !== "all") {
        result = result.filter((item) => {
          const itemVal = item[key];
          if (itemVal == null) return false;
          return String(itemVal).toLowerCase() === value.toLowerCase();
        });
      }
    }

    if (sortKey && sortDir) {
      result.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDir === "asc" ? aVal - bVal : bVal - aVal;
        }
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        if (aStr < bStr) return sortDir === "asc" ? -1 : 1;
        if (aStr > bStr) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, search, filterValues, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(processedData.length / pageSize));
  const paginatedData = processedData.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === paginatedData.length) {
      setSelectedIds(new Set());
      onSelectionChange?.([]);
    } else {
      const all = new Set(paginatedData.map((_, i) => (page - 1) * pageSize + i));
      setSelectedIds(all);
      onSelectionChange?.(paginatedData);
    }
  }, [selectedIds.size, paginatedData, page, pageSize, onSelectionChange]);

  const handleSelectRow = useCallback((globalIndex: number, item: any) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(globalIndex)) {
        next.delete(globalIndex);
      } else {
        next.add(globalIndex);
      }
      const selected = processedData.filter((_, i) => next.has(i));
      onSelectionChange?.(selected);
      return next;
    });
  }, [processedData, onSelectionChange]);

  const handleExport = useCallback(() => {
    exportToCSV(
      columns.map((col) => ({ key: col.key, header: col.header })),
      processedData,
      exportFilename,
    );
  }, [columns, processedData, exportFilename]);

  const showToolbar = searchable || filters.length > 0 || title || headerActions || exportable;

  const renderSortIcon = (col: Column) => {
    if (col.sortable === false) return null;
    if (sortKey === col.key) {
      if (sortDir === "asc") return <ChevronUp className="w-4 h-4 ml-1 inline" />;
      if (sortDir === "desc") return <ChevronDown className="w-4 h-4 ml-1 inline" />;
    }
    return <ChevronsUpDown className="w-3 h-3 ml-1 inline opacity-40" />;
  };

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <div className="p-6 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse flex gap-4">
              {columns.map((_, j) => (
                <div key={j} className="h-4 bg-muted rounded flex-1" />
              ))}
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {showToolbar && (
        <div className="px-6 py-4 border-b border-border space-y-3">
          {(title || headerActions) && (
            <div className="flex items-center justify-between">
              {title && (
                <h3 className="text-sm font-semibold text-foreground">
                  {title}
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    ({processedData.length} {processedData.length === 1 ? "record" : "records"})
                  </span>
                </h3>
              )}
              {headerActions && <div className="flex gap-2">{headerActions}</div>}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3">
            {searchable && (
              <div className="w-64">
                <SearchInput
                  value={search}
                  onChange={handleSearch}
                  placeholder={searchPlaceholder}
                />
              </div>
            )}
            {filters.map((filter) => (
              <select
                key={filter.key}
                value={filterValues[filter.key] || "all"}
                onChange={(e) => handleFilter(filter.key, e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">{filter.label}: All</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ))}
            {exportable && (
              <button
                onClick={handleExport}
                className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <Download className="w-4 h-4" />
                Download CSV
              </button>
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted">
              {selectable && (
                <th className="px-6 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={paginatedData.length > 0 && selectedIds.size === paginatedData.length}
                    onChange={handleSelectAll}
                    className="rounded border-border text-primary-600 focus:ring-primary-500"
                  />
                </th>
              )}
              {columns.map((col) => {
                const isSortable = col.sortable !== false;
                return (
                  <th
                    key={col.key}
                    className={clsx(
                      "px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider",
                      isSortable && "cursor-pointer select-none hover:text-foreground",
                    )}
                    onClick={isSortable ? () => handleSort(col.key) : undefined}
                  >
                    {col.header}
                    {isSortable && renderSortIcon(col)}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)}>
                  <EmptyState
                    icon={emptyIcon}
                    title={emptyMessage}
                    actionLabel={emptyActionLabel}
                    onAction={onEmptyAction}
                  />
                </td>
              </tr>
            ) : (
              paginatedData.map((item, localIndex) => {
                const globalIndex = (page - 1) * pageSize + localIndex;
                return (
                  <tr
                    key={localIndex}
                    className={clsx(
                      "hover:bg-muted transition-colors",
                      onRowClick && "cursor-pointer",
                      selectedIds.has(globalIndex) && "bg-primary-50 dark:bg-primary-900/30",
                    )}
                    onClick={() => onRowClick?.(item)}
                  >
                    {selectable && (
                      <td className="px-6 py-4 w-10" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(globalIndex)}
                          onChange={() => handleSelectRow(globalIndex, item)}
                          className="rounded border-border text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-6 py-4 text-sm text-foreground whitespace-nowrap"
                      >
                        {col.render
                          ? col.render(item)
                          : (item[col.key] as React.ReactNode)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {processedData.length > pageSize && (
        <div className="px-6 py-3 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * pageSize + 1}–
            {Math.min(page * pageSize, processedData.length)} of{" "}
            {processedData.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSetPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-muted-foreground px-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handleSetPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}

export function DataTable(props: DataTableProps) {
  return (
    <Suspense fallback={
      <Card className="overflow-hidden">
        <div className="p-6 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse flex gap-4">
              {props.columns.map((_, j) => (
                <div key={j} className="h-4 bg-muted rounded flex-1" />
              ))}
            </div>
          ))}
        </div>
      </Card>
    }>
      <DataTableInner {...props} />
    </Suspense>
  );
}
