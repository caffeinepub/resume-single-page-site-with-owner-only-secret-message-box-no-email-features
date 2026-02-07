# Hatem23 Deployment Configuration

This document describes the frontend build-time settings needed for the Hatem23 clone deployment.

## Environment Variables

The Hatem23 clone uses the following environment variables to customize the deployment:

- `VITE_APP_NAME`: The application name displayed in the browser tab/title (default: "Resume")
- `VITE_OWNER_NAME`: The owner's name displayed in the corner access button (default: "Hatem Alsakhboori")

## Building for Hatem23

To build the frontend for the Hatem23 deployment:

1. Use the `.env.hatem23` file or set environment variables:
   ```bash
   VITE_APP_NAME=Hatem23 VITE_OWNER_NAME="Hatem Alsakhboori" npm run build
   ```

2. Or copy `.env.hatem23` to `.env` before building:
   ```bash
   cp .env.hatem23 .env
   npm run build
   ```

## Backend Configuration

The Hatem23 deployment should point to its own backend canister to ensure complete separation from the original app. Make sure to:

1. Deploy a separate backend canister for Hatem23
2. Update the canister IDs in the frontend configuration to point to the Hatem23 backend
3. Ensure the Hatem23 backend has its own independent state (recruiter visits, visitor messages, content, etc.)

## Deployment Separation

The Hatem23 clone is a completely separate deployment with:
- Its own domain/URL
- Its own backend canister and state
- Its own recruiter visit logs
- Its own visitor messages
- Its own content management

Changes made in the Hatem23 deployment do not affect the original app, and vice versa.
