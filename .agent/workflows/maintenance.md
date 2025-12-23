---
description: Maintenance and Error Resolution for NorthStar Works
---

This workflow defines the "Maintenance Agent" behavior for NorthStar Works. Use this when the user reports an error or when monitoring indicates system instability.

## // turbo-all

1. **Check System Health**

   - Verify Python Backend: `curl -I http://localhost:8000/api/v1/search`
   - Verify Frontend Build: `npm run build`
   - Check Logs: View Vercel deployment logs or local terminal output.

2. **Automated Error Patching**

   - If a 400/500 error is found in `api/index.py`, wrap the failing block in a `try...except` and log the `traceback`.
   - If a UI overlap occurs, check `z-index` and `position` properties in the affected `page.tsx`.

3. **System Alerts & Communication**

   - If a critical bug is active, add an `<Alert severity="warning">` to `src/components/NavBar.tsx` to notify all users.
   - Summarize the outage and fix in `walkthrough.md`.

4. **Self-Documenting Fixes**
   - Every maintenance action must be committed with the prefix `fix(maintenance): [description]`.
   - Update `task.md` under a new "Maintenance" phase.

## Alert Protocol

When an error is detected:

> [!CAUTION] > **ALERT**: System Error detected in [Component]. Automated fix in progress.
