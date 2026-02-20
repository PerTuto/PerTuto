
import 'dotenv/config';
import { seed } from '@/lib/firebase/seed';
import { firebaseApp } from '@/lib/firebase/client-app';

// Force production mode checks if needed, but client-app depends on NODE_ENV
// We will run this with NODE_ENV=production

async function main() {
    console.log("🚀 Starting Production Seed...");
    console.log("Target Project:", firebaseApp.options.projectId);

    if (!firebaseApp.options.projectId) {
        console.error("❌ No Project ID found. Check .env variables.");
        process.exit(1);
    }

    try {
        const result = await seed();
        console.log("✅ Seed completed successfully.");
        console.log("Super User UID:", result.superUserId);
        process.exit(0);
    } catch (error) {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    }
}

main();
