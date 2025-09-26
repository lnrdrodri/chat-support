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
    class="flex flex-col gap-1 px-4 py-2 rounded max-w-[50%] min-w-[20%]"
    :class="{
      'justify-self-end bg-sky-800': senderIsLoggedUser,
      'justify-self-start bg-gray-700': senderIsClient,
      'justify-self-end bg-cyan-900': !senderIsClient && !senderIsLoggedUser,
    }"
  >
    <p class="font-bold">{{ props.sender }}</p>
    <p class="text-gray-300 ml-2 pr-8">{{ props.message }}</p>
    <span class="text-gray-400 text-xs text-right">
      {{ formatChatTime(props.timestamp) }}
    </span>
  </div>
</template>
