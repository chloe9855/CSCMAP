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
              @click.stop="$emit('clickStructure'), $store.commit('DONT_HIDE_NAV', false);"
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
              @click.stop="$emit('clickLattice'), $store.commit('DONT_HIDE_NAV', true);"
            >
            <label for="mode-type-lattice">
              <span>方格</span>
            </label>
          </div>

          <!-- 方格圖權限之後改成下面這兩個 -->

          <!-- <div v-if="$store.state.gridRole === true" class="type-control__item">
            <input
              id="mode-type-lattice"
              v-model="modeType"
              type="radio"
              name="mode-type"
              :value="'lattice'"
              @click.stop="$emit('clickLattice'), $store.commit('DONT_HIDE_NAV', true);"
            >
            <label for="mode-type-lattice">
              <span>方格</span>
            </label>
          </div> -->

          <!-- <div v-if="$store.state.gridRole === false" class="type-control__item">
            <input
              id="mode-type-lattice"
              @click.stop="checkUserRole"
            >
            <label for="mode-type-lattice">
              <span>方格</span>
            </label>
          </div> -->
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
          <InputListenerGrid
            ref="inputLatticeKeyword"
            v-model.trim="myLatticeWord"
            :placeholder="'請輸入方格圖號'"
            :is-password="false"
            :maxlength="maxlength"
            @enter="searchHandler"
          />
          <div class="inner-input__control is-desktop-hide">
            <a
              v-if="myLatticeWord.length > 0"
              href="javascript:;"
              class="inner-input__btn icon-clear"
              title="清除全部"
              @click.stop="clearLatticeSelected"
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

      <!-- <div v-if="modeType === 'lattice'" class="row">
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
      </div> -->

      <!-- 桌機 方格圖載入 -->
      <div v-if="modeType === 'lattice' && screenWidth > 1023" class="row">
        <div class="option-btn-group igg">
          <div class="checkicon0">
            <input id="checkbox-0" v-model="selectGrid" type="checkbox">
            <label
              v-if="$store.state.gridMode === true"
              for="checkbox-0"
              @click.stop="switchGridMode"
            >
              關閉方格選圖
            </label>
            <label
              v-if="$store.state.gridMode === false"
              for="checkbox-0"
              class="open-grid"
              @click.stop="switchGridMode"
            >
              開啟方格選圖
            </label>
          </div>
          <div class="checkbox igg2">
            <input id="checkbox-1" v-model="isChecked" type="checkbox" :disabled="isDisabled">
            <label for="checkbox-1">多圖顯示</label>
          </div>
        </div>
      </div>

      <!-- 手機 方格圖載入 -->
      <div v-if="modeType === 'lattice' && screenWidth < 1024" class="row">
        <div class="option-btn-group mgg">
          <div class="checkicon2">
            <input id="checkbox-0" v-model="selectGrid" type="checkbox">
            <label
              for="checkbox-0"
              :class="{ 'open-grid': $store.state.gridMode === false }"
              @click.stop="switchGridMode"
            >
              選圖
            </label>
          </div>
          <div class="checkbox mgg2">
            <input id="checkbox-1" v-model="isChecked" type="checkbox" :disabled="isDisabled">
            <label for="checkbox-1">多圖</label>
          </div>
          <div class="checkicon3" :class="{ 'disme' : isDisabled2 === true }" @click.stop="searchHandler">
            <input id="checkbox-2" type="checkbox" :disabled="isDisabled2">
            <label for="checkbox-2">匯入 </label>
          </div>
        </div>
      </div>

      <div v-if="modeType === 'lattice' && screenWidth > 1023" class="row is-flex-end igg3">
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
            title="匯入方格"
            @click.stop="searchHandler"
            @mousedown.prevent
          >
            <span>匯入方格</span>
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
    </div>
  </nav>
</template>

<script>
import MultipleSelect from '~/components/tools/MultipleSelect';
import MultipleSelectMobileList from '~/components/tools/MultipleSelectMobileList';
import InputContentListener from '~/components/tools/InputContentListener';
import InputListenerGrid from '~/components/tools/InputListenerGrid';

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
      },
      isDisabled: true,
      isDisabled2: true,
      // 多圖顯示
      isChecked: false,
      maxlength: 524288,
      // 方格點選 預設有勾選true 為方格可點選狀態
      selectGrid: true,
      // 過多圖號警示窗只能出現一次
      showBox: false
    };
  },
  components: {
    MultipleSelect,
    MultipleSelectMobileList,
    InputContentListener,
    InputListenerGrid
  },
  props: {
    open: Boolean,
    condition: Array,
    buildtype: Array,
    resultType: String,
    lattword: String
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
    this.$emit('nowSelect', this.modeType);
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
      this.myLatticeWord = '';
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
        if (this.myLatticeWord === '') {
          this.$swal({
            text: '請輸入方格圖號',
            width: 402,
            confirmButtonText: '確定',
            showCloseButton: true
          });
          return false;
        }

        const validResult = this.latticeKeywordValidator(this.myLatticeWord);
        if (validResult === false) { return false; }

        const myResult = {
          modeType: 'lattice',
          keyword: this.myLatticeWord
        };

        // 有勾多圖顯示
        if (this.isChecked === true) {
          const myNo = parseInt(this.myLatticeWord, 10);
          const myRows = [`${this.myLatticeWord}`, `${myNo + 100}`, `${myNo - 100}`, `${myNo + 1}`, `${myNo - 1}`];
          const newRows = [];
          myRows.forEach((item) => {
            if (parseInt(item, 10) > 0 && item.length === 2) {
              item = `00${item}`;
            } else if (parseInt(item, 10) > 0 && item.length === 3) {
              item = `0${item}`;
            } else if (parseInt(item, 10) < 0 && item.length === 4) {
              item = `-0${Math.abs(item)}`;
            } else if (parseInt(item, 10) < 0 && item.length === 3) {
              item = `-00${Math.abs(item)}`;
            }

            newRows.push(item);
          });

          // myResult.keyword = `${this.myLatticeWord},${myNo + 100},${myNo - 100},${myNo + 1},${myNo - 1}`;
          myResult.keyword = newRows.join(',');
          console.log(myResult.keyword);
        }

        this.$emit('search', myResult);

        // 清除輸入框內容
        this.myLatticeWord = '';
        // 警示窗恢復預設
        this.showBox = false;
      } else if (MODE_TYPE === 'structure') {
        result.status = this[MODE_TYPE].status.selected.value;

        const newArr = [];
        this[MODE_TYPE].types.selected.forEach((item) => {
          newArr.push(item.value);
        });
        const letters = newArr.join(',');
        result.types = letters;

        this.$emit('search', result);
      }

      // this.$emit('search', result);
    },
    // * 驗證方格圖號欄位
    latticeKeywordValidator (keyword) {
      // if (keyword.split(',').length > 3) {
      //   this.$swal({
      //     text: '輸入過多圖號，將造成系統不穩定',
      //     width: 402,
      //     confirmButtonText: '確定',
      //     showCloseButton: true
      //   });
      //   return false;
      // }

      // @ 正則規則你再自己調整
      // const reg = /^((-?|\+?)?[0-9]{4},){0,3}?((-?|\+?)?[0-9]{4})$/;
      // const result = reg.test(keyword);

      // if (result === false) {
      //   this.$swal({
      //     text: '請輸入正確的方格圖號格式',
      //     width: 402,
      //     confirmButtonText: '確定',
      //     showCloseButton: true
      //   });
      // }

      // return result;

      return keyword;
    },
    // * 如果是從首頁點擊「方格圖載入」，搜尋類型切換成「方格」
    switchType () {
      const searchURL = window.location.search;
      const targetPageName = searchURL.split('=')[1];
      if (targetPageName === 'searchModeLattice') {
        this.modeType = 'lattice';
        // this.$emit('clickLattice');
        // this.$store.commit('DONT_HIDE_NAV', true);
        document.getElementById('mode-type-lattice').click();
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
    },
    checkUserRole () {
      this.$swal({
        width: 402,
        text: '您目前無權限使用方格圖匯入功能，如需使用請洽V81方格圖小組申請!',
        confirmButtonText: '確定',
        showCloseButton: true
      });
    },
    // * 開啟or關閉方格點選
    switchGridMode () {
      const result = !this.$store.state.gridMode;
      this.$store.commit('OPEN_GRID_MODE', result);
    }
  },
  computed: {
    screenWidth () {
      return this.$store.state.screenWidth;
    },
    gridMode () {
      return this.$store.state.gridMode;
    },
    myLatticeWord: {
      get () {
        return this.lattword;
      },
      set (value) {
        this.$emit('latticeKeyWord', value);

        if (value === '') {
          this.isDisabled2 = true;
          this.isDisabled = true;
          this.isChecked = false;
          this.showBox = false;
          return;
        }

        const arr = value.split(',');
        if (arr.length > 0 && this.screenWidth < 1024) {
        // 匯入
          this.isDisabled2 = false;
        } else {
          this.isDisabled2 = true;
        }
        if (arr.length === 1) {
        // 多圖
          this.isDisabled = false;
        } else {
          this.isDisabled = true;
        }

        if (arr.length >= 6 && this.showBox === false) {
          this.$swal({
            text: '輸入過多圖號，將造成系統不穩定',
            width: 402,
            confirmButtonText: '確定',
            showCloseButton: true
          });
          this.showBox = true;
        }
      }
    }
  },
  watch: {
    modeType (value) {
      this.$emit('nowSelect', value);
    },
    // 勾選多圖顯示時，輸入框只能輸入1張圖號
    isChecked (value) {
      this.$emit('crossGrid', value);
      const number = parseInt(this.myLatticeWord, 10);
      if (value === true) {
        if (number > 0) {
          this.maxlength = 4;
        } else {
          this.maxlength = 5;
        }
      } else {
        this.maxlength = 524288;
      }
    },
    gridMode (value) {
      if (value === true) {
        this.$emit('closeWindow');
      }
    },
    myLatticeWord (value) {
      if (value === '') {
        this.isDisabled2 = true;
        this.isDisabled = true;
        this.isChecked = false;
        return;
      }

      const arr = value.split(',');
      if (arr.length > 0 && this.screenWidth < 1024) {
        // 匯入
        this.isDisabled2 = false;
      } else {
        this.isDisabled2 = true;
      }
      if (arr.length === 1) {
        // 多圖
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
      }

      if (arr.length >= 6 && this.showBox === false) {
        this.$swal({
          text: '輸入過多圖號，將造成系統不穩定',
          width: 402,
          confirmButtonText: '確定',
          showCloseButton: true
        });
        this.showBox = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';

.open-grid::before {
  background: url('~/assets/img/icon/locking.png') no-repeat center/contain !important;
}

.disme {
  opacity: 0.5;
}

.checkicon0 {
  display: inline-block;
  position: relative;
  color: white;

  input[type='checkbox'] {
    width: 0;
    height: 0;
    padding: 0;
    margin: 0;
    position: absolute;
    opacity: 0;
    z-index: -9999;
  }

  label {
    cursor: pointer;
    margin-left: 20px;
  }

  label::before {
    content: '';
    width: 20px;
    height: 20px;
    position: absolute;
    top: 0;
    left: -5px;
    background: url('~/assets/img/icon/unlock.svg') no-repeat center/contain;
  }

}

.checkicon2 {
  display: inline-block;
  position: relative;
  color: white;

  input[type='checkbox'] {
    width: 0;
    height: 0;
    padding: 0;
    margin: 0;
    position: absolute;
    opacity: 0;
    z-index: -9999;
  }

  label {
    cursor: pointer;
    margin-left: 25px;
  }

  label::before {
    content: '';
    width: 20px;
    height: 20px;
    position: absolute;
    top: 0;
    left: 0;
    background: url('~/assets/img/icon/unlock.svg') no-repeat center/contain;
  }

}

.checkicon3 {
  display: inline-block;
  position: relative;
  color: white;

  input[type='checkbox'] {
    width: 0;
    height: 0;
    padding: 0;
    margin: 0;
    position: absolute;
    opacity: 0;
    z-index: -9999;
  }

  label {
    cursor: pointer;
    margin-left: 25px;
  }

  label::before {
    content: '';
    width: 20px;
    height: 20px;
    position: absolute;
    top: 0;
    left: 0;
    background: url('~/assets/img/icon/importbx.svg') no-repeat center/contain;
  }

  input[type='checkbox']:checked + label {
    opacity: 0.5;
  }

}

.mgg {
  align-items: center !important;
  justify-content: space-between !important;
}

.igg {
  align-items: center !important;
  justify-content: flex-start !important;
}

.igg2 {
  margin: 0 !important;
  margin-left: 30px !important;
}

.igg3 {
  padding-top: 60px;
}

.mgg2 {
  margin: 0 !important;
}

.vieww-checkbox {
  display: flex;
  cursor: pointer;
  color: white;
}

.lock {
  background: url('~/assets/img/icon/unlock.svg') no-repeat center/contain;
}

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
