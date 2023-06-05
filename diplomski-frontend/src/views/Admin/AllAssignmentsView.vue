<template>
    <Toast></Toast>
    <div class="container">

        <div class="dropdown">
            <span class="p-input-icon-left" style="margin-bottom: 10px;">
                <Dropdown style="width: 15rem;" v-model="selectedStatus" showClear :options="statuses" optionLabel="status" placeholder="Filtriraj po statusu..." />
            </span>
        </div>

        <Accordion>
            <!-- Add A Filter Option - filter between statuses -->
            <AccordionTab v-for="assignment in filteredAssignments" :key="assignment.id" 
            :header="assignment.Report.Location.name + ': ' + this.transformDate(assignment.createdAt.split('T')[0]) + ' - Status: ' + assignment.status">


                <div class="report-info">

                    <div>
                        <p> <b>Prijavljeni problem: </b> </p>
                        <p> {{ assignment.Report.description }} </p>
                        <p> <i>Datum prijave problema: {{ this.transformDate(assignment.Report.createdAt.split("T")[0]) }} </i> </p>
                    </div>

                    <div>
                        <p> <b>Detaljan opis zadatka: </b> </p>
                        <p> {{ assignment.description }} </p>
                    </div>

                </div>
    
                <Divider></Divider>
            
                <div class="location-info">

                    <div>
                        <p> <b>Lokacija:</b>  </p>
                        <p> {{ assignment.Report.Location.name }} </p>
                    </div>

                    <div>
                        <p> <b>Adresa:</b>  </p>
                        <p> {{ assignment.Report.Location.address }} </p>
                    </div>

                    <div>
                        <p> <b>Vlasnik:</b>  </p>
                        <p> {{ assignment.Report.Location.User.email }} </p>
                    </div>

                </div>

                <Divider></Divider>

                <div class="assigment-info">

                    <div>
                        <p> <b> Tehničari: </b> </p>
                        <div v-for="user in assignment.Users">
                            <p>{{ user.email }}</p>
                        </div>
                    </div>

                    <div>
                        <p> <b> Potrebna oprema: </b> </p> 
                        <div v-for="eq in assignment.Equipment">
                            <p>{{ eq.name }}</p>
                        </div>
                    </div>

                    <div>
                        <p> <b> Rok izvedbe: </b> </p> 
                        <p>{{ this.transformDate(assignment.deadline.split("T")[0]) }}</p>
                    </div>

                </div>
                    
                <Divider></Divider>

                <!-- Footer -->
                <div v-if="assignment.Report.remark">
                    <p> <b>Napomena izvođača: </b> <br>{{ assignment.Report.remark }}</p>
                </div>
                <div v-else>
                    <p><b>Nema napomene!</b></p>
                </div>

            </AccordionTab>
        </Accordion>

    </div>
</template>

<script>
import AssignmentService from '@/services/AssignmentService'
import ReportService from '@/services/ReportService'
import UserService from '@/services/UserService'

export default {
    name: 'AllAssignmentsView',
    components: {

    },
    data() {
        return {
            assignments: null, 
            reports: null,
            selectedStatus: null,
            statuses: [ // This should maybe be extracted from database.
                {status: 'zaprimljeno'},
                {status: 'u radu'},
                {status: 'poslana ponuda'},
                {status: 'završeno'},
            ],
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
        },
        filterByRole(objects) {
            return objects.filter(obj => obj.role === "zaposlenik");
        },
        extractIds(objects) {
            return objects.map(obj => obj.id);
        },
    },
    async mounted(){
        // API calls go here.
        this.reports = this.sortArrayByLocationAndCreatedAt((await ReportService.getAll()).data);
        this.assignments = (await AssignmentService.getAll()).data
    },
    computed: {
        // Used for filtering.
        filteredAssignments() {
            if (!this.selectedStatus) {
                return this.assignments;
            }
            
            return this.assignments.filter(assignment => {
                return assignment.status.toLowerCase().indexOf(this.selectedStatus.status.toLowerCase()) != -1
            })
        },
    },
}
</script>

<style scoped>
    .assigment-info{
        display: flex;
        justify-content: space-between;
    }

    .location-info{
        display: flex;
        justify-content: space-between;
    }

    .report-info{
        display: flex;
        justify-content: space-between;
    }

</style>