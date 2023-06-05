import Api from '@/services/Api'

export default {

    getAll () {
        return Api().get('assignments/all')
    },

    index () {
        return Api().get('assignments')
    },

    post (assignment) {
        return Api().post('assignments', assignment)
    },

    changeStatus(status){
        return Api().put('assignments/status', status)
    }

}