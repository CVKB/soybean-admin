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

    // 左侧表格列配置
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

    // 右侧表格数据
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

    // 点击行事件
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
  <div class="page-container">
    <!-- 左侧表格 -->
    <div class="left-tables">
      <!-- 配料单列表 -->
      <div class="table-container">
        <VxeTable :data="tableData" :columns="columns" border @row-click="handleRowClick">
          <VxeColumn field="orderNumber" title="配料单号" />
          <VxeColumn field="productionLine" title="产线" />
          <VxeColumn field="operator" title="操作人员" />
          <VxeColumn field="date" title="配料日期" />
        </VxeTable>
      </div>

      <!-- 详细信息表格 -->
      <div class="table-container">
        <VxeTable :data="[selectedOrder]" :columns="detailColumns" border>
          <VxeColumn field="CONO" title="单号" />
          <VxeColumn field="Description" title="描述" />
          <VxeColumn field="LineName" title="产线" />
          <VxeColumn field="EmployeeName" title="操作员" />
          <VxeColumn field="CreateDate" title="创建时间" />
        </VxeTable>
      </div>
    </div>

    <!-- 右侧垂直表格 -->
    <div class="right-tables">
      <div v-for="(data, index) in rightTableData" :key="index" class="resizable-table">
        <VxeTable :data="data" :columns="rightColumns" border />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  height: 100vh;
  box-sizing: border-box;
}

.left-tables {
  width: 35%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.right-tables {
  width: 65%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.table-container {
  flex: 1;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background: #fff;
  overflow: hidden;
}

.resizable-table {
  flex: 1;
  resize: vertical;
  overflow: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background: #fff;
}
</style>
