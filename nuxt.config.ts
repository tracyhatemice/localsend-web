// https://nuxt.com/docs/api/configuration/nuxt-config

// Normalize BASE_PATH so it always starts and ends with a slash.
// Set via `BASE_PATH=/send/` (env var) or by editing the default below to
// serve the app under a sub-path such as `https://example.org/send/`.
const rawBasePath = process.env.BASE_PATH ?? "/";
const withLeading = rawBasePath.startsWith("/") ? rawBasePath : `/${rawBasePath}`;
const baseURL = withLeading.endsWith("/") ? withLeading : `${withLeading}/`;

// Public origin used for SEO canonical/hreflang links (no trailing slash).
// Override with `BASE_URL=https://example.org`.
const i18nBaseUrl = (process.env.BASE_URL ?? "https://web.localsend.org").replace(/\/+$/, "");

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/i18n",
    "@nuxt/icon",
    "@vite-pwa/nuxt",
  ],
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      signalingUrl:
        process.env.SIGNALING_URL ?? "wss://public.localsend.org/v1/ws",
    },
  },
  app: {
    baseURL,
    head: {
      link: [
        {
          rel: "icon",
          href: `${baseURL}favicon.ico`,
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: `${baseURL}apple-touch-icon.png`,
        },
      ],
    },
  },
  i18n: {
    baseUrl: i18nBaseUrl,
    strategy: "prefix_except_default",
    defaultLocale: "en",
    locales: [
      {
        code: "de",
        language: "de-DE",
        file: "de.json",
        name: "Deutsch",
      },
      {
        code: "en",
        language: "en-US",
        file: "en.json",
        name: "English",
        isCatchallLocale: true,
      },
      {
        code: "es",
        language: "es-ES",
        file: "es.json",
        name: "Español",
      },
      {
        code: "fa",
        language: "fa-IR",
        file: "fa.json",
        name: "فارسی",
      },
      {
        code: "hu",
        language: "hu-HU",
        file: "hu.json",
        name: "Magyar",
      },
      {
        code: "it",
        language: "it-IT",
        file: "it.json",
        name: "Italiano",
      },
      {
        code: "km",
        language: "km-KH",
        file: "km.json",
        name: "ភាសាខ្មែរ",
      },
      {
        code: "ko",
        language: "ko-KR",
        file: "ko.json",
        name: "한국어",
      },
      {
        code: "no",
        language: "no-NO",
        file: "no.json",
        name: "Norsk",
      },
      {
        code: "pt",
        language: "pt-BR",
        file: "pt.json",
        name: "Português",
      },
      {
        code: "sk",
        language: "sk-SK",
        file: "sk.json",
        name: "Slovenčina",
      },
      {
        code: "tr",
        language: "tr-TR",
        file: "tr.json",
        name: "Türkçe",
      },
      {
        code: "zh-CN",
        language: "zh-CN",
        file: "zh-CN.json",
        name: "简体中文",
      },
    ],
  },
  nitro: {
    prerender: {
      routes: ["/"],
      autoSubfolderIndex: false,
    },
  },
  pwa: {
    enabled: true,
    strategies: "generateSW",
    registerType: "autoUpdate",
    manifest: {
      name: "LocalSend Web",
      short_name: "LocalSend",
      theme_color: "#111827",
      background_color: "#111827",
      scope: baseURL,
      id: "localsend",
      start_url: `${baseURL}?pwa=1`,
      icons: [
        {
          src: `${baseURL}apple-touch-icon.png`,
          sizes: "180x180",
          type: "image/png",
        },
        {
          src: `${baseURL}logo-512.png`,
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
    workbox: {
      globPatterns: ["/", "**/*.{js,css,html,png,svg,ico}"],
      navigateFallback: baseURL,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\.iconify\.design\/.*'/i,
          handler: "CacheFirst",
          options: {
            cacheName: "icons",
            expiration: {
              maxEntries: 10,
            },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: baseURL,
      navigateFallbackAllowlist: [
        new RegExp(`^${baseURL.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&")}$`),
      ],
      type: "module",
    },
  },
});
