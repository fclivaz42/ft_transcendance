const mimeTypes = {
  'html': 'text/html',
  'js': 'text/javascript',
  'css': 'text/css',
  'json': 'application/json',
  'png': 'image/png',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'gif': 'image/gif',
  'svg': 'image/svg+xml',
  'ico': 'image/x-icon',
  'woff': 'font/woff',
  'woff2': 'font/woff2',
  'ttf': 'font/ttf',
  'otf': 'font/otf',
  'eot': 'application/vnd.ms-fontobject',
  'pdf': 'application/pdf',
  'xml': 'application/xml',
  'txt': 'text/plain',
  'csv': 'text/csv',
  'zip': 'application/zip',
  'tar': 'application/x-tar',
  'gz': 'application/gzip',
  'mp4': 'video/mp4',
  'webm': 'video/webm',
  'mp3': 'audio/mpeg',
  'wav': 'audio/wav',
  'ogg': 'audio/ogg',
  'flac': 'audio/flac',
  'mkv': 'video/x-matroska',
  'avi': 'video/x-msvideo',
  'mov': 'video/quicktime',
  'webp': 'image/webp',
  'bmp': 'image/bmp',
  'jsonld': 'application/ld+json',
  'wasm': 'application/wasm',
  'md': 'text/markdown',
  'yaml': 'application/x-yaml',
  'yml': 'application/x-yaml',
  'rtf': 'application/rtf',
  'xls': 'application/vnd.ms-excel',
  'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

export default function getMimeType(filename: string): string {
  const ext = filename.split('.').pop();
  if (!ext) {
    console.warn(`No extension found for file: ${filename}`);
    return 'application/octet-stream';
  }
  console.log(`Getting MIME type for file: ${filename} with extension: ${ext}`);
  const mimeType = mimeTypes[ext];
  if (mimeType) {
    return mimeType;
  }
  return 'application/octet-stream';
}