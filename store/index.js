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
  myErpCluster: false,
  myErpClusterMore: false,
  cancelDrag: false,
  notHide: false,
  gisMapp: '',
  orangeBar: false,
  gridMode: false,
  inputMode: false,
  myPop: false,
  showClearButton: true,
  stackWindow: false,
  hideAsset: true,
  labelNameCtrl: null,
  userName: '',
  userId: '',
  userDept: '',
  confirmButt: false,
  erpMode: '',
  backStruct: true,
  erpCurrentItem: ''
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
  // * 使用者名稱
  GET_USER_NAME (state, payload) {
    state.userName = payload;
  },
  // * 使用者帳號
  GET_USER_ID (state, payload) {
    state.userId = payload;
  },
  // * 使用者單位
  GET_USER_DEPT (state, payload) {
    state.userDept = payload;
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
  // * 取得目前頁面名字
  GET_NOW_URL (state, payload) {
    state.Url = payload;
  },
  GO_ERP_CURRENT_MODE (state, payload) {
    state.erpBoxOpen = payload;
  },
  // * 取得使用者角色
  GET_USER_ROLE (state, payload) {
    state.myUserRole = payload;
  },
  // * 取得方格圖載入權限
  GET_GRID_ACCESS (state, payload) {
    state.gridRole = payload;
  },
  // * 單筆群聚點擊查詢 無其它搜尋內容 出現的ERP BOX
  ERP_CLUSTER_BOX (state, payload) {
    state.myErpCluster = payload;
  },
  // * 單筆群聚點擊查詢 有其它搜尋內容 出現的ERP BOX
  ERP_CLUSTER_BOX_RECORD (state, payload) {
    state.myErpClusterMore = payload;
  },
  // * 坐標定位dragbox取消拖曳
  CANCEL_INPUT_DRAG (state, payload) {
    state.cancelDrag = payload;
  },
  // * 不要觸發SET_TRIGGER_HIDDEN
  DONT_HIDE_NAV (state, payload) {
    state.notHide = payload;
  },
  // * 引入GIS map
  GET_GIS_MAP (state, payload) {
    state.gisMapp = payload;
  },
  SET_ORANGE_BAR (state, payload) {
    state.orangeBar = payload;
  },
  // * 切換至方格狀態 gridMode為true才是可點選狀態
  OPEN_GRID_MODE (state, payload) {
    state.gridMode = payload;
  },
  INPUT_FOCUS_NOW (state, payload) {
    state.inputMode = payload;
  },
  UP_POPBOX (state, payload) {
    state.myPop = payload;
  },
  // * 桌機版 新增預定用地/測量的 清除全部 按鈕
  CLEAR_BUTTON_HANDLER (state, payload) {
    state.showClearButton = payload;
  },
  // * 手機版 當已有建物查詢結果時 又開啟工具列視窗 -> erpbox會被壓在後面
  STACK_MULTI_BOX (state, payload) {
    state.stackWindow = payload;
  },
  HIDE_ASSET_BLOCK (state, payload) {
    state.hideAsset = payload;
  },
  SHOW_LABEL_NAME (state, payload) {
    state.labelNameCtrl = payload;
  },
  // * 在編輯用圖台無圖形時也會顯示"確定"鈕
  SHOW_CONFIRM_BUTT (state, payload) {
    state.confirmButt = payload;
  },
  // * 手機板ERP資訊的modeType (''、current、detail)
  GET_ERP_MODETYPE (state, payload) {
    state.erpMode = payload;
  },
  // * 切換回建物->true  切換至方格->false
  BACK_TO_STRUCTURE (state, payload) {
    state.backStruct = payload;
  },
  // * 取得目前點擊的ERP單筆資料 (為一個物件)
  GET_ERP_CURRENT (state, payload) {
    state.erpCurrentItem = payload;
  }
};
