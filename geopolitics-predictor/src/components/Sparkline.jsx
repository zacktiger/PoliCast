import { useRef, useEffect } from 'react';

export default function Sparkline({ data, color = '#3fb950', height = 50 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length < 2) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = 2;

    const min = Math.min(...data) - 2;
    const max = Math.max(...data) + 2;
    const range = max - min || 1;

    const stepX = (w - padding * 2) / (data.length - 1);
    const getY = (val) => h - padding - ((val - min) / range) * (h - padding * 2);

    // Draw gradient fill
    ctx.beginPath();
    ctx.moveTo(padding, getY(data[0]));
    for (let i = 1; i < data.length; i++) {
      ctx.lineTo(padding + i * stepX, getY(data[i]));
    }
    ctx.lineTo(padding + (data.length - 1) * stepX, h);
    ctx.lineTo(padding, h);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, color + '30');
    gradient.addColorStop(1, color + '05');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    ctx.moveTo(padding, getY(data[0]));
    for (let i = 1; i < data.length; i++) {
      ctx.lineTo(padding + i * stepX, getY(data[i]));
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw end dot
    const lastX = padding + (data.length - 1) * stepX;
    const lastY = getY(data[data.length - 1]);
    ctx.beginPath();
    ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(lastX, lastY, 5, 0, Math.PI * 2);
    ctx.fillStyle = color + '30';
    ctx.fill();
  }, [data, color]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: `${height}px`, display: 'block' }}
    />
  );
}
