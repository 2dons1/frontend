<template>

    <div class="container">
        <!-- Search bar -->
        <div class="search">
            <span class="p-input-icon-left" style="margin-bottom: 10px;">
                <i class="pi pi-search"></i>
                <InputText v-model="search" placeholder="Pretraži po imenu i gradu..." />
            </span>
        </div>

        <!-- List of elements -->
        <div class="card" v-for="location in filteredLocations" :key="location.id">

            <Panel :header="location.name" toggleable collapsed style="margin-bottom: 10px;">

                <!-- Content -->
                <div>

                    <p class="m-0">
                        {{ location.description }}
                        {{ location.id }}
                    </p>

                    <!-- Report a problem button -->
                    <div class="end">
                        <Button label="Prijavi problem" severity="danger" icon="pi pi-flag" @click="openReportForm(location)"></Button>
                    </div>

                </div>

                <!-- End Icons -->
                <!-- TODO: Ovo vjerovatno zelim promjestiti, ovdje je nekako nezgodno. -->
                <template #icons>
                    <Button class="p-panel-header-icon p-link mr-2" @click="deleteLocation($event, location.id)">
                        <span class="pi pi-trash" style="color: red;"></span>
                    </Button>
                </template>

            </Panel>

        </div>

        <!-- Nothing found -->
        <div class="nothing" v-if="search&&!filteredLocations.length">
            <Message severity="error" style="width: 50rem;">Nema rezultata!</Message>
        </div>

        <!-- Add new -->
        <div class="btn">
            <Button icon="pi pi-plus" severity="success" rounded aria-label="Add" raised @click="visible = true"></Button>
        </div>
    </div>

    <!-- Form popup - Maybe refactor later, add form validation if you feel like it. -->
    <Dialog v-model:visible="visible" modal header="Dodaj lokaciju" :style="{ width: '50vw' }">

        <form class="form">
            <div class="cointainer">
                <div class="card flex flex-column md:flex-row gap-3">

                    <!-- Name -->
                    <div class="p-inputgroup flex-1" style="margin-bottom: 10px;">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-book"></i>
                        </span>
                        <InputText placeholder="Naziv lokacije..." v-model="location.name"/>
                    </div>

                    <!-- Description -->
                    <div class="p-inputgroup flex-1" style="margin-bottom: 10px;">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-comment"></i>
                        </span>
                        <InputText placeholder="Opis lokacije..." v-model="location.description"/>
                    </div>

                    <!-- Address -->
                    <div class="p-inputgroup flex-1" style="margin-bottom: 10px;">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-directions"></i>
                        </span>
                        <InputText placeholder="Adresa lokacije..." v-model="location.address"/>
                    </div>

                    <!-- City -->
                    <div class="p-inputgroup flex-1" style="margin-bottom: 10px;">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-building"></i>
                        </span>
                        <InputText placeholder="Grad lokacije..." v-model="location.city"/>
                    </div>

                    <!-- Country -->
                    <div class="p-inputgroup flex-1" style="margin-bottom: 10px;">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-building"></i>
                        </span>
                        <InputText placeholder="Država lokacije..." v-model="location.country"/>
                    </div>

                    <!-- Postal Code -->
                    <div class="p-inputgroup flex-1" style="margin-bottom: 10px;">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-directions"></i>
                        </span>
                        <InputText placeholder="Poštanski broj lokacije..." v-model="location.postal_code"/>
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

    <!-- Report a problem popup -->
    <Dialog v-model:visible="visible_report" modal header="Prijavi problem" :style="{ width: '50vw' }">

        <form class="form">
            <div class="cointainer">
                <div class="card flex flex-column md:flex-row gap-3">

                    <!-- Problem Location -->
                    <div class="p-inputgroup flex-1" style="margin-bottom: 10px;">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-map"></i>
                        </span>
                        <InputText disabled v-model="this.lastLocation.name"/>
                    </div> 

                    <!-- User That Reported The Problem -->
                    <div class="p-inputgroup flex-1" style="margin-bottom: 10px;">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-user"></i>
                        </span>
                        <InputText disabled :value="$store.state.user.email"/>
                    </div> 

                    <!-- Problem Description -->
                    <div class="p-inputgroup flex-1" style="margin-bottom: 10px;">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-comment"></i>
                        </span>
                        <InputText placeholder="Opis problema..." v-model="this.location_report.description"/>
                    </div>            

                </div>
            </div>
        </form>

        <template #footer>
            <Button label="Odustani" icon="pi pi-times" @click="visible_report = false" text severity="danger"></Button>    
            <Button label="Potvrdi" icon="pi pi-check" @click="report()" autofocus severity="success"></Button>
        </template>

    </Dialog>


</template>

<script>
import LocationsService from '@/services/LocationsService'

export default {
    name: 'LocationView',
    components: {

    },
    data() {
        return {
            locations: [],
            lastLocation: null,
            visible: false,
            visible_report: false,
            error: "",
            search: "",
            location: {
                name: "",
                description: "",
                address: "",
                city: "",
                country: "",
                postal_code: ""
            },
            location_report: {
                location: null,
                user: null,
                timestamp: null,
                description: null,
                status: null
            }
        }
    }, 
    methods: {
        openReportForm(location){
            this.visible_report = true
            this.lastLocation = location
        },
        async add() {
            try{
                // Post request
                const response = (await LocationsService.post(this.location)).data
                // Success.
                this.error = ""

                // If success, fake-add song to list for better UX.
                this.locations.push(response)

                // Reset the form. This is stupid, make a loop or something.
                for (let prop in this.location) {
                    if (this.location.hasOwnProperty(prop)) {
                        this.location[prop] = "";
                    }
                }
                // Close the Dialog.
                this.visible = false
            }
            catch(error){
                // Failed.
                this.error = error.response.data.error
                this.$toast.add({ severity: 'error', summary: 'Error', detail: this.error, life: 3000 });
            }
        },
        async report(){
            try{
                // Do Logic.
                console.log("Problem on location " + this.lastLocation.id + " reported...")
                console.log(this.lastLocation)
                // Close The Report Dialog.
                this.visible_report = false
            }
            catch(error){
                // catch stuff.
            }
        },
        async deleteLocation(event, locationId) {
            // Add are you sure thingy.
            this.$confirm.require({
                target: event.currentTarget,
                message: 'Jeste li sigurni da želite ukloniti lokaciju',
                icon: 'pi pi-exclamation-triangle',
                acceptClass: 'p-button-success',
                rejectClass: 'p-button-danger p-button-text',
                acceptLabel: "Da",
                rejectLabel: "Ne",
                accept: async () => {
                    try{
                        // Delete request
                        const deletedId = (await LocationsService.delete(locationId)).data
                        // Fake remove from list so there is no need to refresh.
                        this.locations = this.locations.filter(location => location.id != deletedId.locationId)
                    }
                    catch(error){
                        console.log(error)
                    }
                },
                reject: () => {
                    // Do nothing.
                }
            });
        },
    },
    async mounted(){
        // API calls go here.
        this.locations = (await LocationsService.index()).data;

    },
    computed: {
        // Used for search.
        filteredLocations() {
            return this.locations.filter(location => {
                return location.name.toLowerCase().indexOf(this.search.toLowerCase()) != -1 || 
                       location.city.toLowerCase().indexOf(this.search.toLowerCase()) != -1;
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

    .end{
        display: flex;
        justify-content: right;
    }
    
</style>