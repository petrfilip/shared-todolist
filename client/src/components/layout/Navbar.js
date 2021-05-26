import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link as RouterLink } from "react-router-dom";

//Todo use in wrapper
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Navbar({ items }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>

          <Typography variant="h6" className={classes.title}>
            Quizy app - ADMIN
          </Typography>
          {items.map((item, i) => {
            return <Button key={`navbar-item-${i}`} startIcon={item.icon} color="inherit" component={RouterLink} to={item.to}>{item.title}</Button>
          })}

        </Toolbar>
      </AppBar>
    </div>
  );
}