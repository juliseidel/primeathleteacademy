import Svg, { Defs, LinearGradient as SvgLinearGradient, Path, Stop } from 'react-native-svg';

import { color } from '@/lib/design/tokens';

type Props = {
  values: number[];
  width?: number;
  height?: number;
  // when true, lower is better (e.g. sprint times) — we still draw the line, but flip the visual gradient meaning
  inverted?: boolean;
};

export function Sparkline({ values, width = 80, height = 24, inverted = false }: Props) {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = width / (values.length - 1);

  // Path along the values
  const points = values.map((v, i) => {
    const x = i * stepX;
    // y inverted (svg y grows downward); for inverted=true (lower better), flip
    const norm = (v - min) / range;
    const y = inverted ? norm * (height - 2) + 1 : (1 - norm) * (height - 2) + 1;
    return { x, y };
  });

  const linePath = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ');

  const fillPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <SvgLinearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color.gold} stopOpacity="0.35" />
          <Stop offset="1" stopColor={color.gold} stopOpacity="0" />
        </SvgLinearGradient>
      </Defs>
      <Path d={fillPath} fill="url(#sparkFill)" />
      <Path
        d={linePath}
        stroke={color.gold}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}
