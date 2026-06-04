"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Slider from "@/components/shared/input/Slider";
import type { SearchInputState } from "../types";

type Props = {
  state: SearchInputState;
  update: <K extends keyof SearchInputState>(key: K, value: SearchInputState[K]) => void;
};

export default function FocusSection({ state, update }: Props) {
  return (
    <SectionCard title="Focus" subtitle="Focus controls that are native, preview-honest, and React-export-honest.">
      <Slider label="Focus ring" value={state.focusRing} min={0} max={8} step={1} onChange={(value) => update("focusRing", value)} />
    </SectionCard>
  );
}
