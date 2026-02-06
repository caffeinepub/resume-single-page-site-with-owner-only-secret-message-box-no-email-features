# Specification

## Summary
**Goal:** Allow the Owner Panel to successfully save Contact Information updates after unlocking with the owner password, without triggering administrator/unauthorized access errors.

**Planned changes:**
- Update the Motoko backend to add a password-gated owner write method for updating site content (including contact details) using password "BirdOnTree3", independent of caller principal admin permissions.
- Keep existing public read content methods (e.g., getContent) publicly accessible and unchanged in behavior.
- Wire the frontend Content Editor save flow to call the new password-gated backend update method using the unlocked password already passed from OwnerAccessPanel (ownerPassword prop).
- Add a clear English UI guard/error when Content Editor is used without an ownerPassword, preventing saves in that case.
- Ensure the frontend refresh/invalidation behavior updates the public hero contact block after a successful save.

**User-visible outcome:** After unlocking the Owner Access Panel with the correct password, the owner can edit and save address/location, phone number, and email without any administrator access error, and the updated contact info persists after refresh and appears on the public site.
