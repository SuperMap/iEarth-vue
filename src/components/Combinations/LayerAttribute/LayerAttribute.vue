<template>
  <div
    id="LayerAttribute"
    class="sm-panel"
    v-if="LayerAttributeShow"
    v-drag
    data-attr="drag"
  >
    <div class="sm-content">
      <div class="sm-panel-header">
        <span :class="{titleColor:basicOptions}" class="title-txt" @click="choose(0)">基本属性</span>
        <span :class="{titleColor:styleSetting}" class="title-txt" @click="choose(1)">风格设置</span>
        <span :class="{titleColor:LayerOperation}" class="title-txt" @click="choose(2)">图层操作</span>
        <span :class="{titleColor:Thematicmap}" class="title-txt" @click="choose(3)">专题图</span>
        <span class="closeBtn" @click="toggleVisibility">&times;</span>
      </div>

      <!-- 调用子组件 -->
      <div v-show="basicOptions">
        <div class="sm-function-module-content">
          <div class="sm-function-module-sub-section">
            <label class="label-container">图层名称 :</label>
            <input class="sm-input-long" disabled type="text" v-model="layerName" />
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">阴影模式 :</label>
            <select class="sm-select" v-model="shadowType">
              <option value="noShadow">无阴影</option>
              <option value="chooseShadow">显示选中对象阴影</option>
              <option value="allShadow">显示所有对象阴影</option>
            </select>
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">阴影明暗度 ：</label>
            <div class="sm-solider-input-box">
              <input
                class="min-solider"
                type="range"
                v-model="shadowDarkness"
                min="0.1"
                max="0.9"
                step="0.1"
              />
            </div>
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">可见性 :</label>
            <select class="sm-select" v-model="visibility">
              <option value="onlyShowSlection">仅选中对象可见</option>
              <option value="onlyHideSlection">仅选中对象隐藏</option>
              <option value="showAll">显示全部</option>
            </select>
          </div>

          <div class="flexbox">
            <label class="sm-viewshed-label-right">可显示:</label>
            <input style="margin-left: 10px" type="checkbox" v-model="display" />
            <label style="width:21%"></label>
            <label class="sm-viewshed-label-right">双面渲染:</label>
            <input style="margin-left: 10px" type="checkbox" v-model="cullEnabled" />
          </div>
          <div class="flexbox">
            <label class="sm-viewshed-label-right">多选择:</label>
            <input style="margin-left: 10px" type="checkbox" v-model="multiChoose" />
            <label style="width:21%"></label>
            <label class="sm-viewshed-label-right">释放颜色内存:</label>
            <input style="margin-left: 10px" type="checkbox" v-model="breleaseColor" />
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">最小可见高度(米) :</label>
            <input class="sm-input-long" min="0" type="number" v-model="minVisibleH" />
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">最大可见高度(米) :</label>
            <input class="sm-input-long" min="0" type="number" v-model="maxVisibleH" />
          </div>
        </div>
      </div>

      <div v-show="styleSetting">
        <div class="sm-function-module-content">
          <div class="sm-function-module-sub-section">
            <label class="label-container">前景色 :</label>
            <ColorPicker class="sm-colorpicker" editable v-model="foreColor" />
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">线颜色 :</label>
            <ColorPicker class="sm-colorpicker" editable v-model="lineColor" />
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">底部高程(米) :</label>
            <input class="sm-input-long" min="0" type="number" v-model="bottomAltitude" />
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">LOD ：</label>
            <div class="sm-solider-input-box">
              <input
                class="min-solider"
                type="range"
                v-model="LODScale"
                min="0.1"
                max="10"
                step="0.5"
              />
            </div>
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">填充风格 :</label>
            <select class="sm-select" v-model="fillStyle">
              <option value="fill">填充模式</option>
              <option value="wireframe">线框模式</option>
              <option value="fill-and-wireframe">填充和线框模式</option>
            </select>
          </div>

          <div class="sm-function-module-sub-section">
            <label class="label-container">线框模式 :</label>
            <select class="sm-select" v-model="lineMode">
              <option value="triangle">三角面线框</option>
              <option value="quad">四边形线框</option>
              <option value="sketch">草图模式</option>
            </select>
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">模型透明度 :</label>
            <input
              class="sm-input-long"
              min="0"
              max="1.0"
              step="0.01"
              type="number"
              v-model="modelTransparency"
            />
          </div>
          <div class="sm-function-module-sub-section">
            <div class="sm-point"></div>
            <label class="label-container">选中效果</label>
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">选中颜色模式 :</label>
            <select class="sm-select" v-model="selectColorType">
              <option value="0">混合</option>
              <option value="1">替换</option>
            </select>
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">选中颜色 :</label>
            <ColorPicker class="sm-colorpicker" editable v-model="selectColor" />
          </div>
        </div>
      </div>

      <div v-show="LayerOperation" class="LayerOperation">
        <div class="sm-function-module-content">
          <div class="sm-point"></div>
          <label class="sm-function-module-sub-section-setting">倾斜摄影开挖</label>
          <div class="boxchild">
            <button class="tbtn tbn1" type="button" @click="excavationRegion">执行</button>
            <button class="tbtn" type="button" @click="delExcavationRegion">清除</button>
          </div>
          <div class="sm-point"></div>
          <label class="sm-function-module-sub-section-setting">倾斜摄影压平</label>
          <div class="boxchild">
            <button class="tbtn tbn1" type="button" @click="flattenRegion">执行</button>
            <button class="tbtn" type="button" @click="delFlattenRegion">清除</button>
          </div>
          <div class="sm-point"></div>
          <label class="sm-function-module-sub-section-setting">淹没分析</label>
          <div class="sm-function-module-sub-section">
            <label class="label-container">最大高度(米) :</label>
            <input class="sm-input-long" min="0" type="number" v-model="MaxHeight" />
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">最小(米) :</label>
            <input class="sm-input-long" min="0" type="number" v-model="MinHeight" />
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">淹没速度(米/秒) :</label>
            <input class="sm-input-long" min="0" type="number" v-model="FloodSpeed" />
          </div>
          <div class="boxchild">
            <button class="tbtn tbn1" type="button" @click="modelFlood">执行</button>
            <button class="tbtn" type="button" @click="ModelFloodClear">清除</button>
          </div>
          <div class="sm-point"></div>
          <label class="sm-function-module-sub-section-setting">选中偏移</label>
          <br />
          <label class="label-container">开启选中偏移:</label>
          <input style="margin-left: 10px" type="checkbox" v-model="offset" />
          <div class="sm-function-module-sub-section">
            <label class="label-container">沿X轴偏移 :</label>
            <input
              class="sm-input-long"
              min="-50"
              max="50"
              step="1"
              type="number"
              v-model="offsetX"
            />
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">沿Y轴偏移 :</label>
            <input
              class="sm-input-long"
              min="-50"
              max="50"
              step="1"
              type="number"
              v-model="offsetY"
            />
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">沿Z轴偏移 :</label>
            <input
              class="sm-input-long"
              min="-50"
              max="50"
              step="1"
              type="number"
              v-model="offsetZ"
            />
          </div>
          <div class="sm-point"></div>
          <label class="sm-function-module-sub-section-setting">图层颜色</label>
          <div class="sm-function-module-sub-section">
            <label class="label-container">亮度 :</label>
            <input
              class="sm-input-long"
              min="0"
              max="3"
              step="0.1"
              type="number"
              v-model="brightness"
            />
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">对比度 :</label>
            <input
              class="sm-input-long"
              min="0"
              max="5"
              step="0.1"
              type="number"
              v-model="contrast"
            />
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">色调 :</label>
            <input class="sm-input-long" min="0" max="5" step="0.1" type="number" v-model="hue" />
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">饱和度 :</label>
            <input
              class="sm-input-long"
              min="0"
              max="50"
              step="1"
              type="number"
              v-model="saturation"
            />
          </div>
          <div class="sm-point"></div>
          <label class="sm-function-module-sub-section-setting">多边形偏移</label>
          <div class="sm-function-module-sub-section">
            <label class="label-container">偏移因子 :</label>
            <input
              class="sm-input-long"
              min="-100"
              max="100"
              step="1"
              type="number"
              v-model="PolygonOffsetFactor"
            />
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">偏移单位 :</label>
            <input
              class="sm-input-long"
              min="-100"
              max="100"
              step="1"
              type="number"
              v-model="PolygonOffsetUnit"
            />
          </div>
        </div>
      </div>

      <div v-show="Thematicmap" id="Thematicmap">
        <div class="sm-function-module-content">
          <label class="sm-function-module-sub-section-setting">符号库</label>
          <div class="symbolicLibrary">
            <div class="Thematicbox">
              <div id="color" class="minbox polygon-symbol-font-selected" @click="thematicType(0)">
                <span class="iconfont iconchunse"></span></div>颜色
            </div>
            <div class="Thematicbox">
              <div class="minbox" id="img" @click="thematicType(1)">
                <span class="iconfont icontiaowen"></span></div>图片
            </div>
          </div>
          <div class="sm-function-module-sub-section" v-show="thematicMapType=='color'">
            <label class="label-container">颜色 :</label>
            <ColorPicker class="sm-colorpicker" editable v-model="ThematicColor" />
          </div>
          <div class="sm-function-module-sub-section" v-show="thematicMapType=='img'">
            <label class="label-container">本地图片 :</label>
            <input class="sm-input" type="file" accept=".jpg, .png" id="file" />
          </div>
          <div class="boxchild">
            <button class="tbtn tbn1" type="button" @click="setThematicmap">设置</button>
            <button class="tbtn" type="button" @click="delAllThematicmap">清除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let offsetScreenSpaceEventHandler,hyp,timer,colorTable;
export default {
  name: "LayerAttribute",
  data() {
    return {
      sharedState: store.state,
      //base
      shadowType: "noShadow",
      shadowDarkness: 0.3,
      visibility: "showAll",
      display: true, //可显示
      multiChoose: false, //多选择
      cullEnabled: false,
      breleaseColor: true,
      minVisibleH: 0.0,
      maxVisibleH: this.maxVisibleHeight,
      //2
      foreColor: "#ffffff",
      lineColor: "#ffffff",
      bottomAltitude: 0,
      LODScale: 5,
      fillStyle: "fill",
      lineMode: "triangle",
      modelTransparency: 1.0,
      selectColorType: 0,
      selectColor: "#A40FF4",

      //3
      // tooltip: null,
      // handlerPolygon: null,
      MaxHeight: 71,
      MinHeight: 1,
      FloodSpeed: 1,
      // hyp: null,
      // timer: null,
      // colorTable: null,
      offset: false,
      offsetX: 0,
      offsetY: 0,
      offsetZ: 0,
      brightness: 1,
      contrast: 1,
      hue: 0,
      saturation: 1,
      PolygonOffsetFactor: 0,
      PolygonOffsetUnit: 0,
      // offsetScreenSpaceEventHandler: null,

      //
      ThematicColor: "#D38E14",
      thematicMapType: "color",
    };
  },

  computed: {
    isInitViewer: function () {
      return this.sharedState.isInitViewer;
    },
    basicOptions: function () {
      return this.sharedState.LayerAttribute[0];
    },
    styleSetting: function () {
      return this.sharedState.LayerAttribute[1];
    },
    LayerOperation: function () {
      return this.sharedState.LayerAttribute[2];
    },
    Thematicmap: function () {
      return this.sharedState.LayerAttribute[3];
    },
    LayerAttributeShow: function () {
      return this.sharedState.LayerAttributeToolbar;
    },
    //base
    selectedLayer: function () {
      let name = this.sharedState.selectedLayerName;
      let layer = viewer.scene.layers.find(name);
      return layer;
    },
    layerName: function () {
      return this.sharedState.selectedLayerName;
    },
    maxVisibleHeight:function(){
      return Number.MAX_VALUE;
    }
  },

  methods: {
    toggleVisibility() {
      //控制组件界面隐
      store.setLayerAttributeToolbal(false);
    },
    choose(i) {
      // 验证是否为点击事件，是则继续执行click事件，否则不执行
      let isClick = document
        .getElementById("LayerAttribute")
        .getAttribute("data-flag");
      if (isClick !== "true") {
        return false;
      }
      switch (i) {
        case 0:
          store.setLayerAttribute([1, 0, 0, 0]);
          break;
        case 1:
          store.setLayerAttribute([0, 1, 0, 0]);
          break;
        case 2:
          store.setLayerAttribute([0, 0, 1, 0]);
          break;
        case 3:
          store.setLayerAttribute([0, 0, 0, 1]);
          break;
        default:
          store.setLayerAttribute([1, 0, 0, 0]);
      }
    },
    //子组件部分
    //倾斜挖掘
    excavationRegion() {
      if (!window.handlerPolygon) {
        common.initHandler("Polygon");
      }
      common.handlerDrawing("Polygon").then(
        (res) => {
          let handlerPolygon = window.handlerPolygon;
          this.selectedLayer.addExcavationRegion({
            position: res.positions,
            name: "excavation_" + Math.random(),
          });
          window.handlerPolygon.polygon.show = false;
          window.handlerPolygon.deactivate();
        },
        (err) => {
          console.log(err);
        }
      );
      window.handlerPolygon.activate();
    },
    delExcavationRegion() {
      this.selectedLayer.removeAllExcavationRegion();
      common.clearHandlerDrawing("Polygon");
    },
    flattenRegion() {
      if (!window.handlerPolygon) {
        common.initHandler("Polygon");
      }
      common.handlerDrawing("Polygon").then(
        (res) => {
          let handlerPolygon = this.handlerPolygon;
          this.selectedLayer.addFlattenRegion({
            position: res.positions,
            name: "flatten" + Math.random(),
          });
          window.handlerPolygon.polygon.show = false;
          window.handlerPolygon.deactivate();
        },
        (err) => {
          console.log(err);
        }
      );
      window.handlerPolygon.activate();
    },
    delFlattenRegion() {
      this.selectedLayer.removeAllFlattenRegion();
      common.clearHandlerDrawing("Polygon");
    },
    //淹没模型
    modelFlood() {
      if (hyp) return;
      this.initFlood().then((res) => {
        this.startAnalysis(res);
      });
    },
    initFlood() {
      return new Promise((resolve) => {
        hyp = new Cesium.HypsometricSetting();
        colorTable = new Cesium.ColorTable();
        colorTable.insert(71, new Cesium.Color(0, 39 / 255, 148 / 255));
        colorTable.insert(
          0,
          new Cesium.Color(149 / 255, 232 / 255, 249 / 255)
        );
        hyp.ColorTable = colorTable;
        hyp.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.FACE;
        hyp.Opacity = 0.7;
        hyp.LineInterval = 10.0;
        let hasInitialized = true;
        resolve(hasInitialized);
      });
    },

    startAnalysis(res) {
      if (!res) {
        this.initFlood();
      }
      let currentHeight = 0;
      currentHeight = parseInt(this.MinHeight);
      timer = window.requestAnimationFrame(() => {
        this.floodTimer(currentHeight);
      });
    },
    floodTimer(currentHeight) {
      // let timer = this.timer;
      let maxHeight = parseInt(this.MaxHeight);
      if (currentHeight >= maxHeight) {
        window.cancelAnimationFrame(timer);
        timer = null;
        return;
      }
      // let hyp = this.hyp;
      if (!hyp) {
        return;
      }
      let minHeight = parseInt(this.MinHeight);
      let speed = parseInt(this.FloodSpeed);
      hyp.MaxVisibleValue = currentHeight;
      hyp.MinVisibleValue = minHeight;
      this.selectedLayer.hypsometricSetting = {
        hypsometricSetting: hyp,
        analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL,
      };
      currentHeight += speed / 20;
      timer = window.requestAnimationFrame(() => {
        this.floodTimer(currentHeight);
      });
    },
    ModelFloodClear() {
      window.cancelAnimationFrame(timer);
      if (!hyp) {
        return;
      }
      hyp.MaxVisibleValue = 0;
      this.selectedLayer.hypsometricSetting = {
        hypsometricSetting: hyp,
        analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL,
      };
      colorTable.clear();
      colorTable.destroy()
      colorTable = undefined;
      hyp.destroy();
      hyp = null;
    },

    //4
    thematicType(i) {
      if (i == 0) {
        document
          .getElementById("img")
          .classList.remove("polygon-symbol-font-selected");
        document
          .getElementById("color")
          .classList.add("polygon-symbol-font-selected");
        this.thematicMapType = "color";
      } else {
        document
          .getElementById("img")
          .classList.add("polygon-symbol-font-selected");
        document
          .getElementById("color")
          .classList.remove("polygon-symbol-font-selected");
        this.thematicMapType = "img";
      }
    },
    setThematicmap() {
      switch (this.thematicMapType) {
        case "color":
          let size = viewer.scene.layers._layerQueue.length;
          for (let i = 0; i < size; i++) {
            let curlayer = viewer.scene.layers.findByIndex(i);
            // if (curlayer.themeStyle) {
              curlayer.themeStyle = this.colorByID();
              curlayer.refresh();
            // }
          }
          break;
        case "img":
          let size2 = viewer.scene.layers._layerQueue.length;
          for (let i = 0; i < size2; i++) {
            let curlayer =  viewer.scene.layers.findByIndex(i);
            // if (curlayer.themeStyle) {
              curlayer.themeStyle = this.imageByID();
              curlayer.refresh();
            // }
          }
          break;
      }
    },
    colorByID() {
      let cesiumStyle = new Cesium.Cesium3DTileStyle({
        color: {
          conditions: this.GetcolorConditions(),
        },
      });
      return cesiumStyle;
    },
    imageByID() {
      let cesiumStyle = new Cesium.Cesium3DTileStyle({
        image: {
          conditions: this.GetimageConditions(),
        },
      });
      return cesiumStyle;
    },
    GetcolorConditions() {
      let colorConditions = [];
      let colorValue1 = "rgb(45, 0, 75, 0.5)";
      let colorValue2 = "rgb(102, 71, 151)";
      let colorValue3 = "rgb(170, 162, 204)";
      let colorValue4 = "rgb(224, 226, 238)";
      let colorValue5 = "rgb(252, 230, 200)";
      let colorValue6 = "rgb(127, 59, 8)";
      let colorValues = [
        colorValue1,
        colorValue2,
        colorValue3,
        colorValue4,
        colorValue5,
      ];
      for (let i = 1; i < 6; i++) {
        let condition = [];
        let idKey = "${id} === '" + i + "'";
        let colorKey = colorValues[i % 5];
        condition.push(idKey);
        condition.push(colorKey);
        colorConditions.push(condition);
      }
       colorConditions.push(["true", colorValue6]);
      return colorConditions;
    },

    GetimageConditions() {
      let imageConditions = [];
      let imageUrl1 = '"static/images/cesiumStyleImages/1.jpg"';
      let imageUrl2 = '"static/images/cesiumStyleImages/2.jpg"';
      let imageUrl3 = '"static/images/cesiumStyleImages/3.jpg"';
      let imageUrl4 = '"static/images/cesiumStyleImages/4.jpg"';
      let imageUrl5 = '"static/images/cesiumStyleImages/5.jpg"';
      let imageUrls = [imageUrl1, imageUrl2, imageUrl3, imageUrl4, imageUrl5];
      for (let i = 1; i < 6; i++) {
        let condition = [];
        let idKey = "${id} === '" + i + "'";
        let imageKey = imageUrls[i % 5];
        condition.push(idKey);
        condition.push(imageKey);
        imageConditions.push(condition);
      }
      return imageConditions;
    },
    delAllThematicmap() {
      let size = scene.layers._layerQueue.length;
      for (let i = 0; i < size; i++) {
        let curlayer = scene.layers.findByIndex(i);
        if (curlayer.themeStyle) {
          curlayer.themeStyle = [];
          curlayer.refresh();
        }
      }
    },
  },

  watch: {
    // isInitViewer: function (val) {
    //   if (val) {
    //     if (!this.handlerPolygon) {
    //       // common.initHandler(this);
    //     }
    //   }
    // },

    shadowType: function (val) {
      let selectedLayer = this.selectedLayer;
      switch (val) {
        case "noShadow":
          selectedLayer.shadowType = 0;
          break;
        case "chooseShadow":
          selectedLayer.shadowType = 1;
          selectedLayer.refresh();
          break;
        case "allShadow":
          selectedLayer.shadowType = 2;
          selectedLayer.refresh();
          break;
        default:
          null;
          break;
      }
    },
    shadowDarkness: function (val) {
      viewer.shadowMap.darkness = Number(val);
    },
    visibility: function (val) {
      let selectedLayer = this.selectedLayer;
      switch (val) {
        case "showAll":
          selectedLayer.setObjsVisible([], false);
          break;
        case "onlyHideSlection":
          let chooseIDs = selectedLayer.getSelection();
          selectedLayer.setObjsVisible(chooseIDs, false);
          break;
        case "onlyShowSlection":
          let chooseIDs2 = selectedLayer.getSelection();
          selectedLayer.setObjsVisible(chooseIDs2, true);
          break;
        default:
          null;
          break;
      }
    },
    display: function (val) {
      this.selectedLayer.visible = val;
    },
    multiChoose: function (val) {
      this.selectedLayer.multiChoose = val;
    },
    cullEnabled: function (val) {
      this.selectedLayer.cullEnabled = val;
    },
    cullEnabled: function (val) {
      this.selectedLayer.cullEnabled = val;
    },
    minVisibleH: function (val) {
      if (val == "") {
        val = 0.0;
      }
      this.selectedLayer.visibleDistanceMin = Number(val);
    },
    maxVisibleH: function (val) {
      if (val == "") {
        val = this.maxNumber;
      }
      this.selectedLayer.visibleDistanceMax = Number(val);
    },

    //2

    foreColor: function (val) {
      this.selectedLayer.style3D.fillForeColor = Cesium.Color.fromCssColorString(
        val
      );
    },
    lineColor: function (val) {
      this.selectedLayer.style3D.lineColor = Cesium.Color.fromCssColorString(
        val
      );
    },
    bottomAltitude: function (val) {
      if(val === '' || val < 0){return}
      this.selectedLayer.style3D.bottomAltitude = parseInt(val);
      this.selectedLayer.refresh();
    },
    LODScale: function (val) {
      this.selectedLayer.lodRangeScale = parseFloat(val);
    },
    fillStyle: function (val) {
      switch (val) {
        case "fill":
          this.selectedLayer.style3D.fillStyle = Cesium.FillStyle.Fill;
          break;
        case "wireframe":
          this.selectedLayer.style3D.fillStyle = Cesium.FillStyle.WireFrame;
          break;
        case "fill-and-wireframe":
          this.selectedLayer.style3D.fillStyle =
            Cesium.FillStyle.Fill_And_WireFrame;
          break;
        default:
          break;
      }
      this.selectedLayer.refresh();
    },
    lineMode: function (val) {
      switch (val) {
        case "triangle":
          this.selectedLayer.wireFrameMode = Cesium.WireFrameType.Triangle;
          break;
        case "quad":
          this.selectedLayer.wireFrameMode = Cesium.WireFrameType.Quad;
          break;
        case "sketch":
          this.selectedLayer.wireFrameMode = Cesium.WireFrameType.Sketch;
          break;
        default:
          break;
      }
      this.selectedLayer.refresh();
    },
    modelTransparency: function (val) {
      this.selectedLayer.style3D.fillForeColor.alpha = parseFloat(val);
    },
    selectColorType: function (val) {
      this.selectedLayer.selectColorType = Number(val);
    },
    selectColor: function (val) {
      this.selectedLayer.selectedColor = Cesium.Color.fromCssColorString(val);
    },

    //3
    offset: function (val) {
      if (val) {
        let xOffset = Number(this.offsetX);
        let yOffset = Number(this.offsetY);
        let zOffset = Number(this.offsetZ);
        let selectedLayer = this.selectedLayer;
        selectedLayer.selectedTranslate = new Cesium.Cartesian3(
          xOffset,
          yOffset,
          zOffset
        );
        selectedLayer.selectColorType = 1.0; // 替换模式
        offsetScreenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(
          viewer.scene.canvas
        );
        offsetScreenSpaceEventHandler.setInputAction(() => {
          selectedLayer.removeAllObjsOffset(); // 移除所有图元的偏移
          if (selectedLayer.getSelection().length > 0) {
            let selectedId = Number(selectedLayer.getSelection()[0]);
            selectedLayer.setObjsOffset([selectedId]);
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      } else {
        let selectedLayer = this.selectedLayer;
        offsetScreenSpaceEventHandler.destroy();
        offsetScreenSpaceEventHandler = undefined;
        selectedLayer.selectedTranslate = new Cesium.Cartesian3(0, 0, 0);
        selectedLayer.removeAllObjsOffset();
        selectedLayer.selectColorType = 0.0; // 混合模式
        selectedLayer.releaseSelection(); // 释放选择集
      }
    },
    offsetX: function (val) {
      if (this.offset) {
        let xOffset = Number(val);
        let yOffset = Number(this.offsetY);
        let zOffset = Number(this.offsetZ);
        this.selectedLayer.selectedTranslate = new Cesium.Cartesian3(
          xOffset,
          yOffset,
          zOffset
        );
      }
    },
    offsetZ: function (val) {
      if (this.offset) {
        let xOffset = Number(this.offsetX);
        let yOffset = Number(this.offsetY);
        let zOffset = Number(val);
        this.selectedLayer.selectedTranslate = new Cesium.Cartesian3(
          xOffset,
          yOffset,
          zOffset
        );
      }
    },
    offsetY: function (val) {
      if (this.offset) {
        let xOffset = Number(this.offsetX);
        let yOffset = Number(val);
        let zOffset = Number(this.offsetZ);
        this.selectedLayer.selectedTranslate = new Cesium.Cartesian3(
          xOffset,
          yOffset,
          zOffset
        );
      }
    },
    brightness: function (val) {
      if (val === "") {
        return;
      }
      this.selectedLayer.brightness = Number(val);
    },
    contrast: function (val) {
      if (val === "") {
        return;
      }
      this.selectedLayer.contrast = Number(val);
    },
    hue: function (val) {
      if (val === "") {
        return;
      }
      this.selectedLayer.hue = Number(val);
    },
    saturation: function (val) {
      if (val === "") {
        return;
      }
      this.selectedLayer.saturation = Number(val);
    },
    LayerOperation: function (val) {
      if (val) {
        this.brightness = this.selectedLayer.brightness;
        this.contrast = this.selectedLayer.contrast;
        this.hue = this.selectedLayer.hue;
        this.saturation = this.selectedLayer.saturation;
      }
    },
    PolygonOffsetFactor: function (val) {
      if (val === "") {
        return;
      }
      let polygonOffsetFactor = Number(val);
      let polygonOffsetUnit = Number(this.PolygonOffsetUnit);
      this.selectedLayer.setPolygonoffset(
        polygonOffsetFactor,
        polygonOffsetUnit
      );
    },
    PolygonOffsetUnit: function (val) {
      if (val === "") {
        return;
      }
      let polygonOffsetFactor = Number(this.polygonOffsetFactor);
      let polygonOffsetUnit = Number(val);
      this.selectedLayer.setPolygonoffset(
        polygonOffsetFactor,
        polygonOffsetUnit
      );
    },
  },

   beforeDestroy() {
    if (this.isDestroyFlag && handlerBox) {
      if (editorBox) {
        editorBox.destroy();
      }
      editorBox = undefined;
      layers = undefined;
      handlerBox = undefined;
      tooltip = undefined;
      boxEntity = undefined;
    }
  },
};
</script>

<style lang="scss"  scoped>
@import "LayerAttribute";
</style>