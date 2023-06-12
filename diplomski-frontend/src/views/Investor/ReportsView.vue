<template>
    <div class="container">

        <div class="dropdown">
            <span class="p-input-icon-left" style="margin-bottom: 10px;">
                <Dropdown style="width: 15rem;" v-model="selectedStatus" showClear :options="statuses" optionLabel="status" placeholder="Filtriraj po statusu..." />
            </span>
        </div>

        <Accordion>
            <!-- Add A Filter Option - filter between statuses -->
            <AccordionTab v-for="report in filteredReports" :key="report.id" 
            :header="report.Location.name + ': ' + this.transformDate(report.createdAt.split('T')[0]) + ' - Status: ' + report.status">

                <p>{{ report.description }}</p>

                <Divider></Divider>

                <!-- Footer -->
                <div v-if="report.remark">
                    <p> <b>Napomene izvođača: </b> <br></p>
                    <div v-for="r in report.remark.split(';')">
                      <p> {{ r }} </p>
                    </div>
                </div>
                <div v-else>
                    <p> <b>Nema napomene!</b></p>
                </div>

            </AccordionTab>
        </Accordion>
    </div>
</template>

<script>
import ReportsService from '@/services/ReportService'

export default {
    name: 'ReportsView',
    components: {

    },
    data() {
        return {
            reports: null, 
            selectedStatus: null,
            statuses: [
                {status: 'zaprimljeno'},
                {status: 'u radu'},
                {status: 'poslana ponuda'},
                {status: 'završeno'},
            ]
        }
    }, 
    methods: {
        transformDate(dateString){
            var parts = dateString.split('-');
            var year = parts[0];
            var month = parts[1];
            var day = parts[2];
            
            return day + '/' + month + '/' + year;
        },
        sortArrayByLocationAndCreatedAt(array) {
            array.sort((a, b) => {
                // Sort by Location.name
                const nameA = a.Location.name.toUpperCase();
                const nameB = b.Location.name.toUpperCase();
                if (nameA < nameB) {
                return -1;
                }
                if (nameA > nameB) {
                return 1;
                }
                
                // If Location.name is the same, sort by createdAt
                const createdAtA = new Date(a.createdAt);
                const createdAtB = new Date(b.createdAt);
                return createdAtB - createdAtA;
            });

            return array;
        }
    },
    async mounted(){
        // API calls go here.
        this.reports = this.sortArrayByLocationAndCreatedAt((await ReportsService.index()).data);

    },
    computed: {
        // Used for search.
        filteredReports() {
            
            if (!this.selectedStatus) {
                return this.reports;
            }
            
            return this.reports.filter(report => {
                return report.status.toLowerCase().indexOf(this.selectedStatus.status.toLowerCase()) != -1
            })
        },
    },
}
</script>

<style scoped>
    
</style>