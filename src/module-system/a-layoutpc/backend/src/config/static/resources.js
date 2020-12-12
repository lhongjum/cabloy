module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // panels
    {
      atomName: 'Menu',
      atomStaticKey: 'panelMenu',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:sidebarPanel.General',
      resourceType: 'a-layoutpc:sidebarPanel',
      resourceConfig: JSON.stringify({
        url: '/a/basefront/resource/tree',
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Atom',
      atomStaticKey: 'panelAtom',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:sidebarPanel.General',
      resourceType: 'a-layoutpc:sidebarPanel',
      resourceConfig: JSON.stringify({
        url: '/a/basefront/atom/list',
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Search',
      atomStaticKey: 'panelSearch',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:sidebarPanel.General',
      resourceType: 'a-layoutpc:sidebarPanel',
      resourceConfig: JSON.stringify({
        url: '/a/basefront/atom/searchQuick',
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Mine',
      atomStaticKey: 'panelMine',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:sidebarPanel.General',
      resourceType: 'a-layoutpc:sidebarPanel',
      resourceConfig: JSON.stringify({
        url: '/a/user/user/mine',
      }),
      resourceRoles: 'root',
    },
    // header buttons
    {
      atomName: 'Home',
      atomStaticKey: 'buttonHome',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:headerButton.General',
      resourceType: 'a-layoutpc:headerButton',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonLink',
        icon: { material: 'home' },
        actionPath: '/a/dashboard/dashboard?key=home',
        scene: 'dashboard',
        sceneOptions: { name: 'home' },
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Dashboard',
      atomStaticKey: 'buttonDashboard',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:headerButton.General',
      resourceType: 'a-layoutpc:headerButton',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonLink',
        icon: { material: 'dashboard' },
        actionPath: '/a/dashboard/dashboard',
        scene: 'dashboard',
        sceneOptions: { name: 'dashboard' },
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Fullscreen',
      atomStaticKey: 'buttonFullscreen',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:headerButton.General',
      resourceType: 'a-layoutpc:headerButton',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonFullscreen',
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Mine',
      atomStaticKey: 'buttonMine',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:headerButton.General',
      resourceType: 'a-layoutpc:headerButton',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonMine',
        icon: { material: 'person' },
        actionPath: null,
        scene: 'sidebar', sceneOptions: { side: 'right', module: 'a-layoutpc', name: 'panelMine' },
        showSeparator: true,
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Clock',
      atomStaticKey: 'buttonClock',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:headerButton.General',
      resourceType: 'a-layoutpc:headerButton',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonClock',
        actionPath: '/a/layoutpc/section/clock/preferences',
        scene: 'sidebar',
        sceneOptions: { side: 'right', name: 'preferences', title: 'Preferences' },
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Copyright',
      atomStaticKey: 'buttonCopyright',
      atomRevision: 0,
      atomCategoryId: 'a-layoutpc:headerButton.General',
      resourceType: 'a-layoutpc:headerButton',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        component: 'buttonLink',
        icon: null,
        actionPath: '/a/basefront/base/about',
        scene: 'sidebar',
        sceneOptions: { side: 'right', name: 'about', title: 'About' },
        showLabel: true,
      }),
      resourceRoles: 'root',
    },


  ];
  return resources;
};
