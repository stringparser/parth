export interface ParthOptions {
  defaultRE?: RegExp;
}

export interface ParthResult {
  match: string;
  params: Record<string, string>;
  notFound: string;
  path?: string;
  regex?: RegExp;
  stem?: string;
  depth?: number;
}

export interface PathOpt {
  path: string;
  stem?: string;
  depth?: number;
  regex?: RegExp;
  [key: string]: unknown;
}

export interface RegexEntry extends PathOpt {
  stem: string;
  depth: number;
  regex: RegExp;
}

export interface ParthRegex extends Array<RegexEntry> {
  master: RegExp;
  defaultRE: RegExp;
}
