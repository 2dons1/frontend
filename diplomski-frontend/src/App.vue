<template>
        <!-- <TabMenu v-model:activeIndex="active" :model="items" /> -->
        <div class="card relative z-2">
            <Menubar :model="items">

                <template #start>
                    <span class="logo" @click="navigateTo({name: 'home'})">
                        <img alt="logo" src="/alarm.png" height="40" class="mr-2" />
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
        items: [
                {
                    label: 'Calendar',
                    icon: 'pi pi-fw pi-calendar',
                    to: '/calendar'
                },
                {
                    label: 'Test',
                    icon: 'pi pi-fw pi-database',
                    to: '/test'
                },
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
.logo{
    cursor: pointer;
    margin-right: 1rem;
}

.end{
    cursor: pointer;
    margin-right: 1rem;
}

.container{
        margin-top: 10px;
        width: 80%;
        margin-left: auto;
        margin-right: auto;
}

</style>
