'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import WeatherIcon from './WeatherIcon';
import { ATTRACTION } from '@/lib/attraction';
import {
  type WeatherAdviceId,
  type WeatherData,
  beaufortFromKmh,
  buildWeatherAdvice,
  buildWeatherUrl,
  groupFromCode,
  parseWeather,
  STADIUM_TIME_ZONE,
  uvBand,
} from '@/lib/weather';

const REFRESH_INTERVAL_MS = 10 * 60 * 1000; // 每 10 分钟自动刷新一次

function formatTag(locale: string) {
  return locale === 'zh' ? 'zh-CN' : locale === 'es' ? 'es-DO' : 'en-US';
}

/** 一条建议（小圆点 + 文案） */
function Tip({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        aria-hidden="true"
        className="mt-2 inline-block w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: 'var(--accent)' }}
      />
      <span className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {children}
      </span>
    </li>
  );
}

/** 一条风险提醒（红色） */
function RiskTip({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span aria-hidden="true" className="text-sm leading-relaxed shrink-0">⚠</span>
      <span className="text-sm leading-relaxed" style={{ color: 'var(--risk-text)' }}>
        {children}
      </span>
    </li>
  );
}

/** 建议列：只有命中时才渲染 */
function AdviceColumn({
  ids,
  label,
  risk,
}: {
  ids: WeatherAdviceId[];
  label: string;
  risk?: boolean;
}) {
  const t = useTranslations('weather');
  if (ids.length === 0) return null;
  return (
    <div>
      <h4
        className="text-sm font-semibold mb-3 tracking-wide uppercase"
        style={{ color: risk ? 'var(--risk-text)' : 'var(--accent)' }}
      >
        {label}
      </h4>
      <ul className="space-y-2">
        {ids.map((id) => (
          risk ? (
            <RiskTip key={id}>{t(`advice.types.${id}`)}</RiskTip>
          ) : (
            <Tip key={id}>{t(`advice.types.${id}`)}</Tip>
          )
        ))}
      </ul>
    </div>
  );
}

export default function WeatherContent({ initial }: { initial: WeatherData | null }) {
  const t = useTranslations('weather');
  const locale = useLocale();
  const [data, setData] = useState<WeatherData | null>(initial);
  const [failed, setFailed] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    let mounted = true;
    let hasLoaded = data !== null; // 服务端已给出数据则无需“加载中”
    let timer: ReturnType<typeof setInterval> | undefined;

    async function refresh() {
      try {
        const res = await fetch(buildWeatherUrl());
        if (!res.ok) throw new Error(`Bad weather status: ${res.status}`);
        const parsed = parseWeather(await res.json());
        if (!mounted) return;
        setData(parsed);
        setFailed(false);
        setUpdatedAt(new Date());
        hasLoaded = true;
      } catch {
        // 有数据时保持上次结果；完全无数据则提示不可用
        if (!hasLoaded) setFailed(true);
      }
    }

    refresh();
    timer = setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => {
      mounted = false;
      if (timer) clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const localeTag = formatTag(locale);
  const weekdayFormatter = new Intl.DateTimeFormat(localeTag, {
    weekday: 'short',
    timeZone: STADIUM_TIME_ZONE,
  });
  const dateFormatter = new Intl.DateTimeFormat(localeTag, {
    month: 'short',
    day: 'numeric',
    timeZone: STADIUM_TIME_ZONE,
  });
  const timeFormatter = new Intl.DateTimeFormat(localeTag, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: STADIUM_TIME_ZONE,
  });

  if (!data) {
    return (
      <section className="section-padding" style={{ background: 'var(--bg-tertiary)' }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-center" style={{ color: 'var(--text-muted)' }}>
            {failed ? t('unavailable') : t('loading')}
          </p>
        </div>
      </section>
    );
  }

  const current = data.current;
  const days = data.daily.slice(0, 7);
  const today = days[0];
  const advice = buildWeatherAdvice(data);
  const todayRain = today?.precipitationProbability ?? null;
  const uvValue = today?.uvIndexMax ?? current.uvIndex;
  const uv = uvBand(uvValue);
  const groupLabel = (group: string) => t(`groups.${group}`);
  const riskIds = advice.risks;

  return (
    <section className="section-padding" style={{ background: 'var(--bg-tertiary)' }}>
      <div className="max-w-6xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <p className="mb-4" style={{ color: 'var(--text-muted)' }}>{t('subtitle')}</p>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ---------- 基础天气卡：温度 / 天气 / 降水概率 / 风力 ---------- */}
          <div
            className="rounded-2xl p-6 sm:p-8 flex flex-col"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {t('current')}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {ATTRACTION.city}
                </p>
              </div>
              <WeatherIcon group={groupFromCode(current.weatherCode)} isDay={current.isDay} size={52} />
            </div>

            <div className="mt-4 flex items-end gap-3">
              <span
                className="font-display text-6xl font-bold leading-none"
                style={{ color: 'var(--text-primary)' }}
              >
                {current.temperature}°
              </span>
              <span className="pb-1" style={{ color: 'var(--text-secondary)' }}>
                {groupLabel(groupFromCode(current.weatherCode))}
              </span>
            </div>

            {today && (
              <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                {today.tempMin}° / {today.tempMax}°
              </p>
            )}

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('feels')}</p>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {current.apparentTemperature}°
                </p>
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('rainChance')}</p>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {todayRain != null ? `${todayRain}%` : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('uvLabel')}</p>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {uv ? t(`uvCat.${uv}`) : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('wind')}</p>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {t('windLevel', { level: beaufortFromKmh(current.windSpeed) })}
                </p>
              </div>
            </div>
          </div>

          {/* ---------- 7 日预报 ---------- */}
          <div
            className="lg:col-span-2 rounded-2xl p-6 sm:p-8"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                {t('forecast')}
              </p>
              {updatedAt && (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {t('updated')} {timeFormatter.format(updatedAt)}
                </p>
              )}
            </div>

            <ul className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
              {days.map((day, i) => {
                const group = groupFromCode(day.weatherCode);
                return (
                  <li key={day.date} className="py-3 flex items-center gap-3 sm:gap-4">
                    <span
                      className="w-14 sm:w-16 font-medium"
                      style={{ color: i === 0 ? 'var(--accent)' : 'var(--text-primary)' }}
                    >
                      {i === 0 ? t('today') : weekdayFormatter.format(new Date(`${day.date}T12:00:00`))}
                    </span>
                    <span className="text-xs w-16 sm:w-24 truncate" style={{ color: 'var(--text-muted)' }}>
                      {dateFormatter.format(new Date(`${day.date}T12:00:00`))}
                    </span>
                    <span className="flex-1 min-w-0" style={{ color: 'var(--text-secondary)' }}>
                      <span className="inline-flex items-center gap-2">
                        <WeatherIcon group={group} isDay size={24} />
                        <span className="truncate">{groupLabel(group)}</span>
                      </span>
                    </span>
                    <span
                      className="text-xs shrink-0"
                      style={{
                        color:
                          day.precipitationProbability != null && day.precipitationProbability >= 40
                            ? 'var(--accent)'
                            : 'var(--text-muted)',
                      }}
                      title={day.precipitationProbability != null ? t('rainChance') : undefined}
                    >
                      {day.precipitationProbability != null ? `${day.precipitationProbability}%` : '—'}
                    </span>
                    <span
                      className="w-20 sm:w-24 text-right font-medium shrink-0"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {day.tempMin}° / {day.tempMax}°
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* ---------- 智能建议（仅渲染命中的条件） ---------- */}
        <div
          className="mt-6 rounded-2xl p-6 sm:p-8"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
          }}
        >
          {riskIds.length > 0 && (
            <div
              className="mb-6 rounded-xl px-4 sm:px-5 py-4"
              style={{
                background: 'var(--risk-bg)',
                border: '1px solid var(--risk-border)',
              }}
            >
              <p
                className="text-sm font-semibold mb-2"
                style={{ color: 'var(--risk-text)' }}
              >
                {t('advice.riskHeader')}
              </p>
              <ul className="space-y-1.5">
                {riskIds.map((id) => (
                  <RiskTip key={id}>{t(`advice.types.${id}`)}</RiskTip>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <AdviceColumn ids={advice.outfit} label={t('advice.outfit')} />
            <AdviceColumn ids={advice.activity} label={t('advice.activity')} />
            <AdviceColumn ids={advice.items} label={t('advice.items')} />
          </div>
        </div>
      </div>
    </section>
  );
}
