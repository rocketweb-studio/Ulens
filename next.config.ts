import type {NextConfig} from "next";
import path from "path";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.join(process.cwd(), "src", "common", "styles")],
    additionalData: `
    @use "colors" as *;
    @use "typography" as *;
    `
  },
};

export default nextConfig;