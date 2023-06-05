<template>
        <div class="card relative z-2">
            <Menubar class="sticky-menu">

                <template #start>

                    <span class="clickable" @click="navigateTo({name: 'home'})">
                        <img alt="logo" src="/alarm.png" height="40" class="mr-2" />
                    </span>

                    <!-- Investitor. -->
                    <span v-if="$store.state.isUserLoggedIn">
                        <span class="navbtn" @click="navigateTo({name: 'locations'})" v-if="$store.state.user.role == 'investitor'">
                            <Button severity="success" :class="this.$route.path == '/locations' ? 'activeroute' : 'route'" label="Moji objekti" icon="pi pi pi-fw pi-building"></Button>
                        </span>
                    </span>

                    <span v-if="$store.state.isUserLoggedIn">
                        <span class="navbtn" @click="navigateTo({name: 'reports'})" v-if="$store.state.user.role == 'investitor'">
                            <Button badge="" badgeClass="p-badge-success" severity="success" :class="this.$route.path == '/reports' ? 'activeroute' : 'route'" label="Prijavljeni problemi" icon="pi pi pi-fw pi-exclamation-triangle"></Button>
                        </span>
                    </span>

                    <!-- Admin. -->
                    <span v-if="$store.state.isUserLoggedIn">
                        <span class="navbtn" @click="navigateTo({name: 'locations-all'})" v-if="$store.state.user.role == 'admin'">
                            <Button severity="success" :class="this.$route.path == '/locations-all' ? 'activeroute' : 'route'" label="Svi objekti" icon="pi pi pi-fw pi-building"></Button>
                        </span>
                    </span>

                    
                    <span v-if="$store.state.isUserLoggedIn">
                        <span class="navbtn" @click="navigateTo({name: 'reports-all'})" v-if="$store.state.user.role == 'admin'">
                            <Button severity="success" :class="this.$route.path == '/reports-all' ? 'activeroute' : 'route'" label="Svi prijavljeni problemi" icon="pi pi pi-fw pi-exclamation-triangle"></Button>
                        </span>
                    </span>

                    <span v-if="$store.state.isUserLoggedIn">
                        <span class="navbtn" @click="navigateTo({name: 'assignments-all'})" v-if="$store.state.user.role == 'admin'">
                            <Button severity="success" :class="this.$route.path == '/assignments-all' ? 'activeroute' : 'route'" label="Svi radni zadaci" icon="pi pi pi-fw pi-briefcase"></Button>
                        </span>
                    </span>

                    <!-- Worker. -->
                    <span v-if="$store.state.isUserLoggedIn">
                        <span class="navbtn" @click="navigateTo({name: 'assignments'})" v-if="$store.state.user.role == 'zaposlenik'">
                            <Button severity="success" :class="this.$route.path == '/assignments' ? 'activeroute' : 'route'" label="Moji zadaci" icon="pi pi pi-fw pi-briefcase"></Button>
                        </span>
                    </span>

                    <span v-if="$store.state.isUserLoggedIn">
                        <span class="navbtn" @click="navigateTo({name: 'calendar'})" v-if="$store.state.user.role == 'zaposlenik'">
                            <Button severity="success" :class="this.$route.path == '/calendar' ? 'activeroute' : 'route'" label="Kalendar" icon="pi pi pi-fw pi-calendar"></Button>
                        </span>
                    </span>

                </template>


                <template #end>

                    <!-- User details -->
                    <span v-if="$store.state.isUserLoggedIn">
                        <span class="user">
                            <Button severity="success" class="user" icon="pi pi pi-fw pi-user" :label="this.formatName($store.state.user.email) + ' (' + $store.state.user.role + ')'" ></Button>
                        </span>
                    </span>

                    <!-- Logout -->
                    <span v-if="$store.state.isUserLoggedIn">
                        <span class="navbtn" @click="logout($event)">
                            <Button severity="success" class="auth" label="Odjava" icon="pi pi pi-fw pi-power-off"></Button>
                            <ConfirmPopup></ConfirmPopup>
                        </span>
                    </span>

                     <!-- Login -->
                    <span v-if="!$store.state.isUserLoggedIn">
                        <span class="navbtn" @click="navigateTo({name: 'login'})">
                            <Button severity="success" class="auth" label="Prijava" icon="pi pi pi-fw pi-sign-in"></Button>
                            <ConfirmPopup></ConfirmPopup>
                        </span>
                    </span>

                     <!-- Register -->
                    <span v-if="!$store.state.isUserLoggedIn">
                        <span class="navbtn" @click="navigateTo({name: 'register'})">
                            <Button severity="success" class="auth" label="Registracija" icon="pi pi pi-fw pi-user-plus"></Button>
                            <ConfirmPopup></ConfirmPopup>
                        </span>
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
    formatName(email) {
        var nameParts = email.split('@')[0].split('.')
        var firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1)
        var lastNameInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase()
        var formattedName = firstName + ' ' + lastNameInitial

        return formattedName;
    }
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

.user{
    cursor: default !important;
    margin-right: 1rem;
    background-color: #F8F9FA !important;
    color: grey !important;
    border: none !important;
}

.auth{
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

.sticky-menu{
    position: sticky;
    top: 0;
    z-index: 999;
}

</style>
