"use client";
import { SectionCard } from "@/components/shared/layout/SectionCard";
import ColorControl from "@/components/shared/color/ColorControl";
import type { SearchInputState } from "../types";

type Props = { state: SearchInputState; update: <K extends keyof SearchInputState>(key: K, value: SearchInputState[K]) => void };

export default function ColorsSection({ state, update }: Props) {
  return (
    <div className="space-y-4">
      <SectionCard title="Shell" subtitle="Base container colors.">
      <div className="space-y-4">
        <ColorControl label="Background" value={state.background} onChange={(v) => update("background", v)} />
        <ColorControl label="Foreground" value={state.foreground} onChange={(v) => update("foreground", v)} />
        <ColorControl label="Accent" value={state.accent} onChange={(v) => update("accent", v)} />
        <ColorControl label="Muted" value={state.muted} onChange={(v) => update("muted", v)} />
        <ColorControl label="Border" value={state.border} onChange={(v) => update("border", v)} />
      </div>
    </SectionCard>
      <SectionCard title="Icons" subtitle="Search and clear icon colors.">
      <div className="space-y-4">
        <ColorControl label="Search icon" value={state.searchIconColor} onChange={(v) => update("searchIconColor", v)} />
        <ColorControl label="Clear icon" value={state.clearIconColor} onChange={(v) => update("clearIconColor", v)} />
        <ColorControl label="Loading spinner" value={state.loadingSpinnerColor} onChange={(v) => update("loadingSpinnerColor", v)} />
      </div>
    </SectionCard>
      <SectionCard title="Suggestions" subtitle="Suggestion list panel and matched-text highlight.">
      <div className="space-y-4">
        <ColorControl label="Panel background" value={state.suggestionsBg} onChange={(v) => update("suggestionsBg", v)} />
        <ColorControl label="Text" value={state.suggestionsText} onChange={(v) => update("suggestionsText", v)} />
        <ColorControl label="Active background" value={state.suggestionActiveBg} onChange={(v) => update("suggestionActiveBg", v)} />
        <ColorControl label="Active text" value={state.suggestionActiveText} onChange={(v) => update("suggestionActiveText", v)} />
        <ColorControl label="Match highlight" value={state.highlightColor} onChange={(v) => update("highlightColor", v)} />
      </div>
    </SectionCard>
      <SectionCard title="State Colors" subtitle="Status-driven accent colors.">
      <div className="space-y-4">
        <ColorControl label="Error" value={state.errorColor} onChange={(v) => update("errorColor", v)} />
        <ColorControl label="Success" value={state.successColor} onChange={(v) => update("successColor", v)} />
      </div>
    </SectionCard>
    </div>
  );
}
