import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
import Link from "next/link";
import { FiUpload, FiTrash2 } from "react-icons/fi";
import styles from "../admin.module.css";
import UploadImageForm from "./UploadImageForm";
import GalleryManager from "./GalleryManager";

export default async function AdminGallery() {
    const images = await prisma.galleryImage.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1>Manage Gallery</h1>
            </div>

            <div className={styles.formGrid}>
                {/* Upload Form */}
                <div className={styles.adminCard}>
                    <h2>Upload New Image</h2>
                    <UploadImageForm />
                </div>

                {/* Image List */}
                <div className={styles.adminCard}>
                    <h2>Uploaded Images</h2>
                    <GalleryManager initialImages={images} />
                </div>
            </div>
        </div>
    );
}
