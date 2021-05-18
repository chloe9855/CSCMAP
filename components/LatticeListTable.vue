<template>
  <table class="lattice-table">
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
</template>

<script>
import ViewCheckbox from '~/components/tools/ViewCheckbox';
import OpacityController from '~/components/tools/OpacityController';

export default {
  components: {
    ViewCheckbox,
    OpacityController
  },
  props: {
    resultList: Array
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';

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
