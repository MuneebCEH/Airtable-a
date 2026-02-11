const { PrismaClient } = require('@prisma/client');
async function d() {
    const p = new PrismaClient();
    const sheets = await p.sheet.findMany({ include: { columns: true } });
    for (const s of sheets) {
        const dcs = s.columns.filter(c => ['refill due', 'delivered date'].includes(c.name.toLowerCase()));
        for (const dc of dcs) {
            const rows = await p.row.findMany({ where: { sheetId: s.id } });
            const count = rows.filter(r => !!r.data[dc.id]).length;
            if (count > 0) console.log(`${s.name.substring(0, 5)}|${dc.name.substring(0, 5)}|${count}`);
        }
    }
    await p.$disconnect();
}
d();
