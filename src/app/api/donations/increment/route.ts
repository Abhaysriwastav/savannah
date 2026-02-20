import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST strictly for Admin to increment the counter
export async function POST(request: NextRequest) {
    try {
        let settings = await prisma.donationSettings.findFirst();

        if (!settings) {
            return NextResponse.json({ error: "Settings not found" }, { status: 404 });
        }

        settings = await prisma.donationSettings.update({
            where: { id: settings.id },
            data: {
                totalCount: { increment: 1 }
            }
        });

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Donation counter increment error:", error);
        return NextResponse.json(
            { error: "Failed to increment donation counter" },
            { status: 500 }
        );
    }
}
