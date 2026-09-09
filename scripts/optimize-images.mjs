/**
 * 站点图片压缩脚本（用于提升页面加载速度）。
 *
 * 处理范围：public/gallery 下的所有 JPG。
 * - 将原图缩放至最长边不超过 MAX_WIDTH（1920px）、JPEG q82、去除元数据，覆盖保存；
 * - 生成同名 .webp（q78）作为现代浏览器优先格式；
 * - 生成 thumbs/ 下的 640px 宽 WebP + JPEG 缩略图，供画廊网格使用。
 *
 * 运行：npm run optimize:images
 */
import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const galleryDir = path.join(root, 'public', 'gallery');
const thumbsDir = path.join(galleryDir, 'thumbs');
const MAX_WIDTH = 1920; // 全尺寸最宽边（覆盖 HERO 全屏与灯箱）
const THUMB_WIDTH = 640; // 网格缩略图宽
const JPEG_QUALITY = 82;
const WEBP_QUALITY = 78;
const THUMB_QUALITY = 72;

await mkdir(thumbsDir, { recursive: true });

const files = (await readdir(galleryDir)).filter((f) => /\.jpe?g$/i.test(f));
let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const inputPath = path.join(galleryDir, file);
  const before = (await stat(inputPath)).size;
  totalBefore += before;

  try {
    // failOn: 'none' 允许处理文件头损坏/流向有误的 JPEG（尽量容忍解码告警）
    const buffer = await readFile(inputPath);
    const pipeline = sharp(buffer, { failOn: 'none' });
    const meta = await pipeline.metadata();
    const base = file.replace(/\.jpe?g$/i, '');
    const longEdge = Math.max(meta.width || 0, meta.height || 0);

    const resizeFull = () =>
      pipeline.clone().rotate().resize({
        width: MAX_WIDTH,
        height: MAX_WIDTH,
        fit: 'inside',
        withoutEnlargement: true,
      });

    // 全尺寸 JPEG（覆盖原文件）与 WebP
    const full = await resizeFull()
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, chromaSubsampling: '4:2:0' })
      .toBuffer();
    const fullWebp = await resizeFull().webp({ quality: WEBP_QUALITY }).toBuffer();

    await Promise.all([
      writeFile(inputPath, full),
      writeFile(path.join(galleryDir, `${base}.webp`), fullWebp),
    ]);

    // 缩略图（JPEG + WebP）
    const thumbWidth = Math.min(THUMB_WIDTH, longEdge);
    const thumb = await pipeline
      .clone()
      .rotate()
      .resize({ width: thumbWidth, withoutEnlargement: true })
      .jpeg({ quality: THUMB_QUALITY, mozjpeg: true })
      .toBuffer();
    const thumbWebp = await pipeline
      .clone()
      .rotate()
      .resize({ width: thumbWidth, withoutEnlargement: true })
      .webp({ quality: THUMB_QUALITY })
      .toBuffer();

    await Promise.all([
      writeFile(path.join(thumbsDir, `${base}-${THUMB_WIDTH}.jpg`), thumb),
      writeFile(path.join(thumbsDir, `${base}-${THUMB_WIDTH}.webp`), thumbWebp),
    ]);

    const after = full.length + fullWebp.length + thumb.length + thumbWebp.length;
    totalAfter += after;
    console.log(
      `${file}: ${(before / 1024).toFixed(0)}KB -> jpg ${(full.length / 1024).toFixed(0)}KB / webp ${(fullWebp.length / 1024).toFixed(0)}KB / thumbs ${((thumb.length + thumbWebp.length) / 1024).toFixed(0)}KB (尺寸 ${meta.width}x${meta.height})`
    );
  } catch (err) {
    console.warn(`${file}: 处理失败，已跳过 (${err.message})`);
  }
}

console.log(
  `\n完成。原文件合计 ${(totalBefore / 1024 / 1024).toFixed(1)}MB；新生成全尺寸+缩略图合计 ${(totalAfter / 1024 / 1024).toFixed(1)}MB`
);
