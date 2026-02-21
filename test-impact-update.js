const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const metric = await prisma.impactMetric.update({
            where: { id: '6998dc1a06e91cdb5d235af1' },
            data: {
                labelEn: 'Student Impacted Updated',
                labelDe: '',
                value: '75%',
                icon: 'users',
                order: 1,
                updatedAt: '2026-02-20T22:11:38.449Z'
            },
        });
        console.log("Success:", metric);
    } catch (e) {
        console.error("Prisma Error:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}
main();
