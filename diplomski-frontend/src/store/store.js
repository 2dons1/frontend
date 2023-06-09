import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
    plugins: [createPersistedState()],
    state() {
        return {
            token: null,
            user: null,
            isUserLoggedIn: false
        }
    },
    mutations: {
        setToken(state, token){
            state.token = token
            if(token) {
                state.isUserLoggedIn = true
            }
            else {
                state.isUserLoggedIn = false
            }
        },
        setUser(state, user){
            state.user = user
        }
    },
    actions: {
        setToken({commit}, token) {
            commit('setToken', token)
        },
        setUser({commit}, user){
            commit('setUser', user)
        }
    }
})