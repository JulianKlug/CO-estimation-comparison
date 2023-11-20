import SensorOccupiedIcon from '@mui/icons-material/SensorOccupied';
import { makeStyles } from 'tss-react/mui';
import * as React from 'react';
import {FormControl, InputAdornment, MenuItem, TextField, Typography} from '@mui/material';



const useStyles = makeStyles()((theme, _params, classes) => ({
    currentMeasures: {
        alignItems: 'center',
        display: 'inline-flex',
        gap: '2vw',
        marginTop: '2vh',
        marginLeft: '2vw',
    },
}));

export default function MetaInput({LoA, lowerBoundCO, upperBoundCO, PVRThreshold, setLoA, setLowerBoundCO, setUpperBoundCO, setPVRThreshold}) {
  const {classes} = useStyles();

  return (
    <div className={classes.currentMeasures}>
       {/*<SensorOccupiedIcon size="inherit"/>*/}
            {/*Limits of Agreement: */}
            <TextField style={{width: "6ch"}} id="standard-basic" variant="standard" label={"LoA"} defaultValue={LoA}
                                 InputProps={{endAdornment:<InputAdornment position="end">L/min</InputAdornment>}}
                    onChange={(event) => {
                                    setLoA(event.target.value);
                                    }
                    }
            />
            <div style={{'display': 'inline-Flex', 'align-items': 'center'}}>
            {/*Lower limit of CO*/}
            <TextField
                       inputProps={{style: {width: "4ch", textAlign: 'right'}}}
                       id="standard-basic" variant="standard" label={" "} defaultValue={lowerBoundCO}
                    onChange={(event) => {
                                    setLowerBoundCO(event.target.value);
                                    }
                    }
            />
            <Typography sx={{paddingTop: '2ch', paddingLeft: '1ch', paddingRight: '1ch'}}>{'–'}</Typography>
            {/*Upper limit of CO*/}
            <TextField
                fullWidth
                inputProps={{style: {width: "2ch"}}}
                id="standard-basic" variant="standard" label={"Range of CO"} defaultValue={upperBoundCO}
                                 InputProps={{endAdornment:<InputAdornment position="end">L/min</InputAdornment>}}
                    onChange={(event) => {
                                    setUpperBoundCO(event.target.value);
                                    }
                    }
            />
            </div>

            {/*PVR Threshold*/}
            <TextField
                id="standard-select-model"
                select
                defaultValue={PVRThreshold}
                label={"PVR Threshold"}
                onChange={(event) => {
                    setPVRThreshold(event.target.value); }
                }
            >
                {[2, 3].map((option) => (
                    <MenuItem key={option} value={option}>
                        {option} mmHg
                    </MenuItem>
                ))}
            </TextField>

    </div>
  );
}