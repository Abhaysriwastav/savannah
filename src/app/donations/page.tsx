import { prisma } from "@/lib/prisma";
import DonationsContent from "./DonationsContent";

export const dynamic = 'force-dynamic';

export default async function Donations() {
    let settings = await prisma.donationSettings.findFirst();

    if (!settings) {
        settings = {
            id: "default",
            bankName: "Loading...",
            accountName: "Loading...",
            iban: "Loading...",
            bic: "Loading...",
            whatsappPhone: "",
            imageUrl: "/uploads/default-donation-hero.png",
            totalCount: 0,
            updatedAt: new Date()
        } as any;
    }

    return <DonationsContent settings={settings} />;
}
