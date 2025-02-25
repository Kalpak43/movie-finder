import { useTheme } from "@/contexts/ThemeProvider";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "motion/react";
import { getDominantColor } from "@/lib/utils";

function AmbientCard({
  src,
  className,
  width,
  height,
}: {
  src: string;
  className?: string;
  width: number;
  height: number;
}) {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorMotion = useMotionValue("#000000");
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
    colorMotion.set(dominantColor);
  }, [dominantColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");

      const updateGradient = () => {
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
          gradient.addColorStop(0, colorMotion.get());
          if (theme === "dark") {
            gradient.addColorStop(1, "rgba(0,0,0,0)");
          } else {
            gradient.addColorStop(1, "rgb(255, 255, 255)");
          }
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.filter = "blur(50px)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      };

      const unsubscribe = colorMotion.on("change", updateGradient);
      return () => unsubscribe();
    }
  }, [theme]);

  return (
    <motion.canvas
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 1, delay: 0.5 },
      }}
      ref={canvasRef}
      className={className ? className : "fixed z-[-1] inset-0 w-full h-full"}
      width={width}
      height={height}
    />
  );
}

export default AmbientCard;
