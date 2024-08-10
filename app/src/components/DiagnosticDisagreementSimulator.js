import { makeStyles } from 'tss-react/mui';
import React, { useEffect, useState } from "react";
import RefreshButton from "./basicComponents/RefreshButton";
import {
    P_DD_minus_given_Ir,
    P_DD_plus_given_Ir, PVR_calc,
    relative_P_DD_minus,
    relative_P_DD_plus
} from "../diagnostic_disagreement_functions";
import MeasuresInput from "./MeasuresInput";
import MetaInput from "./MetaInput";
import Graph from "./Graph";
import {Typography} from "@mui/material";
import MeasuresResults from "./MeasuresResults";
import {isMobile} from "../utils";


const useStyles = makeStyles()((theme, _params, classes) => ({
    simulator: {
        width: '80vw',
        margin: 'auto',
        marginTop: '10vh',
        marginBottom: isMobile() ? 0 : '7vh',
    },
    simulatorResults: {
        width: '80vw',
        margin: 'auto',
        marginBottom: '5vh',
        display: 'flex',
        justifyContent: 'center'
    },
    simulatorResultsText: {
      textAlign: 'left'
    },
    simulatorResultNumbers: {
        display: 'inline-block',
        textAlign: 'right',
        width: '7ch'
    },
    measuresInput: {
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
    },
}));

const DiagnosticDisagreementSimulator = ({ }) => {
    const {classes} = useStyles();
    const [method, setMethod] = useState("absolute");
    const [lowerBoundCO, setLowerBoundCO] = useState(1.3);
    const [upperBoundCO, setUpperBoundCO] = useState(20);
    const [LoA, setLoA] = useState(2);
    const [PVRLimit, setPVRLimit] = useState(2);
    const [mPAP, setMPAP] = useState();
    const [PAWP, setPAWP] = useState();
    const [mCO, setMCO] = useState();
    const [simulatedDDlus, setSimulatedDDlus] = useState([]);
    const [simulatedDDMinus, setSimulatedDDMinus] = useState([]);

    // Use effect to monitor changes in mPAP, PAWP, mCO, LoA, lowerBoundCO, upperBoundCO, PVRThreshold, and update simulatedDDlus
    useEffect(() => {
        simulateDD();
    } , [mPAP, PAWP, mCO, LoA, lowerBoundCO, upperBoundCO, PVRLimit]);

    const simulateDD = () => {
        // if any of mPAP, PAWP, LoA, lowerBoundCO, upperBoundCO, PVRThreshold is empty, return []
        if (!mPAP || !PAWP || !LoA || !lowerBoundCO || !upperBoundCO || !PVRLimit) {
            return [];
        }
        const step = 0.01;
        const graph_lower_bound_CO = 0;
        const CORange = Array.from({ length: (upperBoundCO - graph_lower_bound_CO) / step + 1 }, (_, index) => graph_lower_bound_CO + index * step);

        const simulatedDDlus = CORange.map((CO) => {
            if (method === "absolute") {
                return {x: CO, y: P_DD_plus_given_Ir(mPAP, PAWP, CO, lowerBoundCO, upperBoundCO, LoA, PVRLimit)}
            }
            if (method === "relative") {
                return {x: CO, y: relative_P_DD_plus(mPAP, PAWP, CO, LoA, PVRLimit)}
            }
        })

        const simulatedDDMinus = CORange.map((CO) => {
            if (method === "absolute") {
                return {x: CO, y: P_DD_minus_given_Ir(mPAP, PAWP, CO, lowerBoundCO, upperBoundCO, LoA, PVRLimit)}
            }
            if (method === "relative") {
                return {x: CO, y: relative_P_DD_minus(mPAP, PAWP, CO, LoA, PVRLimit)}
            }
        })

        // filter out any null values in y
        const filteredsimulatedDDlus = simulatedDDlus.filter((d) => d.y !== 0);
        const filteredsimulatedDDMinus = simulatedDDMinus.filter((d) => d.y !== 0);

        setSimulatedDDlus(filteredsimulatedDDlus);
        setSimulatedDDMinus(filteredsimulatedDDMinus);

    }

    return (
        <div>
            <div>
                <div className={classes.metaInput}>
                    <MetaInput
                        LoA={LoA} lowerBoundCO={lowerBoundCO} upperBoundCO={upperBoundCO} PVRThreshold={PVRLimit}
                        setLoA={setLoA} setLowerBoundCO={setLowerBoundCO} setUpperBoundCO={setUpperBoundCO}
                        setPVRThreshold={setPVRLimit}
                        method={method} setMethod={setMethod}
                    />
                </div>
                <div className={classes.refreshButtonPosition}>
                    <RefreshButton/>
                </div>
                <div className={classes.phantom}/>
            </div>
            <div className={classes.simulator}>
                <Graph DDPlusData={simulatedDDlus} DDMinusData={simulatedDDMinus}
                       measuredCO={mCO}
                       mPAP={mPAP} PAWP={PAWP} PVRLimit={PVRLimit}
                       upperBoundCO={upperBoundCO}
                />
            </div>
            <div className={classes.simulatorResults}>
                <div className={classes.simulatorResultsText}>
                    <Typography>Probability of diagnostic error:
                        <div className={classes.simulatorResultNumbers}>
                            {method === "absolute" ? (
                                Number((P_DD_plus_given_Ir(mPAP, PAWP, mCO, lowerBoundCO, upperBoundCO, LoA, PVRLimit)
                                    + P_DD_minus_given_Ir(mPAP, PAWP, mCO, lowerBoundCO, upperBoundCO, LoA, PVRLimit)) * 100).toFixed(2)
                            ) : (
                                Number((relative_P_DD_plus(mPAP, PAWP, mCO, LoA, PVRLimit) + relative_P_DD_minus(mPAP, PAWP, mCO, LoA, PVRLimit)) * 100).toFixed(2)
                            )
                            }%
                        </div>
                    </Typography>
                </div>
            </div>

            <div className={classes.measuresInput}>
                <MeasuresInput mPAP={mPAP} PAWP={PAWP} mCO={mCO} setMPAP={setMPAP} setPAWP={setPAWP} setMCO={setMCO}
                />
            </div>
            <div>
                <MeasuresResults mPAP={mPAP} PAWP={PAWP} CO={mCO}/>
            </div>
        </div>
    )
}

export default DiagnosticDisagreementSimulator;