import { do_test } from "./info.ts"
let info = do_test()
console.log(info)
const doc_app = document.getElementById("app") as HTMLElement;
doc_app.innerHTML ="<h5>change info!</h5>";