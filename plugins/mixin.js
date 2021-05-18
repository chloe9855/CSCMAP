import Vue from 'vue';

Vue.mixin({
  methods: {
    // * Prevent Default
    SET_PREVENT_DEFAULT (e) {
      e.preventDefault();
    },
    // * 取得唯一 ID 值
    GET_RESOURCE_ID () {
      const date = new Date();
      return `${date.getTime()}`;
    },
    // * 另開視窗
    REDIRECT_DETAIL (urlPath) {
      if (process.client) {
        window.open(urlPath);
      }
    },
    // * 提醒用的 concole
    CONSOLE (payload) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(payload);
      }
    }
  }
});
