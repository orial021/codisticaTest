import React, { useState, useEffect, useRef } from 'react';
import Circle from './Circle';

interface SpiralProps {
  totalCircles: number;
  spiralDensity: number;
  animationDuration: number;
  clockwise: boolean;
}

const Spiral: React.FC<SpiralProps> = ({ totalCircles, spiralDensity, animationDuration, clockwise }) => {
  const [circles, setCircles] = useState<Array<{ id: number, x: number, y: number, size: number, angle: number, radius: number, initialX: number, initialY: number }>>([]);
  const [currentCircle, setCurrentCircle] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const generateInitialCircles = () => {
      const newCircles: Array<{ id: number, x: number, y: number, size: number, angle: number, radius: number, initialX: number, initialY: number }> = [];
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const edgePadding = 50;
      const stepX = (windowWidth - 2 * edgePadding) / (totalCircles / 4);
      const stepY = (windowHeight - 2 * edgePadding) / (totalCircles / 4);

      for (let i = 0; i < totalCircles; i++) {
        let x, y;

        if (i < totalCircles / 4) {
          // Parte superior (izquierda a derecha)
          x = edgePadding + stepX * i;
          y = edgePadding;
        } else if (i < totalCircles / 2) {
          // Parte derecha (arriba a abajo)
          x = windowWidth - edgePadding;
          y = edgePadding + stepY * (i - totalCircles / 4);
        } else if (i < (3 * totalCircles) / 4) {
          // Parte inferior (derecha a izquierda)
          x = windowWidth - edgePadding - stepX * (i - totalCircles / 2);
          y = windowHeight - edgePadding;
        } else {
          // Parte izquierda (abajo a arriba)
          x = edgePadding;
          y = windowHeight - edgePadding - stepY * (i - (3 * totalCircles) / 4);
        }

        // Calcular el ángulo inicial basado en la posición inicial respecto al centro
        const centerX = windowWidth / 2;
        const centerY = windowHeight / 2;
        const deltaX = x - centerX;
        const deltaY = y - centerY;
        const angle = Math.atan2(deltaY, deltaX); // Ángulo inicial
        const radius = Math.sqrt(deltaX * deltaX + deltaY * deltaY); // Radio inicial

        // Tamaño inicial del círculo
        const size = 20;

        newCircles.push({ id: i, x: x, y: y, size: size, angle: angle, radius: radius, initialX: x, initialY: y });
      }

      setCircles(newCircles);
    };

    generateInitialCircles();
  }, [totalCircles]);

  useEffect(() => {
    const animateCircles = () => {
      setCircles((prevCircles) =>
        prevCircles.map((circle, index) => {
          if (index <= currentCircle) {
            const angleStep = clockwise ? spiralDensity / 100 : -spiralDensity / 100; // Ajustar la velocidad del ángulo
            const newAngle = circle.angle + angleStep;
            const newRadius = circle.radius * 0.999; // Disminuir el radio más lentamente

            const newX = newRadius * Math.cos(newAngle) + window.innerWidth / 2;
            const newY = newRadius * Math.sin(newAngle) + window.innerHeight / 2;

            // Reducir el tamaño del círculo a medida que se acerca al centro
            const maxRadius = Math.sqrt((window.innerWidth / 2) ** 2 + (window.innerHeight / 2) ** 2);
            const distanceToCenter = Math.sqrt((newX - window.innerWidth / 2) ** 2 + (newY - window.innerHeight / 2) ** 2);
            const newSize = 5 + (15 * distanceToCenter) / maxRadius; // Interpolación lineal entre 5px y 20px

            return { ...circle, x: newX, y: newY, angle: newAngle, radius: newRadius, size: newSize };
          }
          return circle;
        })
      );
      requestAnimationFrame(animateCircles);
    };

    requestAnimationFrame(animateCircles);

    const interval = setInterval(() => {
      setCurrentCircle((prev) => (prev + 1) % totalCircles);
    }, animationDuration);

    intervalRef.current = interval;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentCircle, totalCircles, spiralDensity, animationDuration, clockwise]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {circles.map((circle) => (
        <Circle key={circle.id} id={circle.id} x={circle.x} y={circle.y} size={circle.size} />
      ))}
    </div>
  );
};

export default Spiral;
