# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [5.0.1] - 2026-02-07

### Added

- **Tests:** New `test/api.test.ts` with coverage for invalid inputs (`set`/`get` with non-string), no-match behavior (`get` returns `null` when no route matches), and edge cases.

---

## [5.0.0] - 2026-02-07

Major release: TypeScript migration, modern tooling, and CI updates.

### Added

- **TypeScript:** Library rewritten in TypeScript; source lives in `src/`, built output in `dist/`. Type definitions shipped via `types` in `package.json`.
- **TypeScript usage:** README and example updated to ESM + `import Parth from 'parth'`. Documented type imports: `ParthOptions`, `ParthResult`.
- **CI:** GitHub Actions workflow (`.github/workflows/ci.yml`) replacing Travis. Runs `dist`, `lint`, `test`, and `verify:publish` on Node 20, 22, and 24.
- **Publish verification:** `verify:publish` script and `test/verify-publish/` (pack, install in a consumer project, run smoke test). Runs automatically after `npm test` via `posttest`.

### Changed

- **API surface:** Default export is the `Parth` class (constructor). No behavioral change from v4 for valid usage.
- **Entry point:** `main` is now `dist/index.js` (compiled from TypeScript). `files` in `package.json` limited to `dist`.
- **Example:** `example.js` replaced by `example.ts` (ESM, TypeScript). Removed the `-l` listing of internal properties.
- **Linting:** ESLint flat config (`eslint.config.mjs`). Config files renamed to `.mjs` (e.g. `jest.config.mjs`).
- **Testing:** Mocha replaced with Jest; tests in `test/**/*.test.ts`.
- **Engines:** Node.js requirement raised to `>=20` (from `>=14`). CI tests on Node 20, 22, and 24.
- **CI branch:** Workflow runs only on `main` (no longer `master`/`main`).

### Removed

- **Travis CI:** `.travis.yml` and Travis badge from README.
- **Legacy JS:** `index.js`, `lib/util.js`, and `.eslintrc` removed in favor of TypeScript and new ESLint config.
- **Dependency:** `lodash.merge` removed; implementation uses `lodash.clonedeep` only.
- **README:** “parth properties” section (e.g. `store`, `regex`) replaced by a short TypeScript section; “todo” section removed.

### Fixed

- **package.json:** `engines` field corrected from a string to a proper object (`"node": ">=20"`).

---

## [4.2.3] and earlier

See git history for changes prior to the v5.0.0 TypeScript migration (e.g. `git log -p` on older tags).

[5.0.1]: https://github.com/stringparser/parth/compare/v5.0.0...v5.0.1
[5.0.0]: https://github.com/stringparser/parth/compare/v4.2.3...v5.0.0
