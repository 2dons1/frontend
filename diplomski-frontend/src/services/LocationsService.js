import Api from '@/services/Api'

export default {

    getAll () {
        return Api().get('locations/all')
    },

    index () {
        return Api().get('locations')
    },

    post (location) {
        return Api().post('locations', location)
    },

    delete(locationId) {
        return Api().delete(`locations/${locationId}`) // DELETE has no body!
    }

}