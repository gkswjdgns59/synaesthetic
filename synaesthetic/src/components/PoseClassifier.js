import { PhonemeDb } from './PhonemeDb';
import * as Hangul from 'hangul-js';
import React, { useEffect, useState } from 'react';

export default function PoseClassifier(props) {
    // define bound constants
    const LIGHTNESS_BOUND = 2;
    const PACE_BOUND1 = 45;
    const PACE_BOUND2 = 80;
    const STEP_BOUND1 = 0.02;
    const STEP_BOUND2 = 0.04;
    const STEP_BOUND3 = 0.06;
    const MAGNITUDE_BOUND = 400;
    const BEND_BOUND = 120;
    
    // define states for data and results
    const [data, setData] = useState({});
    const [size, setSize] = useState('');
    const [type, setType] = useState('');
    const [outcome, setOutcome] = useState('');

    // get data
    useEffect(() => {
        setData(props.data);
    }, [props.data]);

    // classify the motion into types
    useEffect(() => {
        if (!isNaN(data.pace)) {
            if (data['averageStep'] < STEP_BOUND1) {
                setSize('small');
            } else if (data['averageStep'] < STEP_BOUND2) {
                setSize('medium_small');
            } else if (data['averageStep'] < STEP_BOUND3) {
                setSize('medium_large');
            } else {
                setSize('large');
            }
    
            if (data['pace'] < PACE_BOUND1) {
                if (data['svAngleOfArm'] < MAGNITUDE_BOUND) {
                    if (data['svShoulderHeight'] < LIGHTNESS_BOUND) {
                        setType('A');
                    } else {
                        setType('B');
                    }
                } else {
                    setType('C');
                }
    
            } if (data['pace'] < PACE_BOUND2) {
                if (data['svAngleOfArm'] < MAGNITUDE_BOUND) {
                    if (data['svShoulderHeight'] < LIGHTNESS_BOUND) {
                        setType('D');
                    } else {
                        setType('E');
                    }
                } else {
                    setType('F');
                }
            } else {
                if (data['svAngleOfArm'] < MAGNITUDE_BOUND) {
                    if (data['averageAngleOfElbow'] < BEND_BOUND) {
                        setType('G');
                    } else {
                        setType('H');
                    }
                } else {
                    setType('I');
                }
            }
        }
    }, [data, setData]);
    
    // map the letters and each type
    useEffect(() => {
        if (size !== '' && type !== '') {
            const result = Hangul.assemble([PhonemeDb[type]['firstConsonants'][0],
                PhonemeDb[type]['vowels'][size][0],
                PhonemeDb[type]['lastConsonants'][0]]) +
                Hangul.assemble([PhonemeDb[type]['firstConsonants'][1],
                PhonemeDb[type]['vowels'][size][1],
                PhonemeDb[type]['lastConsonants'][1]]);
            setOutcome(result + result);
        }
    }, [size, setSize, type, setType])

    return(
        <div>
            <div>{type}</div>
            <div>{outcome}</div>
        </div>
    )
}