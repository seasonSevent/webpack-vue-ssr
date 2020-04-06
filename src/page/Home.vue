<template>
    <div class="home">
        home 界面
        {{item}}
    </div>
</template>

<script>
    export default {
        name: "Home",
        asyncData({store,route}){
            return store.dispatch("fetchItem",234234)
        },
        computed:{
            item(){
                return this.$store.state.items;
            }
        }
    }
</script>

<style scoped>

</style>