"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Input from "@/components/shared/input/Input";
import Slider from "@/components/shared/input/Slider";
import Switch from "@/components/shared/input/Switch";
import type { SearchInputState } from "../types";

type Props = {
  state: SearchInputState;
  update: <K extends keyof SearchInputState>(key: K, value: SearchInputState[K]) => void;
};

export default function FieldSection({ state, update }: Props) {
  return (
    <SectionCard title="Field" subtitle="Field controls that are native, preview-honest, and React-export-honest.">
      <Input label="Value" value={state.value} onChange={(value) => update("value", value)} />
      <Input label="Placeholder" value={state.placeholder} onChange={(value) => update("placeholder", value)} />
      <Slider label="Result count" value={state.resultCount} min={0} max={40} step={1} onChange={(value) => update("resultCount", value)} />
      <Slider label="Suggestions" value={state.suggestionCount} min={0} max={8} step={1} onChange={(value) => update("suggestionCount", value)} />
      <Switch label="Search icon" checked={state.showSearchIcon} onChange={(value) => update("showSearchIcon", value)} />
      <Switch label="Clear action" checked={state.showClearAction} onChange={(value) => update("showClearAction", value)} />
      <Switch label="Suggestions" checked={state.showSuggestions} onChange={(value) => update("showSuggestions", value)} />
    </SectionCard>
  );
}
