<template>
  <div class="guide-service">
    <h1 class="guide-service__title">
      <span>中鋼廠區建物地理資訊平台</span>
    </h1>
    <div class="guide-service__content">
      <div class="guide-service__enter-group">
        <a
          href="javascript:;"
          class="guide-service__enter-btn icon-map"
          :class="{ 'hide-role' : $store.state.myUserRole === 4 }"
          title="進入圖台"
          @mousedown.prevent
          @click="loginHandler"
        >
          <span>進入圖台</span>
        </a>
        <a
          v-if="screenWidth > 1023"
          href="javascript:;"
          class="guide-service__enter-btn icon-info"
          title="建物資訊"
          @mousedown.prevent
          @click="loginHandler4"
        >
          <span>建物資訊</span>
        </a>
        <a
          v-if="screenWidth < 1024"
          href="javascript:;"
          class="guide-service__enter-btn theme-normal icon-grid is-desktop-hide"
          title="方格圖載入"
          @mousedown.prevent
          @click="loginHandler2"
        >
          <span>方格圖載入</span>
        </a>
        <a
          v-if="screenWidth < 1024"
          href="javascript:;"
          class="guide-service__enter-btn theme-normal icon-search is-desktop-hide"
          title="坐標定位"
          @mousedown.prevent
          @click="loginHandler3"
        >
          <span>坐標定位</span>
        </a>
      </div>

      <div class="guide-service__intro">
        <label class="guide-service__intro-caption">關於</label>
        <p class="guide-service__intro-content">
          中鋼「GIS建物地理資訊平台」是一種具空間資訊專業形式的整合性資料管理平台，具備集中、輸入、儲存、查詢、定位和顯示建物地理資訊之功能，能夠應用於用地發展規劃、建物資訊調查、資產稅籍管理及工程推展等面向。
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head () {
    return {
      bodyAttrs: {
        class: 'theme-home'
      }
    };
  },
  mounted () {
    this.$store.commit('GET_NOW_URL', 'welcomePage');

    if (this.$store.state.myUserRole === 4) {
      this.$swal({
        icon: 'error',
        width: 402,
        text: '您無權登入',
        confirmButtonText: '確定',
        showCloseButton: true
      });
    }
  },
  methods: {
    loginHandler () {
      if (this.$store.state.accessToken === '') { // 如果沒登入
        location.href = `https://testeip.csc.com.tw:1443/SSO/DSS0/DSAOS0.aspx?.done=${encodeURIComponent(window.location.href)}map`;
      } else {
        location.href = `${window.location.href}map`;
      }
    },
    loginHandler2 () {
      if (this.$store.state.accessToken === '') { // 如果沒登入
        location.href = `https://testeip.csc.com.tw:1443/SSO/DSS0/DSAOS0.aspx?.done=${encodeURIComponent(window.location.href)}map?now=searchModeLattice`;
      } else {
        location.href = `${window.location.href}map?now=searchModeLattice`;
      }
    },
    loginHandler3 () {
      if (this.$store.state.accessToken === '') { // 如果沒登入
        // 跳登入頁 按下登入後跳回首頁
        location.href = `https://testeip.csc.com.tw:1443/SSO/DSS0/DSAOS0.aspx?.done=${encodeURIComponent(window.location.href)}map?now=openSetPosition`;
        // 導回座標定位
        // this.$router.push({ name: 'map', params: { preload: 'openSetPosition' } });
      } else {
        location.href = `${window.location.href}map?now=openSetPosition`;
      }
    },
    loginHandler4 () {
      if (this.$store.state.accessToken === '') { // 如果沒登入
        location.href = 'https://testeip.csc.com.tw:1443/SSO/DSS0/DSAOS0.aspx?.done=https://east.csc.com.tw/eas/mhb/platform/mhbba';
      } else {
        location.href = 'https://east.csc.com.tw/eas/mhb/platform/mhbba';
      }
    }
  },
  computed: {
    screenWidth () {
      return this.$store.state.screenWidth;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';
@import '~/assets/scss/components/_guideService.scss';

// * ==========================================================================
// * 進入圖台與建物資訊按鈕
// * ==========================================================================

.hide-role {
  display: none !important;
}

.guide-service__enter-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  @include min-width(map-get($tablet, sm)) {
    margin-top: 3rem;
  }

  @include min-width(map-get($desktop, sm)) {
    margin-bottom: 2rem;
  }
}

.guide-service__enter-btn {
  width: 100%;
  padding: 10px 70px;
  margin-bottom: 1rem;
  display: block;
  position: relative;
  text-align: center;
  color: $color-white;
  line-height: 1.6em;
  border-radius: 5px;

  @include min-width(map-get($tablet, sm)) {
    padding-right: 90px;
    padding-left: 90px;
    font-size: map-get($font-size, md);
    margin-bottom: 1.5rem;
  }

  @include min-width(map-get($desktop, sm)) {
    width: calc((100% - 30px) / 2);
    padding: 13px 60px 13px 90px;
    font-weight: 500;
    text-align: right;
    border-radius: 0;
    margin-bottom: 0;

    @include hack-ie {
      font-weight: bold;
    }

    &::after {
      content: '';
      width: 0%;
      height: 100%;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      transition: width 0.4s;
    }

    &:hover,
    &:focus {
      &::after {
        width: 100%;
      }
    }
  }

  @include min-width(map-get($desktop, md)) {
    font-size: map-get($font-size, lg);
  }

  @include min-width(map-get($desktop, xl)) {
    padding-top: 17px;
    padding-bottom: 17px;
    padding-left: 100px;
  }

  > span {
    position: relative;
    z-index: 1;
  }

  &.theme-normal {
    background-color: #f4f4f4;
    border: 1px #d0d0d0 solid;

    > span {
      color: $color-black;
    }
  }

  &.is-desktop-hide {
    @include min-width(map-get($desktop, sm)) {
      display: none;
    }
  }

  &::before {
    content: '';
    width: 60px;
    height: 50px;
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;

    @include min-width(map-get($tablet, sm)) {
      width: 80px;
      height: 67px;
    }

    @include min-width(map-get($desktop, sm)) {
      width: 90px;
      height: 80px;
      top: -30px;
      bottom: auto;
    }

    @include min-width(map-get($desktop, xl)) {
      width: 110px;
      height: 92px;
    }

    background: {
      position: center;
      repeat: no-repeat;
      size: contain;
    }
  }

  &.icon-map {
    background-color: $color-orange;

    &::before {
      background-image: url('~/assets/img//icon-enter-btn_map.svg');
    }

    &::after {
      background-color: $color-orange-dark;
    }
  }

  &.icon-info {
    background-color: $color-blue;

    &::before {
      background-image: url('~/assets/img/icon-enter-btn_info.svg');

      @include min-width(map-get($desktop, sm)) {
        left: -20px;
      }
    }

    &::after {
      background-color: $color-blue-dark;
    }
  }

  &.icon-grid {
    &::before {
      background-image: url('~/assets/img/icon-enter-btn_grid.svg');
    }
  }

  &.icon-search {
    &::before {
      background-image: url('~/assets/img/icon-enter-btn_search.svg');
    }
  }
}
</style>
