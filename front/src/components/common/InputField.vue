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

<script>
export default {
  name: 'InputField',
  emits: ['update:modelValue'],
  props: {
    modelValue: { type: [String, Number], default: '' },
    label: String,
    required: Boolean,
    placeholder: String,
    type: { type: String, default: 'text' },
    disabled: Boolean,
  },
}
</script>
