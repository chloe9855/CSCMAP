<template>
  <div class="query-window__container">
    <div v-if="resultType === 'structure'" class="query-window__info">
      <p class="query-window__info-caption">
        顯示 {{ resultNumber }} 筆結果
      </p>
      <div class="query-window__info-feature">
        <div class="query-window__info-column">
          <a
            href="javascript:;"
            class="btn size-full has-front-icon icon-back"
            @mousedown.prevent
          >到ERP看詳細</a>
        </div>
        <div class="query-window__info-column">
          <div class="select">
            <select>
              <option>時間由近到遠</option>
              <option>時間由遠到近</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="query-window__content">
      <div class="query-window__result theme-scrollbar">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    resultType: String,
    resultNumber: Number
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';

.query-window__info {
  display: none;

  @include min-width(map-get($desktop, sm)) {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    background-color: $color-white;
    pointer-events: all;
  }
}

.query-window__info-feature {
  width: 135px;
}

.query-window__info-column {
  margin-top: 10px;

  &:first-child {
    margin-top: 0;
  }
}

.query-window__info-caption {
  font-size: map-get($font-size, sm);
  color: $color-blue;
}

// * 搜尋結果視窗（建物搜尋、方格搜尋）

.query-window__container {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.query-window__content {
  display: none;

  @include min-width(map-get($desktop, sm)) {
    display: block;
    position: relative;
    background-color: $color-white;
    flex-grow: 1;
    pointer-events: all;
  }
}

.query-window__result {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: $color-white;
}

</style>
