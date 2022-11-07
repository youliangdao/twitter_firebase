import { Avatar } from "@material-ui/core";
import { Send } from "@material-ui/icons";
import firebase from "firebase/app";
import React, { ChangeEvent, FC, FormEvent, useState } from "react";
import { useSelector } from "react-redux";

import { selectUser } from "../features/userSlice";
import { db } from "../firebase";
import { Tweet } from "./Feed";
import styles from "./Post.module.css";

type Props = {
  post: Tweet;
};
const Post: FC<Props> = (props) => {
  const user = useSelector(selectUser);
  const [comment, setComment] = useState("");
  const { post } = props;
  const newComment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    db.collection("posts").doc(post.id).collection("comments").add({
      avatar: user.photoUrl,
      text: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      userName: user.displayName,
    });
    setComment("");
  };
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
        <form onSubmit={newComment}>
          <div className={styles.post_form}>
            <input
              className={styles.post_input}
              type="text"
              placeholder="Type new comment"
              value={comment}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setComment(e.target.value)
              }
            />
            <button
              disabled={!comment}
              className={
                comment ? styles.post_button : styles.post_buttonDisable
              }
              type="submit"
            >
              <Send className={styles.post_sendIcon} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Post;
