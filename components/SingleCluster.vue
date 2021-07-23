<template>
  <div
    id="meme1"
    :style="'width: 370px; border-radius: 10px;padding: 0px 4px 7px;background: white; height: 134px;'"
  >
    <div
      v-for="item in allitem"
      :key="item.key"
      class="building__item theme-in-map cursorm"
    >
      <div
        class="building__title has-icon icon-type"
        :class="`${item.status}`"
      >
        <a href="javascript:;" :style="'color: #165f88; cursor: default;'" :title="item.project">
          {{ item.project }}
        </a>
      </div>
      <div class="building__body">
        <div class="building__content">
          <p class="has-icon icon-building">
            <strong>各棟名稱</strong>{{ item.project }}
          </p>
          <p v-if="item.status !== 'B' && item.status !== 'C' && item.status !== 'D' && item.status !== 'E' && item.status !== 'F'" class="has-icon icon-people">
            <strong>用地申請單位/人員</strong>{{ item.applydept }}/{{ item.applyname }}
          </p>
          <p v-if="item.status === 'B' || item.status === 'C' || item.status === 'D'" class="has-icon icon-people">
            <strong>工程主辦單位/人員</strong>{{ item.projectdept }}/{{ item.projectname }}
          </p>
          <p v-if="item.status === 'E' || item.status === 'F'" class="has-icon icon-people">
            <strong>保管單位/人員</strong>{{ item.ownerdept }}/{{ item.ownername }}
          </p>
          <p v-if="item.status !== 'B' && item.status !== 'C' && item.status !== 'D' && item.status !== 'E' && item.status !== 'F'" class="has-icon icon-license">
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
          href="javascript:;"
          class="read-more-btn"
          :class="{ 'hide-role' : $store.state.myUserRole === 3 }"
          title="看詳細"
          @click.stop="$emit('click-detail', item.key)"
          @mousedown.prevent
        >看詳細</a>
      </div>
      <div class="building__tag-group" :class="{ 'hide-role' : $store.state.myUserRole === 3 }">
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
    allitem: {
      type: Array,
      required: true
    },
    myType: String
  },
  mounted () {
    // this.switchNameHandler();
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

.hide-role {
  display: none !important;
}

.cursorm {
  cursor: default !important;
}

</style>
