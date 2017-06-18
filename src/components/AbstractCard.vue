<template>
  <div> <!-- root -->
    <div>
      <div class="paper-title">
        <a class="epmc_citation_link" target=_blank :href="epmcLink">{{title}}</a>
      </div>
      <div class="paper-authors">
        <span class="paper-author">{{author}}</span>
        <!--<span class="paper-author" v-for="author in authors">{{author.short_name}}</span>-->
      </div>
      <div class="paper-journal">
        <span class="paper-journal-abbrev">{{journal}}</span>
        <span class="paper-year">{{year}}</span>
        <span class="paper-volume">{{volume}}</span>
        <span class="paper-issue">{{issue}}</span>
        <span class="paper-pages">{{pages}}</span>
      </div>

      <div class="paper-pmid">PMID: {{pmid}}</div>

      <div v-show="!showFull">
        <div class="paper-abstract-short">
          Abstract: {{abstractTextShort}}
        </div>
        <div class="paper-show-more-or-less"><span @click="showMore()">[Show more]</span></div>
      </div>

      <div v-show="showFull">
        <div class="paper-abstract-full">
          Abstract: {{abstractText}}
        </div>
        <div class="paper-show-more-or-less"><span @click="showLess()">[Show less]</span></div>
      </div>

    </div>
  </div>
</template>

<script>
  /* eslint no-underscore-dangle: 0 */
  export default {
    name: 'abstract-card',
    props: ['abstract'],
    data() {
      return {
        showFull: false,
      };
    },
    methods: {
      showMore() {
        this.showFull = true;
      },
      showLess() {
        this.showFull = false;
      },
    },
    computed: {
      title() {
        return this.abstract._source.title;
      },
      epmcLink() {
        return `//europepmc.org/abstract/med/${this.abstract._id}`;
      },
      author() {
        if (!this.abstract._source.authors || !this.abstract._source.authors.length) {
          return '';
        }
        const authorNames = this.abstract._source.authors.map((d) => d.short_name);
        if (authorNames.length === 1) {
          return authorNames[0];
        }
        if (authorNames.length === 2) {
          return authorNames.join(' and ');
        }
        return `${authorNames.slice(0, authorNames.length - 1).join(', ')} and ${authorNames[authorNames.length - 1]}`;
      },
      authors() {
        return this.abstract._source.authors;
      },
      journal() {
        return this.abstract._source.journal.medlineAbbreviation;
      },
      year() {
        return new Date(this.abstract._source.pub_date).getFullYear();
      },
      volume() {
        return this.abstract._source.journal_reference.volume || '';
      },
      issue() {
        return this.abstract._source.journal_reference.issue ?
          `(${this.abstract._source.journal_reference.issue})` : '';
      },
      pages() {
        return this.abstract._source.journal_reference.pgn || '';
      },
      abstractText() {
        return this.abstract._source.abstract;
      },
      abstractTextShort() {
        if (!this.abstract._source.abstract) {
          return '';
        }
        return this.abstract._source.abstract.substring(0, 200);
      },
      pmid() {
        return this.abstract._id;
      },
    },
  };
</script>

<style lang="scss">
  $lighter-color: #777777;
  .paper-show-more-or-less {
    color: #2e9dfd;
    font-size: 0.8em;
    cursor: pointer;
  }

  .paper-pmid {
    font-size: 0.8em;
    color: $lighter-color;
    margin-bottom: 1em;
  }

  .paper-authors {
    margin-top: 0.5em;
  }

  .paper-journal {
    .paper-year {
      font-weight: bold;
      margin-left: 5px;
      margin-right: 5px;
    }
    font-size: 0.8em;
    margin-top: 0.2em;
    margin-bottom: 0.2em;
  }

  .paper-abstract-short {
    position: relative;
  }
  .paper-abstract-short:before {
    position: absolute;
    bottom: 0;
    height: 100%;
    width: 100%;
    content: "";
    background: linear-gradient(to top,
      rgba(255, 255, 255, 1) 10%,
      rgba(255, 255, 255, 0) 90%
    );
    pointer-events: none; /* so the text is still selectable */
  }
</style>
