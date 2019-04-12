/***********************饼状图*******************************/
function PieCharts(params){
    this.canvasId = params.canvasId;
    this.title = params.title;
    //饼图的半径
    this.radius = params.radius || [0, '75%'];
    this.seriesName = params.seriesName;
    this.type = params.type;
    this.labelColor = params.labelColor || 'inner';
    this.legend = params.legend;
    this.data = params.data;
    this.chart = {};
    this.chartsObj = {};
    this.option = {};
    this.data = {};
}

PieCharts.prototype.initChart = function () {
    var thisProxy = this;
    thisProxy.chart =$('.'+ thisProxy.canvasId)[0];
    thisProxy.chartsObj = echarts.init(thisProxy.chart);
    // 显示加载动画效果
    var opt = {
        text: '',
        // text: 'loading',
        color: '#61a0a8',
        textColor: '#000',
        maskColor: 'rgba(255, 255, 255, 0.8)',
        zlevel: 0
    }
    thisProxy.chartsObj.showLoading('default',opt);
    //事件绑定
    thisProxy.chartsObj.on('click',function (params) {
        var index = thisProxy.data.legend.indexOf(params.name);
        if(index == -1){
            return;
        }
        var subName = thisProxy.data.legendZh[index];
        var arr = thisProxy.data.flows[params.name];
        var opt = {
            type : 'flows',
            id : params.seriesName,
            ids : arr,
            // name :  '流控统计—'+ thisProxy.title +'—'+ subName+' 流控信息',
            name : '流控统计 ( '+ subName  +' ) '+' 流控信息',
            generateTime : CommonData.generateTime
        };
        CommonData.createDhxWindow(opt);
    });
    //绑定自适应大小
    $(window).resize(function () {
        thisProxy.chartsObj.resize();
    })
};

PieCharts.prototype.getOption = function () {
    var thisProxy = this;
    thisProxy.option = {
        "color": [
            "#07a2a4",
            "#315c7c",
            "#8d98b3",
            "#b6a2de",
            "#61a0a8",
            "#91c7ae",
            "#97b552",
            "#ab857c",
            "#61a0a8",
            "#ca7593",
            "#5ab1ef",
            "#9a7fd1",
            "#d6c10d",
            "#588dd5",
            "#bda29a",
            "#59678c",
            "#9cb046",
            "#6f5553",
            "#c9ab00",
            "#c4ccd3"
        ],
        // title : {
        //     text: thisProxy.title,
        //     textStyle : {
        //         fontSize : 15
        //     },
        //     subtext: '',
        //     x:'center'
        // },
        grid: {
            bottom: 0,
            right:0,
            top: 0
        },
        tooltip : {
            show : true,
            trigger: 'item',
            formatter: function ( params ) {
                var index = thisProxy.data.legend.indexOf(params.name);
                if(index == -1){
                    return "";
                }else{
                    var item = thisProxy.data.legendZh[index] + " : " + params.value;
                    return item;
                }
            }
        },
        legend: {
            show : true,
            type: 'scroll',
            orient: 'vertical',
            itemWidth: 8,
            itemHeight: 8,
            itemGap:8,
            left: '-2',
            top : '12',
            bottom : '0',
            data: thisProxy.data.legend,
            formatter: function (name ) {
                var index = thisProxy.data.legend.indexOf(name);
                return thisProxy.data.legendZh[index];
            }
        },
        series : [
            {
                name: thisProxy.title,
                type: 'pie',
                // clockwise: false,
                // roam:true,
                // selectedMode: 'single',
                avoidLabelOverlap: true,
                center: ['60%', '50%'],
                radius: ['0%', '0%'],
                label: {
                    normal: {
                        formatter: '{b}\n\n总计:{c}条',
                        fontSize: 14,
                        fontStyle :'bolder',
                        position: 'center',
                        verticalAlign:'middle'
                    }
                },
                data: [ {
                    name: thisProxy.title,
                    value: function(){
                        var seriesData = thisProxy.data.seriesData;
                        var total = 0;
                        for(var i in seriesData){
                            total += seriesData[i].value*1;
                        }
                        return total;
                    },
                }  ]
            },
            {
                name: thisProxy.seriesName,
                type: 'pie',
                center: ['60%', '50%'],
                // selectedMode: 'single',
                radius: thisProxy.radius,
                data: thisProxy.data.seriesData.reverse(),// 注意,此处颠倒数组中元素的顺序，用于逆时针显示条目
                avoidLabelOverlap: true,
                label: {
                    normal: {
                        formatter: function ( obj ) {
                            var value = obj.value;
                            if(0 == value*1){
                                return "";
                            }else{
                                var name = obj.name;
                                var index = thisProxy.data.legend.indexOf(name);
                                var nameCN = thisProxy.data.legendZh[index];
                                return nameCN+"："+value;
                            }
                        },
                        fontSize: 10,
                        position: 'inside'
                    }
                },
            }
        ]
    };
};

PieCharts.prototype.fireData = function () {
    var thisProxy = this;
    thisProxy.chartsObj.setOption(thisProxy.option);
    // 隐藏动画加载效果
    thisProxy.chartsObj.hideLoading();
};

PieCharts.prototype.clear = function () {
    var thisProxy = this;
    // 隐藏动画加载效果
    thisProxy.chartsObj.hideLoading();
    thisProxy.chartsObj.clear();
};

/***********************柱状图*******************************/

function BarCharts(params){
    this.canvasId = params.canvasId;
    this.data = {};
    this.chart = {};
    this.chartsObj = {};
    this.option = {};
    this.data = {};
    this.legend = params.legend;
    this.xAxisName = params.xAxisName;
    this.yAxisName = params.yAxisName;
    this.seriesName = params.seriesName;
}

BarCharts.prototype.initChart = function () {
    var thisProxy = this;
    thisProxy.chart =$('.'+ thisProxy.canvasId)[0];
    thisProxy.chartsObj = echarts.init(thisProxy.chart);
    // 显示加载动画效果
    var opt = {
        text: '',
        // text: 'loading',
        color: '#61a0a8',
        textColor: '#000',
        maskColor: 'rgba(255, 255, 255, 0.8)',
        zlevel: 0
    }
    thisProxy.chartsObj.showLoading('default',opt);
    //事件绑定
    thisProxy.chartsObj.on('click',function (params) {
        var opt = {
            type : 'flows',
            id : params.name,
            ids : thisProxy.data.flows[params.name],
            name : '流控24小时统计 ( '+timeFormaterYYYMMDDHH(params.name) +' ) 流控信息',
            generateTime : CommonData.generateTime
        };
        CommonData.createDhxWindow(opt);
    });
    //绑定自适应大小
    $(window).resize(function () {
        thisProxy.chartsObj.resize();
    })
};

BarCharts.prototype.getOption = function () {
    var thisProxy = this;
    thisProxy.option = {

        tooltip : {
            show : true,
            trigger: 'axis',
            axisPointer: {
                type: 'line'
            },
            /*formatter: function (params ) {
                var index = thisProxy.data.legend.indexOf(params.name);
                return thisProxy.data.legendZh[index] + " : " + params.value;
            }*/
        },
        legend: thisProxy.legend,
        grid : {
            left : 25,
            right : 40,
            bottom : 25
        },
        xAxis: [
            {
                name : thisProxy.xAxisName,
                type: 'category',
                data: thisProxy.data.xAxisData,
                axisLabel : {
                    formatter : function (value, index) {
                        return value.substring(8,10);
                    }
                }

            }
        ],
        yAxis: [
            {
                name : thisProxy.yAxisName,
                type: 'value'
            }
        ],
        series: [{
            name : thisProxy.legend.data,
            itemStyle : {
                normal : {
                    color: "#61a0a8",
                }
            },
            type: 'line',
            data : thisProxy.data.seriesData,
        }]
    };
};

BarCharts.prototype.fireData = function () {
    var thisProxy = this;
    thisProxy.chartsObj.setOption(thisProxy.option);
    // 隐藏动画加载效果
    thisProxy.chartsObj.hideLoading();
};

BarCharts.prototype.clear = function () {
    var thisProxy = this;
    // 隐藏动画加载效果
    thisProxy.chartsObj.hideLoading();
    thisProxy.chartsObj.clear();
};

function timeFormaterYYYMMDDHH(time) {
    var val = time*1;
    if ( $.isValidVariable(time) && !isNaN(val) && time.length == 10  ) {
        return time.substring(0,4)+ '-'+ time.substring(4, 6) + '-' + time.substring(6,8) + ' ' + time.substring(8,10);
    } else {
        return '';
    }
};