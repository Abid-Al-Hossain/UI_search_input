"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Slider from "@/components/shared/input/Slider";
import type { SearchInputState } from "../types";

type Props = {
  state: SearchInputState;
  update: <K extends keyof SearchInputState>(key: K, value: SearchInputState[K]) => void;
};

export default function SizingSection({ state, update }: Props) {
  return (
    <SectionCard title="Sizing" subtitle="Sizing controls that are native, preview-honest, and React-export-honest.">
      <Slider label="Width" value={state.width} min={260} max={760} step={1} onChange={(value) => update("width", value)} />
      <Slider label="Height" value={state.height} min={80} max={360} step={1} onChange={(value) => update("height", value)} />
    </SectionCard>
  );
}
