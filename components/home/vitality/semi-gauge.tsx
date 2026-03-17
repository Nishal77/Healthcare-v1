import { View } from 'react-native';

// Pure React Native semi-gauge — no react-native-svg dependency
const TICKS = 52;
const CX = 108;
const CY = 98;
const OUTER_R = 86;
const INNER_R = 68;
const TICK_LEN = OUTER_R - INNER_R; // 18
const R_MID = (OUTER_R + INNER_R) / 2; // 77

interface SemiGaugeProps {
  progress: number; // 0–1
}

export function SemiGauge({ progress }: SemiGaugeProps) {
  const activeCount = Math.round(Math.min(progress, 1) * TICKS);

  return (
    <View style={{ width: 216, height: 106 }}>
      {Array.from({ length: TICKS }, (_, i) => {
        const a = Math.PI - (i / (TICKS - 1)) * Math.PI;
        const cx_tick = CX + R_MID * Math.cos(a);
        const cy_tick = CY - R_MID * Math.sin(a);
        const isActive = i < activeCount;
        const thickness = isActive ? 4 : 2.5;

        let bg = '#DDDFE3';
        if (isActive) {
          const ratio = i / Math.max(activeCount - 1, 1);
          if (ratio < 0.35) bg = '#F59E0B';      // amber
          else if (ratio < 0.65) bg = '#84CC16'; // lime
          else bg = '#2C6E49';                   // deep green
        }

        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              width: TICK_LEN,
              height: thickness,
              backgroundColor: bg,
              borderRadius: thickness / 2,
              left: cx_tick - TICK_LEN / 2,
              top: cy_tick - thickness / 2,
              transform: [{ rotate: `${-(a * 180) / Math.PI}deg` }],
            }}
          />
        );
      })}
    </View>
  );
}
