<template>
  <div
    class="building__item"
    @click.stop="$emit('click-block', item)"
  >
    <div
      class="building__title has-icon"
      :class="`icon-type-${item.status}`"
    >
      {{ item.project }}
    </div>
    <div class="building__body">
      <div class="building__content">
        <p class="has-icon icon-building">
          <strong>各棟名稱</strong>{{ item.project }}
        </p>
        <p v-if="item.status === 'A' || item.status === 'G' || item.status === 'Z'" class="has-icon icon-people">
          <strong>用地申請單位/人員</strong>{{ item.applydept }}/{{ item.applyname }}
        </p>
        <p v-if="item.status === 'B' || item.status === 'C' || item.status === 'D'" class="has-icon icon-people">
          <strong>工程主辦單位/人員</strong>{{ item.projectdept }}/{{ item.projectname }}
        </p>
        <p v-if="item.status === 'E' || item.status === 'F'" class="has-icon icon-people">
          <strong>保管單位/人員</strong>{{ item.ownerdept }}/{{ item.ownername }}
        </p>
        <p v-if="item.status === 'A' || item.status === 'G' || item.status === 'Z'" class="has-icon icon-license">
          <strong>用地登錄時間</strong>{{ item.applytime }}
        </p>
        <p v-if="item.status === 'B' || item.status === 'C' || item.status === 'D'" class="has-icon icon-license">
          <strong>建築執照編號</strong>{{ item.permitno }}
        </p>
        <p v-if="item.status === 'E' || item.status === 'F'" class="has-icon icon-license">
          <strong>使用執照編號</strong>{{ item.useno }}
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
        class="building__tag"
        :class="item.tax === 'true' ? 'icon-checked' : 'icon-error'"
      >房屋稅籍</span>
      <span
        class="building__tag"
        :class="item.factory === 'true' ? 'icon-checked' : 'icon-error'"
      >工廠登記</span>
      <span
        class="building__tag"
        :class="item.offer === 'true' ? 'icon-checked' : 'icon-error'"
      >優惠減免</span>
      <span
        class="building__tag"
        :class="item.save === 'true' ? 'icon-checked' : 'icon-error'"
      >保存登記</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      switchName: ''
    };
  },
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
  },
  mounted () {
    this.switchNameHandler();
  },
  methods: {
    switchNameHandler () {
      if (this.item.status === 'A' || this.item.status === 'G' || this.item.status === 'Z') {
        this.switchName = '用地申請單位/人員';
      } else if (this.item.status === 'B' || this.item.status === 'C' || this.item.status === 'D') {
        this.switchName = '工程主辦單位/人員';
      } else if (this.item.status === 'E' || this.item.status === 'F') {
        this.switchName = '保管單位/人員';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';

</style>
