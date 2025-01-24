<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import axios from 'axios';
import type { VxeTablePropTypes } from 'vxe-table';
import XEUtils from 'xe-utils';

interface RowVO {
  id: number;
  cono: string;
  description: string;
  lineName: string;
  employeeName: string;
  createDate: string;
  children?: RowVO[];
}

const treeConfig = reactive<VxeTablePropTypes.TreeConfig<RowVO>>({
  transform: true,
  rowField: 'id',
  parentField: 'parentId'
});

const tableData = ref<RowVO[]>([]);
const loading = ref(false); // 定义加载状态
const error = ref<string | null>(null); // 定义错误信息

// 从 API 获取数据
const fetchData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get<RowVO[]>('http://192.168.1.230:8081/ChangeOverInfoList?days=3');
    tableData.value = response.data.map((item, index) => ({
      id: index + 1,
      cono: item.cono,
      description: item.description,
      lineName: item.lineName,
      employeeName: item.employeeName,
      createDate: item.createDate
    }));
  } catch (err) {
    error.value = '加载数据失败，请稍后重试';
    console.error('Error fetching data:', err);
  } finally {
    loading.value = false;
  }
};

// 根据字段分组
const handleGroupByField = (list: RowVO[]) => {
  let idKey = 1; // 用于给每个分组生成唯一的 id
  const result: RowVO[] = []; // 存放分组后的结果

  // 对 list 按 lineName 分组
  XEUtils.each(XEUtils.groupBy(list, 'lineName'), (childList, fieldValue) => {
    result.push({
      id: idKey, // 给每个分组生成唯一的 id
      cono: fieldValue, // 使用分组字段值作为某些字段的值
      description: '',
      lineName: fieldValue, // 赋予分组字段值
      employeeName: '',
      createDate: '',
      children: childList.map((child: any) => ({
        ...child,
        parentId: idKey // 为每个子项添加 parentId
      }))
    });
    idKey += 1; // 递增 id
  });
  console.log(result);
  // 返回树形结构
  return XEUtils.toTreeArray(result, { key: 'id', parentKey: 'parentId', children: 'children' });
};

// 在组件挂载时获取数据并进行分组
onMounted(async () => {
  await fetchData(); // 等待数据获取完成
  tableData.value = handleGroupByField(tableData.value); // 进行分组
});
</script>

<template>
  <div>
    <VxeTable show-overflow border="inner" height="400" :tree-config="treeConfig" :data="tableData" :expand-all="true">
      <!-- 默认展开所有 -->
      <VxeColumn field="cono" title="订单号" tree-node></VxeColumn>
      <VxeColumn field="description" title="描述"></VxeColumn>
      <VxeColumn field="lineName" title="生产线"></VxeColumn>
      <VxeColumn field="employeeName" title="操作员"></VxeColumn>
      <VxeColumn field="createDate" title="创建时间"></VxeColumn>
    </VxeTable>
    <!-- 显示加载和错误信息 -->
    <div v-if="loading">加载中...</div>
    <div v-if="error">{{ error }}</div>
  </div>
</template>
