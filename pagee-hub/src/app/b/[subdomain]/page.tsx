import { notFound } from "next/navigation";
import { BusinessPageView } from "@/components/business/business-page-view";
import { hasSupabaseEnv, supabaseRest } from "@/lib/supabase";

export default async function PublicBusinessPage({ params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params;

  if (!hasSupabaseEnv) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <p className="text-xl font-semibold">Configure Supabase environment variables to load public pages.</p>
      </main>
    );
  }

  const pageResult = await supabaseRest("BusinessPages", {
    query: `subdomain=eq.${encodeURIComponent(subdomain)}&limit=1`
  });
  const page = pageResult.data?.[0];

  if (!page) {
    notFound();
  }

  const reviewsResult = await supabaseRest("Reviews", {
    query: `business_id=eq.${page.id}&order=created_at.desc`
  });

  return <BusinessPageView page={page} reviews={reviewsResult.data ?? []} />;
}
