"use client";

import { useState, useMemo, useCallback } from "react";
import { Card } from "./card";
import { SearchInput } from "./search-input";
import { EmptyState } from "./empty-state";
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from "lucide-react";
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
}

type SortDirection = "asc" | "desc" | null;

export function DataTable({
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
}: DataTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

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
    setPage(1);
  }, []);

  const handleFilter = useCallback((key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

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

  const showToolbar = searchable || filters.length > 0 || title || headerActions;

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
                <div key={j} className="h-4 bg-gray-200 rounded flex-1" />
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
        <div className="px-6 py-4 border-b border-gray-100 space-y-3">
          {(title || headerActions) && (
            <div className="flex items-center justify-between">
              {title && (
                <h3 className="text-sm font-semibold text-gray-900">
                  {title}
                  <span className="ml-2 text-xs font-normal text-gray-500">
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
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">{filter.label}: All</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {selectable && (
                <th className="px-6 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={paginatedData.length > 0 && selectedIds.size === paginatedData.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
              )}
              {columns.map((col) => {
                const isSortable = col.sortable !== false;
                return (
                  <th
                    key={col.key}
                    className={clsx(
                      "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                      isSortable && "cursor-pointer select-none hover:text-gray-700",
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
          <tbody className="divide-y divide-gray-200">
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
                      "hover:bg-gray-50 transition-colors",
                      onRowClick && "cursor-pointer",
                      selectedIds.has(globalIndex) && "bg-primary-50",
                    )}
                    onClick={() => onRowClick?.(item)}
                  >
                    {selectable && (
                      <td className="px-6 py-4 w-10" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(globalIndex)}
                          onChange={() => handleSelectRow(globalIndex, item)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap"
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
        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * pageSize + 1}–
            {Math.min(page * pageSize, processedData.length)} of{" "}
            {processedData.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600 px-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
