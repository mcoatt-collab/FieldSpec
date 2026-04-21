"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { tokens } from "@/lib/design-tokens";
import type { Project } from "./mockData";

interface RecentProjectsTableProps {
  projects: Project[];
}

type StatusFilter = "all" | "draft" | "report_generated" | "exported";
type DateSort = "newest" | "oldest";

export function RecentProjectsTable({ projects }: RecentProjectsTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateSort, setDateSort] = useState<DateSort>("newest");

  const hasActiveFilters = statusFilter !== "all" || searchQuery !== "";

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(query));
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateSort === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [projects, statusFilter, searchQuery, dateSort]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  const getStatusBadge = (status: Project["status"]) => {
    const styles = {
      draft: {
        bg: tokens.colors.surfaceVariant,
        color: tokens.colors.onSurfaceVariant,
        label: "Draft",
      },
      report_generated: {
        bg: "#fef3c7",
        color: "#92400e",
        label: "Processing",
      },
      exported: {
        bg: "#d1fae5",
        color: "#065f46",
        label: "Completed",
      },
    };

    const style = styles[status] || styles.draft;

    return (
      <span
        className="inline-flex items-center px-sm py-xs rounded-pill text-label-small"
        style={{
          backgroundColor: style.bg,
          color: style.color,
        }}
      >
        {style.label}
      </span>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const statusTabs: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "report_generated", label: "Processing" },
    { value: "exported", label: "Completed" },
    { value: "draft", label: "Draft" },
  ];

  return (
    <div>
      <div className="flex items-center gap-sm mb-md">
        <span
          className="material-icons"
          style={{ fontSize: "20px", color: tokens.colors.secondary }}
        >
          folder
        </span>
        <span
          className="text-label-large"
          style={{ color: tokens.colors.onSurface }}
        >
          Recent Projects
        </span>
        <span
          className="ml-auto text-label-medium"
          style={{ color: tokens.colors.onSurfaceVariant }}
        >
          {filteredProjects.length} projects
        </span>
      </div>

      <div
        className="rounded-xl border overflow-hidden"
        style={{
          backgroundColor: tokens.colors.surface,
          borderColor: tokens.colors.outlineVariant,
        }}
      >
        <div
          className="px-md py-sm border-b flex flex-wrap items-center gap-md"
          style={{ borderColor: tokens.colors.outlineVariant }}
        >
          <div className="flex items-center gap-xs flex-1 min-w-[200px]">
            <span
              className="material-icons"
              style={{ fontSize: "20px", color: tokens.colors.onSurfaceVariant }}
            >
              search
            </span>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-body-medium"
              style={{ color: tokens.colors.onSurface }}
            />
          </div>

          <div className="flex items-center gap-sm">
            <select
              value={dateSort}
              onChange={(e) => setDateSort(e.target.value as DateSort)}
              className="px-sm py-xs rounded-md text-label-medium outline-none cursor-pointer"
              style={{
                backgroundColor: tokens.colors.surfaceVariant,
                color: tokens.colors.onSurfaceVariant,
                border: "none",
              }}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        <div
          className="px-md py-sm flex items-center gap-xs border-b overflow-x-auto"
          style={{
            borderColor: tokens.colors.outlineVariant,
            backgroundColor: tokens.colors.surfaceContainerLow,
          }}
        >
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className="px-md py-xs rounded-md text-label-medium whitespace-nowrap transition-colors cursor-pointer"
              style={{
                backgroundColor:
                  statusFilter === tab.value
                    ? tokens.colors.primaryContainer
                    : "transparent",
                color:
                  statusFilter === tab.value
                    ? tokens.colors.onPrimaryContainer
                    : tokens.colors.onSurfaceVariant,
                border: "none",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          {filteredProjects.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr
                  style={{ backgroundColor: tokens.colors.surfaceVariant }}
                >
                  <th
                    className="px-md py-sm text-left text-label-medium"
                    style={{ color: tokens.colors.onSurfaceVariant }}
                  >
                    Name
                  </th>
                  <th
                    className="px-md py-sm text-left text-label-medium"
                    style={{ color: tokens.colors.onSurfaceVariant }}
                  >
                    Images
                  </th>
                  <th
                    className="px-md py-sm text-left text-label-medium"
                    style={{ color: tokens.colors.onSurfaceVariant }}
                  >
                    Status
                  </th>
                  <th
                    className="px-md py-sm text-left text-label-medium"
                    style={{ color: tokens.colors.onSurfaceVariant }}
                  >
                    Date
                  </th>
                  <th className="px-md py-sm w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project, index) => (
                  <tr
                    key={project.id}
                    className="cursor-pointer transition-colors hover:bg-black/5"
                    style={{
                      borderTop:
                        index > 0
                          ? `1px solid ${tokens.colors.outlineVariant}`
                          : "none",
                    }}
                    onClick={() =>
                      router.push(`/dashboard/projects?id=${project.id}`)
                    }
                  >
                    <td className="px-md py-md">
                      <span
                        className="text-label-large"
                        style={{ color: tokens.colors.onSurface }}
                      >
                        {project.name}
                      </span>
                      {project.clientName && (
                        <span
                          className="block text-body-small mt-xs"
                          style={{ color: tokens.colors.onSurfaceVariant }}
                        >
                          {project.clientName}
                        </span>
                      )}
                    </td>
                    <td className="px-md py-md">
                      <div className="flex items-center gap-xs">
                        <span
                          className="material-icons"
                          style={{
                            fontSize: "16px",
                            color: tokens.colors.onSurfaceVariant,
                          }}
                        >
                          photo_library
                        </span>
                        <span
                          className="text-body-medium"
                          style={{ color: tokens.colors.onSurface }}
                        >
                          {project.imageCount}
                        </span>
                      </div>
                    </td>
                    <td className="px-md py-md">
                      {getStatusBadge(project.status)}
                    </td>
                    <td className="px-md py-md">
                      <span
                        className="text-body-medium"
                        style={{ color: tokens.colors.onSurfaceVariant }}
                      >
                        {formatDate(project.createdAt)}
                      </span>
                    </td>
                    <td className="px-md py-md text-right">
                      <span
                        className="material-icons"
                        style={{
                          fontSize: "20px",
                          color: tokens.colors.onSurfaceVariant,
                        }}
                      >
                        chevron_right
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-xl px-md">
              <span
                className="material-icons mb-md"
                style={{ fontSize: "48px", color: tokens.colors.onSurfaceVariant }}
              >
                search_off
              </span>
              <p
                className="text-body-medium mb-md"
                style={{ color: tokens.colors.onSurfaceVariant }}
              >
                No projects found
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-md py-xs rounded-md text-label-medium cursor-pointer"
                  style={{
                    backgroundColor: tokens.colors.primaryContainer,
                    color: tokens.colors.onPrimaryContainer,
                    border: "none",
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}