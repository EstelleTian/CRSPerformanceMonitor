/**
 * Created by caowei on 2017/12/15.
 */
var OPTIONS = function (optObj) {
    this.backgroundColor = 'transparent',
        this.title = {
            text: '24小时执行情况',
            textStyle: {
                fontSize: "12",
                fontWeight:"normal"
            },
        },
        this.color = ["#07a2a4","#315c7c","#8d98b3"],
        this.grid = {
            left: '3%',
            right: '1%',
            bottom: '3%',
            width: "85%",
            height: "65%",
            containLabel: true
        },
        this.tooltip = {
            trigger: 'axis',
            height: 15,
            textStyle: {
                fontSize: "12"
            },
            axisPointer: {
                label: {
                    backgroundColor: '#6a7985',
                }
            }
        },
        this.legend = {
            data: optObj.legendData,
            padding:[20,0,0,40],
            textStyle: {
                fontSize: "11"
            },
            x:100,
        },
        this.xAxis = {
            name: "时间",
            data: optObj.xAxisData,
            boundaryGap:true,
            axisLabel : {
                formatter : function (value, index) {
                    return value.substring(8,10);
                }
            }

        },
        this.yAxis = {
            name: "航班数",
            type: 'value',
            minInterval: 1

        },
        // this.dataZoom = {
        //     show: false,
        //     start: 70,
        //     height: 13,
        //     zoomLock: false,
        //     bottom: "5",
        //     end: 100
        // },
        this.series = optObj.series
};
OPTIONS.prototype.refreshOption = function (optObj) {
    this.title = {
        text: '24小时执行情况',
        textStyle: {
            fontSize: "14",
            fontWeight:"normal"
        },
    },
        this.color = ["#07a2a4","#315c7c","#8d98b3"],
        this.grid = {
            left: '3%',
            right: '1%',
            bottom: '3%',
            width: "85%",
            height: "65%",
            containLabel: true
        },
        this.tooltip = {
            trigger: 'axis',
            height: 15,
            textStyle: {
                fontSize: "12"
            },
            axisPointer: {
                label: {
                    backgroundColor: '#6a7985',
                }
            }
        },
        this.legend = {
            data: optObj.legendData,
            padding:[20,0,0,40],
            textStyle: {
                fontSize: "11"
            },
            x:100,
        },
        this.xAxis = {
            name: "时间",
            data: optObj.xAxisData,
            boundaryGap:true,

        },
        this.yAxis = {
            name: "航班数",
            type: 'value',
            minInterval: 1

        },
        // this.dataZoom = {
        //     show: true,
        //     start: 70,
        //     height: 13,
        //     zoomLock: false,
        //     bottom: "5",
        //     end: 100
        // },
        this.series = optObj.series
}
