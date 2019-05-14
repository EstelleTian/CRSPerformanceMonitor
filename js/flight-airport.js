/**
 * Created by caowei on 2017/12/14.
 */
var Flight = function () {
    // 航班监控对象
    var flightMonitorData = null;
    //航班监控当前关注方向
    var flightMonitorDirection = "";
    //机场数据对象
    var airportAllData = {};
    //地面延误航班源数据
    var groundLate = null;
    //数据刷新时间
    var generateTime = null;
    //用户ID
    var userId = localStorage.getItem("userId");
    //登录唯一值
    // var onlyValue = localStorage.getItem("onlyValue");
    //表格配置
    var user_property = localStorage.getItem('userProperty')
    user_property = JSON.parse(user_property)
    //定时器开关
    var timerValve = true;
    /**全局保存柱形图对象以及配置参数
     * */
    var charDataArr = {
        charts: [],
        options: []
    };

    /**
     * 航班监控数据转换
     */
    var flightData = {
        // now_control: 'flightsCurrentFlowcontrol',
        // has_single: 'flyOverHasSignal',
        // no_single: 'flyOverNoSignal',
        // area_out: 'flightsAreaOut',
        // area_in: 'flightsAreaIn',

        // flights_total_flowcontrol: 'flightsTotalFlowcontrol',
        // already_release_precent: 'alreadyReleaseExeRate',
        already_release_in: 'alreadyRelease', // 已放行总量
        flights_exempt: 'flightsExempt', // 豁免航班
        flights_pool_in: 'flightsPoolIn', // 入池航班
        manual_intervention: 'manualIntervention', // 人工干预航班
        flights_close_wait: 'flightsCloseWait', // 关舱门等待航班
        already_release_out: 'alreadyReleaseFlyOver', // 已出区域量（飞越）
        flights_delay_no_fly: 'flightsDelayNoFly', // 地面延误航班
        wait_release_area_in: 'waitReleaseAreaIn', // 待放行总量
        wait_release_area_out: 'waitReleaseAreaOut',  // 未出区域量（飞越）
        before_hour_actual_release: 'beforeHourActualRelease', // 上一小时实际放行航班
        current_hour_estimate_release: 'currentHourEstimateRelease', // 当前一小时预计放行航班
        next_hour_estimate_release: 'nextHourEstimateRelease', // 下一小时预计放行航班
        invalid_fcs: 'invalidFcs', // 失效航班
    };
    // 航班监控模块各项tooltip配置
    var tooltipData = {
        // 已放行总量
        already_release_in: '受流控影响航班（系统负责分配时隙）已起飞总量',
        // 豁免航班
        flights_exempt: '优先级调整为豁免的航班总量',
        // 入池航班
        flights_pool_in: '受控航班入池航班总量',
        // 人工干预航班
        manual_intervention: '人工进行过时隙相关时间调整的航班',
        // 关门等待航班
        flights_close_wait: '本地区放行舱门关闭但未起飞航班',
        // 飞越航班（已出区域量，未出区域量）
        already_release: '受流控影响飞越航班总量',
        // 地面延误航班
        flights_delay_no_fly: '受控航班未起飞且已延误（延误标准）',
        // 待放行总量
        wait_release_area_in: '受流控影响航班（系统负责分配时隙）未起飞总量',
        // 上一小时实际放行航班
        before_hour_actual_release: '当前时间上一小时范围内本区域受控航班已起飞总量',
        // 当前一小时预计放行航班
        current_hour_estimate_release: '当前时间一小时范围内本区域受控航班预计起飞总量',
        // 下一小时预计放行航班
        next_hour_estimate_release: '当前时间下一小时范围本区域受控航班预计起飞总量',
        // 失效航班
        invalid_fcs: '本地区放行标识为取消、退出时隙分配及EOBT超时航班'
    };
    /**
     * 航班监控数据转换
     * @param data
     */
    var flightMonitorDataConvert = function (data) {
        Flight.flightMonitorData = {
            // flightsCurrentFlowcontrol: [],
            // flyOverHasSignal: [],
            // flyOverNoSignal: [],
            // flightsAreaOut: [],
            // flightsAreaIn: [],
            // alreadyReleaseExeRate: ''
            // flightsTotalFlowcontrol: [],
            flightsExempt: [], // 豁免航班
            flightsPoolIn: [], // 入池航班
            manualIntervention: [], // 人工干预航班
            flightsCloseWait: [], // 关舱门等待航班
            alreadyRelease: [], // 已放行总量
            alreadyReleaseFlyOver: [], // 已出区域量（飞越）
            flightsDelayNoFly: [], // 地面延误航班
            waitReleaseAreaIn: [], // 待放行总量
            waitReleaseAreaOut: [], // 未出区域量（飞越）
            beforeHourActualRelease: [], // 上一小时实际放行航班
            currentHourEstimateRelease: [], // 当前一小时预计放行航班
            nextHourEstimateRelease: [], // 下一小时预计放行航班
            invalidFcs: [], //失效航班

        };
        var flightTotalData = data.flights;
        flightMonitorDirection = $('.direction_filter').val();
        $.each(flightData, function (i, e) {
            if (e != 'alreadyReleaseExeRate') {
                $(data[e]).each(function (n, m) {
                    if (flightMonitorDirection == 'all_direction') {
                        Flight.flightMonitorData[e].push(flightTotalData[m])
                    } else {
                        if (flightTotalData[m].clearanceDirection == flightMonitorDirection) {
                            Flight.flightMonitorData[e].push(flightTotalData[m])
                        }
                    }
                })
            } else {
                Flight.flightMonitorData[e] = data[e]
            }
        })
    }
    /**
     * 初始化航班监控航班方向
     * @param data
     */
    var initFlightDirection = function (data) {
        $.each(data.directions, function (i, e) {
            var opt = '<option value="' + i + '" class="' + i + 'click">' + e.directionZh + '</option>';
            $('.direction_filter').append(opt)
        });
        $('.direction_filter').on('change', function () {
            flightMonitorDataConvert(data);
            setFlightData(Flight.flightMonitorData);
        })
    }
    /**
     * 设置航班监控数据
     * @param data
     */
    var setFlightData = function (data) {
        if ($.isValidObject(data)) {
            $.each(flightData, function (i, e) {
                if ($.isArray(data[flightData[i]])) {
                    $("." + i).text(data[flightData[i]].length).attr("title", data[flightData[i]].length)
                } else {
                    //已放行执行率
                    if ($.isValidVariable(data[flightData[i]]) && flightMonitorDirection == 'all_direction') {
                        $("." + i).text(data[flightData[i]]).attr("title", data[flightData[i]])
                    } else {
                        $("." + i).html("-").attr('title', "")
                    }
                }

            })
        } else {
            $.each(flightData, function (i, e) {
                if ($.isArray(data[flightData[i]])) {
                    $("." + i).text("")
                } else {
                    $("." + i).text('')
                }

            })
        }
    }
    /**
     * 初始化航班监控点击事件
     */
    var initFlightDataClick = function () {

        //当前受控总航班
        $(".all_control").click(function () {
            var winObj = {
                winId: "flightsTotalFlowcontrol",
                winHead: "航班监控",
                detail: "当前受控航班"
            };
            initGridWindow(winObj, Flight.flightMonitorData.flightsCurrentFlowcontrol, CommonData.generateTime);
        });

        //豁免航班
        $(".flights_exempt").click(function () {
            var winObj = {
                winId: "flightsExempt",
                winHead: "航班监控",
                detail: "豁免航班"
            };
            initGridWindow(winObj, Flight.flightMonitorData.flightsExempt, CommonData.generateTime);
        });
        //入池航班
        $(".flights_pool_in").click(function () {
            var winObj = {
                winId: "flightsPoolIn",
                winHead: "航班监控",
                detail: "入池航班"
            };
            initGridWindow(winObj, Flight.flightMonitorData.flightsPoolIn, CommonData.generateTime);
        });
        //人工干预航班
        $(".manual_intervention").click(function () {
            var winObj = {
                winId: "manualIntervention",
                winHead: "航班监控",
                detail: "人工干预航班"
            };
            initGridWindow(winObj, Flight.flightMonitorData.manualIntervention, CommonData.generateTime);
        });
        //关舱门等待航班
        $(".flights_close_wait").click(function () {
            var winObj = {
                winId: "flightsCloseWait",
                winHead: "航班监控",
                detail: "关舱门等待航班"
            };
            initGridWindow(winObj, Flight.flightMonitorData.flightsCloseWait, CommonData.generateTime);
        });
        //已放行总量
        $(".already_release_in").click(function () {
            var winObj = {
                winId: "alreadyRelease",
                winHead: "航班监控",
                detail: "已放行总量"
            };
            initGridWindow(winObj, Flight.flightMonitorData.alreadyRelease, CommonData.generateTime);
        });
        //已出区域量（飞越）
        $(".already_release_out").click(function () {
            var winObj = {
                winId: "alreadyReleaseFlyOver",
                winHead: "航班监控",
                detail: "已出区域量（飞越）"
            };
            initGridWindow(winObj, Flight.flightMonitorData.alreadyReleaseFlyOver, CommonData.generateTime);
        });

        //地面延误航班
        $(".flights_delay_no_fly").click(function () {
            var winObj = {
                winId: "flightsDelayNoFly",
                winHead: "航班监控",
                detail: "地面延误航班"
            };
            initGridWindow(winObj, Flight.flightMonitorData.flightsDelayNoFly, CommonData.generateTime);
        });

        //待放行总量
        $(".wait_release_area_in").click(function () {
            var winObj = {
                winId: "waitReleaseAreaIn",
                winHead: "航班监控",
                detail: "待放行总量"
            };
            initGridWindow(winObj, Flight.flightMonitorData.waitReleaseAreaIn, CommonData.generateTime);
        });
        //未出区域量（飞越）
        $(".wait_release_area_out").click(function () {
            var winObj = {
                winId: "waitReleaseAreaOut",
                winHead: "航班监控",
                detail: "未出区域量（飞越）"
            };
            initGridWindow(winObj, Flight.flightMonitorData.waitReleaseAreaOut, CommonData.generateTime);
        });
        //上一小时实际放行航班
        $(".before_hour_actual_release").click(function () {
            var winObj = {
                winId: "beforeHourActualRelease",
                winHead: "航班监控",
                detail: "上一小时实际放行航班"
            };
            initGridWindow(winObj, Flight.flightMonitorData.beforeHourActualRelease, CommonData.generateTime);
        });
        //当前一小时预计放行航班
        $(".current_hour_estimate_release").click(function () {
            var winObj = {
                winId: "currentHourEstimateRelease",
                winHead: "航班监控",
                detail: "当前一小时预计放行航班"
            };
            initGridWindow(winObj, Flight.flightMonitorData.currentHourEstimateRelease, CommonData.generateTime);
        });
        //下一小时预计放行航班
        $(".next_hour_estimate_release").click(function () {
            var winObj = {
                winId: "nextHourEstimateRelease",
                winHead: "航班监控",
                detail: "下一小时预计放行航班"
            };
            initGridWindow(winObj, Flight.flightMonitorData.nextHourEstimateRelease, CommonData.generateTime);
        });
        //失效航班
        $(".invalid_fcs").click(function () {
            var winObj = {
                winId: "invalidFcs",
                winHead: "航班监控",
                detail: "失效航班"
            };
            initGridWindow(winObj, Flight.flightMonitorData.invalidFcs, CommonData.generateTime);
        });
    }
    /**
     * 初始化机场点击事件
     */
    var initAirportClick = function () {
        var lateData = groundLate.result.airportsMonitor.result;
        if ($.isValidObject(lateData)) {
            $.each(lateData, function (i, e) {
                $(".flights_floor_delay" + e.airport).click(function () {
                    lateData = groundLate.result.airportsMonitor.result;
                    var groundLateArr = [];
                    $.each((lateData[this.id]).floorDelay, function (j, e) {
                        groundLateArr.push(airportAllData[e]);
                    })
                    var winObj = {
                        winId: ".flights_floor_delay" + i,
                        winHead: "机场监控",
                        detail: e.airport + "机场地面延误航班"
                    };
                    if ($.isValidVariable(groundLate.generateTime)) {
                        initGridWindow(winObj, groundLateArr, groundLate.generateTime);
                    }
                })
                if ($.isValidObject(lateData[i].runwayDcb)) {
                    $('.runway_dcb' + e.airport).popover(
                        {
                            selector: '.dcb',
                            trigger: 'manual', //触发方式
                            placement: 'auto ',
                            // container: '.airport_wrap',
                            viewport: {selector: '.airport_wrap', padding: 0},
                            title: e.airport + '机场跑道DCB详情',
                            html: true, // 为true的话，data-content里就能放html代码了
                            content: '<div class="' + e.airport + 'container">' + runWayDcbConfig(lateData[i].runwayDcb) + '</div><p><button apName="' + e.airport + '" data-style="zoom-out" class="pull-left ladda-button searchDCB' + e.airport + ' atfm-btn atfm-btn-blue btn-default-sm">查询历史DCB值</button><button apName="' + e.airport + '" class="pull-right  closeDCB' + e.airport + ' atfm-btn btn-default-sm">关闭</button></p>',
                        }
                    )
                    $('.runway_dcb' + e.airport).on('click', function () {
                        $(this).popover('show').on('shown.bs.popover', function () {
                            lateData = groundLate.result.airportsMonitor.result;
                            $('.' + e.airport + 'container').html(runWayDcbConfig(lateData[i].runwayDcb));
                            var thisProxy = $(this)
                            currnetDCBClick(e.airport, thisProxy)
                            //判断是否绑定点击事件
                            var objEvt = $._data($('.searchDCB' + e.airport)[0], 'events');
                            if (objEvt && objEvt['click']) {
                                return
                            } else {
                                $('.searchDCB' + e.airport).on('click', function () {
                                    var loading = Ladda.create(this);
                                    loading.start();
                                    var apName = $(this).attr('apName');
                                    $.ajax({
                                        type: "GET",
                                        url: ipHost + "runway_dcb_history_detail?userId=" + userId + '&apName=' + apName,
                                        dataType: "json",
                                        success: function (data) {
                                            if (data.status == 200) {
                                                loading.stop();
                                                thisProxy.popover('hide')
                                                if ($.isValidObject(data)) {
                                                    var titileTime = data.generateTime;
                                                    var winObj = {
                                                        winId: "RunwayDCb",
                                                        winHead: "机场跑道DCB历史记录",
                                                        detail: apName + "机场跑道DCB历史记录"
                                                    }
                                                    var dataObj = data.result;
                                                    initDCBWindow(winObj, dataObj, titileTime, apName)
                                                } else {
                                                    console.warn('The flow data is empty');
                                                }
                                            } else {
                                                loading.stop();
                                                clearAirportData()
                                            }
                                        },
                                        error: function (xhr, status) {
                                            loading.stop();
                                            clearAirportData()
                                            if (refresh) {
                                                startTimer(initAirportData, airportAllData, true, 30 * 1000);
                                            }
                                        }
                                    })
                                })
                                $('.closeDCB' + e.airport).on('click', function () {
                                    thisProxy.popover('hide')
                                })
                            }
                        })
                    })
                }
            })
        }
    }
    /**
     *跑道dcb模块dom结构
     * @param dataobj
     * @returns {string}
     */
    var runWayDcbConfig = function (dataobj) {
        var string = '';
        $.each(dataobj.runwayList, function (i, e) {
            string += '<tr class="single"><td>' + (parseInt(i) + 1) + '</td><td>' + e.logicRwName + '</td><td class="demand" runway = ' + e.logicRwName + ' historytime = ' + dataobj.startDateTime + '>' + e.demandValue + '</td><td>' + e.capcityValue + '</td><td>' + e.dcIndex + '</td></tr>'
        })
        var str = '<table class="table table-bordered"><thead><tr><th>序号</th><th>跑道方向</th><th>需求值</th><th>容量值</th><th>dcb指数</th></tr></thead><tbody>' + string + '<tr><td>统计</td><td></td><td class="all-demand demand" apName = ' + dataobj.apName + ' historytime = ' + dataobj.startDateTime + '>' + dataobj.rwDemandSumCount + '</td><td>' + dataobj.rwCapcitySumCount + '</td><td></td></tr>' + '</tbody></table><p>提示: 机场跑道DCB总值(' + dataobj.dcIndexSumCount + ') = ' + dataobj.rwDemandSumCount + '/' + dataobj.rwCapcitySumCount + '</p>';
        return str
    }

    var currnetDCBClick = function (apname, popObj) {
        //单条dcb点击事件
        $('.single .demand').on('click', function () {
            var apName = apname;
            var runWay = $(this).attr('runway');
            var historyTime = $(this).attr('historytime')
            allHistoryDcbFlight(apName, historyTime, runWay)
            popObj.popover('hide')
        })
        //全部dcb点击事件
        $('.all-demand').on('click', function () {
            var apName = apname;
            var runWay = '';
            var historyTime = $(this).attr('historytime')
            allHistoryDcbFlight(apName, historyTime, runWay)
            popObj.popover('hide')
        })
    }
    /**
     * 数据清除
     */
    var clearAirportData = function () {
        $(".cADRV").text("");
        $(".nADRV").text("");
        $(".currentRunwayCapacity").text("");
        $(".nextRunwayCapacity").text("");
        $(".regularRate").text("");
        $(".ctotConformRate").text("");
        $(".floor_delay ").text("");
        $.each(charDataArr.charts, function (i, e) {
            e.clear()
        })

    }


    /**
     *
     *更新机场数据
     * */
    var fireAirportDataChange = function (data) {


        if (groundLate == null) {
            groundLate = data;
            airportAllData = data.result.flights;
            generateTime = data.generateTime;
            // 隐藏loading
            if ($.isValidObject(groundLate)) {
                initAirDom($(".airport_wrap"), groundLate);
                initAirportClick();
            }

        } else {
            groundLate = data;
            airportAllData = data.result.flights;
            generateTime = data.generateTime;
            airportBarDataRefresh(data);
            refresAirportData(data);
        }
    }
    /**
     * 初始化机场数据
     * @param refresh
     */
    // var initAirportData = function (refresh) {
    //   $.ajax({
    //     type: "GET",
    //     url: ipHost + "airports_monitor?userId=" + userId ,
    //     dataType: "json",
    //     success: function (data) {
    //       if (data.status == 200) {
    //         $(".lds-ring").hide();
    //         if ($.isValidObject(data)) {
    //           if (groundLate == null) {
    //             groundLate = data;
    //             airportAllData = data.flights;
    //             generateTime = data.generateTime;
    //             // 隐藏loading
    //             if ($.isValidObject(groundLate)) {
    //               initAirDom($(".airport_wrap"), groundLate);
    //               initAirportClick();
    //             } else {
    //               console.warn('The airport data is empty')
    //             }
    //
    //           } else {
    //             groundLate = data;
    //             airportAllData = data.flights;
    //             generateTime = data.generateTime;
    //             airportBarDataRefresh(data);
    //             refresAirportData(data);
    //           }
    //         } else {
    //           console.warn('The flow data is empty');
    //         }
    //       } else if (data.status == 5680) {
    //         alert(data.error.message);
    //         refresh = false;
    //         CommonData.timerValve = false;
    //         window.location = "index.html";
    //       } else {
    //         clearAirportData()
    //       }
    //       //定时刷新
    //       if (refresh) {
    //         startTimer(initAirportData, data, true, 30 * 1000);
    //       }
    //     },
    //     error: function (xhr, status) {
    //       clearAirportData()
    //       if (refresh) {
    //         startTimer(initAirportData, airportAllData, true, 30 * 1000);
    //       }
    //     }
    //   });
    //
    //
    // };
    /*初始化机场DOM结构
     * fatherDom 接受机场详情dom的父节点
     * data机场数据
     * */
    var initAirDom = function (fatherDom, data) {
        var dataObj = data.result.airportsMonitor.result;
        if ($.isValidObject(dataObj)) {
            var flightData = data.result.flights;
            var generateTime = data.generateTime;
            var len = dataObj.length;
            for (var i = 0; i < len; i++) {
                airportLeftDataIsCorect(dataObj[i])
                if (!$.isValidObject(dataObj[i].runwayDcb)) {
                    var runDCB = '';

                } else {
                    var runDCB = "<li class='list_item clearfix'> <p class='list_item_name'>跑道DCB:</p><p class='value dcb runway_dcb" + dataObj[i].airport + "'>" + dataObj[i].runwayDcb.dcIndexSumCount + "</p> </li>"
                }
                var airDom = "<div class='airport_content aContent" + dataObj[i].airport + " clearfix'><div class='clearfix airport_head" + dataObj[i].airport + "'><div class='airport_name col-md-12'>" + dataObj[i].airport + "</div></div> <div class='col-md-4'> <ul class='airport_list'> <li class='list_item clearfix'> <p class='list_item_name'>ADR:</p><p class='value'><span class=' cADRV" + dataObj[i].airport + "'>" + dataObj[i].cADRV + "</span><span>/</span><sapn class=' nADRV" + dataObj[i].airport + "'>" + dataObj[i].nADRV + "</sapn></p></p> </li> <li class='list_item clearfix'> <p class='list_item_name'>跑道容量:</p> <p class='value'><span class='currentRunwayCapacity" + dataObj[i].airport + "'>" + dataObj[i].cRunC + "</span><span>/</span><sapn class='nextRunwayCapacity" + dataObj[i].airport + "'>" + dataObj[i].nRunC + "</sapn></p> </li> " + runDCB + " <li class='list_item clearfix'> <p class='list_item_name'>正常率:</p><p class='value regularRate" + dataObj[i].airport + "'>" + dataObj[i].regR + "</p> </li> <li class='list_item clearfix'> <p class='list_item_name'>CTOT符合率:</p> <p class='value ctotConformRate" + dataObj[i].airport + "'>" + dataObj[i].ctotR + "</p> </li> <li class='list_item clearfix'> <p class='list_item_name'>地面延误航班:</p> <p class='value floor_delay flights_floor_delay" + dataObj[i].airport + "'id='" + i + "'>" + dataObj[i].floorDelay.length + "</p> </li> </ul> </div> <div class='col-md-8 charts'><div class='airport_chart charts" + i + "'></div> </div> </div>"
                fatherDom.append(airDom);
                dataObj[i].generateTime = data.generateTime;
                var airportDataTime = data.generateTime;
                $(".airport_data_time").text("数据生成时间：" + CovertTime(airportDataTime));
                airportDataConvert(dataObj[i], flightData);


                var optObj = dataConvert(dataObj[i], generateTime);
                var options = new OPTIONS(optObj);
                var charts = echarts.init($(".charts" + i)[0])
                charts.setOption(options);
                charts.selectIndex = i;
                charts.options = options.series;
                charDataArr.charts.push(charts);
                charDataArr.options.push(options);

                charts.on("click", function (params) {
                    var len = this.options.length
                    for (var j = 0; j < len; j++) {
                        var name = this.options[j].name;
                        var generateTime = this.options[j].time;
                        var airport = this.options[j].airport;
                        var titleT = params.name
                        var titileTime = titleT.substring(0, 4) + '-' +
                            titleT.substring(4, 6) + '-' +
                            titleT.substring(6, 8) + '  ' +
                            titleT.substring(8, 10) + ':' +
                            "00";
                        if (name == params.seriesName) {
                            var winObj = {
                                winId: "flightsCurrentFlowcontrol",
                                winHead: "机场监控",
                                detail: airport + "机场" + titileTime + " " + name + "航班表格",
                            };
                            var index = this.selectIndex;
                            initGridWindow(winObj, charDataArr.options[index].series[j].flightArr[params.dataIndex], generateTime);
                        }
                    }
                });
            }
        }
    }
    /**
     * 机场左侧数据校验
     * @param obj
     */
    var airportLeftDataIsCorect = function (obj) {
        if (obj.cADRV == "" || obj.cADRV == "0") {
            obj.cADRV = "NA";
        }
        ;
        if (obj.nADRV == "" || obj.nADRV == "0") {
            obj.nADRV = "NA";
        }
        ;
        if (obj.cRunC == "" || obj.cRunC == "0") {
            obj.cRunC = "NA";
        }
        ;
        if (obj.nRunC == "" || obj.nRunC == "0") {
            obj.nRunC = "NA";
        }
        if (obj.ctotR == "") {
            obj.ctotR = "-";
        }
    }
    /**
     * 机场数据转换
     * @param dataObj
     * @param flightData
     */
    var airportDataConvert = function (dataObj, flightData) {
        dataObj.fplDepArr = [];
        dataObj.fplDepXArr = [];
        $(dataObj.fplDep).each(function (j, e) {
            var arr = [];
            for (var k = 0; k < e.fcs.length; k++) {
                arr.push(flightData[e.fcs[k]]);
            }
            dataObj.fplDepXArr.push(e.st);
            dataObj.fplDepArr.push(arr);
        });
        dataObj.planDepArr = [];
        dataObj.planDepXArr = [];
        $(dataObj.planDep).each(function (j, e) {
            var arr = [];
            for (var k = 0; k < e.fcs.length; k++) {
                arr.push(flightData[e.fcs[k]]);
            }
            dataObj.planDepXArr.push(e.st);
            dataObj.planDepArr.push(arr);
        });
        dataObj.praDepArr = [];
        dataObj.praDepXArr = [];
        $(dataObj.praDep).each(function (j, e) {
            var arr = [];
            for (var k = 0; k < e.fcs.length; k++) {
                arr.push(flightData[e.fcs[k]]);
            }
            dataObj.praDepXArr.push(e.st);
            dataObj.praDepArr.push(arr);
        });
    }
    /**
     * 机场柱形图数据更新
     * @param data
     */
    var airportBarDataRefresh = function (data) {
        var len = charDataArr.charts.length;
        var dataObj = data.result.airportsMonitor.result;
        var flights = data.result.flights;
        for (var i = 0; i < len; i++) {
            airportDataConvert(dataObj[i], flights);
            var optobj = dataConvert(dataObj[i]);
            charDataArr.options[i].refreshOption(optobj)
            charDataArr.charts[i].setOption(charDataArr.options[i]);
        }
    }
    /**
     * 机场左侧数据更新
     * @param data
     */
    var refresAirportData = function (data) {
        var dataObj = data.result.airportsMonitor.result;
        var len = $(".airport_name").length;
        var airportDataTime = data.generateTime;
        $(".airport_data_time").text("数据生成时间：" + CovertTime(airportDataTime));
        for (var i = 0; i < len; i++) {
            airportLeftDataIsCorect(dataObj[i])
        }
        $.each(dataObj, function (i, e) {
            $(".airport_name" + e.airport).text(dataObj[i].airport);
            $(".cADRV" + e.airport).text(dataObj[i].cADRV);
            $(".nADRV" + e.airport).text(dataObj[i].nADRV);
            $(".currentRunwayCapacity" + e.airport).text(dataObj[i].cRunC);
            $(".nextRunwayCapacity" + e.airport).text(dataObj[i].nRunC);
            $(".regularRate" + e.airport).text(dataObj[i].regR);
            $(".ctotConformRate" + e.airport).html(dataObj[i].ctotR);
            $(".flights_floor_delay" + e.airport).text(dataObj[i].floorDelay.length);
            if ($.isValidObject(dataObj[i].runwayDcb)) {
                $(".runway_dcb" + e.airport).text(dataObj[i].runwayDcb.dcIndexSumCount);
                //poppover内容
                // var contentStr = runWayDcbConfig(dataObj[i].runwayDcb);
                // //删除原有提示
                // $('.runway_dcb' + e.airport).popover('hide');
                // $('.runway_dcb'+e.airport).unbind('click')
                //更新poppover
                // $('.runway_dcb'+e.airport).on('click',function () {
                //   $(this).popover('show').on('shown.bs.popover',function () {
                //     var thisProxy = $(this)
                //     $('.searchDCB').click(function () {
                //       var apName = $(this).attr('apName');
                //       $.ajax({
                //         type: "GET",
                //         url: ipHost + "runway_dcb_history_detail?userId="+userId+"&onlyValue="+onlyValue+'&apName='+apName,
                //         dataType: "json",
                //         success: function (data) {
                //           if(data.status == 200){
                //             thisProxy.popover('hide')
                //             if($.isValidObject(data)){
                //               var titileTime = data.generateTime;
                //               var winObj = {
                //                 winId: "RunwayDCb",
                //                 winHead: "机场跑道DCB历史记录",
                //                 detail: apName + "机场跑道DCB历史记录"
                //               }
                //               var dataObj = data.result;
                //               initDCBWindow(winObj, dataObj, titileTime,apName)
                //             }else {
                //               console.warn('The flow data is empty');
                //             }
                //           }else{
                //             clearAirportData()
                //             $(".airport_init").showProgress('服务器异常,正在重新加载');
                //           }
                //         },
                //         error  : function (xhr, status) {
                //           clearAirportData()
                //           $(".airport_init").showProgress('服务器异常,正在重新加载');
                //           if(refresh){
                //             startTimer(initAirportData,airportAllData,true,30*1000);
                //           }
                //         }
                //       })
                //     })
                //     $('.closeDCB'+e.airport).on('click',function () {
                //       thisProxy.popover('hide')
                //     })
                //   })
                // })
                //跑道dcb内容更新
                if ($('.' + e.airport + 'container').is(':visible')) {
                    $('.' + e.airport + 'container').html(runWayDcbConfig(dataObj[i].runwayDcb))
                    //单条dcb点击事件
                    currnetDCBClick(e.airport, $('.runway_dcb' + e.airport))
                }
            }
        })
    }
    /**
     * 机场曲线图数据转换
     * @param data
     * @param generateTime
     * @returns {{lenData: string[], xAxisData: Array, series: Array, lenDataCh: {planDepArr: string, praDepArr: string, fplDepArr: string}, legendData: Array}}
     */
    var dataConvert = function (data, generateTime) {
        /**柱形图配置参数*/
        var optObj = {
            lenData: ["planDepArr", "praDepArr", "fplDepArr"],
            xAxisData: [],
            series: [],
            lenDataCh: {
                planDepArr: "计划起飞",
                praDepArr: "实际起飞",
                fplDepArr: "FPL起飞"
            },
            legendData: []
        }
        for (var i = 0; i < optObj.lenData.length; i++) {
            optObj.legendData.push(optObj.lenDataCh[optObj.lenData[i]]);
        }
        /*柱形图数据填充*/
        var len = optObj.lenData.length;
        $(data.fplDepXArr).each(function (i, e) {
            optObj.xAxisData.push(e);
        })
        for (var i = 0; i < len; i++) {
            var seriesObj = {
                type: "bar",
                name: "",
                data: [],
                flightArr: [],
                time: generateTime,
                airport: ""
            }
            seriesObj.airport = data.airport;
            seriesObj.name = optObj.lenDataCh[optObj.lenData[i]];
            var dataLen = data[optObj.lenData[i]].length;
            for (var j = 0; j < dataLen; j++) {
                var chartValue = data[optObj.lenData[i]][j].length;
                seriesObj.data.push(chartValue);
                seriesObj.flightArr.push(data[optObj.lenData[i]][j]);

            }
            optObj.series.push(seriesObj);
        }

        return optObj;
    }
    /*chart适配屏幕尺寸*/
    //适应屏幕宽高尺寸
    $.fn.resizeEnd = function (callback, timeout) {
        $(this).resize(function () {
            var $this = $(this);
            if ($this.data('resizeTimeout')) {
                clearTimeout($this.data('resizeTimeout'));
            }
            $this.data('resizeTimeout', setTimeout(callback, timeout));
        });
    };
    $(window).resizeEnd(function () {
        for (var i = 0; i < charDataArr.charts.length; i++) {
            charDataArr.charts[i].resize();
        }
    }, 200);
    // 绑定Canvas事件，屏蔽表格区域内浏览器右键菜单
    $('body').bind('mouseenter', function () {
        document.oncontextmenu = function () {
            return false;
        };
    }).bind('mouseleave', function () {
        document.oncontextmenu = function () {
            return false;
        };
    }).bind('mouseover', function () {
        document.oncontextmenu = function () {
            return false;
        };
    });
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
     * 初始化航班表格window弹窗
     * @param winObj
     * @param dataobj
     * @param dataTime
     */
    var initGridWindow = function (winObj, dataobj, dataTime) {
        //隐藏气泡
        hideDcbPopover();
        var date = new Date();
        var gridId = date.getMilliseconds()
        var id = winObj.winId + gridId;
        var winParams = {
            id: id,
            width: 1280,
            height: 800,
            center: true,
            move: true
        };
        var generateTime = dataTime;
        var html = "<div class='flight_grid_wrap'><div class='now_time'><h4 class='win_head'>" + winObj.detail + "</h4><h5 class='generate_time'>数据生成时间：" + CovertTime(generateTime) + "</h5></div><div class='grid' id='grid" + gridId + "'><table id='grid_table" + gridId + "'></table><div id='flight-grid-table-pager" + gridId + "'></div></div></div>"
        var winObject = DhxModalDialog.create(winObj.winHead, html, winParams);
        var config = getGridTableStyleObj('crs_all', user_property);
        var flightGrid = new FlightGridTable();
        flightGrid.canvasId = "grid" + gridId;
        flightGrid.colNames = config.colNames;
        flightGrid.colDisplay = config.colDisplay;
        flightGrid.colTitle = config.colTitle;
        flightGrid.colStyle = config.colStyle;
        flightGrid.colModel = FlightGridTableConfig.colModel;
        flightGrid.cmTemplate = FlightGridTableConfig.colModelTemplate;
        flightGrid.params = {
            showQuickFilter: false,
            rowNum: 999999,
            rownumbers: true,
            sortname: 'EOBT',
            // shrinkToFit: true,
        };
        flightGrid.colConverter = FlightGridTableDataUtil;
        flightGrid.id = "grid" + gridId;
        flightGrid.tableId = "grid_table" + gridId;
        flightGrid.pagerId = "flight-grid-table-pager" + gridId;
        flightGrid.initGridTableObject();
        flightGrid.quickFilterFlag = false;
        flightGrid.gridTableObject.navButtonAdd('#' + flightGrid.pagerId, {
            caption: "高级查询",
            title: "高级查询",
            buttonicon: "glyphicon-search",
            onClickButton: function () {
                flightGrid.showAdvanceFilter();
            },
            position: "first"
        })
            .navButtonAdd('#' + flightGrid.pagerId, {
                caption: "快速过滤",
                title: "快速过滤",
                buttonicon: "glyphicon-filter",
                onClickButton: function () {
                    //清理协调窗口
                    flightGrid.clearCollaborateContainer();
                    flightGrid.showQuickFilter();
                    flightGrid.quickFilterFlag = !flightGrid.quickFilterFlag;
                    // flightGrid.addMultiSelectToHeader();
                    // flightGrid.checkedMultiOperate();
                },
                position: "first"
            }).navButtonAdd('#' + flightGrid.pagerId, {
            caption: "导出",
            title: "导出Excel",
            buttonicon: "glyphicon-export",
            onClickButton: function () {
                flightGrid.export(winObj.detail);
            },
            // position: "first"
        });
        $("#flight-grid-table-pager" + gridId).show();
        flightGridDataConvert(dataobj, dataTime, flightGrid);
        flightGrid.resizeToFitContainer();
        winObject.attachEvent("onResizeFinish", function () {
            $("#" + flightGrid.id).height($("#" + flightGrid.id).parent().height() - $("#" + flightGrid.id).parent().find(".now_time").height() - 10);
            flightGrid.resizeToFitContainer();
        });
    }

    /**
     * 隐藏跑道dcb气泡
     */
    var hideDcbPopover = function () {
        $.each(groundLate.result.airportsMonitor.result, function (i, e) {
            $('.runway_dcb' + e.airport).popover('hide')
        })
    }

    /**
     * 初始化跑道DCB历史记录表格
     * @param winObj
     * @param dataObj
     * @param dataTime
     */
    var initDCBWindow = function (winObj, dataObj, dataTime, apName) {
        var id = winObj.winId + dataTime;
        var winParams = {
            id: id,
            width: 800,
            height: 800,
            center: true,
            move: true
        };
        var date = new Date();
        var gridId = date.getMilliseconds()
        var html = "<div class='flight_grid_wrap dcb_detail'><div class='now_time'><h4 class='win_head'>" + winObj.detail + "</h4><h5 class='generate_time'>数据生成时间：" + CovertTime(generateTime) + "</h5></div><div class='grid' id='all-dcb-canvas-grid" + gridId + "'><table id='all_dcb_grid_table" + gridId + "'></table><div id='all-dcb-pager" + gridId + "'></div></div></div>"
        var winObject = DhxModalDialog.create(winObj.winHead, html, winParams);
        var dcbConfig = dcbConfigConvert(dataObj);
        var opts = {
            canvasId: "all-dcb-canvas-grid" + gridId,
            tableId: "all_dcb_grid_table" + gridId,
            pagerId: "all-dcb-pager" + gridId,
            colModel: dcbConfig.colModel,
            colNames: dcbConfig.colName,
            colDisplay: dcbConfig.colDisplay,
            colTitle: dcbConfig.colTitle,
            cmTemplate: {
                align: 'center',
                resize: false,
                sortable: true,
                search: true,
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
                    var colName = colModel.name;
                    // 若单元此单元格对应的colName为需求值和dcb值,则调整该单元格样式
                    if (colName == 'rwDemandSumCount' || colName == 'dcIndexSumCount') {
                        attrs = 'style="color:#337ab7; cursor: pointer;"';
                    }
                    if (colName == 'startDateTime') {
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
                    }
                    return attrs;
                }
            },
            params: {
                sortname: 'startDateTime',
                sortorder: 'asc',
                shrinkToFit: true,
                showQuickFilter: false,
                pagerId: "dcb-pager" + gridId,
                onCellSelect: function (rowid, iCol, cellcontent, e) {
                    var colModel = table.gridTableObject.jqGrid('getGridParam')['colModel'];
                    var colName = colModel[iCol].name;
                    var colData = table.gridTableObject.jqGrid('getGridParam')['data'];
                    var dcbTime = colData[rowid - 1].startDateTime
                    if (colName == 'dcIndexSumCount') {
                        var detailConfig = dcbConfigDetailConvert(dcbConfig.detailArr[rowid - 1])
                        var winObj = {
                            winId: "RunwayDCbDetail",
                            winHead: "机场跑道DCB历史详情",
                            detail: "机场" + CovertTime(dcbTime) + "跑道DCB历史详情"
                        }
                        initDCBdetailWindow(winObj, detailConfig, dcbTime, apName)
                    } else if (colName == 'rwDemandSumCount') {
                        allHistoryDcbFlight(apName, dcbTime)
                    }
                }
            },
        }
        var table = new FlightGridTable(opts)
        table.initGridTableObject();
        table.quickFilterFlag = false;
        table.gridTableObject.navButtonAdd('#' + table.pagerId, {
            caption: "高级查询",
            title: "高级查询",
            buttonicon: "glyphicon-search",
            onClickButton: function () {
                table.showAdvanceFilter();
            },
            position: "first"
        })
            .navButtonAdd('#' + table.pagerId, {
                caption: "快速过滤",
                title: "快速过滤",
                buttonicon: "glyphicon-filter",
                onClickButton: function () {
                    //清理协调窗口
                    table.clearCollaborateContainer();
                    table.showQuickFilter();
                    table.quickFilterFlag = !table.quickFilterFlag;
                    // table.addMultiSelectToHeader();
                    // table.checkedMultiOperate();
                },
                position: "first"
            }).navButtonAdd('#' + table.pagerId, {
            caption: "导出",
            title: "导出Excel",
            buttonicon: "glyphicon-export",
            onClickButton: function () {
                table.export(winObj.detail);
            },
            // position: "first"
        });
        $("#all-dcb-pager" + gridId).show();
        table.tableData = dcbConfig.data,
            table.drawGridTableData();
        table.resizeToFitContainer();
        winObject.attachEvent("onResizeFinish", function () {
            table.resizeToFitContainer();
        });
    }
    /**
     *根据时间查询全部历史dcb航班
     * @param apName
     * @param historyTime
     */
    var allHistoryDcbFlight = function (apName, historyTime, runWay) {
        var searchUrl = '';
        if ($.isValidVariable(runWay)) {
            searchUrl = ipHost + "runway_dcb_demand_detail?userId=" + userId + '&apName=' + apName + '&runway=' + runWay + '&time=' + historyTime
        } else {
            searchUrl = ipHost + "runway_dcb_demand_detail?userId=" + userId + '&apName=' + apName + '&runway=&time=' + historyTime
        }
        $.ajax({
            type: "GET",
            url: searchUrl,
            dataType: "json",
            success: function (data) {
                if (data.status == 200) {
                    if ($.isValidObject(data)) {
                        var titleTime = data.generateTime;
                        if (!$.isValidVariable(runWay)) {
                            runWay = '';
                        }
                        var winObj = {
                            winId: "RunwayDCBAllDetail",
                            winHead: apName + "机场跑道DCB历史记录",
                            detail: apName + "机场" + CovertTime(historyTime) + " " + runWay + "跑道DCB历史影响航班记录",
                        }
                        var dataObj = data.result;
                        initGridWindow(winObj, dataObj, titleTime)
                    } else {
                        console.warn('The dcb data is empty');
                    }
                }
            },
            error: function (xhr, status) {
                clearAirportData()
            }
        })
    }
    /**
     *初始化dcb值某个时间段的dcb详情弹窗
     * @param winObj
     * @param dataObj
     * @param dataTime
     */
    var initDCBdetailWindow = function (winObj, dataObj, dataTime, apName) {
        var id = winObj.winId + dataTime;
        var winParams = {
            id: id,
            width: 800,
            height: 800,
            center: true,
            move: true
        };
        var date = new Date();
        var gridId = date.getMilliseconds()
        var html = "<div class='flight_grid_wrap detail_DCB'><div class='now_time'><h4 class='win_head'>" + apName + winObj.detail + "</h4><h5 class='generate_time'>数据生成时间：" + CovertTime(generateTime) + "</h5></div><div class='grid' id='grid" + gridId + "'><table id='dcb_grid_table" + gridId + "'></table><div id='dcb-pager" + gridId + "'></div></div></div>"
        var winObject = DhxModalDialog.create(winObj.winHead, html, winParams);
        var opts = {
            canvasId: "grid" + gridId,
            tableId: "dcb_grid_table" + gridId,
            pagerId: "dcb-pager" + gridId,
            colModel: dataObj.colModel,
            colNames: dataObj.colName,
            colDisplay: dataObj.colDisplay,
            colTitle: dataObj.colTitle,
            cmTemplate: {
                align: 'center',
                resize: false,
                sortable: true,
                search: true,
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
                    var colName = colModel.name;
                    // 若单元此单元格对应的colName为地面、空中、飞越、总数,则调整该单元格样式
                    if (colName == 'demandValue') {
                        attrs = 'style="color:#337ab7; cursor: pointer;"';
                    }
                    return attrs;
                }
            },
            params: {
                // sortname: '',
                // sortorder: 'asc',
                shrinkToFit: true,
                showQuickFilter: false,
                pagerId: "dcb-pager" + gridId,
                onCellSelect: function (rowid, iCol, cellcontent, e) {
                    var colModel = table.gridTableObject.jqGrid('getGridParam')['colModel'];
                    var colName = colModel[iCol].name;
                    if (colName == 'demandValue') {
                        var colData = table.gridTableObject.jqGrid('getGridParam')['data'];
                        var runWay = colData[rowid - 1].logicRwName;
                        // var historyTime = colData[rowid].startDateTime;
                        allHistoryDcbFlight(apName, dataTime, runWay)
                    }
                }
            },
        }
        var table = new FlightGridTable(opts)
        table.initGridTableObject();
        table.quickFilterFlag = false;
        table.gridTableObject.navButtonAdd('#' + table.pagerId, {
            caption: "高级查询",
            title: "高级查询",
            buttonicon: "glyphicon-search",
            onClickButton: function () {
                table.showAdvanceFilter();
            },
            position: "first"
        })
            .navButtonAdd('#' + table.pagerId, {
                caption: "快速过滤",
                title: "快速过滤",
                buttonicon: "glyphicon-filter",
                onClickButton: function () {
                    //清理协调窗口
                    table.clearCollaborateContainer();
                    table.showQuickFilter();
                    table.quickFilterFlag = !table.quickFilterFlag;
                    // table.addMultiSelectToHeader();
                    // table.checkedMultiOperate();
                },
                position: "first"
            }).navButtonAdd('#' + table.pagerId, {
            caption: "导出",
            title: "导出Excel",
            buttonicon: "glyphicon-export",
            onClickButton: function () {
                table.export(winObj.detail);
            },
            // position: "first"
        });
        $("#dcb-pager" + gridId).show();
        table.tableData = dataObj.data,
            table.drawGridTableData();
        table.resizeToFitContainer();
        winObject.attachEvent("onResizeFinish", function () {
            table.resizeToFitContainer();
        });
    }
    /**
     *历史dcb数据转换
     * @param data
     */
    var dcbConfigConvert = function (dataObj) {
        var dataObj = dataObj.currentInfos;
        var colName = {
            startDateTime: {
                en: "startDateTime",
                cn: "计算时间"
            },
            rwDemandSumCount: {
                en: "rwDemandSumCount",
                cn: "需求值"
            },
            rwCapcitySumCount: {
                en: "rwCapcitySumCount",
                cn: "容量值"
            },
            dcIndexSumCount: {
                en: "dcIndexSumCount",
                cn: "dcb指数"
            },
        }
        var colModel = {
            startDateTime: {
                name: 'startDateTime',
                formatter: timeFormater
            },
            rwDemandSumCount: {
                name: 'rwDemandSumCount',
            },
            rwCapcitySumCount: {
                name: 'rwCapcitySumCount',
            },
            dcIndexSumCount: {
                name: 'dcIndexSumCount',
            }
        }
        var colDisplay = {
            startDateTime: {
                display: 1,
            },
            rwDemandSumCount: {
                display: 1,
            },
            rwCapcitySumCount: {
                display: 1,
            },
            dcIndexSumCount: {
                display: 1,
            },
        }
        var colTitle = {
            startDateTime: '计算时间',
            rwDemandSumCount: "跑道",
            rwCapcitySumCount: "容量值",
            dcIndexSumCount: "dcb指数",
        }
        var data = [];
        var detailArr = [];
        $.each(dataObj, function (i, e) {
            var obj = {};
            obj['startDateTime'] = e.startDateTime;
            obj['rwDemandSumCount'] = e.rwDemandSumCount;
            obj['rwCapcitySumCount'] = e.rwCapcitySumCount;
            obj['dcIndexSumCount'] = e.dcIndexSumCount;
            detailArr.push(e.runwayList);
            data.push(obj);
        })
        return {
            colName: colName,
            colModel: colModel,
            colDisplay: colDisplay,
            colTitle: colTitle,
            data: data,
            detailArr: detailArr,
        }
    }

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
     *历史dcb详情数据转换
     * @param dataObj
     */
    var dcbConfigDetailConvert = function (dataObj) {
        var colName = {
            logicRwName: {
                en: "logicRwName",
                cn: "跑道方向"
            },
            demandValue: {
                en: "demandValue",
                cn: "需求值"
            },
            capcityValue: {
                en: "capcityValue",
                cn: "容量值"
            },
            dcIndex: {
                en: "dcIndex",
                cn: "dcb指数"
            },
        }
        var colModel = {
            logicRwName: {
                name: 'logicRwName',
            },
            demandValue: {
                name: 'demandValue',
            },
            capcityValue: {
                name: 'capcityValue',
            },
            dcIndex: {
                name: 'dcIndex',
            }
        }
        var colDisplay = {
            logicRwName: {
                display: 1,
            },
            demandValue: {
                display: 1,
            },
            capcityValue: {
                display: 1,
            },
            dcIndex: {
                display: 1,
            },
        }
        var colTitle = {
            logicRwName: "跑道方向",
            demandValue: "需求值",
            capcityValue: "容量值",
            dcIndex: "dcb指数",
        }
        var data = dataObj
        return {
            colName: colName,
            colModel: colModel,
            colDisplay: colDisplay,
            colTitle: colTitle,
            data: data
        }
    }

    /**
     *
     * @param tableId
     */
    function resizeToFitContainer(tableId) {
        // 获取表格结构下元素
        var gridTableGBox = $('#gbox_' + tableId);
        var gridTableGView = $('#gview_' + tableId);
        var gridTableBDiv = gridTableGView.find('.ui-jqgrid-bdiv');

        // 获取容器高度
        var container = gridTableGBox.parent();

        // 计算表格高度
        var gridTableHeight = gridTableBDiv.outerHeight() - (gridTableGBox.outerHeight() - container.height());
        var gridTableWidth = container.width();

        // 调用表格修改高度宽度方法
        $('#' + tableId).jqGrid('setGridHeight', gridTableHeight);
        $('#' + tableId).jqGrid('setGridWidth', (gridTableWidth - 2));
    }

    /**
     *
     * @param tableName
     * @returns {{colStyle: {}, colNames: {}, colTitle: {}, colEdit: {}, colDisplay: {}}}
     */
    var getGridTableStyleObj = function (tableName, user_property) {
        var paramsObj = {
            colStyle: {},
            colNames: {},
            colTitle: {},
            colDisplay: {}
        };
        //验证是有效的数据
        if (user_property.length > 0) {
            for (var key in user_property) {
                var userProperty = user_property[key];
                if ($.isValidObject(userProperty)) {
                    var value = $.parseJSON(userProperty['value']);
                    var uKey = userProperty.key;
                    var styleStr = 'grid_col_style';
                    var namesStr = 'grid_col_names';
                    var titleStr = 'grid_col_title';
                    var displayNameStr = '';
                    //重定义匹配规则
                    if ($.isValidVariable(tableName)) {//是有效字符串时
                        displayNameStr = 'grid_' + tableName + '_col_monitor_display';
                    }
                    //匹配赋值
                    switch (uKey) {
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
     * dhtmlx数据航班转换
     * @param dataObj
     * @param dataTime
     * @param gridObj
     */
    var flightGridDataConvert = function (dataObj, dataTime, gridObj) {
        var len = dataObj.length;
        var tableData = [];
        var tableMap = {};
        for (var i = 0; i < len; i++) {
            var data = FlightGridTableDataUtil.convertData(dataObj[i], dataTime);
            // console.log(data);
            tableData.push(data);
            tableMap[data.id] = data;
            // flightColDataConvert(dataObj[i]);
            // tableData.push(dataObj[i]);
            // for (var index in dataObj[i]) {
            //     var d = dataObj[i][index];
            //     tableMap[index] = d;
            // }
        }
        gridObj.tableDataMap = tableMap;
        gridObj.tableData = tableData;
        var flightObj = {};
        $.each(dataObj, function (i, e) {
            flightObj[e.id] = e;
        })
        var obj = {};
        obj.result = flightObj;
        gridObj.data = obj;
        gridObj.colEdit = {
            OPEN_FLIGHT_DETAIL: true,
        }
        gridObj.generateTime = dataTime;
        gridObj.drawGridTableData()
    }
    //用户登出
    var userLogOut = function () {
        $(".user_logout").click(function () {
            var userId = localStorage.getItem("userId");
            $.ajax({
                type: "POST",
                url: ipHost + "userLogout",
                data: {
                    userId: userId,
                    // onlyValue: onlyValue
                },
                success: function (data) {
                    if ($.isValidObject(data)) {
                        if (data.status == 200) {
                            localStorage.removeItem("userName", "");
                            localStorage.removeItem("userId", "");
                            window.location = "index.html";
                        } else {
                            var option = {
                                title: '警告',
                                content: data.error,
                                showCancelBtn: true,
                                buttons: [
                                    {
                                        name: '确定',
                                        isHidden: false,
                                        status: 0
                                    }
                                ]
                            }
                            BootstrapDialogFactory.dialog(option)
                        }
                    }
                },
                error: function () {
                    console.error('retrieve statistic data failed, state:');
                    console.error(status);
                    //关掉定时器总开关
                    timerValve = false;
                    // 弹框提示
                    var options = {
                        title: '服务器异常',
                        content: '服务器异常，请重新登录',
                        status: 2,//1:正常 2:警告 3:危险  不填:默认情况
                        width: 500,
                        showCancelBtn: false,
                        mtop: 200,
                        isIcon: false,
                        buttons: [{
                            name: '重新登录',
                            status: 0,
                            isHidden: false,
                            // className: 'logout',
                            callback: function () {
                                window.location = "index.html";
                            }
                        }]
                    };
                    BootstrapDialogFactory.dialog(options);
                    // 删掉弹框关闭按钮
                    $('#bootstrap-modal-dialog .close').remove();
                }
            })
        })
    }
    /**
     * 数据生成时间格式化
     * */
    var CovertTime = function (time) {
        var year = time.substring(0, 4);
        var mon = time.substring(4, 6);
        var date = time.substring(6, 8);
        var hour = time.substring(8, 10);
        var min = time.substring(10, 12);
        var str = year + '-' + mon + '-' + date + ' ' + hour + ":" + min;
        return str;
    };

    /**
     * 初始化tooltip
     * */
    var initTooltip = function () {
        // 遍历航班数据监控模块tooltip配置
        for (var i in tooltipData) {
            var opt = {
                placement: 'auto',
                container: '.monitor',
                title: tooltipData[i],
            };
            // 绑定tooltip到父容器上
            $('.c_' + i).tooltip(opt);
        }

    };
    return {
        init: function () {
            // 用户登出
            userLogOut();
            // 初始化tooltip
            initTooltip();
        },
        // 航班监控数据对象
        flightMonitorData: flightMonitorData,
        // 更新机场数据
        fireAirportDataChange: fireAirportDataChange,
        // 航班监控数据转换
        flightMonitorDataConvert: flightMonitorDataConvert,
        // 初始化航班监控点击事件
        initFlightDataClick: initFlightDataClick,
        // 设置航班监控数据
        setFlightData: setFlightData,
        // 初始化航班监控航班方向下拉选择框
        initFlightDirection: initFlightDirection,
        // 隐藏跑道dcb气泡
        hideDcbPopover: hideDcbPopover
        // createFlightDetailWindow: createFlightDetailWindow
    }
}();
$(document).ready(function () {
    Flight.init();
});
