"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function Banner() {
  const animationContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let anim: { destroy: () => void } | null = null;
    let destroyed = false;

    import("lottie-web").then((lottie) => {
      if (destroyed || !animationContainer.current) return;
      anim = lottie.default.loadAnimation({
        container: animationContainer.current,
        renderer: "svg",
        autoplay: true,
        loop: false,
        path: "/lottie/beerBanner.json",
      });
      if (destroyed) anim.destroy();
    });

    return () => {
      destroyed = true;
      anim?.destroy();
    };
  }, []);

  return (
    <>
      <div style={{ backgroundColor: "#3a4047" }} className="-mt-5 overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex items-center pb-4">
          <div className="flex-1 flex flex-col items-center justify-center pt-16 gap-3">
            <h1
              style={{ fontFamily: "var(--font-bebas-neue)" }}
              className="text-white text-4xl sm:text-5xl lg:text-7xl leading-[1.1] text-center"
            >
              SAVE MONEY ON BEER<br />FROM THE BEER STORE
            </h1>
            <Link
              href="/all"
              style={{ fontFamily: "var(--font-bebas-neue)" }}
              className="px-2 py-1 bg-white text-zinc-800 rounded border-1 border-zinc-400 hover:bg-zinc-100 active:translate-y-0.5 transition-all text-xl lg:text-3xl"
            >
              START NOW
            </Link>
          </div>
          <div
            ref={animationContainer}
            className="w-48 sm:w-64 lg:w-80 flex-shrink-0 self-center"
          />
        </div>
      </div>
      {/* Wave transition */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/bottom.svg"
        alt=""
        className="w-full block"
        style={{ marginTop: "-1px" }}
      />
    </>
  );
}
