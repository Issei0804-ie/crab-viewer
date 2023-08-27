<template>
  <ag-grid-vue
      class="ag-theme-alpine"
      :columnDefs="columnDefs"
      :rowData="rowData"
      @click="sampleMethod"
  >
  </ag-grid-vue>
</template>

<script>
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import DB from "../infra/DB";

export default {
  name: "Sample",
  components: {
    AgGridVue,
  },
  data() {
    return {
      columnDefs: [
        { headerName: "Make", field: "make" },
        { headerName: "Model", field: "model" },
        { headerName: "Price", field: "price" },
      ],
      rowData: [
        { make: "Toyota", model: "Celica", price: 35000 },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxster", price: 72000 },
      ],
    };
  },
  methods:{
    tableHeadToColumnDefs(tableHead) {
      const columnDefs = [];
      for (const head of tableHead) {
        columnDefs.push({
          headerName: head,
          field: head,
        });
      }
      this.columnDefs = columnDefs;
    },
    tableDataToRowData(tableData) {
      const rowData = [];
      const columnDefs = this.columnDefs;
      tableData.forEach((row) => {
        const rowDataItem = {};
        columnDefs.forEach((columnDef, index) => {
          rowDataItem[columnDef.field] = row[index];
        });
        rowData.push(rowDataItem);
      });
      this.rowData = rowData;
    },
    sampleMethod(){
      const db = new DB();
      db.getLockData().then((data) => {
        const sa = db.getTable(data[0]['objectName']);
        sa.then((table) => {
          this.tableHeadToColumnDefs(table.tableHead);
          this.tableDataToRowData(table.tableData);
          data.forEach((row) => {
            if (row['lockType'] === 'RECORD'){
              if (row['lockData'] !== null){
                if (!Number.isNaN(Number(row['lockData']))){
                  this.rowData[row['lockData'] - 1]['id'] += '🔒' ;
                  console.log(this.rowData[row['lockData'] - 1]['id']);
                }
              }
            }
          });
        });
      });
    },
  },
};
</script>

<style scoped lang="scss">
.ag-theme-alpine {
  height: 100%;
  width: 100%;
}
</style>
