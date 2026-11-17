import './globals.css';

export const metadata = {
  title: 'THA Fashion - Virtual Try-On',
  description: 'Coba pakaian secara virtual dengan AI',
};

// ✅ Viewport config untuk mobile (Next.js 14+)
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover', // Penting untuk iPhone dengan notch
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}
