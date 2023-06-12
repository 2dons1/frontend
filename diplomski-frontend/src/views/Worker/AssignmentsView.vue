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

                <div class="assigment-info">

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
                    <p> <b>Napomene izvođača: </b> <br></p>
                    <div v-for="r in assignment.Report.remark.split(';')">
                      <p> {{ r }} </p>
                    </div>
                </div>
                <div v-else>
                    <p> <b>Nema napomene!</b></p>
                </div>

                <!-- Footer -->
                <div>
                    <div class="footer">
                        <Button style="margin-right: 0.5rem;" label="Napiši napomenu" icon="pi pi-comment" severity="secondary" 
                            aria-label="Create Assignment" @click="openRemarkForm(assignment)"></Button>
                        <Button label="Promijeni status" icon="pi pi-tag" severity="success" 
                            aria-label="Change status" @click="openChangeStatusForm(assignment)"></Button>
                    </div>
                </div>

            </AccordionTab>
        </Accordion>

        <!-- Dialog for posting report remark -->
        <Dialog v-model:visible="visible" modal header="Napiši napomenu" :style="{ width: '50vw' }">

            <form class="form">
                <div class="cointainer">
                    <div class="card flex flex-column md:flex-row gap-3">

                        <!-- Assignment Remark -->
                        <div class="p-inputgroup flex-1" style="margin-bottom: 10px;">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-comment"></i>
                            </span>
                            <InputText v-model="this.remark" placeholder="Napiši napomenu..."/>
                        </div> 

                    </div>
                </div>
            </form>

            <template #footer>
                <Button label="Odustani" icon="pi pi-times" @click="visible = false" text severity="danger"></Button>    
                <Button label="Potvrdi" icon="pi pi-check" @click="postRemark()" autofocus severity="success"></Button>
            </template>

        </Dialog>

        <!-- Dialog for changing assignment status -->
        <Dialog v-model:visible="visible_status_form" modal header="Promijeni status" :style="{ width: '50vw' }">

            <form class="form">
                <div class="cointainer">
                    <div class="card flex flex-column md:flex-row gap-3">

                        <!-- Assignment Status -->
                        <div class="p-inputgroup flex-1" style="margin-bottom: 10px;">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-tag"></i>
                            </span>
                            <Dropdown v-model="formSelectedStatus" :options="statuses" optionLabel="status" placeholder="Odaberi status" class="w-full md:w-14rem" />
                        </div> 

                    </div>
                </div>
            </form>

            <template #footer>
                <Button label="Odustani" icon="pi pi-times" @click="visible_status_form = false" text severity="danger"></Button>    
                <Button label="Potvrdi" icon="pi pi-check" @click="changeStatus()" autofocus severity="success"></Button>
            </template>

        </Dialog>


    </div>
</template>

<script>
import AssignmentService from '@/services/AssignmentService'
import ReportService from '@/services/ReportService'
import NotificationService from '@/services/NotificationService'

export default {
    name: 'AssignmentsView',
    components: {

    },
    data() {
        return {
            assignments: null,
            lastAssignment: null,
            visible: false,
            visible_status_form: false,
            remark: null,
            selectedStatus: null,
            formSelectedStatus: null,
            statuses: [ // This should maybe be extracted from database.
                {status: 'zaprimljeno'},
                {status: 'u radu'},
                {status: 'poslana ponuda'},
                {status: 'završeno'},
            ],
        }
    }, 
    methods: {
        async postRemark(){
            try{
                const report = (await ReportService.postRemark({
                    reportId: this.lastAssignment.ReportId,
                    remark: this.remark 
                }))

                // Send email to owner that new assignment based on its problem has been created.
                await NotificationService.sendEmail({
                    recipient: "dorian.doncevic@fer.hr", // Ovo kasnije mijenjamo
                    subject: "AAScheduler - Nova napomena za lokaciju!",
                    message: "Djelatnik je napisao napomenu na Vašu prijavu problema: " + "'" + this.remark + "'"
                })

                // Close The Report Dialog.
                this.visible = false

                // Reset the form.
                this.remark = null

                // Reload the page to apply remark change and to remove the add remark button.
                location.reload()
            }
            catch(error){
                // Catch stuff.
                console.log(error)
            }
        },
        openRemarkForm(assignment){
            // Reset the form.
            this.remark = null

            this.lastAssignment = assignment
            this.visible = true
        },
        async changeStatus(){
            try{
                const result = (await AssignmentService.changeStatus({
                    assignmentId: this.lastAssignment.id,
                    status: this.formSelectedStatus.status
                }))

                // Close The Report Dialog.
                this.visible_status_form = false

                // Reset the form.
                this.formSelectedStatus = null

                // Reload the page to apply status change.
                location.reload()
            }
            catch(error){
                console.log(error)
            }
        },
        openChangeStatusForm(assignment){
            // Reset the form
            this.formSelectedStatus = null

            this.lastAssignment = assignment
            this.visible_status_form = true
        },
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
        this.assignments = (await AssignmentService.index()).data
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

    .footer{
        display: flex;
        justify-content: end;
    }

</style>