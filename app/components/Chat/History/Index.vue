<script lang="ts" setup>
import { computed } from "vue";
import { useChatStore } from "~/stores/chat";
import type { Message } from "~/types/message";
import { formatMessage } from "~/utils/formats";

import ChatHistoryMessageText from "@/components/Chat/History/Message/Text.vue";
import ChatHistoryMessageImage from "@/components/Chat/History/Message/Image.vue";
import ChatHistoryMessageAudio from "@/components/Chat/History/Message/Audio.vue";

const config = useRuntimeConfig();
const chatStore = useChatStore();
const { activeChatId, activeChat, activeChatMessages } = toRefs(chatStore);

const isLoading = ref(false);
const isSending = ref(false);
const newMessage = ref("");
const messagesContainer = ref<HTMLElement | null>(null);
const names: any = {
  bot_user: "AI Bot",
  agent_leonardo: "You",
};
const messageComponents = {
  text: ChatHistoryMessageText,
  image: ChatHistoryMessageImage,
  audio: ChatHistoryMessageAudio,
};

const firstLetter = computed(() => {
  return clientUser.value?.name.charAt(0).toUpperCase() || "";
});

const clientUser = computed(() => {
  return activeChat.value?.participants.filter(
    (p) => ![chatStore.loggedInUser, "bot_user"].includes(p.name)
  )?.[0];
});

const hasActiveChat = computed(() => {
  return !!activeChatId.value;
});

const userIsTyping = computed(() => {
  return activeChat.value?.participants.filter(
    (p) => p.status === "typing" && p.name !== chatStore.loggedInUser
  )?.[0];
});

async function sendMessage() {
  try {
    if (!newMessage.value.trim()) {
      return;
    }

    isSending.value = true;

    const payload = {
      user_id: chatStore.loggedInUser,
      type: "text",
      content: newMessage.value.trim(),
    };

    const res: any = await $fetch(
      `${config.public.API_URL}/chats/${activeChatId.value}/messages`,
      {
        method: "POST",
        body: payload,
      }
    );
    if (res.status !== "message_sent")
      throw new Error("Error on send your message. (API)");
    newMessage.value = "";
  } catch (e: Error | any) {
    const error = e?.message || "Failed to send message.";
    alert(error);
  } finally {
    isSending.value = false;
  }
}

function waitForMediaLoaded(el: HTMLElement | null, timeout = 800) {
  if (!el) return Promise.resolve();
  const imgs = Array.from(el.querySelectorAll("img")) as HTMLImageElement[];
  const audios = Array.from(el.querySelectorAll("audio")) as HTMLMediaElement[];

  const imgPromises = imgs.map((img) => {
    if (img.complete) return Promise.resolve();
    return new Promise<void>((res) => {
      const onLoad = () => {
        img.removeEventListener("load", onLoad);
        res();
      };
      const onErr = () => {
        img.removeEventListener("error", onErr);
        res();
      };
      img.addEventListener("load", onLoad);
      img.addEventListener("error", onErr);
    });
  });

  const audioPromises = audios.map((a) => {
    if (a.readyState >= 1) return Promise.resolve();
    return new Promise<void>((res) => {
      const onMeta = () => {
        a.removeEventListener("loadedmetadata", onMeta);
        res();
      };
      const onErr = () => {
        a.removeEventListener("error", onErr);
        res();
      };
      a.addEventListener("loadedmetadata", onMeta);
      a.addEventListener("error", onErr);
    });
  });

  const all = [...imgPromises, ...audioPromises];
  if (all.length === 0) return Promise.resolve();
  return Promise.race([
    Promise.all(all),
    new Promise((res) => setTimeout(res, timeout)), // fallback
  ]);
}

async function scrollToBottom() {
  await nextTick();
  await new Promise(requestAnimationFrame);
  await waitForMediaLoaded(messagesContainer.value);

  if (messagesContainer.value) {
    const onScroll = () => {
      if (!messagesContainer.value) return;

      const target =
        messagesContainer.value.scrollHeight -
        messagesContainer.value.clientHeight;

      if (Math.abs(messagesContainer.value.scrollTop - target) <= 2) {
        isLoading.value = false;
        messagesContainer.value.removeEventListener("scroll", onScroll);
      }
    };

    messagesContainer.value.addEventListener("scroll", onScroll);
    messagesContainer.value.scrollTo({
      top: messagesContainer.value.scrollHeight,
      behavior: "smooth",
    });
  }
}

watch(
  () => activeChatId.value,
  async (newChatId) => {
    if (newChatId) {
      isLoading.value = true;
      const res = await $fetch<Message[]>(
        `${config.public.API_URL}/chats/${newChatId}/messages`
      );
      const last_message = res[res.length - 1];
      if (last_message) {
        const msg = formatMessage(
          last_message.content,
          last_message.user_id,
          last_message.type,
          chatStore.loggedInUser
        );
        chatStore.updateLastMessage(newChatId, msg, last_message.timestamp);
      }
      activeChatMessages.value = res;
    }
  }
);
watch(
  () => [activeChatMessages.value.length, userIsTyping.value],
  async () => {
    await scrollToBottom();
  }
);
</script>

<template>
  <div
    v-if="hasActiveChat"
    class="flex flex-col h-full w-full absolute lg:relative"
  >
    <div class="flex items-center gap-4 border-b border-gray-800 p-4">
      <Avatar :text="firstLetter" :status="clientUser?.status" />
      <div>
        <h1 class="text-2xl font-bold">
          {{ clientUser?.name }}
        </h1>
      </div>
      <div
        class="flex-1 flex justify-end cursor-pointer"
        @click="chatStore.setActiveChat(null)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-6 h-6 text-white"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </div>
    </div>
    <div
      class="flex-1 overflow-y-auto p-4 space-y-4 relative"
      ref="messagesContainer"
      :style="{ visibility: isLoading ? 'hidden' : 'visible' }"
    >
      <div v-for="message in activeChatMessages" :key="message.id">
        <component
          :is="messageComponents[message.type]"
          :message="message.content"
          :sender="message.user_id"
          :timestamp="message.timestamp"
        />
      </div>
      <p v-if="userIsTyping" class="absolute text-gray-400 pb-2">
        {{ names?.[userIsTyping.name] || userIsTyping.name }} is typing...
      </p>
    </div>
    <div v-if="isLoading" class="absolute flex left-[calc(50%-12px)] top-[40%]">
      <Spinner />
    </div>
    <div class="min-h-[15%]">
      <textarea
        v-model="newMessage"
        placeholder="Type a message..."
        class="w-full h-full p-4 border-t border-gray-800 bg-gray-900 text-white outline-0 resize-none"
        @keydown.enter.prevent="sendMessage"
      />
    </div>
    <div class="border-t border-gray-800 flex justify-end">
      <button
        class="bg-blue-500 text-white p-2 w-1/5 text-center hover:bg-blue-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        @click="sendMessage"
        :disabled="isSending || !newMessage.trim()"
      >
        Send
      </button>
    </div>
  </div>
</template>
