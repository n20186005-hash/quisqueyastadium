import type { ReactNode } from 'react';
import type { WeatherGroup } from '@/lib/weather';

type IconProps = {
  group: WeatherGroup;
  isDay?: boolean;
  size?: number;
};

/** 极简线条天气图标（无第三方依赖、随主题色渲染） */
export default function WeatherIcon({ group, isDay = true, size = 40 }: IconProps) {
  const stroke = 'currentColor';
  const dimFill = { fill: stroke, opacity: 0.14 } as const;

  function cloud(g: { x?: number; y?: number } = {}) {
    const dx = g.x ?? 0;
    const dy = g.y ?? 0;
    return (
      <g transform={`translate(${dx} ${dy})`} style={dimFill}>
        <rect x="10" y="27" width="28" height="9" rx="4.5" />
        <circle cx="17" cy="26" r="6.5" />
        <circle cx="26" cy="23" r="8" />
        <circle cx="33" cy="28" r="5" />
      </g>
    );
  }

  function smallSun(cx: number, cy: number, r: number, withRays = true) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={r} fill={stroke} stroke="none" opacity={0.9} />
        {withRays && (
          <g stroke={stroke} strokeWidth="2" strokeLinecap="round">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line
                key={deg}
                x1={cx}
                y1={cy - r - 4}
                x2={cx}
                y2={cy - r - 8}
                transform={`rotate(${deg} ${cx} ${cy})`}
              />
            ))}
          </g>
        )}
      </g>
    );
  }

  let body: ReactNode;
  switch (group) {
    case 'clear':
      body = isDay
        ? smallSun(24, 24, 8)
        : (
            <path
              d="M38 28a13 13 0 1 1-15-15 12.5 12.5 0 1 0 15 15z"
              fill="none"
              stroke={stroke}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
      break;
    case 'partly':
      body = (
        <g>
          {smallSun(20, 18, 6, false)}
          {cloud({ x: 10, y: 10 })}
        </g>
      );
      break;
    case 'cloudy':
      body = cloud();
      break;
    case 'fog':
      body = (
        <g stroke={stroke} strokeWidth="2.2" strokeLinecap="round">
          <line x1="12" y1="20" x2="36" y2="20" />
          <line x1="12" y1="27" x2="36" y2="27" />
          <line x1="12" y1="34" x2="36" y2="34" />
          <line x1="16" y1="41" x2="32" y2="41" />
        </g>
      );
      break;
    case 'rain':
      body = (
        <g>
          {cloud()}
          <g stroke={stroke} strokeWidth="2" strokeLinecap="round">
            <line x1="17" y1="38" x2="15" y2="43" />
            <line x1="25" y1="38" x2="23" y2="43" />
            <line x1="33" y1="38" x2="31" y2="43" />
          </g>
        </g>
      );
      break;
    case 'storm':
      body = (
        <g>
          {cloud()}
          <polygon
            points="26,37 20,44 24,44 21,50 30,43 25,43 28,37"
            fill={stroke}
            stroke="none"
          />
        </g>
      );
      break;
    case 'snow':
      body = (
        <g>
          {cloud()}
          <g stroke={stroke} strokeWidth="2" strokeLinecap="round">
            <line x1="17" y1="39" x2="21" y2="43" />
            <line x1="21" y1="39" x2="17" y2="43" />
            <line x1="27" y1="39" x2="31" y2="43" />
            <line x1="31" y1="39" x2="27" y2="43" />
          </g>
        </g>
      );
      break;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      {body}
    </svg>
  );
}
