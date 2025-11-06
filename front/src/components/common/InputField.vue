<template>
  <div style="display:flex; flex-direction:column; gap:6px;">
    <label v-if="label" style="font-weight:600; font-size:14px;">
      {{ label }} <span v-if="required" style="color:#e11d48">*</span>
    </label>
    <input
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      style="padding:8px 12px; border:1px solid #cbd5e1; border-radius:9999px; background:#f5f7fa; outline:none;"
    />
  </div>
</template>

<script setup>
// Vue 3 <script setup> 방식: defineProps와 defineEmits만 사용합니다.

// ActivityFormView.vue에서 사용된 모든 props를 여기에 정의합니다.
defineProps({
    modelValue: { type: [String, Number], default: '' }, // v-model을 위한 필수 prop
    label: String,
    required: Boolean,
    placeholder: String,
    type: { type: String, default: 'text' },
    disabled: Boolean,
    unit: String // 총 쓰레기 양 (무게), (부피)에 사용되는 prop
});

// v-model의 변경을 부모에게 전달하는 필수 emit 이벤트입니다.
defineEmits(['update:modelValue']); 

// 참고: unit prop을 사용하려면 <template>에서 unit 관련 UI (예: kg, L)도 추가해야 합니다.
</script>