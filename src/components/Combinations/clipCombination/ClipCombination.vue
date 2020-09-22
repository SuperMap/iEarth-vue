<template>
  <div id="clipAnalysis" class="sm-panel" v-if="clipShow" v-drag data-attr="drag">
    <div class="sm-content">
      <div class="sm-panel-header">
        <span :class="{titleColor:boxShow}" class="title-txt" @click="choose(0)">Box裁剪</span>
        <span :class="{titleColor:planeShow}" class="title-txt" @click="choose(1)">平面裁剪</span>
        <span :class="{titleColor:crossShow}" class="title-txt" @click="choose(2)">Cross</span>
        <span :class="{titleColor:polygonShow}" class="title-txt" @click="choose(3)">多边形裁剪</span>
        <span class="closeBtn" @click="toggleVisibility">&times;</span>
      </div>

      <!-- 调用子组件 -->
      <sm3d-clip-box-byeditor></sm3d-clip-box-byeditor>
      <sm3d-clip-plane></sm3d-clip-plane>
      <sm3d-clip-cross></sm3d-clip-cross>
      <sm3d-clip-polygon></sm3d-clip-polygon>
    </div>
  </div>
</template>

<script>
export default {
  name: "ClipAnalysis",
  props: {},
  data() {
    return {
      sharedState: store.state,
    };
  },

  computed: {
    boxShow: function () {
      return this.sharedState.clip[0];
    },
    planeShow: function () {
      return this.sharedState.clip[1];
    },
    crossShow: function () {
      return this.sharedState.clip[2];
    },
    polygonShow: function () {
      return this.sharedState.clip[3];
    },
    clipShow: function () {
      return this.sharedState.toolBar[4];
    },
  },

  methods: {
    toggleVisibility() {
      //控制组件界面显隐
      store.setToolBarAction(4);
    },
    choose(i) {
      // 验证是否为点击事件，是则继续执行click事件，否则不执行
      let isClick = document
        .getElementById("clipAnalysis")
        .getAttribute("data-flag");
      if (isClick !== "true") {
        return false;
      }
      switch (i) {
        case 0:
          store.setClipAction([1, 0, 0, 0]);
          break;
        case 1:
          store.setClipAction([0, 1, 0, 0]);
          break;
        case 2:
          store.setClipAction([0, 0, 1, 0]);
          break;
        case 3:
          store.setClipAction([0, 0, 0, 1]);
          break;
        default:
          store.setClipAction([1, 0, 0, 0]);
      }
    },
  },

};
</script>
