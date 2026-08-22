import { Header } from "@/components/layout/header";
import { FacilityAnalyticsClientView } from "./facility-analytics-client";

export default function FacilityAnalyticsPage() {
  return (
    <div>
      <Header
        title="District Health & Facility Intelligence Dashboard"
        subtitle="Government of Maharashtra Public Health quality monitoring, referral completion metrics, and epidemic outbreak surveillance"
      />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <FacilityAnalyticsClientView />
      </div>
    </div>
  );
}
