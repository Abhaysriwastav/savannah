import { prisma } from "@/lib/prisma";
import AboutContent from "./AboutContent";

export const dynamic = 'force-dynamic';

export default async function AboutUs() {
    const settings = await prisma.aboutSettings.findFirst();
    const storyImageUrl = settings?.storyImageUrl;

    return <AboutContent storyImageUrl={storyImageUrl} />;
}
