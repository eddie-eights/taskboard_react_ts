import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import {
  AUTH_STATE,
  CRED,
  LOGIN_USER,
  POST_PROFILE,
  PROFILE,
  JWT,
  USER,
} from "../types/types";

// ログイン処理
export const fetchAsyncLogin = createAsyncThunk(
  "auth/login",
  async (auth: CRED) => {
    const res = await axios.post<JWT>(
      `${process.env.REACT_APP_API_URL}/authen/jwt/create/`,
      auth,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return res.data;
  }
);

// 新規ユーザー登録処理
export const fetchAsyncRegister = createAsyncThunk(
  "auth/register",
  async (auth: CRED) => {
    const res = await axios.post<USER>(
      `${process.env.REACT_APP_API_URL}/api/create/`,
      auth,
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  }
);

// ログインしているユーザー情報を取得
export const fetchAsyncGetMyProf = createAsyncThunk(
  "auth/loginuser",
  async () => {
    const res = await axios.get<LOGIN_USER>(
      `${process.env.REACT_APP_API_URL}/api/loginuser/`,
      {
        headers: { Authorization: `JWT ${localStorage.localJWT}` },
      }
    );
    return res.data;
  }
);

// 初回時、Profile作成処理
export const fetchAsyncCreateProf = createAsyncThunk(
  "auth/createProfile",
  async () => {
    const res = await axios.post<PROFILE>(
      `${process.env.REACT_APP_API_URL}/api/profile/`,
      { img: null },
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

// ユーザープロフィール一覧を取得
export const fetchAsyncGetProfs = createAsyncThunk(
  "auth/profiles",
  async () => {
    const res = await axios.get<PROFILE[]>(
      `${process.env.REACT_APP_API_URL}/api/profile/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

// ユーザープロフィールの更新処理
export const fetchAsyncUpdateProf = createAsyncThunk(
  "auth/updateProfile",
  async (profile: POST_PROFILE) => {
    // Ref: https://developer.mozilla.org/ja/docs/Web/API/FormData/append
    const uploadData = new FormData();
    profile.img && uploadData.append("img", profile.img, profile.img.name);
    const res = await axios.put<PROFILE>(
      `${process.env.REACT_APP_API_URL}/api/profile/${profile.id}/`,
      uploadData,
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

const initialState: AUTH_STATE = {
  isLoginView: true,
  loginUser: { id: 0, username: "" },
  profiles: [{ id: 0, user_profile: 0, img: null }],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    toggleMode(state) {
      state.isLoginView = !state.isLoginView;
    },
  },
  // fetchAsync関数の後処理
  extraReducers: (builder) => {
    // ログイン成功したらローカルストレージにJWTトークン保存してタスク一覧画面に遷移
    builder.addCase(
      fetchAsyncLogin.fulfilled,
      (state, action: PayloadAction<JWT>) => {
        localStorage.setItem("localJWT", action.payload.access);
        action.payload.access && (window.location.href = "/tasks");
      }
    );
    // 自分のユーザー情報を取得したらstateに格納
    builder.addCase(
      fetchAsyncGetMyProf.fulfilled,
      (state, action: PayloadAction<LOGIN_USER>) => {
        return { ...state, loginUser: action.payload };
      }
    );
    // ユーザー一覧を取得したらstateに格納
    builder.addCase(
      fetchAsyncGetProfs.fulfilled,
      (state, action: PayloadAction<PROFILE[]>) => {
        return { ...state, profiles: action.payload };
      }
    );
    // プロフィール情報をアップデートしたらstateのprofiles情報を更新
    builder.addCase(
      fetchAsyncUpdateProf.fulfilled,
      (state, action: PayloadAction<PROFILE>) => {
        return {
          ...state,
          profiles: state.profiles.map((prof) =>
            prof.id === action.payload.id ? action.payload : prof
          ),
        };
      }
    );
  },
});

export const { toggleMode } = authSlice.actions;

// useSelectorで参照できるように各々のstateをexport
export const selectIsLoginView = (state: RootState) => state.auth.isLoginView;
export const selectLoginUser = (state: RootState) => state.auth.loginUser;
export const selectProfiles = (state: RootState) => state.auth.profiles;

export default authSlice.reducer;
