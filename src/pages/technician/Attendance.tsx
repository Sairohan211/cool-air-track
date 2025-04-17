
import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, UserCheck, UploadCloud, Check } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const TechnicianAttendance = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const date = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const time = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        const imageDataUrl = canvas.toDataURL('image/png');
        setCapturedImage(imageDataUrl);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const resetImage = () => {
    setCapturedImage(null);
  };

  const submitAttendance = () => {
    if (!capturedImage) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Attendance Recorded",
        description: `Successfully checked in at ${time}`,
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Daily Attendance</h1>
        <p className="text-muted-foreground">{date}</p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="mr-2" />
            Mark Your Attendance
          </CardTitle>
          <CardDescription>
            Take a selfie or upload a photo to check in for today
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-medium text-green-600">Attendance Recorded</h3>
              <p className="text-gray-500 mt-2">Successfully checked in at {time}</p>
            </div>
          ) : (
            <>
              <div className="aspect-square bg-muted rounded-lg overflow-hidden relative flex items-center justify-center">
                {isCameraActive ? (
                  <video 
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : capturedImage ? (
                  <img 
                    src={capturedImage} 
                    alt="Captured attendance" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <UserCheck size={64} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No photo captured yet</p>
                  </div>
                )}
              </div>
              
              <canvas ref={canvasRef} className="hidden" />
              
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileUpload}
              />

              <div className="flex flex-wrap gap-2">
                {!isCameraActive && !capturedImage && (
                  <>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={startCamera}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Open Camera
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={triggerFileUpload}
                    >
                      <UploadCloud className="mr-2 h-4 w-4" />
                      Upload Photo
                    </Button>
                  </>
                )}
                
                {isCameraActive && (
                  <>
                    <Button 
                      className="flex-1"
                      onClick={capturePhoto}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Take Photo
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={stopCamera}
                    >
                      Cancel
                    </Button>
                  </>
                )}
                
                {capturedImage && (
                  <>
                    <Button 
                      className="flex-1"
                      onClick={submitAttendance}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Attendance"}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={resetImage}
                      disabled={isSubmitting}
                    >
                      Retake
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </CardContent>
        
        {isSubmitted && (
          <CardFooter>
            <p className="text-sm text-muted-foreground text-center w-full">
              Your attendance has been recorded for today. Have a great day!
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default TechnicianAttendance;
