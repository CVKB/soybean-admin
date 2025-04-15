<script setup lang="ts">
import { ref } from 'vue';

interface RowVO {
  id: number;
  name: string;
  role: string;
  sex: string;
  age: number;
  address: string;
}

const tableData = ref<RowVO[]>([]);

defineOptions({
  name: 'SelectWorkNumber'
});
</script>

<template>
  <div class="flex flex-row">
    <!-- 左侧：固定宽度的输入框 -->
    <NFlex vertical class="w-200px pr-10px">
      <NGradientText type="info" size="21">工单号↓</NGradientText>
      <NInput
        class="h-500px w-full"
        type="textarea"
        placeholder="输入工单号"
        :autosize="{
          maxRows: 20
        }"
      ></NInput>
    </NFlex>

    <!-- 右侧：占满剩余宽度的表格 -->
    <NFlex vertical class="flex-1">
      <NButton class="w-100px text-14px" type="info">查询</NButton>
      <VxeTable :data="tableData" class="h-full w-full">
        <VxeColumn type="seq" width="70"></VxeColumn>
        <VxeColumn field="name" title="Name"></VxeColumn>
        <VxeColumn field="sex" title="Sex"></VxeColumn>
        <VxeColumn field="age" title="Age"></VxeColumn>
      </VxeTable>
    </NFlex>
  </div>
</template>
