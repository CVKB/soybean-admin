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

const tableData = ref<RowVO[]>([
  { id: 10001, name: 'Test1', role: 'Develop', sex: 'Man', age: 28, address: 'test abc' },
  { id: 10002, name: 'Test2', role: 'Test', sex: 'Women', age: 22, address: 'Guangzhou' },
  { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', age: 32, address: 'Shanghai' },
  { id: 10004, name: 'Test4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' }
]);

defineOptions({
  name: 'SelectWorkNumber'
});
</script>

<template>
  <NCard title="歌曲" class="mb-16px">
    <NTabs type="line" animated>
      <NTabPane name="oasis" tab="配料工单号">
        <div class="flex flex-row">
          <!-- 左侧：固定宽度的输入框 -->
          <NFlex vertical class="w-200px pr-10px">
            <NGradientText type="info" size="21">工单号：</NGradientText>
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
            <NButton class="w-100px" type="info">查询</NButton>
            <VxeTable :data="tableData" class="h-auto w-full">
              <VxeColumn type="seq" width="70"></VxeColumn>
              <VxeColumn field="name" title="Name"></VxeColumn>
              <VxeColumn field="sex" title="Sex"></VxeColumn>
              <VxeColumn field="age" title="Age"></VxeColumn>
            </VxeTable>
          </NFlex>
        </div>
      </NTabPane>
      <NTabPane name="the beatles" tab="123">123</NTabPane>

      <NTabPane name="jay chou" tab="456">456</NTabPane>
    </NTabs>
    <template #action></template>
  </NCard>
</template>
