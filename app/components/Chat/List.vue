<script setup lang="ts">
const chatStore = useChatStore();
const chats = chatStore.chats;
</script>

<template>
  <ul>
    <ChatItem v-for="chat in chats" :key="chat.chat_id" :item="chat" />
  </ul>
</template>
