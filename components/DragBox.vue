<template>
  <div ref="dragbox" class="msgbox dragbox">
    <div class="msgbox__wrapper">
      <div class="msgbox__header">
        <div class="msgbox__header-content">
          <slot name="header">
            <label
              class="msgbox__title"
              :class="iconName ? `has-icon ${iconName}` : ''"
            >{{ name }}</label>
          </slot>
        </div>
        <a
          href="javascript:;"
          class="msgbox__close-btn"
          @click.stop="$emit('close')"
          @mousedown.prevent
        />
      </div>
      <div class="msgbox__content">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<script>
import interact from 'interactjs';

export default {
  data () {
    return {
      container: null,
      screenX: 0,
      screenY: 0
    };
  },
  props: {
    name: String,
    iconName: String
  },
  mounted () {
    const draggable = this.$refs.dragbox;
    this.initInteract(draggable);
  },
  beforeDestroy () {
    this.container.unset();
  },
  methods: {
    // * 拖曳選單套件設定
    initInteract (selector) {
      this.container = interact(selector).draggable({
        inertia: true,
        restrict: {
          restriction: 'parent',
          endOnly: true
        },
        autoScroll: true,
        onmove: this.dragMoveListener,
        onend: this.dragEndListener
      });
    },
    // * 拖曳事件與更新坐標
    dragMoveListener (event) {
      const target = event.target;
      const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
      const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

      target.style.cursor = 'grabbing';
      target.style.webkitTransform = target.style.transform = `translate(${x}px, ${y}px)`;
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    },
    // * 拖曳完成事件
    dragEndListener (event) {
      const target = event.target;
      this.screenX = target.getBoundingClientRect().left;
      this.screenY = target.getBoundingClientRect().top;
      target.style.cursor = 'grab';
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';
@import '~/assets/scss/components/_messageBox.scss';

// * 拖曳視窗設定

.dragbox {
  width: auto;
  max-height: none;
  display: block;
  position: absolute;
  top: 190px;
  right: 100px;
  z-index: 4000;
  cursor: grab;
}

</style>
