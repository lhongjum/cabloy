export default {
  meta: {
    global: false,
  },
  methods: {
    async onAction({ ctx, action, item }) {
      if (action.name === 'preview') {
        return await this.onAction_preview({ ctx, action, item });
      }
    },
    async onAction_preview({ ctx, action }) {
      // value
      const res = await ctx.$api.post('/a/instance/instance/getConfigsPreview');
      // taget
      let target = ctx.$meta.util.getProperty(action, 'navigateOptions.target');
      if (target === undefined) target = '_self';
      // navigate
      ctx.$view.navigate(`/a/basefront/json/editor?t=${Date.now()}`, {
        target,
        context: {
          params: {
            value: res.data,
            title: ctx.$text('Preview'),
            readOnly: true,
          },
        },
      });
    },
  },
};
