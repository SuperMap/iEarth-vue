<template>
  <div class="sm-function-module-content" v-show="basicOptions">
    <div class="flexbox">
      <label class="sm-viewshed-label-right">地球:</label>
      <input type="checkbox" v-model="earthShow" />
      <label class="sm-viewshed-label-right">阴影:</label>
      <input type="checkbox" v-model="shadowMap" />
      <label class="sm-viewshed-label-right">太阳:</label>
      <input type="checkbox" v-model="sunShow" />
      <label class="sm-viewshed-label-right">时间轴:</label>
      <input type="checkbox" v-model="timeline" />
    </div>
    <div class="flexbox">
      <label class="sm-viewshed-label-right">深度检测:</label>
      <input type="checkbox" v-model="depthAgainst" />
      <label class="sm-viewshed-label-right">大气渲染:</label>
      <input type="checkbox" v-model="atomsphereRender" />
      <label class="sm-viewshed-label-right">雾化效果:</label>
      <input type="checkbox" v-model="fogEffect" />
    </div>
    <div class="sm-function-module-sub-section">
      <label class="label-container">亮度:</label>
      <div class="sm-solider-input-box">
        <input
          class="min-solider"
          min="0"
          max="3"
          step="0.02"
          style="width:63%"
          type="range"
          v-model="brightness"
        />
        <input
          class="min-solider"
          min="0"
          max="3"
          step="0.02"
          style="width:34%"
          type="number"
          v-model="brightness"
        />
      </div>
    </div>
    <div class="sm-function-module-sub-section">
      <label class="label-container">对比度:</label>
      <div class="sm-solider-input-box">
        <input
          class="min-solider"
          min="0"
          max="3"
          step="0.02"
          style="width:63%"
          type="range"
          v-model="contrast"
        />
        <input
          class="min-solider"
          min="0"
          max="3"
          step="0.02"
          style="width:34%"
          type="number"
          v-model="contrast"
        />
      </div>
    </div>
    <div class="sm-function-module-sub-section">
      <label class="label-container">色调 :</label>
      <div class="sm-solider-input-box">
        <input
          class="min-solider"
          min="0"
          max="3"
          step="0.02"
          style="width:63%"
          type="range"
          v-model="hue"
        />
        <input
          class="min-solider"
          min="0"
          max="3"
          step="0.02"
          style="width:34%"
          type="number"
          v-model="hue"
        />
      </div>
    </div>
    <div class="sm-function-module-sub-section">
      <label class="label-container">饱和度:</label>
      <div class="sm-solider-input-box">
        <input
          class="min-solider"
          min="0"
          max="3"
          step="0.02"
          style="width:63%"
          type="range"
          v-model="saturation"
        />
        <input
          class="min-solider"
          min="0"
          max="3"
          step="0.02"
          style="width:34%"
          type="number"
          v-model="saturation"
        />
      </div>
    </div>
    <div class="sm-function-module-sub-section">
      <label class="label-container">伽马:</label>
      <div class="sm-solider-input-box">
        <input
          class="min-solider"
          min="0"
          max="3"
          step="0.02"
          style="width:63%"
          type="range"
          v-model="gamma"
        />
        <input
          class="min-solider"
          min="0"
          max="3"
          step="0.02"
          style="width:34%"
          type="number"
          v-model="gamma"
        />
      </div>
    </div>
    <div class="sm-function-module-sub-section">
      <label class="label-container">坐标查询（经度，纬度，高程）:</label>
      <input
        class="middle-input"
        disabled
        type="text"
        style="width: 100%;background: #333333;color:white"
        v-model="queryCoordinates"
      />
    </div>
    <div class="boxchild">
      <button class="tbtn tbn1" type="button" @click="onQueryCoordinatesClk">查询</button>
      <button class="tbtn" type="button" @click="clear">清除</button>
    </div>
  </div>
</template>

<script>
let layers, imageryLayers, handler;
// , flyManager, camera, flyCircleDrawHandler
// let pointLightSourceDrawHandler,
//   spotOrDirectionalLightSourceDrawHandler,
//   spotOrDirectionalLightSourceCountHandler,
//   spotOrDirectionalLightSourceAdding = false,
//   spotOrDirectionalLightPositions = [],
//   entityPointLightPairs = new Map(), // Entity和点光源对象的键值对
//   entitySpotLightPairs = new Map(), // Entity和聚光灯对象的键值对
//   entityDirectionalLightPairs = new Map(); // Entity和平行光对象的键值对
export default {
  name: "sceneBasicOptions",
  data() {
    return {
      sharedState: store.state,
      //base
      earthShow: true,
      shadowMap: false,
      sunShow: true,
      timeline: false,
      depthAgainst: true,
      atomsphereRender: true,
      fogEffect: true,
      brightness: 1,
      contrast: 1,
      hue: 0,
      saturation: 1,
      gamma: 1,
      queryCoordinates: null,
      isDestroyFlag: true,
    };
  },

  computed: {
    basicOptions: function () {
      return this.sharedState.sceneAtttribute[0];
    },
    SceneAtttributeShow: function () {
      return this.sharedState.toolBar[3];
    },
  },
  beforeDestroy() {
    if (this.isDestroyFlag && layers) {
      imageryLayers = undefined;
      layers = undefined;
      if (handler) {
        handler.destroy();
        handler = undefined;
      }
    }
  },
  mounted() {
    if (this.SceneAtttributeShow && this.basicOptions) {
      this.init();
    }
  },
  methods: {
    //子组件部分
    init() {
      if (layers) {
        return;
      }
      layers = viewer.scene.layers.layerQueue;
      imageryLayers = viewer.imageryLayers;
      handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
      //   camera = scene.camera;
      //   camera.flyCircleLoop = true;
    },
    onQueryCoordinatesClk() {
      this.isDestroyFlag = false;
      handler.setInputAction(function (movement) {
        window.tooltip.showAt(movement.endPosition, "点击查询坐标值");
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      handler.setInputAction((e) => {
        let position = scene.pickPosition(e.position);
        let cartographic = Cesium.Cartographic.fromCartesian(position);
        let searchLongitude = Cesium.Math.toDegrees(
          cartographic.longitude
        ).toFixed(4);
        let searchLatitude = Cesium.Math.toDegrees(
          cartographic.latitude
        ).toFixed(4);
        let searchHeight = cartographic.height.toFixed(2);
        this.queryCoordinates =
          searchLongitude + ", " + searchLatitude + ", " + searchHeight;
        window.tooltip.setVisible(false);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    clear() {
      this.isDestroyFlag = true;
      handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      window.tooltip.setVisible(false);
      this.queryCoordinates = null;
    },
  },

  watch: {
    basicOptions: function (val) {
      if (val) {
        this.init();
      }
    },
    earthShow(val) {
      viewer.scene.globe.show = val;
    },
    shadowMap(val) {
      if (val) {
        for (let layer of layers) {
          layer.shadowType = 2;
          layer.refresh(); // 加这句是因为 不刷新阴影不会立即显示  属于底层问题，待修改
        }
      } else {
        for (let layer of layers) {
          layer.shadowType = 0;
          layer.refresh();
        }
      }
    },
    sunShow(val) {
      scene.globe.enableLighting = val;
    },
    timeline(val) {
      let timeline = document.getElementsByClassName(
        "cesium-viewer-timelineContainer"
      )[0];
      if (val) {
        timeline.style.visibility = "visible";
      } else {
        timeline.style.visibility = "hidden";
      }
    },
    depthAgainst(val) {
      scene.globe.depthTestAgainstTerrain = val;
    },
    atomsphereRender(val) {
      scene.skyAtmosphere.show = val;
    },
    fogEffect(val) {
      scene.fog.enabled = val;
    },
    brightness(val) {
      if (imageryLayers.length > 0) {
        let layer = imageryLayers.get(0);
        layer["brightness"] = Number(val);
      }
    },
    contrast(val) {
      if (imageryLayers.length > 0) {
        let layer = imageryLayers.get(0);
        layer["contrast"] = Number(val);
      }
    },
    hue(val) {
      if (imageryLayers.length > 0) {
        let layer = imageryLayers.get(0);
        layer["hue"] = Number(val);
      }
    },
    saturation(val) {
      if (imageryLayers.length > 0) {
        let layer = imageryLayers.get(0);
        layer["saturation"] = Number(val);
      }
    },
    gamma(val) {
      if (imageryLayers.length > 0) {
        let layer = imageryLayers.get(0);
        layer["gamma"] = Number(val);
      }
    },
  },
};
</script>

<style lang="scss"  scoped>
@import "basicOptions";
</style>