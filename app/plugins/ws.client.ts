export default defineNuxtPlugin(() => {
  function createSocket(chatId: string) {
    const config = useRuntimeConfig();
    const socket = new WebSocket(`${config.public.API_URL}/ws/${chatId}`);

    socket.addEventListener("open", () => {
      console.log(`✅ Conectado ao chat ${chatId}`);
    });

    socket.addEventListener("close", () => {
      console.log(`❌ Desconectado do chat ${chatId}`);
    });

    return socket;
  }

  return {
    provide: {
      createSocket,
    },
  };
});
