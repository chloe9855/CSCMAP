<template>
  <header class="header" :class="{ 'theme-simple': themeFilterHandler , 'hetyle': $store.state.Url === 'customLayer', 'mobstyle': $store.state.Url === 'welcomePage' , 'aboutstyle': $store.state.Url === 'about' , 'editstyle': $store.state.Url === 'editSite' }">
    <div class="header__container">
      <div class="header__heading">
        <nuxt-link
          class="logo"
          :to="'/index'"
          title="回首頁"
        >
          <h1 v-if="themeFilterHandler === false">
            中鋼廠區建物地理資訊平台
          </h1>
          <span v-else>中鋼廠區建物地理資訊平台</span>
        </nuxt-link>
        <nuxt-link
          v-if="backmapBtnVisibleHandler"
          :to="'/map'"
          class="backmap-btn"
          title="返回GIS圖台"
        >
          <b class="arrow-tip side-left" />
          <b class="arrow-tip side-right" />
          <span>返回GIS圖台</span>
        </nuxt-link>
        </nuxt-link>
      </div>
      <div class="header__content" :class="{ 'hide-now': $store.state.Url === 'editSite' }">
        <ul v-if="pageName !== 'index' && pageName !== 'admin'" class="header__menu-list">
          <li
            v-for="item of menuFilterHandler"
            :key="item.name"
            :class="{
              'is-mobile-show': item.isMobileShow === true,
              'is-desktop-hide': item.isDesktopHide === true
            }"
          >
            <!-- <nuxt-link
              v-if="item.isNuxtLink === true"
              class="header__menu-link"
              :to="item.path"
              :class="item.classNameList.join('')"
              :title="item.name"
              @mousedown.prevent
            >
              <span>{{ item.name }}</span>
            </nuxt-link> -->
            <a
              class="header__menu-link"
              :href="item.path"
              :class="item.classNameList.join('')"
              :title="item.name"
              @click.stop="openWindow(item.name), item.classNameList.indexOf('tutorial-btn') < 0 ? {} : tutorialCtrlHandler()"
              @mousedown.prevent
            >
              <span>{{ item.name }}</span>
            </a>
          </li>
        </ul>
        <div v-if="$route.name !== 'admin'" class="header__member">
          <div class="member-control">
            <div
              v-if="hasAccessToken === true"
              class="member-info"
            >
              <label>{{ userName }}</label>
            </div>
            <a
              v-if="hasAccessToken === false"
              href="javascript:;"
              class="member-btn member-login-btn"
              title="登入"
              @click.stop="loginHandler"
              @mousedown.prevent
            >
              登入
            </a>
            <a
              v-if="hasAccessToken === true"
              href="javascript:;"
              class="member-btn member-logout-btn"
              title="登出"
              @click.stop="logoutHandler"
              @mousedown.prevent
            >
              登出
            </a>
          </div>
        </div>
        <a
          href="javascript:;"
          class="menu-control-btn"
          :class="{ 'is-open': $store.state.menuOpen === true }"
          @click.stop="menuCtrlHandler"
          @mousedown.prevent
        >
          <span />
        </a>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data () {
    return {
      menuList: [
        {
          name: '建物名稱設定',
          path: 'setting',
          isNuxtLink: true,
          isMobileShow: false,
          isDesktopHide: false,
          classNameList: []
        },
        {
          name: '圖資更新',
          path: 'customLayer',
          isNuxtLink: true,
          isMobileShow: false,
          isDesktopHide: false,
          classNameList: []
        },
        {
          name: '更新異動',
          path: 'recentChange',
          isNuxtLink: true,
          isMobileShow: false,
          isDesktopHide: false,
          classNameList: ['has-new-date']
        },
        {
          name: 'ERP建物資訊',
          path: 'javascript:;',
          isNuxtLink: false,
          isMobileShow: false,
          isDesktopHide: false,
          classNameList: []
        },
        {
          name: '業務負責人',
          path: 'javascript:;',
          isNuxtLink: false,
          isMobileShow: true,
          isDesktopHide: false,
          classNameList: []
        },
        {
          name: '使用說明',
          path: 'javascript:;',
          isNuxtLink: false,
          isMobileShow: false,
          isDesktopHide: false,
          classNameList: ['tutorial-btn']
        },
        {
          name: '返回GIS圖台',
          path: 'map',
          isNuxtLink: true,
          isMobileShow: true,
          isDesktopHide: true,
          classNameList: []
        }
      ],
      menuList2: [
        {
          name: 'ERP建物資訊',
          path: 'javascript:;',
          isNuxtLink: false,
          isMobileShow: false,
          isDesktopHide: false,
          classNameList: []
        },
        {
          name: '業務負責人',
          path: 'javascript:;',
          isNuxtLink: false,
          isMobileShow: true,
          isDesktopHide: false,
          classNameList: []
        },
        {
          name: '使用說明',
          path: 'javascript:;',
          isNuxtLink: false,
          isMobileShow: false,
          isDesktopHide: false,
          classNameList: ['tutorial-btn']
        },
        {
          name: '返回GIS圖台',
          path: 'map',
          isNuxtLink: true,
          isMobileShow: true,
          isDesktopHide: true,
          classNameList: []
        }
      ],
      menuList3: [
        {
          name: '業務負責人',
          path: 'javascript:;',
          isNuxtLink: false,
          isMobileShow: true,
          isDesktopHide: false,
          classNameList: []
        },
        {
          name: '使用說明',
          path: 'javascript:;',
          isNuxtLink: false,
          isMobileShow: false,
          isDesktopHide: false,
          classNameList: ['tutorial-btn']
        },
        {
          name: '返回GIS圖台',
          path: 'map',
          isNuxtLink: true,
          isMobileShow: true,
          isDesktopHide: true,
          classNameList: []
        }
      ],
      userID: '',
      userName: '',
      myURL: '',
      // * 使用者權限角色
      myRole: '',
      // * 查詢載入方格圖權限
      canSearchGrid: null,
      // * 是否已呼叫signOnStatus
      callLoginApi: false
    };
  },
  mounted () {
    this.getUserData();
    // this.getUserRole();
    // this.getGridAuthority();
  },
  methods: {
    // * 控制 menu 選單開啟/關閉
    menuCtrlHandler () {
      const result = !this.$store.state.menuOpen;
      this.$store.commit('CTRL_MENU_OPEN', result);
    },
    // * 開啟使用說明相簿
    tutorialCtrlHandler () {
      this.$store.commit('CTRL_TUTORIAL_OPEN', true);
    },
    // * 登出
    logoutHandler () {
      this.$store.commit('SET_ACCESS_TOKEN', '');
      this.$router.push('/index');
      this.logOut(false);
    },
    // *登出重設cookie
    logOut (autoRedirectQS) {
      console.log('logout');
      const redirectQS = autoRedirectQS !== false;
      const date = new Date();
      const cookieExpire = date.getTime - 1000;
      // 刪除 cookie 時，名稱、路徑和域名必須相同
      document.cookie = ' zsid=;domain=csc.com.tw;path=/';
      document.cookie = ' gcid=;domain=csc.com.tw;path=/';
      document.cookie = ' guid=;domain=csc.com.tw;path=/';
      document.cookie = ' sid=;domain=csc.com.tw;path=/';

      if (redirectQS) {
        window.location = 'https://cs.csc.com.tw/qss/ec/qssec';
      }
    },
    // * 登入 跳轉SSO
    loginHandler () {
      location.href = 'https://testeip.csc.com.tw:1443/SSO/DSS0/DSAOS0.aspx?.done=' + encodeURIComponent(window.location.href);
      this.getUserData();
    },
    // * 獲取登入資料
    getUserData () {
      fetch('/cscmap/api/SignOnStatus', {
        method: 'GET',
        // credentials: 'include',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then((response) => {
        if (response.status === 401) {
          // do what you need to do here
          this.$store.commit('SET_ACCESS_TOKEN', '');
          this.callLoginApi = true;
          return Promise.reject(response);
        }
        return response.json();
      }).then((jsonData) => {
        console.log(jsonData);
        this.userID = jsonData.UID;
        this.userName = jsonData.UserName;
        this.$store.commit('GET_USER_NAME', jsonData.UserName);
        this.$store.commit('SET_ACCESS_TOKEN', jsonData.UID);
        this.callLoginApi = true;

        this.getUserRole();
        this.getGridAuthority();
      }).catch((err) => {
        console.log('錯誤:', err);
        console.log(err.status);
      });

      // fetch('/CSCMap/api/SignOnStatus', {
      //   method: 'GET',
      //   // credentials: 'include',
      //   headers: new Headers({
      //     'Content-Type': 'application/json'
      //   })
      // }).then((response) => {
      //   return response.json();
      // }).then((jsonData) => {
      //   console.log(jsonData);
      //   this.userID = jsonData.UID;
      //   this.userName = jsonData.UserName;
      //   this.$store.commit('SET_ACCESS_TOKEN', jsonData.UID);
      // }).catch((err) => {
      //   console.log('錯誤:', err);
      //   console.log(err.status);
      // });
    },
    // * 取得使用者權限角色
    getUserRole () {
      fetch(`/csc2api/proxy?url=https://east.csc.com.tw/eas/mhb/rest/mhbe/Role/${this.userID}?_format=json`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then((response) => {
        return response.json();
      }).then((data) => {
        this.myRole = data;
        this.$store.commit('GET_USER_ROLE', data);
        console.log(this.myRole);
      }).catch((err) => {
        console.log('錯誤:', err);
      });
    },
    // * 查詢載入方格圖權限 (回傳 true(有權限) or false(無權限))
    getGridAuthority () {
      fetch(`/csc2api/proxy?url=http://east.csc.com.tw/eas/mhb/rest/mhbe/LoadGridAuth/${this.userID}?_format=json`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then((response) => {
        return response.json();
      }).then((data) => {
        this.canSearchGrid = data;
        this.$store.commit('GET_GRID_ACCESS', data);
        console.log(this.canSearchGrid);
      }).catch((err) => {
        console.log('錯誤:', err);
      });
    },
    openWindow (name) {
      if (name === 'ERP建物資訊') {
        window.open('https://east.csc.com.tw/eas/mhb/platform/mhbba');
      }
      if (name === '業務負責人') {
        window.open('https://east.csc.com.tw/eas/mhb/platform/mhbb4');
      }
    }
  },
  computed: {
    screenWidth () {
      return this.$store.state.screenWidth;
    },
    // * 判斷目前頁面並添加 'theme-simple' class
    themeFilterHandler () {
      const name = this.$route.name;
      if (name === 'index') {
        if (this.hasAccessToken === true) {
          // return this.screenWidth > 1023;
          return true; // *修改手機版登入樣式
        } else {
          return true;
        }
      } else if (name === 'admin') {
        return true;
      } else {
        return false;
      }
    },
    // * 判斷目前頁面欲顯示的 menu 選單項目
    menuFilterHandler () {
      return (this.myRole === 1) ? this.menuList : (this.myRole === 2) ? this.menuList2 : (this.myRole === 3) ? this.menuList3 : '';
      // return this.menuList;
    },
    // * 判斷目前頁面是否需要有「返回GIS圖台按鈕」
    backmapBtnVisibleHandler () {
      const currentPages = ['setting', 'recentChange', 'customLayer'];
      const name = this.$route.name;
      return currentPages.includes(name) && this.screenWidth > 1023;
    },
    // * 判斷網站目前是否登入
    hasAccessToken () {
      // @ 這邊先簡單用 state.accessToken 是否有文字來做判斷
      // @ 實際上要 call API 去驗證這組 token 是否有效
      // @ 才能判斷現在是否為登入狀態
      return this.$store.state.accessToken !== '';
    },
    pageName () {
      return this.$route.name;
    }
  },
  watch: {
    // * 若沒登入會跳轉回首頁、無權使用者(4)登入後也會跳回首頁
    callLoginApi (value) {
      if (value === true && this.hasAccessToken === false) {
        this.$router.push('/index');
      }

      if (value === true && this.$store.state.myUserRole === 4) {
        this.$swal({
          icon: 'error',
          width: 280,
          text: '無權登入',
          confirmButtonText: '確定',
          showCloseButton: true
        });
        this.$router.push('/index');
      }
    }
    // * 監聽路由變化 若有改變就重新整理
    // '$route' (to, from) {
    //   if (to === 'map') {
    //     window.location.reload();
    //   }
    // }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';

@media (max-width: 1023px) {
  .header {
    position: absolute;
    top: 0;
  }
}

.editstyle {
  height: 60px !important;
  display: flex !important;
}

.hide-now {
  display: none !important;
}

.aboutstyle {
  position: absolute !important;
  top: 0 !important;
  right: 0 !important;
}

.mobstyle {
  position: absolute !important;
  top: 0 !important;
  right: 0 !important;
}

.hetyle {
  position: static !important;
}

.header {
  width: 100%;
  // position: absolute;
  // top: 0;
  // left: 0;
  background-color: $color-blue;
  z-index: 7000;

  &.theme-simple {
    display: block;
    background-color: transparent;
  }
}

.header__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;

  @include min-width(map-get($tablet, sm)) {
    padding-right: 10px;
    padding-left: 10px;
  }

  @at-root .theme-simple & {
    padding: 20px 40px;

    @include max-width(map-get($tablet, lg)) {
      padding-right: 20px;
      padding-left: 20px;
    }
  }
}

.header__heading {
  display: flex;
  align-items: center;

  @at-root .theme-simple & {
    @include max-width(map-get($tablet, lg)) {
      display: none;
    }
  }
}

.header__content {
  height: 60px;
  display: flex;
  align-items: center;

  @at-root .theme-simple & {
    height: auto;

    @include max-width(map-get($tablet, lg)) {
      width: 100%;
      justify-content: flex-end;
    }
  }
}

.header__member {
  display: none;

  @include min-width(map-get($tablet, sm)) {
    display: block;
  }

  @at-root .theme-simple & {
    @include max-width(map-get($tablet, lg)) {
      display: block;
    }
  }
}

// * 會員資訊（姓名、登出）

.member-control {
  display: flex;
  align-items: center;
}

.member-info {
  margin-right: 10px;
  margin-left: 10px;
  display: flex;
  align-items: center;

  @at-root .theme-simple & {
    margin-right: 20px;
    margin-left: 20px;
  }

  &::before {
    content: '';
    width: 30px;
    height: 30px;
    margin-right: 10px;
    display: block;
    background: url('~/assets/img/icon-user.svg') no-repeat center/contain;

    @at-root .theme-simple & {
      width: 40px;
      height: 40px;
      margin-right: 20px;
      background-image: url('~/assets/img/icon-user_blue-dark.svg');
    }
  }

  label {
    font-weight: 500;
    color: $color-white;

    @include hack-ie {
      font-weight: bold;
    }

    @at-root .theme-simple & {
      font-size: map-get($font-size, sm);
    }
  }
}

.member-btn {
  padding: 6px 10px;
  font-weight: 500;
  color: $color-white;

  @include hack-ie {
    font-weight: bold;
  }

  @include min-width(map-get($desktop, md)) {
    padding-right: 20px;
    padding-left: 20px;
  }

  @at-root .theme-simple & {
    padding-right: 30px;
    padding-left: 30px;
    font-size: map-get($font-size, sm);
  }
}

.member-logout-btn {
  @at-root .theme-simple & {
    background-color: #309ec0;
    border: 2px $color-white solid;
    border-radius: 5px;

    @include min-width(map-get($desktop, sm)) {
      &:hover,
      &:focus {
        color: $color-basic;
        background-color: $color-white;
      }
    }
  }
}

.member-login-btn {
  @at-root .theme-simple & {
    padding-top: 9px;
    padding-bottom: 9px;
    background-color: $color-blue;
    border-radius: 7px;

    @include min-width(map-get($desktop, sm)) {
      &:hover,
      &:focus {
        background-color: $color-blue-dark;
      }
    }
  }
}

// * Logo

.logo {
  width: 250px;
  height: 30px;
  display: block;
  background: url('~/assets/img/logo_white.svg') no-repeat center/contain;

  @include min-width(map-get($phone, sm)) {
    width: 275px;
    height: 33px;
  }

  @include min-width(map-get($phone, md)) {
    width: 325px;
    height: 40px;
  }

  span,
  h1 {
    display: none;
  }

  @at-root .theme-simple & {
    width: 195px;
    height: 60px;
    background-image: url('~/assets/img/logo_csc.svg');
  }
}

// * Menu 選單

.header__menu-list {
  display: none;

  @include min-width(map-get($tablet, sm)) {
    height: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  > li {
    height: 100%;
    display: none;

    @include min-width(map-get($desktop, sm)) {
      display: block;
    }

    &.is-desktop-hide {
      display: block;

      @include min-width(map-get($desktop, sm)) {
        display: none;
      }
    }

    &.is-mobile-show {
      @include max-width(map-get($tablet, lg)) {
        display: block;
      }
    }
  }
}

.header__menu-link {
  height: 100%;
  padding-right: 10px;
  padding-left: 10px;
  display: flex;
  align-items: center;
  position: relative;
  font-weight: 500;
  color: $color-white;
  flex-wrap: wrap;

  @include hack-ie {
    font-weight: bold;
  }

  @include min-width(map-get($desktop, sm)) {
    &:hover::after {
      opacity: 1;
    }
  }

  @include min-width(map-get($desktop, md)) {
    padding-right: 20px;
    padding-left: 20px;
  }

  &.nuxt-link-active::after {
    opacity: 1;
  }

  &::after {
    content: '';
    width: 100%;
    height: 5px;
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: $color-blue-light-2;
    opacity: 0;
  }

  > span {
    position: relative;
    line-height: 1.4em;
  }

  &.has-new-date {
    > span::after {
      content: '';
      width: 20px;
      height: 20px;
      display: block;
      position: absolute;
      top: -10px;
      right: -20px;
      background: url('~/assets/img/icon/icon-newdate.svg') no-repeat center/contain;
    }
  }
}

// * 漢堡選單按鈕

.menu-control-btn {
  width: 60px;
  height: 60px;
  padding-top: 28.5px;
  padding-bottom: 28.5px;
  display: block;
  overflow: hidden;

  @include min-width(map-get($tablet, sm)) {
    display: none;
  }

  @at-root .theme-simple & {
    @include max-width(map-get($tablet, lg)) {
      display: none;
    }
  }

  > span {
    margin: auto;
    position: relative;
  }

  > span,
  > span::before,
  > span::after {
    width: 35px;
    height: 3px;
    display: block;
    background-color: $color-white;
    transition: all 0.4s;

    @include min-width(map-get($phone, md)) {
      width: 40px;
    }
  }

  > span::before {
    content: '';
    margin-top: -10px;
    position: absolute;
  }

  > span::after {
    content: '';
    margin-top: 10px;
    position: absolute;
    top: 0;
  }

  &.is-open {
    > span {
      background-color: transparent;
    }

    > span::before {
      margin-top: 0;
      transform: rotate(-45deg);
    }

    > span::after {
      margin-top: 0;
      transform: rotate(45deg);
    }
  }
}

// * 返回GIS圖台按鈕

.backmap-btn {
  margin-left: 10px;
  display: flex;
  align-items: center;
  font-size: map-get($font-size, sm);
  font-weight: 500;
  color: $color-white;

  @include hack-ie {
    font-weight: bold;
  }

  > span {
    margin-left: 7px;
    display: none;

    @include min-width(1130px) {
      display: block;
    }
  }

  .arrow-tip {
    margin-right: 5px;
    display: block;

    &::before {
      content: '';
      width: 0;
      height: 0;
      display: block;
      border-style: solid;
      border-width: 5px 7px 5px 0;
      border-color: transparent;
    }

    &.side-left::before {
      border-right-color: $color-white;
      animation: toDarker 0.7s linear infinite;
    }

    &.side-right::before {
      border-right-color: $color-blue-light;
      animation: toLighter 0.7s linear infinite;
    }
  }
}

@keyframes toLighter {
  from { border-right-color: $color-blue-light; }
  to { border-right-color: $color-white; }
}

@keyframes toDarker {
  from { border-right-color: $color-white; }
  to { border-right-color: $color-blue-light; }
}

</style>
