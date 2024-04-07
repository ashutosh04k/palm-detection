import React, { useState, useEffect, useRef } from 'react';
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs';

const PalmDetectionApp = () => {
  const videoRef = useRef();
  const fileInputRef = useRef();
  const [model, setModel] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [palmDetected, setPalmDetected] = useState(true); // Initially assuming palm detected

  useEffect(() => {
    const loadModel = async () => {
      const handposeModel = await handpose.load();
      setModel(handposeModel);
    };

    loadModel();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        setSelectedImage(fileReader.result);
        if (model) {
          const image = new Image();
          image.src = fileReader.result;
          image.onload = async () => {
            const predictions = await model.estimateHands(image);
            if (predictions.length > 0) {
              setPalmDetected(true);
              // alert("Palm detected in the uploaded image.");
            } else {
              setPalmDetected(false);
              alert("No palm detected in the uploaded image.");
            }
            console.log(predictions);
          };
        }
      };
      fileReader.readAsDataURL(file);
    }
  };
  

  // const handleStartWebcam = async () => {
  //   if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && videoRef.current) {
  //     const video = videoRef.current;
  //     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  //     video.srcObject = stream;
  //     video.play();
  //   }
  // };

  return (
    <div>
      <div>
        {selectedImage && <img src={selectedImage} alt="Selected" width="200" />}
        {!selectedImage && palmDetected && <p>No image selected</p>}
        {!selectedImage && !palmDetected && <p>No palm detected</p>}
        <input type="file" accept=".jpg,.jpeg,.png" onChange={handleImageChange} ref={fileInputRef} style={{ display: 'none' }} />
        <button onClick={() => fileInputRef.current.click()}>Browse Image</button>
      </div>
      <div>
        {/* <button onClick={handleStartWebcam}>Start Webcam</button> */}
        <video ref={videoRef} width="640" height="480" style={{ display: 'block' }} />
      </div>
    </div>
  );
};



export default PalmDetectionApp;
