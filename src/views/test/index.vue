<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue';
import type { VxeTableInstance } from 'vxe-table';
import axios from 'axios';
import CodSummary from './modules/cod-summary.vue';
import TestAda from './modules/test.vue';

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
    const response = await axios.get<ChangeOverInfo[]>('http://192.168.1.230:8081/ChangeOverInfoList?days=5');
    tableData.value = response.data;
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
      <div class="transition-all duration-300 ease-in-out" :class="{ 'w-210px': isCollapsed, 'w-600px': !isCollapsed }">
        <!-- 左侧表格 -->
        <div class="relative h-full">
          <VxeTable
            ref="tableRef"
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
      <!-- 右侧 NCard -->
      <NCard title="配料单号" class="ml-2 h-full max-h-full min-w-0 flex-shrink flex-grow overflow-hidden">
        <NTabs type="line" animated>
          <NTabPane class="h-full w-full overflow-auto" name="123" tab="123">
            <CodSummary />
          </NTabPane>
          <NTabPane class="h-full w-full overflow-auto" name="456" tab="456">
            <TestAda />
          </NTabPane>
          <NTabPane class="h-full w-full overflow-auto" name="789" tab="789"></NTabPane>
        </NTabs>
      </NCard>
    </div>
  </div>
</template>
