'use client';

import { useEffect } from 'react';

export default function PwaRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // 静默失败：静态托管无 SW 时不阻塞页面
      });
    }
  }, []);

  return null;
}
