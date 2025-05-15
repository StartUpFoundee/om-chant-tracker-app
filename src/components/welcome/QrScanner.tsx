
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Camera } from "lucide-react";

interface QrScannerProps {
  onScan: (data: string) => void;
}

export const QrScanner = ({ onScan }: QrScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrame: number | null = null;
    
    const startScanner = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Camera access is not supported by your browser");
        }
        
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          
          // Start scanning for QR codes
          scanQRCode();
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        toast("Could not access camera", {
          description: "Please make sure you've granted camera permissions"
        });
        setIsScanning(false);
      }
    };
    
    const scanQRCode = async () => {
      if (!videoRef.current || !canvasRef.current) return;
      
      try {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d');
        
        if (!context) return;
        
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Try to decode QR code from canvas
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        // Here you would typically use a QR code library to scan the image data
        // For simplicity, we're simulating a scan with a placeholder
        // In a real app, you would use a library like jsQR or similar
        
        // This is just a placeholder - in a real app we would detect QR codes
        // For demo purposes, let's say we found a QR code after 2 seconds
        setTimeout(() => {
          if (isScanning) {
            // Simulate finding a QR code with example data
            onScan("OM-IDENTITY:SGVsbG8gV29ybGQh");
            stopScanner();
            toast("QR Code detected!");
          }
        }, 2000);
        
        // Schedule next scan
        animationFrame = requestAnimationFrame(scanQRCode);
      } catch (err) {
        console.error("QR scanning error:", err);
      }
    };
    
    const stopScanner = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      
      setIsScanning(false);
    };
    
    if (isScanning) {
      startScanner();
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isScanning, onScan]);
  
  return (
    <div className="flex flex-col items-center">
      {isScanning ? (
        <div className="relative w-64 h-64 bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            muted
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover opacity-0"
          />
          
          <div className="absolute inset-0 border-2 border-primary border-opacity-50 rounded-lg" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 border-2 border-primary animate-pulse" />
          </div>
          
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-2 right-2"
            onClick={() => setIsScanning(false)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => setIsScanning(true)}
          className="flex items-center gap-2"
        >
          <Camera size={18} />
          Scan QR Code
        </Button>
      )}
    </div>
  );
};
