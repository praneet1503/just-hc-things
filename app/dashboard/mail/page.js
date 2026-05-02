import PinnableList from '../../components/pinnable-list';
import { getMailDashboardData as getDashboardData } from '../../../lib/parcel-api';

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

function buildStatusTone(status) {
  if (!status) {
    return 'neutral';
  }

  if (['delivered', 'complete', 'received', 'success'].some((value) => status.toLowerCase().includes(value))) {
    return 'ok';
  }

  return 'neutral';
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

  const lsvItems = dashboardData.lsv.list.map((record) => ({
    id: `${record.type || 'lsv'}-${record.id}`,
    title: record.title || 'LSV record',
    linkLabel: record.public_url ? 'Open LSV record' : 'No public link',
    link: record.public_url || null,
    status: record.status || 'unknown',
    statusTone: buildStatusTone(record.status),
    meta: `Type: ${record.type || 'Unknown'} · Subtype: ${record.subtype || 'n/a'}`,
    detail: record.tracking_number ? `Tracking: ${record.tracking_number}` : '',
  }));

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
