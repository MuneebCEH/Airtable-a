# Database Backup Strategy and Recovery

Implementing a reliable backup system is critical.

## 1. Automated Daily Backups - The "Cron Job" Way (Recommended for cPanel)

cPanel allows you to run scheduled tasks (Cron Jobs). We will create a script that dumps the MySQL database to a file.

### Step 1: Create the Backup Script

Create a file named `backup.sh` in your project root (or a private folder outside public_html).

```bash
#!/bin/bash

# Configuration
DB_USER="your_db_user"
DB_PASS="your_db_password"
DB_NAME="your_db_name"
BACKUP_DIR="/home/yourusername/backups" # Ensure this directory exists
DATE=$(date +%Y-%m-%d_%H-%M-%S)
FILENAME="db_backup_$DATE.sql"

# Create backup dir if not exists
mkdir -p $BACKUP_DIR

# Dump Database
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/$FILENAME

# Compress (Optional)
gzip $BACKUP_DIR/$FILENAME

# Retention Policy (Delete backups older than 30 days)
find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +30 -delete
```

### Step 2: Set Permissions

Make the script executable:
```bash
chmod +x backup.sh
```

### Step 3: Schedule in cPanel

1.  Go to **Cron Jobs** in cPanel.
2.  Add a New Cron Job.
3.  **Common Settings**: `Once Per Day` (or your preference).
4.  **Command**: `/bin/bash /home/yourusername/path/to/backup.sh`
5.  Click **Add New Cron Job**.

## 2. Admin UI Backup (Manual Trigger)

The functionality is partially implemented in the Admin UI.

### Implementation Logic
*   API Route: `/api/admin/backup`
*   Action: Calls `mysqldump` via `child_process.exec` (Node.js).
*   **Warning**: This requires `mysqldump` to be available in the system PATH where Node.js is running.

```typescript
// Example API Route Logic
import { exec } from 'child_process'

export async function POST(req) {
    // Check Admin usage
    const cmd = `mysqldump -u ... > backup.sql`
    exec(cmd, (error) => {
       if (error) // handle error
    })
}
```

## 3. Restore Strategy

### From cPanel
1.  Go to **phpMyAdmin** or **MySQL Databases**.
2.  Select your database.
3.  Click **Import**.
4.  Upload the `.sql` (or `.sql.gz`) file.
5.  Click **Go**.

### From CLI (SSH)
```bash
mysql -u user -p dbname < backup_file.sql
```
