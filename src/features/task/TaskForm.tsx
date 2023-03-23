import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Button,
  Fab,
  Modal,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import AddIcon from "@material-ui/icons/Add";

import {
  fetchAsyncCreateTask,
  fetchAsyncUpdateTask,
  fetchAsyncCreateCategory,
  selectUsers,
  selectEditedTask,
  selectCategory,
  editTask,
  selectTask,
} from "./taskSlice";
import { AppDispatch } from "../../app/store";
import { initialState } from "./taskSlice";

const useStyles = makeStyles((theme: Theme) => ({
  field: {
    margin: theme.spacing(1),
    minWidth: 240,
		textAlign:"center"
  },
  button: {
    margin: theme.spacing(3),
    padding: theme.spacing("0.5em", 3),
  },
  addIcon: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(2),
  },
  saveModal: {
    marginTop: theme.spacing(4),
    marginLeft: theme.spacing(2),
  },
  paper: {
    position: "absolute",
    textAlign: "center",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

// モーダルを中央に配置
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const TaskForm: React.FC = () => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();

  const users = useSelector(selectUsers);
  const category = useSelector(selectCategory);
  const editedTask = useSelector(selectEditedTask);

  const [open, setOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [inputText, setInputText] = useState("");

  // モーダルの開閉処理
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // タスク、内容、日数が空の場合は新規作成できないようにする
  const isDisabled =
    !editedTask.task || !editedTask.description || !editedTask.criteria;
  // カテゴリー新規作成でフィールド未入力の場合は作成できないようにする
  const isCatDisabled = inputText.length === 0;

  const handleInputTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  // 入力フィールドのステートをリッスンしてステートを更新
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value: string | number = event.target.value;
    const name = event.target.name;
    if (name === "estimate") {
      value = Number(value);
    }
    dispatch(editTask({ ...editedTask, [name]: value }));
  };

  // 担当者フィールドの値をリッスンしてステートを更新
  // セレクターの仕様で、特定のデータ型を受け取ることができないためunknownで定義
  const handleSelectRespChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as number;
    dispatch(editTask({ ...editedTask, responsible: value }));
  };

  // 進捗フィールドの値をリッスンしてステートを更新
  const handleSelectStatusChange = (
    // セレクターの仕様で、特定のデータ型を受け取ることができないためunknownで定義
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const value = event.target.value as string;
    dispatch(editTask({ ...editedTask, status: value }));
  };

  // カテゴリーフィールドの値をリッスンしてステートを更新
  const handleSelectCatChange = (
    // セレクターの仕様で、特定のデータ型を受け取ることができないためunknownで定義
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const value = event.target.value as number;
    dispatch(editTask({ ...editedTask, category: value }));
  };
  // ユーザーセレクターの値
  let userOptions = users.map((user) => (
    <MenuItem key={user.id} value={user.id}>
      {user.username}
    </MenuItem>
  ));

  // カテゴリーセレクターの値
  let catOptions = category.map((cat) => (
    <MenuItem key={cat.id} value={cat.id}>
      {cat.item}
    </MenuItem>
  ));

  return (
    <div>
      <h2>{editedTask.id ? "タスクを更新" : "タスクを作成"}</h2>
      <form action="#">
        <TextField
          className={classes.field}
          label="日数"
          type="number"
          name="estimate"
          InputProps={{ inputProps: { min: 1, max: 1000 } }}
          InputLabelProps={{
            shrink: true,
          }}
          value={editedTask.estimate}
          onChange={handleInputChange}
        />
        <TextField
          className={classes.field}
          InputLabelProps={{
            shrink: true,
          }}
          label="タスク"
          type="text"
          name="task"
          value={editedTask.task}
          onChange={handleInputChange}
        />
        <br />
        <TextField
          className={classes.field}
          InputLabelProps={{
            shrink: true,
          }}
          label="詳細"
          type="text"
          name="description"
          value={editedTask.description}
          onChange={handleInputChange}
        />
        <TextField
          className={classes.field}
          InputLabelProps={{
            shrink: true,
          }}
          label="業務内容"
          type="text"
          name="criteria"
          value={editedTask.criteria}
          onChange={handleInputChange}
        />
        <br />
        <FormControl className={classes.field}>
          <InputLabel>担当者</InputLabel>
          <Select
            name="responsible"
            onChange={handleSelectRespChange}
            value={editedTask.responsible}
          >
            {userOptions}
          </Select>
        </FormControl>
        <FormControl className={classes.field}>
          <InputLabel>進捗</InputLabel>
          <Select
            name="status"
            value={editedTask.status}
            onChange={handleSelectStatusChange}
          >
            <MenuItem value={1}>未着手</MenuItem>
            <MenuItem value={2}>進行中</MenuItem>
            <MenuItem value={3}>完了</MenuItem>
          </Select>
        </FormControl>
        <br />
        <FormControl className={classes.field}>
          <InputLabel>カテゴリー</InputLabel>
          <Select
            name="category"
            value={editedTask.category}
            onChange={handleSelectCatChange}
          >
            {catOptions}
          </Select>
        </FormControl>

        <Fab
          // ＋ボタン
          size="small"
          color="primary"
          onClick={handleOpen}
          className={classes.addIcon}
        >
          <AddIcon />
        </Fab>
        <Modal open={open} onClose={handleClose}>
          <div style={modalStyle} className={classes.paper}>
            <TextField
              className={classes.field}
              InputLabelProps={{
                shrink: true,
              }}
              label="New category"
              type="text"
              value={inputText}
              onChange={handleInputTextChange}
            />
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.saveModal}
              startIcon={<SaveIcon />}
              disabled={isCatDisabled}
              onClick={() => {
                dispatch(fetchAsyncCreateCategory(inputText));
                handleClose();
              }}
            >
              保存
            </Button>
          </div>
        </Modal>
        <br />

        <Button
          variant="contained"
          color="default"
          size="small"
          onClick={() => {
            dispatch(editTask(initialState.editedTask));
            dispatch(selectTask(initialState.selectedTask));
          }}
        >
          キャンセル
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          className={classes.button}
          // startIcon={<SaveIcon />}
          disabled={isDisabled}
          onClick={
            editedTask.id !== 0
              ? () => dispatch(fetchAsyncUpdateTask(editedTask))
              : () => dispatch(fetchAsyncCreateTask(editedTask))
          }
        >
          {editedTask.id !== 0 ? "更新" : "作成"}
        </Button>
      </form>
    </div>
  );
};

export default TaskForm;
