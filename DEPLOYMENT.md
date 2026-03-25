# Vercel Deployment Guide

This app is ready for Vercel deployment.

## Steps:
1. Push this code to a GitHub repository.
2. Connect the repository to Vercel.
3. Set the **Framework Preset** to **Vite**.
4. The **Build Command** should be `npm run build`.
5. The **Output Directory** should be `dist`.
6. **IMPORTANT**: Update `public/tonconnect-manifest.json` with your actual Vercel domain.
   - Replace `https://your-vercel-domain.vercel.app` with your production URL.

## Configuration:
- `vercel.json` is already included to handle client-side routing.
- Static assets are located in the `public/` directory.
