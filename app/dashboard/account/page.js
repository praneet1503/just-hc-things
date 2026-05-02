import { getApiDiagnostics, getMailDashboardData } from '../../../lib/parcel-api';

function getProbeClass(status) {
  if (status === 'ok') {
    return 'ok';
  }

  if (status === 'auth-needed') {
    return 'warn';
  }

  return 'neutral';
}

export default async function AccountPage() {
  const [diagnostics, dashboardData] = await Promise.all([
    getApiDiagnostics(),
    getMailDashboardData(),
  ]);

  return (
    <section className="panel">
      <div className="card">
        <p className="eyebrow">Account</p>
        <h2>Clubhouse Account</h2>
        <p>
          Live records are fetched from <strong>{dashboardData.baseUrl || 'the configured API'}</strong> and summarized
          below.
        </p>

        <div className="stack" aria-label="Status">
          <div className="stat">
            <small>Status</small>
            <strong>Authenticated</strong>
          </div>
          <div className="stat">
            <small>Grown-up email</small>
            <strong>{process.env.LOGIN_EMAIL || 'not configured'}</strong>
          </div>
          <div className="stat">
            <small>Member badge number</small>
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

        <section className="section-stack">
          <p className="eyebrow">Helper routes</p>
          <h3>Behind-the-scenes helpers</h3>
          <p>
            The dashboard also checks the authenticated API routes. The <strong>mail</strong> route is the write
            endpoint and is marked for manual verification.
          </p>

          <div className="api-grid">
            {diagnostics.routes.map((route) => (
              <article className="api-card" key={route.key}>
                <header>
                  <div>
                    <strong>{route.label}</strong>
                    <code>{route.path}</code>
                  </div>
                  <span className={`status-pill ${getProbeClass(route.probe.status)}`}>{route.probe.status}</span>
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
            Wave goodbye
          </button>
        </form>
      </div>
    </section>
  );
}
