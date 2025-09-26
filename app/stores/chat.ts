import { defineStore } from "pinia";
import type { Chat } from "~/types/chat";
import type { Message } from "~/types/message";

export const useChatStore = defineStore(
  "chat",
  () => {
    const loggedInUser = ref<string>("agent_leonardo");
    const chats = ref<Array<Chat>>([]);
    const activeChatId = ref<string | null>(null);
    const activeChatMessages = ref<Array<Message>>([]);

    const unreadChatsCount = computed(() => {
      return chats.value.filter((chat) => chat.unread_messages > 0).length;
    });

    const activeChat = computed(() => {
      if (!activeChatId.value) return null;
      return getChatById(activeChatId.value);
    });

    function setChats(newChats: Array<Chat>) {
      chats.value = newChats;
    }

    function setActiveChat(chat_id: string | null) {
      activeChatId.value = chat_id;
    }

    function clearUnreadMessages(chatId: string) {
      const index = chats.value.findIndex((c) => c.chat_id === chatId);
      if (index === -1) return;

      if (!chats.value[index]) return;

      chats.value[index].unread_messages = 0;
    }

    function addUnreadMessage(chatId: string) {
      const chat = getChatById(chatId);
      if (!chat) return;

      chat.unread_messages = chat.unread_messages + 1;
    }

    function updateLastMessage(
      chatId: string,
      message: string,
      timestamp: string
    ) {
      const chat = getChatById(chatId);
      if (!chat) return;

      chat.last_message = message;
      chat.last_message_timestamp = timestamp;
    }

    function updateParticipantStatus(
      chat_id: string,
      user_id: string,
      status: "online" | "offline" | "typing"
    ) {
      const chat = getChatById(chat_id);
      if (!chat) return;
      const participant = chat.participants.find((p) => p.name === user_id);
      if (!participant) return;
      participant.status = status;
    }

    function getChatById(chatId: string) {
      return chats.value.find((c) => c.chat_id === chatId) || null;
    }

    return {
      chats,
      setChats,
      activeChatId,
      activeChat,
      setActiveChat,
      addUnreadMessage,
      unreadChatsCount,
      updateLastMessage,
      clearUnreadMessages,
      loggedInUser,
      updateParticipantStatus,
      activeChatMessages,
    };
  },
  {
    persist: true,
  }
);
