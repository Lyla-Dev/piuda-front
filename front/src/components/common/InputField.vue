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
      :disabled="disabled" :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  name: "InputField",
  props: {
    modelValue: [String, Number],
    label: String,
    as: { type: String, default: "input" },
    type: { type: String, default: "text" },
    placeholder: String,
    name: String,
    required: { type: Boolean, default: false },
    rows: { type: Number, default: 3 },
    disabled: { type: Boolean, default: false }, // props에 disabled 추가
  },
  emits: ["update:modelValue"],
};
</script>

<style scoped>
/* HEAD 버전의 CSS를 사용하여 스타일 통일 */
.input-field { display:flex; flex-direction:column; margin-bottom:16px; }
.label { font-weight:600; margin-bottom:4px; }
.req { color:#e11d48; margin-left:2px; }
/* 인라인 스타일 대신 CSS 클래스 사용 */
.control { padding:8px 10px; border:1px solid #d1d5db; border-radius:6px; font-size:14px; }
.control:focus { outline:none; border-color:#2563eb; box-shadow:0 0 0 3px rgba(37,99,235,0.2); }
</style>