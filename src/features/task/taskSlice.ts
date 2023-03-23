import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";

import {
  READ_TASK,
  POST_TASK,
  CATEGORY,
  TASK_STATE,
  USER,
} from "../types/types";
import { access } from "fs";
import { AccessTimeOutlined } from "@material-ui/icons";

// タスク一覧を取得
export const fetchAsyncGetTasks = createAsyncThunk("task/getTask", async () => {
  const res = await axios.get<READ_TASK[]>(
    `${process.env.REACT_APP_API_URL}/api/tasks/`,
    {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    }
  );
  return res.data;
});

// ユーザー一覧を取得
export const fetchAsyncGetUsers = createAsyncThunk(
  "task/getUsers",
  async () => {
    const res = await axios.get<USER[]>(
      `${process.env.REACT_APP_API_URL}/api/users/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

// カテゴリー一覧を取得
export const fetchAsyncGetCategory = createAsyncThunk(
  "task/getCategory",
  async () => {
    const res = await axios.get<CATEGORY[]>(
      `${process.env.REACT_APP_API_URL}/api/category/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

// カテゴリーを作成する処理
export const fetchAsyncCreateCategory = createAsyncThunk(
  "task/createCategory",
  async (item: string) => {
    const res = await axios.post<CATEGORY>(
      `${process.env.REACT_APP_API_URL}/api/category/`,
      { item },
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

// タスクを作成する処理
export const fetchAsyncCreateTask = createAsyncThunk(
  "task/createTask",
  async (task: POST_TASK) => {
    const res = await axios.post<READ_TASK>(
      `${process.env.REACT_APP_API_URL}/api/tasks/`,
      task,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

// タスクを更新する処理
export const fetchAsyncUpdateTask = createAsyncThunk(
  "task/updateTask",
  async (task: POST_TASK) => {
    const res = await axios.put<READ_TASK>(
      `${process.env.REACT_APP_API_URL}/api/tasks/${task.id}/`,
      task,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

// タスクを削除する処理
export const fetchAsyncDeleteTask = createAsyncThunk(
  "task/deleteTask",
  async (id: number) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/tasks/${id}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return id;
  }
);

export const initialState: TASK_STATE = {
  tasks: [
    {
      id: 0,
      task: "",
      description: "",
      criteria: "",
      status: "",
      status_name: "",
      category: 0,
      category_item: "",
      estimate: 0,
      responsible: 0,
      responsible_username: "",
      owner: 0,
      owner_username: "",
      created_at: "",
      updated_at: "",
    },
  ],
  editedTask: {
    id: 0,
    task: "",
    description: "",
    criteria: "",
    status: "",
    category: 0,
    estimate: 0,
    responsible: 0,
  },
  selectedTask: {
    id: 0,
    task: "",
    description: "",
    criteria: "",
    status: "",
    status_name: "",
    category: 0,
    category_item: "",
    estimate: 0,
    responsible: 0,
    responsible_username: "",
    owner: 0,
    owner_username: "",
    created_at: "",
    updated_at: "",
  },
  users: [{ id: 0, username: "" }],
  category: [{ id: 0, item: "" }],
};

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    editTask(state, action: PayloadAction<POST_TASK>) {
      state.editedTask = action.payload;
    },
    selectTask(state, action: PayloadAction<READ_TASK>) {
      state.selectedTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    // タスク一覧を取得できたらstateに格納
    builder.addCase(
      fetchAsyncGetTasks.fulfilled,
      (state, action: PayloadAction<READ_TASK[]>) => {
        return { ...state, tasks: action.payload };
      }
    );
    // タスク一覧が取得できない場合(認証エラーなど)はログイン画面へ遷移
    builder.addCase(fetchAsyncGetTasks.rejected, () => {
      window.location.href = "/";
    });
    // ユーザー一覧を取得できたらstateに格納
    builder.addCase(
      fetchAsyncGetUsers.fulfilled,
      (state, action: PayloadAction<USER[]>) => {
        return { ...state, users: action.payload };
      }
    );
    // カテゴリ一覧を取得できたらstateに格納
    builder.addCase(
      fetchAsyncGetCategory.fulfilled,
      (state, action: PayloadAction<CATEGORY[]>) => {
        return { ...state, category: action.payload };
      }
    );
    // カテゴリーを作成したらstateに格納
    builder.addCase(
      fetchAsyncCreateCategory.fulfilled,
      (state, action: PayloadAction<CATEGORY>) => {
        return { ...state, category: [...state.category, action.payload] };
      }
    );
    // カテゴリーが作成できない場合(認証エラーなど)はログイン画面へ遷移
    builder.addCase(fetchAsyncCreateCategory.rejected, () => {
      window.location.href = "/";
    });
    // タスクを作成したらstateに格納
    builder.addCase(
      fetchAsyncCreateTask.fulfilled,
      (state, action: PayloadAction<READ_TASK>) => {
        return {
          ...state,
          tasks: [action.payload, ...state.tasks],
          editedTask: initialState.editedTask,
          selectedTask: initialState.selectedTask,
        }; // 先頭に追加
      }
    );
    // タスクが作成できない場合(認証エラーなど)はログイン画面へ遷移
    builder.addCase(fetchAsyncCreateTask.rejected, () => {
      window.location.href = "/";
    });
    // タスクを更新したらstateに格納、フィールドの値を初期化
    builder.addCase(
      fetchAsyncUpdateTask.fulfilled,
      (state, action: PayloadAction<READ_TASK>) => {
        return {
          ...state,
          tasks: state.tasks.map((task) =>
            task.id === action.payload.id ? action.payload : task
          ),
          editedTask: initialState.editedTask, // 初期化
          selectedTask: initialState.selectedTask, // 初期化
        };
      }
    );
    // タスクが更新できない場合(認証エラーなど)はログイン画面へ遷移
    builder.addCase(fetchAsyncUpdateTask.rejected, () => {
      window.location.href = "/";
    });
    // タスクを削除したらstateをフィルターして削除、フィールドの値を初期化
    builder.addCase(
      fetchAsyncDeleteTask.fulfilled,
      (state, action: PayloadAction<number>) => {
        return {
          ...state,
          tasks: state.tasks.filter((task) => action.payload !== task.id),
          editedTask: initialState.editedTask, // 初期化
          selectedTask: initialState.selectedTask, // 初期化
        };
      }
    );
    // タスクが削除できない場合(認証エラーなど)はログイン画面へ遷移
    builder.addCase(fetchAsyncDeleteTask.rejected, () => {
      window.location.href = "/";
    });
  },
});

export const { editTask, selectTask } = taskSlice.actions;

// useSelectorで参照できるように
export const selectTasks = (state: RootState) => state.task.tasks;
export const selectEditedTask = (state: RootState) => state.task.editedTask;
export const selectSelectedTask = (state: RootState) => state.task.selectedTask;
export const selectUsers = (state: RootState) => state.task.users;
export const selectCategory = (state: RootState) => state.task.category;

export default taskSlice.reducer;
