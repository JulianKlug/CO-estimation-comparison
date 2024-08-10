import { makeStyles } from 'tss-react/mui';
import React, {useState} from "react";
import {isMobile} from "../utils";
import PaperButton from "./basicComponents/PaperButton";

const useStyles = makeStyles()((theme, _params, classes) => ({
    phantom: {
        display: 'block',
        height: '100px',
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
        marginLeft: "5vw",
        marginRight: "10vw",
        textAlign: "left",
    },
    infoButtonPosition: {
        position: "fixed",
        bottom: '1vw',
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
                    {isMobile() ? (
                        <h4 className={classes.footerTitle}>Estimated diagnostic error on the classification of PH by
                            using COTD instead of CODF</h4>
                    ) : (
                        <h2 className={classes.footerTitle}>Estimated diagnostic error on the classification of PH by
                            using COTD instead of CODF</h2>
                    )}
                    <div className={classes.infoButtonPosition}>
                        <PaperButton/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer;