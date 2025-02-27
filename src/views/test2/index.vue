<script lang="ts" setup>
import { ref } from 'vue';

interface RowVO {
  name: string;
  role: string;
  sex: string;
  age: number;
  address: string;
}

const tableData = ref<RowVO[]>([
  { name: 'Test1', role: 'Develop', sex: 'Man', age: 28, address: 'test abc' },
  { name: 'Test2', role: 'Test', sex: 'Women', age: 22, address: 'Guangzhou' },
  { name: 'Test3', role: 'PM', sex: 'Man', age: 32, address: 'Shanghai' },
  { name: 'Test4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' }
]);
</script>

<template>
  <div>
    <VxeTable border :data="tableData">
      <VxeColumn field="name" title="Name"></VxeColumn>
      <VxeColumn field="sex" title="Sex"></VxeColumn>
      <VxeColumn field="age" title="Age"></VxeColumn>
      <VxeColumn field="address" title="Address" :visible="false"></VxeColumn>
    </VxeTable>
  </div>
</template>
