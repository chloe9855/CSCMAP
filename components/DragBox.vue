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
      screenY: 0,
      goCancel: true
    };
  },
  props: {
    name: String,
    iconName: String
  },
  mounted () {
    const draggable = this.$refs.dragbox;
    this.initInteract(draggable);

    draggable.addEventListener('mousemove', (e) => {
      if (this.$store.state.cancelDrag === true) {
        this.container.unset(); // 使拖曳功能失效
        console.log('ww');
        this.goCancel = false;
      }
      if (this.$store.state.cancelDrag === false && this.goCancel === false) {
        this.initInteract(draggable); // 重新啟用拖曳功能
        this.goCancel = true;
      }
    });
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
        // onstart: this.startMe,
        onmove: this.dragMoveListener,
        onend: this.dragEndListener
      });
    },
    startMe (event) {
      if (this.$store.state.cancelDrag === true) {
        this.container.unset();
        console.log('ww');
      } else if (this.$store.state.cancelDrag === false) {
        // this.initInteract(this.$refs.dragbox);
      }
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
  // watch: {
  //   container (value) {
  //     if (this.$store.state.cancelDrag === false) {
  //       this.initInteract(this.$refs.dragbox);
  //     }
  //   }
  // }
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
