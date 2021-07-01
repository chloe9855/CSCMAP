<template>
  <div>
    <div
      v-for="item in mycluster"
      :id="`myid-${item.key}`"
      :key="item.key"
      class="building__item theme-in-map cursorm"
    >
      <div
        class="title-container"
        @click.stop="togglePic(item.key), switchBg(item.key), $emit('scroll-top',item.key)"
      >
        <div
          class="building__title has-icon"
          :class="`icon-type-${item.status}`"
        >
          {{ item.project }}
        </div>
        <img
          :id="`pic-${item.key}`"
          class="tri-pic"
          :src="require('~/assets/img/down-list.svg')"
        >
      </div>

      <div
        class="building__article"
        :class="`block-${item.key}`"
      >
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      switchName: '',
      changePic: require('~/assets/img/down-list.svg')
    };
  },
  props: {
    // item: {
    //   type: Object,
    //   required: true
    // }
    mycluster: Array
  },
  mounted () {
    // this.switchNameHandler();
  },
  methods: {
    // switchNameHandler () {
    //   if (this.item.status === 'A' || this.item.status === 'G' || this.item.status === 'Z') {
    //     this.switchName = '用地申請單位/人員';
    //   } else if (this.item.status === 'B' || this.item.status === 'C' || this.item.status === 'D') {
    //     this.switchName = '工程主辦單位/人員';
    //   } else if (this.item.status === 'E' || this.item.status === 'F') {
    //     this.switchName = '保管單位/人員';
    //   }
    // },
    togglePic (key) {
      const mySrc = document.getElementById(`pic-${key}`);
      // 一次只能點一個
      this.mycluster.forEach((item) => {
        if (item.key !== key) {
          document.querySelector(`.block-${item.key}`).style.display = 'none';
          document.getElementById(`pic-${item.key}`).src = require('~/assets/img/down-list.svg');
        }
      });
      if (mySrc.src === require('~/assets/img/up-list.svg')) {
        mySrc.src = require('~/assets/img/down-list.svg');
        document.querySelector(`.block-${key}`).style.display = 'none';
      } else if (mySrc.src === require('~/assets/img/down-list.svg')) {
        mySrc.src = require('~/assets/img/up-list.svg');
        document.querySelector(`.block-${key}`).style.display = 'block';
      }
    },
    switchBg (key) {
      // 先清空被點過有變色的
      this.mycluster.forEach((item) => {
        document.getElementById(`myid-${item.key}`).classList.remove('cluster-bg');
      });
      // 加黃色
      document.getElementById(`myid-${key}`).classList.add('cluster-bg');
    },
    scrollTopHandler (key) {
      const index = this.mycluster.findIndex(item => item.key === key);
      console.log(index);

      this.$nextTick(() => {
        const result = index < 1 ? 0 : (index * 133);
        this.$refs.mycontent.scrollTop = result;
        console.log(result);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';

.hide-role {
  display: none !important;
}

.title-container {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}

.cluster-bg {
  background-color: #fff2ce !important;
}

.cursorm {
  cursor: auto !important;
}

</style>
