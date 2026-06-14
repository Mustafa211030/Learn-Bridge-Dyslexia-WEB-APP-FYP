// components/student/ProgressChart.jsx
// Chart component for displaying student progress analytics

import { useState, useEffect, useRef } from 'react';
import styles from './ProgressChart.module.css';

export default function ProgressChart({ data, type = 'line', title, height = 200 }) {
  const canvasRef = useRef(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // Set canvas dimensions
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    if (type === 'line') {
      drawLineChart(ctx, rect.width, rect.height);
    } else if (type === 'bar') {
      drawBarChart(ctx, rect.width, rect.height);
    }
  }, [data, type]);

  const drawLineChart = (ctx, width, height) => {
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Find max value
    const maxValue = Math.max(...data.map(d => d.value), 1);

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight * i) / 4;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    data.forEach((point, i) => {
      const x = padding.left + (chartWidth * i) / (data.length - 1 || 1);
      const y = padding.top + chartHeight - (chartHeight * point.value) / maxValue;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, 'rgba(79, 70, 229, 0.2)');
    gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');

    ctx.beginPath();
    data.forEach((point, i) => {
      const x = padding.left + (chartWidth * i) / (data.length - 1 || 1);
      const y = padding.top + chartHeight - (chartHeight * point.value) / maxValue;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw points
    data.forEach((point, i) => {
      const x = padding.left + (chartWidth * i) / (data.length - 1 || 1);
      const y = padding.top + chartHeight - (chartHeight * point.value) / maxValue;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#4f46e5';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';

    data.forEach((point, i) => {
      if (i % Math.ceil(data.length / 7) === 0 || i === data.length - 1) {
        const x = padding.left + (chartWidth * i) / (data.length - 1 || 1);
        ctx.fillText(point.label, x, height - 8);
      }
    });
  };

  const drawBarChart = (ctx, width, height) => {
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const barWidth = (chartWidth / data.length) * 0.6;
    const gap = (chartWidth / data.length) * 0.4;

    // Find max value
    const maxValue = Math.max(...data.map(d => d.value), 1);

    // Draw bars
    data.forEach((point, i) => {
      const x = padding.left + (chartWidth * i) / data.length + gap / 2;
      const barHeight = (chartHeight * point.value) / maxValue;
      const y = padding.top + chartHeight - barHeight;

      // Bar gradient
      const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
      gradient.addColorStop(0, '#4f46e5');
      gradient.addColorStop(1, '#7c3aed');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, [8, 8, 0, 0]);
      ctx.fill();

      // Label
      ctx.fillStyle = '#6b7280';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(point.label, x + barWidth / 2, height - 8);
    });
  };

  if (!data || data.length === 0) {
    return (
      <div className={styles.container}>
        {title && <h3 className={styles.title}>{title}</h3>}
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📊</span>
          <p>No data available yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.chartWrapper} style={{ height }}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      {hoveredPoint && (
        <div className={styles.tooltip}>
          <strong>{hoveredPoint.label}</strong>: {hoveredPoint.value}
        </div>
      )}
    </div>
  );
}

// Simple wrapper for skill progress bars
export function SkillProgressBar({ name, level, maxLevel, color }) {
  const percentage = (level / maxLevel) * 100;

  return (
    <div className={styles.skillBar}>
      <div className={styles.skillHeader}>
        <span className={styles.skillName}>{name}</span>
        <span className={styles.skillLevel}>Level {level}/{maxLevel}</span>
      </div>
      <div className={styles.skillProgress}>
        <div 
          className={styles.skillFill}
          style={{ 
            width: `${percentage}%`,
            background: color || 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)'
          }}
        />
      </div>
    </div>
  );
}

// Stat card component
export function StatCard({ icon, label, value, trend, trendValue }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statContent}>
        <span className={styles.statValue}>{value}</span>
        <span className={styles.statLabel}>{label}</span>
        {trend && (
          <span className={`${styles.statTrend} ${trend === 'up' ? styles.trendUp : styles.trendDown}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}
