import { VitePWA } from "vite-plugin-pwa";

export default {
  plugins: [
    VitePWA({
      manifest: {
        name: "Shelem",
        short_name: "Shelem",
        description: "A scoreboard for your shelem game.",
        theme_color: "#fcf0c0",
        icons: [
          {
            src: "logo.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "logo-maskable-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "logo.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
          {
            src: "logo-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
};
