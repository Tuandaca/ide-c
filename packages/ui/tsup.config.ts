import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    external: ['react', 'react-dom'],
    sourcemap: true,
    // Add these to prevent dts errors with xterm css
    noExternal: ['xterm-addon-fit'],
    loader: {
        '.css': 'local-css',
    },
});
