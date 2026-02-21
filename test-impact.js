const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const metric = await prisma.impactMetric.create({
            data: {
                labelEn: 'Student Impacted',
                labelDe: '',
                value: '75%',
                icon: 'users',
                order: 1,
            },
        });
        console.log("Success:", metric);
    } catch (e) {
        console.error("Prisma Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
