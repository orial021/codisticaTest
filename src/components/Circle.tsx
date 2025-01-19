import React from 'react';

interface CircleProps {
  id: number;
  x: number;
  y: number;
  size: number;
}

const Circle: React.FC<CircleProps> = ({ id, x, y, size }) => {
  return (
    <div
      key={id}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: 'blue',
        position: 'absolute',
        left: x,
        top: y,
      }}
    />
  );
};

export default Circle;
