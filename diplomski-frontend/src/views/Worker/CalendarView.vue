<template>
  
    <div class="container">
      <div class="calendar">

        <div class="calendar-header">
          <Button icon="pi pi-angle-left" severity="secondary" text outlined rounded aria-label="Bookmark" @click="previousMonth"></Button>
          <h2>{{ currentMonth }}</h2>
          <Button icon="pi pi-angle-right" severity="secondary" text outlined rounded aria-label="Bookmark" @click="nextMonth"></Button>
        </div>

        <table>
          <thead>
            <tr>
              <th  style="background-color: #90ee90ab;" v-for="day in daysOfWeek" :key="day">{{ day }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(week, index) in calendar" :key="index">
              <td v-for="day in week" :key="day.date" :class="getCellClasses(day)" @click="showTaskDescription(day)" style="width: 10rem; height: 5rem;">
                <div class="day-number">
                  <p>{{ day.day }}</p>
                </div>
                <div class=""> <!-- TODO: Maybe there is more than one task on this day, then what?! -->
                  <p>{{ this.getTasksForDate(day.date)[0] ? this.getTasksForDate(day.date)[0].Report.Location.name : '' }}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>

    <Dialog v-model:visible="visible" modal :style="{ width: '85vw' }">
      <div class="report-info">

        <h1>{{ currentAssignment.Report.Location.name }} - {{ currentAssignment.status }}</h1>

        <div>
            <p> <b>Prijavljeni problem: </b> </p>
            <p> {{ currentAssignment.Report.description }} </p>
            <p> <i>Datum prijave problema: {{ this.transformDate(currentAssignment.Report.createdAt.split("T")[0]) }} </i> </p>
        </div>

        <div>
            <p> <b>Detaljan opis zadatka: </b> </p>
            <p> {{ currentAssignment.description }} </p>
        </div>

        </div>

        <Divider></Divider>

        <div class="assigment-info">

        <div>
            <p> <b> Potrebna oprema: </b> </p> 
            <div v-for="eq in currentAssignment.Equipment">
                <p>{{ eq.name }}</p>
            </div>
        </div>

        <div>
            <p> <b> Rok izvedbe: </b> </p> 
            <p>{{ this.transformDate(currentAssignment.deadline.split("T")[0]) }}</p>
        </div>

        </div>

        <Divider></Divider>

        <!-- Footer -->
        <div v-if="currentAssignment.Report.remark">
          <p> <b>Napomene izvođača: </b> <br></p>
          <div v-for="r in currentAssignment.Report.remark.split(';')">
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
                aria-label="Create Assignment" @click="openRemarkForm()"></Button>
            <Button label="Promijeni status" icon="pi pi-tag" severity="success" 
                aria-label="Change status" @click="openChangeStatusForm()"></Button>
        </div>
      </div>
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

    <!-- Dialog for posting report remark -->
    <Dialog v-model:visible="visible_remark_form" modal header="Napiši napomenu" :style="{ width: '50vw' }">

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
          <Button label="Odustani" icon="pi pi-times" @click="visible_remark_form = false" text severity="danger"></Button>    
          <Button label="Potvrdi" icon="pi pi-check" @click="postRemark()" autofocus severity="success"></Button>
      </template>

    </Dialog>

  </template>
  
  <script>
  import AssignmentService from '@/services/AssignmentService'
  import ReportService from '@/services/ReportService'
  import NotificationService from '../../services/NotificationService';

  export default {
    data() {
      return {
        visible_status_form: false,
        currentDate: new Date(),
        daysOfWeek: ['Ned.', 'Pon.', 'Uto.', 'Sri.', 'Čet.', 'Pet.', 'Sub.'],
        calendar: [],
        visible: false,
        visible_remark_form: false,
        remark: null,
        tasks: [],
        currentAssignment: null,
        formSelectedStatus: null,
        statuses: [ // This should maybe be extracted from database.
            {status: 'zaprimljeno'},
            {status: 'u radu'},
            {status: 'poslana ponuda'},
            {status: 'završeno'},
        ],
      };
    },
    computed: {
      currentMonth() {
        const monthOptions = { month: 'long', year: 'numeric' };
        return this.currentDate.toLocaleDateString(undefined, monthOptions);
      },
    },
    methods: {
      openChangeStatusForm(){
        // Reset the form
        this.formSelectedStatus = null
        this.visible_status_form = true
      },
      openRemarkForm(){
        // Reset the form.
        this.remark = null
        this.visible_remark_form = true
      },
      async changeStatus(){
        try{
            const result = (await AssignmentService.changeStatus({
                assignmentId: this.currentAssignment.id,
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
      async postRemark(){
        try{
          const report = (await ReportService.postRemark(
            {
              reportId: this.currentAssignment.ReportId,
              remark: this.remark 
            }))

          // Send email to owner that new assignment based on its problem has been created.
          await NotificationService.sendEmail({
              recipient: "dorian.doncevic@fer.hr", // Ovo kasnije mijenjamo
              subject: "AAScheduler - Nova napomena za lokaciju!",
              message: "Djelatnik je napisao napomenu na Vašu prijavu problema: " + "'" + this.remark + "'"
          })

          // Close The Report Dialog.
          this.visible_remark_form = false

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
      previousMonth() {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
      },
      nextMonth() {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
      },
      isCurrentDay(day) {
        const today = new Date();
        return (
          day.date.getDate() === today.getDate() &&
          day.date.getMonth() === today.getMonth() &&
          day.date.getFullYear() === today.getFullYear()
        );
      },
      isSameMonth(day) {
        return (
          day.date.getMonth() === this.currentDate.getMonth() &&
          day.date.getFullYear() === this.currentDate.getFullYear()
        );
      },
      generateCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const startDate = new Date(firstDayOfMonth);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        const endDate = new Date(lastDayOfMonth);
        endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
  
        const calendar = [];
        let week = [];
        let currentDate = new Date(startDate);
  
        while (currentDate <= endDate) {
          const day = {
            day: currentDate.getDate(),
            date: new Date(currentDate),
          };
  
          week.push(day);
  
          if (currentDate.getDay() === 6) {
            calendar.push(week);
            week = [];
          }
  
          currentDate.setDate(currentDate.getDate() + 1);
        }
  
        this.calendar = calendar;
      },
      getTasksForDate(date) {
        const formattedDate = date.toISOString().split('T')[0];
        // this.tasks.forEach(task => console.log(task))
        return this.tasks.filter(task => task.deadline.split('T')[0] === formattedDate);
      },
      getCellClasses(day) {
        const today = new Date();
        return {
          'current-day': this.isCurrentDay(day),
          'outside-month': !this.isSameMonth(day),
          'task-day': this.getTasksForDate(day.date).length > 0,
          'late': this.getTasksForDate(day.date).length > 0 && day.date < today
        };
      },
      showTaskDescription(day) {
        const tasks = this.getTasksForDate(day.date);
        if (tasks.length > 0) {
          this.currentAssignment = tasks[0];
          this.visible = true
        }
      },
      transformDate(dateString){
        var parts = dateString.split('-');
        var year = parts[0];
        var month = parts[1];
        var day = parts[2];
        
        return day + '/' + month + '/' + year;
      },
    },
    async mounted() {
      this.generateCalendar();
      this.tasks = (await AssignmentService.index()).data
    },
    watch: {
      currentDate() {
        this.generateCalendar();
      },
    },
  };
  </script>
  
  <style>
  .calendar {
    font-family: Arial, sans-serif;
  }
  
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .calendar-header button {
    font-size: 20px;
    cursor: pointer;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th,
  td {
    text-align: center;
    padding: 15px;
    border: 1px solid #ccc;
  }
  
  .current-day {
    background-color: #FCF8E3;
  }

  .late {
    background-color: #f59f0bc7 !important;
  }
  
  .outside-month {
    color: rgba(128, 128, 128, 0.315);
    /*text-decoration: line-through; */
  }
  
  .task-day {
    background-color: rgb(144, 238, 144);
    cursor: pointer;
  }
  
  .day-number {
    position: relative;
  }

  .day-number p {
    position: absolute;
    top: 0;
    right: 0;
    margin: 0;
  }

  
  .task-description {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 5px;
    font-size: 14px;
    z-index: 1;
    display: none;
  }
  
  .task-day:hover .task-description {
    display: block;
  }
  
  .tasks {
    display: flex;
    flex-direction: column;
  }
  
  .task {
    margin-bottom: 2px;
  }
  </style>
  