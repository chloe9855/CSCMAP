<template>
  <div
    class="wrapper"
    :class="{ 'is-hidden': triggerHidden === true, 'abstyle': $store.state.Url === 'customLayer'}"
  >
    <Header-component />

    <transition
      name="accordion"
      @enter="accordionStart"
      @after-enter="accordionEnd"
      @before-leave="accordionStart"
      @after-leave="accordionEnd"
    >
      <Menu-component v-if="$store.state.menuOpen === true" />
    </transition>

    <transition
      name="fade"
      mode="out-in"
    >
      <Nuxt />
    </transition>

    <client-only>
      <GalleryTutorial-component />
    </client-only>

    <transition
      name="fade"
      mode="out-in"
    >
      <div
        v-if="$store.state.loadingMask"
        class="loading-mask"
      >
        <div class="loading-mask__title">
          資料載入中...
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr';
import Header from '~/components/model/Header.vue';
import Menu from '~/components/model/Menu.vue';
import GalleryTutorial from '~/components/model/GalleryTutorial.vue';

export default {
  data () {
    return {
      scrollValue: 0
    };
  },
  components: {
    'client-only': NoSSR,
    'Header-component': Header,
    'Menu-component': Menu,
    'GalleryTutorial-component': GalleryTutorial
  },
  mounted () {
    document.documentElement.addEventListener('gesturestart', this.SET_PREVENT_DEFAULT);

    window.addEventListener('scroll', this.getScrollValue);
    window.addEventListener('resize', this.getScreenWidth);

    this.getScreenWidth();
  },
  beforeDestroy () {
    document.documentElement.removeEventListener('gesturestart', this.SET_PREVENT_DEFAULT);

    window.removeEventListener('scroll', this.getScrollValue);
    window.removeEventListener('resize', this.getScreenWidth);
  },
  methods: {
    // * 取得螢幕寬度
    getScreenWidth () {
      this.$store.commit('GET_SCREEN_WIDTH');
    },
    // * 取得 Scroll Value
    getScrollValue () {
      this.scrollValue = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    },
    // * menu 選單的收合動畫
    accordionStart (event) {
      event.style.height = `${event.scrollHeight}px`;
    },
    accordionEnd (event) {
      event.style.height = '';
    },
    getUrlChange () {
      const nowURL = window.location.href.split('/')[4];
      this.nowURL = nowURL;
    }
  },
  computed: {
    screenWidth () {
      return this.$store.state.screenWidth;
    },
    // * 元件是否隱藏
    triggerHidden () {
      return this.$store.state.triggerHidden;
    }
  },
  watch: {
    screenWidth (value) {
      if (value >= 768) {
        this.$store.commit('CTRL_MENU_OPEN', false);
        this.$store.commit('CTRL_TUTORIAL_OPEN', false);
      }
    },
    $route () {
      this.$store.commit('CTRL_MENU_OPEN', false);
      this.$store.commit('CTRL_TUTORIAL_OPEN', false);
      this.$store.commit('CTRL_LOADING_MASK', false);
      this.$store.commit('SET_TRIGGER_HIDDEN', false);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';

.chstyle {
  height: auto !important;
}

.abstyle {
  overflow: visible !important;
}

.loading-mask {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9000;

  &::before {
    content: '';
    width: 100%;
    height: 100%;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba($color-black, 0.6);
  }
}

.loading-mask__title {
  position: relative;
  font-size: map-get($font-size, sm);
  color: $color-white;
}

</style>

<style lang="scss">
@import '~/assets/scss/utils/_utils.scss';

// * 地圖頁的元件隱藏狀態
.wrapper {
  @include max-width(map-get($tablet, lg)) {
    .header,
    .query-window,
    .feature {
      transition: transform 0.6s;
    }

    &.is-hidden {
      .header,
      .query-window {
        transform: translateY(-180px);
      }

      .feature {
        transform: translateX(65px);
      }
    }
  }

}

</style>
