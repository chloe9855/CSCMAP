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
    <div class="article__content overme">
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
              <tr v-for="rowsItem of resultRows" :key="rowsItem.name">
                <td>{{ rowsItem.value[rowsItem.value.length - 1].project }}</td>
                <td>{{ rowsItem.name }}</td>
                <td>{{ rowsItem.value[rowsItem.value.length - 1].permitNo }}</td>
                <td>{{ rowsItem.value[rowsItem.value.length - 1].useNo }}</td>
                <td>{{ checkStatus(rowsItem.value[rowsItem.value.length - 1].status) }}</td>
                <td>{{ rowsItem.value[rowsItem.value.length - 1].changeName }}</td>
                <td>{{ rowsItem.value[rowsItem.value.length - 1].changeTime }}</td>
                <td>
                  <div v-if="rowsItem.value[rowsItem.value.length - 1].helix === 'True'">
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
                      @click.stop="clickButtonHandler(false, rowsItem.value[rowsItem.value.length - 1].fid)"
                      @mousedown.prevent
                    >
                      <span>更新</span>
                    </a>
                    <a
                      href="javascript:;"
                      class="btn size-small"
                      title="註銷"
                      @click.stop="clickButtonHandler(true, rowsItem.value[rowsItem.value.length - 1].fid)"
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

      <div v-if="tablesData.rows !== '無資料'" class="row is-space-between page">
        <div>第 {{ minData }} - {{ countData(totalCount) }} 筆，共 {{ totalCount }} 筆</div>
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
            <a
              v-if="pagination.total > 3 && pagination.current > (3 - 1)"
              href="javascript:;"
              class="pagination__btn"
              :class="{ 'current': value === pagination.current }"
              :title="`第1頁`"
              @click.stop="pagination.current = 1, pageHandler()"
              @mousedown.prevent
            >1</a>
            <!-- 上面是第一頁 -->
            <span v-if="pagination.total > 3 && pagination.current > (3 - 1)">...</span>
            <a
              v-for="value of paginationHandler"
              :key="value"
              href="javascript:;"
              class="pagination__btn"
              :class="{ 'current': value === pagination.current }"
              :title="`第${value}頁`"
              @click.stop="pagination.current = value, pageHandler()"
              @mousedown.prevent
            >{{ value }}</a>
            <span v-if="pagination.total > 3 && pagination.current < (pagination.total - 1)">...</span>
            <!-- 最後一頁 -->
            <a
              v-if="pagination.total > 3 && pagination.current < (pagination.total - 1)"
              href="javascript:;"
              class="pagination__btn"
              :class="{ 'current': value === pagination.current }"
              :title="`第${pagination.total}頁`"
              @click.stop="pagination.current = pagination.total, pageHandler()"
              @mousedown.prevent
            >{{ pagination.total }}</a>
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
      },
      resultRows: [],
      minData: '',
      maxData: ''
    };
  },
  components: {
    InputContentListener
  },
  mounted () {
    // 開啟 Loading 視窗
    this.$store.commit('CTRL_LOADING_MASK', true);
    this.getRawData();

    setTimeout(() => {
      // 關閉 Loading 視窗與開啟側邊選單
      this.$store.commit('CTRL_LOADING_MASK', false);
      this.isInit = true;
    }, 2000);
  },
  methods: {
    // * 表格升序
    ascendingHandler (id) {
      // this.tablesData.rows.sort((a, b) => a[id] > b[id] ? 1 : -1);
      this.tablesData.rows.sort((a, b) => a.value[a.value.length - 1].fid > b.value[b.value.length - 1].fid ? 1 : -1);
    },
    // * 表格降序
    descendingHandler (id) {
      // this.tablesData.rows.sort((a, b) => a[id] > b[id] ? -1 : 1);
      this.tablesData.rows.sort((a, b) => a.value[a.value.length - 1].fid > b.value[b.value.length - 1].fid ? -1 : 1);
    },
    // * 結束年月日不能小於開始年月日
    disabledBeforeFormDate (date) {
      const formDateList = this.reference.dateSelecter.from.split('-').map(value => parseInt(value, 10));
      const formDate = new Date(formDateList[0], formDateList[1] - 1, formDateList[2]);
      return date < formDate;
    },
    // * 結束日期 = 開始日期 + 一個月
    setOverDate () {
      const formDateList = this.reference.dateSelecter.from.split('-').map(value => parseInt(value, 10));
      const myDate = new Date(formDateList[0], formDateList[1] + 1, formDateList[2]);
      console.log(myDate);
      let month = myDate.getMonth();
      let day = myDate.getDate();
      const year = myDate.getFullYear();
      if (month.length < 2) { month = '0' + month; }
      if (day.length < 2) { day = '0' + day; }

      const result = [year, month, day].join('-');
      this.reference.dateSelecter.to = result;
    },
    countData (data) {
      if (data <= 9) {
        return this.totalCount;
      } else {
        return this.maxData;
      }
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
      const index = this.tablesData.rows.findIndex(item => item.value[item.value.length - 1].fid === fid);
      fetch(`/cscmap2/api/ChangeDispose/${fid}?type=Cancel`, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then((response) => {
        return response.json();
      }).then((data) => {
        console.log(data);

        // this.tablesData.rows[index].helix = 'True';
        // this.tablesData.rows[index].value[this.tablesData.rows[index].value.length - 1].helix = 'True';
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

      this.tablesData.rows[index].value[this.tablesData.rows[index].value.length - 1].helix = 'True';
    },
    // * 更新helix
    updateHandler (fid) {
      const index = this.tablesData.rows.findIndex(item => item.value[item.value.length - 1].fid === fid);
      fetch(`/cscmap2/api/ChangeDispose/${fid}?type=Update`, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then((response) => {
        return response.json();
      }).then((data) => {
        console.log(data);

        // this.tablesData.rows[index].helix = 'True';
        // this.tablesData.rows[index].value[this.tablesData.rows[index].value.length - 1].helix = 'True';
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

      this.tablesData.rows[index].value[this.tablesData.rows[index].value.length - 1].helix = 'True';
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

      this.pageHandler();
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

      this.getRawData();
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
      fetch('/cscmap2/api/Change', {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then((response) => {
        return response.json();
      }).then((data) => {
        const newObject = Object.entries(data)
          .map(([manageId, manageValue]) => {
            return { name: manageId, value: manageValue };
          });

        newObject.sort(function (a, b) {
          return a.value[a.value.length - 1].fid < b.value[b.value.length - 1].fid ? 1 : -1;
        });
        this.tablesData.rows = newObject;
        this.pageHandler();

        console.log(this.tablesData.rows);
      }).catch((err) => {
        console.log('錯誤:', err);
      });
    },
    // * 搜尋
    searchHandler () {
      fetch(`/cscmap2/api/Change?project=${this.myProject}&manageId=${this.myKey}&useNo=${this.myUseNo}&status=${this.myStatus}&changeTimeFrom=${this.reference.dateSelecter.from}&changeTimeTo=${this.reference.dateSelecter.to}&helix=`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then((response) => {
        return response.json();
      }).then((data) => {
        if (data === '無資料') {
          this.tablesData.rows = data;
          return;
        }

        // 去除是空值的資料
        for (const prop in data) {
          if (data[prop].length < 1) {
            delete data[prop];
          }
        }

        const newObject = Object.entries(data)
          .map(([manageId, manageValue]) => {
            return { name: manageId, value: manageValue };
          });
        newObject.sort(function (a, b) {
          return a.value[a.value.length - 1].fid < b.value[b.value.length - 1].fid ? 1 : -1;
        });

        if (this.myHelix === '') {
          this.tablesData.rows = newObject;
        } else if (this.myHelix === 'True') {
          // helix搜尋條件是有更新
          const myArr = newObject.filter(item => item.value[item.value.length - 1].helix === 'True');
          this.tablesData.rows = myArr;
        } else if (this.myHelix === 'Nope') {
          // helix搜尋條件是未更新
          const myArr2 = newObject.filter(item => item.value[item.value.length - 1].helix !== 'True');
          this.tablesData.rows = myArr2;
        }

        this.pagination.current = 1;
        if (data !== '無資料') {
          this.pageHandler();
        }

        console.log(this.tablesData.rows);
      }).catch((err) => {
        console.log('錯誤:', err);
      });
    },
    // * 分頁
    pageHandler () {
      let currentPage = this.pagination.current;
      const jsonData = this.tablesData.rows;
      // 預設每一頁只顯示 10 筆資料。
      const perpage = 10;
      // page 按鈕總數量公式 總資料數量 / 每一頁要顯示的資料
      this.pagination.total = Math.ceil(jsonData.length / perpage);

      if (currentPage > this.pagination.total) {
        currentPage = this.pagination.total;
      }

      const minData = (currentPage * perpage) - perpage + 1;
      const maxData = (currentPage * perpage);
      this.minData = minData;
      this.maxData = maxData;

      // 先建立新陣列
      this.resultRows = [];
      // 首先必須使用索引來判斷資料位子，所以要使用 index
      jsonData.forEach((item, index) => {
        // 獲取陣列索引，但因為索引是從 0 開始所以要 +1。
        const num = index + 1;
        // 當 num 比 minData 大且又小於 maxData 就push進去新陣列。
        if (num >= minData && num <= maxData) {
          this.resultRows.push(item);
        }
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
    totalCount () {
      return this.tablesData.rows.length;
    },
    // sortedRows () {
    //   function compare (a, b) {
    //     const time = a.value[a.value.length - 1].changeTime;
    //     const hours = time.split(' ')[2];
    //     let change = hours.split(':')[0];

    //     const time2 = b.value[b.value.length - 1].changeTime;
    //     const hours2 = time2.split(' ')[2];
    //     let change2 = hours2.split(':')[0];

    //     if (time.split(' ')[1] === '下午') {
    //       change = parseInt(hours.split(':')[0]) + 12;
    //     }

    //     if (time2.split(' ')[1] === '下午') {
    //       change2 = parseInt(hours2.split(':')[0]) + 12;
    //     }

    //     const date = `${time.split(' ')[0]}${change}${hours.split(':')[1]}${hours.split(':')[2]}`;
    //     const date2 = `${time2.split(' ')[0]}${change2}${hours2.split(':')[1]}${hours2.split(':')[2]}`;

    //     const x = date.replace(/\//g, '');
    //     const y = date2.replace(/\//g, '');
    //     // return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    //     if (x < y) { return 1; }
    //     if (x > y) { return -1; }
    //     return 0;
    //   }

    //   return this.tablesData.rows.sort(compare);
    // },
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
  },
  watch: {
    'tablesData.rows': {
      handler (value) {
        if (this.tablesData.rows !== '無資料') {
          this.pageHandler();
        }
      },
      deep: true
    }
    // 'reference.dateSelecter.from': {
    //   handler (value) {
    //     this.setOverDate();
    //   },
    //   deep: true
    // }
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

.overme {
  padding: 30px !important;
  overflow-x: hidden !important;
  overflow-y: auto !important;
}

.page {
  margin-top: 20px !important;
  margin-bottom: 0 !important;
}

.gogo {
  height: auto !important;
  overflow-x: visible;
  overflow-y: visible;
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
