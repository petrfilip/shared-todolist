export interface IError {
  error: string,
}

export interface ITask {
  title: string,
  isCompleted: boolean
}

export interface ITodoList {
  uuid: number
  title: string,
  taskList: ITask[]
}