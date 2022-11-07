import { Avatar } from "@material-ui/core";
import React, { FC } from "react";

import { Tweet } from "./Feed";
import styles from "./Post.module.css";

type Props = {
  post: Tweet;
};

const Post: FC<Props> = (props) => {
  const { post } = props;
  return (
    <div className={styles.post}>
      <div className={styles.post_avatar}>
        <Avatar src={post.avatar} />
      </div>
      <div className={styles.post_body}>
        <div>
          <div className={styles.post_header}>
            <h3>
              <span className={styles.post_headerUser}>@{post.userName}</span>
              <span className={styles.post_headerTime}>
                {new Date(post.timestamp?.toDate()).toLocaleString()}
              </span>
            </h3>
          </div>
          <div className={styles.post_tweet}>
            <p>{post.text}</p>
          </div>
        </div>
        {post.image && (
          <div className={styles.post_tweetImage}>
            <img src={post.image} alt="tweet" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
