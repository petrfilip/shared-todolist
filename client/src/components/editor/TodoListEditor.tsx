import React, {ChangeEvent, FC, useLayoutEffect, useState} from 'react';
import '../../App.css';
import {ITask} from "../../Interfaces";
import {Button, Checkbox, Container, FormControlLabel, Grid, IconButton, List, ListItem, Paper, TextField} from "@material-ui/core";
import useTodoList from "../layout/UseTodoListHook";
import {useParams} from "react-router";
import {arrayMove, List as DragAndDrop} from 'react-movable';
import DeleteIcon from "@material-ui/icons/Delete";

const TodoListEditor: FC = () => {

  const [uuid, setUuid] = useState<number | undefined>(undefined);
  const [title, setTitle] = useState<string>("");
  const [task, setTask] = useState<string>("");
  const [taskList, setTaskList] = useState<ITask[]>([]);
  const {publishTodoList, todoList, editTodoList, setTodoList} = useTodoList();

  let {action} = useParams<{ action: string | undefined }>();
  let {id} = useParams<{ id: string }>();

  const handleEditTask = (taskIndex: number, value: string): void => {
    const newTaskList = [...taskList];
    newTaskList[taskIndex].title = value
    setTaskList(newTaskList);
  }

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

    if (action === undefined && id === undefined) {
      setUuid(undefined);
      setTitle("");
      setTaskList([]);
      setTodoList({title:"", taskList:[]})
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
    setTaskList(taskList.filter((item, index) => index !== key));
  }

  const completeTask = (key: number): void => {
    const newTodoList = [...taskList];
    newTodoList[key].isCompleted = !newTodoList[key].isCompleted
    setTaskList(newTodoList);
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

              <DragAndDrop
                  values={taskList}
                  onChange={({oldIndex, newIndex}) =>
                      setTaskList(arrayMove(taskList, oldIndex, newIndex))
                  }
                  renderList={({children, props}) => <List dense {...props}>{children}</List>}
                  renderItem={({value, props, index}) => <ListItem  {...props}>
                    <ListItem>
                      <FormControlLabel
                          control={
                            <Checkbox
                                checked={value.isCompleted}
                                onChange={() => index !== undefined && completeTask(index)}
                                color="primary"
                            />
                          }
                          label={<TextField
                              variant={"standard"}
                              onChange={(e) => index !== undefined && handleEditTask(index, e.target.value)}
                              value={value.title} label={""}/>}
                      />
                    </ListItem>


                    <IconButton edge="end" aria-label="delete" onClick={() => {
                      index !== undefined && removeTask(index)
                    }}>
                      <DeleteIcon/>
                    </IconButton>


                  </ListItem>}
              />

              {/*{taskList?.map((item: ITask, key: number) => <TodoTaskEditor key={key} onDeleteClick={() => removeTask(key)} task={item}/>)}*/}
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
