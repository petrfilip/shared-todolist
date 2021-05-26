export interface IError {
  error: string,
}

export interface ITask {
  title: string,
  isCompleted: boolean
}

export interface ITodoList {
  uuid?: number
  title: string,
  taskList: ITask[]
  sys?: ISys
}

interface ISys {
  createdBy: number,
  updatedBy: number,
  created: Date,
  updated: Date,
  version: number,
}

export type TodoListContextType = {
  todoList?: ITodoList
  setTodoList: (todo: ITodoList) => void,

  allTodoLists?: ITodoList[]
  setAllTodoLists: (todo: ITodoList[]) => void
}