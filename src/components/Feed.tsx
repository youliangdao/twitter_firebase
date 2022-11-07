import React, { FC, useEffect, useState } from "react";

import { db } from "../firebase";
import styles from "./Feed.module.css";
import Post from "./Post";
import TweetInput from "./TweetInput";

export type Tweet = {
  id: string;
  avatar: string;
  image: string;
  text: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timestamp: any;
  userName: string;
};

const Feed: FC = () => {
  const [posts, setPosts] = useState<Tweet[]>([
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
      {posts[0]?.id && (
        <>
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </>
      )}
    </div>
  );
};

export default Feed;
