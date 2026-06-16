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
    border: `${state.borderWidth}px solid ${invalid ? state.errorColor : state.previewState === "focus" ? state.accent : state.border}`,
    boxShadow: buildShadow(state),
    background: state.disabled && state.disabledUseCustomColors ? state.disabledBg : state.background,
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

function highlightMatch(text: string, query: string, highlightColor: string) {
  if (!query.trim()) return text;
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <span style={{ color: highlightColor, fontWeight: 700 }}>{text.slice(index, index + query.length)}</span>
      {text.slice(index + query.length)}
    </>
  );
}

export default function LivePreview({ state }: { state: SearchInputState }) {
  const [query, setQuery] = useState(state.value);
  const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null);
  const isLoading = state.loadingSpinnerEnabled && state.previewState === "loading";

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
        <div className="flex items-center gap-2 rounded-xl border px-3 py-2" style={{ borderColor: invalid ? state.errorColor : state.border }}>
          {state.showSearchIcon && <span aria-hidden="true" style={{ color: state.searchIconColor }}>⌕</span>}
          <input id={state.id} name={state.name} title={state.title} tabIndex={state.tabIndex} dir={state.dir} lang={state.lang} type="search" value={query} placeholder={state.placeholder} list={state.showSuggestions ? datalistId : undefined} required={state.required} disabled={state.disabled} readOnly={state.readOnly} autoComplete={state.autocomplete} inputMode={state.inputMode} enterKeyHint={state.enterKeyHint} aria-invalid={invalid || undefined} aria-describedby={summaryId} aria-label={state.ariaLabel || undefined} className="w-full bg-transparent outline-none" style={{ color: state.foreground }} onChange={(event) => setQuery(event.target.value)} />
          {isLoading && <span aria-hidden="true" className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" style={{ color: state.loadingSpinnerColor }} />}
          {state.showClearAction && <button type="button" aria-label="Clear search" disabled={state.disabled || state.readOnly} style={{ color: state.clearIconColor }} onClick={() => setQuery("")}>×</button>}
          <button type="submit" className="rounded-lg px-2 py-1 text-xs font-semibold" style={{ background: state.accent, color: "#ffffff" }}>Search</button>
        </div>
        {state.showSuggestions && (
          <>
            <datalist id={datalistId}>
              {suggestions.map((suggestion) => <option key={suggestion} value={suggestion} />)}
            </datalist>
            <div role="listbox" aria-label={`${state.label} suggestions`} className="flex flex-wrap gap-2 rounded-xl p-2" style={{ background: state.suggestionsBg }}>
              {suggestions.map((suggestion) => {
                const isActive = activeSuggestion === suggestion;
                return (
                  <button
                    key={suggestion}
                    type="button"
                    role="option"
                    aria-selected={suggestion === query}
                    className="rounded-full border px-2 py-1 text-xs"
                    style={{ borderColor: state.border, background: isActive ? state.suggestionActiveBg : "transparent", color: isActive ? state.suggestionActiveText : state.suggestionsText }}
                    onMouseEnter={() => setActiveSuggestion(suggestion)}
                    onMouseLeave={() => setActiveSuggestion((current) => (current === suggestion ? null : current))}
                    onFocus={() => setActiveSuggestion(suggestion)}
                    onBlur={() => setActiveSuggestion((current) => (current === suggestion ? null : current))}
                    onClick={() => setQuery(suggestion)}
                  >
                    {highlightMatch(suggestion, query, state.highlightColor)}
                  </button>
                );
              })}
            </div>
          </>
        )}
        <p id={summaryId} aria-live="polite" className="text-xs" style={{ color: state.muted }}>{summary}</p>
      </form>
      <small style={{ color: invalid ? state.errorColor : state.showSuccess ? state.successColor : state.muted }}>{message}</small>
    </div>
  );
}
