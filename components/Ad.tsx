import React, { useCallback, useContext, useEffect, useRef } from "react";
import { AdManagerContext } from "./AdManager";

/**
 * Component responsible for initializing and rendering a single ad slot
 */

export type AdTargeting = {
  [key: string]: string | string[];
};

type AdProps = {
  id: string;
  adUnitPath: string;
  sizes: googletag.MultiSize;
  sizeMapping?: googletag.SizeMappingArray;
  targeting?: AdTargeting;
  placeholder: [number, number];
};

const Ad = React.memo(function Ad({
  id,
  adUnitPath,
  sizes,
  sizeMapping,
  targeting,
  placeholder,
}: AdProps) {
  // Get ad context
  const { isGptEnabled, display, destroy, setUpSlot } =
    useContext(AdManagerContext);
  // Slot values that are set when slot is created
  const slotOps = useRef({
    adUnitPath,
    sizes,
    sizeMapping,
    targeting,
  });

  useEffect(() => {
    if (isGptEnabled) {
      display(id);
    }
  }, [id, isGptEnabled, display]);

  const initialize = useCallback(
    (el: HTMLElement | null) => {
      if (el) {
        setUpSlot(id, slotOps.current);
      } else {
        // Component is being unmounted, destroy the slot
        destroy(id);
      }
    },
    [destroy, id, setUpSlot]
  );

  const [width, height] = placeholder;

  return (
    <>
      <div
        id={id}
        style={{ width: `${width}px`, height: `${height}px` }}
        ref={initialize}
        data-testid="ad"
      />
      <style jsx>{`
        div {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eee;
          max-width: 100%;
        }
      `}</style>
    </>
  );
});

export default Ad;
