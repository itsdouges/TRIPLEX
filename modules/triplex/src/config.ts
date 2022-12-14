import { findParentFile, findParentFileOrThrow } from './fs.ts';

interface EditorConfig {
  playCommand?: string;
  tsConfigFilePath?: string;
  publicDir?: string;
}

export async function getConfig(): Promise<EditorConfig> {
  try {
    const config = await import(findParentFileOrThrow('r3f.config.json'), {
      assert: { type: 'json' },
    });

    if (!config.default.tsConfigFilePath) {
      config.default.tsConfigFilePath = findParentFile('tsconfig.json');
    }

    return config.default;
  } catch (_) {
    return {};
  }
}
