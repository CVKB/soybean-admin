<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue';
import type { VxeColumnPropTypes, VxeTableInstance } from 'vxe-table';
import axios from 'axios';
import XEUtils from 'xe-utils';

interface ChangeOverInfo {
  id: number;
  parentIID: number | null;
  cono: string;
  description: string | null;
  employeeName: string | null;
  createDate: string | null;
}

const tableRef = ref<VxeTableInstance<ChangeOverInfo>>();
const tableData = ref<ChangeOverInfo[]>([]);
const isCollapsed = ref(false); // 控制折叠状态

// 切换折叠状态
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

// 获取选中行配料单号数据
const getCONOData = () => {
  const $table = tableRef.value;
  if ($table) {
    const currentRecord = $table.getCurrentRecord();
    if (currentRecord) {
      console.log('当前选中行数据:', currentRecord);
    } else {
      console.log('没有选中任何行');
    }
  }
};

const expandAllEvent = () => {
  const $table = tableRef.value;
  if ($table && $table.setAllTreeExpand) {
    $table.setAllTreeExpand(true);
  }
};

// 在组件挂载时获取数据
onMounted(async () => {
  try {
    const response = await axios.get<ChangeOverInfo[]>('http://192.168.1.230:8081/ChangeOverInfoList?days=2');
    tableData.value = response.data;
    // 等待 DOM 更新完成
    await nextTick();
    expandAllEvent();
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
});
interface RowVO {
  id: number;
  name: string;
  role: string;
  sex: string;
  age: number;
  date: string;
  amount: number;
  address: string;
}

const tableRef1 = ref<VxeTableInstance<RowVO>>();

const sexList = ref([
  { label: '男', value: '1' },
  { label: '女', value: '0' }
]);

const nameOptions = ref<VxeColumnPropTypes.Filters>([{ data: '' }]);

const dateOptions = ref<VxeColumnPropTypes.Filters>([{ data: '' }]);

const sexOptions = ref<VxeColumnPropTypes.Filters>([{ data: '' }]);

const tableData1 = ref<RowVO[]>([
  {
    id: 10001,
    name: 'Test10',
    role: 'Develop',
    sex: '0',
    date: '2021-11-14',
    age: 28,
    amount: 888,
    address: 'test abc'
  },
  { id: 10002, name: 'Test12', role: 'Test', sex: '1', date: '2021-01-20', age: 22, amount: 666, address: 'Guangzhou' },
  { id: 10003, name: 'Test34', role: 'PM', sex: '1', date: '2020-09-17', age: 32, amount: 89, address: 'Shanghai' },
  {
    id: 10004,
    name: 'Test24',
    role: 'Designer',
    sex: '0',
    date: '2020-10-25',
    age: 23,
    amount: 1000,
    address: 'test abc'
  },
  {
    id: 10005,
    name: 'Test15',
    role: 'Develop',
    sex: '0',
    date: '2020-12-12',
    age: 30,
    amount: 999,
    address: 'Shanghai'
  },
  {
    id: 10006,
    name: 'Test36',
    role: 'Designer',
    sex: '0',
    date: '2020-08-21',
    age: 21,
    amount: 998,
    address: 'test abc'
  },
  { id: 10007, name: 'Test27', role: 'Test', sex: '1', date: '2021-01-01', age: 29, amount: 2000, address: 'test abc' },
  {
    id: 10008,
    name: 'Test48',
    role: 'Develop',
    sex: '1',
    date: '2021-02-06',
    age: 35,
    amount: 999,
    address: 'test abc'
  }
]);

const formatterSex: VxeColumnPropTypes.Formatter<RowVO> = ({ cellValue }) => {
  const item = sexList.value.find(item => item.value === cellValue);
  return item ? item.label : '';
};

const nameFilterMethod: VxeColumnPropTypes.FilterMethod<RowVO> = ({ option, row, column }) => {
  if (option.data) {
    return XEUtils.toValueString(row[column.field]).toLowerCase().includes(option.data);
  }
  return true;
};

const dateFilterMethod: VxeColumnPropTypes.FilterMethod<RowVO> = ({ option, row, column }) => {
  if (option.data) {
    return XEUtils.isDateSame(row[column.field], option.data, 'yyyy-MM-dd');
  }
  return true;
};

const sexFilterMethod: VxeColumnPropTypes.FilterMethod<RowVO> = ({ option, row, column }) => {
  if (option.data) {
    return row[column.field] === option.data;
  }
  return true;
};

const confirmFilterEvent = (option: { data: any }) => {
  const $table = tableRef1.value;
  if ($table) {
    // 设置为选中状态
    $table.updateFilterOptionStatus(option, Boolean(option.data));
    // 修改条件之后，需要手动调用 updateData 处理表格数据
    $table.updateData();
  }
};
</script>

<template>
  <div>
    <div class="relative flex flex-row">
      <div class="transition-all duration-300 ease-in-out" :class="{ 'w-200px': isCollapsed, 'w-600px': !isCollapsed }">
        <!-- VxeTable 容器 -->
        <div class="relative">
          <VxeTable
            ref="tableRef"
            border
            round
            stripe
            show-overflow
            show-header-overflow
            show-footer-overflow
            :column-config="{ resizable: true }"
            :row-config="{ isCurrent: true, isHover: true }"
            :tree-config="{ transform: true, rowField: 'id', parentField: 'parentIID' }"
            :data="tableData"
            @cell-click="getCONOData()"
          >
            <!-- 配料单号列 -->
            <VxeColumn field="cono" title="配料单号" width="200" tree-node></VxeColumn>
            <!-- 配料时间列 -->
            <VxeColumn field="createDate" title="配料时间" width="160" :visible="!isCollapsed"></VxeColumn>
            <!-- 操作员列 -->
            <VxeColumn field="employeeName" title="操作员" width="80" :visible="!isCollapsed"></VxeColumn>
            <!-- 描述列 -->
            <VxeColumn field="description" title="描述" width="150" :visible="!isCollapsed"></VxeColumn>
          </VxeTable>
          <!-- 折叠按钮 -->
          <NButton
            class="absolute right-9 top-6 translate-x-1/2 transform -translate-y-1/2"
            strong
            secondary
            round
            type="info"
            @click="toggleCollapse"
          >
            {{ isCollapsed ? '展开' : '折叠' }}
          </NButton>
        </div>
      </div>
      <NCard title="配料单号" class="ml-2">
        <NTabs type="line" animated>
          <NTabPane name="123" tab="123">
            <VxeTable ref="tableRef1" border height="300" :filter-config="{ showIcon: false }" :data="tableData1">
              <VxeColumn type="seq" width="60"></VxeColumn>
              <VxeColgroup title="名字">
                <VxeColumn field="name" :filters="nameOptions" :filter-method="nameFilterMethod">
                  <template #header="{ column }">
                    <div v-for="(option, index) in column.filters" :key="index">
                      <VxeInput
                        v-model="option.data"
                        clearable
                        style="width: 100%"
                        @change="confirmFilterEvent(option)"
                      ></VxeInput>
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
                        style="width: 100%"
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
                        style="width: 100%"
                        @change="confirmFilterEvent(option)"
                      ></VxeSelect>
                    </div>
                  </template>
                </VxeColumn>
              </VxeColgroup>
              <VxeColumn field="address" title="地址"></VxeColumn>
            </VxeTable>
          </NTabPane>
          <NTabPane name="456" tab="456">Hey Jude</NTabPane>
          <NTabPane name="789" tab="789">7777</NTabPane>
        </NTabs>
      </NCard>
    </div>
  </div>
</template>

<style scoped>
.vxe-table--render-default .vxe-body--row.row--current {
  background-color: black !important;
  color: white !important;
}
</style>
