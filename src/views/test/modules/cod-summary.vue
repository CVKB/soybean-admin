<script setup lang="ts">
import { ref } from 'vue';
import XEUtils from 'xe-utils';

defineOptions({
  name: 'CodSummary'
});

// 定义数据结构
interface TableRow {
  id: number;
  name: string;
  role: string;
  sex: string;
  date: string;
  age: number;
  amount: number;
  address: string;
  [key: string]: any; // 允许动态字段，解决 column.field 的问题
}

// 过滤选项接口，确保 data 属性为必选
interface FilterOption {
  data?: string;
}

// 过滤项接口，假设你使用 FilterItem
interface FilterItem extends FilterOption {
  data?: string; // 允许可选属性
}

// 使用ref定义数据
const tableRef = ref<any>(null);
const sexList = ref([
  { label: '男', value: '1' },
  { label: '女', value: '0' }
]);
const nameOptions = ref<FilterItem[]>([{ data: '' }]);
const dateOptions = ref<FilterItem[]>([{ data: '' }]);
const sexOptions = ref<FilterItem[]>([{ data: '' }]);
const tableData = ref<TableRow[]>([
  { id: 10002, name: 'Test12', role: 'Test', sex: '1', date: '2021-01-20', age: 22, amount: 666, address: 'Guangzhou' },
  { id: 10007, name: 'Test27', role: 'Test', sex: '1', date: '2021-01-01', age: 29, amount: 2000, address: 'test abc' },
  { id: 10007, name: 'Test27', role: 'Test', sex: '1', date: '2021-01-01', age: 29, amount: 2000, address: 'test abc' },
  { id: 10007, name: 'Test27', role: 'Test', sex: '1', date: '2021-01-01', age: 29, amount: 2000, address: 'test abc' },
  { id: 10007, name: 'Test27', role: 'Test', sex: '1', date: '2021-01-01', age: 29, amount: 2000, address: 'test abc' },
  { id: 10007, name: 'Test27', role: 'Test', sex: '1', date: '2021-01-01', age: 29, amount: 2000, address: 'test abc' },
  { id: 10007, name: 'Test27', role: 'Test', sex: '1', date: '2021-01-01', age: 29, amount: 2000, address: 'test abc' },
  { id: 10007, name: 'Test27', role: 'Test', sex: '1', date: '2021-01-01', age: 29, amount: 2000, address: 'test abc' },
  { id: 10007, name: 'Test27', role: 'Test', sex: '1', date: '2021-01-01', age: 29, amount: 2000, address: 'test abc' },
  { id: 10007, name: 'Test27', role: 'Test', sex: '1', date: '2021-01-01', age: 29, amount: 2000, address: 'test abc' },
  { id: 10007, name: 'Test27', role: 'Test', sex: '1', date: '2021-01-01', age: 29, amount: 2000, address: 'test abc' },
  { id: 10007, name: 'Test27', role: 'Test', sex: '1', date: '2021-01-01', age: 29, amount: 2000, address: 'test abc' },
  { id: 10007, name: 'Test27', role: 'Test', sex: '1', date: '2021-01-01', age: 29, amount: 2000, address: 'test abc' },
  { id: 10007, name: 'Test27', role: 'Test', sex: '1', date: '2021-01-01', age: 29, amount: 2000, address: 'test abc' },
  { id: 10007, name: 'Test27', role: 'Test', sex: '1', date: '2021-01-01', age: 29, amount: 2000, address: 'test abc' },
  { id: 10007, name: 'Test27', role: 'Test', sex: '1', date: '2021-01-01', age: 29, amount: 2000, address: 'test abc' },
  { id: 10007, name: 'Test27', role: 'Test', sex: '1', date: '2021-01-01', age: 29, amount: 2000, address: 'test abc' },
  { id: 10007, name: 'Test27', role: 'Test', sex: '1', date: '2021-01-01', age: 29, amount: 2000, address: 'test abc' },
  { id: 10007, name: 'Test27', role: 'Test', sex: '1', date: '2021-01-01', age: 29, amount: 2000, address: 'test abc' },
  { id: 10007, name: 'Test27', role: 'Test', sex: '1', date: '2021-01-01', age: 29, amount: 2000, address: 'test abc' },
  { id: 10007, name: 'Test27', role: 'Test', sex: '1', date: '2021-01-01', age: 29, amount: 2000, address: 'test abc' }
]);

// 格式化性别
const formatterSex = ({ cellValue }: { cellValue: string }) => {
  const item = sexList.value.find(itemS => itemS.value === cellValue);
  return item ? item.label : '';
};

// 过滤方法
const nameFilterMethod = ({ option, row, column }: { option: FilterItem; row: TableRow; column: any }) => {
  if (option.data) {
    return XEUtils.toValueString(row[column.field as keyof TableRow])
      .toLowerCase()
      .includes(option.data);
  }
  return true;
};

const dateFilterMethod = ({ option, row, column }: { option: FilterItem; row: TableRow; column: any }) => {
  if (option.data) {
    return XEUtils.isDateSame(row[column.field as keyof TableRow], option.data, 'yyyy-MM-dd');
  }
  return true;
};

const sexFilterMethod = ({ option, row, column }: { option: FilterItem; row: TableRow; column: any }) => {
  if (option.data) {
    return row[column.field as keyof TableRow] === option.data;
  }
  return true;
};

// 确认过滤器选项事件
const confirmFilterEvent = (option: FilterItem) => {
  const $table = tableRef.value;
  if ($table) {
    // 设置为选中状态
    $table.updateFilterOptionStatus(option, Boolean(option.data));
    // 修改条件之后，需要手动调用 updateData 处理表格数据
    $table.updateData();
  }
};
</script>

<template>
  <div class="h-full w-full">
    <VxeTable
      ref="tableRef"
      height="100%"
      border
      show-overflow
      stripe
      :filter-config="{ showIcon: false }"
      :data="tableData"
    >
      <VxeColumn type="seq" width="60"></VxeColumn>
      <VxeColgroup title="名字">
        <VxeColumn field="name" :filters="nameOptions" :filter-method="nameFilterMethod">
          <template #header="{ column }">
            <div v-for="(option, index) in column.filters" :key="index">
              <VxeInput v-model="option.data" class="w-full" clearable @change="confirmFilterEvent(option)"></VxeInput>
            </div>
          </template>
        </VxeColumn>
      </VxeColgroup>
      <VxeColgroup title="时间">
        <VxeColumn field="date" :filters="dateOptions" :filter-method="dateFilterMethod">
          <template #header="{ column }">
            <div v-for="(option, index) in column.filters" :key="index">
              <VxeInput
                v-model="option.data"
                type="date"
                placeholder="请选择"
                clearable
                transfer
                class="w-full"
                @change="confirmFilterEvent(option)"
              ></VxeInput>
            </div>
          </template>
        </VxeColumn>
      </VxeColgroup>
      <VxeColgroup title="性别">
        <VxeColumn field="sex" :filters="sexOptions" :filter-method="sexFilterMethod" :formatter="formatterSex">
          <template #header="{ column }">
            <div v-for="(option, index) in column.filters" :key="index">
              <VxeSelect
                v-model="option.data"
                :options="sexList"
                clearable
                class="w-full"
                @change="confirmFilterEvent(option)"
              ></VxeSelect>
            </div>
          </template>
        </VxeColumn>
      </VxeColgroup>
      <VxeColumn field="address" title="地址"></VxeColumn>
    </VxeTable>
  </div>
</template>
