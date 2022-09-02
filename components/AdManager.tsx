import Script from "next/script";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * Component responsible for loading the GPT script and setting the global configuration
 * Note: This component should be rendered in _app.tsx
 * <AdManager>
 *   <Component {...pageProps} />
 * </AdManager>
 */

export type AdTargeting = {
  [key: string]: string | string[];
};

type SlotMapValue = {
  displayed: boolean;
  // In future more props will be added:
  // - requested
  // - viewports
};

export type SetUpSlotOpsType = {
  adUnitPath: string;
  sizes: googletag.MultiSize;
  sizeMapping?: googletag.SizeMappingArray;
  targeting?: AdTargeting;
};

type SetUpSlotType = (id: string, ops: SetUpSlotOpsType) => void;

type DisplayType = (id: string) => void;

type DestroyType = (id: string) => void;

interface AdManagerContextInterface {
  destroy: DestroyType;
  display: DisplayType;
  isGptEnabled: boolean;
  setUpSlot: SetUpSlotType;
}

type AdManagerProps = {
  children: ReactNode;
  enableSingleRequest?: boolean;
  enableLazyLoad?: boolean;
};

const GPT_SCRIPT_URI = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";

// See https://developers.google.com/publisher-tag/reference?hl=en#googletag.PubAdsService_enableLazyLoad
const LAZY_LOADING_CONFIG = {
  // Fetch slots within 2 viewports
  fetchMarginPercent: 200,
  // Render slots within 1 viewport
  renderMarginPercent: 100,
  // Double the fetch and render margins on mobile
  mobileScaling: 2.0,
};

export const AdManagerContext = React.createContext<AdManagerContextInterface>({
  destroy: () => {},
  display: () => {},
  isGptEnabled: false,
  setUpSlot: () => {},
});

/**
 * Get the GPT slot by element id
 * @param {string} id The unique DOM id assigned to the slot
 * @returns {googletag.Slot|undefined} The GPT slot object or undefined
 */
function getSlotById(id: string): googletag.Slot | undefined {
  return googletag
    .pubads()
    .getSlots()
    .find((slot: googletag.Slot) => slot.getSlotElementId() === id);
}

const AdManager = React.memo(function Ad({
  children,
  enableSingleRequest = true,
  enableLazyLoad = true,
}: AdManagerProps) {
  const slots = useRef(new Map<string, SlotMapValue>());
  const [isEnabled, setIsEnabled] = useState(false);

  const setUpSlot = useCallback<SetUpSlotType>(
    (id, { adUnitPath, sizes, sizeMapping, targeting }) => {
      googletag.cmd.push(function () {
        if (slots.current.has(id)) {
          // Slot has already been defined
          return;
        }
        // Initialize the ad slot
        const slot = googletag.defineSlot(adUnitPath, sizes, id);

        if (slot) {
          // Add pubads to the slot
          slot.addService(googletag.pubads());
          // Set up responsive size mappings
          if (sizeMapping) {
            let mapping = googletag.sizeMapping();
            for (const [viewport, sizes] of sizeMapping) {
              mapping.addSize(viewport, sizes);
            }
            slot.defineSizeMapping(mapping.build());
          }
          // Add key/value targeting
          if (targeting) {
            for (const [key, value] of Object.entries(targeting)) {
              slot.setTargeting(key, value);
            }
          }
          slots.current.set(id, { displayed: false });
        }
      });
    },
    []
  );

  // Display a slot
  const display = useCallback<DisplayType>((id) => {
    googletag.cmd.push(function () {
      if (slots.current.get(id)?.displayed) {
        // Slot has already been displayed
        return;
      }

      googletag.display(id);

      if (googletag.pubads().isSRA()) {
        // Note, in single request mode a call to display will request
        // all of the uninitialized ad slots
        for (const slot of googletag.pubads().getSlots()) {
          slots.current.set(slot.getSlotElementId(), {
            ...slots.current.get(id)!,
            displayed: true,
          });
        }
      } else {
        slots.current.set(id, {
          ...slots.current.get(id)!,
          displayed: true,
        });
      }
    });
  }, []);

  // Destroy a slot
  const destroy = useCallback<DestroyType>((id) => {
    googletag.cmd.push(function () {
      const slot = getSlotById(id);
      if (slot) {
        googletag.destroySlots([slot]);
        slots.current.delete(id);
      }
    });
  }, []);

  useEffect(() => {
    // React's strict mode will execute useEffect twice in development mode.
    // It's important that the GPT setup code is only called once
    // to avoid a "throttled" warning. In production mode useEffect is only
    // called once.
    let ignore = false;

    // Called once when this component mounts. This code is responsible for
    // setting the global GPT configuration and displaying the first batch
    // of ad slots.
    googletag.cmd.push(function () {
      // Called AFTER ad slots have been defined by the <Ad> component
      if (!ignore) {
        if (enableLazyLoad) {
          // Note, `enableLazyLoad` MUST be called before `enableServices`
          googletag.pubads().enableLazyLoad(LAZY_LOADING_CONFIG);
        }
        if (enableSingleRequest) {
          // Note, `enableSingleRequest` MUST be called before `enableServices`
          googletag.pubads().enableSingleRequest();
        }

        googletag.enableServices();
        setIsEnabled(true);
      }
    });

    return () => {
      ignore = true;
    };
  }, [enableSingleRequest, enableLazyLoad]);

  if (typeof window !== "undefined") {
    window.googletag = window.googletag || { cmd: [] };
  }

  return (
    <>
      <Script data-testid="gpt-script" src={GPT_SCRIPT_URI} />
      <AdManagerContext.Provider
        value={{
          display,
          destroy,
          isGptEnabled: isEnabled,
          setUpSlot,
        }}
      >
        {children}
      </AdManagerContext.Provider>
    </>
  );
});

export default AdManager;
