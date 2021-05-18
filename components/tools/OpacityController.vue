<template>
  <div class="opacity-control">
    <a
      href="javascript:;"
      class="opacity-control__btn icon-decrease"
      @click.stop="valueComputeHandler(false)"
      @mousedown.prevent
    />
    <label class="opacity-control__value">{{ valueTextHandler }}</label>
    <a
      href="javascript:;"
      class="opacity-control__btn icon-increase"
      @click.stop="valueComputeHandler(true)"
      @mousedown.prevent
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      opacity: 0
    };
  },
  props: {
    id: String,
    value: Number
  },
  created () {
    this.opacity = this.value;
  },
  methods: {
    // * 透明度控制
    valueComputeHandler (isIncrease) {
      const _value = isIncrease === true ? 1 : -1;
      this.opacity = this.opacity + _value;
      if (this.opacity >= 10) { this.opacity = 10; }
      if (this.opacity <= 0) { this.opacity = 0; }
    }
  },
  computed: {
    // * 透明度顯示文字
    valueTextHandler () {
      return `${this.opacity * 10}%`;
    }
  },
  watch: {
    opacity (value) {
      this.$emit('update', this.id, value);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';

// * 透明度

.opacity-control {
  width: 100px;
  height: 30px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ebedef;
  border-radius: 30px;
}

.opacity-control__btn {
  width: 20px;
  height: 20px;
  display: block;
  background: {
    repeat: no-repeat;
    size: 50%;
    position: center;
  }

  &.icon-decrease {
    background-image: url('~/assets/img/icon/arrow-left_blue.svg');
  }

  &.icon-increase {
    background-image: url('~/assets/img/icon/arrow-right_blue.svg');
  }
}

.opacity-control__value {
  display: block;
  text-align: center;
  color: $color-black;
}

</style>
