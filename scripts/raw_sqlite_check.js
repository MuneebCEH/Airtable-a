const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('C:/Users/FBC/Downloads/airtable/prisma/dev.db');

db.serialize(() => {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
        if (err) return console.error(err);
        tables.forEach(t => {
            db.get(`SELECT count(*) as count FROM "${t.name}"`, (err, row) => {
                console.log(`${t.name}: ${row.count} rows`);
            });
        });
    });
});
