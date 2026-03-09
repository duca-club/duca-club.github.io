"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export const PixelatedImage = ({
  src,
  alt,
  className,
  pixelSize = 10,
  animateOnHover = true,
}: {
  src: string;
  alt: string;
  className?: string;
  pixelSize?: number;
  animateOnHover?: boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      imageRef.current = img;
      setIsLoaded(true);
      drawPixelated(pixelSize);
    };
  }, [src, pixelSize]);

  useEffect(() => {
    if (!isLoaded) return;

    if (animateOnHover && isHovering) {
      drawPixelated(1);
    } else {
      drawPixelated(pixelSize);
    }
  }, [isHovering, animateOnHover, isLoaded, pixelSize]);

  const drawPixelated = (size: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imageRef.current;

    if (!canvas || !ctx || !img) return;

    const w = img.width;
    const h = img.height;

    canvas.width = w;
    canvas.height = h;

    ctx.imageSmoothingEnabled = false;

    const scaledW = Math.ceil(w / size);
    const scaledH = Math.ceil(h / size);

    ctx.drawImage(img, 0, 0, scaledW, scaledH);
    ctx.drawImage(canvas, 0, 0, scaledW, scaledH, 0, 0, w, h);
  };

  return (
    <motion.div
      className={cn("relative overflow-hidden", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <canvas
        ref={canvasRef}
        alt={alt}
        className="w-full h-full object-cover transition-all duration-500"
        style={{
          imageRendering: isHovering ? "auto" : "pixelated",
        }}
      />
    </motion.div>
  );
};

export const PixelatedHero = ({
  src,
  alt,
  children,
  className,
  overlayClassName,
}: {
  src: string;
  alt: string;
  children?: React.ReactNode;
  className?: string;
  overlayClassName?: string;
}) => {
  return (
    <div className={cn("relative w-full h-[60vh] md:h-[80vh]", className)}>
      <PixelatedImage
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full"
        pixelSize={8}
        animateOnHover={false}
      />
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent",
          overlayClassName
        )}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default PixelatedImage;
