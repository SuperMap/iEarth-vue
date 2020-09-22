<template>
  <div class="sm-function-module-content" v-show="addpolyline">
    <label class="sm-function-module-sub-section-setting">符号库</label>
    <div class="symbolicLibrary">
      <div
        class="Thematicbox"
        :class="{lightSelected:polylineType===0}"
        @click="polylineSelectType(0)"
      >
        <div id="pointLight" class="minbox">
          <span class="iconfont iconshixian"></span>
        </div>实线
      </div>
      <div
        class="Thematicbox"
        :class="{lightSelected:polylineType===1}"
        @click="polylineSelectType(1)"
      >
        <div class="minbox" id="spotLight">
          <span class="iconfont iconxuxian"></span>
        </div>虚线
      </div>
      <div
        class="Thematicbox"
        :class="{lightSelected:polylineType===2}"
        @click="polylineSelectType(2)"
      >
        <div class="minbox" id="directionalLight">
          <span class="iconfont iconlunkuoxian"></span>
        </div>轮廓线
      </div>
      <div
        class="Thematicbox"
        :class="{lightSelected:polylineType===3}"
        @click="polylineSelectType(3)"
      >
        <div class="minbox" id="spotLight">
          <span class="iconfont iconjiantouxian"></span>
        </div>箭头线
      </div>
      <div
        class="Thematicbox"
        :class="{lightSelected:polylineType===4}"
        @click="polylineSelectType(4)"
      >
        <div class="minbox" id="directionalLight">
          <span class="iconfont iconguangyunxian"></span>
        </div>光晕线
      </div>
      <div
        class="Thematicbox"
        :class="{lightSelected:polylineType===5}"
        @click="polylineSelectType(5)"
      >
        <div class="minbox" id="spotLight">
          <span class="iconfont iconweijixian"></span>
        </div>尾迹线
      </div>
    </div>
    <!-- 实线 -->
    <div v-show="polylineType===0">
      <div class="sm-function-module-sub-section">
        <label class="label-container">线条颜色 :</label>
        <ColorPicker class="sm-colorpicker" editable v-model="fullLineColor" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">线宽像素:</label>
        <input class="sm-input-long" min="1" step="1.0" type="number" v-model="fullLineWidth" />
      </div>
    </div>
    <!-- 虚线 -->
    <div v-show="polylineType===1">
      <div class="sm-function-module-sub-section">
        <label class="label-container">线条颜色 :</label>
        <ColorPicker class="sm-colorpicker" editable v-model="dottedLineColor" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">线宽像素:</label>
        <input class="sm-input-long" min="1" step="1.0" type="number" v-model="dottedLineWidth" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">间隔颜色:</label>
        <ColorPicker class="sm-colorpicker" editable v-model="dottedLineGapColor" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">虚线分量长度:</label>
        <input
          class="sm-input-long"
          min="1"
          step="1.0"
          type="number"
          v-model="dottedLineDashLenght"
        />
      </div>
    </div>
    <!-- 轮廓线 -->
    <div v-show="polylineType===2">
      <div class="sm-function-module-sub-section">
        <label class="label-container">线条颜色 :</label>
        <ColorPicker class="sm-colorpicker" editable v-model="oLineColor" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">线宽像素:</label>
        <input class="sm-input-long" min="1" step="1.0" type="number" v-model="oLineWidth" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">轮廓颜色 :</label>
        <ColorPicker class="sm-colorpicker" editable v-model="outLineColor" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">轮廓宽度:</label>
        <input class="sm-input-long" min="1" step="1.0" type="number" v-model="outLineWidth" />
      </div>
    </div>
    <!-- 箭头线 -->
    <div v-show="polylineType===3">
      <div class="sm-function-module-sub-section">
        <label class="label-container">线条颜色 :</label>
        <ColorPicker class="sm-colorpicker" editable v-model="arrowLineColor" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">线宽像素:</label>
        <input class="sm-input-long" min="1" step="1.0" type="number" v-model="arrowLineWidth" />
      </div>
    </div>
    <!-- 光晕线 -->
    <div v-show="polylineType===4">
      <div class="sm-function-module-sub-section">
        <label class="label-container">线条颜色 :</label>
        <ColorPicker class="sm-colorpicker" editable v-model="glowLineColor" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">线宽像素:</label>
        <input class="sm-input-long" min="1" step="1.0" type="number" v-model="glowLineWidth" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">光晕强度:</label>
        <input
          class="sm-input-long"
          min="0.05"
          max="1"
          step="0.05"
          type="number"
          v-model="glowLineStrength"
        />
      </div>
    </div>
    <!-- 尾迹线 -->
    <div v-show="polylineType===5">
      <div class="sm-function-module-sub-section">
        <label class="label-container">线条颜色 :</label>
        <ColorPicker class="sm-colorpicker" editable v-model="TrailLineColor" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">线宽像素:</label>
        <input class="sm-input-long" min="1" step="1" type="number" v-model="TrailLineWidth" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">尾迹线占比:</label>
        <input
          class="sm-input-long"
          min="0.1"
          max="1"
          step="0.1"
          type="number"
          v-model="TrailLinePercentage"
        />
      </div>
    </div>
    <div class="flexbox">
      <label class="sm-viewshed-label-right">编辑:</label>
      <input type="checkbox" v-model="isEdit" />
      <label class="sm-viewshed-label-right">编辑Z轴:</label>
      <input type="checkbox" v-model="isEditZ" />
    </div>
    <div class="boxchild">
      <button class="tbtn tbn1" type="button" @click="drawPolyline">绘制</button>
      <button class="tbtn" type="button" @click="clearPolyline">清除</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "addPolyline",
  data() {
    return {
      sharedState: store.state,
      polylineType: 0,
      isDestroyFlag: true,
      fullLineColor: "#C8910A",
      fullLineWidth: 5,
      dottedLineColor: "#C8910A",
      dottedLineWidth: 5,
      dottedLineGapColor: "#0AC848",
      dottedLineDashLenght: 16,
      oLineColor: "#C8910A",
      oLineWidth: 5,
      outLineColor: "#1754E3",
      outLineWidth: 2,
      arrowLineColor: "#C8910A",
      arrowLineWidth: 5,
      glowLineColor: "#C8910A",
      glowLineWidth: 5,
      glowLineStrength: 0.5,
      TrailLineColor: "#C8910A",
      TrailLineWidth: 5,
      TrailLinePercentage: 0.3,
      TrailLinePeriod: 2,
      isEdit: false,
      isEditZ: false,
      EditPositions: [],
    };
  },

  computed: {
    addpolyline: function () {
      return this.sharedState.onlineEdit[1];
    },
    onlineEditShow: function () {
      return this.sharedState.toolBar[8];
    },
    getIsEdit: function () {
      return this.sharedState.isEdit;
    },
    getIsEditZ: function () {
      return this.sharedState.isEditZ;
    },
  },
  //   beforeDestroy() {
  //   },
  mounted() {
    if (this.onlineEditShow && this.addpolyline) {
      this.init();
    }
  },
  methods: {
    init() {
      if (!window.handlerPolyline) {
        common.initHandler("Polyline");
      }
    },
    polylineSelectType(i) {
      this.polylineType = i;
    },
    drawPolyline() {
      this.isDestroyFlag = false;
      if (!window.handlerPolyline) {
        this.init();
      }
      common.handlerDrawing("Polyline", 2).then(
        (res) => {
          this.positions = res.positions;
          let handlerPolyline = window.handlerPolyline;
          this.DrawPolylineUpdate(res.positions);
          handlerPolyline.polyline.show = false;
          window.polylineTransparent.show = false; //半透线隐藏
          handlerPolyline.deactivate();
          if (this.isEdit) {
            common.Edit(this);
          }
        },
        (err) => {
          console.log(err);
        }
      );
      window.handlerPolyline.activate();
    },

    clearPolyline() {
      this.isDestroyFlag = true;
      let entities = viewer.entities.values;
      for (let i = 0, j = entities.length; i < j; i++) {
        if (entities[i].polyline) {
          entities[i].polyline.show = false;
        }
      }
      common.clearHandlerDrawing("Polyline");
    },
    DrawPolylineUpdate(position) {
      switch (this.polylineType) {
        case 0:
          let fullLineColor = Cesium.Color.fromCssColorString(
            this.fullLineColor
          );
          let fullLineWidth = Number(this.fullLineWidth);
          viewer.entities.add({
            id: "polyline-symbol-full-" + new Date().getTime(),
            polyline: {
              positions: Cesium.Cartesian3.fromDegreesArrayHeights(position),
              width: fullLineWidth,
              material: fullLineColor,
            },
          });
          break;
        case 1:
          let dashLineColor = Cesium.Color.fromCssColorString(
            this.dottedLineColor
          );
          let dashLineGapColor = Cesium.Color.fromCssColorString(
            this.dottedLineGapColor
          );
          let dashLineWidth = Number(this.dottedLineWidth);
          let dashLineDashSectionLength = Number(this.dottedLineDashLenght);
          viewer.entities.add({
            id: "polyline-symbol-dash-" + new Date().getTime(),
            polyline: {
              positions: Cesium.Cartesian3.fromDegreesArrayHeights(position),
              width: dashLineWidth,
              material: new Cesium.PolylineDashMaterialProperty({
                color: dashLineColor,
                gapColor: dashLineGapColor,
                dashLength: dashLineDashSectionLength,
              }),
            },
          });
          break;
        case 2:
          let outlineInnerColor = Cesium.Color.fromCssColorString(
            this.oLineColor
          );
          let outlineOuterColor = Cesium.Color.fromCssColorString(
            this.outLineColor
          );
          let outlineInnerWidth = Number(this.oLineWidth);
          let outlineOuterWidth = Number(this.outLineWidth);
          viewer.entities.add({
            id: "polyline-symbol-outline-" + new Date().getTime(),
            polyline: {
              positions: Cesium.Cartesian3.fromDegreesArrayHeights(position),
              width: outlineInnerWidth,
              material: new Cesium.PolylineOutlineMaterialProperty({
                color: outlineInnerColor,
                outlineWidth: outlineOuterWidth,
                outlineColor: outlineOuterColor,
              }),
            },
          });
          break;
        case 3:
          let arrowLineColor = Cesium.Color.fromCssColorString(
            this.arrowLineColor
          );
          let arrowLineWidth = Number(this.arrowLineWidth);
          viewer.entities.add({
            id: "polyline-symbol-arrow-" + new Date().getTime(),
            polyline: {
              positions: Cesium.Cartesian3.fromDegreesArrayHeights(position),
              width: arrowLineWidth,
              followSurface: false,
              material: new Cesium.PolylineArrowMaterialProperty(
                arrowLineColor
              ),
            },
          });
          break;
        case 4:
          let glowLineColor = Cesium.Color.fromCssColorString(
            this.glowLineColor
          );
          let glowLineWidth = Number(this.glowLineWidth);
          let glowLinePower = Number(this.glowLineStrength);
          viewer.entities.add({
            id: "polyline-symbol-glow-" + new Date().getTime(),
            polyline: {
              positions: Cesium.Cartesian3.fromDegreesArrayHeights(position),
              width: glowLineWidth,
              material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: glowLinePower,
                color: glowLineColor,
              }),
            },
          });
          break;
        case 5:
          let trailLineColor = Cesium.Color.fromCssColorString(
            this.TrailLineColor
          );
          let trailLineWidth = Number(this.TrailLineWidth);
          let trailLinePercent = Number(this.TrailLinePercentage);
          let trailLinePeroid = Number(this.TrailLinePeriod);
          viewer.entities.add({
            id: "polyline-symbol-trail-" + new Date().getTime(),
            polyline: {
              positions: Cesium.Cartesian3.fromDegreesArrayHeights(position),
              width: trailLineWidth,
              material: new Cesium.PolylineTrailMaterialProperty({
                color: trailLineColor,
                trailLength: trailLinePercent,
                period: trailLinePeroid,
              }),
            },
          });
          break;
        default:
          break;
      }
    },
  },

  watch: {
    getIsEdit(val) {
      this.isEdit = val;
    },
    getIsEditZ(val) {
      this.isEditZ = val;
    },
    isEdit(val) {
      if (!this.addpolyline) {
        return;
      }
      if (val) {
        common.Edit(this);
      } else {
        common.clearEditHandler();
      }
      store.setIsEdit(val);
    },
    isEditZ(val) {
      if (!this.addpolyline) {
        return;
      }
      if (window.editHandler) {
        window.editHandler.isEditZ = val;
      }
      store.setIsEditZ(val);
    },
    addpolyline: function (val) {
      if (val) {
        this.init();
      }
    },
    fullLineColor(val) {
      let color = Cesium.Color.fromCssColorString(val);
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polyline-symbol-full") === 0
      ) {
        viewer.selectedEntity.polyline.material = color;
      }
    },
    fullLineWidth(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polyline-symbol-full") === 0
      ) {
        viewer.selectedEntity.polyline.width = Number(val);
      }
    },
    dottedLineColor(val) {
      let color = Cesium.Color.fromCssColorString(val);
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polyline-symbol-dash") === 0
      ) {
        viewer.selectedEntity.polyline.material.color = color;
      }
    },
    dottedLineWidth(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polyline-symbol-dash") === 0
      ) {
        viewer.selectedEntity.polyline.width = Number(val);
      }
    },
    dottedLineGapColor(val) {
      let color = Cesium.Color.fromCssColorString(val);
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polyline-symbol-dash") === 0
      ) {
        viewer.selectedEntity.polyline.material.gapColor = color;
      }
    },
    dottedLineDashLenght(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polyline-symbol-dash") === 0
      ) {
        viewer.selectedEntity.polyline.material.dashLength = Number(val);
      }
    },
    oLineColor(val) {
      let color = Cesium.Color.fromCssColorString(val);
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polyline-symbol-outline") === 0
      ) {
        viewer.selectedEntity.polyline.material.color = color;
      }
    },
    oLineWidth(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polyline-symbol-outline") === 0
      ) {
        viewer.selectedEntity.polyline.width = Number(val);
      }
    },
    outLineColor(val) {
      let color = Cesium.Color.fromCssColorString(val);
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polyline-symbol-outline") === 0
      ) {
        viewer.selectedEntity.polyline.material.outlineColor = color;
      }
    },
    outLineWidth(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polyline-symbol-outline") === 0
      ) {
        viewer.selectedEntity.polyline.material.outlineWidth = Number(val);
      }
    },
    arrowLineColor(val) {
      let color = Cesium.Color.fromCssColorString(val);
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polyline-symbol-arrow") === 0
      ) {
        viewer.selectedEntity.polyline.material.color = color;
      }
    },
    arrowLineWidth(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polyline-symbol-arrow") === 0
      ) {
        viewer.selectedEntity.polyline.width = Number(val);
      }
    },
    glowLineColor(val) {
      let color = Cesium.Color.fromCssColorString(val);
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polyline-symbol-glow") === 0
      ) {
        viewer.selectedEntity.polyline.material.color = color;
      }
    },
    glowLineWidth(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polyline-symbol-glow") === 0
      ) {
        viewer.selectedEntity.polyline.width = Number(val);
      }
    },
    glowLineStrength(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polyline-symbol-glow") === 0
      ) {
        viewer.selectedEntity.polyline.material.glowPower = Number(val);
      }
    },
    TrailLineColor(val) {
      let color = Cesium.Color.fromCssColorString(val);
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polyline-symbol-trail") === 0
      ) {
        viewer.selectedEntity.polyline.material.color = color;
      }
    },
    TrailLineWidth(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polyline-symbol-trail") === 0
      ) {
        viewer.selectedEntity.polyline.width = Number(val);
      }
    },
    TrailLinePercentage(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polyline-symbol-trail") === 0
      ) {
        viewer.selectedEntity.polyline.material.trailLength = Number(val);
      }
    },
  },
};
</script>

<style lang="scss"  scoped>
@import "addPolyline";
</style>