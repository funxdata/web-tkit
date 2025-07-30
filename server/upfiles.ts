// upyun.ts
import { extname, join, relative } from "@std/path";
import { S3Client, PutObjectCommand } from "npm:@aws-sdk/client-s3";

// ✅ 读取环境变量（兼容 Node 风格）
const config = {
  AccessKey: Deno.env.get("AccessKey"),
  SecretAccessKey: Deno.env.get("SecretAccessKey"),
  bucketname: Deno.env.get("UPX_SERVICENAME"),
};

// ✅ 校验环境变量是否存在
if (!config.AccessKey || !config.SecretAccessKey || !config.bucketname) {
  console.error("❌ 环境变量未设置，请确保存在 AccessKey, SecretAccessKey, UPX_SERVICENAME");
  Deno.exit(1);
}


// ✅ 初始化兼容又拍云的 S3 客户端
const s3 = new S3Client({
  endpoint: "https://s3.api.upyun.com",
  region: "us-east-1",
  credentials: {
    accessKeyId: config.AccessKey,
    secretAccessKey: config.SecretAccessKey,
  },
  forcePathStyle: true,
});

// ✅ MIME 类型映射
const mimeTypes: Record<string, string> = {
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".html": "text/html",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".otf": "font/otf",
  ".txt": "text/plain",
};

// ✅ 上传单个文件到又拍云
export async function uploadFileToUpyun(
  remoteDir: string,
  localPath: string,
  relativePath: string,
): Promise<void> {
  try {
    const fileContent = await Deno.readFile(localPath);
    const ext = extname(relativePath).toLowerCase();
    const contentType = mimeTypes[ext] ?? "application/octet-stream";

    // ✅ 替换所有反斜杠为正斜杠，统一为 POSIX 风格
    const remotePath = relativePath.replaceAll("\\", "/");
    const key = `${remoteDir}/${remotePath}`;

    const command = new PutObjectCommand({
      Bucket: config.bucketname,
      Key: key,
      Body: fileContent,
      ContentType: contentType,
    });

    await s3.send(command);
    console.log(`✅ 上传成功: ${key} (${contentType})`);
  } catch (err) {
    console.error(`❌ 上传失败 (${relativePath}):`, err);
  }
}

// ✅ 递归读取目录下所有文件
export async function readFilesRecursive(
  dir: string,
  base = dir,
): Promise<Array<{ fullPath: string; relativePath: string }>> {
  const results: Array<{ fullPath: string; relativePath: string }> = [];

  for await (const entry of Deno.readDir(dir)) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory) {
      const nested = await readFilesRecursive(fullPath, base);
      results.push(...nested);
    } else if (entry.isFile) {
      const relPath = relative(base, fullPath);
      results.push({
        fullPath,
        relativePath: relPath,
      });
    }
  }

  return results;
}