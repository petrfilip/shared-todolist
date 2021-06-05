import * as React from 'react'
import {ITodoList, TodoListContextType} from "../../Interfaces";

interface Props {
  children: React.ReactNode
}


const TodoListContext = React.createContext<TodoListContextType | undefined>(undefined);

const TodoListContextProvider: React.FC<Props> = ({children}) => {

  const [todoList, setTodoList] = React.useState<ITodoList>()
  const [allTodoLists, setAllTodoLists] = React.useState<ITodoList[]>([]);

  return (
      <TodoListContext.Provider value={{todoList, setTodoList, allTodoLists, setAllTodoLists}}>
        {children}
      </TodoListContext.Provider>
  );
};

export {TodoListContextProvider, TodoListContext};