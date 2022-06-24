import { PhonemeDb } from './PhonemeDb';
import * as Hangul from 'hangul-js';
import React, { useEffect, useState } from 'react';
import styles from './style.module.css';
import ChartBar from './ChartBar';

export default function PoseClassifier(props) {
    // define bound constants
    const LIGHTNESS_BOUND = 2;
    const PACE_BOUND1 = 40;
    const PACE_BOUND2 = 70;
    const STEP_BOUND1 = 0.05;
    const STEP_BOUND2 = 0.055;
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
            } else if (data['pace'] < PACE_BOUND2) {
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
            setOutcome(result + result + ' ');
        }
    }, [size, setSize, type, setType])

    return(
        <div className={styles.container}>
            <div className={styles.outcomeBox}>
                <div className={styles.outcomeHolder}>{`그는`}</div>
                <div className={styles.outcome}>{outcome}</div>
                <div className={styles.outcomeHolder}>{`걷는다.`}</div>
            </div>
            <div className={styles.chartBox}>
                <div className={styles.chartBarBox}>
                    <div className={styles.barTitle}>가벼움</div>
                    <ChartBar data={data['svShoulderHeight']} bound={LIGHTNESS_BOUND * 2} reverse={false}></ChartBar>
                </div>
                <div className={styles.chartBarBox}>
                    <div className={styles.barTitle}>빠르기</div>
                    <ChartBar data={data['pace']} bound={PACE_BOUND2 * 2} reverse={true}></ChartBar>
                </div>
                <div className={styles.chartBarBox}>
                    <div className={styles.barTitle}>보폭</div>
                    <ChartBar data={data['averageStep']} bound={STEP_BOUND3 * 2} reverse={false}></ChartBar>
                </div>
                <div className={styles.chartBarBox}>
                    <div className={styles.barTitle}>적극성</div>
                    <ChartBar data={data['svAngleOfArm']} bound={MAGNITUDE_BOUND * 2} reverse={false}></ChartBar>
                </div>
                <div className={styles.chartBarBox}>
                    <div className={styles.barTitle}>굽어짐</div>
                    <ChartBar data={data['averageAngleOfElbow']} bound={BEND_BOUND * 2} reverse={true}></ChartBar>
                </div>
            </div>
        </div>
    )
}