var express = require('express');
var bodyParser = require('body-parser');//解析post数据
var querystring = require('querystring');
var url = require('url');
var fs = require('fs');
var path = require('path');
var xml2js = require('xml2js');

var app = express();
var parser = new xml2js.Parser();
var builder = new xml2js.Builder();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post('/save', function (req, res) {
    //读取xml文件
    fs.readFile('../../vrsystem/static/tour.xml', 'utf8', function (err, data) {
        // if (err) throw err;
        if(err) {
            console.log(err);
        }
        //xml转对象
        parser.parseString(data, function (parseErr, obj) {
            if (parseErr) throw parseErr;
            //根据请求参数修改dom节点
            var scenes = JSON.parse(req.body.body);
            scenes.forEach(function (scene) {
                var sceneObj = obj.krpano.scene[scene.index];
                //初始观察点
                var viewAttr = sceneObj.view[0].$;
                if (scene.initH) viewAttr.hlookat = scene.initH;
                if (scene.initV) viewAttr.vlookat = scene.initV;
                if (scene.fov) viewAttr.fov = scene.fov;
                if (scene.fovmax) viewAttr.fovmax = scene.fovmax;
                if (!isNaN(Number.parseInt(scene.fovmin))) viewAttr.fovmin = scene.fovmin;
                delete viewAttr.maxpixelzoom;
                //场景名称
                sceneObj.$.name = scene.name;
                //热点
                if (scene.hotSpots) {
                    sceneObj.hotspot = [];
                    scene.hotSpots.forEach(function (hotSpot) {
                        sceneObj.hotspot.push({
                            $: {
                                ath: hotSpot.ath,
                                atv: hotSpot.atv,
                                linkedscene: hotSpot.linkedscene,
                                name: hotSpot.name,
                                style: hotSpot.style,
                                dive: hotSpot.dive
                            }
                        })
                    })
                }
                //自动旋转
                if (scene.autorotate) {
                    sceneObj.autorotate = [{
                        $: {
                            enabled: scene.autorotate.enabled,
                            waittime: scene.autorotate.waitTime,
                            accel: '1.0',
                            speed: '5.0',
                            horizon: '0.0'
                        }
                    }]
                }
                //初始场景
                if (scene.welcomeFlag) {
                    obj.krpano.action[0]._ = "if(startscene === null OR !scene[get(startscene)], copy(startscene,scene[" + scene.index
                        + "].name); );loadscene(get(startscene), null, MERGE);if(startactions !== null, startactions() );js('onready');"
                }
            });
            //对象转回xml
            var xmlStr = builder.buildObject(obj);
            //写入文件
            fs.writeFile('../../vrsystem/static/tour.xml', xmlStr, 'utf8', function (err) {
                if(err) {
                    console.log(err);
                }
                res.send('保存成功');
            })
        })
    })
});


app.listen('3000', function () {
    console.log('服务器启动');
});