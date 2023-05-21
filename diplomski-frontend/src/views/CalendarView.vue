<template lang="">
    <div class="container">
        <div class="card">
            <DataTable :value="products" tableStyle="min-width: 50rem" showGridlines>
                <Column field="code" header="Code"></Column>
                <Column field="name" header="Name"></Column>
                <Column field="category" header="Category"></Column>
                <Column field="quantity" header="Quantity"></Column>
            </DataTable>
        </div>
    </div>
</template>

<script>
import { ProductService } from '@/services/ProductService';

export default {
    name: 'Calendar',
    components: {

    },
    data() {
        return {
            products: null
        }
    }, 
    methods: {

    }, 
    mounted() {
        ProductService.getProductsMini().then((data) => (this.products = data));
    }
}
</script>

<style scoped lang="">
    
</style>