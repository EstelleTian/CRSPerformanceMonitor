var FlowStatistic = function () {

    // 数据请求地址  showNums:显示流控排名数量 flag:是否获取参与流控统计计算的航班数据
    // var dataURL = ipHost + 'data_statistic?userId=' + userId + '&showNums=' + 10 +'&flag=true' ;
    //全部数据
    var allData = {};
    // 流控数据对象
    var flowData = {};
    // 可用状态集合
    var availableStatus = null;

    
    //流控集合
    

    // 参与流控统计计算的航班数据
    var flightData = {};
    //数据生成时间
    var generateTime = '';

    //数据结构
    var dataStructure = {
        direction :{
            legend : [],
            legendZh : [],
            seriesData : [],
            flows : {}
        },
        status : {
            legend : [],
            legendZh : [],
            seriesData : [],
            flows : {}
        },
        reason : {
            legend : [],
            legendZh : [],
            seriesData : [],
            flows : {}
        },
        statistic24Hour: {
            xAxisData: [],
            seriesData : [],
            flows : {}
        }
    };

    //图表对象集合
    var chartObj = {
        direction : {},
        status : {},
        reason : {},
        statistic24Hour: {}
    };

    // 流控方向排序依据
    var sortKey ={
        direction : [],
        status : [],
        reason : []
    };

    //表格对象
    var rankingsTableObj = {};
    var tableCanvasId = "tb_rankings_canvas";
    var tableId = "rankings_table";
    var tablePagerId = "rankings_table_pager";


    //表格配置参数
    var tableParams = {
        colName : {
             name: {
                en: 'name',
                cn: '流控名称',
                // formatter: CommonData.linkFormater,
                 classes : 'link_cell',
                frozen : true,
                width : 150
            },statusZH:{
                en: 'statusZH',
                cn: '状态',
                classes: CommonData.classNameFormater,
                width : 70
            },
            typeZH: {
                en: 'typeZH',
                cn: '限制类型',
                width : 70
            },directionZH: {
                en: 'directionZH',
                cn: '方向'
            },dcb: {
                en: 'dcb',
                cn: 'DCB值'
                /*formatter:  function (cellvalue, options, rowObject) {
                    if($.isValidVariable(cellvalue*1)){
                        return (cellvalue*1).toFixed(1);
                    }else {
                        return '-';
                    }
                }*/
            },onGroundFcs: {
                en: 'onGroundFcs',
                cn: '区内未起飞',
                width : 80,
                formatter: CommonData.flowsFormater
            },inSkyFcs: {
                en: 'inSkyFcs',
                cn: '空中',
                formatter: CommonData.flowsFormater
            }, skyLeapFcs: {
                en: 'skyLeapFcs',
                cn: '飞越(空中)',
                width : 80,
                formatter: CommonData.flowsFormater
            },
            groundLeapFcs: {
                en: 'groundLeapFcs',
                cn: '飞越(地面)',
                width : 80,
                formatter: CommonData.flowsFormater
            },
            total : {
                en: 'total',
                cn: '总数',
                formatter: CommonData.flowsFormater
            }

        },
        colModel : {},
        colDisplay : {},
        colTitle: {},
        cmTemplate : {
            width: 55,
            align: 'center',
            sortable: true,
            search: true,
            searchoptions : {
                sopt : ['cn','nc','eq','ne','lt','le','gt','ge','bw','bn','in','ni','ew','en'],
                dataEvents:[{
                    type: 'keyup',
                    fn: function(e) {
                        $(this).change();
                    }
                }]
            },
            cellattr : function(rowId, value, rowObject, colModel, arrData) {
                // 需要赋予表格的属性
                var attrs = '';
                // 无效数值不做处理
                if (!$.isValidVariable(value)) {
                    return attrs;
                }

                // var title =  rowObject[colModel.name];
                var colName = colModel.name;
                // 若单元此单元格对应的colName为地面、空中、飞越、总数,则调整该单元格样式
                if(colName == 'onGroundFcs' || colName == 'inSkyFcs' || colName == 'skyLeapFcs' || colName == 'groundLeapFcs' || colName == 'total' || colName == 'dcb'){
                    attrs = 'style="color:#337ab7; cursor: pointer"';
                }
                /*if(!$.isValidVariable(title)){
                    title = '';
                }
                //时间格式化 YYYYMMDD HH:MM
                var regexp = /(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))0229)/;
                if(regexp.test(title)){
                    title = title.substring(0,8) +' '+ title.substring(8,10) + ":" + title.substring(10,12);
                }*/
                // attrs += ' title="' + title + '"';
                // 状态列
                if(colName == 'statusZH'){
                    var className = setFlowcontrolStatusCellClassName(rowObject);
                    console.log(rowObject)
                    attrs = 'class="'+ className +'"';
                }

                return attrs;
            }
        },

    };
    // 流控表格当前选中的过滤标识
    var tag = ''

    /**
     * 定时器
     * @param fn 执行函数
     * @param instance 对象实例
     * @isNext 是否继续定时执行
     * @param time 时间间隔
     * */
    var startTimer = function (fn,instance,isNext,time) {
        if(timerValve){ // 定时器开关
            if(typeof fn == 'function'){
                setTimeout(function () {
                    fn(instance,isNext);
                }, time)
            }
        }
    };

    /**
     * 转换数据
     * @param data 数据集合
     * */
    var convertData = function () {
        // 方向
        convertDirections();
        // 状态
        convertStatus();
        // 原因
        convertReason();
        // 24小时
        convertStatistic24Hour();
        // 流控排行表
        convertrankings(tag);
    };


    var fireDataChange = function () {
        //方向
        chartObj.direction.getOption();
        chartObj.direction.fireData();

        //状态
        chartObj.status.getOption();
        chartObj.status.fireData();


        //原因
        chartObj.reason.getOption();
        chartObj.reason.fireData();
        // 24小时
        chartObj.statistic24Hour.getOption();
        chartObj.statistic24Hour.fireData();
        //流控排行表
        fireRankingsDataChange();
    };

    /**
     * 重新绘制方向和原因图表数据
     *
     * */
    var refireDataChange = function (param) {
        // 状态图表的图列
        var legend = param.selected;
        // 选中的图列项
        var available = [];
        for(var k in legend){
            if(legend[k]){
                available.push(k);
            }
        }
        // 更新到全局
        availableStatus = available;
        /** 重新设置方向和原因图表数据**/
        // 方向
        convertDirections();
        // 原因
        convertReason();
        //方向
        chartObj.direction.getOption();
        chartObj.direction.fireData();
        //原因
        chartObj.reason.getOption();
        chartObj.reason.fireData();

    };

    /**
     * 转换流控方向数据
     * */
    var convertDirections = function () {
        //清空
        dataStructure.direction.legend = [];
        dataStructure.direction.legendZh = [];
        dataStructure.direction.seriesData = [];
        dataStructure.direction.flows = {};
        //统计
        if($.isValidObject(FlowStatistic.allData.directions)){
            var obj = FlowStatistic.allData.directions;
            // 按指定排序依据遍历
            sortKey.direction.map(function (item, index) {
                // 获取对应流控数据
                var itemObj = obj[item];
                // 按选定的状态过滤流控数据
                var data =  filterFlowByAvailableStatus(itemObj);
                if($.isValidVariable(data)){
                    // 设置数据结构中方向字段相关数值
                    dataStructure.direction.legend.push(item);
                    dataStructure.direction.legendZh.push(data.directionZh);
                    dataStructure.direction.flows[item] = data.flows;
                    var dataObj = {};
                    dataObj.value = data.num;
                    dataObj.name = item;
                    dataStructure.direction.seriesData.push(dataObj);
                }
            });
        }
        //赋值
        chartObj.direction.data = dataStructure.direction;
    };
    /**
     * 转换流控状态数据
     * */
    var convertStatus = function () {
        dataStructure.status.legend = [];
        dataStructure.status.legendZh = [];
        dataStructure.status.seriesData = [];
        dataStructure.status.flows = {};
        //统计seriesData
        if($.isValidObject(FlowStatistic.allData.statuss)){
            var obj = FlowStatistic.allData.statuss;
            // 按指定排序依据遍历
            sortKey.status.map(function (item, index, arr) {
                // 过滤掉TERMINATED
                if(item == 'TERMINATED'){
                    return
                }
                // 获取对应流控数据
                var data = obj[item];
                if($.isValidVariable(data)){

                    // 设置数据结构中状态字段相关数值
                    dataStructure.status.legend.push(item);
                    dataStructure.status.legendZh.push(data.staticZh);
                    dataStructure.status.flows[item] = data.flows;
                    var dataObj = {};
                    dataObj.value = data.num;
                    dataObj.name = item;
                    dataStructure.status.seriesData.push(dataObj);
                }
            })

        }
        //赋值给图表对象
        chartObj.status.data = dataStructure.status;
    };

    /**
     *   转换流控原因数据
     * */
    function  convertReason() {
        dataStructure.reason.legend = [];
        dataStructure.reason.legendZh = [];
        dataStructure.reason.seriesData = [];
        dataStructure.reason.flows = {};

        //统计seriesData
        if($.isValidObject(FlowStatistic.allData.reasons)){
            var obj = FlowStatistic.allData.reasons;
            sortKey.reason.map(function (item, index, arr) {
                // 获取对应流控数据
                var itemObj = obj[item];
                // 按选定的状态过滤流控数据
                var data =  filterFlowByAvailableStatus(itemObj);
                if($.isValidVariable(data)){
                    dataStructure.reason.legend.push(item);
                    dataStructure.reason.legendZh.push(data.reasonZh);
                    dataStructure.reason.flows[item] = data.flows;
                    var dataObj = {};
                    dataObj.value = data.num;
                    dataObj.name = item;
                    dataStructure.reason.seriesData.push(dataObj);
                }
            })
        }
        //赋值给图表对象
        chartObj.reason.data = dataStructure.reason;
    }


    /**
     * 转换流控24小时数据
     * */
    function convertStatistic24Hour() {
        dataStructure.statistic24Hour.xAxisData = [];
        dataStructure.statistic24Hour.seriesData = [];
        dataStructure.statistic24Hour.flows = {};

        //统计seriesData
        if($.isValidObject(FlowStatistic.allData.hours24)){
            var obj = FlowStatistic.allData.hours24;
            for(var i in obj){
                var data = obj[i];
                dataStructure.statistic24Hour.xAxisData.push(i);
                dataStructure.statistic24Hour.flows[i] = data.flows;
                var num = data.num;
                dataStructure.statistic24Hour.seriesData.push(num);
            }
        }
        //赋值给图表对象
        chartObj.statistic24Hour.data = dataStructure.statistic24Hour;
    }

    /**
     *  转换流控排行表数据
     * */
    function  convertrankings() {
        var obj = null;
        if(tag == 'rankings'){
            obj = FlowStatistic.allData.rankings;
        }else if(tag == 'all'){
            obj = FlowStatistic.allData.allflows;
        }
        if(!$.isValidObject(obj)){
            return;
        }
        rankingsTableObj.tableDataMap = {};
        rankingsTableObj.tableData = {};
        var tableData = [];
        var tableMap = {};
        for (var index in obj) {
            var d = obj[index];
            tableData.push(d);
            tableMap[obj[index].id] = d;
        }
        rankingsTableObj.tableDataMap = tableMap;
        rankingsTableObj.tableData = tableData;
    }
    
    /***
     * 流控图表排序规则
     *
     * */
    var initSortRule = function () {
        // 方向
        if($.isValidObject(FlowStatistic.allData.directions)){
            sortKey.direction = sortRule(FlowStatistic.allData.directions);
        }

        // 状态
        if($.isValidObject(FlowStatistic.allData.statuss)){
            sortKey.status = sortRule(FlowStatistic.allData.statuss);
            if(!availableStatus){
                availableStatus=  sortKey.status
            }
        }

        // 原因
        if($.isValidObject(FlowStatistic.allData.reasons)){
            sortKey.reason = sortRule(FlowStatistic.allData.reasons);
        }
    };

    var sortRule = function (obj) {
        // 取数据集合项的字段名称和sort值
        var arr = [];
        for(var i in obj){
            var d = {};
            d['name'] = i;
            d['sort'] = obj[i].sort;
            arr.push(d);
        }
        //排序 升序
        var sortArr = arr.sort(function(a,b){
            var a_sort = a.sort*1;
            var b_sort = b.sort*1;
            if(a_sort > b_sort){
                return 1;
            }else if(a_sort < b_sort){
                return -1;
            }else{
                return 0;
            }
        });
        // 取排序后的名称
        var result = [];
        sortArr.map(function(item,index){
            result.push(item.name)
        });
        return result;
    }

    /**
     * 初始化图表
     * */
    var initEcharts = function () {
        //方向
        chartObj.direction = new PieCharts({
            seriesName : 'direction',
            canvasId :'flow_direction',
            title :  '流控方向',
            // 饼图的半径
            radius : ['55%', '85%']
        });
        chartObj.direction.initChart();
        //状态
        chartObj.status = new PieCharts({
            seriesName : 'status',
            canvasId :'flow_status',
            title :  '流控状态',
            // labelColor : '#fff',
            radius : ['55%', '85%']
        });
        chartObj.status.initChart();
        chartObj.status.chartsObj.on('legendselectchanged', function (params) {
            refireDataChange(params);
        });
         //原因
        chartObj.reason = new PieCharts({
            seriesName : 'reason',
            canvasId :'flow_reason',
            title :  '流控原因',
            // labelColor : '#fff',
            radius : ['55%', '85%']
        });
        chartObj.reason.initChart();

        // 24小时
        // initBarChart();
        chartObj.statistic24Hour = new BarCharts({
            canvasId : 'statistic_24_hour',
            legend : {
                data : ['流控数量']
            },
            xAxisName : '时间',
            yAxisName : '数量'
        });
        chartObj.statistic24Hour.initChart();

    };

    /**
     * 初始化表格配置
     * @param obj
     *
     * */
    var initTableParams = function (obj) {
        obj.colModel = {};
        obj.colDisplay = {};
        obj.colTitle = {};
        //取colName为参照
        var colNames = obj.colName;
        // 遍历生成对应的colModel、colDisplay、colTitle
        for(var i in colNames){
            var val = colNames[i];
            obj.colModel[i] = {name: i};
            if($.isValidVariable(val.width)){
                obj.colModel[i]['width'] =  val.width;
            }
            if($.isValidVariable(val.formatter)){
                obj.colModel[i]['formatter'] = val.formatter;
            }
            // 设置冻结列frozen: true,
            if($.isValidVariable(val.frozen)){
                obj.colModel[i]['frozen'] = val.frozen;
            }
            obj.colDisplay[i]= {display : 1};
            obj.colTitle[i] = val.cn;
            // 设置特殊单元格class
            if(val.classes){
                obj.colModel[i]['classes'] = val.classes
            }
        };
    };

    /**
     *  设置流控排名表格容器的大小
     * */
    var initRankingstContainerSize = function () {
        var canvas = $('.tb_rankings_canvas');
        var box = canvas.parent();
        var title = box.children('h2');
        var h = box.height() - title.outerHeight();
        canvas.height(h);
    };

    /**
     *  初始化表格
     * */
    var initGridTable = function () {
        rankingsTableObj = new FlightGridTable({
            canvasId : tableCanvasId,
            tableId: tableId,
            pagerId: tablePagerId,
            colNames: tableParams.colName,
            colModel: tableParams.colModel,
            cmTemplate: tableParams.cmTemplate,
            colDisplay: tableParams.colDisplay,
            colTitle: tableParams.colTitle,
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
                afterSearchCallBack : function(){

                },
                onCellSelect : function (rowid, iCol, cellcontent, e) {
                    //
                    var colModel = rankingsTableObj.gridTableObject.jqGrid('getGridParam')['colModel'];
                    var colName =colModel[iCol].name;
                    // 若单元此单元格对应的colName为地面、空中、飞越、总数,则为被格式化显示的航班Id集合单元格
                    if(colName == 'onGroundFcs' || colName == 'inSkyFcs' ||
                        colName == 'skyLeapFcs' || colName == 'groundLeapFcs' || colName == 'total'){

                        // 取表格的tableDataMap数据对应该字段的数值
                        var val = rankingsTableObj.tableDataMap[rowid][colName];
                        //若数值有效,
                        if($.isValidVariable(val)){
                            var id = rankingsTableObj.tableDataMap[rowid].id;
                            var name = rankingsTableObj.tableDataMap[rowid].name;
                            var colNameCN = tableParams.colName[colName].cn;
                            //todo
                            var opt = {
                                //类型 流控航班
                                type : 'flight',
                                name : '流控 ( '+name+ ' '+ colNameCN + ' ) 航班信息',
                                id : id,
                                ids: val,
                                generateTime : CommonData.generateTime
                            };
                           CommonData.createDhxWindow(opt);
                        }
                    }

                    // 若此单元格对应的colModel的colName是name，则此单元格为流控名称
                    if (colName == 'name') {

                        var opt = {
                            name: cellcontent, // 流控名称
                            id: rowid, // 流控ID
                        };
                        // 弹出流控详情页面
                        CommonData.createFlowDetailDhxWindow(opt);
                    }
                    // 若此单元格对应的colModel的colName是dcb，则弹出DCB计算历史记录页面
                    if (colName == 'dcb') {
                        var rowData = rankingsTableObj.gridTableObject.jqGrid().getRowData(rowid);
                        var opt = {
                            name: rowData.name+' DCB(历史计算记录)', // 流控名称
                            id: rowid, // 流控ID
                            width: 800, // 窗口宽度
                            height: 600, // 窗口高度
                            type : 'dcb'
                        };
                        // 弹出DCB计算历史记录页面
                        CommonData.createDhxWindow(opt);
                    }
                    console.log(rowid, iCol, cellcontent );

                }
            }
        });
        //初始化
        rankingsTableObj.initGridTableObject();
        rankingsTableObj.resizeToFitContainer();
        //调整表格大小以适应所在容器
        $(window).resize(function () {
            if($.isValidObject(rankingsTableObj)){
                initRankingstContainerSize();
                rankingsTableObj.resizeToFitContainer();
            }
        });


    };


    /**
     * 触发流控排行表数据更新
     * */
    var fireRankingsDataChange = function () {
        rankingsTableObj.drawGridTableData();
    };

    /**
     * 清空图表和流控排名表格
     * */
    var clear = function () {
        //图表
        for(var i in chartObj){
            chartObj[i].clear();
        }
        //流控排名表格
        rankingsTableObj.gridTableObject.jqGrid('clearGridData');
    };

    /**
     * 流控排名表切换
     * */
    var initTogglerRanking = function () {
        var title = $('.rankings_table_container .rankings_title');
         $('.rankings_filter').on('change',function () {
             tag = $(this).val();
             if(tag == 'all'){
                 title.text('全部流控表');
             }else if(tag == 'rankings'){
                 title.text('流控排名表');
             }
             //清空流控排名表格数据
             rankingsTableObj.gridTableObject.jqGrid('clearGridData');
             convertrankings();
             fireRankingsDataChange()

         });
    };

    /**
     * 初始化流控表标识
     * */
    var initDefaultRangkingTag = function () {
        tag = $('.rankings_filter').val();
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

    /**
     * 按选定的状态过滤流控数据
     *
     * */
    var filterFlowByAvailableStatus = function (data) {
        if(!$.isValidObject(data.flows)){
            return data;
        }
        //复制原数据
        var result = JSON.parse(JSON.stringify(data));
        // 重置flows 和 num
        result.num = 0;
        result.flows = [];
        availableStatus.map(function (item, index, p3) {
           var len = data.flows.length;
           for(var i =0; i< len; i++){
               var id = data.flows[i];
               var flowControl = FlowStatistic.flowData[id];
               if(flowControl.status == item){
                   result.num = result.flows.push(id);
               }
           }

        });

        return result
    };


    return {
        init : function () {
            //初始化图表
            initEcharts();
            //初始化表格参数配置
            initTableParams(tableParams);
            //
            initRankingstContainerSize();
            //初始化表格
            initGridTable();

            initDefaultRangkingTag();
            //
            initTogglerRanking();


        },
        allData : allData,
        flowData : flowData,
        flightData : flightData,
        initSortRule : initSortRule,
        convertData : convertData,
        fireDataChange : fireDataChange,
        clear : clear
    }
}();

$(document).ready(function () {
    FlowStatistic.init();
});

