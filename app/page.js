import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PasswordField from './components/password-field';

export default async function HomePage({ searchParams }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('parcel_auth');
  const resolvedSearchParams = await searchParams;

  if (sessionCookie?.value === '1') {
    redirect('/dashboard');
  }

  const error = resolvedSearchParams?.error;
  const message =
    error === 'invalid'
      ? 'That password did not match.'
      : error === 'misconfigured'
        ? 'LOGIN_EMAIL or LOGIN_PASSWORD is not set in your environment.'
        : error === 'session'
          ? 'Please sign in again.'
          : '';

  return (
    <main className="page">
      <div className="shell">
        <section className="hero">
          <div>
            <p className="eyebrow">Parcel Checker</p>
            <h1>Fast login gate for the Next.js version.</h1>
            <p>
              A small, focused web app with a server-side password check and a
              clean dashboard handoff.
            </p>
          </div>

          <div className="feature-grid" aria-label="Highlights">
            <div className="feature">
              <strong>Next.js</strong>
              <span>App router, route handlers, and server rendering.</span>
            </div>
            <div className="feature">
              <strong>Cookie gate</strong>
              <span>Simple sign-in state without the Express server.</span>
            </div>
            <div className="feature">
              <strong>Ready to extend</strong>
              <span>Drop in the parcel UI when you are ready.</span>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="card">
            <h2>Sign in</h2>
            <p>Use the email and password from your environment file.</p>

            {message ? <div className="alert">{message}</div> : null}

            <form className="form" method="POST" action="/api/login">
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  defaultValue={process.env.LOGIN_EMAIL || ''}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>
                <PasswordField id="password" name="password" placeholder="Enter password" />
              </div>

              <button className="button" type="submit">
                Enter dashboard
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}