import HomeHero from "@/components/sections/home/HomeHero";
import HomeMission from "@/components/sections/home/HomeMission";
import HomeHighlights from "@/components/sections/home/HomeHighlights";
import HomeTestimonialPreview from "@/components/sections/home/HomeTestimonialPreview";
import InstagramFeed from "@/components/media/InstagramFeed";
import HomeCTA from "@/components/sections/home/HomeCTA";
import { instagramPosts } from "@/lib/constants";

export default function Home() {
  return (
    <>
      <HomeHero />
      <HomeMission />
      <HomeHighlights />
      <HomeTestimonialPreview />
      <InstagramFeed postUrls={[...instagramPosts]} />
      <HomeCTA />
    </>
  );
}
