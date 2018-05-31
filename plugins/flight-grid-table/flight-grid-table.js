/**
 * 航班计划表格组件
 *
 * @param params
 * @constructor
 */
function FlightGridTable(params) {
    // 检查参数有效性
    if (!$.isValidObject(params)) {
        return;
    }

    /**
     * 表格所在容器ID
     */
    this.canvasId = params.canvasId;

    /**
     * 表格所在容器jQuery对象
     */
    this.canvas = {};

    /**
     * 表格元素ID
     */
    this.tableId = params.tableId;

    /**
     * 表格元素jQuery对象
     */
    this.table = {};

    /**
     * 表格元素PagerID
     */
    this.pagerId = params.pagerId;

    /**
     * 表格jqGrid对象
     */
    this.gridTableObject = {};

    /**
     * 列所有名称
     */
    this.colNames = params.colNames;

    /**
     * 列属性
     */
    this.colModel = params.colModel;

    /**
     * 列属性模板
     */
    this.cmTemplate = params.cmTemplate;

    /**
     * 列显示名称
     */
    this.colDisplay = params.colDisplay;

    /**
     * 列显示提示信息
     */
    this.colTitle = params.colTitle;

    /**
     * 列样式配置
     */
    this.colStyle = params.colStyle;

    /**
     * 列编辑开放配置
     */
    this.colEdit = params.colEdit;

    /**
     * 列操作权限
     */
    this.colAuthority = params.colAuthority;

    /**
     * 列操作url
     */
    this.colCollaborateUrl = params.colCollaborateUrl;

    /**
     * 列数据转换工具
     */
    this.colConverter = params.colConverter;

    /**
     * jqGrid表格原生配置项
     */
    this.params = params.params;

    /**
     * 数据-原始数据
     */
    this.data = {};

    /**
     * 数据-表格显示数据（Array）
     */
    this.tableData = [];

    /**
     * 数据-表格显示数据（Map）
     */
    this.tableDataMap = {};

    /**
     * 自动滚动
     */
    this.autoScroll = params.autoScroll;

    /**
     * 回调方法-选中单行
     */
    this.onSelectRow = params.onSelectRow;

    /**
     * 回调方法-更新单个数据
     */
    this.afterCollaborate = params.afterCollaborate;

    /**
     * 数据-基础数据：如列操作需要的数据
     */
    this.baseData = params.baseData;

    /**
     * 批量选择列,选中行的ID集合
     */
    this.multiOptSelectedIdsArr = [];

    /**
     * 高级搜索的重置和查找按钮是否绑定了事件，避免重复绑定
     */
    this.advanceFilterFlag = false;
    this.scrollObj = {
        lastTop: 0,
        lastLeft: 0,
        finish: false
    };
    /**
     * 冻结列高度（用以处理冻结列和滚动条中间缝隙）
     */
    this.frozenHeight = 0;
    // 数据生成时间
    this.generateTime = params.generateTime
}

/**
 * 常量-当前选择单元格类名
 */
FlightGridTable.SELECTED_CELL_CLASS = 'flight-grid-table-current-select-cell';

/**
 * 常量-协调元素类名
 */
FlightGridTable.COLLABORATE_DOM_CLASS = 'flight-grid-table-collaborate-container';

/**
 * 表格初始化
 */
FlightGridTable.prototype.initGridTableObject = function () {
    // 当前对象this代理
    var thisProxy = this;
    // 转换列名称配置
    var colNames = thisProxy.convertColNames();
    // 转换列属性配置
    var colModel = thisProxy.convertColModel();
    // 转换列标题配置
    var colTitle = thisProxy.convertColTitle();
    // 转换列样式配置
    thisProxy.convertColStyle();
    // 容器jQuery对象
    thisProxy.canvas = $('#' + thisProxy.canvasId);
    // 表格jQuery对象
    thisProxy.table = $('#' + thisProxy.tableId);
    // 源数据
    thisProxy.data={};
    thisProxy.data.result = {};

    // 初始化jqGrid默认参数
    var gridTableOptions = {
        // 单独使用bootstrap样式，或通过全局设置$.jgrid.defaults.styleUI = 'Bootstrap';
        styleUI: 'Bootstrap',
        // 列名称
        colNames: thisProxy.convertColNames(),
        // 列Model
        colModel: thisProxy.convertColModel(),
        // 列Model模板
        cmTemplate: thisProxy.cmTemplate,
        // 数据类型
        datatype: 'local',
        // 单次显示数据行数
        rowNum: 999999999,
        // 是否显示行号
        rownumbers: true,
        // 行号列宽(px)
        //rownumWidth: 25,
        // 是否显示表头信息
        headertitles: true,
        // 是否初始化时自适应容器宽度
        //autowidth: true,
        // 是否列宽根据所在容器宽度自适应
        shrinkToFit: false,
        // 定义工具栏，须是有效的html元素
        pager: '#' + this.pagerId,
        // 定义工具栏是否显示翻页键
        pgbuttons: false,
        // 定义工具栏是否显示页数输入框
        pginput: false,
        // 定义导航栏是否显示记录数
        viewrecords: true,
        // 是否支持通过checkbox进行行多选（支持多选，但默认不开启）
        multiselect: true,
        // 是否限制仅通过checkbox进行行多选（在“伪”关闭多选模式时开启，默认“伪”关闭）
        multiboxonly: true,
        // 绑定左键单击事件
        onCellSelect: function (rowid, iCol, cellcontent, e) {
             thisProxy.onCellSelect(rowid, iCol, cellcontent, e);
        },
        // 绑定左键选中行事件
        onSelectRow: function (rowid, status, e) {
            /*if (undefined != thisProxy.onSelectRow && typeof(thisProxy.onSelectRow) == 'function') {
                //若选中多选框，阻止冒泡
                if( $(e.target).hasClass("cbox") ){
                    e.stopPropagation();
                }else{
                    thisProxy.onSelectRow(rowid, status, e);
                }

            }*/
        },
        // 绑定右键单击事件
        onRightClickRow: function (rowid, iRow, iCol, e) {
            thisProxy.onRightClickRow(rowid, iRow, iCol, e);
        }
    };
    // 追加jqGrid自定义参数
    if (thisProxy.params != undefined && thisProxy.params != null) {
        for (var key in thisProxy.params) {
            gridTableOptions[key] = thisProxy.params[key];
        }
    }
    // 初始化jqGrid
    thisProxy.gridTableObject = thisProxy.table.jqGrid(gridTableOptions);

    // 初始化jqGrid Pager
    thisProxy.gridTableObject.jqGrid('navGrid', '#' + thisProxy.pagerId, {
        add: false,
        edit: false,
        view: false,
        del: false,
        search: false,
        refresh: false
    });

    /*
     // 初始化jqGrid Pager自定义按钮
     this.gridTableObject.jqGrid('navGrid', '#' + this.pagerId).navButtonAdd('#' + this.pagerId, {
     // 批量锁定
     id: this.pagerId + '-multi-lock',
     caption: '',
     title: '批量指定',
     buttonicon: 'glyphicon glyphicon-lock',
     onClickButton: function () {
     },
     position: 'first'
     });
     // 初始化jqGrid Pager自定义按钮批量指定操作
     $('#' + this.pagerId + '-multi-lock').popover({
     title: '批量指定',
     trigger: 'click',
     html: true,
     container: 'body',
     content: function () {
     return thisProxy.buildFlightMultiLockContent();
     }
     });
     $('#' + this.pagerId + '-multi-lock').on('shown.bs.popover', function () {
     thisProxy.buildFlightMultiLockEvent();
     });
     // 隐藏jqGrid Pager中间翻页区域，释放空间给左侧工具栏
     this.canvas.find('.ui-paging-pager').parent().hide();
     */

    // 初始化快速过滤工具栏
    thisProxy.gridTableObject.jqGrid('filterToolbar', {
        // 是否开启Enter后查询
        searchOnEnter: false,
        // 是否开启查询逻辑选择
        searchOperators: false,
        afterSearch: function () {
            if( thisProxy.params.hasOwnProperty("afterSearchCallBack") && undefined != thisProxy.params.afterSearchCallBack){
                thisProxy.params.afterSearchCallBack();
            }
            thisProxy.clearCollaborateContainer();
        }
    });
    // 隐藏过滤工具栏的X清空过滤条件按钮
    thisProxy.canvas.find('.ui-search-clear').hide();
    // 隐藏快速过滤（默认）
    if (!thisProxy.params.showQuickFilter) {
        thisProxy.gridTableObject[0].toggleToolbar();
    }

    // 初始化自定义标题提示
    thisProxy.fireHeaderTitleChange(colTitle);

    // 绑定Canvas事件，屏蔽表格区域内浏览器右键菜单
    thisProxy.canvas.bind('mouseenter', function () {
        document.oncontextmenu = function () {
            return false;
        };
    }).bind('mouseleave', function () {
        document.oncontextmenu = function () {
            return true;
        };
    }).bind('mouseover', function () {
        document.oncontextmenu = function () {
            return false;
        };
    });

    // 绑定Window事件，窗口变化时重新调整表格大小
    $(window).resize(function () {
        thisProxy.resizeToFitContainer();
        thisProxy.frozenHeight = $('#'+thisProxy.tableId+'_frozen').parent().height();
        thisProxy.resizeFrozenTable();
    });
    // 默认关闭多选模式
    thisProxy.showMultiSelectModel(false);
    //清除冻结列
    thisProxy.gridTableObject.jqGrid("destroyFrozenColumns");
    thisProxy.gridTableObject.jqGrid("setFrozenColumns");
    //批量撤销--CDM独有 CRS无
    thisProxy.addMultiSelectToHeader();
    //thisProxy.checkedMultiOperate();
    // 初始化完成时，使按照所在容器调整表格大小
    thisProxy.resizeToFitContainer();
};
//在批量操作列前添加全选checkbox按钮
FlightGridTable.prototype.addMultiSelectToHeader = function(){
    var thisProxy = this;
    //添加全选/取消全选复选框
    var str = '<input type="checkbox"  id="ckb-selectAll">';
    var idStr = '.frozen-div #jqgh_'+ thisProxy.tableId + '_MULTI_OPERATE';
    var ckbStr = '#'+thisProxy.tableId + '_MULTI_OPERATE'+' #ckb-selectAll';
    if($(ckbStr).length > 0){
        return ; //如果已经存在,则不追加
    }

    $(str).insertBefore( idStr );
    $(idStr).css({textAlign: 'left'});
    //全选/取消全选复选框点击事件
    $("#"+ thisProxy.tableId +"_MULTI_OPERATE #ckb-selectAll").attr('title','全选/取消全选').off("click").on('click',function(e){
        var bool = $(this).prop('checked');
        thisProxy.multiOptSelectedIdsArr = [];
        if(bool){//勾选
            //填充所有勾选的数据ID到批量选中数据id值集合
            $( "#" + thisProxy.tableId + "_frozen .clear-locked-time").each(function(){
                var $this = $(this);
                $this.prop('checked',true);
                thisProxy.multiOptSelectedIdsArr.push( $this.attr("id").substring(6) );
            });
        }else{//取消勾选
            $( "#" + thisProxy.tableId + "_frozen .clear-locked-time").prop('checked',false);
        }
        e.stopPropagation();
    });
};
//批量选中数据ID集合添加或删除数据
FlightGridTable.prototype.multiOptSelectedIdsArrChange = function(data){
    var id = data.attr("id").substring(6);//获取该数据的ID
    if (data.prop('checked') == true) {
        if (this.multiOptSelectedIdsArr.indexOf(id) == -1) {
            this.multiOptSelectedIdsArr.push(id);//如果是勾选,且数组multiOptSelectedIdsArr中无该ID,添加到数组中
            if( $("#" + this.tableId + "_frozen .clear-locked-time").length == this.multiOptSelectedIdsArr.length ){
                $("#ckb-selectAll").prop('checked', true);
            }else{
                $("#ckb-selectAll").prop('checked', false);
            };
        }
    } else {
        this.multiOptSelectedIdsArr.splice(this.multiOptSelectedIdsArr.indexOf(id), 1);//否则从数组multiOptSelectedIdsArr中删除该ID
        //取消全选复选框的勾选
        if($("#ckb-selectAll").prop('checked')){
            $("#ckb-selectAll").prop('checked',false);
        }
    }
};
//根据批量数组中的值选中表格的checkbox
FlightGridTable.prototype.checkedMultiOperate = function(){
    //若选中数组有值，根据选中值选中数据
    var len = this.multiOptSelectedIdsArr.length;
    if( len > 0 ){
        for(var i = 0; i < len; i++){
            var fid = this.multiOptSelectedIdsArr[i];
            $("#" + this.tableId + "_frozen #clear-" + fid ).prop("checked", true);
        }
        if( $("#" + this.tableId + "_frozen .clear-locked-time").length == len ){
            $("#ckb-selectAll").prop('checked', true);
        }else{
            $("#ckb-selectAll").prop('checked', false);
        };
    }
};
//批量撤销
FlightGridTable.prototype.multiClearSubmitFunc = function(){
    var thisProxy = this;
    //尚未选择航班对话框
    var openInvalidFlightModal = function(){
        var opt = {
            title: '尚未选择航班',
            content: '请在批量操作列中选择一条或多条航班',
            status: 2,
            showCancelBtn: false,
            pattern: "sm",
            mtop: 300,
            buttons: [
                {
                    name: "确定",
                }
            ]
        };
        BootstrapDialogFactory.dialog(opt);
    };

    //批量撤销提交回调方法
    var multiClearSubmitDataFunc = function(parameter){
        $.ajax({
            url: DialogUrlUtils.flowcontrol.flight_multi_cobt_clear_url,
            traditional: true,
            type: 'POST',
            data: parameter,
            dataType: 'json',
            success: function (data, status, xhr) {
                if(!$.isValidVariable(data)){
                    $("body").hideProgress( "批量撤销失败" );
                    //提示框
                    var opt = {
                        title: '失败',
                        content: '批量撤销失败',
                        status: 3,
                        showCancelBtn: false,
                        pattern: "sm",
                        mtop: 300,
                        buttons: [
                            {
                                name: "确定",
                            }
                        ]
                    };
                    BootstrapDialogFactory.dialog(opt);
                    $("body").hideProgress( "" );
                }else {
                    if(data.status == 200){
                        //更新批量撤销的数据
                        var flights = data.flights;
                        thisProxy.fireFlightGridTableMultiDataChange(flights);
                        $("body").hideProgress( "批量撤销成功" );
                        //取消全选复选框的勾选
                        if($("#ckb-selectAll").prop('checked')){
                            $("#ckb-selectAll").prop('checked',false);
                        }
                        //提示框
                        var opt = {
                            title: '成功',
                            content: '批量撤销成功',
                            status: 1,
                            showCancelBtn: false,
                            pattern: "sm",
                            mtop: 300,
                            buttons: [
                                {
                                    name: "确定",
                                }
                            ]
                        };
                        BootstrapDialogFactory.dialog(opt);
                    }else if(data.status == 400){//存在不符合条件的数据
                        $("body").hideProgress( "批量撤销失败" );
                        var err = data.error.message;
                        var invalid = parseInvalidDatas(data);
                        var contentStr = '<div class="multi-clear-fail">'+
                            '<p>'+err+'</p>'+invalid.info+
                            '<div class="checkbox auto-deselect-container"><label>' +
                            '<input type="checkbox" class="auto-deselect" name="autodDeselect" value="2">自动去除不符合的数据</label></div><div>' +
                            '</div>';
                        var params = {
                            title: '警告',
                            content: contentStr,
                            status: 2,
                            showCancelBtn: false,
                            mtop: 300,
                            buttons: [
                                {
                                    name: "再次提交",
                                    className: 'submit-again',
                                    callback: function () {
                                        var autoDeselect = $('.auto-deselect').prop('checked');
                                        if(autoDeselect){
                                            var invalidID = invalid.ids;
                                            var len = invalid.ids.length;
                                            for(var i=0; i<len; i++){
                                                var index = thisProxy.multiOptSelectedIdsArr.indexOf(invalidID[i]);
                                                if(index != -1){
                                                    thisProxy.multiOptSelectedIdsArr.splice(index,1);
                                                    $("#" + thisProxy.tableId + "_frozen #clear-" + invalidID[i] ).prop('checked',false);//取消勾选
                                                    //取消全选复选框的勾选
                                                    if($("#ckb-selectAll").prop('checked')){
                                                        $("#ckb-selectAll").prop('checked',false);
                                                    }
                                                }
                                            }
                                            if ( thisProxy.multiOptSelectedIdsArr.length <= 0) {
                                                //打开尚未选择航班对话框
                                                openInvalidFlightModal();
                                            }else {
                                                $("body").showProgress("批量撤销中...");
                                                var params = {
                                                    ids: thisProxy.multiOptSelectedIdsArr,
                                                    comment: parameter.comment
                                                };
                                                multiClearSubmitDataFunc(params);
                                            }
                                        };
                                    }
                                },
                                {
                                    name: "返回修改",
                                    status: -1
                                }
                            ]
                        };
                        BootstrapDialogFactory.dialog(params);
                        //再次提交不可用
                        var sub = $('.submit-again');
                        sub.attr('disabled','disabled').css({"background": "#eee","color": "#999","cursor": "not-allowed"});
                        //自动去除复选框点击事件
                        $('.auto-deselect').on('click',function(){
                            if($(this).prop('checked')){
                                sub.removeAttr('disabled').css({"background": "#26a69a","color": "#ffffff","cursor": "pointer"});
                            }else {
                                sub.attr('disabled','disabled').css({"background": "#eee","color": "#999","cursor": "not-allowed"});
                            }
                        })

                    }else if(data.status == 500){
                        $("body").hideProgress( "批量撤销失败" );
                        var error_message = data.error.message;
                        //提示框
                        var opt = {
                            title: '失败',
                            content: error_message,
                            status: 3,
                            showCancelBtn: false,
                            pattern: "sm",
                            mtop: 300,
                            buttons: [
                                {
                                    name: "确定",
                                }
                            ]
                        };
                        BootstrapDialogFactory.dialog(opt);
                        $("body").hideProgress( "" );
                    }
                }

            },
            error: function (xhr, status, error) {
                console.error('clear cobt data failed, state: ');
                console.error(error);
            },
            complete: function (xhr, status) {
                xhr = null
            }
        });


    };

    //解析错误信息
    var parseInvalidDatas = function(obj){
        /**
         * 无效航班集合
         * **/
        var invalidFlightObj = {
            en: ['invalidCRSFlights','invalidFMEFlights','invalidCNLFlights','invalidDEPFlights','invalidFPLFlights'],
            cn: ['CRS航班','不包含FME信息的航班','已取消航班','已起飞航班','未发报航班']
        };
        var result = {
            info : '',
            ids : []
        };
        var invalidObj = {};
        var str = '';
        //转为中文
        for(var k in obj){
            var index = invalidFlightObj.en.indexOf(k);
            if(index !=-1){
                var val = obj[k];
                var type = invalidFlightObj.cn[index];
                invalidObj[type] = [];
                for(var i in val){
                    if(i){
                        var id = val[i].flightId;
                        invalidObj[type].push(id);
                        result.ids.push(i);
                    }
                }
            }
        }

        for(var i in invalidObj){
            var len = invalidObj[i].length;
            if(len> 0){
                str +='<p>'+ i +':' + invalidObj[i].join(',')+'</p>';
            }
        }
        result.info = str;
        return result;
    };

    if ( thisProxy.multiOptSelectedIdsArr.length <= 0) {
        openInvalidFlightModal();
    } else {
        var contentStr = '<form class="row">'
            + '<span class="col-xs-12">备注</span>'
            + '<textarea class="col-xs-11 multi-clear-comment" name="comment" rows="3" cols="30" placeholder="不超过50个字" maxlength="50" ></textarea>'
            + '</div>'
            + '</form>';
        var params = {
            title: '批量撤销',
            content: contentStr,
            status: 1,
            showCancelBtn: false,
            pattern: "sm",
            mtop: 300,
            buttons: [
                {
                    name: "提交",
                    callback: function () {
                        $("body").showProgress("批量撤销中...");
                        var params = {
                            ids: thisProxy.multiOptSelectedIdsArr,
                            comment: $(".multi-clear-comment").val()
                        };
                        //提交
                        multiClearSubmitDataFunc(params);
                    }
                },
                {
                    name: "返回",
                    status: -1
                }
            ]
        };
        BootstrapDialogFactory.dialog(params);
    }

};
//批量操作上相关监听
FlightGridTable.prototype.handleMultiColCheckbox = function(){
    var thisProxy = this;
    //批量复选框监听事件
    $('#' + thisProxy.tableId).on('click', '.clear-locked-time', function (e) {//点击事件
        var $this = $(this);
        thisProxy.multiOptSelectedIdsArrChange($this);
    });
};
/**
 * 调整表格大小以适应所在容器
 */
FlightGridTable.prototype.resizeToFitContainer = function () {
    GridTableUtil.resizeToFitContainer(this.tableId);
};

/**
 * 判断是否启动多选模式
 *
 * @returns {boolean}
 */
FlightGridTable.prototype.isMultiSelectModel = function () {
    if ($.isValidObject(this.gridTableObject)) {
        // 判断多选模式下，数据选择模式
        return !this.gridTableObject.jqGrid('getGridParam', 'multiboxonly');
    }
};

/**
 * 启动或关闭多选模式
 *
 * @param isShow 是否显示
 */
FlightGridTable.prototype.showMultiSelectModel = function (isShow) {
    //清除冻结列
    this.gridTableObject.jqGrid("destroyFrozenColumns");
    // 判断是否传入显示控制值
    if (isShow == true) {
        // 要求开启
        this.gridTableObject.jqGrid('setGridParam', {multiboxonly: false}).jqGrid('showCol', 'cb').trigger("reloadGrid");
        $('#' + this.pagerId).show();
    } else if (isShow == false) {
        // 要求关闭
        this.gridTableObject.jqGrid('setGridParam', {multiboxonly: true}).jqGrid('hideCol', 'cb').trigger("reloadGrid");
        $('#' + this.pagerId).hide();
    } else {
        // 无要求根据当前状态进行切换
        // 判断当前表格是否进入了多选模式
        if (this.isMultiSelectModel()) {
            // 已进入，关闭多选
            this.gridTableObject.jqGrid('setGridParam', {multiboxonly: true}).jqGrid('hideCol', 'cb').trigger("reloadGrid");
            $('#' + this.pagerId).hide();
        } else {
            // 未进入，开启多选
            this.gridTableObject.jqGrid('setGridParam', {multiboxonly: false}).jqGrid('showCol', 'cb').trigger("reloadGrid");
            $('#' + this.pagerId).show();
        }
    }
    // 重新调整表格大小以使用所在容器
    this.resizeToFitContainer();
    //激活冻结列
    this.gridTableObject.jqGrid("setFrozenColumns");
    //重算高度
    this.frozenHeight = $('#'+this.tableId+'_frozen').parent().height() - 2;
    //滚动条到首行
    this.canvas.find("div.ui-jqgrid-bdiv").scrollTop(0);
    this.resizeFrozenTable();
};

/**
 * 显示/隐藏快速过滤工具条
 */
FlightGridTable.prototype.showQuickFilter = function () {
    // 清空过滤条件
    this.gridTableObject[0].clearToolbar();
    //清除冻结列
    this.gridTableObject.jqGrid("destroyFrozenColumns");
    // 切换显示
    this.gridTableObject[0].toggleToolbar();
    // 隐藏清空条件的x
    this.canvas.find('.ui-search-clear').hide();
    // 自适应
    this.resizeToFitContainer();
    //激活冻结列
    this.gridTableObject.jqGrid("setFrozenColumns");
    this.frozenHeight = $('#'+this.tableId+'_frozen').parent().height();
    this.resizeFrozenTable();

};
//调整冻结列高度
FlightGridTable.prototype.resizeFrozenTable = function(){
    var frozenDom = $('#'+this.tableId+'_frozen').parent();
    frozenDom.height( this.frozenHeight + 0 + 'px');

};
/**
 * 显示高级查询对话框
 */
FlightGridTable.prototype.showAdvanceFilter = function () {
    // 代理
    var thisProxy = this;
    // 给表格对象绑定查询操作
    thisProxy.gridTableObject.jqGrid("searchGrid", {
        sopt: ['cn', 'nc', 'eq', 'ne', 'lt', 'le', 'gt', 'ge', 'bw', 'bn', 'in', 'ni', 'ew', 'en'],
        caption: "高级查询",
        multipleSearch: true,
        multipleGroup: true,
        searchOnEnter: true,
        closeOnEscape: true,
        resize: false,
        zIndex: 1004,
        width: 600
    });
    if (!thisProxy.advanceFilterFlag) {
        var callback = function () {
            thisProxy.gridTableObject.jqGrid('setGridParam', {data: thisProxy.tableData}).trigger('reloadGrid');

        }
        $("#fbox_" + thisProxy.tableId + "_reset").off("click", callback).on("click", callback);
        $("#fbox_" + thisProxy.tableId + "_search").off("click", callback).on("click", callback);
        thisProxy.advanceFilterFlag = true;
    }
};

/**
 * 左键单击事件
 *
 * @param rowid
 * @param iCol
 * @param cellcontent
 * @param e
 */
FlightGridTable.prototype.onCellSelect = function (rowid, iCol, cellcontent, e) {
    // 清除单元格样式
    this.clearCollaborateContainer();
};

/**
 * 右键单击事件
 *
 * @param rowid
 * @param iRow
 * @param iCol
 * @param e
 */
FlightGridTable.prototype.onRightClickRow = function (rowid, iRow, iCol, e) {
 // 代理
 var thisProxy = this;
 var opts = {
 rowid : rowid,
 iRow : iRow,
 iCol : iCol
 };
 // // 清除单元格样式
 this.clearCollaborateContainer();
 // // 获取单元格colModel对象
 var colModel = this.gridTableObject.jqGrid('getGridParam')['colModel'][iCol];
 // // 获取触发事件的单元格对象
 var cellObj = $(e.target);
 // // 记录当前选中的单元格对象
 cellObj.addClass(FlightGridTable.SELECTED_CELL_CLASS);
 //
 // //预留时隙协调
 // var slotVal = cellObj.data("slot");
 // if($.isValidVariable(slotVal)){
 // thisProxy.reserveTimeSlotCoordination( cellObj, slotVal, opts );
 // };
 // // 获取航班计划
 // var flight = this.data.result[rowid];
 // if(!flight){
 //        return null;
 //    }
 // 可交互标记
 var collaborateFlag = true;
 // 交互限制条件 0未起飞，1预起飞，2已起飞，3已落地，4延误，5返航备降，6CNL
 // 状态为空或不等于1或4或未发FPL,CHG,DLA 给出提示
 // if (!$.isValidVariable(flight.fmeToday.status)
 // || (flight.fmeToday.status != FmeToday.STATUS_SCH && flight.fmeToday.status != FmeToday.STATUS_FPL && flight.fmeToday.status != FmeToday.STATUS_DLA)
 // || !FmeToday.hadFPL(flight.fmeToday)) {
 // collaborateFlag = false;
 // if (colModel.name == 'RUNWAY'
 // || colModel.name == 'DEICE_POSITION'
 // || colModel.name == 'DEICE_STATUS'
 // || colModel.name == 'DEICE_GROUP'
 // || colModel.name == 'AGCT'
 // || colModel.name == 'ASBT'
 // || colModel.name == 'AOBT'
 // || colModel.name == 'POSITION'
 // || colModel.name == 'TOBT'
 // || colModel.name == 'HOBT'
 // || colModel.name == 'COBT'
 // || colModel.name == 'CTOT'
 // || colModel.name == 'PRIORITY') {
 // if (flight.fmeToday.status == FmeToday.STATUS_CNL || FmeToday.isPCancel(flight.fmeToday)) {
 // thisProxy.showTableCellTipMessage(opts, 'WARN', '航班已经取消');
 // } else if (flight.fmeToday.status == FmeToday.STATUS_ARR) {
 // thisProxy.showTableCellTipMessage(opts, 'WARN', '航班已经落地');
 // } else if (flight.fmeToday.status == FmeToday.STATUS_DEP) {
 // thisProxy.showTableCellTipMessage(opts, 'WARN', '航班已经起飞');
 // } else if (flight.fmeToday.status == FmeToday.STATUS_RTN_CPL) {
 // thisProxy.showTableCellTipMessage(opts, 'WARN', '航班已经返航或备降');
 // } else if (!FmeToday.hadFPL(flight.fmeToday) && colModel.name !== 'TOBT') {
 // thisProxy.showTableCellTipMessage(opts, 'WARN', '航班尚未拍发FPL报');
 // }
 // return;
 // }
 // }
 // FLIGHTID协调
 if (colModel.name == 'FLIGHTID') {
 this.collaborateFlightid(rowid, iRow, iCol, cellObj, collaborateFlag);
 }
 // PRIORITY协调
 // if (colModel.name == 'PRIORITY') {
 // this.collaboratePriority(rowid, iRow, iCol, cellObj);
 // }
 // TOBT协调
 // if (colModel.name == 'TOBT') {
 // this.collaborateTobt(rowid, iRow, iCol, cellObj);
 // }
 // HOBT协调
 // if (colModel.name == 'HOBT') {
 // this.collaborateHobt(rowid, iRow, iCol, cellObj);
 // }
 // 推出时间
 // if (colModel.name == 'AOBT') {
 // this.collaborateAobt(rowid, iRow, iCol, cellObj);
 // }
 // ASBT协调
 // if (colModel.name == 'ASBT') {
 // this.collaborateAsbt(rowid, iRow, iCol, cellObj);
 // }
 // AGCT协调
 // if (colModel.name == 'AGCT') {
 // this.collaborateAgct(rowid, iRow, iCol, cellObj);
 // }
 // COBT协调
 // if (colModel.name == 'COBT') {
 // this.collaborateCobt(rowid, iRow, iCol, cellObj);
 // }
 // CTD协调
 // if (colModel.name == 'CTOT') {
 //如果有前段航班号且不为空 20170901 应需求注释掉该逻辑
 //if( flight.hasOwnProperty("formerFlightid") && "" != flight.formerFlightid ){
 //    //判断前段航班状态
 //    var flightStatus =  flight.status;
 //    switch( flightStatus ){
 //        case FlightCoordination.STATUS_FORMER_SCH: // 前段计划
 //        case FlightCoordination.STATUS_FORMER_CNL: // 前段取消
 //        case FlightCoordination.STATUS_FORMER_FPL: // 前段准备
 //        case FlightCoordination.STATUS_FORMER_BOARDING:  // 前段上客
 //        case FlightCoordination.STATUS_FORMER_CLOSE:  // 前段关门
 //        case FlightCoordination.STATUS_FORMER_OUT:  // 前段推出
 //        case FlightCoordination.STATUS_FORMER_DEP:  // 前段起飞
 //        case FlightCoordination.STATUS_FORMER_RTN:  // 前段返航
 //        case FlightCoordination.STATUS_FORMER_ALN:  // 前段备降
 //        case FlightCoordination.STATUS_FORMER_ARR_RTN:  // 前段返航降落
 //        case FlightCoordination.STATUS_FORMER_ARR_ALN:  // 前段备降降落
 //        {
 //            //命中 以上状态则提示
 //            thisProxy.showTableCellTipMessage(opts, 'WARN', '前序航班未落地');
 //            return;
 //        }
 //    }
 //}

 // this.collaborateCtot(rowid, iRow, iCol, cellObj);
 // }
 // POSITION协调
 // if (colModel.name == 'POSITION') {
 // this.collaboratePosition(rowid, iRow, iCol, cellObj);
 // }
 // RUNWAY协调
 // if (colModel.name == 'RUNWAY') {
 // this.collaborateRunway(rowid, iRow, iCol, cellObj);
 // }
 // DELAYREASON协调
 // if (colModel.name == 'DELAY_REASON') {
 // this.collaborateDelayReason(rowid, iRow, iCol, cellObj);
 // }
 // FLOWCONTROL POINT PASSTIME协调
 // if (colModel.name == 'FLOWCONTROL_POINT_PASSTIME') {
 // this.collaborateFlowcontrolPointPasstime(rowid, iRow, iCol, cellObj);
 // }
 // FLOWCONTROL_POINT_PASSTIME_CTO协调(CTO)
 //if (colModel.name == 'FLOWCONTROL_POINT_PASSTIME_CTO') {
 //    this.collaborateFlowcontrolPointPasstimeCTO(rowid, iRow, iCol, cellObj);
 //}
 // DEICESTATUS协调
 // if (colModel.name == 'DEICE_STATUS') {
 // this.collaborateDeiceStatus(rowid, iRow, iCol, cellObj);
 // }
 // DEICEPOSITION协调
 // if (colModel.name == 'DEICE_POSITION') {
 // this.collaborateDeiceStatus(rowid, iRow, iCol, cellObj);
 // }
 // DEICEGROUP协调
 // if (colModel.name == 'DEICE_GROUP') {
 // this.collaborateDeiceStatus(rowid, iRow, iCol, cellObj);
 // }
 // 屏蔽协调窗口的右键操作
 if ($('.' + FlightGridTable.COLLABORATE_DOM_CLASS)[0] != null) {
 $('.' + FlightGridTable.COLLABORATE_DOM_CLASS)[0].oncontextmenu = function (e) {
 return false;
 };
 }
 };

/**
 * 列名称转换
 */
FlightGridTable.prototype.convertColNames = function () {
    // 将显示列数据转换为表格需显示列名称的数组
    var displayNames = [];
    // 遍历显示列
    for (var name in this.colDisplay) {
        var showNameValue = this.colDisplay[name];
        var nameValue = this.colNames[name];
        // 判断显示列
        if (showNameValue['display'] == 1) {
            // 添加对应中文字体
            displayNames.push(nameValue['cn']);
        }
    }
    return displayNames;
};

/**
 * 列属性转换
 */
FlightGridTable.prototype.convertColModel = function () {
    // 转换列属性
    var displayColModel = [];
    // 遍历显示列
    for (var name in this.colDisplay) {
        var nameValue = this.colDisplay[name];
        // 判断显示列，加入显示列的Model
        if (nameValue['display'] == 1) {
            displayColModel.push(this.colModel[name]);
        }
    }
    return displayColModel;
};

/**
 * 列标题转换
 */
FlightGridTable.prototype.convertColTitle = function () {
    // 转换列标题
    var displayTitle = {};
    // 遍历显示列
    for (var name in this.colDisplay) {
        var displayConf = this.colDisplay[name];
        // 判断显示列，加入显示列的Title
        if (displayConf['display'] == 1) {
            displayTitle[name] = this.colTitle[name];
        }
    }
    return displayTitle;
};

/**
 * 列样式转换
 */
FlightGridTable.prototype.convertColStyle = function () {
    // 样式
    var displayStyle = {};
    var displayStyleComment = {};
    // 转换数据
    for (var styleName in this.colStyle) {
        // 获取样式值
        var styleValues = this.colStyle[styleName];
        var singleStyle = '';
        var singleStyleComment = '';
        for (var styleKey in styleValues) {
            if (styleKey == 'comments') {
                singleStyleComment = styleValues[styleKey];
            } else {
                singleStyle += styleKey + ':' + styleValues[styleKey] + ';';
            }
        }
        displayStyle[styleName] = singleStyle;
        displayStyleComment[styleName] = singleStyleComment;
    }
    if ($.isValidVariable(this.colConverter)) {
        // 赋值样式及备注信息给Converter
        this.colConverter.displayStyle = displayStyle;
        this.colConverter.displayStyleComment = displayStyleComment;
    }
};

/**
 * 更新列标题
 * @param colTitle 列标题
 * type: {showName : title}
 */
FlightGridTable.prototype.fireHeaderTitleChange = function (colTitle) {
    // 根据显示列获取或转换标题title对应的文字
    var titles = '';
    var titlesFlag = true;
    if ($.isValidVariable(colTitle)) {
        titles = colTitle;
        titlesFlag = true;
    } else {
        titles = this.colNames;
        titlesFlag = false;
    }
    // 更新标题title的显示
    for (var name in this.colDisplay) {
        var showNameValue = this.colDisplay[name];
        //
        var title = titlesFlag ? titles[name] : titles[name]['cn'];
        // 判断显示列
        if (showNameValue['display'] == 1) {
            this.gridTableObject.jqGrid('setLabel', name, '', [], {'title': title});
        }
    }
};

/**
 * 触发列属性相关数据更新
 *
 * @param colNames 列名称
 * @param colStyle 列样式
 * @param colTitle 列标题
 * @param colEdit 列操作
 * @param colDisplay 列显示
 */
FlightGridTable.prototype.fireColNamesChange = function (colNames, colStyle, colTitle, colEdit, colDisplay) {
    // 更新列配置
    if ($.isValidVariable(colNames)) {
        this.colNames = colNames;
    }
    if ($.isValidVariable(colStyle)) {
        this.colStyle = colStyle;
    }
    if ($.isValidVariable(colTitle)) {
        this.colTitle = colTitle;
    }
    if ($.isValidVariable(colEdit)) {
        this.colEdit = colEdit;
    }
    if ($.isValidVariable(colDisplay)) {
        this.colDisplay = colDisplay;
    }
    // 重新加载表格
    this.unloadGrid();
};

/**
 * 触发表格全部数据更新
 *
 * @param data 数据格式{generateTime:yyyyMMddHHmm, result:{FlightCoordination.id:FlightCoordination}}
 */
FlightGridTable.prototype.fireDataChange = function (data) {
    //
    if (data == undefined || data == null) {
        return;
    }
    // 多选模式下不进行数据更新
    if (this.isMultiSelectModel()) {
        return;
    }
    // 更新数据
    this.data = data;
    this.tableData = [];
    this.tableDataMap = {};
    // 转换数据
    var flights = data.result;
    for (var id in flights) {
        if (!flights.hasOwnProperty(id) || !$.isValidVariable(flights[id])) {
            continue;
        }
        //  默认受控航路点
        var controlPoints = null;
        var flowcontrols = flights[id].flowcontrols;
        if ($.isValidVariable(flowcontrols)) {
            for (var flowId in flowcontrols) {
                var flowcontrol = flowcontrols[flowId];
                if ($.isValidVariable(flowcontrol)
                    && $.isValidVariable(flowcontrol[9])) {
                    controlPoints = flowcontrol[9];
                }
            }
        }
        var rowData = this.colConverter.convertData(flights[id], data.generateTime, this.colAuthority, controlPoints);
        if ($.isValidVariable(rowData) && $.isValidVariable(rowData.id)) {
            this.tableData.push(rowData);
            this.tableDataMap[id] = rowData;
        }
    }
    this.drawGridTableData();
    this.resizeFrozenTable();
};

/**
 * 触发表格单个数据更新
 *
 * @param flight
 * @param dataTime
 */
FlightGridTable.prototype.fireSingleDataChange = function (flight, dataTime) {
    //清除协调窗口
    this.clearCollaborateContainer();
    // 转换数据
    var rowData = this.convertSingleData(flight, dataTime);
    // 更新数据
    this.data.result[flight.id] = flight;
    this.tableDataMap[flight.id] = rowData;
    // 删除原数据行，加入新的数据行
    // 表格数据ID集合
    var ids = this.gridTableObject.jqGrid('getDataIDs');
    // 当前所在行序列
    var index = this.gridTableObject.jqGrid('getInd', flight.id);
    //清除冻结列
    this.gridTableObject.jqGrid("destroyFrozenColumns");
    // 删除原数据
    var f = this.gridTableObject.jqGrid('delRowData', flight.id);
    if (f) {
        // 再原数据的前一位之后插入新数据
        if (index >= 2) {
            this.gridTableObject.jqGrid('addRowData', flight.id, rowData, 'after', ids[index - 2]);
        } else {
            this.gridTableObject.jqGrid('addRowData', flight.id, rowData, 'first');
        }
    }
    if("main_canvas_grid_table" == this.tableId || 'flowcontrol_impact_flights_dialog_table' == this.tableId ){
        $("#" + this.canvasId + " .ui-jqgrid-bdiv").not('.frozen-bdiv').trigger("scroll");
        if( typeof this.checkedMultiOperate == "function"){
            this.checkedMultiOperate();
        }
    }
    //激活冻结列
    this.gridTableObject.jqGrid("setFrozenColumns");
    //在批量操作列前添加全选checkbox按钮
    this.addMultiSelectToHeader();
    this.resizeFrozenTable();
    this.scrollToRow(flight.id);
};

/**
 * 绘制表格数据
 */
FlightGridTable.prototype.drawGridTableData = function () {
    var thisProxy = this;
    // 判断是否正在协调操作 正在协调操作不滚动刷新
    var collaborator = this.canvas.find('div.flight-grid-table-collaborate-container');
    if (collaborator.length > 0) {
        return;
    }
    // 清空popover弹出框信息
//    $('.trajectory-for-popover').popover('destroy');
    // 记录滚动位置
    var scrollHeight = this.canvas.find('div.ui-jqgrid-bdiv').scrollTop();
    // 清空表格数据
    this.gridTableObject.jqGrid('clearGridData');
    // 更新表格数据
    var params = {data: this.tableData, srcoll: 1};
    if (this.tableId == "flight-grid-table") {
        var num = this.tableData.length;
        params.rowNum = num > 50 ? 50 : num;
        params.scroll = 1;
    }

    this.gridTableObject.jqGrid('setGridParam', params).trigger('reloadGrid');
    var heightDom = $(this.table).siblings();
    if (heightDom.height() > 0) {
        heightDom.height(0);
    }
    // 添加popover
    // if ($(".trajectory-for-popover").length > 0 && $(".trajectory-for-popover").text() != "") {
    //     $('#' + this.tableId).popover({
    //         container: 'body',
    //         selector: '.trajectory-for-popover',
    //         trigger: 'hover',
    //         placement: 'left',
    //         html: true,
    //         title: function () {
    //             var rowid = $(this).attr('rowid');
    //             return thisProxy.buildFlightTrajectorPopoverTitle(rowid);
    //         },
    //         content: function () {
    //             var rowid = $(this).attr('rowid');
    //             return thisProxy.buildFlightTrajectorPopoverContent(rowid, "FLOWCONTROL_POINT");
    //         }
    //     });
    // }
    // if ($(".ACCFIX-for-popover").length > 0 && $(".ACCFIX-for-popover").text() != "") {
    //     $('#' + this.tableId).popover({
    //         container: 'body',
    //         selector: '.ACCFIX-for-popover',
    //         trigger: 'hover',
    //         html: true,
    //         title: function () {
    //             var rowid = $(this).attr('rowid');
    //             return thisProxy.buildFlightTrajectorPopoverTitle(rowid);
    //         },
    //         content: function () {
    //             var rowid = $(this).attr('rowid');
    //             return thisProxy.buildFlightTrajectorPopoverContent(rowid, "ACCFIX");
    //         }
    //     });
    // }
    // 判断是否需要滚动位置
    // if (this.autoScroll) {
    //     // 需要自动滚动
    //     var scrollToRowid = null;
    //     // 排序数据
    //     var sortColNames = this.autoScroll.split(',');
    //     var sortedData = this.sortGridData(this.tableData, sortColNames);
    //     var dataTime = this.data.generateTime;
    //     for (var index in sortedData) {
    //         var time = sortedData[index][sortColNames[0]];
    //         if (time >= dataTime) {
    //             scrollToRowid = sortedData[index]['ID'];
    //             break;
    //         }
    //     }
    //     if (scrollToRowid) {
    //         // 自动滚动到指定行
    //         this.scrollToRow(scrollToRowid);
    //     } else {
    //         // 滚动到更新前的位置
    //         this.canvas.find("div.ui-jqgrid-bdiv").scrollTop(scrollHeight);
    //     }
    // } else {
    //     // 滚动到更新前的位置
    //     this.canvas.find("div.ui-jqgrid-bdiv").scrollTop(scrollHeight);
    // }
    this.frozenHeight = $('#'+this.tableId+'_frozen').parent().height();
    this.resizeFrozenTable();
};

/**
 * 表格数据转换单条数据
 *
 * @param flight
 * @param dataTime
 * @returns {*}
 */
FlightGridTable.prototype.convertSingleData = function (flight, dataTime) {
    var rowData = this.colConverter.convertData(flight, dataTime, this.colAuthority);
    if ($.isValidVariable(rowData) && $.isValidVariable(rowData.id)) {
        return rowData;
    }
};

/**
 * 清除协调窗口
 */
FlightGridTable.prototype.clearCollaborateContainer = function () {
    // 清理协调窗口
    $('.' + FlightGridTable.SELECTED_CELL_CLASS).removeClass(FlightGridTable.SELECTED_CELL_CLASS);
    $('.' + FlightGridTable.COLLABORATE_DOM_CLASS).remove();
    if ('auto' == this.canvas.css('overflow')) {
        this.canvas.css('overflow', 'hidden');
    }
    // 清理popover窗口
    //$('.popover').popover("hide");
};

/**
 *
 * @param form
 */
FlightGridTable.prototype.closeCurrentModal = function (form) {
    // 日期
    var dateElement = form.find('#apply-tobt-date');
    // 时间
    var timeElement = form.find('#apply-tobt-time');
    // JQuery对象
    var dateDivElement = dateElement.parent('.input-group');
    var dateSpanElement = dateElement.next('span');
    var timeDivElement = timeElement.parent('.input-group');
    var timeSpanElement = timeElement.next('span');
    // 清除数据
    dateElement.val('');
    timeElement.val('');
    // 清除样式
    dateDivElement.removeClass('has-error has-success has-warning');
    timeDivElement.removeClass('has-error has-success has-warning');
    dateSpanElement.removeClass('glyphicon-ok glyphicon-remove glyphicon-warning-sign');
    timeSpanElement.removeClass('glyphicon-ok glyphicon-remove glyphicon-warning-sign');
    // 清除提示信息
    dateElement.qtip('destroy', true);
    timeElement.qtip('destroy', true);
    // 清除协调窗口
    //this.clearCollaborateContainer();
};


/**
 * 预留时隙协调
 *
 * @param cellObj  点击获取的元素
 * @param reserve_slot 预留时隙
 * @param slotVal  时隙标识符 1为正常时隙  2为预发布时隙
 * @param opts   获取行列对象
 */
FlightGridTable.prototype.reserveTimeSlotCoordination =function(cellObj,slotVal,opts){
    var reserveDom = $(FlightGridTableCollaborateDom.RESERVED_SLOT);
    var thisProxy = this;
    //获取rowid
    var rowid = opts.rowid;
    thisProxy.showCollaborator(reserveDom, cellObj);
    //获取表单
    var form = reserveDom.find('form');
    //获取航班号
    var flightId = cellObj.html();
    //将航班号添加到表单
    if( $.isValidVariable( flightId ) ){
        flightId = flightId.replace( /\*/g, "" );
        if(flightId == "&nbsp;"){
            flightId = "";
        };
        form.find( "#flightId" ).val( flightId );
        //获取备注
        var comment= '',
            comment = cellObj.attr( "title" );
        comment = comment.substring( 3,comment.length );
        if(comment == "null"){
            comment = "";
        };
        if($.isValidVariable(comment)){
            form.find("#slot-comment").val(comment);
        };
    };
    //按钮权限
    var addButton = reserveDom.find( 'button#add-slot' );
    var rowObj = thisProxy.tableDataMap[rowid];
    if($.isValidObject(rowObj)){
        var reserveSlot = "";
        var reservePoint = "";
        reserveSlot = rowObj.FLOWCONTROL_POINT_PASSTIME;
        reservePoint = rowObj.FLOWCONTROL_POINT;
    };
    //取得真正流控id值
    var realFlowId = rowid.split("_")[0];
    //表单验证
    form.bootstrapValidator({
        feedbackIcons:{
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            flightId:{
                validators:{
                    judgeReserveFlightId:{
                    }
                }
            }
        }
    });
    //点击提交
    addButton.on('click',function () {
        //获取验证结果
        var bootstrapValidator = form.data('bootstrapValidator');
        //手动再次触发验证
        bootstrapValidator.validate();
        if(bootstrapValidator.isValid()){
            var subUrl = null;
            if(slotVal == 1){
                subUrl = 'flowcontrol_update_flight_slot.action';
            }else if(slotVal == 2){
                subUrl = 'flowcontrol_reserve_update_flight_slot.action';
            };
            //提交表单
            if($.isValidVariable(subUrl) && $.isValidVariable(reserveSlot) && $.isValidVariable(reservePoint) ){
                //初始化按钮loading
                var loading = Ladda.create(this);
                //启动按钮loading
                loading.start();
                $.ajax({
                    url:subUrl ,
                    data: {
                        flowId: realFlowId,
                        flightId: form.find('#flightId').val().toUpperCase(),
                        comment: form.find('#slot-comment').val(),
                        reserveSlot: reserveSlot
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (data) {
                        //停止按钮loading
                        loading.stop();
                        if (!data) {
                            thisProxy.showTableCellTipMessage(opts, "FAIL", "预留时隙添加航班号失败，请稍后重试");
                        };
                        //成功 else if 为失败
                        if (data.status == 200) {
                            var flowcontrol = data.result;
                            if($.isValidObject(flowcontrol)){
                                for(var item in flowcontrol){
                                    //流控ID
                                    var flowcontrolId = item;
                                    if($.isValidVariable(flowcontrolId)){
                                        //获取到当前时隙的接口数据
                                        var flowObjs = data.result[flowcontrolId];
                                        if($.isValidObject(flowObjs)){
                                            var reserveSlotsObj = flowObjs.flightReserveSlots;
                                            if($.isValidObject(reserveSlotsObj) && $.isValidVariable(reserveSlot)){
                                                var dataObj = reserveSlotsObj[reserveSlot];
                                                //提交后隐藏表单
                                                thisProxy.clearCollaborateContainer();
                                                //要更新的数据
                                                var flowObj = {};
                                                flowObj[flowcontrolId] = dataObj;
                                                //用来判断是否为预发布的时隙
                                                var sceneCaseId = flowcontrol[flowcontrolId].sceneCaseId;
                                                //更新单条数据
                                                thisProxy.fireReserveSlotSingleDataChange(sceneCaseId,reserveSlot, reservePoint, rowid, flowcontrolId, flowObj);
                                                if(slotVal == 1){
                                                    if( (typeof flight_flowcontrols) != 'undefined' ){
                                                        if( $.isValidObject(flight_flowcontrols.result[item])){
                                                            flight_flowcontrols.result[item] = flowcontrol[item];
                                                        }

                                                    }else if( $.isValidObject(parent.ATFMAirport) && $.isValidObject(parent.ATFMAirport.flowControlObj) ){
                                                        FlowcontrolImpactFlights.setFlow(flowcontrol[item]);
                                                    }
                                                }else if(slotVal == 2){
                                                    if( (typeof flight_flowcontrols) != 'undefined' ){
                                                        area_flights_preview.flowcontrol = flowcontrol[item];
                                                    }
                                                };
                                                thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '航班号已添加');

                                            }
                                        }

                                    }
                                }

                            }

                        } else if (data.status == 400) {
                            thisProxy.showTableCellTipMessage(opts, "FAIL", data.error)
                        } else if (data.status == 500) {
                            thisProxy.showTableCellTipMessage(opts, "FAIL", data.error)
                        };
                    },
                    error: function ( status, error) {
                        //停止按钮loading
                        loading.stop();
                        console.error('ajax requset  fail, error:');
                        console.error(error);
                    }
                })
            };
        }
    });
    // 给右上角关闭按钮绑定事件
    $(".flight-grid-table-collaborate-container .modal-close-btn").on("click", function () {
        thisProxy.clearCollaborateContainer();
    });
};
/**
 * 触发预留时隙表格单个数据更新
 *
 *  @param sceneCaseId 判断是否为预发布时隙标示
 * @param slot 预留时隙
 * @param point 航路点
 * @param rowid  行id
 * @param realFlowId 真正的flowid
 * @param flowObj 表格数据
 *
 */
FlightGridTable.prototype.fireReserveSlotSingleDataChange = function (sceneCaseId,slot, point, rowid, realFlowId, flowObj) {
    if($.isValidVariable(realFlowId)){
        //清除协调窗口
        this.clearCollaborateContainer();
        //判断是否为预发布时隙
        var isShowAttr= true;
        if(sceneCaseId){
            //预发布预留时隙
            isShowAttr = false;
        }else{
            //普通预留时隙
            isShowAttr = true;
        }
        var rowData = FlightGridTableDataUtil.convertReserveSlots( isShowAttr, slot, point, rowid, realFlowId, flowObj );
        // 表格数据ID集合
        var ids = this.gridTableObject.jqGrid('getDataIDs');
        // 当前所在行序列
        var index = this.gridTableObject.jqGrid('getInd', rowid);
        //清除冻结列
        this.gridTableObject.jqGrid("destroyFrozenColumns");
        // 删除原数据
        var f = this.gridTableObject.jqGrid('delRowData', rowid);
        if (f) {
            // 再原数据的前一位之后插入新数据
            if (index >= 2) {
                this.gridTableObject.jqGrid('addRowData', rowid, rowData, 'after', ids[index - 2]);
            } else {
                this.gridTableObject.jqGrid('addRowData', rowid, rowData, 'first');
            }
        }
        this.gridTableObject.jqGrid("setFrozenColumns");
        this.resizeFrozenTable();
        this.scrollToRow(rowid);
    }
};
/**
 * FLIGHTID协调
 *
 * @param rowid
 * @param iRow
 * @param iCol
 * @param cellObj
 * @param collaborateFlag
 */
FlightGridTable.prototype.collaborateFlightid = function (rowid, iRow, iCol, cellObj, collaborateFlag) {
    // 代理
    var thisProxy = this;
    // 获取行数据
    var rowData = this.tableDataMap[rowid];
    // 获取航班数据
    var flight = this.data.result[rowid];
    // var fmeToday = flight.fmeToday;
    // var records = flight.coordinationRecords;
    // 获取当前时间
    // var generateTime = this.data.generateTime;
    // 获取协调DOM元素
    var collaboratorDom = $(FlightGridTableCollaborateDom.UPDATE_FLIGHTID);
    //标识：协调框是否显示
    var collaboratorFlag = false;
    // 获取协同元素表单
    var form = collaboratorDom.children('form');
    // 备注输入框
    var collTextarea = form.find('textarea');
    // 隐藏备注框
    collTextarea.hide();
    // 追加协调DOM至容器
    // this.table.append(collaboratorDom);
    var container = '#' + this.canvasId;
    $(container).append(collaboratorDom);
    // 根据页面权限和用户权限确定协调DOM
    // 航班详情
    var openFlightDetailButton = collaboratorDom.find('input#open-flight-detail');
    if (this.colEdit['OPEN_FLIGHT_DETAIL']) {
        openFlightDetailButton.show();
        if( !collaboratorFlag ){
            collaboratorFlag = true;
        };
    } else {
        openFlightDetailButton.hide();
    }
    //报文查询按钮显示
    // var openFlightTeleDetailButton = collaboratorDom.find('input#open-flight-tele');
    // if (this.colEdit['OPEN_TELE_DETAIL']&&$.isValidVariable(this.colAuthority[806])) {
    //     openFlightTeleDetailButton.show();
    //     if( !collaboratorFlag ){
    //         collaboratorFlag = true;
    //     }
    // } else {
    //     openFlightTeleDetailButton.hide();
    // }
    // // 操作报文查询功能
    // openFlightTeleDetailButton.click(function () {
    //     thisProxy.openFlightTele(flight);
    //     thisProxy.clearCollaborateContainer();
    // });
    // // 协调记录
    // var openFlightRecordButton = collaboratorDom.find('input#open-flight-record');
    // if (this.colEdit['OPEN_FLIGHT_RECORD']) {
    //     openFlightRecordButton.show();
    //     if( !collaboratorFlag ){
    //         collaboratorFlag = true;
    //     }
    // } else {
    //     openFlightRecordButton.hide();
    // }
    // // 指定前端航班
    // var updateFormerFlightButton = collaboratorDom.find('input#update-former-flight');
    // if (this.colEdit['UPDATE_FORMER_FLIGHT'] && $.isValidVariable(this.colAuthority[156])) {
    //     // 逻辑判断
    //     if (!FmeToday.hadDEP(fmeToday)) {
    //         updateFormerFlightButton.show();
    //     } else {
    //         updateFormerFlightButton.hide();
    //     }
    // } else {
    //     updateFormerFlightButton.hide();
    // }
    // // 时隙分配
    // var markAssignSlotButton = collaboratorDom.find('button#mark-assign-slot');
    // var markUnAssignSlotButton = collaboratorDom.find('button#mark-un-assign-slot');
    // if ((this.colEdit['MARK_ASSIGN_SLOT'] && $.isValidVariable(this.colAuthority[154]))
    //     || (this.colEdit['MARK_UN_ASSIGN_SLOT'] && $.isValidVariable(this.colAuthority[155]))) {
    //     //没有起飞机场和降落机场，可以没有FPL报
    //     if (!FmeToday.hadARR(fmeToday) && !FmeToday.hadDEP(fmeToday)) {
    //         if ($.isValidVariable(flight.locked) && flight.locked == '3') {
    //             markUnAssignSlotButton.hide();
    //             if (this.colEdit['MARK_ASSIGN_SLOT']) {
    //                 markAssignSlotButton.show();
    //             } else {
    //                 markAssignSlotButton.hide();
    //             }
    //         } else {
    //             markAssignSlotButton.hide();
    //             if (this.colEdit['MARK_UN_ASSIGN_SLOT']) {
    //                 markUnAssignSlotButton.show();
    //
    //             } else {
    //                 markUnAssignSlotButton.hide();
    //             }
    //         }
    //     } else {
    //         markAssignSlotButton.hide();
    //         markUnAssignSlotButton.hide();
    //     }
    // } else {
    //     markAssignSlotButton.hide();
    //     markUnAssignSlotButton.hide();
    // }
    //
    // // 标记放行/未放行
    // var markClearanceButton = collaboratorDom.find('button#mark-clearance');
    // var markUnClearanceButton = collaboratorDom.find('button#mark-un-clearance');
    // if ((this.colEdit['MARK_CLEARANCE'] || this.colEdit['MARK_UN_CLEARANCE']) && $.isValidVariable(this.colAuthority[307])) {
    //     //放行状态
    //     var record = null;
    //     if ($.isValidVariable(records)) {
    //         record = records[FlightCoordinationRecord.TYPE_MARK_CLEARANCE];
    //     }
    //     if (!FmeToday.hadARR(flight.fmeToday)
    //         && !FmeToday.hadDEP(flight.fmeToday)
    //         && FmeToday.hadFPL(flight.fmeToday)) {
    //         if (!$.isValidVariable(record) || record.value == 0) {
    //             markUnClearanceButton.hide();
    //             if (this.colEdit['MARK_CLEARANCE']) {
    //                 markClearanceButton.show();
    //             } else {
    //                 markClearanceButton.hide();
    //             }
    //         } else if ($.isValidVariable(record) && record.value == 1) {
    //             markClearanceButton.hide();
    //             if (this.colEdit['MARK_UN_CLEARANCE']) {
    //                 markUnClearanceButton.show();
    //             } else {
    //                 markUnClearanceButton.hide();
    //             }
    //         }
    //     } else {
    //         markClearanceButton.hide();
    //         markUnClearanceButton.hide();
    //     }
    //     // 显示备注输入框
    //     if ((markClearanceButton.is(':visible')
    //         || markUnClearanceButton.is(':visible'))) {
    //         collTextarea.show();
    //     }
    // } else {
    //     markClearanceButton.hide();
    //     markUnClearanceButton.hide();
    // }
    // // 标记取消/恢复
    // var markCancelButton = collaboratorDom.find('button#mark-cancel');
    // var markUnCancelButton = collaboratorDom.find('button#mark-un-cancel');
    // if ((this.colEdit['MARK_CANCEL'] || this.colEdit['MARK_UN_CANCEL']) && $.isValidVariable(this.colAuthority[308])) {
    //     if (!FmeToday.hadARR(flight.fmeToday)
    //         && !FmeToday.hadDEP(flight.fmeToday)
    //         && !FmeToday.hadFPL(flight.fmeToday)) {
    //         if (flight.fmeToday.editStatusToday == 3
    //             && $.isValidVariable(records[FlightCoordinationRecord.TYPE_CANCEL])
    //             && records[FlightCoordinationRecord.TYPE_CANCEL].status == FlightCoordinationRecord.STATUS_MODIFY) {
    //             markCancelButton.hide();
    //             if (this.colEdit['MARK_UN_CANCEL']) {
    //                 markUnCancelButton.show();
    //             } else {
    //                 markUnCancelButton.hide();
    //             }
    //         } else if (flight.fmeToday.editStatusToday != 3) {
    //             markUnCancelButton.hide();
    //             if (this.colEdit['MARK_CANCEL']) {
    //                 markCancelButton.show();
    //             } else {
    //                 markCancelButton.hide();
    //             }
    //         }
    //     } else {
    //         markCancelButton.hide();
    //         markUnCancelButton.hide();
    //     }
    //     // 显示备注输入栏
    //     if (markCancelButton.is(':visible')
    //         || markUnCancelButton.is(':visible')) {
    //         collTextarea.show();
    //     }
    // } else {
    //     markCancelButton.hide();
    //     markUnCancelButton.hide();
    // }
    //
    // // 标记已准备完毕/标记未准备完毕
    // var readyCompleteButton = collaboratorDom.find('button#ready-complete');
    // var readyUnCompleteButton = collaboratorDom.find('button#ready-un-complete');
    // if ((this.colEdit['READY-COMPLETE'] || this.colEdit['READY-UN-COMPLETE']) && $.isValidVariable(this.colAuthority[310])) {
    //     if (!FmeToday.hadARR(flight.fmeToday)
    //         && !FmeToday.hadDEP(flight.fmeToday)
    //         && FmeToday.hadFPL(flight.fmeToday)) {
    //         if ($.isValidVariable(flight.ardtManual)) {
    //             readyCompleteButton.hide();
    //             if (this.colEdit['READY-UN-COMPLETE']) {
    //                 readyUnCompleteButton.show();
    //             } else {
    //                 readyUnCompleteButton.hide();
    //             }
    //         } else {
    //             readyUnCompleteButton.hide();
    //             if (this.colEdit['READY-COMPLETE']) {
    //                 readyCompleteButton.show();
    //             } else {
    //                 readyCompleteButton.hide();
    //             }
    //         }
    //     } else {
    //         readyCompleteButton.hide();
    //         readyUnCompleteButton.hide();
    //     }
    //     // 显示备注输入栏
    //     if (readyCompleteButton.is(':visible')
    //         || readyUnCompleteButton.is(':visible')) {
    //         collTextarea.show();
    //     }
    // } else {
    //     readyCompleteButton.hide();
    //     readyUnCompleteButton.hide();
    // }
    //
    // // 标记豁免/取消豁免
    // var exemptButton = collaboratorDom.find('button#mark-exempt');
    // var exemptCancelButton = collaboratorDom.find('button#mark-exempt-cancel');
    // // 判断是否显示按钮 ---- 已降落不显示  或者 未发报文不显示
    // if ((this.colEdit['MARK_EXEMPT'] || this.colEdit['MARK_EXEMPT_CANCEL']) && (!FmeToday.hadARR(flight.fmeToday) && FmeToday.hadFPL(flight.fmeToday))) {
    //     if (flight.priority == FlightCoordination.PRIORITY_EXEMPT && $.isValidVariable(this.colAuthority[205])) {
    //         exemptCancelButton.show();
    //         exemptButton.hide();
    //     } else if (flight.priority != FlightCoordination.PRIORITY_EXEMPT && $.isValidVariable(this.colAuthority[204])) {
    //         exemptButton.show();
    //         exemptCancelButton.hide();
    //     } else {
    //         exemptButton.hide();
    //         exemptCancelButton.hide();
    //     }
    //     // 显示备注输入栏
    //     if (exemptButton.is(':visible') || exemptCancelButton.is(':visible') && !collTextarea.is(':visible')) {
    //         collTextarea.show();
    //     }
    // } else {
    //     exemptButton.hide();
    //     exemptCancelButton.hide();
    // }
    //
    // // 标记二类飞行资质/取消二类飞行资质
    // var markQualificationsButton = collaboratorDom.find('#mark-qualifications').hide();
    // var markUnQualificationsButton = collaboratorDom.find('#mark-un-qualifications').hide();
    // if (!FmeToday.hadARR(flight.fmeToday)
    //     && !FmeToday.hadDEP(flight.fmeToday)
    //     && FmeToday.hadFPL(flight.fmeToday)){
    //     //flight中有有效值，显示取消按钮
    //     if ( $.isValidVariable(flight.qualifications) && flight.qualifications.substring(1,2) == '2' ){
    //         //如果有159标记二类权限则显示取消按钮
    //         if($.isValidVariable(this.colAuthority[159])){
    //             markUnQualificationsButton.show();
    //         }
    //     }else if($.isValidVariable(this.colAuthority[160])){
    //         //如果有160标记二类权限则显示标记按钮
    //         markQualificationsButton.show();
    //     }
    // }
    //
    // // 显示备注输入栏
    // if (markQualificationsButton.is(':visible') || markUnQualificationsButton.is(':visible') && !collTextarea.is(':visible')) {
    //     collTextarea.show();
    // }
    //
    //
    // //申请CTOT/批复CTOT---暂时屏蔽
    // //var applyCTOTButton = collaboratorDom.find('button#apply-ctot');
    // //var approveCTOTButton = collaboratorDom.find('button#approve-ctot');
    // //applyCTOTButton.hide();
    // //approveCTOTButton.hide();
    // //// 判断是否显示按钮
    // //for ( var id in flight.flowcontrols){
    // //    var fc = flight.flowcontrols[id];
    // //    var fctype = fc[1];
    // //    var fcstatus = fc[5];
    // //    //是开车申请 不是结束、停止、终止流控状态
    // //    if(  fctype == Flowcontrol.TYPE_REQ &&
    // //        (Flowcontrol.FLOWCONTROL_STATUS_STOP != fcstatus &&
    // //         Flowcontrol.FLOWCONTROL_STATUS_FINISHED != fcstatus &&
    // //         Flowcontrol.FLOWCONTROL_STATUS_TERMINATED != fcstatus) )
    // //    {
    // //        if( this.colEdit['APPLY_CTOT'] ){
    // //            applyCTOTButton.show();
    // //        }
    // //        if( this.colEdit['APPROVE_CTOT'] ){
    // //            approveCTOTButton.show();
    // //        }
    // //        break;
    // //    }
    // //}
    // //// 显示备注输入栏
    // //if ( (applyCTOTButton.is(':visible') || approveCTOTButton.is(':visible')) && !collTextarea.is(':visible') ) {
    // //    collTextarea.show();
    // //}
    //
    //
    // //  等待池
    // var directInPoolButton = collaboratorDom.find('button#direct-in-pool'); //移入等待池
    // var applyOutPoolButton = collaboratorDom.find('button#apply-out-pool'); //申请移出等待池
    // var approveOutPoolButton = collaboratorDom.find('button#approve-out-pool');//批复移出等待池
    // var refuseOutPoolButton = collaboratorDom.find('button#refuse-out-pool');//拒绝移出等待池
    // var directOutPoolButton = collaboratorDom.find('button#direct-out-pool');//移出等待池
    //
    // var directInPoolHasAuth = this.colEdit['DIRECT_IN_POOL'] && $.isValidVariable(this.colAuthority[131]); //移入等待池是否有权限
    // var applyOutPoolHasAuth = this.colEdit['APPLY_OUT_POOL'] && $.isValidVariable(this.colAuthority[132]); //申请移出等待池是否有权限
    // var approveOutPoolHasAuth = this.colEdit['APPROVE_OUT_POOL'] && $.isValidVariable(this.colAuthority[133]);//批复移出等待池是否有权限
    // var refuseOutPoolHasAuth = this.colEdit['REFUSE_OUT_POOL'] && $.isValidVariable(this.colAuthority[133]);//拒绝移出等待池是否有权限
    // var directOutPoolHasAuth = this.colEdit['DIRECT_OUT_POOL'] && $.isValidVariable(this.colAuthority[134]);//移出等待池是否有权限
    //
    // var calOutPoolFlag = false;
    //
    // var poolStatus = false;
    // if (!collaborateFlag || FmeToday.isCNLStatus(flight.fmeToday)
    //     || FmeToday.isPCancel(flight.fmeToday)
    //     || FmeToday.hadARR(flight.fmeToday)
    //     || FmeToday.hadDEP(flight.fmeToday)
    //     || !FmeToday.hadFPL(flight.fmeToday)) {
    //     poolStatus = true;
    // }
    //
    // if (!poolStatus && ( directInPoolHasAuth || applyOutPoolHasAuth || approveOutPoolHasAuth || refuseOutPoolHasAuth || directOutPoolHasAuth )) {
    //     // 等待池协调状态
    //     var inpoolRecordStatus = null;
    //     if ($.isValidVariable(records) && $.isValidVariable(records[FlightCoordinationRecord.TYPE_INPOOL])) {
    //         var inpoolRecord = records[FlightCoordinationRecord.TYPE_INPOOL];
    //         if ($.isValidVariable(inpoolRecord.status)) {
    //             inpoolRecordStatus = inpoolRecord.status;
    //         }
    //     }
    //     var tobt = FlightCoordination.getValidTobt(flight);
    //     var agct = '';
    //     if ($.isValidVariable(flight.closeTime)) {
    //         // 用户手工输入
    //         agct = flight.closeTime;
    //     } else if ($.isValidVariable(flight.fmeToday) && $.isValidVariable(flight.fmeToday.RCldtime)) {
    //         // FME ACARS 信息
    //         // 如果ACARS GC信息比当前时间晚10分钟，认为该ACARS数据信息错误
    //         var rcTime = $.addStringTime(flight.fmeToday.RCldtime, -10 * 60 * 1000);
    //         if (rcTime <= generateTime) {
    //             agct = flight.fmeToday.RCldtime;
    //         }
    //     }
    //     if (tobt >= generateTime) {
    //         calOutPoolFlag = true;
    //     }
    //     if (!FlightCoordination.isInPoolFlight(flight)) {
    //         applyOutPoolButton.hide();
    //         approveOutPoolButton.hide();
    //         refuseOutPoolButton.hide();
    //         directOutPoolButton.hide();
    //         if (directInPoolHasAuth) {
    //             directInPoolButton.show();
    //         } else {
    //             directInPoolButton.hide();
    //         }
    //     } else {
    //         directInPoolButton.hide();
    //         if (!$.isValidVariable(inpoolRecordStatus) || inpoolRecordStatus != FlightCoordinationRecord.STATUS_APPLY) {
    //             // 申请移出等待池
    //             if (applyOutPoolHasAuth) {
    //                 applyOutPoolButton.show();
    //             } else {
    //                 applyOutPoolButton.hide();
    //             }
    //             approveOutPoolButton.hide();
    //             refuseOutPoolButton.hide();
    //         } else if ($.isValidVariable(inpoolRecordStatus) && inpoolRecordStatus == FlightCoordinationRecord.STATUS_APPLY) {
    //             if (approveOutPoolHasAuth) {
    //                 approveOutPoolButton.show();
    //             } else {
    //                 approveOutPoolButton.hide();
    //             }
    //             if (refuseOutPoolHasAuth) {
    //                 refuseOutPoolButton.show();
    //             } else {
    //                 refuseOutPoolButton.hide();
    //             }
    //             applyOutPoolButton.hide();
    //         } else {
    //             approveOutPoolButton.hide();
    //             refuseOutPoolButton.hide();
    //             applyOutPoolButton.hide();
    //         }
    //
    //         if (directOutPoolHasAuth) {
    //             directOutPoolButton.show();
    //         } else {
    //             directOutPoolButton.hide();
    //         }
    //     }
    //     // 显示备注输入框
    //     if (directInPoolButton.is(':visible')
    //         || applyOutPoolButton.is(':visible')
    //         || approveOutPoolButton.is(':visible')
    //         || refuseOutPoolButton.is(':visible')
    //         || directOutPoolButton.is(':visible')) {
    //         collTextarea.show();
    //     }
    // } else {
    //     directInPoolButton.hide();
    //     applyOutPoolButton.hide();
    //     approveOutPoolButton.hide();
    //     refuseOutPoolButton.hide();
    //     directOutPoolButton.hide();
    // }
    //如果全部按钮都是隐藏，则该协调框隐藏不显示
    if( !collaboratorFlag ){
        collaboratorDom.hide();
        return;
    }
    // 定位协调DOM
    collaboratorDom.position({
        of: cellObj,
        my: 'left top',
        at: 'right top',
        collision: 'flipfit',
    });
    // 协调DOM位置跟随单元格
    thisProxy.followTargetPosition(collaboratorDom, cellObj);
    // 赋值表单元素
    form.find(':hidden[name="id"]').val(flight.id);
    // 操作
    openFlightDetailButton.click(function () {
        thisProxy.openFlightDetail(flight);
        thisProxy.clearCollaborateContainer();
    });
    // openFlightRecordButton.click(function () {
    //     thisProxy.openFlightRecord(flight);
    //     thisProxy.clearCollaborateContainer();
    // });
    // updateFormerFlightButton.click(function () {
    //     thisProxy.updateFormerFlight(flight);
    //     thisProxy.clearCollaborateContainer();
    // });
    // //参加时隙分配
    // markAssignSlotButton.one('click',function () {
    //     form.find(':hidden[name="assignSlotStatus"]').val(0);
    //     var btn = this;
    //     var opts = {
    //         action : thisProxy.colCollaborateUrl.MARK_ASSIGN_SLOT,
    //         params : form.serialize(),
    //         successCallback : function(data){
    //             thisProxy.afterCollaborate(data);
    //         },
    //         msgName : "加入时隙分配",
    //         rowid : rowid,
    //         iRow : iRow,
    //         iCol : iCol,
    //         btn : btn
    //     };
    //     thisProxy.sendCollaborateReq(opts);
    // });
    // //退出时隙分配
    // markUnAssignSlotButton.one('click',function () {
    //     form.find(':hidden[name="assignSlotStatus"]').val(3);
    //     var btn = this;
    //     var opts = {
    //         action : thisProxy.colCollaborateUrl.MARK_UN_ASSIGN_SLOT,
    //         params : form.serialize(),
    //         successCallback : function(data){
    //             var flight = data.flightCoordination;
    //             thisProxy.afterCollaborate(flight);
    //         },
    //         msgName : "退出时隙分配",
    //         rowid : rowid,
    //         iRow : iRow,
    //         iCol : iCol,
    //         btn : btn
    //     };
    //     thisProxy.sendCollaborateReq(opts);
    // });
    // //标记放行
    // markClearanceButton.one('click',function () {
    //     // 表单赋值
    //     form.find(':hidden[name="status"]').val(1);
    //     var btn = this;
    //     var opts = {
    //         action : thisProxy.colCollaborateUrl.MARK_CLEARANCE,
    //         params : form.serialize(),
    //         successCallback : function(data){
    //             var flight = data.flightCoordination;
    //             thisProxy.afterCollaborate(flight);
    //         },
    //         msgName : "标记放行",
    //         rowid : rowid,
    //         iRow : iRow,
    //         iCol : iCol,
    //         btn : btn
    //     };
    //     thisProxy.sendCollaborateReq(opts);
    // });
    // //标记未放行
    // markUnClearanceButton.one('click',function () {
    //     // 表单赋值
    //     form.find(':hidden[name="status"]').val(0);
    //     var btn = this;
    //     var opts = {
    //         action : thisProxy.colCollaborateUrl.MARK_UN_CLEARANCE,
    //         params : form.serialize(),
    //         successCallback : function(data){
    //             var flight = data.flightCoordination;
    //             thisProxy.afterCollaborate(flight);
    //         },
    //         msgName : "标记未放行",
    //         rowid : rowid,
    //         iRow : iRow,
    //         iCol : iCol,
    //         btn : btn
    //     };
    //     thisProxy.sendCollaborateReq(opts);
    // });
    // //标记取消
    // markCancelButton.one('click',function () {
    //     // 表单赋值
    //     form.find(':hidden[name="status"]').val(3);
    //     var btn = this;
    //     var opts = {
    //         action : thisProxy.colCollaborateUrl.MARK_CANCEL,
    //         params : form.serialize(),
    //         successCallback : function(data){
    //             thisProxy.afterCollaborate(data);
    //         },
    //         msgName : "标记取消",
    //         rowid : rowid,
    //         iRow : iRow,
    //         iCol : iCol,
    //         btn : btn
    //     };
    //     thisProxy.sendCollaborateReq(opts);
    // });
    // //标记恢复
    // markUnCancelButton.one('click',function () {
    //     // 表单赋值
    //     form.find(':hidden[name="status"]').val(0);
    //     var btn = this;
    //     var opts = {
    //         action : thisProxy.colCollaborateUrl.MARK_UN_CANCEL,
    //         params : form.serialize(),
    //         successCallback : function(data){
    //             thisProxy.afterCollaborate(data);
    //         },
    //         msgName : "标记恢复",
    //         rowid : rowid,
    //         iRow : iRow,
    //         iCol : iCol,
    //         btn : btn
    //     };
    //     thisProxy.sendCollaborateReq(opts);
    // });
    // //标记准备完毕
    // readyCompleteButton.one('click',function () {
    //     var btn = this;
    //     var opts = {
    //         action : thisProxy.colCollaborateUrl.READY_COMPLETE,
    //         params : form.serialize(),
    //         successCallback : function(data){
    //             var flight = data.flightCoordination;
    //             thisProxy.afterCollaborate(flight);
    //         },
    //         msgName : "标记准备完毕",
    //         rowid : rowid,
    //         iRow : iRow,
    //         iCol : iCol,
    //         btn : btn
    //     };
    //     thisProxy.sendCollaborateReq(opts);
    // });
    // //标记未准备完毕
    // readyUnCompleteButton.one('click',function () {
    //     var btn = this;
    //     var opts = {
    //         action : thisProxy.colCollaborateUrl.READY_UN_COMPLETE,
    //         params : form.serialize(),
    //         successCallback : function(data){
    //             var flight = data.flightCoordination;
    //             thisProxy.afterCollaborate(flight);
    //         },
    //         msgName : "标记未准备完毕",
    //         rowid : rowid,
    //         iRow : iRow,
    //         iCol : iCol,
    //         btn : btn
    //     };
    //     thisProxy.sendCollaborateReq(opts);
    // });
    //
    // // 豁免/豁免取消按钮点击事件
    // exemptButton.one('click',function () {
    //     var btn = this;
    //     var opts = {
    //         action : thisProxy.colCollaborateUrl.MARK_EXEMPT,
    //         params : form.serialize(),
    //         successCallback : function(data){
    //             var flight = data.flightCoordination;
    //             thisProxy.afterCollaborate(flight);
    //         },
    //         msgName : "标记豁免",
    //         rowid : rowid,
    //         iRow : iRow,
    //         iCol : iCol,
    //         btn : btn
    //     };
    //     thisProxy.sendCollaborateReq(opts);
    // });
    // exemptCancelButton.one('click',function () {
    //     var btn = this;
    //     var opts = {
    //         action : thisProxy.colCollaborateUrl.MARK_EXEMPT_CANCEL,
    //         params : form.serialize(),
    //         successCallback : function(data){
    //             var flight = data.flightCoordination;
    //             thisProxy.afterCollaborate(flight);
    //         },
    //         msgName : "豁免取消",
    //         rowid : rowid,
    //         iRow : iRow,
    //         iCol : iCol,
    //         btn : btn
    //     };
    //     thisProxy.sendCollaborateReq(opts);
    // });
    // //移入等待池
    // directInPoolButton.one('click',function () {
    //     form.find(':hidden[name="status"]').val(0);
    //     var _this = this;
    //     var opts = {
    //         action : thisProxy.colCollaborateUrl.DIRECT_IN_POOL,
    //         params : form.serialize(),
    //         successCallback : function(data){
    //             var flight = data.flightCoordination;
    //             thisProxy.afterCollaborate(flight);
    //         },
    //         msgName : "移入等待池",
    //         rowid : rowid,
    //         iRow : iRow,
    //         iCol : iCol,
    //         btn: _this,
    //     };
    //     thisProxy.sendCollaborateReq(opts);
    // });
    // //移出等待池申请
    // applyOutPoolButton.on('click',function () {
    //     var _this = this;
    //     if (!calOutPoolFlag) {
    //         var applyUrl = "flight_outpool_apply.action";
    //         var opts = {
    //             'rowid': rowid,
    //             'iRow': iRow,
    //             'iCol': iCol,
    //             'id': form.find('input[name="id"]').val(),
    //             'flight': flight
    //         };
    //         thisProxy.showOutPoolModal(applyUrl, opts);
    //     } else {
    //         // 赋值
    //         form.find(':hidden[name="status"]').attr('value', 1);
    //         var opts = {
    //             action : thisProxy.colCollaborateUrl.APPLY_OUT_POOL,
    //             params : form.serialize(),
    //             successCallback : function(data){
    //                 var flight = data.flightCoordination;
    //                 thisProxy.afterCollaborate(flight);
    //             },
    //             msgName : "移出等待池申请",
    //             rowid : rowid,
    //             iRow : iRow,
    //             iCol : iCol,
    //             btn: _this
    //         };
    //         thisProxy.sendCollaborateReq(opts);
    //     }
    // });
    // //
    // approveOutPoolButton.on('click',function () {
    //     var _this = this;
    //     if (!calOutPoolFlag) {
    //         var approveUrl = "flight_outpool_approve.action";
    //         var opts = {
    //             'rowid': rowid,
    //             'iRow': iRow,
    //             'iCol': iCol,
    //             'id': form.find('input[name="id"]').val(),
    //             'flight': flight,
    //             'btn' : _this
    //         };
    //         thisProxy.showOutPoolModal(approveUrl, opts);
    //     } else {
    //         // 赋值
    //         form.find(':hidden[name="status"]').attr('value', 2);
    //         var opts = {
    //             action : thisProxy.colCollaborateUrl.APPROVE_OUT_POOL,
    //             params : form.serialize(),
    //             successCallback : function(data){
    //                 var flight = data.flightCoordination;
    //                 thisProxy.afterCollaborate(flight);
    //             },
    //             msgName : "移出等待池批复",
    //             rowid : rowid,
    //             iRow : iRow,
    //             iCol : iCol,
    //             btn : _this
    //         };
    //         thisProxy.sendCollaborateReq(opts);
    //     }
    //
    // });
    // //移出等待池拒绝
    // refuseOutPoolButton.one('click',function () {
    //     if (!calOutPoolFlag) {
    //         dhtmlx.alert({
    //             title: "确认",
    //             ok: "确定",
    //             text: '需要移出等待池,请先修改预关时间<br>并保证预关时间不早于当前时间<br>若有实关时间,关门后不超过 90 分钟'
    //         });
    //         return;
    //     }
    //     form.find(':hidden[name="status"]').attr('value', 2);
    //     var btn = this;
    //     var opts = {
    //         action : thisProxy.colCollaborateUrl.REFUSE_OUT_POOL,
    //         params : form.serialize(),
    //         successCallback : function(data){
    //             var flight = data.flightCoordination;
    //             thisProxy.afterCollaborate(flight);
    //         },
    //         msgName : "移出等待池拒绝",
    //         rowid : rowid,
    //         iRow : iRow,
    //         iCol : iCol,
    //         btn : btn
    //     };
    //     thisProxy.sendCollaborateReq(opts);
    // });
    // //
    // directOutPoolButton.one('click',function () {
    //     var btn = this;
    //     if (!calOutPoolFlag) {
    //         var directUrl = thisProxy.colCollaborateUrl.DIRECT_OUT_POOL;
    //         var opts = {
    //             'rowid': rowid,
    //             'iRow': iRow,
    //             'iCol': iCol,
    //             'id': form.find('input[name="id"]').val(),
    //             'flight': flight
    //         };
    //         thisProxy.showOutPoolModal(directUrl, opts);
    //     } else {
    //         form.find(':hidden[name="status"]').attr('value', 2);
    //         var opts = {
    //             action : thisProxy.colCollaborateUrl.DIRECT_OUT_POOL,
    //             params : form.serialize(),
    //             successCallback : function(data){
    //                 var flight = data.flightCoordination;
    //                 thisProxy.afterCollaborate(flight);
    //             },
    //             msgName : "移出等待池",
    //             rowid : rowid,
    //             iRow : iRow,
    //             iCol : iCol,
    //             btn: btn
    //         };
    //         thisProxy.sendCollaborateReq(opts);
    //     }
    // });
    // //标记为二类飞行资质按钮 点击事件
    // markQualificationsButton.on('click', function(){
    //     markQualificationsButton.hide();
    //     // 赋值表单元素
    //     form.find(':hidden[name="id"]').val(flight.id);
    //     form.find(':hidden[name="qualifications"]').val("2");
    //     var btn = this;
    //     var opts = {
    //         action : thisProxy.colCollaborateUrl.MARK_QUALIFICATION,
    //         params : form.serialize(),
    //         successCallback : function(data){
    //             var flight = data.flightCoordination;
    //             thisProxy.afterCollaborate(flight);
    //         },
    //         msgName : "标记二类飞行资质",
    //         rowid : rowid,
    //         iRow : iRow,
    //         iCol : iCol,
    //         btn : btn
    //     };
    //     thisProxy.sendCollaborateReq(opts);
    // });
    // //取消为二类飞行资质按钮 点击事件
    // markUnQualificationsButton.on('click', function(){
    //     markUnQualificationsButton.hide();
    //     // 赋值表单元素
    //     form.find(':hidden[name="id"]').val(flight.id);
    //     form.find(':hidden[name="qualifications"]').val("");
    //     var btn = this;
    //     var opts = {
    //         action : thisProxy.colCollaborateUrl.MARK_QUALIFICATION,
    //         params : form.serialize(),
    //         successCallback : function(data){
    //             var flight = data.flightCoordination;
    //             thisProxy.afterCollaborate(flight);
    //         },
    //         msgName : "取消二类飞行资质",
    //         rowid : rowid,
    //         iRow : iRow,
    //         iCol : iCol,
    //         btn : btn
    //     };
    //     thisProxy.sendCollaborateReq(opts);
    // });

    //申请CTOT点击事件--暂时屏蔽
    //applyCTOTButton.one('click',function(){
    //    var btn = this;
    //    var opts = {
    //        action : thisProxy.colCollaborateUrl.APPLY_CTOT,
    //        params : form.serialize(),
    //        successCallback : function(data){
    //            var flight = data.flightCoordination;
    //            thisProxy.afterCollaborate(flight);
    //        },
    //        msgName : "申请CTOT",
    //        rowid : rowid,
    //        iRow : iRow,
    //        iCol : iCol,
    //        btn: btn
    //    };
    //    thisProxy.sendCollaborateReq(opts);
    //});
    //批复CTOT点击事件--暂时屏蔽
    //approveCTOTButton.one('click',function(){
    //    thisProxy.clearCollaborateContainer();
    //    cellObj.addClass(FlightGridTable.SELECTED_CELL_CLASS);
    //    thisProxy.collaborateCtot(rowid, iRow, iCol, cellObj, thisProxy.colCollaborateUrl.APPROVE_CTOT);
    //});

};

/**
 * PRIORITY协调
 * @param rowid 行id
 * @param iRow 行索引
 * @param iCol 列索引
 * @param cellObj 单元格对象
 */
FlightGridTable.prototype.collaboratePriority = function (rowid, iRow, iCol, cellObj) {
    // 代理
    var thisProxy = this;
    // 获取行数据
    var rowData = this.tableDataMap[rowid];
    // 获取航班数据
    var flight = this.data.result[rowid];
    var fmeToday = flight.fmeToday;
    var records = flight.coordinationRecords;
    var opts = {
        rowid : rowid,
        iRow : iRow,
        iCol : iCol
    };

    // 已锁定/预锁定航班不可修改  禁止用显示样式判断数据状态
    if (rowData.COBT_style == FlightGridTableDataUtil.getDisplayStyle('COBT')
        || rowData.COBT_style == FlightGridTableDataUtil.getDisplayStyle('COBT_LOCK')) {
        thisProxy.showTableCellTipMessage(opts, 'WARN', '航班已锁定或预锁定');
        return;
    }
    // 获取priority
    var priority = null;
    if ($.isValidVariable(flight.cpriority) && flight.cpriority > FlightCoordination.PRIORITY_NORMAL) {
        priority = flight.cpriority;
    } else if ($.isValidVariable(flight.priority)) {
        priority = flight.priority;
    }
    // 获取record有关数据
    var record = null;
    var recordStatus = null;
    var recordValue = null;
    var recordComment = null;
    if ($.isValidVariable(records)
        && $.isValidVariable(records[FlightCoordinationRecord.TYPE_PRIORITY])) {
        record = records[FlightCoordinationRecord.TYPE_PRIORITY];
        recordStatus = record.status;
        recordValue = record.value;
        recordComment = record.comment;
    }
    // 根据航班记录类型确定协调DOM
    //申请
    if ((this.colEdit['APPLY_PRIORITY'] || this.colEdit['CANCEL_PRIORITY'])
        && ($.isValidVariable(this.colAuthority[201]))
        && (!$.isValidVariable(recordStatus) || recordStatus != FlightCoordinationRecord.STATUS_APPLY)) {
        // 获取协调DOM元素
        var collaboratorDom = $(FlightGridTableCollaborateDom.APPLY_PRIORITY);
        //协调记录显示
        thisProxy.showCollaborator(collaboratorDom, cellObj);
        // 按钮权限
        var applyButton = collaboratorDom.find('button#apply');
        var cancelButton = collaboratorDom.find('button#cancel');
        if (this.colEdit['APPLY_PRIORITY']) {
            applyButton.show();
        } else {
            applyButton.hide();
        }
        if (this.colEdit['CANCEL_PRIORITY']) {
            cancelButton.show();
        } else {
            cancelButton.hide();
        }
        // 验证
        var form = collaboratorDom.find('form');
        form.find(':hidden[name="id"]').val(flight.id);
        // 不存在时，默认为'普通'
        if (!$.isValidVariable(priority)) {
            priority = FlightCoordination.PRIORITY_NORMAL;
        }
        form.find(':radio[name="priority"][value="' + priority + '"]').attr('checked', 'checked');
        //
        if (form.find(':radio[name="priority"]:checked').size() <= 0) {
            form.find(':radio[name="priority"][value="' + FlightCoordination.PRIORITY_NORMAL + '"]').attr('checked', 'checked');
        }
        var validatePriorityElement = function () {
            if (form.find(':radio[name="priority"]:checked').size() < 1) {
                // 验证不通过，显示红色bootstrap信息，并提示错误原因
                // 添加提示信息
                thisProxy.showTableCellTipMessage($('#priority'), 'FAIL', '请选择优先级');
                return false;
            } else {
                $('#priority').qtip('destroy', true);
                return true;
            }
        };
        $('input[name="priority"]').bind('change', validatePriorityElement);
        // 操作
        // 绑定apply事件
        form.find(':button#apply').click(function () {
            if (!validatePriorityElement()) {
                return false;
            }
            //初始化按钮loading
            var loading = Ladda.create(this);
            //启动按钮loading
            loading.start();
            cancelButton.prop("disabled",true);

            $.ajax({
                url: thisProxy.colCollaborateUrl.APPLY_PRIORITY,
                data: form.serialize(),
                type: 'POST',
                dataType: 'json',
                success: function (data, status, xhr) {
                    //停止按钮loading
                    loading.stop();
                    cancelButton.prop("disabled",false);
                    try {
                        //清理协调窗口
                        thisProxy.clearCollaborateContainer();
                        // 判断是否有返回结果
                        if ($.isValidVariable(data)) {
                            // 有返回结果，判断是否出错
                            if ($.isValidVariable(data.error)) {
                                // 错误
                                thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                            } else {
                                // 正常
                                var flight = data.flightCoordination;
                                thisProxy.afterCollaborate(flight);
                                thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '航班任务申请已提交');
                            }
                        } else {
                            // 无返回结果，未知异常情况
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班任务申请失败, 稍后请重新尝试');
                        }
                    } catch (e) {
                        console.error('apply priority failed');
                        console.error(e.stack);
                    }
                },
                error: function (xhr, status, error) {
                    //停止按钮loading
                    loading.stop();
                    cancelButton.prop("disabled",false);
                    console.error('apply priority  fail, error:');
                    console.error(error);
                }
            });
        });
        // 绑定cancel事件
        cancelButton.click(function () {
            // 清除协调记录
            thisProxy.clearCollaborateContainer();
        });
        // 给右上角关闭按钮绑定事件
        $(".flight-grid-table-collaborate-container .modal-close-btn").on("click", function () {
            thisProxy.closeCurrentModal(form);
        });

    }
    // 批复
    if ((this.colEdit['APPROVE_PRIORITY'] || this.colEdit['REFUSE_PRIORITY'])
        && ($.isValidVariable(this.colAuthority[202]))
        && recordStatus == FlightCoordinationRecord.STATUS_APPLY) {
        // 获取协调DOM元素
        var collaboratorDom = $(FlightGridTableCollaborateDom.APPROVE_PRIORITY);
        //协调记录显示
        thisProxy.showCollaborator(collaboratorDom, cellObj);
        $("#apply-comment").removeAttr("name").attr("readonly", "readonly");

        // 按钮权限
        var approveButton = collaboratorDom.find('button#approve');
        var refuseButton = collaboratorDom.find('button#refuse');
        // 判断操作
        if (this.colEdit['APPROVE_PRIORITY']) {
            approveButton.show();
        } else {
            approveButton.hide();
        }
        if (this.colEdit['REFUSE_PRIORITY']) {
            refuseButton.show();
        } else {
            refuseButton.hide();
        }
        //若单元格的值为空，则不显示清除按钮
        var cellText = cellObj.html();
        if("" == cellText || "&nbsp;" == cellText){
            refuseButton.hide();
        }

        // 表单赋值
        var form = collaboratorDom.find('form');
        form.find(':hidden[name="id"]').val(flight.id);
        form.find(':hidden[name="priority"]').val(recordValue);
        if (!$.isValidVariable(priority)) {
            priority = FlightCoordination.PRIORITY_NORMAL;
        }
        form.find('#original-value').val(FlightCoordination.getPriorityZh(priority)).attr('title', FlightCoordination.getPriorityZh(priority));
        form.find('#apply-value').val(FlightCoordination.getPriorityZh(recordValue)).attr('title', FlightCoordination.getPriorityZh(recordValue));
        form.find('textarea#apply-comment').val(recordComment).attr('title', recordComment);
        form.find(':button#approve').click(function () {
            //初始化按钮loading
            var loading = Ladda.create(this);
            //启动按钮loading
            loading.start();
            refuseButton.prop("disabled",true);
            // 提交表单
            $.ajax({
                url: thisProxy.colCollaborateUrl.APPROVE_PRIORITY,
                data: form.serialize(),
                type: 'POST',
                dataType: 'json',
                success: function (data, status, xhr) {
                    //停止按钮loading
                    loading.stop();
                    refuseButton.prop("disabled",false);
                    try {
                        //清理协调窗口
                        thisProxy.clearCollaborateContainer();
                        // 判断是否有返回结果
                        if ($.isValidVariable(data)) {
                            // 有返回结果，判断是否出错
                            if ($.isValidVariable(data.error)) {
                                // 错误
                                thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                            } else {
                                // 正常
                                var flight = data.flightCoordination;
                                thisProxy.afterCollaborate(flight);
                                thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '航班任务批准已提交');
                            }
                        } else {
                            // 无返回结果，未知异常情况
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班任务批准失败, 稍后请重新尝试');
                        }
                    } catch (e) {
                        console.error('approve priority failed');
                        console.error(e.stack);
                    }
                },
                error: function (xhr, status, error) {
                    //停止按钮loading
                    loading.stop();
                    refuseButton.prop("disabled",false);
                    console.error('approve priority  fail, error:');
                    console.error(error);
                }
            });
        });
        form.find(':button#refuse').click(function () {
            //初始化按钮loading
            var loading = Ladda.create(this);
            //启动按钮loading
            loading.start();
            approveButton.prop("disabled",true);
            // 提交表单
            $.ajax({
                url: thisProxy.colCollaborateUrl.REFUSE_PRIORITY,
                data: form.serialize(),
                type: 'POST',
                dataType: 'json',
                success: function (data) {
                    //停止按钮loading
                    loading.stop();
                    approveButton.prop("disabled",false);
                    try {
                        //清理协调窗口
                        thisProxy.clearCollaborateContainer();
                        // 判断是否有返回结果
                        if ($.isValidVariable(data)) {
                            // 有返回结果，判断是否出错
                            if ($.isValidVariable(data.error)) {
                                // 错误
                                thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                            } else {
                                // 正常
                                var flight = data.flightCoordination;
                                thisProxy.afterCollaborate(flight);
                                thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '航班任务拒绝已提交');
                            }
                        } else {
                            // 无返回结果，未知异常情况
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班任务拒绝失败, 稍后请重新尝试');
                        }
                    } catch (e) {
                        console.error('refuse priority failed');
                        console.error(e.stack);
                    }
                },
                error: function (xhr, status, error) {
                    //停止按钮loading
                    loading.stop();
                    approveButton.prop("disabled",false);
                    console.error('refuse priority  fail, error:');
                    console.error(error);
                }
            });
        });
        // 给右上角关闭按钮绑定事件
        $(".flight-grid-table-collaborate-container .modal-close-btn").on("click", function () {
            thisProxy.closeCurrentModal(form);
        });
    }
};

/**
 * TOBT协调
 * @param rowid
 *            行id
 * @param iRow
 *            行索引
 * @param iCol
 *            列索引
 * @param cellObj
 *            单元格对象
 */
FlightGridTable.prototype.collaborateTobt = function (rowid, iRow, iCol, cellObj) {
    // 代理
    var thisProxy = this;
    var opts = {
        rowid : rowid,
        iRow : iRow,
        iCol : iCol
    };
    // 获取行数据
    var rowData = this.tableDataMap[rowid];
    // 获取航班数据
    var flight = this.data.result[rowid];
    var fmeToday = flight.fmeToday;
    var records = flight.coordinationRecords;
    // 获取当前时间
    var generateTime = this.data.generateTime;

    // eobt为空时预关协调判断
    var hasEditApproveTobt = true;
    // 锁定提示信息判断
    var hasCtdOrCobtValue = true;
    // eobt为空时预关协调
    if (!FmeToday.hadFPL(flight.fmeToday)) {
        hasEditApproveTobt = false;
    } else {
        // 已锁定,提示
        if ($.isValidVariable(flight.ctd)
            || $.isValidVariable(flight.cobt)) {
            hasCtdOrCobtValue = false;
        }
    }

    //tobt
    var tobt = rowData.TOBT;

    // 获取record有关数据
    var record = null;
    var recordStatus = null;
    var recordValue = null;
    var recordComment = null;
    if ($.isValidVariable(records)
        && $.isValidVariable(records[FlightCoordinationRecord.TYPE_TOBT])) {
        record = records[FlightCoordinationRecord.TYPE_TOBT];
        recordStatus = record.status;
        recordValue = record.value;
        recordComment = record.comment;
    }

    //将原有cobt时间范围严格校验改为建议性提示
    //thisProxy.showTableCellTipMessage(opts, 'WARN', '建议输入时间晚于报文时间-60分钟');
    var addCollaboratorDom = function () {
        // 根据TOBT状态确定协调DOM
        var collaboratorDom = $(FlightGridTableCollaborateDom.APPLY_TOBT);
        //协调记录显示
        thisProxy.showCollaborator(collaboratorDom, cellObj);
        // 添加组件
        collaboratorDom.find(':text[name="date"]').datepicker({
            showButtonPanel: true,
            closeText: '关闭',
            currentText: '今天',
            minDate: 0,
            maxDate: 1,
            dateFormat: 'yymmdd',
            showAnim: 'toggle'
        });
        // 获取按钮
        var applyButton = collaboratorDom.find('button#apply');
        var cancelButton = collaboratorDom.find('button#cancel');
        // 判断操作
        if (thisProxy.colEdit['APPLY_TOBT']) {
            applyButton.show();
        } else {
            applyButton.hide();
        }
        if (thisProxy.colEdit['CANCEL_TOBT']) {
            cancelButton.show();
        } else {
            cancelButton.hide();
        }
        // 验证
        // form表单
        var form = collaboratorDom.find('form');
        // 航班号
        var flightidElement = form.find('#flightid');
        flightidElement.val(rowData.FLIGHTID);
        // 机场
        var airportElement = form.find('#airport');
        airportElement.val(rowData.DEPAP + '-' + rowData.ARRAP);
        // 日期
        var dateElement = form.find('#update-date');
        // 时间
        var timeElement = form.find('#update-time');
        // 赋值表单的数据
        form.find(':hidden[name="id"]').val(flight.id);
        if ($.isValidVariable(tobt)) {
            dateElement.val(tobt.substring(0, 8));
            timeElement.val(tobt.substring(8, 12));
        } else {
            dateElement.val(generateTime.substring(0, 8));
            timeElement.val(generateTime.substring(8, 12));
        }
        form.bootstrapValidator({
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                time: {
                    validators: {
                        notEmpty: {},
                        timeFormat: {},
                        compareCurrentTime: {
                            inputVal: dateElement,
                            curVal: generateTime
                        },
                        comparePDeptime: {
                            firstVal: dateElement,
                            pdeptime: fmeToday.PDeptime

                        }
                    }
                },
                date: {
                    validators: {
                        notEmpty: {}
                    }
                }
            }
        }).on('success.form.bv', function (e) {
            e.preventDefault();
            // 清除qtip信息
            timeElement.qtip('destroy', true);
            //初始化按钮loading
            var loading = Ladda.create(applyButton[0]);
            //启动按钮loading
            loading.start();
            cancelButton.prop("disabled",true);
            //清理协调窗口
            //thisProxy.clearCollaborateContainer();
            // 验证通过，提交表单
            $.ajax({
                url: thisProxy.colCollaborateUrl.APPLY_TOBT,
                data: form.serialize(),
                type: 'POST',
                dataType: 'json',
                success: function (data, status, xhr) {
                    //停止按钮loading
                    loading.stop();
                    cancelButton.prop("disabled",false);
                    try {
                        // 判断是否有返回结果
                        if ($.isValidVariable(data)) {
                            // 有返回结果，判断是否出错
                            if ($.isValidVariable(data.error)) {
                                // 错误
                                thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                            } else {
                                // 正常
                                var flight = data.flightCoordination;
                                thisProxy.afterCollaborate(flight);
                                thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '航班预关时间申请已提交');
                            }
                        } else {
                            // 无返回结果，未知异常情况
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班预关时间申请失败, 稍后请重新尝试');
                        }
                    } catch (e) {
                        console.error('apply tobt failed');
                        console.error(e.stack);
                    }

                },
                error: function (xhr, status, error) {
                    //停止按钮loading
                    loading.stop();
                    cancelButton.prop("disabled",false);
                    thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班预关时间申请失败，请稍后重新尝试');
                }
            });
        });

        // 给cancel绑定事件
        form.find(':button#cancel').click(function () {
            thisProxy.closeCurrentModal(form);
        });
        // 给右上角关闭按钮绑定事件
        $(".flight-grid-table-collaborate-container .modal-close-btn").on("click", function () {
            thisProxy.closeCurrentModal(form);
        });
    };

    if (!hasEditApproveTobt) {
        if (this.colEdit['APPLY_TOBT'] || this.colEdit['CANCEL_TOBT']) {
            addCollaboratorDom();
        }
    } else {
        // 判断用户和页面权限
        // 申请
        if ((this.colEdit['APPLY_TOBT'] || this.colEdit['CANCEL_TOBT'])
            && $.isValidVariable(this.colAuthority[101])
            && ((!$.isValidVariable(recordStatus)
            || recordStatus != FlightCoordinationRecord.STATUS_APPLY))) {
            if (!hasCtdOrCobtValue) {
                this.showTableCellTipMessage(opts, 'WARN', '调整TOBT,会清空COBT/CTD,造成航班向后移动');
            }
            // 根据协调状态判断权限
            // 根据TOBT状态确定协调DOM
            addCollaboratorDom();
        }
        // 批复
        if ((this.colEdit['APPROVE_TOBT'] || this.colEdit['REFUSE_TOBT'])
            && $.isValidVariable(this.colAuthority[102])
            && recordStatus == FlightCoordinationRecord.STATUS_APPLY && hasEditApproveTobt) {
            if (!hasCtdOrCobtValue) {
                this.showTableCellTipMessage(opts, 'WARN', '调整TOBT,会清空COBT/CTD,造成航班向后移动');
            }
            // 根据TOBT状态确定协调DOM
            var collaboratorDom = $(FlightGridTableCollaborateDom.APPROVE_TOBT);
            //协调记录显示
            thisProxy.showCollaborator(collaboratorDom, cellObj);
            $("#apply-comment").removeAttr("name").attr("readonly", "readonly");

            // 添加组件
            collaboratorDom.find(':text[name="date"]').datepicker({
                showButtonPanel: true,
                closeText: '关闭',
                currentText: '今天',
                minDate: 0,
                maxDate: 1,
                dateFormat: 'yymmdd',
                showAnim: 'toggle'
            });

            // TODO 赋值

            // 获取按钮
            var approveButton = collaboratorDom.find('button#approve');
            var refuseButton = collaboratorDom.find('button#refuse');
            // 判断操作
            if (this.colEdit['APPROVE_TOBT']) {
                approveButton.show();
            } else {
                approveButton.hide();
            }

            if (this.colEdit['REFUSE_TOBT']) {
                refuseButton.show();
            } else {
                refuseButton.hide();
            }
            //若单元格的值为空，则不显示清除按钮
            var cellText = cellObj.html();
            if("" == cellText || "&nbsp;" == cellText){
                refuseButton.hide();
            }

            // 验证
            // form表单
            var form = collaboratorDom.find('form');
            // 航班号
            var flightidElement = form.find('#flightid');
            flightidElement.val(rowData.FLIGHTID);
            // 机场
            var airportElement = form.find('#airport');
            airportElement.val(rowData.DEPAP + '-' + rowData.ARRAP);
            // 日期
            var dateElement = form.find('#update-date');
            // 时间
            var timeElement = form.find('#update-time');
            // 赋值表单
            form.find(':hidden[name="id"]').val(flight.id);
            dateElement.val(recordValue.substring(0, 8));
            timeElement.val(recordValue.substring(8, 12));
            // 插入动态显示值
            form.find('#original-value').val(tobt.substring(8, 12)).attr('title', tobt);
            form.find('#apply-value').val(recordValue.substring(8, 12)).attr('title', recordValue);
            form.find('textarea#apply-comment').text(recordComment).attr('title', recordComment);
            form.bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    time: {
                        validators: {
                            notEmpty: {},
                            timeFormat: {}
                        }
                    },
                    date: {
                        validators: {
                            notEmpty: {}
                        }
                    }
                }
            })
                .on('success.form.bv', function (e) {
                    e.preventDefault();
                    // 清除qtip信息
                    timeElement.qtip('destroy', true);
                    //初始化按钮loading
                    var loading = Ladda.create(approveButton[0]);

                    //启动按钮loading
                    loading.start();
                    refuseButton.prop("disabled",true);
                    //清理协调窗口
                    //thisProxy.clearCollaborateContainer();
                    $.ajax({
                        url: thisProxy.colCollaborateUrl.APPROVE_TOBT,
                        data: form.serialize(),
                        type: 'POST',
                        dataType: 'json',
                        success: function (data, status, xhr) {
                            //停止按钮loading
                            loading.stop();
                            refuseButton.prop("disabled",false);
                            try {
                                // 判断是否有返回结果
                                if ($.isValidVariable(data)) {
                                    // 有返回结果，判断是否出错
                                    if ($.isValidVariable(data.error)) {
                                        // 错误
                                        thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                                    } else {
                                        // 正常
                                        var flight = data.flightCoordination;
                                        thisProxy.afterCollaborate(flight);
                                        thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '航班预关时间批复已提交');
                                    }
                                } else {
                                    // 无返回结果，未知异常情况
                                    thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班预关时间批复失败, 稍后请重新尝试');
                                }
                            } catch (e) {
                                console.error('approve tobt failed');
                                console.error(e.stack);
                            }
                        },
                        error: function (xhr, status, error) {
                            //停止按钮loading
                            loading.stop();
                            refuseButton.prop("disabled",false);
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班预关时间批复失败，请稍后重新尝试');
                        }
                    });
                });
            // 操作
            // 绑定refuse事件
            form.find(':button#refuse').click(function () {
                // 清除数据
                dateElement.val('');
                timeElement.val('');
                // 清除样式
                form.bootstrapValidator("resetForm");
                // 清除提示信息
                dateElement.qtip('destroy', true);
                timeElement.qtip('destroy', true);
                //初始化按钮loading
                var loading = Ladda.create(this);
                //启动按钮loading
                loading.start();
                approveButton.prop("disabled",true);
                $.ajax({
                    url: thisProxy.colCollaborateUrl.REFUSE_TOBT,
                    data: form.serialize(),
                    type: 'POST',
                    dataType: 'json',
                    success: function (data, status, xhr) {
                        //停止按钮loading
                        loading.stop();
                        approveButton.prop("disabled",false);
                        try {
                            //清理协调窗口
                            thisProxy.clearCollaborateContainer();
                            // 判断是否有返回结果
                            if ($.isValidVariable(data)) {
                                // 有返回结果，判断是否出错
                                if ($.isValidVariable(data.error)) {
                                    // 错误
                                    thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                                } else {
                                    // 正常
                                    var flight = data.flightCoordination;
                                    thisProxy.afterCollaborate(flight);
                                    thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '航班预关时间拒绝已提交');
                                }
                            } else {
                                // 无返回结果，未知异常情况
                                thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班预关时间拒绝失败, 稍后请重新尝试');
                            }
                        } catch (e) {
                            console.error('refuse tobt failed');
                            console.error(e.stack);
                        }
                    },
                    error: function (xhr, status, error) {
                        //停止按钮loading
                        loading.stop();
                        approveButton.prop("disabled",false);
                        thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班预关时间拒绝失败，请稍后重新尝试');
                    }
                });
            });
            // 给右上角关闭按钮绑定事件
            $(".flight-grid-table-collaborate-container .modal-close-btn").on("click", function () {
                thisProxy.closeCurrentModal(form);
            });
        }
    }
};

/**
 * HOBT协调
 * @param rowid 行id
 * @param iRow 行索引
 * @param iCol 列索引
 * @param cellObj 单元格对象
 */
FlightGridTable.prototype.collaborateHobt = function (rowid, iRow, iCol, cellObj) {
    // 代理
    var thisProxy = this;
    var opts = {
        rowid : rowid,
        iRow : iRow,
        iCol : iCol
    };
    // 获取行数据
    var rowData = this.tableDataMap[rowid];
    // 获取航班数据
    var flight = this.data.result[rowid];
    var records = flight.coordinationRecords;
    var hobt = rowData.HOBT;
    // 获取当前时间
    var generateTime = this.data.generateTime;
    if (!$.isValidVariable(rowData.HOBT)) {
        return;
    }
    //
    if (FlightCoordination.isInPoolFlight(flight)) {
        this.showTableCellTipMessage(opts, 'WARN', '航班已经进入等待池');
        return;
    }

    // 获取record有关数据
    var record;
    var recordStatus;
    var recordValue;
    var recordComment;
    if ($.isValidVariable(records) && $.isValidVariable(records[FlightCoordinationRecord.TYPE_HOBT])) {
        record = records[FlightCoordinationRecord.TYPE_HOBT];
        recordStatus = record.status;
        recordValue = record.value;
        recordComment = record.comment;
    }

    // 权限
    // 申请
    if ((this.colEdit['APPLY_HOBT'] || this.colEdit['CANCEL_HOBT'])
        && $.isValidVariable(this.colAuthority[111])
        && (!$.isValidVariable(recordStatus)
        || recordStatus != FlightCoordinationRecord.STATUS_APPLY)) {
        // 获取协调DOM元素
        var collaboratorDom = $(FlightGridTableCollaborateDom.APPLY_HOBT);
        //协调记录显示
        thisProxy.showCollaborator(collaboratorDom, cellObj);
        // 添加组件
        collaboratorDom.find(':text[name="date"]').datepicker({
            showButtonPanel: true,
            closeText: '关闭',
            currentText: '今天',
            minDate: 0,
            maxDate: 1,
            dateFormat: 'yymmdd',
            showAnim: 'toggle',
            onSelect: function(){
                //清除错误提示
                //form.find('#update-time').val("");
                form.data('bootstrapValidator').resetForm();
            }
        });
        // 按钮权限
        var applyButton = collaboratorDom.find('button#apply');
        var cancelButton = collaboratorDom.find('button#cancel');
        if (this.colEdit['APPLY_HOBT']) {
            applyButton.show();
        } else {
            applyButton.hide();
        }
        if (this.colEdit['CANCEL_HOBT']) {
            cancelButton.show();
        } else {
            cancelButton.hide();
        }
        // form表单
        var form = collaboratorDom.find('form');
        // 航班号
        var flightidElement = form.find('#flightid');
        flightidElement.val(rowData.FLIGHTID);
        // 机场
        var airportElement = form.find('#airport');
        airportElement.val(rowData.DEPAP + '-' + rowData.ARRAP);
        // 日期
        var dateElement = form.find('#update-date');
        // 时间
        var timeElement = form.find('#update-time');
        // 赋值表单的数据
        form.find(':hidden[name="id"]').val(flight.id);
        dateElement.val(hobt.substring(0, 8));
        timeElement.val(hobt.substring(8, 12));
        form.bootstrapValidator({
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                time: {
                    validators: {
                        notEmpty: {},
                        timeFormat: {}
                    }
                },
                date: {
                    validators: {
                        notEmpty: {}
                    }
                }
            }
        }).on('success.form.bv', function (e) {
            e.preventDefault();
            // 清除qtip信息
            timeElement.qtip('destroy', true);
            //清理协调窗口
            //thisProxy.clearCollaborateContainer();

            //初始化按钮loading
            var loading = Ladda.create(applyButton[0]);
            //启动按钮loading
            loading.start();
            cancelButton.prop("disabled",true);
            // 验证通过，提交表单
            $.ajax({
                url: thisProxy.colCollaborateUrl.APPLY_HOBT,
                data: form.serialize(),
                type: 'POST',
                dataType: 'json',
                success: function (data, status, xhr) {
                    //停止按钮loading
                    loading.stop();
                    cancelButton.prop("disabled",false);
                    try {
                        // 判断是否有返回结果
                        if ($.isValidVariable(data)) {
                            // 有返回结果，判断是否出错
                            if ($.isValidVariable(data.error)) {
                                // 错误
                                thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                            } else {
                                // 正常
                                var flight = data.flightCoordination;
                                thisProxy.afterCollaborate(flight);
                                thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '航班协关时间申请已提交');
                            }
                        } else {
                            // 无返回结果，未知异常情况
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班协关时间申请失败, 稍后请重新尝试');
                        }
                    }
                    catch (e) {
                        console.error('apply hobt failed');
                        console.error(e.stack);
                    }
                },
                error: function (xhr, status, error) {
                    //停止按钮loading
                    loading.stop();
                    cancelButton.prop("disabled",false);
                    thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班协关时间申请失败，请稍后重新尝试');
                }
            });
        });

        // 绑定cancel事件
        form.find(':button#cancel').click(function () {
            thisProxy.closeCurrentModal(form);
        });
    }

    // 批复
    if ((this.colEdit['APPROVE_HOBT'] || this.colEdit['REFUSE_HOBT'])
        && $.isValidVariable(this.colAuthority[112])
        && recordStatus == FlightCoordinationRecord.STATUS_APPLY) {

        // 获取协调DOM元素
        var collaboratorDom = $(FlightGridTableCollaborateDom.APPROVE_HOBT);
        //协调记录显示
        thisProxy.showCollaborator(collaboratorDom, cellObj);
        $("#apply-comment").removeAttr("name").attr("readonly", "readonly");
        // 添加组件
        collaboratorDom.find(':text[name="date"]').datepicker({
            showButtonPanel: true,
            closeText: '关闭',
            currentText: '今天',
            minDate: 0,
            maxDate: 1,
            dateFormat: 'yymmdd',
            showAnim: 'toggle',
            onSelect: function(){
                //清除错误提示
                //form.find('#update-time').val("");
                form.data('bootstrapValidator').resetForm();
            }
        });
        // 按钮权限
        var approveButton = collaboratorDom.find('button#approve');
        var refuseButton = collaboratorDom.find('button#refuse');
        if (this.colEdit['APPROVE_HOBT']) {
            approveButton.show();
        } else {
            approveButton.hide();
        }
        if (this.colEdit['REFUSE_HOBT']) {
            refuseButton.show();
        } else {
            refuseButton.hide();
        }
        //若单元格的值为空，则不显示清除按钮
        var cellText = cellObj.html();
        if("" == cellText || "&nbsp;" == cellText){
            refuseButton.hide();
        }

        // 验证
        // form表单
        var form = collaboratorDom.find('form');
        // 航班号
        var flightidElement = form.find('#flightid');
        flightidElement.val(rowData.FLIGHTID);
        // 机场
        var airportElement = form.find('#airport');
        airportElement.val(rowData.DEPAP + '-' + rowData.ARRAP);
        // 日期
        //var dateElement = form.find('#approve-hobt-date');
        var dateElement = form.find('#update-date');
        // 时间
        //var timeElement = form.find('#approve-hobt-time');
        var timeElement = form.find('#update-time');
        // 赋值表单的数据
        form.find(':hidden[name="id"]').val(flight.id);
        dateElement.val(recordValue.substring(0, 8));
        timeElement.val(recordValue.substring(8, 12));
        // 插入动态显示值
        form.find('#original-value').val(hobt.substring(8, 12)).attr('title', hobt);
        form.find('#apply-value').val(recordValue.substring(8, 12)).attr('title', recordValue);
        form.find('textarea#apply-comment').text(recordComment).attr('title', recordComment);

        form.bootstrapValidator({
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                time: {
                    validators: {
                        notEmpty: {},
                        timeFormat: {}
                    }
                },
                date: {
                    validators: {
                        notEmpty: {}
                    }
                }
            }
        }).on('success.form.bv', function (e) {
            e.preventDefault();
            // 清除qtip信息
            timeElement.qtip('destroy', true);
            //清理协调窗口
            //thisProxy.clearCollaborateContainer();

            //初始化按钮loading
            var loading = Ladda.create(approveButton[0]);
            //启动按钮loading
            loading.start();
            refuseButton.prop("disabled",true);
            // 验证通过，提交表单
            $.ajax({
                url: thisProxy.colCollaborateUrl.APPROVE_HOBT,
                data: form.serialize(),
                type: 'POST',
                dataType: 'json',
                success: function (data, status, xhr) {
                    //停止按钮loading
                    loading.stop();
                    refuseButton.prop("disabled",false);
                    try {
                        // 判断是否有返回结果
                        if ($.isValidVariable(data)) {
                            // 有返回结果，判断是否出错
                            if ($.isValidVariable(data.error)) {
                                // 错误
                                thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                            } else {
                                // 正常
                                var flight = data.flightCoordination;
                                thisProxy.afterCollaborate(flight);
                                thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '航班协关时间批复已提交');
                            }
                        } else {
                            // 无返回结果，未知异常情况
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班协关时间批复失败, 稍后请重新尝试');
                        }
                    } catch (e) {
                        console.error('approve hobt failed');
                        console.error(e.stack);
                    }
                },
                error: function (xhr, status, error) {
                    //停止按钮loading
                    loading.stop();
                    refuseButton.prop("disabled",false)
                    thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班协关时间批复失败，请稍后重新尝试');
                }
            });
        });
        // 绑定refuse事件
        form.find(':button#refuse').click(function () {
            // 清除数据
            dateElement.val('');
            timeElement.val('');
            // 清除样式
            form.bootstrapValidator('resetForm');
            // 清除提示信息
            dateElement.qtip('destroy', true);
            timeElement.qtip('destroy', true);
            //初始化按钮loading
            var loading = Ladda.create(this);
            //启动按钮loading
            loading.start();
            approveButton.prop("disabled",true);
            $.ajax({
                url: thisProxy.colCollaborateUrl.REFUSE_HOBT,
                data: form.serialize(),
                type: 'POST',
                dataType: 'json',
                success: function (data, status, xhr) {
                    //停止按钮loading
                    loading.stop();
                    approveButton.prop("disabled",false);
                    try {
                        //清理协调窗口
                        thisProxy.clearCollaborateContainer();
                        // 判断是否有返回结果
                        if ($.isValidVariable(data)) {
                            // 有返回结果，判断是否出错
                            if ($.isValidVariable(data.error)) {
                                // 错误
                                thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                            } else {
                                // 正常
                                var flight = data.flightCoordination;
                                thisProxy.afterCollaborate(flight);
                                thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '航班协关时间拒绝已提交');
                            }
                        } else {
                            // 无返回结果，未知异常情况
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班协关时间拒绝失败, 稍后请重新尝试');
                        }
                    } catch (e) {
                        console.error('refuse hobt failed');
                        console.error(e.stack);
                    }
                },
                error: function (xhr, status, error) {
                    //停止按钮loading
                    loading.stop();
                    approveButton.prop("disabled",false);
                    thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班协关时间拒绝失败，请稍后重新尝试');
                }
            });
        });

    }
    // 给右上角关闭按钮绑定事件
    $(".flight-grid-table-collaborate-container .modal-close-btn").on("click", function () {
        thisProxy.closeCurrentModal(form);
    });
};


/**
 * ASBT协调
 * @param rowid 行id
 * @param iRow 行索引
 * @param iCol 列索引
 * @param cellObj 单元格对象
 */
FlightGridTable.prototype.collaborateAsbt = function (rowid, iRow, iCol, cellObj) {
    // 对象代理
    var thisProxy = this;
    var opts = {
        rowid : rowid,
        iRow : iRow,
        iCol : iCol
    };
    // 获取行数据
    var rowData = this.tableDataMap[rowid];
    // 获取航班数据
    var flight = this.data.result[rowid];
    // 获取生成时间
    var generateTime = this.data.generateTime;
    // 系统操作权限
    if (!this.colEdit['UPDATE_ASBT'] || !this.colEdit['CLEAR_ASBT']) {
        return;
    }
    // 用户权限
    if (!$.isValidVariable(this.colAuthority[301])) {
        return;
    }
    //将原有时间范围严格校验改为建议性提示
    //thisProxy.showTableCellTipMessage(opts, 'WARN', '航班未推出，建议输入上客时间(ASBT)在当前时间至当前时间-15分钟之内');
    // 获取协调DOM元素
    var collaboratorDom = $(FlightGridTableCollaborateDom.UPDATE_ASBT);
    //协调记录显示
    thisProxy.showCollaborator(collaboratorDom, cellObj);
    // 添加组件
    collaboratorDom.find(':text[name="date"]').datepicker({
        showButtonPanel: true, // 是否显示日历下方的按钮面板。 按钮面板包含两个按钮， 一个今天按钮链接到当前日期，  和一个完成按钮关闭datepicker。 该按钮的文本可以使用currentText 和 closeText选项分别进行定制
        closeText: '关闭',  // 关闭按钮文本
        currentText: '今天', // 当前日期文本
        minDate: 0, // 最小的可选日期。当设置为null（默认值）时，没有下限。
        maxDate: 1, // 最大的可选日期。当设置为null（默认值）时，没有上限
        dateFormat: 'yymmdd', // 描述和显示日期的格式
        showAnim: 'toggle' // 设置显示/隐藏datepicker的动画名称.
    });
    // 按钮权限
    var updateButton = collaboratorDom.find('button#update');
    var clearButton = collaboratorDom.find('button#clear');
    if (this.colEdit['UPDATE_ASBT']) {
        updateButton.show();
    } else {
        updateButton.hide();
    }
    if (this.colEdit['CLEAR_ASBT']) {
        clearButton.show();
    } else {
        clearButton.hide();
    }
    //若单元格的值为空，则不显示清除按钮
    var cellText = cellObj.html();
    if("" == cellText || "&nbsp;" == cellText){
        clearButton.hide();
    }

    // form表单
    var form = collaboratorDom.find('form');
    // 航班号
    var flightidElement = form.find('#flightid');
    flightidElement.val(rowData.FLIGHTID);
    // 机场
    var airportElement = form.find('#airport');
    airportElement.val(rowData.DEPAP + '-' + rowData.ARRAP);
    // 日期
    var dateElement = form.find('#update-date');
    // 时间
    var timeElement = form.find('#update-time');
    // 上客时间
    var boardingTime;
    if ($.isValidVariable(rowData.ASBT)) {
        boardingTime = rowData.ASBT;
    }

    // 赋值表单的数据
    form.find(':hidden[name="id"]').val(flight.id);
    if ($.isValidVariable(boardingTime)) {
        dateElement.val(boardingTime.substring(0, 8));
        timeElement.val(boardingTime.substring(8, 12));
    } else {
        dateElement.val(generateTime.substring(0, 8));
        timeElement.val(generateTime.substring(8, 12));
    }
    // 验证时间格式
    form.bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            time: {
                validators: {
                    notEmpty: {},
                    timeFormat: {},
                    compareASBT2Now: {
                        dateElement: dateElement,
                        now: generateTime,
                        hasAOBT: FlightCoordination.hasAOBT(flight)
                    }
                }
            },
            date: {
                validators: {
                    notEmpty: {}
                }
            }
        }
    }).on('success.form.bv', function (e) {
        e.preventDefault();
        // 清除qtip信息
        timeElement.qtip('destroy', true);
        //清理协调窗口
        //thisProxy.clearCollaborateContainer();
        //初始化按钮loading
        var loading = Ladda.create(updateButton[0]);
        //启动按钮loading
        loading.start();
        clearButton.prop("disabled",true);
        // 提交表单
        $.ajax({
            url: thisProxy.colCollaborateUrl.UPDATE_ASBT,
            data: form.serialize(),
            type: 'POST',
            dataType: 'json',
            success: function (data, status, xhr) {
                //停止按钮loading
                loading.stop();
                clearButton.prop("disabled",false);
                try {
                    // 判断是否有返回结果
                    if ($.isValidVariable(data)) {
                        // 有返回结果，判断是否出错
                        if ($.isValidVariable(data.error)) {
                            // 错误
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                        } else {
                            // 正常
                            var flight = data.flightCoordination;
                            thisProxy.afterCollaborate(flight);
                            thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '航班上客时间修改已提交');
                        }
                    } else {
                        // 无返回结果，未知异常情况
                        thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班上客时间修改失败, 稍后请重新尝试');
                    }
                } catch (e) {
                    console.error('update asbt failed');
                    console.error(e.stack);
                }
            },
            error: function (xhr, status, error) {
                //停止按钮loading
                loading.stop();
                clearButton.prop("disabled",false)
                console.error('update asbt fail, error:');
                console.error(error);
            }
        });
    });
    // 绑定clear事件
    form.find(':button#clear').click(function () {
        // 清除样式
        form.bootstrapValidator('resetForm');
        // 清除提示信息
        dateElement.qtip('destroy', true);
        timeElement.qtip('destroy', true);
        // 清除数据
        if (!$.isValidVariable(boardingTime)) {
            // 清除协调窗口
            thisProxy.clearCollaborateContainer();
            return;
        } else {
            dateElement.val('');
            timeElement.val('');
        }
        //初始化按钮loading
        var loading = Ladda.create(this);
        //启动按钮loading
        loading.start();
        updateButton.prop("disabled",true);
        $.ajax({
            url: thisProxy.colCollaborateUrl.CLEAR_ASBT,
            data: form.serialize(),
            type: 'POST',
            dataType: 'json',
            success: function (data, status, xhr) {
                //停止按钮loading
                loading.stop();
                updateButton.prop("disabled",false);
                try {
                    //清理协调窗口
                    thisProxy.clearCollaborateContainer();
                    // 判断是否有返回结果
                    if ($.isValidVariable(data)) {
                        // 有返回结果，判断是否出错
                        if ($.isValidVariable(data.error)) {
                            // 错误
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                        } else {
                            // 正常
                            var flight = data.flightCoordination;
                            thisProxy.afterCollaborate(flight);
                            thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '航班上客时间修改已提交');
                        }
                    } else {
                        // 无返回结果，未知异常情况
                        thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班上客时间修改失败, 稍后请重新尝试');
                    }
                } catch (e) {
                    console.error('clear asbt failed');
                    console.error(e.stack);
                }
            },
            error: function (xhr, status, error) {
                //停止按钮loading
                loading.stop();
                updateButton.prop("disabled",false);
                console.error('clear asbt fail, error:');
                console.error(error);
            }
        });
    });
    // 给右上角关闭按钮绑定事件
    $(".flight-grid-table-collaborate-container .modal-close-btn").on("click", function () {
        thisProxy.closeCurrentModal(form);
    });
};

/**
 * AGCT协调
 * @param rowid 行id
 * @param iRow 行索引
 * @param iCol 列索引
 * @param cellObj 单元格对象
 */
FlightGridTable.prototype.collaborateAgct = function (rowid, iRow, iCol, cellObj) {
    // 代理
    var thisProxy = this;
    var opts = {
        rowid : rowid,
        iRow : iRow,
        iCol : iCol
    };
    // 获取行数据
    var rowData = this.tableDataMap[rowid];
    // 获取航班数据
    var flight = this.data.result[rowid];
    // 获取当前时间
    var generateTime = this.data.generateTime;

    // 权限
    if (!this.colEdit['UPDATE_AGCT'] || !this.colEdit['CLEAR_AGCT']) {
        return;
    }
    if (!$.isValidVariable(this.colAuthority[302])) {
        return;
    }
    //将原有时间范围严格校验改为建议性提示
    //thisProxy.showTableCellTipMessage(opts, 'WARN', '航班未推出，建议输入关门时间(AGCT)在当前时间至当前时间-15分钟之内');
    // 获取协调DOM元素
    var collaboratorDom = $(FlightGridTableCollaborateDom.UPDATE_AGCT);
    //协调记录显示
    thisProxy.showCollaborator(collaboratorDom, cellObj);
    // 添加组件
    collaboratorDom.find(':text[name="date"]').datepicker({
        showButtonPanel: true,
        closeText: '关闭',
        currentText: '今天',
        minDate: 0,
        maxDate: 1,
        dateFormat: 'yymmdd',
        showAnim: 'toggle'
    });
    // 按钮
    var updateButton = collaboratorDom.find('button#update');
    var clearButton = collaboratorDom.find('button#clear');
    if (this.colEdit['UPDATE_AGCT']) {
        updateButton.show();
    } else {
        updateButton.hide();
    }
    if (this.colEdit['CLEAR_AGCT']) {
        clearButton.show();
    } else {
        clearButton.hide();
    }
    //若单元格的值为空，则不显示清除按钮
    var cellText = cellObj.html();
    if("" == cellText || "&nbsp;" == cellText){
        clearButton.hide();
    }

    // 验证
    // form表单
    var form = collaboratorDom.find('form');
    // 航班号
    var flightidElement = form.find('#flightid');
    flightidElement.val(rowData.FLIGHTID);
    // 机场
    var airportElement = form.find('#airport');
    airportElement.val(rowData.DEPAP + '-' + rowData.ARRAP);
    // 日期
    var dateElement = form.find('#update-date');
    // 时间
    var timeElement = form.find('#update-time');
    // 关门时间
    var closeTime;
    if ($.isValidVariable(rowData.AGCT)) {
        closeTime = rowData.AGCT;
    }
    // 赋值表单的数据
    form.find(':hidden[name="id"]').val(flight.id);
    if ($.isValidVariable(closeTime)) {
        dateElement.val(closeTime.substring(0, 8));
        timeElement.val(closeTime.substring(8, 12));
    } else {
        dateElement.val(generateTime.substring(0, 8));
        timeElement.val(generateTime.substring(8, 12));
    }
    // 验证时间格式
    form.bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            time: {
                validators: {
                    notEmpty: {},
                    timeFormat: {},
                    compareAGCT2Now: {
                        dateElement: dateElement,
                        now: generateTime,
                        hasAOBT: FlightCoordination.hasAOBT(flight)
                    }
                }
            },
            date: {
                validators: {
                    notEmpty: {}
                }
            }
        }
    }).on('success.form.bv', function (e) {
        e.preventDefault();
        // 清除qtip信息
        timeElement.qtip('destroy', true);
        //清理协调窗口
        //thisProxy.clearCollaborateContainer();
        //初始化按钮loading
        var loading = Ladda.create(updateButton[0]);
        //启动按钮loading
        loading.start();
        clearButton.prop("disabled",true);
        // 提交表单
        $.ajax({
            url: thisProxy.colCollaborateUrl.UPDATE_AGCT,
            data: form.serialize(),
            type: 'POST',
            dataType: 'json',
            success: function (data, status, xhr) {
                //停止按钮loading
                loading.stop();
                clearButton.prop("disabled",false);
                try {
                    // 判断是否有返回结果
                    if ($.isValidVariable(data)) {
                        // 有返回结果，判断是否出错
                        if ($.isValidVariable(data.error)) {
                            // 错误
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                        } else {
                            // 正常
                            var flight = data.flightCoordination;
                            thisProxy.afterCollaborate(flight);
                            thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '航班实关时间修改已提交');
                        }
                    } else {
                        // 无返回结果，未知异常情况
                        thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班实关时间修改失败, 稍后请重新尝试');
                    }
                } catch (e) {
                    console.error('update agct failed');
                    console.error(e.stack);
                }
            },
            error: function (xhr, status, error) {
                //停止按钮loading
                loading.stop();
                clearButton.prop("disabled",false);
                console.error('update agct fail, error:');
                console.error(error);
            }
        });
    });
    // 绑定clear事件
    form.find(':button#clear').click(function () {
        // 清除样式
        form.bootstrapValidator('resetForm');
        // 清除提示信息
        dateElement.qtip('destroy', true);
        timeElement.qtip('destroy', true);
        if (!$.isValidVariable(closeTime)) {
            // 清除协调窗口
            thisProxy.clearCollaborateContainer();
            return;
        } else {
            // 清除数据
            dateElement.val('');
            timeElement.val('');
        }
        //初始化按钮loading
        var loading = Ladda.create(this);
        //启动按钮loading
        loading.start();
        updateButton.prop("disabled",true);
        $.ajax({
            url: thisProxy.colCollaborateUrl.CLEAR_AGCT,
            data: form.serialize(),
            type: 'POST',
            dataType: 'json',
            success: function (data, status, xhr) {
                //停止按钮loading
                loading.stop();
                updateButton.prop("disabled",false);
                try {
                    //清理协调窗口
                    thisProxy.clearCollaborateContainer();
                    // 判断是否有返回结果
                    if ($.isValidVariable(data)) {
                        // 有返回结果，判断是否出错
                        if ($.isValidVariable(data.error)) {
                            // 错误
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                        } else {
                            // 正常
                            var flight = data.flightCoordination;
                            thisProxy.afterCollaborate(flight);
                            thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '航班实关时间修改已提交');
                        }
                    } else {
                        // 无返回结果，未知异常情况
                        thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班实关时间修改失败, 稍后请重新尝试');
                    }
                } catch (e) {
                    console.error('clear agct failed');
                    console.error(e.stack);
                }
            },
            error: function (xhr, status, error) {
                //停止按钮loading
                loading.stop();
                updateButton.prop("disabled",false);
                console.error('clear agct fail, error:');
                console.error(error);
            }
        });
    });
    // 给右上角关闭按钮绑定事件
    $(".flight-grid-table-collaborate-container .modal-close-btn").on("click", function () {
        thisProxy.closeCurrentModal(form);
    });
};
/**
 * AOBT协调
 * @param rowid 行id
 * @param iRow 行索引
 * @param iCol 列索引
 * @param cellObj 单元格对象
 */
FlightGridTable.prototype.collaborateAobt = function (rowid, iRow, iCol, cellObj) {
    // 代理
    var thisProxy = this;
    var opts = {
        rowid : rowid,
        iRow : iRow,
        iCol : iCol
    };
    // 获取行数据
    var rowData = this.tableDataMap[rowid];
    // 获取航班数据
    var flight = this.data.result[rowid];
    // 获取生成时间
    var generateTime = this.data.generateTime;
    // 用户权限和系统操作权限
    if (!this.colEdit['UPDATE_AOBT'] || !this.colEdit['CLEAR_AOBT']) {
        return;
    }
    if (!$.isValidVariable(this.colAuthority[309])) {
        return;
    }
    //将原有时间范围严格校验改为建议性提示
    //thisProxy.showTableCellTipMessage(opts, 'WARN', '航班未推出，建议输入推出时间(AOBT)在当前时间至当前时间-15分钟之内');
    // 获取协调DOM元素
    var collaboratorDom = $(FlightGridTableCollaborateDom.UPDATE_AOBT);
    //协调记录显示
    thisProxy.showCollaborator(collaboratorDom, cellObj);
    // 添加组件
    collaboratorDom.find(':text[name="date"]').datepicker({
        showButtonPanel: true, // 是否显示日历下方的按钮面板。 按钮面板包含两个按钮， 一个今天按钮链接到当前日期，  和一个完成按钮关闭datepicker。 该按钮的文本可以使用currentText 和 closeText选项分别进行定制
        closeText: '关闭',  // 关闭按钮文本
        currentText: '今天', // 当前日期文本
        minDate: 0, // 最小的可选日期。当设置为null（默认值）时，没有下限。
        maxDate: 1, // 最大的可选日期。当设置为null（默认值）时，没有上限
        dateFormat: 'yymmdd', // 描述和显示日期的格式
        showAnim: 'toggle'// 设置显示/隐藏datepicker的动画名称.
    });
    // 按钮权限
    var updateButton = collaboratorDom.find('button#update');
    var clearButton = collaboratorDom.find('button#clear');
    if (this.colEdit['UPDATE_AOBT']) {
        updateButton.show();
    } else {
        updateButton.hide();
    }
    if (this.colEdit['CLEAR_AOBT']) {
        clearButton.show();
    } else {
        clearButton.hide();
    }
    //若单元格的值为空，则不显示清除按钮
    var cellText = cellObj.html();
    if("" == cellText || "&nbsp;" == cellText){
        clearButton.hide();
    }

    // form表单
    var form = collaboratorDom.find('form');
    // 航班号
    var flightidElement = form.find('#flightid');
    flightidElement.val(rowData.FLIGHTID);
    // 机场
    var airportElement = form.find('#airport');
    airportElement.val(rowData.DEPAP + '-' + rowData.ARRAP);
    // 日期
    var dateElement = form.find('#update-date');
    // 时间
    var timeElement = form.find('#update-time');
    // 推出时间
    var boardingTime;
    if ($.isValidVariable(rowData.AOBT)) {
        boardingTime = rowData.AOBT;
    }
    // 赋值表单的数据
    form.find(':hidden[name="id"]').val(flight.id);
    if ($.isValidVariable(boardingTime)) {
        dateElement.val(boardingTime.substring(0, 8));
        timeElement.val(boardingTime.substring(8, 12));
    } else {
        dateElement.val(generateTime.substring(0, 8));
        timeElement.val(generateTime.substring(8, 12));
    }
    // 验证时间格式
    form.bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            time: {
                validators: {
                    notEmpty: {},
                    timeFormat: {},
                    compareAOBT2Now: {
                        dateElement: dateElement,
                        now: generateTime,
                        hasAOBT: FlightCoordination.hasAOBT(flight)
                    }
                }
            },
            date: {
                validators: {
                    notEmpty: {}
                }
            }
        }
    }).on('success.form.bv', function (e) {
        e.preventDefault();
        // 清除qtip信息
        timeElement.qtip('destroy', true);
        //清理协调窗口
        //thisProxy.clearCollaborateContainer();
        //初始化按钮loading
        var loading = Ladda.create(updateButton[0]);
        //启动按钮loading
        loading.start();
        clearButton.prop("disabled",true);
        // 提交表单
        $.ajax({
            url: thisProxy.colCollaborateUrl.UPDATE_AOBT,
            data: form.serialize(),
            type: 'POST',
            dataType: 'json',
            success: function (data, status, xhr) {
                //停止按钮loading
                loading.stop();
                clearButton.prop("disabled",false);
                try {
                    // 判断是否有返回结果
                    if ($.isValidVariable(data)) {
                        // 有返回结果，判断是否出错
                        if ($.isValidVariable(data.error)) {
                            // 错误
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                        } else {
                            // 正常
                            var flight = data.flightCoordination;
                            thisProxy.afterCollaborate(flight);
                            thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '航班推出时间修改已提交');
                        }
                    } else {
                        // 无返回结果，未知异常情况
                        thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班推出时间修改失败, 稍后请重新尝试');
                    }
                } catch (e) {
                    console.error('update aobt failed');
                    console.error(e.stack);
                }
            },
            error: function (xhr, status, error) {
                //停止按钮loading
                loading.stop();
                clearButton.prop("disabled",false);
                console.error('update aobt fail, error:');
                console.error(error);
            }
        });
    });
    // 绑定clear事件
    form.find(':button#clear').click(function () {
        // 清除样式
        form.bootstrapValidator('resetForm');
        // 清除提示信息
        dateElement.qtip('destroy', true);
        timeElement.qtip('destroy', true);
        // 清除数据
        if (!$.isValidVariable(boardingTime)) {
            // 清除协调窗口
            thisProxy.clearCollaborateContainer();
            return;
        } else {
            dateElement.val('');
            timeElement.val('');
        }
        //初始化按钮loading
        var loading = Ladda.create(this);
        //启动按钮loading
        loading.start();
        updateButton.prop("disabled",true);
        $.ajax({
            url: thisProxy.colCollaborateUrl.CLEAR_AOBT,
            data: form.serialize(),
            type: 'POST',
            dataType: 'json',
            success: function (data, status, xhr) {
                //停止按钮loading
                loading.stop();
                updateButton.prop("disabled",false);
                try {
                    //清理协调窗口
                    thisProxy.clearCollaborateContainer();
                    // 判断是否有返回结果
                    if ($.isValidVariable(data)) {
                        // 有返回结果，判断是否出错
                        if ($.isValidVariable(data.error)) {
                            // 错误
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                        } else {
                            // 正常
                            var flight = data.flightCoordination;
                            thisProxy.afterCollaborate(flight);
                            thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '航班推出时间修改已提交');
                        }
                    } else {
                        // 无返回结果，未知异常情况
                        thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班推出时间修改失败, 稍后请重新尝试');
                    }
                } catch (e) {
                    console.error('clear aobt failed');
                    console.error(e.stack);
                }
            },
            error: function (xhr, status, error) {
                //停止按钮loading
                loading.stop();
                updateButton.prop("disabled",false);
                console.error('clear aobt fail, error:');
                console.error(error);
            }
        });
    });
    // 给右上角关闭按钮绑定事件
    $(".flight-grid-table-collaborate-container .modal-close-btn").on("click", function () {
        thisProxy.closeCurrentModal(form);
    });
};

/**
 * COBT协调
 * @param rowid 行id
 * @param iRow 行索引
 * @param iCol 列索引
 * @param cellObj 单元格对象
 */
FlightGridTable.prototype.collaborateCobt = function (rowid, iRow, iCol, cellObj) {
    // 代理
    var thisProxy = this;
    var opts = {
        rowid : rowid,
        iRow : iRow,
        iCol : iCol
    };
    // 获取行数据
    var rowData = this.tableDataMap[rowid];
    // 获取航班数据
    var flight = this.data.result[rowid];
    // 获取当前时间
    var generateTime = this.data.generateTime;
    // 权限
    if ((!this.colEdit['UPDATE_COBT'] || !$.isValidVariable(this.colAuthority[121]))
        && (!this.colEdit['CLEAR_COBT'] || !$.isValidVariable(this.colAuthority[122]))) {
        return;
    }
    // 未起飞飞越航班不能指定COBT 20170901 应需求注释掉该逻辑
    //if (!$.isValidVariable(flight.atd)
    //    && !$.isValidVariable(flight.estInfo)
    //    && !$.isValidVariable(flight.updateTime)
    //    && flight.clearanceType == FlightCoordination.CLEARANCE_OVERFLY) {
    //    thisProxy.showTableCellTipMessage(opts, 'WARN', '飞越航班未起飞无法进行操作');
    //    return;
    //}
    //将原有cobt时间范围严格校验改为建议性提示
    //thisProxy.showTableCellTipMessage(opts, 'WARN', '建议输入预撤时间(COBT)晚于预关时间(TOBT)');
    // 获取协调DOM元素
    var collaboratorDom = $(FlightGridTableCollaborateDom.UPDATE_COBT);
    //协调记录显示
    thisProxy.showCollaborator(collaboratorDom, cellObj);

    // 添加组件
    collaboratorDom.find(':text[name="date"]').datepicker({
        showButtonPanel: true,
        closeText: '关闭',
        currentText: '今天',
        minDate: 0,
        maxDate: 1,
        dateFormat: 'yymmdd',
        showAnim: 'toggle',
        onSelect: function () {
            //对指定的验证值指定为没有验证，当提交时重新验证
            var bootstrapValidator = form.data('bootstrapValidator');
            bootstrapValidator.updateStatus('time', 'NOT_VALIDATED', null);
            bootstrapValidator.validate();
        }
    });
    // 按钮
    var updatemButton = collaboratorDom.find('button#update');
    var clearButton = collaboratorDom.find('button#clear');
    if (this.colEdit['UPDATE_COBT']) {
        updatemButton.show();
    } else {
        updatemButton.hide();
    }
    if (this.colEdit['CLEAR_COBT']) {
        clearButton.show();
    } else {
        clearButton.hide();
    }
    //若单元格的值为空，则不显示清除按钮
    var cellText = cellObj.html();
    if("" == cellText || "&nbsp;" == cellText){
        clearButton.hide();
    }

    // 航班不存在C值时，隐藏撤销功能
    // 流控影响航班表格
    var flowcontrolPoint = rowData['FLOWCONTROL_POINT'];
    // 航班没有受控航路点不能调整过点时间
    if ($.isValidVariable(flowcontrolPoint)) {
        // 获取FC、SLOT的过点信息
        var fcMpi = FlightCoordination.parseMonitorPointInfo(flight);
        // 拆解出受控的航路点过点信息
        var hitPointFcInfo = fcMpi[flowcontrolPoint];
        if ((!$.isValidVariable(hitPointFcInfo)) ||
            ($.isValidVariable(hitPointFcInfo) && !$.isValidVariable(hitPointFcInfo['C']))) {
            clearButton.hide();
        }
    }
    // 其他表格
    if (!$.isValidVariable(flight.cobt)) {
        clearButton.hide();
    }

    // 验证
    // form表单
    var form = collaboratorDom.find('form');
    // 航班号
    var flightidElement = form.find('#flightid');
    flightidElement.val(rowData.FLIGHTID);
    // 禁止系统调整
    var lockedElement = form.find('input[name="lockedValue"]');

    // 禁止系统自动分配按钮是选中
    if (flight.locked == FlightCoordination.LOCKED_IMPACT) {
        lockedElement.prop('checked', false);
    } else {
        lockedElement.prop('checked', true);
    }

    // 机场
    var airportElement = form.find('#airport');
    airportElement.val(rowData.DEPAP + '-' + rowData.ARRAP);
    // 日期
    var dateElement = form.find('#update-date');
    // 时间
    var timeElement = form.find('#update-time');
    // 预撤时间
    var cobtTime;
    if ($.isValidVariable(rowData.COBT)) {
        cobtTime = rowData.COBT;
    }

    // 赋值表单的数据
    form.find(':hidden[name="id"]').val(flight.id);
    if ($.isValidVariable(cobtTime)) {
        dateElement.val(cobtTime.substring(0, 8));
        timeElement.val(cobtTime.substring(8, 12));
    } else {
        dateElement.val(generateTime.substring(0, 8));
        timeElement.val(generateTime.substring(8, 12));
    }

    form.bootstrapValidator({
        //message: '请输入有效值',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            time: {
                validators: {
                    notEmpty: {},
                    timeFormat: {},
                    compareCOBTCurrentTime: {
                        inputVal: dateElement,
                        curVal: generateTime,
                        f1: flight.poolStatus == FlightCoordination.IN_POOL,
                        f2: flight.poolStatus == FlightCoordination.IN_POOL_M
                    },
                    compareCOBT2TOBT: {
                        tobt: rowData.TOBT,
                        cobtDate: dateElement,
                        cobtTime: timeElement
                    }
                }
            },
            date: {
                validators: {
                    notEmpty: {},
                    compareCOBT2TOBT: {
                        tobt: rowData.TOBT,
                        cobtDate: dateElement,
                        cobtTime: timeElement
                    }
                }
            }
        }
    });
    //绑定 update事件
    form.find(':button#update').on('click', function(){
        var bootstrapValidator = form.data('bootstrapValidator');
        bootstrapValidator.validate();
        if(bootstrapValidator.isValid()){
            // 清除qtip信息
            timeElement.qtip('destroy', true);
            // 预起自动修改为预推 + 滑行时间
            var date = dateElement.val() + timeElement.val();
            var ctd = $.addStringTime(date, flight.taxi * 60 * 1000);
            form.find(':hidden[name="ctd"]').val(ctd);
            if ($.isValidVariable(rowData['SCENECASEID'])) {
                form.find(':hidden[name="caseId"]').val(rowData['SCENECASEID']);
            }
            //清理协调窗口
            //thisProxy.clearCollaborateContainer();
            //初始化按钮loading
            var loading = Ladda.create(this);
            //启动按钮loading
            loading.start();
            clearButton.prop("disabled",true);
            // 提交表单
            $.ajax({
                url: thisProxy.colCollaborateUrl.UPDATE_COBT,
                data: form.serialize(),
                type: 'POST',
                dataType: 'json',
                success: function (data, status, xhr) {
                    //停止按钮loading
                    loading.stop();
                    clearButton.prop("disabled",false);
                    try {
                        //清理协调窗口
                        //thisProxy.clearCollaborateContainer();
                        // 判断是否有返回结果
                        if ($.isValidVariable(data)) {
                            // 有返回结果，判断是否出错
                            if ($.isValidVariable(data.error)) {
                                // 错误
                                thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                            } else {
                                // 正常
                                var flight = data.flightCoordination;
                                thisProxy.afterCollaborate(flight);
                                thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '航班预撤时间修改已提交');
                            }
                        } else {
                            // 无返回结果，未知异常情况
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班预撤时间修改失败, 稍后请重新尝试');
                        }
                    } catch (e) {
                        console.error('update cobt failed');
                        console.error(e.stack);
                    }
                },
                error: function (xhr, status, error) {
                    //停止按钮loading
                    loading.stop();
                    clearButton.prop("disabled",false);
                    thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班预撤时间修改失败，请稍后重新尝试');
                }
            });
        }else{

        }
    });

    // 绑定clear事件
    form.find(':button#clear').click(function () {
            var clearCobtFunc = function () {
                // 清除样式
                form.bootstrapValidator('resetForm');
                // 清除提示信息
                dateElement.qtip('destroy', true);
                timeElement.qtip('destroy', true);
                if (!$.isValidVariable(cobtTime)) {
                    // 清除协调窗口
                    thisProxy.clearCollaborateContainer();
                    return;
                } else {
                    // 清除数据
                    dateElement.val('');
                    timeElement.val('');
                }
                form.find(':hidden[name="ctd"]').attr('value', '');
                if ($.isValidVariable(rowData['SCENECASEID'])) {
                    form.find(':hidden[name="caseId"]').val(rowData['SCENECASEID']);
                }
                //清理协调窗口
                //thisProxy.clearCollaborateContainer();
                //初始化按钮loading
                var loading = Ladda.create(this);
                //启动按钮loading
                loading.start();
                updatemButton.prop("disabled",true);
                // 提交表单
                $.ajax({
                    url: thisProxy.colCollaborateUrl.CLEAR_COBT,
                    data: form.serialize(),
                    type: 'POST',
                    dataType: 'json',
                    success: function (data, status, xhr) {
                        //停止按钮loading
                        loading.stop();
                        //移除模态框
                        $("#bootstrap-modal-dialog").remove();
                        $('.modal-backdrop').remove();
                        updatemButton.prop("disabled",false);
                        try {
                            // 判断是否有返回结果
                            if ($.isValidVariable(data)) {
                                // 有返回结果，判断是否出错
                                if ($.isValidVariable(data.error)) {
                                    // 错误
                                    thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                                } else {
                                    // 正常
                                    var flight = data.flightCoordination;
                                    thisProxy.afterCollaborate(flight);
                                    //if (thisProxy.tableId === "flight-all-impact-grid-table") {
                                    //    fireAllImpactFlightsSingleDataChange(flight);
                                    //} else if (thisProxy.tableId === "flight-single-impact-grid-table") {
                                    //    fireSingleImpactSingleDataChange(flight);
                                    //}
                                    thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '航班预撤时间修改已提交');
                                }
                            } else {
                                // 无返回结果，未知异常情况
                                thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班预撤时间修改失败, 稍后请重新尝试');
                            }
                        } catch (e) {
                            console.error('clear cobt failed');
                            console.error(e.stack);
                        }
                        thisProxy.clearCollaborateContainer();
                    },
                    error: function (xhr, status, error) {
                        //停止按钮loading
                        loading.stop();
                        //移除模态框
                        $("#bootstrap-modal-dialog").remove();
                        $('.modal-backdrop').remove();
                        updatemButton.prop("disabled",false);
                        thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班预撤时间修改失败，请稍后重新尝试');
                    }
                });
            };

            // 撤销确认对话框
            options = {
                title: 'COBT时间变更',
                content: '确定撤销预撤时间COBT?',
                status: 2,//1:正常 2:警告 3:危险  不填:默认情况
                buttons: [{
                    'name': '确定',
                    'isHidden' : false,
                    'callback': clearCobtFunc
                }],
                width: 400
            };
            BootstrapDialogFactory.dialog(options);
        }
    );

    // 给右上角关闭按钮绑定事件
    $(".flight-grid-table-collaborate-container .modal-close-btn").on("click", function () {
        thisProxy.closeCurrentModal(form);
    });

}
;

/**
 * CTOT协调：
 * @param rowid 行id
 * @param iRow 行索引
 * @param iCol 列索引
 * @param cellObj 单元格对象
 */
FlightGridTable.prototype.collaborateCtot = function (rowid, iRow, iCol, cellObj, url) {
    // 代理
    var thisProxy = this;
    var opts = {
        rowid : rowid,
        iRow : iRow,
        iCol : iCol
    };
    var successUrl = thisProxy.colCollaborateUrl.UPDATE_CTOT;
    if($.isValidVariable(url)){
        successUrl = url;
    }
    // 获取行数据
    var rowData = this.tableDataMap[rowid];
    // 获取航班数据
    var flight = this.data.result[rowid];
    // 获取当前时间
    var generateTime = this.data.generateTime;

    // 页面权限和用户权限
    if ((!this.colEdit['UPDATE_CTOT'] || !$.isValidVariable(this.colAuthority[121]))
        && (!this.colEdit['CLEAR_CTOT'] || !$.isValidVariable(this.colAuthority[122]))) {
        return;
    }
    // 未起飞飞越航班不能指定CTOT 20170901 应需求注释掉该逻辑
    //if (!$.isValidVariable(flight.atd)
    //    && !$.isValidVariable(flight.estInfo)
    //    && !$.isValidVariable(flight.updateTime)
    //    && flight.clearanceType == FlightCoordination.CLEARANCE_OVERFLY) {
    //    thisProxy.showTableCellTipMessage(opts, 'WARN', '飞越航班未起飞无法进行操作');
    //    return;
    //}

    //将原有ctot时间范围严格校验改为建议性提示
    //thisProxy.showTableCellTipMessage(opts, 'WARN', '建议输入预起时间(CTOT)晚于预关时间(TOBT)+滑行时间');

    // 获取协调DOM元素
    var collaboratorDom = $(FlightGridTableCollaborateDom.UPDATE_CTOT);
    //协调记录显示
    thisProxy.showCollaborator(collaboratorDom, cellObj);
    // 添加组件
    collaboratorDom.find('input[name="date"]').datepicker({
        showButtonPanel: true,
        closeText: '关闭',
        currentText: '今天',
        minDate: 0,
        maxDate: 1,
        dateFormat: 'yymmdd',
        showAnim: 'toggle',
        onSelect: function () {
            //对指定的验证值指定为没有验证，当提交时重新验证
            var bootstrapValidator = form.data('bootstrapValidator');
            bootstrapValidator.updateStatus('time', 'NOT_VALIDATED', null);
            bootstrapValidator.validate();
        }
    });
    // 按钮
    var updateButton = collaboratorDom.find('#update');
    var clearButton = collaboratorDom.find('#clear');
    if (this.colEdit['UPDATE_CTOT']) {
        updateButton.show();
    } else {
        updateButton.hide();
    }
    if (this.colEdit['CLEAR_CTOT']) {
        clearButton.show();
    } else {
        clearButton.hide();
    }
    //若单元格的值为空，则不显示清除按钮
    var cellText = cellObj.html();
    if("" == cellText || "&nbsp;" == cellText){
        clearButton.hide();
    }


    // 航班不存在C值时，隐藏撤销功能
    var flowcontrolPoint = rowData['FLOWCONTROL_POINT'];
    // 流控影响航班表格
    // 航班没有受控航路点不能调整过点时间
    if ($.isValidVariable(flowcontrolPoint)) {
        // 获取FC、SLOT的过点信息
        var fcMpi = FlightCoordination.parseMonitorPointInfo(flight);
        // 拆解出受控的航路点过点信息
        var hitPointFcInfo = fcMpi[flowcontrolPoint];
        if ((!$.isValidVariable(hitPointFcInfo)) ||
            ($.isValidVariable(hitPointFcInfo) && !$.isValidVariable(hitPointFcInfo['C']))) {
            clearButton.hide();
        }
    }
    // 其他表格
    if (!$.isValidVariable(flight.cobt)) {
        clearButton.hide();
    }

    // 验证
    // form表单
    var form = collaboratorDom.find('form');
    // 航班号
    var flightidElement = form.find('#flightid');
    flightidElement.val(rowData.FLIGHTID);
    // 禁止系统调整
    var lockedElement = form.find('input[name="lockedValue"]');

    // 禁止系统自动分配按钮是选中
    if (flight.locked == FlightCoordination.LOCKED_IMPACT) {
        lockedElement.prop('checked', false);
    } else {
        lockedElement.prop('checked', true);
    }

    // 机场
    var airportElement = form.find('#airport');
    airportElement.val(rowData.DEPAP + '-' + rowData.ARRAP);
    // 日期
    var dateElement = form.find('#update-date');
    // 时间
    var timeElement = form.find('#update-time');
    // 预起时间
    var ctotTime;
    if ($.isValidVariable(rowData.CTOT)) {
        ctotTime = rowData.CTOT;
    }
    // 赋值表单的数据
    form.find(':hidden[name="id"]').val(flight.id);
    if ($.isValidVariable(ctotTime)) {
        dateElement.val(ctotTime.substring(0, 8));
        timeElement.val(ctotTime.substring(8, 12));
    } else {
        dateElement.val(generateTime.substring(0, 8));
        timeElement.val(generateTime.substring(8, 12));
    }

    form.bootstrapValidator({
        //message: '请输入有效值',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            time: {
                validators: {
                    notEmpty: {},
                    timeFormat: {},
                    compareCTOTCurrentTime: {
                        inputVal: dateElement,
                        curVal: generateTime,
                        f1: flight.poolStatus == FlightCoordination.IN_POOL,
                        f2: flight.poolStatus == FlightCoordination.IN_POOL_M
                    },
                    compareCTOT2TOBT: {
                        taxi: rowData.TAXI,
                        tobt: rowData.TOBT,
                        ctotDate: dateElement,
                        ctotTime: timeElement
                    }
                }
            },
            date: {
                validators: {
                    notEmpty: {},
                    compareCTOT2TOBT: {
                        taxi: rowData.TAXI,
                        tobt: rowData.TOBT,
                        ctotDate: dateElement,
                        ctotTime: timeElement
                    }
                }

            }
        }
    });
    // 初始化按钮loading
    var updateBtn = form.find(':button#update');
    var updateLoading = Ladda.create(updateBtn[0]);
    var clearBtn = form.find(':button#clear');
    updateBtn.on('click', function(){
        var bootstrapValidator = form.data('bootstrapValidator');
        bootstrapValidator.validate();
        if(bootstrapValidator.isValid()){
            // 清除qtip信息
            timeElement.qtip('destroy', true);
            // 预推自动修改为预起-滑行时间
            var date = dateElement.val() + timeElement.val();
            var cobt = $.addStringTime(date, -flight.taxi * 60 * 1000);
            form.find(':hidden[name="cobt"]').attr('value', cobt);
            if ($.isValidVariable(rowData['SCENECASEID'])) {
                form.find(':hidden[name="caseId"]').val(rowData['SCENECASEID']);
            }
            //清理协调窗口
            //thisProxy.clearCollaborateContainer();
            //开启loading
            updateLoading.start();
            //禁用撤销按钮
            clearBtn.prop("disabled",true);
            // 验证通过，提交表单
            $.ajax({
                url: successUrl,
                data: form.serialize(),
                type: 'POST',
                dataType: 'json',
                success: function (data, status, xhr) {
                    //停止按钮loading
                    updateLoading.stop();
                    //启用撤销按钮
                    clearBtn.prop("disabled",false);
                    try {
                        // 判断是否有返回结果
                        if ($.isValidVariable(data)) {
                            // 有返回结果，判断是否出错
                            if ($.isValidVariable(data.error)) {
                                // 错误
                                thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                            } else {
                                // 正常
                                var flight = data.flightCoordination;
                                thisProxy.afterCollaborate(flight);
                                thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '航班预起时间修改已提交');
                            }
                        } else {
                            // 无返回结果，未知异常情况
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班预起时间修改失败, 稍后请重新尝试');
                        }
                    } catch (e) {
                        console.error('update ctot failed');
                        console.error(e.stack);
                    }
                },
                error: function (xhr, status, error) {
                    //停止按钮loading
                    updateLoading.stop();
                    //启用撤销按钮
                    clearBtn.prop("disabled",false);
                    thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班预起时间修改失败，请稍后重新尝试');
                }
            });
        }else{

        }
    });
    // 绑定clear事件
    clearBtn.click(function () {
        var clearCtotFunc = function () {
            // 清除数据
            dateElement.val('');
            timeElement.val('');
            // 清除样式
            form.bootstrapValidator("resetForm");
            // 清除提示信息
            dateElement.qtip('destroy', true);
            timeElement.qtip('destroy', true);
            if (!$.isValidVariable(ctotTime)) {
                // 清除协调窗口
                thisProxy.clearCollaborateContainer();
                return;
            } else {
                // 清除数据
                dateElement.val('');
                timeElement.val('');
            }
            form.find(':hidden[name="cobt"]').attr('value', '');
            if ($.isValidVariable(rowData['SCENECASEID'])) {
                form.find(':hidden[name="caseId"]').val(rowData['SCENECASEID']);
            }
            //初始化按钮loading
            var btn = this;
            var loading = Ladda.create(btn);
            //启动按钮loading
            loading.start();
            updateBtn.prop("disabled",true);
            $.ajax({
                url: thisProxy.colCollaborateUrl.CLEAR_CTOT,
                data: form.serialize(),
                type: 'POST',
                dataType: 'json',
                success: function (data, status, xhr) {
                    //停止按钮loading
                    loading.stop();
                    updateBtn.prop("disabled",false);
                    //移除模态框
                    $("#bootstrap-modal-dialog").remove();
                    $('.modal-backdrop').remove();
                    try {
                        //清理协调窗口
                        //thisProxy.clearCollaborateContainer();
                        // 判断是否有返回结果
                        if ($.isValidVariable(data)) {
                            // 有返回结果，判断是否出错
                            if ($.isValidVariable(data.error)) {
                                // 错误
                                thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                            } else {
                                // 正常
                                var flight = data.flightCoordination;
                                thisProxy.afterCollaborate(flight);
                                //thisProxy.afterCollaborate(flight);
                                thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '航班预起时间修改已提交');
                            }
                        } else {
                            // 无返回结果，未知异常情况
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班预起时间修改失败, 稍后请重新尝试');
                        }
                    } catch (e) {
                        console.error('clear ctot failed');
                        console.error(e.stack);
                    }
                },
                error: function (xhr, status, error) {
                    //停止按钮loading
                    loading.stop();
                    updateBtn.prop("disabled",false);
                    //移除模态框
                    $("#bootstrap-modal-dialog").remove();
                    $('.modal-backdrop').remove();
                    thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班预起时间修改失败，请稍后重新尝试');
                }
            });
        };

        // 撤销确认对话框
        options = {
            title: 'CTOT时间变更',
            content: '确定撤销预起时间CTOT?',
            status: 2,//1:正常 2:警告 3:危险  不填:默认情况
            mtop: 240,
            buttons: [{
                'name': '确定',
                isHidden : false,
                'callback': clearCtotFunc
            }],
            width: 400
        };
        BootstrapDialogFactory.dialog(options);
    });
    // 给右上角关闭按钮绑定事件
    $(".flight-grid-table-collaborate-container .modal-close-btn").on("click", function () {
        thisProxy.closeCurrentModal(form);
    });
};

/**
 * POSITION协调
 * @param rowid 行id
 * @param iRow 行索引
 * @param iCol 列索引
 * @param cellObj 单元格对象
 */
FlightGridTable.prototype.collaboratePosition = function (rowid, iRow, iCol, cellObj) {
    // 代理
    var thisProxy = this;
    var opts = {
        rowid : rowid,
        iRow : iRow,
        iCol : iCol
    };
    // 获取行数据
    var rowData = this.tableDataMap[rowid];
    // 获取航班数据
    var flight = this.data.result[rowid];
    // 权限
    if (!this.colEdit['UPDATE_POSITION'] || !this.colEdit['CLEAR_POSITION']) {
        return;
    }
    if (!$.isValidVariable(this.colAuthority[303])) {
        return;
    }
    // 获取协调DOM元素
    var collaboratorDom = $(FlightGridTableCollaborateDom.UPDATE_POSITION);
    //协调记录显示
    thisProxy.showCollaborator(collaboratorDom, cellObj);
    // 按钮
    var updateButton = collaboratorDom.find('button#update');
    var clearButton = collaboratorDom.find('button#clear');
    if (this.colEdit['UPDATE_POSITION']) {
        updateButton.show();
    } else {
        updateButton.hide();
    }
    if (this.colEdit['CLEAR_POSITION']) {
        clearButton.show();
    } else {
        clearButton.hide();
    }
    //若单元格的值为空，则不显示清除按钮
    var cellText = cellObj.html();
    if("" == cellText || "&nbsp;" == cellText){
        clearButton.hide();
    }
    // 验证
    var form = collaboratorDom.find('form');
    var positionElement = form.find('#position');
    var positionDivElement = positionElement.parent('.input-group');
    var positionSpanElement = positionElement.next('span');
    var validatePositionElement = function () {
        if ($.isValidVariable(positionElement.val())) {
            // 清除提示信息
            positionElement.qtip('destroy', true);
            // 验证通过，显示绿色bootstra信息   (验证通过，但是存在告警，显示黄色bootstrap信息)
            positionDivElement.removeClass('has-error').addClass('has-success');
            positionSpanElement.removeClass('glyphicon-remove').addClass('glyphicon-ok');
            return true;
        } else {
            // 验证不通过，显示红色bootstrap信息，并提示错误原因
            // 添加提示信息
            thisProxy.showTableCellTipMessage(positionElement, 'FAIL', '请输入停机位');
            // 添加样式
            positionDivElement.removeClass('has-success').addClass('has-error');
            positionSpanElement.removeClass('glyphicon-ok').addClass('glyphicon-remove');
            return false;
        }
    };
    positionElement.bind('blur', validatePositionElement);
    // position
    var position = null;
    if ($.isValidVariable(rowData.POSITION)) {
        position = rowData.POSITION;
    }

    // 赋值表单的数据
    form.find(':hidden[name="id"]').val(flight.id);
    positionElement.val(position);

    // 绑定update事件
    form.find(':button#update').click(function () {
        if (!validatePositionElement()) {
            return false;
        }
        //初始化按钮loading
        var loading = Ladda.create(this);
        //启动按钮loading
        loading.start();
        clearButton.prop("disabled",true);
        // 提交表单
        $.ajax({
            url: thisProxy.colCollaborateUrl.UPDATE_POSITION,
            data: form.serialize(),
            type: 'POST',
            dataType: 'json',
            success: function (data, status, xhr) {
                //停止按钮loading
                loading.stop();
                clearButton.prop("disabled",false);
                try {
                    //清理协调窗口
                    thisProxy.clearCollaborateContainer();
                    // 判断是否有返回结果
                    if ($.isValidVariable(data)) {
                        // 有返回结果，判断是否出错
                        if ($.isValidVariable(data.error)) {
                            // 错误
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                        } else {
                            // 正常
                            var flight = data.flightCoordination;
                            thisProxy.afterCollaborate(flight);
                            thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '航班停机位修改已提交');
                        }
                    } else {
                        // 无返回结果，未知异常情况
                        thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班停机位修改失败, 稍后请重新尝试');
                    }
                } catch (e) {
                    console.error('update posiition failed');
                    console.error(e.stack);
                }
            },
            error: function (xhr, status, error) {
                //停止按钮loading
                loading.stop();
                clearButton.prop("disabled",false);
                thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班停机位修改失败，请稍后重新尝试');
            }
        });
    });
    // 绑定clear事件
    form.find(':button#clear').click(function () {
        // 清除样式
        positionDivElement.removeClass('has-error has-success');
        positionSpanElement.removeClass('glyphicon-ok glyphicon-remove');
        // 清除提示信息
        positionElement.qtip('destroy', true);
        if (!$.isValidVariable(position)) {
            // 清除协调窗口
            thisProxy.clearCollaborateContainer();
            return;
        } else {
            // 清除数据
            positionElement.val('');
        }
        //初始化按钮loading
        var loading = Ladda.create(this);
        //启动按钮loading
        loading.start();
        updateButton.prop("disabled",true);
        // 提交表单
        $.ajax({
            url: thisProxy.colCollaborateUrl.CLEAR_POSITION,
            data: form.serialize(),
            type: 'POST',
            dataType: 'json',
            success: function (data, status, xhr) {
                //停止按钮loading
                loading.stop();
                updateButton.prop("disabled",false);
                try {
                    //清理协调窗口
                    thisProxy.clearCollaborateContainer();
                    // 判断是否有返回结果
                    if ($.isValidVariable(data)) {
                        // 有返回结果，判断是否出错
                        if ($.isValidVariable(data.error)) {
                            // 错误
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                        } else {
                            // 正常
                            var flight = data.flightCoordination;
                            thisProxy.afterCollaborate(flight);
                            thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '航班停机位修改已提交');
                        }
                    } else {
                        // 无返回结果，未知异常情况
                        thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班停机位修改失败, 稍后请重新尝试');
                    }
                } catch (e) {
                    console.error('clear posiition failed');
                    console.error(e.stack);
                }
            },
            error: function (xhr, status, error) {
                //停止按钮loading
                loading.stop();
                updateButton.prop("disabled",false);
                thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班停机位修改失败，请稍后重新尝试');
            }
        });
    });
    // 给右上角关闭按钮绑定事件
    $(".flight-grid-table-collaborate-container .modal-close-btn").on("click", function () {
        thisProxy.closeCurrentModal(form);
    });
};

/**
 * RUNWAY协调
 * @param rowid 行id
 * @param iRow 行索引
 * @param iCol 列索引
 * @param cellObj 单元格对象
 */
FlightGridTable.prototype.collaborateRunway = function (rowid, iRow, iCol, cellObj) {
    // 代理
    var thisProxy = this;
    var opts = {
        rowid : rowid,
        iRow : iRow,
        iCol : iCol
    };
    // 获取行数据
    var rowData = this.tableDataMap[rowid];
    // 获取航班数据
    var flight = this.data.result[rowid];
    // 权限操作
    if (!this.colEdit['UPDATE_RUNWAY'] || !this.colEdit['CLEAR_RUNWAY']) {
        return;
    }
    if (!$.isValidVariable(this.colAuthority[304])) {
        return;
    }
    // 当不存在跑道时
    if (!$.isValidVariable(flight.orunway)) {
        return;
    }
    // runway
    var runway = rowData.RUNWAY;
    // 获取协调DOM元素
    var collaboratorDom = $(FlightGridTableCollaborateDom.UPDATE_RUNWAY);
    //协调记录显示
    thisProxy.showCollaborator(collaboratorDom, cellObj);

    // 初始化数据
    if ($.isValidVariable(flight.orunway)) {
        var runwayArray = flight.orunway.split(',');
        // 添加跑道数据
        for (var index in runwayArray) {
            var item = runwayArray[index];
            var checked = item == runway ? 'checked' : null;
            var div = $('<div>', {
                'class': 'radio'
            });
            var label = $('<label>', {});
            var radio = $('<input>', {
                type: 'radio',
                name: 'runway',
                value: item,
                checked: checked
            });
            label.append(radio).append(item);
            ;
            div.append(label);
            collaboratorDom.find('div#orunway').append(div);
        }
    }

    // 按钮
    var updateButton = collaboratorDom.find('button#update');
    var cancelButton = collaboratorDom.find('button#cancel');
    if (this.colEdit['UPDATE_RUNWAY']) {
        updateButton.show();
    } else {
        updateButton.hide();
    }
    if (this.colEdit['CLEAR_RUNWAY']) {
        cancelButton.show();
    } else {
        cancelButton.hide();
    }
    //若单元格的值为空，则不显示清除按钮
    var cellText = cellObj.html();
    if("" == cellText || "&nbsp;" == cellText){
        cancelButton.hide();
    }
    // 验证
    var form = collaboratorDom.find('form');
    var validatePositionElement = function () {
        if (form.find(':radio[name="runway"]:checked').size() < 1) {
            // 验证不通过，显示红色bootstrap信息，并提示错误原因
            // 添加提示信息
            thisProxy.showTableCellTipMessage($('#orunway'), 'FAIL', '请选择跑道');
            return false;
        } else {
            $('#orunway').qtip('destroy', true);
            return true;
        }
    };
    // 默认选择
    $("input[name='runway']").bind('change', function () {
        validatePositionElement();
    });
    // 赋值表单
    form.find(':hidden[name="id"]').val(flight.id);
    // 操作
    // 绑定update事件
    form.find(':button#update').click(function () {
        if (!validatePositionElement()) {
            return false;
        }
        //初始化按钮loading
        var loading = Ladda.create(this);
        //启动按钮loading
        loading.start();
        cancelButton.prop("disabled",true);
        // 提交表单
        $.ajax({
            url: thisProxy.colCollaborateUrl.UPDATE_RUNWAY,
            data: form.serialize(),
            type: 'POST',
            dataType: 'json',
            success: function (data, status, xhr) {
                //停止按钮loading
                loading.stop();
                cancelButton.prop("disabled",false);
                try {
                    //清理协调窗口
                    thisProxy.clearCollaborateContainer();
                    // 判断是否有返回结果
                    if ($.isValidVariable(data)) {
                        // 有返回结果，判断是否出错
                        if ($.isValidVariable(data.error)) {
                            // 错误
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                        } else {
                            // 正常
                            var flight = data.flightCoordination;
                            thisProxy.afterCollaborate(flight);
                            thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '航班起飞跑道修改已提交');
                        }
                    } else {
                        // 无返回结果，未知异常情况
                        thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班起飞跑道修改失败, 稍后请重新尝试');
                    }
                } catch (e) {
                    console.error('update runway failed');
                    console.error(e.stack);
                }
            },
            error: function (xhr, status, error) {
                //停止按钮loading
                loading.stop();
                cancelButton.prop("disabled",false);
                thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班起飞跑道修改失败，请稍后重新尝试');
            }
        });
    });
    // 绑定clear事件
    form.find(':button#clear').click(function () {
        // 清除提示信息
        $('#orunway').qtip('destroy', true);
        if (!$.isValidVariable(runway)) {
            // 清除协调窗口
            thisProxy.clearCollaborateContainer();
            return;
        }
        //初始化按钮loading
        var loading = Ladda.create(this);

        //启动按钮loading
        loading.start();
        updateButton.prop("disabled",true);
        // 提交表单
        $.ajax({
            url: thisProxy.colCollaborateUrl.CLEAR_RUNWAY,
            data: form.serialize(),
            type: 'POST',
            dataType: 'json',
            success: function (data, status, xhr) {
                //停止按钮loading
                loading.stop();
                updateButton.prop("disabled",false);
                try {
                    //清理协调窗口
                    thisProxy.clearCollaborateContainer();
                    // 判断是否有返回结果
                    if ($.isValidVariable(data)) {
                        // 有返回结果，判断是否出错
                        if ($.isValidVariable(data.error)) {
                            // 错误
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                        } else {
                            // 正常
                            var flight = data.flightCoordination;
                            thisProxy.afterCollaborate(flight);
                            thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '航班起飞跑道修改已提交');
                        }
                    } else {
                        // 无返回结果，未知异常情况
                        thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班起飞跑道修改失败, 稍后请重新尝试');
                    }
                } catch (e) {
                    console.error('clear runway failed');
                    console.error(e.stack);
                }
            },
            error: function (xhr, status, error) {
                //停止按钮loading
                loading.stop();
                updateButton.prop("disabled",false);
                thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班起飞跑道修改失败，请稍后重新尝试');
            }
        });
    });
    // 给右上角关闭按钮绑定事件
    $(".flight-grid-table-collaborate-container .modal-close-btn").on("click", function () {
        thisProxy.closeCurrentModal(form);
    });
};

/**
 * DELAYREASON协调
 * @param rowid 行id
 * @param iRow 行索引
 * @param iCol 列索引
 * @param cellObj 单元格对象
 */
FlightGridTable.prototype.collaborateDelayReason = function (rowid, iRow, iCol, cellObj) {
    // 代理
    var thisProxy = this;
    var opts = {
        rowid : rowid,
        iRow : iRow,
        iCol : iCol
    };
    // 获取行数据
    var rowData = this.tableDataMap[rowid];
    // 获取航班数据
    var flight = this.data.result[rowid];
    // 获取当前时间
    var generateTime = this.data.generateTime;
    // 权限
    if (!this.colEdit['UPDATE_DELAY_REASON'] && !this.colEdit['CLEAR_DELAY_REASON']) {
        return;
    }
    if (!$.isValidVariable(this.colAuthority[305])) {
        return;
    }
    // 获取协调DOM元素
    var collaboratorDom = $(FlightGridTableCollaborateDom.UPDATE_DELAY_REASON);
    //协调记录显示
    thisProxy.showCollaborator(collaboratorDom, cellObj);
    var form = collaboratorDom.find('form');
    // 隐藏其它原因输入框
    var otherDelayReasonElement = $('#other-delay-reason');
    //其他原因输入框id
    var otherDelayReasonDom =$('#other-delay-reason-container');
    //选中的值
    var radioValue = $("input[name='delay-reason']:checked").val();
    if (radioValue == 'OTHER') {
        otherDelayReasonDom.show();

    } else {
        otherDelayReasonDom.hide();
    }
    // 按钮
    var updateButton = collaboratorDom.find('button#update');
    var clearButton = collaboratorDom.find('button#clear');
    if (this.colEdit['UPDATE_DELAY_REASON']) {
        updateButton.show();
    } else {
        updateButton.hide();
    }
    if (this.colEdit['CLEAR_DELAY_REASON']) {
        clearButton.show();
    } else {
        clearButton.hide();
    }
    //若单元格的值为空，则不显示清除按钮
    var cellText = cellObj.html();
    if("" == cellText || "&nbsp;" == cellText){
        clearButton.hide();
    }
    //
    var otherDelayReasonDivElement = otherDelayReasonElement.parent('.form-group');
    var otherDelayReasonSpanElement = otherDelayReasonElement.next('span');
    // 判断选中值为"其他"时显示输入框
    $("input[name='delay-reason']").on('change', function () {
        radioValue = $("input[name='delay-reason']:checked").val();
        // 清除其他原因输入框的bootstrap样式和值
        otherDelayReasonDivElement.removeClass('has-error has-success');
        otherDelayReasonSpanElement.removeClass('glyphicon-remove glyphicon-ok');
        otherDelayReasonElement.val('');
        if (radioValue == 'OTHER') {
            otherDelayReasonDom.show();
        } else {
            otherDelayReasonDom.hide();
        }

        // validateDelayReasonElement();
    });
    // 验证
    form.bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            otherDelayReason: {
                validators: {
                    notEmpty: {}
                }
            }
        }
    });
    //
    var validateOtherDelayReasonElement = function () {
        // 验证其他原因输入框是否为空
        if ($.isValidVariable(otherDelayReasonElement.val())) {
            $('#other-delay-reason').qtip('destroy', true);
            otherDelayReasonDivElement.removeClass('has-error').addClass('has-success');
            otherDelayReasonSpanElement.removeClass('glyphicon-remove').addClass('glyphicon-ok');
            return true;
        } else {
            // 验证不通过，显示红色bootstrap信息，并提示错误原因
            thisProxy.showTableCellTipMessage($('#other-delay-reason'), 'FAIL', '请输入延误原因');
            otherDelayReasonDivElement.removeClass('has-success').addClass('has-error');
            otherDelayReasonSpanElement.removeClass('glyphicon-ok').addClass('glyphicon-remove');
            return false;
        }
    };
    otherDelayReasonElement.bind('keyup', validateOtherDelayReasonElement);
    // 验证
    var form = collaboratorDom.find('form');
    var validateDelayReasonElement = function () {
        if (form.find(':radio[name="delay-reason"]:checked').size() < 1) {
            // 验证不通过，并提示错误原因
            // 添加提示信息
            thisProxy.showTableCellTipMessage($('#delay-reason'), 'FAIL', '请选择延误原因');
            return false;
        } else {
            // 清除qtip信息
            $('#delay-reason').qtip('destroy', true);
            // 当为其他原因时，验证其他原因输入框
            if (form.find(':radio[name="delay-reason"]:checked').val() == 'OTHER') {
                validateOtherDelayReasonElement();
            }
            return true;
        }
    };

    // delayReason 默认是others
    var delayReason = "OTHER";// rowData.DELAY_REASON
    if($.isValidVariable(flight.delayReason)){
        var curDelayReason = flight.delayReason;
        //如果是非其他原因，延误原因为当前值
        switch (curDelayReason){
            case FlightCoordination.DELAY_REASON_MILITARY :
            case FlightCoordination.DELAY_REASON_WEATHER :
            case FlightCoordination.DELAY_REASON_CONTROL :
            case FlightCoordination.DELAY_REASON_EQUIPMENT :
            case FlightCoordination.DELAY_REASON_FORMER :
            case FlightCoordination.DELAY_REASON_AOC :
            {
                delayReason = curDelayReason;
                break;
            }
        }
    }else if($.isValidVariable(flight.cdelayReason)){
        delayReason = flight.cdelayReason;
    }
    form.find(':radio[name="delay-reason"][value="' + delayReason + '"]').attr('checked', 'checked');
    if( delayReason == "OTHER" ){
        otherDelayReasonDom.show();
    }
    // 赋值
    form.find(':hidden[name="id"]').val(flight.id);
    // 操作
    // 绑定update事件
    $('#update').on('click', function(){
        var bootstrapValidator = form.data('bootstrapValidator');
        bootstrapValidator.validate();
        if(bootstrapValidator.isValid()){
            var delayReason = form.find(':radio[name="delay-reason"]:checked').val();
            if (delayReason == 'OTHER') {
                delayReason = $('#other-delay-reason').val();
            }
            form.find(':hidden[name="delayReason"]').val(delayReason);
            //初始化按钮loading
            var loading = Ladda.create(this);
            //启动按钮loading
            loading.start();
            clearButton.prop("disabled",true);
            $.ajax({
                url: thisProxy.colCollaborateUrl.UPDATE_DELAY_REASON,
                data: form.serialize(),
                type: 'POST',
                dataType: 'json',
                success: function (data, status, xhr) {
                    //停止按钮loading
                    loading.stop();
                    clearButton.prop("disabled",false);
                    try {
                        //清理协调窗口
                        thisProxy.clearCollaborateContainer();
                        // 判断是否有返回结果
                        if ($.isValidVariable(data)) {
                            // 有返回结果，判断是否出错
                            if ($.isValidVariable(data.error)) {
                                // 错误
                                thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                            } else {
                                // 正常
                                var flight = data.flightCoordination;
                                thisProxy.afterCollaborate(flight);
                                thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '航班延误原因修改已提交');
                            }
                        } else {
                            // 无返回结果，未知异常情况
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班延误原因修改失败, 稍后请重新尝试');
                        }
                    } catch (e) {
                        console.error('update delay reason failed');
                        console.error(e.stack);
                    }
                },
                error: function (xhr, status, error) {
                    //停止按钮loading
                    loading.stop();
                    clearButton.prop("disabled",false);
                    thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班延误原因修改失败，请稍后重新尝试');
                }
            });
        }
    });
    // 绑定clear事件
    form.find(':button#clear').click(function () {
        // 清除提示信息
        $('#delay-reason').qtip('destroy', true);
        if (!$.isValidVariable(delayReason)) {
            // 清除协调窗口
            thisProxy.clearCollaborateContainer();
            return;
        } else {
            form.find(':hidden[name="delayReason"]').val('');
        }
        //初始化按钮loading
        var loading = Ladda.create(this);
        //启动按钮loading
        loading.start();
        updateButton.prop("disabled",true);

        $.ajax({
            url: thisProxy.colCollaborateUrl.CLEAR_DELAY_REASON,
            data: form.serialize(),
            type: 'POST',
            dataType: 'json',
            success: function (data, status, xhr) {
                //停止按钮loading
                loading.stop();
                updateButton.prop("disabled",false);
                try {
                    //清理协调窗口
                    thisProxy.clearCollaborateContainer();
                    // 判断是否有返回结果
                    if ($.isValidVariable(data)) {
                        // 有返回结果，判断是否出错
                        if ($.isValidVariable(data.error)) {
                            // 错误
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                        } else {
                            // 正常
                            var flight = data.flightCoordination;
                            thisProxy.afterCollaborate(flight);
                            thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '清除航班延误原因已提交');
                        }
                    } else {
                        // 无返回结果，未知异常情况
                        thisProxy.showTableCellTipMessage(opts, 'FAIL', '清除航班延误原因失败, 稍后请重新尝试');
                    }
                } catch (e) {
                    console.error('clear delay reason failed');
                    console.error(e.stack);
                }
            },
            error: function (xhr, status, error) {
                //停止按钮loading
                loading.stop();
                updateButton.prop("disabled",false);
                thisProxy.showTableCellTipMessage(opts, 'FAIL', '清除航班延误原因失败，请稍后重新尝试');
            }
        });
    });
    // 给右上角关闭按钮绑定事件
    $(".flight-grid-table-collaborate-container .modal-close-btn").on("click", function () {
        thisProxy.closeCurrentModal(form);
    });
};

/**
 * FLOWCONTROL POINT PASSTIME协调
 * @param rowid 行id
 * @param iRow 行索引
 * @param iCol 列索引
 * @param cellObj 单元格对象
 */
FlightGridTable.prototype.collaborateFlowcontrolPointPasstime = function (rowid, iRow, iCol, cellObj) {
    // 代理
    var thisProxy = this;
    var opts = {
        rowid : rowid,
        iRow : iRow,
        iCol : iCol
    };
    // 获取行数据
    var rowData = this.tableDataMap[rowid];
    // 获取航班数据
    var flight = this.data.result[rowid];
    // 权限
    if (!this.colEdit['UPDATE_FLOWCONTROL_POINT_PASSTIME'] && !this.colEdit['CLEAR_FLOWCONTROL_POINT_PASSTIME']) {
        return;
    }
    if (!($.isValidVariable(this.colAuthority[149]))) {
        return;
    }

    // 判断是否已落地
    if (flight.fmeToday.status == FmeToday.STATUS_ARR) {
        thisProxy.showTableCellTipMessage(opts, 'WARN', '航班已经落地');
        return;
    }

    // 受控航路点
    var flowcontrolPoint = rowData['FLOWCONTROL_POINT'];
    // 航班没有受控航路点不能调整过点时间
    if (!$.isValidVariable(flowcontrolPoint)) {
        return;
    }
    // 受控航路点时间
    var flowcontrolPointPasstime = rowData['FLOWCONTROL_POINT_PASSTIME'];
    if ($.isValidVariable(flowcontrolPointPasstime)) {
        flowcontrolPointPasstime = flowcontrolPointPasstime.substring(8, 12);
    }

    // 获取FC、SLOT的过点信息
    var fcMpi = FlightCoordination.parseMonitorPointInfo(flight);
    // 拆解出受控的航路点过点信息
    var hitPointFcInfo = fcMpi[flowcontrolPoint];

    // 航路点有实际过点时间不能调整过点时间
    if ($.isValidVariable(hitPointFcInfo)
        && $.isValidVariable(hitPointFcInfo['A'])) {
        return;
    }

    // 获取协调DOM元素
    var collaboratorDom = $(FlightGridTableCollaborateDom.UPDATE_FLOWCONTROL_POINT_PASSTIME);
    // 验证
    // form表单
    var form = collaboratorDom.find('form');
    // 日期
    var dateElement = form.find('#update-date');
    // 时间
    var timeElement = form.find('#update-time');
    // 所有点有实际过点时间则不调整过点时间
    var updateFlag = false;

    var lastPoint;//记录最后一个点

    for (var index in fcMpi) {
        var tra = fcMpi[index];
        // 有一个点没有实际过点时间即可修改
        if ($.isValidVariable(fcMpi[index]) && !$.isValidVariable(fcMpi[index]['A'])) {
            updateFlag = true;
        } else {
            // 当前航路点有实际过点时间则不可修改
            if (index == flowcontrolPoint) {
                dateElement.prop("disabled", true);
                timeElement.prop("disabled", true);
            }
        }
        lastPoint = index;
    }

    // 最后一个点有A值则不能修改
    if ($.isValidVariable(lastPoint) && $.isValidVariable(fcMpi[index]) && $.isValidVariable(fcMpi[index]['A'])) {
        updateFlag = false;
    }


    if (!updateFlag) {
        thisProxy.showTableCellTipMessage(opts, 'WARN', '航班已过所有航路点');
        return;
    }

    //协调记录显示
    thisProxy.showCollaborator(collaboratorDom, cellObj);
    // 添加组件
    collaboratorDom.find(':text[name="date"]').datepicker({
        showButtonPanel: true,
        closeText: '关闭',
        currentText: '今天',
        minDate: 0,
        maxDate: 1,
        dateFormat: 'yymmdd',
        showAnim: 'toggle',
    });
    // 按钮
    var updateButton = collaboratorDom.find('button#update');
    var clearButton = collaboratorDom.find('button#clear');
    if (this.colEdit['UPDATE_FLOWCONTROL_POINT_PASSTIME']) {
        updateButton.show();
    } else {
        updateButton.hide();
    }
    if (this.colEdit['CLEAR_FLOWCONTROL_POINT_PASSTIME']) {
        clearButton.show();
    } else {
        clearButton.hide();
    }
    //若单元格的值为空，则不显示清除按钮
    var cellText = cellObj.html();
    if("" == cellText || "&nbsp;" == cellText){
        clearButton.hide();
    }

    // 航班号
    var flightidElement = form.find('#flightid');
    flightidElement.val(rowData.FLIGHTID);
    // 禁止系统调整
    var lockedElement = form.find('input[name="lockedValue"]');

    // 禁止系统自动分配按钮是选中
    if (flight.locked == FlightCoordination.LOCKED_IMPACT) {
        lockedElement.prop('checked', false);
    } else {
        lockedElement.prop('checked', true);
    }

    // 机场
    var airportElement = form.find('#airport');
    airportElement.val(rowData.DEPAP + "-" + rowData.ARRAP);

    // JQuery对象
    var dateDivElement = dateElement.parent('.input-group');
    var dateSpanElement = dateElement.next('span');
    var timeDivElement = timeElement.parent('.input-group');
    var timeSpanElement = timeElement.next('span');

    // 受控过点时间
    var flowcontrolPointPassDate = null;
    if ($.isValidVariable(hitPointFcInfo)
        && $.isValidVariable(hitPointFcInfo['C'])) {
        flowcontrolPointPassDate = hitPointFcInfo['C'].substring(0, 8);
    } else if ($.isValidVariable(hitPointFcInfo)
        && $.isValidVariable(hitPointFcInfo['E'])) {
        // 航班不存在C值时 隐藏清除功能
        form.find(':button#clear').hide();
        flowcontrolPointPassDate = hitPointFcInfo['E'].substring(0, 8);
    } else {
        // 航班不存在C值时 隐藏清除功能
        form.find(':button#clear').hide();
        flowcontrolPointPassDate = flight.executedate;
    }

    // 已起飞航班 存在T值时 开放清除功能
    if ($.isValidVariable(flight.fmeToday.RDepap)) {
        if ($.isValidVariable(hitPointFcInfo)
            && $.isValidVariable(hitPointFcInfo['T'])) {
            if (this.colEdit['CLEAR_FLOWCONTROL_POINT_PASSTIME']) {
                form.find(':button#clear').show();
            }
        }
    }

    var sceneCaseId = '';
    if ($.isValidVariable(rowData['SCENECASEID'])) {
        sceneCaseId = rowData['SCENECASEID'];
    }
    // 赋值表单的数据
    dateElement.val(flowcontrolPointPassDate);
    timeElement.val(flowcontrolPointPasstime);
    // 所有过点时间初始隐藏
    collaboratorDom.find('div#right').hide();
    var colConverter = this.colConverter;
    var dataTemp = this.data;

    var showCustomCellTipMessage = function (cellObj, type, content) {
        var thisProxy = this;
        // 确定样式设置
        var styleClasses = 'qtip-green';
        if (type == 'SUCCESS') {
            styleClasses = 'qtip-green-custom qtip-rounded';
        } else if (type == 'FAIL') {
            styleClasses = 'qtip-red-custom qtip-rounded';
        } else if (type == 'WARN') {
            styleClasses = 'qtip-default-custom qtip-rounded';
        }

        // 显示提示信息
        cellObj.qtip({
            // 内容
            content: {
                text: content // 显示的文本信息
            },
            // 显示配置
            show: {
                delay: 0,
                target: thisProxy.canvas,
                ready: true, // 初始化完成后马上显示
                effect: function () {
                    $(this).fadeIn(); // 显示动画
                }
            },
            // 隐藏配置
            hide: {
                target: thisProxy.canvas, // 指定对象
                event: 'scroll unfocus click', // 失去焦点时隐藏
                effect: function () {
                    $(this).fadeOut(); // 隐藏动画
                },
            },
            // 显示位置配置
            position: {
                my: 'bottom center', // 同jQueryUI Position
                at: 'top center',
                viewport: true, // 显示区域
                container: thisProxy.canvas, // 限制显示容器，以此容器为边界
                adjust: {
                    resize: true, // 窗口改变时，重置位置
                    method: 'shift shift'  //flipinvert/flip(页面变化时，任意位置翻转)  shift(转变) none(无)
                }
            },
            // 样式配置
            style: {
                classes: styleClasses //
            },
            // 事件配置
            events: {
                hide: function (event, api) {
                    api.destroy(true); // 销毁提示信息
                }
            }
        });
    };
    // 绑定更多按钮事件
    collaboratorDom.find(':button#more').click(function () {
        // 如果右侧可见,则还原
        if (collaboratorDom.find('.ffixt_right').is(":visible")) {
            collaboratorDom.find('.ffixt_right').empty().hide();
            collaboratorDom.width('233px');
            collaboratorDom.find('.ffixt_left').removeClass('col-md-5').addClass('col-md-11');
            $(this).removeClass("right_icon").addClass("left_icon");
            return;
        }
        thisProxy.canvas.css('overflow-x', "auto").css('overflow-y', "hidden");
        $(this).removeClass("left_icon").addClass("right_icon");
        // 解析过点时间数据
        var monitorPointInfo = flight.monitorPointInfo;
        if ($.isValidVariable(monitorPointInfo)) {
            // 容器宽度增加 div分为左右两列
            collaboratorDom.width('520px');
            collaboratorDom.find('.ffixt_left').removeClass('col-md-11').addClass('col-md-5');
            collaboratorDom.find('.ffixt_right').show();

            var trajectors = FlightCoordination.parseMonitorPointInfo(flight);
            var autoSlotTrajectors = null;
            if ($.isValidVariable(flight.autoSlot)) {
                autoSlotTrajectors = FlightCoordination.parseAutoSlotMonitorPointInfo(flight.autoSlot);
            }

            var i = 0;
            for (var index in trajectors) {
                i++;
                (function () {
                    var tra = trajectors[index];
                    var autoSlotTra = null;
                    if ($.isValidVariable(autoSlotTrajectors)) {
                        autoSlotTra = autoSlotTrajectors[index];
                    }
                    var traC = tra.C;
                    if (!$.isValidVariable(traC) && $.isValidVariable(autoSlotTra)) {
                        traC = autoSlotTra.C;
                    }
                    var traE = tra.E;
                    var traT = tra.T;
                    var traP = tra.P;
                    var traA = '';
                    if ($.isValidVariable(tra.A)) {
                        traA = tra.A;
                    }
                    if ($.isValidVariable(traA)) {
                        traE = '';
                    }
                    // 按照主表格逻辑取值  没有则取P E值
                    var rData = colConverter.convertData(flight, dataTemp.generateTime, null, index);
                    var FPPValue = rData.FLOWCONTROL_POINT_PASSTIME;
                    if (!$.isValidVariable(FPPValue)) {
                        if ($.isValidVariable(traP)) {
                            FPPValue = traP;
                        } else {
                            FPPValue = traE;
                        }
                    }

                    // 加载控件,事件,校验
                    var date = FPPValue.substring(0, 8);
                    var time = FPPValue.substring(8, 12);
                    // 保存原值用于比较计算
                    var oriValue = FPPValue.substring(0, 12);

                    var pointInfo =
                        '<div class="input-group form-group-custom">' +

                        '<div class="row more_point">' +

                        '<div class="col-md-3 title_pos">' +
                        '<span name="pointId" id="pointId" class="input-group-addon border_style" >' + index + '</span>' +
                        '</div>' +
                        '<div class="col-md-5 date_pos">';
                    pointInfo += '<input type="hidden" name="orderid" value="' + i + '" />';
                    pointInfo += '<input type="hidden" name="oldValue" value="' + oriValue + '" />';
                    pointInfo += '<input type="hidden" name="traA" value="' + traA + '" />';
                    pointInfo += '<input type="hidden" name="passtime" />';
                    // 有实际过点时间则不可修改
                    if ($.isValidVariable(traA)) {
                        pointInfo += '<input type="text" disabled="disabled" name="pointdate" value="' + date + '" id="point-passtime-date" class="form-control" placeholder="请选择日期" readonly />';
                    } else {
                        pointInfo += '<input type="text" name="pointdate" value="' + date + '" id="point-passtime-date" class="form-control" readonly />';
                    }
                    pointInfo += '</div><div class="col-md-4 time_pos pointtimeDiv">';
                    if ($.isValidVariable(traA)) {
                        pointInfo += '<input type="text" disabled="disabled" readonly maxlength="4" name="pointtime" value="' + time + '" id="point-passtime-time" class="form-control"  />';
                    } else {
                        pointInfo += '<input type="text" maxlength="4" name="pointtime" value="' + time + '" id="point-passtime-time" class="form-control"  />';
                    }
                    pointInfo += '<span class="glyphicon form-control-feedback feedback_pos" aria-hidden="true"></span></div></div></div>';

                    var appendDiv = $(pointInfo);
                    collaboratorDom.find('div#right').append(appendDiv);

                    var inputTime = appendDiv.find(':text[name="pointtime"]');
                    var timeSpan = inputTime.next('span');
                    // 时间输入框添加校验和联动
                    inputTime.keyup(function () {
                        // 添加时间校验
                        var timeValue = inputTime.val();
                        var timeDivElement = inputTime.parent('.pointtimeDiv');
                        // 验证
                        if ($.isValidVariable(timeValue)) {
                            if (timeValue.length != 4) {
                                showCustomCellTipMessage(timeDivElement, 'WARN', '请输入正确的时间格式（HHmm），有效范围0000-2359');
                                // 添加样式
                                timeDivElement.removeClass('has-success has-error').addClass('has-warning');
                                timeSpan.removeClass('glyphicon-ok glyphicon-remove').addClass('glyphicon-warning-sign');
                            } else if (!RegExpUtil.time.test(timeValue)) {
                                showCustomCellTipMessage(timeDivElement, 'WARN', '请输入正确的时间格式（HHmm），有效范围0000-2359');
                                // 添加样式
                                timeDivElement.removeClass('has-success has-warning').addClass('has-error');
                                timeSpan.removeClass('glyphicon-ok glyphicon-warning-sign').addClass('glyphicon-remove');
                            } else {
                                // 清除qtip信息
                                timeDivElement.qtip('destroy', true);
                                // 添加样式
                                timeDivElement.removeClass('has-error has-warning').addClass('has-success');
                                timeSpan.removeClass('glyphicon-remove glyphicon-warning-sign').addClass('glyphicon-ok');
                                // 添加联动  分为三种情况 全联动 向下联动 不联动

                                // 获取联动方式
                                var linkageType1 = form.find('#linkageType1').is(":checked");
                                var linkageType2 = form.find('#linkageType2').is(":checked");
                                var newValue = appendDiv.find(':text[name="pointdate"]').val() + timeValue;
                                var oldValue = appendDiv.find('input[name="oldValue"]').val();
                                // 算时间差
                                var passtimeDiff = $.calculateStringTimeDiff(newValue, oldValue);

                                var curOrderid = $(this).parent().parent('.more_point').find('input[name="orderid"]').val();

                                collaboratorDom.find('.more_point').each(function (ind, val) {
                                    var orderid = $(this).find('input[name="orderid"]').val();
                                    var oldV = $(this).find('input[name="oldValue"]').val();
                                    var newV = $.addStringTime(oldV, passtimeDiff);

                                    if ((parseInt(orderid) >= parseInt(curOrderid) && linkageType2) || linkageType1) {

                                        if (!$(this).find('input[name="pointdate"]').prop("disabled")) {
                                            $(this).find('input[name="pointdate"]').val(newV.substring(0, 8));
                                            $(this).find('input[name="pointtime"]').val(newV.substring(8, 12));
                                            $(this).find('input[name="pointtime"]').parent('.pointtimeDiv').removeClass('has-warning has-error');
                                            $(this).find('input[name="pointtime"]').next('span').removeClass('glyphicon-remove glyphicon-warning-sign').addClass('has-success');
                                        }

                                    }
                                    // 找到左边对应的点数据  赋值到左边
                                    var p = rowData['FLOWCONTROL_POINT'];
                                    var pointId = $(this).find('span[name="pointId"]').html();
                                    if (p == pointId) {
                                        // 已经过点不进行联动
                                        if (!dateElement.prop("disabled")) {
                                            var curDate = $(this).find('input[name="pointdate"]').val();
                                            var curTime = $(this).find('input[name="pointtime"]').val();
                                            dateElement.val(curDate);
                                            timeElement.val(curTime);
                                        }
                                    }


                                });
                            }
                        } else {
                            showCustomCellTipMessage(timeDivElement, 'FAIL', '请输入时间');
                            // 添加样式
                            timeDivElement.removeClass('has-success has-warning').addClass('has-error');
                            timeSpan.removeClass('glyphicon-ok glyphicon-warning-sign').addClass('glyphicon-remove');
                            return false;
                        }
                    });

                    // 日期选择框添加校验和联动
                    var inputDate = appendDiv.find(':text[name="pointdate"]');
                    inputDate.change(function () {
                        var dateValue = inputDate.val();
                        // 添加联动
                        var timeValue = appendDiv.find(':text[name="pointtime"]').val();
                        if ($.isValidVariable(timeValue)) {
                            if (timeValue.length != 4 || !RegExpUtil.time.test(timeValue)) {
                                return;
                            }
                        } else {
                            return;
                        }
                        var newValue = dateValue + timeValue;

                        var oldValue = appendDiv.find('input[name="oldValue"]').val();
                        // 算时间差
                        var passtimeDiff = $.calculateStringTimeDiff(newValue, oldValue);
                        var curOrderid = $(this).parent().parent('.more_point').find('input[name="orderid"]').val();
                        // 获取联动方式
                        var linkageType1 = form.find('#linkageType1').is(":checked");
                        var linkageType2 = form.find('#linkageType2').is(":checked");
                        collaboratorDom.find('.more_point').each(function (ind, val) {
                            var orderid = $(this).find('input[name="orderid"]').val();
                            var oldV = $(this).find('input[name="oldValue"]').val();
                            var newV = $.addStringTime(oldV, passtimeDiff);
                            if ((parseInt(orderid) >= parseInt(curOrderid) && linkageType2) || linkageType1) {

                                if (!$(this).find('input[name="pointdate"]').prop("disabled")) {
                                    $(this).find('input[name="pointdate"]').val(newV.substring(0, 8));
                                    $(this).find('input[name="pointtime"]').val(newV.substring(8, 12));

                                    $(this).find('input[name="pointtime"]').parent('.pointtimeDiv').removeClass('has-warning has-error');
                                    $(this).find('input[name="pointtime"]').next('span').removeClass('glyphicon-remove glyphicon-warning-sign').addClass('has-success');
                                }

                            }
                            // 找到左边对应的点数据 赋值到左边
                            var p = rowData['FLOWCONTROL_POINT'];
                            var pointId = $(this).find('span[name="pointId"]').html();
                            if (p == pointId) {
                                // 已经过点不进行联动
                                if (!dateElement.prop("disabled")) {
                                    var curDate = $(this).find('input[name="pointdate"]').val();
                                    var curTime = $(this).find('input[name="pointtime"]').val();
                                    dateElement.val(curDate);
                                    timeElement.val(curTime);
                                }
                            }


                        });
                    });

                })();
            }


            // 绑定日期控件
            collaboratorDom.find('div#right').find(':text[name="pointdate"]').each(function () {
                // 添加时间控件
                $(this).attr("id", ++$.datepicker.uuid).removeClass("hasDatepicker").datepicker({
                    showButtonPanel: true,
                    closeText: '关闭',
                    currentText: '今天',
                    minDate: 0,
                    maxDate: 1,
                    dateFormat: 'yymmdd',
                    showAnim: 'toggle',
                });
            });

            // 如果某个点有A值,则其以上各点都不能修改
            collaboratorDom.find('.more_point').each(function (ind, val) {
                var baseOrderid = $(this).find('input[name="orderid"]').val();
                var traA = $(this).find('input[name="traA"]').val();


                if ($.isValidVariable(traA)) {
                    collaboratorDom.find('.more_point').each(function (ind, val) {
                        var orderid = $(this).find('input[name="orderid"]').val();
                        if (parseInt(orderid) <= parseInt(baseOrderid)) {
                            $(this).find(':text[name="pointtime"]').prop("disabled", "disabled");
                            $(this).find(':text[name="pointdate"]').prop("disabled", "disabled");
                        }
                    });
                }
            });
            collaboratorDom.find('span#pointId').height('20px');
            //collaboratorDom.find('input#point-passtime-time').width('66px');

            // 联动选项 全部联动  向下联动 不联动
            var linkage =
                '<div class="form-group form-group-custom row">' +
                '<div class=" col-md-12 form-group-custom radio_groups">' +
                '<label>' +
                '<input type="radio" id="linkageType1" name="linkageType" checked="checked" value="1" />' +
                '<span>全部联动</span>' +
                '</label>' +
                '<label>' +
                '<input type="radio" id="linkageType2" name="linkageType"  value="2" />' +
                '<span>向下联动</span>' +
                '</label>' +
                '<label>' +
                '<input type="radio" id="linkageType3" name="linkageType"  value="3" />' +
                '<span>不联动</span>' +
                '</label>' +
                '</div>' +
                '</div>';
            collaboratorDom.find('div#right').append(linkage);
        }
    });


    // 绑定重置按钮事件
    collaboratorDom.find(':button#reset').click(function () {
        form.bootstrapValidator("resetForm");
        // 重置左侧
        dateElement.val(flowcontrolPointPassDate);
        timeElement.val(flowcontrolPointPasstime);

        // 重置右侧
        if ($.isValidVariable(collaboratorDom.find('div#right'))) {
            collaboratorDom.find('.more_point').each(function (ind, val) {
                var valuesOld = $(this).find('input[name="oldValue"]').val();
                if ($.isValidVariable(valuesOld)) {
                    $(this).find('input[name="pointdate"]').val(valuesOld.substring(0, 8));
                    $(this).find('input[name="pointtime"]').val(valuesOld.substring(8, 12));
                }
                $(this).find("div.pointtimeDiv").removeClass('has-error has-warning has-success');
                $(this).find("div.pointtimeDiv").find(':text[name="pointtime"]').next('span').removeClass('glyphicon-remove glyphicon-warning-sign glyphicon-ok');
            })
        }

    });


    // 提交前验证右侧所有时间格式
    var validateRightTimeElement = function () {
        collaboratorDom.find('.more_point').each(function (ind, val) {
            var inputTime = $(this).find(':text[name="pointtime"]');
            var timeValue = inputTime.val();
            var timeSpan = inputTime.next('span');
            var timeDivElement = inputTime.parent('.pointtimeDiv');
            if ($.isValidVariable(timeValue)) {
                if (!$(this).find(':text[name="pointtime"]').prop("disabled")) {
                    if (timeValue.length != 4) {
                        // 验证不通过，显示红色bootstrap信息，并提示错误原因
                        // 添加提示信息
                        thisProxy.showTableCellTipMessage(timeDivElement, 'WARN', '请输入正确的时间格式（HHmm），有效范围0000-2359');
                        // 添加样式
                        timeDivElement.removeClass('has-success has-error').addClass('has-warning');
                        timeSpan.removeClass('glyphicon-ok glyphicon-remove').addClass('glyphicon-warning-sign');
                    } else if (!RegExpUtil.time.test(timeValue)) {
                        // 验证不通过，显示红色bootstrap信息，并提示错误原因
                        // 添加提示信息
                        thisProxy.showTableCellTipMessage(timeDivElement, 'FAIL', '请输入正确的时间格式（HHmm），有效范围0000-2359');
                        // 添加样式
                        timeDivElement.removeClass('has-success has-warning').addClass('has-error');
                        timeSpan.removeClass('glyphicon-ok glyphicon-warning-sign').addClass('glyphicon-remove');
                    } else {
                        // 清除qtip信息
                        timeElement.qtip('destroy', true);
                        // 添加样式
                        timeDivElement.removeClass('has-error has-warning').addClass('has-success');
                        timeSpan.removeClass('glyphicon-remove glyphicon-warning-sign').addClass('glyphicon-ok');
                    }
                }
            } else {
                // 验证不通过，显示红色bootstrap信息，并提示错误原因
                // 添加提示信息
                thisProxy.showTableCellTipMessage(timeDivElement, 'FAIL', '请输入时间');
                // 添加样式
                timeDivElement.removeClass('has-success has-warning').addClass('has-error');
                timeSpan.removeClass('glyphicon-ok glyphicon-warning-sign').addClass('glyphicon-remove');
            }
        });
    };
    // 验证日期格式
    var validateDateElement = function () {
        // 获取值
        var dateValue = dateElement.val();
        // 验证
        if ($.isValidVariable(dateValue)) {
            // 验证通过，显示绿色bootstra信息   (验证通过，但是存在告警，显示黄色bootstrap信息)
            dateDivElement.removeClass('has-error').addClass('has-success');
            dateSpanElement.removeClass('glyphicon-remove').addClass('glyphicon-ok');
            return true;
        } else {
            // 验证不通过，显示红色bootstrap信息，并提示错误原因
            // 添加提示信息
            thisProxy.showTableCellTipMessage(dateElement, 'FAIL', '请选择日期');
            // 添加样式
            dateDivElement.removeClass('has-success').addClass('has-error');
            dateSpanElement.removeClass('glyphicon-ok').addClass('glyphicon-remove');
            return false;
        }
    };

    // 验证时间格式
    var validateTimeElement = function () {
        // 获取值
        var timeValue = timeElement.val();
        // 验证
        if ($.isValidVariable(timeValue)) {
            if (timeValue.length != 4) {
                // 验证不通过，显示红色bootstrap信息，并提示错误原因
                // 添加提示信息
                showCustomCellTipMessage(timeElement, 'WARN', '请输入正确的时间格式（HHmm），有效范围0000-2359');
                // 添加样式
                timeDivElement.removeClass('has-success has-error').addClass('has-warning');
                timeSpanElement.removeClass('glyphicon-ok glyphicon-remove').addClass('glyphicon-warning-sign');
                return false;
            } else if (!RegExpUtil.time.test(timeValue)) {
                // 验证不通过，显示红色bootstrap信息，并提示错误原因
                // 添加提示信息
                showCustomCellTipMessage(timeElement, 'FAIL', '请输入正确的时间格式（HHmm），有效范围0000-2359');
                // 添加样式
                timeDivElement.removeClass('has-success has-warning').addClass('has-error');
                timeSpanElement.removeClass('glyphicon-ok glyphicon-warning-sign').addClass('glyphicon-remove');
                return false;
            } else {
                // 清除qtip信息
                timeElement.qtip('destroy', true);
                // 添加样式
                timeDivElement.removeClass('has-error has-warning').addClass('has-success');
                timeSpanElement.removeClass('glyphicon-remove glyphicon-warning-sign').addClass('glyphicon-ok');
                return true;
            }
        } else {
            // 验证不通过，显示红色bootstrap信息，并提示错误原因
            // 添加提示信息
            showCustomCellTipMessage(timeElement, 'FAIL', '请输入时间');
            // 添加样式
            timeDivElement.removeClass('has-success has-warning').addClass('has-error');
            timeSpanElement.removeClass('glyphicon-ok glyphicon-warning-sign').addClass('glyphicon-remove');
            return false;
        }

    };
    // 日期验证
    dateElement.bind('change', validateDateElement);
    // 时间验证
    timeElement.bind('keyup', validateTimeElement);
    // 绑定udpate事件
    form.find(':button#update').click(function () {
        if (!validateDateElement() || !validateTimeElement()) {
            // 验证不通过，返回
            return;
        }

        validateRightTimeElement();
        var hasErr = false;
        collaboratorDom.find('.has-error').each(function (ind, val) {
            hasErr = true;
            return;
        });
        collaboratorDom.find('.has-warning').each(function (ind, val) {
            hasErr = true;
            return;
        });
        if (hasErr) {
            return;
        }

        // 受控航路点过点时间
        var comment = form.find('#comment').val();
        var approveTime = dateElement.val() + timeElement.val();
        var lockedValue = lockedElement.prop('checked') == true ? lockedElement.val() : null;

        var pointStr = '';
        var passtimeStr = '';
        // 遍历找出更新的点
        collaboratorDom.find('.more_point').each(function (ind, val) {
            var curDate = $(this).find('input[name="pointdate"]').val();
            var curTime = $(this).find('input[name="pointtime"]').val();
            var valueNew = curDate + curTime;

            var valuesOld = $(this).find('input[name="oldValue"]').val();
            $(this).find('input[name="passtime"]').val(valueNew);

            var fix = $(this).find('span[name="pointId"]').html();

//            if (valuesOld == valueNew) {
//                $(this).find('input[name="pointId"]').attr("disabled", "disabled");
//                $(this).find('input[name="passtime"]').attr("disabled", "disabled");
//
//            } else {
            // 组装参数
            pointStr += fix + ',';
            passtimeStr += valueNew + ',';
//            }
        })
        pointStr = pointStr.substring(0, pointStr.length - 1);
        passtimeStr = passtimeStr.substring(0, passtimeStr.length - 1);

        // 多点更新的情况
        if (collaboratorDom.find('div#right').is(":visible") && $.isValidVariable(pointStr)) {
            dhtmlx.confirm({
                title: '提示', ok: '确定', cancel: '取消', text: '确定修改多个过点时间？', callback: function (result) {
                    if (result == true) {
                        $.ajax({
                            url: thisProxy.colCollaborateUrl.UPDATE_FLOWCONTROL_POINT_PASSTIME,
                            data: {
                                'type': 'MULIT',
                                'id': flight.id,
                                'fix': pointStr,
                                'passtime': passtimeStr,
                                'caseId': sceneCaseId,
                                'comment': comment,
                                'lockedValue': lockedValue
                            },
                            type: 'POST',
                            dataType: 'json',
                            success: function (data, status, xhr) {
                                //重新监听冻结
                                thisProxy.clearCollaborateContainer();
                                if ($.isValidVariable(data)) {
                                    thisProxy.afterCollaborate(data);
                                    var flightid = flight.fmeToday.flightid;
                                    var messsage = '';
                                    if ($.isValidVariable(flightid)) {
                                        messsage = flightid + '受控时间修改成功';
                                    } else {
                                        messsage = '受控时间修改成功';
                                    }
                                    thisProxy.showTableCellTipMessage(opts, 'SUCCESS', messsage);
                                } else {
                                    thisProxy.showTableCellTipMessage(opts, 'FAIL', '受控时间修改失败，请稍后重新尝试');
                                }

                            },
                            error: function (xhr, status, error) {
                                console.error(error);
                                thisProxy.showTableCellTipMessage(opts, 'FAIL', '受控时间修改失败，请稍后重新尝试');
                            }
                        });
                    }
                }
            });

        } else {

            // 验证通过，提交表单
            $.ajax({
                url: thisProxy.colCollaborateUrl.UPDATE_FLOWCONTROL_POINT_PASSTIME,
                data: {
                    'type': 'SINGLE',
                    'id': flight.id,
                    'fix': flowcontrolPoint,
                    'passtime': approveTime,
                    'caseId': sceneCaseId,
                    'comment': comment,
                    'lockedValue': lockedValue
                },
                type: 'POST',
                dataType: 'json',
                success: function (data, status, xhr) {
                    //重新监听冻结
                    thisProxy.clearCollaborateContainer();
                    if ($.isValidVariable(data)) {
                        thisProxy.afterCollaborate(data);
                        var flightid = flight.fmeToday.flightid;
                        var messsage = '';
                        if ($.isValidVariable(flightid)) {
                            messsage = flightid + '受控时间修改成功';
                        } else {
                            messsage = '受控时间修改成功';
                        }
                        thisProxy.showTableCellTipMessage(opts, 'SUCCESS', messsage);
                    } else {
                        thisProxy.showTableCellTipMessage(opts, 'FAIL', '受控时间修改失败，请稍后重新尝试');
                    }

                },
                error: function (xhr, status, error) {
                    console.error(error);
                    thisProxy.showTableCellTipMessage(opts, 'FAIL', '受控时间修改失败，请稍后重新尝试');
                }
            });
        }

    });
    // 绑定clear事件
    form.find(':button#clear').click(function () {

        dhtmlx.confirm({
            title: '提示', ok: '确定', cancel: '取消', text: '确定撤销？', callback: function (result) {
                if (result == true) {
                    // 清除数据
                    dateElement.val('');
                    timeElement.val('');
                    // 清除样式
                    dateDivElement.removeClass('has-error has-success has-warning');
                    timeDivElement.removeClass('has-error has-success has-warning');
                    dateSpanElement.removeClass('glyphicon-ok glyphicon-remove glyphicon-warning-sign');
                    timeSpanElement.removeClass('glyphicon-ok glyphicon-remove glyphicon-warning-sign');
                    // 清除提示信息
                    dateElement.qtip('destroy', true);
                    timeElement.qtip('destroy', true);
                    // 提交表单
                    $.ajax({
                        url: thisProxy.colCollaborateUrl.CLEAR_FLOWCONTROL_POINT_PASSTIME,
                        data: {id: flight.id},
                        type: 'POST',
                        dataType: 'json',
                        success: function (data, status, xhr) {
                            //重新监听冻结
                            thisProxy.clearCollaborateContainer();

                            if ($.isValidVariable(data)) {
                                thisProxy.afterCollaborate(data);
                                var flightid = flight.fmeToday.flightid;
                                var messsage = '';
                                if ($.isValidVariable(flightid)) {
                                    messsage = flightid + '受控时间修改成功';
                                } else {
                                    messsage = '受控时间修改成功';
                                }
                                thisProxy.showTableCellTipMessage(opts, 'SUCCESS', messsage);
                            } else {
                                thisProxy.showTableCellTipMessage(opts, 'FAIL', '受控时间修改失败，请稍后重新尝试');
                            }
                        },
                        error: function (xhr, status, error) {
                            console.error(error);
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', '受控时间修改失败，请稍后重新尝试');
                        }
                    });
                }
            }
        });

    });
    // 给右上角关闭按钮绑定事件
    $(".flight-grid-table-collaborate-container .modal-close-btn").on("click", function () {
        thisProxy.closeCurrentModal(form);
    });

};

/**
 * FLOWCONTROL POINT PASSTIME CTO协调
 * @param rowid 行id
 * @param iRow 行索引
 * @param iCol 列索引
 * @param cellObj 单元格对象
 */
FlightGridTable.prototype.collaborateFlowcontrolPointPasstimeCTO = function (rowid, iRow, iCol, cellObj) {
    // 代理
    var thisProxy = this;
    var opts = {
        rowid : rowid,
        iRow : iRow,
        iCol : iCol
    };
    // 获取行数据
    var rowData = this.tableDataMap[rowid];
    // 获取航班数据
    var flight = this.data.result[rowid];
    // 权限
    if (!this.colEdit['UPDATE_FLOWCONTROL_POINT_PASSTIME'] && !this.colEdit['CLEAR_FLOWCONTROL_POINT_PASSTIME']) {
        return;
    }
    if (!($.isValidVariable(this.colAuthority[149]))) {
        return;
    }

    // 未起飞飞越航班不能指定CTO 20170901 应需求注释掉该逻辑
    //if (!$.isValidVariable(flight.atd)
    //    && !$.isValidVariable(flight.estInfo)
    //    && !$.isValidVariable(flight.updateTime)
    //    && flight.clearanceType == FlightCoordination.CLEARANCE_OVERFLY) {
    //    thisProxy.showTableCellTipMessage(opts, 'WARN', '飞越航班未起飞无法进行操作');
    //    return;
    //}

    // 判断是否已落地
    if (flight.fmeToday.status == FmeToday.STATUS_ARR) {
        thisProxy.showTableCellTipMessage(opts, 'WARN', '航班已经落地');
        return;
    }

    // 受控航路点
    var flowcontrolPoint = rowData['FLOWCONTROL_POINT'];
    // 航班没有受控航路点不能调整过点时间
    if (!$.isValidVariable(flowcontrolPoint)) {
        return;
    }
    // 受控航路点时间
    var flowcontrolPointPasstime = rowData['FLOWCONTROL_POINT_PASSTIME_CTO'];
    if ($.isValidVariable(flowcontrolPointPasstime)) {
        flowcontrolPointPasstime = flowcontrolPointPasstime.substring(8, 12);
    }

    // 获取FC、SLOT的过点信息
    var fcMpi = FlightCoordination.parseMonitorPointInfo(flight);
    // 拆解出受控的航路点过点信息
    var hitPointFcInfo = fcMpi[flowcontrolPoint];

    // 航路点有实际过点时间不能调整过点时间
    if ($.isValidVariable(hitPointFcInfo)
        && $.isValidVariable(hitPointFcInfo['A'])) {
        return;
    }

    // 获取协调DOM元素
    var collaboratorDom = $(FlightGridTableCollaborateDom.UPDATE_FLOWCONTROL_POINT_PASSTIME);
    // 验证
    // form表单
    var form = collaboratorDom.find('form');
    // 日期
    var dateElement = form.find('#update-date');
    // 时间
    var timeElement = form.find('#update-time');
    // 所有点有实际过点时间则不调整过点时间
    var updateFlag = false;

    var lastPoint;//记录最后一个点

    for (var index in fcMpi) {
        var tra = fcMpi[index];
        // 有一个点没有实际过点时间即可修改
        if ($.isValidVariable(fcMpi[index]) && !$.isValidVariable(fcMpi[index]['A'])) {
            updateFlag = true;
        } else {
            // 当前航路点有实际过点时间则不可修改
            if (index == flowcontrolPoint) {
                dateElement.prop("disabled", true);
                timeElement.prop("disabled", true);
            }
        }
        lastPoint = index;
    }

    // 最后一个点有A值则不能修改
    if ($.isValidVariable(lastPoint) && $.isValidVariable(fcMpi[index]) && $.isValidVariable(fcMpi[index]['A'])) {
        updateFlag = false;
    }


    if (!updateFlag) {
        thisProxy.showTableCellTipMessage(opts, 'WARN', '航班已过所有航路点');
        return;
    }

    //协调记录显示
    thisProxy.showCollaborator(collaboratorDom, cellObj);
    // 添加组件
    collaboratorDom.find(':text[name="date"]').datepicker({
        showButtonPanel: true,
        closeText: '关闭',
        currentText: '今天',
        minDate: 0,
        maxDate: 1,
        dateFormat: 'yymmdd',
        showAnim: 'toggle'
    });
    // 按钮
    var updateButton = collaboratorDom.find('button#update');
    var clearButton = collaboratorDom.find('button#clear');
    if (this.colEdit['UPDATE_FLOWCONTROL_POINT_PASSTIME']) {
        updateButton.show();
    } else {
        updateButton.hide();
    }
    if (this.colEdit['CLEAR_FLOWCONTROL_POINT_PASSTIME']) {
        clearButton.show();
    } else {
        clearButton.hide();
    }
    //若单元格的值为空，则不显示清除按钮
    var cellText = cellObj.html();
    if("" == cellText || "&nbsp;" == cellText){
        clearButton.hide();
    }

    // 航班号
    var flightidElement = form.find('#flightid');
    flightidElement.val(rowData.FLIGHTID);
    // 禁止系统调整
    var lockedElement = form.find('input[name="lockedValue"]');

    // 禁止系统自动分配按钮是选中
    if (flight.locked == FlightCoordination.LOCKED_IMPACT) {
        lockedElement.prop('checked', false);
    } else {
        lockedElement.prop('checked', true);
    }

    // 机场
    var airportElement = form.find('#airport');
    airportElement.val(rowData.DEPAP + "-" + rowData.ARRAP);

    // JQuery对象
    var dateDivElement = dateElement.parent('.input-group');
    var dateSpanElement = dateElement.next('span');
    var timeDivElement = timeElement.parent('.input-group');
    var timeSpanElement = timeElement.next('span');

    // 受控过点时间
    var flowcontrolPointPassDate = null;
    if ($.isValidVariable(hitPointFcInfo)
        && $.isValidVariable(hitPointFcInfo['C'])) {
        flowcontrolPointPassDate = hitPointFcInfo['C'].substring(0, 8);
    } else if ($.isValidVariable(hitPointFcInfo)
        && $.isValidVariable(hitPointFcInfo['E'])) {
        // 航班不存在C值时 隐藏清除功能
        form.find(':button#clear').hide();
        flowcontrolPointPassDate = hitPointFcInfo['E'].substring(0, 8);
    } else {
        // 航班不存在C值时 隐藏清除功能
        form.find(':button#clear').hide();
        flowcontrolPointPassDate = flight.executedate;
    }

    // 已起飞航班 存在T值时 开放清除功能
    if ($.isValidVariable(flight.fmeToday.RDepap)) {
        if ($.isValidVariable(hitPointFcInfo)
            && $.isValidVariable(hitPointFcInfo['T'])) {
            if (this.colEdit['CLEAR_FLOWCONTROL_POINT_PASSTIME']) {
                form.find(':button#clear').show();
            }
        }
    }

    var sceneCaseId = '';
    if ($.isValidVariable(rowData['SCENECASEID'])) {
        sceneCaseId = rowData['SCENECASEID'];
    }
    // 赋值表单的数据
    dateElement.val(flowcontrolPointPassDate);
    timeElement.val(flowcontrolPointPasstime);
    // 所有过点时间初始隐藏
    collaboratorDom.find('div#right').hide();
    var colConverter = this.colConverter;
    var dataTemp = this.data;
    //根据指定input节点清理所以验证状态
    var clearFormStatus = function( $dom ){
        $dom.parent('.input-group').removeClass('has-success has-warning has-error');
        $dom.next('span').removeClass('glyphicon-ok glyphicon-warning-sign glyphicon-remove');
    };

    var showCustomCellTipMessage = function (cellObj, type, content) {
        var thisProxy = this;
        // 确定样式设置
        var styleClasses = 'qtip-green';
        if (type == 'SUCCESS') {
            styleClasses = 'qtip-green-custom qtip-rounded';
        } else if (type == 'FAIL') {
            styleClasses = 'qtip-red-custom qtip-rounded';
        } else if (type == 'WARN') {
            styleClasses = 'qtip-default-custom qtip-rounded';
        }

        // 显示提示信息
        cellObj.qtip({
            // 内容
            content: {
                text: content // 显示的文本信息
            },
            // 显示配置
            show: {
                delay: 0,
                target: thisProxy.canvas,
                ready: true, // 初始化完成后马上显示
                effect: function () {
                    $(this).fadeIn(); // 显示动画
                }
            },
            // 隐藏配置
            hide: {
                target: thisProxy.canvas, // 指定对象
                event: 'scroll unfocus click', // 失去焦点时隐藏
                effect: function () {
                    $(this).fadeOut(); // 隐藏动画
                }
            },
            // 显示位置配置
            position: {
                my: 'bottom center', // 同jQueryUI Position
                at: 'top center',
                viewport: true, // 显示区域
                container: thisProxy.canvas, // 限制显示容器，以此容器为边界
                adjust: {
                    resize: true, // 窗口改变时，重置位置
                    method: 'shift shift'  //flipinvert/flip(页面变化时，任意位置翻转)  shift(转变) none(无)
                }
            },
            // 样式配置
            style: {
                classes: styleClasses //
            },
            // 事件配置
            events: {
                hide: function (event, api) {
                    api.destroy(true); // 销毁提示信息
                }
            }
        });
    };
    // 绑定更多按钮事件
    collaboratorDom.find('#more').click(function () {
        clearFormStatus(dateElement);
        clearFormStatus(timeElement);
        // 如果右侧可见,则还原
        if (collaboratorDom.find('.ffixt_right').is(":visible")) {
            collaboratorDom.find('.ffixt_right').empty().hide();
            collaboratorDom.width('233px');
            collaboratorDom.find('.ffixt_left').removeClass('col-md-5').addClass('col-md-11');
            $(this).removeClass("right_icon").addClass("left_icon");
            dateElement.prop("disabled", false);
            timeElement.prop("disabled", false);

            return;
        }
        dateElement.prop("disabled", true);
        timeElement.prop("disabled", true);
        thisProxy.canvas.css('overflow-x', "auto").css('overflow-y', "hidden");
        $(this).removeClass("left_icon").addClass("right_icon");
        // 解析过点时间数据
        var monitorPointInfo = flight.monitorPointInfo;
        if ($.isValidVariable(monitorPointInfo)) {
            // 容器宽度增加 div分为左右两列
            collaboratorDom.width('520px');
            collaboratorDom.find('.ffixt_left').removeClass('col-md-11').addClass('col-md-5');
            collaboratorDom.find('.ffixt_right').show();

            var trajectors = FlightCoordination.parseMonitorPointInfo(flight);
            var autoSlotTrajectors = null;
            if ($.isValidVariable(flight.autoSlot)) {
                autoSlotTrajectors = FlightCoordination.parseAutoSlotMonitorPointInfo(flight.autoSlot);
            }

            var i = 0;
            for (var index in trajectors) {
                i++;
                (function () {
                    var tra = trajectors[index];
                    var autoSlotTra = null;
                    if ($.isValidVariable(autoSlotTrajectors)) {
                        autoSlotTra = autoSlotTrajectors[index];
                    }
                    var traC = tra.C;
                    if (!$.isValidVariable(traC) && $.isValidVariable(autoSlotTra)) {
                        traC = autoSlotTra.C;
                    }
                    var traE = tra.E;
                    var traT = tra.T;
                    var traP = tra.P;
                    var traA = '';
                    if ($.isValidVariable(tra.A)) {
                        traA = tra.A;
                    }
                    if ($.isValidVariable(traA)) {
                        traE = '';
                    }
                    // 按照主表格逻辑取值  没有则取P E值
                    var rData = colConverter.convertData(flight, dataTemp.generateTime, null, index);
                    var FPPValue = rData.FLOWCONTROL_POINT_PASSTIME;
                    if (!$.isValidVariable(FPPValue)) {
                        if ($.isValidVariable(traP)) {
                            FPPValue = traP;
                        } else {
                            FPPValue = traE;
                        }
                    }

                    // 加载控件,事件,校验
                    var date = FPPValue.substring(0, 8);
                    var time = FPPValue.substring(8, 12);
                    // 保存原值用于比较计算
                    var oriValue = FPPValue.substring(0, 12);

                    var pointInfo =
                        '<div class="input-group form-group-custom">' +

                        '<div class="row more_point">' +

                        '<div class="col-md-3 title_pos">' +
                        '<span name="pointId" id="pointId" class="input-group-addon border_style" >' + index + '</span>' +
                        '</div>' +
                        '<div class="col-md-5 date_pos">';
                    pointInfo += '<input type="hidden" name="orderid" value="' + i + '" />';
                    pointInfo += '<input type="hidden" name="oldValue" value="' + oriValue + '" />';
                    pointInfo += '<input type="hidden" name="traA" value="' + traA + '" />';
                    pointInfo += '<input type="hidden" name="passtime" />';
                    // 有实际过点时间则不可修改
                    if ($.isValidVariable(traA)) {
                        pointInfo += '<input type="text" disabled="disabled" name="pointdate" value="' + date + '" id="point-passtime-date" class="form-control" placeholder="请选择日期" readonly />';
                    } else {
                        pointInfo += '<input type="text" name="pointdate" value="' + date + '" id="point-passtime-date" class="form-control" readonly />';
                    }
                    pointInfo += '</div><div class="col-md-4 time_pos pointtimeDiv">';
                    if ($.isValidVariable(traA)) {
                        pointInfo += '<input type="text" disabled="disabled" readonly maxlength="4" name="pointtime" value="' + time + '" id="point-passtime-time" class="form-control"  />';
                    } else {
                        pointInfo += '<input type="text" maxlength="4" name="pointtime" value="' + time + '" id="point-passtime-time" class="form-control"  />';
                    }
                    pointInfo += '<span class="glyphicon form-control-feedback feedback_pos" aria-hidden="true"></span></div></div></div>';

                    if( flowcontrolPoint == index ){
                        timeElement.val(time);
                    }
                    var appendDiv = $(pointInfo);
                    collaboratorDom.find('div#right').append(appendDiv);

                    var inputTime = appendDiv.find(':text[name="pointtime"]');
                    var timeSpan = inputTime.next('span');
                    // 时间输入框添加校验和联动
                    inputTime.keyup(function () {
                        // 添加时间校验
                        var timeValue = inputTime.val();
                        var timeDivElement = inputTime.parent('.pointtimeDiv');
                        // 验证
                        if ($.isValidVariable(timeValue)) {
                            if (timeValue.length != 4) {
                                showCustomCellTipMessage(timeDivElement, 'WARN', '请输入正确的时间格式（HHmm），有效范围0000-2359');
                                // 添加样式
                                timeDivElement.removeClass('has-success has-error').addClass('has-warning');
                                timeSpan.removeClass('glyphicon-ok glyphicon-remove').addClass('glyphicon-warning-sign');
                            } else if (!RegExpUtil.time.test(timeValue)) {
                                showCustomCellTipMessage(timeDivElement, 'WARN', '请输入正确的时间格式（HHmm），有效范围0000-2359');
                                // 添加样式
                                timeDivElement.removeClass('has-success has-warning').addClass('has-error');
                                timeSpan.removeClass('glyphicon-ok glyphicon-warning-sign').addClass('glyphicon-remove');
                            } else {
                                // 清除qtip信息
                                timeDivElement.qtip('destroy', true);
                                // 添加样式
                                timeDivElement.removeClass('has-error has-warning').addClass('has-success');
                                timeSpan.removeClass('glyphicon-remove glyphicon-warning-sign').addClass('glyphicon-ok');
                                // 添加联动  分为三种情况 全联动 向下联动 不联动

                                // 获取联动方式
                                var linkageType1 = form.find('#linkageType1').is(":checked");
                                var linkageType2 = form.find('#linkageType2').is(":checked");
                                var newValue = appendDiv.find(':text[name="pointdate"]').val() + timeValue;
                                var oldValue = appendDiv.find('input[name="oldValue"]').val();
                                // 算时间差
                                var passtimeDiff = $.calculateStringTimeDiff(newValue, oldValue);

                                var curOrderid = $(this).parent().parent('.more_point').find('input[name="orderid"]').val();

                                collaboratorDom.find('.more_point').each(function (ind, val) {
                                    var orderid = $(this).find('input[name="orderid"]').val();
                                    var oldV = $(this).find('input[name="oldValue"]').val();
                                    var newV = $.addStringTime(oldV, passtimeDiff);

                                    if ((parseInt(orderid) >= parseInt(curOrderid) && linkageType2) || linkageType1) {

                                        if (!$(this).find('input[name="pointdate"]').prop("disabled")) {
                                            $(this).find('input[name="pointdate"]').val(newV.substring(0, 8));
                                            $(this).find('input[name="pointtime"]').val(newV.substring(8, 12));
                                            $(this).find('input[name="pointtime"]').parent('.pointtimeDiv').removeClass('has-warning has-error');
                                            $(this).find('input[name="pointtime"]').next('span').removeClass('glyphicon-remove glyphicon-warning-sign').addClass('has-success');
                                        }

                                    }
                                    // 找到左边对应的点数据  赋值到左边
                                    var p = rowData['FLOWCONTROL_POINT'];
                                    var pointId = $(this).find('span[name="pointId"]').html();
                                    if (p == pointId) {
                                        // 已经过点不进行联动
                                        if (!dateElement.prop("disabled")) {
                                            var curDate = $(this).find('input[name="pointdate"]').val();
                                            var curTime = $(this).find('input[name="pointtime"]').val();
                                            dateElement.val(curDate);
                                            timeElement.val(curTime);
                                        }
                                    }


                                });
                            }
                        } else {
                            showCustomCellTipMessage(timeDivElement, 'FAIL', '请输入时间');
                            // 添加样式
                            timeDivElement.removeClass('has-success has-warning').addClass('has-error');
                            timeSpan.removeClass('glyphicon-ok glyphicon-warning-sign').addClass('glyphicon-remove');
                            return false;
                        }
                    });

                    // 日期选择框添加校验和联动
                    var inputDate = appendDiv.find(':text[name="pointdate"]');
                    inputDate.change(function () {
                        var dateValue = inputDate.val();
                        // 添加联动
                        var timeValue = appendDiv.find(':text[name="pointtime"]').val();
                        if ($.isValidVariable(timeValue)) {
                            if (timeValue.length != 4 || !RegExpUtil.time.test(timeValue)) {
                                return;
                            }
                        } else {
                            return;
                        }
                        var newValue = dateValue + timeValue;

                        var oldValue = appendDiv.find('input[name="oldValue"]').val();
                        // 算时间差
                        var passtimeDiff = $.calculateStringTimeDiff(newValue, oldValue);
                        var curOrderid = $(this).parent().parent('.more_point').find('input[name="orderid"]').val();
                        // 获取联动方式
                        var linkageType1 = form.find('#linkageType1').is(":checked");
                        var linkageType2 = form.find('#linkageType2').is(":checked");
                        collaboratorDom.find('.more_point').each(function (ind, val) {
                            var orderid = $(this).find('input[name="orderid"]').val();
                            var oldV = $(this).find('input[name="oldValue"]').val();
                            var newV = $.addStringTime(oldV, passtimeDiff);
                            if ((parseInt(orderid) >= parseInt(curOrderid) && linkageType2) || linkageType1) {

                                if (!$(this).find('input[name="pointdate"]').prop("disabled")) {
                                    $(this).find('input[name="pointdate"]').val(newV.substring(0, 8));
                                    $(this).find('input[name="pointtime"]').val(newV.substring(8, 12));

                                    $(this).find('input[name="pointtime"]').parent('.pointtimeDiv').removeClass('has-warning has-error');
                                    $(this).find('input[name="pointtime"]').next('span').removeClass('glyphicon-remove glyphicon-warning-sign').addClass('has-success');
                                }

                            }
                            // 找到左边对应的点数据 赋值到左边
                            var p = rowData['FLOWCONTROL_POINT'];
                            var pointId = $(this).find('span[name="pointId"]').html();
                            if (p == pointId) {
                                // 已经过点不进行联动
                                if (!dateElement.prop("disabled")) {
                                    var curDate = $(this).find('input[name="pointdate"]').val();
                                    var curTime = $(this).find('input[name="pointtime"]').val();
                                    dateElement.val(curDate);
                                    timeElement.val(curTime);
                                }
                            }


                        });
                    });

                })();
            }


            // 绑定日期控件
            collaboratorDom.find('div#right').find(':text[name="pointdate"]').each(function () {
                // 添加时间控件
                $(this).attr("id", ++$.datepicker.uuid).removeClass("hasDatepicker").datepicker({
                    showButtonPanel: true,
                    closeText: '关闭',
                    currentText: '今天',
                    minDate: 0,
                    maxDate: 1,
                    dateFormat: 'yymmdd',
                    showAnim: 'toggle'
                });
            });

            // 如果某个点有A值,则其以上各点都不能修改
            collaboratorDom.find('.more_point').each(function (ind, val) {
                var baseOrderid = $(this).find('input[name="orderid"]').val();
                var traA = $(this).find('input[name="traA"]').val();


                if ($.isValidVariable(traA)) {
                    collaboratorDom.find('.more_point').each(function (ind, val) {
                        var orderid = $(this).find('input[name="orderid"]').val();
                        if (parseInt(orderid) <= parseInt(baseOrderid)) {
                            $(this).find(':text[name="pointtime"]').prop("disabled", true);
                            $(this).find(':text[name="pointdate"]').prop("disabled", true);
                        }
                    });
                }
            });
            collaboratorDom.find('span#pointId').height('20px');
            //collaboratorDom.find('input#point-passtime-time').width('66px');

            // 联动选项 全部联动  向下联动 不联动
            var linkage =
                '<div class="form-group form-group-custom row">' +
                '<div class=" col-md-12 form-group-custom radio_groups">' +
                '<label>' +
                '<input type="radio" id="linkageType1" name="linkageType" checked="checked" value="1" />' +
                '<span>全部联动</span>' +
                '</label>' +
                '<label>' +
                '<input type="radio" id="linkageType2" name="linkageType"  value="2" />' +
                '<span>向下联动</span>' +
                '</label>' +
                '<label>' +
                '<input type="radio" id="linkageType3" name="linkageType"  value="3" />' +
                '<span>不联动</span>' +
                '</label>' +
                '</div>' +
                '</div>';
            collaboratorDom.find('div#right').append(linkage);
        }
    });


    // 绑定重置按钮事件
    collaboratorDom.find(':button#reset').click(function () {
        form.bootstrapValidator("resetForm");
        // 重置左侧
        dateElement.val(flowcontrolPointPassDate);
        timeElement.val(flowcontrolPointPasstime);

        // 重置右侧
        if ($.isValidVariable(collaboratorDom.find('div#right'))) {
            collaboratorDom.find('.more_point').each(function (ind, val) {
                var valuesOld = $(this).find('input[name="oldValue"]').val();
                if ($.isValidVariable(valuesOld)) {
                    $(this).find('input[name="pointdate"]').val(valuesOld.substring(0, 8));
                    $(this).find('input[name="pointtime"]').val(valuesOld.substring(8, 12));
                }
                $(this).find("div.pointtimeDiv").removeClass('has-error has-warning has-success');
                $(this).find("div.pointtimeDiv").find(':text[name="pointtime"]').next('span').removeClass('glyphicon-remove glyphicon-warning-sign glyphicon-ok');
            })
        }

    });


    // 提交前验证右侧所有时间格式
    var validateRightTimeElement = function () {
        collaboratorDom.find('.more_point').each(function (ind, val) {
            var inputTime = $(this).find(':text[name="pointtime"]');
            var timeValue = inputTime.val();
            var timeSpan = inputTime.next('span');
            var timeDivElement = inputTime.parent('.pointtimeDiv');
            if ($.isValidVariable(timeValue)) {
                if (!$(this).find(':text[name="pointtime"]').prop("disabled")) {
                    if (timeValue.length != 4) {
                        // 验证不通过，显示红色bootstrap信息，并提示错误原因
                        // 添加提示信息
                        thisProxy.showTableCellTipMessage(timeDivElement, 'WARN', '请输入正确的时间格式（HHmm），有效范围0000-2359');
                        // 添加样式
                        timeDivElement.removeClass('has-success has-error').addClass('has-warning');
                        timeSpan.removeClass('glyphicon-ok glyphicon-remove').addClass('glyphicon-warning-sign');
                    } else if (!RegExpUtil.time.test(timeValue)) {
                        // 验证不通过，显示红色bootstrap信息，并提示错误原因
                        // 添加提示信息
                        thisProxy.showTableCellTipMessage(timeDivElement, 'FAIL', '请输入正确的时间格式（HHmm），有效范围0000-2359');
                        // 添加样式
                        timeDivElement.removeClass('has-success has-warning').addClass('has-error');
                        timeSpan.removeClass('glyphicon-ok glyphicon-warning-sign').addClass('glyphicon-remove');
                    } else {
                        // 清除qtip信息
                        timeElement.qtip('destroy', true);
                        // 添加样式
                        timeDivElement.removeClass('has-error has-warning').addClass('has-success');
                        timeSpan.removeClass('glyphicon-remove glyphicon-warning-sign').addClass('glyphicon-ok');
                    }
                }
            } else {
                // 验证不通过，显示红色bootstrap信息，并提示错误原因
                // 添加提示信息
                thisProxy.showTableCellTipMessage(timeDivElement, 'FAIL', '请输入时间');
                // 添加样式
                timeDivElement.removeClass('has-success has-warning').addClass('has-error');
                timeSpan.removeClass('glyphicon-ok glyphicon-warning-sign').addClass('glyphicon-remove');
            }
        });
    };
    // 验证日期格式
    var validateDateElement = function () {
        // 获取值
        var dateValue = dateElement.val();
        // 验证
        if ($.isValidVariable(dateValue)) {
            // 验证通过，显示绿色bootstra信息   (验证通过，但是存在告警，显示黄色bootstrap信息)
            dateDivElement.removeClass('has-error').addClass('has-success');
            dateSpanElement.removeClass('glyphicon-remove').addClass('glyphicon-ok');
            return true;
        } else {
            // 验证不通过，显示红色bootstrap信息，并提示错误原因
            // 添加提示信息
            thisProxy.showTableCellTipMessage(dateElement, 'FAIL', '请选择日期');
            // 添加样式
            dateDivElement.removeClass('has-success').addClass('has-error');
            dateSpanElement.removeClass('glyphicon-ok').addClass('glyphicon-remove');
            return false;
        }
    };

    // 验证时间格式
    var validateTimeElement = function () {
        // 获取值
        var timeValue = timeElement.val();
        // 验证
        if ($.isValidVariable(timeValue)) {
            if (timeValue.length != 4) {
                // 验证不通过，显示红色bootstrap信息，并提示错误原因
                // 添加提示信息
                showCustomCellTipMessage(timeElement, 'WARN', '请输入正确的时间格式（HHmm），有效范围0000-2359');
                // 添加样式
                timeDivElement.removeClass('has-success has-error').addClass('has-warning');
                timeSpanElement.removeClass('glyphicon-ok glyphicon-remove').addClass('glyphicon-warning-sign');
                return false;
            } else if (!RegExpUtil.time.test(timeValue)) {
                // 验证不通过，显示红色bootstrap信息，并提示错误原因
                // 添加提示信息
                showCustomCellTipMessage(timeElement, 'FAIL', '请输入正确的时间格式（HHmm），有效范围0000-2359');
                // 添加样式
                timeDivElement.removeClass('has-success has-warning').addClass('has-error');
                timeSpanElement.removeClass('glyphicon-ok glyphicon-warning-sign').addClass('glyphicon-remove');
                return false;
            } else {
                // 清除qtip信息
                timeElement.qtip('destroy', true);
                // 添加样式
                timeDivElement.removeClass('has-error has-warning').addClass('has-success');
                timeSpanElement.removeClass('glyphicon-remove glyphicon-warning-sign').addClass('glyphicon-ok');
                return true;
            }
        } else {
            // 验证不通过，显示红色bootstrap信息，并提示错误原因
            // 添加提示信息
            showCustomCellTipMessage(timeElement, 'FAIL', '请输入时间');
            // 添加样式
            timeDivElement.removeClass('has-success has-warning').addClass('has-error');
            timeSpanElement.removeClass('glyphicon-ok glyphicon-warning-sign').addClass('glyphicon-remove');
            return false;
        }

    };
    // 日期验证
    dateElement.bind('change', validateDateElement);
    // 时间验证
    timeElement.bind('keyup', validateTimeElement);
    // 绑定udpate事件
    form.find(':button#update').click(function () {
        if (!validateDateElement() || !validateTimeElement()) {
            // 验证不通过，返回
            return;
        }

        validateRightTimeElement();
        var hasErr = false;
        collaboratorDom.find('.has-error').each(function (ind, val) {
            hasErr = true;
            return;
        });
        collaboratorDom.find('.has-warning').each(function (ind, val) {
            hasErr = true;
            return;
        });
        if (hasErr) {
            return;
        }

        // 受控航路点过点时间
        var comment = form.find('#comment').val();
        var approveTime = dateElement.val() + timeElement.val();
        var lockedValue = lockedElement.prop('checked') == true ? lockedElement.val() : null;

        var pointStr = '';
        var passtimeStr = '';
        // 遍历找出更新的点
        collaboratorDom.find('.more_point').each(function (ind, val) {
            var curDate = $(this).find('input[name="pointdate"]').val();
            var curTime = $(this).find('input[name="pointtime"]').val();
            var valueNew = curDate + curTime;

            var valuesOld = $(this).find('input[name="oldValue"]').val();
            $(this).find('input[name="passtime"]').val(valueNew);

            var fix = $(this).find('span[name="pointId"]').html();

//            if (valuesOld == valueNew) {
//                $(this).find('input[name="pointId"]').attr("disabled", "disabled");
//                $(this).find('input[name="passtime"]').attr("disabled", "disabled");
//
//            } else {
            // 组装参数
            pointStr += fix + ',';
            passtimeStr += valueNew + ',';
//            }
        })
        pointStr = pointStr.substring(0, pointStr.length - 1);
        passtimeStr = passtimeStr.substring(0, passtimeStr.length - 1);

        // 多点更新的情况
        if (collaboratorDom.find('div#right').is(":visible") && $.isValidVariable(pointStr)) {
            dhtmlx.confirm({
                title: '提示', ok: '确定', cancel: '取消', text: '确定修改多个过点时间？', callback: function (result) {
                    if (result == true) {
                        $.ajax({
                            url: thisProxy.colCollaborateUrl.UPDATE_FLOWCONTROL_POINT_PASSTIME,
                            data: {
                                'type': 'MULIT',
                                'id': flight.id,
                                'fix': pointStr,
                                'passtime': passtimeStr,
                                'caseId': sceneCaseId,
                                'comment': comment,
                                'lockedValue': lockedValue
                            },
                            type: 'POST',
                            dataType: 'json',
                            success: function (data, status, xhr) {
                                //重新监听冻结
                                thisProxy.clearCollaborateContainer();
                                if ($.isValidVariable(data)) {
                                    thisProxy.afterCollaborate(data);
                                    var flightid = flight.fmeToday.flightid;
                                    var messsage = '';
                                    if ($.isValidVariable(flightid)) {
                                        messsage = flightid + '受控时间修改成功';
                                    } else {
                                        messsage = '受控时间修改成功';
                                    }
                                    thisProxy.showTableCellTipMessage(opts, 'SUCCESS', messsage);
                                } else {
                                    thisProxy.showTableCellTipMessage(opts, 'FAIL', '受控时间修改失败，请稍后重新尝试');
                                }

                            },
                            error: function (xhr, status, error) {
                                console.error(error);
                                thisProxy.showTableCellTipMessage(opts, 'FAIL', '受控时间修改失败，请稍后重新尝试');
                            }
                        });
                    }
                }
            });

        } else {

            // 验证通过，提交表单
            $.ajax({
                url: thisProxy.colCollaborateUrl.UPDATE_FLOWCONTROL_POINT_PASSTIME,
                data: {
                    'type': 'SINGLE',
                    'id': flight.id,
                    'fix': flowcontrolPoint,
                    'passtime': approveTime,
                    'caseId': sceneCaseId,
                    'comment': comment,
                    'lockedValue': lockedValue
                },
                type: 'POST',
                dataType: 'json',
                success: function (data, status, xhr) {
                    //重新监听冻结
                    thisProxy.clearCollaborateContainer();
                    if ($.isValidVariable(data)) {
                        thisProxy.afterCollaborate(data);
                        var flightid = flight.fmeToday.flightid;
                        var messsage = '';
                        if ($.isValidVariable(flightid)) {
                            messsage = flightid + '受控时间修改成功';
                        } else {
                            messsage = '受控时间修改成功';
                        }
                        thisProxy.showTableCellTipMessage(opts, 'SUCCESS', messsage);
                    } else {
                        thisProxy.showTableCellTipMessage(opts, 'FAIL', '受控时间修改失败，请稍后重新尝试');
                    }

                },
                error: function (xhr, status, error) {
                    console.error(error);
                    thisProxy.showTableCellTipMessage(opts, 'FAIL', '受控时间修改失败，请稍后重新尝试');
                }
            });
        }

    });
    // 绑定clear事件
    form.find(':button#clear').click(function () {

        dhtmlx.confirm({
            title: '提示', ok: '确定', cancel: '取消', text: '确定撤销？', callback: function (result) {
                if (result == true) {
                    // 清除数据
                    dateElement.val('');
                    timeElement.val('');
                    // 清除样式
                    dateDivElement.removeClass('has-error has-success has-warning');
                    timeDivElement.removeClass('has-error has-success has-warning');
                    dateSpanElement.removeClass('glyphicon-ok glyphicon-remove glyphicon-warning-sign');
                    timeSpanElement.removeClass('glyphicon-ok glyphicon-remove glyphicon-warning-sign');
                    // 清除提示信息
                    dateElement.qtip('destroy', true);
                    timeElement.qtip('destroy', true);
                    // 提交表单
                    $.ajax({
                        url: thisProxy.colCollaborateUrl.CLEAR_FLOWCONTROL_POINT_PASSTIME,
                        data: {id: flight.id},
                        type: 'POST',
                        dataType: 'json',
                        success: function (data, status, xhr) {
                            //重新监听冻结
                            thisProxy.clearCollaborateContainer();

                            if ($.isValidVariable(data)) {
                                thisProxy.afterCollaborate(data);
                                var flightid = flight.fmeToday.flightid;
                                var messsage = '';
                                if ($.isValidVariable(flightid)) {
                                    messsage = flightid + '受控时间修改成功';
                                } else {
                                    messsage = '受控时间修改成功';
                                }
                                thisProxy.showTableCellTipMessage(opts, 'SUCCESS', messsage);
                            } else {
                                thisProxy.showTableCellTipMessage(opts, 'FAIL', '受控时间修改失败，请稍后重新尝试');
                            }
                        },
                        error: function (xhr, status, error) {
                            console.error(error);
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', '受控时间修改失败，请稍后重新尝试');
                        }
                    });
                }
            }
        });

    });
    // 给右上角关闭按钮绑定事件
    $(".flight-grid-table-collaborate-container .modal-close-btn").on("click", function () {
        thisProxy.closeCurrentModal(form);
    });

};

/**
 * DEICE-STATUS协调
 * @param rowid 行id
 * @param iRow 行索引
 * @param iCol 列索引
 * @param cellObj 单元格对象
 */
FlightGridTable.prototype.collaborateDeiceStatus = function (rowid, iRow, iCol, cellObj) {
    // 代理
    var thisProxy = this;
    var opts = {
        rowid : rowid,
        iRow : iRow,
        iCol : iCol
    };
    // 获取行数据
    var rowData = this.tableDataMap[rowid];
    // 获取航班数据
    var flight = this.data.result[rowid];
    // 获取生成时间
    var generateTime = this.data.generateTime;
    // 权限
    if (!this.colEdit['UDPATE_DEICE_STATUS'] || !this.colEdit['CLEAR_DEICE_STATUS']) {
        return;
    }
    if (!$.isValidVariable(this.colAuthority[306])) {
        return;
    }
    // 已锁定,提示
    if ($.isValidVariable(flight.ctd)
        || $.isValidVariable(flight.cobt)) {
        thisProxy.showTableCellTipMessage(opts, 'WARN', '调整除冰状态,会清空COBT/CTD,造成航班向后移动');
    }
    // 获取协调DOM元素
    var collaboratorDom = $(FlightGridTableCollaborateDom.UPDATE_DEICE_STATUS);
    //协调记录显示
    thisProxy.showCollaborator(collaboratorDom, cellObj);
    // 按钮
    var updateButton = collaboratorDom.find('button#update');
    var cancelButton = collaboratorDom.find('button#clear');
    if (this.colEdit['UDPATE_DEICE_STATUS']) {
        updateButton.show();
    } else {
        updateButton.hide();
    }
    if (this.colEdit['CLEAR_DEICE_STATUS']) {
        cancelButton.show();
    } else {
        cancelButton.hide();
    }
    //若单元格的值为空，则不显示清除按钮
    var cellText = cellObj.html();
    if("" == cellText || "&nbsp;" == cellText){
        cancelButton.hide();
    }
    // 机场
    var airport = rowData.DEPAP;
    if (!$.isValidVariable(airport)) {
        airport = 'ZZZZ';
    }
    var airportConfigs;
    if ($.isValidVariable(this.baseData.airportConfigs[airport])) {
        airportConfigs = this.baseData.airportConfigs[airport];
    } else {
        airportConfigs = this.baseData.airportConfigs['ZZZZ'];
    }
    // 添加除冰坪数据
    var deice_position_select = collaboratorDom.find('#deice-position-select');
    deice_position_select.empty();
    if ($.isValidVariable(airportConfigs) && $.isValidVariable(airportConfigs.deicePosition)) {
        var deicePositionArray = airportConfigs.deicePosition.split('/');
        $.each(deicePositionArray, function (i, item) {
            $('<option value="' + item + '">' + item + '</option>').appendTo(deice_position_select);
        });
    } else {
        deice_position_select.append('<option value=""></option>');
    }
    // 添加除冰组数据
    var deice_group_select = collaboratorDom.find('#deice-group-select');
    deice_group_select.empty();
    if ($.isValidVariable(this.baseData.deiceGroups)) {
        var deiceGroupArray = this.baseData.deiceGroups.split(',');
        $.each(deiceGroupArray, function (i, item) {
            deice_group_select.append('<option value="' + item + '">' + item + '</option>');
        });
    } else {
        deice_group_select.append('<option value=""></option>');
    }
    // JQuery对象
    var form = collaboratorDom.find('form');
    var deicePositionSelectElement = $('#deice-position-select');
    var positionElement = $('#position');
    var positionDivElement = positionElement.parent('.input-group');
    var positionSpanElement = positionElement.next('span');
    var deicePositionGroupSelectElement = $('#deice-group-select');
    // 初始化选中 TODO
    $('#deice-position-radio').prop('checked', true);
    positionElement.prop('disabled', true);
    // 根据选中项显示和禁止操作
    var isDisabledDeicePosition = function () {
        var radioValue = $("input[name='deice-position']:checked").val();
        if (radioValue == 0) {
            deicePositionSelectElement.prop('disabled', false);
            positionElement.prop('disabled', true);
        } else if (radioValue == 1) {
            positionElement.prop('disabled', false);
            deicePositionSelectElement.prop('disabled', true);
        }
    };
    // 判断选中值显示输入框或下拉框
    $("input[name='deice-position']").bind('change', isDisabledDeicePosition);
    // 验证
    var validatePositionSelectElement = function () {
        var deicePositionSelectValue = deicePositionSelectElement.val();
//        if ($.isValidVariable(deicePositionSelectValue)) {
        // 验证通过
        return true;
//        } else {
//            // 验证不通过
//            thisProxy.showTableCellTipMessage(deicePositionSelectElement, 'FAIL', '请选择除冰坪');
//            return false;
//        }
    };
    var validatePositionElement = function () {
        var positionValue = positionElement.val();
        if ($.isValidVariable(positionValue)) {
            // 验证通过
            // 清除提示信息
            positionElement.qtip('destroy', true);
            // 验证通过，显示绿色bootstra信息   (验证通过，但是存在告警，显示黄色bootstrap信息)
            positionDivElement.removeClass('has-error').addClass('has-success');
            positionSpanElement.removeClass('glyphicon-remove').addClass('glyphicon-ok');
            return true;
        } else {
            // 验证不通过
            thisProxy.showTableCellTipMessage(positionElement, 'FAIL', '请输入停机位');
            // 添加样式
            positionDivElement.removeClass('has-success').addClass('has-error');
            positionSpanElement.removeClass('glyphicon-ok').addClass('glyphicon-remove');
            return false;
        }
    };
    var validatePositionGroupSelectElement = function () {
        var deicePositionGroupSelectValue = deicePositionGroupSelectElement.val();
//        if ($.isValidVariable(deicePositionGroupSelectValue)) {
//            // 验证通过
        return true;
//        } else {
//            // 验证不通过
//            thisProxy.showTableCellTipMessage(deicePositionGroupSelectElement, 'FAIL', '请选择除冰组');
//            return false;
//        }
    };

    // 赋值表单的数据
    form.find(':hidden[name="id"]').val(flight.id);

    // 绑定udpate事件
    form.find(':button#update').click(function () {
        var radioValue = $("input[name='deice-position']:checked").val();
        var deicePosition = "";
        if (radioValue == 0) {
            if (!validatePositionSelectElement() || !validatePositionGroupSelectElement()) {
                return;
            } else {
                deicePosition = deicePositionSelectElement.val();
            }
        } else if (radioValue == 1) {
            if (!validatePositionElement() || !validatePositionGroupSelectElement()) {
                return;
            } else {
                deicePosition = positionElement.val();
            }
        }
        form.find(':hidden[name="deiceStatus"]').val(FlightCoordination.STATUS_DEICE_ON);
        form.find(':hidden[name="deicePosition"]').val(deicePosition);
        //除冰分组
        form.find(':hidden[name="deiceGroup"]').val(deicePositionGroupSelectElement.val());

        //初始化按钮loading
        var loading = Ladda.create(this);
        //启动按钮loading
        loading.start();
        cancelButton.prop("disabled",true);
        // 验证通过，提交表单
        $.ajax({
            url: thisProxy.colCollaborateUrl.UPDATE_DEICE_STATUS,
            data: form.serialize(),
            type: 'POST',
            dataType: 'json',
            success: function (data, status, xhr) {
                //停止按钮loading
                loading.stop();
                cancelButton.prop("disabled",false);
                try {
                    //清理协调窗口
                    thisProxy.clearCollaborateContainer();
                    // 判断是否有返回结果
                    if ($.isValidVariable(data)) {
                        // 有返回结果，判断是否出错
                        if ($.isValidVariable(data.error)) {
                            // 错误
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                        } else {
                            // 正常
                            var flight = data.flightCoordination;
                            thisProxy.afterCollaborate(flight);
                            thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '航班除冰已提交');
                        }
                    } else {
                        // 无返回结果，未知异常情况
                        thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班除冰失败, 稍后请重新尝试');
                    }
                } catch (e) {
                    console.error("update deicec status failed");
                    console.error(e.stack);
                }
            },
            error: function (xhr, status, error) {
                //停止按钮loading
                loading.stop();
                cancelButton.prop("disabled",false);
                thisProxy.showTableCellTipMessage(opts, 'FAIL', '航班除冰失败，请稍后重新尝试');
            }
        });
    });
    // 绑定clear事件
    form.find(':button#clear').click(function () {
        // 清除数据
        deicePositionSelectElement.val('');
        positionElement.val('');
        deicePositionGroupSelectElement.val('');
        // 清除样式
        deicePositionSelectElement.removeClass('has-error has-success');
        positionElement.removeClass('has-error has-success');
        deicePositionGroupSelectElement.removeClass('has-error has-success');
        deicePositionSelectElement.removeClass('glyphicon-ok glyphicon-remove');
        positionElement.removeClass('glyphicon-ok glyphicon-remove');
        deicePositionGroupSelectElement.removeClass('glyphicon-ok glyphicon-remove');
        // 清除提示信息
        deicePositionSelectElement.qtip('destroy', true);
        positionElement.qtip('destroy', true);
        deicePositionGroupSelectElement.qtip('destroy', true);
        // 清除协调窗口
        //除冰状态
        form.find(':hidden[name="deiceStatus"]').val(FlightCoordination.STATUS_DEICE_OFF_MANUAL);
        //除冰坪
        form.find(':hidden[name="deicePosition"]').val('');
        //除冰分组
        form.find(':hidden[name="deiceGroup"]').val('');
        //初始化按钮loading
        var loading = Ladda.create(this);
        //启动按钮loading
        loading.start();
        updateButton.prop("disabled",true);
        $.ajax({
            url: thisProxy.colCollaborateUrl.CLEAR_DEICE_STATUS,
            data: form.serialize(),
            type: 'POST',
            dataType: 'json',
            success: function (data, status, xhr) {
                //停止按钮loading
                loading.stop();
                updateButton.prop("disabled",false);
                try {
                    //清理协调窗口
                    thisProxy.clearCollaborateContainer();
                    // 判断是否有返回结果
                    if ($.isValidVariable(data)) {
                        // 有返回结果，判断是否出错
                        if ($.isValidVariable(data.error)) {
                            // 错误
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                        } else {
                            // 正常
                            var flight = data.flightCoordination;
                            thisProxy.afterCollaborate(flight);
                            thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '清除航班除冰已提交');
                        }
                    } else {
                        // 无返回结果，未知异常情况
                        thisProxy.showTableCellTipMessage(opts, 'FAIL', '清除航班除冰失败, 稍后请重新尝试');
                    }
                } catch (e) {
                    console.error('clear deice status failed');
                    console.error(e.stack);
                }
            },
            error: function (xhr, status, error) {
                //停止按钮loading
                loading.stop();
                updateButton.prop("disabled",false);
                thisProxy.showTableCellTipMessage(opts, 'FAIL', '清除航班除冰失败，请稍后重新尝试');
            }
        });
    });
    // 给右上角关闭按钮绑定事件
    $(".flight-grid-table-collaborate-container .modal-close-btn").on("click", function () {
        thisProxy.closeCurrentModal(form);
    });
};

/**
 * DEICE-POSITION协调
 * @param rowid 行id
 * @param iRow 行索引
 * @param iCol 列索引
 * @param cellObj 单元格对象
 */
FlightGridTable.prototype.collaborateDeicePosition = function (rowid, iRow, iCol, cellObj) {
    // 代理
    var thisProxy = this;
    var opts = {
        rowid : rowid,
        iRow : iRow,
        iCol : iCol
    };
    // 获取行数据
    var rowData = this.tableDataMap[rowid];
    // 获取航班数据
    var flight = this.data.result[rowid];
    // 获取生成时间
    var generateTime = this.data.generateTime;
    // 权限
    if (!this.colEdit['UDPATE_DEICE_POSITION'] || !this.colEdit['CLEAR_DEICE_POSITION']) {
        return;
    }
    if (!$.isValidVariable(this.colAuthority[306])) {
        return;
    }
    // 已锁定,提示
    if ($.isValidVariable(flight.ctd)
        || $.isValidVariable(flight.cobt)) {
        thisProxy.showTableCellTipMessage(opts, 'WARN', '调整除冰状态,会清空COBT/CTD,造成航班向后移动');
    }
    // 获取协调DOM元素
    var collaboratorDom = $(FlightGridTableCollaborateDom.UPDATE_DEICE_POSITION);
    //协调记录显示
    thisProxy.showCollaborator(collaboratorDom, cellObj);
    // 按钮
    var updateButton = collaboratorDom.find('button#update');
    var cancelButton = collaboratorDom.find('button#cancel');
    if (this.colEdit['UDPATE_DEICE_POSITION']) {
        updateButton.show();
    } else {
        updateButton.hide();
    }
    if (this.colEdit['CLEAR_DEICE_POSITION']) {
        cancelButton.show();
    } else {
        cancelButton.hide();
    }
    //若单元格的值为空，则不显示清除按钮
    var cellText = cellObj.html();
    if("" == cellText || "&nbsp;" == cellText){
        cancelButton.hide();
    }

    // 机场
    var airport = rowData.DEPAP;
    if (!$.isValidVariable(airport)) {
        airport = 'ZZZZ';
    }
    var airportConfigs;
    if ($.isValidVariable(this.baseData.airportConfigs[airport])) {
        airportConfigs = this.baseData.airportConfigs[airport];
    } else {
        airportConfigs = this.baseData.airportConfigs['ZZZZ'];
    }
    // 添加除冰坪数据
    var deice_position_select = collaboratorDom.find('#deice-position-select');
    deice_position_select.empty();
    if ($.isValidVariable(airportConfigs.deicePosition)) {
        var deicePositionArray = airportConfigs.deicePosition.split('/');
        deice_position_select.append('<option value="">待定</option>');
        $.each(deicePositionArray, function (i, item) {
            $('<option value="' + item + '">' + item + '</option>').appendTo(deice_position_select);
        });
    } else {
        deice_position_select.append('<option value=""></option>');
    }
    // 添加除冰组数据
    var deice_group_select = collaboratorDom.find('#deice-group-select');
    deice_group_select.empty();
    if ($.isValidVariable(this.baseData.deiceGroups)) {
        var deiceGroupArray = this.baseData.deiceGroups.split(',');
        deice_group_select.append('<option value="">待定</option>');
        $.each(deiceGroupArray, function (i, item) {
            deice_group_select.append('<option value="' + item + '">' + item + '</option>');
        });
    } else {
        deice_group_select.append('<option value=""></option>');
    }

    // JQuery对象
    var form = collaboratorDom.find('form');
    var deicePositionSelectElement = $('#deice-position-select');
    // 验证
    var validatePositionSelectElement = function () {
        var deicePositionSelectValue = deicePositionSelectElement.val();
//        if ($.isValidVariable(deicePositionSelectValue)) {
        // 验证通过
        return true;
//        } else {
//            // 验证不通过
//            thisProxy.showTableCellTipMessage(deicePositionSelectElement, 'FAIL', '请选择除冰坪');
//            return false;
//        }
    };
    // 赋值表单的数据
    form.find(':hidden[name="id"]').val(flight.id);

    // 绑定udpate事件
    form.find(':button#update').click(function () {
        form.find(':hidden[name="deicePosition"]').val(deicePositionSelectElement.val());
        //初始化按钮loading
        var loading = Ladda.create(this);
        //启动按钮loading
        loading.start();
        cancelButton.prop("disabled",true);
        // 验证通过，提交表单
        $.ajax({
            url: thisProxy.colCollaborateUrl.UPDATE_DEICE_POSITION,
            data: form.serialize(),
            type: 'POST',
            dataType: 'json',
            success: function (data, status, xhr) {
                //停止按钮loading
                loading.stop();
                cancelButton.prop("disabled",false);
                try {
                    //清理协调窗口
                    thisProxy.clearCollaborateContainer();
                    // 判断是否有返回结果
                    if ($.isValidVariable(data)) {
                        // 有返回结果，判断是否出错
                        if ($.isValidVariable(data.error)) {
                            // 错误
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                        } else {
                            // 正常
                            var flight = data.flightCoordination;
                            thisProxy.afterCollaborate(flight);
                            thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '除冰坪修改已提交');
                        }
                    } else {
                        // 无返回结果，未知异常情况
                        thisProxy.showTableCellTipMessage(opts, 'FAIL', '除冰坪修改失败, 稍后请重新尝试');
                    }
                } catch (e) {
                    console.error("update deice position faild")
                    console.error(e.stack);
                }
            },
            error: function (xhr, status, error) {
                //停止按钮loading
                loading.stop();
                cancelButton.prop("disabled",false);
                thisProxy.showTableCellTipMessage(opts, 'FAIL', '除冰坪修改失败，请稍后重新尝试');
            }
        });
    });
    // 绑定clear事件
    form.find(':button#clear').click(function () {
        // 清除数据
        deicePositionSelectElement.val('');
        // 清除样式
        deicePositionSelectElement.removeClass('has-error has-success');
        positionElement.removeClass('has-error has-success');
        deicePositionGroupSelectElement.removeClass('has-error has-success');
        deicePositionSelectElement.removeClass('glyphicon-ok glyphicon-remove');
        positionElement.removeClass('glyphicon-ok glyphicon-remove');
        deicePositionGroupSelectElement.removeClass('glyphicon-ok glyphicon-remove');
        // 清除提示信息
        deicePositionSelectElement.qtip('destroy', true);
        positionElement.qtip('destroy', true);
        deicePositionGroupSelectElement.qtip('destroy', true);
        // 清除协调窗口
        //除冰坪
        form.find(':hidden[name="deicePosition"]').val("");
        //初始化按钮loading
        var loading = Ladda.create(this);
        //启动按钮loading
        loading.start();
        updateButton.prop("disabled",true);
        $.ajax({
            url: thisProxy.colCollaborateUrl.CLEAR_DEICE_POSITION,
            data: form.serialize(),
            type: 'POST',
            dataType: 'json',
            success: function (data, status, xhr) {
                //停止按钮loading
                loading.stop();
                updateButton.prop("disabled",false);
                try {
                    //清理协调窗口
                    thisProxy.clearCollaborateContainer();
                    // 判断是否有返回结果
                    if ($.isValidVariable(data)) {
                        // 有返回结果，判断是否出错
                        if ($.isValidVariable(data.error)) {
                            // 错误
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                        } else {
                            // 正常
                            var flight = data.flightCoordination;
                            thisProxy.afterCollaborate(flight);
                            thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '除冰坪修改已提交');
                        }
                    } else {
                        // 无返回结果，未知异常情况
                        thisProxy.showTableCellTipMessage(opts, 'FAIL', '除冰坪修改失败, 稍后请重新尝试');
                    }
                }
                catch (e) {
                    console.error("clear deice position failed");
                    console.error(e.stack);
                }
            },
            error: function (xhr, status, error) {
                //停止按钮loading
                loading.stop();
                updateButton.prop("disabled",false);
                thisProxy.showTableCellTipMessage(opts, 'FAIL', '除冰坪修改失败，请稍后重新尝试');
            }
        });
    });
    // 给右上角关闭按钮绑定事件
    $(".flight-grid-table-collaborate-container .modal-close-btn").on("click", function () {
        thisProxy.closeCurrentModal(form);
    });
};

/**
 * 批量指定航班时隙
 *
 * @param params
 */
FlightGridTable.prototype.collaborateMultiFlightsLock = function (params) {
    var thisProxy = this;
    $.ajax({
        url: "flight_multi_lock.action",
        traditional: true,
        data: params,
        type: 'POST',
        dataType: 'json',
        success: function (data, status, xhr) {
            try {
                // 判断返回结果有效性
                if (data == undefined || data == null) {
                    BootstrapDialogFactory.dialog({
                        title: '航班批量锁定',
                        content: '航班批量锁定失败，返回无效数据',
                        status: 3
                    });
                    return;
                }
                // 判断返回结果状态，决定显示问题
                if (data.status != 200) {
                    BootstrapDialogFactory.dialog({
                        title: '航班批量锁定失败',
                        content: data.error.message,
                        status: 3
                    });
                    return;
                }
                // 触发数据更新
                firAreaFlightsMultiDataChange(data.flights);
            } catch (e) {
                console.error('multiple locked failed');
                console.error(e.stack);
            }
            thisProxy.clearCollaborateContainer();
        },
        error: function (xhr, status, error) {
            BootstrapDialogFactory.dialog({
                title: '航班批量锁定失败',
                content: '航班批量锁定失败，服务器端请求错误',
                status: 3
            });
            console.error(error);
        }
    });
};

/**
 * 判断是否包含指定rowid的航班
 *
 * @param rowid
 * @returns {boolean}
 */
FlightGridTable.prototype.contains = function (rowid) {
    return this.tableDataMap[rowid] != undefined || this.tableDataMap[rowid] != null;
};

/**
 * 定位并高亮显示指定rowid的航班
 *
 * @param rowid
 */
FlightGridTable.prototype.highlight = function (rowid) {
    // 清空所有选中行
    this.gridTableObject.jqGrid('resetSelection');
    // 选中行
    this.gridTableObject.jqGrid('setSelection', rowid, false);
    // 滚动到指定id对应的行
    this.scrollToRow(rowid);
};

/**
 * 滚动到指定行id
 *
 * @param rowid
 * @param num 可选
 */
FlightGridTable.prototype.scrollToRow = function (rowid, num) {
    var rowTr = this.gridTableObject.find('tr#' + rowid);
    var iCol = rowTr.find('td').first().text();
    if (!$.isValidVariable(num)) {
        num = 5;
    }
    var rowFirstTd = rowTr.find('td').first()[0];
    if ($.isValidVariable(rowFirstTd)) {
        var offsetHeight = rowFirstTd.offsetHeight;
        var offsetTop = rowFirstTd.offsetTop;
        var scrollHeight = 0;
        if ($.isValidVariable(iCol)) {
            if (iCol > 5) {
                // 留一定空间给相同时间的航班数据
                iCol = iCol - 5;
                scrollHeight = offsetTop - offsetHeight * num;
            } else {
                scrollHeight = offsetTop;
            }
            this.canvas.find("div.ui-jqgrid-bdiv").each(function(){
                $(this).scrollTop(scrollHeight);
            });
        }
    }
};

/**
 * 重新加载表格
 */
FlightGridTable.prototype.unloadGrid = function () {
    // 重新加载表格
    $.jgrid.gridUnload(this.tableId);
    // 清除协调窗口
    this.clearCollaborateContainer();
    // 初始化
    this.initGridTableObject();
    // 加载数据
    this.drawGridTableData();
    this.resizeFrozenTable();
};

/**
 * 添加锁定popover
 */
FlightGridTable.prototype.addLockPopover = function (pos) {
    var _this = this;
    //加载监听框
    var contentHtml = '<div><span class="multi-content">移动<input value="0" type="text" class="multi-content-input" min="-999" max="999" />分钟</span><button class="btn btn-primary multi-lock-btn">锁定</button><div class="checkbox multi-checkbox"><label><input type="checkbox" checked="checked" name="lockedValue" value="2">禁止系统自动调整 </label></div><div>';
    $('#' + this.canvasId + ' .glyphicon-lock').popover({
        trigger: 'click',
        "title": "批量锁定",
        "placement": pos,
        "html": true,
        "content": contentHtml
    });
    $('#' + this.canvasId + ' .glyphicon-lock').on("click", function () {
        _this.openMultiFlightsLockDialog(_this);
    });
};

/**
 * 清空表格数据
 */
FlightGridTable.prototype.clearGridData = function () {
    // 清除协调窗口
    this.clearCollaborateContainer();
    // 清空表格数据
    this.gridTableObject.jqGrid('clearGridData');
    this.data = {};
    this.tableData = [];
    this.tableDataMap = {};
};

/**
 * 获取单元格对象
 *
 * @param rowid
 * @param iRow
 * @param iCol
 * @returns
 */
FlightGridTable.prototype.getCellObject = function (rowid, iRow, iCol) {
    if ($.type(iCol) === 'string') {
        // 字符类型，计算列名在表格中的列index值
        var colModel = this.gridTableObject.getGridParam('colModel');
        var colIndex = null;
        for (var index in colModel) {
            if (colModel[index].name == iCol) {
                colIndex = index;
                break;
            }
        }
        return this.gridTableObject.find('tr#' + rowid).find('td').eq(colIndex);
    } else {
        return this.gridTableObject.find('tr#' + rowid).find('td').eq(iCol);
    }
};

/**
 * 打开航班详情对话框
 *
 * @param flight
 */
FlightGridTable.prototype.openFlightDetail = function (flight) {
    var flightId = flight.id;
    var generate_time = this.generateTime;
    var dhxWins = new dhtmlXWindows();
    dhxWins.attachViewportTo("winVP");
    var dataTime = new Date().getMilliseconds();
    var id = flight.id + dataTime;
    var winParams = {
        id: id,
        width: 1280,
        height: 800,
        center: true,
        move: true
    };
    dhxWins.createWindow(winParams);
    dhxWins.window(id).setText(flightId + "航班详情");
    var date = new Date();
    var gridId = date.getMilliseconds()
    dhxWins.window(id).attachHTMLString('<div class="flight_detail_container"><div class="flight_detail_title"><span><label>ID:<span id="' + flightId + 'title_id"></span></label><label id="' + flightId + 'title_flightid"></label><label id="' + flightId + 'title_executedate"></label><label id="' + flightId + 'title_depap"></label><label id="' + flightId + 'title_arrap"></label><label id="' + flightId + 'title_status"></label><label id="' + flightId + 'title_generatetime"></label></span></div><div class="flight_detail_info_basic"><div class="flight_detail_item"><div class="flight_detail_item_title">航班信息</div><table class="flight_detail_table"><tr><th>航班号</th><td><label id="' + flightId + 'flightid"></label></td><th>所属公司</th><td><label id="' + flightId + 'carrier"></label></td></tr><tr><th>注册号</th><td><label id="' + flightId + 'regnum"></label></td><th>机型</th><td><label id="' + flightId + 'actype"></label></td></tr><tr><th>报文记录</th><td><label id="' + flightId + 'teletype"></label></td><th>最新报文</th><td><label id="' + flightId + 'telenew"></label></td></tr><tr><th>起飞机场</th><td><label id="' + flightId + 'depap"></label></td><th>降落机场</th><td><label id="' + flightId + 'arrap"></label></td></tr><tr><th>计划起飞时间</th><td><label id="' + flightId + 'sdeptime"></label></td><th>计划降落时间</th><td><label id="' + flightId + 'sarrtime"></label></td></tr><tr><th>计划航路</th><td colspan="3"><label id="' + flightId + 'sroute"></label></td></tr><tr><th>FPL起飞时间</th><td><label id="' + flightId + 'pdeptime"></label></td><th>FPL降落时间</th><td><label id="' + flightId + 'parrtime"></label></td></tr><tr><th>FPL航路</th><td colspan="3"><label id="' + flightId + 'proute"></label></td></tr><tr><th>CPL信息</th><td colspan="3"><label id="' + flightId + 'cplinfo"></label></td></tr><tr><th class="font-bold">前段<label id="' + flightId + 'former_arrtime_e">预计</label><label id="' + flightId + 'former_arrtime_d">修正</label><label id="' + flightId + 'former_arrtime_r">实际</label>降落时间</th><td><label id="' + flightId + 'former_earrtime"></label></td><th>本段预计关门时间</th><td><label id="' + flightId + 'basic_tobt"></label></td></tr><tr><th>上客时间</th><td><label id="' + flightId + 'asbt" class="flight_detail_table_edit_field" ></label></td><th>关门时间</th><td><label id="' + flightId + 'agct" class="flight_detail_table_edit_field" ></label></td></tr><tr><th>实际起飞时间</th><td><label id="' + flightId + 'rdeptime"></label></td><th>实际降落时间</th><td><label id="' + flightId + 'rarrtime"></label></td></tr></table></div><div class="flight_detail_item"><div class="flight_detail_item_title">前段航班信息<span id="' + flightId + 'former_title"></span></div><table class="flight_detail_table"><tr><th>航班号</th><td><label id="' + flightId + 'former_flightid"></label></td><th>所属公司</th><td><label id="' + flightId + 'former_carrier"></label></td></tr><tr><th>注册号</th><td><label id="' + flightId + 'former_regnum"></label></td><th>机型</th><td><label id="' + flightId + 'former_actype"></label></td></tr><tr><th>报文记录</th><td><label id="' + flightId + 'former_teletype"></label></td><th>最新报文</th><td><label id="' + flightId + 'former_telenew"></label></td></tr><tr><th>起飞机场</th><td><label id="' + flightId + 'former_depap"></label></td><th>降落机场</th><td><label id="' + flightId + 'former_arrap"></label></td></tr><tr><th>计划起飞时间</th><td><label id="' + flightId + 'former_sdeptime"></label></td><th>计划降落时间</th><td><label id="' + flightId + 'former_sarrtime"></label></td></tr><tr><th>计划航路</th><td colspan="3"><label id="' + flightId + 'former_sroute"></label></td></tr><tr><th>FPL起飞时间</th><td><label id="' + flightId + 'former_pdeptime"></label></td><th>FPL降落时间</th><td><label id="' + flightId + 'former_parrtime"></label></td></tr><tr><th>FPL航路</th><td colspan="3"><label id="' + flightId + 'former_proute"></label></td></tr><tr><th>CPL信息</th><td colspan="3"><label id="' + flightId + 'former_cplinfo"></label></td></tr><tr><th>关门时间</th><td><label id="' + flightId + 'former_agct"></label></td><th>推出时间</th><td><label id="' + flightId + 'former_aobt"></label></td></tr><tr><th>实际起飞时间</th><td><label id="' + flightId + 'former_rdeptime"></label></td><th>实际降落时间</th><td><label id="' + flightId + 'former_rarrtime"></label></td></tr></table></div><div class="flight_detail_item"><div class="flight_detail_item_title">运行分析信息</div><table class="flight_detail_table"><tr><th>关门等待</th><td><label id="' + flightId + 'close_wait"></label></td><th>滑行等待</th><td><label id="' + flightId + 'taxi_wait"></label></td></tr><tr><th>离港延误SCH</th><td><label id="' + flightId + 's_delay"></label></td><th>离港延误FPL</th><td><label id="' + flightId + 'p_delay"></label></td></tr><tr><th>推出偏离(AOBT-COBT)</th><td><label id="' + flightId + 'outtime_deviate"></label></td><th>关门偏离(AGCT-COBT)</th><td><label id="' + flightId + 'colse_deviate"></label></td></tr><tr><th>起飞偏离(ATOT-CTOT)</th><td><label id="' + flightId + 'dep_deviate"></label></td></tr></table></div><div class="flight_detail_item"><div class="flight_detail_item_title">航迹信息<label id="' + flightId + 'flight_direction"></label></div><table class="flight_detail_table" id="' + flightId + 'trajectors_table"><tr><th class="flight_detail_table_empty"></th><th class="flight_detail_table_key">预计(P)</th><th class="flight_detail_table_key">计算(C)</th><th class="flight_detail_table_key">实际/修正(E)</th></tr></table></div></div><div class="flight_detail_info_cdm"><div class="flight_detail_item"><div class="flight_detail_item_title">机位&amp;跑道&amp;除冰信息</div><table class="flight_detail_table"><tr><th>机位</th><td><label class="flight_detail_table_edit_field" id="' + flightId + 'position"></label></td><th>跑道</th><td><label class="flight_detail_table_edit_field" id="' + flightId + 'runway"></label></td><th>滑行时间</th><td><label id="' + flightId + 'taxi"></label></td></tr><tr><th>是否除冰</th><td><label class="flight_detail_table_edit_field" id="' + flightId + 'deice_status"></label></td><th>除冰位</th><td><label class="flight_detail_table_edit_field" id="' + flightId + 'deice_position"></label></td><th>除冰组</th><td><label class="flight_detail_table_edit_field" id="' + flightId + 'deice_group"></label></td></tr></table></div><div class="flight_detail_item"><div class="flight_detail_item_title">协调信息</div><table class="flight_detail_table"><tr><th class="flight_detail_table_empty"></th><th class="flight_detail_table_key">OBT</th><th class="flight_detail_table_key">TOT</th><th class="flight_detail_table_key"><label id="' + flightId + 'appfix">APP FIX</label></th><th class="flight_detail_table_key"><label id="' + flightId + 'accfix">ACC FIX</label></th></tr><tr><th>FPL(E)</th><td><label id="' + flightId + 'eobt"></label></td><td><label id="' + flightId + 'etot"></label></td><td><label id="' + flightId + 'e_appfix_time"></label></td><td><label id="' + flightId + 'e_accfix_time"></label></td></tr><tr><th>预计(T)</th><td><label class="flight_detail_table_edit_field" id="' + flightId + 'tobt"></label></td><td><label id="' + flightId + 'ttot"></label></td><td><label id="' + flightId + 't_appfix_time"></label></td><td><label id="' + flightId + 't_accfix_time"></label></td></tr><tr><th>协调(H)</th><td><label id="' + flightId + 'hobt"></label></td><td><label id="' + flightId + 'htot"></label></td><td><label id="' + flightId + 'h_appfix_time"></label></td><td><label id="' + flightId + 'h_accfix_time"></label></td></tr><tr><th>计算(C)</th><td><label class="flight_detail_table_edit_field" id="' + flightId + 'cobt"></label></td><td><label class="flight_detail_table_edit_field" id="' + flightId + 'ctot"></label></td><td><label id="' + flightId + 'c_appfix_time"></label></td><td><label id="' + flightId + 'c_accfix_time"></label></td></tr><tr><th>全国计算(N)</th><td><label id="' + flightId + 'ncobt"></label></td><td><label id="' + flightId + 'nctot"></label></td><td><label id="' + flightId + 'nc_appfix_time"></label></td><td><label id="' + flightId + 'nc_accfix_time"></label></td></tr><tr><th>实际(A)</th><td><label id="' + flightId + 'aobt"></label></td><td><label id="' + flightId + 'atot"></label></td><td><label id="' + flightId + 'a_appfix_time"></label></td><td><label id="' + flightId + 'a_accfix_time"></label></td></tr></table></div><div class="flight_detail_item"><div class="flight_detail_item_title">协调信息</div><table class="flight_detail_table"><tr><th class="flight_detail_table_key">优先级</th><th class="flight_detail_table_key">等待池</th><th class="flight_detail_table_key">时隙状态</th><th class="flight_detail_table_key">放行状态</th><th class="flight_detail_table_key">延误原因</th><th class="flight_detail_table_key">资质</th></tr><tr><td><label class="flight_detail_table_edit_field" id="' + flightId + 'priority"></label></td><td><label class="flight_detail_table_edit_field" id="' + flightId + 'pool_status"></label></td><td><label class="flight_detail_table_edit_field" id="' + flightId + 'slot_status"></label></td><td><label class="flight_detail_table_edit_field" id="' + flightId + 'clearance_status"></label></td><td><label class="flight_detail_table_edit_field" id="' + flightId + 'delay_reason"></label></td><td><label class="flight_detail_table_edit_field" id="' + flightId + 'qualifications"></label></td></tr></table></div><div class="flight_detail_item"><div class="flight_detail_item_title">命中流控</div><table class="flight_detail_table" id="' + flightId + 'flowcontrols_table"><tr><th class="flight_detail_table_key">名称</th><th class="flight_detail_table_key_type">类型</th><th class="flight_detail_table_key_value">限制值</th><th class="flight_detail_table_key_reason">原因</th><th class="flight_detail_table_key_source">来源</th><th class="flight_detail_table_key_status">状态</th></tr></table></div><div class="flight_detail_item"><div class="flight_detail_item_title">命中限制</div><table class="flight_detail_table" id="' + flightId + 'restriction_table"><tr><th class="flight_detail_table_key">名称</th><th class="flight_detail_table_key">类型</th><th class="flight_detail_table_key">限制值</th><th class="flight_detail_table_key">原因</th><th class="flight_detail_table_key">状态</th></tr></table></div><div class="flight_detail_item"><div class="flight_detail_item_title">协调记录</div><table class="flight_detail_table" id="' + flightId + 'flight_coordination_record_table"><tr><th class="flight_detail_table_key">协调类型</th><th class="flight_detail_table_key">协调前</th><th class="flight_detail_table_key">协调后</th><th class="flight_detail_table_key">协调备注</th><th class="flight_detail_table_key">协调状态</th><th class="flight_detail_table_key">协调时间</th><th class="flight_detail_table_key">协调用户</th><th class="flight_detail_table_key">协调用户IP</th></tr></table></div><div class="flight_detail_item"><div class="flight_detail_item_title">电子进程单</div><table class="flight_detail_table"><tr><th class="flight_detail_table_key">离场程序</th><th class="flight_detail_table_key">申请时间</th><th class="flight_detail_table_key">推出时间</th><th class="flight_detail_table_key">除冰坪</th><th class="flight_detail_table_key">进除冰区时间</th><th class="flight_detail_table_key">进除冰等待区时间</th><th class="flight_detail_table_key">出除冰等待区时间</th><th class="flight_detail_table_key">出除冰区时间</th><th class="flight_detail_table_key">上跑道时间</th></tr><tr><td id="' + flightId + 'efps_sid"></td><td id="' + flightId + 'efps_reqTime"></td><td id="' + flightId + 'efps_pusTime"></td><td id="' + flightId + 'efps_iceId"></td><td id="' + flightId + 'efps_inIceTime"></td><td id="' + flightId + 'efps_inDhlTime"></td><td id="' + flightId + 'efps_outDhlTime"></td><td id="' + flightId + 'efps_outIcTime"></td><td id="' + flightId + 'efps_linTime"></td></tr></table></div></div><div id="' + flightId + 'qtip-growl-container"></div></div>')
    FlightCoordinationDetailAndOperation.retrieveFlightDetailData(flight, flightId,generate_time);
    FlightCoordinationDetailAndOperation.bindComponentEvent();

};

/**
 * 打开协调记录对话框
 *
 * @param flight
 */
FlightGridTable.prototype.openFlightRecord = function (flight) {
    var winTitle = flight.fmeToday.flightid + '协调记录';
    var winUrl = this.colCollaborateUrl.OPEN_FLIGHT_RECORD + '?fid=' + flight.id;
    var winParams = {
        id: 'flight_record_' + winTitle + new Date(),
        width: 1080,
        height: 600,
        center: true,
        move: true
    };
    DhxIframeDialog.create(winTitle, winUrl, winParams);
};

/**
 * 打开指定前序航班对话框
 *
 * @param flight
 */
FlightGridTable.prototype.updateFormerFlight = function (flight) {
    var winTitle = flight.fmeToday.flightid + '指定前序航班';
    var winUrl = this.colCollaborateUrl.UPDATE_FORMER_FLIGHT + '?id=' + flight.id;
    var winParams = {
        //id: 'former_flight_' + flight.id,
        id: 'former_flight_dialog',
        width: 600,
        height: 240,
        center: true,
        move: true
    };
    DhxIframeDialog.create(winTitle, winUrl, winParams);
};

/**
 * 打开航班批量锁定对话框
 */
FlightGridTable.prototype.openMultiFlightsLockDialog = function (_this) {
    // 获取当前选择rowid，即航班ID
    var tableDom = _this.gridTableObject;
    var tableDomId = tableDom.attr("id");
    if (tableDomId.indexOf("compress") >= 0) {
        var newID = tableDomId.replace(/\-compress/, "");
        tableDom = $("#" + newID);
    }
    var selectedIDs = tableDom.jqGrid('getGridParam', 'selarrrow');
    if (selectedIDs == undefined || selectedIDs == null || selectedIDs.length <= 0) {
        BootstrapDialogFactory.dialog({
            title: '航班批量锁定',
            content: '尚未选择批量操作的航班',
            status: 2
        });
    } else {
        var lockedStatus = 2; //false:2 true:1
        $(".multi-checkbox").on('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            var checkbox = $(this).find("input[type='checkbox']");
            var checkVal = checkbox.prop("checked");
            checkbox.prop("checked", !checkVal);
            if (!checkVal) {
                lockedStatus = 1;
            }
            checkbox.val(lockedStatus);
        });
        function lockSubmit(event) {
            event.preventDefault();
            event.stopPropagation();
            var offset = $(".multi-content-input").val();
            var params = {
                "offset": offset,
                "lockedStatus": lockedStatus,
                "ids": selectedIDs
            };
            sendMultiLockAjax(params);

        }

        $(".multi-lock-btn").off('click', lockSubmit).on('click', lockSubmit);
        $("body").on('click', function (event) {
            console.warn('hit body click by grid');
            if ($(this).parent(".popover").length == 0) {
                $(".popover").popover("hide");
            }
        });
        $(".popover input.multi-content-input").on("keyup", function (e) {
            var offset = $(this).val();
            var reg = /^\-?\d{0,4}$/;
            if (offset != "") {//不为空
                if ((reg.test(offset))) { //验证通过
                    if (offset == "-") {
                        return;
                    }
                    offset = parseInt(offset);
                    if (offset > 999) {
                        offset = 999;
                    } else if (offset < -999) {
                        offset = -999;
                    }
                } else if (offset.indexOf(".") >= 0) {
                    offset = Math.floor(offset);
                } else {//验证不通过
                    offset = 0;
                }
            }
            $(this).val(offset);
        }).on("blur", function () {
            var offset = $(this).val();
            if (offset == "-" || offset == "") {
                offset = "0";
            }
            $(this).val(offset);
        })
    }

    // 构建航班批量锁定DOM
    /*
     *     		// 迭代选中行ID，获取数据放入结果集合
     //    	    var tableDataRows = [];
     //    	    for (var i = 0; i < selectedIDs.length; i++) {
     //    	        var rowid = selectedIDs[i];
     //    	        var tableDataRow = _this.tableDataMap[rowid];
     //    	        if (tableDataRow) {
     //    	            tableDataRows.push(tableDataRow);
     //    	        }
     //    	    }
     *  var multiFlightSlockDom = $(FlightGridTableCollaborateDom.MULTI_FLIGHT_SLOCK);
     var flightMultiFlightsTable =  multiFlightSlockDom.find('#flight-multi-flights-table');
     for(var id in tableDataRows) {
     var data = tableDataRows[id];
     var tr = $('<tr class="flight-multi-table-row">');
     var tdFlightid = $('<td>',{
     text: data.FLIGHTID,
     'class': 'flight-multi-info flight-multi-info-flightid',
     title: 'ID: ' + id + '\n航班号: ' + data.FLIGHTID,
     id: data.ID
     });
     var tdFDepap = $('<td>', {
     text: data.DEPAP,
     'class': 'flight-multi-info',
     title: data.DEPAP
     });
     var tdArrap = $('<td>', {
     text: data.ARRAP,
     'class': 'flight-multi-info',
     title: data.ARRAP
     });
     var tdEobt = $('<td>', {
     text: timeTransformation(data.EOBT, 'HHmm'),
     'class': 'flight-multi-info-eobt flight-multi-info-time-eobt',
     title: timeTransformation(data.EOBT, 'dd/HHmm'),
     });

     var cobtDate = timeTransformation(data.COBT, 'yyyyMMdd');
     var cobtTime = timeTransformation(data.COBT, 'HHmm');
     var tdCobt = $('<td class="flight-multi-info-cobt flight-multi-info-time-cobt">').append(getCobtCtotDivObj('cobt', cobtDate, cobtTime));

     var ctotDate = timeTransformation(data.CTOT, 'yyyyMMdd');
     var ctotTime = timeTransformation(data.CTOT, 'HHmm');
     var tdCtot = $('<td class="flight-multi-info-ctot flight-multi-info-time-ctot">').append(getCobtCtotDivObj('ctot', ctotDate, ctotTime));

     var ctoDate = timeTransformation(data.CTO, 'yyyyMMdd');
     var ctoTime = timeTransformation(data.CTO, 'HHmm');
     var point = data.FLOWCONTROL_POINT;
     var tdCto = $('<td class="flight-multi-info-cto flight-multi-info-time-cto">').append(getCtoDivObj(point, ctoDate, ctoTime));

     tr.append(tdFlightid);
     tr.append(tdFDepap);
     tr.append(tdArrap);
     tr.append(tdEobt);
     tr.append(tdCobt);
     tr.append(tdCtot);
     tr.append(tdCto);
     flightMultiFlightsTable.append(tr);

     }*/


};


/**
 * 构建航班批量锁定popover内容
 */
FlightGridTable.prototype.buildFlightMultiLockContent = function () {
    var contentId = this.pagerId + '-multi-lock-content';
    return '<div id="' + contentId + '">' +
        '<span class="multi-content">移动<input value="0" type="text" class="multi-content-input" maxlength="3" />分钟</span>' +
        '<button class="btn btn-primary multi-lock-btn">锁定</button>' +
        '<div class="checkbox multi-checkbox">' +
        '<label><input type="checkbox" class="multi-lock-checkbox" name="lockedValue" value="2">禁止系统自动调整 </label>' +
        '</div>' +
        '<div>';
};

/**
 * 绑定航班批量锁定popover事件
 */
FlightGridTable.prototype.buildFlightMultiLockEvent = function () {
    var thisProxy = this;
    // 批量锁定内容框
    var contentDom = $('#' + this.pagerId + '-multi-lock-content');
    var contentInput = contentDom.find('input.multi-content-input');
    var contentChecbox = contentDom.find('.multi-lock-checkbox');
    var contentBtn = contentDom.find('.multi-lock-btn');
    // 绑定input验证逻辑
    contentInput.on("keyup", function (e) {
        var offset = $(this).val();
        var reg = /^\-?\d{0,4}$/;
        if (offset != "") {//不为空
            if ((reg.test(offset))) { //验证通过
                if (offset == "-") {
                    return;
                }
                offset = parseInt(offset);
                if (offset > 999) {
                    offset = 999;
                } else if (offset < -999) {
                    offset = -999;
                }
            } else if (offset.indexOf(".") >= 0) {
                offset = Math.floor(offset);
            } else {//验证不通过
                offset = 0;
            }
        }
        $(this).val(offset);
    }).on("blur", function () {
        var offset = $(this).val();
        if (offset == "-" || offset == "") {
            offset = "0";
        }
        $(this).val(offset);
    });
    // 绑定批量锁定提交按钮
    contentBtn.on("click", function (e) {
        // 获取选择行ID
        var selectedIDs = thisProxy.gridTableObject.jqGrid('getGridParam', 'selarrrow');
        // 获取offset值
        var offset = contentInput.val();
        // 获取locked值
        var lockedStatus = contentChecbox.is(':checked') ? 1 : 2;
        if (selectedIDs == undefined || selectedIDs == null || selectedIDs.length <= 0) {
            $(".popover").popover("hide");
            BootstrapDialogFactory.dialog({
                title: '航班批量锁定',
                content: '尚未选择批量操作的航班',
                status: 2
            });
        } else {
            thisProxy.collaborateMultiFlightsLock({
                'ids': selectedIDs,
                'offset': offset,
                'lockedStatus': lockedStatus
            });
        }

    });
};
/**
 * 触发航班计划表格-多个数据更新
 *
 * @param flights 多个航班计划数据(FlightCoordination格式)
 */
FlightGridTable.prototype.fireFlightGridTableMultiDataChange = function(flights) {
    for(var index in flights){
        var flight = flights[index];
        if($.isValidVariable(flight)){
            this.fireSingleDataChange(flight);
        }
    }
    this.checkedMultiOperate();
};
/**
 * 构建航迹信息popover标题
 *
 * @param rowid
 * @returns {string}
 */
FlightGridTable.prototype.buildFlightTrajectorPopoverTitle = function (rowid) {
    var flight = this.data.result[rowid];
    if(!$.isValidVariable(flight)){
        //flight = {};
        return;
    }
    var flightId = flight.id || ""
    var fmeFlightId = "";
    if($.isValidVariable(flight.fmeToday)){
        fmeFlightId = flight.fmeToday.flightid || "";
    }
    return 'ID:' + flightId + ' ' + fmeFlightId;
};

/**
 * 构建航迹信息popover内容
 *
 * @param rowid
 * @returns {*}
 */
FlightGridTable.prototype.buildFlightTrajectorPopoverContent = function (rowid, name) {
    var flight = this.data.result[rowid];
    if(!$.isValidVariable(flight)){
        return;
    }
    var trajectors = FlightCoordination.parseMonitorPointInfo(flight);
    var autoSlotTrajectors = null;
    if ($.isValidVariable(flight.autoSlot)) {
        autoSlotTrajectors = FlightCoordination.parseAutoSlotMonitorPointInfo(flight.autoSlot);
    }
    var popoverContentDiv = $('<div>');
    var popoverContent = $('<div>');
    popoverContentDiv.append(popoverContent);
    popoverContent.addClass('flight-trajector-popover-div');
    var tableTh = '<label></label>' +
        '<label class="flight-trajector-popover-label-header">预计(P)</label>' +
        '<label class="flight-trajector-popover-label-header">计算(C)</label>' +
        '<label class="flight-trajector-popover-label-header">实际/修正(E)</label>';
    popoverContent.append(tableTh);
    for (var index in trajectors) {
        var tra = trajectors[index];
        var autoSlotTra = null;
        if ($.isValidVariable(autoSlotTrajectors)) {
            autoSlotTra = autoSlotTrajectors[index];
        }
        var traC = tra.C;
        if (!$.isValidVariable(traC) && $.isValidVariable(autoSlotTra)) {
            traC = autoSlotTra.C;
        }
        var traE = tra.E;
        var traT = tra.T;
        var traP = tra.P;
        var traA = tra.A;
        if ($.isValidVariable(traA)) {
            traE = '';
        }
        var th = $('<label>', {
            text: tra.ID,
            'class': 'flight-trajector-popover-label-header'
        });
        var tdE = ($('<label>', {
            text: $.formatTimeDDHHMM(traE) + '(E)'
        }));
        var tdP = ($('<label>', {
            text: $.formatTimeDDHHMM(traP)
        }));
        var tdC = ($('<label>', {
            text: $.formatTimeDDHHMM(traC)
        }));
        var tdT = ($('<label>', {
            text: $.formatTimeDDHHMM(traT) + '(T)'
        }));
        var tdA = ($('<label>', {
            text: $.formatTimeDDHHMM(traA)
        }));
        var tdDefault = ($('<label>', {
            text: ''
        }));
        // 改变样式
        var rowData = this.tableDataMap[rowid];
        var compareName = rowData[name];
        if (index == compareName) {
            if ($.isValidVariable(flight.atd) || $.isValidVariable(flight.estInfo) || $.isValidVariable(flight.updateTime)) {
                tdA.addClass("popover-highlight-row");
                tdT.addClass("popover-highlight-row");
                tdE.addClass("popover-highlight-row");
            } else {
                if (flight.clearanceType == FlightCoordination.CLEARANCE_FLIGHTS) {
                    if ($.isValidVariable(traC)) {
                        tdC.addClass("popover-highlight-row");
                    }
                } else if (flight.clearanceType == FlightCoordination.CLEARANCE_OVERFLY) {
                    if ($.isValidVariable(traP)) {
                        tdP.addClass("popover-highlight-row");
                    }
                }
            }
        }
        popoverContent.append(th);
        popoverContent.append(tdP);
        popoverContent.append(tdC);
        if ($.isValidVariable(traA)) {
            popoverContent.append(tdA);
        } else if ($.isValidVariable(traT)) {
            popoverContent.append(tdT);
        } else if ($.isValidVariable(flight.atd)
            || $.isValidVariable(flight.estInfo)
            || $.isValidVariable(flight.updateTime)) {
            if ($.isValidVariable(tdE)) {
                popoverContent.append(tdE);
            }
        } else {
            popoverContent.append(tdDefault);
        }
        popoverContent.append(popoverContent);
    }
    popoverContent.find('label').addClass('flight-trajector-popover-label');
    return popoverContentDiv.html();
};

/**
 * 排序表格数据
 *
 * @param tableData 表格显示数据
 * @param sortColNames 表格显示列名
 * @returns {*}
 */
FlightGridTable.prototype.sortGridData = function (tableData, sortColNames) {
    tableData.sort(function (d1, d2) {
        for (var index in sortColNames) {
            if (!sortColNames.hasOwnProperty(index) || !$.isValidVariable(sortColNames[index])) {
                continue;
            }
            var sortName = sortColNames[index];
            if ($.isValidVariable(d1[sortName]) && $.isValidVariable(d2[sortName])) {
                return d1[sortName].localeCompare(d2[sortName]);
            } else if ($.isValidVariable(d1[sortName])) {
                return -1;
            } else if ($.isValidVariable(d2[sortName])) {
                return 1;
            } else {
                return 0;
            }
        }
    });
    return tableData;
};
/**
 * 显示单元格qtip信息
 *
 * @param cellObject 单元格对象
 * @param type 信息类型
 * @param content 信息内容
 */
FlightGridTable.prototype.showTableCellTipMessage = function (opts, type, content) {
    var thisProxy = this;
    var cellObj =  thisProxy.getCellObject(opts.rowid, opts.iRow, opts.iCol);;
    // 确定样式设置
    var styleClasses = 'qtip-green';
    if (type == 'SUCCESS') {
        styleClasses = 'qtip-green-custom qtip-rounded';
    } else if (type == 'FAIL') {
        styleClasses = 'qtip-red-custom qtip-rounded';
    } else if (type == 'WARN') {
        styleClasses = 'qtip-default-custom qtip-rounded';
    }

    // 显示提示信息
    cellObj.qtip({
        // 内容
        content: {
            text: content // 显示的文本信息
        },
        // 显示配置
        show: {
            delay: 0,
            target: thisProxy.canvas,
            ready: true, // 初始化完成后马上显示
            effect: function () {
                $(this).fadeIn(); // 显示动画
            }
        },
        // 隐藏配置
        hide: {
            target: thisProxy.canvas, // 指定对象
            event: 'scroll unfocus click', // 失去焦点时隐藏
            effect: function () {
                $(this).fadeOut(); // 隐藏动画
            }
        },
        // 显示位置配置
        position: {
            my: 'bottom center', // 同jQueryUI Position
            at: 'top center',
            viewport: true, // 显示区域
            container: thisProxy.canvas, // 限制显示容器，以此容器为边界
            adjust: {
                resize: true, // 窗口改变时，重置位置
                method: 'shift shift'  //flipinvert/flip(页面变化时，任意位置翻转)  shift(转变) none(无)
            }
        },
        // 样式配置
        style: {
            classes: styleClasses //
        },
        // 事件配置
        events: {
            hide: function (event, api) {
                api.destroy(true); // 销毁提示信息
            }
        }
    });
};

/**
 * 移出等待池
 *
 * @param url  请求action值
 * @param opts  如要的值rowid，iRow，iCol
 */
FlightGridTable.prototype.showOutPoolModal = function (url, options) {
    var thisProxy = this;
    var saveTOBTTime = options.flight.tobt;
    var opts = {
        rowid : options.rowid,
        iRow : options.iRow,
        iCol : options.iCol
    };

    //发送移出等待池数据请求ajax
    function submitOutPoolReq(url, thisProxy, options) {
        var thisUrl = url;
        var thisProxy = thisProxy;
        var id = options.id;
        return function () {
            var params = {
                "id": id,
                "type": "",
                "tobt": ""
            };
            //日历控件初始化
            var dateDom = $(".outPoolForm .date_input");
            var timeDom = $(".outPoolForm .time_input");
            var radioVal = $(".outPoolForm").find("input[type='radio']:checked").val();
            params["type"] = radioVal;
            if ("TOBT" == radioVal) {
                var dateStr = dateDom.val();
                var timeStr = timeDom.val() == "" ? "0000" : timeDom.val();
                params["tobt"] = dateStr + timeStr;
            };
            //模态框确定按钮
            var $modalBtn = $('.btn_outpool_submit');
            var modalBtnLoading = Ladda.create($modalBtn[0]);
            //开启loading
            modalBtnLoading.start();
            $.ajax({
                type: "POST",
                url: thisUrl,
                data: params,
                dataType: "JSON",
                async: false,
                success: function (data) {
                    //停止模态框确定按钮loading
                    if($.isValidObject(modalBtnLoading)){
                        modalBtnLoading.stop();
                    }
                    //移除模态框
                    $("#bootstrap-modal-dialog").remove();
                    $('.modal-backdrop').remove();
                    //清理协调窗口
                    //thisProxy.clearCollaborateContainer();
                    try {
                        // 判断是否有返回结果
                        if ($.isValidVariable(data)) {
                            // 有返回结果，判断是否出错
                            if ($.isValidVariable(data.error)) {
                                // 错误
                                thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                            } else {
                                // 正常
                                var flight = data.flightCoordination;
                                thisProxy.afterCollaborate(flight);
                                thisProxy.showTableCellTipMessage(opts, 'SUCCESS', '移出等待池成功');
                            }
                        } else {
                            // 无返回结果，未知异常情况
                            thisProxy.showTableCellTipMessage(opts, 'FAIL', '移出等待池失败, 稍后请重新尝试');
                        }
                    } catch (e) {
                        console.error('out pool failed');
                        console.error(e.stack);
                        thisProxy.showTableCellTipMessage(opts, 'FAIL', '移出等待池失败，请稍后重新尝试');
                    }
                },
                error: function (xhr, status, error) {
                    //停止协调按钮loading
                    if($.isValidObject(loading)){
                        loading.stop();
                    }
                    //停止模态框确定按钮loading
                    if($.isValidObject(modalBtnLoading)){
                        modalBtnLoading.stop();
                    }
                    //移除模态框
                    $("#bootstrap-modal-dialog").remove();
                    $('.modal-backdrop').remove();
                    console.error(error);
                    thisProxy.showTableCellTipMessage(opts, 'FAIL', '移出等待池失败，请稍后重新尝试');
                }
            });
        }

    };
    var html = '<form class="outPoolForm">';
    //再此加if判断验证是否显示
    //html +='<div class="radio">'
    //        +'<label><input type="radio" data-name="ready_radio" name="type" value="ARDT" checked>已准备完毕</label>'
    //    +'</div>';
    //再此加if判断验证是否显示
    html += '<div class="radio">'
        + '<label><input type="radio" data-name="tobt_radio" name="type" value="TOBT" checked>预关时间(TOBT)</label>'
        + '<label class="p-l-10 input-feedback has-feedback"><input type="text" class="form-control toggle_input date_input" name="tobtDate" size="8" maxlength="8" readonly><span class="glyphicon form-control-feedback" aria-hidden="true"></span></label>'
        + '<label class="p-l-10 input-feedback has-feedback form-group"><input type="text" class="form-control toggle_input time_input" name="tobtTime" size="4" maxlength="4"><span class="glyphicon form-control-feedback" aria-hidden="true"></span></label>'
        + '<div class="valid_errors pool-valid_errors"></div>'
        + '</div>';
    html += '</form>';
    var OutPoolOptions = {
        title: '移出等待池',
        content: html,
        status: 1, //1:正常 2:警告 3:危险  不填:默认情况
        width: 430,
        mtop: 350,
        buttons: [
            {
                'name': '确定',
                'className': 'btn_outpool_submit',
                'isHidden': false,
                'callback': function () {
                }
            }
        ]
    };
    BootstrapDialogFactory.dialog(OutPoolOptions);

    //日历控件初始化
    var dateDom = $(".outPoolForm .date_input");
    var timeDom = $(".outPoolForm .time_input");
    dateDom.datepicker({
        dateFormat: 'yymmdd',
        closeText: '关闭',
        currentText: '今天',
        minDate: 0,
        showAnim: "toggle",
        onSelect: function () {

        },
        showButtonPanel: true
    });

    var generateTime = thisProxy.data.generateTime;
    if ($.isValidVariable(saveTOBTTime)) {
        dateDom.val(saveTOBTTime.substring(0, 8));
        timeDom.val(saveTOBTTime.substring(8, 12));
    } else {
        var nowDate = $.addStringTime(generateTime, 5 * 60 * 1000);
        dateDom.val(nowDate.substring(0, 8));
        timeDom.val(nowDate.substring(8, 12));
    }
    //增加监听处理方式
    $(".outPoolForm .radio").find("label:first").on("click", function () {
        var $this = $(this);
        var checkedDom = $this.find("input[type='radio']");
        var checkedName = checkedDom.data("name");
        if ("tobt_radio" == checkedName) {
            //显示时间input
            $(".toggle_input").removeAttr("disabled");
        } else {
            //隐藏时间input
            $(".toggle_input").prop("disabled", "true");
        }
    });

    $(".outPoolForm").bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        container : '.valid_errors',
        //submitButtons : '.btn_outpool_submit',
        fields: {
            tobtTime: {
                validators: {
                    notEmpty: {},
                    timeFormat: {},
                    compareCurrentTime: {
                        inputVal: dateDom,
                        curVal: generateTime
                    }
                }
            }
        }
    });
    $('.btn_outpool_submit').on('click', function(){
        var bootstrapValidator = $(".outPoolForm").data('bootstrapValidator');
        bootstrapValidator.validate();
        if(bootstrapValidator.isValid()){
            $(this).prop("disabled", true);
            submitOutPoolReq(url, thisProxy, options)();
        }
    });
};
/* 表格滚动时协调DOM位置跟随目标单元格 */
FlightGridTable.prototype.followTargetPosition = function (collaboratorDom, cellObj) {
    var thisProxy = this;

    function position() {
        collaboratorDom.position({
            of: cellObj,
            my: 'left top',
            at: 'right top'
        });
    }

    $("#" + thisProxy.tableId).parents(".ui-jqgrid-bdiv").off('scroll', position).on('scroll', position);
};

/**
 * 协调记录显示
 *
 * @param collaboratorDom
 * @param cellObj
 */
FlightGridTable.prototype.showCollaborator = function (collaboratorDom, cellObj) {
    var thisProxy = this;
    var canvas = thisProxy.canvas;
    //var table = thisProxy.table;
    var table = $('#' + thisProxy.canvasId);
    // 追加协调DOM至容器
    table.append(collaboratorDom);

    // 定位协调DOM
    collaboratorDom.position({
        of: cellObj,
        my: 'left top',
        at: 'right top',
        within : canvas
    });
    // 协调DOM位置跟随单元格
    thisProxy.followTargetPosition(collaboratorDom, cellObj);

};

/**
 * 打开航班报文查询对话框
 *
 * @param flight
 */
FlightGridTable.prototype.openFlightTele = function (flight) {
    var winTitle = flight.flightId + ' 报文查询';
    // var winUrl = this.colCollaborateUrl.OPEN_FLIGHT_MESSAGE + '?flightId=' + flight.flightId ;
    var depap=flight.depap;
    var arrap=flight.arrap;
    if(depap == "" || arrap == ""){
        depap = "";
        arrap = "";
    }
    var winUrl = this.colCollaborateUrl.OPEN_TELE_DETAIL + '?key=toTeleDetail&flightId=' + flight.flightId + '&teleTime=' + flight.executedate+ '&depap=' + depap+ '&arrap=' + arrap;
    var winParams = {
        id: 'flight_tele_' + winTitle + new Date(),
        width: 700,
        height: 800,
        center: true,
        move: true
    };
    DhxIframeDialog.create(winTitle, winUrl, winParams);
};
/*
 * 协调功能发送ajax请求
 * @param opts.action 请求的url
 * @param opts.params 请求的dataD
 * @param opts.successCallback 请求成功且有data值的执行方法（要传入响应回的data）
 * @param opts.action 当前协调操作名称，例如“退出时隙分配”
 * @param opts.cellObj tip提示对应单元格对象
 *
 */
FlightGridTable.prototype.sendCollaborateReq = function(opts){
    var thisProxy = this;
    //action不是有效值
    if(!$.isValidVariable(opts.action)){ return; };
    //不是有效对象
    var cellObjFlag = $.isValidVariable(opts.rowid) && $.isValidVariable(opts.iRow) &&$.isValidVariable(opts.iCol);
    var params = $.isValidVariable(opts.params) ? opts.params : {};
    var msgName = $.isValidVariable(opts.msgName) ? opts.msgName : "";
    //清理协调窗口
    //thisProxy.clearCollaborateContainer();

    var btn = opts.btn;
    if($.isValidVariable(btn)){
        //初始化按钮loading
        var loading = Ladda.create(btn);
        //开启loading
        loading.start();
    }

    $.ajax({
        url: opts.action,
        data: params,
        type: 'POST',
        dataType: 'json',
        success: function (data, status, xhr) {
            //停止loading
            if($.isValidObject(loading)){
                loading.stop();
            }
            var cellObj = {};
            if(cellObjFlag){
                cellObj.cell = thisProxy.getCellObject(opts.rowid, opts.iRow, opts.iCol);
            }
            try {
                // 判断是否有返回结果
                if ($.isValidVariable(data)) {
                    // 有返回结果，判断是否出错
                    if ($.isValidVariable(data.error)) {
                        // 错误
                        thisProxy.showTableCellTipMessage(opts, 'FAIL', data.error.message);
                    } else {
                        // 正常
                        if( typeof opts.successCallback == "function"){
                            opts.successCallback( data );
                        }
                        thisProxy.showTableCellTipMessage(opts, 'SUCCESS', msgName + '操作成功');
                    }
                } else {
                    // 无返回结果，未知异常情况
                    thisProxy.showTableCellTipMessage(opts, 'FAIL', msgName + '操作失败, 稍后请重新尝试');
                }
            } catch (e) {
                console.error(e.stack);
            }
        },
        error: function (xhr, status, error) {
            //停止loading
            if($.isValidObject(loading)){
                loading.stop();
            }
            console.error(error);
        }
    });
};
/**
 *
 * 表格导出Excel
 * */

FlightGridTable.prototype.export = function (name) {
    var thisProxy = this;
    var time = $.getFullTime(new Date());
    var fileName = name +'-'+ time;
    thisProxy.gridTableObject.jqGrid("exportToExcel", {
        includeLabels: true,
        includeGroupHeader: true,
        includeFooter: true,
        fileName: fileName,
        onBeforeExport : function( xlsx ) {
            var sheet = xlsx.xl.worksheets['sheet1.xml'];
            $('col', sheet).each( function () {
                $(this).attr( 'width', '15' );
            });
        },
    })
};