import Script from "next/script";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { AdTargeting } from "./Ad";

/**
 * Component responsible for loading the GPT script and setting the global configuration
 * Note: This component should be rendered in _app.tsx
 * <AdManager>
 *   <Component {...pageProps} />
 * </AdManager>
 */

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

interface AdManagerContextInterface {
  destroy: Function;
  display: Function;
  isGptEnabled: boolean;
  setUpSlot: Function;
}

export const AdManagerContext = React.createContext<AdManagerContextInterface>({
  destroy: () => {},
  display: () => {},
  isGptEnabled: false,
  setUpSlot: () => {},
});

export const setUpSlot = (
  id: string,
  {
    adUnitPath,
    sizes,
    sizeMapping,
    targeting,
  }: {
    adUnitPath: string;
    sizes: googletag.MultiSize;
    sizeMapping?: googletag.SizeMappingArray;
    targeting?: AdTargeting;
  }
) => {
  googletag.cmd.push(function () {
    if (getSlotById(id)) {
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
    }
  });
};

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

type AdManagerProps = {
  children: ReactNode;
  enableSingleRequest?: boolean;
  enableLazyLoad?: boolean;
};

const AdManager = React.memo(function Ad({
  children,
  enableSingleRequest = true,
  enableLazyLoad = true,
}: AdManagerProps) {
  const displayed = useRef(new Set());
  const [isEnabled, setIsEnabled] = useState(false);

  // Display a slot
  const display = useCallback((id: string) => {
    googletag.cmd.push(function () {
      if (displayed.current.has(id)) {
        // Slot has already been displayed
        return;
      }

      googletag.display(id);

      if (googletag.pubads().isSRA()) {
        // Note, in single request mode a call to display will request
        // all of the uninitialized ad slots
        for (const slot of googletag.pubads().getSlots()) {
          displayed.current.add(slot.getSlotElementId());
        }
      } else {
        displayed.current.add(id);
      }
    });
  }, []);

  // Destroy a slot
  const destroy = useCallback((id: string) => {
    googletag.cmd.push(function () {
      const slot = getSlotById(id);
      if (slot) {
        googletag.destroySlots([slot]);
        displayed.current.delete(id);
      }
    });
  }, []);

  useEffect(() => {
    // React's strict mode will execute useEffect twice in development mode.
    // It's important that the GPT setup code (and display) is only called once
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
