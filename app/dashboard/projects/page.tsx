"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { tokens } from "@/lib/design-tokens";

interface Project {
  id: string;
  name: string;
  status: string;
  photoCount: number;
  createdAt: string;
}

interface Client {
  id: string;
  name: string;
  company: string | null;
}

const DATA_TYPE_CARDS = [
  {
    id: "aerial-orthomosaic",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    title: "Aerial Orthomosaic",
    description: "Georeferenced top-down imagery",
    meta: "JPG · TIFF · GeoTIFF",
    accent: "primary",
  },
  {
    id: "inspection-footage",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      </svg>
    ),
    title: "Inspection Footage",
    description: "Field video captures & fly-throughs",
    meta: "MP4 · MOV · AVI",
    accent: "secondary",
  },
  {
    id: "3d-point-clouds",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    title: "3D Models & Point Clouds",
    description: "Volumetric spatial data exports",
    meta: "LAS · LAZ · OBJ · PLY",
    accent: "tertiary",
  },
  {
    id: "terrain-elevation",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M22 17H2a9 9 0 0118 0z"/><path d="M2 17l5-8 4 5 3-3 5 6"/>
      </svg>
    ),
    title: "Terrain & Elevation",
    description: "DTM, DSM and contour maps",
    meta: "GeoTIFF · ASC · XYZ",
    accent: "error",
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [clientId, setClientId] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (showForm) {
      fetchClients();
    }
  }, [showForm]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      setTimeout(() => setUploading(false), 1500);
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setUploading(true);
      setTimeout(() => setUploading(false), 1500);
    }
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (res.ok && data.data) {
        setProjects(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchClients() {
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();
      if (res.ok && data.data) {
        setClients(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch clients:", err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCreating(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, clientId: clientId || null }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || `Failed to create project (${res.status})`);
        setCreating(false);
        return;
      }

      setProjects([data.data, ...projects]);
      setName("");
      setClientId("");
      setShowForm(false);
      setCreating(false);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setCreating(false);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  const totalPhotos = projects.reduce((sum, p) => sum + p.photoCount, 0);

  const statsCards = [
    { id: "stat-active-projects", label: "Active Projects", value: loading ? "—" : projects.length, sub: "In progress", trend: "+9%", trendUp: true, accent: "primary", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg> },
    { id: "stat-completed-jobs", label: "Total Photos", value: loading ? "—" : totalPhotos, sub: "All time", trend: "+12%", trendUp: true, accent: "secondary", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
    { id: "stat-avg-processing", label: "Avg. Processing", value: "2.4d", sub: "Per batch", trend: "−0.3d", trendUp: true, accent: "tertiary", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    { id: "stat-pending-analysis", label: "Pending Analysis", value: "0", sub: "Queued", trend: null, trendUp: true, accent: "error", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg> },
  ];

  return (
    <div className="up-page">
      <style>{CSS}</style>

      <div className="up-header">
        <div className="up-header-left">
          <h1 className="up-title">Projects</h1>
          <p className="up-subtitle">
            Manage your field inspection projects
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="up-btn-primary"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Create Project
          </button>
        )}
      </div>

      <input ref={fileInputRef} type="file" id="project-file-upload" accept=".png,.jpeg,.jpg,.tiff,.tif,.pdf,.json,.csv,image/*"
        onChange={handleFileSelect} disabled={uploading} style={{ display: "none" }} />

      <div
        id="project-upload-zone"
        className={`up-zone${isDragging ? " up-zone--drag" : ""}${uploading ? " up-zone--busy" : ""}`}
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => fileInputRef.current?.click()}
        role="button" tabIndex={0}
        onKeyDown={e => { if ((e.key === "Enter" || e.key === " ") && !uploading) fileInputRef.current?.click(); }}
      >
        {uploading ? (
          <div className="up-zone-inner">
            <div className="up-progress-ring">
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="23" fill="none" stroke="var(--sys-surface-roles-surface-container)" strokeWidth="4"/>
                <circle cx="28" cy="28" r="23" fill="none" stroke="var(--sys-primary)" strokeWidth="4"
                  strokeLinecap="round" strokeDasharray="80 144.5" transform="rotate(-90 28 28)"/>
              </svg>
              <span className="up-pct">Importing...</span>
            </div>
            <p className="up-zone-primary">Importing project data...</p>
          </div>
        ) : (
          <div className="up-zone-inner">
            <div className="up-zone-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
              </svg>
            </div>
            <p className="up-zone-primary">{isDragging ? "Drop file here" : "Drag & drop to import project"}</p>
            <p className="up-zone-or">or</p>
            <button
              type="button"
              className="up-btn-secondary"
              onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
            >
              Browse Files
            </button>
            <p className="up-zone-formats">JPEG &middot; PNG &middot; TIFF &middot; JSON &middot; CSV &middot; Project exports</p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="up-form-card">
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: tokens.spacing.md }}>
              <label className="up-modal-lbl">
                Project Name <span style={{ color: tokens.colors.primary }}>*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="up-input"
              />
            </div>

            <div style={{ marginBottom: tokens.spacing.md }}>
              <label className="up-modal-lbl" style={{ color: tokens.colors.onSurfaceVariant }}>
                Link to Client <span style={{ color: tokens.colors.onSurfaceVariant }}>(optional)</span>
              </label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="up-input"
              >
                <option value="">No client linked</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}{client.company ? ` (${client.company})` : ""}
                  </option>
                ))}
              </select>
              <p style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant, marginTop: tokens.spacing.xs }}>
                To create a project for a new client,{" "}
                <a href="/dashboard/clients" style={{ color: tokens.colors.primary, textDecoration: "underline" }}>
                  create the client first
                </a>
                .
              </p>
            </div>

            {error && (
              <div className="up-error" role="alert">
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: tokens.spacing.md }}>
              <button
                type="submit"
                disabled={creating}
                className="up-btn-primary"
              >
                {creating ? "Creating..." : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setName("");
                  setClientId("");
                  setError("");
                }}
                className="up-btn-ghost"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="up-stats-grid">
        {statsCards.map(s => (
          <div key={s.id} id={s.id} className="up-stat-card">
            <div className="up-stat-top">
              <div className={`up-stat-icon up-stat-icon--${s.accent}`}>{s.icon}</div>
              {s.trend && (
                <span className={`up-stat-trend up-stat-trend--${s.trendUp ? "up" : "dn"}`}>{s.trend}</span>
              )}
            </div>
            <div className="up-stat-value">{s.value}</div>
            <div className="up-stat-label">{s.label}</div>
            <div className="up-stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="up-section-head">
        <h2 className="up-section-title">Supported Data Types</h2>
        <p className="up-section-sub">Upload any of the following capture formats to begin AI analysis</p>
      </div>
      <div className="up-dtype-grid">
        {DATA_TYPE_CARDS.map(card => (
          <div key={card.id} id={card.id} className={`up-dtype-card up-dtype-card--${card.accent}`}>
            <div className={`up-dtype-icon up-dtype-icon--${card.accent}`}>{card.icon}</div>
            <div className="up-dtype-body">
              <h3 className="up-dtype-title">{card.title}</h3>
              <p className="up-dtype-desc">{card.description}</p>
              <span className="up-dtype-meta">{card.meta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="up-table-card">
        <div className="up-table-hd">
          <h2 className="up-table-title">Projects Summary</h2>
          <p className="up-table-count">{projects.length} total projects</p>
        </div>
        <div className="up-table-wrap">
          <table className="up-table">
            <thead>
              <tr>
                <th className="up-th">Project Name</th>
                <th className="up-th">Photos</th>
                <th className="up-th">Created</th>
                <th className="up-th">Status</th>
                <th className="up-th">Last Updated</th>
                <th className="up-th up-th-act">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="up-td" style={{ textAlign: "center", padding: "32px", color: "var(--sys-surface-roles-on-surface-variant)" }}>
                    Loading projects...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="up-td" style={{ textAlign: "center", padding: "32px", color: "var(--sys-surface-roles-on-surface-variant)" }}>
                    No projects found.
                  </td>
                </tr>
              ) : projects.slice(0, 10).map((project) => (
                <tr key={project.id} className="up-tr">
                  <td className="up-td">
                    <div className="up-file-info">
                      <div className="up-thumb">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
                        </svg>
                      </div>
                      <span className="up-file-name">{project.name}</span>
                    </div>
                  </td>
                  <td className="up-td up-td-num">{project.photoCount}</td>
                  <td className="up-td up-td-date">{formatDate(project.createdAt)}</td>
                  <td className="up-td">
                    <span className="up-badge up-badge--active">Active</span>
                  </td>
                  <td className="up-td up-td-date">{formatDate(project.createdAt)}</td>
                  <td className="up-td up-td-act">
                    <div className="up-row-acts">
                      <button className="up-act-btn" title="View project" aria-label="View project">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                      <button className="up-act-btn" title="Edit project" aria-label="Edit project">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {projects.length > 10 && (
          <div className="up-table-foot">
            <span className="up-foot-count">Showing 1 – {Math.min(10, projects.length)} of {projects.length} projects</span>
            <button className="up-nav-btn">View All</button>
          </div>
        )}
      </div>
    </div>
  );
}

const CSS = `
.up-page { font-family: var(--sys-typescale-body-large-fontfamily,"IBM Plex Sans",sans-serif); max-width:100%; padding:0 24px 56px; box-sizing:border-box; }
.up-header { display:flex; align-items:flex-start; justify-content:space-between; gap:24px; flex-wrap:wrap; margin-bottom:24px; }
.up-title  { font-size:26px; font-weight:600; letter-spacing:-.3px; color:var(--sys-surface-roles-on-surface); margin:0 0 6px; }
.up-subtitle { font-size:14px; line-height:1.6; color:var(--sys-surface-roles-on-surface-variant); margin:0; max-width:480px; }

.up-form-card { margin-bottom:24px; padding:24px; background:var(--sys-surface-roles-surface-container-low); border:1px solid var(--sys-outline-roles-outline-variant); border-radius:var(--sys-radius-lg); }
.up-modal-lbl { display:block; margin-bottom:6px; font-size:13px; font-weight:500; color:var(--sys-surface-roles-on-surface); }
.up-input { width:100%; box-sizing:border-box; padding:10px 12px; border:1px solid var(--sys-outline-roles-outline-variant); border-radius:var(--sys-radius-md); background:var(--sys-surface-roles-surface-container); color:var(--sys-surface-roles-on-surface); font-size:14px; font-family:inherit; outline:none; transition:border-color .15s,box-shadow .15s; }
.up-input:focus { border-color:var(--sys-primary); box-shadow:0 0 0 3px color-mix(in srgb,var(--sys-primary) 14%,transparent); }

.up-btn-primary { display:inline-flex; align-items:center; gap:7px; padding:9px 18px; border-radius:var(--sys-radius-md); background:var(--sys-primary); color:var(--sys-on-primary); font-size:13.5px; font-weight:500; font-family:inherit; border:none; cursor:pointer; transition:opacity .15s,transform .12s,box-shadow .15s; white-space:nowrap; }
.up-btn-primary:hover { opacity:.92; }
.up-btn-primary:disabled { opacity:.55; cursor:not-allowed; }
.up-btn-secondary { display:inline-flex; align-items:center; gap:7px; padding:9px 18px; border-radius:var(--sys-radius-md); background:var(--sys-secondary-container); color:var(--sys-on-secondary-container); font-size:13.5px; font-weight:500; font-family:inherit; border:1px solid var(--sys-outline-roles-outline-variant); cursor:pointer; transition:opacity .15s; white-space:nowrap; }
.up-btn-secondary:hover { opacity:.92; }
.up-btn-ghost { display:inline-flex; align-items:center; gap:7px; padding:9px 18px; border-radius:var(--sys-radius-md); background:transparent; color:var(--sys-surface-roles-on-surface); font-size:13.5px; font-weight:500; font-family:inherit; border:1px solid var(--sys-outline-roles-outline-variant); cursor:pointer; transition:background .15s; }
.up-btn-ghost:hover { background:var(--sys-surface-roles-surface-container); }

.up-error { display:flex; align-items:center; gap:9px; padding:11px 14px; border-radius:var(--sys-radius-md); background:var(--sys-error-container); color:var(--sys-on-error-container); font-size:13.5px; margin-bottom:16px; }

.up-zone { border:2px dashed var(--sys-outline-roles-outline-variant); border-radius:var(--sys-radius-xl); background:var(--sys-surface-roles-surface-container-low); padding:36px 32px; text-align:center; cursor:pointer; transition:border-color .25s,background .25s,transform .2s,box-shadow .25s; margin-bottom:28px; outline:none; position:relative; }
.up-zone::before { content:''; position:absolute; inset:0; border-radius:var(--sys-radius-xl); background:radial-gradient(ellipse at center,color-mix(in srgb,var(--sys-primary) 8%,transparent),transparent 70%); opacity:0; transition:opacity .3s ease; pointer-events:none; }
.up-zone:hover, .up-zone:focus { border-color:var(--sys-primary); box-shadow:0 0 12px color-mix(in srgb,var(--sys-primary) 12%,transparent); background:color-mix(in srgb,var(--sys-primary) 3%,var(--sys-surface-roles-surface-container-low)); }
.up-zone:hover::before { opacity:1; }
.up-zone--drag { border-color:var(--sys-primary)!important; transform:scale(1.006); background:color-mix(in srgb,var(--sys-primary) 6%,var(--sys-surface-roles-surface-container-low))!important; box-shadow:0 0 16px color-mix(in srgb,var(--sys-primary) 20%,transparent)!important; }
.up-zone--drag::before { opacity:1!important; }
.up-zone--busy { cursor:not-allowed; }
.up-zone-inner { display:flex; flex-direction:column; align-items:center; gap:10px; position:relative; z-index:1; }
.up-zone-icon { width:56px; height:56px; border-radius:50%; background:color-mix(in srgb,var(--sys-primary) 11%,transparent); display:flex; align-items:center; justify-content:center; color:var(--sys-primary); transition:background .2s,transform .25s,box-shadow .25s; }
.up-zone:hover .up-zone-icon { background:color-mix(in srgb,var(--sys-primary) 17%,transparent); transform:translateY(-2px); box-shadow:0 0 8px color-mix(in srgb,var(--sys-primary) 25%,transparent); }
.up-zone-primary { font-size:14.5px; font-weight:500; color:var(--sys-surface-roles-on-surface); margin:0; }
.up-zone-or      { font-size:12px; color:var(--sys-surface-roles-on-surface-variant); margin:0; }
.up-zone-formats { font-size:11px; color:var(--sys-surface-roles-on-surface-variant); margin:0; opacity:.75; }
.up-progress-ring { position:relative; width:56px; height:56px; display:flex; align-items:center; justify-content:center; }
.up-progress-ring svg { position:absolute; inset:0; width:100%; height:100%; }
.up-pct { font-size:12px; font-weight:600; color:var(--sys-primary); position:relative; z-index:1; }

.up-stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:28px; }
.up-stat-card { background:color-mix(in srgb,var(--sys-primary-container) 35%,var(--sys-surface-roles-surface-container-low)); border:1px solid var(--sys-outline-roles-outline-variant); border-radius:var(--sys-radius-lg); padding:20px; display:flex; flex-direction:column; gap:5px; transition:box-shadow .3s ease,transform .25s ease,border-color .3s ease,background .3s ease; position:relative; overflow:hidden; }
.up-stat-card::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at top left,color-mix(in srgb,var(--sys-primary) 8%,transparent),transparent 60%); opacity:0; transition:opacity .25s ease; pointer-events:none; }
.up-stat-card:hover { box-shadow:0 4px 16px color-mix(in srgb,var(--sys-primary) 15%,transparent),var(--sys-elevation-2dp-penumbra); transform:translateY(-2px); border-color:var(--sys-primary); background:color-mix(in srgb,var(--sys-primary-container) 40%,var(--sys-surface-roles-surface-container-low)); }
.up-stat-card:hover::before { opacity:1; }
.up-stat-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; position:relative; z-index:1; }
.up-stat-icon { width:36px; height:36px; border-radius:var(--sys-radius-md); display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:box-shadow .25s ease,transform .2s ease; }
.up-stat-icon--primary   { background:var(--sys-primary-container);   color:var(--sys-on-primary-container); }
.up-stat-icon--secondary { background:var(--sys-secondary-container); color:var(--sys-on-secondary-container); }
.up-stat-icon--tertiary  { background:var(--sys-tertiary-container);  color:var(--sys-on-tertiary-container); }
.up-stat-icon--error     { background:var(--sys-error-container);     color:var(--sys-on-error-container); }
.up-stat-card:hover .up-stat-icon--primary   { box-shadow:0 2px 6px color-mix(in srgb,var(--sys-primary) 20%,transparent); transform:scale(1.02); }
.up-stat-card:hover .up-stat-icon--secondary { box-shadow:0 2px 6px color-mix(in srgb,var(--sys-secondary) 20%,transparent); transform:scale(1.02); }
.up-stat-card:hover .up-stat-icon--tertiary  { box-shadow:0 2px 6px color-mix(in srgb,var(--sys-tertiary) 20%,transparent); transform:scale(1.02); }
.up-stat-card:hover .up-stat-icon--error     { box-shadow:0 2px 6px color-mix(in srgb,var(--sys-error) 20%,transparent); transform:scale(1.02); }
.up-stat-trend { font-size:11px; font-weight:600; padding:3px 8px; border-radius:999px; }
.up-stat-trend--up { background:color-mix(in srgb,#45ba4b 14%,transparent); color:#37953c; }
.up-stat-trend--dn { background:color-mix(in srgb,var(--sys-error) 12%,transparent); color:var(--sys-error); }
.up-stat-value { font-size:28px; font-weight:600; letter-spacing:-1px; color:var(--sys-surface-roles-on-surface); line-height:1.1; }
.up-stat-label { font-size:13px; font-weight:500; color:var(--sys-surface-roles-on-surface); }
.up-stat-sub   { font-size:12px; color:var(--sys-surface-roles-on-surface-variant); }

.up-section-head { margin-bottom:16px; }
.up-section-title { font-size:16px; font-weight:600; color:var(--sys-surface-roles-on-surface); margin:0 0 3px; }
.up-section-sub   { font-size:13px; color:var(--sys-surface-roles-on-surface-variant); margin:0; }

.up-dtype-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:28px; }
.up-dtype-card { background:var(--sys-surface-roles-surface-container-low); border:1px solid var(--sys-outline-roles-outline-variant); border-radius:var(--sys-radius-lg); padding:18px; display:flex; flex-direction:column; gap:12px; transition:box-shadow .3s ease,transform .25s ease,border-color .3s ease,background .3s ease; position:relative; overflow:hidden; }
.up-dtype-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; opacity:.7; border-radius:var(--sys-radius-lg) var(--sys-radius-lg) 0 0; transition:opacity .25s ease; }
.up-dtype-card--primary::before   { background:var(--sys-primary); }
.up-dtype-card--secondary::before { background:var(--sys-secondary); }
.up-dtype-card--tertiary::before  { background:var(--sys-tertiary); }
.up-dtype-card--error::before     { background:var(--sys-error); }
.up-dtype-card:hover { box-shadow:0 4px 16px color-mix(in srgb,var(--sys-primary) 15%,transparent),var(--sys-elevation-2dp-penumbra); transform:translateY(-2px); border-color:var(--sys-primary); }
.up-dtype-card:hover::before { opacity:1; }
.up-dtype-card:hover .up-dtype-icon { transform:scale(1.04); box-shadow:0 2px 8px color-mix(in srgb,var(--sys-primary) 20%,transparent); }
.up-dtype-icon { width:42px; height:42px; border-radius:var(--sys-radius-md); display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:box-shadow .25s ease,transform .2s ease; }
.up-dtype-icon--primary   { background:var(--sys-primary-container);   color:var(--sys-on-primary-container); }
.up-dtype-icon--secondary { background:var(--sys-secondary-container); color:var(--sys-on-secondary-container); }
.up-dtype-icon--tertiary  { background:var(--sys-tertiary-container);  color:var(--sys-on-tertiary-container); }
.up-dtype-icon--error     { background:var(--sys-error-container);     color:var(--sys-on-error-container); }
.up-dtype-body { flex:1; }
.up-dtype-title { font-size:14px; font-weight:600; color:var(--sys-surface-roles-on-surface); margin:0 0 4px; }
.up-dtype-desc  { font-size:12.5px; color:var(--sys-surface-roles-on-surface-variant); margin:0 0 6px; line-height:1.5; }
.up-dtype-meta  { font-size:11px; font-weight:500; color:var(--sys-surface-roles-on-surface-variant); background:var(--sys-surface-roles-surface-container); padding:3px 8px; border-radius:999px; display:inline-block; }

.up-projects-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(300px,1fr)); gap:16px; }
.up-project-card { display:flex; align-items:center; gap:14px; padding:18px; background:var(--sys-surface-roles-surface-container-low); border:1px solid var(--sys-outline-roles-outline-variant); border-radius:var(--sys-radius-lg); transition:box-shadow .3s ease,transform .25s ease,border-color .3s ease; position:relative; overflow:hidden; }
.up-project-card::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at center,color-mix(in srgb,var(--sys-primary) 6%,transparent),transparent 70%); opacity:0; transition:opacity .3s ease; pointer-events:none; }
.up-project-card:hover { box-shadow:0 4px 12px color-mix(in srgb,var(--sys-primary) 15%,transparent); transform:translateY(-2px); border-color:var(--sys-primary); }
.up-project-card:hover::before { opacity:1; }
.up-project-icon { width:42px; height:42px; border-radius:var(--sys-radius-md); background:var(--sys-primary-container); color:var(--sys-on-primary-container); display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:box-shadow .25s ease,transform .25s ease; }
.up-project-card:hover .up-project-icon { box-shadow:0 2px 8px color-mix(in srgb,var(--sys-primary) 25%,transparent); transform:scale(1.04); }
.up-project-body { flex:1; min-width:0; }
.up-project-name { font-size:14px; font-weight:600; color:var(--sys-surface-roles-on-surface); margin:0 0 2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.up-project-meta { font-size:12px; color:var(--sys-surface-roles-on-surface-variant); margin:0; }
.up-project-action { width:32px; height:32px; display:flex; align-items:center; justify-content:center; border:none; border-radius:var(--sys-radius-sm); background:transparent; color:var(--sys-surface-roles-on-surface-variant); cursor:pointer; transition:background .2s,color .2s,box-shadow .2s; }
.up-project-action:hover { background:var(--sys-surface-roles-surface-container); color:var(--sys-primary); box-shadow:0 0 10px color-mix(in srgb,var(--sys-primary) 30%,transparent); }

.up-table-card { background:var(--sys-surface-roles-surface-container-low); border:1px solid var(--sys-outline-roles-outline-variant); border-radius:var(--sys-radius-lg); overflow:hidden; margin-top:28px; }
.up-table-hd { display:flex; align-items:center; justify-content:space-between; padding:20px 24px 0; flex-wrap:wrap; gap:12px; border-bottom:1px solid var(--sys-outline-roles-outline-variant); }
.up-table-title { font-size:15px; font-weight:600; color:var(--sys-surface-roles-on-surface); margin:0; }
.up-table-count { font-size:12px; color:var(--sys-surface-roles-on-surface-variant); margin:0; }
.up-table-wrap { overflow-x:auto; }
.up-table { width:100%; border-collapse:collapse; font-size:13.5px; }
.up-table thead tr { border-bottom:1px solid var(--sys-outline-roles-outline-variant); }
.up-th { padding:12px 16px; text-align:left; font-size:10.5px; font-weight:600; letter-spacing:.07em; text-transform:uppercase; color:var(--sys-surface-roles-on-surface-variant); white-space:nowrap; background:var(--sys-surface-roles-surface-container); }
.up-th-act { width:80px; }
.up-tr { border-bottom:1px solid var(--sys-outline-roles-outline-variant); transition:background .2s,box-shadow .2s; }
.up-tr:last-child { border-bottom:none; }
.up-tr:hover { background:var(--sys-surface-roles-surface-container); box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--sys-primary) 20%,transparent); }
.up-td { padding:12px 16px; color:var(--sys-surface-roles-on-surface); vertical-align:middle; transition:color .15s; }
.up-td-num { text-align:right; font-variant-numeric:tabular-nums; }
.up-td-date { color:var(--sys-surface-roles-on-surface-variant); white-space:nowrap; font-size:13px; }
.up-badge { display:inline-flex; align-items:center; gap:5px; padding:3px 9px; border-radius:999px; font-size:12px; font-weight:500; }
.up-badge--active { background:color-mix(in srgb,#45ba4b 13%,transparent); color:#29702d; }
.up-file-info { display:flex; align-items:center; gap:10px; }
.up-thumb { width:34px; height:34px; border-radius:var(--sys-radius-sm); overflow:hidden; background:var(--sys-surface-roles-surface-container); flex-shrink:0; display:flex; align-items:center; justify-content:center; color:var(--sys-surface-roles-on-surface-variant); transition:box-shadow .2s,transform .2s; }
.up-tr:hover .up-thumb { box-shadow:0 2px 6px color-mix(in srgb,var(--sys-primary) 20%,transparent); transform:scale(1.02); }
.up-file-name { font-size:13px; font-weight:500; max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; display:block; }
.up-row-acts { display:flex; align-items:center; gap:4px; opacity:0; transition:opacity .2s; }
.up-tr:hover .up-row-acts { opacity:1; }
.up-act-btn { width:28px; height:28px; display:flex; align-items:center; justify-content:center; border:none; border-radius:var(--sys-radius-sm); background:transparent; color:var(--sys-surface-roles-on-surface-variant); cursor:pointer; transition:background .2s,color .2s,box-shadow .2s,transform .2s; }
.up-act-btn:hover { background:var(--sys-surface-roles-surface-container-high); color:var(--sys-primary); box-shadow:0 2px 6px color-mix(in srgb,var(--sys-primary) 20%,transparent); transform:scale(1.05); }

.up-table-empty { display:flex; flex-direction:column; align-items:center; gap:8px; padding:48px 24px; text-align:center; }
.up-table-empty-title { font-size:14px; font-weight:500; color:var(--sys-surface-roles-on-surface); margin:0; }
.up-table-empty-sub { font-size:13px; color:var(--sys-surface-roles-on-surface-variant); margin:0; }

.up-table-foot { display:flex; align-items:center; justify-content:space-between; padding:12px 24px; border-top:1px solid var(--sys-outline-roles-outline-variant); }
.up-foot-count { font-size:13px; color:var(--sys-surface-roles-on-surface-variant); }
.up-nav-btn { padding:6px 14px; border-radius:var(--sys-radius-sm); background:transparent; color:var(--sys-surface-roles-on-surface-variant); font-size:12.5px; font-weight:500; font-family:inherit; border:1px solid var(--sys-outline-roles-outline-variant); cursor:pointer; transition:background .15s; }
.up-nav-btn:hover { background:var(--sys-surface-roles-surface-container); }

@media (max-width:900px) {
  .up-stats-grid, .up-dtype-grid { grid-template-columns:repeat(2,1fr); }
}
@media (max-width:600px) {
  .up-stats-grid, .up-dtype-grid { grid-template-columns:1fr; }
  .up-projects-grid { grid-template-columns:1fr; }
}
`;