import React, {ChangeEvent, FC, useLayoutEffect, useState} from 'react';
import '../../App.css';
import {ITask} from "../../Interfaces";
import TodoTaskEditor from "./TodoTaskEditor";
import {Button, Container, Grid, Paper, TextField} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import useTodoList from "../layout/UseTodoListHook";
import {useParams} from "react-router";


const TodoListEditor: FC = () => {

  const [uuid, setUuid] = useState<number | undefined>(undefined);
  const [title, setTitle] = useState<string>("");
  const [task, setTask] = useState<string>("");
  const [taskList, setTaskList] = useState<ITask[]>([]);
  const {publishTodoList, todoList, editTodoList} = useTodoList();

  let {action} = useParams<{ action: string | undefined }>();
  let {id} = useParams<{ id: string }>();


  const handleChangeTask = (e: ChangeEvent<HTMLInputElement>): void => {
    setTask(e.target.value);
  }

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value);

  }

  useLayoutEffect(() => {
    if (action === "clone" && todoList) {
      setUuid(undefined)
      setTitle(todoList?.title || "");
      setTaskList(todoList?.taskList || []);
      return
    }

    if (action === "edit" && todoList) {
      setUuid(todoList?.uuid);
      setTitle(todoList?.title || "");
      setTaskList(todoList?.taskList || []);
      return
    }
  }, [id, action])


  const addTask = (): void => {
    if (task !== "") {
      const newTask: ITask = {
        title: task,
        isCompleted: false
      }
      setTaskList([...taskList, newTask])
      setTask("");
    }

  }

  const removeTask = (key: number): void => {
    setTaskList(taskList.filter((item, index ) => index !== key ));
  }

  return (
      <Container maxWidth={"xs"} style={{marginTop: "10vh"}}>
        <Paper variant={"outlined"} style={{padding: "20px"}}>
          <Grid container={true} spacing={2}>
            <Grid item xs={8}>
              <TextField
                  inputProps={{maxLength: 255}}
                  color={"primary"}
                  autoComplete={"off"}
                  value={title} placeholder={"Todo list name"} name={"title"} onChange={handleChangeTitle}/>
            </Grid>
            <Grid item xs={4}>
              {!uuid && <Button
                disabled={taskList.length === 0 || !title}
                fullWidth={true} variant={"outlined"} color={"primary"} onClick={() => publishTodoList({title, taskList})}>Publish</Button>}

              {uuid && <Button
                disabled={taskList.length === 0 || !title}
                fullWidth={true} variant={"outlined"} color={"secondary"} onClick={() => editTodoList({uuid, title, taskList})}>Edit</Button>}

            </Grid>

            <Grid item xs={12}>
              {taskList?.map((item: ITask, key: number) => <TodoTaskEditor key={key} onDeleteClick={() => removeTask(key)} task={item}/>)}
            </Grid>
            <Grid item xs={8}>
              <TextField
                  inputProps={{maxLength: 255}}
                  color={"primary"}
                  autoComplete={"off"}
                  value={task} placeholder={"Task..."} name={"task"} onChange={handleChangeTask}/>
            </Grid>
            <Grid item xs={4}>
              <Button fullWidth={true} variant={"outlined"} color={"primary"} onClick={addTask}>Add task</Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
  );
}

export default TodoListEditor;
