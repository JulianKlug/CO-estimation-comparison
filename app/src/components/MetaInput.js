import SensorOccupiedIcon from '@mui/icons-material/SensorOccupied';
import { makeStyles } from 'tss-react/mui';
import * as React from 'react';
import {FormControl, InputAdornment, MenuItem, TextField, Typography} from '@mui/material';
import {isMobile} from "../utils";



const useStyles = makeStyles()((theme, _params, classes) => ({
    currentMeta: {
        alignItems: 'center',
        display: 'inline-flex',
        gap: '2vw',
        marginTop: '2vh',
        marginLeft: '2vw',
    },
    currentMethod: {
        textAlign: 'left',
        marginTop: '2vh',
        marginLeft: '2vw',
    }
}));

export default function MetaInput({LoA, lowerBoundCO, upperBoundCO, PVRThreshold, method,
                                      setLoA, setLowerBoundCO, setUpperBoundCO, setPVRThreshold, setMethod}) {
  const {classes} = useStyles();

  return (
        <div style={{
            display: 'flex',
            flexDirection: isMobile() ? 'column' : 'row',
        }}>
            <div className={classes.currentMethod}>

      {/*Method*/}
            <TextField
                id="standard-select-model"
                select
                defaultValue={method}
                label={"Method"}
                onChange={(event) => {
                    setMethod(event.target.value); }
                }
            >
                {['absolute', 'relative'].map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </TextField>
            </div>
    <div className={classes.currentMeta}>
            {/*Limits of Agreement: */}
            <TextField style={{width: "7ch"}} id="standard-basic" variant="standard" label={"LoA"} defaultValue={LoA}
                                 InputProps={{endAdornment:<InputAdornment position="end">
                                         {method === "absolute" ? "L/min" : "%"}
                                 </InputAdornment>}}
                    onChange={(event) => {
                        method === "absolute" ? setLoA(parseFloat(event.target.value)) : setLoA(parseFloat(event.target.value) / 100);
                                    }
                    }
            />
        {method === "absolute" ?
            (
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
                        InputProps={{endAdornment: <InputAdornment position="end">L/min</InputAdornment>}}
                        onChange={(event) => {
                            setUpperBoundCO(event.target.value);
                        }
                        }
                    />
                </div>
            ): null
        }


        {/*PVR Threshold*/}
        <TextField
            id="standard-select-threshold"
            select
            defaultValue={PVRThreshold}
            label={"PVR Threshold"}
            onChange={(event) => {
                setPVRThreshold(event.target.value);
            }
            }
        >
            {[2, 3].map((option) => (
                <MenuItem key={option} value={option}>
                    {option} mmHg
                </MenuItem>
            ))}
        </TextField>

    </div>
        </div>
  );
}