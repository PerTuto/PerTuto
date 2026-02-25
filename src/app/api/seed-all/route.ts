import { NextResponse } from "next/server";
import { adminFirestore } from "@/lib/firebase/server-app";
import { K12_ALL_SEED_DATA } from "@/app/dashboard/resources/seed-data-k12-all";
import { HIGHER_ED_SEED_DATA } from "@/app/dashboard/resources/seed-data-higher-ed";
import { PROFESSIONAL_SEED_DATA } from "@/app/dashboard/resources/seed-data-professional";

export async function GET() {
  const tenantId = "pertuto-default";
  let count = 0;
  try {
    const db = adminFirestore;
    const resourcesRef = db.collection(`tenants/${tenantId}/resources`);

    const allData = [...K12_ALL_SEED_DATA, ...HIGHER_ED_SEED_DATA, ...PROFESSIONAL_SEED_DATA];
    for (const data of allData) {
        await resourcesRef.add({
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        count++;
    }
    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
