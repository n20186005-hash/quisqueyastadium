import { ATTRACTION } from './attraction';

/** 场馆所在地时区（Open-Meteo 与前端实时刷新共用） */
export const STADIUM_TIME_ZONE = 'America/Santo_Domingo';

/** 预报天数：今天 + 未来 6 天 = 共 7 天 */
export const FORECAST_DAYS = 7;

export type WeatherGroup = 'clear' | 'partly' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'storm';

export type CurrentWeather = {
  temperature: number;
  apparentTemperature: number;
  windSpeed: number; // km/h
  weatherCode: number;
  isDay: boolean;
  uvIndex: number | null;
};

export type DayForecast = {
  date: string; // YYYY-MM-DD（时区已由 API 修正）
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number | null;
  windSpeedMax: number | null; // km/h
  uvIndexMax: number | null;
};

export type WeatherData = {
  current: CurrentWeather;
  daily: DayForecast[];
};

/** 智能建议分组的规则标识（UI 用它到 messages 中取对应文案） */
export type WeatherAdviceId =
  // 出行穿搭
  | 'sunnyOutfit'
  | 'heatOutfit'
  | 'layersOutfit'
  | 'coldOutfit'
  | 'lightRainOutfit'
  | 'rainGearOutfit'
  | 'windyOutfit'
  // 游玩安排
  | 'clearSkyActivity'
  | 'cloudyActivity'
  | 'heatActivity'
  | 'rainProbActivity'
  | 'lightRainActivity'
  | 'rainHeavyActivity'
  | 'thunderActivity'
  | 'windStrongActivity'
  | 'fogActivity'
  // 随身物品
  | 'heatItem'
  | 'uvItem'
  | 'layersItem'
  | 'coldItem'
  | 'rainProbItem'
  | 'lightRainItem'
  | 'rainHeavyItem'
  | 'thunderItem'
  | 'windItem'
  | 'fogItem'
  // 风险提醒
  | 'rainHeavyRisk'
  | 'thunderRisk'
  | 'windGaleRisk'
  | 'fogRisk';

export type WeatherAdvice = {
  outfit: WeatherAdviceId[];
  activity: WeatherAdviceId[];
  items: WeatherAdviceId[];
  /** 有内容才渲染「风险提醒」（置顶红色） */
  risks: WeatherAdviceId[];
};

export const OPEN_METEO_ENDPOINT = 'https://api.open-meteo.com/v1/forecast';

export function buildWeatherUrl(): string {
  const params = new URLSearchParams({
    latitude: String(ATTRACTION.latitude),
    longitude: String(ATTRACTION.longitude),
    current:
      'temperature_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,uv_index',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,uv_index_max',
    timezone: STADIUM_TIME_ZONE,
    forecast_days: String(FORECAST_DAYS),
    wind_speed_unit: 'kmh',
  });
  return `${OPEN_METEO_ENDPOINT}?${params.toString()}`;
}

/** 将 WMO weather_code 归并成可翻译的分组 */
export function groupFromCode(code: number): WeatherGroup {
  if (code === 0) return 'clear';
  if (code === 1 || code === 2) return 'partly';
  if (code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if ([95, 96, 99].includes(code)) return 'storm';
  return 'cloudy';
}

/** 今日降雨强度分档：light / heavy / thunder，无雨返回 null */
export function rainKindOf(code: number): 'light' | 'heavy' | 'thunder' | null {
  if (code >= 95 && code <= 99) return 'thunder';
  if ([63, 65, 67, 81, 82].includes(code)) return 'heavy';
  if ([51, 53, 55, 56, 57, 61, 66, 80].includes(code)) return 'light';
  return null;
}

/** km/h → 蒲福风级（用于口语化展示「风力几级」） */
export function beaufortFromKmh(kmh: number): number {
  const limits = [1, 6, 12, 20, 29, 39, 50, 62, 75, 89, 103, 118];
  if (!Number.isFinite(kmh) || kmh <= 0) return 0;
  let level = 0;
  for (let i = 0; i < limits.length; i += 1) {
    if (kmh >= limits[i]) level = i + 1;
  }
  return level;
}

/** 紫外线指数 → 口语分级（避免「辐照强度」等术语） */
export function uvBand(uv: number | null): 'low' | 'moderate' | 'high' | 'veryHigh' | 'extreme' | null {
  if (uv == null) return null;
  if (uv < 3) return 'low';
  if (uv < 6) return 'moderate';
  if (uv < 8) return 'high';
  if (uv < 11) return 'veryHigh';
  return 'extreme';
}

function round(value: number | undefined, fallback = 0) {
  return typeof value === 'number' ? Math.round(value) : fallback;
}

function numOrNull(value: unknown): number | null {
  return typeof value === 'number' ? Math.round(value) : null;
}

/** 归一化 Open-Meteo 响应 */
export function parseWeather(json: any): WeatherData {
  const c = json?.current ?? {};
  const d = json?.daily ?? {};
  const times: string[] = d?.time ?? [];

  return {
    current: {
      temperature: round(c.temperature_2m),
      apparentTemperature: round(c.apparent_temperature),
      windSpeed: round(c.wind_speed_10m),
      weatherCode: round(c.weather_code),
      isDay: c.is_day === 1,
      uvIndex: numOrNull(c.uv_index),
    },
    daily: times.map((date, i) => ({
      date,
      weatherCode: round(d?.weather_code?.[i]),
      tempMax: round(d?.temperature_2m_max?.[i]),
      tempMin: round(d?.temperature_2m_min?.[i]),
      precipitationProbability:
        typeof d?.precipitation_probability_max?.[i] === 'number'
          ? Math.round(d.precipitation_probability_max[i])
          : null,
      windSpeedMax: numOrNull(d?.wind_speed_10m_max?.[i]),
      uvIndexMax: numOrNull(d?.uv_index_max?.[i]),
    })),
  };
}

/** 服务端拉取（构建/ISR 缓存） */
export async function fetchWeatherData(): Promise<WeatherData> {
  const res = await fetch(buildWeatherUrl(), {
    // 结果可缓存，15 分钟后再校验更新（配合前端实时刷新）
    next: { revalidate: 900 },
  });
  if (!res.ok) throw new Error(`Weather request failed: ${res.status}`);
  return parseWeather(await res.json());
}

/**
 * 面向普通游客的“条件 → 建议”规则引擎。
 *
 * - 每条规则返回稳定的文案 id，多语言文案集中在 messages 中；
 * - 只输出命中的条目，未命中的建议不展示；
 * - 风险提醒由天气码 / 风力等强烈条件推导（Open-Meteo 对多米尼加暂无
 *   官方预警订阅源，故不冒充“政府已发布预警”口径，文案聚焦避险行为）。
 */
export function buildWeatherAdvice(data: WeatherData): WeatherAdvice {
  const outfit: WeatherAdviceId[] = [];
  const activity: WeatherAdviceId[] = [];
  const items: WeatherAdviceId[] = [];
  const risks: WeatherAdviceId[] = [];

  const today = data.daily?.[0];
  if (!today) return { outfit, activity, items, risks };

  const code = today.weatherCode;
  const kind = rainKindOf(code);
  const raining = kind !== null;
  const rainProb = today.precipitationProbability;
  const sunny = code <= 1 && !raining;
  const overcast = (code === 2 || code === 3) && !raining;
  const foggy = code === 45 || code === 48;
  const heat = !raining && (data.current.temperature >= 32 || today.tempMax >= 32);
  const cold = today.tempMax <= 10 || data.current.temperature <= 6;
  const swing =
    today.tempMax != null && today.tempMin != null && today.tempMax - today.tempMin > 8;
  const wind = Math.max(data.current.windSpeed, today.windSpeedMax ?? 0);
  const windMid = wind >= 29 && wind < 50; // 约 5–6 级
  const windGale = wind >= 50; // 约 7 级以上
  const uv = today.uvIndexMax ?? data.current.uvIndex;

  // ---------- 大雾（最高优先于其它“观景”类建议） ----------
  if (foggy) {
    activity.push('fogActivity');
    items.push('fogItem');
    risks.push('fogRisk');
  }

  // ---------- 降雨 ----------
  if (kind === 'thunder') {
    outfit.push('rainGearOutfit');
    activity.push('thunderActivity');
    items.push('thunderItem');
    risks.push('thunderRisk');
  } else if (kind === 'heavy') {
    outfit.push('rainGearOutfit');
    activity.push('rainHeavyActivity');
    items.push('rainHeavyItem');
    risks.push('rainHeavyRisk');
  } else if (kind === 'light') {
    outfit.push('lightRainOutfit');
    activity.push('lightRainActivity');
    items.push('lightRainItem');
  }

  // ---------- 非降雨时的天空状态 ----------
  if (!raining && !foggy) {
    if (sunny) {
      if (!heat) outfit.push('sunnyOutfit');
      activity.push('clearSkyActivity');
    } else if (overcast) {
      activity.push('cloudyActivity');
    }
  }

  // ---------- 大概率降水（即使当前还没下） ----------
  if (!raining && rainProb != null && rainProb >= 60) {
    activity.push('rainProbActivity');
    items.push('rainProbItem');
  }

  // ---------- 温度 ----------
  if (heat) {
    outfit.push('heatOutfit');
    activity.push('heatActivity');
    items.push('heatItem');
  } else if (cold) {
    outfit.push('coldOutfit');
    items.push('coldItem');
  }
  if (swing) {
    outfit.push('layersOutfit');
    items.push('layersItem');
  }

  // ---------- 紫外线（热天已由 heatItem 覆盖，避免重复） ----------
  if (!raining && !foggy && !heat && uv != null && uv >= 5) {
    items.push('uvItem');
  }

  // ---------- 风 ----------
  if (!foggy) {
    if (windGale) {
      risks.push('windGaleRisk');
      if (!raining) {
        outfit.push('windyOutfit');
        activity.push('windStrongActivity');
      }
    } else if (windMid && !raining) {
      outfit.push('windyOutfit');
      activity.push('windStrongActivity');
      items.push('windItem');
    }
  }

  return { outfit, activity, items, risks };
}
