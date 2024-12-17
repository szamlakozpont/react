import { useEffect, useRef, useState, useCallback, Dispatch, SetStateAction } from 'react';

type Pixels = {
  x: number;
  y: number;
  color: string;
  originX: number;
  originY: number;
};

export const useLogo = (canvasLogo: React.RefObject<HTMLCanvasElement>, setShowLogo: Dispatch<SetStateAction<boolean>>) => {
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const isMovingPixel = useRef(false);
  const isConverted = useRef(false);
  const isInit = useRef(true);
  const isLoaded = useRef(false);
  const image = useRef<HTMLImageElement | null>(null);
  const imageWidth = useRef(0);
  const imageHeight = useRef(0);
  const requestAnimationRef = useRef<number | null>(null);
  const targetValueRef = useRef(1);
  const timeValueRef = useRef(Date.now());
  const animationSpeed = 0.01;
  const gravitySpeed = useRef(0);
  const pixelSize = 3;
  const pixelsRef = useRef<Pixels[]>([]);
  const deltaOrigin = useRef(1);
  const deltaOriginCancelAnimation = 0.001;
  const deltaLoadOriginImage = 0.05;
  const gravityInit = useRef(0.03);
  const gravity = useRef(0);
  const width = useRef(0);
  const height = useRef(0);

  const loadImage = useCallback(() => {
    if (!isLoaded.current || isInit.current) {
      const newImage = new Image() as HTMLImageElement;
      newImage.loading = 'eager';
      newImage.setAttribute('crossOrigin', '');
      newImage.src = require('../static/company.png');
      newImage.onload = () => {
        image.current = newImage;
        imageWidth.current = newImage.width;
        imageHeight.current = newImage.height;
        isLoaded.current = true;
        setCanvasWidth(imageWidth.current);
        setCanvasHeight(imageHeight.current);
      };
    }
  }, []);

  const convertToPixels = useCallback(
    (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
      pixelsRef.current = [];
      let pixelsNumbers = 0;
      const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data;
      for (let y = 0; y < canvasHeight; y += pixelSize) {
        for (let x = 0; x < canvasWidth; x += pixelSize) {
          const index = (y * canvasWidth + x) * 4;
          const opacity = imageData[index + 3];
          if (opacity > 1) {
            const red = imageData[index];
            const green = imageData[index + 1];
            const blue = imageData[index + 2];
            const rgb = 'rgb(' + red + ',' + green + ',' + blue + ')';
            const newPixel = {
              x: Math.random() * canvasWidth,
              y: Math.random() * canvasHeight,
              color: rgb,
              originX: x,
              originY: y,
            };
            pixelsRef.current.push(newPixel);
          }
        }
      }

      pixelsNumbers = pixelsRef.current.length;

      if (pixelsNumbers > 200000) {
        gravitySpeed.current = (pixelsNumbers / 200000) * 0.1;
      } else if (pixelsNumbers > 150000) {
        gravitySpeed.current = (pixelsNumbers / 150000) * 0.1;
      } else {
        gravitySpeed.current = (pixelsNumbers / 100000) * 0.1;
      }

      if (pixelsNumbers < 90000) {
        gravityInit.current = 0.1;
      }

      ctx!.clearRect(0, 0, canvasWidth, canvasHeight);
      isConverted.current = true;
    },
    [pixelSize],
  );

  const canvasAnimate = () => {
    isMovingPixel.current = true;
  };

  const initCanvas = useCallback(() => {
    if (isLoaded.current && canvasLogo.current) {
      const canvas = canvasLogo.current;
      const ctx = canvas.getContext('2d')!;
      setCtx(ctx);
      canvas.style.position = 'absolute';
      const parent = canvas.parentNode;
      const parentStyles = getComputedStyle(parent as Element);
      width.current = parseInt(parentStyles.getPropertyValue('width'), 10);
      height.current = parseInt(parentStyles.getPropertyValue('height'), 10);
      setCanvasWidth(width.current);
      setCanvasHeight(height.current);
      canvas.width = width.current;
      canvas.height = height.current;
      setCanvas(canvas);

      const scale = Math.min(width.current / imageWidth.current, height.current / imageHeight.current);
      const x = width.current / 2 - (imageWidth.current / 2) * scale;
      const y = height.current / 2 - (imageHeight.current / 2) * scale;
      ctx.drawImage(image.current!, x, y, imageWidth.current * scale, imageHeight.current * scale);

      if (!isConverted.current) {
        convertToPixels(ctx, width.current, height.current);
      }
    }
  }, [canvasLogo, convertToPixels]);

  useEffect(() => {
    if (canvasLogo.current && isInit.current && isLoaded.current) {
      initCanvas();
      isInit.current = false;
    }
    window.addEventListener('resize', initCanvas);
    return () => {
      window.removeEventListener('resize', initCanvas);
    };
  }, [canvasLogo.current, isInit.current, initCanvas, isLoaded.current]);

  useEffect(() => {
    if (!isLoaded.current) {
      loadImage();
    }
  }, [loadImage]);

  const updatePixels = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (deltaOrigin.current < deltaLoadOriginImage) {
        const scale = Math.min(width.current / imageWidth.current, height.current / imageHeight.current);
        const x = width.current / 2 - (imageWidth.current / 2) * scale;
        const y = height.current / 2 - (imageHeight.current / 2) * scale;
        ctx.drawImage(image.current!, x, y, imageWidth.current * scale, imageHeight.current * scale);
        pixelsRef.current.forEach((pixel) => {
          pixel.x += (pixel.originX - pixel.x) * (gravitySpeed.current + gravity.current);
          pixel.y += (pixel.originY - pixel.y) * (gravitySpeed.current + gravity.current);
          deltaOrigin.current = Math.abs(pixel.originX - pixel.x) + Math.abs(pixel.originY - pixel.y);
        });
      } else {
        pixelsRef.current.forEach((pixel) => {
          ctx.fillStyle = pixel.color;
          ctx.fillRect(pixel.x, pixel.y, pixelSize, pixelSize);
          pixel.x += (pixel.originX - pixel.x) * (gravitySpeed.current + gravity.current);
          pixel.y += (pixel.originY - pixel.y) * (gravitySpeed.current + gravity.current);
          deltaOrigin.current = Math.abs(pixel.originX - pixel.x) + Math.abs(pixel.originY - pixel.y);
        });
      }
    },
    [pixelsRef, pixelSize],
  );

  const renderFrame = useCallback(() => {
    ctx!.clearRect(0, 0, canvasWidth, canvasHeight);
    updatePixels(ctx!);
  }, [ctx, updatePixels, canvasWidth, canvasHeight]);

  const animate = useCallback(() => {
    if (!canvas) return;
    const deltaTime = Date.now() - timeValueRef.current;
    const nextValue = deltaTime * animationSpeed;

    if (deltaOrigin.current < deltaOriginCancelAnimation) {
      cancelAnimationFrame(requestAnimationRef.current!);
      requestAnimationRef.current = null;
      targetValueRef.current = 1;
      isMovingPixel.current = false;
      isConverted.current = false;
      setShowLogo(false);
      return;
    }
    gravity.current = deltaOrigin.current < 20 ? 0.3 : deltaOrigin.current < 200 ? 0.1 : gravityInit.current;

    if (nextValue > targetValueRef.current) {
      targetValueRef.current += 1;
      renderFrame();
    }
    requestAnimationRef.current = requestAnimationFrame(animate);
  }, [canvas, setShowLogo, renderFrame]);

  useEffect(() => {
    if (isMovingPixel.current) {
      timeValueRef.current = Date.now();
      requestAnimationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      cancelAnimationFrame(requestAnimationRef.current!);
    };
  }, [animate]);

  return { canvasAnimate };
};
