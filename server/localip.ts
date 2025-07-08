export const getLocalIP = (): string=> {
    const interfaces = Deno.networkInterfaces();
    const localIPs = interfaces
      .filter((i) =>
        i.family === "IPv4" &&
        !i.name.startsWith("lo") &&
        i.address !== "127.0.0.1"
      )
      .map((i) => i.address);
    return localIPs[0]; // 返回第一个 IP（或 undefined）
  };