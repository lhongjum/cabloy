<template>
  <f7-card>
    <f7-card-header>{{$text('Fruit Sales(Pie Chart)')}}</f7-card-header>
    <f7-card-content>
      <canvas ref="chart"></canvas>
      <div class="error" v-if="errorMessage">{{errorMessage}}</div>
    </f7-card-content>
  </f7-card>
</template>
<script>
const propsSchema = {
  type: 'object',
  properties: {
    dataSource: {
      type: 'object',
      ebType: 'text',
      ebTitle: 'Data Source',
      ebBindOnly: true,
      ebClue: 'salesDataSource',
    },
    season: {
      type: 'string',
      ebType: 'select',
      ebTitle: 'Season',
      ebOptions: [],
      ebOptionsBlankAuto: true,
      ebClue: 'salesSeason',
    },
  },
};

const attrsSchema = {
  type: 'object',
  properties: {
    snapshot: {
      ebTitle: 'Snapshot',
      ebClue: 'snapshot',
    },
  },
};

// export
export default {
  installFactory,
};

// installFactory
function installFactory(_Vue) {
  const Vue = _Vue;
  const ebDashboardWidgetBase = Vue.prototype.$meta.module.get('a-dashboard').options.mixins.ebDashboardWidgetBase;
  return {
    meta: {
      widget: {
        schema: {
          props: propsSchema,
          attrs: attrsSchema,
        },
      },
    },
    mixins: [ ebDashboardWidgetBase ],
    props: {
      dataSource: {
        type: Object,
      },
      season: {
        type: String,
      },
    },
    data() {
      return {
        chartjs: null,
        chart: null,
        snapshot: null,
        errorMessage: null,
      };
    },
    watch: {
      dataSource() {
        this.__updateChart();
        this.$emit('widget:propsSchemaChange');
      },
      season() {
        this.__updateChart();
      },
    },
    mounted() {
      this.__init();
    },
    beforeDestroy() {
      if (this.chart) {
        this.chart.destroy();
      }
    },
    methods: {
      getAttrsSchema() {
        const attrs = [];
        if (this.snapshot) {
          attrs.push('snapshot');
        }
        return attrs;
      },
      getPropsSchema() {
        const props = [ 'dataSource' ];
        if (this.dataSource) {
          props.push('season');
        }
        return props;
      },
      getPropSchemaExtra(propName) {
        // season
        if (propName === 'season') {
          if (!this.dataSource) return null;
          const ebOptions = this.dataSource.rows.map(item => {
            return { title: item, value: item };
          });
          return { ebOptions };
        }
        return null;
      },
      __init() {
        const action = {
          actionModule: 'a-chartjs',
          actionComponent: 'chartjs',
          name: 'instance',
        };
        this.$meta.util.performAction({ ctx: this, action }).then(chartjs => {
          this.chartjs = chartjs;
          this.__updateChart();
        });
      },
      __prepareData() {
        const seasonIndex = this.dataSource.rows.findIndex(item => item === this.season);
        if (seasonIndex === -1) throw new Error();
        const chartData = {
          labels: this.dataSource.cols.slice(0, 2),
          datasets: [{
            backgroundColor: this.dataSource.colors.slice(0, 2),
            data: this.dataSource.dataset[seasonIndex].slice(0, 2),
          }],
        };
        return chartData;
      },
      __prepareOptions() {
        const chartOptions = {
          maintainAspectRatio: false,
          responsive: true,
          animation: {
            onComplete: () => {
              this.__createSnapshot();
            },
          },
          title: {
            display: true,
            position: 'top',
            text: this.season,
            fontColor: 'rgba(128, 128, 128, 0.6)',
          },
          legend: {
            display: true,
            position: 'left',
            labels: {
              fontColor: 'rgba(128, 128, 128, 0.6)',
            },
          },
        };
        return chartOptions;
      },
      __createSnapshot() {
        const image = this.chart.toBase64Image();
        this.snapshot = {
          title: this.$text('Fruit Sales(Pie Chart)'),
          image,
        };
      },
      __clearChart() {
        this.snapshot = null;
        if (this.chart) {
          this.chart.clear();
        }
      },
      __updateChart() {
        try {
          if (!this.dataSource || !this.season) {
            this.__clearChart();
            this.errorMessage = this.$text('Please set data source');
            return;
          }
          const chartData = this.__prepareData();
          const chartOptions = this.__prepareOptions();
          if (!this.chart) {
            // canvas
            const chartCanvas = this.$refs.chart.getContext('2d');
            // fill
            this.chart = new this.chartjs(chartCanvas, {
              type: 'doughnut',
              data: chartData,
              options: chartOptions,
            });
          } else {
            this.chart.data = this.__prepareData();
            this.chart.options = this.__prepareOptions();
            this.chart.update();
          }
          this.errorMessage = null;
          return;
        } catch (err) {
          this.__clearChart();
          this.errorMessage = this.$text('There may be a binding error');
        }
      },
    },
  };

}

</script>
<style lang="less" scoped>
.error {
  position: absolute;
  bottom: 6px;
  right: 6px;
  font-size: smaller;
}

</style>
