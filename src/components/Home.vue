<template>
  <div><!-- Root -->
     <div class="salute vertical-middle" style="width:500px">
      <h5>Welcome to Open Targets | Library</h5>
      <div class="subheader">This site allows to mine all the Pubmed articles.</div>
      <div>Some tips:</div>
      <div>
        <ul>
          <li class="tip">You can search for multiple terms joining them with <span class="keyword">AND</span>, for example: <span class="keyword">BRAF AND melanoma</span></li>
          <li class="tip">If a term has more than one word, use quotes. For example: <span class="keyword">"Alzheimer disease"</span></li>
          <li class="tip">Use quotes as well if the term has non alpha-numerical values. For example: <span class="keyword">"K-RAS"</span></li>
        </ul>
      </div>
      <div>
        This site is currently under development.
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'home',
  };
</script>
