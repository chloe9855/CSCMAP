<template>
  <div>
    <p class="add_icon2">
      <img class="mipic2" :src="changePic" @click="picToggler">
      <strong>資產異動序號</strong> {{ item.srlNo }}
    </p>
    <div
      :class="`block-${myManageNo}-${item.srlNo}`"
      class="default"
    >
      <p><strong>資產現狀</strong> {{ item.assetStus }}</p>
      <p><strong>房屋除稅公文號</strong> {{ item.taxOverNo }}</p>
      <p><strong>稅率變更公文號</strong> {{ item.offerOverNo }}</p>
      <p><strong>保存登記滅失公文號</strong> {{ item.saveOverNo }}</p>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      changePic: require('~/assets/img/plus.png')
    };
  },
  props: {
    item: Object,
    myManageNo: String
  },
  mounted () {
  },
  methods: {
    picToggler () {
      if (this.changePic === require('~/assets/img/minus.png')) {
        this.changePic = require('~/assets/img/plus.png');
        document.querySelector(`.block-${this.myManageNo}-${this.item.srlNo}`).style.display = 'none';
      } else {
        this.changePic = require('~/assets/img/minus.png');
        document.querySelector(`.block-${this.myManageNo}-${this.item.srlNo}`).style.display = 'block';
      }
    }

  },
  computed: {
    hideAsset () {
      return this.$store.state.hideAsset;
    }
  },
  watch: {
    hideAsset (value) {
      if (value === true) {
        this.changePic = require('~/assets/img/plus.png');
        const type = document.querySelectorAll('.default');
        type.forEach((item) => {
          item.style.display = 'none';
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';

.add_icon2 {
  margin: 5px 0;
}

.mipic2 {
  margin-bottom: -2px;
}

.default {
  margin-left: 19px;
  margin-bottom: 10px;
  display: none;
}

p {
  margin-bottom: 0;

  strong {
    margin-right: 7px;
    color: #000;
  }
}

</style>
