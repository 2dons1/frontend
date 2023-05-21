<template>
    <div>
        Singular Test View
        {{ $route.params.songId }}
    </div>
</template>

<script>
import TestService from '../services/TestService';

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
    async mounted () {
        const songId = this.$route.params.songId
        this.song = (await TestService.show(songId)).data
        console.log(this.song)
    }
}
</script>

<style scoped>
    
</style>