import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";
import { SamplePreviews } from "@/components/landing/sample-previews";
import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Features />
        <SamplePreviews />
      </main>
      <SiteFooter />
    </>
  );
}
