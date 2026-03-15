"use client";

import * as Slider from "@radix-ui/react-slider";

interface Props {
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export default function AbvSlider({ value, onChange }: Props) {
  const [min, max] = value;
  const isDefault = min === 0 && max === 15;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-700">ABV</span>
        <span className="text-sm text-zinc-500">
          {isDefault ? "All" : `${min}% – ${max}%`}
        </span>
      </div>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        min={0}
        max={15}
        step={0.5}
        value={value}
        onValueChange={(v) => onChange([v[0], v[1]] as [number, number])}
      >
        <Slider.Track className="bg-zinc-200 relative grow rounded-full h-1.5">
          <Slider.Range className="absolute bg-amber-500 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-4 h-4 bg-white border-2 border-amber-500 rounded-full shadow hover:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 cursor-pointer"
          aria-label="Minimum ABV"
        />
        <Slider.Thumb
          className="block w-4 h-4 bg-white border-2 border-amber-500 rounded-full shadow hover:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 cursor-pointer"
          aria-label="Maximum ABV"
        />
      </Slider.Root>
      <div className="flex justify-between text-xs text-zinc-400">
        <span>0%</span>
        <span>15%</span>
      </div>
    </div>
  );
}
