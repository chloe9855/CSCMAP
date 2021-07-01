<template>
  <div class="position-alert">
    <div class="msgbox">
      <div class="slideup-tips" @click.stop="$emit('control', false)" />
      <div class="msgbox__wrapper">
        <div class="msgbox__header">
          <div class="msgbox__header-content">
            <label class="msgbox__title has-icon icon-my-position">坐標定位</label>
          </div>
          <a
            href="javascript:;"
            class="msgbox__close-btn"
            @click.stop="$emit('control', false)"
            @mousedown.prevent
          />
        </div>
        <div class="msgbox__content">
          <!-- <div v-text="contentHandler" /> -->
          <div class="top">
            <p>方格坐標 ({{ csc.x }}, {{ csc.y }})</p>
            <p v-if="cold.x !== ''">
              冷三方格坐標 ({{ cold.x }}, {{ cold.y }})
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
  props: {
    reference: Object,
    csc: Object,
    twd: Object,
    cubeno: Number,
    cubename: String,
    cold: Object
  },
  computed: {
    contentHandler () {
      const { longitude, latitude } = this.reference;
      return `經度：${longitude}、緯度：${latitude}`;
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
