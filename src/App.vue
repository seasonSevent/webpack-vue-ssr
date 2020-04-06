<template>
    <div class="app">
        <h3>hello ssr!</h3>
        <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/about">About</router-link></li>
        </ul>
        <router-view :key="$route.path"></router-view>
    </div>
</template>

<script>
    export default {
        name: "App"
    }
</script>

<style scoped>
    .app{
        width:1200px;
        min-height: 100vh;
        background-color:pink;
    }
</style>