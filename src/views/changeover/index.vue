<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ExamplePage',
  setup() {
    // 页面逻辑在这里编写
    const message = '欢迎来到 Example Page!';
    return { message };
  }
});
</script>

<template>
  <div class="example-page">
    <h1>Example Page</h1>
    <p>这是一个示例页面。</p>
  </div>
</template>

<style scoped>
.example-page {
  padding: 20px;
}
</style>
