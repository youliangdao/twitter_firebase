import { Box, IconButton, Modal } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { AccountCircle, Camera, Email, Send } from "@material-ui/icons";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import React, { ChangeEvent, FC, MouseEvent, useState } from "react";
import { useDispatch } from "react-redux";

import { updateUserProfile } from "../features/userSlice";
import { auth, provider, storage } from "../firebase";
import styles from "./Auth.module.css";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    left: `${left}%`,
    top: `${top}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

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
  modal: {
    backgroundColor: "white",
    borderRadius: 10,
    boxShadow: theme.shadows[5],
    outline: "none",
    padding: theme.spacing(10),
    position: "absolute",
    width: 400,
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
  const [openModal, setOpenModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const sendResetEmail = async (e: MouseEvent<HTMLElement>) => {
    await auth
      .sendPasswordResetEmail(resetEmail)
      .then(() => {
        setOpenModal(false);
        setResetEmail("");
      })
      .catch((error) => {
        alert(error.message);
        setResetEmail("");
      });
  };

  const onChangeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (e.target.files![0]) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setAvatarImage(e.target.files![0]);
      e.target.value = "";
    }
  };
  const signUpEmail = async () => {
    const authUser = await auth.createUserWithEmailAndPassword(email, password);
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
  const signInEmail = async () => {
    await auth.signInWithEmailAndPassword(email, password);
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
            {!isLogin && (
              <>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="userName"
                  label="UserName"
                  name="userName"
                  autoComplete="userName"
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  value={userName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setUserName(e.target.value)
                  }
                />
                <Box textAlign="center">
                  <IconButton>
                    <label>
                      <AccountCircle
                        fontSize="large"
                        className={
                          avatarImage
                            ? styles.login_addIconLoaded
                            : styles.login_addIcon
                        }
                      />
                      <input
                        className={styles.login_hiddenIcon}
                        type="file"
                        onChange={onChangeImageHandler}
                      />
                    </label>
                  </IconButton>
                </Box>
              </>
            )}
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
              disabled={
                isLogin
                  ? !email || password.length < 6
                  : !userName || !email || password.length < 6 || !avatarImage
              }
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
                <span
                  className={styles.login_reset}
                  onClick={() => setOpenModal(true)}
                  aria-hidden
                >
                  Forgot password?
                </span>
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
              startIcon={<Camera />}
              onClick={signInGoogle}
            >
              SignIn With Google
            </Button>
          </form>

          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <div style={getModalStyle()} className={classes.modal}>
              <div className={styles.login_modal}>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  type="email"
                  name="email"
                  label="Reset E-mail"
                  value={resetEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setResetEmail(e.target.value);
                  }}
                />
                <IconButton onClick={sendResetEmail}>
                  <Send />
                </IconButton>
              </div>
            </div>
          </Modal>
        </div>
      </Grid>
    </Grid>
  );
};

export default Auth;
