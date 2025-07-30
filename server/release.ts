import { resolve, dirname, fromFileUrl } from "@std/path";
import { uploadFileToUpyun, readFilesRecursive } from "./upfiles.ts";

// 发布的目录
const args_src = Deno.args[0];
// 获取当前模块的目录路径
const __dirname = dirname(fromFileUrl(import.meta.url));
console.log(__dirname);

// 示例用法
const publicDir = resolve(__dirname, args_src);
console.log(publicDir);
const stat = await Deno.stat(publicDir).catch(() => null);
if (!stat?.isFile) {
  console.log(`${publicDir} not found`);
  Deno.exit(1); // 可选
} 

// 发布到的路径
const cloud_dir = Deno.args[1];

// 读取所有文件
const dir_files = await readFilesRecursive(publicDir);

// 上传文件文档文件
for (const file of dir_files) {
  await uploadFileToUpyun(cloud_dir, file.fullPath, file.relativePath);
}
