<script lang="ts" setup>
import { ref } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';
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
  children?: TreeNode[]; // children 属性，包含 TreeNode 类型的子项
  id?: string; // 添加 id 字段
  parentId?: string | null; // 添加 parentId 字段，根节点 parentId 为 null
}

const tableRef = ref<VxeTableInstance>();

const tableData = ref<TreeNode[]>([]); // tableData 类型为 TreeNode 数组

// 按照 lineName 分组，将数据组织为树形结构
const groupByLineName = (data: RowVO[]): TreeNode[] => {
  const groupedData: TreeNode[] = [];
  const lineNames: Set<string> = new Set();

  // 按 lineName 对数据进行分组
  const grouped = data.reduce(
    (acc, item) => {
      if (!acc[item.lineName]) {
        acc[item.lineName] = [];
      }
      acc[item.lineName].push(item);
      lineNames.add(item.lineName); // 收集所有的 lineName
      return acc;
    },
    {} as Record<string, RowVO[]>
  );

  // 遍历分组数据，构建树结构
  for (const lineName in grouped) {
    if (Object.hasOwn(grouped, lineName)) {
      // 获取当前 lineName 下的数据
      const lineItems = grouped[lineName];

      // 根节点 (lineName)
      const rootNode: TreeNode = {
        lineName,
        cono: '', // 根节点的 cono 没有实际值
        description: '', // 根节点的 description 没有实际值
        employeeName: '', // 根节点的 employeeName 没有实际值
        createDate: '', // 根节点的 createDate 没有实际值
        id: lineName, // 使用 lineName 作为根节点的 id
        parentId: null, // 根节点的 parentId 为 null
        children: lineItems.map(item => ({
          ...item,
          createDate: dayjs(item.createDate).format('YYYY-MM-DD'), // 格式化日期
          id: item.cono, // 使用 cono 作为子节点的 id
          parentId: lineName // 子节点的 parentId 为父节点的 lineName
        }))
      };
      groupedData.push(rootNode);
    }
  }

  return groupedData;
};

// 获取数据
const fetchData = async () => {
  try {
    const response = await axios.get('http://192.168.1.230:8081/ChangeOverInfoList?days=2');
    tableData.value = groupByLineName(response.data); // 获取并处理数据
  } catch (error) {
    console.error('Error fetching data:', error);
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

const expandAllRowEvent = () => {
  const $table = tableRef.value;
  if ($table) {
    $table.setAllRowExpand(true);
  }
};

const clearExpandRowEvent = () => {
  const $table = tableRef.value;
  if ($table) {
    $table.clearRowExpand();
  }
};
</script>

<template>
  <div>
    <p>
      <VxeButton @click="expandAllTreeEvent">展开所有树</VxeButton>
      <VxeButton @click="claseExpandTreeEvent">关闭所有树展开</VxeButton>
      <VxeButton @click="expandAllRowEvent">展开所有行</VxeButton>
      <VxeButton @click="clearExpandRowEvent">关闭所有行展开</VxeButton>
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
</template>
