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
      <span v-show="showFull==false && abstractText" @click="showFull=true; showAbstract();" class="paper-show-more-or-less">[Show abstract]</span>
      <span v-show="!abstractText" class="paper-show-more-or-less inactive">[No abstract available]</span>
      <span v-show="showFull==true" @click="showFull=false" class="paper-show-more-or-less">[Hide abstract]</span>

      <span v-show="showSimilar==false" @click="showSimilar=true; searchSimilar();" class="paper-show-more-or-less">[Show similar articles]</span>
      <span v-show="showSimilar==true" @click="showSimilar=false" class="paper-show-more-or-less">[Hide similar articles]</span>

      <!-- Abstract -->
      <div class="subsection" v-show="showFull">
        <div v-show="loadingAbstract"><i class="fa fa-spinner fa-spin"></i></div>
        <div @contextmenu="selectText" class="paper-abstract-full">
        <!--<div @mouseup="selectAbstractText" class="paper-abstract-full">-->
          <!--<span class="abstract">{{abstractMarked}}</span>-->
          <span :id="abstractDomId" class="abstract"></span>
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
  import Vue from 'vue';
  import axios from 'axios';
  import selectionTooltip from './SelectionTooltip.vue';
  import apiBaseUrl from '../services/api';

  console.log(`apiBaseUrl... ${apiBaseUrl}`);
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
        loadingAbstract: false,
        abstractMarked: '',
        abstractDomId: '',

        // Similar articles
        showSimilar: false,
        similar: [],
        loadingSimilarArticles: false,

        // Selection
        selectedText: '',
      };
    },
    methods: {
      parseAuthor(d) {
        return `${d.LastName} ${d.Initials}`;
      },
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
      replaceMark(match) {
        if (match.startsWith('</')) {
          return '</span';
        }
        return `<span class="${match.substring(1)}"`;
      },
      showAbstract() {
        this.loadingAbstract = true;
        const vueCtx = this;
        this.abstractDomId = `abstract${this.abstract._id}`;
        const url = `${apiBaseUrl}/entity/markedtext/${this.abstract._id}`;
        axios.get(url)
          .then((resp) => {
            vueCtx.loadingAbstract = false;
            const parsed = resp.data.abstract.replace(/<\/?mark-\d+/g, this.replaceMark);
            new Vue({
              template: `<div>${parsed}</div>`,
            }).$mount(`#${this.abstractDomId}`);
          });
      },
      searchSimilar() {
        // this.$refs.paperDetails.open();

        // Don't load the similar articles more than once
        if (this.similar.length) {
          return;
        }

        this.loadingSimilarArticles = true;
        const vueCtx = this;
        const url = `${apiBaseUrl}/document-more-like-this/${this.abstract._id}`;
        axios.get(url)
          .then((resp) => {
            /* eslint no-param-reassign: 0 */
            vueCtx.loadingSimilarArticles = false;
            this.similar = resp.data.hits.hits.map((p) => {
              p.title = p._source.title;
//              if (p.title.length > 120) {
//                p.title = `${p.title.substr(0, 120)}...`;
//              }
              const authorNames = p._source.authors.map((d) => this.parseAuthor(d));
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
        const authorNames = this.abstract._source.authors.map((d) => this.parseAuthor(d));
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
        const authorNames = this.abstract._source.authors.map((d) => this.parseAuthor(d));
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

  /* Marks */
  .select-wrapper input.select-dropdown {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    -webkit-user-select: none;
  }

  .entities {
    line-height: 2;
    margin-bottom: 2em;
    padding: 0.25em 0.35em;
    margin: 0px 0.25em;
    /*      border-radius: 0.25em; */

  }

  .abstract {
    line-height: 2;
    margin-bottom: 2em;
    padding: 0.25em 0.35em;
    margin: 0px 0.25em;
    /*      border-radius: 0.25em; */

  }

  [data-entity] {
    padding: 0.25em 0.35em;
    margin: 0px 0.25em;
    line-height: 1;
    display: inline-block;
    border-radius: 0.25em;
    border: 1px solid;
  }

  [data-entity]::after {
    box-sizing: border-box;
    content: attr(data-entity) " | " attr(reference-db);
    font-size: 0.6em;
    line-height: 1;
    padding: 0.35em;
    border-radius: 0.35em;
    text-transform: uppercase;
    display: inline-block;
    vertical-align: middle;
    margin: 0px 0px 0.1rem 0.5rem;
  }

  [data-entity][data-entity="GENE"] {
    background: rgba(166, 226, 45, 0.2);
    border-color: rgb(166, 226, 45);
  }

  [data-entity][data-entity="GENE"]::after {
    background: rgb(166, 226, 45);
  }

  [data-entity][data-entity="TARGET"] {
    background: rgba(196, 146, 145, 0.2);
    border-color: rgb(196, 146, 145);
  }

  [data-entity][data-entity="TARGET"]::after {
    background: rgb(196, 146, 145);
  }

  [data-entity][data-entity="ORGANISM"] {
    background: rgba(224, 0, 132, 0.2);
    border-color: rgb(224, 0, 132);
  }

  [data-entity][data-entity="ORGANISM"]::after {
    background: rgb(224, 0, 132);
  }

  [data-entity][data-entity="DIAGNOSTICS"] {
    background: rgba(67, 198, 102, 0.2);
    border-color: rgb(67, 198, 102);
  }

  [data-entity][data-entity="DIAGNOSTICS"]::after {
    background: rgb(67, 198, 102);
  }

  [data-entity][data-entity="DISEASE"] {
    background: rgba(67, 198, 252, 0.2);
    border-color: rgb(67, 198, 252);
  }

  [data-entity][data-entity="DISEASE"]::after {
    background: rgb(67, 198, 252);
  }

  [data-entity][data-entity="CHEMICAL"] {
    background: rgba(253, 151, 32, 0.2);
    border-color: rgb(253, 151, 32);
  }

  [data-entity][data-entity="CHEMICAL"]::after {
    background: rgb(253, 151, 32);
  }

  [data-entity][data-entity="ANATOMY"] {
    background: rgba(253, 151, 32, 0.2);
    border-color: rgb(253, 151, 32);
  }

  [data-entity][data-entity="ANATOMY"]::after {
    background: rgb(253, 151, 32);
  }

  [data-entity][data-entity="NAMEDGROUP"] {
    background: rgba(142, 125, 255, 0.2);
    border-color: rgb(142, 125, 255);
  }

  [data-entity][data-entity="NAMEDGROUP"]::after {
    background: rgb(142, 125, 255);
  }

  [data-entity][data-entity="PROCESS"] {
    background: rgba(255, 204, 0, 0.2);
    border-color: rgb(255, 204, 0);
  }

  [data-entity][data-entity="PROCESS"]::after {
    background: rgb(255, 204, 0);
  }

  [data-entity][data-entity="PSICHIATRY"] {
    background: rgba(255, 204, 0, 0.2);
    border-color: rgb(255, 204, 0);
  }

  [data-entity][data-entity="PSICHIATRY"]::after {
    background: rgb(255, 204, 0);
  }

  [data-entity][data-entity="PHENOTYPE"] {
    background: rgba(255, 204, 0, 0.2);
    border-color: rgb(255, 204, 0);
  }

  [data-entity][data-entity="PHENOTYPE"]::after {
    background: rgb(255, 204, 0);
  }

  [data-entity][data-entity="INFORMATIONSCIENCE"] {
    background: rgba(47, 187, 171, 0.2);
    border-color: rgb(47, 187, 171);
  }

  [data-entity][data-entity="INFORMATIONSCIENCE"]::after {
    background: rgb(47, 187, 171);
  }

  [data-entity][data-entity="DISCIPLINE"] {
    background: rgba(47, 187, 171, 0.2);
    border-color: rgb(47, 187, 171);
  }

  [data-entity][data-entity="DISCIPLINE"]::after {
    background: rgb(47, 187, 171);
  }

  [data-entity][data-entity="ANTROPOLOGY"] {
    background: rgba(153, 153, 153, 0.2);
    border-color: rgb(153, 153, 153);
  }

  [data-entity][data-entity="ANTROPOLOGY"]::after {
    background: rgb(153, 153, 153);
  }

  [data-entity][data-entity="HUMANITIES"] {
    background: rgba(153, 153, 153, 0.2);
    border-color: rgb(153, 153, 153);
  }

  [data-entity][data-entity="HUMANITIES"]::after {
    background: rgb(153, 153, 153);
  }

  [data-entity][data-entity="HEALTHCARE"] {
    background: rgba(153, 153, 153, 0.2);
    border-color: rgb(153, 153, 153);
  }

  [data-entity][data-entity="HEALTHCARE"]::after {
    background: rgb(153, 153, 153);
  }

  [data-entity][data-entity="TECHNOLOGY"] {
    background: rgba(153, 153, 153, 0.2);
    border-color: rgb(153, 153, 153);
  }

  [data-entity][data-entity="TECHNOLOGY"]::after {
    background: rgb(153, 153, 153);

  }

  [data-entity][data-entity="PUBLICATION"] {
    background: rgba(153, 153, 53, 0.2);
    border-color: rgb(153, 153, 53);
  }

  [data-entity][data-entity="PUBLICATION"]::after {
    background: rgb(153, 153, 53);

  }

  [data-entity][data-entity="TARGET&DISEASE"] {
    background: rgba(105, 145, 243, 0.2);
    border-color: rgb(105, 145, 243);
    /*   display: inline; */
    border: 1px dashed;
  }

  [data-entity][data-entity="TARGET&DISEASE"]::after {
    background: rgb(105, 145, 243);

  }

  [data-entity][data-entity="PATHWAY"] {
    background: rgba(205, 85, 143, 0.2);
    border-color: rgb(205, 85, 143);
    /*   display: inline; */
    border: 1px dashed;
  }

  [data-entity][data-entity="PATHWAY"]::after {
    background: rgb(205, 85, 143);

  }

  [data-entity][data-entity="PROTEINCOMPLEX"] {
    background: rgba(87, 227, 81, 0.2);
    border-color: rgb(87, 227, 81);
  }

  [data-entity][data-entity="PROTEINCOMPLEX"]::after {
    background: rgb(87, 227, 81);
  }

  [data-entity][data-entity="LOC"] {
    background: rgba(180, 180, 180, 0.2);
    border-color: rgb(180, 180, 180);
  }

  [data-entity][data-entity="LOC"]::after {
    background: rgb(180, 180, 180);
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
