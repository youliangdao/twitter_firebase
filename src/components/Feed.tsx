import React from "react";

import { auth } from "../firebase";
import styles from "./Feed.module.css";
import TweetInput from "./TweetInput";

const Feed = () => {
  return (
    <div className={styles.feed}>
      <TweetInput />
      <button onClick={() => auth.signOut()}>Logout</button>
    </div>
  );
};

export default Feed;
