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
              @click.stop="navtabs.current = typeItem.id, reference.searchKeyword = ''"
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
            <input :id="`helix-update-chk_${checkbox.id}`" v-model="checkbox.isChecked" type="checkbox" @click="selectMe(`helix-update-chk_${checkbox.id}`)">
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
              @click.stop="searchHandler"
              @mousedown.prevent
            >
              <span>搜尋</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="article__content">
      <div class="article__wrap theme-scrollbar gogo">
        <div class="dataTable__wrapper theme-scrollbar no-mar">
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
            <tbody v-if="tablesData.rows !== '無資料'">
              <tr v-for="rowsItem of tablesData.rows" :key="rowsItem.fid">
                <td>{{ rowsItem['project'] }}</td>
                <td>{{ rowsItem['key'] }}</td>
                <td>{{ rowsItem['permitNo'] }}</td>
                <td>{{ rowsItem['useNo'] }}</td>
                <td>{{ checkStatus(rowsItem['status']) }}</td>
                <td>{{ rowsItem['changeName'] }}</td>
                <td>{{ rowsItem['changeTime'] }}</td>
                <td>
                  <div v-if="rowsItem['helix'] === 'True'">
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
                      @click.stop="clickButtonHandler(false, rowsItem.fid)"
                      @mousedown.prevent
                    >
                      <span>更新</span>
                    </a>
                    <a
                      href="javascript:;"
                      class="btn size-small"
                      title="註銷"
                      @click.stop="clickButtonHandler(true, rowsItem.fid)"
                      @mousedown.prevent
                    >
                      <span>註銷</span>
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>

            <tbody v-else>
              <div :style="'position: absolute; left: 47%; top: 48%;'">
                查無匹配結果
              </div>
            </tbody>
          </table>
        </div>
      </div>

      <div class="row is-space-between page">
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
            id: 'project',
            name: '工程名稱',
            sort: true
          },
          {
            id: 'key',
            name: '管理序號',
            sort: true
          },
          {
            id: 'permitNo',
            name: '建照編號',
            sort: true
          },
          {
            id: 'useNo',
            name: '使照編號',
            sort: true
          },
          {
            id: 'status',
            name: '建物狀態',
            sort: true
          },
          {
            id: 'changeName',
            name: '更新人',
            sort: true
          },
          {
            id: 'changeTime',
            name: '更新時間',
            sort: true
          },
          {
            id: 'helix',
            name: 'HELIX更新',
            sort: true
          }
        ],
        rows: []
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
  mounted () {
    this.getRawData();
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
    // * 點擊更新or註銷功能按鈕
    clickButtonHandler (isDestroy, myFid) {
      // const index = this.tablesData.rows.findIndex(item => item.fid === myFid);
      // this.tablesData.rows[index].helix = true;

      // 註銷
      if (isDestroy === true) {
        this.$swal({
          icon: 'warning',
          width: 402,
          showCancelButton: true,
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          text: '您是否要放棄本次更新，轉為已更新？'
        }).then((result) => {
          if (result.value) {
            this.$swal({
              icon: 'warning',
              width: 402,
              showCancelButton: true,
              confirmButtonText: '確定',
              cancelButtonText: '取消',
              html: '注意！轉為已更新，<br />則該筆更新圖形將被永久刪除，無法回復！'
            }).then((result) => {
              if (result.value) {
                this.destroyHandler(myFid);
              }
            });
          }
        });
      }

      // 更新
      if (isDestroy === false) {
        this.$swal({
          icon: 'warning',
          width: 402,
          showCancelButton: true,
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          text: '您是否要回寫更新HELIX圖形？'
        }).then((result) => {
          if (result.value) {
            this.$swal({
              icon: 'warning',
              width: 402,
              showCancelButton: true,
              confirmButtonText: '確定',
              cancelButtonText: '取消',
              html: '注意！更新圖形將取代HELIX原有圖型，<br />是否確定覆蓋，更新後無法還原'
            }).then((result) => {
              if (result.value) {
                this.updateHandler(myFid);
              }
            });
          }
        });
      }
    },
    // * 註銷helix
    destroyHandler (fid) {
      const index = this.tablesData.rows.findIndex(item => item.fid === fid);
      fetch(`/csc2api/ChangeDispose/${fid}?type=Cancel`, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then((response) => {
        return response.json();
      }).then((data) => {
        console.log(data);

        this.tablesData.rows[index].helix = 'True';
        this.$swal({
          width: 402,
          text: '更新成功',
          imageUrl: require('~/assets/img/success.png'),
          imageWidth: 70,
          imageHeight: 70,
          confirmButtonText: '確定',
          showCloseButton: true
        });
      }).catch((err) => {
        console.log('錯誤:', err);
      });
    },
    // * 更新helix
    updateHandler (fid) {
      const index = this.tablesData.rows.findIndex(item => item.fid === fid);
      fetch(`/csc2api/ChangeDispose/${fid}?type=Update`, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then((response) => {
        return response.json();
      }).then((data) => {
        console.log(data);

        this.tablesData.rows[index].helix = 'True';
        this.$swal({
          width: 402,
          text: '更新成功',
          imageUrl: require('~/assets/img/success.png'),
          imageWidth: 70,
          imageHeight: 70,
          confirmButtonText: '確定',
          showCloseButton: true
        });
      }).catch((err) => {
        console.log('錯誤:', err);
      });
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
    },
    // * 單選checkbox
    selectMe (id) {
      for (let i = 0; i < this.reference.helixUpdate.length; i++) {
        this.reference.helixUpdate[i].isChecked = false;
      }
      this.reference.helixUpdate.forEach((item) => {
        if (item.id === id) {
          item.isChecked = true;
        }
      });
    },
    // * 取得預設資料
    getRawData () {
      fetch('/csc2api/Change?project=&status=', {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then((response) => {
        return response.json();
      }).then((data) => {
        this.tablesData.rows = data;
        console.log(data);
      }).catch((err) => {
        console.log('錯誤:', err);
      });
    },
    // * 搜尋
    searchHandler () {
      if (this.myHelix === 'Nope') {
        this.searchNoUpdate();
      } else if (this.myHelix === 'True') {
        this.searchUpdated();
      } else {
        fetch(`/csc2api/Change?project=${this.myProject}&key=${this.myKey}&useNo=${this.myUseNo}&status=${this.myStatus}&changeTimeFrom=${this.reference.dateSelecter.from}&changeTimeTo=${this.reference.dateSelecter.to}&helix=${this.myHelix}`, {
          method: 'GET',
          headers: new Headers({
            'Content-Type': 'application/json'
          })
        }).then((response) => {
          return response.json();
        }).then((data) => {
          this.tablesData.rows = data;
          console.log(data);
        }).catch((err) => {
          console.log('錯誤:', err);
        });
      }
    },
    // * helix搜尋條件是未更新 (抓全部資料 再去除有更新的)
    searchNoUpdate () {
      fetch(`/csc2api/Change?project=${this.myProject}&key=${this.myKey}&useNo=${this.myUseNo}&status=${this.myStatus}&changeTimeFrom=${this.reference.dateSelecter.from}&changeTimeTo=${this.reference.dateSelecter.to}&helix=`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then((response) => {
        return response.json();
      }).then((data) => {
        // const newArr = data;
        // newArr.forEach((item, index, arr) => {
        //   if (item.helix === 'True') {
        //     arr.splice(index, 1);
        //   }
        // });
        const myArr = data.filter(item => item.helix !== 'True');
        this.tablesData.rows = myArr;
        console.log(myArr);
      }).catch((err) => {
        console.log('錯誤:', err);
      });
    },
    searchUpdated () {
      fetch(`/csc2api/Change?project=${this.myProject}&key=${this.myKey}&useNo=${this.myUseNo}&status=${this.myStatus}&changeTimeFrom=${this.reference.dateSelecter.from}&changeTimeTo=${this.reference.dateSelecter.to}&helix=`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then((response) => {
        return response.json();
      }).then((data) => {
        const myArr = data.filter(item => item.helix === 'True');
        this.tablesData.rows = myArr;
        console.log(myArr);
      }).catch((err) => {
        console.log('錯誤:', err);
      });
    },
    checkStatus (data) {
      if (data === 'A') {
        return '預定用地';
      } else if (data === 'B') {
        return '用印中';
      } else if (data === 'C') {
        return '請照中';
      } else if (data === 'D') {
        return '施工階段';
      } else if (data === 'E') {
        return '使照取得';
      } else if (data === 'F') {
        return '資產已驗收';
      } else if (data === 'G') {
        return '停用';
      } else if (data === 'H') {
        return '其他';
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
    },
    myProject () {
      return (this.navtabsCurrentName === '工程名稱') ? this.reference.searchKeyword : '';
    },
    myKey () {
      return (this.navtabsCurrentName === '管理序號') ? this.reference.searchKeyword : '';
    },
    myUseNo () {
      return (this.navtabsCurrentName === '使照編號') ? this.reference.searchKeyword : '';
    },
    myStatus () {
      const newArr = [];
      this.reference.buildingStatus.forEach((item) => {
        if (item.isChecked === true) {
          newArr.push(item.id);
        }
      });

      const amount = newArr.length;
      if (amount < 1) {
        return '';
      } else if (amount === 1) {
        return newArr[0];
      } else {
        return newArr.join(',');
      }
    },
    myHelix () {
      const newArr = [];
      this.reference.helixUpdate.forEach((item) => {
        if (item.isChecked === true) {
          newArr.push(item.name);
        }
      });
      const amount = newArr.length;

      if (amount < 1) {
        return '';
      } else if (newArr[0] === '更新') {
        return 'True';
      } else {
        return 'Nope';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';
@import '~/assets/scss/_article.scss';

tr th:nth-child(1) {
  width: 25%;
}

tr th:nth-child(8) {
  width: 20%;
}

.page {
  margin-top: 32px !important;
}

.gogo {
  height: 88% !important;
}

.no-mar {
  margin-top: 0 !important;
}

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
