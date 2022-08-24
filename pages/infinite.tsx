import type { NextPage } from "next";
import { useState } from "react";
import Ad from "../components/Ad";
import styles from "../styles/Page.module.css";

const Article: NextPage = () => {
  const [sections, setSections] = useState([1]);
  return (
    <div className={styles.container}>
      <main>
        <>
          <h1>Infinite Content</h1>
          {sections.map((id) => {
            return (
              <section key={id}>
                <h2>Section {id}</h2>
                <Ad
                  id={`ad-large-${id}`}
                  adUnitPath="/6355419/Travel/Europe/France/Paris"
                  sizes={[[728, 90]]}
                  placeholder={[728, 90]}
                />
                <br />
                <Ad
                  id={`ad-medium-${id}`}
                  adUnitPath="/6355419/Travel/Europe/France/Paris"
                  sizes={[[300, 250]]}
                  placeholder={[300, 250]}
                />
              </section>
            );
          })}
        </>
      </main>
      <button onClick={() => setSections([...sections, sections.length + 1])}>
        Load More
      </button>
    </div>
  );
};

export default Article;
