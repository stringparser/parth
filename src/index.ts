import * as _ from './lib';
import type {
  ParthOptions,
  ParthResult,
  PathOpt,
  RegexEntry,
  ParthRegex,
} from './types';

export type { ParthOptions, ParthResult };

const qshRE = /[?#][^/\s]*/g;
const depthRE = /((^|[/?#.\s]+)[(:\w])/g;
const paramRE = /:([-\w]+)(\([^\s]+?[)][?)]*)?/g;
const noParamRE = /(^|[/.=\s]+)(\(.+?\)+)/g;

export class Parth {
  #store: Record<string, PathOpt> = {};
  #regex: ParthRegex;

  constructor(options?: ParthOptions) {
    this.#regex = [] as unknown as ParthRegex;
    this.#regex.master = new RegExp('(?:[])');
    this.#regex.defaultRE = /[^?#./\s]+/;

    if (options?.defaultRE) {
      this.#regex.defaultRE = options.defaultRE;
    }
  }

  set(path: string, opt?: Partial<PathOpt>): this {
    if (typeof path !== 'string') {
      return this;
    }

    const o = _.cloneDeep(opt || {}) as PathOpt;
    o.path = path.replace(/\s+/g, ' ').trim();

    if (this.#store[o.path]) {
      Object.assign(this.#store[o.path], o);
      return this;
    }
    this.#regex.push((this.#store[o.path] = o) as RegexEntry);

    let index = -1;
    const defaultRE = '(' + this.#regex.defaultRE.source + ')';

    o.stem = o.path.replace(noParamRE, function ($0, $1: string, $2: string) {
      return $1 + ':' + (++index) + $2;
    });

    const url = (o.stem!.match(/[^\s]*\/\S*/) || [null]).pop();
    const qsh = _.getQueryString(url);

    if (url && !qsh) {
      o.stem = o.stem!.replace(
        url,
        url.replace(/\/$/, '$1') + ':qs(?:\\/)?(' + qshRE.source + ')?',
      );
    }

    o.depth = o.stem!.split(depthRE).length || -1;
    o.regex = new RegExp(
      '^' +
        o
          .stem!.replace(/\S+/g, function (s) {
            return s.replace(paramRE, function ($0, $1, $2) {
              return $2 || defaultRE;
            });
          })
          .replace(/[^?( )+*$]+(?=\(|$)/g, function escapeRegExp($0) {
            return $0.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
          }),
    );

    this.#regex.sort(function (x, y) {
      return y.depth - x.depth || y.stem.localeCompare(x.stem);
    });

    this.#regex.master = new RegExp(
      '(' +
        this.#regex
          .map(function (el) {
            return el.regex.source.replace(/\((?=[^?])/g, '(?:');
          })
          .join(')|(') +
        ')',
    );

    return this;
  }

  get(path: string): ParthResult | null {
    if (typeof path !== 'string') {
      return null;
    }

    path = path.replace(/\s+/g, ' ').trim();

    if (this.#store[path]) {
      return Object.assign(_.cloneDeep(this.#store[path]), {
        match: path,
        notFound: '',
        params: {},
      });
    }

    const found = this.#regex.master.exec(path);
    if (!found) {
      return null;
    }

    const o: ParthResult = {
      match: found.shift()!,
      params: {},
      notFound: '',
    };

    const matchIndex = found.indexOf(o.match);
    const foundEntry = this.#regex[matchIndex];
    o.notFound = path.slice(o.match.length);

    let paramIndex = -1;
    const params = foundEntry.regex.exec(path)!.slice(1);

    foundEntry.stem.replace(paramRE, function ($0, $1) {
      o.params[$1] = params[++paramIndex];
      return $0;
    });

    return Object.assign(_.cloneDeep(foundEntry), o);
  }
}

export default Parth;
