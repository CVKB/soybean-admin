<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue';
import type { VxeTableInstance } from 'vxe-table';
import axios from 'axios';
import { NButton, NTabPane, NTabs } from 'naive-ui';
import CodSummary from './modules/cod-summary.vue';

interface ChangeOverInfo {
  id: number;
  parentIID: number | null;
  cono: string;
  description: string | null;
  employeeName: string | null;
  createDate: string | null;
}

// 定义 API 返回的数据结构
interface ChangeOverHistory {
  Step: number;
  CreateDate: string;
  EmployeeName: string;
  Description: string;
}

interface Summary {
  PartNumber: string;
  Requst: number;
  Recommend: number;
  Difference: number;
}

interface Account {
  PartNumber: string;
  Location: string;
  ReelCount: number;
  Quantity: number;
}

interface Detail {
  PartNumber: string;
  ReelID: string;
  Location: string;
  Quantity: number;
  MainPartNumber: string | null;
}

interface ApiResponse {
  ChangeOverHistory: ChangeOverHistory[];
  Summary: Summary[];
  Account: Account[];
  Detail: Detail[];
}

const tableRef = ref<VxeTableInstance<ChangeOverInfo>>();
const tableData = ref<ChangeOverInfo[]>([]);
const isCollapsed = ref(false); // 控制折叠状态

// 定义 ref 数据
const detailData = ref<Detail[]>([]); // 用于传递给子组件的数据
const summaryData = ref<Summary[]>([]); // 汇总数据
const accountData = ref<Account[]>([]); // 账户数据
const changeOverHistory = ref<ChangeOverHistory[]>([]); // 历史数据

// const detailData = ref([]);
// // 切换折叠状态
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
    const response = await axios.get<ChangeOverInfo[]>('http://192.168.1.230:8081/ChangeOverInfoList?days=5');
    tableData.value = response.data;

    const response1 = await axios.get<ApiResponse>('http://192.168.1.230:8081/CodData?cono=CONO202503049273');
    detailData.value = response1.data.Detail; // 设置 detailData
    summaryData.value = response1.data.Summary; // 设置 summaryData
    accountData.value = response1.data.Account; // 设置 accountData
    changeOverHistory.value = response1.data.ChangeOverHistory; // 设置 changeOverHistory

    // 等待 DOM 更新完成
    await nextTick();
    expandAllEvent();
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
});
</script>

<template>
  <div class="h-screen max-w-screen overflow-hidden">
    <div class="relative h-full max-h-full max-w-auto flex flex-row">
      <!-- 左侧表格 -->
      <div class="transition-all duration-300 ease-in-out" :class="{ 'w-210px': isCollapsed, 'w-600px': !isCollapsed }">
        <div class="relative h-full w-auto">
          <VxeTable
            ref="tableRef"
            class="overflow-auto"
            border
            round
            height="100%"
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
            <VxeColumn field="cono" title="配料单号" width="210" tree-node></VxeColumn>
            <VxeColumn field="createDate" title="配料时间" width="160" :visible="!isCollapsed"></VxeColumn>
            <VxeColumn field="employeeName" title="操作员" width="80" :visible="!isCollapsed"></VxeColumn>
            <VxeColumn field="description" title="描述" width="150" :visible="!isCollapsed"></VxeColumn>
          </VxeTable>
          <!-- 折叠按钮 -->
          <NButton
            class="absolute right-13 top-6 translate-x-1/2 transform -translate-y-1/2"
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

      <!-- 右侧 Tabs -->
      <div class="flex-1 overflow-hidden p-4">
        <NTabs type="line" class="h-full w-full">
          <NTabPane name="tab1" tab="用量" class="h-full w-full">
            <VxeTable
              class="h-full w-full"
              border
              round
              height="96%"
              stripe
              show-overflow
              show-header-overflow
              show-footer-overflow
              :column-config="{ resizable: true }"
              :row-config="{ isCurrent: true, isHover: true }"
              :data="tableData"
            >
              <VxeColumn field="cono" title="配料单号" width="200"></VxeColumn>
              <VxeColumn field="createDate" title="配料时间" width="150"></VxeColumn>
              <VxeColumn field="employeeName" title="操作员" width="100"></VxeColumn>
              <VxeColumn field="description" title="描述"></VxeColumn>
            </VxeTable>
          </NTabPane>
          <NTabPane name="tab2" tab="位置" class="h-full w-full">
            <VxeTable
              class="h-full w-full"
              border
              round
              height="96%"
              stripe
              show-overflow
              show-header-overflow
              show-footer-overflow
              :column-config="{ resizable: true }"
              :row-config="{ isCurrent: true, isHover: true }"
              :data="tableData"
            >
              <VxeColumn field="cono" title="配料单号1" width="200"></VxeColumn>
              <VxeColumn field="createDate" title="配料时间" width="150"></VxeColumn>
              <VxeColumn field="employeeName" title="操作员" width="100"></VxeColumn>
              <VxeColumn field="description" title="描述" width="200"></VxeColumn>
            </VxeTable>
          </NTabPane>
          <NTabPane name="tab3" tab="明细" class="h-full w-full">
            <!-- 传递 detailData 给 CodSummary 组件 -->
            <CodSummary :detail-data="detailData" />
          </NTabPane>
        </NTabs>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
