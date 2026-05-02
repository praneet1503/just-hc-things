import PinnableList from '../../components/pinnable-list';
import { getMailDashboardData } from '../../../lib/parcel-api';

function formatContents(contents) {
  if (!Array.isArray(contents) || contents.length === 0) {
    return 'No contents listed';
  }

  return contents.map((item) => item.name).join(', ');
}

function buildStatusTone(status) {
  if (!status) {
    return 'neutral';
  }

  if (['delivered', 'complete', 'received', 'success'].some((value) => status.toLowerCase().includes(value))) {
    return 'ok';
  }

  return 'neutral';
}

export default async function ParcelsPage() {
  const dashboardData = await getMailDashboardData();

  const parcelItems = dashboardData.packages.list.map((parcel) => ({
    id: String(parcel.id),
    title: parcel.title || 'Package update',
    linkLabel: parcel.tracking_number ? `Tracking: ${parcel.tracking_number}` : 'Tracking unavailable',
    link: parcel.tracking_link || null,
    status: parcel.status || 'unknown',
    statusTone: buildStatusTone(parcel.status),
    meta: `Carrier: ${parcel.carrier || 'Unknown'} · Weight: ${parcel.weight || 'Unknown'} lbs`,
    detail: formatContents(parcel.contents),
  }));

  return (
    <section className="panel">
      <div className="card">
        <p className="eyebrow">Parcels</p>
        <h2>Parcel Parade</h2>
        <p>Pin the parcel you want to watch and we will keep it at the top.</p>

        <section className="section-stack">
          <PinnableList items={parcelItems} storageKey="pinned-parcels" emptyLabel="No parcels yet." />
        </section>
      </div>
    </section>
  );
}
