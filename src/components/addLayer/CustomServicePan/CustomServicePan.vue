<template>
  <div class="sm-function-module-content" v-show="customServiceShow">
    <div class="sm-function-module-sub-section">
      <label class="label-container">打开图层 ：</label>
      <select class="sm-select" v-model="LayerType">
        <option value="S3M">S3M图层</option>
        <option value="IMAGERY">影像图层</option>
        <option value="TERRAIN">地形图层</option>
      </select>
      <div class="token">
        <label>添加token:</label>
        <input style="margin-left: 10px" type="checkbox" v-model="addToken" />
      </div>
      <input class="sm-input" type="text" placeholder="图层URL" v-model="LayerURL" />
      <input class="sm-input" type="text" placeholder="图层名称" v-model="LayerNmae" />
      <input
        class="sm-input"
        type="text"
        placeholder="添加token"
        v-show="addToken"
        v-model="LayerToken"
      />
      <div class="boxchild">
        <button class="tbtn tbn1" type="button" @click="openLayer">确定</button>
      </div>

      <label class="label-container">打开场景 ：</label>
      <label>添加token:</label>
      <input style="margin-left: 10px" type="checkbox" v-model="addSceneToken" />
      <input class="sm-input" type="text" placeholder="场景URL" v-model="SceneURL" />
      <input
        class="sm-input"
        type="text"
        placeholder="添加token"
        v-show="addSceneToken"
        v-model="SceneToken"
      />
      <div class="boxchild">
        <button class="tbtn tbn1" type="button" @click="openScene">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
let layerLen;
export default {
  name: "addCustomService",
  data() {
    return {
      sharedState: store.state,
      LayerType: "S3M",
      addToken: false,
      LayerURL: null,
      LayerNmae: null,
      LayerToken: null,
      addSceneToken: false,
      SceneURL: null,
      SceneToken: null,
    };
  },
  computed: {
    customServiceShow: function () {
      return this.sharedState.addLayer[1];
    },
  },
  methods: {
    // 添加自定义场景
    openScene() {
      if (this.SceneURL == null || this.SceneURL == "") {
        alert("地址不能为空！");
        return;
      }
      // 检查地址是否正确
      // if(){return;}
      //去引号
      if (this.SceneURL.charAt(0) == '"' || this.SceneURL.charAt(0) == "'") {
        let reg = /^['|"](.*)['|"]$/;
        this.SceneURL = this.SceneURL.replace(reg, "$1");
      }
      if (this.SceneToken) {
        Cesium.Credential.CREDENTIAL = new Cesium.Credential(this.SceneToken);
      }
      if (viewer) {
        let promiseArray = [];
        let s = viewer.scene.open(this.SceneURL);
        promiseArray.push(s);
        this.promiseWhen(promiseArray);
      }
    },
    // 打开自定义图层
    openLayer() {
      if (this.LayerURL == null || this.LayerURL == "") {
        alert("地址不能为空！");
        return;
      }
      if (this.LayerURL.charAt(0) == '"' || this.LayerURL.charAt(0) == "'") {
        let reg = /^['|"](.*)['|"]$/;
        this.LayerURL = this.LayerURL.replace(reg, "$1");
      }
      if (this.LayerToken) {
        Cesium.Credential.CREDENTIAL = new Cesium.Credential(this.LayerToken);
      }
      switch (this.LayerType) {
        case "S3M":
          this.addS3M(this.LayerURL);
          break;
        case "IMAGERY":
          this.addImage(this.LayerURL);
          break;
        case "TERRAIN":
          this.addTerrain(this.LayerURL);
          break;
        default:
          store.setAnalysisAction([0, 0, 0, 0, 1]);
      }
    },
    addS3M(LayerURL) {
      let promiseArray = [];
      let options = {};
      if (this.LayerNmae) {
        options.name = this.LayerNmae;
      }
      layerLen = viewer.scene.layers.layerQueue.length;
      promiseArray.push(viewer.scene.addS3MTilesLayerByScp(LayerURL, options));
      this.promiseWhen(promiseArray, true);
    },

    addTerrain(LayerURL) {
      viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
        url: LayerURL,
        isSct: true, //地形服务源自SuperMap iServer发布时需设置isSct为true
      });
      setTimeout(() => {
        //更新图层
        store.setTerrainLayerManage(viewer.terrainProvider.tablename);
      }, 1500);
    },

    addImage(LayerURL) {
      var layer = viewer.imageryLayers.addImageryProvider(
        new Cesium.SuperMapImageryProvider({
          url: LayerURL,
        })
      );
      viewer.flyTo(layer);
      setTimeout(() => {
        //更新图层
        store.setImgLayerManage(viewer.imageryLayers._layers.length);
      }, 1500);
    },

    promiseWhen(promiseArray, isSCP) {
      Cesium.when.all(
        promiseArray,
        function (layers) {
          setTimeout(() => {
            //更新图层
            store.setS3MLayerManage(viewer.scene.layers.layerQueue.length);
            store.setImgLayerManage(viewer.imageryLayers._layers.length);
            store.setTerrainLayerManage(viewer.terrainProvider.tablename);
          
          }, 500);
          if (isSCP && layers[layerLen]) {
            viewer.flyTo(layers[layerLen]);
          }
        },
        function (e) {
          if (widget._showRenderLoopErrors) {
            let title = "加载SCP失败，请检查网络连接状态或者url地址是否正确？";
            widget.showErrorPanel(title, undefined, e);
          }
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./CustomServicePan.scss";
</style>