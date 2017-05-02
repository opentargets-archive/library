<template>
  <div class="toolbar">
    <q-toolbar-title :padding="1">
      OpenTargets Search v{{version}}
    </q-toolbar-title>
  </div>
</template>

<script type="text/javascript">
  export default {
    name: 'masthead',
    data() {
      return {
        version: '0.0.1',
      };
    },
  };
</script>
