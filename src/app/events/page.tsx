import { prisma } from "@/lib/prisma";
import EventsContent from "./EventsContent";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function Events() {
    const events = await prisma.event.findMany({
        orderBy: {
            date: 'asc',
        },
    });

    const headerSettings = await prisma.pageHeader.findUnique({
        where: { page: 'events' }
    });

    return <EventsContent events={events} headerImageUrl={headerSettings?.imageUrl} />;
}
