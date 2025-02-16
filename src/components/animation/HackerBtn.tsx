"use client"
import { useState, useEffect, useRef } from "react";
import { Download } from "lucide-react";
import { Button } from "../ui/button";

const HackerBtn = ({ label }: { label: string }) => {
  const [displayChars, setDisplayChars] = useState<string[]>(label.split(""));
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  const randomChar = () => {
    const charset = "abcdefghijklmnopqrstuvwxyz"
    return charset[Math.floor(Math.random() * charset.length)];
  };

  const startScrambling = () => {
    const length = label.length;
    const revealed = new Array(length).fill(false);
    let revealedCount = 0;

    setDisplayChars(Array.from({ length }, () => randomChar()));

    intervalId.current = setInterval(() => {
      setDisplayChars((prev) =>
        prev.map((char, i) =>
          revealed[i] ? label[i] : randomChar()
        )
      );
    }, 30);

    for (let i = 0; i < length; i++) {
      const delay = 50 + Math.random() * 300;
      setTimeout(() => {
        revealed[i] = true;
        setDisplayChars((prev) => {
          const newChars = [...prev];
          newChars[i] = label[i];
          return newChars;
        });
        revealedCount++;
        if (revealedCount === length && intervalId.current) {
          clearInterval(intervalId.current);
        }
      }, delay);
    }
  };

  useEffect(() => {
    setDisplayChars(label.split(""));
  }, [label]);

  return (
    <Button
      size="lg"
      className="text-base px-5 py-6"
      onMouseEnter={startScrambling}
    >
      <Download className="mx-1" />
      {displayChars.join("")}
    </Button>
  );
};

export default HackerBtn;
