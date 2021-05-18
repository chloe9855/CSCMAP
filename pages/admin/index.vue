<template>
  <div class="guide-service">
    <h1 class="guide-service__title">
      <span>中鋼廠區建物地理資訊平台</span>
    </h1>
    <div class="guide-service__content">
      <div class="guide-service__form-group">
        <div class="fieldset has-icon">
          <label class="fieldset-icon icon-company" for="_company">請選擇公司</label>
          <div class="select">
            <select id="_company">
              <option>請選擇公司</option>
              <option>111</option>
              <option>222</option>
              <option>333</option>
            </select>
          </div>
        </div>
        <div class="fieldset has-icon">
          <label class="fieldset-icon icon-account" for="_account">輸入帳號</label>
          <InputContentListener
            :id="'_account'"
            v-model="account"
            :placeholder="'輸入帳號'"
            :is-password="false"
          />
        </div>
        <div class="fieldset has-icon">
          <label class="fieldset-icon icon-password" for="_password">輸入密碼</label>
          <InputContentListener
            :id="'_password'"
            v-model="password"
            :placeholder="'輸入密碼'"
            :is-password="true"
          />
        </div>
        <nuxt-link
          :to="'/'"
          class="btn size-full"
          title="登入"
          @mousedown.prevent
        >
          登入
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import InputContentListener from '~/components/tools/InputContentListener';

export default {
  data () {
    return {
      account: '',
      password: ''
    };
  },
  head () {
    return {
      bodyAttrs: {
        class: 'theme-home'
      }
    };
  },
  components: {
    InputContentListener
  }
};
</script>

<style lang="scss" scoped>
  @import '~/assets/scss/utils/_utils.scss';
  @import '~/assets/scss/components/_guideService.scss';
</style>
