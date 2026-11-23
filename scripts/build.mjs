import { build } from 'esbuild';
await build({entryPoints:['src/index.mjs'],outfile:'dist/index.mjs',bundle:true,platform:'node',format:'esm',target:'node22'});
