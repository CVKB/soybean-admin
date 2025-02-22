<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue';
import type { VxeTableInstance } from 'vxe-table';
import axios from 'axios';

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
  if ($table) {
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
</script>

<template>
  <div class="flex flex-row">
    <!-- VxeTable 组件 -->
    <div
      class="transition-all duration-300 ease-in-out"
      :class="{ 'w-200px overflow-hidden': isCollapsed, 'w-600px': !isCollapsed }"
    >
      <VxeTable
        ref="tableRef"
        border
        round
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
        <VxeColumn field="createDate" title="配料时间" width="160"></VxeColumn>
        <VxeColumn field="employeeName" title="操作员" width="80"></VxeColumn>
        <VxeColumn field="description" title="描述"></VxeColumn>
      </VxeTable>
    </div>
    <!-- 折叠按钮 -->
    <NButton class="left-5px" strong secondary round type="info" @click="toggleCollapse">
      {{ isCollapsed ? '展开' : '折叠' }}
    </NButton>
  </div>
</template>

<style scoped>
.row--current {
  background-color: black !important;
  color: white !important;
}
</style>
