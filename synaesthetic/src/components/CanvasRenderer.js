// imports
import React, { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Pose } from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import * as PoseLibrary from '@mediapipe/pose';
import * as cam from '@mediapipe/camera_utils';
import styles from './style.module.css';

export default function CanvasRenderer() {
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
        drawConnectors(canvasContext, results.poseLandmarks, PoseLibrary.POSE_CONNECTIONS, {color: '#00FF00', lineWidth: 4});
        drawLandmarks(canvasContext, results.poseLandmarks, {color: '#FF0000', lineWidth: 2});
        canvasContext.restore();
    }

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
        </>
    )
}