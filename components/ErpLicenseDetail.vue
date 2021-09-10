<template>
  <div class="hide_block">
    <p class="add_icon2">
      <img class="mipic2" :src="changePic2" @click="picToggler2">
      <strong>拆除變更狀態</strong> {{ licenseItem.itemType }}
    </p>
    <div
      :class="`block-${licenseItem.removeSrlNo}`"
      class="default"
    >
      <p><strong>拆除序號</strong> {{ licenseItem.removeSrlNo }}</p>
      <p><strong>項目名稱</strong> {{ licenseItem.itemName }}</p>
      <p><strong>影響的建築面積</strong> {{ licenseItem.changeArea }}</p>
      <p v-if="licenseItem.itemType === '拆除'">
        <strong>拆照許可編號</strong> {{ licenseItem.approveRemoveNo }}
      </p>
      <p v-if="licenseItem.itemType === '拆除'">
        <strong>拆照許可備註</strong> {{ licenseItem.approveRemoveMemo }}
      </p>
      <p v-if="licenseItem.itemType === '拆除'">
        <strong>拆照編號</strong> {{ licenseItem.removeNo }}
      </p>
      <p v-if="licenseItem.itemType === '拆除'">
        <strong>拆照備註</strong> {{ licenseItem.removeMemo }}
      </p>
      <p v-if="licenseItem.itemType === '變更'">
        <strong>變更編號</strong> {{ licenseItem.changeNo }}
      </p>
      <p v-if="licenseItem.itemType === '變更'">
        <strong>變更備註</strong> {{ licenseItem.changeMemo }}
      </p>
      <p><strong>雜項工作用途說明</strong> {{ licenseItem.otherMemo }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      changePic2: require('~/assets/img/plus.png')
    };
  },
  props: {
    licenseItem: {
      type: Object,
      required: true
    },
    firstItem: Object
  },
  mounted () {
    // this.getFirstItem();
  },
  methods: {
    picToggler2 () {
      if (this.changePic2 === require('~/assets/img/minus.png')) {
        this.changePic2 = require('~/assets/img/plus.png');
        document.querySelector(`.block-${this.licenseItem.removeSrlNo}`).style.display = 'none';
      } else {
        this.changePic2 = require('~/assets/img/minus.png');
        document.querySelector(`.block-${this.licenseItem.removeSrlNo}`).style.display = 'block';
      }
    },
    // * 排第一個的會展開
    getFirstItem () {
      if (this.firstItem.removeSrlNo === this.licenseItem.removeSrlNo) {
        this.changePic2 = require('~/assets/img/minus.png');
        document.querySelector(`.block-${this.licenseItem.removeSrlNo}`).style.display = 'block';
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
        this.changePic2 = require('~/assets/img/plus.png');
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
  margin-left: 32px;
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
