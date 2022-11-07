import { Avatar, makeStyles } from "@material-ui/core";
import { Message, Send } from "@material-ui/icons";
import firebase from "firebase/app";
import React, { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { selectUser } from "../features/userSlice";
import { db } from "../firebase";
import { Tweet } from "./Feed";
import styles from "./Post.module.css";

type Props = {
  post: Tweet;
};
type COMMENT = {
  id: string;
  avatar: string;
  text: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timestamp: any;
  userName: string;
};
const useStyles = makeStyles((theme) => ({
  small: {
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
    width: theme.spacing(3),
  },
}));
const Post: FC<Props> = (props) => {
  const classes = useStyles();
  const user = useSelector(selectUser);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<COMMENT[]>([
    {
      id: "",
      avatar: "",
      text: "",
      timestamp: null,
      userName: "",
    },
  ]);
  const [openComments, setOpenComments] = useState(false);
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

  useEffect(() => {
    const unSub = db
      .collection("posts")
      .doc(post.id)
      .collection("comments")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setComments(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            avatar: doc.data().avatar,
            text: doc.data().text,
            timestamp: doc.data().timestamp,
            userName: doc.data().userName,
          }))
        );
      });

    return () => {
      unSub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <Message
          className={styles.post_commentIcon}
          onClick={() => setOpenComments(!openComments)}
        />
        {openComments && (
          <>
            {comments.map((comment) => (
              <div key={comment.id} className={styles.post_comment}>
                <Avatar src={comment.avatar} className={classes.small} />
                <span className={styles.post_commentUser}>
                  @{comment.userName}
                </span>
                <span className={styles.post_commentText}>{comment.text}</span>
                <span className={styles.post_headerTime}>
                  {new Date(comment.timestamp?.toDate()).toLocaleDateString()}
                </span>
              </div>
            ))}
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
          </>
        )}
      </div>
    </div>
  );
};

export default Post;
