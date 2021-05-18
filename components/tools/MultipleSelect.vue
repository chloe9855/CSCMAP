<template>
  <div class="select multiple-select">
    <button
      class="multiple-select__btn"
      @click.stop="open = !open"
    >
      <span v-text="placeholderHandler" />
    </button>
    <div v-if="open === true" class="multiple-select__drop" @click.stop>
      <ul class="multiple-select__list">
        <li v-for="optionItem of options" :key="optionItem.value">
          <div class="multiple-select__item">
            <input
              :id="`${id}_${optionItem.value}`"
              v-model="selectedList"
              :value="optionItem"
              :name="`${id}`"
              type="checkbox"
              @change="updateValueHandler"
            >
            <label :for="`${id}_${optionItem.value}`">{{ optionItem.name }}</label>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      open: false,
      selectedList: [],
      bodySelector: null
    };
  },
  props: {
    id: String,
    selected: Array,
    options: Array,
    placeholder: String
  },
  created () {
    this.updateSelectedList(this.selected);
  },
  mounted () {
    this.bodySelector = document.querySelector('body');
  },
  beforeDestroy () {
    this.bodySelector.removeEventListener('click', this.closeDropBlock);
  },
  methods: {
    // * 更新目前所選的項目
    updateSelectedList (payload) {
      this.selectedList = [...payload];
    },
    // * 更新目前所選的項目（更新至上層）
    updateValueHandler () {
      this.$emit('update', this.selectedList);
    },
    // * 關閉多選選單
    closeDropBlock () {
      this.open = false;
    }
  },
  computed: {
    // * Placeholder 文字
    placeholderHandler () {
      const amount = this.selectedList.length;

      if (amount < 1) {
        return this.placeholder;
      } else if (amount < 4) {
        return this.selectedList.map(item => item.name).join(', ');
      } else {
        return `${amount} 項建物類型已選擇`;
      }
    }
  },
  watch: {
    selected (value) {
      this.updateSelectedList(value);
    },
    open (value) {
      if (value === true) {
        this.bodySelector.addEventListener('click', this.closeDropBlock);
      } else {
        this.bodySelector.removeEventListener('click', this.closeDropBlock);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';

// * 電腦版的 Multiple Select 元件

.multiple-select__btn {
  width: 100%;
  padding: 6px 40px 6px 10px;
  position: relative;
  text-align: left;
  color: $color-basic;
  background-color: $color-white;
  border: 1px $color-gray-light solid;
  border-radius: 5px;
  transition: box-shadow 0.15s;
  transform: translateZ(0);
  line-height: 1.6em;
  appearance: none;
  cursor: pointer;

  span {
    width: 270px;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: keep-all;
  }
}

.multiple-select__drop {
  width: 100%;
  padding: 5px 0;
  position: absolute;
  top: 100%;
  left: 0;
  overflow: hidden;
  background-color: $color-white;
  border: 1px $color-gray-light solid;
  border-radius: 5px;
  z-index: 10;
  box-shadow: 0 4px 5px rgba($color-black, 0.15);
}

.multiple-select__item {
  padding: 4px 8px;
  background-color: $color-white;

  input {
    width: 0;
    height: 0;
    padding: 0;
    margin: 0;
    position: absolute;
    opacity: 0;
    z-index: -9999;

    &:checked + label::before {
      background: $color-orange url('~/assets/img/icon/icon-checked.svg') no-repeat center/70%;
    }
  }

  label {
    display: flex;
    align-items: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: keep-all;
    color: $color-black;
    cursor: pointer;
    margin-bottom: 0;

    &::before {
      content: '';
      width: 19px;
      height: 19px;
      margin-right: 10px;
      display: inline-block;
      vertical-align: top;
      background-color: $color-gray-light;
      border-radius: 5px;
    }
  }
}

</style>
