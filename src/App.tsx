import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Grid, Avatar } from "@material-ui/core";
import {
  makeStyles,
  createTheme,
  MuiThemeProvider,
  Theme,
} from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import styles from "./App.module.css";
import { AppDispatch } from "./app/store";
import {
  selectLoginUser,
  selectProfiles,
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
  fetchAsyncUpdateProf,
} from "./features/auth/authSlice";
import {
  fetchAsyncGetTasks,
  fetchAsyncGetUsers,
  fetchAsyncGetCategory,
  selectEditedTask,
} from "./features/task/taskSlice";
import TaskList from "./features/task/TaskList";
import TaskForm from "./features/task/TaskForm";
import TaskDisplay from "./features/task/TaskDisplay";

const theme = createTheme({
  palette: {
    secondary: {
      main: "#a9a9a9",
    },
  },
});

const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    marginTop: theme.spacing(3),
    cursor: "none",
  },
  avatar: {
    margin: theme.spacing(1),

  },
}));

const App: React.FC = () => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const editedTask = useSelector(selectEditedTask);
  const loginUser = useSelector(selectLoginUser);
  const profiles = useSelector(selectProfiles);

  // いまログインしてるユーザーのプロフィール情報
  const loginProfile = profiles.filter(
    (prof) => prof.user_profile === loginUser.id
  )[0];

  // ログアウト処理
  const logout = () => {
    localStorage.removeItem("localJWT");
    window.location.href = "/";
  };
  const handlerEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput?.click();
  };

  useEffect(() => {
    const fetchBootLoader = async () => {
      await dispatch(fetchAsyncGetTasks());
      await dispatch(fetchAsyncGetMyProf());
      await dispatch(fetchAsyncGetUsers());
      await dispatch(fetchAsyncGetCategory());
      await dispatch(fetchAsyncGetProfs());
    };
    fetchBootLoader();
  }, [dispatch]);

  return (
    <MuiThemeProvider theme={theme}>
      <div className={styles.app__root}>
        <Grid container>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}>
            <h1>タスク管理ボード</h1>
          </Grid>
          <Grid item xs={4}>
            <div className={styles.app__logout}>
              <button className={styles.app__iconLogout} onClick={logout}>
                ログアウト
              </button>
              <input
                type="file"
                id="imageInput"
                hidden={true}
                onChange={(event) => {
                  dispatch(
                    fetchAsyncUpdateProf({
                      id: loginProfile.id,
                      img:
                        event.target.files !== null
                          ? event.target.files[0]
                          : null,
                    })
                  );
                }}
              />

              <button className={styles.app__btn} onClick={handlerEditPicture}>
                <Avatar
                  className={classes.avatar}
                  alt="avatar"
                  src={
                    loginProfile?.img !== null ? loginProfile?.img : undefined
                  }
                />
              </button>
            </div>
          </Grid>
          <Grid item xs={8}>
            <TaskList />
          </Grid>
          <Grid item xs={4}>
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="flex-start"
              style={{ minHeight: "70vh" }}
            >
              <Grid item>
                {editedTask.status ? <TaskForm /> : <TaskDisplay />}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </MuiThemeProvider>
  );
};

export default App;
