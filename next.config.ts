import type { NextConfig } from "next"
import path from "path"

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.join(process.cwd(), "src", "shared", "styles")],
    additionalData: `
    @use "colors" as *;
    @use "typography" as *;
    `,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
