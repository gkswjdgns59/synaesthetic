import './App.css';
import React, { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Pose } from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import * as PoseLibrary from '@mediapipe/pose';
import * as cam from '@mediapipe/camera_utils';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  let camera = null;

  function onResults(results) {
    const VIDEO_WIDTH = webcamRef.current.video.videoWidth;
    const VIDEO_HEIGHT = webcamRef.current.video.videoHeight;

    canvasRef.current.width = VIDEO_WIDTH;
    canvasRef.current.height = VIDEO_HEIGHT;

    const canvasElement = canvasRef.current;
    const canvasContext = canvasElement.getContext("2d");
    canvasContext.save();
    canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);

    canvasContext.globalCompositeOperation = 'destination-atop';
    canvasContext.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    
    canvasContext.globalCompositeOperation = 'source-over';
    drawConnectors(canvasContext, results.poseLandmarks, PoseLibrary.POSE_CONNECTIONS, {color: '#00FF00', lineWidth: 4});
    drawLandmarks(canvasContext, results.poseLandmarks, {color: '#FF0000', lineWidth: 2});

    canvasContext.restore();
  }
  
  useEffect(() => {
    const pose = new Pose({
      locateFile : (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      }
    });
  
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    
    pose.onResults(onResults);

    if (typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null) {
        camera = new cam.Camera(webcamRef.current.video, {
          onFrame : async () => {
            await pose.send({image: webcamRef.current.video});
          }
        })
        camera.start();
    }
  }, []);

  return (
    <div className="App">
      <Webcam
        ref = {webcamRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 640,
          height: 480,
        }}
      ></Webcam>
      <canvas
        ref = {canvasRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 640,
          height: 480,
        }}
      ></canvas>
    </div>
  );
}

export default App;
