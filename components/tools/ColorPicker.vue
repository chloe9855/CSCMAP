<template>
  <div class="colorPicker" :class="{'theme-normal': themeNormal === true}">
    <label v-if="themeNormal === false" class="colorPicker__caption">{{ caption }}</label>
    <div class="colorPicker__input fieldset has-inner-btn">
      <InputContentListener v-model="colorValue" />
      <div class="inner-input__control">
        <a
          href="javascript:;"
          class="inner-input__btn icon-color-circle"
          @click.stop="pickerCtrl = !pickerCtrl"
          @mousedown.prevent
        >選取顏色</a>
      </div>
    </div>
    <client-only>
      <div
        v-if="pickerCtrl === true"
        class="colorPicker__picker"
        @click.stop
      >
        <ColorPicker
          :value="colorValue"
          @input="updateValue"
        />
      </div>
    </client-only>
  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr';
import { Chrome } from 'vue-color';
import InputContentListener from '~/components/tools/InputContentListener';

export default {
  data () {
    return {
      bodySelector: null,
      colorValue: '',
      pickerCtrl: false
    };
  },
  components: {
    'client-only': NoSSR,
    ColorPicker: Chrome,
    InputContentListener
  },
  props: {
    caption: String,
    color: String,
    themeNormal: Boolean
  },
  created () {
    this.colorValue = this.color;
  },
  mounted () {
    this.bodySelector = document.querySelector('body');
  },
  beforeDestroy () {
    this.bodySelector.removeEventListener('click', this.closePickerHandler);
  },
  methods: {
    // * 更新顏色數值
    updateValue (value) {
      this.colorValue = value.hex;
    },
    // * 關閉 picker 選單
    closePickerHandler () {
      this.pickerCtrl = false;
    }
  },
  watch: {
    pickerCtrl (value) {
      if (value) {
        this.bodySelector.addEventListener('click', this.closePickerHandler);
      } else {
        this.bodySelector.removeEventListener('click', this.closePickerHandler);
      }
    },
    colorValue (value) {
      this.$emit('update', value);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';

// * 顏色選取器

.colorPicker {
  margin-left: 15px;
  display: flex;
  align-items: center;
  position: relative;

  &.theme-normal {
    margin-left: 0;
  }
}

.colorPicker__caption {
  margin-right: 10px;
  color: #333;
}

.colorPicker__input {
  width: 145px;

  @at-root .colorPicker.theme-normal & {
    margin-bottom: 0;
  }
}

.colorPicker__picker {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 100;
}

</style>
