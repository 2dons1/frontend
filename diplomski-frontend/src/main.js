import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import store from '@/store/store'
import Vuex from 'vuex'
import './registerServiceWorker'

// PRIME VUE - CSS
import "primevue/resources/themes/lara-light-indigo/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css"
import "./assets/app.css"
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

const app = createApp(App)

// Prime vue components.
import Button from "primevue/button"
import Menubar from 'primevue/menubar';
import TabMenu from 'primevue/tabmenu';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import Image from 'primevue/image';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Toast from 'primevue/toast';
import Password from 'primevue/password';
import ConfirmPopup from 'primevue/confirmpopup';
import Panel from 'primevue/panel';
import ScrollTop from 'primevue/scrolltop';
import Dialog from 'primevue/dialog';
import Message from 'primevue/message';
import Menu from 'primevue/menu';
import Card from 'primevue/card';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Divider from 'primevue/divider';
import Chips from 'primevue/chips';
import Calendar from 'primevue/calendar';
import Textarea from 'primevue/textarea';
import MultiSelect from 'primevue/multiselect';
import './registerServiceWorker'
app.component('Button', Button)
app.component('Menubar', Menubar)
app.component('TabMenu', TabMenu)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('ColumGroup', ColumnGroup)
app.component('Row', Row)
app.component('Image', Image)
app.component('InputText', InputText)
app.component('Dropdown', Dropdown)
app.component('Toast', Toast)
app.component('Password', Password)
app.component('ConfirmPopup', ConfirmPopup)
app.component('Panel', Panel)
app.component('ScrollTop', ScrollTop)
app.component('Dialog', Dialog)
app.component('Message', Message)
app.component('Menu', Menu)
app.component('Card', Card)
app.component('Accordion', Accordion)
app.component('AccordionTab', AccordionTab)
app.component('Divider', Divider)
app.component('Chips', Chips)
app.component('Calendar', Calendar)
app.component('Textarea', Textarea)
app.component('MultiSelect', MultiSelect)

app.use(ToastService)
app.use(ConfirmationService)
app.use(PrimeVue)

app.use(router)
app.use(store)
app.use(Vuex)
app.mount('#app')
