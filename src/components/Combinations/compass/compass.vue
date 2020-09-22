<template>
  <div class="compass" v-show="compassShow">
    <div class="btnCompass" @click="reduceCompass">
      <span
        id="compass"
        class="iconfont iconiEarth-zhibeizhen-01"
        style="transform : rotate(-45deg);display : inline-block;"
      ></span>
    </div>
    <div class="btnCompass" @click="reset">
      <span id="compass" class="iconfont iconiEarth-zhuyemian-01"></span>
    </div>
    <div class="btnCompass" @click="fullscreenchange">
      <span class="iconfont" :class="!isfull?'iconICON_quanping':'iconICON_tuichuquanping'"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "compass",
  data() {
    return {
      sharedState: store.state,
      isfull: false,
    };
  },

  computed: {
    isInitViewer: function () {
      return this.sharedState.isInitViewer;
    },
    compassShow: function () {
      return this.sharedState.compass;
    },
  },

  mounted() {
    if (this.isInitViewer) {
      // this.initCompass();
    }
  },
  methods: {
    initCompass() {
      scene.postRender.addEventListener(function () {
        let heading = scene.camera.heading;
        let x = Cesium.Math.toDegrees(heading);
        let degrees = "rotate(" + x + "deg)";
        document.getElementById("compass").style.transform = degrees;
      });
    },
    reduceCompass() {
      document.getElementById("compass").style.transform = "rotate(-45deg)";
      scene.camera.flyTo({
        destination: scene.camera.position,
        orientation: {
          heading: Cesium.Math.toRadians(0),
        },
      });
    },
    reset() {
      viewer.camera.flyTo({
        destination: new Cesium.Cartesian3.fromDegrees(
          110.60396458865515,
          34.54408834959379,
          30644793.325518917
        ),
      });
    },
    fullscreenchange() {
      if (!document.fullscreenElement) {
        this.isfull = true;
        this.launchFullscreen(document.documentElement);
      } else {
        this.isfull = false;
        this.exitFullscreen();
      }
    },
    /**
     * 进入全屏模式。目前并不是所有的浏览器都实现了无前缀版本的API（2018-12-10）
     */
    launchFullscreen(element) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      }
    },
    /**
     * 退出全屏模式。兼容模式。
     */
    exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    },
  },

  watch: {
    isInitViewer(val) {
      if (val) {
        this.initCompass();
      }
    },
  },
};
</script>

<style lang="scss"  scoped>
@import "compass";
</style>