import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('parcel_auth');

  if (sessionCookie?.value !== '1') {
    redirect('/?error=session');
  }

  return (
    <main className="page">
      <div className="shell dashboard-shell">
        <aside className="dashboard-nav" aria-label="Dashboard navigation">
          <div className="nav-card">
            <p className="nav-title">Mailbox Menu</p>
            <nav className="nav-links">
              <Link href="/dashboard/account">Account</Link>
              <Link href="/dashboard/mail">Mail</Link>
              <Link href="/dashboard/parcels">Parcels</Link>
            </nav>
          </div>
        </aside>
        <div className="dashboard-content">{children}</div>
      </div>
    </main>
  );
}
