import { prisma } from "@/lib/prisma";
import ContactContent from "./ContactContent";

export const dynamic = 'force-dynamic';

export default async function ContactUs() {
    const headerSettings = await prisma.pageHeader.findUnique({
        where: { page: 'contact' }
    });

    return <ContactContent headerImageUrl={headerSettings?.imageUrl} />;
}
