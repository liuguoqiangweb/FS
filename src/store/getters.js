const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  language: state => state.app.language,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  menuTree: state => state.common.menuTree,
  buttons: state => state.common.buttons,
  elIcons: state => state.common.elIcons,
  svgIcons: state => state.common.svgIcons,
  userList: state => state.common.userList
}
export default getters
