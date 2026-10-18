/** Front 100 % estático: `npm run build` genera web/out/ y la API lo sirve en el mismo puerto. */
const nextConfig = {
  output: "export",
  trailingSlash: true,          // /portal/ → portal/index.html (lo entiende StaticFiles de FastAPI)
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
