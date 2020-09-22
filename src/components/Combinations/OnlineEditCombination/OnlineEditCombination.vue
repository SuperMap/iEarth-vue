<template>
  <div
    id="OnlineEdit"
    class="sm-panel"
    v-if="OnlineEdit"
    v-drag
    data-attr="drag"
  >
    <div class="sm-content">
      <div class="sm-panel-header">
        <span :class="{titleColor:addPoint}" class="title-txt" @click="choose(0)">添加点</span>
        <span :class="{titleColor:addPolyline}" class="title-txt" @click="choose(1)">添加线</span>
        <span :class="{titleColor:addPolygon}" class="title-txt" @click="choose(2)">添加面</span>
        <span class="closeBtn" @click="toggleVisibility">&times;</span>
      </div>

      <!-- 调用子组件 -->
      <add-point></add-point>
      <add-polyline></add-polyline>
      <add-polygon></add-polygon>
      
    </div>
  </div>
</template>

<script>
export default {
  name: "OnlineEdit",
  data() {
    return {
      sharedState: store.state,
    };
  },
  computed: {
    addPoint: function () {
      return this.sharedState.onlineEdit[0];
    },
    addPolyline: function () {
      return this.sharedState.onlineEdit[1];
    },
    addPolygon: function () {
      return this.sharedState.onlineEdit[2];
    },
    OnlineEdit: function () {
      return this.sharedState.toolBar[8];
    },
  },
  mounted() {
    // this.init();
  },
  methods: {
    toggleVisibility() {
      //控制组件界面隐
      store.setToolBarAction(8);
    },
    choose(i) {
      // 验证是否为点击事件，是则继续执行click事件，否则不执行
      let isClick = document
        .getElementById("OnlineEdit")
        .getAttribute("data-flag");
      if (isClick !== "true") {
        return false;
      }
      switch (i) {
        case 0:
          store.setOnlineEditrAction([1, 0, 0]);
          break;
        case 1:
          store.setOnlineEditrAction([0, 1, 0]);
          break;
        case 2:
          store.setOnlineEditrAction([0, 0, 1]);
          break;
        default:
          store.setOnlineEditrAction([1, 0, 0]);
      }
    },
  },

};
</script>

