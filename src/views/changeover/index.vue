<script lang="ts" setup>
import { ref } from 'vue';

// 定义左侧表格数据的类型
interface LeftTableRow {
  id: number;
  orderNumber: string;
  productionLine: string;
  operator: string;
  date: string;
}

// 左侧表格数据
const leftTableData = ref<LeftTableRow[]>([
  { id: 1, orderNumber: 'PLD001', productionLine: 'A线', operator: '张三', date: '2025-01-16' },
  { id: 2, orderNumber: 'PLD002', productionLine: 'B线', operator: '李四', date: '2025-01-15' },
  { id: 3, orderNumber: 'PLD003', productionLine: 'C线', operator: '王五', date: '2025-01-14' }
]);

// 左侧表格的列定义
const leftTableColumns = [
  { key: 'orderNumber', title: '配料单号' },
  { key: 'productionLine', title: '产线' },
  { key: 'operator', title: '操作人员' },
  { key: 'date', title: '配料日期' }
];

// 右侧表格数据的类型
interface RightTableRow {
  id: number;
  itemName: string;
  quantity: number;
  warehouse: string;
  dateAdded: string;
}

// 右侧详细数据
const detailsData: { [key: number]: RightTableRow[] } = {
  1: [
    { id: 1, itemName: '物料A', quantity: 100, warehouse: '仓库1', dateAdded: '2025-01-10' },
    { id: 2, itemName: '物料B', quantity: 50, warehouse: '仓库2', dateAdded: '2025-01-11' }
  ],
  2: [
    { id: 3, itemName: '物料C', quantity: 200, warehouse: '仓库3', dateAdded: '2025-01-12' },
    { id: 4, itemName: '物料D', quantity: 75, warehouse: '仓库4', dateAdded: '2025-01-13' }
  ],
  3: [
    { id: 5, itemName: '物料E', quantity: 150, warehouse: '仓库5', dateAdded: '2025-01-14' },
    { id: 6, itemName: '物料F', quantity: 300, warehouse: '仓库6', dateAdded: '2025-01-15' }
  ]
};

// 当前选中的行数据
const selectedRow = ref<LeftTableRow | null>(null);

// 右侧表格数据
const rightTableData = ref<RightTableRow[]>([]);

// 处理行点击事件
const handleRowClick = (row: LeftTableRow) => {
  selectedRow.value = row;
  rightTableData.value = detailsData[row.id] || []; // 根据 ID 获取详细数据
};
</script>
