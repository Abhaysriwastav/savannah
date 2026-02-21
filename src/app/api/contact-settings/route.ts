import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from '@/lib/auth';

export async function GET() {
    try {
        let settings = await prisma.contactSettings.findFirst();
        if (!settings) {
            settings = await prisma.contactSettings.create({
                data: {
                    email: "info@savannahunited.de",
                    phone: "+49 000 000000",
                    address: "Berlin, Germany",
                }
            });
        }
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch contact settings" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        await verifyAuth(); // Superadmin only
        const body = await request.json();

        const settings = await prisma.contactSettings.findFirst();

        if (settings) {
            const updated = await prisma.contactSettings.update({
                where: { id: settings.id },
                data: {
                    email: body.email,
                    phone: body.phone,
                    address: body.address,
                    locationUrl: body.locationUrl,
                }
            });
            return NextResponse.json(updated);
        } else {
            const created = await prisma.contactSettings.create({
                data: {
                    email: body.email,
                    phone: body.phone,
                    address: body.address,
                    locationUrl: body.locationUrl,
                }
            });
            return NextResponse.json(created);
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to update contact settings" }, { status: 500 });
    }
}
