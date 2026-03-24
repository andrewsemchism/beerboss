"use client";

import { useState, useRef, useEffect, useMemo } from "react";

interface Props {
  allNames: string[];
  selected: string[];
  onChange: (names: string[]) => void;
  placeholder?: string;
  multi?: boolean;
}

export default function BeerCombobox({
  allNames,
  selected,
  onChange,
  placeholder = "Search beers...",
  multi = true,
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return allNames.slice(0, 50);
    const q = query.toLowerCase();
    return allNames.filter((n) => n.toLowerCase().includes(q)).slice(0, 50);
  }, [allNames, query]);

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  function toggle(name: string) {
    if (!multi) {
      onChange([name]);
      setQuery(name);
      setOpen(false);
      return;
    }
    if (selected.includes(name)) {
      onChange(selected.filter((n) => n !== name));
    } else {
      onChange([...selected, name]);
    }
    setQuery("");
    inputRef.current?.focus();
  }

  function remove(name: string) {
    onChange(selected.filter((n) => n !== name));
  }

  const displayValue = !multi && selected.length > 0 ? selected[0] : query;

  return (
    <div ref={containerRef} className="relative">
      {/* Selected chips (multi only) */}
      {multi && selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {selected.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full"
            >
              {name}
              <button
                onClick={() => remove(name)}
                className="hover:text-amber-600 leading-none cursor-pointer px-1 -mx-1 text-base"
                aria-label={`Remove ${name}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={displayValue}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          if (!multi) onChange([]);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
      />

      {/* Dropdown */}
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-zinc-200 bg-white shadow-lg text-sm">
          {filtered.map((name) => {
            const isSelected = selected.includes(name);
            return (
              <li key={name}>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    toggle(name);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-amber-50 ${
                    isSelected ? "bg-amber-50 font-medium text-amber-800" : "text-zinc-800"
                  }`}
                >
                  {isSelected && multi && <span className="mr-1 text-amber-600">✓</span>}
                  {name}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
