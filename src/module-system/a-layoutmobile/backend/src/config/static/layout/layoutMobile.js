module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    toolbar: {
      buttons: [
        { module: 'a-layoutmobile', name: 'buttonHome' },
        { module: 'a-layoutmobile', name: 'buttonAtom' },
        { module: 'a-layoutmobile', name: 'buttonMine' },
      ],
    },
  };
  const layout = {
    atomName: 'Mobile Layout',
    atomStaticKey: 'layoutMobile',
    atomRevision: 0,
    description: '',
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
