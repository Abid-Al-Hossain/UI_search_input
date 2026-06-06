"use client";

import { useMemo, useState } from "react";
import Input from "@/components/shared/input/Input";
import Select from "@/components/shared/input/Select";
import { SectionCard } from "@/components/shared/layout/SectionCard";
import { SEARCHINPUT_PRESETS } from "../_data/SearchInputPresets";
import type { StudioPreset } from "../types";

const PAGE_SIZE = 8;

type Props = {
  activePresetId: string | null;
  onApply: (preset: StudioPreset) => void;
};

export default function PresetsSection({ activePresetId, onApply }: Props) {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("all");
  const [size, setSize] = useState("all");
  const [page, setPage] = useState(1);
  const families = useMemo(() => ["all", ...Array.from(new Set(SEARCHINPUT_PRESETS.map((preset) => preset.family)))], []);
  const sizes = useMemo(() => ["all", ...Array.from(new Set(SEARCHINPUT_PRESETS.map((preset) => preset.size)))], []);
  const filtered = useMemo(() => SEARCHINPUT_PRESETS.filter((preset) => {
    const haystack = [preset.family, preset.archetype, preset.variant, preset.size, ...preset.tags].join(" ").toLowerCase();
    return haystack.includes(query.toLowerCase()) && (family === "all" || preset.family === family) && (size === "all" || preset.size === size);
  }), [family, query, size]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const hasFilters = query !== "" || family !== "all" || size !== "all";
  const resetFilters = () => {
    setQuery("");
    setFamily("all");
    setSize("all");
    setPage(1);
  };
  const surprise = () => {
    const source = filtered.length ? filtered : SEARCHINPUT_PRESETS;
    onApply(source[Math.floor(Math.random() * source.length)]);
  };

  return (
    <SectionCard title="Presets" subtitle="48 structured full-state presets with search, filters, surprise, and applied-state highlighting.">
      <div className="grid gap-3 sm:grid-cols-3">
        <Input label="Search presets" value={query} onChange={(value) => { setQuery(value); setPage(1); }} />
        <Select label="Family" value={family} options={families} onChange={(value) => { setFamily(value); setPage(1); }} />
        <Select label="Size" value={size} options={sizes} onChange={(value) => { setSize(value); setPage(1); }} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm" aria-live="polite" style={{ color: "var(--muted)" }}>{filtered.length} presets found{activePresetId ? " - one applied" : ""}</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={resetFilters} disabled={!hasFilters} className="rounded-xl border px-4 py-3 text-sm font-semibold transition hover:bg-white/10 disabled:opacity-50" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
            Reset filters
          </button>
          <button type="button" onClick={surprise} className="rounded-xl border px-4 py-3 text-sm font-semibold transition hover:bg-white/10" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
            Surprise me
          </button>
        </div>
      </div>
      <div className="grid gap-3">
        {pageItems.map((preset) => (
          <button key={preset.id} type="button" onClick={() => onApply(preset)} aria-pressed={activePresetId === preset.id} data-preset-id={preset.id} data-applied={activePresetId === preset.id ? "true" : undefined} className="rounded-2xl border p-4 text-left transition hover:bg-white/10" style={{ borderColor: activePresetId === preset.id ? "var(--primary)" : "var(--border)", background: activePresetId === preset.id ? "color-mix(in oklab, var(--primary) 20%, transparent)" : "color-mix(in oklab, var(--card) 65%, transparent)", color: "var(--text)" }}>
            <strong>{preset.archetype}</strong>
            <span className="ml-2 text-xs uppercase tracking-[0.16em]" style={{ color: "var(--muted)" }}>{preset.variant} / {preset.size}</span>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{preset.tags.join(", ")}</p>
          </button>
        ))}
        {!pageItems.length && <p className="rounded-2xl border p-4 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>No presets match the current filters.</p>}
      </div>
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1} className="rounded-xl border px-3 py-2 text-sm disabled:opacity-50" style={{ borderColor: "var(--border)", color: "var(--text)" }}>Previous</button>
        <span className="text-sm" style={{ color: "var(--muted)" }}>Page {currentPage} of {pageCount}</span>
        <button type="button" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={currentPage === pageCount} className="rounded-xl border px-3 py-2 text-sm disabled:opacity-50" style={{ borderColor: "var(--border)", color: "var(--text)" }}>Next</button>
      </div>
    </SectionCard>
  );
}
