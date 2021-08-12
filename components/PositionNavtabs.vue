<template>
  <div class="navtabs">
    <div class="navtabs__header">
      <a
        v-for="typeItem of options.typeList"
        :key="typeItem.id"
        href="javascript:;"
        class="navtabs__btn"
        :class="{ 'current': options.current === typeItem.id }"
        :title="typeItem.name"
        @click.stop="$emit('select', typeItem.id)"
        @mousedown.prevent
      >
        <span>{{ typeItem.name }}</span>
      </a>
    </div>
    <div class="navtabs__body">
      <div class="navtabs__content">
        <div v-if="options.current === 0" class="row">
          <div class="fieldset row-column">
            <InputContentListener
              v-model="reference.gridPosition.x"
              :placeholder="`輸入方格X坐標`"
              :is-password="false"
              :is-decimal="true"
            />
          </div>
          <div class="fieldset row-column">
            <InputContentListener
              v-model="reference.gridPosition.y"
              :placeholder="`輸入方格Y坐標`"
              :is-password="false"
              :is-decimal="true"
            />
          </div>
        </div>

        <div v-if="options.current === 1" class="row">
          <div class="fieldset">
            <InputContentListener
              v-model="reference.gridNumber"
              :placeholder="`輸入方格圖號`"
              :is-password="false"
              :is-decimal="true"
            />
          </div>
        </div>

        <div v-if="options.current === 2" class="row">
          <div class="fieldset row-column">
            <InputContentListener
              v-model="reference.twdPosition.x"
              :placeholder="`180000`"
              :is-password="false"
              :is-decimal="true"
            />
          </div>
          <div class="fieldset row-column">
            <InputContentListener
              v-model="reference.twdPosition.y"
              :placeholder="`2490000`"
              :is-password="false"
              :is-decimal="true"
            />
          </div>
        </div>

        <!-- <div v-if="options.current !== 2" class="row is-flex-end">
          <div class="type-control">
            <div class="type-control__item">
              <input
                id="positionSearchType_1"
                v-model="reference.searchTypeCsc"
                type="radio"
                name="positionSearchType"
                :value="true"
              >
              <label for="positionSearchType_1">
                <span>中鋼</span>
              </label>
            </div>
            <div class="type-control__item">
              <input
                id="positionSearchType_2"
                v-model="reference.searchTypeCsc"
                type="radio"
                name="positionSearchType"
                :value="false"
              >
              <label for="positionSearchType_2">
                <span>冷三</span>
              </label>
            </div>
          </div>
        </div> -->

        <div class="row is-flex-center">
          <div class="btn-group">
            <a
              href="javascript:;"
              class="btn has-outline outline-color-default size-small"
              title="清除"
              @click.stop="clearAllHandler"
              @mousedown.prevent
            >
              <span>清除</span>
            </a>
            <a
              href="javascript:;"
              class="btn size-small color-blue"
              title="定位"
              @click.stop="$emit('submit')"
              @mousedown.prevent
            >
              <span>定位</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InputContentListener from '~/components/tools/InputContentListener';

export default {
  data () {
    return {
      reference: {
        searchTypeCsc: true,
        gridNumber: '',
        gridPosition: {
          x: '',
          y: ''
        },
        twdPosition: {
          x: '',
          y: ''
        }
      }
    };
  },
  components: {
    InputContentListener
  },
  props: {
    options: Object
  },
  created () {
    Object.keys(this.reference).forEach((key) => {
      this.reference[key] = this.options[key];
    });
  },
  methods: {
    // * 清除全部
    clearAllHandler () {
      this.reference.gridNumber = '';
      this.reference.gridPosition.x = '';
      this.reference.gridPosition.y = '';
      this.reference.twdPosition.x = '';
      this.reference.twdPosition.y = '';
      this.$emit('clearImg');
    }
  },
  computed: {
    // * 搜尋類型選擇
    searchTypeName () {
      return this.reference.searchTypeCsc === true ? '中鋼' : '冷三';
    }
  },
  watch: {
    reference: {
      handler (value) {
        this.$emit('update', value);
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';
@import '~/assets/scss/components/_navtabs.scss';

</style>
