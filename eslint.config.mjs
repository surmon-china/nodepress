import globals from 'globals'
import pluginJs from '@eslint/js'
import tsEslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

const globalsConfig = {
  ...globals.node,
  ...globals.jest
}

const rules = {
  'no-empty': 'off',
  '@typescript-eslint/camelcase': 'off',
  '@typescript-eslint/interface-name-prefix': 'off',
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/no-unused-vars': 'off',
  '@typescript-eslint/no-namespace': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-use-before-define': 'off',
  '@typescript-eslint/no-var-requires': 'off',
  '@typescript-eslint/no-unused-expressions': 'off',
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/no-empty-function': 'off'
}

export default [
  { languageOptions: { globals: globalsConfig } },
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
  eslintPluginPrettierRecommended,
  { rules }
]
