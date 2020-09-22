<template>
    <div id="terrainAnalysis" class="sm-panel" v-if="terrainShow" v-drag>
      <div class="sm-content">
        <div class="sm-panel-header">
          <span :class="{titleColor:OperationShow}" class="title-txt" @click="choose(0)">地形操作</span>
          <span :class="{titleColor:floodShow}" class="title-txt" @click="choose(1)">淹没分析</span>
          <span :class="{titleColor:slopeShow}" class="title-txt" @click="choose(2)">坡度坡向</span>
          <span :class="{titleColor:isolineShow}" class="title-txt" @click="choose(3)">等值线</span>
          <span class="closeBtn" @click="toggleVisibility">&times;</span>
        </div>
        <!-- 调用子组件 -->
        <sm3d-terrain-operation></sm3d-terrain-operation>
        <sm3d-terrain-flood></sm3d-terrain-flood>
        <sm3d-terrain-slope></sm3d-terrain-slope>
        <sm3d-terrain-isoline></sm3d-terrain-isoline>
      </div>
    </div>
</template>

<script>
export default {
  name: "TerrainAnalysis",
  props: {},
  data() {
    return {
      sharedState: store.state,
    };
  },

  computed: {
    OperationShow: function () {
      return this.sharedState.terrain[0];
    },
    floodShow: function () {
      return this.sharedState.terrain[1];
    },
    slopeShow: function () {
      return this.sharedState.terrain[2];
    },
    isolineShow: function () {
      return this.sharedState.terrain[3];
    },
    terrainShow: function () {
      return this.sharedState.toolBar[5];
    },
  },

  methods: {
    toggleVisibility() {
      //控制组件界面显隐
      store.setToolBarAction(5);
    },
    choose(i) {
      // 验证是否为点击事件，是则继续执行click事件，否则不执行
      let isClick = document
        .getElementById("terrainAnalysis")
        .getAttribute("data-flag");
      if (isClick !== "true") {
        return false;
      }
      switch (i) {
        case 0:
          store.setTerrainAction([1, 0, 0, 0]);
          break;
        case 1:
          store.setTerrainAction([0, 1, 0, 0]);
          break;
        case 2:
          store.setTerrainAction([0, 0, 1, 0]);
          break;
        case 3:
          store.setTerrainAction([0, 0, 0, 1]);
          break;
        default:
          store.setTerrainAction([1, 0, 0, 0]);
      }
    },
  },
  watch: {},

  mounted() {
    // console.log(this.terrainShow);
  },
};
</script>

