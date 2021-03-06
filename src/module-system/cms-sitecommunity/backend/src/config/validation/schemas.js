module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const schemas = {};
  // post
  schemas.post = {
    type: 'object',
    properties: {
      atomId: {
        type: 'number',
      },
      // title
      groupTitle: {
        type: 'null',
        ebType: 'group-flatten',
        ebTitle: 'Title',
      },
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Atom Name',
        notEmpty: true,
      },
      // content
      groupContent: {
        type: 'null',
        ebType: 'group-flatten',
        ebTitle: 'Content',
      },
      content: {
        type: 'string',
        ebType: 'component',
        ebTitle: 'Content',
        ebRender: {
          module: 'a-cms',
          name: 'renderArticleContent',
        },
      },
      // Basic Info
      groupBasicInfo: {
        type: 'null',
        ebType: 'group-flatten',
        ebTitle: 'Basic Info',
        ebGroupWhole: true,
      },
      atomLanguage: {
        type: 'string',
        ebType: 'language',
        ebTitle: 'Language',
        notEmpty: true,
      },
      atomCategoryId: {
        type: 'number',
        ebType: 'category',
        ebTitle: 'Category',
        notEmpty: true,
      },
      atomTags: {
        type: [ 'string', 'null' ],
        ebType: 'tags',
        ebTitle: 'Tags',
      },
    },
  };
  // post search
  schemas.postSearch = {
    type: 'object',
    properties: {
      content: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Content',
      },
    },
  };
  return schemas;
};
