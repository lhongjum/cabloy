<template>
  <eb-page>
    <eb-navbar :title="$text('Comment')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="save" :onPerform="onPerformSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <template v-if="ready">
      <eb-box>
        <mavon-editor ref="editor" :value="content" :onPreRender="onPreRender" @change="onChange" @save="onSave" :onImageUpload="onImageUpload" :language="language" :subfield="subfield" :editable="editable" :defaultOpen="defaultOpen" :toolbarsFlag="toolbarsFlag" :navigation="navigation" :toolbars="toolbars" />
      </eb-box>
    </template>
  </eb-page>
</template>
<script>
export default {
  meta: {
    size: 'medium',
  },
  data() {
    return {
      atomId: parseInt(this.$f7route.query.atomId),
      commentId: parseInt(this.$f7route.query.commentId || 0),
      replyId: parseInt(this.$f7route.query.replyId || 0),
      module: null,
      comment: null,
      reply: null,
      content: '',
    };
  },
  computed: {
    ready() {
      return this.module && (this.commentId === 0 || this.comment) && (this.replyId === 0 || this.reply);
    },
    readOnly() {
      return false;
    },
    editable() {
      return !this.readOnly;
    },
    language() {
      const locale = this.$meta.util.getLocale();
      return locale === 'zh-cn' ? 'zh-CN' : 'en';
    },
    subfield() {
      return this.editable && this.$view.size !== 'small';
    },
    defaultOpen() {
      return this.editable ? '' : 'preview';
    },
    toolbarsFlag() {
      return this.editable;
    },
    navigation() {
      return !this.editable;
    },
    toolbars() {
      return {
        bold: true, // 粗体
        italic: true, // 斜体
        // header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        // quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        /* 1.4.2 */
        // navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
      };
    },

  },
  created() {
    this.$meta.module.use('a-mavoneditor', module => {
      this.module = module;
    });
    this.loadComment(this.commentId);
    this.loadReply(this.replyId);
  },
  methods: {
    loadComment(commentId) {
      if (!commentId) return;
      this.$api.post('/a/base/comment/item', {
        key: { atomId: this.atomId },
        data: { commentId },
      }).then(data => {
        this.comment = data;
        this.content = this.comment.content;
      });
    },
    loadReply(replyId) {
      if (!replyId) return;
      this.$api.post('/a/base/comment/item', {
        key: { atomId: this.atomId },
        data: { commentId: replyId },
      }).then(data => {
        this.reply = data;
      });
    },
    onChange(data) {
      this.content = data;
    },
    onSave() {
      this.onPerformSave();
    },
    onPerformSave() {
      if (!this.content) return;
      return this.$api.post('/a/base/comment/save', {
        key: { atomId: this.atomId },
        data: {
          commentId: this.commentId,
          replyId: this.replyId,
          content: this.content,
        },
      }).then(data => {
        this.$meta.eventHub.$emit('comment:action', data);
        const returnTo = this.$f7route.query.returnTo;
        if (returnTo) {
          location.assign(returnTo);
        } else {
          this.$f7router.back();
        }
      });
    },
    onImageUpload() {
      return new Promise((resolve, reject) => {
        this.$view.navigate('/a/file/file/upload', {
          context: {
            params: {
              mode: 1,
              atomId: this.atomId,
              flag: 'comment',
            },
            callback: (code, data) => {
              if (code === 200) {
                resolve({ text: data.realName, addr: data.downloadUrl });
              }
              if (code === false) {
                reject();
              }
            },
          },
        });
      });
    },
    onPreRender(value) {
      if (this.comment) {
        return this.fullContent({
          content: value,
          replyContent: this.comment.replyContent,
          replyUserName: this.comment.replyUserName,
        });
      }
      if (this.reply) {
        // replyContent
        const replyContent = this.fullContent({
          content: this.reply.content,
          replyContent: this.reply.replyContent,
          replyUserName: this.reply.replyUserName,
        });
        return this.fullContent({
          content: value,
          replyContent,
          replyUserName: this.reply.userName,
        });
      }
      return value;
    },
    fullContent({ content, replyContent, replyUserName }) {
      if (!replyContent) return content;
      return `${content}

> \`${replyUserName}\`:

::: comment-quot
${replyContent}
:::

`;
    },
  },
};

</script>
