<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue';
import type { VxeTableInstance } from 'vxe-table';
import axios from 'axios';
import { NButton, NTabPane, NTabs } from 'naive-ui';
import CodDetail from './modules/cod-detail.vue';
import CodAccount from './modules/cod-account.vue';
import CodSummary from './modules/cod-summary.vue';

interface ChangeOverInfo {
  id: number;
  parentIID: number | null;
  cono: string;
  description: string | null;
  employeeName: string | null;
  createDate: string | null;
}

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
const isCollapsed = ref(false);

const detailData = ref<Detail[]>([]);
const summaryData = ref<Summary[]>([]);
const accountData = ref<Account[]>([]);
const changeOverHistory = ref<ChangeOverHistory[]>([]);

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

const summaryDataKey = ref(0);
const accountDataKey = ref(0);
const detailDataKey = ref(0);

const getCONOData = async () => {
  const $table = tableRef.value;
  if ($table) {
    const currentRecord = $table.getCurrentRecord();
    if (currentRecord) {
      try {
        const response = await axios.get<ApiResponse>(`http://192.168.1.230:8081/CodData?cono=${currentRecord.cono}`);
        detailData.value = response.data.Detail;
        summaryData.value = response.data.Summary;
        accountData.value = response.data.Account;
        changeOverHistory.value = response.data.ChangeOverHistory;

        // 更新 key 以强制重新渲染子组件
        summaryDataKey.value += 1;
        accountDataKey.value += 1;
        detailDataKey.value += 1;
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
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

onMounted(async () => {
  try {
    const response = await axios.get<ChangeOverInfo[]>('http://192.168.1.230:8081/ChangeOverInfoList?days=5');
    tableData.value = response.data;

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
            @cell-click="getCONOData"
          >
            <VxeColumn field="cono" title="配料单号" width="210" tree-node></VxeColumn>
            <VxeColumn field="createDate" title="配料时间" width="160" :visible="!isCollapsed"></VxeColumn>
            <VxeColumn field="employeeName" title="操作员" width="80" :visible="!isCollapsed"></VxeColumn>
            <VxeColumn field="description" title="描述" width="150" :visible="!isCollapsed"></VxeColumn>
          </VxeTable>
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

      <div class="flex-1 overflow-hidden p-4">
        <NTabs type="line" class="h-full w-full">
          <NTabPane name="tab1" tab="用量" class="h-full w-full">
            <CodSummary :key="summaryDataKey" :detail-data="summaryData" />
          </NTabPane>
          <NTabPane name="tab2" tab="位置" class="h-full w-full">
            <CodAccount :key="accountDataKey" :detail-data="accountData" />
          </NTabPane>
          <NTabPane name="tab3" tab="明细" class="h-full w-full">
            <CodDetail :key="detailDataKey" :detail-data="detailData" />
          </NTabPane>
        </NTabs>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
