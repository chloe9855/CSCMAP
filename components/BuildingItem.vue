<template>
  <div
    class="building__item"
    @click.stop="$emit('click-block', item)"
  >
    <div
      class="building__title has-icon"
      :class="`icon-type-${item.typeName}`"
    >
      {{ item.title }}
    </div>
    <div class="building__body">
      <div class="building__content">
        <p class="has-icon icon-building">
          <strong>各棟名稱</strong>{{ item.buildingName }}
        </p>
        <p class="has-icon icon-people">
          <strong>用地申請單位/人員</strong>{{ item.department }}
        </p>
        <p class="has-icon icon-license">
          <strong>用地登錄時間</strong>{{ item.time }}
        </p>
      </div>
      <a
        v-if="detailBtn === true"
        href="javascript:;"
        class="read-more-btn"
        title="看詳細"
        @click.stop="$emit('click-detail', item)"
        @mousedown.prevent
      >看詳細</a>
    </div>
    <div class="building__tag-group">
      <span
        v-for="tag of item.tags"
        :key="tag.name"
        class="building__tag"
        :class="tag.isChecked === true ? 'icon-checked' : 'icon-error'"
      >{{ tag.name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
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

</style>
