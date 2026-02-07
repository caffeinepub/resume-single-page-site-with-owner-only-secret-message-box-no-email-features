# Specification

## Summary
**Goal:** Create a new, separate deployment/domain named "Hatem23" by cloning the existing resume-site app, keeping the original app unchanged.

**Planned changes:**
- Clone/copy the entire current resume-site project into a brand-new, separately accessible deployment named "Hatem23".
- Ensure the "Hatem23" deployment uses independent backend persisted state (no shared logs/messages/CMS data with the original).
- Update app labeling/metadata in the cloned deployment to reflect the name "Hatem23" (e.g., HTML document title) while keeping all user-facing UI text in English.

**User-visible outcome:** Users can access a separate "Hatem23" version of the resume app with the same pages and backend capabilities as the original, but with its own independent data and updated app title/labeling.
