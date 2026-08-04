import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import './globals.css';

export const metadata = {
  title: 'DayToNightNews • The Fastest Verified News Platform',
  description: 'AI-powered newsroom discovering breaking stories every minute, verifying across 5 independent sources, publishing in under 60 seconds. No fabrication. Always attributed.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,900,50,1&family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#fefcf8] text-[#121212] antialiased selection:bg-[#c41e1a] selection:text-white">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
