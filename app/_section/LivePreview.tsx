"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { SearchInputState } from "../types";
import { SYSTEM_FONTS } from "@/components/shared/typography/fontConstants";

function resolveFont(state: { fontBucket: "system" | "google"; googleFontFamily: string; systemFontIdx: number }): string {
  return state.fontBucket === "google"
    ? `"${state.googleFontFamily}", sans-serif`
    : (SYSTEM_FONTS[state.systemFontIdx]?.css ?? "inherit");
}

function buildShadow(state: { shadowEnabled: boolean; shadowX: number; shadowY: number; shadowBlur: number; shadowSpread: number; shadowColor: string; shadowOpacity: number }): string {
  if (!state.shadowEnabled) return "none";
  const hex = Math.round(state.shadowOpacity * 255).toString(16).padStart(2, "0");
  return `${state.shadowX}px ${state.shadowY}px ${state.shadowBlur}px ${state.shadowSpread}px ${state.shadowColor}${hex}`;
}

function buildRadius(state: { radiusLinked: boolean; radius: number; radiusTL: number; radiusTR: number; radiusBR: number; radiusBL: number }): string {
  return state.radiusLinked
    ? `${state.radius}px`
    : `${state.radiusTL}px ${state.radiusTR}px ${state.radiusBR}px ${state.radiusBL}px`;
}

function shellStyle(state: SearchInputState): CSSProperties {
  const invalid = state.invalid || state.previewState === "invalid";
  return {
    width: state.width,
    minHeight: state.height,
    padding: state.padding,
    gap: state.gap,
    borderRadius: buildRadius(state),
    border: `${state.borderWidth}px solid ${invalid ? "#fb7185" : state.previewState === "focus" ? state.accent : state.border}`,
    boxShadow: buildShadow(state),
    background: state.background,
    color: state.foreground,
    fontFamily: resolveFont(state),
    fontStyle: state.fontStyle,
    textTransform: state.textTransform,
    textDecoration: state.textDecoration,
    letterSpacing: `${state.letterSpacing}${state.letterSpacingUnit}`,
    lineHeight: state.lineHeight,
    opacity: state.disabled || state.previewState === "disabled" ? 0.55 : 1,
    outline: state.previewState === "focus" ? `${state.focusRing}px solid ${state.accent}` : "none",
    transition: state.transitionDuration > 0 ? "all 180ms ease" : "none",
  };
}

export default function LivePreview({ state }: { state: SearchInputState }) {
  const [query, setQuery] = useState(state.value);

  useEffect(() => {
    setQuery(state.value);
  }, [state.value]);

  const invalid = state.invalid || state.previewState === "invalid";
  const message = invalid ? state.errorText : state.showSuccess ? state.successText : state.showHelper ? state.helper : "";
  const datalistId = `${state.id}-suggestions`;
  const summaryId = `${state.id}-summary`;
  const suggestions = useMemo(() => Array.from({ length: state.suggestionCount }, (_, index) => `Suggestion ${index + 1}`), [state.suggestionCount]);
  const summary = `${state.resultCount} result${state.resultCount === 1 ? "" : "s"} for ${query || state.placeholder || "this search"}`;

  return (
    <div style={shellStyle(state)} className="grid content-center">
      <label htmlFor={state.id} style={{ fontSize: state.labelSize, fontWeight: state.fontWeight }}>{state.label}{state.required ? " *" : ""}</label>
      <p className="text-sm" style={{ color: state.muted }}>{state.description}</p>
      <form className="grid gap-2" role="search" onSubmit={(event) => event.preventDefault()}>
        <div className="flex items-center gap-2 rounded-xl border px-3 py-2" style={{ borderColor: invalid ? "#fb7185" : state.border }}>
          {state.showSearchIcon && <span aria-hidden="true">⌕</span>}
          <input id={state.id} name={state.name} title={state.title} tabIndex={state.tabIndex} dir={state.dir} lang={state.lang} type="search" value={query} placeholder={state.placeholder} list={state.showSuggestions ? datalistId : undefined} required={state.required} disabled={state.disabled} readOnly={state.readOnly} autoComplete={state.autocomplete} inputMode={state.inputMode} enterKeyHint={state.enterKeyHint} aria-invalid={invalid || undefined} aria-describedby={summaryId} className="w-full bg-transparent outline-none" style={{ color: state.foreground }} onChange={(event) => setQuery(event.target.value)} />
          {state.showClearAction && <button type="button" aria-label="Clear search" disabled={state.disabled || state.readOnly} onClick={() => setQuery("")}>×</button>}
          <button type="submit" className="rounded-lg px-2 py-1 text-xs font-semibold" style={{ background: state.accent, color: "#ffffff" }}>Search</button>
        </div>
        {state.showSuggestions && (
          <>
            <datalist id={datalistId}>
              {suggestions.map((suggestion) => <option key={suggestion} value={suggestion} />)}
            </datalist>
            <div role="listbox" aria-label={`${state.label} suggestions`} className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => <button key={suggestion} type="button" role="option" aria-selected={suggestion === query} className="rounded-full border px-2 py-1 text-xs" style={{ borderColor: state.border, color: state.foreground }} onClick={() => setQuery(suggestion)}>{suggestion}</button>)}
            </div>
          </>
        )}
        <p id={summaryId} aria-live="polite" className="text-xs" style={{ color: state.muted }}>{summary}</p>
      </form>
      <small style={{ color: invalid ? "#fb7185" : state.showSuccess ? "#22c55e" : state.muted }}>{message}</small>
    </div>
  );
}
