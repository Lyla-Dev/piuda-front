<template>
  <!-- <div class="input-field">
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
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)" -->
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

<!-- //   name: "InputField",
//   props: {
//     modelValue: [String, Number],
//     label: String,
//     as: { type: String, default: "input" },
//     type: { type: String, default: "text" },
//     placeholder: String,
//     name: String,
//     required: { type: Boolean, default: false },
//     rows: { type: Number, default: 3 },
//   },
//   emits: ["update:modelValue"],
// };
// </script> -->

<!-- // <style scoped>
// .input-field { display:flex; flex-direction:column; margin-bottom:16px; }
// .label { font-weight:600; margin-bottom:4px; }
// .req { color:#e11d48; margin-left:2px; }
// .control { padding:8px 10px; border:1px solid #d1d5db; border-radius:6px; font-size:14px; }
// .control:focus { outline:none; border-color:#2563eb; box-shadow:0 0 0 3px rgba(37,99,235,0.2); }
// </style> -->