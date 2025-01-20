<script lang="ts" setup>
import { reactive, ref } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';
import XEUtils from 'xe-utils';

interface RowVO {
  id: number;
  lineName: string;
  cono: string;
  description: string;
  employeeName: string;
  createDate: string;
  parentId?: number; // 用于树形结构
  children?: RowVO[];
}

const treeConfig = reactive({
  transform: true, // 开启树形结构转换
  rowField: 'id',
  parentField: 'parentId'
});

const allList = ref<RowVO[]>([]);
const tableData = ref<RowVO[]>([]);

// 对列表按 lineName 和 cono 排序
const sortData = (list: RowVO[]): RowVO[] => {
  return XEUtils.sortBy(list, ['lineName', 'cono']);
};

// 根据分组字段处理数据
const handleGroupByField = (list: RowVO[], groupField: string): RowVO[] => {
  const result: RowVO[] = [];
  XEUtils.each(XEUtils.groupBy(list, groupField), (childList, field) => {
    result.push({
      id: XEUtils.uniqueId(),
      lineName: field,
      cono: '',
      description: '',
      employeeName: '',
      createDate: '',
      children: sortData(childList) // 对子节点按 lineName 和 cono 排序
    });
  });
  return XEUtils.toTreeArray(result, { key: 'id', parentKey: 'parentId', children: 'children' });
};

// 展开所有行并排序
const listToGroup = (groupField?: string) => {
  if (groupField) {
    treeConfig.transform = true;
    tableData.value = handleGroupByField(sortData(allList.value), groupField);
  } else {
    treeConfig.transform = false;
    tableData.value = sortData(allList.value);
  }
};

// 获取数据并默认分组
const fetchData = async () => {
  try {
    const response = await axios.get('http://192.168.1.230:8081/ChangeOverInfoList?days=2');
    allList.value = response.data.map((item: RowVO) => ({
      ...item,
      createDate: dayjs(item.createDate).format('YYYY-MM-DD') // 格式化日期
    }));
    listToGroup('lineName'); // 默认按 lineName 分组
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// 初始化数据
fetchData();
</script>

<template>
  <div>
    <VxeButton status="primary" @click="listToGroup()">展开所有数据</VxeButton>
    <VxeButton status="primary" @click="listToGroup('lineName')">按产线分组</VxeButton>
    <VxeTable show-overflow border="inner" height="400" :tree-config="treeConfig" :data="tableData">
      <VxeColumn field="lineName" title="产线" tree-node></VxeColumn>
      <VxeColumn field="cono" title="配料单号"></VxeColumn>
      <VxeColumn field="description" title="描述"></VxeColumn>
      <VxeColumn field="employeeName" title="操作员"></VxeColumn>
      <VxeColumn field="createDate" title="创建时间"></VxeColumn>
    </VxeTable>
  </div>
</template>
