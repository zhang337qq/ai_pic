import {baseImageUrl} from '../config';

export const buildImageUrl = (url: string) => {
  if (!url) {
    return '';
  }
  if (url.indexOf('http') >= 0) {
    return url;
  }
  return `${baseImageUrl}/${url}`;
}