<template>
  <div class="guide-service">
    <h1 class="guide-service__title">
      <span>中鋼廠區建物地理資訊平台</span>
    </h1>
    <div class="guide-service__content">
      <p>中鋼「GIS建物地理資訊平台」是一種具空間資訊專業形式的整合性資料管理平台，具備集中、輸入、儲存、查詢、定位和顯示建物地理資訊之功能，能夠應用於用地發展規劃、建物資訊調查、資產稅籍管理及工程推展等面向。</p>
    </div>
  </div>
</template>

<script>
export default {
  head () {
    return {
      bodyAttrs: {
        class: 'theme-home'
      }
    };
  },
  mounted () {
    this.$store.commit('GET_NOW_URL', 'about');
  }
};
</script>

<style lang="scss" scoped>
  @import '~/assets/scss/utils/_utils.scss';
  @import '~/assets/scss/components/_guideService.scss';
</style>
