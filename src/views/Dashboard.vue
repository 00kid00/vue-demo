<template>
  <div v-if="$route.query.firstLogin" class="welcome-message">
    欢迎 {{ user.username }}！您已成功注册并登录
  </div>
</template>
