import type { CSSProperties } from "react";

export function IconDefinitions() {
  return (
    <>
      <svg style={{ display: "none" } as CSSProperties}>
        <symbol id="arrow" viewBox="0 0 24 24">
          <path d="M5 12h14m-5-5 5 5-5 5"></path>
        </symbol>
        <symbol id="chevron" viewBox="0 0 24 24">
          <path d="m8 5 7 7-7 7"></path>
        </symbol>
        <symbol id="phone" viewBox="0 0 24 24">
          <path d="m7 3 3 5-2 2c1 3 3 5 6 6l2-2 5 3c0 3-2 4-4 4C9 20 4 15 3 7c0-2 1-4 4-4Z"></path>
        </symbol>
        <symbol id="sun" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"></path>
        </symbol>
        <symbol id="play" viewBox="0 0 24 24">
          <path d="m9 5 10 7-10 7Z"></path>
        </symbol>
        <symbol id="shield" viewBox="0 0 24 24">
          <path d="m12 2 9 4v6c0 5-5 8-9 10-4-2-9-5-9-10V6Z"></path>
        </symbol>
        <symbol id="gear" viewBox="0 0 24 24">
          <path
            d="m9 3 1-2h4l1 2 3 1 2-1 3 4-2 2v5l2 2-3 4-2-1-3 1-1 3h-4l-1-3-3-1-2 1-3-4 2-2V9L1 7l3-4 2 1Z"
            transform="translate(1 1) scale(.91)"
          ></path>
          <circle cx="12" cy="12" r="3"></circle>
        </symbol>
        <symbol id="tool" viewBox="0 0 24 24">
          <path d="m14 6 4-4a6 6 0 0 0-7 8L3 18a2.1 2.1 0 0 0 3 3l8-8a6 6 0 0 0 8-7l-4 4Z"></path>
        </symbol>
        <symbol id="pause" viewBox="0 0 24 24">
          <path d="M9 5v14M15 5v14"></path>
        </symbol>
      </svg>
      <svg
        className="shape-definitions"
        width="0"
        height="0"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="rigatSculpted" clipPathUnits="objectBoundingBox">
            <path
              id="rigatStagePath"
              transform="scale(.001 .0014285714)"
              d="M92 14 H730 Q786 14 806 0 H968 Q1000 0 1000 32 V540 V622 Q1000 660 962 660 H742 Q704 660 686 690 Q676 700 642 700 H342 Q308 700 292 675 Q278 654 250 654 H72 Q18 654 18 600 V106 Q18 14 92 14 Z"
            ></path>
          </clipPath>
          <clipPath id="rigatSculptedMobile" clipPathUnits="objectBoundingBox">
            <path
              transform="scale(.001 .0014285714)"
              d="M54 8 H922 Q990 8 990 58 V570 Q990 612 952 628 L934 638 Q920 646 920 660 V674 Q920 696 896 696 H104 Q10 696 10 624 V74 Q10 8 54 8 Z"
            ></path>
          </clipPath>
        </defs>
      </svg>
    </>
  );
}
