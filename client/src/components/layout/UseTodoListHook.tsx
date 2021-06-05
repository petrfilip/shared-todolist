import * as React from 'react'
import {useLayoutEffect, useState} from 'react'
import {TodoListContext} from "./TodoListContextProvider";
import {IError, ITodoList, TodoListContextType} from "../../Interfaces";
import {useSnackbar} from "notistack";
import {useParams} from "react-router";
import {useHistory} from "react-router-dom";

function useTodoList() {
  const {todoList, setTodoList, allTodoLists, setAllTodoLists} = React.useContext(TodoListContext) as TodoListContextType
  const [isLoading, setIsLoading] = useState(false);
  const {enqueueSnackbar} = useSnackbar();
  let {id} = useParams<{ id: string }>();
  let history = useHistory();


  useLayoutEffect(() => {
    const stringTask = localStorage.getItem("myTasks") || "[]";
    setAllTodoLists(JSON.parse(stringTask) || [])
  }, [id])

  /**
   * Load todo list by ID
   */
  useLayoutEffect(() => {

    if (!id) {
      return
    }

    setIsLoading(true);

    fetch(`${process.env.REACT_APP_BASE_URI}/todolist/${id}`, {})
    .then(r => r.json())
    .then(r => setTodoList(r))
    .catch(e => {

      e.json().then((errorMessage: IError) => {
        enqueueSnackbar(`ERROR: ${errorMessage.error}`, {variant: 'error',});
      })

    })
    .finally(() => setIsLoading(false));
  }, [id])

  /**
   * Mark task in current todo list as done
   */
  const markAsDone = (index: number, targetState: boolean): void => {

    if (!id) {
      return
    }

    setIsLoading(true)


    const newTodoList = Object.assign({}, todoList);
    newTodoList.taskList[index].isCompleted = targetState;
    newTodoList && setTodoList(newTodoList);

    fetch(`${process.env.REACT_APP_BASE_URI}/todolist/${id}`, {
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

    })
    .finally(() => setIsLoading(false));
    ;
  }

  /**
   * Publish new todo list
   */
  const publishTodoList = (todoListToPublish: ITodoList): void => {

    setIsLoading(true)
    fetch(`${process.env.REACT_APP_BASE_URI}/todolist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoListToPublish),
    })
    .then(r => r.json())
    .then(r => {

      const stringTask = localStorage.getItem("myTasks") || "[]";
      const myTodoLists = JSON.parse(stringTask) || [];
      myTodoLists.push(r)
      localStorage.setItem("myTasks", JSON.stringify(myTodoLists));
      setAllTodoLists(myTodoLists)
      history.push(`/todolist/${r.uuid}`)
    })
    .catch(e => e.json().then((errorMessage: IError) => {
          enqueueSnackbar(`ERROR: ${errorMessage.error}`, {variant: 'error',});
        })
    )
    .finally(() => setIsLoading(false));
    ;
  }


  const editTodoList = (todoListToPublish: ITodoList): void => {

    setIsLoading(true)
    setTodoList(todoListToPublish)
    fetch(`${process.env.REACT_APP_BASE_URI}/todolist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoListToPublish),
    })
    .then(r => r.json())
    .then(r => {

      const stringTask = localStorage.getItem("myTasks") || "[]";
      let myTodoLists = JSON.parse(stringTask) || [];
      myTodoLists = myTodoLists.filter((item: ITodoList) => item.uuid !== todoListToPublish.uuid);
      myTodoLists.push(r)
      setTodoList(r)
      localStorage.setItem("myTasks", JSON.stringify(myTodoLists));
      setAllTodoLists(myTodoLists)
      history.push(`/todolist/${r.uuid}`)
    })
    .catch(e => e.json().then((errorMessage: IError) => {
          enqueueSnackbar(`ERROR: ${errorMessage.error}`, {variant: 'error',});
        })
    ).finally(() => setIsLoading(false));
    ;
  }


  /**
   * Load all todo lists from cache
   */




  const removeFromLocalStorage = (uuid: number) => {
    const stringTask = localStorage.getItem("myTasks") || "[]";
    const parsedTasks = JSON.parse(stringTask) || [];
    const filteredTasks = parsedTasks.filter((item: ITodoList, index: number) => item.uuid !== uuid);
    localStorage.setItem("myTasks", JSON.stringify(filteredTasks));
    setAllTodoLists(filteredTasks)
  }


  return {allTodoLists, isLoading, todoList, setTodoList, markAsDone, publishTodoList, removeFromLocalStorage, editTodoList, id}
}

export default useTodoList;