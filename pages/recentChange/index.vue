<template>
  <div class="article__container">
    <div class="article__aside">
      <div class="article__wrap theme-scrollbar">
        <div class="asideNavtabs">
          <div class="asideNavtabs__header">
            <a
              v-for="typeItem of navtabs.typeList"
              :key="typeItem.id"
              href="javascript:;"
              class="asideNavtabs__btn"
              :class="{ 'current': navtabs.current === typeItem.id }"
              @click.stop="navtabs.current = typeItem.id"
              @mousedown.prevent
            >
              <span>{{ typeItem.name }}</span>
            </a>
          </div>
          <div
            class="asideNavtabs__body"
            :class="{
              'is-current-first': navtabs.current === 0,
              'is-current-last': navtabs.current === navtabs.typeList.length - 1,
            }"
          >
            <InputContentListener
              v-model="reference.searchKeyword"
              :placeholder="`請輸入${navtabsCurrentName}`"
            />
          </div>
        </div>

        <h2>建物狀態</h2>

        <div class="option-btn-group">
          <div
            v-for="checkbox of reference.buildingStatus"
            :key="checkbox.id"
            class="option-btn checkbox"
          >
            <input :id="`building-status-chk_${checkbox.id}`" v-model="checkbox.isChecked" type="checkbox">
            <label :for="`building-status-chk_${checkbox.id}`">{{ checkbox.name }}</label>
          </div>
        </div>

        <h2>更新時間</h2>

        <div class="row">
          <div class="fieldset row-column">
            <date-picker
              v-model="reference.dateSelecter.from"
              type="date"
              format="YYYY-MM-DD"
              :value-type="'YYYY-MM-DD'"
              :lang="reference.dateSelecter.lang"
              :clearable="false"
              :editable="false"
              :placeholder="'開始年月日'"
            />
          </div>
          <div class="fieldset row-column">
            <date-picker
              v-model="reference.dateSelecter.to"
              type="date"
              format="YYYY-MM-DD"
              :value-type="'YYYY-MM-DD'"
              :lang="reference.dateSelecter.lang"
              :clearable="false"
              :editable="false"
              :placeholder="'結束年月日'"
              :disabled="reference.dateSelecter.from === ''"
              :disabled-date="disabledBeforeFormDate"
            />
          </div>
        </div>

        <h2>Helix 更新</h2>

        <div class="option-btn-group">
          <div
            v-for="checkbox of reference.helixUpdate"
            :key="checkbox.id"
            class="option-btn checkbox"
          >
            <input :id="`helix-update-chk_${checkbox.id}`" v-model="checkbox.isChecked" type="checkbox">
            <label :for="`helix-update-chk_${checkbox.id}`">{{ checkbox.name }}</label>
          </div>
        </div>

        <div class="row is-flex-end">
          <div class="btn-group">
            <a
              href="javascript:;"
              class="btn has-outline outline-color-white size-small"
              title="清除全部"
              @click.stop="clearAllHandler"
              @mousedown.prevent
            >
              <span>清除全部</span>
            </a>
            <a
              href="javascript:;"
              class="btn has-back-icon icon-search size-small"
              title="搜尋"
              @mousedown.prevent
            >
              <span>搜尋</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="article__content">
      <div class="article__wrap theme-scrollbar">
        <div class="dataTable__wrapper theme-scrollbar">
          <table class="dataTable">
            <thead>
              <tr>
                <th v-for="columnsItem of tablesData.columns" :key="columnsItem.id">
                  <div class="dataTable__title">
                    <span>{{ columnsItem.name }}</span>
                    <div v-if="columnsItem.sort === true" class="sort-select">
                      <a
                        href="javascript:;"
                        class="sort-select__ascending"
                        @click.stop="ascendingHandler(columnsItem.id)"
                        @mousedown.prevent
                      />
                      <a
                        href="javascript:;"
                        class="sort-select__descending"
                        @click.stop="descendingHandler(columnsItem.id)"
                        @mousedown.prevent
                      />
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rowsItem of tablesData.rows" :key="rowsItem.id">
                <td>{{ rowsItem['project_name'] }}</td>
                <td>{{ rowsItem['serial_number'] }}</td>
                <td>{{ rowsItem['building_license'] }}</td>
                <td>{{ rowsItem['use_license'] }}</td>
                <td>{{ rowsItem['building_status'] }}</td>
                <td>{{ rowsItem['user'] }}</td>
                <td>{{ rowsItem['update_time'] }}</td>
                <td>
                  <div v-if="rowsItem['is_HELIX_update'] === true">
                    <a
                      href="javascript:;"
                      class="btn is-disabled size-small"
                      title="已更新"
                      @mousedown.prevent
                    >
                      <span>已更新</span>
                    </a>
                  </div>
                  <div v-else>
                    <a
                      href="javascript:;"
                      class="btn has-outline outline-color-blue-light size-small"
                      title="更新"
                      @click.stop="clickButtonHandler(false, rowsItem.id)"
                      @mousedown.prevent
                    >
                      <span>更新</span>
                    </a>
                    <a
                      href="javascript:;"
                      class="btn size-small"
                      title="註銷"
                      @click.stop="clickButtonHandler(true, rowsItem.id)"
                      @mousedown.prevent
                    >
                      <span>註銷</span>
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="row is-space-between">
          <div>第 1 - 10 筆，共 75 筆</div>
          <div class="pagination">
            <a
              href="javascript:;"
              class="pagination__side-btn"
              title="上一頁"
              @click.stop="pagesideClickHandler(false)"
              @mousedown.prevent
              v-text="'<'"
            />
            <div class="pagination__content">
              <span v-if="pagination.total > 3 && pagination.current > (3 - 1)">...</span>
              <a
                v-for="value of paginationHandler"
                :key="value"
                href="javascript:;"
                class="pagination__btn"
                :class="{ 'current': value === pagination.current }"
                :title="`第${value}頁`"
                @click.stop="pagination.current = value"
                @mousedown.prevent
              >{{ value }}</a>
              <span v-if="pagination.total > 3 && pagination.current < (pagination.total - 1)">...</span>
            </div>
            <a
              href="javascript:;"
              class="pagination__side-btn"
              title="下一頁"
              @click.stop="pagesideClickHandler(true)"
              @mousedown.prevent
              v-text="'>'"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InputContentListener from '~/components/tools/InputContentListener';

export default {
  data () {
    return {
      navtabs: {
        current: 0,
        typeList: [
          { id: 0, name: '工程名稱' },
          { id: 1, name: '管理序號' },
          { id: 2, name: '使照編號' }
        ]
      },
      reference: {
        searchKeyword: '',
        buildingStatus: [
          {
            id: 'A',
            name: '預定用地',
            isChecked: false
          },
          {
            id: 'B',
            name: '用印中',
            isChecked: false
          },
          {
            id: 'C',
            name: '請照中',
            isChecked: false
          },
          {
            id: 'D',
            name: '施工中',
            isChecked: false
          },
          {
            id: 'E',
            name: '使照取得',
            isChecked: false
          },
          {
            id: 'F',
            name: '資產已驗收',
            isChecked: false
          },
          {
            id: 'G',
            name: '停用',
            isChecked: false
          },
          {
            id: 'H',
            name: '其他',
            isChecked: false
          }
        ],
        dateSelecter: {
          from: '',
          to: '',
          lang: {
            formatLocale: {
              months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
              monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
              weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
              weekdaysShort: ['日', '一', '二', '三', '四', '五', '六'],
              weekdaysMin: ['日', '一', '二', '三', '四', '五', '六'],
              firstDayOfWeek: 0,
              firstWeekContainsDate: 1
            },
            yearFormat: 'YYYY年',
            monthFormat: 'MMM',
            monthBeforeYear: false
          }
        },
        helixUpdate: [
          {
            id: 'A',
            name: '更新',
            isChecked: false
          },
          {
            id: 'B',
            name: '未更新',
            isChecked: false
          }
        ]
      },
      tablesData: {
        columns: [
          {
            id: 'project_name',
            name: '工程名稱',
            sort: true
          },
          {
            id: 'serial_number',
            name: '管理序號',
            sort: true
          },
          {
            id: 'building_license',
            name: '建照編號',
            sort: true
          },
          {
            id: 'use_license',
            name: '使照編號',
            sort: true
          },
          {
            id: 'building_status',
            name: '建物狀態',
            sort: true
          },
          {
            id: 'user',
            name: '更新人',
            sort: true
          },
          {
            id: 'update_time',
            name: '更新時間',
            sort: true
          },
          {
            id: 'update_HELIX',
            name: 'HELIX更新',
            sort: true
          }
        ],
        rows: [
          {
            id: '123456',
            project_name: '熱軋鋼捲倉庫1',
            serial_number: '00392-01',
            building_license: '(99)0017號',
            use_license: '高雄使字(100)789456',
            building_status: '使照取得',
            user: 'V89/小宇',
            update_time: '2019/08/25 10:00:00',
            is_HELIX_update: true
          },
          {
            id: '123457',
            project_name: '熱軋鋼捲倉庫2',
            serial_number: '00392-01',
            building_license: '(99)0017號',
            use_license: '高雄使字(100)789456',
            building_status: '使照取得',
            user: 'V89/小宇',
            update_time: '2019/08/25 10:00:00',
            is_HELIX_update: false
          }
        ]
      },
      // * 頁次項目（根據這幾個參數，呼叫對應的頁面與渲染資料）
      pagination: {
        // 目前第幾頁
        current: 1,
        // 總共幾頁
        total: 5
      }
    };
  },
  components: {
    InputContentListener
  },
  methods: {
    // * 表格升序
    ascendingHandler (id) {
      this.tablesData.rows.sort((a, b) => a[id] > b[id] ? 1 : -1);
    },
    // * 表格降序
    descendingHandler (id) {
      this.tablesData.rows.sort((a, b) => a[id] > b[id] ? -1 : 1);
    },
    // * 結束年月日不能小於開始年月日
    disabledBeforeFormDate (date) {
      const formDateList = this.reference.dateSelecter.from.split('-').map(value => parseInt(value, 10));
      const formDate = new Date(formDateList[0], formDateList[1] - 1, formDateList[2]);
      return date < formDate;
    },
    // * 點擊功能按鈕
    clickButtonHandler (isDestroy, id) {
      const index = this.tablesData.rows.findIndex(item => item.id === id);
      this.tablesData.rows[index].is_HELIX_update = true;

      if (isDestroy === true) {
        this.CONSOLE('註銷');
      } else {
        this.CONSOLE('更新');
      }
    },
    // * 點擊頁次元件左右按鈕
    pagesideClickHandler (isIncrease) {
      if (isIncrease === true) {
        this.pagination.current += 1;
      } else {
        this.pagination.current -= 1;
      }

      if (this.pagination.current < 1) {
        this.pagination.current = 1;
      }

      if (this.pagination.current > this.pagination.total) {
        this.pagination.current = this.pagination.total;
      }
    },
    // * 清除全部搜尋條件
    clearAllHandler () {
      this.reference.searchKeyword = '';
      this.reference.dateSelecter.from = '';
      this.reference.dateSelecter.to = '';

      for (let i = 0; i < this.reference.buildingStatus.length; i++) {
        this.reference.buildingStatus[i].isChecked = false;
      }

      for (let i = 0; i < this.reference.helixUpdate.length; i++) {
        this.reference.helixUpdate[i].isChecked = false;
      }
    }
  },
  computed: {
    // * 所選取的頁籤項目名稱
    navtabsCurrentName () {
      return this.navtabs.typeList.filter(item => item.id === this.navtabs.current)[0].name;
    },
    // * 頁次項目
    paginationHandler () {
      const { current, total } = this.pagination;

      if (total < 4) {
        const result = [];
        for (let i = 0; i < total; i++) {
          result.push(i + 1);
        }
        return result;
      };

      if (current < 3) { return [1, 2, 3]; };
      if (current > (total - 1)) { return [total - 2, total - 1, total]; };

      const prev = (current - 1) < 1 ? 0 : (current - 1);
      const next = (current + 1) > total ? 0 : (current + 1);
      return [prev, current, next].filter(item => item > 0 && item < (total + 1));
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';
@import '~/assets/scss/_article.scss';

h2 {
  margin-top: 1rem;
  line-height: 1.6em;
  margin-bottom: 0.75rem;
}

.option-btn {
  margin-right: 10px;
  margin-bottom: 10px;
}

// * 頁次元件

.pagination {
  display: flex;
  align-items: center;
}

.pagination__content {
  display: flex;
  align-items: center;
}

.pagination__btn {
  width: 25px;
  height: 25px;
  margin-right: 5px;
  margin-left: 5px;
  display: block;
  text-align: center;
  color: $color-blue-light;
  line-height: 25px;
  border-radius: 7px;

  &.current {
    color: $color-white;
    background-color: $color-blue-light;
  }
}

.pagination__side-btn {
  margin-right: 10px;
  margin-left: 10px;
  display: block;
  color: $color-blue-light;
}

</style>
