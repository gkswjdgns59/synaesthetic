// imports
import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Pose } from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import * as PoseLibrary from '@mediapipe/pose';
import * as cam from '@mediapipe/camera_utils';
import styles from './style.module.css';
import { analyzeObject, getSingleAngleOfElbow, getSingleAngleOfArm, getSingleStep } from './PoseAnalyzer';
import PoseClassifier from './PoseClassifier';

export default function CanvasRenderer() {
    // constants
    const COLOR_ORANGE = '#FF7F00';
    const COLOR_WHITE = '#FFFFFF';

    // states
    const [data, setData] = useState(null);
    const [db, setDb] = useState([]);
    const [result, setResult] = useState({});

    // refs
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    let camera = null;

    function onResults(results) {
        // set width/height of the canvas
        const VIDEO_WIDTH = webcamRef.current.video.videoWidth;
        const VIDEO_HEIGHT = webcamRef.current.video.videoHeight;
        canvasRef.current.width = VIDEO_WIDTH;
        canvasRef.current.height = VIDEO_HEIGHT;

        // initialize canvas
        const canvasElement = canvasRef.current;
        const canvasContext = canvasElement.getContext("2d");
        canvasContext.save();
        canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);

        // draw landmark & connections on canvas
        canvasContext.globalCompositeOperation = 'destination-atop';
        canvasContext.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
        canvasContext.globalCompositeOperation = 'source-over';
        drawConnectors(canvasContext, results.poseLandmarks, PoseLibrary.POSE_CONNECTIONS, {color: COLOR_WHITE, lineWidth: 4});
        drawLandmarks(canvasContext, results.poseLandmarks, {color: COLOR_ORANGE, lineWidth: 2});
        canvasContext.restore();

        setData(results.poseLandmarks);
    }

    // executed on first render : initialize
    useEffect(() => {
        const pose = new Pose({ locateFile : (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        }});

        pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: false,
            smoothSegmentation: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        pose.onResults(onResults);

        if (typeof webcamRef.current !== 'undefined' && webcamRef.current !== null) {
            // start camera
            camera = new cam.Camera(webcamRef.current.video, {
                onFrame : async () => {
                await pose.send({image: webcamRef.current.video});
                }
            })
            camera.start();
        }
    }, []);

    // executed for every update of data
    useEffect(() => {
        if (data != null) {
            let copiedDb = [...db];
            copiedDb.push({
                angleOfElbow : getSingleAngleOfElbow(data[11], data[13], data[15]),
                angleOfArm : getSingleAngleOfArm(data[11], data[13]),
                step : getSingleStep(data[25].x, data[26].x),
                shoulderHeight : data[11].y,
                x : data[11].x
            })
            setDb(copiedDb);
            setResult(analyzeObject(copiedDb));
        }
    }, [data, setData]);

    // executed for every update of result
    useEffect(() => {
        if (!isNaN(result.pace)) {
            console.log(result);
        }
    }, [result, setResult]);

    return (
        <>
            <Webcam
                ref = {webcamRef}
                className = {styles.canvas}
            ></Webcam>
            <canvas
                ref = {canvasRef}
                className = {styles.canvas}
            ></canvas>
            <PoseClassifier data={result} />
        </>
    )
}