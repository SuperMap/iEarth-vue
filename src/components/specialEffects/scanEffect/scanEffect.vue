
<template>
  <div  class="sm-panel" v-drag v-if="scanEffectShow">
    <div class="sm-content">
      <div class="sm-panel-header">
        <span class="title-txt">泛光扫描线</span>
        <span class="closeBtn" @click="clear">&times;</span>
      </div>

      <div class="sm-function-module-content">
        <div class="flexbox">
          <label class="sm-viewshed-label-right">开启扫描:</label>
          <input type="checkbox" v-model="scanShow" />
          <button
            v-if="scanMode=='lineMode'"
            class="tbtn tbn1 directionBtn"
            @click="setScanCenter"
          >自定义扫描方向</button>
          <button
            v-if="scanMode=='ringMode'"
            class="tbtn tbn1 directionBtn"
            @click="setScanCenter"
          >自定义扫描中心</button>
        </div>
        <div class="sm-function-module-sub-section flexbox">
          <label class="sm-viewshed-label-right">扫描模式:</label>
          <div style="width:8%"></div>
          <label class="label-container" for="line-scan-mode">线状扫描 :</label>
          <input
            type="radio"
            name="scanMode"
            id="line-scan-mode"
            value="lineMode"
            v-model="scanMode"
          />
          <label class="label-container" for="ring-scan-mode">环状扫描 :</label>
          <input
            type="radio"
            name="scanMode"
            id="ring-scan-mode"
            value="ringMode"
            v-model="scanMode"
          />
        </div>
        <div class="sm-function-module-sub-section">
          <label class="label-container">扫描颜色 :</label>
          <ColorPicker class="sm-colorpicker" editable v-model="scanColor" />
        </div>

        <div class="sm-function-module-sub-section" v-if="scanMode=='lineMode'">
          <label class="label-container">扫描纹理 :</label>
          <select class="sm-select" v-model="lineScanTexture">
            <option value="none-texture">无</option>
            <option value="static/images/ParticleSystem/线状扫描纹理1.jpg">线状纹理1</option>
            <option value="static/images/ParticleSystem/线状扫描纹理2.jpg">线状纹理2</option>
          </select>
        </div>
        <div class="sm-function-module-sub-section" v-if="scanMode=='ringMode'">
          <label class="label-container">扫描纹理 :</label>
          <select class="sm-select" v-model="circleScanTexture">
            <option value="none-texture">无</option>
            <option value="static/images/ParticleSystem/环状扫描纹理1.jpg">圆形纹理1</option>
            <option value="static/images/ParticleSystem/环状扫描纹理2.jpg">圆形纹理2</option>
            <option value="static/images/ParticleSystem/ring-2.jpg">六边形纹理3</option>
          </select>
        </div>

        <div class="flexbox">
          <label class="sm-viewshed-label-right">开启泛光:</label>
          <input type="checkbox" v-model="bloomShow" />
          <label class="sm-viewshed-label-right">开启HDR:</label>
          <input type="checkbox" v-model="openHDR" />
        </div>
        <div class="sm-function-module-sub-section">
          <label class="label-container">亮度阈值 ：</label>
          <div class="sm-solider-input-box">
            <input
              style="width:63%"
              class="min-solider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              v-model="threshold"
            />
            <input
              style="width:34%; height:25px"
              class="min-solider"
              type="number"
              min="0"
              max="1"
              step="0.01"
              v-model="threshold"
            />
          </div>
        </div>
        <div class="sm-function-module-sub-section">
          <label class="label-container">泛光强度 ：</label>
          <div class="sm-solider-input-box">
            <input
              style="width:63%"
              class="min-solider"
              type="range"
              min="0"
              max="5"
              step="0.02"
              v-model="intensity"
            />
            <input
              style="width:34%; height:25px"
              class="min-solider"
              type="number"
              min="0"
              max="5"
              step="0.02"
              v-model="intensity"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let tooltipMsg = "";
let handler;
export default {
  name: "scanEffect",
  data() {
    return {
      sharedState: store.state,
      scanShow: false,
      scanMode: "lineMode",
      scanColor: "#0F7AF4",
      lineScanTexture: "none-texture",
      circleScanTexture: "none-texture",
      bloomShow: false,
      openHDR: false,
      threshold: 0.01,
      intensity: 0.5,
      handlerActive: false, // true表示正在进行扫描点选设置
    };
  },
  computed: {
    isInitViewer: function () {
      return this.sharedState.isInitViewer;
    },
    scanEffectShow: function () {
      return this.sharedState.specialEffects[1];
    },
  },
  methods: {
    init() {
      viewer.imageryLayers.addImageryProvider(
        new Cesium.SingleTileImageryProvider({
          url: "static/images/ParticleSystem/BlackMarble_2016.jpg",
        })
      );
      let scene = viewer.scene;
      scene.lightSource.ambientLightColor = new Cesium.Color(
        0.4,
        0.4,
        0.4,
        0.4
      ); //设置环境光
      let promise = scene.open(URL_CONFIG.SCENE_CHONGQING_TX);

      Cesium.when(promise, (layers) => {
        //显示提示信息
        let mouseClickCount = 0;
        let s3mLayer = layers[0]; //获取模型图层
        s3mLayer.style3D.emissionColor = new Cesium.Color(1, 1, 1, 1); //设置模型自发光
        viewer.scene.colorCorrection.show = true;
        viewer.scene.colorCorrection.saturation = 1;
        viewer.scene.colorCorrection.brightness = 0.6;
        viewer.scene.colorCorrection.contrast = 1;
        viewer.scene.colorCorrection.hue = 0;
        //设置相机位置，定位至模型
        scene.camera.setView({
          destination: new Cesium.Cartesian3(
            -1578215.006323633,
            5319974.660135051,
            3148880.1479047216
          ),
          orientation: {
            heading: 3.452606245673759,
            pitch: -0.39978283229794354,
            roll: 6.283185307175318,
          },
        });

        // 初始化颜色选择控件
        let initialScanColor = Cesium.Color.fromCssColorString(this.scanColor);
        viewer.scene.scanEffect.color = initialScanColor;
        viewer.scene.scanEffect.period = 3.0;

        handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        //鼠标左击事件
        handler.setInputAction((e) => {
          if (!this.handlerActive) {
            return;
          }
          mouseClickCount++;
          let position = e.position; // 获取鼠标屏幕坐标
          let centerPosition = scene.pickPosition(position);
          if (!centerPosition) {
            tooltipMsg = "<p>当前点不可设置</p><p>重新点选设置扫描中心</p>";
            return;
          }

          if (this.scanMode === "lineMode") {
            if (mouseClickCount == 1) {
              viewer.scene.scanEffect.centerPostion = centerPosition; // 设置扫描中心点
              tooltipMsg = "点选设置扫描方向";
            } else if (mouseClickCount == 2) {
              let dir = new Cesium.Cartesian3();
              Cesium.Cartesian3.subtract(
                centerPosition,
                viewer.scene.scanEffect.centerPostion,
                dir
              ); // 获取扫描方向向量
              viewer.scene.scanEffect.lineMoveDirection = dir;
              mouseClickCount = 0;
              this.handlerActive = false;
              tooltip.setVisible(false);
            }
          } else {
            viewer.scene.scanEffect.centerPostion = centerPosition;
            mouseClickCount = 0;
            this.handlerActive = false;
            tooltip.setVisible(false);
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        //鼠标移动事件
        handler.setInputAction((e) => {
          if (!this.handlerActive) {
            return;
          }
          tooltip.showAt(e.endPosition, tooltipMsg);
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      });
      //加载线数据
      let roadLine1 = Cesium.GeoJsonDataSource.load('static/data/effectJson/lineback_1.json');
      roadLine1
        .then(function (dataSource) {
          viewer.dataSources.add(dataSource);
          let lines_1 = dataSource.entities.values;
          for (let i = 0; i < lines_1.length; i++) {
            let line = lines_1[i];
            line.polyline.material = new Cesium.PolylineGlowMaterialProperty({
              //设置Glow材质
              glowPower: 0.005,
              color: Cesium.Color.ORANGERED.withAlpha(0.9),
            });
            line.polyline.width = 12;
          }
        })
        .otherwise(function (error) {
          window.alert(error);
        });

      let roadLine2 = Cesium.GeoJsonDataSource.load('static/data/effectJson/lineback2_1.json');
      roadLine2
        .then(function (dataSource) {
          viewer.dataSources.add(dataSource);
          let lines_2 = dataSource.entities.values;
          for (let i = 0; i < lines_2.length; i++) {
            let line = lines_2[i];
            line.polyline.material = new Cesium.PolylineGlowMaterialProperty({
              //设置Glow材质
              glowPower: 0.005,
              color: Cesium.Color.ORANGERED.withAlpha(0.9),
            });
            line.polyline.width = 12;
          }
        })
        .otherwise(function (error) {
          window.alert(error);
        });
      let roadLine3 = Cesium.GeoJsonDataSource.load('static/data/effectJson/lineback3_1.json');
      roadLine3
        .then(function (dataSource) {
          viewer.dataSources.add(dataSource);
          let lines_3 = dataSource.entities.values;
          for (let i = 0; i < lines_3.length; i++) {
            let line = lines_3[i];
            line.polyline.material = new Cesium.PolylineGlowMaterialProperty({
              //设置Glow材质
              glowPower: 0.005,
              color: Cesium.Color.ORANGERED.withAlpha(0.9),
            });
            line.polyline.width = 12;
          }
        })
        .otherwise(function (error) {
          window.alert(error);
        });
    },
    setScanCenter() {
      this.handlerActive = true;
      tooltip.setVisible(true);
      tooltipMsg = "点选设置扫描中心";
    },
    clear() {
      viewer.scene.scanEffect.show = false;
      viewer.dataSources.removeAll();
      tooltipMsg = "";
      viewer.scene.layers.remove("CQmodel");
      let ly = viewer.imageryLayers._layers[1];
      viewer.imageryLayers.remove(ly);
      viewer.scene.hdrEnabled = false;
      store.setSpecialEffects(1, 0);
      this.reset();
      handler && handler.destroy();
      handler = undefined;
      tooltip.setVisible(false);
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
  },

  watch: {
    scanEffectShow(val) {
      if (val) {
        this.init();
      }
    },
    scanShow(val) {
      viewer.scene.scanEffect.show = val;
      let startPosition = new Cesium.Cartesian3.fromDegrees(
        106.50296584992466,
        29.51555839072486,
        2.0
      );
      viewer.scene.scanEffect.centerPostion = startPosition;
    },
    scanColor(val) {
      let colorObj = Cesium.Color.fromCssColorString(val);
      viewer.scene.scanEffect.color = colorObj;
    },
    bloomShow: function (val) {
      viewer.scene.bloomEffect.show = val;
      viewer.scene.bloomEffect.threshold = Number(this.threshold);
      viewer.scene.bloomEffect.bloomIntensity = Number(this.intensity);
    },
    threshold(val) {
      viewer.scene.bloomEffect.threshold = Number(this.threshold);
    },
    intensity(val) {
      viewer.scene.bloomEffect.bloomIntensity = Number(this.intensity);
    },
    openHDR(val) {
      viewer.scene.hdrEnabled = val;
    },
    scanMode(val) {
      switch (val) {
        case "lineMode":
          viewer.scene.scanEffect.mode = Cesium.ScanEffectMode.LINE;
          if (this.lineScanTexture === "none-texture") {
            viewer.scene.scanEffect.textureUrl = "";
            return;
          }
          viewer.scene.scanEffect.textureUrl = this.lineScanTexture;
          break;
        case "ringMode":
          viewer.scene.scanEffect.mode = Cesium.ScanEffectMode.CIRCLE;
          if (this.circleScanTexture === "none-texture") {
            viewer.scene.scanEffect.textureUrl = "";
            return;
          }
          viewer.scene.scanEffect.textureUrl = this.circleScanTexture;
          break;
        default:
          break;
      }
    },
    lineScanTexture(val) {
      if (val === "none-texture") {
        viewer.scene.scanEffect.textureUrl = "";
        return;
      }
      viewer.scene.scanEffect.textureUrl = val;
    },
    circleScanTexture(val) {
      if (val === "none-texture") {
        viewer.scene.scanEffect.textureUrl = "";
        return;
      }
      viewer.scene.scanEffect.textureUrl = val;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "scanEffect";
</style>

