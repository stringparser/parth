import cloneDeep from 'lodash.clonedeep';

export { cloneDeep };

export function getQueryString(url: string | null | undefined): string | null {
  if (!url) {
    return null;
  }

  const index = url.indexOf('?');

  if (index > -1 && url.charAt(index + 1) !== ':') {
    return url.substring(index);
  } else {
    return null;
  }
}
