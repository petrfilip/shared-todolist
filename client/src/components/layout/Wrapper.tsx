import React, {useLayoutEffect, useState} from 'react';
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
import {Box, Button} from "@material-ui/core";
import {Link as RouterLink, useHistory, useLocation} from "react-router-dom";
import {ITask, ITodoList} from "../../Interfaces";
import DeleteIcon from '@material-ui/icons/Delete';
import ShareIcon from '@material-ui/icons/Share';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import {useClipboard} from "use-clipboard-copy";
import useWebShare from "react-use-web-share";
import {useSnackbar} from "notistack";
import AddIcon from '@material-ui/icons/Add';

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


export default function Wrapper({children}: Props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [data, setData] = useState<ITodoList[]>([]);
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

  useLayoutEffect(() => {
    const stringTask = localStorage.getItem("myTasks") || "[]";
    setData(JSON.parse(stringTask) || [])
  }, [open])

  const removeFromLocalStorage = (uuid: number) => {
    const stringTask = localStorage.getItem("myTasks") || "[]";
    const parsedTasks = JSON.parse(stringTask) || [];
    const filteredTasks = parsedTasks.filter((item: ITodoList, index: number) => item.uuid !== uuid);
    localStorage.setItem("myTasks", JSON.stringify(filteredTasks));
    setData(filteredTasks)
  }

  const shareIconHandler = () => {
    if (isSupported) {
      share({title: "asdf", text:"aaaa", url: window.location.href})
    } else {
      clipboard.copy(window.location.href);
    }
  }

  return (
      <div className={classes.root}>
        <CssBaseline/>
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

            <IconButton color="inherit">
              <FileCopyIcon/>
            </IconButton>
            <IconButton color="inherit" onClick={shareIconHandler}>
              <ShareIcon/>
            </IconButton>
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
                  <AddIcon />
                </IconButton>
                Add new
              </ListItemText>
            </ListItem>
            <Divider/>
            {data.map((item, index) => (
                <ListItem button key={item.uuid} component={RouterLink} to={`/todolist/${item.uuid}`}>
                  <ListItemText><IconButton onClick={(e) => {
                    e.preventDefault()
                    removeFromLocalStorage(item.uuid)
                  }}><DeleteIcon/></IconButton>{item.title}</ListItemText>
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