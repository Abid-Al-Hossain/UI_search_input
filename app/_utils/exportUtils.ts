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
  return [
    "import * as React from \"react\";",
    "",
    "const state = " + JSON.stringify(state, null, 2) + ";",
    "",
    "export default function SearchInputComponent() {",
    "  return (",
        "    <label htmlFor={state.id}>{state.label}</label>",
    "    <input id={state.id} name={state.name} type=\"search\" value={state.value} placeholder={state.placeholder} required={state.required} disabled={state.disabled} readOnly={state.readOnly} autoComplete={state.autocomplete} inputMode={state.inputMode} enterKeyHint={state.enterKeyHint} onChange={() => undefined} />",
    "  );",
    "}",
    "",
  ].join("\n");
}
