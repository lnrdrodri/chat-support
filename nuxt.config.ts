import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  vite: {
    plugins: [tailwindcss()],
  },
  css: ["@/assets/css/main.css"],
  app: {
    head: {
      title: "Sailer Chat",
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
        },
        {
          rel: "icon",
          type: "image/png",
          href: "https://cdn.prod.website-files.com/65eb03ecb1deb509f027ecef/65f48844e8778454e2c0fe35_Group%2035198.png",
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      API_URL: process.env.NUXT_API_URL,
    },
  },
  modules: ["@pinia/nuxt"],
  imports: {
    dirs: ["stores"],
  },
});
