// .eslintrc.js 파일
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    // 이전에 에러를 발생시켰던 줄을 삭제하거나 주석 처리합니다.
    // 'vue/setup-compiler-macros' 
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  // ⭐️⭐️⭐️ 이 부분을 추가합니다: ⭐️⭐️⭐️
  globals: {
    // Vue 3 <script setup> 매크로를 전역 변수로 등록하여 ESLint 에러를 방지합니다.
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly'
  }
};