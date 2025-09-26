<script lang="ts" setup>
const props = defineProps<{
  text: string;
  status?: "online" | "offline" | "typing" | null | undefined;
}>();
</script>

<template>
  <span
    class="h-12 w-12 shrink-0 flex items-center justify-center rounded-[50%] font-bold bg-cyan-700 border border-cyan-950 text-white relative"
  >
    {{ props.text }}
    <span
      v-if="props.status"
      class="absolute bottom-0 right-0 rounded-[50%] h-3 w-3"
      :class="{
        'bg-green-500': props.status === 'online',
        'bg-red-500': props.status === 'offline',
        'bg-green-500 animate-pulse': props.status === 'typing',
      }"
      :title="props.status"
    />
  </span>
</template>
