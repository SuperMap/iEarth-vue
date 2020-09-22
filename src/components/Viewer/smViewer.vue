<template>
  <div id="cesiumContainer" ref="viewer">
    <!-- 工具选择组件 -->
    <tool-bar></tool-bar>
    <compass></compass>
    <china-epidemic-map></china-epidemic-map>
    <world-epidemic-map></world-epidemic-map>
  </div>
</template>

<script>
export default {
  name: "sm-viewer",
  props: {
    combination: {
      //组合接口
      type: Boolean,
    },
    sceneUrl: {
      //场景接口
      type: String,
    },
    s3mScps: {
      //s3m图层接口
      type: Array,
    },
    collapsed: {
      //是否折叠
      type: Boolean,
    },
  },
  data() {
    return {
      sharedState: store.state,
    };
  },
  computed: {
    isInitViewer: function () {
      return this.sharedState.isInitViewer;
    },
  },
  methods: {
    init() {
      //初始化viewer
      if (window.viewer) {
        return;
      }
      let viewer;
      let isPCBroswer = Cesium.FeatureDetection.isPCBroswer();
      if (isPCBroswer) {
        viewer = new Cesium.Viewer("cesiumContainer", {
          selectionIndicator: false,
          timeline: true,
          baseLayerPicker: false,
          //shadows: true,
          infoBox: false,
          geocoder: true,
          // skyBox: false, // 关闭天空盒会一同关闭太阳，场景会变暗
          navigation: false,
          contextOptions: {
            requestWebgl2: true,
          },
        });
        document.getElementsByClassName(
          "cesium-viewer-timelineContainer"
        )[0].style.visibility = "hidden"; //隐藏时间线控件
      } else {
        viewer = new Cesium.Viewer("cesiumContainer", {
          selectionIndicator: false,
          infoBox: false,
          skyBox: false,
          navigation: false,
          contextOptions: {
            requestWebgl2: true,
          },
        });
        let scene = viewer.scene;
        if (Cesium.defined(scene.sun)) {
          scene.globe.enableLighting = false;
          scene.sun.show = false;
        }
        if (Cesium.defined(scene.moon)) {
          scene.moon.show = false;
        }
        document.documentElement.style.height = window.innerHeight + "px";
        document.addEventListener(
          "touchmove",
          function (e) {
            e.preventDefault();
          },
          false
        );
        store.setCompass(false); //关闭罗盘等
      }

      viewer.scene.debugShowFramesPerSecond = true;
      window.viewer = viewer;
      window.scene = viewer.scene;
      let widget = viewer.cesiumWidget;
      // iEarth进行初始化设置
      viewer.scene.globe.depthTestAgainstTerrain = true;
      viewer.scene.globe.enableLighting = true;
      viewer.scene.globe.baseColor = Cesium.Color.BLACK; // 没有影像图层时地球的底色
      if (viewer.geocoder) {
        // 请开发者自行到supermap online官网（http://www.supermapol.com/）申请key
        viewer.geocoder.viewModel.geoKey = "fvV2osxwuZWlY0wJb8FEb2i5";
        document.querySelector(".cesium-geocoder-input").placeholder =
          "输入地址或地标...";
      }
      viewer.camera.flyTo({
        destination: new Cesium.Cartesian3(
          6788287.844465209,
          -41980756.10214644,
          29619220.04004376
        ),
        duration: 0,
        complete: function () {
          viewer.camera.flyTo({
            destination: new Cesium.Cartesian3.fromDegrees(
              110.60396458865515,
              34.54408834959379,
              30644793.325518917
            ),
            duration: 5,
            complete: function () {
              common.initHandler("Polygon"); //初始化全局常用的画面的drawhandler
              store.setToolBarShow(true); //显示工具栏
            },
          });
          setTimeout(() => {
            document.getElementById("loadingbar").remove(); //移除加载动画
          }, 1000);
        },
      });
      store.setisInitViewer(true); //初始化viewer标志
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang="scss"  scoped>
@import "smViewer";
</style>
