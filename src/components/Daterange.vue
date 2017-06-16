<template>
  <div> <!-- Root -->
    <div class="row gutter justify-stretch content-center text-center">
      <div v-bind:style="{ 'margin-left': margin + 'px', width: usedWidth + 'px' }" class="date-range-container">
        <div id="date-range-histogram"></div>
        <div class="date-range">
          <q-double-range
            v-model="yearSelection"
            :min="minYear"
            :max="maxYear"
            :snap="snap"
            :labelAlways="label"
          ></q-double-range>
        </div>
      </div>
    </div>

    <div>
      <button class="primary">
        Apply <i class="on-right">done</i>
      </button>
    </div>

  </div> <!-- /Root -->
</template>

<script type="text/javascript">
  import { dropWhile, minBy, maxBy } from 'lodash';
  import * as d3 from 'd3';

  const height = 200;

  export default {
    name: 'date-range',
    props: ['data', 'width'],
    data() {
      return {
        svg: undefined,
        darkColor: '#027be3',
        lightColor: '#64b5f7',
        minYear: 2000,
        maxYear: 2016,
        snap: true,
        label: true,
        yearSelection: {
          min: 2000,
          max: 2016,
        },
      };
    },
    methods: {
      fillColor(d) {
        if ((d.year >= this.yearSelection.min) && (d.year <= this.yearSelection.max)) {
          return this.darkColor;
        }
        return this.lightColor;
      },
    },
    computed: {
      usedWidth() {
        /* eslint no-bitwise: 0 */
        return ~~(this.width * 0.8);
      },
      margin() {
        /* eslint no-bitwise: 0 */
        return ~~((this.width - (this.width * 0.8)) / 2) - 20;
      },
      minimalRange() {
        const range = dropWhile(this.data, (d, i) => (d.doc_count === 0 || i === 0));
        const rangeWithYear = range.map((d) => {
          /* eslint no-param-reassign: 0 */
          d.year = new Date(d.key).getFullYear();
          return d;
        });
        return rangeWithYear;
      },
    },
    watch: {
      yearSelection() {
        this.svg.selectAll('.counts-bar>rect')
          .attr('fill', this.fillColor);
      },
      data() {
        this.minYear = minBy(this.minimalRange, (y) => y.year).year;
        this.maxYear = maxBy(this.minimalRange, (y) => y.year).year;
        this.yearSelection.min = this.minYear;
        this.yearSelection.max = this.maxYear;

        // build the histogram (bar plot) for the date range...
        const margin = 100;
        let histWidth = this.usedWidth - 30;
        const xScale = d3.scaleLinear()
          .domain([this.minYear, this.maxYear + 1])
          .range([0, histWidth]);

        histWidth = (this.usedWidth - 30) + (xScale(this.maxYear) - xScale(this.maxYear - 1));
        xScale.range([0, histWidth]);

        const countsExtent = d3.extent(this.minimalRange, (d) => d.doc_count);
        const yScale = d3.scaleLinear()
          .domain(countsExtent)
          .range([0, height]);

        this.svg = d3.select('#date-range-histogram')
          .append('svg')
          .attr('width', histWidth + margin)
          .attr('height', height + margin)
          .append('g')
          .attr('transform', `translate(${margin / 2},${margin})`);

        const bars = this.svg.selectAll('.counts-bar')
          .data(this.minimalRange)
          .enter()
          .append('g')
          .attr('class', 'counts-bar')
          .attr('transform', (d) => `translate(${xScale(d.year)}, ${200 - yScale(d.doc_count)})`)
          /* eslint func-names: 0 */
          .on('mouseover', function () {
            d3.select(this).select('text')
              .style('display', 'inline-block');
          })
          .on('mouseout', function () {
            d3.select(this).select('text')
              .style('display', 'none');
          });

        bars
          .append('rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', (d) => xScale(d.year) - xScale(d.year - 1))
          .attr('height', (d) => yScale(d.doc_count))
          .attr('fill', this.fillColor)
          .attr('fill-opacity', 0.4)
          .attr('stroke-opacity', 0.4)
          .attr('stroke', this.darkColor);

        // tooltips
        bars
          .append('text')
          .attr('x', (d) => ~~((xScale(d.year) - xScale(d.year - 1)) / 2))
          .attr('y', -10)
          .attr('font-size', '10px')
          .attr('text-anchor', 'middle')
          .style('display', 'none')
          .text((d) => `${d.doc_count} ${d.doc_count > 1 ? 'documents' : 'document'} (${d.year})`);
      },
    },
  };
</script>

<style lang="scss">
  #date-range-histogram {
    margin-left: -50px;
  }
</style>
