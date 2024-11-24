import { Background } from "@/components/background/background";
import { memo } from "react";

const navigation = [
  // { name: "Projects", href: "/projects" },
  // { name: "Contact", href: "/contact" },
  { name: "Resume", href: "Benny Nottonson Resume.pdf" },
];
const styles = {
  container:
    "flex flex-col items-center justify-center w-full h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black",
  divider:
    "hidden w-full h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0",
  title:
    "select-none z-10 text-4xl text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-8xl whitespace-nowrap bg-clip-text",
  bio: "my-16 text-center animate-fade-in mx-16",
  link: "underline duration-500 hover:text-zinc-300",
};

const Divider = memo(() => <div className={styles.divider} />);
Divider.displayName = "Divider";
const Bio = memo(() => (
  <div className={styles.bio}>
    <h2 className="text-sm text-zinc-500">
      Hi, my name is Benny
      <br />
      I&apos;m currently working at{" "}
      <a
        href="https://www.selleb.com/"
        className={styles.link}
        rel="noopener noreferrer"
      >
        Selleb
      </a>
    </h2>
  </div>
));
Bio.displayName = "Bio";
const Nav = memo(() => (
  <nav className="my-16 animate-fade-in">
    <ul className="flex flex-row items-center justify-center gap-4">
      {navigation.map((item) => (
        <a
          key={item.href}
          href={item.href}
          target={item.href === "Tech.pdf" ? "_blank" : "_self"}
          className="text-sm duration-500 text-zinc-500 hover:text-zinc-300"
        >
          {item.name}
        </a>
      ))}
    </ul>
  </nav>
));
Nav.displayName = "Nav";
const Home = () => (
  <div className={styles.container}>
    <Background quantity={5000} />
    <Nav />
    <Divider />
    <h1 className={styles.title}>Benny Nottonson</h1>
    <Divider />
    <Bio />
  </div>
);
Home.displayName = "Home";
export default Home;
