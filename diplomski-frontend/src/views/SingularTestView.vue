<template>
    <div>
        Singular Test View
        {{ $route.params.songId }}
    </div>
</template>

<script>


export default {
    name: 'SingularTestView',
    components: {

    },
    data() {
        return {
            song: null,
        }
    }, 
    methods: {

    },
}
</script>

<style scoped>
    
</style>