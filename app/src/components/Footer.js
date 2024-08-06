import { makeStyles } from 'tss-react/mui';
import React, {useState} from "react";

const useStyles = makeStyles()((theme, _params, classes) => ({
    phantom: {
        display: 'block',
        height: '80px',
        width: '100%',
    },
    footer: {
        position:'fixed',
        left:0,
        bottom:0,
        right:0,
        background: '#fdfdff',
        color: 'darkgray'
    },
    footerTitle: {
        marginLeft: "auto"
    },
    infoButtonPosition: {
        position: "fixed",
        bottom: '0',
        right: '1vw ',
    }
}));


const Footer = () => {
    const { classes } = useStyles();

    return (
        <div>
            <div>
                <div className={classes.phantom}/>
                <div className={classes.footer}>
                    <h2 className={classes.footerTitle}>Diagnostic disagreement for the classification of pulmonary hypertension</h2>
                </div>
            </div>
        </div>
    )
}

export default Footer;