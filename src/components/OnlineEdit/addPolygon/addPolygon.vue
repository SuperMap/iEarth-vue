<template>
  <div class="sm-function-module-content" v-show="addpolygon">
    <label class="sm-function-module-sub-section-setting">符号库</label>
    <div class="symbolicLibrary">
      <div
        class="Thematicbox"
        :class="{lightSelected:polygonType===0}"
        @click="polygonSelectType(0)"
      >
        <div id="pointLight" class="minbox">
          <span class="iconfont iconchunse"></span>
        </div>纯色
      </div>
      <div
        class="Thematicbox"
        :class="{lightSelected:polygonType===1}"
        @click="polygonSelectType(1)"
      >
        <div class="minbox" id="spotLight">
          <span class="iconfont iconwangge"></span>
        </div>网格
      </div>
      <div
        class="Thematicbox"
        :class="{lightSelected:polygonType===2}"
        @click="polygonSelectType(2)"
      >
        <div class="minbox" id="directionalLight">
          <span class="iconfont icontiaowen"></span>
        </div>条纹
      </div>
    </div>
    <!-- 纯色 -->
    <div v-show="polygonType===0">
      <div class="sm-function-module-sub-section">
        <label class="label-container">面颜色 :</label>
        <ColorPicker class="sm-colorpicker" editable v-model="SolidColor" />
      </div>
    </div>
    <!-- 网格 -->
    <div v-show="polygonType===1">
      <div class="sm-function-module-sub-section">
        <label class="label-container">面颜色 :</label>
        <ColorPicker class="sm-colorpicker" editable v-model="gridColor" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">网格线宽:</label>
        <input class="sm-input-long" min="1" step="1.0" type="number" v-model="gridWidth" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">网格线数:</label>
        <input class="sm-input-long" min="2" step="1.0" type="number" v-model="gridCount" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">单元透明度:</label>
        <input
          class="sm-input-long"
          min="0.1"
          max="1"
          step="0.1"
          type="number"
          v-model="gridCellAlpha"
        />
      </div>
    </div>
    <!-- 条纹 -->
    <div v-show="polygonType===2">
      <div class="sm-function-module-sub-section">
        <label class="label-container">偶数带条颜色 :</label>
        <ColorPicker class="sm-colorpicker" editable v-model="StripeEvenColor" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">奇数带条颜色 :</label>
        <ColorPicker class="sm-colorpicker" editable v-model="StripeOddColor" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">带条重复数:</label>
        <input class="sm-input-long" min="1" step="1.0" type="number" v-model="StripeRepeat " />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">带条偏移量 :</label>
        <input class="sm-input-long" min="0" step="1.0" type="number" v-model="StripeOffset " />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">带条方向 :</label>
        <select class="sm-select" id="stopList" v-model="StripeOrientation">
          <option value="0">水平方向</option>
          <option value="1">垂直方向</option>
        </select>
      </div>
    </div>

    <div class="flexbox">
      <label class="sm-viewshed-label-right">编辑:</label>
      <input type="checkbox" v-model="isEdit" />
      <label class="sm-viewshed-label-right">编辑Z轴:</label>
      <input type="checkbox" v-model="isEditZ" />
    </div>
    <div class="boxchild">
      <button class="tbtn tbn1" type="button" @click="drawPolygon">绘制</button>
      <button class="tbtn" type="button" @click="clearPolygon">清除</button>
    </div>
  </div>
</template>

<script>
let currentPolygonSymbol;
export default {
  name: "addPolygon",
  data() {
    return {
      sharedState: store.state,
      polygonType: 0,
      isDestroyFlag: true,
      SolidColor: "#C8910A",
      gridColor: "#C8910A",
      gridWidth: 1,
      gridCount: 8,
      gridCellAlpha: 0.1,
      StripeEvenColor: "#C8910A",
      StripeOddColor: "#0A15C8",
      StripeRepeat: 12,
      StripeOffset: 0,
      StripeOrientation: "0",
      isEdit: false,
      isEditZ: false,
      EditPositions: [],
    };
  },

  computed: {
    addpolygon: function () {
      return this.sharedState.onlineEdit[2];
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
    //   if (this.onlineEditShow && this.addpolyline) {
    //     this.init();
    //   }
  },
  methods: {
    polygonSelectType(i) {
      this.polygonType = i;
    },
    drawPolygon() {
      this.isDestroyFlag = false;
      if (!window.handlerPolygon) {
        common.initHandler("Polygon");
      }
      common.handlerDrawing("Polygon", 2).then(
        (res) => {
          this.positions = res.positions;
          let handlerPolygon = window.handlerPolygon;
          this.DrawPolygonUpdate(res.positions);
          handlerPolygon.polygon.show = false;
          handlerPolygon.polyline.show = false;
          window.polylineTransparent.show = false; //半透线隐藏
          handlerPolygon.deactivate();
          if (this.isEdit) {
            common.Edit(this);
          }
        },
        (err) => {
          console.log(err);
        }
      );
      window.handlerPolygon.activate();
    },
    DrawPolygonUpdate(position) {
      switch (this.polygonType) {
        case 0:
          let polygonSymbolPureColor = Cesium.Color.fromCssColorString(
            this.SolidColor
          );
          currentPolygonSymbol = viewer.entities.add({
            id: "polygon-symbol-pure-" + new Date().getTime(),
            polygon: {
              perPositionHeight: true,
              hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(position),
              material: polygonSymbolPureColor,
            },
          });
          break;
        case 1:
          let polygonSymbolGridColor = Cesium.Color.fromCssColorString(
            this.gridColor
          );
          let polygonSymbolGridCellAlpha = Number(this.gridCellAlpha);
          let polygonSymbolGridLineCount = Number(this.gridCount);
          let polygonSymbolGridLineThickness = Number(this.gridWidth);
          let polygonSymbolGridLineOffset = Number(this.gridCellAlpha);
          currentPolygonSymbol = viewer.entities.add({
            id: "polygon-symbol-grid-" + new Date().getTime(),
            polygon: {
              perPositionHeight: true,
              hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(position),
              material: new Cesium.GridMaterialProperty({
                color: polygonSymbolGridColor,
                cellAlpha: polygonSymbolGridCellAlpha,
                lineCount: new Cesium.Cartesian2(
                  polygonSymbolGridLineCount,
                  polygonSymbolGridLineCount
                ),
                lineThickness: new Cesium.Cartesian2(
                  polygonSymbolGridLineThickness,
                  polygonSymbolGridLineThickness
                ),
                lineOffset: new Cesium.Cartesian2(
                  polygonSymbolGridLineOffset,
                  polygonSymbolGridLineOffset
                ),
              }),
            },
          });
          break;
        case 2:
          let polygonSymbolStripeEvenColor = Cesium.Color.fromCssColorString(
            this.StripeEvenColor
          );
          let polygonSymbolStripeOddColor = Cesium.Color.fromCssColorString(
            this.StripeOddColor
          );
          let polygonSymbolStripeRepeat = Number(this.StripeRepeat);
          let polygonSymbolStripeOffset = Number(this.StripeOffset);
          let polygonSymbolStripeOrientation = Number(this.StripeOrientation);
          currentPolygonSymbol = viewer.entities.add({
            id: "polygon-symbol-stripe-" + new Date().getTime(),
            polygon: {
              perPositionHeight: true,
              hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(position),
              material: new Cesium.StripeMaterialProperty({
                evenColor: polygonSymbolStripeEvenColor,
                oddColor: polygonSymbolStripeOddColor,
                repeat: polygonSymbolStripeRepeat,
                offset: polygonSymbolStripeOffset,
                orientation: polygonSymbolStripeOrientation,
              }),
            },
          });
          break;
        default:
          break;
      }
    },
    clearPolygon() {
      let entities = viewer.entities.values;
      for (let i = 0, j = entities.length; i < j; i++) {
        if (entities[i].polygon) {
          entities[i].polygon.show = false;
        }
      }
      common.clearHandlerDrawing();
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
      if (!this.addpolygon) {
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
      if (!this.addpolygon) {
        return;
      }
      if (window.editHandler) {
        window.editHandler.isEditZ = val;
      }
      store.setIsEditZ(val);
    },
    SolidColor(val) {
      let color = Cesium.Color.fromCssColorString(val);
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polygon-symbol-pure") === 0
      ) {
        viewer.selectedEntity.polygon.material = color;
      }
    },
    gridColor(val) {
      let color = Cesium.Color.fromCssColorString(val);
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polygon-symbol-grid") === 0
      ) {
        viewer.selectedEntity.polygon.material.color = color;
      }
    },
    StripeEvenColor(val) {
      let color = Cesium.Color.fromCssColorString(val);
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polygon-symbol-stripe") === 0
      ) {
        viewer.selectedEntity.polygon.material.evenColor = color;
      }
    },
    StripeOddColor(val) {
      let color = Cesium.Color.fromCssColorString(val);
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polygon-symbol-stripe") === 0
      ) {
        viewer.selectedEntity.polygon.material.oddColor = color;
      }
    },
    gridWidth(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polygon-symbol-grid") === 0
      ) {
        viewer.selectedEntity.polygon.material.lineThickness = new Cesium.Cartesian2(
          Number(val),
          Number(val)
        );
      }
    },
    gridCount(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polygon-symbol-grid") === 0
      ) {
        viewer.selectedEntity.polygon.material.lineCount = new Cesium.Cartesian2(
          Number(val),
          Number(val)
        );
      }
    },
    gridCellAlpha(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polygon-symbol-grid") === 0
      ) {
        viewer.selectedEntity.polygon.material.cellAlpha = Number(val);
      }
    },
    StripeRepeat(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polygon-symbol-stripe") === 0
      ) {
        viewer.selectedEntity.polygon.material.repeat = Number(val);
      }
    },
    StripeOffset(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polygon-symbol-stripe") === 0
      ) {
        viewer.selectedEntity.polygon.material.offset = Number(val);
      }
    },
    StripeOrientation(val) {
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polygon-symbol-stripe") === 0
      ) {
        viewer.selectedEntity.polygon.material.orientation = Number(val);
      }
    },
  },
};
</script>

<style lang="scss"  scoped>
@import "addPolygon";
</style>