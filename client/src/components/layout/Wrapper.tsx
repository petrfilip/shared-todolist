import React, {FC} from 'react';
import clsx from 'clsx';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {Link as RouterLink, useHistory} from "react-router-dom";
import DeleteIcon from '@material-ui/icons/Delete';
import ShareIcon from '@material-ui/icons/Share';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import {useClipboard} from "use-clipboard-copy";
import useWebShare from "react-use-web-share";
import {useSnackbar} from "notistack";
import AddIcon from '@material-ui/icons/Add';
import useTodoList from "./UseTodoListHook";
import EditIcon from '@material-ui/icons/Edit';
import { Helmet } from 'react-helmet';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  title: {
    flexGrow: 1,
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

interface Props {
  children: React.ReactNode
}


const Wrapper: FC<Props> = ({children}: Props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const {allTodoLists, removeFromLocalStorage, todoList} = useTodoList();
  let history = useHistory();
  const {enqueueSnackbar} = useSnackbar();
  const clipboard = useClipboard({
    onSuccess() {
      enqueueSnackbar('Address was copied successfully!', {variant: 'success'})
    },
    onError() {
      enqueueSnackbar('Failed to copy text!', {variant: 'error'})
    }
  });
  const {loading, isSupported, share} = useWebShare(
      () => {
        enqueueSnackbar('Address was copied successfully!', {variant: 'success'})
      },
      () => {
        enqueueSnackbar('Failed to copy text!', {variant: 'error'})
      }
  );

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const shareIconHandler = () => {
    if (isSupported) {
      share({title: todoList?.title, text: "Something new to do...", url: window.location.href})
    } else {
      clipboard.copy(window.location.href);
    }
  }

  const getPageTitle = () => {
    if (todoList?.uuid === undefined) {
      return "Create new";
    }

    const title = todoList && todoList?.title || "";
    const remaining = todoList && todoList?.taskList.filter((i) => !i.isCompleted).length
    const remainingTitle = remaining === 0 ? "completed" : remaining;
    return title + " (" + remainingTitle + ")"
  }

  return (
      <div className={classes.root}>
        <CssBaseline/>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{getPageTitle()} | TODO</title>
        </Helmet>
        <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open,
            })}
        >
          <Toolbar>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon/>
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Todolist
            </Typography>

            {todoList && <>
              <IconButton color="inherit"
                          disabled={todoList?.uuid === undefined}
                          onClick={() => {
                            history.push(`/todolist/${todoList?.uuid}/edit`)
                          }
                          }>
                <EditIcon/>
              </IconButton>
              <IconButton color="inherit"
                          disabled={todoList?.uuid === undefined}
                          onClick={() => {
                            history.push(`/todolist/${todoList?.uuid}/clone`)
                          }
                          }>
                <FileCopyIcon/>
              </IconButton>
              <IconButton color="inherit" disabled={todoList?.uuid === undefined} onClick={shareIconHandler}>
                <ShareIcon/>
              </IconButton></>}
          </Toolbar>
        </AppBar>
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
              paper: classes.drawerPaper,
            }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
            </IconButton>
          </div>
          <Divider/>
          <List>
            <ListItem button key={"addNew"} component={RouterLink} to={`/`} /*onClick={() => setOpen(false)}*/>
              <ListItemText>
                <IconButton>
                  <AddIcon/>
                </IconButton>
                Add new
              </ListItemText>
            </ListItem>
            <Divider/>
            {allTodoLists?.map((item, index) => (
                <ListItem button key={item.uuid} component={RouterLink} to={`/todolist/${item.uuid}`}>
                  <ListItemText>
                    <IconButton onClick={(e) => {
                      e.preventDefault()
                      item.uuid && removeFromLocalStorage(item.uuid)
                    }}><DeleteIcon/></IconButton>
                    <Typography variant={"overline"}>{item.title}</Typography>
                    <Typography style={{display: "block"}} variant={"caption"} color={"textSecondary"}>{item.sys?.created}</Typography></ListItemText>
                </ListItem>
            ))}
          </List>
        </Drawer>
        <main
            className={clsx(classes.content, {
              [classes.contentShift]: open,
            })}
        >

          {children}
        </main>
      </div>
  );
}

export default Wrapper;