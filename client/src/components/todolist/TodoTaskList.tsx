import React, {FC} from 'react';
import {Container} from "@material-ui/core";
import {ITask} from "../../Interfaces";
import useTodoList from "../layout/UseTodoListHook";
import TodoTaskItem from "./TodoTaskItem";
import {makeStyles, useTheme} from "@material-ui/core/styles";


const useStyles = makeStyles(theme => ({
      root: {
        marginTop: "10vh",
      },
    })
);


const TodoTaskList: FC = () => {
  const {todoList, markAsDone, isLoading} = useTodoList();
  const theme = useTheme();
  const classes = useStyles(isLoading);

  const loaded = (
      <Container maxWidth={"xs"} className={classes.root}
                 style={{color: isLoading ? theme.palette.text.disabled : theme.palette.text.primary,
                   transition:"color 3s ease"}}>
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