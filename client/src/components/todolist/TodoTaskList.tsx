import React, {useLayoutEffect, useState} from 'react';
import {Button, Container, Grid, IconButton, Snackbar} from "@material-ui/core";
import {IError, ITask, ITodoList} from "../../Interfaces";
import TodoTaskEditor from "../editor/TodoTaskEditor";
import {useSnackbar} from "notistack";


interface Props {
  taskListId: string
}

const TodoTaskList = ({taskListId}: Props) => {

  const [todoList, setTodoList] = useState<ITodoList>()
  const {enqueueSnackbar} = useSnackbar();

  useLayoutEffect(() => {

    if (!taskListId) {
      return
    }

    fetch(`${process.env.REACT_APP_BASE_URI}/todolist/${taskListId}`, {})
    .then(r => r.json())
    .then(r => setTodoList(r))
    .catch(e => {

      e.json().then((errorMessage: IError) => {
        enqueueSnackbar(`ERROR: ${errorMessage.error}`, {variant: 'error',});
      })

    });
  }, [taskListId])


  const markAsDone = (index: number, targetState: boolean): void => {

    const newTodoList = Object.assign({}, todoList);
    newTodoList.taskList[index].isCompleted = targetState;
    newTodoList && setTodoList(newTodoList);

    fetch(`${process.env.REACT_APP_BASE_URI}/todolist/${taskListId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({index: index, state: targetState}),
    })
    .then(r => {
      if (!r.ok) {
        throw r;
      }
    })
    .catch(e => {

      e.json().then((errorMessage: IError) => {
        enqueueSnackbar(`ERROR: ${errorMessage.error}`, {variant: 'error',});
      })

    });
  }


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