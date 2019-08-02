<template>
    <div id="editor">
      <div class="sidelogo">
        <span><i class="el-icon-setting"></i></span>
        <span class="sidelogotxt">&nbsp;&nbsp;全景编辑</span>
      </div>
      <div class="save-view">
        <el-badge  v-show="toSaveFlag" is-dot>
          <el-button type="primary" icon="el-icon-search" @click="save()"
                     is-dot style="margin-left: 10px;">保存</el-button>
        </el-badge>
        <el-button type="primary" v-show="!toSaveFlag" @click="save()"
                   icon="el-icon-search" is-dot style="margin-left: 9px;">保存</el-button>
        <el-button type="primary" @click="preview()">预览<i class="el-icon-view"></i></el-button>
      </div>

      <el-menu default-active="2"   class="el-menu-vertical-demo">
        <el-submenu index="1">
            <template slot="title">
              <i class="iconfont icon-skin"></i>
              <span>&nbsp;&nbsp;漫游皮肤</span>
            </template>
            <el-menu-item-group>
              <template slot="title">皮肤样式</template>
              <el-menu-item index="1-1">
                <el-switch
                v-model="SkinON"
                active-text="开启"
                inactive-text="不开启" @change="krpanoControl(SkinON)">
              </el-switch>
              </el-menu-item>
              <el-menu-item index="1-2">
              <el-select v-model="SkinValue" placeholder="请选择" @change="switchSkin(SkinValue)">
                <el-option
                  v-for="item in SkinOptions"
                  :key="item.SkinValue"
                  :label="item.label"
                  :value="item.SkinValue">
                </el-option>
              </el-select>
              </el-menu-item>
            </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>热点</span>
          </template>
          <el-menu-item-group>
            <template slot="title">添加热点</template>
            <el-menu-item index="2-1">
              <el-button type="primary" @click="showHotspotDetail()" size="medium">添加热点</el-button>
            </el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <template slot="title">热点管理</template>
            <el-menu-item index="2-2">
              <el-button type="primary" size="medium" @click="showHotspotManage()">热点管理</el-button>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-document"></i>
            <span slot="title">基本设置</span>
          </template>
          <el-menu-item-group>
            <template slot="title"><i class="iconfont icon-shexiangji_shijiao"></i>视角</template>
            <el-menu-item index="3-1">
              <el-button type="primary" class="iconfont icon-shexiangji_shijiao"
                         @click="showViewManage()" size="small">视角设置</el-button>
            </el-menu-item>
            <el-menu-item index="3-2">
              <el-select v-model="PanoramaValue" placeholder="请选择" @change="switchPanoramaType(PanoramaValue)">
                <el-option
                  v-for="item in PanoramaOptions"
                  :key="item.PanoramaValue"
                  :label="item.label"
                  :value="item.PanoramaValue">
                </el-option>
              </el-select>
            </el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
          <template slot="title"><i class="iconfont icon-shijiaochangjingdaohang"></i>场景</template>
          <el-menu-item index="3-2">
            <el-button type="primary" @click="showSceneManagement()" size="medium"
                       class="iconfont icon-shijiaochangjingdaohang">场景管理</el-button>
          </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span slot="title">全局设置</span>
          </template>
          <el-menu-item-group>
            <template slot="title">特效设置</template>
            <el-menu-item index="4-1">
              <el-switch
                v-model="value3"
                inactive-text="开启小行星特效"
                @change="littlePlane()">
              </el-switch>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>


      <div class="hotspot-detail" v-show="showHotspotDetailFlag" style="z-index: 1000;">
        <div class="hotspot-detail-header">
          <span>{{currentHotspot.name ? '编辑' : '新增'}}热点</span>
          <i class="el-icon-close delete" @click="hideHotspotDetail()"></i>
          <div class="line"></div>
        </div>
        <div class="hotspot-detail-content">
            <label class="label">图标样式</label>
            <div class="hotspot-detail-style-list">
              <div v-for="style in hotspotStyleList">
                <div class="hotspot-detail-style" @click="selectHotspotStyle(style.name)"
                     :class="{'hotspot-detail-style-selected': style.name==currentHotspot.style}">
                  <img :src="style.imgUrl" style="height: 64px;">
                </div>
              </div>
            </div>
        </div>

        <div class="hotspot-detail-content">
        <label class="label">热点类型</label>
        <el-select v-model="hotSpotValue" placeholder="请选择" style="margin-top: 10px; width: 150px;">
          <el-option
            v-for="item in hotSpotOptions"
            :key="item.hotSpotValue"
            :label="item.label"
            :value="item.hotSpotValue">
          </el-option>
        </el-select>
      </div>

      <div class="hotspot-detail-content">
        <label class="label">切换效果</label>
        <el-select v-model="switchValue" placeholder="请选择" style="margin-top: 10px; width: 150px;">
          <el-option
            v-for="item in switchOptions"
            :key="item.switchValue"
            :label="item.label"
            :value="item.switchValue">
          </el-option>
        </el-select>
      </div>

      <div class="hotspot-detail-content">
        <label class="label">目标场景</label>

        <el-scrollbar class="scrollbar">
        <div class="hotspot-detail-scene-list">
          <div  v-for="scene in sceneListExceptCurrent">
            <div class="hotspot-detail-scene" @click="selectHotspotLinkedScene(scene.name)"
                 :class="{'hotspot-detail-scene-selected': scene.name==currentHotspot.linkedscene}">
              <img :src="scene.thumburl" style="height: 64px;">
              <span>{{(scene.name).split(/_/)[1]}}</span>
            </div>
          </div>
        </div>
        </el-scrollbar>

      </div>

      <div class="hotspot-detail-content">
        <div class="hotspot-detail-button">
          <el-button type="success" @click="saveCurrentHotspot()">确定</el-button>
        </div>
        <div class="hotspot-detail-button" v-show="currentHotspot.name">
          <el-button type="danger" @click="deleteCurrentHotspot()">删除</el-button>
        </div>
      </div>

    </div>

      <div class="hotspot-detail" v-show="showSceneManagementFlag">
        <div class="hotspot-detail-header">
          <span>场景管理</span>
          <i class="el-icon-close delete" @click="hideSceneManagement()"></i>
          <div class="line"></div>
        </div>


        <div class="hotspot-detail-content" style="height:668px; overflow-y: auto;">
          <label class="label">场景列表</label>
          <ul class="scene-item" v-for="scene in sceneList"
               :class="{'scene-item-selected' : scene.index == currentSceneIndex}">
            <li>
              <img :src="scene.thumburl" style="height: 128px;" @click="changeScene(scene)" >
              <div>
                <span>{{(scene.name).split(/_/)[1]}}</span>
              </div>
            </li>
            <el-button-group class="group">
            <el-button type="primary" size="small" class="button" icon="el-icon-edit"
                       @click="showModifySceneName(scene)">

            </el-button>
            <el-button type="primary" size="small" class="button" icon="el-icon-share"
                       @click="setWelcome(scene.index)">

            </el-button>
            <el-button type="primary" size="small" class="button" icon="el-icon-delete">

            </el-button>
            <el-button type="primary" size="small" class="button" icon="el-icon-more">

            </el-button>
            </el-button-group>
          </ul>
        </div>


      </div>

      <div class="hotspot-detail" v-show="showHotspotManagementFlag">
        <div class="hotspot-detail-header">
          <span>热点管理</span>
          <i class="el-icon-close delete" @click="hideHotspotManage()"></i>
          <div class="line"></div>
        </div>


        <div class="hotspot-detail-content" style="height:668px; overflow-y: auto;">
          <div class="hotspot-list">
            <div v-for="hotspotItem in hotspotList" @click="showHotspotDetail(hotspotItem)">
              <div  class="hotspot-item" v-if="(hotspotItem.name).split(/_/)[0] !== 'skin'"
                    :class="{'hotspot-item-selected':  selectedHotspot.name == hotspotItem.name}">
                <img :src="hotspotItem.url">
                <div>场景切换</div>
              </div>
            </div>
          </div>
        </div>


      </div>

      <div class="camera" v-show="showViewManagementFlag">
        <div class="camera-top"></div>
        <div class="camera-bottom"></div>
        <div class="camera-left"></div>
        <div class="camera-right"></div>
        <div class="camera-left-top"></div>
        <div class="camera-top-left"></div>
        <div class="camera-top-right"></div>
        <div class="camera-right-top"></div>
        <div class="camera-left-bottom"></div>
        <div class="camera-bottom-left"></div>
        <div class="camera-bottom-right"></div>
        <div class="camera-right-bottom"></div>
        <el-button type="primary" round @click="setDefaultView()" class="camera-button">设为初始视角</el-button>
        <!--<a class="button is-info camera-button" ></a>-->
      </div>

      <div class="hotspot-detail" v-show="showViewManagementFlag">
        <div class="hotspot-detail-header">
          <span>视角设置</span>
          <i class="el-icon-close delete" @click="hideViewManage()"></i>
          <div class="line"></div>
        </div>


        <div class="hotspot-detail-content" style="height:668px; overflow-y: auto;">
          <label class="label" style="display:block; margin-bottom: 20px;">自动旋转
            <el-switch
              v-model="rotateON"
              active-text=""
              inactive-text=""
              style="padding-left: 74px"
              @change="updatedAutoSpin()">
            </el-switch>
          </label>

          <label class="label" style="display:block; position: relative;">等待时间(秒)
            <el-input v-model="autoSpinWaitingTime" class="wait" @change="updatedAutoSpin()"
                      placeholder="请输入内容" :disabled="rotateON"></el-input>
          </label>

          <div class="view-slider">
            <div class="view-top-slider" @mousedown="startMoveInitFov()"
                  @mousemove="moveInitFov()" @mouseup="stopMoveInitFov()">
              <span :style="{ left: initFov + 'px'}"><i class="el-icon-location"></i></span>
            </div>
            <el-slider
              style="width: 180px;"
              v-model="sliderValue"
              range
              :max="180">
            </el-slider>
          </div>

          <el-row>
            <el-col :span="8"><div class="grid-content">
              <span>最近</span>
              <el-input v-model="minFov" class="input" placeholder="请输入内容" :disabled="true"></el-input>
            </div></el-col>
            <el-col :span="8"><div class="grid-content">
              <span>初始</span>
              <el-input v-model="initFov" class="input" placeholder="请输入内容" :disabled="true"></el-input>
            </div></el-col>
            <el-col :span="8"><div class="grid-content">
              <span>最远</span>
              <el-input v-model="maxFov" class="input" placeholder="请输入内容" :disabled="true"></el-input>
            </div></el-col>
          </el-row>

        </div>

      </div>

      <el-dialog
        title="提示"
        :visible.sync="showModifySceneNameFlag"
        width="30%"
        :before-close="closeModifySceneName">
        <span>场景名称</span>
        <el-input v-model="toModifyScene.name" placeholder="请输入内容"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showModifySceneNameFlag = false">取 消</el-button>
          <el-button type="primary" :disabled="!sceneNameValid" @click="modifySceneName()">确 定</el-button>
        </span>
      </el-dialog>

    </div>
</template>

<script>

    // import Tree from './Tree'
    export default {
      name: "editor",
      // components: {Tree},
      data() {
        return {
          value3: false,
          //跳转热点的切换效果
          switchOptions: [{
            switchValue: '选项1',
            label: '淡入淡出'
          }],
          switchValue: '选项1',
          //热点类型
          hotSpotOptions: [{
            hotSpotValue: '选项1',
            label: '跳转热点'
          }],
          hotSpotValue: '选项1',
          //视角的选择框参数
          PanoramaOptions: [ {
            PanoramaValue: '选项0',
            label: '正常视角'
          },{
            PanoramaValue: '选项1',
            label: '鱼眼投影视角'
          }, {
            PanoramaValue: '选项2',
            label: '球极平面视角'
          }, {
            PanoramaValue: '选项3',
            label: '建筑视角'
          }, {
            PanoramaValue: '选项4',
            label: '帕尼尼视角'
          }, {
            PanoramaValue: '选项5',
            label: '小行星视角'
          }],
          PanoramaValue: '选项0',//输入上面数组的value值,设为默认选项
          //皮肤的选择框参数
          SkinOptions: [{
            SkinValue: '选项1',
            label: '默认皮肤'
          }, {
            SkinValue: '选项2',
            label: '轻量皮肤'
          }, {
            SkinValue: '选项3',
            label: '超轻量皮肤'
          }, {
            SkinValue: '选项4',
            label: '镜框皮肤'
          }, {
            SkinValue: '选项5',
            label: '复古皮肤'
          }, {
            SkinValue: '选项6',
            label: '复古圆角皮肤'
          }, {
            SkinValue: '选项7',
            label: '黑色皮肤'
          }],
          SkinValue: '选项1',//输入上面数组的value值,设为默认选项
          //slider滑块框最小边界值和最大边界值
          slider:[0,180],
          //控制皮肤的开启与关闭
          SkinON: true,
          //展示修改场景名称标识
          showModifySceneNameFlag: false,
          //待修改场景对象
          toModifyScene: {},
          //控制场景自动旋转
          rotateON: false,
          //自动旋转等待时间
          autoSpinWaitingTime: 0,
          //最小fov
          minFov: 0,
          //最大fov
          maxFov: 180,
          //初始fov
          initFov: 90,
          //初始fov移动条移动开关
          initFovMoveFlag: false,
          //krpano对象
          krpano: document.querySelector('#krpanoSWFObject'),
          //待保存标识
          toSaveFlag: false,
          //场景列表
          sceneList: [],
          //当前场景序号
          currentSceneIndex: 0,
          //欢迎页场景序号
          welcomeSceneIndex: 0,
          //展示热点详情标识
          showHotspotDetailFlag: false,
          //展示场景管理标识
          showSceneManagementFlag: false,
          //展示热点管理标识
          showHotspotManagementFlag: false,
          //展示视角设置
          showViewManagementFlag: false,
          //热点列表
          hotspotList: [],
          //热点移动状态
          isHotspotMoving: false,
          //选中移动热点
          selectedHotspot: {},
          //当前热点
          currentHotspot: {
            style: null,
            linkedscene: null
          },
          //热点图标样式列表
          hotspotStyleList: [
            {
              name: 'skin_hotspotstyle',
              imgUrl: '../static/skin/vtourskin_hotspot.png'
            }
          ],
          //接口请求状态
          requesting: false,
        };
      },
      mounted:function (){
        //入口js文件已将此函数定义到window，krpano加载完成后调用
        //初始化场景
        this.sceneList = this.krpano.get('scene').getArray();
        // console.log(this.sceneList);
        // console.log(this.krpano.get('scene').getItem(this.krpano.get('xml.scene')));
        this.currentSceneIndex = this.krpano.get('scene').getItem(this.krpano.get('xml.scene')).index;
        this.welcomeSceneIndex = this.krpano.get('scene').getItem(this.krpano.get('startscene')).index;
        //热点移动事件初始化
        let thisVue = this;
        let pano = document.querySelector('#pano');
        pano.onmouseup = function () {
          thisVue.isHotspotMoving = false
        };
        pano.onmouseout = function () {
          thisVue.isHotspotMoving = false
        };
        pano.onmousemove = function () {
          thisVue.moveHotspot();
        };
        //模块数据初始化
        this.initView();
        this.initHotSpot();
      },
      computed: {
        //场景名称校验
        sceneNameValid: function() {
          return this.toModifyScene.name && this.toModifyScene.name.length > 0
            && this.toModifyScene.name.length < 30;
        },
        //视角拖动条范围值
        sliderValue: {
          get: function () {
            return [
              this.minFov,
              this.maxFov,
            ]
          },
          set: function (val) {
            let min = Math.min(val[0], val[1]);
            let max = Math.max(val[0], val[1]);
            if (this.sceneList[this.currentSceneIndex]) {
              if (this.krpano.get('view.fovmin') !== min) {
                this.krpano.set('view.fovmin', min);
                this.sceneList[this.currentSceneIndex].fovmin = min;
                this.toSaveFlag = true;
              }
              if (this.krpano.get('view.fovmax') !== max) {
                this.krpano.set('view.fovmax', max);
                this.sceneList[this.currentSceneIndex].fovmax = max;
                this.toSaveFlag = true;
              }
            }
            this.minFov = min;
            this.maxFov = max;
          }
        },
        //除当前场景外场景列表
        sceneListExceptCurrent: function() {
          let scenes = [];
          this.sceneList.forEach((scene) => {
            if (scene.index !== this.currentSceneIndex) {
              scenes.push(scene);
            }
          });
          return scenes;
        },
      },
      methods: {
        //入口js文件已将此函数定义到window，krpano加载完成后调用
        onready() {
          //初始化场景
          this.sceneList = this.krpano.get('scene').getArray();
          this.currentSceneIndex = this.krpano.get('scene').getItem(this.krpano.get('xml.scene')).index;
          this.welcomeSceneIndex = this.krpano.get('scene').getItem(this.krpano.get('startscene')).index;
          //热点移动事件初始化
          let thisVue = this;
          let pano = document.querySelector('#pano');
          pano.onmouseup = function () {
            thisVue.isHotspotMoving = false
          };
          pano.onmouseout = function () {
            thisVue.isHotspotMoving = false
          };
          pano.onmousemove = function () {
            thisVue.moveHotspot()
          };
          //模块数据初始化
          this.initView();
          this.initHotSpot();
        },
        //根据krpano参数初始化视角和热点模块数据
        initView() {
          //初始化视角参数
          this.autoSpinWaitingTime = this.krpano.get('autorotate.waittime');
          this.autoSpinFlag = this.krpano.get('autorotate.enabled');
          this.minFov = this.krpano.get('view.fovmin');
          this.maxFov = this.krpano.get('view.fovmax');
          this.initFov = this.krpano.get('view.fov');
        },
        initHotSpot() {
          this.sceneList[this.currentSceneIndex].hotspots = [];
          this.hotspotList = [];
          this.krpano.get('hotspot').getArray().forEach((hotspot) => {
            if (hotspot.name !== 'webvr_prev_scene' && hotspot.name !== 'webvr_next_scene'
                && hotspot.name !== 'vr_cursor') {
              this.hotspotList.push(hotspot);
              this.sceneList[this.currentSceneIndex].hotspots.push(hotspot);
              this.initHotspotEvent(hotspot);
            }
          })
        },

        //热点事件初始化
        initHotspotEvent(hotspot) {
          let thisVue = this;
          hotspot.ondown = function () {
            thisVue.selectedHotspot = hotspot;
            thisVue.selectHotspot();
            thisVue.isHotspotMoving = true
          };
          hotspot.onover = function () {
            thisVue.selectedHotspot = hotspot;
          };
          hotspot.onout = function () {
            thisVue.selectedHotspot = {}
          };
          hotspot.onclick = null;
        },
        //热点坐标与鼠标坐标偏移计算
        selectHotspot() {
          this.krpano.call('screentosphere(mouse.x, mouse.y, mouseath, mouseatv);');
          this.selectedHotspot.athDis = this.selectedHotspot.ath - this.krpano.get('mouseath');
          this.selectedHotspot.atvDis = this.selectedHotspot.atv - this.krpano.get('mouseatv');
        },
        //预览
        preview() {
          window.open('../../static/tour.html');
        },
        //隐藏或者显示下方自带控制条
        krpanoControl: function(e){
          this.krpano.set('layer[skin_control_bar].visible', e);
          this.krpano.set('layer[skin_splitter_bottom].visible', e);
          this.krpano.set('layer[skin_scroll_window].visible', e);
        },
        //开启小行星特效
        littlePlane: function(e){
          console.log(this.krpano.get("skin_setting"));
        },
        //动态切换皮肤
        switchSkin(skin) {
          if(skin === '选项1'){
            this.krpano.call("set(design, 'default');\n" +
              "\t\tcopy(skin_thumbs_last_state, layer[skin_thumbs].state);\n" +
              "\t\tloadpanoscene('%CURRENTXML%/skinselect.xml', get(xml.scene), null, IGNOREKEEP|KEEPVIEW|KEEPMOVING, BLEND(0.5));");
          }
          if(skin === '选项2'){
            this.krpano.call("set(design, 'flat_light');\n" +
              "\t\tcopy(skin_thumbs_last_state, layer[skin_thumbs].state);\n" +
              "\t\tloadpanoscene('%CURRENTXML%/skinselect.xml', get(xml.scene), null, IGNOREKEEP|KEEPVIEW|KEEPMOVING, BLEND(0.5));");
          }
          if(skin === '选项3'){
            this.krpano.call("set(design, 'ultra_light');\n" +
              "\t\tcopy(skin_thumbs_last_state, layer[skin_thumbs].state);\n" +
              "\t\tloadpanoscene('%CURRENTXML%/skinselect.xml', get(xml.scene), null, IGNOREKEEP|KEEPVIEW|KEEPMOVING, BLEND(0.5));");
          }
          if(skin === '选项4'){
            this.krpano.call("set(design, 'glass');\n" +
              "\t\tcopy(skin_thumbs_last_state, layer[skin_thumbs].state);\n" +
              "\t\tloadpanoscene('%CURRENTXML%/skinselect.xml', get(xml.scene), null, IGNOREKEEP|KEEPVIEW|KEEPMOVING, BLEND(0.5));");
          }
          if(skin === '选项5'){
            this.krpano.call("set(design, '117');\n" +
              "\t\tcopy(skin_thumbs_last_state, layer[skin_thumbs].state);\n" +
              "\t\tloadpanoscene('%CURRENTXML%/skinselect.xml', get(xml.scene), null, IGNOREKEEP|KEEPVIEW|KEEPMOVING, BLEND(0.5));");
          }
          if(skin === '选项6'){
            this.krpano.call("set(design, '117_round');\n" +
              "\t\tcopy(skin_thumbs_last_state, layer[skin_thumbs].state);\n" +
              "\t\tloadpanoscene('%CURRENTXML%/skinselect.xml', get(xml.scene), null, IGNOREKEEP|KEEPVIEW|KEEPMOVING, BLEND(0.5));");
          }
          if(skin === '选项7'){
            this.krpano.call("set(design, 'black');\n" +
              "\t\tcopy(skin_thumbs_last_state, layer[skin_thumbs].state);\n" +
              "\t\tloadpanoscene('%CURRENTXML%/skinselect.xml', get(xml.scene), null, IGNOREKEEP|KEEPVIEW|KEEPMOVING, BLEND(0.5));");
          }
        },
        //切换观看视角
        switchPanoramaType(value) {
          if(value === '选项0'){
            this.krpano.call("skin_view_look_straight();\n" +
              "\t\tset(view.stereographic, true);\n" +
              "\t\tset(view.fovmax, get(xml.view.fovmax));\n" +
              "\t\ttween(view.distortionfovlink,   0.5, distance(1.0,0.5));\n" +
              "\t\ttween(view.architectural, 0.0, distance(1.0,0.5));\n" +
              "\t\ttween(view.pannini,       0.0, distance(1.0,0.5));\n" +
              "\t\ttween(view.distortion,    0.0, distance(1.0,0.5));");
          }
          if(value === '选项1'){
            this.krpano.call("skin_view_look_straight();\n" +
              "          set(view.stereographic, true);\n" +
              "          set(view.fovmax, get(xml.view.fovmax));\n" +
              "          tween(view.distortionfovlink,   0.5, distance(1.0,0.5));\n" +
              "          tween(view.architectural, 0.0,  distance(1.0,0.5));\n" +
              "          tween(view.pannini,       0.0,  distance(1.0,0.5));\n" +
              "          tween(view.distortion,    0.35, distance(1.0,0.5));");
          }
          if(value === '选项2'){
            this.krpano.call("skin_view_look_straight();\n" +
              "\t\tset(view.stereographic, true);\n" +
              "\t\tset(view.fovmax, get(xml.view.fovmax));\n" +
              "\t\ttween(view.distortionfovlink,   0.5, distance(1.0,0.5));\n" +
              "\t\ttween(view.architectural, 1.0, distance(1.0,0.5));\n" +
              "\t\ttween(view.pannini,       0.0, distance(1.0,0.5));\n" +
              "\t\ttween(view.distortion,    0.0, distance(1.0,0.5));");
          }
          if(value === '选项3'){
            this.krpano.call("skin_view_look_straight();\n" +
              "\t\tset(view.stereographic, true);\n" +
              "\t\tset(view.fovmax, get(xml.view.fovmax));\n" +
              "\t\ttween(view.distortionfovlink,   0.5, distance(1.0,0.5));\n" +
              "\t\ttween(view.architectural, 0.0, distance(1.0,0.5));\n" +
              "\t\ttween(view.pannini,       0.0, distance(1.0,0.5));\n" +
              "\t\ttween(view.distortion,    1.0, distance(1.0,0.8));");
          }
          if(value === '选项4'){
            this.krpano.call("skin_view_look_straight();\n" +
              "\t\tset(view.stereographic, true);\n" +
              "\t\tset(view.fovmax, get(xml.view.fovmax));\n" +
              "\t\ttween(view.distortionfovlink,   0.5, distance(1.0,0.5));\n" +
              "\t\ttween(view.architectural, 0.0, distance(1.0,0.5));\n" +
              "\t\ttween(view.pannini,       1.0, distance(1.0,0.8));\n" +
              "\t\tif(view.distortion LT 0.1,\n" +
              "\t\t\ttween(view.distortion, 1.0, distance(1.0,0.8));\n" +
              "\t\t  );");
          }
          if(value === '选项5'){
            this.krpano.call("set(view.stereographic, true);\n" +
              "\t\tset(view.fovmax, get(xml.view.fovmax));\n" +
              "\t\ttween(view.distortionfovlink,   0.5, distance(1.0,0.5));\n" +
              "\t\ttween(view.architectural, 0.0, distance(1.0,0.5));\n" +
              "\t\ttween(view.pannini,       0.0, distance(1.0,0.5));\n" +
              "\t\ttween(view.distortion,    1.0, distance(1.0,0.8));\n" +
              "\t\ttween(view.fov,           150, distance(150,0.8));\n" +
              "\t\ttween(view.vlookat,        90, distance(100,0.8));\n" +
              "\t\tadd(new_hlookat, view.hlookat, 123.0);\n" +
              "\t\ttween(view.hlookat, get(new_hlookat), distance(100,0.8));");
          }
        },
        //选择热点图标样式
        selectHotspotStyle(name) {
          this.currentHotspot.style = name;
        },
        //选择切换场景热点目标场景
        selectHotspotLinkedScene(name) {
          this.currentHotspot.linkedscene = name;
        },
        //保存当前热点变动
        saveCurrentHotspot() {
          if (!this.currentHotspot.name) {
            // 计算中间位置的球面坐标
            this.krpano.set('halfHeight', this.krpano.get('stageheight') / 2);
            this.krpano.set('halfWidth', this.krpano.get('stagewidth') / 2);
            this.krpano.call('screentosphere(halfWidth,halfHeight,init_h,init_v);');
            let init_h = this.krpano.get('init_h');
            let init_v = this.krpano.get('init_v');
            //添加热点
            let name = 'spot' + new Date().getTime();
            this.krpano.call('addhotspot(' + name + ');');
            this.krpano.get('hotspot[' + name + ']').loadstyle(this.currentHotspot.style);
            this.krpano.set('hotspot[' + name + '].ath', init_h);
            this.krpano.set('hotspot[' + name + '].atv', init_v);
            this.krpano.set('hotspot[' + name + '].linkedscene', this.currentHotspot.linkedscene);
            this.krpano.set('hotspot[' + name + '].dive', this.currentHotspot.dive);
          }
          this.initHotSpot();
          this.showHotspotDetailFlag = false;
          this.toSaveFlag = true;
        },
        //删除热点
        deleteCurrentHotspot() {
          this.krpano.call('removehotspot(' + this.currentHotspot.name + ')');
          this.initHotSpot();
          this.showHotspotDetailFlag = false;
          this.toSaveFlag = true;
        },
        //热点移动
        moveHotspot() {
          if (this.isHotspotMoving) {
            this.krpano.call('screentosphere(mouse.x, mouse.y, mouseath, mouseatv);');
            this.krpano.set('hotspot[' + this.selectedHotspot.name + '].ath'
              , this.krpano.get("mouseath") + this.selectedHotspot.athDis);
            this.krpano.set('hotspot[' + this.selectedHotspot.name + '].atv'
              , this.krpano.get("mouseatv") + this.selectedHotspot.atvDis);
          }
        },
        //切换当前场景
        changeScene(scene) {
          if (this.currentSceneIndex === scene.index) return;
          this.currentSceneIndex = scene.index;
          this.krpano.call('loadscene(' + scene.name + ')');
          let currentScene = this.sceneList[this.currentSceneIndex];
          //加载临时存储数据应用于krpano
          //自动旋转
          if (currentScene.autorotate) {
            this.krpano.set('autorotate.enabled', currentScene.autorotate.enabled);
            this.krpano.set('autorotate.waittime', currentScene.autorotate.waitTime);
          }
          if (this.autoSpinFlag) this.krpano.get('autorotate').interrupt();
          //热点
          if (currentScene.hotspots && currentScene.hotspotsModifyFlag) {
            //清除原有热点
            this.krpano.get('hotspot').getArray().forEach((hotspot) => {
              if (hotspot.name !== 'webvr_prev_scene' &&
                  hotspot.name !== 'webvr_next_scene' && hotspot.name !== 'vr_cursor') {
                this.krpano.call('removehotspot(' + hotspot.name + ')')
              }
            });
            //添加存储数据热点
            currentScene.hotspots.forEach((hotspot) => {
              this.krpano.call('addhotspot(' + hotspot.name + ');');
              this.krpano.set('hotspot[' + hotspot.name + '].ath', hotspot.ath);
              this.krpano.set('hotspot[' + hotspot.name + '].atv', hotspot.atv);
              this.krpano.set('hotspot[' + hotspot.name + '].linkedscene', hotspot.linkedscene);
              this.krpano.set('hotspot[' + hotspot.name + '].dive', hotspot.dive);
              this.krpano.get('hotspot[' + hotspot.name + ']').loadstyle(hotspot.style);
            });
          }
          //初始化模块数据
          this.initView();
          this.initHotSpot();
        },
        //设置为home页
        setWelcome(index) {
          this.welcomeSceneIndex = index;
          this.toSaveFlag = true;
        },
        //显示修改场景弹窗
        showModifySceneName(scene) {
          this.toModifyScene = {
            name: scene.name,
            index: scene.index
          };
          this.showModifySceneNameFlag = true;
        },
        //修改场景名称
        modifySceneName() {
          if (!this.sceneNameValid) return;
          //判断是否重复
          let repeatFlag = false;
          for (let scene of this.sceneList) {
            if (scene.name === this.toModifyScene.name) {
              repeatFlag = true;
              break;
            }
          }
          if (repeatFlag) {
            alert('场景名称重复');
            return;
          }
          //修改场景名称（相关联的热点，当前场景scene名称也需修改）
          let oldName = this.sceneList[this.toModifyScene.index].name.toString();
          let newName = this.toModifyScene.name.toString();
          //修改krpano场景对象名称
          this.krpano.get('scene').renameItem(oldName, newName);
          this.sceneList[this.toModifyScene.index].name = newName;
          //修改krpano热点指向场景名称
          this.sceneList.forEach((scene) => {
            if (scene.hotspots && scene.index !== this.toModifyScene.index) {
              scene.hotspots.forEach((hotspot) => {
                if (hotspot.linkedscene === oldName) {
                  hotspot.linkedscene = newName;
                  scene.hotspotsModifyFlag = true;
                  if (scene.index === this.currentSceneIndex)
                    this.krpano.set('hotspot[' + hotspot.name + '].linkedscene', newName);
                }
              })
            }
          });
          this.showModifySceneNameFlag = false;
          this.toSaveFlag = true;
        },
        //关闭修改场景弹窗
        closeModifySceneName() {
          this.showModifySceneNameFlag = false
        },
        //设为初始视角
        setDefaultView() {
          let fov = Math.round(this.krpano.get('view.fov'));
          this.initFov = fov;
          this.sceneList[this.currentSceneIndex].fov = fov;
          this.sceneList[this.currentSceneIndex].initH = this.krpano.get('view.hlookat');
          this.sceneList[this.currentSceneIndex].initV = this.krpano.get('view.vlookat');
          this.toSaveFlag = true;
        },
        //自动旋转变更
        updatedAutoSpin() {
          this.krpano.set('autorotate.enabled', this.rotateON);
          this.krpano.set('autorotate.waittime', this.autoSpinWaitingTime);
          if (this.rotateON) this.krpano.get('autorotate').interrupt();
          this.sceneList[this.currentSceneIndex].autorotate = {
            enabled: this.rotateON,
            waitTime: Number(this.autoSpinWaitingTime)
          };
          this.toSaveFlag = true;
        },
        //视角条拖动
        moveInitFov() {
          if (this.initFovMoveFlag) {
            let slider = document.querySelector('.view-top-slider');
            let left = window.event.clientX - slider.offsetLeft;
            if (left < Math.round(this.minFov)) {
              console.log(left);
              console.log(Math.round(this.minFov));
              this.stopMoveInitFov();
              left = Math.round(this.minFov);
            } else if (left > Math.round(this.maxFov)) {
              console.log(left);
              console.log(Math.round(this.maxFov));
              this.stopMoveInitFov();
              left = Math.round(this.maxFov);
            }
            this.initFov = left;
            this.krpano.set('view.fov', this.initFov);
            this.sceneList[this.currentSceneIndex].fov = this.initFov;
            this.toSaveFlag = true;
          }
        },
        startMoveInitFov() {
          this.initFovMoveFlag = true;
          this.moveInitFov();
        },
        stopMoveInitFov() {
          this.initFovMoveFlag = false;
        },
        //显示热点详情
        showHotspotDetail(hotspotItem) {
          this.currentHotspot = hotspotItem ? hotspotItem : {
            style: this.hotspotStyleList[0].name,
            linkedscene: this.sceneListExceptCurrent[0].name,
            dive: true
          };
          this.showHotspotDetailFlag = true;
        },
        //隐藏热点详情
        hideHotspotDetail() {
          this.showHotspotDetailFlag = false;
        },
        //显示场景管理
        showSceneManagement() {
          this.showSceneManagementFlag = true;
        },
        //隐藏场景管理
        hideSceneManagement() {
          this.showSceneManagementFlag = false;
        },
        //显示热点管理
        showHotspotManage() {
          this.showHotspotManagementFlag = true;
        },
        //隐藏热点管理
        hideHotspotManage() {
          this.showHotspotManagementFlag = false;
        },
        //显示视角设置
        showViewManage() {
          this.showViewManagementFlag = true;
        },
        //隐藏视角设置
        hideViewManage() {
          this.showViewManagementFlag = false;
        },
        //选择热点图标样式
        selectHotspotStyle(name) {
          this.currentHotspot.style = name;
        },
        //保存
        save() {
          if (!this.toSaveFlag) return;
          if (this.requesting) {
            alert('保存中，请稍后再试');
            return;
          }
          this.requesting = true;
          let data = [];
          this.sceneList.forEach((scene) => {
            let sceneData = {
              index: scene.index,
              name: scene.name,
              welcomeFlag: scene.index == this.welcomeSceneIndex,
              autorotate: scene.autorotate ? scene.autorotate : null,
              fov: scene.fov ? scene.fov : null,
              fovmax: scene.fovmax ? scene.fovmax : null,
              fovmin: !isNaN(Number.parseInt(scene.fovmin)) ? scene.fovmin : null,
              initH: scene.initH ? scene.initH : null,
              initV: scene.initV ? scene.initV : null
            };
            if (scene.hotspots) {
              let hotSpots = [];
              scene.hotspots.forEach((hotspot) => {
                if(hotspot.name.split(/_/)[0] !== 'skin') {
                  hotSpots.push({
                    ath: hotspot.ath,
                    atv: hotspot.atv,
                    name: hotspot.name,
                    linkedscene: hotspot.linkedscene,
                    style: hotspot.style,
                    dive: hotspot.dive ? hotspot.dive : true,
                  })
                }
              });
              sceneData.hotSpots = hotSpots;
            }
            data.push(sceneData)
          });
          console.log(data);
          let url ='/api/save';
          this.$axios.post(url,{
            body: JSON.stringify(data)
          },{
            header:{
              'Content-Type': 'application/json; charset=utf-8'
            },
          }).then((res) => {
              this.requesting = false;
              if (res.status === 200) {
                this.toSaveFlag = false;
                alert('保存成功');
              } else {
                alert('系统异常');
              }
            }, () => {
              this.requesting = false;
              alert('系统异常');
            }).catch((error) => {
              alert('系统异常');
            });
        },
      }
    }
</script>

<style lang="scss" scoped>
  @import '../assets/css/iconfont.css';
  @import '../assets/css/Editor.scss';
  .sidelogo{
    position: absolute;
    top: 0;
    height:50px;
    line-height:50px;
  }
  .sidelogotxt{
    font-size:1.2rem;
    font-weight:bold;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>
<style>
  /*覆盖Element-UI的样式*/
  .wait .el-input__inner{
    height: 22px;
    width: 40px;
    padding: 0 5px;
    position: absolute;
    right: 3px;
    top: -40px;
  }
</style>
