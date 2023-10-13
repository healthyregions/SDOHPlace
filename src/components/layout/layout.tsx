import { FCC } from "src/types/react";

import styles from "./layout.module.css";

const Layout: FCC = ({ children }) => {
  return (
    <div className={styles.layout}>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
