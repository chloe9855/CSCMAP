<template>
  <div>
    <div style="display: none;">
      <v-photoswipe-gallery
        :is-open="false"
        :options="optionsGallery"
        :items="items"
      >
        <img slot-scope="props" :src="props.item.src" loading="lazy">
      </v-photoswipe-gallery>
    </div>
    <v-photoswipe
      :is-open="isOpen"
      :items="items"
      :options="options"
      @close="closeHandler"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      optionsGallery: {},
      options: {
        index: 0,
        zoomEl: false,
        shareEl: false,
        fullscreenEl: false,
        history: false
      },
      items: [
        {
          src: require('~/assets/img/guides/1.png'),
          w: 1920,
          h: 1080
        }, {
          src: require('~/assets/img/guides/2.png'),
          w: 1920,
          h: 1080
        },
        {
          src: require('~/assets/img/guides/3.png'),
          w: 1920,
          h: 1080
        }, {
          src: require('~/assets/img/guides/4.png'),
          w: 1920,
          h: 1080
        },
        {
          src: require('~/assets/img/guides/5.png'),
          w: 1920,
          h: 1080
        }, {
          src: require('~/assets/img/guides/6.png'),
          w: 1920,
          h: 1080
        },
        {
          src: require('~/assets/img/guides/7.png'),
          w: 1920,
          h: 1080
        }, {
          src: require('~/assets/img/guides/8.png'),
          w: 1920,
          h: 1080
        },
        {
          src: require('~/assets/img/guides/9.png'),
          w: 1920,
          h: 1080
        }, {
          src: require('~/assets/img/guides/10.png'),
          w: 1920,
          h: 1080
        },
        {
          src: require('~/assets/img/guides/11.png'),
          w: 1920,
          h: 1080
        },
        {
          src: require('~/assets/img/guides/12.png'),
          w: 1920,
          h: 1080
        },
        {
          src: require('~/assets/img/guides/13.png'),
          w: 1920,
          h: 1080
        },
        {
          src: require('~/assets/img/guides/14.png'),
          w: 1920,
          h: 1080
        }
      ]
    };
  },
  methods: {
    // * 關閉使用說明相簿
    closeHandler () {
      this.$store.commit('CTRL_TUTORIAL_OPEN', false);
    }
  },
  computed: {
    isOpen () {
      return this.$store.state.tutorialOpen;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/utils/_utils.scss';
@import '~/assets/scss/plugins/_photoswipe.scss';

</style>
