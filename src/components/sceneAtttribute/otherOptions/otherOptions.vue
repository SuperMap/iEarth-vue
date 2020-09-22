<template>
  <div class="sm-function-module-content" v-show="otherOptions">
    <div class="sm-function-module-sub-section">
      <label class="label-container">视图模式 :</label>
      <select class="sm-select" v-model="viewMode">
        <option value="3D">3D</option>
        <option value="2.5D">2.5D</option>
        <option value="2D">2D</option>
      </select>
    </div>
    <div class="sm-function-module-sub-section">
      <label class="label-container">分屏显示 :</label>
      <select class="sm-select" v-model="multiViewport">
        <option value="NONE">不使用分屏</option>
        <option value="HORIZONTAL">水平分屏</option>
        <option value="VERTICAL">垂直分屏</option>
        <option value="TRIPLE">三视口</option>
        <option value="QUAD">四视口</option>
      </select>
    </div>
    <div class="sm-function-module-sub-section">
      <label class="label-container">场景泛光</label>
      <br />
      <div class="flexbox">
        <label class="sm-viewshed-label-right">开启泛光:</label>
        <input type="checkbox" v-model="openSceneFlood" />
        <div style="width:45%"></div>
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">亮度阈值 :</label>
        <input class="sm-input-long" min="0" max="1" step="0.01" type="number" v-model="threshold" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">泛光强度:</label>
        <input
          class="sm-input-long"
          min="0"
          max="10"
          step="0.5"
          type="number"
          v-model="bloomIntensity"
        />
      </div>
    </div>
    <label class="label-container">卷帘效果</label>
    <div class="flexbox">
      <label class="sm-viewshed-label-right">使用卷帘:</label>
      <input type="checkbox" v-model="useRoller" />
      <label class="sm-viewshed-label-right">影像卷帘:</label>
      <input type="checkbox" v-model="imageryRoller" />
    </div>
    <div class="sm-function-module-sub-section flexbox">
      <label class="label-container" for="lrRoller">左右卷帘 :</label>
      <input type="radio" name="lrtbRoller" id="lrRoller" value="lrRoller" v-model="lrtbRoller" />
      <label class="label-container" for="tbRoller">上下卷帘 :</label>
      <input type="radio" name="lrtbRoller" id="tbRoller" value="tbRoller" v-model="lrtbRoller" />
    </div>
    <div class="sm-function-module-sub-section flexbox" v-show="lrtbRoller== 'lrRoller'">
      <label class="label-container" for="leftRoller">屏蔽左侧 :</label>
      <input type="radio" name="lrRoller" id="leftRoller" value="leftRoller" v-model="lrRoller" />
      <label class="label-container" for="rightRoller">屏蔽右侧 :</label>
      <input type="radio" name="lrRoller" id="rightRoller" value="rightRoller" v-model="lrRoller" />
    </div>
    <div class="sm-function-module-sub-section flexbox" v-show="lrtbRoller== 'tbRoller'">
      <label class="label-container" for="topRoller">屏蔽上侧 :</label>
      <input type="radio" name="tbRoller" id="topRoller" value="topRoller" v-model="tbRoller" />
      <label class="label-container" for="bomRoller">屏蔽下侧 :</label>
      <input type="radio" name="tbRoller" id="bomRoller" value="bomRoller" v-model="tbRoller" />
    </div>
  </div>
</template>

<script>
let rollerShutterConfig;
export default {
  name: "sceneOtherOptions",
  data() {
    return {
      sharedState: store.state,
      isDestroyFlag: true,
      viewMode: "3D",
      multiViewport: "NONE",
      openSceneFlood: false,
      threshold: 0.6,
      bloomIntensity: 2.0,
      useRoller: false,
      imageryRoller: false,
      lrtbRoller: "lrRoller",
      lrRoller: "leftRoller",
      tbRoller: "topRoller",
    };
  },

  computed: {
    otherOptions: function () {
      return this.sharedState.sceneAtttribute[4];
    },
    SceneAtttributeShow: function () {
      return this.sharedState.toolBar[3];
    },
  },
  beforeDestroy() {
    // if (this.isDestroyFlag && camera) {
    //   camera = undefined;
    //   if (flyCircleDrawHandler) {
    //     // flyCircleDrawHandler.destroy();
    //     flyCircleDrawHandler = undefined;
    //   }
    //   if (flyManager) {
    //     flyManager.destroy();
    //     flyManager = this.undefined;
    //   }
    // }
  },
  mounted() {
    if (this.SceneAtttributeShow && this.otherOptions) {
      this.init();
    }
  },
  methods: {
    //子组件部分

    init() {
      if (rollerShutterConfig) {
        return;
      }
      let windowWidth = document.body.clientWidth; // 窗口宽度
      let windowHeight = document.body.clientHeight; // 窗口高度
      // 卷帘配置参数，以对象方式实现地址传递
      rollerShutterConfig = {
        splitDirection: Cesium.SplitDirection.NONE,
        verticalSplitPosition: windowWidth / 2,
        horizontalSplitPosition: windowHeight / 2,
      };
      if (!document.getElementById("verticalSlider")) {
        let f = document.getElementById("cesiumContainer");
        let v = document.createElement("div");
        let h = document.createElement("div");
        v.classList.add("verticalSlider");
        v.id = "verticalSlider";
        h.id = "horizontalSlider";
        v.style.display = "none";
        h.style.display = "none";
        f.appendChild(v);
        f.appendChild(h);
      }
      this.setRollerShutterSplit();
      this.bindSliderEvt();
    },

    /**
     * 设置卷帘的分割方向及分割条的位置。
     *
     */
    setRollerShutterSplit() {
      let splitPosition = null;
      if (
        rollerShutterConfig.splitDirection === Cesium.SplitDirection.LEFT ||
        rollerShutterConfig.splitDirection === Cesium.SplitDirection.RIGHT
      ) {
        splitPosition = rollerShutterConfig.verticalSplitPosition;
        viewer.scene.imagerySplitPosition.x =
          rollerShutterConfig.verticalSplitPosition / document.body.clientWidth;
      } else if (
        rollerShutterConfig.splitDirection === Cesium.SplitDirection.TOP ||
        rollerShutterConfig.splitDirection === Cesium.SplitDirection.BOTTOM
      ) {
        splitPosition = rollerShutterConfig.horizontalSplitPosition;
        viewer.scene.imagerySplitPosition.y =
          rollerShutterConfig.horizontalSplitPosition /
          document.body.clientHeight;
      }
      for (let layer of scene.layers.layerQueue) {
        layer.splitDirection = rollerShutterConfig.splitDirection;
        if (splitPosition) {
          // 如果禁用卷帘就没有必要设置分割位置
          layer.splitPosition = splitPosition;
        }
      }
    },
    setImageryRollerMode: function () {
      let imageryLayers = viewer.imageryLayers;
      if (this.imageryRoller) {
        for (let i = 0; i < imageryLayers.length; i++) {
          let imageryLayer = imageryLayers.get(i);
          switch (rollerShutterConfig.splitDirection) {
            case Cesium.SplitDirection.LEFT:
              imageryLayer.splitDirection = new Cesium.Cartesian2(
                Cesium.ImagerySplitDirection.RIGHT,
                Cesium.ImagerySplitDirection.NONE
              );
              break;
            case Cesium.SplitDirection.RIGHT:
              imageryLayer.splitDirection = new Cesium.Cartesian2(
                Cesium.ImagerySplitDirection.LEFT,
                Cesium.ImagerySplitDirection.NONE
              );
              break;
            case Cesium.SplitDirection.TOP:
              imageryLayer.splitDirection = new Cesium.Cartesian2(
                Cesium.ImagerySplitDirection.NONE,
                Cesium.ImagerySplitDirection.BOTTOM
              );
              break;
            case Cesium.SplitDirection.BOTTOM:
              imageryLayer.splitDirection = new Cesium.Cartesian2(
                Cesium.ImagerySplitDirection.NONE,
                Cesium.ImagerySplitDirection.TOP
              );
              break;
            default:
              imageryLayer.splitDirection = new Cesium.Cartesian2(
                Cesium.ImagerySplitDirection.NONE,
                Cesium.ImagerySplitDirection.NONE
              );
              break;
          }
        }
      } else {
        for (let i = 0; i < imageryLayers.length; i++) {
          let imageryLayer = imageryLayers.get(i);
          imageryLayer.splitDirection = new Cesium.Cartesian2(
            Cesium.ImagerySplitDirection.NONE,
            Cesium.ImagerySplitDirection.NONE
          );
        }
      }
    },
    /**
     * 注册卷帘分割条的拖拽事件。
     */
    bindSliderEvt: function () {
      let verticalSlider = document.getElementById("verticalSlider");
      let horizontalSlider = document.getElementById("horizontalSlider");
      verticalSlider.addEventListener("mousedown", mouseDown, false);
      horizontalSlider.addEventListener("mousedown", mouseDown, false);
      let windowHeight = document.body.clientHeight;
      let me = this;
      document.addEventListener("mouseup", mouseUp, false);

      function mouseUp(e) {
        document.removeEventListener("mousemove", sliderMove, false);
      }

      function mouseDown(e) {
        document.addEventListener("mousemove", sliderMove, false);
      }

      function sliderMove(e) {
        // 鼠标拖拽时执行
        // 解决拖拽鼠标粘滞的问题
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false;
        }
        if (
          rollerShutterConfig.splitDirection === Cesium.SplitDirection.LEFT ||
          rollerShutterConfig.splitDirection === Cesium.SplitDirection.RIGHT
        ) {
          verticalSlider.style.left = e.clientX + "px";
          rollerShutterConfig.verticalSplitPosition = e.clientX;
        } else if (
          rollerShutterConfig.splitDirection === Cesium.SplitDirection.TOP ||
          rollerShutterConfig.splitDirection === Cesium.SplitDirection.BOTTOM
        ) {
          let clientY = e.clientY;
          if (clientY < 0) {
            clientY = 0;
          } else if (clientY > windowHeight) {
            clientY = windowHeight - document.body.clientHeight;
          }
          horizontalSlider.style.top = clientY + "px";
          rollerShutterConfig.horizontalSplitPosition = windowHeight - clientY;
        }
        me.setRollerShutterSplit();
      }
    },
    // 更新卷帘
    updataLrRoller() {
      switch (this.lrRoller) {
        case "leftRoller":
          rollerShutterConfig.splitDirection = Cesium.SplitDirection.LEFT;
          break;
        case "rightRoller":
          rollerShutterConfig.splitDirection = Cesium.SplitDirection.RIGHT;
          break;
        default:
          break;
      }
      this.setImageryRollerMode();
      this.setRollerShutterSplit();
    },
    updaeTbRoller() {
      switch (this.tbRoller) {
        case "topRoller":
          rollerShutterConfig.splitDirection = Cesium.SplitDirection.TOP;
          break;
        case "bomRoller":
          rollerShutterConfig.splitDirection = Cesium.SplitDirection.BOTTOM;
          break;
        default:
          break;
      }
      this.setImageryRollerMode();
      this.setRollerShutterSplit();
    },
  },

  watch: {
    otherOptions(val) {
      if (val) {
        this.init();
      }
    },
    viewMode(value) {
      if (value === "2D") {
        viewer.scene.mode = Cesium.SceneMode.SCENE2D;
      } else if (value === "3D") {
        viewer.scene.mode = Cesium.SceneMode.SCENE3D;
      } else if (value === "2.5D") {
        viewer.scene.mode = Cesium.SceneMode.COLUMBUS_VIEW;
      }
    },
    multiViewport(value) {
      scene.multiViewportMode = Cesium.MultiViewportMode[value];
    },
    openSceneFlood(val) {
      viewer.scene.bloomEffect.show = val;
      viewer.scene.hdrEnabled = val;
      viewer.scene.toneMappingEnabled = val;
      viewer.scene.bloomEffect.threshold = Number(this.threshold);
      viewer.scene.bloomEffect.bloomIntensity = Number(this.bloomIntensity);
    },
    threshold(val) {
      viewer.scene.bloomEffect.threshold = Number(val);
    },
    bloomIntensity(val) {
      viewer.scene.bloomEffect.bloomIntensity = Number(val);
    },
    useRoller(val) {
      let verticalSlider = document.getElementById("verticalSlider");
      let horizontalSlider = document.getElementById("horizontalSlider");
      if (val) {
        switch (this.lrtbRoller) {
          case "lrRoller":
            verticalSlider.style.display = "block";
            horizontalSlider.style.display = "none";
            this.updataLrRoller();
            break;
          case "tbRoller":
            verticalSlider.style.display = "none";
            horizontalSlider.style.display = "block";
            this.updaeTbRoller();
            break;
          default:
            break;
        }
      } else {
        rollerShutterConfig.splitDirection = Cesium.SplitDirection.NONE;
        verticalSlider.style.display = "none";
        horizontalSlider.style.display = "none";
        this.setImageryRollerMode();
        this.setRollerShutterSplit();
      }
    },
    imageryRoller(val) {
      this.setImageryRollerMode();
      this.setRollerShutterSplit();
    },
    lrtbRoller(val) {
      let verticalSlider = document.getElementById("verticalSlider");
      let horizontalSlider = document.getElementById("horizontalSlider");
      switch (val) {
        case "lrRoller":
          verticalSlider.style.display = "block";
          horizontalSlider.style.display = "none";
          this.updataLrRoller();
          break;
        case "tbRoller":
          verticalSlider.style.display = "none";
          horizontalSlider.style.display = "block";
          this.updaeTbRoller();
          break;
        default:
          break;
      }
    },
    lrRoller(val) {
      this.updataLrRoller();
    },
    tbRoller(val) {
      this.updaeTbRoller();
    },
  },
};
</script>

<style lang="scss"  scoped>
@import "otherOptions";
</style>