<template>
  <div
    class="feature"
    :class="{ 'right-move': $store.state.mobileSelectUP === true }"
  >
    <ul class="feature__content">
      <li v-if="screenWidth > 1023">
        <a
          href="javascript:;"
          class="feature__btn icon-add-land"
          :class="currentClassHandler('addLandWindow')"
          @click.stop="setDragboxHandler('addLandWindow')"
          @mousedown.prevent
        >
          <span>新增預定用地</span>
        </a>
      </li>
      <li :class="{ 'hide-now': $store.state.Url === 'editSite' }">
        <a
          href="javascript:;"
          class="feature__btn icon-my-position position-alert-btn"
          :class="currentClassHandler('posAlertWindow')"
          @click.stop="setDragboxHandler('posAlertWindow'), $emit('setPositionAlert')"
          @mousedown.prevent
        >
          <span>我的位置</span>
        </a>
      </li>
      <li :class="{ 'hide-now': $store.state.Url === 'editSite' }">
        <a
          href="javascript:;"
          class="feature__btn icon-cluster-switch"
          :class="{ 'add-cluster-bg': clusterBg === true }"
          @click.stop="$emit('hideCluster')"
          @mousedown.prevent
        >
          <span>隱藏建物球標</span>
        </a>
      </li>
      <li>
        <a
          href="javascript:;"
          class="feature__btn icon-switch-layers"
          :class="currentClassHandler('switchLayersWindow')"
          @click.stop="setDragboxHandler('switchLayersWindow'),$emit('hideTagBar')"
          @mousedown.prevent
        >
          <span>圖層切換/調整</span>
        </a>
      </li>
      <li>
        <a
          href="javascript:;"
          class="feature__btn icon-change-direction"
          :class="{'add-bgcolor': iconcolor === true}"
          @click.stop="$emit('setOptions')"
          @mousedown.prevent
        >
          <span>圖北切換</span>
        </a>
      </li>
      <li :class="{ 'hide-now': $store.state.Url === 'editSite' }">
        <a
          href="javascript:;"
          class="feature__btn icon-set-position"
          :class="currentClassHandler('setPositionWindow')"
          @click.stop="setDragboxHandler('setPositionWindow'),$emit('hideTagBar')"
          @mousedown.prevent
        >
          <span>坐標定位</span>
        </a>
      </li>
      <li :class="{ 'hide-now': $store.state.Url === 'editSite' }">
        <a
          href="javascript:;"
          class="feature__btn icon-measure"
          :class="currentClassHandler('measureWindow')"
          @click.stop="setDragboxHandler('measureWindow'),$emit('hideTagBar'),$store.commit('OPEN_GRID_MODE', false)"
          @mousedown.prevent
        >
          <span>測量距離/面積</span>
        </a>
      </li>
      <li v-if="screenWidth > 1023" :class="{ 'hide-now': $store.state.Url === 'editSite' }">
        <a
          class="feature__btn icon-screen-capture"
          @click.stop="$emit('screenShot')"
          @mousedown.prevent
        >
          <span>畫面擷取</span>
        </a>
      </li>
      <li v-if="screenWidth > 1023">
        <a
          href="javascript:;"
          class="feature__btn icon-home"
          @click.stop="$emit('backFullPic')"
          @mousedown.prevent
        >
          <span>回到全圖</span>
        </a>
      </li>
      <li v-if="screenWidth > 1023">
        <a
          href="javascript:;"
          class="feature__btn icon-zoom-in"
          @click.stop="$emit('zoomIn')"
          @mousedown.prevent
        >
          <span>放大</span>
        </a>
      </li>
      <li v-if="screenWidth > 1023">
        <a
          href="javascript:;"
          class="feature__btn icon-zoom-out"
          @click.stop="$emit('zoomOut')"
          @mousedown.prevent
        >
          <span>縮小</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      myColor: 'icon-cluster-switch'
    };
  },
  props: {
    current: String,
    iconcolor: Boolean,
    screenSrc: String,
    clusterBg: Boolean
  },
  methods: {
    // * 設定拖曳選單開啟/關閉
    setDragboxHandler (payload) {
      const result = this.current === payload ? '' : payload;
      this.$emit('select', result);
    },
    // * 設定 current 的 class
    currentClassHandler (payload) {
      return { current: this.current === payload };
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

// * 右側功能按鈕

$btn-color: #eff2f6;

.hide-now {
  display: none;
}

.feature {
  padding: 5px 5px 0;
  position: fixed;
  bottom: 75px;
  right: 10px;
  background-color: $color-white;
  border-radius: 60px;
  z-index: 5000;
  box-shadow: 5px 4px 15px rgba($color-black, 0.15);

  @include min-width(map-get($phone, sm)) {
    padding: 7.5px 7.5px 2.5px;
  }

  @include min-width(map-get($desktop, sm)) {
    top: 50%;
    bottom: auto;
    right: 20px;
    transform: translateY(-50%);
  }
}

.add-cluster-bg {
  background-color: #408bc5 !important;
  background-image: url('~/assets/img/icon/icon-cluster-switch_white.svg') !important;
}

//右滑消失效果
.right-move {
  transition: ease-in-out 0.5s;
  transform: translateX(200%);
}

.feature__content {
  > li {
    margin-bottom: 5px;
  }
}

.feature__btn {
  width: 35px;
  height: 35px;
  display: block;
  position: relative;
  background-color: $btn-color;
  border-radius: 100%;

  @include min-width(map-get($phone, sm)) {
    width: 40px;
    height: 40px;
  }

  @include min-width(map-get($desktop, sm)) {
    width: 45px;
    height: 45px;

    &:hover,
    &:focus {
      background-color: $color-blue-light;

      span {
        opacity: 1;
        transition: opacity 0.6s;
      }
    }
  }

  background: {
    position: center;
    repeat: no-repeat;
    size: contain;
  }

  &:active {
    background-color: $color-blue-light;
  }

  &.current {
    background-color: $color-blue-light;
  }

  span {
    display: none;

    @include min-width(map-get($desktop, sm)) {
      padding: 4px 8px;
      display: block;
      position: absolute;
      top: 8.5px;
      right: calc(100% + 20px);
      white-space: nowrap;
      color: $color-white;
      background-color: $color-blue-light;
      border-radius: 4px;
      opacity: 0;
      line-height: 1.45em;
      word-break: keep-all;
      pointer-events: none;

      &::after {
        content: '';
        width: 0;
        height: 0;
        display: block;
        position: absolute;
        top: calc((100% - 13px) / 2);
        right: -7px;
        border: {
          style: solid;
          width: 6.5px 0 6.5px 7px;
          color: transparent transparent transparent $color-blue-light;
        }
      }
    }
  }

  &.icon-add-land {
    background-image: url('~/assets/img/icon/icon-add-land.svg');

    @include min-width(map-get($desktop, sm)) {
      &:hover,
      &:focus {
        background-image: url('~/assets/img/icon/icon-add-land_white.svg');
      }
    }

    &:active,
    &.current {
      background-image: url('~/assets/img/icon/icon-add-land_white.svg');
    }
  }

  &.icon-cluster-switch {
    background-image: url('~/assets/img/icon/icon-cluster-switch.svg');

    @include min-width(map-get($desktop, sm)) {
      &:hover,
      &:focus {
        background-image: url('~/assets/img/icon/icon-cluster-switch_white.svg');
      }
    }

    &:active,
    &.current {
      background-image: url('~/assets/img/icon/icon-cluster-switch_white.svg');
    }
  }

  &.icon-set-position {
    background-image: url('~/assets/img/icon/icon-set-position.svg');

    @include min-width(map-get($desktop, sm)) {
      &:hover,
      &:focus {
        background-image: url('~/assets/img/icon/icon-set-position_white.svg');
      }
    }

    &:active,
    &.current {
      background-image: url('~/assets/img/icon/icon-set-position_white.svg');
    }
  }

  &.icon-measure {
    background-image: url('~/assets/img/icon/icon-measure.svg');

    @include min-width(map-get($desktop, sm)) {
      &:hover,
      &:focus {
        background-image: url('~/assets/img/icon/icon-measure_white.svg');
      }
    }

    &:active,
    &.current {
      background-image: url('~/assets/img/icon/icon-measure_white.svg');
    }
  }

  &.icon-screen-capture {
    background-image: url('~/assets/img/icon/icon-screen-capture.svg');

    @include min-width(map-get($desktop, sm)) {
      &:hover,
      &:focus {
        background-image: url('~/assets/img/icon/icon-screen-capture_white.svg');
        cursor: pointer;
      }
    }

    &:active,
    &.current {
      background-image: url('~/assets/img/icon/icon-screen-capture_white.svg');
    }
  }

  &.icon-switch-layers {
    background-image: url('~/assets/img/icon/icon-switch-layers.svg');

    @include min-width(map-get($desktop, sm)) {
      &:hover,
      &:focus {
        background-image: url('~/assets/img/icon/icon-switch-layers_white.svg');
      }
    }

    &:active,
    &.current {
      background-image: url('~/assets/img/icon/icon-switch-layers_white.svg');
    }
  }

  &.icon-my-position {
    background-image: url('~/assets/img/icon/icon-my-position.svg');

    @include min-width(map-get($desktop, sm)) {
      &:hover,
      &:focus {
        background-image: url('~/assets/img/icon/icon-my-position_white.svg');
      }
    }

    &:active,
    &.current {
      background-image: url('~/assets/img/icon/icon-my-position_white.svg');
    }
  }

  &.icon-change-direction {
    background-image: url('~/assets/img/icon/icon-change-direction.svg');

    @include min-width(map-get($desktop, sm)) {
      &:hover,
      &:focus {
        background-image: url('~/assets/img/icon/icon-change-direction_current.svg');
      }
    }

    &:active,
    &.current {
      background-image: url('~/assets/img/icon/icon-change-direction_current.svg');
    }
  }

  &.add-bgcolor {
    background-image: url('~/assets/img/icon/icon-change-direction_current.svg');
    background-color: $color-blue-light;
  }

  &.icon-home,
  &.icon-zoom-in,
  &.icon-zoom-out {
    @include min-width(map-get($desktop, sm)) {
      &:hover,
      &:focus {
        background-color: $btn-color;
      }
    }

    &:active,
    &.current {
      background-color: $btn-color;
    }
  }

  &.icon-home {
    background-image: url('~/assets/img/icon/icon-home.svg');
  }

  &.icon-zoom-in {
    background-size: 60%;
    background-image: url('~/assets/img/icon/icon-zoom-in.svg');
  }

  &.icon-zoom-out {
    background-size: 60%;
    background-image: url('~/assets/img/icon/icon-zoom-out.svg');
  }
}

</style>
