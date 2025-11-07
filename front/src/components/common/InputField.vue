<template>
  <div
    class="input-field"
    style="display:flex; flex-direction:column; gap:6px;"
  >
    <label
      v-if="label"
      class="label"
      style="font-weight:600; font-size:14px;"
    >
      {{ label }}
      <span
        v-if="required"
        class="req"
        style="color:#e11d48"
      >*</span>
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
      style="padding:8px 12px; border:1px solid #cbd5e1; border-radius:9999px; background:#f5f7fa; outline:none;"
    />
  </div>
</template>

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
    <span v-if="unit" class="unit">{{ unit }}</span>
  </div>
</template>

<script setup>
defineProps({
  // v-model
  modelValue: { type: [String, Number], default: '' },

  // UI props
  label: String,
  placeholder: String,
  type: { type: String, default: 'text' },
  as: { type: String, default: 'input' },
  name: String,
  rows: { type: Number, default: 3 },
  unit: String,

  // 상태 props
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.input-field { 
  display:flex; 
  flex-direction:column; 
  gap:6px;
  margin-bottom:16px;
  position:relative;
}

.label { 
  font-weight:600; 
  font-size:14px;
}

.req { 
  color:#e11d48; 
  margin-left:2px; 
}

.control { 
  padding:8px 12px;
  border:1px solid #d1d5db; 
  border-radius:9999px;
  font-size:14px;
  background:#f5f7fa;
  outline:none;
  transition:all 0.2s;
}

.control:focus { 
  border-color:#2563eb; 
  box-shadow:0 0 0 3px rgba(37,99,235,0.2); 
}

/* textarea는 둥근 모서리 대신 사각형으로 */
textarea.control {
  border-radius:6px;
  min-height:80px;
  resize:vertical;
}

.unit {
  position:absolute;
  right:12px;
  bottom:8px;
  font-size:13px;
  color:#64748b;
}
</style>
