<template>
  <div> <!-- root -->
    <div class="ots-timeline"></div>
  </div>
</template>

<script>
  import * as d3 from 'd3';

  const yearRange = [2002, 2016];
  const height = 50;

  export default {
    name: 'trend-timeline',
    props: ['trend', 'width', 'height', 'last'],
    computed: {
      term() {
        const term = Object.keys(this.trend)[0];
        return term;
      },
    },
    methods: {
      complete(data) {
        const dataObj = {};
        data.forEach((y) => {
          const year = Object.keys(y)[0];
          dataObj[year] = {
            year,
            value: y[year],
          };
        });

        const newData = [];
        for (let year = yearRange[0]; year <= yearRange[1]; year += 1) {
          newData.push(dataObj[year] || {
            year,
            value: 0,
          });
        }
        return newData;
      },
    },
    mounted() {
      if (!this.width) {
        return;
      }
      const container = this.$el.querySelector('.ots-timeline');
      // const width = this.$el.clientWidth - 20;
      const width = this.width - 20;
      // const height = this.$el.clientHeight;
      const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', this.last ? (height + 50) : height)
        .append('g');

      const data = this.complete(this.trend[Object.keys(this.trend)[0]].term_counts);

      const xScale = d3.scaleTime()
        .domain([new Date(2002, 0, 1), new Date(2016, 12, 31)])
        .range([0, width]);

      // Calculate the extent of values
      const valsExtent = d3.extent(data, (d) => d.value);
      const yScale = d3.scaleLinear()
        .domain(valsExtent)
        .range([height - 2, 2]);

      const line = d3.line()
        .x((d) => xScale(new Date(d.year, 1, 1)))
        .y((d) => yScale(d.value))
        .curve(d3.curveMonotoneX);

      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', line);

      // label
      svg.append('text')
        .attr('class', 'trend-title')
        .attr('x', 0)
        .attr('y', 10)
        .text(this.term);

      // Axis
      if (this.last) {
        svg
          .append('g')
          .attr('transform', `translate(0,${height + 20})`)
          .attr('class', 'axis')
          .call(d3.axisBottom(xScale));
      }
    },
  };
</script>

<style lang="scss">
  .ots-timeline {
    cursor: pointer;
    .trend-title {
      font-size: 0.8em;
    }
  }
  .axis {
    path, line, text {
      stroke: #aaaaaa;
    }
  }
</style>
