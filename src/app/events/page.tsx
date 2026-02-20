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

    return <EventsContent events={events} />;
}
