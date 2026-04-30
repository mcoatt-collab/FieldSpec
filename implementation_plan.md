# Performance and State Management Refactor Plan

This plan details the code changes required to address the performance and state management issues identified in the audit.

## User Review Required

> [!WARNING]
> This refactor involves migrating data fetching logic from native `useEffect` + `fetch` to `SWR`. This will drastically improve the caching and performance of the app, but requires installing a new dependency (`swr`). Do you approve installing `swr`?

## Proposed Changes

### 1. Dependencies

#### [NEW] SWR
- We will install `swr` to handle request deduplication, caching, and stale-while-revalidate fetching across all pages.

### 2. State Management (Zustand)

#### [NEW] `store/useUploadStore.ts`
- Create a global store to manage the `uploadQueue` and `isUploading` state.
- This ensures that if the user navigates away from the Upload page while images are uploading, the process continues and the state is preserved when they return.

#### [MODIFY] `app/dashboard/upload/page.tsx`
- Remove the local `useState` for the upload queue.
- Subscribe to `useUploadStore`.

### 3. Data Fetching & Caching (SWR)

#### [MODIFY] `app/dashboard/projects/page.tsx`
- Remove `useEffect` and `useState` for `projects` and `clients`.
- Implement `useSWR('/api/projects')` and `useSWR('/api/clients')` to enable instant caching and eliminate waterfall loading.

#### [MODIFY] `components/dashboard/MapPageClient.tsx`
- Replace `fetchImages` inside `useEffect` with `useSWR`.
- Utilize SWR to prevent refetching the same project's coordinates when switching tabs.

#### [MODIFY] `app/dashboard/upload/page.tsx`
- Replace local `images` state with `useSWRInfinite` to implement proper cursor-based/offset pagination.
- Add a "Load More" button or intersection observer at the bottom of the grid to fetch the next page of images.

### 4. UI Rendering Optimization

#### [MODIFY] `components/dashboard/upload/ImageCard.tsx`
- Replace native `<img />` with Next.js `<Image />` component for automatic WebP conversion and lazy loading.

#### [MODIFY] `components/dashboard/MapPageClient.tsx`
- Update the Mapbox layer definition (`MAP_LAYER_ID`) to use Mapbox GL JS clustering (`cluster: true` on the `MAP_SOURCE_ID`) to prevent framerate drops when rendering thousands of coordinates.

## Verification Plan

### Automated Tests
- Run `npm run build` as requested to catch any TypeScript or type-mismatch errors caused by the SWR migrations.
- Verify `npm run lint`.

### Manual Verification
- Start `npm run dev`.
- Start an upload on the `UploadPage`, navigate to the `Dashboard`, and return to verify the upload queue persists.
- View a project with many images and test the "Load More" (pagination) functionality.
- Open the map to verify clusters appear correctly.
