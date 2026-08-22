"use client";

import { useState } from "react";
import { EssentialDrugSelect } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  CheckCircle2, 
  Coins, 
  Compass, 
  ExternalLink, 
  MapPin, 
  Navigation, 
  PhoneCall, 
  Pill, 
  Search, 
  ShieldAlert, 
  Sparkles, 
  TrendingDown 
} from "lucide-react";
import { toast } from "sonner";

interface PharmacyClientViewProps {
  initialDrugs: EssentialDrugSelect[];
  initialKendras: {
    id: string;
    name: string;
    address: string;
    contact: string;
    distanceKm: string;
    operatingHours: string;
    status: string;
    verified: boolean;
    googleMapsQuery: string;
  }[];
}

export function PharmacyClientView({ initialDrugs, initialKendras }: PharmacyClientViewProps) {
  const [drugs, setDrugs] = useState<EssentialDrugSelect[]>(initialDrugs);
  const [kendras] = useState(initialKendras);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  const filteredDrugs = drugs.filter((d) => {
    const matchesSearch = d.drugName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.janAushadhiName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "ALL" || d.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner: Affordability & PMBJP */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-emerald-700 text-white shadow-xl">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
            <Coins className="w-4 h-4 text-amber-200" />
            Pradhan Mantri Bhartiya Jan Aushadhi Pariyojana (PMBJP)
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            High Quality Generic Medicines at 50% to 90% Lower Cost
          </h2>
          <p className="text-xs text-amber-100 leading-relaxed">
            Ensuring every rural citizen gets uninterrupted treatment without financial toxicity by connecting PHC stock with verified Jan Aushadhi Kendras.
          </p>
        </div>
      </div>

      {/* Grid: Left Drug Stock & Price Comparison / Right Nearest Kendras */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Medicine Stock & Comparator (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-5 border-slate-200 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-3 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Pill className="w-4 h-4 text-emerald-600" />
                  PHC Essential Drug Stock & Generic Equivalents
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time inventory levels to prevent patient stockout shock
                </p>
              </div>

              {/* Search Bar */}
              <div className="w-full sm:w-48">
                <input
                  type="text"
                  placeholder="Search drug..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredDrugs.map((drug) => {
                const savingsPct = Math.round(((drug.marketPriceRs - drug.janAushadhiPriceRs) / drug.marketPriceRs) * 100);
                return (
                  <div
                    key={drug.id}
                    className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 space-y-2 dark:bg-slate-800/40 dark:border-slate-800"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {drug.drugName}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium">{drug.category}</span>
                      </div>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        drug.stockStatus === "IN_STOCK"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : drug.stockStatus === "LOW_STOCK"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                      }`}>
                        {drug.stockStatus === "IN_STOCK" ? `In Stock (${drug.phcStockUnits} Units)` : drug.stockStatus}
                      </span>
                    </div>

                    {/* Price Comparison Pill */}
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between text-xs dark:bg-slate-900 dark:border-slate-700">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Jan Aushadhi Alternative</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">{drug.janAushadhiName}</span>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className="text-slate-400 line-through text-[11px]">₹{drug.marketPriceRs}</span>
                          <span className="font-extrabold text-emerald-600 text-sm">₹{drug.janAushadhiPriceRs}</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600">Save {savingsPct}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column: Nearest Verified Jan Aushadhi Kendras (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5 border-slate-200 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Nearest Jan Aushadhi Stores
                </h3>
              </div>
              <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-300 font-bold">
                GIS Linked
              </Badge>
            </div>

            <div className="space-y-3">
              {kendras.map((kendra) => (
                <div
                  key={kendra.id}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 dark:bg-slate-800/40 dark:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {kendra.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{kendra.address}</p>
                    </div>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg shrink-0">
                      {kendra.distanceKm}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t dark:border-slate-700">
                    <span>🕒 {kendra.operatingHours}</span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(kendra.googleMapsQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <Navigation className="w-3 h-3" />
                      Open Maps
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
