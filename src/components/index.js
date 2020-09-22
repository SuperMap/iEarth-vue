import axios from '../../static/js/axios.min';
import common from "../common/js/common"; //公共封装js
import installDrag from "../common/js/drag"; //拖拽
window.axios = axios;
window.common = common;
window.axios.jsonp = common.axiosJsonp; //拓展axios

// 三维分析部分组件
import viewer from "./Viewer/index.js";
import Profile3D from "./3DAnalysis/Profile3D/index.js";
import ShadowQuery from "./3DAnalysis/ShadowQuery/index.js";
import SightLine from "./3DAnalysis/SightLine/index.js";
import SkyLine from "./3DAnalysis/SkyLine/index.js";
import ViewShed from "./3DAnalysis/ViewShed/index.js";

//添加图层功能组件
import WebServicePan from "./addLayer/WebServicePan/index";
import CustomServicePan from "./addLayer/CustomServicePan/index";
import LocalFilePan from "./addLayer/LocalFilePan/index";

//场景设置
import basicOptions from "./sceneAtttribute/basicOptions/index";
import sceneCamera from "./sceneAtttribute/camera/index";
import sceneLight from "./sceneAtttribute/light/index";
import ParticleSystem from "./sceneAtttribute/ParticleSystem/index";
import otherOptions from "./sceneAtttribute/otherOptions/index";

// 裁剪部分组件
import ClipBox from "./Clip/ClipBox/index.js";
import ClipCross from "./Clip/ClipCross/index.js";
import ClipPlane from "./Clip/ClipPlane/index.js";
import ClipPolygon from "./Clip/ClipPolygon/index.js";
import ClipBoxByEditor from "./Clip/ClpBoxByEditor/index";

// 地形部分组件
import TerrainOperation from "./TerrainAnalysis/TerrainOperation/index.js";
import TerrainFlood from "./TerrainAnalysis/TerrainFlood/index.js";
import TerrainSlope from "./TerrainAnalysis/TerrainSlope/index.js";
import TerrainIsoLine from "./TerrainAnalysis/TerrainIsoLine/index.js";

// 编辑部分组件
import addPonit from "./OnlineEdit/addPonit/index.js";
import addPolyline from "./OnlineEdit/addPolyline/index.js";
import addPolygon from "./OnlineEdit/addPolygon/index.js";

// // 城市设计
// import OnLineAnalysis from "./CityPlan/OnLineAnalysis/index.js";
// import backLineAnalysis from "./CityPlan/backLineAnalysis/index.js";
// import limitHeightAnalysis from "./CityPlan/limitHeightAnalysis/index.js";
// import serviceAreaAnalysis from "./CityPlan/serviceAreaAnalysis/index"

// 属性查询组件
// import drawRect from "./AttributeSearch/drawRect/index.js"

// 其他组件
// import GeologicBodyOperation from "./GeologicBodyAnalysis/GeologicBodyOperation/index.js";

// 自定义组件
// import loadingBar from "./loading/index.js";
import compass from "./Combinations/compass/index";

//特效
import airlinesTrailLines from "./specialEffects/airlinesTrailLines/index";
import scanEffect from "./specialEffects/scanEffect/index";
import windParticle from "./specialEffects/windParticle/index";

//热点
import ChinaEpidemicMap from "./hotSpot/ChinaEpidemicMap/index";
import WorldEpidemicMap from "./hotSpot/WorldEpidemicMap/index";

//组合组件
import LayerManage from "./Combinations/LayerManage/index"
import addLayers from "./Combinations/addLayersCombination/index";
import addBaseLayer from "./Combinations/addBaseLayer/index";
import TerrainAnalysis from "./Combinations/terrainCombination/index";
import ClipAnalysis from "./Combinations/clipCombination/index";
import Analysis_3D from "./Combinations/analysisCombination/index";
import toolBar from "./Combinations/toolBar/index";
import LayerAttribute from './Combinations/LayerAttribute/index'
import Measure from "./Combinations/Measure/index.js";
import OnlineEdit from "./Combinations/OnlineEditCombination/index.js";

// import cityPlanning from "./Combinations/CityPlanning/index.js";
import sceneAtttribute from "./Combinations/sceneAtttribute/index.js";

//全局注册
const components = [
    viewer,
    //分析
    Profile3D,
    ShadowQuery,
    SightLine,
    SkyLine,
    ViewShed,
    //场景
    basicOptions,
    sceneCamera,
    sceneLight,
    ParticleSystem,
    otherOptions,
    // 裁剪
    ClipBox,
    ClipCross,
    ClipPlane,
    ClipPolygon,
    ClipBoxByEditor,
    // 地形
    TerrainOperation,
    TerrainFlood,
    TerrainSlope,
    TerrainIsoLine,
    //编辑
    addPonit,
    addPolyline,
    addPolygon,
    //城市设计
    // OnLineAnalysis,
    // backLineAnalysis,
    // limitHeightAnalysis,
    // serviceAreaAnalysis,
    // 组合
    LayerManage,
    addLayers,
    TerrainAnalysis,
    ClipAnalysis,
    Analysis_3D,
    toolBar,
    addBaseLayer,
    LayerAttribute,
    Measure,
    OnlineEdit,
    // cityPlanning,
    sceneAtttribute,
    // // 自定义
    // loadingBar,
    compass,
    // 查询
    // drawRect,
    //添加图层
    WebServicePan,
    CustomServicePan,
    LocalFilePan,
    //特效
    airlinesTrailLines,
    scanEffect,
    windParticle,
    // 热点
    ChinaEpidemicMap,
    WorldEpidemicMap
]

const install = function(Vue, opts = {}) {
    if (install.installed) return;
    install.installed = true;
    components.forEach(component => {
        Vue.component(component.name, component);
    });
    installDrag(Vue);
}
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    install,
    components
}