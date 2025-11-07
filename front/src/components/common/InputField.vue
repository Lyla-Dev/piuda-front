<template>
  <div class="input-field">
    <label v-if="label" class="label">
      {{ label }} 
      <span v-if="required" class="req">*</span>
    </label>

    <component
      :is="as === 'textarea' ? 'textarea' : 'input'"
      class="control"
      :type="as === 'textarea' ? undefined : type"
      :rows="as === 'textarea' ? rows : undefined"
      :placeholder="placeholder"
      :name="name"
      :required="required"
      :disabled="disabled"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  name: "InputField",
  // 컴포넌트에서 발생하는 이벤트를 명시합니다.
  emits: ["update:modelValue"], 
  props: {
    // v-model을 위한 필수 prop
    modelValue: [String, Number], 
    
    // 라벨 텍스트
    label: String,
    
    // 렌더링할 태그 (input 또는 textarea)
    as: { type: String, default: "input" }, 
    
    // input type (text, email, password 등)
    type: { type: String, default: "text" }, 
    
    // placeholder 텍스트
    placeholder: String,
    
    // HTML name 속성
    name: String,
    
    // 필수 입력 여부
    required: { type: Boolean, default: false }, 
    
    // 입력 비활성화 여부 (두 번째 버전에서 추가됨)
    disabled: { type: Boolean, default: false },
    
    // textarea일 경우 행 수
    rows: { type: Number, default: 3 }, 
  },
};
</script>

<style scoped>
/* 첫 번째 버전의 깔끔한 CSS 스타일을 사용합니다. */
.input-field { 
    display:flex; 
    flex-direction:column; 
    gap: 6px; /* 두 번째 버전의 간격 스타일 추가 */
    margin-bottom:16px; 
}

.label { 
    font-weight:600; 
    font-size:14px; /* 두 번째 버전의 폰트 사이즈 추가 */
}

.req { 
    color:#e11d48; 
    margin-left:2px; 
}

.control { 
    padding:8px 12px; /* 두 번째 버전의 패딩으로 변경 */
    border:1px solid #d1d5db; 
    border-radius:9999px; /* 두 번째 버전처럼 둥근 스타일로 변경 */
    font-size:14px; 
    background:#f5f7fa; /* 두 번째 버전의 배경색 추가 */
    outline:none;
    transition: all 0.2s; /* 부드러운 전환 효과 추가 */
}

.control:focus { 
    border-color:#2563eb; 
    box-shadow:0 0 0 3px rgba(37,99,235,0.2); 
}

/* textarea는 둥근 모서리 대신 사각형을 유지하는 것이 일반적입니다. */
textarea.control {
    border-radius: 6px;
    min-height: 80px;
    resize: vertical;
}
</style>