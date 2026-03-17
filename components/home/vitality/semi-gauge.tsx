import Svg, { Defs, Line, LinearGradient, Stop } from 'react-native-svg';

const TICKS = 52;
const CX = 108;
const CY = 98;
const OUTER_R = 86;
const INNER_R = 68;

interface SemiGaugeProps {
  progress: number; // 0–1
}

export function SemiGauge({ progress }: SemiGaugeProps) {
  const activeCount = Math.round(Math.min(progress, 1) * TICKS);

  return (
    <Svg width="216" height="106" viewBox="0 0 216 106">
      <Defs>
        <LinearGradient id="activeGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#F59E0B" />
          <Stop offset="0.5" stopColor="#84CC16" />
          <Stop offset="1" stopColor="#2C6E49" />
        </LinearGradient>
      </Defs>

      {Array.from({ length: TICKS }, (_, i) => {
        const a = Math.PI - (i / (TICKS - 1)) * Math.PI;
        const x1 = CX + INNER_R * Math.cos(a);
        const y1 = CY - INNER_R * Math.sin(a);
        const x2 = CX + OUTER_R * Math.cos(a);
        const y2 = CY - OUTER_R * Math.sin(a);

        const isActive = i < activeCount;

        // Gradient-like manual color across active ticks
        let stroke = '#E9EAEC';
        if (isActive) {
          const ratio = i / Math.max(activeCount - 1, 1);
          if (ratio < 0.35) stroke = '#F59E0B';      // amber
          else if (ratio < 0.65) stroke = '#84CC16'; // lime
          else stroke = '#2C6E49';                   // deep green
        }

        return (
          <Line
            key={i}
            x1={x1} y1={y1}
            x2={x2} y2={y2}
            stroke={stroke}
            strokeWidth={isActive ? 3.8 : 2.8}
            strokeLinecap="round"
          />
        );
      })}
    </Svg>
  );
}
