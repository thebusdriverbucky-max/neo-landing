import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import ts from 'typescript';

const root = path.resolve(__dirname, '../..');
const nativeRequire = createRequire(path.join(root, 'package.json'));

// Load actual project modules while keeping database/provider boundaries explicit.
export function moduleLoader(mocks: Record<string, unknown>) {
  const cache = new Map<string, { exports: Record<string, unknown> }>();

  function load(relativePath: string): Record<string, unknown> {
    let filename = path.resolve(root, relativePath);
    if (!existsSync(filename)) {
      filename += existsSync(`${filename}.ts`) ? '.ts' : '.tsx';
    }
    if (cache.has(filename)) return cache.get(filename)!.exports;

    const loadedModule = { exports: {} as Record<string, unknown> };
    cache.set(filename, loadedModule);
    const source = ts.transpileModule(readFileSync(filename, 'utf8'), {
      compilerOptions: {
        esModuleInterop: true,
        jsx: ts.JsxEmit.ReactJSX,
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
      fileName: filename,
    }).outputText;

    const requireMock = (id: string): unknown => {
      if (Object.prototype.hasOwnProperty.call(mocks, id)) return mocks[id];
      if (id === '@prisma/client') {
        throw new Error(`Unmocked external boundary: ${id}`);
      }
      if (id.startsWith('@/')) return load(id.slice(2));
      if (id.startsWith('.')) return load(path.resolve(path.dirname(filename), id));
      return nativeRequire(id);
    };

    new Function('require', 'module', 'exports', source)(
      requireMock,
      loadedModule,
      loadedModule.exports,
    );
    return loadedModule.exports;
  }

  return load;
}
