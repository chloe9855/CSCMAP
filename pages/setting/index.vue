<template>
  <div class="article__container">
    <div class="article__aside">
      <div class="theme-scrollbar">
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

        <h2>是否在圖台上顯示</h2>

        <div class="option-btn-group">
          <div
            v-for="checkbox of reference.itemsVisible"
            :key="checkbox.id"
            class="option-btn checkbox"
          >
            <input :id="`items-visible-chk_${checkbox.id}`" v-model="checkbox.isChecked" type="checkbox" @click="selectMe(`update-chk_${checkbox.id}`)">
            <label :for="`items-visible-chk_${checkbox.id}`">{{ checkbox.name }}</label>
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
    <div class="article__content right_wrap">
      <div class="dataTable__wrapper">
        <table class="dataTable">
          <thead class="my-thead">
            <tr>
              <th v-for="columnsItem of tablesData.columns" :key="columnsItem.id">
                <div :class="`dataTable__title ${columnsItem.id}`">
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
          <tbody ref="content" class="my-tbody theme-scrollbar">
            <tr v-for="(rowsItem, index) of tablesData.rows" :key="rowsItem['key']" class="tr">
              <td class="t1">
                <div class="d1">
                  {{ rowsItem['key'] }}
                </div>
              </td>
              <td class="t2">
                <div class="d2">
                  {{ rowsItem['project'] }}
                </div>
              </td>
              <td class="t3">
                <div class="d3">
                  {{ rowsItem['building'] }}
                </div>
              </td>
              <td class="t4">
                <div class="dataTable__input">
                  <InputContentListener v-if="rowsItem['display'] === true" v-model="rowsItem['myCoor']" @input="updateCoorValue($event, index)" />
                </div>
              </td>
              <td class="t5">
                <div class="dataTable__input d5">
                  <InputContentListener v-if="rowsItem['display'] === true" v-model="rowsItem['myOffset']" @input="updateOffValue($event, index)" />
                </div>
              </td>
              <td class="t6">
                <div class="dataTable__input d6">
                  <InputContentListener v-if="rowsItem['display'] === true" v-model="rowsItem['displayName']" />
                </div>
              </td>
              <td>
                <div class="checkbox dataTable__checkbox d7">
                  <input
                    :id="`visible_${rowsItem['key']}_${index}`"
                    v-model="rowsItem['display']"
                    type="checkbox"
                  >
                  <label :for="`visible_${rowsItem['key']}_${index}`">顯示</label>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="tablesData.rows.length < 1" :style="'position: absolute; left: 47%; top: 48%;'">
          查無匹配結果
        </div>
      </div>

      <div v-if="tablesData.rows.length >= 1" class="row is-flex-end">
        <div class="btn-group">
          <a
            href="javascript:;"
            class="btn color-white has-outline outline-color-default size-small"
            title="取消"
            @click.stop="returnBack"
            @mousedown.prevent
          >
            <span>取消</span>
          </a>
          <a
            href="javascript:;"
            class="btn size-small"
            :class="{'add-orange': orangeSaveButton === true }"
            title="儲存修改"
            @click.stop="saveAllHandler"
            @mousedown.prevent
          >
            <span>儲存修改</span>
          </a>
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
      rawData: '',
      oldValue: '',
      keyInfo: '',
      keyInfoRows: [],
      labelKeys: '',
      // 要儲存的資料
      saveRows: '',
      // 搜尋結果
      searchResult: '',
      navtabs: {
        current: 0,
        typeList: [
          { id: 0, name: '工程名稱' },
          { id: 1, name: '各棟名稱' },
          { id: 2, name: '管理序號' }
        ]
      },
      reference: {
        searchKeyword: '',
        itemsVisible: [
          {
            id: 'A',
            name: '顯示',
            isChecked: false
          },
          {
            id: 'B',
            name: '無顯示',
            isChecked: false
          }
        ]
      },
      tablesData: {
        columns: [
          {
            id: 'serial_number',
            name: '管理序號',
            sort: true
          },
          {
            id: 'project_name',
            name: '工程名稱',
            sort: true
          },
          {
            id: 'building_name',
            name: '各棟名稱',
            sort: true
          },
          {
            id: 'mark_coordinate',
            name: '球標坐標',
            sort: true
          },
          {
            id: 'text_offset',
            name: '文字偏移',
            sort: true
          },
          {
            id: 'display_name',
            name: '顯示名稱',
            sort: false
          },
          {
            id: 'is_visible',
            name: '篩選顯示狀態',
            sort: true
          }
        ],
        rows: []
      }
    };
  },
  components: {
    InputContentListener
  },
  mounted () {
    this.getRawData();
    // 開啟 Loading 視窗
    this.$store.commit('CTRL_LOADING_MASK', true);
    // 關閉 Loading 視窗
    setTimeout(() => {
      this.$store.commit('CTRL_LOADING_MASK', false);
    }, 6000);

    sessionStorage.setItem('oriData', '');
  },
  methods: {
    // * 表格升序
    ascendingHandler (id) {
      this.tablesData.rows.sort((a, b) => a[id] > b[id] ? 1 : -1);
    },
    // * 表格降序
    descendingHandler (id) {
      // this.tablesData.rows.sort((a, b) => a[id] > b[id] ? -1 : 1);
      this.tablesData.rows.sort((a, b) => a[id] > b[id] ? 1 : -1);
    },
    // * 按下取消 -> 回復原狀
    returnBack () {
      const originalData = JSON.parse(sessionStorage.getItem('oriData'));
      this.tablesData.rows = originalData;
      this.rawData = originalData;
    },
    // * 清除全部搜尋條件
    clearAllHandler () {
      this.reference.searchKeyword = '';

      for (let i = 0; i < this.reference.itemsVisible.length; i++) {
        this.reference.itemsVisible[i].isChecked = false;
      }
      // 回復成搜尋前的資料
      this.tablesData.rows = this.rawData;
      // scroll至頂端
      this.$nextTick(() => {
        this.$refs.content.scrollTop = 0;
      });
    },
    // * 更新坐標數值
    updateCoorValue ($event, index) {
      console.log($event);
      console.log(index);
      const arr = $event.split(',');
      this.tablesData.rows[index].coordinate = arr.map(item => parseInt(item, 10));
    },
    // * 更新文字偏移數值
    updateOffValue ($event, index) {
      const arr = $event.split(',');
      this.tablesData.rows[index].offset = arr.map(item => parseInt(item, 10));
    },
    // * 單選checkbox
    selectMe (id) {
      for (let i = 0; i < this.reference.itemsVisible.length; i++) {
        this.reference.itemsVisible[i].isChecked = false;
      }
      this.reference.itemsVisible.forEach((item) => {
        if (item.id === id) {
          item.isChecked = true;
        }
      });
    },
    // * 取得預設資料
    getRawData () {
      fetch('/cscmap2/api/Label', {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then((response) => {
        return response.json();
      }).then((data) => {
        console.log(data);

        this.rawData = data;
        this.rawData.forEach((item) => {
          item.myCoor = `${item.coordinate[0].toFixed(2)},${item.coordinate[1].toFixed(2)}`;
          item.myOffset = `${item.offset[0]},${item.offset[1]}`;
        });

        this.tablesData.rows = this.rawData;

        const keyRows = data.map(item => item.key);
        const times = Math.ceil(keyRows.length / 200); // total=514 times=3
        for (let i = 0; i < times; i++) {
        //   const row0 = keyRows.slice(0, 200);
        //   const row1 = keyRows.slice(200, 400);
        //   const row2 = keyRows.slice(400);

          if (i === times - 1) {
            this.labelKeys = keyRows.slice(i * 200);
          } else {
            this.labelKeys = keyRows.slice(i * 200, (i + 1) * 200);
          }

          // 用key值去call f3 api
          this.getKeyData(this.labelKeys);
        }
      }).catch((err) => {
        console.log('錯誤:', err);
      });
    },
    // * 用key值去call f3 api以取得 工程名稱project、各棟名稱building
    getKeyData (myKey) {
      fetch(`/csc2api/proxy?url=https://east.csc.com.tw/eas/mhb/rest/mhbe/getBuildingByKey/${myKey}?_format=json`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then((response) => {
        return response.json();
      }).then((data) => {
        this.keyInfo = data;
        this.keyInfo.forEach((item) => {
          result = {
            key: item.key,
            project: item.project,
            building: item.building
          };
          this.keyInfoRows.push(result);

          // 在rawData中補上project、building
          if (item.key !== null && item.key !== '') {
            this.moreRawData(item.key, item.project, item.building);
          }
        });

        console.log(data);
      }).catch((err) => {
        console.log('錯誤:', err);
      });
    },
    // * 在rawData中補上project、building
    moreRawData (key, project, building) {
      const index = this.rawData.findIndex(item => item.key === key);
      this.rawData[index].project = project;
      this.rawData[index].building = building;
      // 顯示名稱若為空值 預設帶入棟名
      if (this.rawData[index].displayName === '') {
        this.rawData[index].displayName = this.rawData[index].building;
      }

      this.$forceUpdate();

      // 深拷貝一份
      this.oldValue = _.cloneDeep(this.rawData);
      sessionStorage.setItem('oriData', JSON.stringify(this.oldValue));
    },
    // * 儲存全部修改
    saveAllHandler () {
      this.saveRows = _.cloneDeep(this.tablesData.rows);
      this.saveRows.forEach((item) => {
        delete item.myCoor;
        delete item.myOffset;
        delete item.project;
        delete item.building;
      });

      fetch('/cscmap2/api/label', {
        method: 'PATCH',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(this.saveRows)
      }).then((response) => {
        return response;
      }).then((data) => {
        console.log(data);

        this.$swal({
          width: 402,
          text: '儲存成功',
          imageUrl: require('~/assets/img/success.png'),
          imageWidth: 70,
          imageHeight: 70,
          confirmButtonText: '確定',
          showCloseButton: true
        });

        setTimeout(() => {
          this.getRawData();
        }, 100);
      }).catch((err) => {
        console.log('錯誤:', err);
      });
    },
    // * 搜尋
    searchHandler () {
      if (this.navtabsCurrentName === '工程名稱' && this.myDisplay !== '') {
        const newArr = this.rawData.filter(item => item.project === this.myProject && item.display === this.myDisplay);
        this.tablesData.rows = newArr;
      }
      if (this.navtabsCurrentName === '工程名稱' && this.myDisplay === '') {
        const newArr = this.rawData.filter(item => item.project === this.myProject);
        this.tablesData.rows = newArr;
      }
      if (this.navtabsCurrentName === '各棟名稱' && this.myDisplay !== '') {
        const newArr = this.rawData.filter(item => item.building === this.myBuilding && item.display === this.myDisplay);
        this.tablesData.rows = newArr;
      }
      if (this.navtabsCurrentName === '各棟名稱' && this.myDisplay === '') {
        const newArr = this.rawData.filter(item => item.building === this.myBuilding);
        this.tablesData.rows = newArr;
      }
      if (this.navtabsCurrentName === '管理序號' && this.myDisplay !== '') {
        const newArr = [];
        this.rawData.forEach((item) => {
          if (item.key.search(this.myKey) !== -1) {
            newArr.push(item);
          }
        });
        const myArr = newArr.filter(item => item.display === this.myDisplay);
        this.tablesData.rows = myArr;

        if (this.myKey === '') {
          this.tablesData.rows.length = 0;
        }
      }
      if (this.navtabsCurrentName === '管理序號' && this.myDisplay === '') {
        const newArr = [];
        this.rawData.forEach((item) => {
          if (item.key.search(this.myKey) !== -1) {
            newArr.push(item);
          }
        });
        this.tablesData.rows = newArr;

        if (this.myKey === '') {
          this.tablesData.rows.length = 0;
        }
      }

      // scroll至頂端
      this.$nextTick(() => {
        this.$refs.content.scrollTop = 0;
      });
    }
  },
  computed: {
    // * 所選取的頁籤項目名稱
    navtabsCurrentName () {
      return this.navtabs.typeList.filter(item => item.id === this.navtabs.current)[0].name;
    },
    // 有修改時按鈕變橘色
    orangeSaveButton () {
      const neww = JSON.stringify(this.rawData);
      const oldd = JSON.stringify(this.oldValue);

      if (neww !== oldd) {
        return true;
      } else {
        return false;
      }
    },
    myProject () {
      return (this.navtabsCurrentName === '工程名稱') ? this.reference.searchKeyword.replace(/\s/g, '').replace(/,$/, '') : '';
    },
    myBuilding () {
      return (this.navtabsCurrentName === '各棟名稱') ? this.reference.searchKeyword.replace(/\s/g, '').replace(/,$/, '') : '';
    },
    myKey () {
      return (this.navtabsCurrentName === '管理序號') ? this.reference.searchKeyword.replace(/\s/g, '').replace(/,$/, '') : '';
    },
    myDisplay () {
      const newArr = this.reference.itemsVisible.filter(item => item.isChecked === true);
      const amount = newArr.length;
      if (amount < 1) {
        return '';
      } else if (newArr[0].name === '顯示') {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';
@import '~/assets/scss/_article.scss';

.add-orange {
  color: #f08300 !important;
  background-color: #fff !important;
  border: 1px #f08300 solid !important;
}

h2 {
  line-height: 1.6em;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.right_wrap {
  padding: 23px 30px 98px !important;
}

.my-thead {
  width: 100%;
  display: table;
  z-index: 1000;
}

.my-tbody {
  height: 32vw;
  display: block;
  overflow-y: auto;
}

.project_name {
  width: 100%;
  padding-left: 2%;
}

.building_name {
  // width: 210px;
  // padding-left: 21px;
}

.mark_coordinate {
  // width: 156px;
  // padding-left: 42px;
}

.text_offset {
  // width: 147px;
}

.display_name {
  // width: 154px;
  // padding-left: 11px;
}

.my-thead th:nth-child(2) {
  width: 14.65%;
}

.my-thead th:nth-child(3) {
  width: 20%;
}

.my-thead th:nth-child(4) {
  width: 15.4%;
}

.my-thead th:nth-child(5) {
  width: 15.2%;
}

.my-thead th:nth-child(6) {
  width: 15.3%;
}

.my-thead th:nth-child(7) {
  width: 11%;
}

// .my-thead::after {
//   content: '';
//   width: 7px;
//   height: 53px;
//   position: fixed;
//   top: 16%;
//   right: 1.8%;
//   color: red;
//   background-color: white;
//   // border: 1px solid red;
// }

.tr {
  height: 60px;
  position: relative;
}

.t1 {
  // width: 100px;
  width: 8.7%;
}

.d1 {
  // width: 70px;
  width: 100%;
}

.t2 {
  // width: 172px;
  width: 14.8%;
}

.d2 {
  // margin-left: -12px;
}

.t3 {
  // width: 200px;
  width: 19%;
}

.d3 {
  width: 100%;
  // width: 209px;
  // margin-left: -5px;
  margin-left: -3%;
}

.t4 {
  // width: 150px;
  width: 12%;
}

.t5 {
  // width: 147px;
  width: 12%;
}

.d5 {
  // margin-left: 7px;
  margin-left: 5%;
}

.t6 {
  // width: 150px;
  width: 17%;
}

.d6 {
  // margin-left: 8px;
  margin-left: 10%;
}

.d7 {
  // margin-left: 12px;
  margin-left: 12%;
}

.dataTable__input {
  width: 150px;
}

</style>
