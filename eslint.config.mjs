import pluginJs from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'

export default [
  { files: ['**/*.js'], languageOptions: { sourceType: 'module', globals: globals.node, env: { browser: true, es2021: true } } },
  stylistic.configs['recommended'],
  pluginJs.configs.recommended,
  { rules: { '@stylistic/quotes': ['error', 'single', { avoidEscape: true }] } },
]
