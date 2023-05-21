<template>
    <div>

        <form class="form">
            <div class="cointainer">
                <div class="card flex flex-column md:flex-row gap-3">
                    <h1>Registracija</h1>
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

                    <div class="p-inputgroup flex-1" style="margin-bottom: 10px;">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-tag"></i>
                        </span>
                        <Dropdown v-model="selectedRole" :options="roles" optionLabel="name" placeholder="Odaberi ulogu..."/>
                    </div>

                    <!-- <div class="error"> {{error}} </div>-->
                    <Toast/>
                    <Button @click="register" severity="success">Registriraj se</Button>
                </div>
            </div>
        </form>
        
    </div>
</template>

<script>
import AuthtenticationService from '@/services/AuthenticationService'

export default {
    name: 'Register',
    components: {

    },
    data() {
        return {
            email: "",
            password: "",
            selectedRole: null,
            error: null,
            roles: [ // TODO: Povuci ovo iz baze.
                { name: "Zaposlenik" },
                { name: "Investitor" }
            ]
        }
    }, 
    methods: {
        async register() {
            try{
                const response = await AuthtenticationService.register({
                    email: this.email,
                    password: this.password
                })
                // Success
                this.$store.dispatch('setToken', response.data.token)
                this.$store.dispatch('setUser', response.data.user)
                this.error = ""
                this.$router.push({name: 'home'})
            }
            catch(error){
                // Failed
                this.error = error.response.data.error
                this.$toast.add({ severity: 'error', summary: 'Error', detail: this.error, life: 1000 });
            }
            
        },
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

    .error{
        color: red;
    }

</style>