import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import mdx from '@astrojs/mdx';



// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react(), mdx()],
  output: 'server',
  adapter: cloudflare(),
});