<template>
  <span class="loader"></span>
</template>

<style scoped>
.loader {
  display: flex;
  border: 2px solid var(--color-gray-500);
  border-left-color: #fff;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
