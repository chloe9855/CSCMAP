<template>
  <input
    :id="id"
    ref="notdrag"
    :value="value"
    :type="isPassword === true ? 'password' : 'text'"
    :inputmode="isDecimal === true ? 'decimal' : 'text'"
    :placeholder="placeholder"
    :class="{ 'has-content': value !== '' }"
    @input="$emit('input', $event.target.value)"
    @keyup.enter="enterHandler"
  >
</template>

<script>

export default {
  props: {
    id: String,
    placeholder: String,
    isPassword: Boolean,
    value: String,
    // 鍵盤只能輸入數字
    isDecimal: Boolean
  },
  mounted () {
    const myInput = this.$refs.notdrag;
    myInput.addEventListener('mousedown', (e) => {
      console.log('mousedown');
      this.$store.commit('CANCEL_INPUT_DRAG', true);
    });

    myInput.addEventListener('mouseup', (e) => {
      console.log('mouseup');
      this.$store.commit('CANCEL_INPUT_DRAG', false);
    });

    myInput.addEventListener('focus', () => {
      console.log('focus');
      this.$store.commit('INPUT_FOCUS_NOW', true);
    });
  },
  beforeDestroy () {
    // this.$refs.notdrag.removeEventListener('mousedown', e);
    // this.$refs.notdrag.removeEventListener('mouseup', e);
  },
  methods: {
    enterHandler (e) {
      e.target.blur();
      this.$emit('enter', e.target.value);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';

</style>
