import React from "react";
import { useSelector } from "react-redux";

import { Table, TableBody, TableCell, TableRow } from "@material-ui/core";

import { selectSelectedTask } from "./taskSlice";

const TaskDisplay: React.FC = () => {
  const selectedTask = useSelector(selectSelectedTask);

  const rows = [
    { item: "タスク", data: selectedTask.task },
    { item: "詳細", data: selectedTask.description },
    { item: "内容", data: selectedTask.criteria },
    { item: "作成者", data: selectedTask.owner_username },
    { item: "担当者", data: selectedTask.responsible_username },
    { item: "日数", data: selectedTask.estimate },
    { item: "カテゴリ", data: selectedTask.category_item },
    { item: "進捗", data: selectedTask.status_name },
    { item: "作成日時", data: selectedTask.created_at },
    { item: "更新日時", data: selectedTask.updated_at },
  ];

  if (!selectedTask.task) return null;
  return (
    <div>
      <h2>タスク詳細</h2>
      <Table>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.item}>
              <TableCell align="left">
                <strong>{row.item}</strong>
              </TableCell>
              <TableCell align="center">{row.data}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskDisplay;
