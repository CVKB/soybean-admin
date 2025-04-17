<script setup lang="ts">
import { ref } from 'vue';
import { getWorkOrderInfos } from '@/service/api';

const data = ref<WorkOrderInfo[]>();

interface WorkOrderInfo {
  WorkOrderNO: string;
  ProductName: string;
  CreateDate: string;
  Remark: string;
}

// 查询按钮点击处理函数
const handleQuery = async () => {
  const workorders = ['410002032426', '410002040082']; // 这里是示例数据，可以根据实际需求调整
  try {
    // 请求数据
    const response = await getWorkOrderInfos(workorders);
    console.log(response);
  } catch (error) {
    console.error('请求失败:', error);
  }
};

defineOptions({
  name: 'SelectWorkNumber'
});
</script>

<template>
  <div class="flex flex-row">
    <!-- 左侧：固定宽度的输入框 -->
    <NFlex vertical class="w-200px pr-10px">
      <NGradientText type="info" size="21">工单号↓</NGradientText>
      <NInput
        class="h-500px w-full"
        type="textarea"
        placeholder="输入工单号"
        :autosize="{
          maxRows: 20
        }"
      ></NInput>
    </NFlex>

    <!-- 右侧：占满剩余宽度的表格 -->
    <NFlex vertical class="flex-1">
      <NButton class="w-100px text-14px" type="info" @click="handleQuery">查询</NButton>

      <!-- 第一个表格：显示 WorkOrderInfos -->
      <VxeTable :data="data" class="h-full w-full">
        <VxeColumn type="seq" width="70"></VxeColumn>
        <VxeColumn field="workOrderNO" title="工单号"></VxeColumn>
        <VxeColumn field="productName" title="产品名"></VxeColumn>
        <VxeColumn field="createDate" title="创建时间"></VxeColumn>
        <VxeColumn field="remark" title="客户"></VxeColumn>
      </VxeTable>

      <!-- 第二个表格：显示 WorkOrderDetails -->
      <VxeTable :data="data" class="mt-20 h-full w-full">
        <VxeColumn type="seq" width="70"></VxeColumn>
        <VxeColumn field="detailName" title="Detail Name"></VxeColumn>
        <VxeColumn field="quantity" title="Quantity"></VxeColumn>
        <VxeColumn field="status" title="Status"></VxeColumn>
      </VxeTable>
    </NFlex>
  </div>
</template>
