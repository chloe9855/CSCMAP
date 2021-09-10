<template>
  <div ref="mybox" class="popupbox" :class="{ 'is-hidden': isHidden }">
    <div
      class="slideup-tips"
      :class="{ 'is-hidden': isHidden }"
      @click.stop="isHidden = !isHidden"
    />
    <div class="popupbox__wrapper">
      <div class="popupbox__header">
        <div class="popupbox__header-content">
          <label
            class="popupbox__title"
            :class="iconName ? `has-icon ${iconName}` : ''"
          >{{ name }}</label>
        </div>
        <a
          v-if="closeBtnText"
          href="javascript:;"
          class="links-btn"
          @click.stop="$emit('close')"
          @mousedown.prevent
        >{{ closeBtnText }}</a>
        <a
          v-else
          href="javascript:;"
          class="popupbox__close-btn"
          @click.stop="$emit('close')"
          @mousedown.prevent
          @click="$emit('showBar')"
        />
      </div>
      <div class="popupbox__content">
        <slot />
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
    name: String,
    iconName: String,
    closeBtnText: String
  },
  mounted () {
    this.$store.commit('SET_MOBILE_SELECT', true);
  },
  methods: {
    // PopupBox收合後 上方tag列和右側工具列要恢復顯示
  },
  computed: {
    isHiddenCtrl () {
      return this.isHidden;
    }
  },
  watch: {
    isHiddenCtrl (value) {
      if (value === true) {
        this.$store.commit('SET_MOBILE_SELECT', false);
      }

      if (value === false) {
        this.$store.commit('SET_MOBILE_SELECT', true);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';

.popupbox {
  width: 100%;
  // max-height: calc(100% - 180px);
  position: absolute;
  bottom: 0%;
  left: 0;
  // overflow: hidden;
  background-color: $color-white;
  z-index: 5500;
  box-shadow: 5px 4px 15px rgba($color-black, 0.15);

  &.is-hidden {
    bottom: 56px;
    transform: translateY(100%);
  }
}

.popupbox__wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.popupbox__header {
  padding: 5px 10px;
  display: flex;
  justify-content: space-between;
  color: $color-black;
  background-color: $color-white;
}

.popupbox__title {
  display: block;

  &.has-icon {
    line-height: 25px;

    &::before {
      content: '';
      width: 25px;
      height: 25px;
      margin-right: 5px;
      display: inline-block;
      vertical-align: top;

      background: {
        repeat: no-repeat;
        position: center;
        size: 80%;
      }
    }

    &.icon-add-land::before {
      background-image: url('~/assets/img/icon/icon-add.svg');
    }

    &.icon-set-position::before {
      background-image: url('~/assets/img/icon/icon-set-position_black.svg');
    }

    &.icon-my-position::before {
      background-image: url('~/assets/img/icon/icon-my-position_black.svg');
    }

    &.icon-measure::before {
      background-image: url('~/assets/img/icon/icon-measure_black.svg');
    }

    &.icon-grid::before {
      background-image: url('~/assets/img/icon/icon-grid_black.svg');
    }

    &.icon-switch-layers::before {
      background-image: url('~/assets/img/icon/icon-switch-layers_black.svg');
    }
  }
}

.popupbox__close-btn {
  width: 25px;
  height: 25px;
  display: block;
  background: url('~/assets/img/icon/icon-clear_dark-blue.svg') no-repeat center/60%;
}

.popupbox__content {
  max-height: 320px;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: $color-white;
  flex-grow: 1;
}

</style>
