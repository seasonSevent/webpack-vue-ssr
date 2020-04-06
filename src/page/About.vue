<template>
    <div class="about">
        <h3>about page</h3>
        <div>
            {{item}}
        </div>
    </div>
</template>

<script>
    export default {
        name: "About",
        asyncData({store,route}){
            console.log(route)
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