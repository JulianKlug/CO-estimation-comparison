/**
 * Precapillary pulmonary hypertension: diagnostic disagreement between Fick and thermodilution for the measurement
 * of cardiac output for the diagnosis of pre-capillary pulmonary hypertension (PcPH).
*/
import { erf } from 'mathjs';

/**
Calculates the Pulmonary Vascular Resistance (PVR) based on the mean Pulmonary Arterial Pressure (mPAP),
Pulmonary Arterial Wedge Pressure (PAWP), and Cardiac Output (CO).
@param {number} mPAP - The mean Pulmonary Arterial Pressure.
@param {number} PAWP - The Pulmonary Arterial Wedge Pressure.
@param {number} CO - The Cardiac Output.
@returns {number} The calculated Pulmonary Vascular Resistance (PVR).
 */
function PVR_calc(mPAP, PAWP, CO, epsilon = 0.0001) {

    // transpulmonary pressure gradient
    const TPG = mPAP - PAWP;
    const PVR = TPG / (CO + epsilon);
    return PVR;
}


/**
 * Checks if the provided values meet the simplified PVR criteria for pulmonary hypertension (PcPH).
 *
 * @param {number} mPAP - Mean pulmonary artery pressure.
 * @param {number} PAWP - Pulmonary artery wedge pressure.
 * @param {number} CO - Cardiac output.
 * @param {number} PVRLimit - PVR limit for diagnosis of PcPH (default is 2).
 * @returns {boolean} - True if meets PcPH criteria, false otherwise.
 */
function meets_PcPH_criteria(mPAP, PAWP, CO, PVRLimit = 2) {
    // Calculate PVR using the PVR_calc function
    const PVR = PVR_calc(mPAP, PAWP, CO);

    // Check if PVR is greater than or equal to 3
    if (PVR >= PVRLimit) {
        return true;
    } else {
        return false;
    }
}

/**
 * Calculates the cumulative distribution function (CDF) for a normal distribution.
 *
 * @param {number} x - The value for which to calculate the CDF.
 * @param {number} mean - The mean of the normal distribution.
 * @param {number} standardDeviation - The standard deviation of the normal distribution.
 * @returns {number} The calculated CDF.
 */
function cdfNormal (x, mean, standardDeviation) {
  return (1 - erf((mean - x ) / (Math.sqrt(2) * standardDeviation))) / 2
}


/**
 * Compute P(DD ∩ Ir), where Ir is the probability that the CO is within the pre-specified limits [ar, br].
 *
 * P(DD+ ∩ Ir) = P(COm − br ≤ X ≤ min(COm − TPG/3, COm − ar)
 * P(DD− ∩ Ir) = P(max(COm − TPG/3, COm − br) ≤ X ≤ COm − ar)
 *
 * @param {number} mPAP - Mean pulmonary artery pressure.
 * @param {number} PAWP - Pulmonary artery wedge pressure.
 * @param {number} COm - measured cardiac output.
 * @param {number} ar - Lower bound of cardiac output.
 * @param {number} br - Upper bound of cardiac output.
 * @param {number} LoA - Limits of agreement.
 * @param {number} PVR_limit - PVR limit for diagnosis of PcPH (default is 2).
 * @returns {number} - Probability of P(DD ∩ Ir).
 */
function P_DD_and_Ir(mPAP, PAWP, COm, ar, br, LoA, PVR_limit = 2) {
    // Delta to lower and upper bounds of interval
    const delta_COm_lower_bound = COm - ar;
    const delta_COm_upper_bound = COm - br;

    const TPG = mPAP - PAWP;
    const PVR_over_limit = COm - TPG / PVR_limit;

    const meetsPcPHCriteria = meets_PcPH_criteria(mPAP, PAWP, COm, PVR_limit);

    // Compute lower and upper bounds of probability of P(DD ∩ Ir)
    let lower_bound, upper_bound;
    if (meetsPcPHCriteria) {
        // Bounds for P(DD+ ∩ Ir)
        lower_bound = delta_COm_upper_bound;
        upper_bound = Math.min(delta_COm_lower_bound, PVR_over_limit);
    } else {
        // Bounds for P(DD- ∩ Ir)
        lower_bound = Math.max(delta_COm_upper_bound, PVR_over_limit);
        upper_bound = delta_COm_lower_bound;
    }

    // Cumulative distribution function of normal distribution of lower and upper bounds
    const P_lower_bound = cdfNormal(lower_bound, 0, LoA / 1.96);
    const P_upper_bound = cdfNormal(upper_bound, 0, LoA / 1.96);

    // Compute P(DD ∩ Ir)
    let P_DD_and_Ir;
    if (upper_bound > lower_bound) {
        P_DD_and_Ir = P_upper_bound - P_lower_bound;
    } else {
        P_DD_and_Ir = 0;
    }

    return P_DD_and_Ir;
}



/**
 * Compute P(Ir), where Ir is the probability that the cardiac output (CO) is within the pre-specified limits [ar, br].
 * P(Ir) = P(COm − br ≤ X ≤ COm − ar)
 *
 * @param {number} COm - measured cardiac output.
 * @param {number} ar - Lower bound of cardiac output.
 * @param {number} br - Upper bound of cardiac output.
 * @param {number} LoA - Limits of agreement.
 * @returns {number} - Probability of P(Ir).
 */
function P_Ir(COm, ar, br, LoA) {
    // Delta to lower and upper bounds of interval
    const delta_COm_lower_bound = COm - ar;
    const delta_COm_upper_bound = COm - br;

    // Cumulative distribution function of normal distribution of lower and upper bounds
    const P_lower_bound = cdfNormal(delta_COm_upper_bound, 0, LoA/1.96);
    const P_upper_bound = cdfNormal(delta_COm_lower_bound, 0, LoA/1.96);

    // Compute P(Ir)
    let P_Ir;
    if (delta_COm_lower_bound > delta_COm_upper_bound) {
        P_Ir = P_upper_bound - P_lower_bound;
    } else {
        P_Ir = 0;
    }

    return P_Ir;
}


/**
 * Compute P(DD+|Ir), where Ir is the probability that the cardiac output (CO) is within the pre-specified limits [ar, br].
 *
 * @param {number} mPAP - Mean pulmonary artery pressure.
 * @param {number} PAWP - Pulmonary artery wedge pressure.
 * @param {number} COm - measured cardiac output.
 * @param {number} ar - Lower bound of cardiac output.
 * @param {number} br - Upper bound of cardiac output.
 * @param {number} LoA - Limits of agreement.
 * @param {number} PVR_limit - PVR limit (default is 2).
 * @returns {number} - Probability of P(DD+|Ir).
 */
function P_DD_plus_given_Ir(mPAP, PAWP, COm, ar, br, LoA, PVR_limit = 2) {
    // Calculate P(DD ∩ Ir) and P(Ir)
    const P_DD_and_Ir_value = P_DD_and_Ir(mPAP, PAWP, COm, ar, br, LoA, PVR_limit);
    const P_Ir_value = P_Ir(COm, ar, br, LoA);

    // Only valid if PcPH criteria are met
    if (meets_PcPH_criteria(mPAP, PAWP, COm, PVR_limit)) {
        // Compute P(DD+|Ir)
        const P_DD_plus_given_Ir = P_DD_and_Ir_value / P_Ir_value;
        return P_DD_plus_given_Ir;
    } else {
        return 0;
    }
}


/**
 * Compute P(DD-|Ir), where Ir is the probability that the cardiac output (CO) is within the pre-specified limits [ar, br].
 *
 * @param {number} mPAP - Mean pulmonary artery pressure.
 * @param {number} PAWP - Pulmonary artery wedge pressure.
 * @param {number} COm - measured cardiac output.
 * @param {number} ar - Lower bound of cardiac output.
 * @param {number} br - Upper bound of cardiac output.
 * @param {number} LoA - Limits of agreement.
 * @param {number} PVR_limit - PVR limit (default is 2).
 * @returns {number} - Probability of P(DD-|Ir).
 */
function P_DD_minus_given_Ir(mPAP, PAWP, COm, ar, br, LoA, PVR_limit = 2) {
    // Check for NaN inputs
    if (isNaN(mPAP) || isNaN(PAWP) || isNaN(COm)) {
        return 0;
    }

    // Calculate P(DD ∩ Ir) and P(Ir)
    const P_DD_and_Ir_value = P_DD_and_Ir(mPAP, PAWP, COm, ar, br, LoA, PVR_limit);
    const P_Ir_value = P_Ir(COm, ar, br, LoA);

    // Only valid if PcPH criteria are not met
    if (!meets_PcPH_criteria(mPAP, PAWP, COm, PVR_limit)) {
        // Compute P(DD-|Ir)
        const P_DD_minus_given_Ir = P_DD_and_Ir_value / P_Ir_value;
        return P_DD_minus_given_Ir;
    } else {
        return 0;
    }
}

/**
 * Calculates the relative P(DD) where LoA is giving relatively
 *
 * @param {number} mPAP - The mean pulmonary arterial pressure.
 * @param {number} PAWP - The pulmonary artery wedge pressure.
 * @param {number} COm - The cardiac output.
 * @param {number} LoA - Limits of agreement.
 * @param {number} [PVR_limit=2] - The pulmonary vascular resistance limit for diagnosis of PcPH.
 * @returns {number} P(DD) - The calculated relative P(DD).
 */
function relative_P_DD(mPAP, PAWP, COm, LoA, PVR_limit = 2) {
    const PVR = PVR_calc(mPAP, PAWP, COm);
    const relative_X = 2 * (PVR_limit - PVR) / (PVR_limit + PVR);
    const relative_P_DD = cdfNormal(relative_X, 0, LoA / 1.96);
    return relative_P_DD;
}

/**
 * Calculates the relative P(DD+) where LoA is giving relatively
 * @param {number} mPAP - The mean pulmonary arterial pressure.
 * @param {number} PAWP - The pulmonary artery wedge pressure.
 * @param {number} COm - The cardiac output.
 * @param {number} LoA - Limits of agreement.
 * @param {number} [PVR_limit=2] - The pulmonary vascular resistance limit for diagnosis of PcPH.
 * @returns {number} P(DD+) - The calculated relative P(DD+).
 */
function relative_P_DD_plus(mPAP, PAWP, COm, LoA, PVR_limit = 2) {
    // Check for NaN inputs
    if (isNaN(mPAP) || isNaN(PAWP) || isNaN(COm)) {
        return 0;
    }

    // Only valid if PcPH criteria are met
    if (meets_PcPH_criteria(mPAP, PAWP, COm, PVR_limit)) {
        // Compute relative P(DD+)
        const relative_P_DD_plus = relative_P_DD(mPAP, PAWP, COm, LoA, PVR_limit);
        return relative_P_DD_plus;
    } else {
        return 0;
    }
}

/**
 * Calculates the relative P(DD-) where LoA is giving relatively
 * @param mPAP - The mean pulmonary arterial pressure.
 * @param PAWP - The pulmonary artery wedge pressure.
 * @param COm - The cardiac output.
 * @param LoA - Limits of agreement.
 * @param PVR_limit - The pulmonary vascular resistance limit for diagnosis of PcPH.
 * @returns {number} P(DD-) - The calculated relative P(DD-).
 */
function relative_P_DD_minus(mPAP, PAWP, COm, LoA, PVR_limit = 2) {
    // Check for NaN inputs
    if (isNaN(mPAP) || isNaN(PAWP) || isNaN(COm)) {
        return 0;
    }

    // Only valid if PcPH criteria are not met
    if (!meets_PcPH_criteria(mPAP, PAWP, COm, PVR_limit)) {
        // Compute relative P(DD-)
        const relative_P_DD_minus = 1 - relative_P_DD(mPAP, PAWP, COm, LoA, PVR_limit);
        return relative_P_DD_minus;
    } else {
        return 0;
    }
}

export { PVR_calc, P_DD_plus_given_Ir, P_DD_minus_given_Ir , relative_P_DD_plus, relative_P_DD_minus };
