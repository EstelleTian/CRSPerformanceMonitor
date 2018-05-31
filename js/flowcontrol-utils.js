/**
 * Flowcontrol对象常量及工具方法
 */
var FlowcontrolUtils = {

    FLOWCONTROL_TYPE_LONG: 0, // 跨日流控
    FLOWCONTROL_TYPE_NORMAL: 1, // 常规流控

    COMPOSITE_VALUE: 100, // 复合流控
    FLOWCONTROL_STATUS_PUBLISH: 'PUBLISH',
    FLOWCONTROL_STATUS_FUTURE: 'FUTURE',
    FLOWCONTROL_STATUS_RUNNING: 'RUNNING',
    FLOWCONTROL_STATUS_STOP: 'STOP',
    FLOWCONTROL_STATUS_FINISHED: 'FINISHED',
    FLOWCONTROL_STATUS_DISCARD: 'DISCARD', // 已废弃
    FLOWCONTROL_STATUS_PRE_UPDATE: 'PRE_UPDATE', // 预更新状态
    FLOWCONTROL_STATUS_PRE_PUBLISH: 'PRE_PUBLISH', // 预发布状态
    FLOWCONTROL_STATUS_PRE_TERMINATED: 'PRE_TERMINATED', // 预终止状态
    FLOWCONTROL_STATUS_PREVIEW: 'PREVIEW', // 流控预演

    FLOWCONTROL_STATUS_TERMINATED: 'TERMINATED',
    FLOWCONTROL_STATUS_DELAY_TERMINATED: 'DELAY_TERNINATED',

    PLACE_TYPE_AP: 'AP',
    PLACE_TYPE_POINT: 'POINT',

    TYPE_MIT: 'MIT', // 距离
    TYPE_TIME: 'TIME', // 时间
    TYPE_GS: 'GS', // 地面停止
    TYPE_REQ: 'REQ', // 开车申请
    TYPE_ASSIGN: 'ASSIGN', // 指定时隙
    TYPE_RESERVE: 'RESERVE',//预留时隙
    TYPE_LDR: 'LDR', // 大规模延误
    TYPE_TRANSLATION: 'TRANSLATION', // 成都版大规模延误

    REASON_WEATHER: "WEATHER",
    REASON_MILITARY: "MILITARY",
    REASON_ACC: "ACC",
    REASON_CONTROL: "CONTROL",
    REASON_EQUIPMENT: "EQUIPMENT",
    REASON_OTHERS: "OTHERS",

    DOUBLEHEB_VALUE: "100", // doubleHEB唯一标识

    FLOW_TYPE_ARR: "ARR", //流控类型 降落流控
    FLOW_TYPE_DEP: "DEP", //流控类型 起飞流控

    COMPRESS_TYPE_ON: 'ON',
    COMPRESS_TYPE_OFF: 'OFF',

    /**
     * 获取类型中文
     * @param type
     */
    getTypeZh: function (type) {
        var zh = null;

        switch (type) {
            case this.TYPE_MIT:
                zh = '限制距离';
                break;
            case this.TYPE_TIME:
                zh = '限制时间';
                break;
            case this.TYPE_GS:
                zh = '地面停止';
                break;
            case this.TYPE_REQ:
                zh = '开车申请';
                break;
            case this.TYPE_ASSIGN:
                zh = '指定时隙';
                break;
            case this.TYPE_RESERVE:
                zh = '预留时隙';
                break;
            case this.TYPE_LDR:
                zh = '大规模延误';
                break;
            case this.TYPE_TRANSLATION:
                zh = '大规模延误';
                break;
            default:
                break;
        }

        return zh;
    },

    /**
     * 获取原因中文
     *
     * @param reason
     * @returns
     */
    getReasonZh: function (reason) {
        var zh = null;

        switch (reason) {
            case this.REASON_WEATHER:
                zh = '天气';
                break;
            case this.REASON_MILITARY:
                zh = '军方';
                break;
            case this.REASON_CONTROL:
                zh = '流量';
                break;
            case this.REASON_EQUIPMENT:
                zh = '设备';
                break;
            case this.REASON_ACC:
            	zh = '空管';
            	break;
            case this.REASON_OTHERS:
                zh = '其他';
                break;
            default:
                zh = '其他';
                break;
        }
        return zh;
    },

    /**
     * 获取流控中文状态
     *
     * @param flowcontrol
     * @param now
     * @returns
     */
    getStatusZh: function (flowcontrol, now) {
        var zh = null;
        if (!$.isValidVariable(flowcontrol)) {
            return zh;
        }
        var type = flowcontrol.type;
        var status = flowcontrol.status;
        if (type == this.TYPE_TRANSLATION
            && status == this.FLOWCONTROL_STATUS_FINISHED) {
            var tempEndTime = $.addStringTime(flowcontrol.endTime, flowcontrol.value * 60 * 60 * 1000);
            if (tempEndTime > date) {
                zh = '恢复中';
            } else {
                zh = '已结束';
            }
        } else {
            if (status == this.FLOWCONTROL_STATUS_FUTURE) {
                zh = '将要执行';
            } else if (status == this.FLOWCONTROL_STATUS_RUNNING) {
                zh = '正在执行';
            } else if (status == this.FLOWCONTROL_STATUS_FINISHED) {
                zh = '已结束';
            } else if (status == this.FLOWCONTROL_STATUS_STOP
                || status == this.FLOWCONTROL_STATUS_TERMINATED) {
                zh = '已终止';
            } else if (status == this.FLOWCONTROL_STATUS_PRE_TERMINATED
                || status == this.FLOWCONTROL_STATUS_PRE_UPDATE) {
                zh = '将要终止';
            } else if (status == this.FLOWCONTROL_STATUS_DISCARD) {
                zh = '已废弃';
            }

        }
        return zh;
    },

    getStatusZh2: function (status) {
        var zh = "";
        if (status == this.FLOWCONTROL_STATUS_PRE_PUBLISH) {
            zh = '将要发布';
        } else if (status == this.FLOWCONTROL_STATUS_FUTURE) {
            zh = '将要执行';
        } else if (status == this.FLOWCONTROL_STATUS_RUNNING) {
            zh = '正在执行';
        } else if (status == this.FLOWCONTROL_STATUS_FINISHED) {
            zh = '正常结束';
        } else if (status == this.FLOWCONTROL_STATUS_STOP) {
            zh = '系统终止';
        } else if (status == this.FLOWCONTROL_STATUS_TERMINATED) {
            zh = '人工终止';
        } else if (status == this.FLOWCONTROL_STATUS_PRE_TERMINATED
            || status == this.FLOWCONTROL_STATUS_PRE_UPDATE) {
            zh = '将要终止';
        } else if (status == this.FLOWCONTROL_STATUS_DISCARD) {
            zh = '已废弃';
        }
        return zh;
    },

    /**
     * 获取流控控制元素（航路点、起飞机场、降落机场）
     *
     * @param flowcontrol
     */
    getControlElement: function (flowcontrol) {
        if (flowcontrol == undefined || flowcontrol == null) {
            return null;
        }
        // 流控类型
        var flowType = flowcontrol.flowType;
        // 受控航路点
        var controlPoints = flowcontrol.controlPoints;
        // 受控起飞机场
        var controlDepDirection = flowcontrol.controlDepDirection;
        // 受控降落机场
        var controlDirection = flowcontrol.controlDirection;
        // 判断流控限制类型
        // 受控航路点为空时 使用受控机场
        if ($.isValidVariable(controlPoints)) {
            return controlPoints;
        } else {
            if (flowType == FlowcontrolUtils.FLOW_TYPE_ARR) {
                controlPoints = controlDirection;
            } else {
                controlPoints = controlDepDirection;
            }
        }
    },

    /**
     * 是否为正在或将要生效的流控数据
     *
     * @param flowcontrol
     */
    isFutureOrRunning: function (flowcontrol) {
        if (!$.isValidVariable(flowcontrol.status)
            || flowcontrol.status == FlowcontrolUtils.FLOWCONTROL_STATUS_STOP
            || flowcontrol.status == FlowcontrolUtils.FLOWCONTROL_STATUS_TERMINATED
            || flowcontrol.status == FlowcontrolUtils.FLOWCONTROL_STATUS_FINISHED
            || flowcontrol.status == FlowcontrolUtils.FLOWCONTROL_STATUS_DISCARD) {
            return false;
        } else {
            return true;
        }
    },

    isCalculated: function (flowcontrol) {
        return $.isValidVariable(flowcontrol.startFlowCasaTime);
    },

    /**
     * 判断流控是否符合该方向
     *
     * @param flowcontrol
     * @param direction
     * @returns {boolean}
     */
    checkFlowcontrolDirection: function (flowcontrol, direction) {
    	var flowDirectionArray = null;
    	if($.isValidVariable(flowcontrol.flowcontrolDirection)){
    		flowDirectionArray = flowcontrol.flowcontrolDirection.split(',');
    	}
        if (direction == 'ALL') {
            return true;
        } else if ($.isValidVariable(flowDirectionArray)
        		&& $.inArray(direction, flowDirectionArray) > -1) {
            return true;
        } else {
            return false;
        }
    },

    /**
     *
     * 判断流控最小间隔要求
     */
    calculateFlowcontrolMit: function (mit) {
        // 最小满足间隔
        var interval = null;
        // 容差
        var tolerance = null;
        if (mit < 5) {
            tolerance = 0;
        } else if (5 <= mit < 15) {
            tolerance = 2;
        } else if (15 <= mit < 20) {
            tolerance = 3;
        } else if (20 <= mit < 30) {
            tolerance = 4;
        } else {
            tolerance = 5;
        }
        interval = mit - tolerance;
        return interval;
    }
};