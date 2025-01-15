<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';

export default defineComponent({
  setup() {
    // 左侧表格数据
    const tableData = reactive([
      { orderNumber: 'PL001', productionLine: '1号线', operator: '张三', date: '2025-01-14' },
      { orderNumber: 'PL002', productionLine: '2号线', operator: '李四', date: '2025-01-14' },
      { orderNumber: 'PL003', productionLine: '3号线', operator: '王五', date: '2025-01-14' }
    ]);

    const selectedOrder = ref({
      CONO: '',
      Description: '',
      LineName: '',
      EmployeeName: '',
      CreateDate: ''
    });

    const columns = [
      { field: 'orderNumber', title: '配料单号' },
      { field: 'productionLine', title: '产线' },
      { field: 'operator', title: '操作人员' },
      { field: 'date', title: '配料日期' }
    ];

    const detailColumns = [
      { field: 'CONO', title: '单号' },
      { field: 'Description', title: '描述' },
      { field: 'LineName', title: '产线' },
      { field: 'EmployeeName', title: '操作员' },
      { field: 'CreateDate', title: '创建时间' }
    ];

    const rightTableData = reactive([
      [
        { name: 'A1', value: 'Value A1' },
        { name: 'A2', value: 'Value A2' }
      ],
      [
        { name: 'B1', value: 'Value B1' },
        { name: 'B2', value: 'Value B2' }
      ],
      [
        { name: 'C1', value: 'Value C1' },
        { name: 'C2', value: 'Value C2' }
      ]
    ]);

    const rightColumns = [
      { field: 'name', title: '名称' },
      { field: 'value', title: '值' }
    ];

    const handleRowClick = (row: any) => {
      selectedOrder.value = {
        CONO: 'CONO202501148894',
        Description: 'SAP Auto Insert',
        LineName: row.productionLine,
        EmployeeName: row.operator,
        CreateDate: '2025-01-14T13:27:41.47'
      };
    };

    return {
      tableData,
      columns,
      detailColumns,
      selectedOrder,
      rightTableData,
      rightColumns,
      handleRowClick
    };
  }
});
</script>

<template>
  <div class="h-100vh flex overflow-hidden border">
    <!-- 左侧表格 -->
    <div class="w-35% flex flex-col gap-10px">
      <div class="table-container">
        <VxeTable :data="tableData" :columns="columns" border @row-click="handleRowClick">
          <VxeColumn field="orderNumber" title="配料单号" />
          <VxeColumn field="productionLine" title="产线" />
          <VxeColumn field="operator" title="操作人员" />
          <VxeColumn field="date" title="配料日期" />
        </VxeTable>
      </div>
    </div>
    <!-- 右侧垂直滚动表格 -->
    <div class="felx-col w-65% flex gap-10px overflow-auto">
      <div class="table-container">
        <VxeTable :data="tableData" :columns="columns" border @row-click="handleRowClick">
          <VxeColumn field="orderNumber" title="配料单号" />
          <VxeColumn field="productionLine" title="产线" />
          <VxeColumn field="operator" title="操作人员" />
          <VxeColumn field="date" title="配料日期" />
        </VxeTable>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
