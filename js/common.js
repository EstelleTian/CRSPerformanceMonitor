var CommonData = function () {

    //定时器开关
    var timerValve = true;

    //用户ID
    var userId = localStorage.getItem("userId");
    //登录唯一值
    // var onlyValue = localStorage.getItem("onlyValue");

    //
    var  user_property = JSON.parse(localStorage.getItem('userProperty'))

    // 数据请求地址  showNums:显示流控排名数量 flag:是否获取参与流控统计计算的航班数据
    var dataStatisticURL = ipHost + 'data_statistic?userId=' + userId + '&flag=true' +'&showNums=10' ;

    /**
     * 流控表格配置
     * */
    var flowTableConfig = {
        colName: {
            id: {
                en: 'id',
                cn: 'ID',
                hidden: true,
            },
            name: {
                en: 'name',
                cn: '流控名称',
                width : 180,
                // formatter : linkFormater,
                classes : 'link_cell',
                frozen : true
            }, startTime: {
                en: 'startTime',
                cn: '开始时间',
                formatter: timeFormater,
            }, generateTime: {
                en: 'generateTime',
                cn: '发布时间',
                formatter: timeFormater,
            }, startFlowCasaTime: {
                en: 'startFlowCasaTime',
                cn: '计算时间',
                formatter: timeFormater,
            }, endTime: {
                en: 'endTime',
                cn: '结束时间',
                formatter: timeFormater,
            }, typeZH: {
                en: 'typeZH',
                cn: '限制类型'
            }, value: {
                en: 'value',
                cn: '限制数值',
                width : 100,
                // formatter : flowLimitValFomater,
            }, controlPoints: {
                en: 'controlPoints',
                cn: '航路点'
            }, flowcontrolDirectionZH: {
                en: 'flowcontrolDirectionZH',
                cn: '受控方向'
            }, controlDepDirection: {
                en: 'controlDepDirection',
                cn: '受起机场'
            }, controlDirection: {
                en: 'controlDirection',
                cn: '受降机场'
            }, exemptDepDirection: {
                en: 'exemptDepDirection',
                cn: '豁起机场'
            }, exemptDirection: {
                en: 'exemptDirection',
                cn: '豁降机场'
            }, flowcontrolTypeZH: {
                en: 'flowcontrolTypeZH',
                cn: '流控类型'
            }, reasonZH: {
                en: 'reasonZH',
                cn: '限制原因'
            }, publishUserZh: {
                en: 'publishUserZh',
                cn: '发布用户',
                width : 100,
            }, statusZH: {
                en: 'statusZH',
                cn: '状态'
            }

        },
        colModel: {},
        colDisplay: {},
        colTitle: {
            id:'ID',
            name:'流控名称',
            startTime: '开始时间',
            generateTime: '发布时间',
            startFlowCasaTime: '纳入计算时间',
            endTime: '结束时间',
            typeZH: '限制类型',
            value: '限制数值',
            controlPoints:'航路点',
            controlDepDirection: '受控起飞机场',
            controlDirection: '受控降落机场',
            exemptDepDirection:'豁免起飞机场',
            exemptDirection:'豁免降落机场',
            flowcontrolTypeZH:'流控类型',
            reasonZH: '限制原因',
            publishUserZh: '发布用户',
            statusZH: '状态'
        },
        cmTemplate: {
            width: 85,
            align: 'center',
            sortable: true,
            // search: true,
            searchoptions: {
                sopt: ['cn', 'nc', 'eq', 'ne', 'lt', 'le', 'gt', 'ge', 'bw', 'bn', 'in', 'ni', 'ew', 'en'],
                dataEvents: [{
                    type: 'keyup',
                    fn: function (e) {
                        $(this).change();
                    }
                }]
            },
            cellattr: function (rowId, value, rowObject, colModel, arrData) {
                // 需要赋予表格的属性
                var attrs = '';
                // 无效数值不做处理
                if (!$.isValidVariable(value)) {
                    return attrs;
                }

                var title = rowObject[colModel.name];
                if (!$.isValidVariable(title)) {
                    title = '';
                }
                var len = title.length;
                //时间格式化 YYYYMMDD HH:MM
                var regexp = /(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))0229)/;
                //12位有效时间
                if (regexp.test(title) && len == 12) {
                    title = title.substring(0, 8) + ' ' + title.substring(8, 10) + ":" + title.substring(10, 12);
                } else if (regexp.test(title) && len == 14) { //14位有效时间
                    title = title.substring(0, 8) + ' ' + title.substring(8, 10) + ":" + title.substring(10, 12) + ':' + title.substring(12, 14);
                }
                var colName = colModel.name;
                // 状态列
                if(colName == 'statusZH'){
                    var className = setFlowcontrolStatusCellClassName(rowObject);
                    // console.log(rowObject)
                    attrs = 'class="'+ className +'"';
                }
                attrs += ' title="' + title + '"';
                return attrs;
            },
            sortfunc : function(a, b, direction) {
                // 若为升序排序，空值转换为最大的值进行比较
                // 保证排序过程中，空值始终在最下方
                if ($.type(a) === "number" || $.type(b) === "number") {
                    // 数字类型
                    var maxNum = Number.MAX_VALUE;
                    if (!$.isValidVariable(a) || a < 0) {
                        if (direction > 0) {
                            a = maxNum;
                        }
                    }
                    if (!$.isValidVariable(b) || b < 0) {
                        if (direction > 0) {
                            b = maxNum;
                        }
                    }
                    return (a > b ? 1 : -1) * direction;
                } else {
                    // 字符串类型
                    var maxStr = 'ZZZZZZZZZZZZ';
                    if (!$.isValidVariable(a)) {
                        if (direction > 0) {
                            a = maxStr;
                        } else {
                            a = '';
                        }
                    }
                    if (!$.isValidVariable(b)) {
                        if (direction > 0) {
                            b = maxStr;
                        } else {
                            b = '';
                        }
                    }
                    return a.localeCompare(b) * direction;
                }
            }

        },

    };

    /**
     *
     * */
    var dcbTableConfig = {
        colName: {
            id: {
                en: 'id',
                cn: 'ID',
                hidden: true,
            },statisDateTime: {
                en: 'statisDateTime',
                cn: '计算时间',
                formatter: timeFormater
            }, capacityValue: {
                en: 'capacityValue',
                cn: '容量值',
            }, demandValue: {
                en: 'demandValue',
                cn: '需求值',
                classes : 'link_cell'
                // formatter : linkFormater
            }, demandIndex: {
                en: 'demandIndex',
                cn: 'dcb指数',
            }
        },
        colModel: {},
        colDisplay: {},
        colTitle: {},
        cmTemplate: {
            width: 165,
            align: 'center',
            sortable: true,
            // search: true,
            searchoptions: {
                sopt: ['cn', 'nc', 'eq', 'ne', 'lt', 'le', 'gt', 'ge', 'bw', 'bn', 'in', 'ni', 'ew', 'en'],
                dataEvents: [{
                    type: 'keyup',
                    fn: function (e) {
                        $(this).change();
                    }
                }]
            },
            cellattr: function (rowId, value, rowObject, colModel, arrData) {
                // 需要赋予表格的属性
                var attrs = '';
                // 无效数值不做处理
                if (!$.isValidVariable(value)) {
                    return attrs;
                }

                var title = rowObject[colModel.name];
                if (!$.isValidVariable(title)) {
                    title = '';
                }
                var len = title.length;
                //时间格式化 YYYYMMDD HH:MM
                var regexp = /(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))0229)/;
                //12位有效时间
                if (regexp.test(title) && len == 12) {
                    title = title.substring(0, 8) + ' ' + title.substring(8, 10) + ":" + title.substring(10, 12);
                } else if (regexp.test(title) && len == 14) { //14位有效时间
                    title = title.substring(0, 8) + ' ' + title.substring(8, 10) + ":" + title.substring(10, 12) + ':' + title.substring(12, 14);
                }
                attrs = ' title="' + title + '"';
                return attrs;
            },
            sortfunc : function(a, b, direction) {
                // 若为升序排序，空值转换为最大的值进行比较
                // 保证排序过程中，空值始终在最下方
                if ($.type(a) === "number" || $.type(b) === "number") {
                    // 数字类型
                    var maxNum = Number.MAX_VALUE;
                    if (!$.isValidVariable(a) || a < 0) {
                        if (direction > 0) {
                            a = maxNum;
                        }
                    }
                    if (!$.isValidVariable(b) || b < 0) {
                        if (direction > 0) {
                            b = maxNum;
                        }
                    }
                    return (a > b ? 1 : -1) * direction;
                } else {
                    // 字符串类型
                    var maxStr = 'ZZZZZZZZZZZZ';
                    if (!$.isValidVariable(a)) {
                        if (direction > 0) {
                            a = maxStr;
                        } else {
                            a = '';
                        }
                    }
                    if (!$.isValidVariable(b)) {
                        if (direction > 0) {
                            b = maxStr;
                        } else {
                            b = '';
                        }
                    }
                    return a.localeCompare(b) * direction;
                }
            }

        },
    };

    /**
     * 航班表格配置
     * */
    // var flightTableConfig = FlightGridTableConfig;
    var flightTableConfig = {};



    /**
     * 初始化流控信息表格配置
     * @param obj
     *
     * */
    var initTableParams = function (obj) {
        obj.colModel = {};
        obj.colDisplay = {};
        // obj.colTitle = {};
        //取colName为参照
        var colNames = obj.colName;
        // 遍历生成对应的colModel、colDisplay、colTitle
        for (var i in colNames) {
            var val = colNames[i];
            obj.colModel[i] = {name: i};
            // 设置列宽度
            if ($.isValidVariable(val.width)) {
                obj.colModel[i]['width'] = val.width;
            }
            // 设置格式化
            if ($.isValidVariable(val.formatter)) {
                obj.colModel[i]['formatter'] = val.formatter;
            }
            // 设置冻结列frozen: true,
            if($.isValidVariable(val.frozen)){
                obj.colModel[i]['frozen'] = val.frozen;
            }

            obj.colDisplay[i] = {display: 1};
            //若colName的hidden为true,则设置display为0
            if (val.hidden) {
                obj.colDisplay[i].display = 0;
            }
            // 设置特殊单元格class
            if(val.classes){
                obj.colModel[i]['classes'] = val.classes
            }
            // obj.colTitle[i] = val.cn;
        }
        ;
    };

    /**
     * 初始化航班信息表格配置
     * @param obj
     *
     * */
    var initFlightTableParams = function () {
        CommonData.flightTableConfig = getGridTableStyleObj('crs_all',user_property);
    };


    /**
     * 排行表格流控航班id集合格式化显示
     *
     *  @param cellvalue 单元格数值  string
     *
     *  若有效，则取数据长度并显示到单元格;无效则显示为空
     * *
     * */
    var flowsFormater = function (cellvalue, options, rowObject) {
        if ($.isValidVariable(cellvalue)) {
            var len = cellvalue.length;
            return len+'';  // 此处要转换成字符串格式，解决值为数字0的单元格在导出成的excel表格显示为空的问题
        } else {
            return '';
        }
    };

    /**
     * 定时器
     * @param fn 执行函数
     * @param instance 对象实例
     * @isNext 是否继续定时执行
     * @param time 时间间隔
     * */
    var startTimer = function (fn, instance, isNext, time) {
        if (timerValve) { // 定时器开关
            if (typeof fn == 'function') {
                setTimeout(function () {
                    fn(instance, isNext);
                }, time)
            }
        }
    };
    /**
     * 初始化配置参数
     * */
    var initParams = function () {
        // 初始化表格配置
        CommonData.initTableParams(CommonData.flowTableConfig);
        CommonData.initTableParams(CommonData.dcbTableConfig);
        if($.isValidObject(user_property)){

            CommonData.initFlightTableParams();
        }else {
            retrieveUserProperty();
        }
    };

    /**
     * 获取用户信息
     *
     * */
    var retrieveUserProperty = function () {
        var userID = '';
        // ajax
        // 获取成功后更新到localStore、全部变更user_property、调用 CommonData.initFlightTableParams();

    }


    /**
     * 初始化数据
     * @param refresh 是否定时刷新　
     * */
    var initBasicData = function (refresh) {
        // 启用遮罩loading
        if(!$.isValidObject(FlowStatistic.allData)){
            $(".content").showProgress('数据加载中...');
        }
        //统计数据
        $.ajax({
            url: dataStatisticURL,
            type: 'GET',
            dataType: 'json',
            success: function (data, status) {
                if ($.isValidObject(data)) {
                    if ($.isValidObject(data.result)) {
                        // 隐藏loading
                        $(".content").hideProgress();
                        //全部数据
                        FlowStatistic.allData = data.result;
                        //流控数据
                        FlowStatistic.flowData = data.result.flows;
                        // 参与流控统计计算的航班数据
                        FlowStatistic.flightData = data.result.flights;
                        //数据生成时间
                        CommonData.generateTime = data.generateTime;
                        // CommonData.generateTime = formateTime(data.generateTime) ;
                        //更新数据生成时间
                        $('.statistic_generateTime').text('数据生成时间：' + formateTime(CommonData.generateTime));
                        // 处理状态数据
                        FlowStatistic.handleStatusData();
                        // 统计排序规则
                        FlowStatistic.initSortRule();
                        // 转换数据
                        FlowStatistic.convertData();
                        // 更新流控统计数据显示
                        FlowStatistic.fireDataChange();
                        // 更新航班监控数据
                        if (Flight.flightMonitorData == null) {
                            Flight.flightMonitorDataConvert(data.result);
                            Flight.initFlightDirection(data.result);
                            Flight.initFlightDataClick();
                        } else {
                            Flight.flightMonitorDataConvert(data.result);
                        }
                        Flight.setFlightData(Flight.flightMonitorData);
                        // 更新机场数据（右侧模块）
                        Flight.fireAirportDataChange(data);
                    }else {
                        // 清空统计图表和流控排名表格
                        FlowStatistic.clear();
                        // 清空航班监控数据
                        Flight.setFlightData("")
                        // 显示loading
                        $(".content").showProgress('数据加载中...');
                        console.warn('The flow data is empty');
                    }
                } else {
                    // 清空统计图表和流控排名表格
                    FlowStatistic.clear();
                    // 清空航班监控数据
                    Flight.setFlightData("")
                    // 显示loading
                    $(".content").showProgress('数据加载中...');
                    console.error('retrieve flow data failed');
                }

                //定时刷新
                if (refresh) {
                    startTimer(initBasicData, FlowStatistic.allData, true, 30 * 1000);
                }
            },
            error: function (xhr, status) {
                console.error('retrieve statistic data failed, state:');
                console.error(status);
                // 清空统计图表和流控排名表格
                if($.isValidObject(FlowStatistic.clear)){
                    FlowStatistic.clear();
                }
                // 清空航班监控数据
                Flight.setFlightData("")
                // 显示loading
                $(".content").showProgress('数据加载中...');

                //定时刷新
                if (refresh) {
                    startTimer(initBasicData, FlowStatistic.allData, true, 30 * 1000);
                }

            }

        });

    };

    /**
     * 获取流控DCB数据
     *
     * */
    var getDCBData = function (opt, table) {
        var url = ipHost + 'flow_id_dcb_history_detail?userId='+ userId +'&id='+opt.id;
        //统计数据
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function (data, status) {
                if ($.isValidObject(data)) {
                    if ($.isValidObject(data.result)) {
                        fireDcbTableDataChange(data, table,opt)
                    }else {
                        console.error('retrieve DCB data failed');
                    }
                } else {
                    console.error('retrieve DCB data failed');
                }

            },
            error: function (xhr, status) {

            }

        });
    };

    /**
     * 获取流控DCB需求值对应的航班信息
     *
     * */
    var getDCBDemandFlightData = function (opt, table) {
        var url = ipHost + 'flow_dcb_demand_detail?userId='+ userId +'&id='+opt.id+'&time=' + opt.time;
        //统计数据
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function (data, status) {
                if ($.isValidObject(data)) {
                    if ($.isValidObject(data.result)) {
                        table.generateTime = data.generateTime;
                        fireDCBDemandFlightTableDataChange(data, table,opt)
                    }else {
                        console.error('retrieve DCB demand flight data failed');
                    }
                } else {
                    console.error('retrieve DCB demand flight data failed');
                }

            },
            error: function (xhr, status) {

            }

        });
    };

    /**
     * 数据生成时间格式化
     * */
    var formateTime = function (time) {
        var year = time.substring(0, 4);
        var mon = time.substring(4, 6);
        var date = time.substring(6, 8);
        var hour = time.substring(8, 10);
        var min = time.substring(10, 12);
        var str = year + '-' + mon + '-' + date + ' ' + hour + ":" + min;
        return str;
    };

    //单元格时间格式化
    function timeFormater(cellvalue, options, rowObject) {
        var val = cellvalue * 1;
        if ($.isValidVariable(cellvalue) && !isNaN(val)) {
            if (cellvalue.length == 12) {
                return cellvalue.substring(6, 8) + '/' + cellvalue.substring(8, 12);
            } else if (cellvalue.length == 14) {
                return cellvalue.substring(6, 8) + '/' + cellvalue.substring(8, 12);
            }
        } else {
            return '';
        }
    };



    /**
     * 创建dhx弹窗
     *
     * */

    function createDhxWindow(opt) {
        // 关闭DCB Popover提示框
        Flight.hideDcbPopover();
        var timestamp = new Date().getTime();
        var tableId = opt.id + timestamp;
        var generateTime = '';
        if($.isValidVariable(opt.generateTime)){
            generateTime = formateTime(opt.generateTime);
        }
        opt.tableId = tableId;
        var total = '';
        if($.isValidVariable(opt.ids)){
            total = opt.ids.length;
        }
        //窗口节点
        var content = '<div class="dhx_wrap  dhx_wrap_' + tableId + '">' +
            '<div class="header now_time">' +
            '<input class="hidden  id" value="' + opt.id + '" >' +
            '<input class="hidden idset" value="' + opt.ids + '" >' +
            '<input class="hidden type" value="' + opt.type + '" >' +
            '<h4 class="win_head">' + opt.name +
            '</h4>' +
            '<h5 class="generate_time">数据生成时间: ' + generateTime +
            '</h5>' +
            // '<h5 >共<span class="total_record">'+total +'</span>条记录' + '</h5>' +
            '</div>' +
            '<div class="body">' +
            '<div id="tb_canvas_' + tableId + '" ' + ' class="tb_canvas">' +
            '<table id="tb_table_' + tableId + '" ' + 'class=""></table>' +
            '<div id="' + tableId + '_pager' + '"></div>' +
            '</div>' +
            '</div>' +
            '</div>';

        var dialogId = opt.type + '_' + timestamp;

        //窗口参数
        var winParams = {
            id: dialogId,
            width: opt.width || 1280,
            height: opt.height || 800,
            center: true,
            move: true
        };

        //初始化dhxwindow弹框
        var dhxWins = DhxModalDialog.create(opt.name,content,winParams);

        var warp = 'dhx_wrap_' + tableId;
        // 调整大小以适应所在容器
        resizeDhxTableContainer(warp);
        // 绘制数据表格
        var table = showDataInTable(opt);

        //dhx窗口调整事件监听
        dhxWins.attachEvent('onResizeFinish', function (win) {
            //调整大小以适应所在容器
            resizeDhxTableContainer(warp);
            //调整表格大小以适应所在容器
            if ($.isValidObject(table)) {
                table.resizeToFitContainer();
            }

        });
    };
    /**
     * 流控详情页面
     * @param opt 参数
     *
     * */
    function createFlowDetailDhxWindow(opt) {
        // 关闭DCB Popover提示框
        Flight.hideDcbPopover();
        //时间戳(用于区别开各窗口)
        var timestamp = new Date().getTime();
        // 窗口id
        var dialogId = opt.id + '_' + timestamp;

        //  窗口内容节点

        // 头部信息
        var header = '<div class="row">' + '<div class="col-md-12">' + '<div class="header now_time">' + '<h4 class="win_head">' + opt.name + '</h4>' +'<h4> 生效时间: <span class="effective_start"></span>~<span class="effective_end"></span></h4>'+ '<h4 class="status"> ' + '</h4>' + '</div>' + '</div>' + '</div>';
        // 基本信息
        var basicInformation = '<div class="row"><div class="col-md-12 "><div class="bar_title">基本信息</div></div><div class="col-md-6"><label>流控名称:</label><label class="flow_name item_value"></label></div><div class="col-md-3 source"><span class="source_cdm"><label class="icon"></label><label >CDM</label></span><span class="source_crs"><label class="icon"></label><label >CRS</label></span></div><div class="col-md-3 type"><span class="not_across"><label class="icon"></label><label >非长期</label></span><span class="across"><label class="icon"></label><label >长期</label></span></div><div class="col-md-6"><label>发布用户:</label><label class="publish_user item_value"></label></div><div class="col-md-6"><label>原发布单位:</label><label class="publish_unit item_value"></label></div></div>';
        // 限制时间
        var limitTime = '<div class="row"><div class="col-md-12"><div class="bar_title">限制时间</div></div><div class="col-md-6"><label>开始时间:</label><label class="start_time item_value"></label></div><div class="col-md-6"><label>结束时间:</label><label class="end_time item_value"></label></div><div class="col-md-6"><label>创建时间:</label><label class="generate_time item_value"></label></div><div class="col-md-6"><label>修改时间:</label><label class="last_modify_time item_value"></label></div><div class="col-md-6"><label>纳入计算时间:</label><label class="start_flow_casa_time item_value"></label></div></div>';
        // 限制类型
        var limitType = '<div class="row"><div class="col-md-12"><div class="bar_title">限制类型</div></div><div class="col-md-6"><label>限制类型:</label><label class="limit_type item_value"></label></div><div class="col-md-6"><label>限制数值:</label><label class="limit_value item_value"></label></div></div>';
        // 限制方向
        var limitDirection = '<div class="row direction hidden"><div class="col-md-12"><div class="bar_title">限制方向</div></div><div class="col-md-6"><label>受控航路点:</label><label class="control_points item_value"></label></div><div class="col-md-6"><label>受控方向:</label><label class="flowcontrol_direction item_value"></label></div><div class="col-md-6"><label>受控起飞机场:</label><label class="control_dep_direction item_value"></label></div><div class="col-md-6"><label>豁免起飞机场:</label><label class="exempt_dep_direction item_value"></label></div><div class="col-md-6"><label>受控降落机场:</label><label class="control_direction item_value"></label></div><div class="col-md-6"><label>豁免降落机场:</label><label class="exempt_direction item_value"></label></div></div>';
        //复合流控限制方向
        var compositeLimitDirections = '<div class="row composite_direction hidden"><div class="col-md-12"><div class="bar_title">复合流控限制方向 (同时符合)</div></div><div class="col-md-12 limit_item"><div class="row "><div class="col-md-12"><div class="sub_title">限制条件</div></div><div class="col-md-6"><label>受控航路点:</label><label class="control_points item_value"></label></div><div class="col-md-6"><label>受控方向:</label><label class="flowcontrol_direction item_value"></label></div><div class="col-md-6"><label>受控起飞机场:</label><label class="control_dep_direction item_value"></label></div><div class="col-md-6"><label>豁免起飞机场:</label><label class="exempt_dep_direction item_value"></label></div><div class="col-md-6"><label>受控降落机场:</label><label class="control_direction item_value"></label></div><div class="col-md-6"><label>豁免降落机场:</label><label class="exempt_direction item_value"></label></div></div></div></div>';
        // 限制高度
        var limitHight = '<div class="row hight hidden"><div class="col-md-12"><div class="bar_title">限制高度</div></div><div class="col-md-12"><label>限制高度:</label><label class="limit_hight item_value"></label></div></div>';
        // 限制原因
        var limitReason = '<div class="row"><div class="col-md-12"><div class="bar_title">限制原因</div></div><div class="col-md-6"><label>限制原因:</label><label class="reason item_value"></label></div><div class="col-md-6"><label>备注信息:</label><label class="comments item_value"></label></div></div>';
        // 预留时隙
        var reservedTimeSlots =  '<div class="row reserved_time_slots hidden"><div class="col-md-12"><div class="bar_title">预留时隙</div></div><div class="col-md-6"><label>时隙时间:</label><label class="slots item_value"></label></div></div>';
        // 预锁航班时隙变更策略
        var changeStrategy = '<div class="row"><div class="col-md-12"><div class="bar_title">预锁航班时隙变更策略</div></div><div class="col-md-6"><label>变更策略:</label><label class="change_strategy item_value"></label></div><div class="col-md-6"><label>压缩时间范围:</label><label class="time_range item_value"></label></div></div>';
        // 二类放行
        var timeSegment = '<div class="row hidden time_segment"><div class="col-md-12"><div class="bar_title">二类放行</div></div><div class="col-md-12 time_segment_val"></div></div>';
        // 协调记录
        var records = '<div class="row records"><div class="col-md-12"><div class="bar_title valve-ico hides">协调记录</div></div><div class="col-md-12 record_col hidden"><table class="record_table"><thead><tr><th class="record_type">协调类型</th><th class="record_before">协调前</th><th class="record_last">协调后</th><th class="record_comments">协调备注</th><th class="record_status">协调状态</th><th class="record_time">协调时间</th><th class="record_user">协调用户</th><th class="record_user_ip">协调用户IP</th></tr></thead><tbody><tr class="template hidden"><td class="record_type"></td><td class="record_before"></td><td class="record_last"></td><td class="record_comments"></td><td class="record_status"></td><td class="record_time"></td><td class="record_user"></td><td class="record_user_ip"></td></tr></tbody></table></div></div>';
        //  窗口内容节点拼接
        var content = '<div class="dhx_wrap container-fluid flow_detail dhx_wrap_' + dialogId+ '">' +
            header + basicInformation + limitTime + limitType + limitDirection + compositeLimitDirections +
            limitHight + limitReason + reservedTimeSlots  + changeStrategy +timeSegment + records +
            '</div>';
        //窗口参数
        var winParams = {
            id: dialogId,
            width: opt.width || 1080,
            height: opt.height || 800,
            center: true,
            move: true
        };
        //初始化dhxwindow弹框
        var dhxWins = DhxModalDialog.create('流控信息详情',content,winParams);
        // 获取流控信息详情数据
        getFlowById(opt.id, dialogId);
    }

    /**
     *  获取流控详情数据
     * */
    var getFlowById = function (id, dialogId) {
        var url = ipHost+ 'flow_id_detail?userId=' + userId + '&id=' + id;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function (data, status) {
                if ($.isValidObject(data)) {
                    if ($.isValidObject(data.result)) {
                        //流控信息详情数据结果
                        var result = data.result;
                        // 创建流控详情对象
                        var obj = new FlowDetail({
                            id: id,
                            dialogId : dialogId
                        });
                        // 转换流控详情数据
                        obj.convertData(result);
                        // 事件绑定
                        obj.initEvent();
                    }
                }
            },
            error: function (xhr, status) {
                console.error('retrieve flowcontrol detail data failed' + 'flowcontrol id:' + id);
                console.error(status);
            }

        });
    };


    /**
     * 转换流控详情数据
     * @param obj 流控详情数据对象
     * */
    var convertFlowDetailData = function (obj) {
        //流控名称
        convertFlowName(obj);

    };

    var convertFlowName = function (obj) {
        if ($.isV) {

        }
    };


    /***
     *  调整大小以适应所在容器
     * */
    var resizeDhxTableContainer = function (str) {
        var $warp = $('.' + str);
        var $body = $('.body', $warp);
        var $header = $('.header', $warp);
        var $canvas = $('.tb_canvas', $body);
        var h = ($warp.height() - $header.outerHeight());
        $body.height(h - 20);
        $canvas.height(h - 20);

    };

    /**
     *  绘制数据表格
     * */
    var showDataInTable = function (opt) {
        var table = {};
        if (opt.type == 'flows') {
            table = initFlowTable(opt);

        } else if (opt.type == 'flight') {
            table = initFlightTable(opt);
        } else if(opt.type == 'dcb'){
            table = initDcbTable(opt);
        } else if(opt.type == 'demand'){
            table = initDemandFlightTable(opt);
        }
        return table;
    };

    /**
     *  创建流控表格
     * */
    var initFlowTable = function (opt) {
        var pagerId = opt.tableId + '_pager';
        var table = new FlightGridTable({
            canvasId: 'tb_canvas_' + opt.tableId,
            tableId: 'tb_table_' + opt.tableId,
            pagerId: pagerId,
            colNames: CommonData.flowTableConfig.colName,
            colModel: CommonData.flowTableConfig.colModel,
            cmTemplate: CommonData.flowTableConfig.cmTemplate,
            colDisplay: CommonData.flowTableConfig.colDisplay,
            colTitle: CommonData.flowTableConfig.colTitle,
            colStyle: {},
            colEdit: {},
            search: false,
            params: {
                shrinkToFit: false,
                rowNum: 999999,
                //sortname: 'EOBT',
                // sortorder: 'asc',
                // sortname: 'SEQ',//排序列
                // 是否显示行号
                rownumbers: true,
                //是否显示快速过滤
                showQuickFilter: false,
                // scroll : true, //创建动态滚动表格。当设为启用时，pager被禁用，可使用垂直滚动条来装入数据。
                afterSearchCallBack: function () {

                },
                onCellSelect: function (rowid, iCol, cellcontent, e) {
                    var colModel = table.gridTableObject.jqGrid('getGridParam')['colModel'];
                    var colName = colModel[iCol].name;
                    // 若此单元格对应的colModel的colName是name，则此单元格为流控名称
                    if (colName == 'name') {
                        var opt = {
                            name: cellcontent, // 流控名称
                            id: rowid, // 流控ID
                            width: 800, // 窗口宽度
                            height: 800 // 窗口高度
                        };
                        // 弹出流控详情页面
                        createFlowDetailDhxWindow(opt);

                    }
                }
            }
        });

        //初始化
        table.initGridTableObject();
        // 设置 Pager 按钮
        table.quickFilterFlag = false;
        table.gridTableObject
            .navButtonAdd('#' + pagerId, {
                caption: "导出",
                title: "导出Excel",
                buttonicon: "glyphicon-export",
                onClickButton: function () {
                    table.export(opt.name);
                },
                position: "first"
            }) .navButtonAdd('#' + pagerId, {
                caption: "高级查询",
                title: "高级查询",
                buttonicon: "glyphicon-search",
                onClickButton: function () {
                    table.showAdvanceFilter();
                },
                position: "first"
            })
            .navButtonAdd('#' + pagerId, {
                caption: "快速过滤",
                title: "快速过滤",
                buttonicon: "glyphicon-filter",
                onClickButton: function () {
                    //清理协调窗口
                    table.clearCollaborateContainer();
                    table.showQuickFilter();
                    table.quickFilterFlag = !table.quickFilterFlag;
                    table.addMultiSelectToHeader();
                    table.checkedMultiOperate();
                },
                position: "first"
            });
        // 显示pager
        $('#'+ pagerId).show();
        // 调整表格大小以适应所在容器
        table.resizeToFitContainer();
        //数据id集合
        var ids = opt.ids;
        //更新流控表格数据
        fireFlowTableDataChange(ids,table);

        return table;
    };

    /**
     *  创建航班表格
     * */

    var initFlightTable = function (opt) {
        var pagerId = opt.tableId + '_pager'
        var table = new FlightGridTable({
            canvasId: 'tb_canvas_' + opt.tableId,
            tableId: 'tb_table_' + opt.tableId,
            pagerId: pagerId,
            colNames: CommonData.flightTableConfig.colNames,
            colModel: FlightGridTableConfig.colModel,
            cmTemplate: FlightGridTableConfig.colModelTemplate,
            colDisplay: CommonData.flightTableConfig.colDisplay,
            colTitle: CommonData.flightTableConfig.colTitle,
            colStyle: CommonData.flightTableConfig.colStyle,
            colEdit: {OPEN_FLIGHT_DETAIL : true},
            search: false,
            params: {
                rowNum: 999999,
                sortname: 'EOBT',
                // sortorder: 'asc',
                // sortname: 'SEQ',//排序列
                // 是否显示行号
                rownumbers: true,
                //是否显示快速过滤
                showQuickFilter: false,
                // scroll : true, //创建动态滚动表格。当设为启用时，pager被禁用，可使用垂直滚动条来装入数据。
                afterSearchCallBack: function () {

                },
                onCellSelect: function (rowid, iCol, cellcontent, e) {

                }
            },
            generateTime : CommonData.generateTime

        });
        // 转换航班计划表格数据
        table.colConverter = FlightGridTableDataUtil;

        //初始化
        table.initGridTableObject();
        // 设置 Pager 按钮
        table.quickFilterFlag = false;
        table.gridTableObject.navButtonAdd('#' + pagerId, {
            caption: "导出",
            title: "导出Excel",
            buttonicon: "glyphicon-export",
            onClickButton: function () {
                table.export(opt.name);
            },
            position: "first"
        }) .navButtonAdd('#' + pagerId, {
                caption: "高级查询",
                title: "高级查询",
                buttonicon: "glyphicon-search",
                onClickButton: function () {
                    table.showAdvanceFilter();
                },
                position: "first"
            })
            .navButtonAdd('#' + pagerId, {
                caption: "快速过滤",
                title: "快速过滤",
                buttonicon: "glyphicon-filter",
                onClickButton: function () {
                    //清理协调窗口
                    table.clearCollaborateContainer();
                    table.showQuickFilter();
                    table.quickFilterFlag = !table.quickFilterFlag;
                    table.addMultiSelectToHeader();
                    table.checkedMultiOperate();
                },
                position: "first"
            });
        // 显示pager
        $('#'+ pagerId).show();
        // 调整表格大小以适应所在容器
        table.resizeToFitContainer();
        //数据id集合
        var ids = opt.ids;
        //更新航班表格数据
        fireFlightTableDataChange(ids, table);

        return table;
    };

    /**
     *  创建航班表格
     * */

    var initDemandFlightTable = function (opt) {
        var pagerId = opt.tableId + '_pager';
        var table = new FlightGridTable({
            canvasId: 'tb_canvas_' + opt.tableId,
            tableId: 'tb_table_' + opt.tableId,
            pagerId: pagerId,
            colNames: CommonData.flightTableConfig.colNames,
            colModel: FlightGridTableConfig.colModel,
            cmTemplate: FlightGridTableConfig.colModelTemplate,
            colDisplay: CommonData.flightTableConfig.colDisplay,
            colTitle: CommonData.flightTableConfig.colTitle,
            colStyle: CommonData.flightTableConfig.colStyle,
            colEdit: {},
            search: false,
            params: {
                shrinkToFit: false,
                rowNum: 999999,
                sortname: 'EOBT',
                // sortorder: 'asc',
                // sortname: 'SEQ',//排序列
                // 是否显示行号
                rownumbers: true,
                //是否显示快速过滤
                showQuickFilter: false,
                // scroll : true, //创建动态滚动表格。当设为启用时，pager被禁用，可使用垂直滚动条来装入数据。
                afterSearchCallBack: function () {

                },
                onCellSelect: function (rowid, iCol, cellcontent, e) {
                    /*var colModel = table.gridTableObject.jqGrid('getGridParam')['colModel'];
                    var colName = colModel[iCol].name;
                    // 点击航班号弹出航班详情
                    // 若此单元格对应的colModel的colName是FLIGHTID，则此单元格为航班号列
                    if (colName == 'FLIGHTID') {
                        // 设置数据生成时间
                        // table.data[rowid].generateTime = CommonData.generateTime;
                        // 弹出航班详情页面
                        // Flight.createFlightDetailWindow(rowid,table.data.result[rowid]);
                    }*/
                }
            }
        });
        // 转换航班计划表格数据
        table.colConverter = FlightGridTableDataUtil;

        //初始化
        table.initGridTableObject();
        // 设置 Pager 按钮
        table.quickFilterFlag = false;
        table.gridTableObject.navButtonAdd('#' + pagerId, {
            caption: "导出",
            title: "导出Excel",
            buttonicon: "glyphicon-export",
            onClickButton: function () {
                table.export(opt.name);
            },
            position: "first"
        }).navButtonAdd('#' + pagerId, {
                caption: "高级查询",
                title: "高级查询",
                buttonicon: "glyphicon-search",
                onClickButton: function () {
                    table.showAdvanceFilter();
                },
                position: "first"
            })
            .navButtonAdd('#' + pagerId, {
                caption: "快速过滤",
                title: "快速过滤",
                buttonicon: "glyphicon-filter",
                onClickButton: function () {
                    //清理协调窗口
                    table.clearCollaborateContainer();
                    table.showQuickFilter();
                    table.quickFilterFlag = !table.quickFilterFlag;
                    table.addMultiSelectToHeader();
                    table.checkedMultiOperate();
                },
                position: "first"
            });
        // 显示pager
        $('#'+ pagerId).show();
        // 调整表格大小以适应所在容器
        table.resizeToFitContainer();
        //数据id集合
        var ids = opt.ids;
        // 获取流控DCB需求值对应的航班信息
        getDCBDemandFlightData(opt,table);
        //更新航班表格数据
        // fireFlightTableDataChange(ids, table);

        return table;
    };




    /**
     *  创建DCB表格
     * */
    var initDcbTable = function (opt) {
        var flowid = opt.id;
        var pagerId = opt.tableId + '_pager';
        var table = new FlightGridTable({
            canvasId: 'tb_canvas_' + opt.tableId,
            tableId: 'tb_table_' + opt.tableId,
            pagerId: pagerId,
            colNames: CommonData.dcbTableConfig.colName,
            colModel: CommonData.dcbTableConfig.colModel,
            cmTemplate: CommonData.dcbTableConfig.cmTemplate,
            colDisplay: CommonData.dcbTableConfig.colDisplay,
            colTitle: CommonData.dcbTableConfig.colTitle,
            colStyle: {},
            colEdit: {},
            search: false,
            params: {
                shrinkToFit: false,
                rowNum: 999999,
                sortname: 'EOBT',
                // sortorder: 'asc',
                // sortname: 'SEQ',//排序列
                // 是否显示行号
                rownumbers: true,
                //是否显示快速过滤
                showQuickFilter: false,
                // scroll : true, //创建动态滚动表格。当设为启用时，pager被禁用，可使用垂直滚动条来装入数据。
                afterSearchCallBack: function () {

                },
                onCellSelect: function (rowid, iCol, cellcontent, e, flowid) {
                    var colModel = table.gridTableObject.jqGrid('getGridParam')['colModel'];
                    var colName = colModel[iCol].name;
                    //获取当前行对应的原始数据
                    var rowData = table.data.result[rowid*1-1]
                    // 点击需求值弹出需求航班信息表
                    // 若此单元格对应的colModel的colName是demandValue，则此单元格为需求值
                    if (colName == 'demandValue') {
                        //取得当前行数据的计算时间值
                        var time =rowData.statisDateTime;
                        //取得流控ID
                        var flowid = table.flowid;

                        var opt = {
                            //类型 流控航班
                            type : 'demand',
                            name : 'DCB需求值 航班信息',
                            time: time, // 计算时间
                            id:flowid // 流控ID
                        };
                        // 弹出需求航班信息表
                        createDhxWindow(opt);
                    }
                }
            }
        });

        //初始化
        table.initGridTableObject();
        // 设置 Pager 按钮
        table.quickFilterFlag = false;
        table.gridTableObject.navButtonAdd('#' + pagerId, {
            caption: "导出",
            title: "导出Excel",
            buttonicon: "glyphicon-export",
            onClickButton: function () {
                table.export(opt.name);
            },
            position: "first"
        }).navButtonAdd('#' + pagerId, {
                caption: "高级查询",
                title: "高级查询",
                buttonicon: "glyphicon-search",
                onClickButton: function () {
                    table.showAdvanceFilter();
                },
                position: "first"
            })
            .navButtonAdd('#' + pagerId, {
                caption: "快速过滤",
                title: "快速过滤",
                buttonicon: "glyphicon-filter",
                onClickButton: function () {
                    //清理协调窗口
                    table.clearCollaborateContainer();
                    table.showQuickFilter();
                    table.quickFilterFlag = !table.quickFilterFlag;
                    table.addMultiSelectToHeader();
                    table.checkedMultiOperate();
                },
                position: "first"
            });
        // 显示pager
        $('#'+ pagerId).show();
        table.resizeToFitContainer();
        //将流控ID赋值给table，用于点击需求值ajax获取数据请求时流控ID参数使用
       table.flowid = flowid;
        //更新航班表格数据
        // fireFlightTableDataChange(ids, table);
        getDCBData(opt,table);
        return table;
    }

    var fireDcbTableDataChange = function (data,table,opt) {
        table.tableDataMap = {};
        table.tableData = {};
        table.data = data;
        var tableData = [];
        var tableMap = {};
        var result = data.result;
        for (var index in result) {
            var d = result[index];
            // 转换数据
            var newData = convertDcbData(d);
            tableData.push(newData);
            tableMap[result[index].id] = newData
        }
        table.tableDataMap = tableMap;
        table.tableData = tableData;
        table.drawGridTableData();

        var container = $('.dhx_wrap_'+ opt.tableId);
        var total = tableData.length;
        var time = formateTime(data.generateTime);
        $('.total_record', container).text(total);
        $('.generate_time', container).text('数据生成时间:'+time);
    };

    /**
     * 转换DCB数据
     * */
    var convertDcbData = function (data) {

        for (var i in data){
            // 若值为数字0，则转换为字符'0',用于解决导出的excel表格单元格为空的问题
            if(data[i] === 0){
                data[i] = data[i]+'';
            }
        }
        return data;
    }

    /*
     * 更新流控表格数据
     * */
    var fireFlowTableDataChange = function (ids, table) {
        var data = [];
        ids.map(function (id) {
            data.push(FlowStatistic.flowData[id]);
            // 更新到表格对象的data字段
            table.data[id] = FlowStatistic.flowData[id];
        });
        table.tableDataMap = {};
        table.tableData = {};
        var tableData = [];
        var tableMap = {};
        for (var index in data) {
            var d = convertFlowData(data[index]);
            tableData.push(d);
            tableMap[data[index].id] = d;
        }
        table.tableDataMap = tableMap;
        table.tableData = tableData;
        table.drawGridTableData();
    };
    /**
     *
     * 更新航班表格数据
     * */
    var fireFlightTableDataChange = function (ids, table) {
        var data = [];
        ids.map(function (id) {
            data.push(FlowStatistic.flightData[id]);
            // 更新到表格对象的data字段
            table.data.result[id] = FlowStatistic.flightData[id];
        });
        table.tableDataMap = {};
        table.tableData = {};
        var tableData = [];
        var tableMap = {};
        for (var index in data) {
            var d = FlightGridTableDataUtil.convertData(data[index]);
            // var d = data[index];
            tableData.push(d);
            tableMap[data[index].id] = d;
        }
        table.tableDataMap = tableMap;
        table.tableData = tableData;
        table.drawGridTableData();
    };
    /**
     * 更新流控DCB需求值对应的航班信息数据
     * */
    var fireDCBDemandFlightTableDataChange = function (data,table,opt) {
        table.tableDataMap = {};
        table.tableData = {};
        table.data = data;
        var tableData = [];
        var tableMap = {};
        var result = data.result;
        for (var index in result) {
            var d =  FlightGridTableDataUtil.convertData(result[index]);
            tableData.push(d);
            tableMap[result[index].id] = d;
        }
        table.tableDataMap = tableMap;
        table.tableData = tableData;
        table.drawGridTableData();

        var container = $('.dhx_wrap_'+ opt.tableId);
        var total = tableData.length;
        var time = formateTime(data.generateTime);
        $('.total_record', container).text(total);
        $('.generate_time', container).text('数据生成时间:'+time);
    };

    /**
     *  流控数据转换
     * */
    function convertFlowData(data) {
        var obj = {};
        for (var i in data) {
            obj[i] = data[i]
        }
        ;
        var val = obj.value;
        if ($.isValidVariable(val)) {
            obj.value = obj.value + '（分钟）'
        } else if ($.isValidVariable(obj.assignSlot)) {
            obj.value = obj.assignSlot + '（各分配1架）'
        }
        return obj;
    }

    var getGridTableStyleObj = function( tableName,user_property){
        var paramsObj = {
            colStyle : {},
            colNames : {},
            colTitle : {},
            colDisplay: {}
        };
        //验证是有效的数据
        if( user_property.length > 0){
            for ( var key in user_property) {
                var userProperty = user_property[key];
                if( $.isValidObject(userProperty) ){
                    var value = $.parseJSON(userProperty['value']);
                    var uKey = userProperty.key;
                    var styleStr = 'grid_col_style';
                    var namesStr = 'grid_col_names';
                    var titleStr = 'grid_col_title';
                    var displayNameStr = '';
                    //重定义匹配规则
                    if( $.isValidVariable(tableName) ) {//是有效字符串时
                        displayNameStr = 'grid_' + tableName + '_col_monitor_display';
                    }
                    //匹配赋值
                    switch( uKey ){
                        case styleStr : {
                            paramsObj.colStyle = value;
                            break;
                        }
                        case namesStr : { //userProperty.key == 'grid_col_names'
                            paramsObj.colNames = value;
                            break;
                        }
                        case titleStr : { //userProperty.key == 'grid_col_title'
                            paramsObj.colTitle = value;
                            break;
                        }
                        case displayNameStr : { //userProperty.key == 'grid_area_col_display'
                            paramsObj.colDisplay = value;
                            break;
                        }
                    }
                }
            }
        }
        //循环结束
        return paramsObj;
    };
    /**
     * 设置流控状态列单元格css class
     * */
    var setFlowcontrolStatusCellClassName = function (data) {
        var className = '';
        var status = data.status;
        if($.isValidVariable(status)){
            switch (status){
                //正在执行
                case 'RUNNING':
                    className ='status status_running';
                    break;
                // 人工终止
                case 'TERMINATED':
                    className ='status status_terminated';
                    break;
                // 正常结束
                case 'FINISHED':
                    className ='status status_finished';
                    break;
                // 已发布
                case 'PUBLISH':
                    className ='status status_terminated';
                    break;
                // 将要执行
                case 'FUTURE':
                    className ='status status_future';
                    break;
                // 系统终止
                case 'STOP':
                    className ='status status_stop';
                    break;
            }
        };
        return className;
    };

    return {
        init: function () {
            // 初始化loading组件
            $(".content").progressDialog();
            // 初始化配置
            initParams();
            //获取基础数据
            initBasicData(true);
        },
        flightTableConfig: flightTableConfig,
        flowTableConfig: flowTableConfig,
        dcbTableConfig : dcbTableConfig,
        // generateTime : generateTime,
        formateTime: formateTime,
        initTableParams: initTableParams,
        initFlightTableParams: initFlightTableParams,
        flowsFormater: flowsFormater,
        createDhxWindow: createDhxWindow,
        createFlowDetailDhxWindow: createFlowDetailDhxWindow,
        timerValve: timerValve
    }

}();

$(document).ready(function () {
    CommonData.init();
});
