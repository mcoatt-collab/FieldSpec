"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { tokens } from "@/lib/design-tokens";
import type { Project } from "./mockData";

interface RecentProjectsSectionProps {
  projects: Project[];
}

type ViewMode = "table" | "card";
type StatusFilter = "all" | "draft" | "report_generated" | "exported";
type DateSort = "newest" | "oldest";

export function RecentProjectsSection({ projects }: RecentProjectsSectionProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateSort, setDateSort] = useState<DateSort>("newest");
  const [hoveredTableIndex, setHoveredTableIndex] = useState<number | null>(null);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [searchHovered, setSearchHovered] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [sortHovered, setSortHovered] = useState(false);
  const [sortFocused, setSortFocused] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

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
        className="inline-flex items-center"
        style={{
          backgroundColor: style.bg,
          color: style.color,
          paddingLeft: tokens.spacing.sm,
          paddingRight: tokens.spacing.sm,
          paddingTop: tokens.spacing.xs,
          paddingBottom: tokens.spacing.xs,
          borderRadius: tokens.radius.pill,
          fontSize: tokens.typography.labelSmall.fontSize,
          fontWeight: tokens.typography.labelSmall.fontWeight,
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

  const viewOptions: { value: ViewMode; label: string; icon: string }[] = [
    { value: "table", label: "Table", icon: "view_list" },
    { value: "card", label: "Card", icon: "grid_view" },
  ];

  const renderFilters = () => (
    <div
      style={{
        paddingLeft: tokens.spacing.md,
        paddingRight: tokens.spacing.md,
        paddingTop: tokens.spacing.sm,
        paddingBottom: tokens.spacing.sm,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
    >
      <div
        className="flex items-center gap-xs rounded-md border flex-1 min-w-[300px] max-w-sm"
        onMouseEnter={() => setSearchHovered(true)}
        onMouseLeave={() => setSearchHovered(false)}
        style={{
          backgroundColor: tokens.colors.surfaceContainerLow,
          borderColor: searchHovered || searchFocused ? tokens.colors.outline : tokens.colors.outlineVariant,
          borderWidth: "1px",
          borderStyle: "solid",
          borderRadius: tokens.radius.md,
          paddingLeft: tokens.spacing.sm,
          paddingRight: tokens.spacing.md,
          paddingTop: tokens.spacing.xs,
          paddingBottom: tokens.spacing.xs,
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          boxShadow: searchFocused ? `0 0 0 2px ${tokens.colors.outlineVariant}` : "none",
        }}
      >
        <span
          className="material-icons"
          style={{ fontSize: tokens.typography.titleMedium.fontSize, color: tokens.colors.onSurfaceVariant }}
        >
          search
        </span>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="flex-1 bg-transparent border-0 text-body-medium"
          style={{ 
            color: tokens.colors.onSurface, 
            outline: 'none', 
            boxShadow: 'none',
            width: '100%',
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="rounded-full cursor-pointer"
            style={{
              border: "none", 
              background: "transparent",
              padding: tokens.spacing.xs,
            }}
          >
            <span
              className="material-icons"
              style={{ fontSize: tokens.typography.titleMedium.fontSize, color: tokens.colors.onSurfaceVariant }}
            >
              close
            </span>
          </button>
        )}
      </div>

<div
        className="flex items-center gap-xs rounded-md border"
        onMouseEnter={() => setSortHovered(true)}
        onMouseLeave={() => setSortHovered(false)}
        onClick={() => setSortOpen(!sortOpen)}
        style={{
          position: "relative",
          backgroundColor: tokens.colors.surfaceContainerLow,
          borderColor: sortHovered || sortFocused || sortOpen ? tokens.colors.outline : tokens.colors.outlineVariant,
          borderWidth: "1px",
          borderStyle: "solid",
          borderRadius: tokens.radius.md,
          paddingLeft: tokens.spacing.md,
          paddingRight: tokens.spacing.md,
          paddingTop: tokens.spacing.xs,
          paddingBottom: tokens.spacing.xs,
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          boxShadow: sortFocused || sortOpen ? `0 0 0 2px ${tokens.colors.outlineVariant}` : "none",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <span
          className="text-label-medium"
          style={{
            color: tokens.colors.onSurfaceVariant,
            flex: 1,
          }}
        >
          {dateSort === "newest" ? "Newest" : "Oldest"}
        </span>
        <span
          className="material-icons"
          style={{
            fontSize: tokens.typography.titleMedium.fontSize,
            color: tokens.colors.onSurfaceVariant,
            transition: "transform 0.2s ease",
            transform: sortOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          expand_more
        </span>
        {sortOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              marginTop: tokens.spacing.xs,
              backgroundColor: tokens.colors.surface,
              borderColor: tokens.colors.outlineVariant,
              borderWidth: "1px",
              borderStyle: "solid",
              borderRadius: tokens.radius.md,
              boxShadow: tokens.elevation.level2,
              overflow: "hidden",
              zIndex: 100,
            }}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                setDateSort("newest");
                setSortOpen(false);
                setSortFocused(false);
              }}
              style={{
                padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                backgroundColor: dateSort === "newest" ? tokens.colors.primaryContainer : "transparent",
                color: dateSort === "newest" ? tokens.colors.onPrimaryContainer : tokens.colors.onSurfaceVariant,
                transition: "background-color 0.15s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                if (dateSort !== "newest") {
                  e.currentTarget.style.backgroundColor = tokens.colors.surfaceContainerHigh;
                }
              }}
              onMouseLeave={(e) => {
                if (dateSort !== "newest") {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              Newest
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setDateSort("oldest");
                setSortOpen(false);
                setSortFocused(false);
              }}
              style={{
                padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                backgroundColor: dateSort === "oldest" ? tokens.colors.primaryContainer : "transparent",
                color: dateSort === "oldest" ? tokens.colors.onPrimaryContainer : tokens.colors.onSurfaceVariant,
                transition: "background-color 0.15s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                if (dateSort !== "oldest") {
                  e.currentTarget.style.backgroundColor = tokens.colors.surfaceContainerHigh;
                }
              }}
              onMouseLeave={(e) => {
                if (dateSort !== "oldest") {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              Oldest
            </div>
          </div>
        )}
      </div>
      {sortOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50,
          }}
          onClick={() => {
            setSortOpen(false);
            setSortFocused(false);
          }}
        />
      )}
    </div>
  );

  const renderStatusTabs = () => (
    <div
      style={{
        paddingLeft: tokens.spacing.md,
        paddingRight: tokens.spacing.md,
        paddingTop: tokens.spacing.sm,
        paddingBottom: tokens.spacing.sm,
        display: "flex",
        alignItems: "center",
        gap: tokens.spacing.xs,
        borderBottomWidth: "1px",
        borderBottomStyle: "solid",
        borderBottomColor: tokens.colors.outlineVariant,
        backgroundColor: tokens.colors.surfaceContainerLow,
        overflowX: "auto",
      }}
    >
      {statusTabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setStatusFilter(tab.value)}
          className="whitespace-nowrap transition-colors cursor-pointer"
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
            paddingLeft: tokens.spacing.md,
            paddingRight: tokens.spacing.md,
            paddingTop: tokens.spacing.xs,
            paddingBottom: tokens.spacing.xs,
            borderRadius: tokens.radius.md,
            fontSize: tokens.typography.labelMedium.fontSize,
            fontWeight: tokens.typography.labelMedium.fontWeight,
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div style={{ overflowX: "auto" }}>
      {filteredProjects.length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: tokens.colors.surfaceVariant }}>
              <th
                style={{ 
                  paddingLeft: tokens.spacing.md, 
                  paddingRight: tokens.spacing.md, 
                  paddingTop: tokens.spacing.sm, 
                  paddingBottom: tokens.spacing.sm,
                  textAlign: "left",
                  color: tokens.colors.onSurfaceVariant,
                  fontSize: tokens.typography.labelMedium.fontSize,
                  fontWeight: tokens.typography.labelMedium.fontWeight,
                }}
              >
                Name
              </th>
              <th
                style={{ 
                  paddingLeft: tokens.spacing.md, 
                  paddingRight: tokens.spacing.md, 
                  paddingTop: tokens.spacing.sm, 
                  paddingBottom: tokens.spacing.sm,
                  textAlign: "left",
                  color: tokens.colors.onSurfaceVariant,
                  fontSize: tokens.typography.labelMedium.fontSize,
                  fontWeight: tokens.typography.labelMedium.fontWeight,
                }}
              >
                Images
              </th>
              <th
                style={{ 
                  paddingLeft: tokens.spacing.md, 
                  paddingRight: tokens.spacing.md, 
                  paddingTop: tokens.spacing.sm, 
                  paddingBottom: tokens.spacing.sm,
                  textAlign: "left",
                  color: tokens.colors.onSurfaceVariant,
                  fontSize: tokens.typography.labelMedium.fontSize,
                  fontWeight: tokens.typography.labelMedium.fontWeight,
                }}
              >
                Status
              </th>
              <th
                style={{ 
                  paddingLeft: tokens.spacing.md, 
                  paddingRight: tokens.spacing.md, 
                  paddingTop: tokens.spacing.sm, 
                  paddingBottom: tokens.spacing.sm,
                  textAlign: "left",
                  color: tokens.colors.onSurfaceVariant,
                  fontSize: tokens.typography.labelMedium.fontSize,
                  fontWeight: tokens.typography.labelMedium.fontWeight,
                }}
              >
                Date
              </th>
              <th style={{ paddingLeft: tokens.spacing.md, paddingRight: tokens.spacing.md, paddingTop: tokens.spacing.sm, paddingBottom: tokens.spacing.sm, width: "40px" }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project, index) => {
              const isHovered = hoveredTableIndex === index;
              const baseBg = tokens.colors.surface;
              const hoverBg = tokens.colors.surfaceContainerLow;
              return (
              <tr
                key={project.id}
                onMouseEnter={() => setHoveredTableIndex(index)}
                onMouseLeave={() => setHoveredTableIndex(null)}
                style={{
                  backgroundColor: isHovered ? hoverBg : baseBg,
                  cursor: "pointer",
                  transition: "background-color 0.15s ease",
                  borderTop:
                    index > 0
                      ? `1px solid ${tokens.colors.outlineVariant}`
                      : "none",
                }}
                onClick={() =>
                  router.push(`/dashboard/projects?id=${project.id}`)
                }
              >
                <td style={{ paddingLeft: tokens.spacing.md, paddingRight: tokens.spacing.md, paddingTop: tokens.spacing.sm, paddingBottom: tokens.spacing.sm }}>
                  <span
                    style={{ color: tokens.colors.onSurface, fontSize: tokens.typography.labelLarge.fontSize, fontWeight: tokens.typography.labelLarge.fontWeight }}
                  >
                    {project.name}
                  </span>
                  {project.clientName && (
                    <span
                      style={{ display: "block", color: tokens.colors.onSurfaceVariant, fontSize: tokens.typography.bodySmall.fontSize, marginTop: tokens.spacing.xs }}
                    >
                      {project.clientName}
                    </span>
                  )}
                </td>
                <td style={{ paddingLeft: tokens.spacing.md, paddingRight: tokens.spacing.md, paddingTop: tokens.spacing.sm, paddingBottom: tokens.spacing.sm }}>
                  <div className="flex items-center gap-xs">
                    <span
                      className="material-icons"
                      style={{
                        fontSize: tokens.typography.bodyMedium.fontSize,
                        color: tokens.colors.onSurfaceVariant,
                      }}
                    >
                      photo_library
                    </span>
                    <span
                      style={{ color: tokens.colors.onSurface, fontSize: tokens.typography.bodyMedium.fontSize }}
                    >
                      {project.imageCount}
                    </span>
                  </div>
                </td>
                <td style={{ paddingLeft: tokens.spacing.md, paddingRight: tokens.spacing.md, paddingTop: tokens.spacing.sm, paddingBottom: tokens.spacing.sm }}>
                  {getStatusBadge(project.status)}
                </td>
                <td style={{ paddingLeft: tokens.spacing.md, paddingRight: tokens.spacing.md, paddingTop: tokens.spacing.sm, paddingBottom: tokens.spacing.sm }}>
                  <span
                    style={{ color: tokens.colors.onSurfaceVariant,
                    textAlign: "center",  
                    fontSize: tokens.typography.labelLarge.fontSize }}
                  >
                    {formatDate(project.createdAt)}
                  </span>
                </td>
                <td style={{ paddingLeft: tokens.spacing.md, paddingRight: tokens.spacing.md, paddingTop: tokens.spacing.sm, paddingBottom: tokens.spacing.sm, textAlign: "right" }}>
                  <span
                    className="material-icons"
                    style={{
                      fontSize: tokens.typography.titleMedium.fontSize,
                      color: tokens.colors.onSurfaceVariant,
                    }}
                  >
                    chevron_right
                  </span>
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
      ) : (
        <EmptyState
          hasFilters={hasActiveFilters}
          onClear={clearFilters}
        />
      )}
    </div>
  );

  const renderCardView = () => {
    if (filteredProjects.length === 0) {
      return <EmptyState hasFilters={hasActiveFilters} onClear={clearFilters} />;
    }

    return (
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: tokens.spacing.md,
        padding: tokens.spacing.md,
      }}>
        {filteredProjects.map((project, index) => {
          const isHovered = hoveredCardIndex === index;
          const cardBaseStyle = {
            backgroundColor: isHovered ? tokens.colors.surfaceContainerLow : tokens.colors.surface,
            borderColor: tokens.colors.outlineVariant,
            borderWidth: "1px",
            borderStyle: "solid",
            borderRadius: tokens.radius.xl,
            overflow: "hidden",
            cursor: "pointer",
            transition: "background-color 0.15s ease",
          };

          return (
            <div
              key={project.id}
              onMouseEnter={() => setHoveredCardIndex(index)}
              onMouseLeave={() => setHoveredCardIndex(null)}
              style={cardBaseStyle}
              onClick={() =>
                router.push(`/dashboard/projects?id=${project.id}`)
              }
            >
              {/* Content Area */}
              <div style={{ padding: tokens.spacing.md }}>
                {/* Top row: Image count + Status badge */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: tokens.spacing.sm }}>
                  <div
                    style={{
                      backgroundColor: tokens.colors.surfaceVariant,
                      borderRadius: tokens.radius.md,
                      paddingLeft: tokens.spacing.sm,
                      paddingRight: tokens.spacing.sm,
                      paddingTop: tokens.spacing.xs,
                      paddingBottom: tokens.spacing.xs,
                      display: "flex",
                      alignItems: "center",
                      gap: tokens.spacing.xs,
                    }}
                  >
                    <span className="material-icons" style={{ fontSize: "14px", color: tokens.colors.onSurfaceVariant }}>
                      photo_library
                    </span>
                    <span style={{ color: tokens.colors.onSurfaceVariant, fontSize: tokens.typography.labelSmall.fontSize, fontWeight: "500" }}>
                      {project.imageCount}
                    </span>
                  </div>
                  {getStatusBadge(project.status)}
                </div>

                {/* Project name */}
                <span
                  style={{ 
                    display: "block",
                    color: tokens.colors.onSurface, 
                    fontSize: tokens.typography.titleMedium.fontSize, 
                    fontWeight: tokens.typography.titleMedium.fontWeight,
                    marginBottom: tokens.spacing.xs,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {project.name}
                </span>

                {/* Client name */}
                {project.clientName && (
                  <p
                    style={{ 
                      color: tokens.colors.onSurfaceVariant, 
                      fontSize: tokens.typography.bodySmall.fontSize,
                      marginBottom: tokens.spacing.sm,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {project.clientName}
                  </p>
                )}

                {/* Bottom row: Date + Chevron */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span
                    style={{ 
                      color: tokens.colors.onSurfaceVariant, 
                      fontSize: tokens.typography.bodySmall.fontSize,
                    }}
                  >
                    {formatDate(project.createdAt)}
                  </span>
                  
                  <span
                    className="material-icons"
                    style={{ 
                      fontSize: tokens.typography.titleMedium.fontSize, 
                      color: tokens.colors.onSurfaceVariant,
                    }}
                  >
                    chevron_right
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
);
  };

  const EmptyState = ({
    hasFilters,
    onClear,
  }: {
    hasFilters: boolean;
    onClear: () => void;
  }) => (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      paddingTop: tokens.spacing.xl, 
      paddingBottom: tokens.spacing.xl,
      paddingLeft: tokens.spacing.md,
      paddingRight: tokens.spacing.md,
    }}>
      <span
        className="material-icons"
        style={{ fontSize: "48px", color: tokens.colors.onSurfaceVariant, marginBottom: tokens.spacing.md }}
      >
        search_off
      </span>
      <p
        style={{ color: tokens.colors.onSurfaceVariant, fontSize: tokens.typography.bodyMedium.fontSize, marginBottom: tokens.spacing.md }}
      >
        No projects found
      </p>
      {hasFilters && (
        <button
          onClick={onClear}
          style={{
            backgroundColor: tokens.colors.primaryContainer,
            color: tokens.colors.onPrimaryContainer,
            border: "none",
            paddingLeft: tokens.spacing.md,
            paddingRight: tokens.spacing.md,
            paddingTop: tokens.spacing.xs,
            paddingBottom: tokens.spacing.xs,
            borderRadius: tokens.radius.md,
            fontSize: tokens.typography.labelMedium.fontSize,
            fontWeight: tokens.typography.labelMedium.fontWeight,
            cursor: "pointer",
          }}
        >
          Clear Filters
        </button>
      )}
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing.sm, marginBottom: tokens.spacing.md }}>
        <span
          className="material-icons"
          style={{ fontSize: tokens.typography.titleMedium.fontSize, color: tokens.colors.secondary }}
        >
          folder
        </span>
        <span
          style={{ color: tokens.colors.onSurface, fontSize: tokens.typography.labelLarge.fontSize, fontWeight: tokens.typography.labelLarge.fontWeight }}
        >
          Recent Projects
        </span>
        <span
          style={{ marginLeft: "auto", color: tokens.colors.onSurfaceVariant, fontSize: tokens.typography.labelMedium.fontSize }}
        >
          {filteredProjects.length} projects
        </span>
      </div>

      <div
        style={{
          backgroundColor: tokens.colors.surface,
          borderColor: tokens.colors.outlineVariant,
          borderWidth: "1px",
          borderStyle: "solid",
          borderRadius: tokens.radius.xl,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            paddingLeft: tokens.spacing.md,
            paddingRight: tokens.spacing.md,
            paddingTop: tokens.spacing.sm,
            paddingBottom: tokens.spacing.sm,
            borderBottomWidth: "1px",
            borderBottomStyle: "solid",
            borderBottomColor: tokens.colors.outlineVariant,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing.xs }}>
            {viewOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setViewMode(option.value)}
                className="transition-colors cursor-pointer"
                style={{
                  backgroundColor:
                    viewMode === option.value
                      ? tokens.colors.primaryContainer
                      : "transparent",
                  color:
                    viewMode === option.value
                      ? tokens.colors.onPrimaryContainer
                      : tokens.colors.onSurfaceVariant,
                  border: "none",
                  paddingLeft: tokens.spacing.sm,
                  paddingRight: tokens.spacing.sm,
                  paddingTop: tokens.spacing.xs,
                  paddingBottom: tokens.spacing.xs,
                  borderRadius: tokens.radius.md,
                  display: "flex",
                  alignItems: "center",
                  gap: tokens.spacing.xs,
                  fontSize: tokens.typography.labelMedium.fontSize,
                  fontWeight: tokens.typography.labelMedium.fontWeight,
                }}
              >
                <span
                  className="material-icons"
                  style={{ fontSize: tokens.typography.titleMedium.fontSize }}
                >
                  {option.icon}
                </span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {renderFilters()}
        {renderStatusTabs()}

        {viewMode === "table" ? renderTableView() : renderCardView()}
      </div>
    </div>
  );
}