"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/all", label: "ALL BEER PRICES" },
  { href: "/value", label: "BEST VALUE ANALYZER" },
  { href: "/about", label: "ABOUT" },
];

export default function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{ backgroundColor: "#212529" }} className="text-white relative z-10">
      <div className="px-3 sm:px-6">
        <div className="flex h-20 items-center justify-between">

          {/* Logo + desktop links side by side */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/"
              style={{ fontFamily: "var(--font-bebas-neue)", color: "#e99a2c", fontSize: "44px", lineHeight: 1 }}
              className="hover:opacity-80 transition-opacity"
            >
              BEER BOSS
            </Link>
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "26px" }}
                className={`px-3 py-1 rounded transition-colors ${
                  pathname?.startsWith(href)
                    ? "text-white bg-white/10"
                    : "text-zinc-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile: logo + hamburger */}
          <Link
            href="/"
            style={{ fontFamily: "var(--font-bebas-neue)", color: "#e99a2c", fontSize: "44px", lineHeight: 1 }}
            className="sm:hidden hover:opacity-80 transition-opacity"
          >
            BEER BOSS
          </Link>
          <button
            className="sm:hidden rounded-md p-2 text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden pb-3 space-y-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "24px" }}
                className={`block px-3 py-1 rounded transition-colors ${
                  pathname?.startsWith(href)
                    ? "text-white bg-white/10"
                    : "text-zinc-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
