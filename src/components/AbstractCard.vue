<template>
  <div> <!-- root -->
    <div>
      <div class="paper-title">
        <a @click="setArticleAsQuery(pmid)" class="epmc_citation_link">{{title}}</a>
      </div>

      <div @mouseup="selectText" class="paper-authors"
           @mouseover="showAuthorsToggle=true"
           @mouseout="showAuthorsToggle=false"
      >
        <span
          v-show="!showFullAuthors"
          class="paper-author">{{authorShort}}
          <span class="paper-show-more-or-less"
                v-show="!noMoreAuthors && showAuthorsToggle"
                @click="showFullAuthors=!showFullAuthors">
            [Show all {{totalAuthors}} authors]
          </span>
        </span>
        <span
          v-show="showFullAuthors"
          class="paper-author">{{author}}
          <span class="paper-show-more-or-less"
                v-show="showAuthorsToggle"
                @click="showFullAuthors=!showFullAuthors">
            [Show compact]
          </span>
        </span>

        <q-context-menu ref="selectedText">
          <selection-tooltip @addSelectionToQuery="addSelectionToQuery"
                             @setSelectionAsQuery="setSelectionAsQuery"
                             @addSelectionToFilter="addFilter"
                             :selection="selectedText"
          ></selection-tooltip>
        </q-context-menu>
      </div>

      <div class="paper-journal">
        <span class="paper-journal-abbrev">{{journal}}</span>
        <span class="paper-year">{{year}}</span>
        <span class="paper-volume">{{volume}}</span>
        <span class="paper-issue">{{issue}}</span>
        <span class="paper-pages">{{pages}}</span>
      </div>

      <!--<div class="paper-pmid">PMID: {{pmid}}</div>-->

      <!-- Pills with more details -->
      <span v-show="showFull==false && abstractText" @click="showFull=true" class="paper-show-more-or-less">[Show abstract]</span>
      <span v-show="!abstractText" class="paper-show-more-or-less inactive">[No abstract available]</span>
      <span v-show="showFull==true" @click="showFull=false" class="paper-show-more-or-less">[Hide abstract]</span>

      <span v-show="showSimilar==false" @click="showSimilar=true; searchSimilar();" class="paper-show-more-or-less">[Show similar articles]</span>
      <span v-show="showSimilar==true" @click="showSimilar=false" class="paper-show-more-or-less">[Hide similar articles]</span>

      <!-- Abstract -->
      <div class="subsection" v-show="showFull">
        <div @contextmenu="selectText" class="paper-abstract-full">
        <!--<div @mouseup="selectAbstractText" class="paper-abstract-full">-->
          <span class="abstract">{{abstractText}}</span>
          <q-context-menu ref="selectedText">
            <selection-tooltip @addSelectionToQuery="addSelectionToQuery"
                               @setSelectionAsQuery="setSelectionAsQuery"
                               @addSelectionToFilter="addFilter"
                               :selection="selectedText"
            ></selection-tooltip>
          </q-context-menu>

        </div>
      </div>

      <!-- Similar articles -->
      <div class="subsection" v-show="showSimilar">
        <div class="subsection-title">Similar articles</div>
        <div v-show="loadingSimilarArticles"><i class="fa fa-spinner fa-spin"></i></div>
        <div class="similar-paper" v-for="similarPaper in similar">
          <div @click="setArticleAsQuery(similarPaper.pmid)" class="similar-paper-title">
            {{similarPaper.title}}
          </div>
          <div>{{similarPaper.authors}}</div>
          <div>{{similarPaper.ref}}</div>
        </div>
      </div>


    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import selectionTooltip from './SelectionTooltip.vue';

  /* eslint no-underscore-dangle: 0 */
  export default {
    name: 'abstract-card',
    props: ['abstract'],
    components: {
      'selection-tooltip': selectionTooltip,
    },
    data() {
      return {
        // Authors
        showAuthorsToggle: false,
        showFullAuthors: false,
        noMoreAuthors: false,

        // Abstract
        showFull: false,

        // Similar articles
        showSimilar: false,
        similar: [],
        loadingSimilarArticles: false,

        // Selection
        selectedText: '',
      };
    },
    methods: {
      setArticleAsQuery(who) {
        this.setSelectionAsQuery(who);
      },
      addFilter() {
        console.log('adding filter...');
        this.$emit('addFilter', {
          type: 'selection',
          term: this.selectedText,
        });
      },
      setSelectionAsQuery(what) {
        this.$emit('setFilterAsQuery', {
          luceneQuery: `"${what}"`,
        });
      },
      addSelectionToQuery(what) {
        this.$emit('addSelectionToQuery', {
          luceneQuery: `"${what}"`,
        });
      },
      selectText() {
        const selection = window.getSelection();
        this.selectedText = selection.toString();
      },
      searchSimilar() {
        // this.$refs.paperDetails.open();

        // Don't load the similar articles more than once
        if (this.similar.length) {
          return;
        }

        this.loadingSimilarArticles = true;
        const vueCtx = this;
        const url = `https://qkorhkwgf1.execute-api.eu-west-1.amazonaws.com/dev/document-more-like-this/${this.abstract._id}`;
        axios.get(url)
          .then((resp) => {
            /* eslint no-param-reassign: 0 */
            vueCtx.loadingSimilarArticles = false;
            this.similar = resp.data.hits.hits.map((p) => {
              p.title = p._source.title;
//              if (p.title.length > 120) {
//                p.title = `${p.title.substr(0, 120)}...`;
//              }
              const authorNames = p._source.authors.map((d) => d.short_name);
              if (authorNames.length === 1) {
                return authorNames[0];
              }
              if (authorNames.length === 2) {
                return authorNames.join(' and ');
              }
              p.authors = `${authorNames.slice(0, 1)} et al`;

              p.ref = `${p._source.journal.medlineAbbreviation} ${new Date(p._source.pub_date).getFullYear()}`;
              p.europePmcLink = `//europepmc.org/abstract/med/${p._id}`;
              p.pmid = p._id;
              return p;
            });
          });
      },
    },
    computed: {
      title() {
        return this.abstract._source.title;
      },
      epmcLink() {
        return `//europepmc.org/abstract/med/${this.abstract._id}`;
      },
      totalAuthors() {
        return this.abstract._source.authors.length;
      },
      authorShort() {
        if (!this.abstract._source.authors || !this.abstract._source.authors.length) {
          return '';
        }
        const authorNames = this.abstract._source.authors.map((d) => d.short_name);
        if (authorNames.length === 1) {
          this.noMoreAuthors = true;
          return authorNames[0];
        }
        if (authorNames.length === 2) {
          this.noMoreAuthors = true;
          return authorNames.join(' and ');
        }
        return `${authorNames[0]} et al.`;
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
    &.inactive {
      color: inherit;
      cursor: text;
    }
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

  .similar-paper {
    margin-bottom: 10px;
    .similar-paper-title {
      color: #2e9dfd;
      cursor: pointer;
    }
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

  .subsection {
    margin-top: 20px;
    font-size: 0.8em;
    color: #333333;
    >.subsection-title {
      font-size: 1em;
      margin-bottom: 10px;
    }
  }

  /*.selectedWordTitle {*/
    /*padding: 5px;*/
    /*background: #dddddd;*/
    /*vertical-align: baseline;*/
    /*.actions {*/
      /*top: 2px;*/
      /*right: 0px;*/
      /*padding-left: 5px;*/
      /*display: inline-block;*/
      /*vertical-align: baseline;*/
      /*> .action-item {*/
        /*padding-right: 1px;*/
        /*padding-top: 2px;*/
        /*padding-bottom: 2px;*/
        /*cursor: pointer;*/
        /*> i {*/
          /*vertical-align: baseline;*/
        /*}*/
      /*}*/
    /*}*/
  /*}*/
</style>
