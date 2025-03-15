<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { Icon } from '@iconify/vue';

// 定义组件选项
// - name: 组件名称为 SvgIcon
// - inheritAttrs: 设置为 false，不会自动绑定父组件的非 props 属性到根元素
defineOptions({ name: 'SvgIcon', inheritAttrs: false });

/**
 * Props 属性定义
 *
 * - 支持 Iconify 图标和本地 SVG 图标
 * - 如果同时传递 icon 和 localIcon，则优先渲染 localIcon
 */
interface Props {
  /** Iconify 图标名称 */
  icon?: string;
  /** 本地 SVG 图标名称 */
  localIcon?: string;
}

// 定义组件的 props
const props = defineProps<Props>();

// 获取父组件传递的非 props 属性
const attrs = useAttrs();

// 计算绑定的 class 和 style 属性，确保这些样式可以传递到组件中
const bindAttrs = computed<{ class: string; style: string }>(() => ({
  class: (attrs.class as string) || '', // 如果 attrs 中有 class，使用它；否则为空字符串
  style: (attrs.style as string) || '' // 如果 attrs 中有 style，使用它；否则为空字符串
}));

// 计算本地 SVG 图标的引用 ID
const symbolId = computed(() => {
  // 从环境变量中获取本地图标的前缀
  const { VITE_ICON_LOCAL_PREFIX: prefix } = import.meta.env;

  // 默认的本地图标名称，如果未传递 localIcon 则使用默认值
  const defaultLocalIcon = 'no-icon';

  // 使用 localIcon 或默认图标名称
  const icon = props.localIcon || defaultLocalIcon;

  // 返回完整的符号引用路径，例如 "#prefix-iconName"
  console.log(`#${prefix}-${icon}`);
  return `#${prefix}-${icon}`;
});

// 判断是否优先渲染本地图标
const renderLocalIcon = computed(() => props.localIcon || !props.icon);
</script>

<template>
  <!-- 如果需要渲染本地图标 -->
  <template v-if="renderLocalIcon">
    <svg aria-hidden="true" width="1em" height="1em" v-bind="bindAttrs">
      <!-- 使用 <use> 标签引用本地 SVG 图标 -->
      <use :xlink:href="symbolId" fill="currentColor" />
    </svg>
  </template>

  <!-- 否则渲染 Iconify 图标 -->
  <template v-else>
    <Icon v-if="icon" :icon="icon" v-bind="bindAttrs" />
  </template>
</template>

<style scoped></style>
