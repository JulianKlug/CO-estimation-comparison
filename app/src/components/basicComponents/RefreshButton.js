import React from 'react';
import IconButton from '@mui/material/IconButton';
import { makeStyles } from 'tss-react/mui';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import {isMobile} from "../../utils";

const useStyles = makeStyles()((theme, _params, classes) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function RefreshButton() {
  const classes = useStyles();

  const buttonProps = {
    fontSize: isMobile ? "default" : "large",
  };

  return (
    <div className={classes.root}>
      <IconButton aria-label="info" color="primary">
        <RefreshOutlinedIcon {...buttonProps}
          onClick={() => window.location.reload(false)}
        />
      </IconButton>
    </div>
  );
}

