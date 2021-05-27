import React from 'react';
import {ITask} from "../../Interfaces";
import {Container, IconButton} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";


interface Props {
  task: ITask,
  onDeleteClick(): void
}

const TodoTaskEditor = ({task, onDeleteClick}: Props) => {
  return (
      <Container>
        <IconButton onClick={onDeleteClick}>
          <DeleteIcon/>
        </IconButton>
        {task.title}
      </Container>
  );
};

export default TodoTaskEditor;