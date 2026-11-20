import { Footer, NavBar, TrendingGallery, MediaDiscover, RecentTrailersGallery } from "../components";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-ink">
      <NavBar />
      <main className="w-full pt-16 sm:pt-[76px]">
        <MediaDiscover />
        <TrendingGallery />
        <RecentTrailersGallery include="both" />
      </main>
      <Footer />
    </div>
  );
}