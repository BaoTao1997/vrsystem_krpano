<template>

  <div class="el-tree">
      <!--控制是否展开-->
      <!--<span @click.stop="expand">-->
          <!--<span v-if="expandicon===item.title" class="el-tree-node__expand-icon expanded"></span>-->
          <!--<span class="el-tree-node__expand-icon"></span>-->
      <!--</span>-->
      <div class="el-tree-node" v-for="(item,index) in hotspotList">
        <!--节点内容-->
        <ul>
          <li>
            <span>{{(item.name).split(/_/)[0]}}</span>
            <span>
              <!--添加按钮-->
              <el-button class="el-icon-edit"></el-button>
              <el-button class="el-icon-delete"></el-button>
          </span>
          </li>
        </ul>

      </div>

  </div>

</template>

<script>
    export default {
      name: "tree",
      props:['hotspotList'],
      data () {
        return {

        }
      },
      method:{

      },

    }
</script>

<style scoped>

</style>

<style type="text/scss">
  /*覆盖Element的样式*/
  span {
    .el-tree-node__expand-icon{
      position: absolute;
      top: 0;
      left: 0;
      height: 20px;
      width: 20px;
      color: hotpink;
      z-index: 999;
    }
    .custom-tree-node {
      padding: 10px 0;
    }
  }
</style>
