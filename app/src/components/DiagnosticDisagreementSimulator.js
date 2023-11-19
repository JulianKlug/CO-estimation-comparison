import { makeStyles } from 'tss-react/mui';
import { useEffect, useState } from "react";
import RefreshButton from "./basicComponents/RefreshButton";
import {P_DD_minus_given_Ir, P_DD_plus_given_Ir} from "../diagnostic_disagreement_functions";
import MeasuresInput from "./MeasuresInput";
import MetaInput from "./MetaInput";


const useStyles = makeStyles()((theme, _params, classes) => ({
    simulator: {
        width: '80vw',
        margin: 'auto',
        marginTop: '5vh',
        marginBottom: '5vh'
    },
    measuresInput: {
        width: '90%',
        margin: 'auto',
        marginBottom: '0.5vh'
    },
    // let metaInput be on top left
    metaInput: {
        position: "absolute",
        top: '0',
        left: '1vw ',
    },
    phantom: {
        display: 'block',
        height: '6ch',
        width: '100%',
    },
    refreshButtonPosition: {
        position: "absolute",
        top: '0',
        right: '1vw ',
    }
}));

const DiagnosticDisagreementSimulator = ({ }) => {
    const {classes} = useStyles();
    const [lowerBoundCO, setLowerBoundCO] = useState(2);
    const [upperBoundCO, setUpperBoundCO] = useState(12);
    const [LoA, setLoA] = useState(2);
    const [PVRLimit, setPVRLimit] = useState(2);
    const [mPAP, setMPAP] = useState();
    const [PAWP, setPAWP] = useState();
    const [mCO, setMCO] = useState();

    return (
        <div>
            <div>
                <div className={classes.metaInput}>
                    <MetaInput
                                LoA={LoA} lowerBoundCO={lowerBoundCO} upperBoundCO={upperBoundCO} PVRThreshold={PVRLimit}
                               setLoA={setLoA} setLowerBoundCO={setLowerBoundCO} setUpperBoundCO={setUpperBoundCO} setPVRThreshold={setPVRLimit}/>
                </div>
                <div className={classes.refreshButtonPosition}>
                    <RefreshButton />
                </div>
                <div className={classes.phantom}/>
            </div>
            <div className={classes.simulator}>
                <div>DD+: {Number(P_DD_plus_given_Ir(mPAP, PAWP, mCO, lowerBoundCO, upperBoundCO, LoA, PVRLimit)*100).toFixed(2)}%</div>
                <div>DD-: {Number(P_DD_minus_given_Ir(mPAP, PAWP, mCO, lowerBoundCO, upperBoundCO, LoA, PVRLimit)*100).toFixed(2)}%</div>
            </div>

            <div className={classes.measuresInput}>
                <MeasuresInput mPAP={mPAP} PAWP={PAWP} mCO={mCO} setMPAP={setMPAP} setPAWP={setPAWP} setMCO={setMCO}
                />
            </div>
        </div>
    )
}

export default DiagnosticDisagreementSimulator;