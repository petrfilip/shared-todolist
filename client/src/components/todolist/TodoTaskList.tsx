import React, {FC} from 'react';
import {Container} from "@material-ui/core";
import {ITask} from "../../Interfaces";
import useTodoList from "../layout/UseTodoListHook";
import TodoTaskItem from "./TodoTaskItem";

const TodoTaskList: FC = () => {

  const {todoList, markAsDone} = useTodoList();

  const loaded = (
      <Container maxWidth={"xs"} style={{marginTop: "10vh"}}>
        <h1>{todoList?.title}</h1>
        {todoList?.taskList?.map((item: ITask, key: number) =>
            <TodoTaskItem key={key}
                          task={item}
                          completeTask={() => markAsDone(key, !item.isCompleted)}/>)}
      </Container>
  );

  return todoList ? loaded : <Container style={{textAlign: "center"}} maxWidth={"xs"}>Loading...</Container>
};


export default TodoTaskList;