<template>
  <ul class="buildingList">
    <li
      v-for="item of itemsList"
      :key="item.key"
    >
      <BuildingItem-component
        :key="item.key"
        :item="item"
        :class="{ 'current': item.key === currentId }"
        :detail-btn="detailBtn"
        @click-block="$emit('click-block', item)"
        @click-detail="$emit('click-detail', item.key)"
      />
    </li>
  </ul>
</template>

<script>
import BuildingItem from '~/components/BuildingItem';

export default {
  components: {
    'BuildingItem-component': BuildingItem
  },
  props: {
    itemsList: Array,
    currentId: String,
    detailBtn: {
      type: Boolean,
      default () {
        return true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';

// * 建物搜尋結果

.buildingList {
  > li:nth-child(odd) {
    .building__item {
      background-color: #f4f4f4;
    }
  }
}

</style>
