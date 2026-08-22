import { getEssentialDrugs, getJanAushadhiKendras } from "@/actions/pharmacy";
import { Header } from "@/components/layout/header";
import { PharmacyClientView } from "./pharmacy-client";

export default async function PharmacyPage() {
  const drugs = await getEssentialDrugs();
  const kendras = await getJanAushadhiKendras();

  return (
    <div>
      <Header
        title="Essential Drug Stock & Jan Aushadhi Kendra Locator"
        subtitle="Real-time PHC medicine stock visibility and 80%+ affordable Pradhan Mantri Jan Aushadhi generic substitutes"
      />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <PharmacyClientView initialDrugs={drugs} initialKendras={kendras} />
      </div>
    </div>
  );
}
