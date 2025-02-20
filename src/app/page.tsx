import SocialLinks from "@/components/SocialLinks";
import HeroTexts from "@/components/HeroTexts";
import HeroImage from "@/components/HeroImage";
import GithubBtn from "@/components/animation/GithubBtn";
import FramerWrapper from "@/components/animation/FramerWrapper";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const siteConfig = {
  name: "Benny Nottonson",
  description: "I am a Passionate Software Developer",
  ogImage: "https://Benny-Nottonson.vercel.app/og-image.png",
  url: "https://Benny-Nottonson.vercel.app",
}

export default function Home() {
  return (
    <>
      <FramerWrapper className="h-full w-auto flex flex-col justify-start gap-4" y={0} x={-100}>
        <HeroTexts />
        <div className="h-fit w-fit p-4 flex gap-4 items-center">
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="text-base px-5 py-6">
              Resume
              <Download className="mx-1 translate-x-2" />
            </Button>
          </a>
          <SocialLinks />
        </div>
      </FramerWrapper>
      <FramerWrapper className="h-full w-[47%] relative block max-lg:hidden" y={0} x={100}>
        <HeroImage />
      </FramerWrapper>
      <GithubBtn />
    </>
  );
}
