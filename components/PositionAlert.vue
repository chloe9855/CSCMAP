<template>
  <div class="position-alert">
    <div class="msgbox" :class="{ 'is-hidden': isHidden, 'all_hide': $store.state.triggerHidden === true && $store.state.backStruct === false }">
      <div class="slideup-tips" :class="{ 'is-hidden': isHidden }" @click.stop="isHidden = !isHidden" />
      <div class="msgbox__wrapper">
        <div class="msgbox__header">
          <div class="msgbox__header-content">
            <label class="msgbox__title has-icon icon-my-position">我的位置</label>
          </div>
          <a
            href="javascript:;"
            class="msgbox__close-btn"
            @click.stop="$emit('close')"
            @mousedown.prevent
          />
        </div>
        <div class="msgbox__content">
          <!-- <div v-text="contentHandler" /> -->
          <div class="top">
            <p>方格坐標 (X{{ csc.x }}, Y{{ csc.y }})</p>
            <p v-if="cold.x !== ''">
              冷三方格坐標 (X{{ cold.x }}, Y{{ cold.y }})
            </p>
            <p>
              {{ cubename }} {{ cubeno }}
            </p>
          </div>
          <div>
            TWD97 ({{ twd.x }}, {{ twd.y }})
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isHidden: false
    };
  },
  props: {
    reference: Object,
    csc: Object,
    twd: Object,
    cubeno: Number,
    cubename: String,
    cold: Object
  },
  mounted () {
    if (this.screenWidth < 1024) {
      this.$store.commit('SET_MOBILE_SELECT', true);
    }
  },
  computed: {
    contentHandler () {
      const { longitude, latitude } = this.reference;
      return `經度：${longitude}、緯度：${latitude}`;
    },
    isHiddenCtrl () {
      return this.isHidden;
    },
    screenWidth () {
      return this.$store.state.screenWidth;
    }
  },
  watch: {
    isHiddenCtrl (value) {
      if (value === true && this.screenWidth < 1024) {
        this.$store.commit('SET_MOBILE_SELECT', false);
      }

      if (value === false && this.screenWidth < 1024) {
        this.$store.commit('SET_MOBILE_SELECT', true);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';
@import '~/assets/scss/components/_messageBox.scss';

// * 我的位置視窗

.position-alert {
  width: 100%;
  position: absolute;
  bottom: 0%;
  left: 0;
  z-index: 5500;

  @include min-width(map-get($desktop, sm)) {
    width: 325px;
    left: calc((100% - 325px) / 2);
    z-index: 4000;
  }
}

.msgbox {
  @include min-width(map-get($desktop, sm)) {
    margin-bottom: 20px;
  }

  @include max-width(map-get($tablet, lg)) {
    border-radius: 0;
  }

  &.is-hidden {
    transform: translateY(65%);
  }

  &.all_hide {
    transform: translateY(200%);
  }
}

.msgbox__wrapper {
  @include max-width(map-get($tablet, lg)) {
    width: 100%;
  }
}

.msgbox__header {
  @include max-width(map-get($tablet, lg)) {
    min-height: auto;
    padding: 5px 10px;
    color: $color-black;
    background-color: $color-white;
  }
}

.msgbox__title {
  @include max-width(map-get($tablet, lg)) {
    padding: 0;

    &.has-icon.icon-my-position::before {
      background-image: url('~/assets/img/icon/icon-my-position_black.svg');
    }
  }
}

.msgbox__close-btn {
  @include max-width(map-get($tablet, lg)) {
    margin-top: 0;
    margin-bottom: 0;
    background: {
      image: url('~/assets/img/icon/icon-clear_dark-blue.svg');
      size: 60%;
    }
  }
}

.msgbox__content {
  padding: 10px 15px;

  @include min-width(map-get($desktop, sm)) {
    padding: 15px 25px;
  }

  // .top {
  //   display: flex;
  // }
}

</style>
