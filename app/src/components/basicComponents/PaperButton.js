import React from 'react';
import IconButton from '@mui/material/IconButton';
import { makeStyles } from 'tss-react/mui';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import {isMobile} from "../../utils";

const useStyles = makeStyles()((theme, _params, classes) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function PaperButton() {
  const classes = useStyles();

  const buttonProps = {
    fontSize: isMobile ? "default" : "large",
  };

  return (
    <div className={classes.root}>
      <IconButton aria-label="info" color="gray">
        <DescriptionOutlinedIcon {...buttonProps}
            onClick={() => window.open("https://doi.org/10.3390/jcm12020410")}
        />
      </IconButton>
    </div>
  );
}

