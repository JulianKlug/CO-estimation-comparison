import SensorOccupiedIcon from '@mui/icons-material/SensorOccupied';
import { makeStyles } from 'tss-react/mui';
import * as React from 'react';
import {Fade, FormControl, InputAdornment, MenuItem, Paper, styled, TextField, Typography} from '@mui/material';
import {isMobile} from "../utils";
import {PVR_calc} from "../diagnostic_disagreement_functions";



const useStyles = makeStyles()((theme, _params, classes) => ({
    currentResults: {
        alignItems: 'center',
        display: 'inline-flex',
        flexDirection: 'row',
        gap: '2vh',
        marginTop: '2vh',
        marginLeft: '2vw',
    },
    currentResultItem: {
        display: 'inline-block',
        textAlign: 'center',
        width: '10ch',
        margin: '0.5vw'
    }
}));


export default function MeasuresResults({mPAP, PAWP, CO}) {
  const {classes} = useStyles();

  const PVR = PVR_calc(mPAP, PAWP, CO);
  const TPG = mPAP - PAWP;

  return (
    <div className={classes.currentResults}>
        {isNaN(TPG) ? null : (
            <Paper elevation={1} className={classes.currentResultItem}>
              <Typography variant={'subtitle2'}>
                  {TPG.toFixed(1)} mmHg
              </Typography>

              <Typography variant="caption">
                  TPG
              </Typography>
            </Paper>
        )}

        {isNaN(PVR) ? null : (
            <Fade in={true} timeout={1000}>
            <Paper elevation={1} className={classes.currentResultItem}>
                <Typography variant={'subtitle2'}>
                    {PVR.toFixed(1)} WU
                </Typography>

                <Typography variant="caption">
                    PVR
                </Typography>
            </Paper>
            </Fade>
        )}

    </div>
  );
}