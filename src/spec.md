# Specification

## Summary
**Goal:** Allow the site owner to securely clear (purge) all stored Visitor Messages and Recruiter Visit logs from the Owner Access Panel.

**Planned changes:**
- Add owner-password-gated backend methods in `backend/main.mo` to clear all visitor messages and clear all recruiter visit logs, using the same password-check mechanism as the existing owner-only fetch methods.
- Update the Owner Access Panel views to include “Clear all messages” and “Clear all visits” actions with an English confirmation dialog (Cancel/Confirm) warning the action cannot be undone.
- After a successful clear, refresh the corresponding list immediately by invalidating/refetching cached data; show existing-style authorization errors if the password is wrong/expired.

**User-visible outcome:** In the Owner Access Panel, the owner can clear all Visitor Messages or all Recruiter Visit logs (after confirming), and the lists immediately update to empty without reloading the page.
