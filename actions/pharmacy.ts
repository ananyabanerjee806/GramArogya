"use server";

import { memoryStore, isRealDatabaseConfigured, db } from "@/db";
import { essentialDrugs, EssentialDrugSelect } from "@/db/schema";

export async function getEssentialDrugs(): Promise<EssentialDrugSelect[]> {
  try {
    if (isRealDatabaseConfigured && db) {
      return await db.select().from(essentialDrugs);
    }
    return [...memoryStore.essentialDrugs];
  } catch (err) {
    console.error("Error fetching essential drugs:", err);
    return memoryStore.essentialDrugs;
  }
}

export async function getJanAushadhiKendras() {
  return [
    {
      id: "pmbjp-01",
      name: "Pradhan Mantri Jan Aushadhi Kendra - Khed Shivapur",
      address: "Near Gram Panchayat Bhavan, Main Market Road, Khed Shivapur, Pune 412205",
      contact: "+91 98220 99182",
      distanceKm: "1.2 km",
      operatingHours: "8:00 AM - 9:00 PM",
      status: "OPEN_NOW",
      verified: true,
      googleMapsQuery: "Jan Aushadhi Kendra Khed Shivapur",
    },
    {
      id: "pmbjp-02",
      name: "PMBJP Kendra - Manchar ST Stand",
      address: "Shop No. 4, Opposite State Transport Bus Stand, Manchar, Ambegaon 410503",
      contact: "+91 94225 11849",
      distanceKm: "4.8 km",
      operatingHours: "9:00 AM - 10:00 PM",
      status: "OPEN_NOW",
      verified: true,
      googleMapsQuery: "PMBJP Kendra Manchar",
    },
    {
      id: "pmbjp-03",
      name: "Jan Aushadhi Medical Store - Saswad Rural Hospital Gate",
      address: "Near Civil Hospital Main Gate, Pune-Saswad Road, Purandar 412301",
      contact: "+91 91580 44321",
      distanceKm: "7.5 km",
      operatingHours: "24x7 Open",
      status: "OPEN_NOW",
      verified: true,
      googleMapsQuery: "Jan Aushadhi Saswad Hospital Gate",
    }
  ];
}
