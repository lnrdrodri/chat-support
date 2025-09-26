<script setup lang="ts">
const props = defineProps<{
  count: number;
  size?: "sm" | "md" | "lg";
}>();
</script>

<template>
  <span
    v-if="props.count > 0"
    class="bg-cyan-700 rounded-[50%] flex items-center justify-center"
    :class="{
      'h-5 w-5 text-xs': props.size === 'sm',
      'h-6 w-6 text-sm': props.size === 'md',
      'h-8 w-8 text-lg': props.size === 'lg',
    }"
  >
    {{ props.count }}
  </span>
</template>
