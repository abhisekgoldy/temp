import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Modal, ModalBody, Button } from 'reactstrap';

function CameraComponent(props) {
    const { isOpen, setIsOpen, mobile } = props;
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [mediaStream, setMediaStream] = useState(null);
    const [imageData, setImageData] = useState(null);

    useEffect(() => {
        if (isOpen)
            startCamera();
    }, [isOpen]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setMediaStream(stream);
            videoRef.current.srcObject = stream;
        } catch (error) {
            console.error('Error accessing camera:', error);
            toast.error('Something Went Wrong!');
        }
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            // Set the canvas dimensions to match the video feed
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw the current video frame onto the canvas
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // You can now access the captured image data from the canvas
            const imageData = canvas.toDataURL('image/png'); // Change format as needed
            setImageData(imageData);
            // console.log('imageData', imageData);
            // Optionally, you can display the captured image
            //   const capturedImage = new Image();
            //   capturedImage.src = imageData;
            //   document.body.appendChild(capturedImage);
            // To save the image, you can send imageData to your server or use browser APIs
        } else {

        }
    };

    const saveImage = () => {
        // console.log('saving image');
        if (imageData) {
            const downloadLink = document.createElement('a');
            downloadLink.href = imageData;
            downloadLink.download = mobile + '.png';
            downloadLink.click();
            setIsOpen(false);
        }
    }

    return (
        <Modal isOpen={isOpen} centered style={{ maxWidth: 675 }}>
            <ModalBody>
                <div>
                    <div style={{ display: imageData ? 'none' : 'block' }}>
                        <video ref={videoRef} autoPlay playsInline />
                    </div>
                    <div style={{ display: imageData ? 'block' : 'none' }}>
                        <canvas ref={canvasRef}></canvas>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 10 }}>
                        {!imageData ?
                            <Button style={{ backgroundColor: "#ff0000", border: "1px solid #fff", width: '20%', height: 40 }} type="reset"
                                onClick={captureImage}
                            >
                                Capture
                            </Button>
                            :
                            <>
                                <Button style={{ backgroundColor: "#ff0000", border: "1px solid #fff", width: '20%', height: 40 }} type="reset"
                                    onClick={saveImage}
                                >
                                    Save
                                </Button>
                                <Button style={{ backgroundColor: "#ff0000", border: "1px solid #fff", width: '20%', height: 40 }} type="reset"
                                    onClick={() => setImageData(null)}
                                >
                                    Revoke
                                </Button>
                            </>
                        }
                        <Button style={{ backgroundColor: "#ff0000", border: "1px solid #fff", width: '20%', height: 40 }} type="reset"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                    {/* Add a button to capture an image */}
                </div>
            </ModalBody>
        </Modal >
    );
}

export default CameraComponent;