import { getPatients } from "@/actions/patients";
import { getOpdQueue } from "@/actions/teleconsult";
import { Header } from "@/components/layout/header";
import { QueueClientView } from "./queue-client";

export default async function QueuePage() {
  const patients = await getPatients();
  const queue = await getOpdQueue();

  return (
    <div>
      <Header
        title="Live OPD Token & Queue Management"
        subtitle="Digital queue orchestration for rural PHCs & Telemedicine consultation rooms to eliminate 4-hour queues"
      />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <QueueClientView initialPatients={patients} initialQueue={queue} />
      </div>
    </div>
  );
}
