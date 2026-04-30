"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import "mapbox-gl/dist/mapbox-gl.css";
import { tokens } from "@/lib/design-tokens";

const fetcher = (url: string) => fetch(url).then(res => res.json()).then(data => data.data);

type MapboxModule = typeof import("mapbox-gl");
type GeoJSONFeature = {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: {
    id: string;
    category: string;
  };
};
type GeoJSONFeatureCollection = {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
};

const MAP_SOURCE_ID = "fieldspec-images";
const MAP_LAYER_ID = "fieldspec-image-points";

const CATEGORY_CONFIG = {
  crop_health: { label: "Crop Health", color: "#369596" },
  erosion: { label: "Erosion", color: "#8e603d" },
  damage: { label: "Damage", color: "#c93636" },
  irrigation: { label: "Irrigation", color: "#315f9b" },
  general: { label: "General", color: "#5d636f" },
};

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "crop_health", label: "Crop Health" },
  { value: "erosion", label: "Erosion" },
  { value: "damage", label: "Damage" },
  { value: "irrigation", label: "Irrigation" },
  { value: "general", label: "General" },
];

interface Project {
  id: string;
  name: string;
  photoCount: number;
}

interface MapImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  category: string;
  notes: string | null;
  gpsLat: number | null;
  gpsLng: number | null;
  createdAt: string;
}

export default function MapPageClient() {
  const { data: projectsData, isLoading: projectsLoading } = useSWR<Project[]>("/api/projects", fetcher);
  const projects = projectsData || [];

  const [selectedProjectId, setSelectedProjectId] = useState("");
  
  const { data: imagesData, mutate: mutateImages } = useSWR<MapImage[]>(
    selectedProjectId ? `/api/images?projectId=${selectedProjectId}&limit=1000` : null,
    fetcher
  );
  const images = imagesData || [];
  
  const loading = projectsLoading;
  const [mapError, setMapError] = useState("");
  const [selectedImage, setSelectedImage] = useState<MapImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [updatingMarker, setUpdatingMarker] = useState(false);
  const [savingSnapshot, setSavingSnapshot] = useState(false);
  const [snapshotSaved, setSnapshotSaved] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapModuleRef = useRef<MapboxModule | null>(null);
  const mapRef = useRef<import("mapbox-gl").Map | null>(null);
  const selectedMarkerRef = useRef<import("mapbox-gl").Marker | null>(null);
  const initialProjectLoadedRef = useRef(false);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const filteredImages = useMemo(
    () =>
      images.filter((img) => {
        if (selectedCategory === "all") return true;
        return img.category === selectedCategory;
      }),
    [images, selectedCategory]
  );

  const imagesWithoutGps = useMemo(
    () => images.filter((img) => img.gpsLat === null || img.gpsLng === null),
    [images]
  );
  const filteredWithGps = useMemo(
    () =>
      filteredImages.filter(
        (img) => img.gpsLat !== null && img.gpsLng !== null
      ),
    [filteredImages]
  );
  const featureCollection = useMemo<GeoJSONFeatureCollection>(
    () => ({
      type: "FeatureCollection",
      features: filteredWithGps.map((image) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [image.gpsLng!, image.gpsLat!],
        },
        properties: {
          id: image.id,
          category: image.category,
        },
      })),
    }),
    [filteredWithGps]
  );



  const syncMapData = useCallback(() => {
    const mapboxgl = mapModuleRef.current?.default;
    if (!mapRef.current || !mapboxgl) return;

    const source = mapRef.current.getSource(MAP_SOURCE_ID) as
      | import("mapbox-gl").GeoJSONSource
      | undefined;

    if (source) {
      source.setData(featureCollection);
    }

    if (featureCollection.features.length === 0) {
      if (selectedMarkerRef.current) {
        selectedMarkerRef.current.remove();
        selectedMarkerRef.current = null;
      }
      return;
    }

    const bounds = new mapboxgl.LngLatBounds();
    featureCollection.features.forEach((feature) => {
      bounds.extend(feature.geometry.coordinates);
    });

    mapRef.current.fitBounds(bounds, { padding: 50, maxZoom: 15 });
  }, [featureCollection]);

  const syncSelectedMarker = useCallback(() => {
    const mapboxgl = mapModuleRef.current?.default;
    if (!mapRef.current || !mapboxgl) return;

    if (!selectedImage || selectedImage.gpsLat === null || selectedImage.gpsLng === null) {
      selectedMarkerRef.current?.remove();
      selectedMarkerRef.current = null;
      return;
    }

    const existingMarker = selectedMarkerRef.current;
    if (existingMarker) {
      existingMarker.setLngLat([selectedImage.gpsLng, selectedImage.gpsLat]);
      return;
    }

    const el = document.createElement("div");
    el.style.width = "36px";
    el.style.height = "36px";
    el.style.borderRadius = "50%";
    el.style.border = "4px solid white";
    el.style.boxShadow = "0 4px 12px rgba(0,0,0,0.35)";
    el.style.cursor = "grab";
    el.style.backgroundColor =
      CATEGORY_CONFIG[selectedImage.category as keyof typeof CATEGORY_CONFIG]?.color ||
      CATEGORY_CONFIG.general.color;

    const marker = new mapboxgl.Marker({
      element: el,
      draggable: true,
    })
      .setLngLat([selectedImage.gpsLng, selectedImage.gpsLat])
      .addTo(mapRef.current);

    marker.on("dragend", () => {
      const lngLat = marker.getLngLat();
      void handleMarkerDrag(selectedImage.id, lngLat.lat, lngLat.lng);
    });

    selectedMarkerRef.current = marker;
  }, [selectedImage]);

  const initMap = useCallback(async () => {
    if (!mapContainerRef.current || !mapboxToken || mapRef.current) return;

    try {
      const mapboxglModule = await import("mapbox-gl");
      const mapboxgl = mapboxglModule.default;

      mapModuleRef.current = mapboxglModule;
      mapboxgl.accessToken = mapboxToken;

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        center: [24.7, -28.5],
        zoom: 5,
      });

      map.addControl(new mapboxgl.NavigationControl(), "top-right");

      map.on("load", () => {
        mapRef.current = map;

        map.addSource(MAP_SOURCE_ID, {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50
        });

        map.addLayer({
          id: "clusters",
          type: "circle",
          source: MAP_SOURCE_ID,
          filter: ["has", "point_count"],
          paint: {
            "circle-color": [
              "step",
              ["get", "point_count"],
              tokens.colors.primary,
              100,
              tokens.colors.secondary,
              750,
              tokens.colors.tertiary
            ],
            "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 2,
          }
        });

        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: MAP_SOURCE_ID,
          filter: ["has", "point_count"],
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["Arial Unicode MS Bold"],
            "text-size": 12
          },
          paint: {
            "text-color": "#ffffff"
          }
        });

        map.addLayer({
          id: MAP_LAYER_ID,
          type: "circle",
          source: MAP_SOURCE_ID,
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-radius": 9,
            "circle-color": [
              "match",
              ["get", "category"],
              "crop_health",
              CATEGORY_CONFIG.crop_health.color,
              "erosion",
              CATEGORY_CONFIG.erosion.color,
              "damage",
              CATEGORY_CONFIG.damage.color,
              "irrigation",
              CATEGORY_CONFIG.irrigation.color,
              CATEGORY_CONFIG.general.color,
            ],
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 3,
          },
        });

        map.on("mouseenter", "clusters", () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "clusters", () => {
          map.getCanvas().style.cursor = "";
        });

        map.on("click", "clusters", (e) => {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ["clusters"]
          });
          const clusterId = features[0].properties?.cluster_id;
          const source = map.getSource(MAP_SOURCE_ID) as import("mapbox-gl").GeoJSONSource;
          source.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;
            map.easeTo({
              center: (features[0].geometry as any).coordinates,
              zoom: zoom
            });
          });
        });

        map.on("click", MAP_LAYER_ID, (event) => {
          const feature = event.features?.[0];
          const imageId = feature?.properties?.id;
          if (!imageId) return;

          const image = filteredWithGps.find((item) => item.id === imageId);
          if (!image) return;

          setSelectedImage(image);
          map.flyTo({
            center: [image.gpsLng!, image.gpsLat!],
            zoom: 15,
          });
        });

        syncMapData();
        syncSelectedMarker();
      });

      map.on("error", (event) => {
        console.error("Map error:", event);
        setMapError("Failed to load map. Please check your Mapbox token.");
      });
    } catch (err) {
      console.error("Failed to initialize map:", err);
      setMapError("Failed to initialize map.");
    }
  }, [filteredWithGps, mapboxToken, syncMapData, syncSelectedMarker]);

  useEffect(() => {
    void initMap();

    return () => {
      selectedMarkerRef.current?.remove();
      selectedMarkerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [initMap]);

  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  useEffect(() => {
    syncMapData();
  }, [syncMapData]);

  useEffect(() => {
    syncSelectedMarker();

    if (!mapRef.current || !selectedImage) return;

    mapRef.current.flyTo({
      center: [selectedImage.gpsLng!, selectedImage.gpsLat!],
      zoom: 15,
      duration: 1000,
    });
  }, [selectedImage, syncSelectedMarker]);

  async function handleMarkerDrag(imageId: string, lat: number, lng: number) {
    setUpdatingMarker(true);
    try {
      const res = await fetch(`/api/images/${imageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gpsLat: lat, gpsLng: lng }),
      });

      if (res.ok) {
        mutateImages((currentImages) => 
          currentImages?.map((img) =>
            img.id === imageId ? { ...img, gpsLat: lat, gpsLng: lng } : img
          ),
          false
        );
        if (selectedImage?.id === imageId) {
          setSelectedImage((prev) =>
            prev ? { ...prev, gpsLat: lat, gpsLng: lng } : prev
          );
        }
      }
    } catch (err) {
      console.error("Failed to update marker position:", err);
    } finally {
      setUpdatingMarker(false);
    }
  }

  async function handleSaveSnapshot() {
    if (!mapRef.current || !selectedProjectId) return;

    setSavingSnapshot(true);
    try {
      mapRef.current.getCanvas().toBlob(async (blob) => {
        if (!blob) {
          setSavingSnapshot(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", blob, "map-snapshot.png");
        formData.append("projectId", selectedProjectId);

        const res = await fetch("/api/upload/image", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          const snapshotUrl = data.data?.url || data.data?.thumbnailUrl;

          if (snapshotUrl) {
            const projectRes = await fetch(`/api/projects/${selectedProjectId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ mapSnapshotUrl: snapshotUrl }),
            });

            if (projectRes.ok) {
              setSnapshotSaved(true);
              setTimeout(() => setSnapshotSaved(false), 3000);
            }
          }
        }
        setSavingSnapshot(false);
      }, "image/png");
    } catch (err) {
      console.error("Failed to save snapshot:", err);
      setSavingSnapshot(false);
    }
  }

  if (!mapboxToken) {
    return (
      <div style={{ padding: tokens.spacing.lg, maxWidth: "1200px" }}>
        <div style={{ marginBottom: tokens.spacing.xl }}>
          <h2
            style={{
              ...tokens.typography.headlineSmall,
              color: tokens.colors.onSurface,
            }}
          >
            Map
          </h2>
          <p
            style={{
              ...tokens.typography.bodyMedium,
              color: tokens.colors.onSurfaceVariant,
              marginTop: "0.75rem",
            }}
          >
            View field locations on map
          </p>
        </div>
        <div
          style={{
            padding: tokens.spacing.xl,
            backgroundColor: tokens.colors.errorContainer,
            borderRadius: tokens.radius.lg,
            textAlign: "center",
          }}
        >
          <p
            style={{
              ...tokens.typography.bodyLarge,
              color: tokens.colors.onErrorContainer,
            }}
          >
            Mapbox token is not configured. Please set
            {" "}NEXT_PUBLIC_MAPBOX_TOKEN in your environment variables.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: tokens.spacing.lg, maxWidth: "1200px" }}>
        <div
          style={{
            padding: tokens.spacing.xl,
            textAlign: "center",
            color: tokens.colors.onSurfaceVariant,
            ...tokens.typography.bodyLarge,
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: tokens.spacing.lg,
        height: "calc(100vh - 100px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="animate-content" style={{ marginBottom: tokens.spacing.lg, flexShrink: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <h2
          style={{
            ...tokens.typography.headlineSmall,
            color: tokens.colors.onSurface,
            margin: 0,
          }}
        >
          Map
        </h2>
        <p
          style={{
            ...tokens.typography.bodyMedium,
            color: tokens.colors.onSurfaceVariant,
            margin: 0,
          }}
        >
          View and manage field locations
        </p>
      </div>

      {projects.length === 0 ? (
        <div
          style={{
            padding: tokens.spacing.xl,
            backgroundColor: tokens.colors.surface,
            borderRadius: tokens.radius.lg,
            textAlign: "center",
          }}
        >
          <p
            style={{
              ...tokens.typography.bodyLarge,
              color: tokens.colors.onSurfaceVariant,
            }}
          >
            No projects available. Create a project first.
          </p>
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            gap: tokens.spacing.lg,
            minHeight: 0,
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: tokens.spacing.md,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: tokens.spacing.md,
                flexWrap: "wrap",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <label
                style={{
                  ...tokens.typography.labelLarge,
                  color: tokens.colors.onSurface,
                }}
              >
                Project:
              </label>
               <select
                 value={selectedProjectId}
                 onChange={(e) => {
                   setSelectedProjectId(e.target.value);
                   setSelectedImage(null);
                 }}
                 style={{
                   padding: `${tokens.spacing.sm} ${tokens.spacing.xl} ${tokens.spacing.sm} ${tokens.spacing.sm}`,
                   border: `1px solid ${tokens.colors.outlineVariant}`,
                   borderRadius: tokens.radius.md,
                   backgroundColor: tokens.colors.surface,
                   color: tokens.colors.onSurface,
                   ...tokens.typography.bodyLarge,
                   minWidth: "200px",
                   boxSizing: "border-box",
                   appearance: "none",
                   backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                   backgroundRepeat: "no-repeat",
                   backgroundPosition: `right ${tokens.spacing.sm} center`,
                   backgroundSize: "16px",
                   cursor: "pointer",
                 }}
               >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

              <div
                style={{
                  display: "flex",
                  gap: tokens.spacing.xs,
                  flexWrap: "wrap",
                }}
              >
                {CATEGORIES.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    style={{
                      padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
                      border: "none",
                      borderRadius: tokens.radius.sm,
                      backgroundColor:
                        selectedCategory === category.value
                          ? tokens.colors.primary
                          : tokens.colors.surfaceVariant,
                      color:
                        selectedCategory === category.value
                          ? tokens.colors.onPrimary
                          : tokens.colors.onSurfaceVariant,
                      cursor: "pointer",
                      ...tokens.typography.labelMedium,
                    }}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSaveSnapshot}
                disabled={savingSnapshot || !selectedProjectId}
                style={{
                  marginLeft: "auto",
                  padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                  backgroundColor: savingSnapshot
                    ? tokens.colors.surfaceVariant
                    : tokens.colors.secondary,
                  color: savingSnapshot
                    ? tokens.colors.onSurfaceVariant
                    : tokens.colors.onSecondary,
                  border: "none",
                  borderRadius: tokens.radius.md,
                  cursor: savingSnapshot ? "not-allowed" : "pointer",
                  ...tokens.typography.labelMedium,
                }}
              >
                {savingSnapshot
                  ? "Saving..."
                  : snapshotSaved
                    ? "Snapshot Saved!"
                    : "Save Map Snapshot"}
              </button>
            </div>

            {imagesWithoutGps.length > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: tokens.spacing.sm,
                  padding: tokens.spacing.md,
                  borderRadius: tokens.radius.md,
                  backgroundColor: tokens.colors.tertiaryContainer,
                  flexShrink: 0,
                }}
              >
                <span className="material-icons"
                  style={{ color: tokens.colors.onTertiaryContainer, fontSize: "18px" }}
                >
                  location_off
                </span>
                <p
                  style={{
                    ...tokens.typography.bodySmall,
                    color: tokens.colors.onTertiaryContainer,
                  }}
                >
                  {imagesWithoutGps.length} of {images.length} images do not
                  contain GPS data and cannot be shown on the map.
                </p>
              </div>
            )}

            {mapError ? (
              <div
                style={{
                  flex: 1,
                  padding: tokens.spacing.xl,
                  backgroundColor: tokens.colors.surface,
                  borderRadius: tokens.radius.lg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p
                  style={{
                    ...tokens.typography.bodyLarge,
                    color: tokens.colors.error,
                  }}
                >
                  {mapError}
                </p>
              </div>
            ) : (
              <div
                ref={mapContainerRef}
                style={{
                  flex: 1,
                  borderRadius: tokens.radius.lg,
                  minHeight: "400px",
                }}
              />
            )}
          </div>

          {selectedImage && (
            <div
              style={{
                width: "320px",
                backgroundColor: tokens.colors.surface,
                borderRadius: tokens.radius.lg,
                boxShadow: tokens.elevation.level2,
                overflow: "hidden",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ position: "relative" }}>
                <img
                  src={selectedImage.thumbnailUrl}
                  alt="Selected location"
                  style={{ width: "100%", height: "180px", objectFit: "cover" }}
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  style={{
                    position: "absolute",
                    top: tokens.spacing.sm,
                    right: tokens.spacing.sm,
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(0,0,0,0.6)",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  x
                </button>
              </div>

              <div
                style={{
                  padding: tokens.spacing.md,
                  flex: 1,
                  overflow: "auto",
                }}
              >
                <div style={{ marginBottom: tokens.spacing.md }}>
                  <span
                    style={{
                      padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
                      backgroundColor:
                        CATEGORY_CONFIG[
                          selectedImage.category as keyof typeof CATEGORY_CONFIG
                        ]?.color || CATEGORY_CONFIG.general.color,
                      color: "white",
                      borderRadius: tokens.radius.pill,
                      ...tokens.typography.labelSmall,
                    }}
                  >
                    {CATEGORY_CONFIG[
                      selectedImage.category as keyof typeof CATEGORY_CONFIG
                    ]?.label || "General"}
                  </span>
                </div>

                {selectedImage.notes && (
                  <div style={{ marginBottom: tokens.spacing.md }}>
                    <label
                      style={{
                        ...tokens.typography.labelSmall,
                        color: tokens.colors.onSurfaceVariant,
                      }}
                    >
                      Notes
                    </label>
                    <p
                      style={{
                        ...tokens.typography.bodySmall,
                        color: tokens.colors.onSurface,
                        marginTop: tokens.spacing.xs,
                      }}
                    >
                      {selectedImage.notes}
                    </p>
                  </div>
                )}

                <div style={{ marginBottom: tokens.spacing.md }}>
                  <label
                    style={{
                      ...tokens.typography.labelSmall,
                      color: tokens.colors.onSurfaceVariant,
                    }}
                  >
                    Coordinates
                  </label>
                  <p
                    style={{
                      ...tokens.typography.bodySmall,
                      color: tokens.colors.onSurface,
                      marginTop: tokens.spacing.xs,
                      fontFamily: "monospace",
                    }}
                  >
                    {selectedImage.gpsLat?.toFixed(6)},{" "}
                    {selectedImage.gpsLng?.toFixed(6)}
                  </p>
                </div>

                <div style={{ marginBottom: tokens.spacing.md }}>
                  <label
                    style={{
                      ...tokens.typography.labelSmall,
                      color: tokens.colors.onSurfaceVariant,
                    }}
                  >
                    Captured
                  </label>
                  <p
                    style={{
                      ...tokens.typography.bodySmall,
                      color: tokens.colors.onSurface,
                      marginTop: tokens.spacing.xs,
                    }}
                  >
                    {new Date(selectedImage.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div
                  style={{
                    padding: tokens.spacing.sm,
                    backgroundColor: tokens.colors.surfaceVariant,
                    borderRadius: tokens.radius.sm,
                    marginTop: tokens.spacing.md,
                  }}
                >
                  <p
                    style={{
                      ...tokens.typography.labelSmall,
                      color: tokens.colors.onSurfaceVariant,
                    }}
                  >
                    Drag the marker on the map to adjust its position
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {updatingMarker && (
        <div
          style={{
            position: "fixed",
            bottom: tokens.spacing.lg,
            left: "50%",
            transform: "translateX(-50%)",
            padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
            backgroundColor: tokens.colors.primaryContainer,
            color: tokens.colors.onPrimaryContainer,
            borderRadius: tokens.radius.pill,
            boxShadow: tokens.elevation.level3,
            ...tokens.typography.labelMedium,
          }}
        >
          Updating marker position...
        </div>
      )}
    </div>
  );
}
