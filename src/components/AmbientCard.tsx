import { useTheme } from "@/contexts/ThemeProvider";
import { useEffect, useRef, useState } from "react";

function AmbientCard({ src }: { src: string }) {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dominantColor, setDominantColor] = useState<string>("#000000");

  useEffect(() => {
    if (src) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const color = getDominantColor(imageData.data, theme);
          setDominantColor(color);
        }
      };
    }
  }, [src, theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const gradient = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          0,
          canvas.width / 2,
          canvas.height / 2,
          canvas.width / 2
        );
        gradient.addColorStop(0, dominantColor);
        if (theme == "dark") {
          gradient.addColorStop(1, "rgba(0,0,0,0)");
        } else {
          gradient.addColorStop(1, "rgb(255, 255, 255)");
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.filter = "blur(50px)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [dominantColor, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed z-[-1] inset-0 w-full h-full"
      width={1920}
      height={1080}
    />
  );
}

export default AmbientCard;

function getDominantColor(imageData: Uint8ClampedArray, theme: string): string {
  let r = 0,
    g = 0,
    b = 0;
  const pixelCount = imageData.length / 4;

  for (let i = 0; i < imageData.length; i += 4) {
    r += imageData[i];
    g += imageData[i + 1];
    b += imageData[i + 2];
  }

  r = Math.floor(r / pixelCount);
  g = Math.floor(g / pixelCount);
  b = Math.floor(b / pixelCount);

  if (theme === "light") {
    return `rgba(${r},${g},${b}, 0)`;
  }

  return `rgb(${r},${g},${b}, 0.5)`;
}
