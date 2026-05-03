import PinnableList from '../../components/pinnable-list';
import { getDashboardData } from '../../../lib/parcel-api';
import { buildStatusTone } from '../../../lib/parcel-formatters';
import { buildTrackingLink } from '../../../lib/tracking-links';

function formatTimestamp(value) {
  if (!value) {
    return 'Unknown';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export default async function MailPage() {
  const dashboardData = await getDashboardData();

  const letterItems = dashboardData.letters.list.map((letter) => ({
    id: String(letter.id),
    title: letter.title || 'Untitled letter',
    linkLabel: letter.public_url ? 'Open letter page' : 'No public link',
    link: letter.public_url || null,
    status: letter.status || 'unknown',
    statusTone: buildStatusTone(letter.status),
    meta: `Updated ${formatTimestamp(letter.updated_at)}`,
    detail: letter.tags?.length ? `Tags: ${letter.tags.join(', ')}` : '',
  }));

  const lsvItems = dashboardData.lsv.list.map((record, index) => {
    const trackingLink = buildTrackingLink({
      carrier: record.carrier,
      trackingNumber: record.tracking_number,
      fallback: record.tracking_link,
    });
    const link = trackingLink || record.public_url || null;
    const linkLabel = trackingLink
      ? record.tracking_number
        ? `Tracking: ${record.tracking_number}`
        : 'Open tracking link'
      : record.public_url
        ? 'Open LSV record'
        : 'No public link';

    return {
      id: String(record.id ?? index),
      title: record.title || 'LSV record',
      linkLabel,
      link,
      status: record.status || 'unknown',
      statusTone: buildStatusTone(record.status),
      meta: `Type: ${record.type || 'Unknown'} · Subtype: ${record.subtype || 'n/a'}`,
      detail: record.tracking_number ? `Tracking: ${record.tracking_number}` : '',
    };
  });

  return (
    <section className="panel">
      <div className="card">
        <p className="eyebrow">Mail</p>
        <h2>Mailbox Missions</h2>
        <p>Pin your favorite mail to keep it at the very top.</p>

        <section className="section-stack">
          <h3>Letters</h3>
          <PinnableList items={letterItems} storageKey="pinned-mail" emptyLabel="No letters yet." />
        </section>

        <section className="section-stack">
          <h3>LSV records</h3>
          <PinnableList items={lsvItems} storageKey="pinned-lsv" emptyLabel="No LSV records yet." />
        </section>
      </div>
    </section>
  );
}
