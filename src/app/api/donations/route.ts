import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

// GET public settings
export async function GET() {
    try {
        let settings = await prisma.donationSettings.findFirst();

        // Auto-seed if it doesn't exist yet
        if (!settings) {
            settings = await prisma.donationSettings.create({
                data: {}
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Donation settings fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch donation settings" },
            { status: 500 }
        );
    }
}

// PUT strictly for Admin to update bank details
export async function PUT(request: NextRequest) {
    try {
        await verifyAuth('manage_donations');
        const body = await request.json();

        let settings = await prisma.donationSettings.findFirst();

        if (settings) {
            settings = await prisma.donationSettings.update({
                where: { id: settings.id },
                data: {
                    bankName: body.bankName,
                    accountName: body.accountName,
                    iban: body.iban,
                    bic: body.bic,
                    whatsappPhone: body.whatsappPhone,
                    imageUrl: body.imageUrl,
                    headerImageUrl: body.headerImageUrl
                }
            });
        } else {
            settings = await prisma.donationSettings.create({
                data: {
                    bankName: body.bankName,
                    accountName: body.accountName,
                    iban: body.iban,
                    bic: body.bic,
                    whatsappPhone: body.whatsappPhone,
                    imageUrl: body.imageUrl,
                    headerImageUrl: body.headerImageUrl
                }
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Donation settings update error:", error);
        return NextResponse.json(
            { error: "Failed to update donation settings" },
            { status: 500 }
        );
    }
}
