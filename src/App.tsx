import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { auth } from "../firebase";
import styles from "./App.module.css";
import Auth from "./components/Auth";
import Feed from "./components/Feed";
import { login, logout, selectUser } from "./features/userSlice";

const App: FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(
          login({
            displayName: authUser.displayName,
            photoUrl: authUser.photoURL,
            uid: authUser.uid,
          })
        );
      } else {
        dispatch(logout());
      }
    });
    return () => {
      unSub();
    };
  }, [dispatch]);

  return (
    <>
      {user.uid ? (
        <div className={styles.app}>
          <Feed />
        </div>
      ) : (
        <Auth />
      )}
    </>
  );
};

export default App;
