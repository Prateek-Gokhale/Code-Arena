import Editor from "@monaco-editor/react";
import { languageToMonaco } from "../utils/formatters";

export default function CodeEditor({ language, value, onChange, theme }) {
  return (
    <Editor
      height="100%"
      language={languageToMonaco(language)}
      theme={theme === "dark" ? "vs-dark" : "light"}
      value={value}
      onChange={(next) => onChange(next || "")}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: "JetBrains Mono, Consolas, monospace",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        padding: { top: 14, bottom: 14 }
      }}
    />
  );
}
