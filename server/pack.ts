import { build } from "rolldown";
await build({
    input: 'src/app.js',
    output: {
      file: 'dist/release.js',
    },
  });
