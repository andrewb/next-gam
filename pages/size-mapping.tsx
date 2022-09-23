import type { NextPage } from "next";
import Ad from "../components/Ad";
import styles from "../styles/Page.module.css";

const DESKTOP_BREAKPOINT: googletag.SingleSizeArray = [1024, 768];
const TABLET_BREAKPOINT: googletag.SingleSizeArray = [768, 480];

const AD_UNIT_PATH = "22806846287/Article";

function FixedSizeAd({ id }: { id: string }) {
  return (
    <div className="ad-container">
      <Ad id={id} adUnitPath={AD_UNIT_PATH} sizes={[[970, 250]]} />
      <style jsx>{`
        .ad-container {
          min-height: 250px;
        }
      `}</style>
    </div>
  );
}

function ResponsiveAd({ id }: { id: string }) {
  return (
    <div className="ad-container">
      <Ad
        id={id}
        adUnitPath={AD_UNIT_PATH}
        sizes={[
          [728, 90],
          [300, 250],
        ]}
        sizeMapping={[
          [DESKTOP_BREAKPOINT, [[728, 90]]],
          [TABLET_BREAKPOINT, [728, 90]],
          [
            [0, 0],
            [300, 250],
          ],
        ]}
      />
      <style jsx>{`
        .ad-container {
          min-height: 250px;
        }
        @media screen and (min-width: 768px) {
          .ad-container {
            min-height: 90px;
          }
        }
      `}</style>
    </div>
  );
}

function MobileOnlyAd({ id }: { id: string }) {
  return (
    <div className="ad-container">
      <Ad
        id={id}
        adUnitPath={AD_UNIT_PATH}
        sizes={[[300, 250]]}
        sizeMapping={[
          [
            [0, 0],
            [300, 250],
          ],
          [TABLET_BREAKPOINT, []],
        ]}
      />
      <style jsx>{`
        .ad-container {
          min-height: 250px;
        }
        @media screen and (min-width: 768px) {
          .ad-container {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

function DesktopOnlyAd({ id }: { id: string }) {
  return (
    <div className="ad-container">
      <Ad
        id={id}
        adUnitPath={AD_UNIT_PATH}
        sizes={[[728, 90]]}
        sizeMapping={[
          [DESKTOP_BREAKPOINT, [728, 90]],
          [[0, 0], []],
        ]}
      />
      <style jsx>{`
        .ad-container {
          display: none;
        }
        @media screen and (min-width: 768px) {
          .ad-container {
            display: block;
            min-height: 90px;
          }
        }
      `}</style>
    </div>
  );
}

const Sizes: NextPage = () => {
  return (
    <div className={styles.container}>
      <main>
        <h1>Home</h1>
        <p>
          Note, ads are requested on page load. Resizing the browser will not
          trigger ads to be fetched for that breakpoint.
        </p>
        <h2>Fixed Size</h2>
        <FixedSizeAd id="ad-fixed" />
        <h2>Responsive</h2>
        <ResponsiveAd id="ad-responsive" />
        <h2>Mobile Only</h2>
        <MobileOnlyAd id="ad-mobile" />
        <h2>Desktop Only</h2>
        <DesktopOnlyAd id="ad-desktop" />
      </main>
      <style jsx>{`
        :global(.ad-container) {
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 100%;
          background: #eee;
      `}</style>
    </div>
  );
};

export default Sizes;
