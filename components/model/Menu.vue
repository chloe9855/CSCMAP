<template>
  <nav id="menu">
    <ul class="menu-list">
      <li>
        <a
          href="#"
          class="menu-list-link"
          title="業務負責人"
          @mousedown.prevent
        >
          <span>業務負責人</span>
        </a>
      </li>
      <li v-if="$route.name === 'about'">
        <nuxt-link
          :to="'/map'"
          class="menu-list-link"
          title="返回GIS圖台"
          @mousedown.prevent
        >
          <span>返回GIS圖台</span>
        </nuxt-link>
      </li>
      <li v-if="$route.name === 'map' || $route.name === 'index'">
        <nuxt-link
          :to="'/about'"
          class="menu-list-link"
          title="關於中鋼"
          @mousedown.prevent
        >
          <span>關於中鋼</span>
        </nuxt-link>
      </li>
    </ul>
    <div
      v-if="hasAccessToken === true"
      class="member-control"
    >
      <div class="member-info">
        <label>王小明</label>
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
  methods: {
    // * 登出
    logoutHandler () {
      this.$store.commit('SET_ACCESS_TOKEN', '');
      this.$store.commit('CTRL_MENU_OPEN', false);
      this.$router.push('/index');
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
