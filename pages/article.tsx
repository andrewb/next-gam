import type { NextPage } from "next";
import Ad from "../components/Ad";
import styles from "../styles/Page.module.css";

const Article: NextPage = () => {
  return (
    <div className={styles.container}>
      <main>
        <h1>Article Page</h1>
        <div className="ad-container">
          <Ad
            id="ad-1"
            adUnitPath="/6355419/Travel/Europe/France/Paris"
            sizes={[
              [970, 250],
              [728, 90],
            ]}
          />
        </div>
      </main>
    </div>
  );
};

export default Article;
