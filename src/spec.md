# Specification

## Summary
**Goal:** Remove admin-only authorization failures in the Owner Access Panel by using password-gated backend methods (owner panel password: "BirdOnTree3") for owner-only data/actions, starting with Recruiter Visits.

**Planned changes:**
- Backend: Add new password-gated canister methods to list and clear Recruiter Visits, authorizing solely by matching the provided owner password; keep the existing public `logRecruiterVisit(isRecruiter, companyName)` API unchanged.
- Frontend: Update Recruiter Visits view and related React Query hooks/mutations to pass the unlocked `ownerPassword` into the new password-gated backend methods; ensure refetching works after unlocking (e.g., query keys include password or otherwise reliably refetch).
- Backend + Frontend: Apply the same password-gated pattern across other Owner Panel features currently using admin-gated endpoints: Visitor Messages list/clear, Edit Website Content save, Skills CRUD/clear.
- Error handling: For invalid/empty passwords, backend traps with "Unauthorized" and the UI shows an English authorization error message.

**User-visible outcome:** After unlocking the Owner Access Panel with password "BirdOnTree3", the owner can view and clear Recruiter Visits (without page reload), manage Visitor Messages, edit website content, and manage skills without seeing admin authorization errors; incorrect passwords result in an "Unauthorized" error shown in English.
