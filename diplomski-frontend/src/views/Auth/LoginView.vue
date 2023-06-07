<template>
    <div>

        <form class="form">
            <div class="cointainer">
                <div class="card flex flex-column md:flex-row gap-3">
                    <h1>Prijava</h1>
                    <div class="p-inputgroup flex-1" style="margin-bottom: 10px;">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-user"></i>
                        </span>
                        <InputText placeholder="Email..." v-model="email"/>
                    </div>

                    <div class="p-inputgroup flex-1" style="margin-bottom: 10px;">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-lock"></i>
                        </span>
                        <!-- <InputText type="password" placeholder="Lozinka..." v-model="password"/> -->
                        <Password v-model="password" toggleMask placeholder="Lozinka..." :feedback="false"/>
                    </div>
                    <Toast/>
                    <Button @click="login" severity="success">Prijavi se</Button>
                </div>
                <!-- <router-link to="register">Registriraj se</router-link> -->
            </div>
        </form>
        
        
    </div>
</template>

<script>
import AuthtenticationService from '@/services/AuthenticationService'

export default {
    name: 'Login',
    components: {

    },
    data() {
        return {
            email: "",
            password: "",
            error: null
        }
    }, 
    methods: {
        async login() {
            try{
                const response = await AuthtenticationService.login({
                    email: this.email,
                    password: this.password
                })
                // Success.
                this.$store.dispatch('setToken', response.data.token)
                this.$store.dispatch('setUser', response.data.user)
                this.error = ""
                this.$router.push({name: 'home'})
            }
            catch(error){
                // Failed.
                this.error = error.response.data.error
                this.$toast.add({ severity: 'error', summary: 'Error', detail: this.error, life: 1000 });
            }
            
        }
    }
}
</script>

<style scoped>
    .cointainer{
        width: 500px;
    }

    .form{
        display: flex;
        justify-content: center;
        margin: auto;
    }
</style>