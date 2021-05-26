import React from 'react';
import {Route, RouteComponentProps, Router} from "react-router";
import { createBrowserHistory } from "history";
import TodoListEditor from "./components/editor/TodoListEditor";
import TodoTaskList from "./components/todolist/TodoTaskList";
import {SnackbarProvider} from "notistack";

const App = () => {

  const history = createBrowserHistory();


  return (
      <SnackbarProvider maxSnack={3}>
      <Router history={history}>
        <Route path="/" exact component={TodoListEditor} />
        <Route path="/todolist/:id" component={Preview} />
      </Router>
      </SnackbarProvider>
  );
};


type TParams = { id: string };


function Preview({match}: RouteComponentProps<TParams>) {
  return <TodoTaskList taskListId={match.params.id}/>;
}

export default App;