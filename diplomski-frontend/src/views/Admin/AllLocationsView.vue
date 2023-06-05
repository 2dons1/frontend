<template>

    <Toast></Toast>
    <div class="container">
        <!-- Search bar -->
        <div class="search">
            <span class="p-input-icon-left" style="margin-bottom: 10px;">
                <i class="pi pi-search"></i>
                <InputText v-model="search" placeholder="Pretraži po korisnik, nazivu ili gradu..." style="width: 20rem;"/>
            </span>
        </div>

        <!-- List of elements -->
        <div class="card" v-for="location in filteredLocations" :key="location.id">

            <!-- Owner TODO: Fix the owner display so it only displays the first time. -->
            <!-- 
            <div v-if="location.User.email != this.latestUser">
                <p> {{ location.User.email }} </p>
            </div>
            -->

            <Panel :header="location.User.email.split('@')[0].toUpperCase() + ': ' + location.name" toggleable collapsed style="margin-bottom: 10px;">

                <!-- Content -->
                <div>

                    <p class="m-0">
                        <p></p>
                        <p><b>Adresa: </b>{{ location.address }}, {{ location.postal_code }}, {{ location.city }}</p>
                        <p><b>Opis: </b>{{ location.description }}</p>
                    </p>

                    <!-- Footer -->
                    <div class="footer">
                        <Button icon="pi pi-directions" severity="success" rounded aria-label="Directions" @click="redirect(location.address)"></Button>
                    </div>

                </div>
            </Panel>

        </div>

        <!-- Nothing found -->
        <div class="nothing" v-if="search&&!filteredLocations.length">
            <Message severity="error" style="width: 50rem;">Nema rezultata!</Message>
        </div>

    </div>

</template>

<script>
import LocationsService from '@/services/LocationsService'

export default {
    name: 'AllLocationsView',
    components: {

    },
    data() {
        return {
            latestUser: "",
            locations: [],
            error: "",
            search: "",
        }
    }, 
    methods: {
        redirect(adresa) {
            window.open(
                "https://www.google.hr/search?q=" + adresa,
                "_blank" // <- This is what makes it open in a new window.
            );
        },
        sortArrayByUserIdAndCreatedAt(array) {
            array.sort((a, b) => {
                if (a.UserId !== b.UserId) {
                    return a.UserId - b.UserId;
                } 
                else {
                    return new Date(a.createdAt) - new Date(b.createdAt);
                }
            });
            return array;
        }
    },
    async mounted(){
        // API calls go here.
        this.locations = this.sortArrayByUserIdAndCreatedAt((await LocationsService.getAll()).data);

    },
    computed: {
        // Used for search.
        filteredLocations() {
            return this.locations.filter(location => {
                return location.name.toLowerCase().indexOf(this.search.toLowerCase()) != -1 || 
                       location.city.toLowerCase().indexOf(this.search.toLowerCase()) != -1 ||
                       location.User.email.toLowerCase().indexOf(this.search.toLowerCase()) != -1;;
            })
        },
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

    .footer{
        display: flex;
        justify-content: space-between;
    }
    
</style>