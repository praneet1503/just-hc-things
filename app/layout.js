import './globals.css';

export const metadata = {
  title: 'Parcel Playground',
  description: 'A playful, kid-friendly mailbox dashboard with a grown-up login gate.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
