<template>
    <div class="container">
        <div class="calendar">
        <div class="calendar-header">
            <button @click="previousMonth">&lt;</button>
            <h2>{{ currentMonth }}</h2>
            <button @click="nextMonth">&gt;</button>
        </div>
        <table>
            <thead>
            <tr>
                <th v-for="day in daysOfWeek" :key="day">{{ day }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(week, index) in calendar" :key="index">
                <td v-for="day in week" :key="day.date" :class="{ 'current-day': isCurrentDay(day) }">
                {{ day.day }}
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        currentDate: new Date(),
        daysOfWeek: ['Ned.', 'Pon.', 'Uto.', 'Sri.', 'Čet.', 'Pet.', 'Sub.'],
        calendar: [],
      };
    },
    computed: {
      currentMonth() {
        const monthOptions = { month: 'long', year: 'numeric' };
        return this.currentDate.toLocaleDateString(undefined, monthOptions);
      },
    },
    methods: {
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
    },
    mounted() {
      this.generateCalendar();
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
    padding: 5px;
    border: 1px solid #ccc;
  }
  
  .current-day {
    background-color: lightblue;
  }
  </style>
  