# Database Setup

## Local Development (SQLite)

For local development, this project uses **SQLite** to ensure easy setup without requiring a local MySQL installation.

### Configuration
- **Prisma Schema**: `provider = "sqlite"`
- **Environment**: `DATABASE_URL="file:./dev.db"`

### Commands
- **Push Schema**: `npx prisma db push`
- **Seed Data**: `npx prisma db seed`
- **Studio**: `npx prisma studio` (to view data)

## Production / cPanel (MySQL)

For deployment to cPanel or other environments supporting MySQL:

1.  **Update `prisma/schema.prisma`**:
    Change the provider back to `mysql` and restore `@db.Text` annotations if needed (though `String` usually suffices).

    ```prisma
    datasource db {
      provider = "mysql"
      url      = env("DATABASE_URL")
    }
    
    // In model Account:
    // refresh_token String? @db.Text
    // access_token  String? @db.Text
    // id_token      String? @db.Text
    ```

2.  **Update `.env`**:
    Set your MySQL connection string:
    ```
    DATABASE_URL="mysql://username:password@hostname:3306/database_name"
    ```

3.  **Run Migrations**:
    ```bash
    npx prisma migrate deploy
    ```

## Troubleshooting
If you encounter `EPERM` errors during `prisma generate` or `db push`, it usually means the development server (`next dev`) is running and locking the database client files. Stop the server, run the command, and restart the server.
