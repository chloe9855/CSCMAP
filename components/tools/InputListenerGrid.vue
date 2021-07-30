<template>
  <input
    :id="id"
    ref="notdrag"
    :value="value"
    :type="isPassword === true ? 'password' : 'text'"
    :placeholder="placeholder"
    :class="{ 'has-content': value !== '' }"
    :maxlength="maxlength"
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
    maxlength: Number
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
