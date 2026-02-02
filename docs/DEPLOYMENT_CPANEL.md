# Deployment Guide for cPanel

This guide explains how to deploy the Airtable-like Next.js application to a cPanel environment with Node.js support.

## Prerequisites

1.  **cPanel Account** with **Node.js Selector** enabled.
2.  **MySQL Database** created in cPanel.
3.  **SSH Access** (recommended) or File Manager access.

## Step 1: Prepare the Application

1.  Build the application locally or on CI/CD (optional, but recommended for speed).
    *   If building on server, ensure you have sufficient RAM.
2.  Ensure `package.json` has the correct scripts (already configured).

## Step 2: Upload Files

1.  Zip your project (excluding `node_modules`, `.next`, `.git`).
2.  Upload to your cPanel `public_html` or a subdirectory (e.g., `app`).
3.  Extract the files.

## Step 3: Configure Node.js App in cPanel

1.  Go to **Setup Node.js App** in cPanel.
2.  Click **Create Application**.
3.  **Node.js Version**: Select the latest stable version (User recommended Next.js latest, so Node 20 is preferred).
4.  **Application Mode**: `Production`.
5.  **Application Root**: The path to your uploaded folder.
6.  **Application URL**: The domain/subdomain.
7.  **Application Startup File**: `node_modules/next/dist/bin/next` (standard for Next.js) OR create a custom `server.js` if using custom server. For cPanel, usually leaving it blank or setting to `server.js` (if you create one) works. 
    *   *Recommended*: Create a `server.js` wrapper:
        ```javascript
        const { createServer } = require('http')
        const { parse } = require('url')
        const next = require('next')

        const dev = process.env.NODE_ENV !== 'production'
        const app = next({ dev })
        const handle = app.getRequestHandler()

        app.prepare().then(() => {
        createServer((req, res) => {
            const parsedUrl = parse(req.url, true)
            handle(req, res, parsedUrl)
        }).listen(process.env.PORT || 3000, (err) => {
            if (err) throw err
            console.log('> Ready on http://localhost:' + (process.env.PORT || 3000))
        })
        })
        ```
    *   Set startup file to `server.js`.

8.  Click **Create**.

## Step 4: Environment Variables

1.  In the Node.js App settings, add the following variables:
    *   `DATABASE_URL`: `mysql://user:password@localhost:3306/dbname`
    *   `NEXTAUTH_SECRET`: Generate a random string (e.g., `openssl rand -base64 32`).
    *   `NEXTAUTH_URL`: `https://yourdomain.com`

## Step 5: Install Dependencies & Build

1.  Stop the app.
2.  Click **Run NPM Install**.
3.  Run the build command. You can do this via SSH:
    ```bash
    cd /path/to/app
    npm run build
    ```
    *   If you can't run SSH, add a script `"build-cpanel": "next build"` to `package.json` (already standard `build`) and try to run via cPanel UI if supported, or build locally and upload the `.next` folder.

## Step 6: Database Migration

1.  Run the migration via SSH:
    ```bash
    npx prisma migrate deploy
    ```
2.  Run the seed script:
    ```bash
    npm run prisma:seed
    ```

## Step 7: Restart

1.  Restart the Node.js app in cPanel.
2.  Visit your URL.

## Troubleshooting

*   **503 Error**: Check `stderr.log` in the app root. Often permissions or missing node_modules.
*   **Database Error**: Verify `DATABASE_URL` is correct. cPanel MySQL usually runs on `localhost` port `3306`.
