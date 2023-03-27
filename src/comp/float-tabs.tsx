import { css, cx } from "@emotion/css";
import { column } from "@worktools/flex-styles";

import baseWgsl from "../../shaders/base.wgsl?raw";
import baseFlowerWgsl from "../../shaders/base-flower.wgsl?raw";
import baseRepeatWgsl from "../../shaders/base-repeat.wgsl?raw";
import spiralWgsl from "../../shaders/spiral.wgsl?raw";
import juliaWgsl from "../../shaders/julia.wgsl?raw";
import latticeWgsl from "../../shaders/lattice.wgsl?raw";

const floatTabs: {
  title: string;
  code: string;
}[] = [
  { title: "Base", code: baseWgsl },
  { title: "Base Flower", code: baseFlowerWgsl },
  { title: "Repeat", code: baseRepeatWgsl },
  { title: "Spiral", code: spiralWgsl },
  { title: "Julia", code: juliaWgsl },
  { title: "Lattice", code: latticeWgsl },
];

export function FloatTabs({
  onSelect,
  onClose,
}: {
  onSelect: (tab: { title: string; code: string }) => void;
  onClose: () => void;
}) {
  return (
    <div className={cx(cssTabs)}>
      <div className={cx(column, cssList)}>
        {floatTabs.map((tab, idx) => (
          <div
            key={idx}
            className={cssTab}
            onClick={() => {
              onSelect(tab);
            }}
          >
            {tab.title}
          </div>
        ))}
      </div>
      <div
        className={cssClose}
        onClick={() => {
          onClose();
        }}
      >
        Close
      </div>
    </div>
  );
}

export default FloatTabs;

const cssTabs = css`
  position: fixed;
  top: 40px;
  right: calc(40vw - 160px);
  z-index: 100;
`;

const cssTab = css`
  text-align: center;
  width: 200px;
  padding: 12px 24px;
  background: #eee;
  border-radius: 4px;
  font-size: 20px;
  font-family: Josefin Sans, Helvetica, sans-serif;
  cursor: pointer;
  opacity: 0.72;
  transition-property: opacity, transform;
  transition-duration: 0.2s;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.3);
  color: #333;

  &:hover {
    opacity: 0.94;
  }

  &:active {
    opacity: 1;
    transition-duration: 0s;
    transform: scale(1.02);
  }
`;

const cssList = css`
  gap: 16px;
`;

const cssClose = css`
  margin-top: 16px;
  font-family: Josefin Sans, Helvetica, sans-serif;
  color: #ccc;
  cursor: pointer;
  text-align: right;
  padding: 0 12px;

  &:hover {
    color: #fff;
  }
`;
