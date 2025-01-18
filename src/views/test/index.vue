<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import type { VxeTableEvents } from 'vxe-table';
import dayjs from 'dayjs'; // 用于日期格式化

interface RowVO {
  cono: string;
  description: string;
  lineName: string;
  employeeName: string;
  createDate: string;
}

const tableData = ref<RowVO[]>([]);

// 获取数据并更新表格
const fetchData = async () => {
  try {
    const response = await axios.get('http://192.168.1.230:8081/ChangeOverInfoList?days=2');
    tableData.value = response.data.map((item: RowVO) => ({
      ...item,
      createDate: dayjs(item.createDate).format('YYYY-MM-DD') // 格式化日期
    }));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

onMounted(() => {
  fetchData();
});

const cellClickEvent: VxeTableEvents.CellClick<RowVO> = ({ row, column }) => {
  console.log(`单击行：${row.cono} 单击列：${column.title}`);
};
</script>

<template>
  <div class="bottom-0 left-0 top-0 z-10 w-[50%] overflow-y-auto">
    <VxeTable
      border
      round
      stripe
      :mouse-config="{ selected: true }"
      :column-config="{ resizable: true }"
      :data="tableData"
      :row-config="{ isCurrent: true, isHover: true }"
      @cell-click="cellClickEvent"
    >
      <!-- Description 列内容截断 -->
      <VxeColumn field="lineName" title="产线" width="60"></VxeColumn>
      <VxeColumn field="cono" title="配料单号" width="160"></VxeColumn>
      <VxeColumn field="employeeName" title="操作员" width="60" show-overflow></VxeColumn>
      <VxeColumn field="createDate" title="创建时间" width="100" show-overflow></VxeColumn>
      <VxeColumn field="description" title="描述" show-overflow></VxeColumn>
    </VxeTable>
  </div>
</template>
