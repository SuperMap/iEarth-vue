<template>
  <div class="layerBox" v-if="LayerManageShow">
    <Tree
      :data="TreeDatas"
      show-checkbox
      @on-contextmenu="handleContextMenu"
      @on-select-change="handleSelectChange"
      @on-check-change="handleCheckChange"
      ref="tree1"
      title="点击右键设置S3M图层属性"
    >
      <template slot="contextMenu">
        <DropdownItem @click.native="handleContextMenuEdit" v-show="hid">图层属性</DropdownItem>
        <DropdownItem @click.native="handleContextMenuDelete" style="color: #ed4014">删除图层</DropdownItem>
      </template>
    </Tree>
  </div>
</template>

<script>
import Config from "@/common/js/webServeConfig.js";
import data from "@/data/iEarth_resource_services_CN.json";
export default {
  name: "LayerManage",
  data() {
    return {
      sharedState: store.state,
      //   flag: false,
      //   s3mLen: 0,
      hid:true,
      S3MLayersObj: {
        title: "S3M图层",
        expand: true,
        checked: true,
        type: "S3M",
        children: [],
      },
      imgLayersObj: {
        title: "影像图层",
        expand: true,
        checked: true,
        type: "IMG",
        children: [],
      },
      TerrainLayersObj: {
        title: "地形图层",
        expand: true,
        checked: true,
        type: "TERRAIN",
        children: [],
      },

      TreeDatas: [
        {
          title: "图层列表",
          expand: true,
          //   selected: true,
          //   contextmenu: true,
          children: [],
          type: "ROOT",
        },
      ],
      contextData: null,
    };
  },
  computed: {
    LayerManageShow: function () {
      return this.sharedState.toolBar[0];
    },
    imgLayers: function () {
      return this.sharedState.imgLayerManage;
    },
    terrainLayers: function () {
      return this.sharedState.terrainLayerManage;
    },
    S3MLayers: function () {
      return this.sharedState.S3MLayerManage;
    },
  },

  methods: {
    //   获取当前选中图层
    handleSelectChange(d, select) {
      let name = Config.TitleKeyMap[select.title];
      this.flyTo(name, select);
    },
    // 勾选复选框获取图层 --控制显隐
    handleCheckChange(d, check) {
      switch (check.type) {
        case "ROOT":
          this.isHideAllLayers(check.checked);
          break;
        case "S3M":
          let ly = viewer.scene.layers.find(check.title);
          if (check.title == "S3M图层") {
            let layers = viewer.scene.layers.layerQueue;
            layers.forEach((i) => {
              i._visible = check.checked;
            });
            return;
          }
          if (ly) {
            ly._visible = check.checked;
          }
          break;
        case "IMG":
          let layers = viewer.imageryLayers._layers;
          if (check.title == "影像图层") {
            layers.forEach((i, index) => {
              if (index == 0) return;
              i.show = check.checked;
            });
            return;
          }
          layers[check.id].show = check.checked;
          break;
        case "TERRAIN":
          if (!check.checked) {
            window.terrainProvider = viewer.terrainProvider;
            viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
          } else {
            viewer.terrainProvider = window.terrainProvider;
          }
          break;
        default:
          null;
      }
    },

    //   获取右键点击当前图层
    handleContextMenu(data) {
      this.contextData = data;
      if(data.type != 'S3M'){
        this.hid = false;
      }else{
         this.hid = true;
      }
    },
    // 鼠标右键查看图层属性
    handleContextMenuEdit() {
      let selectedObj = this.contextData;
      store.setSelectedLayerName(selectedObj.title);
      store.setLayerAttributeToolbal(true);
    },
    // 鼠标右键删除图层
    handleContextMenuDelete() {
      let selectedObj = this.contextData;
      switch (selectedObj.type) {
        case "S3M":
          viewer.scene.layers.remove(selectedObj.title);
          store.setS3MLayerManage(viewer.scene.layers.layerQueue.length);
          //   图层加载状态改变，即删除后可加载。
          let name = Config.TitleKeyMap[selectedObj.title];
          data.content.some((item) => {
            if (item.sceneName == name) {
              item.state = 0;
              return true;
            }
          });
          break;
        case "IMG":
          let ly2 = viewer.imageryLayers._layers[selectedObj.id];
          viewer.imageryLayers.remove(ly2);
          store.setImgLayerManage(viewer.imageryLayers._layers.length);
          let name2 = Config.TitleKeyMap[selectedObj.title];
          data.content.some((item) => {
            if (item.sceneName == name2) {
              item.state = 0;
              return true;
            }
          });
          break;
        case "TERRAIN":
          viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
          window.terrainProvider = null;
          store.setTerrainLayerManage(viewer.terrainProvider.tablename);
          let name3 = Config.TitleKeyMap[selectedObj.title];
          data.content.some((item) => {
            if (item.sceneName == name3) {
              item.state = 0;
              return true;
            }
          });
          break;
        default:
          null;
      }
    },
    //判断图层父类是否存在及返回索引
    judgeIsExist(type) {
      let d = this.TreeDatas[0].children;
      let i = false;
      if (d.length == 0) return i;
      d.forEach((item, index) => {
        if (item.type == type) {
          i = index;
        }
      });
      return i;
    },

    // updatS3M图层
    updataS3MLayer() {
      let _that = this;
      if (viewer) {
        let layers = viewer.scene.layers.layerQueue;
        let index = this.judgeIsExist("S3M"); //获取图层类型父级下标
        if (layers.length == 0 && index === false) {
          return;
        }
        if (layers.length == 0 && index !== false) {
          this.TreeDatas[0].children.splice(index, 1);
          return;
        }
        this.S3MLayersObj.children = [];
        layers.forEach((layer, index) => {
          let S3Mlayer = {
            title: layer._name,
            checked: true,
            contextmenu: true,
            type: "S3M",
          };
          this.S3MLayersObj.children.push(S3Mlayer);
        });
        if (index !== false) {
          this.TreeDatas[0].children.splice(index, 1, this.S3MLayersObj);
          return;
        }
        this.TreeDatas[0].children.push(this.S3MLayersObj);
      } else {
        setTimeout(() => {
          _that.updataS3MLayer();
        }, 2000);
      }
    },

    //updatImg
    updataImgLayers() {
      let _that = this;
      if (viewer) {
        let layers = viewer.imageryLayers._layers;
        let index = this.judgeIsExist("IMG"); //获取图层类型父级下标
        if (layers.length == 1 && index === false) {
          return;
        }
        if (layers.length == 1 && index !== false) {
          this.TreeDatas[0].children.splice(index, 1);
          return;
        }
        this.imgLayersObj.children = [];
        layers.forEach((layer, index) => {
          if (index == 0) return;
          let IMGlayer = {
            title: "",
            checked: true,
            contextmenu: true,
            type: "IMG",
            id: index,
          };
          if (layer._imageryProvider.tablename) {
            IMGlayer.title = layer._imageryProvider.tablename;
          } else {
            IMGlayer.title = "底图_img";
          }
          this.imgLayersObj.children.push(IMGlayer);
        });
        if (index !== false) {
          this.TreeDatas[0].children.splice(index, 1, this.imgLayersObj);
          return;
        }
        this.TreeDatas[0].children.push(this.imgLayersObj);
      } else {
        setTimeout(() => {
          _that.updataImgLayers();
        }, 2000);
      }
    },

    //updatTerrain
    updataTerrainLayers() {
      let _that = this;
      if (viewer) {
        let layers = viewer.terrainProvider;
        let index = this.judgeIsExist("TERRAIN"); //获取图层类型父级下标
        if (!layers.tablename && index === false) {
          return;
        }
        if (!layers.tablename && index !== false) {
          this.TreeDatas[0].children.splice(index, 1);
          return;
        }
        this.TerrainLayersObj.children = [];
        let TerrainLayer = {
          title: layers.tablename,
          checked: true,
          contextmenu: true,
          type: "TERRAIN",
        };
        this.TerrainLayersObj.children.push(TerrainLayer);
        if (index !== false) {
          this.TreeDatas[0].children.splice(index, 1, this.TerrainLayersObj);
          return;
        }
        this.TreeDatas[0].children.push(this.TerrainLayersObj);
      } else {
        setTimeout(() => {
          _that.updataTerrainLayers();
        }, 2000);
      }
    },

    flyTo(scpName, check) {
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
          duration: 3,
        });
        return;
      } else {
        switch (check.type) {
          case "S3M":
            let ly = viewer.scene.layers.find(check.title);
            if (ly) {
              viewer.flyTo(ly);
            }
            break;
          case "IMG":
            let layers = viewer.imageryLayers._layers;
            if (check.id) {
              viewer.flyTo(layers[check.id]);
            }
            break;
          case "TERRAIN":
            return;
            break;
          default:
            null;
        }
      }
    },

    //根节点控制显隐
    isHideAllLayers(f) {
       if(this.TreeDatas[0].children.length === 0)return;
      let S3MLayers = viewer.scene.layers.layerQueue;
      let ImgLayers = viewer.imageryLayers._layers;
      S3MLayers.forEach((i) => {
        i._visible = f;
      });
      ImgLayers.forEach((i, index) => {
        if (index == 0) return;
        i.show = f;
      });
      if (!f) {
        window.terrainProvider = viewer.terrainProvider;
        viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
      } else {
        viewer.terrainProvider = window.terrainProvider;
      }
    },
  },

  watch: {
    LayerManageShow: function (val) {
      let l = viewer.scene.layers.layerQueue.length;
      if (val && this.TreeDatas[0].children.length === 0 || l !==this.S3MLayers) {
        //只会第一次加载，避免重复更新
        this.updataS3MLayer();
        this.updataImgLayers();
        this.updataTerrainLayers();
      }
    },
    imgLayers: function (val) {
      if (this.LayerManageShow) {
        this.updataImgLayers();
      }
    },
    terrainLayers: function (val) {
      if (this.LayerManageShow) {
        this.updataTerrainLayers();
      }
    },
    S3MLayers: function (val) {
      if (this.LayerManageShow) {
        this.updataS3MLayer();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./LayerManage.scss";
</style>