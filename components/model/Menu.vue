<template>
  <nav id="menu">
    <ul class="menu-list">
      <li>
        <a
          href="javascript:;"
          class="menu-list-link"
          title="業務負責人"
          @click.stop="openWindow"
          @mousedown.prevent
        >
          <span>業務負責人</span>
        </a>
      </li>
      <li v-if="$route.name === 'about'">
        <!-- <nuxt-link
          :to="'/map'"
          class="menu-list-link"
          title="返回GIS圖台"
          @mousedown.prevent
        >
          <span>返回GIS圖台</span>
        </nuxt-link> -->
        <!-- <a
          href="map"
          class="menu-list-link"
          title="返回GIS圖台"
        >
          <span>返回GIS圖台</span>
        </a> -->
      </li>
      <li v-if="$route.name === 'map' || $route.name === 'index'">
        <nuxt-link
          :to="'/about'"
          class="menu-list-link"
          title="關於"
          @mousedown.prevent
        >
          <span>關於</span>
        </nuxt-link>
      </li>
    </ul>
    <div
      v-if="hasAccessToken === true"
      class="member-control"
    >
      <div class="member-info">
        <label>{{ userName }}</label>
      </div>
      <a
        href="javascript:;"
        class="member-logout-btn"
        title="登出"
        @click.stop="logoutHandler"
        @mousedown.prevent
      >
        登出
      </a>
    </div>
  </nav>
</template>

<script>
export default {
  data () {
    return {
      userName: '',
      // * 使用者權限角色
      myRole: '',
      // * 查詢載入方格圖權限
      canSearchGrid: null
    };
  },
  mounted () {
    this.getUserData();
    this.getUserRole();
    this.getGridAuthority();
  },
  methods: {
    // * 登出
    logoutHandler () {
      this.$store.commit('SET_ACCESS_TOKEN', '');
      this.$store.commit('CTRL_MENU_OPEN', false);
      this.$router.push('/index');
      this.logOut(false);
    },
    // * 獲取登入資料
    getUserData () {
      fetch('/cscmap2/api/SignOnStatus', {
        method: 'GET',
        // credentials: 'include',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then((response) => {
        if (response.status === 401) {
          // do what you need to do here
          this.$store.commit('SET_ACCESS_TOKEN', '');
          return Promise.reject(response);
        }
        return response.json();
      }).then((jsonData) => {
        console.log(jsonData);
        this.userID = jsonData.UID;
        this.userName = jsonData.UserName;
        this.$store.commit('SET_ACCESS_TOKEN', jsonData.UID);
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
    // * 取得使用者權限角色
    getUserRole () {
      fetch('/csc2api/proxy?url=https://east.csc.com.tw/eas/mhb/rest/mhbe/Role/213801?_format=json', {
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
      fetch('/csc2api/proxy?url=http://east.csc.com.tw/eas/mhb/rest/mhbe/LoadGridAuth/190199?_format=json', {
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
    openWindow () {
      window.open('https://east.csc.com.tw/eas/mhb/platform/mhbb4');
    }
  },
  computed: {
    // * 判斷網站目前是否登入
    hasAccessToken () {
      // @ 這邊先簡單用 state.accessToken 是否有文字來做判斷
      // @ 實際上要 call API 去驗證這組 token 是否有效
      // @ 才能判斷現在是否為登入狀態
      return this.$store.state.accessToken !== '';
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';

// * Menu 區塊樣式

#menu {
  width: 100%;
  position: absolute;
  top: 60px;
  left: 0;
  background-color: $color-blue-light;
  z-index: 7000;
}

.menu-list-link {
  padding: 10px 20px;
  display: block;
  color: $color-white;
}

// * 會員資訊（姓名、登出）

.member-control {
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px $color-white solid;
}

.member-info {
  padding-right: 10px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: keep-all;
  flex-grow: 1;
  flex-basis: 0;
  color: $color-white;
}

.member-logout-btn {
  display: block;
  color: $color-white;
  word-break: keep-all;
}
</style>
