import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { PageTransition } from '@/components/ui/PageTransition';

export const metadata: Metadata = {
  title: 'AutoApply AI - Intelligent Career Operating System',
  description:
    'Autonomous career operating system for multi-source job ingestion, ATS resume tailoring, truthfulness validation, and human-in-the-loop application automation with OAuth authentication.',
  openGraph: {
    title: 'AutoApply AI - Intelligent Career Operating System',
    description:
      'Autonomous career operating system for multi-source job ingestion, ATS resume tailoring, truthfulness validation, and human-in-the-loop application automation with OAuth authentication.'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090d16] text-slate-100 min-h-screen flex antialiased selection:bg-indigo-500 selection:text-white">
        <AuthProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Navbar />
            <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto relative overflow-y-auto">
              <PageTransition>
                {children}
              </PageTransition>
            </main>
          </div>
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}

