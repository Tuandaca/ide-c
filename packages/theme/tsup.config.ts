import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts', 'src/tokens.css'],
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    loader: {
        '.css': 'copy',
    },
});
