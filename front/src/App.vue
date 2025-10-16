<template>
  <div style="padding: 40px; max-width: 600px; margin: auto;">
    <h2>InputField 테스트</h2>

    <InputField
      label="작성자"
      required
      v-model="form.writer"
      placeholder="홍길동"
    />

    <InputField
      label="활동인원 수"
      required
      type="number"
      v-model="form.count"
      placeholder="0명"
    />

    <InputField
      label="활동단체"
      required
      v-model="form.title"
      placeholder="예: 제주바당"
    />

    <p style="margin-top: 20px;">입력 내용 확인:</p>
    <pre>{{ form }}</pre>
  </div>
</template>

<script setup>
import { ref } from "vue"
import InputField from "@/components/common/InputField.vue"

const form = ref({
  writer: "",
  count: "",
  groupname: ""
})
</script>
