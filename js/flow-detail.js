/**
 * 流控详情组件
 */


function FlowDetail(params) {
    // id
    this.id = params.id;
    // 流控详情页面容器(用于访问页面里相关节点)
    this.canvas = $('.dhx_wrap_'+params.dialogId);
}

/**
 *  转换流控数据
 *
 *  @param data 流控数据
 * */
FlowDetail.prototype.convertData = function(data){
    var thisProxy = this;
    //设置生效时间
    thisProxy.setEffectiveTime(data);
    // 设置流控状态
    thisProxy.setStatus(data);
    // 设置流控名称
    thisProxy.setName(data);
    // 设置发布用户
    thisProxy.setPublishUser(data);
    // 设置原发布单位
    thisProxy.setOriginalPublishUnit(data);
    // 设置流控来源
    thisProxy.setSource(data);
    // 设置流控类型(长期或非长期)
    thisProxy.setType(data);
    // 设置开始时间
    thisProxy.setStartTime(data);
    // 设置结束时间
    thisProxy.setEndTime(data);
    // 设置创建时间
    thisProxy.setGenerateTime(data);
    // 设置最后修改时间
    thisProxy.setModifyTime(data);
    // 设置纳入计算时间
    thisProxy.setStartFlowCasaTime(data);
    // 设置限制类型
    thisProxy.setLimitType(data);
    // 设置限制数值
    thisProxy.setLimitValue(data);
    // 设置限制高度
    thisProxy.setLimitHight(data);
    // 设置限制原因
    thisProxy.setReason(data);
    // 设置备注信息
    thisProxy.setComments(data);
    // 设置限制方向信息
    thisProxy.setLimitDirection(data);
    // 设置复合流控限制方向信息
    thisProxy.setCompositeLimitDirection(data);
    // 设置预留时隙
    thisProxy.setSlots(data);
    // 设置二类放行
    thisProxy.setTimeSegment(data);
    // 预锁航班时隙变更策略
    thisProxy.setChangeStrategy(data);
    // 设置协调记录
    thisProxy.records(data);
};

/**
 * 设置流控状态
 * */
FlowDetail.prototype.setStatus = function (data) {
    var thisProxy = this;
    if($.isValidObject(data.basicInformation)){
        // 流控状态
        var status = data.basicInformation.status || '';
        // 流控状态中文
        var statusZH = data.basicInformation.statusZH || '';

        //设置流控状态值到页面
        $('.status', thisProxy.canvas).text(statusZH);
        // 设置状态文字颜色
        if($.isValidVariable(status)){
            switch (status){
                //正在执行
                case 'RUNNING':
                    $('.status', thisProxy.canvas).attr('class', 'status status_running');
                    break;
                // 人工终止
                case 'TERMINATED':
                    $('.status', thisProxy.canvas).attr('class', 'status status_terminated');
                    break;
                // 延误人工终止
                case 'DELAY_TERMINATED':
                    $('.status', thisProxy.canvas).attr('class', 'status status_terminated');
                    break;
                // 正常结束
                case 'FINISHED':
                    $('.status', thisProxy.canvas).attr('class', 'status status_finished');
                    break;
                // 已发布
                case 'PUBLISH':
                    $('.status', thisProxy.canvas).attr('class', 'status status_terminated');
                    break;
                // 将要执行
                case 'FUTURE':
                    $('.status', thisProxy.canvas).attr('class', 'status status_future');
                    break;
                // 系统终止
                case 'STOP':
                    $('.status', thisProxy.canvas).attr('class', 'status status_stop');
                    break;
            }
        };
    }
};

/**
 * 设置流控名称
 * */
FlowDetail.prototype.setName = function (data) {
    var thisProxy = this;
    if($.isValidObject(data.basicInformation)){
        //流控名称
       var name = data.basicInformation.name || '';
       // 流控id
       var id = data.basicInformation.id || '';
       //若流控id有效，则将流控id拼接到流控名称后面
       if($.isValidVariable(id)){
           name += '('+ id+')';
       }
        // 设置流控名称到页面
       $('.flow_name', thisProxy.canvas).text(name);
    }
};

/**
 * 设置发布用户
 * */
FlowDetail.prototype.setPublishUser = function (data) {
    var thisProxy = this;
    if($.isValidObject(data.basicInformation)){
        var user = data.basicInformation.publishUserZh || '';
        $('.publish_user', thisProxy.canvas).text(user);
    }
};

/**
 * 设置原发布单位
 * */
FlowDetail.prototype.setOriginalPublishUnit = function (data) {
    var thisProxy = this;
    if($.isValidObject(data.basicInformation)){
        var unit = data.basicInformation.originalPublishUnit || '';
        $('.publish_unit', thisProxy.canvas).text(unit);
    }
};

/**
 * 设置生效时间
 * */
FlowDetail.prototype.setEffectiveTime = function (data) {
    var thisProxy = this;
    if($.isValidObject(data.limitTime)){
        // 开始时间
        var start = data.limitTime.startTime || '';
        // 结束时间
        var end = data.limitTime.endTime || '';
        $('.effective_start', thisProxy.canvas).text(start);
        $('.effective_end', thisProxy.canvas).text(end);
    }
};

/**
 *  设置流控来源
 * */
FlowDetail.prototype.setSource = function (data) {
    var thisProxy = this;
    if($.isValidObject(data.basicInformation)){
        //取流控来源
        var source = data.basicInformation.source || '';
        // 设置页面来源(CDM,CRS)图标为未选中的样式
        $('.source .icon', thisProxy.canvas).removeClass('select');
        //设置相应来源图标为选中的样式
        if(source == 'CDM'){
            $('.source .source_cdm .icon', thisProxy.canvas).addClass('select');
        }else if(source == 'CRS'){
            $('.source .source_crs .icon', thisProxy.canvas).addClass('select');
        }
    }
};


/**
 * 设置流控类型
 * */
FlowDetail.prototype.setType = function (data) {
    var thisProxy = this;
    if($.isValidObject(data.basicInformation)){
        // 取流控类型数值
        var type = data.basicInformation.flowcontrolType || '';
        // 设置页面流控类型(非长期、长期)图标为未选中的样式
        $('.type .icon', thisProxy.canvas).removeClass('select');
        // 设置相应来源图标为选中的样式，1为非长期 0 为长期
        if(type == 1){
            $('.type .not_across .icon', thisProxy.canvas).addClass('select');
        }else if(type == 0){
            $('.type .across .icon', thisProxy.canvas).addClass('select');
        }

    }
};

/**
 * 设置开始时间
 * */
FlowDetail.prototype.setStartTime = function (data) {
    var thisProxy = this;
    if($.isValidObject(data.limitTime)){
        var time = data.limitTime.startTime || '';
        $('.start_time', thisProxy.canvas).text(time);
    }
};

/**
 * 设置结束时间
 * */
FlowDetail.prototype.setEndTime = function (data) {
    var thisProxy = this;
    if($.isValidObject(data.limitTime)){
        var time = data.limitTime.endTime || '';
        $('.end_time', thisProxy.canvas).text(time);
    }
};
/**
 * 设置创建时间
 * */
FlowDetail.prototype.setGenerateTime = function (data) {
    var thisProxy = this;
    if($.isValidObject(data.limitTime)){
        var time = data.limitTime.generateTime || '';
        $('.generate_time', thisProxy.canvas).text(time);
    }
};

/**
 * 设置最后修改时间
 * */
FlowDetail.prototype.setModifyTime = function (data) {
    var thisProxy = this;
    if($.isValidObject(data.limitTime)){
        var time = data.limitTime.lastModifyTime || '';
        $('.last_modify_time', thisProxy.canvas).text(time);
    }
};

/**
 * 设置纳入计算时间
 * */
FlowDetail.prototype.setStartFlowCasaTime = function (data) {
    var thisProxy = this;
    if($.isValidObject(data.limitTime)){
        var time = data.limitTime.startFlowCasaTime || '';
        $('.start_flow_casa_time', thisProxy.canvas).text(time);
    }
};

/**
 * 设置限制类型
 * */
FlowDetail.prototype.setLimitType = function (data) {
    var thisProxy = this;
    if($.isValidObject(data.limitType)){
        var type = data.limitType.type || '';
        $('.limit_type', thisProxy.canvas).text(type);
    }
};


/**
 * 设置限制数值
 * */
FlowDetail.prototype.setLimitValue = function (data) {
    var thisProxy = this;
    if($.isValidObject(data.limitType)){
        var val = data.limitType.value || '';
        $('.limit_value', thisProxy.canvas).text(val);
    }
};


/**
 * 设置限制高度
 * */
FlowDetail.prototype.setLimitHight = function (data) {
    var thisProxy = this;
    if($.isValidObject(data.limitHight)){
        var val = data.limitHight.controlLevel || '';
        $('.limit_hight', thisProxy.canvas).text(val);
        // 显示流控限制高度模块(默认不显示的)
        $('.hight', thisProxy.canvas).removeClass('hidden');
    }
};
/**
 * 设置限制原因
 * */
FlowDetail.prototype.setReason = function (data) {
    var thisProxy = this;
    if($.isValidObject(data.limitReason)){
        var val = data.limitReason.reasonZH || '';
        $('.reason', thisProxy.canvas).text(val);
    }
};
/**
 * 设置备注信息
 * */
FlowDetail.prototype.setComments = function (data) {
    var thisProxy = this;
    if($.isValidObject(data.limitReason)){
        var val = data.limitReason.comments || '';
        $('.comments', thisProxy.canvas).text(val);
    }
};

/**
 * 设置限制方向信息
 * */
FlowDetail.prototype.setLimitDirection = function (data) {
    var thisProxy = this;
    if($.isValidObject(data.limitFlowDirection)){

        // 限制方向集合
        var direction = data.limitFlowDirection;
        // 受控点
        var points = direction.controlPoints || '';
        // 受控方向
        var flowcontrolDirection = direction.flowcontrolDirectionZH || direction.flowcontrolDirection || '';
        // 受控降落机场
        var controlDirection = direction.controlDirection || '';
        // 豁免降落机场
        var exemptDirection = direction.exemptDirection || '';
        // 受控起飞机场
        var controlDepDirection = direction.controlDepDirection || '';
        // 豁免起飞机场
        var exemptDepDirection = direction.exemptDepDirection || '';
        // 设置相应数值
        $('.direction .control_points', thisProxy.canvas).text(points);
        $('.direction .flowcontrol_direction', thisProxy.canvas).text(flowcontrolDirection);
        $('.direction .control_dep_direction', thisProxy.canvas).text(controlDepDirection);
        $('.direction .exempt_dep_direction', thisProxy.canvas).text(exemptDepDirection);
        $('.direction .control_direction', thisProxy.canvas).text(controlDirection);
        $('.direction .exempt_direction', thisProxy.canvas).text(exemptDirection);
        // 显示流控限制方向模块(默认不显示的)
        $('.direction', thisProxy.canvas).removeClass('hidden');
    }
};

/**
 * 设置复合流控限制方向信息
 * */
FlowDetail.prototype.setCompositeLimitDirection = function (data) {
    var thisProxy = this;
    if($.isValidObject(data.limitFlowsDirection) && data.limitFlowsDirection.length > 0){
        //复合流控限制方向集合
        var direction = data.limitFlowsDirection;
        //复合流控限制方向模块容器
        var $container = $('.composite_direction', thisProxy.canvas);
        // 限制内容模板(用于遍历克隆)
        var $nodes = $('.limit_item', $container);
        // 遍历
        direction.map(function (item, index, arr) {
            //创建新节点
            var $newNodes = $nodes.clone();
            // 序号(用于显示限制条件序号)
            var num = index+1;
            // 设置每个限制条件标题
            $('.sub_title',$newNodes).text('限制条件'+ num);
            // 受控点
            var points = item.controlPoints || '';
            // 受控方向
            var flowcontrolDirection = item.flowcontrolDirectionZH || direction.flowcontrolDirection || '';
            // 受控降落机场
            var controlDirection = item.controlDirection || '';
            // 豁免降落机场
            var exemptDirection = item.exemptDirection || '';
            // 受控起飞机场
            var controlDepDirection = item.controlDepDirection || '';
            // 豁免起飞机场
            var exemptDepDirection = item.exemptDepDirection || '';
            // 设置相应数值
            $('.control_points', $newNodes).text(points);
            $('.flowcontrol_direction', $newNodes).text(flowcontrolDirection);
            $('.control_dep_direction', $newNodes).text(controlDepDirection);
            $('.exempt_dep_direction', $newNodes).text(exemptDepDirection);
            $('.control_direction', $newNodes).text(controlDirection);
            $('.exempt_direction', $newNodes).text(exemptDirection);
            // 追加新节点到容器
            $container.append($newNodes);
        });
        // 移除限制内容模板
        $nodes.remove();
        // 显示复合流控限制方向模块(默认不显示的)
        $('.composite_direction', thisProxy.canvas).removeClass('hidden');
    }
};


/**
 * 设置预留时隙
 * */
FlowDetail.prototype.setSlots = function (data) {
    var thisProxy = this;
    if($.isValidVariable(data.reserveSlots)){
        var val = data.reserveSlots || '';
        $('.slots', thisProxy.canvas).text(val);
        // 显示预留时隙模块(默认不显示的)
        $('.reserved_time_slots', thisProxy.canvas).removeClass('hidden');
    }
};

/**
 *  设置二类放行
 * */
FlowDetail.prototype.setTimeSegment = function (data) {
    var thisProxy = this;
    if($.isValidObject(data.timeSegment)){
        //取得二类数值
        var val = data.timeSegment.value;
        var node = '';
        // 若数值有效, 则将数值拼接为指定html节点
        if($.isValidVariable(val)){
            var arr = val.split(',');
            var nodeArr = arr.map(function (item, index) {
                return '<span class="time_segment_item">('+(index+1) +') '+ item +'</span>';
            });
            node = nodeArr.join(' ');
        }
        // 追加节点到指定容器
        $('.time_segment_val', thisProxy.canvas).append(node);
        // 显示二类放行模块(默认不显示的)
        $('.time_segment', thisProxy.canvas).removeClass('hidden');
    }
};

/**
 * 预锁航班时隙变更策略
 * */
FlowDetail.prototype.setChangeStrategy = function (data) {
    var thisProxy = this;
    if($.isValidObject(data.changeStrategy)){
        // 取得变更策略
        var strategy = data.changeStrategy.changeStrategy || '';
        // 取得变更策略时间数值
        var time  = data.changeStrategy.time || '';
        // 取得压缩时间范围的起始时间
        var satrtTime  = data.changeStrategy.satrtTime || '';
        // 取得压缩时间范围的结束时间
        var endTime  = data.changeStrategy.endTime || '';
        // 设置变更策略及时间数值
        $('.change_strategy', thisProxy.canvas).text(strategy +' '+ time);
        // 设置压缩时间范围
        if($.isValidVariable(satrtTime) || $.isValidVariable(endTime)){
            $('.time_range', thisProxy.canvas).text(satrtTime +' ~ '+ endTime);
        }
    }
};

/**
 * 设置协调记录
 * */
FlowDetail.prototype.records = function (data) {
    var thisProxy = this;
    if($.isValidObject(data.records)&& data.records.length > 0){
        var records = data.records;
        if(records.length <1){
            return
        }
        // 表格体
        var $tbody = $('.record_table tbody', thisProxy.canvas);
        // 协调记录行模板(用于遍历克隆)
        var $template = $('tr.template', $tbody);

        records.map(function (item, index) {
            //克隆行
            var $row = $template.clone();
            // 协调类型
            var type = item.recordTypeZH || item.recordType || '';
            //协调状态
            var status = item.recordstatusZH || item.recordstatus || '';
            // 协调时间
            var time = item.recordTime || '';
            // 协调前
            var before = item.recordBefor || '';
            // 协调前记录id
            var beforeId = item.recordBeforId || '';
            // 协调后
            var last = item.recordlast || '';
            // 协调后记录id
            var lastId = item.recordlastId || '';
            // 协调备注信息
            var comments = item.recordComments || '';
            // 协调用户名
            var user = item.recordUserName || '';
            // 协调用户IP
            var ip = item.recordIp || '';

            $('.record_type', $row).html(type);
            $('.record_status', $row).html(status);
            $('.record_time', $row).html(time);
            $('.record_before', $row).html(before);
            $('.record_last', $row).html(last);
            $('.record_comments', $row).html(comments);
            $('.record_user', $row).html(user);
            $('.record_user_ip', $row).html(ip);
            // 删除新行class: hidden (因为模板行默认有这个class)
            $row.removeClass('hidden');
            // 追加新行到表格
            $tbody.append($row);
        });
        // 删除模板行
        $template.remove();
    }
};
/**
 * 事件绑定
 * */
FlowDetail.prototype.initEvent = function () {

    var thisProxy = this;
    // 协调记录表格容器
    var $col = $('.record_col',thisProxy.canvas);
    // 协调记录模块标题
    var $ico = $('.valve-ico',thisProxy.canvas);
    // 显隐切换
    $ico.on('click',function () {
        // 若表格容器为显示
        if($col.is(':visible')){
            // 添加hidden class实现隐藏
            $col.addClass('hidden');
            // 切换标题class 切换图标样式
            $ico.addClass('hides').removeClass('show');
        }else {
            $col.removeClass('hidden');
            $ico.removeClass('hides').addClass('show');
        }
    });
}