import { prisma } from "@/lib/prisma";
import ContactContent from "./ContactContent";

export const dynamic = 'force-dynamic';

export default async function ContactUs() {
    const headerSettings = await prisma.pageHeader.findUnique({
        where: { page: 'contact' }
    });
    const contactSettings = await prisma.contactSettings.findFirst();

    return <ContactContent headerImageUrl={headerSettings?.imageUrl} contactSettings={contactSettings} />;
}
