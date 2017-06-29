<template>
  <div class="toolbar">
    <q-toolbar-title :padding="1">
      <span class="open-targets">OpenTargets</span> | {{name}} <sup class="beta-tag bg-negative">{{version}}</sup>
    </q-toolbar-title>
    <div>
      <a href="https://github.com/opentargets/search" class="text-white">
        <i class="fa fa-2x fa-github"></i>
      </a>
    </div>
  </div>
</template>

<script type="text/javascript">
  import name from '../services/name';

  export default {
    name: 'masthead',
    data() {
      return {
        name,
        version: 'alpha',
      };
    },
  };
</script>

<style lang="scss">
  .open-targets {
    opacity: 0.8;
  }
  .beta-tag {
    font-size: 0.5em;
    font-weight: bold;
    padding: 3px;
  }
</style>
