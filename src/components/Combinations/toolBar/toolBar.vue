<template>
  <div v-if="ToolBarShow">
    <div class="toolBar">
      <div
        class="sm-btn sm-tool-btn"
        :class="{'sm-toggle-btn-only': !show}"
        title="图层管理"
        @click="choose(0)"
      >
        <span class="iconfont icontuceng"></span>
      </div>
      <ul v-if="show">
        <li class="sm-btn sm-tool-btn" title="添加图层" @click="choose(1)">
          <span class="iconfont iconjiazaituceng"></span>
        </li>
        <li class="sm-btn sm-tool-btn" title="底图设置" @click="choose(2)">
          <span class="iconfont iconditushezhi"></span>
        </li>
        <li class="sm-btn sm-tool-btn" title="场景" @click="choose(3)">
          <span class="iconfont iconchangjingshezhi"></span>
        </li>
        <li class="sm-btn sm-tool-btn" title="裁剪" @click="choose(4)">
          <span class="iconfont iconiEarth-R8-xiugai_caijian"></span>
        </li>
        <li class="sm-btn sm-tool-btn" title="地形" @click="choose(5)">
          <span class="iconfont icondixing"></span>
        </li>
        <li class="sm-btn sm-tool-btn" title="三维分析" @click="choose(6)">
          <span class="iconfont iconsanweifenxi"></span>
        </li>
        <li class="sm-btn sm-tool-btn" title="量算" @click="choose(7)">
          <span class="iconfont iconliangsuan"></span>
        </li>
        <li class="sm-btn sm-tool-btn" title="在线编辑" @click="choose(8)">
          <span class="iconfont iconzaixianbianji"></span>
        </li>
        <!-- <li class="sm-btn sm-tool-btn" title="城市设计" @click="choose(9)">
          <span class="iconfont iconVue-sightline"></span>
        </li> -->
      </ul>
      <div
        class="sm-tool-btn"
        @click="toggleVisibility"
        :class="{'sm-tool-btn-only': !show}"
      >
        <span
          class="iconfont"
          :class="show ? 'iconiEarth-R8-xiugai_shouqi':'iconiEarth-R8-xiugai_zhankai'"
        ></span>
      </div>
    </div>
    <!-- 调用子组件-->
    <layer-manage></layer-manage>
    <add-layers></add-layers>
    <add-base-layer></add-base-layer>
    <scene-atttribute></scene-atttribute>
    <terrain-analysis></terrain-analysis>
    <clip-analysis></clip-analysis>
    <sm3d-measure></sm3d-measure>
    <sm3d-analysis></sm3d-analysis>
    <online-edit></online-edit>
    <!-- <city-plan></city-plan> -->
    <!-- 图层属性 -->
    <layer-attribute></layer-attribute>
    <!-- 特效 -->
    <air-lines-trail-lines></air-lines-trail-lines>
    <scan-effect></scan-effect>
    <wind-particle></wind-particle>

  </div>
</template>

<script>
export default {
  name: "ToolBar",
  props: {},
  data() {
    return {
      sharedState: store.state,
      show: true,
    };
  },
  computed: {
    ToolBarShow:function(){
       return this.sharedState.ToolBarShow;
    }
  },

  methods: {
    toggleVisibility() {
      // 验证是否为点击事件，是则继续执行click事件，否则不执行
      // let isClick = document
      //   .getElementById("dragbtn")
      //   .getAttribute("data-flag");
      // if (isClick !== "true") {
      //   return false;
      // }
      //控制组件界面显隐
      this.show = !this.show;
    },
    choose(i) {
      // 验证是否为点击事件，是则继续执行click事件，否则不执行
      // let isClick = document
      //   .getElementById("dragbtn")
      //   .getAttribute("data-flag");
      // if (isClick !== "true") {
      //   return false;
      // }
      store.setToolBarAction(i);
    },
  },
};
</script>

<style lang="scss"  scoped>
@import "toolBar";
</style>