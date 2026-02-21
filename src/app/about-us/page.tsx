import { prisma } from "@/lib/prisma";
import AboutContent from "./AboutContent";

export const dynamic = 'force-dynamic';

export default async function AboutUs() {
    const settings = await prisma.aboutSettings.findFirst();

    return (
        <AboutContent
            storyImageUrl={settings?.storyImageUrl}
            headerImageUrl={settings?.headerImageUrl}
            settings={settings}
        />
    );
}
