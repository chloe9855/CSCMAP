<template>
  <div class="outter" :class="{ 'mobile-out': screenWidth < 1024 }">
    <table class="lattice-table">
      <div class="word-switch" :class="{ 'mobile-style': screenWidth < 1024 }">
        文字顯示
        <div class="swimg" :class="{ 'notshow': isShow === false }" @click="isShow = !isShow" />
      </div>
      <thead style="display: none;">
        <tr>
          <th>name</th>
          <th>control</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of resultList" :key="item.id">
          <td>
            <div class="lattice-table__name">
              {{ item.name }}
            </div>
          </td>
          <td>
            <ul class="lattice-table__control">
              <li>
                <ViewCheckbox
                  :id="item.id"
                  :visible="item.visible"
                  @change="item.visible = $event"
                />
              </li>
              <li>
                <OpacityController
                  :id="item.id"
                  :value="item.opacity"
                  @update="(id, value) => { $emit('updateOpacity', id, value) }"
                />
              </li>
              <li>
                <a
                  href="javascript:;"
                  class="location-btn"
                  title="定位"
                  @click.stop="$emit('setPosition', item.id)"
                  @mousedown.prevent
                >
                  <span>定位</span>
                </a>
              </li>
              <li>
                <a
                  href="javascript:;"
                  class="delete-btn"
                  title="刪除"
                  @click.stop="$emit('delete', item.id)"
                >
                  <span>刪除</span>
                </a>
              </li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ViewCheckbox from '~/components/tools/ViewCheckbox';
import OpacityController from '~/components/tools/OpacityController';

export default {
  data () {
    return {
      isShow: true
    };
  },
  components: {
    ViewCheckbox,
    OpacityController
  },
  props: {
    resultList: Array
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

.mobile-style {
  position: absolute;
  top: 27.5px !important;
  left: 115px !important;
}

.mobile-out {
  padding: 0 !important;
}

.word-switch {
  display: flex;
  position: absolute;
  top: 10.5px;
  right: 54px;
}

.swimg {
  width: 20px;
  height: 23px;
  margin-left: 61px;
  position: absolute;
  background: url('~/assets/img/icon/switch-on.svg') no-repeat center/contain;
  cursor: pointer;
}

.notshow {
  background: url('~/assets/img/icon/switch-off.svg') no-repeat center/contain !important;
}

.outter {
  padding-top: 39px;
}

// * 方格圖層的表格

.lattice-table {
  th,
  td {
    &:first-child {
      width: auto;
    }
  }

  th {
    @include min-width(map-get($desktop, sm)) {
      padding-right: 7px;
      padding-left: 7px;
    }
  }

  td {
    @include min-width(map-get($desktop, sm)) {
      padding-right: 5px;
      padding-left: 5px;
    }
  }

  tbody {
    tr {
      border: 5px rgba($color-white, 0) solid;
      border-right-width: 10px;
      border-left-width: 10px;
    }
  }
}

.lattice-table__name {
  word-break: break-all;
}

.lattice-table__control {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  > li {
    margin-right: 5px;
    margin-left: 5px;
  }
}

.location-btn {
  width: 20px;
  height: 20px;
  display: block;
  background: url('~/assets/img/icon/icon-location.svg') no-repeat center/contain;

  span {
    display: none;
  }
}

.delete-btn {
  width: 20px;
  height: 20px;
  display: block;
  background: url('~/assets/img/icon/icon-delete_blue.svg') no-repeat center/contain;

  span {
    display: none;
  }
}

</style>
