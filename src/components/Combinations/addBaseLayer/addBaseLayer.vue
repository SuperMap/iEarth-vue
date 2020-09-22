<template>
  <div class="baseLayer" v-show="baseLayerShow">
    <div class="imageContainer">
      <div
        class="imageBox"
        v-for="(item,index) in BaseLayers"
        :key="item.name"
        @click="addBaseLayer(item.type,index)"
      >
        <img :src="item.thumbnail" alt />
        <label>{{item.name}}</label>
      </div>
    </div>
    <div class="addStk">
      <label style="margin-left:5px">STK在线地形:</label>
      <input style="margin-left: 5px" type="checkbox" v-model="isSTKTerrain" />
    </div>
  </div>
</template>

<script>
let imageryProvider;
import BaseLayerModels from "../../../data/BaseLayerData.js";
export default {
  name: "addBaseLayer",
  data() {
    return {
      sharedState: store.state,
      BaseLayers: null,
      isSTKTerrain: false,
    };
  },
  computed: {
    baseLayerShow: function () {
      return this.sharedState.toolBar[2];
    },
  },
  methods: {
    toggleVisibility() {
      //控制组件界面显隐
      store.setToolBarAction(2);
    },
    addBaseLayer(type, index) {
      let imageryLayerCollection = viewer.scene.globe._imageryLayerCollection;
      let layer = imageryLayerCollection.get(0);
      if (imageryLayerCollection.get(2)) {
        imageryLayerCollection.remove(imageryLayerCollection.get(2));
      }
      if (imageryLayerCollection.get(1)) {
        imageryLayerCollection.remove(imageryLayerCollection.get(1));
      }
      switch (type) {
        case "BINGMAP":
          imageryProvider = new Cesium.BingMapsImageryProvider({
            url: this.BaseLayers[index].url,
            key:
              "Av63hPkCmH18oGGn5Qg3QhLBJvknZ97xbhyw3utDLRtFv7anHjXNOUQbyWBL5fK5",
          });
          break;
        case "TIANDITU":
          imageryProvider = new Cesium.TiandituImageryProvider({
            token: "4a00a1dc5387b8ed8adba3374bd87e5e",
          });
          break;
        case "IMAGE":
          imageryProvider = new Cesium.SingleTileImageryProvider({
            url: this.BaseLayers[index].url,
          });
          break;
        case "OSM":
          imageryProvider = new Cesium.createOpenStreetMapImageryProvider({
            url: this.BaseLayers[index].url,
          });
          break;
        case "MAPBOX":
          imageryProvider = new Cesium.MapboxImageryProvider({
            mapId: "mapbox.dark",
          });
          break;
        case "SUPERMAPDARK":
          imageryProvider = new Cesium.SuperMapImageryProvider({
            url: this.BaseLayers[index].url,
          });
          break;
        case "SUPERMAPLIGHT":
          imageryProvider = new Cesium.SuperMapImageryProvider({
            url: this.BaseLayers[index].url,
          });
          break;
        case "GRIDIMAGERY":
          imageryProvider = imageryProvider;
          break;
        default:
          break;
      }
      if (type != "GRIDIMAGERY") {
        imageryLayerCollection.remove(layer);
        imageryLayerCollection.addImageryProvider(imageryProvider, 0);
      }
      if (type == "GRIDIMAGERY") {
        imageryLayerCollection.addImageryProvider(
          new Cesium.TileCoordinatesImageryProvider(),
          1
        );
        imageryLayerCollection.addImageryProvider(
          new Cesium.GridImageryProvider(),
          2
        );
      }
    },

    setTerrain(isStkTerrain) {
      if (isStkTerrain) {
        viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
          url:
            "https://www.supermapol.com/realspace/services/3D-stk_terrain/rest/realspace/datas/info/data/path",
          requestWaterMask: true,
          requestVertexNormals: true,
          credit: "",
          isSct : false//地形服务源自SuperMap iServer发布时需设置isSct为true
        });
      } else {
        viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider({
          ellipsoid: viewer.scene.globe.ellipsoid,
        });
      }
    },
  },

  watch: {
    baseLayerShow: function (val) {
      this.BaseLayers = BaseLayerModels;
      if (val) {
        document.getElementsByTagName("canvas")[0].onclick = () => {
          this.toggleVisibility();
        };
      } else {
        document.getElementsByTagName("canvas")[0].onclick = null;
      }
    },
    isSTKTerrain(val) {
      this.setTerrain(val);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./addBaseLayer.scss";
</style>