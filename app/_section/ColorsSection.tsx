"use client";
import { SectionCard } from "@/components/shared/layout/SectionCard";
import ColorControl from "@/components/shared/color/ColorControl";
import type { SearchInputState } from "../types";

type Props = { state: SearchInputState; update: <K extends keyof SearchInputState>(key: K, value: SearchInputState[K]) => void };

export default function ColorsSection({ state, update }: Props) {
  return (
    <div className="space-y-4">
      <SectionCard title="Shell" subtitle="Base container colors.">
        <ColorControl label="Background" value={state.background} onChange={(v) => update("background", v)} />
        <ColorControl label="Foreground" value={state.foreground} onChange={(v) => update("foreground", v)} />
        <ColorControl label="Accent" value={state.accent} onChange={(v) => update("accent", v)} />
        <ColorControl label="Muted" value={state.muted} onChange={(v) => update("muted", v)} />
        <ColorControl label="Border" value={state.border} onChange={(v) => update("border", v)} />
      </SectionCard>
      <SectionCard title="State Colors" subtitle="Status-driven accent colors.">
        <ColorControl label="Error" value={state.errorColor} onChange={(v) => update("errorColor", v)} />
        <ColorControl label="Success" value={state.successColor} onChange={(v) => update("successColor", v)} />
      </SectionCard>
    </div>
  );
}
