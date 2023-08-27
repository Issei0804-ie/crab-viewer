<template>
  <ag-grid-vue
      class="ag-theme-alpine"
      :columnDefs="columnDefs"
      :rowData="rowData"
      @click="sampleMethod"
  >
  </ag-grid-vue>
</template>

<script lang="ts">
import DB from "../infra/DB";
import {defineComponent} from "vue";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridVue } from "@ag-grid-community/vue3";
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

type ColumnDefs = {
  headerName: string;
  field: string;
};

export default defineComponent({
  name: "Sample",
  components: {
    AgGridVue,
  },
  data() {
    return {
      columnDefs: [
        { headerName: "Make", field: "make" },
        { headerName: "Model", field: "model" },
      ] as Array<ColumnDefs>,
      rowData: [
        { make: "Toyota", model: "Celica"},
        { make: "Ford", model: "Mondeo"},
        { make: "Porsche", model: "Boxster"},
      ] as Array<any>,
    };
  },
  methods:{
    tableHeadToColumnDefs(tableHead:string[]){
      const columnDefs:ColumnDefs[] = [];
      for (const head of tableHead) {
        columnDefs.push({
          headerName: head,
          field: head,
        } as ColumnDefs);
      }
      this.columnDefs = columnDefs;
    },
    tableDataToRowData(tableData:string[][]) {
      const rowData:any[] = [];
      const columnDefs = this.columnDefs;
      tableData.forEach((row) => {
        const rowDataItem:any = {};
        columnDefs.forEach((columnDef:ColumnDefs, index:number) => {
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
              if (row['lockData'] !== ""){
                if (!Number.isNaN(Number(row['lockData']))){
                  this.rowData[Number(row['lockData']) - 1]['id'] += '🔒' ;
                }
              }
            }
          });
        });
      });
    },
  },
});
</script>

<style scoped lang="scss">
.ag-theme-alpine {
  height: 100%;
  width: 100%;
}
</style>
