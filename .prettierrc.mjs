/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */

const config = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'avoid',
  printWidth: 100,
  plugins: ['prettier-plugin-tailwindcss','prettier-plugin-astro'],
}

export default config
