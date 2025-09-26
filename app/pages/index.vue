<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from "vue";
import { useChatStore } from "~/stores/chat";
import type { Chat } from "~/types/chat";
import { formatMessage } from "~/utils/formats";

const config = useRuntimeConfig();
const chatStore = useChatStore();
const { chats, activeChatId, activeChatMessages } = toRefs(chatStore);
const { $createSocket } = useNuxtApp();
let sockets: WebSocket[] = [];

const { data: chatsData } = await useFetch<Chat[]>(
  `${config.public.API_URL}/chats`,
  {
    transform: (data): Chat[] => {
      return (
        data.map((chat: any) => ({
          ...chat,
          unread_messages: 0,
          last_message: null,
          last_message_timestamp: null,
          participants: chat.participants.map((p: string) => ({
            name: p == "bot_user" ? "AI Bot" : p,
            status: "offline",
          })),
        })) || []
      );
    },
  }
);

chatStore.setChats(chatsData.value || []);

onMounted(() => {
  activeChatId.value = null;
  chats.value.map((chat, index) => {
    sockets[index] = $createSocket(chat.chat_id);
    sockets[index]?.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);

      if (message.event === "message_received") {
        if (chatStore.activeChatId !== chat.chat_id) {
          chatStore.addUnreadMessage(chat.chat_id);
        } else {
          activeChatMessages.value.push(message.data);
        }
        const msg = formatMessage(
          message.data.content,
          message.data.user_id,
          message.data.type,
          chatStore.loggedInUser
        );
        chatStore.updateLastMessage(chat.chat_id, msg, message.data.timestamp);
      }

      if (message.event === "presence_updated") {
        chatStore.updateParticipantStatus(
          chat.chat_id,
          message.data.user_id,
          message.data.status
        );
      }
    });
  });
});

onBeforeUnmount(() => {
  sockets.forEach((socket) => socket?.close());
});

watch(
  () => chatStore.activeChatId,
  (newChatId) => {
    if (newChatId) {
      chatStore.clearUnreadMessages(newChatId);
    }
  }
);
</script>

<template>
  <div class="flex h-screen w-screen bg-gray-900">
    <ChatContainer />
    <ClientOnly>
      <div
        class="bg-gray-900 text-white flex-1 overflow-y-auto flex h-screen w-screen absolute lg:static lg:z-0 lg:opacity-100"
        :class="{
          'transition-all transition-discrete opacity-0 duration-300 -z-10':
            !activeChatId,
        }"
      >
        <ChatHistory />
      </div>
    </ClientOnly>
  </div>
</template>
