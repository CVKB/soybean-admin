<script lang="ts" setup>
import { ref } from 'vue';
import SelectWorkNumber from './modules/selectWorkNumber.vue';

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

const cono = ref('CONO202503169432');
const values = ref(null);
const options = [
  {
    label: 'Line1',
    value: 'Line1'
  },
  {
    label: 'Line2',
    value: 'Line2'
  },
  {
    label: 'Line3',
    value: 'Line3'
  },
  {
    label: 'Line4',
    value: 'Line4'
  },
  {
    label: 'Line5',
    value: 'Line5'
  },
  {
    label: 'Line6',
    value: 'Line6'
  },
  {
    label: 'Line7',
    value: 'Line7'
  },
  {
    label: 'Wait',
    value: 'Wait'
  }
];
const showModal1 = ref(false);
</script>

<template>
  <div>
    <div class="flex flex-row gap-10px">
      <NSpace vertical class="w-60">
        <NInput v-model:value="cono" readonly="true" placeholder="">
          <template #prefix>
            <NGradientText type="info">配料单号</NGradientText>
          </template>
          <template #password-invisible-icon></template>
          <template #password-visible-icon></template>
        </NInput>
        <!-- 下拉选择框 -->
        <NSelect v-model:value="values" filterable :clearable="true" placeholder="选择产线" :options="options" />
      </NSpace>
      <NInput type="textarea" autosize class="ml-10px max-w-300px">
        <template #prefix>
          <NGradientText type="info">描述</NGradientText>
        </template>
        <template #password-invisible-icon></template>
        <template #clear-icon></template>
      </NInput>
      <NButton class="ml-10px" type="primary" @click="showModal1 = !showModal1">选择料表</NButton>
      <div class="ml-10px flex flex-col gap-10px">
        <NButton>预览</NButton>
        <NButton :disabled="true">执行</NButton>
      </div>
    </div>
    <VxeTable border :data="tableData">
      <VxeColumn field="name" title="Name"></VxeColumn>
      <VxeColumn field="sex" title="Sex"></VxeColumn>
      <VxeColumn field="age" title="Age"></VxeColumn>
      <VxeColumn field="address" title="Address" :visible="false"></VxeColumn>
    </VxeTable>
    <NModal
      v-model:show="showModal1"
      display-directive="show"
      title="选择料表"
      preset="card"
      draggable
      class="h-80% max-h-80% max-w-90% w-80%"
    >
      <SelectWorkNumber></SelectWorkNumber>
    </NModal>
  </div>
</template>
