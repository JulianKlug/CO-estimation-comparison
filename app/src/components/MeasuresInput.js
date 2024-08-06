import SensorOccupiedIcon from '@mui/icons-material/SensorOccupied';
import { makeStyles } from 'tss-react/mui';
import * as React from 'react';
import {FormControl, InputAdornment, MenuItem, TextField} from '@mui/material';
import {isMobile} from "../utils";



const useStyles = makeStyles()((theme, _params, classes) => ({
    currentMeasures: {
        alignItems: 'center',
        display: 'inline-flex',
        gap: '5vw',
        marginTop: '2vh',
        marginLeft: '2vw',
    },
}));

export default function MeasuresInput({mPAP, PAWP, mCO, setMPAP, setPAWP, setMCO}) {
  const {classes} = useStyles();

  return (
    <div className={classes.currentMeasures}>
        {isMobile() ? null : (<SensorOccupiedIcon size="inherit"/>)}
            {/*mPAP: */}
            <TextField style={{width: "12ch"}} id="standard-basic" variant="standard" label={"mPAP"} defaultValue={mPAP}
                                 InputProps={{endAdornment:<InputAdornment position="end">mmHg</InputAdornment>}}
                    onChange={(event) => {
                                    setMPAP(parseFloat(event.target.value));
                                    }
                    }
            />


            {/*PAWP:  */}
            <TextField style={{width: "12ch"}} id="standard-basic" variant="standard" label={"PAWP"} defaultValue={PAWP}
                                 InputProps={{endAdornment:<InputAdornment position="end">mmHg</InputAdornment>}}
                    onChange={(event) => {
                                    setPAWP(parseFloat(event.target.value));
                                    }
                    }
            />

            {/*CO:  */}
            <TextField style={{width: "8ch"}} id="standard-basic" variant="standard" label={"CO"} defaultValue={mCO}
                                 InputProps={{endAdornment:<InputAdornment position="end">L/min</InputAdornment>}}
                    onChange={(event) => {
                                    setMCO(parseFloat(event.target.value));
                                    }
                    }
            />
    </div>
  );
}