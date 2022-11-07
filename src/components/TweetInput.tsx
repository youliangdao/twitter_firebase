import { Avatar } from "@material-ui/core";
import firebase from "firebase/app";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useSelector } from "react-redux";

import { selectUser } from "../features/userSlice";
import { auth, db, storage } from "../firebase";
import styled from "./TweetInput.module.css";

const TweetInput = () => {
  const user = useSelector(selectUser);
  const [tweetImage, setTweetImage] = useState<File | null>(null);
  const [tweetMsg, setTweetMsg] = useState("");

  const onChangeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (e.target.files![0]) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setTweetImage(e.target.files![0]);
      e.target.value = "";
    }
  };

  const sendTweet = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tweetImage) {
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + tweetImage.name;
      const uploadTweetImage = storage
        .ref(`images/${fileName}`)
        .put(tweetImage);
      uploadTweetImage.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {},
        (err) => {
          alert(err.message);
        },
        async () => {
          await storage
            .ref("images")
            .child(fileName)
            .getDownloadURL()
            .then(async (url) => {
              await db.collection("posts").add({
                avatar: user.photoUrl,
                image: url,
                text: tweetMsg,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                userName: user.displayName,
              });
            });
        }
      );
    } else {
      db.collection("posts").add({
        avatar: user.photoUrl,
        image: "",
        text: tweetMsg,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        userName: user.displayName,
      });
      setTweetImage(null);
      setTweetMsg("");
    }
  };
  return (
    <div>
      <Avatar
        className={styled.tweet_avatar}
        src={user.photoUrl}
        onClick={async () => {
          await auth.signOut();
        }}
      />
    </div>
  );
};

export default TweetInput;
