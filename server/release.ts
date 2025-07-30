import { uploadFileToUpyun, readFilesRecursive } from "./upfiles.ts";

// 发布的目录
const args_dir = Deno.args[0];

const stat = await Deno.stat(args_dir).catch(() => null);
if (!stat?.isDirectory) {
  console.log(`${args_dir} not found`);
  Deno.exit(1); // 可选
} 

// 发布到的路径
const cloud_dir = Deno.args[1];

// 读取所有文件
const dir_files = await readFilesRecursive(args_dir);

// 上传文件文档文件
for (const file of dir_files) {
  await uploadFileToUpyun(cloud_dir, file.fullPath, file.relativePath);
}
