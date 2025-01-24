<script lang="ts" setup>
import { ref } from 'vue';
import axios from 'axios';
import type { VxeTableInstance } from 'vxe-table';

// 定义 RowVO 类型
interface RowVO {
  cono: string;
  description: string;
  lineName: string;
  employeeName: string;
  createDate: string;
}

// 定义树形结构类型
interface TreeNode extends RowVO {
  children?: TreeNode[];
  id?: string;
  parentId?: string | null;
}

const tableRef = ref<VxeTableInstance>();

const tableData = ref<TreeNode[]>([]); // 表格数据
const loading = ref(false); // 加载状态
const error = ref<string | null>(null); // 错误信息

// 获取数据
const fetchData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get<RowVO[]>('http://192.168.1.230:8081/ChangeOverInfoList?days=3');
    tableData.value = response.data;
  } catch (err) {
    error.value = '加载数据失败，请稍后重试';
    console.error('Error fetching data:', err);
  } finally {
    loading.value = false;
  }
};

// 初始化数据
fetchData();

// 操作树节点展开
const expandAllTreeEvent = () => {
  const $table = tableRef.value;
  if ($table) {
    $table.setAllTreeExpand(true);
  }
};

const claseExpandTreeEvent = () => {
  const $table = tableRef.value;
  if ($table) {
    $table.clearTreeExpand();
  }
};
</script>

<template>
  <div>
    <p v-if="loading">加载中...</p>
    <p v-if="error">{{ error }}</p>
    <div v-else>
      <p>
        <VxeButton @click="expandAllTreeEvent">展开所有树</VxeButton>
        <VxeButton @click="claseExpandTreeEvent">关闭所有树展开</VxeButton>
      </p>
      <VxeTable
        ref="tableRef"
        border
        :column-config="{ resizable: true }"
        :tree-config="{ transform: true }"
        :data="tableData"
      >
        <VxeColumn field="lineName" title="产线" tree-node></VxeColumn>
        <VxeColumn field="cono" title="配料单号"></VxeColumn>
        <VxeColumn field="description" title="描述"></VxeColumn>
        <VxeColumn field="employeeName" title="操作员"></VxeColumn>
        <VxeColumn field="createDate" title="创建时间"></VxeColumn>
      </VxeTable>
    </div>
  </div>
</template>
