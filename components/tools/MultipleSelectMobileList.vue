<template>
  <div
    class="mobile-multiple-select"
    :class="{ 'slide-up': $store.state.mobileSelectUP === true }"
  >
    <ul class="mobile-multiple-select__list">
      <li v-for="optionItem of options" :key="optionItem.value">
        <input
          :id="`${id}_${optionItem.value}`"
          v-model="selectedList"
          :value="optionItem"
          :name="`${id}`"
          type="checkbox"
          @change="$emit('update', selectedList)"
        >
        <label :for="`${id}_${optionItem.value}`">{{ optionItem.name }}</label>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedList: []
    };
  },
  props: {
    id: String,
    selected: Array,
    options: Array
  },
  created () {
    this.updateSelectedList(this.selected);
  },
  methods: {
    // * 更新目前所選的項目
    updateSelectedList (payload) {
      this.selectedList = [...payload];
    }
  },
  watch: {
    selected (value) {
      this.updateSelectedList(value);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';

// * 行動版的 Multiple Select 元件

.mobile-multiple-select {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  pointer-events: all;

  @include min-width(map-get($desktop, sm)) {
    display: none;
  }
}

//上滑消失效果
.slide-up {
  transition: ease-in-out 0.5s;
  transform: translateY(-300%);
}

.mobile-multiple-select__list {
  width: 100%;
  display: flex;
  align-items: center;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  word-break: break-all;

  > li {
    margin-right: 5px;
    margin-left: 5px;
  }

  label {
    max-width: 100px;
    padding: 6px 13px;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background-color: $color-white;
    border: 1px $color-gray solid;
    border-radius: 36px;
    cursor: pointer;
    word-break: keep-all;
  }

  input {
    width: 0;
    height: 0;
    padding: 0;
    margin: 0;
    position: absolute;
    opacity: 0;
    z-index: -9999;

    &:checked + label {
      color: $color-orange;
      background-color: $color-orange-light;
      border-color: $color-orange;
    }
  }
}
</style>
