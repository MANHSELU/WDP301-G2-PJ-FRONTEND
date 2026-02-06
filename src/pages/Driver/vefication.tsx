import React, { useEffect, useRef, useState } from 'react';
import './FaceVerification.css';

const FaceVerification: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVerifying, setIsVerifying] = useState<boolean>(false);
    const [cameraStatus, setCameraStatus] = useState<string>('Camera đang hoạt động');
    const startCamera = async (): Promise<void> => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setCameraStatus('Camera đang hoạt động');
            }
        } catch (error) {
            console.error('Không thể truy cập camera:', error);
            setCameraStatus('Không thể truy cập camera');
            alert('Không thể truy cập camera. Vui lòng cho phép quyền truy cập camera.');
        }
    };

    const stopCamera = (): void => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }
    };
    useEffect(() => {
        startCamera();

        return () => {
            stopCamera();
        };
    }, []);



    const handleVerifyFace = (): void => {
        setIsVerifying(true);

        // Giả lập quá trình xác thực
        setTimeout(() => {
            alert('Xác thực thành công! ✓');
            setIsVerifying(false);
        }, 2000);
    };

    const handleGoBack = (): void => {
        if (window.confirm('Bạn có chắc muốn quay lại?')) {
            stopCamera();
            alert('Đã hủy xác thực');
            // window.history.back();
        }
    };

    return (
        <div className="face-verification-container">
            <div className="container">
                <div className="left-section">
                    <div className="logo-text">
                        Trở lại với <span>Bustrip</span>
                    </div>
                    <h1 className="title">
                        XÁC THỰC<br />GƯƠNG MẶT
                    </h1>
                    <div className="buttons">
                        <button
                            className="btn btn-back"
                            onClick={handleGoBack}
                        >
                            Trở lại
                        </button>
                        <button
                            className="btn btn-verify"
                            onClick={handleVerifyFace}
                            disabled={isVerifying}
                        >
                            {isVerifying ? 'Đang xác thực...' : 'Xác nhận'}
                        </button>
                    </div>
                </div>

                <div className="right-section">
                    <div className="camera-container">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                        />

                        <div className="overlay">
                            <div className="face-frame">
                                <div className="corner corner-tl"></div>
                                <div className="corner corner-tr"></div>
                                <div className="corner corner-bl"></div>
                                <div className="corner corner-br"></div>
                                <div className="face-oval"></div>
                                <div className="scan-line"></div>
                            </div>
                        </div>

                        <div className="status-indicator">
                            <div className="status-dot"></div>
                            <span>{cameraStatus}</span>
                        </div>

                        <div className="instruction">
                            Align your face within the frame
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FaceVerification;