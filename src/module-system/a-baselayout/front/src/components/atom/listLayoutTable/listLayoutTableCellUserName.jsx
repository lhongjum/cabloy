export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    layout: {
      type: Object,
    },
    layoutItems: {
      type: Object,
    },
    info: {
      type: Object,
    },
  },
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
  },
  render() {
    return (
      <div>
        <img class="avatar avatar24 eb-vertical-align" src={this.layoutItems._getItemMetaMedia(this.info.record)} />
        <span>&nbsp;{this.info.text}</span>
      </div>
    );
  },
};
