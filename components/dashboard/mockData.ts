export interface Job {
  id: string;
  projectName: string;
  type: "caption_generation" | "summary_generation" | "full_report";
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  imageCount: number;
  status: "draft" | "report_generated" | "exported";
  createdAt: Date;
  clientName?: string;
}

export interface Insight {
  id: string;
  projectId: string;
  projectName: string;
  caption: string;
  finding: string;
  recommendation: string;
  confidenceScore: number;
  imageUrl: string;
}

export interface Stats {
  totalProjects: number;
  imagesProcessed: number;
  reportsGenerated: number;
  reportsInProgress: number;
}

export const mockJobs: Job[] = [
  {
    id: "job-1",
    projectName: "Farm Survey - North Region",
    type: "caption_generation",
    status: "processing",
    progress: 67,
    createdAt: new Date(),
  },
  {
    id: "job-2",
    projectName: "Solar Panel Inspection",
    type: "full_report",
    status: "pending",
    progress: 0,
    createdAt: new Date(),
  },
  {
    id: "job-3",
    projectName: "Pipeline Corridor Check",
    type: "full_report",
    status: "completed",
    progress: 100,
    createdAt: new Date(),
  },
  {
    id: "job-4",
    projectName: "Crop Health Assessment",
    type: "caption_generation",
    status: "processing",
    progress: 12,
    createdAt: new Date(),
  },
];

export const mockProjects: Project[] = [
  {
    id: "proj-1",
    name: "Farm Survey - North Region",
    imageCount: 156,
    status: "report_generated",
    createdAt: new Date("2026-04-20"),
    clientName: "Green Valley Farms",
  },
  {
    id: "proj-2",
    name: "Solar Panel Inspection",
    imageCount: 89,
    status: "draft",
    createdAt: new Date("2026-04-19"),
    clientName: "SunTech Energy",
  },
  {
    id: "proj-3",
    name: "Pipeline Corridor Check",
    imageCount: 234,
    status: "exported",
    createdAt: new Date("2026-04-18"),
    clientName: "PetroLine Corp",
  },
  {
    id: "proj-4",
    name: "Crop Health Assessment",
    imageCount: 45,
    status: "draft",
    createdAt: new Date("2026-04-17"),
  },
  {
    id: "proj-5",
    name: "Wind Farm Survey",
    imageCount: 312,
    status: "report_generated",
    createdAt: new Date("2026-04-16"),
    clientName: "WindPower Inc",
  },
  {
    id: "proj-6",
    name: "Bridge Inspection",
    imageCount: 78,
    status: "exported",
    createdAt: new Date("2026-04-15"),
    clientName: "City Engineering",
  },
];

export const mockInsight: Insight = {
  id: "insight-1",
  projectId: "proj-1",
  projectName: "Farm Survey - North Region",
  caption: "Healthy crop coverage with visible irrigation patterns",
  finding: "Multiple areas show signs of water stress in the eastern section. Crop density is 15% lower than the western region.",
  recommendation: "Increase irrigation frequency in the eastern section. Consider soil moisture sensor deployment for targeted watering.",
  confidenceScore: 87,
  imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400",
};

export const mockStats: Stats = {
  totalProjects: 12,
  imagesProcessed: 1847,
  reportsGenerated: 8,
  reportsInProgress: 2,
};
