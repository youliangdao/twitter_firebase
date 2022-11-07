import firebase from "firebase/app";
import React, { FC, useEffect, useState } from "react";

import { db } from "../firebase";
import styles from "./Feed.module.css";
import TweetInput from "./TweetInput";

type Post = {
  id: string;
  avatar: string;
  image: string;
  text: string;
  timestamp: firebase.firestore.FieldValue | null;
  userName: string;
};

const Feed: FC = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "",
      avatar: "",
      image: "",
      text: "",
      timestamp: null,
      userName: "",
    },
  ]);

  useEffect(() => {
    const unSub = db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            avatar: doc.data().avatar,
            image: doc.data().image,
            text: doc.data().text,
            timestamp: doc.data().timestamp,
            userName: doc.data().userName,
          }))
        );
      });

    return () => {
      unSub();
    };
  }, []);

  return (
    <div className={styles.feed}>
      <TweetInput />
      {posts.map((post) => (
        <h3 key={post.id}>{post.image}</h3>
      ))}
    </div>
  );
};

export default Feed;
