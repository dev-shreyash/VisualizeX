import Image from "next/image";
import styles from "./page.module.scss";
import HomePage from "./HomePage/HomePage";

export default function Home() {
  return (
    <main className={styles.main}>
      <HomePage/>
    </main>
  );
}
