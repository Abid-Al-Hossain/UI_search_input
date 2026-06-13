import type { SearchInputState } from "../types";

export type ExportPayload = {
  fileName: string;
  mimeType: "text/plain;charset=utf-8";
  content: string;
};

export function buildExportPayload(state: SearchInputState, fileName = "search-input") : ExportPayload {
  return {
    fileName: `${fileName || "search-input"}.jsx`,
    mimeType: "text/plain;charset=utf-8",
    content: buildReactCode(state),
  };
}

export function buildReactCode(state: SearchInputState) {
  return `import * as React from "react";

const state = ${JSON.stringify(state, null, 2)};

export default function SearchInputComponent() {
  const [query, setQuery] = React.useState(state.value);
  const invalid = state.invalid || state.previewState === "invalid";
  const message = invalid ? state.errorText : state.showSuccess ? state.successText : state.showHelper ? state.helper : "";
  const datalistId = \`\${state.id}-suggestions\`;
  const summaryId = \`\${state.id}-summary\`;
  const suggestions = Array.from({ length: state.suggestionCount }, (_, index) => \`Suggestion \${index + 1}\`);
  const summary = \`\${state.resultCount} result\${state.resultCount === 1 ? "" : "s"} for \${query || state.placeholder || "this search"}\`;

  return (
    <div
      style={{
        width: state.width,
        minHeight: state.height,
        padding: state.padding,
        display: "grid",
        alignContent: "center",
        gap: state.gap,
        borderRadius: state.radius,
        border: \`\${state.borderWidth}px solid \${invalid ? "#fb7185" : state.previewState === "focus" ? state.accent : state.border}\`,
        boxShadow: \`0 \${Math.round(state.shadow / 3)}px \${state.shadow}px rgba(0,0,0,.28)\`,
        background: state.background,
        color: state.foreground,
        fontFamily: state.fontFamily,
        opacity: state.disabled || state.previewState === "disabled" ? 0.55 : 1,
        outline: state.previewState === "focus" ? \`\${state.focusRing}px solid \${state.accent}\` : "none",
        transition: state.transitionDuration > 0 ? "$1" : "none",
      }}
    >
      <label htmlFor={state.id} style={{ fontSize: state.labelSize, fontWeight: state.fontWeight }}>
        {state.label}{state.required ? " *" : ""}
      </label>
      <p style={{ margin: 0, color: state.muted }}>{state.description}</p>
      <form role="search" style={{ display: "grid", gap: 8 }} onSubmit={(event) => event.preventDefault()}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, borderRadius: 12, border: \`1px solid \${invalid ? "#fb7185" : state.border}\`, padding: "8px 12px" }}>
          {state.showSearchIcon && <span aria-hidden="true">⌕</span>}
          <input
            id={state.id}
            name={state.name}
            title={state.title}
            tabIndex={state.tabIndex}
            dir={state.dir}
            lang={state.lang}
            type="search"
            value={query}
            placeholder={state.placeholder}
            list={state.showSuggestions ? datalistId : undefined}
            required={state.required}
            disabled={state.disabled}
            readOnly={state.readOnly}
            autoComplete={state.autocomplete}
            inputMode={state.inputMode}
            enterKeyHint={state.enterKeyHint}
            aria-invalid={invalid || undefined}
            aria-describedby={summaryId}
            style={{ flex: 1, minWidth: 0, border: 0, outline: 0, background: "transparent", color: state.foreground }}
            onChange={(event) => setQuery(event.target.value)}
          />
          {state.showClearAction && (
            <button type="button" aria-label="Clear search" disabled={state.disabled || state.readOnly} onClick={() => setQuery("")}>
              ×
            </button>
          )}
          <button type="submit" style={{ border: 0, borderRadius: 8, padding: "4px 8px", background: state.accent, color: "#ffffff", fontWeight: 700 }}>
            Search
          </button>
        </div>
        {state.showSuggestions && (
          <>
            <datalist id={datalistId}>
              {suggestions.map((suggestion) => (
                <option key={suggestion} value={suggestion} />
              ))}
            </datalist>
            <div role="listbox" aria-label={\`\${state.label} suggestions\`} style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {suggestions.map((suggestion) => (
                <button key={suggestion} type="button" role="option" aria-selected={suggestion === query} style={{ border: \`1px solid \${state.border}\`, borderRadius: 999, padding: "4px 8px", color: state.foreground, background: "transparent" }} onClick={() => setQuery(suggestion)}>
                  {suggestion}
                </button>
              ))}
            </div>
          </>
        )}
        <p id={summaryId} aria-live="polite" style={{ margin: 0, color: state.muted, fontSize: 12 }}>
          {summary}
        </p>
      </form>
      <small style={{ color: invalid ? "#fb7185" : state.showSuccess ? "#22c55e" : state.muted }}>{message}</small>
    </div>
  );
}
`;
}
