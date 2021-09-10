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
            <tr v-for="(rowsItem, index) of tablesData.rows" :key="index">
              <!-- <td>{{ rowsItem['fid'] }}</td> -->
              <td>{{ index+1 }}</td>
              <td>{{ rowsItem['title'] }}</td>
              <td
                v-if="rowsItem['updateTime'] !== ''"
              >
                {{ transDate(rowsItem['updateTime']) }}
              </td>
              <td>
                <ColorPicker
                  v-if="rowsItem['canColor'] === true"
                  :color="rowsItem['color']"
                  :theme-normal="true"
                  @update="(payload) => { rowsItem['color'] = payload; }"
                />
              </td>
              <td>
                <div>
                  <!-- <a
                    href="javascript:;"
                    class="btn has-outline outline-color-blue-light size-small"
                    :title="rowsItem['canUpdate'] === true ? '更新底圖' : '新增底圖'"
                    @mousedown.prevent
                  >
                    <span>{{ rowsItem['canUpdate'] === true ? '更新底圖' : '新增底圖' }}</span>
                  </a> -->
                  <a
                    v-if="rowsItem['canUpdate'] === true"
                    href="javascript:;"
                    class="btn has-outline outline-color-blue-light size-small"
                    :title="'更新底圖'"
                    @click.stop="selectFileModal = true, nowFileFid = rowsItem['fid'] "
                    @mousedown.prevent
                  >
                    <span>{{ rowsItem['canUpdate'] === true ? '更新底圖' : '' }}</span>
                  </a>
                </div>
              </td>
              <td>
                <div v-if="rowsItem['fid'] !== 10 && rowsItem['fid'] !== 11" class="checkbox dataTable__checkbox">
                  <input
                    :id="`visible_${rowsItem['fid']}_${index}`"
                    v-model="rowsItem['inUse']"
                    type="checkbox"
                  >
                  <label :for="`visible_${rowsItem['fid']}_${index}`">啟用</label>
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
            @click.stop="getDefaultLayer"
            @mousedown.prevent
          >
            <span>取消</span>
          </a>
          <a
            href="javascript:;"
            class="save-btn"
            :class="{'add-orange': orangeSaveButton === true }"
            title="儲存修改"
            @click.stop="saveAllHandler"
            @mousedown.prevent
          >
            <span>儲存修改</span>
          </a>
        </div>
      </div>

      <!-- 更新圖資的lightbox -->
      <div v-if="selectFileModal === true" class="modal_wrapper">
        <div class="modal">
          <div class="close-modal" @click.stop="selectFileModal = false" />
          <p class="p1">
            請選擇您的檔案
          </p>
          <p class="p2">
            檔案須符合中鋼方格座標
          </p>
          <label for="upfile" class="file-button">選擇檔案
            <input
              id="upfile"
              type="file"
              accept=".dxf"
              style="display: none;"
              @change="updateFileHandler()"
            >
          </label>
        </div>
      </div>

      <div v-if="updateModal === true" class="modal_wrapper">
        <div class="modal">
          <div class="close-modal" @click.stop="updateModal = false" />
          <div class="title-img">
            <div class="title-img2" />
            <div class="title-img3">
              {{ fileName }}
            </div>
          </div>
          <p class="p3">
            更新中
          </p>
          <div class="bar" />
        </div>
      </div>

      <div v-if="completeModal === true" class="modal_wrapper">
        <div class="modal">
          <div class="close-modal" @click.stop="completeModal = false" />
          <div class="title-img">
            <div class="title-img2" />
            <div class="title-img3">
              {{ fileName }}
            </div>
          </div>
          <p class="p3">
            更新完成
          </p>
          <div class="okpic" />
          <div class="file-button" @click.stop="completeModal = false">
            確認
          </div>
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
      isInit: false,
      selectFileModal: false,
      updateModal: false,
      completeModal: false,
      fileName: '',
      base64File: '',
      // 要更新的那個檔案編號
      nowFileFid: '',
      newRows: '',
      // 有修改時按鈕變橘色
      orangeSaveButton: false,
      oldValue: []
    };
  },
  components: {
    ColorPicker,
    draggable
  },
  mounted () {
    // 開啟 Loading 視窗
    this.$store.commit('GET_NOW_URL', 'customLayer');
    this.$store.commit('CTRL_LOADING_MASK', true);

    // ? 用 setTimeout 模擬 ajax 完成的狀態給人看
    setTimeout(() => {
      // ! 取得圖層資料，這邊應該要用 ajax 抓資料回來
      // const _layers = require('~/static/_resources/defaultLayerList.json');
      // this.tablesData.rows = [..._layers.data];
      this.getDefaultLayer();

      // 關閉 Loading 視窗與開啟側邊選單
      this.$store.commit('CTRL_LOADING_MASK', false);
      this.isInit = true;
    }, 1000);
  },
  methods: {
    // * 順序拖曳移動後會呼叫的事件
    changeHandler () {
    },
    getDefaultLayer () {
      fetch('/cscmap2/api/layer', {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then((response) => {
        return response.json();
      }).then((data) => {
        this.tablesData.rows = data;
        this.oldValue = _.cloneDeep(data);
        console.log(data);
      }).catch((err) => {
        console.log('錯誤:', err);
      });
    },
    updateFileHandler () {
      const newFile = document.getElementById('upfile').files[0];
      this.fileName = newFile.name;
      console.log(newFile);
      this.getBase64Handler(newFile);
    },
    // * @ 把圖層檔案轉成base64字串
    getBase64Handler (newFile) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(newFile);
        reader.onload = () => {
          console.log(reader.result);
          resolve(reader.result);
          // base64字串去掉前置詞
          const new64 = reader.result.split(',')[1];
          this.base64File = new64;

          this.selectFileModal = false;
          this.updateModal = true;

          this.uploadFileHandler();

          // 確定上面都做完後才會執行下面的非同步函式
          setTimeout(() => {
            this.updateModal = false;
            this.completeModal = true;
          }, 3000);
          // 把圖層名稱更新為上傳的檔案名稱 + 增加更新時間
          this.tablesData.rows.forEach((item) => {
            if (item.fid === this.nowFileFid) {
              item.title = this.fileName;
              item.updateTime = this.transDate(new Date());
            }
          });
        };
        reader.onerror = error => reject(error);
      });
    },
    // * @ 更新圖層
    uploadFileHandler () {
      const newArr = [];
      this.tablesData.rows.forEach((item) => {
        newArr.push({ fid: item.fid });
      });

      const index = this.tablesData.rows.findIndex(item => item.fid === this.nowFileFid);
      newArr[index].contentType = 'application/dxf';
      newArr[index].content = this.base64File;
      newArr[index].title = this.fileName;

      // newArr.push({ fid: this.nowFileFid, contentType: 'application/dxf', content: this.base64File, title: this.fileName });
      fetch('/cscmap2/api/layer', {
        method: 'PATCH',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(newArr)
      }).then((response) => {
        return response;
      }).then((data) => {
        console.log(data);
      }).catch((err) => {
        console.log('錯誤:', err);
      });
    },
    // * @ 儲存修改全部
    saveAllHandler () {
      const newArr = this.tablesData.rows;
      this.newRows = newArr;
      fetch('/cscmap2/api/layer', {
        method: 'PATCH',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(this.newRows)
      }).then((response) => {
        return response;
      }).then((data) => {
        console.log(data);

        this.$swal({
          width: 280,
          text: '儲存成功',
          imageUrl: require('~/assets/img/success.png'),
          imageWidth: 70,
          imageHeight: 70,
          confirmButtonText: '確定',
          showCloseButton: true
        });

        this.orangeSaveButton = false;
      }).catch((err) => {
        console.log('錯誤:', err);
      });
    },
    transDate (tdate) {
      if (tdate == null) { return; };
      const mydate = new Date(tdate);
      let dd = mydate.getDate();
      let mm = mydate.getMonth() + 1;
      const yyyy = mydate.getFullYear();
      const hh = mydate.getHours();
      const min = mydate.getMinutes();
      const ss = mydate.getSeconds();
      if (dd < 10) {
        dd = '0' + dd;
      }
      if (mm < 10) {
        mm = '0' + mm;
      }
      const date = yyyy + '-' + mm + '-' + dd + ' ' + ' ' + hh + ':' + min + ':' + ss;

      return date;
    }
  },
  watch: {
    'tablesData.rows': {
      handler (value) {
        const neww = JSON.stringify(value);
        const oldd = JSON.stringify(this.oldValue);
        if (neww !== oldd) {
          this.orangeSaveButton = true;
        } else {
          this.orangeSaveButton = false;
        }
      },
      deep: true
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

.save-btn {
  min-width: 85px;
  padding: 5px 11px;
  margin-right: 0;
  display: inline-block;
  font-size: 14px;
  text-align: center;
  color: #fff;
  background-color: #408bc5;
  border: 1px #408bc5 solid;
  border-radius: 5px;
  vertical-align: top;
  line-height: 1.6em;
}

.modal_wrapper {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 9998;
  cursor: default;
}

.modal {
  width: 280px;
  padding: 5px 31px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  position: fixed;
  top: 50%;
  left: 50%;
  font-size: 16px;
  text-align: center;
  background-color: #fff;
  border-radius: 10px;
  z-index: 9999;
  transform: translate(-50%, -50%);
  flex-direction: column;
}

.close-modal {
  width: 25px;
  height: 25px;
  position: absolute;
  top: 8px;
  right: 10px;
  background: url('~/assets/img/icon/close_icon.svg') no-repeat center/contain;
  cursor: pointer;
}

.p1 {
  margin-top: 39px;
  font-size: 18px;
  margin-bottom: 7px;
}

.p2 {
  font-size: 18px;
  color: red;
}

.file-button {
  // width: 130px;
  // padding: 6px;
  width: 85px;
  padding: 6px;
  // margin: 26px 0 18px;
  margin: 13px 0 7px;
  font-size: 16px;
  color: #fff;
  background-color: #408bc5;
  border-radius: 10px;
  cursor: pointer;
}

.title-img {
  width: 220px;
  padding: 5px;
  margin-top: 25px;
  display: flex;
  justify-content: space-evenly;
  color: #408bc5;
  background-color: #e4f4ff;
  border-radius: 10px;
}

.title-img2 {
  width: 24px;
  height: 24px;
  margin-right: 6px;
  background: url('~/assets/img/icon/save-icon.svg') no-repeat center/contain;
}

.title-img3 {
  font-size: 17px;
  font-weight: 600;
}

.p3 {
  margin-top: 13px;
  font-size: 25px;
  font-weight: bold;
  color: #165f88;
}

.bar {
  width: 236px;
  height: 12px;
  margin: 10px 0 20px;
  background: url('~/assets/img/icon/bar-new.svg') no-repeat center/contain;
}

.okpic {
  width: 25px;
  height: 25px;
  background: url('~/assets/img/icon/ok-buttton.svg') no-repeat center/contain;
}

.content {
  // padding: 30px 20px;
  padding: 0 20px 30px;
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
