import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config([
  {
    files: ['**/*.ts'],
    languageOptions: {
      sourceType: 'module', globals: {
        ...globals.browser
      }
    }
  },
  stylistic.configs.recommended,
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      'no-await-in-loop': 'error',
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }]
    }
  }
]
)
