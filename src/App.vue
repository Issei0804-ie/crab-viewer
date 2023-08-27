<script setup lang="ts">
import Sample from "./components/Sample.vue";
import {ref} from "vue";

const host = ref("localhost");
const port = ref("3306");
const database = ref("sample");
const user = ref("root");
const password = ref("password");
const tableName = ref("sample");
</script>

<template>
  <main>
    <div class="input-container">
      <div class="input-row">
        <label for="host">Host</label>
        <input type="text" v-model="host"/>
      </div>

      <div class="input-row">
        <label for="port">Port</label>
        <input type="text" v-model="port"/>
      </div>

      <div class="input-row">
        <label for="database">Database</label>
        <input type="text" v-model="database"/>
      </div>

      <div class="input-row">
        <label for="user">User</label>
        <input type="text" v-model="user"/>
      </div>

      <div class="input-row">
        <label for="password">Password</label>
        <input type="text" v-model="password"/>
      </div>

      <div class="input-row">
        <label for="tableName">TableName</label>
        <input type="text" v-model="tableName"/>
      </div>
    </div>
    <sample
    :host="host"
    :port="Number(port)"
    :database="database"
    :user="user"
    :password="password"
    :tableName="tableName"
    />

  </main>
</template>

<style scoped lang="scss">
@import "reset.css";
main {
  width: 100dvw;
  height: 100dvh;
}
.input-container {
  padding-top: 24px;
  .input-row {
    label {
      display: inline-block;
      width: 100px;
    }
  }
}
</style>
