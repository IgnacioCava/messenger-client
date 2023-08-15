/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
			},
			spacing: {
				'cl-xl': 'var(--chat-list-xl)',
				'cl-lg': 'var(--chat-list-lg)',
				'cl-md': 'var(--chat-list-md)',
				'app-max': '1280px'
			},
			minWidth: {
				'cl-xl': 'var(--chat-list-xl)',
				'cl-lg': 'var(--chat-list-lg)',
				'cl-md': 'var(--chat-list-md)'
			},
			maxWidth: {
				'app-max': '1280px'
			},
			animation: {
				anim: 'var(--anim)',
				'anim-back': 'var(--anim-back)'
			}
		}
	},
	plugins: []
}
