"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Input from "@/components/shared/input/Input";
import Select from "@/components/shared/input/Select";
import Switch from "@/components/shared/input/Switch";
import type { SearchInputState } from "../types";

type Props = {
  state: SearchInputState;
  update: <K extends keyof SearchInputState>(key: K, value: SearchInputState[K]) => void;
};

export default function BehaviorSection({ state, update }: Props) {
  return (
    <SectionCard title="Behavior" subtitle="Behavior controls that are native, preview-honest, and React-export-honest.">
      <div className="space-y-4">
      <Input label="Autocomplete" value={state.autocomplete} onChange={(value) => update("autocomplete", value)} />
      <Select label="Input mode" value={state.inputMode} options={[
  "none",
  "text",
  "numeric",
  "decimal",
  "search",
  "email",
  "tel",
  "url"
]} onChange={(value) => update("inputMode", value)} />
      <Select label="Enter key hint" value={state.enterKeyHint} options={[
  "enter",
  "done",
  "go",
  "next",
  "previous",
  "search",
  "send"
]} onChange={(value) => update("enterKeyHint", value)} />
    </div>
    </SectionCard>
  );
}
