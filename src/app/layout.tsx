import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { Loader } from "@/components/layout/Loader";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Cursor } from "@/components/motion/Cursor";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { business } from "@/lib/site";
import { seo, siteUrl } from "@/lib/seo";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: seo.homeTitle,
    template: "%s | Perfect Look Hair Wig House",
  },
  description: seo.homeDescription,
  applicationName: business.fullName,
  category: "Hair replacement",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: business.fullName,
    title: seo.homeTitle,
    description: seo.homeDescription,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: seo.homeTitle, description: seo.homeDescription },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  formatDetection: { telephone: true, address: true },
};

export const viewport: Viewport = {
  themeColor: "#090909",
  colorScheme: "dark",
};

/**
 * Runs before first paint:
 * - marks JS as available (enables hidden start states for scroll reveals)
 * - shows the intro loader at most once every 12 hours per visitor
 * - failsafe: if animations haven't started within 5s, show all content anyway
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;var k='pl-intro',t=Date.now(),l=+localStorage.getItem(k)||0;if(!r&&t-l>432e5){d.setAttribute('data-loader','show');localStorage.setItem(k,String(t))}}catch(e){}setTimeout(function(){if(!d.classList.contains('anim-ready'))d.classList.remove('js')},5000)})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${display.variable} ${sans.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-svh">
        <Loader />
        <a
          href="#main"
          data-native
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-gold focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <ScrollProgress />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileActionBar />
        <SmoothScroll />
        <Cursor />
      </body>
    </html>
  );
}
