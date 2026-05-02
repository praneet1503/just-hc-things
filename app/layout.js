import './globals.css';

export const metadata = {
  title: 'Parcel Checker',
  description: 'A small Next.js login demo for parcel testing.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}