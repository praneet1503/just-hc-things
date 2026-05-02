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
            <p className="eyebrow">Parcel Playground</p>
            <h1>Welcome to the Mailbox Fun Zone!</h1>
            <p>
              Track letters, packages, and surprises with a bright, kid-friendly
              dashboard. Grown-ups can hop in below.
            </p>
            <div className="sticker-row" aria-label="Playful badges">
              <span className="sticker">✨ Sparkly updates</span>
              <span className="sticker">📬 Mail magic</span>
              <span className="sticker">🧁 Sweet rewards</span>
            </div>
          </div>

          <div className="feature-grid" aria-label="Highlights">
            <div className="feature">
              <strong>Colorful quests</strong>
              <span>Follow every delivery like a treasure hunt.</span>
            </div>
            <div className="feature">
              <strong>Friendly helpers</strong>
              <span>Clear status pills keep surprises easy to spot.</span>
            </div>
            <div className="feature">
              <strong>Ready for fun</strong>
              <span>Pop in new adventures whenever you like.</span>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="card">
            <h2>Grown-up sign in</h2>
            <p>Grown-ups: enter the secret email and password to continue.</p>

            {message ? <div className="alert">{message}</div> : null}

            <form className="form" method="POST" action="/api/login">
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Grown-up email"
                  defaultValue={process.env.LOGIN_EMAIL || ''}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="password">Secret password</label>
                <PasswordField id="password" name="password" placeholder="Type the secret password" />
              </div>

              <button className="button" type="submit">
                Open the clubhouse
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
