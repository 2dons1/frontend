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
            <AccordionTab v-for="report in filteredReports" :key="report.id" 
            :header="report.Location.name + ': ' + this.transformDate(report.createdAt.split('T')[0]) + ' - Status: ' + report.status">

                <p>{{ report.description }}</p>

                <Divider></Divider>

                <div v-if="report.remark">
                    <p> <b>Napomena izvođača: </b> <br>{{ report.remark }}</p>
                </div>
                <div v-else>
                    <p><b>Nema napomene!</b></p>
                </div>

                <!-- Footer -->
                <div v-if="report.status == 'zaprimljeno'">
                    <div class="footer">
                        <Button label="Stvori radni zadatak" icon="pi pi-briefcase" severity="warning" aria-label="Create Assignment" @click="openAssignmentForm(report)"></Button>
                    </div>
                </div>

            </AccordionTab>
        </Accordion>


        <!-- Dialog for creating assignment -->
        <Dialog v-model:visible="visible" modal header="Stvori radni zadatak" :style="{ width: '50vw' }">

            <form class="form">
                <div class="cointainer">
                    <div class="card flex flex-column md:flex-row gap-3">

                        <!-- Problem Location -->
                        <div class="p-inputgroup flex-1" style="margin-bottom: 10px;">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-map"></i>
                            </span>
                            <InputText disabled v-model="this.lastReport.Location.name"/>
                        </div> 

                        <!-- Detailed Assignment Description -->
                        <div class="p-inputgroup flex-1" style="margin-bottom: 10px;">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-comment"></i>
                            </span>
                            <Textarea autoResize placeholder="Detaljan opis zadatka..." v-model="this.assignment.description" rows="1"></Textarea>
                        </div>
                        
                        <!-- Deadline -->
                        <div class="p-inputgroup flex-1" style="margin-bottom: 10px;">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-calendar"></i>
                            </span>
                            <Calendar showButtonBar todayButton="Danas" clearButton="Očisti" placeholder="Rok za izvedbu..." v-model="this.assignment.deadline" dateFormat="dd/mm/yy" />
                        </div>

                        <!-- Workers -->
                        <div class="p-inputgroup flex-1" style="margin-bottom: 10px;">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-users"></i>
                            </span>
                            <!-- TODO: Make this searchable, user should be able to type the name or something. -->
                            <MultiSelect filter filter-placeholder="Pretraži zaposlenike..." v-model="selectedUsers" display="chip" :options="this.users" optionLabel="email" placeholder="Odaberi zaposlenike..."/>
                        </div> 

                        <!-- Equipment -->
                        <div class="p-inputgroup flex-1" style="margin-bottom: 10px;">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-wrench"></i>
                            </span>
                            <MultiSelect filter filter-placeholder="Pretraži opremu..." v-model="this.assignment.equipment" display="chip" :options="this.equipment" optionLabel="name" placeholder="Dodaj opremu..."/>
                        </div> 

                    </div>
                </div>
            </form>

            <template #footer>
                <Button label="Odustani" icon="pi pi-times" @click="visible = false" text severity="danger"></Button>    
                <Button label="Potvrdi" icon="pi pi-check" @click="createAssignment()" autofocus severity="success"></Button>
            </template>

        </Dialog>


    </div>
</template>

<script>
import AssignmentService from '@/services/AssignmentService'
import ReportService from '@/services/ReportService'
import UserService from '@/services/UserService'
import EquipmentService from '@/services/EquipmentService'
import NotificationService from '@/services/NotificationService'

export default {
    name: 'AllReportsView',
    components: {

    },
    data() {
        return {
            lastReport: null,
            visible: false,
            reports: null,
            users: null,
            equipment: null,
            selectedStatus: null,
            statuses: [ // This should maybe be extracted from database.
                {status: 'zaprimljeno'},
                {status: 'u radu'},
                {status: 'poslana ponuda'},
                {status: 'završeno'},
            ],
            assignment: {
                description: null,
                deadline: null,
                equipment: [],
            },
            selectedUsers: [],
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
        changeStatusById(objects, id) {
            objects.forEach(obj => {
                if (obj.id === id) {
                obj.status = 'u radu';
                }
            });
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
        extractNames(objects) {
            if(objects.length === 0){
                return objects;
            }
            return objects.map(obj => obj.name);
        },
        async createAssignment(){
            try{
                const assignment = (await AssignmentService.post(
                    {
                        description: this.assignment.description, 
                        deadline: this.assignment.deadline,
                        ReportId: this.lastReport.id,
                        equipmentIds: this.extractIds(this.assignment.equipment),
                        userIds: this.extractIds(this.selectedUsers)
                    }))

                if(assignment){
                    // Change report status to 'u radu'.
                    await ReportService.changeStatus({
                        reportId: this.lastReport.id,
                        status: "u radu"
                    })

                    // Send email to owner that new assignment based on its problem has been created.
                    await NotificationService.sendEmail({
                        recipient: "dorian.doncevic@fer.hr", // Ovo kasnije mijenjamo
                        subject: "AAScheduler - Zaprimljen problem",
                        message: "Zaprimili smo vas prijavljeni problem za lokaciju: " + this.lastReport.Location.name + " i kreiran je radni zadatak!"
                    })

                    // Close The Report Dialog.
                    this.visible = false

                    // Reset the form.
                    this.assignment.description = null
                    this.assignment.deadline = null
                    this.assignment.equipment = []
                    this.selectedUsers = []

                    // Show toast.
                    this.$toast.add({ severity: 'success', summary: 'Uspjeh', detail: "Uspješno napravljen radni zadatak", life: 3000 });

                    // Reload the page to apply status change and to remove the add button.
                    location.reload()
                }
                
            }
            catch(error){
                // Catch stuff.
                console.log(error)
            }
        },
        openAssignmentForm(report){
            // When opening a form make sure it is clear.
            this.assignment.description = null
            this.assignment.deadline = null
            this.assignment.equipment = []
            this.selectedUsers = []

            this.lastReport = report
            this.visible = true
        }
    },
    async mounted(){
        // API calls go here.
        this.reports = this.sortArrayByLocationAndCreatedAt((await ReportService.getAll()).data);
        this.users = this.filterByRole((await UserService.getAll()).data);
        this.equipment = (await EquipmentService.getAll()).data
    },
    computed: {
        // Used for filtering.
        filteredReports() {
            // console.log(this.extractNames(this.assignment.equipment).join(";"))
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
    .footer{
        display: flex;
        justify-content: end;
    }

</style>