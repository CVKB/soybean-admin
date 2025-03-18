<script setup lang="ts">
import { $t } from '@/locales';

defineOptions({
  name: 'FullScreen'
});

interface Props {
  full?: boolean;
}

defineProps<Props>();
</script>

<template>
  <ButtonIcon :key="String(full)" :tooltip-content="full ? $t('icon.fullscreenExit') : $t('icon.fullscreen')">
    <!-- <icon-local-custom-icon class="text-24px text-red" /> -->
    <icon-local-gridicons-fullscreen-exit v-if="full" />
    <icon-local-gridicons-fullscreen v-else />
  </ButtonIcon>
</template>

<style scoped></style>
