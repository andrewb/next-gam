import type { NextPage } from "next";
import Ad from "../components/Ad";
import styles from "../styles/Page.module.css";

const DESKTOP_BREAKPOINT: googletag.SingleSizeArray = [1024, 768];
const TABLET_BREAKPOINT: googletag.SingleSizeArray = [768, 480];

const AD_UNIT_PATH = "/6355419/Travel/Europe/France/Paris";

function FixedSizeAd({ id }: { id: string }) {
  return (
    <Ad
      id={id}
      adUnitPath={AD_UNIT_PATH}
      sizes={[
        [970, 250],
        [728, 90],
      ]}
      placeholder={[970, 250]}
    />
  );
}

function ResponsiveAd({ id }: { id: string }) {
  return (
    <Ad
      id={id}
      adUnitPath={AD_UNIT_PATH}
      sizes={[
        [970, 250],
        [728, 90],
        [300, 250],
      ]}
      sizeMapping={[
        [
          DESKTOP_BREAKPOINT,
          [
            [970, 250],
            [728, 90],
          ],
        ],
        [TABLET_BREAKPOINT, [728, 90]],
        [
          [0, 0],
          [300, 250],
        ],
      ]}
      placeholder={[970, 250]}
    />
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
        placeholder={[300, 250]}
      />
      <style jsx>{`
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
        placeholder={[728, 90]}
      />
      <style jsx>{`
        .ad-container {
          display: none;
        }
        @media screen and (min-width: 768px) {
          .ad-container {
            display: block;
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
    </div>
  );
};

export default Sizes;
