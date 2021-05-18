<template>
  <div
    class="erpcontent"
    :class="{
      'mode-detail': modeType === 'detail',
      'is-hidden': isHidden
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
              <div v-if="detailTypeCurrent === 0" class="navtabs__content">
                <p>建物資料</p>
              </div>
              <div v-if="detailTypeCurrent === 1" class="navtabs__content">
                <p>執照資料</p>
              </div>
              <div v-if="detailTypeCurrent === 2" class="navtabs__content">
                <p>資產資訊</p>
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

export default {
  data () {
    return {
      isHidden: false,
      modeType: '',
      currentItem: {},
      detailTypeCurrent: '',
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
    'BuildingItem-component': BuildingItem
  },
  props: {
    itemsList: Array,
    currentId: String
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
      // ? 打一個事件至上層，控制地圖API去移動至目前選取的標的
      this.$emit('map-focus', payload);
      this.currentItem = payload;
      this.modeType = 'current';
      this.$store.commit('SET_MOBILE_SELECT', true);
    },
    // * 返回搜尋結果
    backToNormalModeHandler () {
      this.currentItem = {};
      this.modeType = '';
      this.$store.commit('SET_MOBILE_SELECT', false);

      // 滾動條移動到目前選取的項目的位置
      if (this.currentId !== '') {
        const index = this.itemsList.findIndex(item => item.id === this.currentId);

        this.$nextTick(() => {
          const result = index < 1 ? 0 : (index * 142);
          this.$refs.content.scrollTop = result;
        });
      }
    },
    // * 介面設定為 detail 模式
    setModeDetailHandler () {
      this.modeType = 'detail';
      this.CONSOLE('【ERP介面】根據所選項目取得建物的詳細資訊');
    }
  },
  watch: {
    currentItem: {
      handler () {
        this.setDefaultDetailType();
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';

.erpcontent {
  width: 100%;
  max-height: calc(100% - 116px);
  position: fixed;
  bottom: 0%;
  left: 0;
  overflow: hidden;
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
