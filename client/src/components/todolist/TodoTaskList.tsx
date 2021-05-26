import React, {useLayoutEffect, useState} from 'react';
import {Button, Container, Grid, IconButton, Snackbar} from "@material-ui/core";
import {IError, ITask, ITodoList} from "../../Interfaces";
import TodoTaskEditor from "../editor/TodoTaskEditor";
import {useSnackbar} from "notistack";
import useTodoList from "../layout/UseTodoListHook";

const TodoTaskList = () => {

  const {todoList, markAsDone} = useTodoList();

  const loaded = (
      <Container maxWidth={"xs"}>
        <h1>{todoList?.title}</h1>
        {todoList?.taskList?.map((item: ITask, key: number) =>
            <TodoTaskEditor key={key}
                            task={item}
                            completeTask={() => markAsDone(key, !item.isCompleted)}/>)}
      </Container>
  );

  return todoList ? loaded : <Container style={{textAlign: "center"}} maxWidth={"xs"}>Loading...</Container>
};


export default TodoTaskList;