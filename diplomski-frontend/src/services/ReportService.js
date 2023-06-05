import Api from '@/services/Api'

export default {

    getAll () {
        return Api().get('reports/all')
    },

    index () {
        return Api().get('reports')
    },

    post (report) {
        return Api().post('reports', report)
    },

    changeStatus(status) {
        return Api().put('reports/status', status)
    },

    postRemark(remark){
        return Api().put('reports/remark', remark)
    }

}