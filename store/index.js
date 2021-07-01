// * ==========================================================================
// * State
// * ==========================================================================

export const state = () => ({
  accessToken: '',
  menuOpen: false,
  screenWidth: 0,
  tutorialOpen: false,
  loadingMask: false,
  triggerHidden: false,
  mobileSelectUP: false, // *預設沒有上滑效果
  Url: '',
  erpBoxOpen: false,
  myUserRole: '',
  gridRole: null,
  myErpCluster: false

});

// * ==========================================================================
// * Mutations
// * ==========================================================================

export const mutations = {
  // * 控制行動版 menu 選單開啟/關閉
  CTRL_MENU_OPEN (state, payload) {
    state.menuOpen = payload;
  },
  // * 取得瀏覽器畫面寬度
  GET_SCREEN_WIDTH (state) {
    state.screenWidth = window.innerWidth;
  },
  // * 控制使用說明相簿開啟/關閉
  CTRL_TUTORIAL_OPEN (state, payload) {
    state.tutorialOpen = payload;
  },
  // * 控制 Loading 視窗開啟/關閉
  CTRL_LOADING_MASK (state, payload) {
    state.loadingMask = payload;
  },
  // * 設定登入狀態的 token
  SET_ACCESS_TOKEN (state, payload) {
    state.accessToken = payload;
  },
  // * 設定元件是否隱藏
  SET_TRIGGER_HIDDEN (state, payload) {
    state.triggerHidden = payload;
  },

  // *手機版選取單一建物->上方的MultipleSelectMobileList會上滑消失
  // *控制上方MultipleSelectMobileList 和右側工具列消失
  SET_MOBILE_SELECT (state, payload) {
    state.mobileSelectUP = payload;
  },
  GET_NOW_URL (state, payload) {
    state.Url = payload;
  },
  GO_ERP_CURRENT_MODE (state, payload) {
    state.erpBoxOpen = payload;
  },
  GET_USER_ROLE (state, payload) {
    state.myUserRole = payload;
  },
  GET_GRID_ACCESS (state, payload) {
    state.gridRole = payload;
  },
  // * 單筆群聚點擊查詢 無其它搜尋內容 出現的ERP BOX
  ERP_CLUSTER_BOX (state, payload) {
    state.myErpCluster = payload;
  }
};
