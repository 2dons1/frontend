<template>

    <div class="container">
        <!-- Search bar -->
        <div class="search">
            <span class="p-input-icon-left" style="margin-bottom: 10px;">
                <i class="pi pi-search"></i>
                <InputText v-model="search" placeholder="Pretraži po imenu..." />
            </span>
        </div>

        <!-- List of elements -->
        <div class="card" v-for="test in filteredSongs" :key="test.id">
            <Panel :header="test.title" toggleable collapsed style="margin-bottom: 10px;">
                <p class="m-0">
                    {{ test.lyrics }}
                </p>
            </Panel>

        </div>

        <!-- Nothing found -->
        <div class="nothing" v-if="search&&!filteredSongs.length">
            <Message severity="error" style="width: 50rem;">Nema rezultata!</Message>
        </div>

        <!-- Add new -->
        <div class="btn">
            <Button icon="pi pi-plus" severity="success" rounded aria-label="Add" raised @click="visible = true"></Button>
        </div>
    </div>

    <!-- Form popup - Maybe refactor later -->
    <Dialog v-model:visible="visible" modal header="Dodaj pjesmu" :style="{ width: '50vw' }">

        <form class="form">
            <div class="cointainer">
                <div class="card flex flex-column md:flex-row gap-3">

                    <!-- Title -->
                    <div class="p-inputgroup flex-1" style="margin-bottom: 10px;">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-user"></i>
                        </span>
                        <InputText placeholder="Title..." v-model="song.title"/>
                    </div>

                    <!-- Artist -->
                    <div class="p-inputgroup flex-1" style="margin-bottom: 10px;">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-user"></i>
                        </span>
                        <InputText placeholder="Artist..." v-model="song.artist"/>
                    </div>

                    <!-- Genre -->
                    <div class="p-inputgroup flex-1" style="margin-bottom: 10px;">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-user"></i>
                        </span>
                        <InputText placeholder="Genre..." v-model="song.genre"/>
                    </div>

                    <!-- Album -->
                    <div class="p-inputgroup flex-1" style="margin-bottom: 10px;">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-user"></i>
                        </span>
                        <InputText placeholder="Album..." v-model="song.album"/>
                    </div>

                    
                    <Toast/>
                </div>
            </div>
        </form>

        <template #footer>
            <Button label="Odustani" icon="pi pi-times" @click="visible = false" text severity="danger"></Button>    
            <Button label="Potvrdi" icon="pi pi-check" @click="add()" autofocus severity="success"></Button>
        </template>

    </Dialog>

</template>

<script>
import TestService from '@/services/TestService'

export default {
    name: 'TestView',
    components: {

    },
    data() {
        return {
            tests: [],
            visible: false,
            error: "",
            search: "",
            song: {
                title: "",
                artist: "",
                genre: "",
                album: "",
                albumImageUrl: "",
                youtubeId: "",
                lyrics: "Tvoja šljokice na meni sjaju kao srebro!",
                tab: "",
            },
        }
    }, 
    methods: {
        async add() {
            try{
                // Post request
                const response = (await TestService.post(this.song)).data
                // Success.
                this.error = ""
                // If success, fake-add song to list for better UX.
                this.tests.push(response)

                // Reset the form. This is stupid, make a loop or something.
                this.song.title = ""
                this.song.artist = ""
                this.song.artist = ""
                this.song.album = ""

                // Close the Dialog.
                this.visible = false
            }
            catch(error){
                // Failed.
                this.error = error.response.data.error
                this.$toast.add({ severity: 'error', summary: 'Error', detail: this.error, life: 3000 });
            }
        }
    },
    async mounted(){
        // API calls go here.
        this.tests = (await TestService.index()).data;

    },
    computed: {
        // Used for search.
        filteredSongs() {
            return this.tests.filter(test => {
                return test.title.toLowerCase().indexOf(this.search.toLowerCase()) != -1 || test.lyrics.toLowerCase().indexOf(this.search.toLowerCase()) != -1;
            })
        }
    },
}
</script>

<style scoped>

    .btn{
        display: flex;
        justify-content: center;
    }

    .search{
        display: flex;
        justify-content: right;
    }

    .nothing{
        display: flex;
        justify-content: center;
    }

</style>