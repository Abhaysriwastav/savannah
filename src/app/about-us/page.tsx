import { prisma } from "@/lib/prisma";
import AboutContent from "./AboutContent";

export const dynamic = 'force-dynamic';

export default async function AboutUs() {
    const settings = await prisma.aboutSettings.findFirst();
    const storyImageUrl = settings?.storyImageUrl;
    const headerImageUrl = settings?.headerImageUrl;

    return <AboutContent storyImageUrl={storyImageUrl} headerImageUrl={headerImageUrl} />;
}
