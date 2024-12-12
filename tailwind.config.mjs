/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				frank: ['"Frank Ruhl Libre"', "serif"], // Agrega la fuente con un nombre de referencia
			  },
		},
	},
	plugins: [require('@tailwindcss/typography')],
}
