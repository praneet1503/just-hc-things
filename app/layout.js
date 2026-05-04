import './globals.css';

export const metadata = {
  title: 'Mailpheus',
  description: 'A playful, kid-friendly Mailpheus dashboard with a grown-up login gate.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
