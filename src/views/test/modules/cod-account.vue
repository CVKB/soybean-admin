<script setup lang="ts">
import { ref } from 'vue';
import type { VxeTablePropTypes } from 'vxe-table';
import XEUtils from 'xe-utils';

defineOptions({
  name: 'CodAccount'
});

interface AccountItem {
  PartNumber: string;
  Location: string;
  Quantity: number;
  ReelCount: number;
}

const props = defineProps<{
  detailData: AccountItem[];
}>();

// 定义表格数据结构
interface TableRow {
  PartNumber: string;
  Location: string;
  Quantity: number;
  ReelCount: number;
}

// 使用 props.detailData 初始化表格数据
const tableData = ref<TableRow[]>(props.detailData);

// 过滤选项接口，确保 data 属性为必选
interface FilterOption {
  data?: string;
}

// 过滤项接口，假设你使用 FilterItem
interface FilterItem extends FilterOption {
  data?: string; // 允许可选属性
}

// 使用ref定义数据
const tableRef = ref<any>(null);
const nameOptions = ref<FilterItem[]>([{ data: '' }]);

// 过滤方法
const nameFilterMethod = ({ option, row, column }: { option: FilterItem; row: TableRow; column: any }) => {
  if (option.data) {
    return XEUtils.toValueString(row[column.field as keyof TableRow])
      .toLowerCase()
      .includes(option.data.toLowerCase()); // 确保过滤器不区分大小写
  }
  return true;
};

// 确认过滤器选项事件
const confirmFilterEvent = (option: FilterItem) => {
  const $table = tableRef.value;
  if ($table) {
    // 设置为选中状态
    $table.updateFilterOptionStatus(option, Boolean(option.data));
    // 修改条件之后，需要手动调用 updateData 处理表格数据
    $table.updateData();
  }
};
const sortConfig = ref<VxeTablePropTypes.SortConfig<TableRow>>({
  trigger: 'cell',
  allowBtn: false,
  orders: ['asc', 'desc'],
  defaultSort: {
    field: 'PartNumber',
    order: 'asc'
  }
});
</script>

<template>
  <div class="h-full w-full">
    <VxeTable
      ref="tableRef"
      height="92%"
      border
      show-overflow
      stripe
      :filter-config="{ showIcon: false }"
      :data="tableData"
      :sort-config="sortConfig"
      :column-config="{ resizable: true }"
    >
      <VxeColgroup title="料号">
        <VxeColumn field="PartNumber" :filters="nameOptions" :filter-method="nameFilterMethod" sortable>
          <template #header="{ column }">
            <div v-for="(option, index) in column.filters" :key="index">
              <VxeInput
                v-model="option.data"
                class="w-full"
                clearable
                @change="confirmFilterEvent(option)"
                @click.stop
              ></VxeInput>
            </div>
          </template>
        </VxeColumn>
      </VxeColgroup>
      <VxeColgroup title="储位">
        <VxeColumn field="Location" :filters="nameOptions" :filter-method="nameFilterMethod" sortable>
          <template #header="{ column }">
            <div v-for="(option, index) in column.filters" :key="index">
              <VxeInput
                v-model="option.data"
                class="w-full"
                clearable
                @change="confirmFilterEvent(option)"
                @click.stop
              ></VxeInput>
            </div>
          </template>
        </VxeColumn>
      </VxeColgroup>
      <VxeColgroup title="数量">
        <VxeColumn field="Quantity" :filters="nameOptions" :filter-method="nameFilterMethod" sortable>
          <template #header="{ column }">
            <div v-for="(option, index) in column.filters" :key="index">
              <VxeInput
                v-model="option.data"
                class="w-full"
                clearable
                @change="confirmFilterEvent(option)"
                @click.stop
              ></VxeInput>
            </div>
          </template>
        </VxeColumn>
      </VxeColgroup>
      <VxeColgroup title="卷数">
        <VxeColumn field="ReelCount" :filters="nameOptions" :filter-method="nameFilterMethod" sortable>
          <template #header="{ column }">
            <div v-for="(option, index) in column.filters" :key="index">
              <VxeInput
                v-model="option.data"
                class="w-full"
                clearable
                @change="confirmFilterEvent(option)"
                @click.stop
              ></VxeInput>
            </div>
          </template>
        </VxeColumn>
      </VxeColgroup>
    </VxeTable>
  </div>
</template>
