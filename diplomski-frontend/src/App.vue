<template>
        <div class="card relative z-2">
            <Menubar :model="items">

                <template #start>

                    <span class="clickable" @click="navigateTo({name: 'home'})">
                        <img alt="logo" src="/alarm.png" height="40" class="mr-2" />
                    </span>

                    <span v-if="$store.state.isUserLoggedIn">
                        <span class="navbtn" @click="navigateTo({name: 'calendar'})">
                            <Button severity="success" :class="this.$route.path == '/calendar' ? 'activeroute' : 'route'" label="Calendar" icon="pi pi-fw pi-calendar"></Button>
                        </span>
                    </span>

                    <span v-if="$store.state.isUserLoggedIn">
                        <span class="navbtn" @click="navigateTo({name: 'test'})" v-if="$store.state.user.role == 'admin'">
                            <Button severity="success" :class="this.$route.path == '/test' ? 'activeroute' : 'route'" label="Test" icon="pi pi pi-fw pi-database"></Button>
                        </span>
                    </span>

                    <span v-if="$store.state.isUserLoggedIn">
                        <span class="navbtn" @click="navigateTo({name: 'locations'})" v-if="$store.state.user.role == 'investitor'">
                            <Button severity="success" :class="this.$route.path == '/locations' ? 'activeroute' : 'route'" label="Locations" icon="pi pi pi-fw pi-map"></Button>
                        </span>
                    </span>

                </template>


                <template #end>

                    <span class="end" @click="logout($event)" v-if="$store.state.isUserLoggedIn">
                        <i class="pi pi-power-off" style="font-size: 1.5rem"></i>
                        <ConfirmPopup></ConfirmPopup>
                    </span>

                    <span class="end" @click="navigateTo({name: 'login'})" v-if="!$store.state.isUserLoggedIn" >
                        <i class="pi pi-sign-in" style="font-size: 1.5rem"></i>
                    </span>

                    <span class="end" @click="navigateTo({name: 'register'})" v-if="!$store.state.isUserLoggedIn">
                        <i class="pi pi-user-plus" style="font-size: 1.5rem"></i>
                    </span>
                    
                </template>

            </Menubar>
            <RouterView />
        </div>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'

export default {
  name: 'App',
  data() {
    return {
        active: 0,
        items: [ /*
                {
                    label: 'Calendar',
                    icon: 'pi pi-fw pi-calendar',
                    to: '/calendar'
                },
                {
                    label: 'Test',
                    icon: 'pi pi-fw pi-database',
                    to: '/test'
                }, */
        ]
    }
  },
  methods: {
    navigateTo(route) {
        this.$router.push(route)
    },
    logout(event) {
            this.$confirm.require({
                target: event.currentTarget,
                message: 'Jeste li sigurni da se želite odjaviti',
                icon: 'pi pi-exclamation-triangle',
                acceptClass: 'p-button-success',
                rejectClass: 'p-button-danger p-button-text',
                acceptLabel: "Da",
                rejectLabel: "Ne",
                accept: () => {
                    // Remove token and user from store.
                    this.$store.dispatch('setToken', null)
                    this.$store.dispatch('setUser', null)

                    // Send user to home.
                    this.navigateTo({name: 'home'}) // TODO: Ovo kasnije mozda ne ide na home
                },
                reject: () => {
                    // Do nothing.
                }
            });
        },
  },

}

</script>

<style>
/* TODO: Remove style "jumpiness" when changing active route. */

.clickable{
    cursor: pointer;
    margin-right: 1rem;
}

.end{
    cursor: pointer;
    margin-right: 1rem;
}

.navbtn{
    cursor: pointer;
    margin-right: 1rem;
}

.route{
    cursor: pointer;
    margin-right: 1rem;
    background-color: #F8F9FA !important;
    color: grey !important;

    border: none !important;
}

/* This removes the outline after button is clicked */
*:focus {
  box-shadow: none !important;
}

.activeroute {
    cursor: pointer;
    margin-right: 1rem;
    background-color: #F8F9FA !important;
    color: #22C55E !important;


    border-top: none !important;
    border-left: none !important;
    border-right: none !important;
    border-radius: 0% !important;
    border-width: medium !important;
}

.container{
    margin-top: 10px;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
}

</style>
