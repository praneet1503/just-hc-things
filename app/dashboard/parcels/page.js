import PinnableList from '../../components/pinnable-list';
import { getDashboardData } from '../../../lib/parcel-api';
import { buildStatusTone, formatContents } from '../../../lib/parcel-formatters';
import { buildTrackingLink } from '../../../lib/tracking-links';

export default async function ParcelsPage() {
  const dashboardData = await getDashboardData();

  const parcelItems = dashboardData.packages.list.map((parcel) => ({
    id: String(parcel.id),
    title: parcel.title || 'Package update',
    linkLabel: parcel.tracking_number ? `Tracking: ${parcel.tracking_number}` : 'Tracking unavailable',
    link: buildTrackingLink({
      carrier: parcel.carrier,
      trackingNumber: parcel.tracking_number,
      fallback: parcel.tracking_link,
    }),
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
