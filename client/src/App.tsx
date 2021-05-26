import React from 'react';
import {Route, RouteComponentProps, Router} from "react-router";
import {createBrowserHistory} from "history";
import TodoListEditor from "./components/editor/TodoListEditor";
import TodoTaskList from "./components/todolist/TodoTaskList";
import {SnackbarProvider} from "notistack";
import {AppBar} from "@material-ui/core";
import Navbar from "./components/layout/Navbar";
import Wrapper from "./components/layout/Wrapper";

const App = () => {

  const history = createBrowserHistory();


  return (
      <SnackbarProvider maxSnack={3}>
        <Router history={history}>
          <Navbar items={[]}/>
          <Wrapper>
            <Route path="/" exact component={TodoListEditor}/>
            <Route path="/todolist/:id" component={Preview}/>
          </Wrapper>
        </Router>
      </SnackbarProvider>
  );
};


type TParams = { id: string };


function Preview({match}: RouteComponentProps<TParams>) {
  return <TodoTaskList taskListId={match.params.id}/>;
}

export default App;