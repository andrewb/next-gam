import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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

interface ISlotState {
  creativeId?: number | null;
  isEmpty?: boolean;
  size?: string;
}

function formattedSize(size: string | number[] | null): string {
  if (Array.isArray(size)) {
    return size.join("x");
  }
  return size || "none";
}

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
  const [slotState, setSlotState] = useState<ISlotState>({});

  useEffect(() => {
    if (isGptEnabled) {
      display(id);
    }
  }, [id, isGptEnabled, display]);

  const initialize = useCallback(
    (el: HTMLElement | null) => {
      if (el) {
        setUpSlot(id, slotOps.current, (event) => {
          setSlotState({
            isEmpty: event.isEmpty,
            creativeId: event.creativeId,
            size: formattedSize(event.size),
          });
        });
      } else {
        // Component is being unmounted, destroy the slot
        destroy(id);
      }
    },
    [destroy, id, setUpSlot]
  );

  return (
    <>
      <div
        id={id}
        ref={initialize}
        data-testid="ad"
        data-is-empty={slotState.isEmpty}
        data-creative-id={slotState.creativeId}
        data-creative-size={slotState.size}
      />
    </>
  );
});

export default Ad;
