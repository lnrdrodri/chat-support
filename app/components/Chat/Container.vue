<script lang="ts" setup>
const chatStore = useChatStore();
const { unreadChatsCount } = toRefs(chatStore);
</script>

<template>
  <aside
    class="flex flex-col min-w-[300px] w-full lg:w-1/4 bg-gray-900 text-white border-r py-4 border-gray-800"
  >
    <div class="flex justify-between items-center mb-4 px-4">
      <h1 class="text-xl">Chats</h1>
      <Badge :count="unreadChatsCount" size="md" />
    </div>
    <div class="mx-4">
      <input
        type="text"
        placeholder="Search..."
        class="w-full py-2 px-4 my-4 rounded bg-slate-950 border border-slate-900 text-white outline-0"
      />
    </div>
    <div class="h-full overflow-y-auto mr-1">
      <ChatList />
    </div>
  </aside>
</template>
