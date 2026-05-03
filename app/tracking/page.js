import Link from 'next/link';
import PinnableList from '../components/pinnable-list';
import { getDashboardData } from '../../lib/parcel-api';
import { buildTrackingLink } from '../../lib/tracking-links';

function formatContents(contents) {
  if (!Array.isArray(contents) || contents.length === 0) {
    return 'None';
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

export default async function TrackingPage() {
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
    <main className="page">
      <div className="shell">
        <section className="hero">
          <div>
            <p className="eyebrow">Public Tracking</p>
            <h1>Package Tracking Links</h1>
            <p>Share these links with anyone—no sign-in required.</p>
            <div className="stack">
              <Link className="button ghost" href="/">
                Back to sign in
              </Link>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="card">
            <p className="eyebrow">Packages</p>
            <h2>Tracking lineup</h2>
            <p>Tap a tracking number to jump to the carrier page.</p>

            <section className="section-stack">
              <PinnableList items={parcelItems} storageKey="public-parcels" emptyLabel="No parcels yet." />
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
