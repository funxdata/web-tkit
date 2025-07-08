import { build } from "rolldown";


await build({
    input: 'src/app.js',
    output: {
      file: 'dist/release.js',
    },
});
console.log("hello")

console.log("参数:", Deno.args);
