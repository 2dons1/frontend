import Api from '@/services/Api'

export default {

    sendEmail (email) {
        return Api().post('send-email', email)
    },

}