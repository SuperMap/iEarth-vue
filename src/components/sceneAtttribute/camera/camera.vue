<template>
  <div class="sm-function-module-content" v-show="cameraShow">
    <label class="label-container">飞行路线</label>
    <input class="sm-input" type="file" accept=".fpf" id="flyFile" style=" width: 100%;" />
    <div class="flybox">
      <img
        src="static/images/flypng/start.png"
        title="开始"
        class="imgbox"
        @click="flyStart"
      />
      <img
        src="static/images/flypng/pause.png"
        title="暂停"
        class="imgbox"
        @click="flyPause"
      />
      <img
        src="static/images/flypng/stop.png"
        title="停止"
        class="imgbox"
        @click="flyStop"
      />
    </div>
    <div class="sm-function-module-sub-section">
      <label class="label-container">站点选择 :</label>
      <select class="sm-select" id="stopList" v-model="stopSelected"></select>
    </div>
    <div class="sm-function-module-sub-section">
      <label class="label-container">观察</label>
      <div class="flexbox">
        <label class="sm-viewshed-label-right">暂停:</label>
        <input type="checkbox" v-model="stopFlyCircle" />
        <label class="sm-viewshed-label-right">循环:</label>
        <input type="checkbox" v-model="circulation" />
        <button @click="onSpinClk">绕点旋转</button>
        <button @click="onCancelSpinClk">停止旋转</button>
      </div>
      <label class="label-container">旋转速度 :</label>
      <div class="sm-solider-input-box">
        <input
          class="min-solider"
          min="0"
          max="50"
          step="0.1"
          style="width:63%"
          type="range"
          v-model="speed"
        />
        <input
          class="min-solider"
          min="0"
          max="50"
          step="0.1"
          style="width:34%"
          type="number"
          v-model="speed"
        />
      </div>
    </div>
    <div class="sm-function-module-sub-section">
      <label class="label-container">地下</label>
      <br />
      <label class="sm-viewshed-label-right">开启地下:</label>
      <input type="checkbox" v-model="underground" />
      <div class="sm-function-module-sub-section">
        <label class="label-container">最小缩放距离(米) :</label>
        <input class="sm-input-long" min="0" type="number" v-model="cameraMinimumZoomDistance" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">地表透明度:</label>
        <input
          class="sm-input-long"
          min="0"
          max="1.0"
          step="0.01"
          type="number"
          v-model="SurfaceTransparency"
        />
      </div>
    </div>
  </div>
</template>

<script>
let flyManager, camera, flyCircleDrawHandler;
// ,
// let pointLightSourceDrawHandler,
//   spotOrDirectionalLightSourceDrawHandler,
//   spotOrDirectionalLightSourceCountHandler,
//   spotOrDirectionalLightSourceAdding = false,
//   spotOrDirectionalLightPositions = [],
//   entityPointLightPairs = new Map(), // Entity和点光源对象的键值对
//   entitySpotLightPairs = new Map(), // Entity和聚光灯对象的键值对
//   entityDirectionalLightPairs = new Map(); // Entity和平行光对象的键值对
export default {
  name: "sceneCamera",
  data() {
    return {
      sharedState: store.state,
      stopSelected: null,
      stopFlyCircle: false,
      circulation: true,
      flyCirclePoint: null,
      speed: 1,
      underground: false,
      SurfaceTransparency: 1,
      cameraMinimumZoomDistance: -1000,
      isDestroyFlag: true,
    };
  },

  computed: {
    cameraShow: function () {
      return this.sharedState.sceneAtttribute[1];
    },
    SceneAtttributeShow: function () {
      return this.sharedState.toolBar[3];
    },
  },
  beforeDestroy() {
    if (this.isDestroyFlag && camera) {
      camera = undefined;
      if (flyCircleDrawHandler) {
        // flyCircleDrawHandler.destroy();
        flyCircleDrawHandler = undefined;
      }
      if (flyManager) {
        flyManager.destroy();
        flyManager = this.undefined;
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
      if (camera) {
        return;
      }
      camera = scene.camera;
      camera.flyCircleLoop = true;
    },
    flyStart() {
      if (flyManager) {
        flyManager.play();
      } else {
        let routes = new Cesium.RouteCollection(viewer.entities);
        let fileInput = document.getElementById("flyFile");
        let file = fileInput.files[0];
        if (!file) {
          return; // 没有选择fpf文件无法开始执行
        }
        let reader = new FileReader();
        reader.onload = function (e) {
          // 读取操作完成时出发
          let XMLContent = e.target.result;
          routes.fromXML(XMLContent);
        };
        reader.readAsBinaryString(file);
        //创建飞行管理对象
        flyManager = new Cesium.FlyManager({
          scene: scene,
          routes: routes,
        });
        flyManager.stopArrived.addEventListener(function (routeStop) {
          routeStop.waitTime = 1;
        });
        if (flyManager.readyPromise) {
          Cesium.when(flyManager.readyPromise, function () {
            let currentRoute = flyManager.currentRoute;
            currentRoute.isLineVisible = true;
            currentRoute.isStopVisible = true;

            let allStops = flyManager.getAllRouteStops();
            let menu = document.getElementById("stopList");
            for (let i = 0, j = allStops.length; i < j; i++) {
              let option = document.createElement("option");
              option.textContent = "站点 " + (i + 1);
              option.value = allStops[i].index;
              menu.appendChild(option);
            }

            flyManager.play();
          });
        }
      }
    },
    flyPause() {
      flyManager && flyManager.pause();
    },
    flyStop() {
      flyManager && flyManager.stop();
    },
    onSpinClk(evt) {
      this.isDestroyFlag = false;
      if (!flyCircleDrawHandler) {
        flyCircleDrawHandler = new Cesium.DrawHandler(
          viewer,
          Cesium.DrawMode.Point
        );
        flyCircleDrawHandler.activeEvt.addEventListener(function (isActive) {
          if (isActive == true) {
            viewer.enableCursorStyle = false;
            viewer._element.style.cursor = "";
            document.body.classList.add("drawCur");
          } else {
            viewer.enableCursorStyle = true;
            document.body.classList.remove("drawCur");
          }
        });
        flyCircleDrawHandler.drawEvt.addEventListener((result) => {
          this.flyCirclePoint = result.object.position;
          viewer.entities.removeById("fly-circle-point");
          viewer.entities.add({
            id: "fly-circle-point",
            position: this.flyCirclePoint,
            billboard: {
              image: "@/../static/images/flypng/flyCircle.png",
              scaleByDistance: new Cesium.NearFarScalar(10, 1.0, 1000, 0.1),
              disableDepthTestDistance: Number.POSITIVE_INFINITY, // 关闭深度检测，使billboard不至于被裁剪
            },
          });
          camera.stopFlyCircle(); // 先停止之前的旋转，再开始新的旋转
          camera.flyCircle(this.flyCirclePoint);
          flyCircleDrawHandler.clear();
        });
      }
      flyCircleDrawHandler.activate();
    },
    onCancelSpinClk() {
      this.isDestroyFlag = true;
      camera.stopFlyCircle();
      viewer.entities.removeById("fly-circle-point");
      this.flyCirclePoint = null;
    },
  },

  watch: {
    cameraShow: function (val) {
      if (val) {
        this.init();
      }
    },
    stopSelected(val) {
      //各个站点事件
      flyManager && flyManager.pause();
      let index = Number(val);
      let route = flyManager.currentRoute;
      let stop = route.get(index);
      flyManager.currentStopIndex = index;
      flyManager.viewToStop(stop);
    },
    stopFlyCircle(val) {
      if (val) {
        camera.stopFlyCircle();
      } else {
        if (this.flyCirclePoint) {
          camera.flyCircle(this.flyCirclePoint);
        }
      }
    },
    circulation(val) {
      camera.flyCircleLoop = val;
    },
    speed(val) {
      camera.speedRatio = Number(val);
    },
    underground(val) {
      viewer.scene.undergroundMode = val;
      if (val) {
        viewer.scene.screenSpaceCameraController.minimumZoomDistance = Number(
          this.cameraMinimumZoomDistance
        );
      } else {
        viewer.scene.screenSpaceCameraController.minimumZoomDistance = 1;
      }
    },
    cameraMinimumZoomDistance(val) {
      viewer.scene.screenSpaceCameraController.minimumZoomDistance = Number(
        val
      );
    },
    SurfaceTransparency(val) {
      viewer.scene.globe.globeAlpha = parseFloat(val);
    },
  },
};
</script>

<style lang="scss"  scoped>
@import "camera";
</style>