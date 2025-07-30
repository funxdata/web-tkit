import { Dxhttp } from '@funxdata/webdx/dxhttp';
import { do_test } from "./info.ts"
// import { hello } from "@/examples/base.ts"
// import { Dxhttp } from "@funxdata/webdx/dxhttp"

let info = do_test()
console.log(info)
const doc_app = document.getElementById("app") as HTMLElement;
doc_app.innerHTML ="<h5>change info!</h5>";
// console.log(Dxhttp)
// hello();

const http = new Dxhttp({
  baseURL: 'https://auth.funxdata.com/v1/',
  // baseURL: 'http://192.168.4.109:8080/v1/',
  timeout: 5000
});

console.log()