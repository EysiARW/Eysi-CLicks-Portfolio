# Phase 1 Data Model: Contact Sheet Only Archive & Filter Removal

**Feature**: `001-contact-sheet-archive`
**Date**: 2026-11-03

## Domain Entities & Value Objects

### 1. `PhotoAsset` (Immutable Value Object)
Represents a single photographic proof plate in the archive.

| Field / Getter | Type | Description & Invariants |
|---|---|---|
| `src` | `string` | Relative path to the fallback `.jpg`/`.jpeg` file (non-empty). |
| `webpSrc` | `string` | Derived `.webp` path corresponding to `src`. |
| `caption` | `string` | Display title of the plate (normalized from entry object or filename). |
| `category` | `'predebut' \| 'events' \| 'institutional'` | Parent archive chapter identifier. |
| `orientation` | `'portrait' \| 'landscape'` | Aspect ratio classification (`4:5` portrait or `3:2` landscape). |
| `index` | `number` | Zero-based sequential position within its `(category, orientation)` list. |
| `plateNumber` / `momentTag` | `string` | Zero-padded 1-based identifier (`PLATE 01`, `PLATE 02`, ...). |
| `categoryLabel` | `string` | Human-readable monograph title for the Lightbox badge. |
| `opticalTelemetry` | `string` | Optical metadata string displayed in the Lightbox topbar. |

### 2. `PortfolioRepository` (Domain Repository)
Encapsulates the `photoData` catalog and provides read-only queries.

| Method | Signature | Behavior |
|---|---|---|
| `getCategories()` | `() => string[]` | Returns defensive copy of `['predebut', 'events', 'institutional']`. |
| `isValidCategory(cat)` | `(string) => boolean` | Validates category membership. |
| `hasOrientation(cat, orientation)` | `(string, string) => boolean` | Returns `true` when at least 1 photo exists for `(cat, orientation)`. |
| `getOrientationCount(cat, orientation)` | `(string, string) => number` | Returns count of photos in `(cat, orientation)`. |
| `getCategoryTotalCount(cat)` | `(string) => number` | Sum of portrait + landscape photos in `cat`. |
| `getTotalArchivalPlates()` | `() => number` | Grand total across all categories (`28`). |
| `getPhotos(cat, orientation)` | `(string, string) => PhotoAsset[]` | Returns the complete unfiltered array of `PhotoAsset` instances for `(cat, orientation)`. |

### 3. `GalleryPresenter` State Model
Manages the Archive UI state transitions.

| Private State | Type | Description |
|---|---|---|
| `#categoryOrientation` | `Record<string, 'portrait' \| 'landscape'>` | Per-category remembered orientation (`predebut: 'portrait'`, `events: 'landscape'`, `institutional: 'landscape'`). |
| `#renderedSignature` | `Record<string, string>` | Tracks the last rendered `orientation` per category to avoid redundant DOM rebuilds. |
