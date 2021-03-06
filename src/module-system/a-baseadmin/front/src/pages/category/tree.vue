<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="pageTitle" eb-back-link="Back"></eb-navbar>
    <eb-treeview ref="tree" :root="root" :onLoadChildren="onLoadChildren" @node:click="onNodeClick">
      <div class="category-node" slot="root-end" slot-scope="{node}">
        <eb-link class="category-action" :context="node" :onPerform="onPerformAdd">{{$text('Add')}}</eb-link>
        <eb-link class="category-action" v-if="node.id>0" :context="node" :onPerform="onPerformMove">{{$text('Move')}}</eb-link>
        <eb-link class="category-action" v-if="node.id>0" :context="node" :onPerform="onPerformDelete">{{$text('Delete')}}</eb-link>
      </div>
    </eb-treeview>
  </eb-page>
</template>
<script>
export default {
  data() {
    const query = this.$f7route.query;
    const atomClass = {
      module: query.module,
      atomClassName: query.atomClassName,
    };
    const language = query.language;
    const languageTitle = query.languageTitle;
    return {
      atomClass,
      language,
      languageTitle,
      root: {
        attrs: {
          itemToggle: false,
          selectable: true,
        },
      },
    };
  },
  computed: {
    pageTitle() {
      const title = this.$text('Categories');
      if (!this.language) return title;
      return `${title}: ${this.languageTitle}`;
    },
  },
  mounted() {
    this.$meta.eventHub.$on('category:save', this.onCategorySave);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('category:save', this.onCategorySave);
  },
  methods: {
    combineAtomClassAndLanguage() {
      const queries = {
        module: this.atomClass.module,
        atomClassName: this.atomClass.atomClassName,
      };
      if (this.language) {
        queries.language = this.language;
      }
      return queries;
    },
    async onLoadChildren(node) {
      // root
      if (node.root) {
        return [{
          id: 0,
          attrs: {
            link: '#',
            label: this.$text('Root'),
            toggle: true,
            loadChildren: true,
          },
          data: {
            id: 0,
            categoryCatalog: 1,
          },
        }];
      }
      // children
      const data = await this.$api.post('/a/base/category/children', {
        atomClass: this.atomClass,
        language: this.language,
        categoryId: node.id,
      });
      const list = data.list.map(item => {
        const node = {
          id: item.id,
          attrs: {
            link: '#',
            label: item.categoryName || `[${this.$text('New Category')}]`,
            toggle: item.categoryCatalog === 1,
            loadChildren: item.categoryCatalog === 1,
          },
          data: item,
        };
        return node;
      });
      return list;
    },
    onNodeClick(e, node) {
      if (!node.id) return;
      const queries = this.combineAtomClassAndLanguage();
      queries.categoryId = node.id;
      const url = this.$meta.util.combineQueries('/a/baseadmin/category/edit', queries);
      this.$view.navigate(url);
    },
    async onPerformAdd(event, node) {
      const categoryId = node.data.id;
      const categoryName = await this.$view.dialog.prompt(this.$text('Please specify the category name'));
      if (!categoryName) return;
      await this.$api.post('/a/base/category/add', {
        atomClass: this.atomClass,
        data: {
          categoryName,
          language: this.language,
          categoryIdParent: categoryId,
        },
      });
      this.reloadNode(node, {
        attrs: {
          toggle: true,
          loadChildren: true,
        },
      });
    },
    async onPerformDelete(event, node) {
      await this.$view.dialog.confirm();
      await this.$api.post('/a/base/category/delete', {
        categoryId: node.data.id,
      });
      this.reloadNode(node.parent);
    },
    onPerformMove(event, node) {
      const categoryId = node.data.id;
      const url = this.$meta.util.combineQueries('/a/basefront/category/select', this.combineAtomClassAndLanguage());
      this.$view.navigate(url, {
        context: {
          params: {
            categoryIdDisable: categoryId,
          },
          callback: (code, data) => {
            if (code === 200) {
              if (!data) return;
              const categoryIdParent = data.id;
              if (node.data.categoryIdParent === categoryIdParent) return;
              this.$api.post('/a/base/category/move', { categoryId, categoryIdParent })
                .then(() => {
                  this.reloadNode(this.findNode(node.data.categoryIdParent));
                  this.reloadNode(this.findNode(categoryIdParent), {
                    attrs: {
                      toggle: true,
                      loadChildren: true,
                    },
                  });
                });
            }
          },
        },
      });
    },
    reloadNode(node, nodeNew) {
      if (!node) return;
      this.$refs.tree.reloadNode(node, nodeNew);
    },
    findNode(id) {
      return this.$refs.tree.find(null, node => node.id === id);
    },
    onCategorySave(data) {
      if (data.atomClass.module !== this.atomClass.module) return;
      const node = this.findNode(data.categoryIdParent);
      this.reloadNode(node);
    },
  },
};

</script>
<style lang="less" scoped>
.category-node {
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;

  .category-action+.category-action {
    margin-left: 4px;
  }
}

</style>
