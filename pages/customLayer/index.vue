<template>
  <div class="content">
    <div v-if="isInit === true" class="wrap">
      <div class="dataTable__wrapper theme-scrollbar">
        <table class="dataTable">
          <thead>
            <tr>
              <th v-for="columnsItem of tablesData.columns" :key="columnsItem.id">
                <div class="dataTable__title">
                  <span>{{ columnsItem.name }}</span>
                </div>
              </th>
              <th>
                <div class="dataTable__title">
                  <span>順序調整</span>
                </div>
              </th>
            </tr>
          </thead>
          <draggable
            v-model="tablesData.rows"
            tag="tbody"
            handle=".handle-btn"
            @end="changeHandler"
          >
            <tr v-for="(rowsItem, index) of tablesData.rows" :key="rowsItem.id">
              <td>{{ rowsItem['layer_index'] }}</td>
              <td>{{ rowsItem['name'] }}</td>
              <td>{{ rowsItem['update_time'] }}</td>
              <td>
                <ColorPicker
                  v-if="rowsItem['text_color'] !== ''"
                  :color="rowsItem['text_color']"
                  :theme-normal="true"
                  @update="(payload) => { rowsItem['text_color'] = payload; }"
                />
              </td>
              <td>
                <div>
                  <a
                    href="javascript:;"
                    class="btn has-outline outline-color-blue-light size-small"
                    :title="rowsItem['can_upadte'] === true ? '更新底圖' : '新增底圖'"
                    @mousedown.prevent
                  >
                    <span>{{ rowsItem['can_upadte'] === true ? '更新底圖' : '新增底圖' }}</span>
                  </a>
                </div>
              </td>
              <td>
                <div class="checkbox dataTable__checkbox">
                  <input
                    :id="`visible_${rowsItem['layer_index']}_${index}`"
                    v-model="rowsItem['inUse']"
                    type="checkbox"
                  >
                  <label :for="`visible_${rowsItem['layer_index']}_${index}`">啟用</label>
                </div>
              </td>
              <td>
                <div class="handle-btn" />
              </td>
            </tr>
          </draggable>
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
</template>

<script>
import draggable from 'vuedraggable';
import ColorPicker from '~/components/tools/ColorPicker';

export default {
  data () {
    return {
      tablesData: {
        columns: [
          {
            id: 'layer_index',
            name: '圖層順序'
          },
          {
            id: 'name',
            name: '圖層名稱'
          },
          {
            id: 'update_time',
            name: '更新時間'
          },
          {
            id: 'text_color',
            name: '文字顏色'
          },
          {
            id: 'can_upadte',
            name: '底圖新增/更新'
          },
          {
            id: 'inUse',
            name: '啟用'
          }
        ],
        rows: []
      },
      isInit: false
    };
  },
  components: {
    ColorPicker,
    draggable
  },
  mounted () {
    // 開啟 Loading 視窗
    this.$store.commit('CTRL_LOADING_MASK', true);

    // ? 用 setTimeout 模擬 ajax 完成的狀態給人看
    setTimeout(() => {
      // ! 取得圖層資料，這邊應該要用 ajax 抓資料回來
      const _layers = require('~/static/_resources/defaultLayerList.json');
      this.tablesData.rows = [..._layers.data];

      // 關閉 Loading 視窗與開啟側邊選單
      this.$store.commit('CTRL_LOADING_MASK', false);
      this.isInit = true;
    }, 1000);
  },
  methods: {
    // * 順序拖曳移動後會呼叫的事件
    changeHandler () {
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';
@import '~/assets/scss/_article.scss';

.content {
  padding: 30px 20px;
  margin-top: 60px;
}

.wrap {
  max-width: 1550px;
  margin: auto;
}

.handle-btn {
  width: 20px;
  height: 20px;
  margin: auto;
  background: url('~/assets/img/icon/icon-handle.svg') no-repeat center/contain;
  cursor: grab;
}

.dataTable {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;

  th {
    &:nth-child(5) {
      width: 180px;
    }

    &:nth-child(1),
    &:nth-child(6),
    &:nth-child(7) {
      width: 100px;

      .dataTable__title span {
        margin-right: auto;
        margin-left: auto;
      }
    }
  }

  td {
    &:nth-child(1) {
      text-align: center;
    }
  }
}

</style>
