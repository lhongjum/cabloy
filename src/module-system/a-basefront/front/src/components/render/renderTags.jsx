export default {
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {
      tagsAll: null,
    };
  },
  computed: {
    atomClass() {
      return {
        module: this.context.data.module,
        atomClassName: this.context.data.atomClassName,
      };
    },
  },
  created() {
    this.loadTagsAll(this.context.data.atomLanguage);
  },
  methods: {
    combineAtomClassAndLanguage(language) {
      const queries = {
        module: this.atomClass.module,
        atomClassName: this.atomClass.atomClassName,
      };
      if (language) {
        queries.language = language;
      }
      return queries;
    },
    async loadTagsAll(language) {
      this.tagsAll = await this.$store.dispatch('a/base/getTags', {
        atomClass: this.atomClass,
        language,
      });
    },
    adjustTags(tags) {
      if (!this.tagsAll || !tags) return '';
      tags = JSON.parse(tags);
      tags = tags.map(tagId => {
        const tag = this.tagsAll.find(_item => _item.id === tagId);
        return tag ? tag.tagName : '';
      });
      return tags.join(',');
    },
    async onChooseTags(event) {
      const { data } = this.context;
      const action = {
        actionModule: 'a-base',
        actionComponent: 'action',
        name: 'selectLocale',
        targetEl: event.target,
      };
      let language;
      if (data.atomLanguage) {
        language = data.atomLanguage;
      } else {
        const locale = await this.$meta.util.performAction({ ctx: this, action, item: data });
        if (locale) {
          language = locale.value;
          data.atomLanguage = locale.value;
        }
      }
      if (language) {
        await this.loadTagsAll(language);
      }
      return new Promise(resolve => {
        const url = this.$meta.util.combineQueries('/a/basefront/tag/select', this.combineAtomClassAndLanguage(language));
        this.$view.navigate(url, {
          target: '_self',
          context: {
            params: {
              tags: data.atomTags,
            },
            callback: (code, tags) => {
              if (code === 200) {
                this.$set(data, 'atomTags', tags ? JSON.stringify(tags) : null);
                resolve(true);
              } else if (code === false) {
                resolve(false);
              }
            },
          },
        });
      });
    },
  },
  render() {
    const { data, dataPath, property, validate } = this.context;
    const title = this.context.getTitle();
    if (validate.readOnly || property.ebReadOnly) {
      return (
        <f7-list-item title={title}>
          <div slot="after">{this.adjustTags(data.atomTags)}</div>
        </f7-list-item>
      );
    }
    return (
      <eb-list-item-choose
        link="#" dataPath={dataPath} title={title} propsOnChoose={this.onChooseTags}>
        <div slot="after">{this.adjustTags(data.atomTags)}</div>
      </eb-list-item-choose>
    );
  },
};
