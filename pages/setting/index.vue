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
              <tr v-for="(rowsItem, index) of tablesData.rows" :key="rowsItem['serial_number']">
                <td>{{ rowsItem['serial_number'] }}</td>
                <td>{{ rowsItem['project_name'] }}</td>
                <td>{{ rowsItem['building_name'] }}</td>
                <td>
                  <div v-if="rowsItem['is_visible'] === true" class="dataTable__input">
                    <InputContentListener v-model="rowsItem['mark_coordinate']" />
                  </div>
                </td>
                <td>
                  <div v-if="rowsItem['is_visible'] === true" class="dataTable__input">
                    <InputContentListener v-model="rowsItem['text_offset']" />
                  </div>
                </td>
                <td>
                  <div v-if="rowsItem['is_visible'] === true" class="dataTable__input">
                    <InputContentListener v-model="rowsItem['display_name']" />
                  </div>
                </td>
                <td>
                  <div class="checkbox dataTable__checkbox">
                    <input
                      :id="`visible_${rowsItem['serial_number']}_${index}`"
                      v-model="rowsItem['is_visible']"
                      type="checkbox"
                    >
                    <label :for="`visible_${rowsItem['serial_number']}_${index}`">顯示</label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
        rows: [
          {
            serial_number: '00392-01',
            project_name: '倉庫工程01',
            building_name: '倉庫01',
            mark_coordinate: '846.24,6101.30',
            text_offset: '10,10',
            display_name: '預設名稱',
            is_visible: true
          },
          {
            serial_number: '00392-02',
            project_name: '倉庫工程01',
            building_name: '倉庫02',
            mark_coordinate: '456.24,6101.30',
            text_offset: '10,10',
            display_name: '預設名稱',
            is_visible: true
          },
          {
            serial_number: '00392-03',
            project_name: '倉庫工程02',
            building_name: '倉庫01',
            mark_coordinate: '847.24,6101.30',
            text_offset: '10,10',
            display_name: '預設名稱',
            is_visible: true
          },
          {
            serial_number: '00392-04',
            project_name: '倉庫工程02',
            building_name: '倉庫02',
            mark_coordinate: '',
            text_offset: '',
            display_name: '',
            is_visible: false
          }
        ]
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
    // * 清除全部搜尋條件
    clearAllHandler () {
      this.reference.searchKeyword = '';

      for (let i = 0; i < this.reference.itemsVisible.length; i++) {
        this.reference.itemsVisible[i].isChecked = false;
      }
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

</style>
