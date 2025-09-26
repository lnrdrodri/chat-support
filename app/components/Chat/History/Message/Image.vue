<script lang="ts" setup>
const props = defineProps<{
  message: string;
  sender: string;
  timestamp: string;
}>();

const chatStore = useChatStore();

const senderIsClient = computed(() => {
  return !["bot_user", chatStore.loggedInUser].includes(props.sender);
});

const senderIsLoggedUser = computed(() => {
  return props.sender === chatStore.loggedInUser;
});
</script>

<template>
  <div
    class="flex flex-col gap-1 px-4 py-2 rounded max-w-[80%] lg:max-w-[50%] min-w-[20%]"
    :class="{
      'justify-self-end bg-sky-800': senderIsLoggedUser,
      'justify-self-start bg-gray-700': senderIsClient,
      'justify-self-end bg-cyan-900': !senderIsClient && !senderIsLoggedUser,
    }"
  >
    <p class="font-bold">{{ props.sender }}</p>
    <img :src="props.message" class="max-w-[100%] object-contain my-4" />
    <span class="text-gray-400 text-xs text-right">
      {{ formatChatTime(props.timestamp) }}
    </span>
  </div>
</template>
