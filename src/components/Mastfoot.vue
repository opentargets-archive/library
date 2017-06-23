<template>
  <div class="toolbar">
    <q-toolbar-title :padding="1">
      <span class="open-targets">OpenTargets</span> | {{name}}
    </q-toolbar-title>
  </div>
</template>
<script type="text/javascript">
  import name from '../services/name';

  export default {
    data() {
      return {
        name,
      };
    },
  };
</script>
<style scoped>
  /*.toolbar{*/
    /*min-height: 60px;*/
  /*}*/
  /*.right-items a, .right-items button{*/
    /*margin-right: 10px;*/
  /*}*/
</style>
