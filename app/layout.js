import { BundleProvider } from '@/context/BundleContext';
import './globals.css';

export const metadata = {
  title: 'EcomExperts - Bundle Builder',
  description: 'Custom security system bundle builder',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <BundleProvider>
          {children}
        </BundleProvider>
      </body>
    </html>
  );
}