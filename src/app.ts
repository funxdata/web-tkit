import { do_test } from "./info.ts"

let info = do_test()
console.log(info)
console.log("this is test!hello hello");
const doc_app = document.getElementById("app") as HTMLElement;
doc_app.innerHTML ="<h5>this is test!</h5>";




