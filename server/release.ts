import { uploadFileToUpyun, readFilesRecursive } from "./upfiles.ts";

// 获取版本号
const config = JSON.parse(await Deno.readTextFile("deno.json"));
const version = config.version ?? "v0.0.0"; // 默认值防止缺失
// 发布的目录
const args_dir = Deno.args[0];
if (!args_dir) {
  console.error("Usage: deno task release <本地目录> <云端目录>");
  Deno.exit(1);
}

const stat = await Deno.stat(args_dir).catch(() => null);
if (!stat?.isDirectory) {
  console.log(`${args_dir} not found`);
  Deno.exit(1); // 可选
} 

// 发布到的路径
const cloud_dir = Deno.args[1];
if (!cloud_dir) {
  console.error("Usage: deno task release <本地目录> <云端目录>");
  Deno.exit(1);
}

// 读取所有文件
const dir_files = await readFilesRecursive(args_dir);
// 上传文件文档文件
let failed = 0;
for (const file of dir_files) {
  const ok = await uploadFileToUpyun(cloud_dir + version, file.fullPath, file.relativePath);
  if (!ok) failed++;
}

if (failed > 0) {
  console.error(`❌ ${failed}/${dir_files.length} 个文件上传失败`);
  Deno.exit(1);
}

console.log(`✅ 全部上传完成：${dir_files.length} 个文件`);
