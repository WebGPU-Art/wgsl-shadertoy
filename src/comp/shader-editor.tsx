import { useEffect, useState } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { css, cx } from "@emotion/css";
import { rowParted, expand, column, rowMiddle } from "@worktools/flex-styles";

function ShaderEditor(props: {
  code: string;
  onChange: (code: string) => void;
}) {
  let [localCode, setLocalCode] = useState(props.code);

  return (
    <div className={cx(column, cssEditor)}>
      <div className={cssEditorWrapper}>
        <CodeEditor
          value={localCode}
          language="rust"
          placeholder="Please enter JS code."
          onChange={(evn) => {
            setLocalCode(evn.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key == "Enter" && (event.ctrlKey || event.metaKey)) {
              props.onChange(localCode);
              event.preventDefault();
            }

            if (event.key == "s" && (event.ctrlKey || event.metaKey)) {
              props.onChange(localCode);
              event.preventDefault();
            }
          }}
          padding={15}
          style={{
            fontSize: 12,
            // flex: 1,
            borderRadius: "4px",
            overflow: "auto",
            fontFamily:
              "Source Code Pro,ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
          }}
        />
      </div>
      <div className={cx(rowMiddle, cssHeader)}>
        <button
          className={cssButton}
          onClick={() => {
            props.onChange(localCode);
          }}
        >
          Submit (Command+s)
        </button>
        <div>
          <a
            href="https://github.com/Triadica/wgsl-shadertoy"
            target="_blank"
            className={cssLink}
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}

export default ShaderEditor;

const cssEditor = css`
  opacity: 0.3;
  transition-duration: 200ms;
  position: absolute;
  top: 0px;
  right: -20vw;
  bottom: 0px;
  width: 40vw;
  border-radius: 8px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.3);
  background-color: #fff;
  overflow: auto;

  &:hover {
    opacity: 0.9;
    right: 0px;
  }
`;

const cssButton = css`
  cursor: pointer;
`;

const cssHeader = css`
  padding: 6px;
  justify-content: flex-end;
  gap: 6px;
  position: absolute;
  bottom: 8px;
  right: 8px;
  opacity: 0.5;
  transition-duration: 200ms;

  &:hover {
    opacity: 1;
  }
`;

const cssLink = css`
  color: #aaf;
  font-family: Helvetica Neue, Serif;
  padding: 2px 8px;
  font-size: 12px;
`;

const cssEditorWrapper = css`
  flex: 1;
  overflow: auto;
  padding-bottom: 120px;
`;
