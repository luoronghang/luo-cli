const OFF = 0
const ERROR = 2

module.exports = {
  root: true,
  env: {
    node: true,
    browser: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/prettier',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    eqeqeq: [ERROR, 'allow-null'],
    quotes: OFF,
    'brace-style': [ERROR, '1tbs'],
    'eol-last': ERROR,
    'max-len': [
      ERROR,
      {
        code: 120,
        ignoreTemplateLiterals: true,
      },
    ],
    'no-duplicate-imports': ERROR,
    'sort-imports': [
      ERROR,
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        allowSeparatedGroups: false,
      },
    ],
    'prefer-const': ERROR,
    'no-multiple-empty-lines': ERROR,
    'no-whitespace-before-property': ERROR,
    'space-infix-ops': ERROR,
    'comma-dangle': OFF,
    'no-useless-computed-key': ERROR,
    'no-var': ERROR,
    'no-dupe-keys': ERROR,
    'no-func-assign': ERROR,
    'no-implicit-coercion': ERROR,
    'no-irregular-whitespace': ERROR,
    'no-multi-spaces': ERROR,
    'no-unused-expressions': ERROR,
    '@typescript-eslint/ban-ts-comment': OFF,
    curly: ERROR
  },
  globals:{
    wx:true,
    swan:true,
    my:true,
    tt:true
  }
}
