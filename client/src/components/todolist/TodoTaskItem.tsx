import React from 'react';
import {ITask} from "../../Interfaces";
import {Checkbox, Container, FormControlLabel} from "@material-ui/core";


interface Props {
  task: ITask,

  completeTask?(): void
}

const TodoTaskItem = ({task, completeTask}: Props) => {
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

export default TodoTaskItem;