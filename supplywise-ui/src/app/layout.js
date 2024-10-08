import localFont from "next/font/local";
import 'bootstrap/dist/css/bootstrap.css';
import "./globals.css";
import Navbar from "./components/navbar";
import BootstrapClient from './components/bootstrapClient';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "SupplyWise",
  description: "Your solution for supply management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BootstrapClient />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
