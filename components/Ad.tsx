import React, { useCallback, useContext, useEffect, useRef } from "react";
import { AdManagerContext } from "./AdManager";
import type { AdTargeting, SetUpSlotOpsType } from "./AdManager";

/**
 * Component responsible for initializing and rendering a single ad slot
 */

type AdProps = {
  id: string;
  adUnitPath: string;
  sizes: googletag.MultiSize;
  sizeMapping?: googletag.SizeMappingArray;
  targeting?: AdTargeting;
};

const Ad = React.memo(function Ad({
  id,
  adUnitPath,
  sizes,
  sizeMapping,
  targeting,
}: AdProps) {
  // Get ad context
  const { isGptEnabled, display, destroy, setUpSlot } =
    useContext(AdManagerContext);
  // Slot values that are set when slot is created
  const slotOps = useRef<SetUpSlotOpsType>({
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

  return (
    <>
      <div id={id} className="ad" ref={initialize} data-testid="ad" />
    </>
  );
});

export default Ad;
