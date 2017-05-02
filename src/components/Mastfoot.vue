<template>
  <div class="toolbar">
    <q-toolbar-title :padding="1">
      OpenTargets Search v{{version}} -- Footer
    </q-toolbar-title>
    <div class="right-items">
      <a href="https://github.com/opentargets/search" class="text-white">
        <i class="fa fa-2x fa-github"></i>
      </a>
    </div>
  </div>
</template>
<script type="text/javascript">
  export default {
    data() {
      return {
        version: '0.0.1',
      };
    },
  };
</script>
<style scoped>
  .toolbar{
    min-height: 60px;
  }
  .right-items a, .right-items button{
    margin-right: 10px;
  }
</style>
