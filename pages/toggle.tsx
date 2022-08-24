import type { NextPage } from "next";
import { useState } from "react";
import Ad from "../components/Ad";
import styles from "../styles/Page.module.css";

const Toggle: NextPage = () => {
  const [isVisible, setIsVisible] = useState(true);
  return (
    <div className={styles.container}>
      <main>
        <>
          <h1>Toggle Ad</h1>
          {isVisible && (
            <section>
              <Ad
                id="ad-toggle"
                adUnitPath="/6355419/Travel/Europe/France/Paris"
                sizes={[[728, 90]]}
                placeholder={[728, 90]}
              />
            </section>
          )}
        </>
      </main>
      <button onClick={() => setIsVisible(!isVisible)}>Toggle</button>
    </div>
  );
};

export default Toggle;
