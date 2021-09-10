<template>
  <div
    class="erpcontent"
    :class="{
      'mode-detail': modeType === 'detail',
      'is-hidden': isHidden,
      'down': $store.state.myErpCluster === true,
      'hide-back': $store.state.stackWindow === true
    }"
  >
    <div
      v-if="modeType === ''"
      class="slideup-tips"
      :class="{ 'is-hidden': isHidden }"
      @click.stop="isHidden = !isHidden"
    />
    <div
      v-if="modeType === 'current'"
      class="slideup-tips is-hidden"
      @click.stop="setModeDetailHandler"
    />
    <div
      v-if="modeType === 'detail'"
      class="slideup-tips"
      @click.stop="modeType = 'current'"
    />
    <div class="erpcontent__wrapper">
      <div class="erpcontent__header">
        <div v-if="modeType === 'current'" class="row" @click.stop="setModeDetailHandler">
          <a
            href="javascript:;"
            class="back-btn"
            title="返回搜尋結果"
            @click.stop="backToNormalModeHandler"
            @mousedown.prevent
          />
        </div>
        <div v-else-if="modeType === 'detail'" class="row" @click.stop="modeType = 'current'">
          <a
            href="javascript:;"
            class="back-btn"
            title="返回搜尋結果"
            @click.stop="backToNormalModeHandler"
            @mousedown.prevent
          />
        </div>
        <div v-else class="row is-space-between">
          <label class="erpcontent__title">搜尋結果</label>
          <a
            href="javascript:;"
            class="links-btn"
            title="清除全部"
            @click.stop="$emit('close')"
            @mousedown.prevent
          >清除全部</a>
        </div>
      </div>

      <div ref="content" class="erpcontent__content">
        <BuildingItem-component
          v-if="modeType === 'current'"
          :item="currentItem"
          :detail-btn="false"
          @click-block="setCurrentItemHandler"
        />

        <div
          v-else-if="modeType === 'detail'"
          class="erpcontent__detail"
        >
          <BuildingItem-component
            :item="currentItem"
            :detail-btn="false"
          />
          <div class="navtabs">
            <div class="navtabs__header">
              <a
                v-for="typeItem of detailTypeList"
                :key="typeItem.id"
                href="javascript:;"
                class="navtabs__btn"
                :class="{ 'current': detailTypeCurrent === typeItem.id }"
                :title="typeItem.name"
                @click.stop="detailTypeCurrent = typeItem.id"
                @mousedown.prevent
              >
                <span>{{ typeItem.name }}</span>
              </a>
            </div>
            <div class="navtabs__body">
              <div v-if="detailTypeCurrent === 0" class="navtabs__content go-pad">
                <p><strong>工程名稱</strong> {{ buildingData.projectName }}</p>
                <p><strong>建築物形式</strong> {{ buildingData.structure }}</p>
                <p><strong>建物用途</strong> {{ buildingData.category }}</p>
                <p><strong>建物狀態</strong> {{ buildingData.stus }}</p>
                <p><strong>用地申請單位</strong> {{ buildingData.locApplyDept }}</p>
                <p><strong>用地申請人</strong> {{ buildingData.locApplyMan }}</p>
                <p><strong>管理序號</strong> {{ buildingData.manageNo }}</p>
                <p><strong>工令計劃編號</strong> {{ buildingData.applNo }}</p>
                <p><strong>建物使用名稱</strong> {{ buildingData.buildingName }}</p>
                <p><strong>產線設備名稱</strong> {{ buildingData.keyWord }}</p>
                <p><strong>基地地號</strong> {{ buildingData.locatedNo }}</p>
                <p><strong>請照主辦單位</strong> {{ buildingData.dept }}</p>
                <p><strong>建築師</strong> {{ buildingData.designMan }}</p>
                <p><strong>設計主辦單位</strong> {{ buildingData.designDept }}</p>
                <p><strong>設計廠商</strong> {{ buildingData.designVendor }}</p>
                <p><strong>施工主辦單位</strong> {{ buildingData.workDept }}</p>
                <p><strong>施工廠商</strong> {{ buildingData.workVendor }}</p>
              </div>
              <div v-if="detailTypeCurrent === 1" class="navtabs__content go-pad">
                <p><strong>建照編號</strong> {{ licenseData.permitNo }}</p>
                <p><strong>建照編號備註</strong> {{ licenseData.permitMemo }}</p>
                <p><strong>使照編號</strong> {{ licenseData.useNo }}</p>
                <p><strong>使照編號備註</strong> {{ licenseData.useMemo }}</p>
                <p><strong>環評狀態</strong> {{ checkEnvType(licenseData.envType) }}</p>
                <p><strong>說明</strong> {{ licenseData.envDesc }}</p>
                <p v-if="licenseData.removeChangeDatas.length > 0" class="add_icon">
                  <img class="mipic" :src="changePic" @click="picToggler">
                  <strong>拆除變更資料</strong>
                </p>
                <ul id="asset_block1">
                  <li
                    v-for="licenseItem in licenseData.removeChangeDatas"
                    :key="licenseItem.removeSrlNo"
                  >
                    <ErpLicenseDetail-component
                      :license-item="licenseItem"
                      :first-item="licenseData.removeChangeDatas[0]"
                    />
                  </li>
                </ul>
              </div>
              <div v-if="detailTypeCurrent === 2" class="navtabs__content go-pad">
                <p class="add_icon">
                  <img class="mipic" :src="changePic3" @click="picToggler3">
                  <strong>資產資料</strong>
                </p>
                <ul id="asset_block3">
                  <li
                    v-for="assetItem in assetData.assetDatas"
                    :key="assetItem.srlNo"
                  >
                    <ErpAssetDetail-component
                      :asset-item="assetItem"
                      :first-item="assetData.assetDatas[0]"
                    />
                  </li>
                  <div class="other_info">
                    <p><strong>工廠登記工文號狀態</strong> {{ checkStus(assetData.factoryStus) }}</p>
                    <p><strong>工廠登記工文號</strong> {{ assetData.factoryDoc }}</p>
                    <p><strong>工廠登記編號</strong> {{ assetData.factoryNo }}</p>
                    <p><strong>辦理狀態說明</strong> {{ assetData.factoryDesc }}</p>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <BuildingList-component
          v-else
          :items-list="itemsList"
          :current-id="currentId"
          :detail-btn="false"
          @click-block="setCurrentItemHandler"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BuildingList from '~/components/BuildingList';
import BuildingItem from '~/components/BuildingItem';
import ErpLicenseDetail from '~/components/ErpLicenseDetail';
import ErpAssetDetail from '~/components/ErpAssetDetail';

export default {
  data () {
    return {
      isHidden: false,
      modeType: '',
      currentItem: {},
      assetData: {},
      buildingData: {},
      licenseData: {},
      detailTypeCurrent: '',
      changePic: require('~/assets/img/minus.png'),
      changePic3: require('~/assets/img/minus.png'),
      myKey: '',
      nowMark: '',
      watchCluster: false,
      detailTypeList: [
        {
          id: 0,
          name: '建物資料'
        },
        {
          id: 1,
          name: '執照資料'
        },
        {
          id: 2,
          name: '資產資訊'
        }
      ]
    };
  },
  components: {
    'BuildingList-component': BuildingList,
    'BuildingItem-component': BuildingItem,
    'ErpLicenseDetail-component': ErpLicenseDetail,
    'ErpAssetDetail-component': ErpAssetDetail
  },
  props: {
    itemsList: Array,
    currentId: String,
    clusData: Object
  },
  created () {
    this.setDefaultDetailType();
  },
  methods: {
    // * 預設先選詳細資料頁籤的第一個
    setDefaultDetailType () {
      this.detailTypeCurrent = this.detailTypeList[0].id;
    },
    // * 從搜尋結果中選取一筆
    setCurrentItemHandler (payload) {
      this.$emit('map-focus', payload);

      this.$store.state.gisMapp.markerBounds([payload.key], 1.25).forEach((m) => { this.nowMark = m; });
      if (this.nowMark === '') {
        this.$swal({
          icon: 'warning',
          width: 280,
          text: '無建物位置資訊',
          confirmButtonText: '確定',
          showCloseButton: true
        });

        // return;
      }

      // ? 打一個事件至上層，控制地圖API去移動至目前選取的標的
      // this.$emit('map-focus', payload);
      this.currentItem = payload;
      this.modeType = 'current';
      this.$store.commit('SET_MOBILE_SELECT', true);
      this.getMyKey();
      this.nowMark = '';
    },
    // * 返回搜尋結果
    backToNormalModeHandler () {
      // 0722註解
      // this.currentItem = {};
      this.modeType = '';
      this.$store.commit('SET_MOBILE_SELECT', false);

      // 滾動條移動到目前選取的項目的位置
      if (this.currentId !== '') {
        const index = this.itemsList.findIndex(item => item.key === this.currentId);

        this.$nextTick(() => {
          const result = index < 1 ? 0 : (index * 142);
          this.$refs.content.scrollTop = result;
        });
      }
    },
    // * 介面設定為 detail 模式
    setModeDetailHandler () {
      this.modeType = 'detail';
      this.getDetailData();
      this.CONSOLE('【ERP介面】根據所選項目取得建物的詳細資訊');
    },
    // * 先切割每筆資料的key值 (到'-'符號之前)
    getMyKey () {
      const newArr = this.currentItem.key.split('-');
      this.myKey = newArr[0];
    },
    // * 根據所選項目取得建物的詳細資訊
    getDetailData () {
      fetch(`/csc2api/proxy?url=http://east.csc.com.tw/eas/mhb/rest/mhbe/getDataByManageNo?_format=json%26manageNo=${this.myKey}`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then((response) => {
        return response.json();
      }).then((data) => {
        console.log(data);

        this.assetData = data.assetData;
        this.buildingData = data.buildingData;
        this.licenseData = data.licenseData;
        console.log(data);
      }).catch((err) => {
        console.log('錯誤:', err);
      });
    },
    // * 判斷資料狀態
    checkStus (data) {
      if (data === '1') {
        return '已辦';
      } else {
        return '未辦';
      }
    },
    checkEnvType (data) {
      if (data === 'A') {
        return '環評';
      } else if (data === 'B') {
        return '免環評';
      } else {
        return '其他';
      }
    },
    picToggler () {
      if (this.changePic === require('~/assets/img/minus.png')) {
        this.changePic = require('~/assets/img/plus.png');
        document.getElementById('asset_block1').style.display = 'none';
        // 第一層收合時 順便收合第二層
        this.$store.commit('HIDE_ASSET_BLOCK', false);
      } else {
        this.changePic = require('~/assets/img/minus.png');
        document.getElementById('asset_block1').style.display = 'block';
        this.$store.commit('HIDE_ASSET_BLOCK', true);
      }
    },
    picToggler3 () {
      if (this.changePic3 === require('~/assets/img/minus.png')) {
        this.changePic3 = require('~/assets/img/plus.png');
        document.getElementById('asset_block3').style.display = 'none';
        //
        this.$store.commit('HIDE_ASSET_BLOCK', false);
      } else {
        this.changePic3 = require('~/assets/img/minus.png');
        document.getElementById('asset_block3').style.display = 'block';
        this.$store.commit('HIDE_ASSET_BLOCK', true);
      }
    }
  },
  computed: {
    listenCluster () {
      return this.$store.state.myErpCluster;
    }
  },
  watch: {
    currentItem: {
      handler () {
        this.setDefaultDetailType();
      },
      deep: true
    },
    listenCluster: {
      handler (value) {
        // 在ClusterErpBox出現 且先前有其它查詢結果的狀態下 : 讓ErpContentBox回歸''模式 且若之前有選取建物會有橘標, 用css來把ErpContentBox藏到下面
        if (value === true && this.watchCluster === false) {
          this.backToNormalModeHandler();
          this.watchCluster = true;
        } else if (value === true && this.watchCluster === true) {
          this.$emit('map-focus', this.currentItem);
          this.watchCluster = false;
        }
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';

// * 手機版 當已有建物查詢結果時 又開啟工具列視窗 -> erpbox會被壓在後面
.hide-back {
  z-index: 200 !important;
}

.down {
  transition: ease-in-out 0.5s;
  transform: translateY(150%) !important;
}

.go-pad {
  padding: 14px 33px !important;
}

.erpcontent {
  width: 100%;
  // max-height: calc(100% - 116px);
  position: fixed;
  bottom: 0%;
  left: 0;
  // overflow: hidden;
  background-color: $color-white;
  z-index: 6000;
  box-shadow: 5px 4px 15px rgba($color-black, 0.15);

  &.is-hidden {
    bottom: 56px;
    transform: translateY(100%);
  }

  &.mode-detail {
    height: calc(100% - 60px);
    max-height: none;
    z-index: 6500;
  }
}

.erpcontent__wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.erpcontent__header {
  padding: 5px 10px;
  display: flex;
  color: $color-black;
  background-color: $color-white;

  .row {
    width: 100%;
    margin-top: 0;
    margin-bottom: 0;
  }
}

.erpcontent__content {
  max-height: calc(100vh - 172px);
  overflow-x: hidden;
  overflow-y: auto;
  background-color: $color-white;
  flex-grow: 1;

  @at-root .erpcontent.mode-detail & {
    max-height: none;
  }
}

.erpcontent__title {
  color: $color-black;
  line-height: 25px;

  &::before {
    content: '';
    width: 25px;
    height: 25px;
    margin-right: 5px;
    display: inline-block;
    vertical-align: top;
    background: url('~/assets/img/icon/icon-search_dark-blue.svg') no-repeat center/contain;
  }
}

.erpcontent__detail {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.back-btn {
  width: 25px;
  height: 25px;
  display: block;
  background: url('~/assets/img/icon/right.svg') no-repeat center/50%;
}

.navtabs {
  flex-grow: 1;
  width: 100%;
  height: 100%;
}

@import '~/assets/scss/components/_navtabs.scss';

</style>
