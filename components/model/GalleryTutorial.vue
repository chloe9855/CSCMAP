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
          src: require('~/assets/img/guides/1.JPG'),
          w: 1920,
          h: 1080
        }, {
          src: require('~/assets/img/guides/2.JPG'),
          w: 1920,
          h: 1080
        },
        {
          src: require('~/assets/img/guides/3.JPG'),
          w: 1920,
          h: 1080
        }, {
          src: require('~/assets/img/guides/4.JPG'),
          w: 1920,
          h: 1080
        },
        {
          src: require('~/assets/img/guides/5.JPG'),
          w: 1920,
          h: 1080
        }, {
          src: require('~/assets/img/guides/6.JPG'),
          w: 1920,
          h: 1080
        },
        {
          src: require('~/assets/img/guides/7.JPG'),
          w: 1920,
          h: 1080
        }, {
          src: require('~/assets/img/guides/8.JPG'),
          w: 1920,
          h: 1080
        },
        {
          src: require('~/assets/img/guides/9.JPG'),
          w: 1920,
          h: 1080
        }, {
          src: require('~/assets/img/guides/10.JPG'),
          w: 1920,
          h: 1080
        },
        {
          src: require('~/assets/img/guides/11.JPG'),
          w: 1920,
          h: 1080
        },
        {
          src: require('~/assets/img/guides/12.JPG'),
          w: 1920,
          h: 1080
        },
        {
          src: require('~/assets/img/guides/13.JPG'),
          w: 1920,
          h: 1080
        },
        {
          src: require('~/assets/img/guides/14.JPG'),
          w: 1920,
          h: 1080
        },
        {
          src: require('~/assets/img/guides/15.JPG'),
          w: 1920,
          h: 1080
        }, {
          src: require('~/assets/img/guides/16.JPG'),
          w: 1920,
          h: 1080
        },
        {
          src: require('~/assets/img/guides/17.JPG'),
          w: 1920,
          h: 1080
        },
        {
          src: require('~/assets/img/guides/18.JPG'),
          w: 1920,
          h: 1080
        }, {
          src: require('~/assets/img/guides/19.JPG'),
          w: 1920,
          h: 1080
        },
        {
          src: require('~/assets/img/guides/20.JPG'),
          w: 1920,
          h: 1080
        },
        {
          src: require('~/assets/img/guides/21.JPG'),
          w: 1920,
          h: 1080
        }, {
          src: require('~/assets/img/guides/22.JPG'),
          w: 1920,
          h: 1080
        },
        {
          src: require('~/assets/img/guides/23.JPG'),
          w: 1920,
          h: 1080
        },
        {
          src: require('~/assets/img/guides/24.JPG'),
          w: 1920,
          h: 1080
        }, {
          src: require('~/assets/img/guides/25.JPG'),
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
