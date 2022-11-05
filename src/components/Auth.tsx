import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { Email } from "@material-ui/icons";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import React, { ChangeEvent, FC, useState } from "react";
import { useDispatch } from "react-redux";

import { updateUserProfile } from "../features/userSlice";
import { auth, provider, storage } from "../firebase";
import styles from "./Auth.module.css";

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    margin: theme.spacing(1),
  },
  form: {
    marginTop: theme.spacing(1),
    width: "100%", // Fix IE 11 issue.
  },
  image: {
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
  paper: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    margin: theme.spacing(8, 4),
  },
  root: {
    height: "100vh",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Auth: FC = () => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();

  const onChangeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (e.target.files![0]) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setAvatarImage(e.target.files![0]);
      e.target.value = "";
    }
  };
  const signInEmail = async () => {
    const authUser = await auth.signInWithEmailAndPassword(email, password);
    let url = "";
    if (avatarImage) {
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + avatarImage.name;

      await storage.ref(`avatars/${fileName}`).put(avatarImage);
      url = await storage.ref("avatars").child(fileName).getDownloadURL();
    }
    await authUser.user?.updateProfile({
      displayName: userName,
      photoURL: url,
    });
    dispatch(
      updateUserProfile({
        displayName: userName,
        photoUrl: url,
      })
    );
  };
  const signUpEmail = async () => {
    await auth.createUserWithEmailAndPassword(email, password);
  };
  const signInGoogle = async () => {
    await auth.signInWithPopup(provider).catch((error) => {
      alert(error.messages);
    });
  };
  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isLogin ? "Login" : "Register"}
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              startIcon={<Email />}
              onClick={
                isLogin
                  ? async () => {
                      try {
                        await signInEmail();
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      } catch (error: any) {
                        alert(error.message);
                      }
                    }
                  : async () => {
                      try {
                        await signUpEmail();
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      } catch (error: any) {
                        alert(error.message);
                      }
                    }
              }
            >
              {isLogin ? "Login" : "Register"}
            </Button>
            <Grid container>
              <Grid item xs>
                <span className={styles.login_reset}>Forgot password?</span>
              </Grid>
              <Grid item>
                <span
                  className={styles.login_toggleMode}
                  onClick={() => setIsLogin(!isLogin)}
                  aria-hidden
                >
                  {isLogin ? "Create new account ?" : "Back to login"}
                </span>
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={signInGoogle}
            >
              SignIn With Google
            </Button>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};

export default Auth;
