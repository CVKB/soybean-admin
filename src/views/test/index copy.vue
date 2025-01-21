<script lang="ts" setup>
import { reactive, ref } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';
import XEUtils from 'xe-utils';
import type { VxeTableInstance } from 'vxe-table';

interface RowVO {
  id: string;
  lineName: string;
  cono: string;
  description: string;
  employeeName: string;
  createDate: string;
  parentId?: number; // 用于树形结构
  children?: RowVO[];
  expand?: boolean; // 用于控制节点是否默认展开
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
      expand: true, // 默认展开组
      children: sortData(childList) // 对子节点按 lineName 和 cono 排序
    });
  });
  return XEUtils.toTreeArray(result, { key: 'id', parentKey: 'parentId', children: 'children' });
};

// 分组并默认展开
const listToGroup = (groupField?: string) => {
  if (groupField) {
    treeConfig.transform = true;
    tableData.value = handleGroupByField(sortData(allList.value), groupField);
  } else {
    treeConfig.transform = false;
    tableData.value = sortData(allList.value);
  }
};

// 声明 tableRef 引用
const tableRef = ref<VxeTableInstance<RowVO>>();

// 获取数据并默认分组
const fetchData = async () => {
  try {
    const response = await axios.get('http://192.168.1.230:8081/ChangeOverInfoList?days=2');
    allList.value = response.data.map((item: RowVO) => ({
      ...item,
      createDate: dayjs(item.createDate).format('YYYY-MM-DD') // 格式化日期
    }));
    listToGroup('lineName'); // 默认按 lineName 分组并展开
    const $table = tableRef.value;
    if ($table) {
      // 默认展开所有树形节点
      $table.setAllTreeExpand(true);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// 控制树展开和收起的事件
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

// 初始化数据
fetchData();
</script>

<template>
  <div>
    <p>
      <VxeButton @click="expandAllTreeEvent">展开所有树</VxeButton>
      <VxeButton @click="claseExpandTreeEvent">关闭所有树展开</VxeButton>
      <VxeButton @click="expandAllRowEvent">展开所有行</VxeButton>
      <VxeButton @click="clearExpandRowEvent">关闭所有行展开</VxeButton>
    </p>
    <VxeTable show-overflow border="inner" height="400" :tree-config="treeConfig" :data="tableData">
      <VxeColumn field="lineName" title="产线" tree-node></VxeColumn>
      <VxeColumn field="cono" title="配料单号"></VxeColumn>
      <VxeColumn field="description" title="描述"></VxeColumn>
      <VxeColumn field="employeeName" title="操作员"></VxeColumn>
      <VxeColumn field="createDate" title="创建时间"></VxeColumn>
    </VxeTable>
  </div>
</template>
