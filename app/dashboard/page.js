import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getApiDiagnostics, getMailDashboardData } from '../../lib/parcel-api';

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

function getProbeClass(status) {
  if (status === 'ok') {
    return 'ok';
  }

  if (status === 'auth-needed') {
    return 'warn';
  }

  return 'neutral';
}

function getTrackingLabel(record) {
  if (!record?.tracking_number) {
    return 'Unavailable';
  }

  if (!record.tracking_link) {
    return record.tracking_number;
  }

  return (
    <a href={record.tracking_link} target="_blank" rel="noopener noreferrer" className="tracking-link">
      {record.tracking_number}
    </a>
  );
}

function formatContents(contents) {
  if (!Array.isArray(contents) || contents.length === 0) {
    return 'None';
  }

  return contents.map((item) => item.name).join(', ');
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('parcel_auth');

  if (sessionCookie?.value !== '1') {
    redirect('/?error=session');
  }

  const [diagnostics, dashboardData] = await Promise.all([
    getApiDiagnostics(),
    getMailDashboardData(),
  ]);

  const latestLetter = dashboardData.letters.latest;
  const latestLetterDetail = dashboardData.letters.latestDetail;
  const latestPackage = dashboardData.packages.latest;
  const latestLsv = dashboardData.lsv.latest;

  return (
    <main className="page">
      <div className="shell" style={{ gridTemplateColumns: '1fr' }}>
        <section className="panel">
          <div className="card">
            <p className="eyebrow">Dashboard</p>
            <h2>Hack Club Mail data</h2>
            <p>
              Live records are now fetched from <strong>{dashboardData.baseUrl || 'the configured API'}</strong> and rendered here.
            </p>

            <div className="stack" aria-label="Status">
              <div className="stat">
                <small>Status</small>
                <strong>Authenticated</strong>
              </div>
              <div className="stat">
                <small>Signed-in email</small>
                <strong>{process.env.LOGIN_EMAIL || 'not configured'}</strong>
              </div>
              <div className="stat">
                <small>Account id</small>
                <strong>{dashboardData.accountId || 'Unavailable'}</strong>
              </div>
            </div>

            <div className="stack" style={{ marginTop: '20px' }}>
              <div className="stat">
                <small>Letters</small>
                <strong>{dashboardData.summary.letters}</strong>
              </div>
              <div className="stat">
                <small>Packages</small>
                <strong>{dashboardData.summary.packages}</strong>
              </div>
              <div className="stat">
                <small>LSV records</small>
                <strong>{dashboardData.summary.lsv}</strong>
              </div>
            </div>

            <section style={{ marginTop: '28px' }}>
              <p className="eyebrow">Latest records</p>
              <h3>Fetched from the live API</h3>
              <p>Tracking links and record details stay visible, while extra metadata sits behind dropdowns.</p>

              <div className="api-grid">
                <article className="api-card">
                  <header>
                    <div>
                      <strong>Latest letter</strong>
                      <code>{latestLetter?.title || 'No letters available'}</code>
                    </div>
                    <span className={`status-pill ${latestLetter ? 'ok' : 'neutral'}`}>
                      {latestLetter?.status || 'none'}
                    </span>
                  </header>
                  {latestLetter ? (
                    <>
                      <p>{latestLetter.public_url}</p>
                      <p style={{ marginTop: '8px', color: 'var(--muted)' }}>
                        Updated {formatTimestamp(latestLetter.updated_at)}
                      </p>
                      <details className="details-card">
                        <summary>More letter info</summary>
                        <p>Tags: {(latestLetter.tags || []).join(', ') || 'None'}</p>
                        <p>
                          Detail status: {latestLetterDetail?.status || 'unknown'}
                          {latestLetterDetail?.data?.letter?.events?.length ? ` · ${latestLetterDetail.data.letter.events.length} tracking events` : ''}
                        </p>
                      </details>
                    </>
                  ) : (
                    <p>No letter records were returned.</p>
                  )}
                </article>

                <article className="api-card">
                  <header>
                    <div>
                      <strong>Latest package</strong>
                      <code>{latestPackage?.title || 'No packages available'}</code>
                    </div>
                    <span className={`status-pill ${latestPackage ? 'ok' : 'neutral'}`}>
                      {latestPackage?.status || 'none'}
                    </span>
                  </header>
                  {latestPackage ? (
                    <>
                      <p>{latestPackage.public_url}</p>
                      <p style={{ marginTop: '8px' }}>
                        Tracking: {getTrackingLabel(latestPackage)}
                      </p>
                      <p style={{ marginTop: '8px', color: 'var(--muted)' }}>
                        Carrier: {latestPackage.carrier || 'Unknown'} · Weight: {latestPackage.weight || 'Unknown'} lbs
                      </p>
                      <details className="details-card">
                        <summary>Package contents</summary>
                        <p>
                          {latestPackage.contents && latestPackage.contents.length > 0
                            ? `${latestPackage.contents.length} item${latestPackage.contents.length > 1 ? 's' : ''}`
                            : 'No contents listed'}
                        </p>
                        <p>{formatContents(latestPackage.contents)}</p>
                      </details>
                    </>
                  ) : (
                    <p>No package records were returned.</p>
                  )}
                </article>

                <article className="api-card">
                  <header>
                    <div>
                      <strong>Latest LSV record</strong>
                      <code>{latestLsv?.title || 'No LSV records available'}</code>
                    </div>
                    <span className={`status-pill ${latestLsv ? 'ok' : 'neutral'}`}>
                      {latestLsv?.status || 'none'}
                    </span>
                  </header>
                  {latestLsv ? (
                    <>
                      <p>{latestLsv.public_url}</p>
                      <p style={{ marginTop: '8px', color: 'var(--muted)' }}>
                        Type: {latestLsv.type} · Subtype: {latestLsv.subtype || 'n/a'}
                      </p>
                      <p style={{ marginTop: '8px' }}>
                        Tracking: {getTrackingLabel(latestLsv)}
                      </p>
                      <details className="details-card">
                        <summary>LSV details</summary>
                        <p>Record id: {latestLsv.id}</p>
                        <p>Original id: {latestLsv.original_id || 'Unknown'}</p>
                      </details>
                    </>
                  ) : (
                    <p>No LSV records were returned.</p>
                  )}
                </article>
              </div>
            </section>

            <section style={{ marginTop: '28px' }}>
              <p className="eyebrow">Route health</p>
              <h3>What is wired in</h3>
              <p>
                The dashboard also checks the authenticated API routes. The <strong>mail</strong> route is the write endpoint and is marked for manual verification.
              </p>

              <div className="api-grid">
                {diagnostics.routes.map((route) => (
                  <article className="api-card" key={route.key}>
                    <header>
                      <div>
                        <strong>{route.label}</strong>
                        <code>{route.path}</code>
                      </div>
                      <span className={`status-pill ${getProbeClass(route.probe.status)}`}>
                        {route.probe.status}
                      </span>
                    </header>
                    <p>{route.description}</p>
                    <p style={{ marginTop: '8px', color: 'var(--muted)' }}>
                      Method: {route.method} · {route.probe.detail}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <form action="/api/logout" method="POST" style={{ marginTop: '24px' }}>
              <button className="button ghost" type="submit">
                Sign out
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
