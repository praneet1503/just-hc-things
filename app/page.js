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
      <div className="shell auth-shell">
        <section className="panel">
          <div className="card">
            <h1>Mailpheus sign in</h1>
            <p>Grown-ups, enter your email and password to access Mailpheus.</p>

            {message ? <div className="alert">{message}</div> : null}

            <form className="form" method="POST" action="/api/login">
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Grown-up email"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="password">Grown-up password</label>
                <PasswordField id="password" name="password" placeholder="Type the grown-up password" />
              </div>

              <button className="button" type="submit">
                Enter Mailpheus
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
