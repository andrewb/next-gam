import type { NextPage } from "next";
import Link from "next/link";
import Ad from "../components/Ad";
import styles from "../styles/Page.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <main>
        <h1>Home</h1>
        <h2>Ad 1 (KVs)</h2>
        <div className="ad-container ad-header">
          <Ad
            id="ad-1"
            adUnitPath="/6355419/Travel/Europe/France/Paris"
            targeting={{
              tags: ["foo", "bar-baz", "qux"],
              author: "author-name-slug",
            }}
            sizes={[
              [970, 250],
              [728, 90],
            ]}
          />
        </div>
        <h2>Ad 2 (No KVs)</h2>
        <div className="ad-container ad-body">
          <Ad
            id="ad-2"
            adUnitPath="/6355419/Travel/Europe/France/Paris"
            sizes={[[300, 250]]}
          />
        </div>
        <p>
          <Link href="/article">
            <a>Go to article</a>
          </Link>
        </p>
      </main>
      <style jsx>{`
        .ad-container {
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 100%;
          background: #eee;
        }
        .ad-header {
          min-height: 250px;
        }
        .ad-body {
          min-height: 250px;
        }
      `}</style>
    </div>
  );
};

export default Home;
