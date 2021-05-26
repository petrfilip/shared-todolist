import React, {ChangeEvent, FC, useState} from 'react';
import '../../App.css';
import {ITask} from "../../Interfaces";
import TodoTaskEditor from "./TodoTaskEditor";
import {Button, Container, Grid, Paper, TextField} from "@material-ui/core";
import {useHistory} from "react-router-dom";


const TodoListEditor: FC = () => {

  const [title, setTitle] = useState<string>("");
  const [task, setTask] = useState<string>("");
  const [taskList, setTaskList] = useState<ITask[]>([]);
  const [isError, setIsError] = useState("")
  let history = useHistory();

  const handleChangeTask = (e: ChangeEvent<HTMLInputElement>): void => {
    setTask(e.target.value);
  }

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value);

  }

  const publishTodoList = (): void => {

    fetch(`${process.env.REACT_APP_BASE_URI}/todolist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({title, taskList}),
    })
    .then(r => r.json())
    .then(r => {
      history.push(`/todolist/${r.uuid}`)
    })
    .catch(e => setIsError("error!!!"));

  }

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

  const completeTask = (key: number): void => {
    const newTodoList = [...taskList];
    newTodoList[key].isCompleted = !newTodoList[key].isCompleted
    setTaskList(newTodoList);
  }

  return (
      <Container maxWidth={"xs"} style={{marginTop: "10vh"}}>
        {/*<pre>{JSON.stringify(taskList, null, 2)}</pre>*/}
        <Paper variant={"outlined"} style={{padding: "20px"}}>
          <Grid container={true} spacing={2}>
            <Grid item xs={8}>
              <TextField
                  inputProps={{ maxLength: 255 }}
                  color={"primary"}
                  autoComplete={"off"}
                  value={title} placeholder={"Todo list name"} name={"title"} onChange={handleChangeTitle}/>
            </Grid>
            <Grid item xs={4}>
              <Button
                  disabled={taskList.length === 0 || !title}
                  fullWidth={true} variant={"outlined"} color={"primary"} onClick={publishTodoList}>Publish</Button>
            </Grid>

            <Grid item xs={12}>
              {taskList.map((item: ITask, key: number) => <TodoTaskEditor key={key} completeTask={() => completeTask(key)} task={item}/>)}
            </Grid>
            <Grid item xs={8}>
              <TextField
                  inputProps={{ maxLength: 255 }}
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
