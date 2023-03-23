// authScice.ts
// GET api/loginuser/
export interface LOGIN_USER {
  id: number;
  username: string;
}
// POST upload profile avatar
export interface FILE {
  readonly lastModified: number;
  readonly name: string;
}
// GET api/profile
export interface PROFILE {
  id: number;
  user_profile: number;
  img: string | null;
}
// POST api/profile
export interface POST_PROFILE {
  id: number;
  img: File | null;
}
// POST api/create
export interface CRED {
  username: string;
  password: string;
}
// GET /authen
export interface JWT {
  refresh: string;
  access: string;
}
// GET api/users
export interface USER {
  id: number;
  username: string;
}
// states of AuthSlice
export interface AUTH_STATE {
  isLoginView: boolean; // for toggle login/register form
  loginUser: LOGIN_USER;
  profiles: PROFILE[];
}

// taskSlice
// GET api/tasks
export interface READ_TASK {
  id: number;
  task: string;
  description: string;
  criteria: string;
  status: string;
  status_name: string;
  category: number;
  category_item: string;
  estimate: number;
  responsible: number;
  responsible_username: string;
  owner: number;
  owner_username: string;
  created_at: string;
  updated_at: string;
}

// POST api/tasks
export interface POST_TASK {
  id: number;
  task: string;
  description: string;
  criteria: string;
  status: string;
  category: number;
  estimate: number;
  responsible: number;
}

// GET api/category
export interface CATEGORY {
  id: number;
  item: string;
}

// state of taskSlice
export interface TASK_STATE {
  tasks: READ_TASK[];
  editedTask: POST_TASK;
  selectedTask: READ_TASK;
  users: USER[];
  category: CATEGORY[];
}

// TaskList.tsx
export interface SORT_STATE {
  rows: READ_TASK[];
  order: "desc" | "asc";
  activeKey: string;
}
