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

        <h2>是否在圖台上顯示</h2>

        <div class="option-btn-group">
          <div
            v-for="checkbox of reference.itemsVisible"
            :key="checkbox.id"
            class="option-btn checkbox"
          >
            <input :id="`items-visible-chk_${checkbox.id}`" v-model="checkbox.isChecked" type="checkbox">
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
              @mousedown.prevent
            >
              <span>搜尋</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="article__content right_wrap">
      <div class="article__wrap theme-scrollbar">
        <div class="dataTable__wrapper theme-scrollbar">
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
            <tbody>
              <tr v-for="(rowsItem, index) of tablesData.rows" :key="rowsItem['key']">
                <td>{{ rowsItem['key'] }}</td>
                <td>{{ rowsItem['project'] }}</td>
                <td>{{ rowsItem['building'] }}</td>
                <td>
                  <div v-if="rowsItem['display'] === true" class="dataTable__input">
                    <InputContentListener :v-model="`${rowsItem.coordinate[0]},${rowsItem.coordinate[1]}`" />
                  </div>
                </td>
                <td>
                  <div v-if="rowsItem['display'] === true" class="dataTable__input">
                    <InputContentListener :v-model="`${rowsItem.offset[0]},${rowsItem.offset[1]}`" />
                  </div>
                </td>
                <td>
                  <div v-if="rowsItem['display'] === true" class="dataTable__input">
                    <InputContentListener v-model="rowsItem['displayName']" />
                  </div>
                </td>
                <td>
                  <div class="checkbox dataTable__checkbox">
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
        </div>
      </div>

      <div class="row is-flex-end">
        <div class="btn-group">
          <a
            href="javascript:;"
            class="btn color-white has-outline outline-color-default size-small"
            title="取消"
            @mousedown.prevent
          >
            <span>取消</span>
          </a>
          <a
            href="javascript:;"
            class="btn size-small"
            title="儲存修改"
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
        keyInfo: '',
        keyInfoRows: [],
        allKeys: {},
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
    // * 清除全部搜尋條件
    clearAllHandler () {
      this.reference.searchKeyword = '';

      for (let i = 0; i < this.reference.itemsVisible.length; i++) {
        this.reference.itemsVisible[i].isChecked = false;
      }
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
        // const newObject = Object.entries(data)
        //   .map(([manageId, manageValue]) => {
        //     return { name: manageId, value: manageValue };
        //   });

        const keyRows = data.map(item => item.key);

        const times = keyRows.length / 200 + 1;
        // for (let i = 1; i <= times; i++) {
        //   const row1 = keyRows.slice(0, 200);
        // const row2 = keyRows.slice(200, 400);
        // const row3 = keyRows.slice(400);
        // }
        this.getKeyData(keyRows);

        setTimeout(() => {
          this.keyInfo.forEach((item) => {
            result = {
              key: item.key,
              project: item.project,
              building: item.building
            };
            this.keyInfoRows.push(result);
          });

          data.forEach((item, index) => {
            item.project = this.keyInfoRows[index].project;
            item.building = this.keyInfoRows[index].building;
          });

          this.tablesData.rows = data;
        }, 100);

        console.log(data);
        console.log(keyRows);
      }).catch((err) => {
        console.log('錯誤:', err);
      });
    },
    getKeyData (myKey) {
      fetch(`/csc2api/proxy?url=https://east.csc.com.tw/eas/mhb/rest/mhbe/getBuildingByKey/${myKey}?_format=json`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then((response) => {
        return response.json();
      }).then((data) => {
        console.log(data);
        this.keyInfo = data;
      }).catch((err) => {
        console.log('錯誤:', err);
      });
    }
  },
  computed: {
    // * 所選取的頁籤項目名稱
    navtabsCurrentName () {
      return this.navtabs.typeList.filter(item => item.id === this.navtabs.current)[0].name;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';
@import '~/assets/scss/_article.scss';

h2 {
  line-height: 1.6em;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.right_wrap {
  padding: 88px 30px 98px !important;
}

.my-thead {
  width: 1176px;
  position: fixed;
  top: 123px;
  z-index: 1000;
  margin-bottom: 60px;
}

.project_name {
  padding-left: 19px;
}

.building_name {
  padding-left: 21px;
}

.mark_coordinate {
  padding-left: 42px;
}

.text_offset {
  padding-left: 145px;
}

.display_name {
  padding-left: 148px;
}

.is_visible {
  padding-left: 77px;
}

</style>
