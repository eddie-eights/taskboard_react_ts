import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { makeStyles, Theme } from "@material-ui/core/styles";
import { TextField, Button } from "@material-ui/core";

import styles from "./Auth.module.css";
import { AppDispatch } from "../../app/store";
import {
  toggleMode,
  fetchAsyncLogin,
  fetchAsyncRegister,
  fetchAsyncCreateProf,
  selectIsLoginView,
} from "./authSlice";

// material-UI
const useStyles = makeStyles((theme: Theme) => ({
  button: {
    margin: theme.spacing(3),
  },
}));

const Auth: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const isLoginView = useSelector(selectIsLoginView);
  // Material-UIのstyleを格納
  const classes = useStyles();

  const [credential, setCredential] = useState({ username: "", password: "" });
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const name = event.target.name;
    setCredential({ ...credential, [name]: value });
  };

  const login = async () => {
    if (isLoginView) {
      await dispatch(fetchAsyncLogin(credential));
    } else {
      const result = await dispatch(fetchAsyncRegister(credential));
      if (fetchAsyncRegister.fulfilled.match(result)) {
        await dispatch(fetchAsyncLogin(credential));
        await dispatch(fetchAsyncCreateProf());
      }
    }
  };

  return (
    <div className={styles.auth__root}>
      <h1>{isLoginView ? "ログイン" : "新規登録"}</h1>
      <br />
      <TextField
        InputLabelProps={{
          shrink: true,
        }}
        label="User Name"
        type="text"
        name="username"
        value={credential.username}
        onChange={handleInputChange}
      />
      <br />
      <TextField
        InputLabelProps={{
          shrink: true,
        }}
        label="Password"
        type="password"
        name="password"
        value={credential.password}
        onChange={handleInputChange}
      />
      <Button
        variant="contained"
        color="primary"
        size="small"
        className={classes.button}
        onClick={login}
      >
        {isLoginView ? "ログイン" : "ユーザー作成"}
      </Button>
      <span onClick={() => dispatch(toggleMode())}>
        {isLoginView ? "ユーザー登録はこちら" : "ログインはこちら"}
      </span>
    </div>
  );
};

export default Auth;
