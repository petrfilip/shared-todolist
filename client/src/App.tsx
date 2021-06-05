import React, {FC} from 'react';
import {Route, Router} from "react-router";
import {createBrowserHistory} from "history";
import TodoListEditor from "./components/editor/TodoListEditor";
import TodoTaskList from "./components/todolist/TodoTaskList";
import {SnackbarProvider} from "notistack";
import Wrapper from "./components/layout/Wrapper";
import {TodoListContextProvider} from "./components/layout/TodoListContextProvider";

const App: FC = () => {

  const history = createBrowserHistory();

  return (
      <SnackbarProvider maxSnack={3}>
        <Router history={history}>
          <TodoListContextProvider>
            <Wrapper>
              <Route path="/" exact component={TodoListEditor}/>
              <Route path="/todolist/:id/:action" exact component={TodoListEditor}/>
              <Route path="/todolist/:id" exact component={TodoTaskList}/>
            </Wrapper>
          </TodoListContextProvider>
        </Router>
      </SnackbarProvider>
  );
};


export default App;