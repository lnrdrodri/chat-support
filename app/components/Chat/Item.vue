<script lang="ts" setup>
import type { Chat } from "~/types/chat";
import { formatChatDate } from "~/utils/formats";

const props = defineProps<{
  item: Chat;
}>();

const chatStore = useChatStore();

const clientUser = computed(() => {
  return props.item.participants.filter(
    (p) => ![chatStore.loggedInUser, "bot_user"].includes(p.name)
  )?.[0];
});

const firstLetter = computed(() => {
  return clientUser.value?.name.charAt(0).toUpperCase() || "";
});

const userIsTyping = computed(() => {
  return props.item.participants.filter(
    (p) => p.status === "typing" && p.name !== chatStore.loggedInUser
  )?.[0];
});
</script>
<template>
  <li
    class="flex gap-4 hover:bg-slate-800 duration-150 ease-in px-4 py-5 rounded cursor-pointer overflow-hidden"
    @click="chatStore.setActiveChat(props.item.chat_id)"
  >
    <Avatar :text="firstLetter" :status="clientUser?.status" />
    <div class="flex-1 overflow-hidden">
      <div class="flex items-center justify-between">
        <p class="font-bold text-ellipsis text-nowrap overflow-hidden">
          {{ clientUser?.name }}
        </p>
        <span class="text-gray-400 text-xs shrink-0">
          {{ formatChatDate(props.item.last_message_timestamp) }}
        </span>
      </div>
      <div class="flex items-center justify-between mt-1">
        <p
          class="text-gray-300 text-sm text-ellipsis text-nowrap overflow-hidden"
        >
          {{
            userIsTyping
              ? `${userIsTyping.name} is typing...`
              : props.item.last_message || "No messages yet"
          }}
        </p>
        <Badge
          class="shrink-0"
          :count="props.item.unread_messages || 0"
          size="sm"
        />
      </div>
    </div>
  </li>
</template>
