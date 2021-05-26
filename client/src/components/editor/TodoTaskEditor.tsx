import React from 'react';
import {ITask} from "../../Interfaces";
import {Button, Checkbox, Container, FormControlLabel, Grid} from "@material-ui/core";


interface Props {
  task: ITask,
  completeTask?(): void
}

const TodoTaskEditor = ({task, completeTask}: Props) => {
  return (
      <Container>
      <FormControlLabel
          control={
            <Checkbox
                checked={task.isCompleted}
                onChange={completeTask}
                color="primary"
            />
          }
          label={task.title}
      />
      </Container>
  );
};

export default TodoTaskEditor;