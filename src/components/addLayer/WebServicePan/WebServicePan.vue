<template>
  <div class="sm-function-module-content" v-show="webServiceShow">
    <div class="sm-function-module-sub-section">
      <select class="sm-select" v-model="selType">
        <option id="publicService" value="0">公共服务</option>
        <option id="specialEffects" value="1">特效</option>
        <option id="specialEffects" value="2">热点</option>
      </select>
      <div class="imageContainer">
        <!-- 公共服务 -->
        <div
          class="imageBox"
          v-for=" item in data"
          :key="item.id"
          @click="addwebSever(item)"
          v-show="selType=='0'"
        >
          <img v-lazy="item.thumbnail" alt />
          <label for>{{item.sceneName}}</label>
        </div>
        <!-- 特效 -->
        <div
          class="imageBox"
          v-for=" item in Effects"
          :key="item.name"
          @click="addEffects(item.id)"
          v-show="selType=='1'"
        >
          <img :src="item.thumbnail" alt />
          <label for>{{item.description}}</label>
        </div>
        <!-- 热点 -->
        <div
          class="imageBox"
          v-for=" item in hotSpots"
          :key="item.id"
          @click="addHotSpots(item)"
          v-show="selType=='2'"
        >
          <img v-lazy="item.thumbnail" alt />
          <label for>{{item.sceneName}}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import data from "@/data/iEarth_resource_services_CN.json";
import Effects from "@/data/specialEffects_CN.json";
import hotSpots from "@/data/hotSpots_CN.json";
import Config from "@/common/js/webServeConfig.js";

export default {
  name: "addWebService",
  data() {
    return {
      sharedState: store.state,
      selType: "0",
      // showType: true, //默认显示公共服务，取反显示特效
      data: null,
      Effects: null,
      hotSpots:null,
      hotPoint:false
    };
  },
  computed: {
    webServiceShow: function () {
      return this.sharedState.addLayer[0];
    },
    alreadyAddLayers: function () {
      return this.alreadyAddLayer.length;
    },
  },
  methods: {
    addS3M(LayerURL) {
      let promiseArray = [];
      promiseArray.push(viewer.scene.addS3MTilesLayerByScp(LayerURL));
      this.promiseWhen(promiseArray, true);
    },

    addTerrain(LayerURL) {
      viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
        url: LayerURL,
        isSct: true, //地形服务源自SuperMap iServer发布时需设置isSct为true
      });
    },

    addImage(LayerURL) {
      var layer = viewer.imageryLayers.addImageryProvider(
        new Cesium.SuperMapImageryProvider({
          url: LayerURL,
        })
      );
      viewer.flyTo(layer);
    },

    promiseWhen(promiseArray, sceneName) {
      Cesium.when.all(
        promiseArray,
        (layer) => {
          if (sceneName) {
            this.flyTo(sceneName);
          }
          // // 设置图层
          // store.setS3MLayerManage(viewer.scene.layers.layerQueue.length);
          // store.setImgLayerManage(viewer.imageryLayers._layers.length);
          // store.setTerrainLayerManage(viewer.terrainProvider.tablename);
        },
        function (e) {
          if (widget._showRenderLoopErrors) {
            let title = "加载SCP失败，请检查网络连接状态或者url地址是否正确？";
            widget.showErrorPanel(title, undefined, e);
          }
        }
      );
    },

    // 加载公共服务
    addwebSever(obj) {
      if (obj) {
        switch (obj.type) {
          case "REALSPACE": //场景
            if (obj.state == 1) {
              this.$Message.warning({
                background: true,
                content: "该图层已经存在，请勿重复添加",
              });
            } else {
              let s = viewer.scene.open(obj.proxiedUrl);
              this.promiseWhen([s]);
              obj.state = 1;
              setTimeout(() => {
                //更新图层
                store.setS3MLayerManage(viewer.scene.layers.layerQueue.length);
                store.setImgLayerManage(viewer.imageryLayers._layers.length);
                store.setTerrainLayerManage(viewer.terrainProvider.tablename);
              }, 1500);
            }
            break;
          case "SCP": //scp
            if (obj.state == 1) {
              this.flyTo(obj.sceneName);
              this.$Message.warning({
                background: true,
                content: "该图层已经存在，请勿重复添加",
              });
            } else {
              let promiseArray = [];
              promiseArray.push(
                viewer.scene.addS3MTilesLayerByScp(obj.proxiedUrl, {
                  name: obj.sceneName,
                })
              );
              this.promiseWhen(promiseArray, obj.sceneName);
              obj.state = 1;
              setTimeout(() => {
                //更新图层
                store.setS3MLayerManage(viewer.scene.layers.layerQueue.length);
              }, 1500);
            }
            break;
          case "IMG": //影像
            if (obj.state == 1) {
              this.flyTo(obj.sceneName);
              this.$Message.warning({
                background: true,
                content: "该图层已经存在，请勿重复添加",
              });
            } else {
              this.addImage(obj.proxiedUrl);
              setTimeout(() => {
                //更新图层
                store.setImgLayerManage(viewer.imageryLayers._layers.length);
              }, 1000);
            }
            obj.state = 1;
            break;
          case "TERRAIN": //地形
            if (obj.state == 1) {
              this.$Message.warning({
                background: true,
                content: "该图层已经存在，请勿重复添加",
              });
            } else {
              this.addTerrain(obj.proxiedUrl);
              obj.state = 1;
              setTimeout(() => {
                store.setTerrainLayerManage(viewer.terrainProvider.tablename);
              }, 1000);
            }
            break;
          default:
            null;
        }
      }
      store.setToolBarAction(1);
    },
    //添加特效
    addEffects(id) {
       store.setSpecialEffects(id,1);  //打开特效
       store.setToolBarAction(1); //关闭面板
    },
    // 添加热点
    addHotSpots(obj){
         this.addwebSever(obj)
         setTimeout(()=>{
        store.setHotSpots(obj.id,1);  
         },1500)
    },

    flyTo(scpName) {
      let cameraParam = Config.CAMERA_PARAM[scpName];
      if (cameraParam) {
        viewer.scene.camera.flyTo({
          destination: new Cesium.Cartesian3(
            cameraParam.Cartesian3.x,
            cameraParam.Cartesian3.y,
            cameraParam.Cartesian3.z
          ),
          orientation: {
            heading: cameraParam.heading,
            pitch: cameraParam.pitch,
            roll: cameraParam.roll,
          },
          duration: 5,
        });
        return;
      } else {
        var ceterCartesianPosition = layers[0]._position;
        var boundingSphere = new Cesium.BoundingSphere(
          ceterCartesianPosition,
          200
        );
        var camera = this.viewer.scene.camera;
        camera.flyToBoundingSphere(boundingSphere);
      }
    },
  },

  mounted() {
    // this.initViewer();
    this.data = data.content; //获取公共服务json数据
  },

  watch: {
    selType: function (val) {
      switch (val) {
        case "0":
          // this.showType = true;
          break;
        case "1":
          this.Effects = Effects.effects;
          // this.showType = false;
          break;
        case "2":
          this.hotSpots = hotSpots.hotSpots;
          // this.showType = false;
          break;
        default:
          // this.showType = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./WebServicePan.scss";
</style>