import type { WeatherData } from '@/lib/weather';
import { fetchWeatherData } from '@/lib/weather';
import WeatherContent from './weather/WeatherContent';

/**
 * 天气模块（服务端获取 + 缓存）。
 * - 页面构建/刷新时在服务端拉取 Open-Meteo 数据（HTTP 缓存，15 分钟有效期），
 *   生成带实时数值的静态 HTML，保证首屏与爬虫都能拿到内容；
 * - 浏览器端由 WeatherContent 在挂载后静默刷新最新预报，兼顾“实时准不准”。
 */
export default async function WeatherSection() {
  let initial: WeatherData | null = null;
  try {
    initial = await fetchWeatherData();
  } catch {
    // 构建时网络不可用则降级：页面照常渲染，浏览器端仍会实时获取
  }
  return <WeatherContent initial={initial} />;
}
