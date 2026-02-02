# AirClone - Airtable-like Application

Built with Next.js 15, Prisma, Tailwind CSS, shadcn/ui.

## Features

*   **Projects & Workspaces**: Organize data into projects.
*   **Data Grid**: Airtable-style spreadsheet view with virtualization.
*   **Authentication**: Role-based access (Owner, Admin, Editor, Viewer).
*   **Database**: Designed for MySQL/MariaDB (cPanel compatible).

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Copy `.env.example` (created by you) to `.env` and fill in DB details.
    
    ```env
    DATABASE_URL="mysql://root:password@localhost:3306/airtable_db"
    NEXTAUTH_SECRET="supersecret"
    NEXTAUTH_URL="http://localhost:3000"
    ```

3.  **Database Setup**:
    ```bash
    npx prisma db push  # or migrate dev
    npm run prisma:seed # Seed default data
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Deployment

See [docs/DEPLOYMENT_CPANEL.md](docs/DEPLOYMENT_CPANEL.md) for cPanel instructions.

## Backups

See [docs/BACKUP_STRATEGY.md](docs/BACKUP_STRATEGY.md) for backup configuration.
