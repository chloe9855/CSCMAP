<template>
  <div>
    <p class="add_icon2">
      <img class="mipic2" :src="changePic2" @click="picToggler2">
      <strong>資產序號</strong> {{ assetItem.manageNo }}
    </p>
    <div
      :class="`block-${assetItem.manageNo}`"
      class="default"
    >
      <!-- <p><strong>srlNo</strong> {{ assetItem.srlNo }}</p> -->
      <p><strong>各棟名稱</strong> {{ assetItem.buildName }}</p>
      <p><strong>類別</strong> {{ assetItem.type }}</p>
      <p><strong>保管單位</strong> {{ assetItem.ownerDept }}</p>
      <p><strong>保管人員</strong> {{ assetItem.ownerMan }}</p>
      <p><strong>資產驗收狀態</strong> {{ checkStus(assetItem.assetsStus) }}</p>
      <p><strong>資產標號</strong> {{ assetItem.assetsNo }}</p>
      <p><strong>房屋稅狀態</strong> {{ checkStus(assetItem.taxStus) }}</p>
      <p><strong>房屋稅稽編號</strong> {{ assetItem.taxNo }}</p>
      <p><strong>優惠稅狀態</strong> {{ checkStus(assetItem.offerStus) }}</p>
      <p><strong>優惠稅率核准函</strong> {{ assetItem.offerNo }}</p>
      <p><strong>保存登記狀態</strong> {{ checkStus(assetItem.saveStus) }}</p>
      <p><strong>保存登記建號</strong> {{ assetItem.saveNo }}</p>
      <p><strong>保登申辦與否</strong> {{ checkSaveType(assetItem.saveType) }}</p>
      <p><strong>保登辦理狀態說明</strong> {{ assetItem.saveMemo }}</p>

      <ul v-if="assetItem.assetChangeDatas !== undefined">
        <li v-for="chItem in assetItem.assetChangeDatas" :key="chItem.srlNo">
          <ErpAssetChange-component
            :item="chItem"
            :my-manage-no="assetItem.manageNo"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import ErpAssetChange from '~/components/ErpAssetChange';

export default {
  data () {
    return {
      changePic2: require('~/assets/img/plus.png')
    };
  },
  components: {
    'ErpAssetChange-component': ErpAssetChange
  },
  props: {
    assetItem: Object,
    firstItem: Object,
    hideBlock: Boolean
  },
  mounted () {
    // this.getFirstItem();
  },
  methods: {
    // * 判斷資料狀態
    checkStus (data) {
      if (data === '1') {
        return '未辦';
      } else if (data === '2') {
        return '已辦 ';
      } else {
        return '';
      }
    },
    checkSaveType (data) {
      if (data === 'Y') {
        return '申請';
      } else {
        return '免申請';
      }
    },
    picToggler2 () {
      if (this.changePic2 === require('~/assets/img/minus.png')) {
        this.changePic2 = require('~/assets/img/plus.png');
        document.querySelector(`.block-${this.assetItem.manageNo}`).style.display = 'none';
      } else {
        this.changePic2 = require('~/assets/img/minus.png');
        document.querySelector(`.block-${this.assetItem.manageNo}`).style.display = 'block';
      }
    }
    // * 排第一個的會展開
    // getFirstItem () {
    //   if (this.firstItem.srlNo === this.assetItem.srlNo) {
    //     this.changePic2 = require('~/assets/img/minus.png');
    //     document.querySelector(`.block-${this.assetItem.srlNo}`).style.display = 'block';
    //   }
    // }
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
