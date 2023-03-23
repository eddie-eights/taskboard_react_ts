import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { makeStyles, Theme } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import {
  Button,
  Avatar,
  Badge,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  TableSortLabel,
} from "@material-ui/core";

import styles from "./TaskList.module.css";
import { AppDispatch } from "../../app/store";
import { selectLoginUser, selectProfiles } from "../auth/authSlice";
import taskSlice, {
  fetchAsyncDeleteTask,
  selectTasks,
  editTask,
  selectTask,
} from "./taskSlice";
import { initialState } from "./taskSlice";
import { SORT_STATE, READ_TASK } from "../types/types";

const useStyles = makeStyles((theme: Theme) => ({
  table: {
    tableLayout: "fixed",
  },
  button: {
    margin: theme.spacing(3),
    paddingLeft: theme.spacing(1.3),
    paddingRight: theme.spacing(1.5),
  },
  small: {
    margin: "auto",
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

const TaskList: React.FC = () => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const tasks = useSelector(selectTasks);
  const loginUser = useSelector(selectLoginUser);
  const profiles = useSelector(selectProfiles);
  const columns = tasks[0] && Object.keys(tasks[0]);

  const [state, setState] = useState<SORT_STATE>({
    rows: tasks,
    order: "desc",
    activeKey: "",
  });

  // タスク一覧をクリックしたカラムに応じてソートする処理
  const handleClickSortColumn = (column: keyof READ_TASK) => {
    const isDesc = column === state.activeKey && state.order === "desc";
    const newOrder = isDesc ? "asc" : "desc";
    // Ref: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    const sortedRows = Array.from(state.rows).sort((a, b) => {
      if (a[column] > b[column]) {
        return newOrder === "asc" ? 1 : -1;
      } else if (a[column] < b[column]) {
        return newOrder === "asc" ? -1 : 1;
      } else {
        return 0;
      }
    });

    setState({
      rows: sortedRows,
      order: newOrder,
      activeKey: column,
    });
  };

  // Reduxのtasks(グローバルState)が変更されたらrows(ローカルState)も上書きする
  useEffect(() => {
    setState((state) => ({ ...state, rows: tasks }));
  }, [tasks]);

  const renderSwitch = (statusName: string) => {
    switch (statusName) {
      case "未着手":
        return (
          <Badge variant="dot" color="error">
            {statusName}
          </Badge>
        );
      case "進行中":
        return (
          <Badge variant="dot" color="primary">
            {statusName}
          </Badge>
        );
      case "完了":
        return (
          <Badge variant="dot" color="secondary">
            {statusName}
          </Badge>
        );
      default:
        return null;
    }
  };

  const conditionalSrc = (user: number) => {
    const loginProfile = profiles.filter(
      (prof) => prof.user_profile === user
    )[0];
    return loginProfile?.img !== null ? loginProfile?.img : undefined;
  };

  const displayHeader = (column: String) => {
    switch (column) {
      case "task":
        return "タスク";
      case "status":
        return "進捗";
      case "category":
        return "カテゴリ";
      case "estimate":
        return "日数";
      case "responsible":
        return "責任者";
      case "owner":
        return "作成者";
      default:
        return null;
    }
  };

  return (
    <>
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        size="small"
        startIcon={<AddIcon />}
        onClick={() => {
          dispatch(
            editTask({
              id: 0,
              task: "",
              description: "",
              criteria: "",
              responsible: loginUser.id,
              status: "1",
              category: 1,
              estimate: 1,
            })
          );
          // TaskDisplayが表示されないように初期化
          dispatch(selectTask(initialState.selectedTask));
        }}
      >
        新規作成
      </Button>
      {tasks[0]?.task && (
        <Table size="small" className={classes.table}>
          {/* ------  テーブルヘッダー  --------*/}
          <TableHead>
            <TableRow>
              {columns.map(
                (column, colIndex) =>
                  (column === "task" ||
                    column === "status" ||
                    column === "category" ||
                    column === "estimate" ||
                    column === "responsible" ||
                    column === "owner") && (
                    <TableCell align="justify" key={colIndex}>
                      <TableSortLabel
                        active={state.activeKey === column}
                        direction={state.order}
                        onClick={() => handleClickSortColumn(column)}
                      >
                        <strong>{displayHeader(column)}</strong>
                      </TableSortLabel>
                    </TableCell>
                  )
              )}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* ------  ROW リストの内容をマップで展開  ----- */}
            {state.rows.map((row, rowIndex) => (
              <TableRow hover key={rowIndex}>
                {Object.keys(row).map(
                  (key, colIndex) =>
                    (key === "task" ||
                      key === "status_name" ||
                      key === "category_item" ||
                      key === "estimate") && (
                      <TableCell
                        align="justify"
                        className={styles.tasklist__hover}
                        key={`${rowIndex}+${colIndex}`}
                        onClick={() => {
                          dispatch(selectTask(row));
                          dispatch(editTask(initialState.editedTask));
                        }}
                      >
                        {key === "status_name" ? (
                          renderSwitch(row[key])
                        ) : (
                          <span>{row[key]}</span>
                        )}
                      </TableCell>
                    )
                )}
                {/* ------------ 責任者エリア  --------- */}
                <TableCell align="left">
                  <Avatar
                    className={classes.small}
                    alt="resp"
                    src={conditionalSrc(row["responsible"])}
                  />
                  {/* ------------  作成者エリア  --------- */}
                </TableCell>
                <TableCell align="left">
                  <Avatar
                    className={classes.small}
                    alt="owner"
                    src={conditionalSrc(row["owner"])}
                  />
                </TableCell>

                {/* ------------- 編集エリア  ----------- */}
                <TableCell align="center">
                  <button
                    className={styles.tasklist__icon}
                    onClick={() => {
                      dispatch(fetchAsyncDeleteTask(row.id));
                    }}
                    disabled={row["owner"] !== loginUser.id}
                  >
                    <DeleteOutlineOutlinedIcon />
                  </button>
                  <button
                    className={styles.tasklist__icon}
                    onClick={() => dispatch(editTask(row))}
                    disabled={row["owner"] !== loginUser.id}
                  >
                    <EditOutlinedIcon />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default TaskList;
