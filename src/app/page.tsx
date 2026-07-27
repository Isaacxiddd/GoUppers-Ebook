import { SiteHeader } from "@/components/site-header";
import { BookScrollScene } from "@/components/book-scroll-scene";
import { TrustStrip } from "@/components/trust-strip";
import { Benefits } from "@/components/benefits";
import { ForWhom } from "@/components/for-whom";
import { Testimonials } from "@/components/testimonials";
import { PricingCta } from "@/components/pricing-cta";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <BookScrollScene />
        <TrustStrip />
        <Benefits />
        <ForWhom />
        <Testimonials />
        <PricingCta />
      </main>
      <SiteFooter />
    </>
  );
}
