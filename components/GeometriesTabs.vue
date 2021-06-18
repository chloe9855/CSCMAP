<template>
  <div class="geometry-tabs">
    <div class="geometry-tabs__header">
      <div class="geometry-tabs__btn-group">
        <a
          v-for="typeItem of typesList"
          :key="typeItem.id"
          href="javascript:;"
          class="geometry-tabs__btn"
          :class="buttonClassProvider(typeItem.id)"
          :title="typeItem.name"
          @click.stop="$emit('selectType', typeItem.id),$emit('allTypeList', typesIdList),hideEditMode()"
          @mouseenter="caption = typeItem.name"
          @mouseleave="caption = ''"
          @mousedown.prevent
        >
          <span>{{ typeItem.name }}</span>
        </a>
      </div>
      <div
        v-if="caption !== '' && current === ''"
        class="geometry-tabs__caption"
      >
        {{ caption }}
      </div>
      <div
        v-if="current !== ''"
        class="geometry-tabs__description"
      >
        <p>{{ description }}</p>
        <div class="row is-flex-center">
          <div class="btn-group">
            <a
              href="javascript:;"
              class="btn color-white"
              title="上一步"
              @click.stop="$emit('goBack')"
              @mousedown.prevent
            >上一步</a>
            <a
              href="javascript:;"
              class="btn color-white"
              title="取消"
              @click.stop="$emit('selectType', ''),$emit('cancel')"
              @mousedown.prevent
            >取消</a>
          </div>
        </div>
      </div>
    </div>
    <div class="geometry-tabs__body">
      <ul
        v-if="graphList.length > 0"
        class="geometry-list theme-scrollbar"
      >
        <li
          v-for="graphItem of graphList"
          :key="graphItem.id"
          class="gogoli"
        >
          <div class="geometry-list__item">
            <div
              :class="`switch-bg-${graphItem.id}`"
              class="pickme"
              @click.stop="$emit('getPosition',graphItem.id),changeColorHandler(graphItem.id)"
            >
              <div
                class="geometry-list__main"
                :class="`type-${graphItem.type}`"
              >
                <div class="geometry-list__content">
                  <div class="geometry-list__header">
                    <div class="geometry-list__title">
                      {{ graphItem.name }}
                    </div>
                    <div class="geometry-list__btn-group">
                      <a
                        href="javascript:;"
                        class="geometry-list__btn icon-edit"
                        title="編輯"
                        @click.stop="graphItem.controlBar = !graphItem.controlBar,editItemHandler(graphItem.id),$emit('modify', graphItem.id)"
                        @mousedown.prevent
                      />
                      <a
                        href="javascript:;"
                        class="geometry-list__btn icon-close"
                        title="刪除"
                        @click.stop="$emit('deleteGraph', graphItem.id)"
                        @mousedown.prevent
                      />
                    </div>
                  </div>
                  <p v-if="graphItem.type === 'circleLand' || graphItem.type === 'circle'">
                    {{ graphItem.radius }}
                  </p>
                  <p v-if="graphItem.type === 'line'">
                    總長{{ graphItem.radius }}
                  </p>
                  <p v-if="graphItem.type !== 'line'">
                    總面積{{ graphItem.detail }}平方公尺
                  </p>
                </div>
              </div>
            </div>
            <div
              v-if="graphItem.controlBar === true"
              class="geometry-list__feature"
            >
              <div class="btn-group">
                <a
                  href="javascript:;"
                  class="btn color-light-blue"
                  title="上一步"
                  @click.stop="$emit('goBack')"
                  @mousedown.prevent
                >上一步</a>
                <a
                  href="javascript:;"
                  class="btn color-light-blue"
                  title="取消"
                  @click.stop="graphItem.controlBar = false,$emit('cancel')"
                  @mousedown.prevent
                >取消</a>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div
        v-if="graphList.length > 0"
        class="geometry-under-row"
      >
        <a
          href="javascript:;"
          class="btn has-outline outline-color-default size-small"
          title="清除全部"
          @click.stop="$emit('deleteAllGraph', typesIdList)"
          @mousedown.prevent
        >清除全部</a>

        <a
          v-if="!typesIdList.includes('line','rect','poly','circle')"
          href="javascript:;"
          class="btn size-small addme"
          title="確定"
          @click.stop="$emit('uploadAllGraph')"
          @mousedown.prevent
        >確定</a>
      </div>
      <p
        v-if="graphList.length <= 0 && !typesIdList.includes('line','rect','poly','circle')"
        class="notice-tips"
      >
        尚未新增預定用地
      </p>
      <p
        v-if="graphList.length <= 0 && !typesIdList.includes('rectangleLand', 'polygonLand', 'circleLand')"
        class="notice-tips"
      >
        尚未測量
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      caption: ''
    };
  },
  props: {
    current: String,
    typesList: Array,
    graphList: Array,
    myGraphs: Array
  },
  mounted () {
    this.setItemColor();
  },
  methods: {
    // * 類型按鈕的 class
    buttonClassProvider (id) {
      return `icon-${id} ${this.current === id ? 'current' : ''}`;
    },
    // * 單數列背景是灰色 用$nextTick確保DOM已渲染完成後 才繼續進行下面動作
    setItemColor () {
      this.$nextTick(() => {
        this.graphList.forEach((item, index) => {
          if (index % 2 === 0) {
            document.querySelector(`.switch-bg-${item.id}`).style.backgroundColor = '#f2f2f2';
          }
        });
      });
    },
    setItemColor2 () {
      this.graphList.forEach((item, index) => {
        if (index % 2 === 0) {
          document.querySelector(`.switch-bg-${item.id}`).style.backgroundColor = '#f2f2f2';
        }
      });
    },
    // * 點按預定地列表變更背景色
    changeColorHandler (id) {
      console.log(id);
      // 先清空被點過有變色的
      this.graphList.forEach((item) => {
        document.querySelector(`.switch-bg-${item.id}`).style.backgroundColor = '';
      });
      this.setItemColor2();
      document.querySelector(`.switch-bg-${id}`).style.backgroundColor = '#FFF2CE';
    },
    // * 一次只能編輯一個圖形
    editItemHandler (id) {
      this.graphList.forEach((item) => {
        if (item.id !== id) {
          item.controlBar = false;
        }
      });
    },
    // * 按下新增用地時 會關閉其它所有編輯狀態
    hideEditMode () {
      this.graphList.forEach((item) => {
        item.controlBar = false;
      });
    }
  },
  computed: {
    // * 使用說明
    description () {
      const data = this.typesList.filter(item => item.id === this.current);
      return data.length > 0 ? data[0].description : '';
    },
    // * 向量圖形 ID 列表
    typesIdList () {
      return this.typesList.map(item => item.id);
    }
  },
  watch: {
    graphList: {
      handler () {
        this.setItemColor();
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';

// * 測量元件的頁籤

// .add_bgcolor {
//   background-color: $color-orange-light;
// }

.addme {
  margin-left: 13px;
  color: #f2f2f2;
  background-color: $color-blue-light;
}

.geometry-tabs__header {
  padding: 10px;
  background-color: $color-blue-light;
}

.geometry-tabs__btn-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
}

.geometry-tabs__btn {
  padding: 3px 10px;
  display: block;
  border-radius: 5px;

  @include min-width(map-get($desktop, sm)) {
    &:hover,
    &:focus {
      background-color: $color-orange-light;
    }
  }

  &.current {
    background-color: $color-orange-light;
  }

  > span {
    display: none;
  }

  &::before {
    content: '';
    width: 35px;
    height: 35px;
    margin: auto;
    display: block;
    background: {
      position: center;
      repeat: no-repeat;
      size: contain;
    }
  }

  &.icon-line {
    @include min-width(map-get($desktop, sm)) {
      &:hover::before,
      &:focus::before {
        background-image: url('~/assets/img/icon/icon-geometry-line_orange.svg');
      }
    }

    &::before {
      background-image: url('~/assets/img/icon/icon-geometry-line.svg');
    }

    &.current::before {
      background-image: url('~/assets/img/icon/icon-geometry-line_orange.svg');
    }
  }

  &.icon-rect {
    @include min-width(map-get($desktop, sm)) {
      &:hover::before,
      &:focus::before {
        background-image: url('~/assets/img/icon/icon-geometry-rect_orange.svg');
      }
    }

    &::before {
      background-image: url('~/assets/img/icon/icon-geometry-rect.svg');
    }

    &.current::before {
      background-image: url('~/assets/img/icon/icon-geometry-rect_orange.svg');
    }
  }

  &.icon-poly {
    @include min-width(map-get($desktop, sm)) {
      &:hover::before,
      &:focus::before {
        background-image: url('~/assets/img/icon/icon-geometry-poly_orange.svg');
      }
    }

    &::before {
      background-image: url('~/assets/img/icon/icon-geometry-poly.svg');
    }

    &.current::before {
      background-image: url('~/assets/img/icon/icon-geometry-poly_orange.svg');
    }
  }

  &.icon-circle {
    @include min-width(map-get($desktop, sm)) {
      &:hover::before,
      &:focus::before {
        background-image: url('~/assets/img/icon/icon-geometry-circle_orange.svg');
      }
    }

    &::before {
      background-image: url('~/assets/img/icon/icon-geometry-circle.svg');
    }

    &.current::before {
      background-image: url('~/assets/img/icon/icon-geometry-circle_orange.svg');
    }
  }

  &.icon-rectangleLand {
    @include min-width(map-get($desktop, sm)) {
      &:hover::before,
      &:focus::before {
        background-image: url('~/assets/img/icon/icon-geometry-rectangleLand_orange.svg');
      }
    }

    &::before {
      background-image: url('~/assets/img/icon/icon-geometry-rectangleLand.svg');
    }

    &.current::before {
      background-image: url('~/assets/img/icon/icon-geometry-rectangleLand_orange.svg');
    }
  }

  &.icon-polygonLand {
    @include min-width(map-get($desktop, sm)) {
      &:hover::before,
      &:focus::before {
        background-image: url('~/assets/img/icon/icon-geometry-polygonLand_orange.svg');
      }
    }

    &::before {
      background-image: url('~/assets/img/icon/icon-geometry-polygonLand.svg');
    }

    &.current::before {
      background-image: url('~/assets/img/icon/icon-geometry-polygonLand_orange.svg');
    }
  }

  &.icon-circleLand {
    @include min-width(map-get($desktop, sm)) {
      &:hover::before,
      &:focus::before {
        background-image: url('~/assets/img/icon/icon-geometry-circleLand_orange.svg');
      }
    }

    &::before {
      background-image: url('~/assets/img/icon/icon-geometry-circleLand.svg');
    }

    &.current::before {
      background-image: url('~/assets/img/icon/icon-geometry-circleLand_orange.svg');
    }
  }
}

.geometry-tabs__caption {
  height: 30px;
  padding: 5px 15px;
  display: block;
  color: $color-white;
  line-height: 30px;
}

.geometry-tabs__description {
  padding: 10px 15px 0;
  color: $color-white;
}

// * 測量元件的列表

.geometry-list {
  width: 100%;
  max-height: 210px;
  overflow-x: hidden;
  overflow-y: auto;
}

.geometry-list__item {
  // padding: 6px 10px;
  // background-color: #f2f2f2;

  @include min-width(map-get($desktop, sm)) {
    &:hover,
    &:focus {
      // background-color: $color-orange-light;

      .geometry-list__main.type-line::before {
        background-image: url('~/assets/img/icon/icon-geometry-line_orange.svg');
      }

      .geometry-list__main.type-rect::before {
        background-image: url('~/assets/img/icon/icon-geometry-rect_orange.svg');
      }

      .geometry-list__main.type-poly::before {
        background-image: url('~/assets/img/icon/icon-geometry-poly_orange.svg');
      }

      .geometry-list__main.type-circle::before {
        background-image: url('~/assets/img/icon/icon-geometry-circle_orange.svg');
      }
    }
  }
}

.add_bgcolor {
  // background-color: $color-orange-light;
}

.pickme {
  padding: 10px;
}

.pickme:hover {
  background-color: $color-orange-light;
}

.pickme:focus {
  background-color: $color-orange-light;
}

.gogoli {
  padding: 6px 10px;
}

.geometry-list__main {
  display: flex;

  &::before {
    content: '';
    width: 40px;
    height: 40px;
    display: block;
    flex-basis: 40px;
    background: {
      position: center;
      repeat:no-repeat;
      size: contain;
    }
  }

  &.type-line::before {
    background-image: url('~/assets/img/icon/icon-geometry-line_blue.svg');
  }

  &.type-rect::before {
    background-image: url('~/assets/img/icon/icon-geometry-rect_blue.svg');
  }

  &.type-poly::before {
    background-image: url('~/assets/img/icon/icon-geometry-poly_blue.svg');
  }

  &.type-circle::before {
    background-image: url('~/assets/img/icon/icon-geometry-circle_blue.svg');
  }

  &.type-rectangleLand::before {
    background-image: url('~/assets/img/icon/icon-geometry-rectangleLand_blue.svg');
  }

  &.type-polygonLand::before {
    background-image: url('~/assets/img/icon/icon-geometry-polygonLand_blue.svg');
  }

  &.type-circleLand::before {
    background-image: url('~/assets/img/icon/icon-geometry-circleLand_blue.svg');
  }
}

.geometry-list__content {
  width: calc(100% - 40px);
  flex-grow: 1;
  flex-basis: 0;
  padding-left: 10px;
  line-height: 25px;

  p {
    margin-bottom: 0;
  }
}

.geometry-list__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.geometry-list__title {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-basis: 0;
  flex-grow: 1;
  word-break: keep-all;
}

.geometry-list__btn-group {
  display: flex;
}

.geometry-list__btn {
  width: 20px;
  height: 20px;
  margin-left: 5px;
  display: block;
  background: {
    position: center;
    repeat:no-repeat;
    size: 80%;
  }

  &.icon-edit {
    background-image: url('~/assets/img/icon/icon-edit.svg');
  }

  &.icon-close {
    background-image: url('~/assets/img/icon/icon-clear_orange.svg');
  }
}

.geometry-list__feature {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.geometry-under-row {
  padding: 10px;
  display: flex;
  justify-content: flex-end;
  background-color: $color-white;
}

</style>
