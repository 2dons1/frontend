import Api from '@/services/Api'

export default {

    getAll () {
        return Api().get('users/all')
    },

}