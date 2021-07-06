<template>
  <nav
    class="query-window"
    :class="{ 'is-open': open === true }"
  >
    <a
      href="javascript:;"
      class="query-window__btn"
      :class="{ 'is-open': open === true }"
      @click.stop="$emit('control', !open)"
      @mousedown.prevent
    />

    <div
      class="query-window__controller"
      :class="{ 'without-border-radius': resultType === 'structure' || resultType === 'lattice' }"
    >
      <div class="row">
        <div class="type-control">
          <div class="type-control__item">
            <input
              id="mode-type-structure"
              v-model="modeType"
              type="radio"
              name="mode-type"
              :value="'structure'"
            >
            <label for="mode-type-structure">
              <span>建物</span>
            </label>
          </div>
          <div class="type-control__item">
            <input
              id="mode-type-lattice"
              v-model="modeType"
              type="radio"
              name="mode-type"
              :value="'lattice'"
            >
            <label for="mode-type-lattice">
              <span>方格</span>
            </label>
          </div>
        </div>
        <div
          v-if="modeType === 'structure'"
          class="fieldset has-inner-btn"
        >
          <InputContentListener
            ref="inputStructureKeyword"
            v-model.trim="structure.keyword"
            :placeholder="'請輸入關鍵字搜尋建物'"
            :is-password="false"
            @enter="searchHandler"
          />
          <div class="inner-input__control is-desktop-hide">
            <!-- <a
              href="javascript:;"
              class="inner-input__btn icon-search"
              title="搜尋"
              @click.stop="searchHandler"
              @mousedown.prevent
            >
              搜尋
            </a> -->
            <a
              v-if="structure.keyword.length > 0"
              href="javascript:;"
              class="inner-input__btn icon-clear"
              title="清除全部"
              @click.stop="structure.keyword = ''"
              @mousedown.prevent
            >
              清除全部
            </a>
          </div>
        </div>
        <div
          v-if="modeType === 'lattice'"
          class="fieldset has-inner-btn"
        >
          <InputContentListener
            ref="inputLatticeKeyword"
            v-model.trim="lattice.keyword"
            :placeholder="'請輸入方格圖號'"
            :is-password="false"
            @enter="searchHandler"
          />
          <div class="inner-input__control is-desktop-hide">
            <a
              v-if="lattice.keyword.length > 0"
              href="javascript:;"
              class="inner-input__btn icon-clear"
              title="清除全部"
              @click.stop="lattice.keyword = ''"
              @mousedown.prevent
            >
              清除全部
            </a>
            <!-- <a
              href="javascript:;"
              class="inner-input__btn icon-download"
              title="匯入方格圖層"
              @click.stop="searchHandler"
              @mousedown.prevent
            >
              匯入方格圖層
            </a> -->
          </div>
        </div>
      </div>

      <div v-if="modeType === 'structure' && screenWidth > 1023" class="row">
        <div class="fieldset">
          <div class="select">
            <select v-model="structure.status.selected">
              <option
                v-for="item of structure.status.options"
                :key="item.value"
                :value="item"
              >
                {{ item.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="modeType === 'structure' && screenWidth > 1023" class="row">
        <div class="fieldset">
          <MultipleSelect
            :id="'multiple_select'"
            :selected="structure.types.selected"
            :options="structure.types.options"
            :placeholder="'建物類型'"
            @update="updateStructureSelected"
          />
        </div>
      </div>

      <div v-if="modeType === 'structure' && screenWidth > 1023" class="row is-space-between">
        <a
          href="javascript:;"
          class="controller-btn"
          title="更多篩選條件"
          @mousedown.prevent
        >
          更多篩選條件
        </a>
        <div class="btn-group">
          <a
            href="javascript:;"
            class="btn has-outline outline-color-white size-small"
            title="清除全部"
            @click.stop="clearStructureSelected"
            @mousedown.prevent
          >
            <span>清除全部</span>
          </a>
          <a
            href="javascript:;"
            class="btn has-back-icon icon-search size-small"
            title="搜尋"
            @click.stop="searchHandler"
            @mousedown.prevent
          >
            <span>搜尋</span>
          </a>
        </div>
      </div>

      <div v-if="modeType === 'lattice'" class="row">
        <div class="option-btn-group">
          <div class="option-btn checkbox">
            <input id="checkbox-0" type="checkbox" disabled>
            <label for="checkbox-0">解鎖方格點選</label>
          </div>
          <div class="option-btn checkbox">
            <input id="checkbox-1" type="checkbox">
            <label for="checkbox-1">載入方格文字</label>
          </div>
          <div class="option-btn checkbox">
            <input id="checkbox-2" type="checkbox">
            <label for="checkbox-2">載入九宮格</label>
          </div>
        </div>
      </div>

      <div v-if="modeType === 'lattice' && screenWidth > 1023" class="row is-flex-end">
        <div class="btn-group">
          <a
            href="javascript:;"
            class="btn has-outline outline-color-white size-small"
            title="清除全部"
            @click.stop="clearLatticeSelected"
            @mousedown.prevent
          >
            <span>清除全部</span>
          </a>
          <a
            href="javascript:;"
            class="btn has-back-icon icon-download size-small"
            title="匯入方格圖層"
            @click.stop="searchHandler"
            @mousedown.prevent
          >
            <span>匯入方格圖層</span>
          </a>
        </div>
      </div>
    </div>

    <MultipleSelectMobileList
      v-if="modeType === 'structure' && screenWidth < 1024"
      :id="'m_multiple_select'"
      :selected="structure.types.selected"
      :options="structure.types.options"
      @update="searchHandler2"
    />

    <slot />
  </nav>
</template>

<script>
import MultipleSelect from '~/components/tools/MultipleSelect';
import MultipleSelectMobileList from '~/components/tools/MultipleSelectMobileList';
import InputContentListener from '~/components/tools/InputContentListener';

export default {
  data () {
    return {
      modeType: 'structure',
      structure: {
        keyword: '',
        status: {
          selected: null,
          options: []
        },
        types: {
          selected: [],
          options: []
        }
      },
      lattice: {
        keyword: ''
      }
    };
  },
  components: {
    MultipleSelect,
    MultipleSelectMobileList,
    InputContentListener
  },
  props: {
    open: Boolean,
    condition: Array,
    buildtype: Array,
    resultType: String
  },
  created () {
    this.structure.types.options = this.buildtype;
    this.structure.status.options = this.condition;
    this.structure.status.selected = this.structure.status.options[0];

    // * 如果是從首頁點擊「方格圖載入」，搜尋類型切換成「方格」
    // if (this.$route.params.preload === 'searchModeLattice') {
    //   this.modeType = 'lattice';
    // }
  },
  mounted () {
    this.switchType();
    this.structure.types.options = this.buildtype;
  },
  methods: {
    // * 更新建物類型選項
    updateStructureSelected (payload) {
      this.structure.types.selected = payload;
    },
    // * 清除全部（建物）
    clearStructureSelected () {
      this.structure.keyword = '';
      this.structure.status.selected = this.structure.status.options[0];
      this.structure.types.selected = [];
      this.$emit('clearResult');
    },
    // * 清除全部（方格）
    clearLatticeSelected () {
      this.lattice.keyword = '';
      this.$emit('clearResult');
    },
    // * 清除全部
    clearAllHandler () {
      this.clearStructureSelected();
      this.clearLatticeSelected();
    },
    // * 搜尋（搜尋前的驗證）
    searchHandler () {
      const MODE_TYPE = this.modeType;
      const KEYWORD = this[MODE_TYPE].keyword.replace(/\s/g, '').replace(/,$/, '');

      const result = {
        modeType: MODE_TYPE,
        keyword: KEYWORD
      };

      if (MODE_TYPE === 'lattice') {
        if (KEYWORD === '') {
          this.$swal({
            text: '請輸入方格圖號',
            width: 402,
            confirmButtonText: '確定',
            showCloseButton: true
          });
          return false;
        }

        const validResult = this.latticeKeywordValidator(KEYWORD);
        if (validResult === false) { return false; }
      } else if (MODE_TYPE === 'structure') {
        result.status = this[MODE_TYPE].status.selected.value;

        const newArr = [];
        this[MODE_TYPE].types.selected.forEach((item) => {
          newArr.push(item.value);
        });
        const letters = newArr.join(',');
        result.types = letters;
      }

      this.$emit('search', result);
    },
    // * 驗證方格圖號欄位
    latticeKeywordValidator (keyword) {
      if (keyword.split(',').length > 3) {
        this.$swal({
          text: '輸入過多圖號，將造成系統不穩定',
          width: 402,
          confirmButtonText: '確定',
          showCloseButton: true
        });
        return false;
      }

      // @ 正則規則你再自己調整
      const reg = /^((-?|\+?)?[0-9]{4},){0,3}?((-?|\+?)?[0-9]{4})$/;
      const result = reg.test(keyword);

      if (result === false) {
        this.$swal({
          text: '請輸入正確的方格圖號格式',
          width: 402,
          confirmButtonText: '確定',
          showCloseButton: true
        });
      }

      return result;
    },
    // * 如果是從首頁點擊「方格圖載入」，搜尋類型切換成「方格」
    switchType () {
      const searchURL = window.location.search;
      const targetPageName = searchURL.split('=')[1];
      if (targetPageName === 'searchModeLattice') {
        this.modeType = 'lattice';
      }
    },
    searchHandler2 (payload) {
      this.structure.types.selected = payload;

      const MODE_TYPE = this.modeType;
      const KEYWORD = this[MODE_TYPE].keyword.replace(/\s/g, '').replace(/,$/, '');

      const result = {
        modeType: MODE_TYPE,
        keyword: KEYWORD
      };

      if (MODE_TYPE === 'lattice') {
        if (KEYWORD === '') {
          this.$swal({
            text: '請輸入方格圖號',
            width: 402,
            confirmButtonText: '確定',
            showCloseButton: true
          });
          return false;
        }

        const validResult = this.latticeKeywordValidator(KEYWORD);
        if (validResult === false) { return false; }
      } else if (MODE_TYPE === 'structure') {
        result.status = this[MODE_TYPE].status.selected.value;

        const newArr = [];
        this[MODE_TYPE].types.selected.forEach((item) => {
          newArr.push(item.value);
        });
        const letters = newArr.join(',');
        result.types = letters;
      }

      this.$emit('search', result);
    }
  },
  computed: {
    screenWidth () {
      return this.$store.state.screenWidth;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';

// * 左側的查詢條件框

.query-window {
  width: 100%;
  display: flex;
  position: absolute;
  // top: 60px;
  top: 0;
  left: 0;
  z-index: 6000;
  flex-direction: column;
  pointer-events: none;

  @include min-width(map-get($desktop, sm)) {
    width: 375px;
    // height: calc(100% - 60px);
    height: 100%;
    transition: transform 0.4s;
    transform: translateX(-100%);

    &.is-open {
      transform: translateX(0%);
    }
  }
}

.query-window__btn {
  width: 25px;
  height: 80px;
  padding: 10px 7px;
  display: none;
  position: absolute;
  top: 20px;
  right: -25px;
  background-color: $color-blue-light;
  border-radius: 0 5px 5px 0;
  pointer-events: all;

  @include min-width(map-get($desktop, sm)) {
    display: block;
  }

  &::before {
    content: '';
    width: 11px;
    height: 11px;
    display: block;
    background: url('~/assets/img/icon/arrow-right_white.svg') no-repeat center/contain;
    transform: rotateZ(180deg);
  }

  &.is-open::before {
    transform: rotateZ(0deg);
  }
}

.query-window__controller {
  padding-right: 10px;
  padding-left: 10px;
  background-color: $color-blue-light;
  pointer-events: all;

  @include min-width(map-get($phone, md)) {
    padding-right: 15px;
    padding-left: 15px;
  }

  @include min-width(map-get($tablet, sm)) {
    padding-right: 20px;
    padding-left: 20px;
  }

  @include min-width(map-get($desktop, sm)) {
    min-height: 230px;
    padding-top: 10px;
    padding-bottom: 10px;
    position: relative;
    border-radius: 0 0 5px 5px;

    &.without-border-radius {
      border-radius: 0;
    }
  }
}

.controller-btn {
  color: $color-white;

  &::before {
    content: '';
    width: 1.6em;
    height: 1.6em;
    margin-right: 5px;
    display: inline-block;
    background: url('~/assets/img/icon/icon-controller.svg') no-repeat center/contain;
    vertical-align: top;
  }
}

.type-control {
  margin-right: 10px;
}

// *

.option-btn-group {
  justify-content: flex-end;

  @include max-width(map-get($phone, md) - 1) {
    justify-content: flex-start;
  }
}

</style>
