<template>
  <div> <!-- root -->
    <div>
      <!-- Paper details in a modal -->
      <q-modal class="minimized" ref="paperDetails" :content-css="{padding: '50px'}">
        <h4>{{title}}</h4>
        <div class="paper-authors">
          <span class="paper-author">{{author}}</span>
        </div>
        <div class="paper-journal">
          <span class="paper-journal-abbrev">{{journal}}</span>
          <span class="paper-year">{{year}}</span>
          <span class="paper-volume">{{volume}}</span>
          <span class="paper-issue">{{issue}}</span>
          <span class="paper-pages">{{pages}}</span>
        </div>
        <div class="paper-pmid">PMID: <a target=_blank :href="epmcLink">{{pmid}}</a></div>

        <!-- similar papers -->
        <div>
          <h4>Similar articles</h4>
          <div v-show="loadingSimilarArticles"><i class="fa fa-spinner fa-spin"></i></div>
          <div class="similar-paper" v-for="similarPaper in similar">
            <h6><a target=_blank :href="similarPaper.europePmcLink">{{similarPaper._source.title}}</a></h6>
            <div>
              <div class="paper-authors">
                <span class="paper-author">{{similarPaper.refAuthors}}</span>
              </div>
            </div>
          </div>
        </div>
        <button class="primary" @click="$refs.paperDetails.close()">Ok</button>
      </q-modal>
      <!-- /Paper details -->

      <div @click="openAbstract" class="paper-title">
        <a class="epmc_citation_link">{{title}}</a>
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
        <div @contextmenu="selectWord" class="paper-abstract-full">
          Abstract: {{abstractText}}
          <q-context-menu ref="selectedWord">
            <div class="selectedWordTitle">
              {{selectedWord}}
              <span class="action-item remove" @click="$refs.selectedWord.close();$refs.selectedWordDiscard.close()">
                <i class="fa fa-remove">
                  <q-tooltip
                    ref="selectedWordDiscard"
                    anchor="center right"
                    self="center left"
                    :offset="[10, 0]"
                  > Discard this selection
                  </q-tooltip>
                </i>
              </span>

              <span class="action-item search" @click="addSelectionToQuery">
                <i class="fa fa-search-plus">
                  <q-tooltip
                    anchor="center right"
                    self="center left"
                    :offset="[10, 0]"
                  >Add selected text to the search query
                  </q-tooltip>
                </i>
              </span>

              <span class="action-item search" @click="setSelectionAsQuery">
                <i class="fa fa-search">
                  <q-tooltip
                    anchor="center right"
                    self="center left"
                    :offset="[10, 0]"
                  >Search for this text
                  </q-tooltip>
                </i>
              </span>
            </div>
            <!--<button @click="addWordToQuery" class="primary">Add to Query</button>-->
            <!--<button @click="$refs.context.close()" class="secondary">Discard</button>-->
          </q-context-menu>
        </div>
        <div class="paper-show-more-or-less"><span @click="showLess()">[Show less]</span></div>
      </div>

    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  /* eslint no-underscore-dangle: 0 */
  export default {
    name: 'abstract-card',
    props: ['abstract'],
    data() {
      return {
        showFull: false,
        similar: [],
        loadingSimilarArticles: false,
        selectedWord: '',
      };
    },
    methods: {
      setSelectionAsQuery() {
        this.$emit('setFilterAsQuery', {
          luceneQuery: this.selectedWord,
        });
      },
      addSelectionToQuery() {
        this.$emit('addSelectionToQuery', {
          luceneQuery: this.selectedWord,
        });
      },
      selectWord() {
        const selection = window.getSelection();
        this.selectedWord = selection.toString();
      },
      openAbstract() {
        this.$refs.paperDetails.open();

        this.loadingSimilarArticles = true;
        const vueCtx = this;
        const url = `https://qkorhkwgf1.execute-api.eu-west-1.amazonaws.com/dev/document-more-like-this/${this.abstract._id}`;
        axios.get(url)
          .then((resp) => {
            /* eslint no-param-reassign: 0 */
            vueCtx.loadingSimilarArticles = false;
            this.similar = resp.data.hits.hits.map((p) => {
              p.refAuthors = '';
              if (p._source.authors && p._source.authors.length) {
                const authorNames = this.abstract._source.authors.map((d) => d.short_name);
                if (authorNames.length === 1) {
                  p.refAuthors = authorNames[0];
                }
                else if (authorNames.length === 2) {
                  p.refAuthors = authorNames.join(' and ');
                }
                else {
                  p.refAuthors = `${authorNames.slice(0, authorNames.length - 1).join(', ')} and ${authorNames[authorNames.length - 1]}`;
                }
              }
              p.europePmcLink = `//europepmc.org/abstract/med/${p._id}`;
              return p;
            });
          });
      },
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

  .similar-paper {
    margin-bottom: 20px;
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
  .selectedWordTitle {
    padding: 5px;
    background: #dddddd;
    vertical-align: baseline;
    .actions {
      top: 2px;
      right: 0px;
      padding-left: 5px;
      display: inline-block;
      vertical-align: baseline;
      > .action-item {
        padding-right: 1px;
        padding-top: 2px;
        padding-bottom: 2px;
        cursor: pointer;
        > i {
          vertical-align: baseline;
        }
        /*&.search {*/
          /*background-color: #64b5f7;*/
        /*}*/
        /*&.remove {*/
          /*background-color: orange;*/
        /*}*/
      }
  }

  }
</style>
