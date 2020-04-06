<template>
    <div class="home">
        home 界面
    </div>
</template>

<script>
    export default {
        name: "Home",
        asyncData({store,route}){
            return store.dispatch("fetchItem")
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