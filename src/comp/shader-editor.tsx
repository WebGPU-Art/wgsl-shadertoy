import { useEffect, useState } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { css, cx } from "@emotion/css";
import { rowParted, expand, column } from "@worktools/flex-styles";

function ShaderEditor(props: {
  code: string;
  onChange: (code: string) => void;
}) {
  let [localCode, setLocalCode] = useState(props.code);

  return (
    <div className={cx(cssEditor, column)}>
      <div className={rowParted}>
        <button
          onClick={() => {
            props.onChange(localCode);
          }}
        >
          send
        </button>
        <div>TODO</div>
      </div>
      <CodeEditor
        value={localCode}
        language="rust"
        placeholder="Please enter JS code."
        onChange={(evn) => {
          setLocalCode(evn.target.value);
        }}
        padding={15}
        style={{
          fontSize: 12,
          flex: 1,
          borderRadius: "4px",
          fontFamily:
            "Source Code Pro,ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
        }}
      />
    </div>
  );
}

export default ShaderEditor;

const cssEditor = css`
  opacity: 0.3;
  transition-duration: 200ms;
  position: absolute;
  top: 8px;
  right: 8px;
  bottom: 8px;
  width: 40vw;
  border-radius: 8px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.3);
  backgroundcolor: #fff;

  &:hover {
    opacity: 0.9;
  }
`;
