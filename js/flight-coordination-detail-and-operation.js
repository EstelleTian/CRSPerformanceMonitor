var FlightCoordinationDetailAndOperation = function () {
  var TipsDetail = {

    TEXT_SUCCESS: '成功',
    TEXT_FAIL: '失败，请稍后重新尝试',

    PRIORITY_TITLE_APPLY: '优先级申请',
    PRIORITY_TITLE_APPROVE: '优先级批复',
    PRIORITY_TIP_NEED_APPROVE: '优先级需要批复后生效',
    PRIORITY_TEXT_APPLY: '航班任务申请',
    PRIORITY_TEXT_APPROVE: '航班任务批准',
    PRIORITY_TEXT_REFUSE: '航班任务拒绝',

    DELAY_REASON_TITLE: '延误原因调整',
    DELAY_REASON_TEXT_UPDATE: '航班延误原因修改',
    DELAY_REASON_TEXT_CLEAN: '航班延误原因清除',
    DELAY_REASON_TIP_NO_CONTENT: '请输入延误原因',

    SLOT_STATUS_TITLE: '时隙分配状态调整',
    SLOT_STATUS_TEXT_ASSIGN_SLOT: '参加时隙分配',
    SLOT_STATUS_TEXT_ASSIGN_NOSLOT: '退出时隙分配',
    SLOT_STATUS_TIP_ASSIGN_SLOT: '将参加时隙分配',
    SLOT_STATUS_TIP_ASSIGN_NOSLOT: '将退出时隙分配',
    SLOT_STATUS_TIP_CHOOSE_OPERATEION: '请选择操作',

    FLOWCONTROL_TITLE: '流控信息详情',

    RUNWAY_TITLE: '跑道调整',
    RUNWAY_TEXT_UPDATE: '航班起飞跑道修改',
    RUNWAY_TIP_NO_RUNWAY: '无可选跑道，请关闭对话框',
    RUNWAY_TIP_CHOOSE_ANOTHER: '请更改跑道，或关闭对话框',

    POSITION_TITLE: '停机位调整',
    POSITION_TIP_NO_POSITION: '请输入停机位',
    POSITION_TEXT_UPDATE: '航班停机位修改',

    CLEARANCE_STATUS_TITLE: '放行状态调整',
    CLEARANCE_STATUS_UPDATE: '放行标记',
    CLEARANCE_STATUS_TIP_CHOOSE_OPERATEION: '请选择操作',

    TOBT_TIP_APPLY_WARN: '调整TOBT,会清空COBT/CTD,<br/>造成航班向后移动',
    TOBT_TIP_APPLY_ERROR: '请检查输入的时间参数',
    TOBT_TEXT_APPLY: '航班预关时间申请',
    TOBT_TEXT_APPROVE: '航班预关时间批复',
    TOBT_TEXT_REFUSE: '航班预关时间拒绝',
    TOBT_TITLE: '预关时间调整',

    ASBT_TITLE: '航班上客时间调整',
    ASBT_TEXT_UPDATE: '航班上客时间修改',
    ASBT_TIP_WARN_NO_PUS: '航班未推出，可修改时间范围在<br/>当前时间 - 15分和当前时间之间',
    ASBT_TIP_WARN_HAD_PUS: '航班已推出，可修改时间范围在<br/>当前时间 - 30分和当前时间之间',
    ASBT_TIP_WARN: '请检查输入的时间参数是否正确，<br/>最小值不可超过当前时间 - 30分',

    AGCT_TITLE: '航班实关时间调整',
    AGCT_TEXT_UPDATE: '航班实关时间修改',
    AGCT_TIP_WARN_NO_PUS: '航班未推出，可修改时间范围在<br/>当前时间 - 15分和当前时间之间',
    AGCT_TIP_WARN_HAD_PUS: '航班已推出，可修改时间范围在<br/>当前时间 - 30分和当前时间之间',
    AGCT_TIP_WARN: '请检查输入的时间参数是否正确，最小值不可超过当前时间 - 30分',

    FLIGHT_DEICE_TITLE: '除冰状态调整',
    FLIGHT_DEICE_TIP_WARN: '调整除冰状态，会清空COBT/CTD,<br/>造成航班向后移动',
    FLIGHT_DEICE_TIP_CLEAR: '如不勾选，将清除除冰状态',
    FLIGHT_DEICE_TEXT_UPDATE: '航班除冰状态调整',

    COBT_TITLE: '航班预撤时间调整',
    COBT_TIP_ERROR: '请检查输入的时间参数',
    COBT_TEXT_UPDATE: '航班预撤时间修改',

    CTD_TITLE: '航班预起时间调整',
    CTD_TIP_ERROR: '请检查输入的时间参数',
    CTD_TEXT_UPDATE: '航班预起时间修改',

    POOL_STATUS_TITLE: '等待池状态调整',
    POOL_STATUS_INPOOL_UPDATE: '移入等待池',
    POOL_STATUS_OUTPOOL_APPLY: '移出等待池申请',
    POOL_STATUS_OUTPOOL_APPROVE: '移出等待池批复',
    POOL_STATUS_OUTPOOL_REFUSE: '移出等待池拒绝',
    POOL_STATUS_OUTPOOL_UPDATE: '移出等待池',
    POOL_STATUS_TIP_WARN: '需要移出等待池，请先修改预关时间，并保证预关时间<br/>晚于当前时间，或者实关时间+90分钟大于当前时间'

  };
  /**
   * dhtmlx Windows 控件
   */
  var dhxWins;

  /**
   * 数据验证的正则表达式
   */
// HHmm时间
  var regexp_time = new RegExp(/(^[0-1][0-9]|^2[0-3])[0-5]{1}[0-9]{1}$/);

  /**
   * 全局变量保存航班数据
   */
  var fc = null;

  /**
   * 数据-时间
   */
  var generate_time;

  /**
   * 机场配置数据
   */
  var airport_configuration;

  /**
   * 数据-用户对象
   * <p>
   * 格式: 参考User.java
   */
  var user;

  /**
   * 数据-参数配置信息
   */
  var server_peer_name;

  var system_configs;

  /**
   *
   * @type {number}
   */
  var flight_detail_interval = 1000 * 60 / 2;

  /**
   * 航班协同URL
   */
//
  var retrieve_flight_coordination_detail_url = 'retrieve_flight_detail.action';
// 任务申请
  var flight_priority_apply_url = 'flight_priority_apply.action';
// 任务批复
  var flight_priority_approve_url = 'flight_priority_approve.action';
// 任务拒绝
  var flight_priority_refuse_url = 'flight_priority_refuse.action';
// eobt为空预关申请
  var flight_mirror_tobt_apply_url = 'flight_mirror_tobt_apply.action';
// 预关申请
  var flight_tobt_apply_url = 'flight_tobt_apply.action';
// 预关批复
  var flight_tobt_approve_url = 'flight_tobt_approve.action';
// 预关拒绝
  var flight_tobt_refuse_url = 'flight_tobt_refuse.action';
// 协关申请
  var flight_hobt_apply_url = 'flight_hobt_apply.action';
// 协关批复
  var flight_hobt_approve_url = 'flight_hobt_approve.action';
// 预起时间
  var flight_ctd_update_url = 'flight_ctd_update.action';
// 预撤时间
  var flight_cobt_update_url = 'flight_cobt_update.action';
// 清除预起时间
  var flight_ctd_clear_url = 'flight_ctd_clear.action';
// 清除预撤时间
  var flight_cobt_clear_url = 'flight_cobt_clear.action';
// 协关拒绝
  var flight_hobt_refuse_url = 'flight_hobt_refuse.action';
// 上客时间修改
  var flight_boarding_time_update_url = 'flight_boarding_time_update.action';
  var flight_boarding_time_clear_url = 'flight_boarding_time_clear.action';
// 实关时间修改
  var flight_close_time_update_url = 'flight_close_time_update.action';
  var flight_close_time_clear_url = 'flight_close_time_clear.action';
// 跑道修改
  var flight_runway_update_url = 'flight_runway_update.action';
  var flight_runway_clear_url = 'flight_runway_clear.action';
// 除冰坪修改
  var flight_deice_position_update_url = 'flight_deice_position_update.action';
  var flight_deice_position_clear_url = 'flight_deice_position_clear.action';
// 放行状态修改
  var flight_clearance_update_url = 'flight_clearance_update.action';
// 入池
  var flight_inpool_update_url = 'flight_inpool_update.action';
// 申请移出等待池
  var flight_outpool_apply_url = 'flight_outpool_apply.action';
// 批复移出等待池
  var flight_outpool_approve_url = 'flight_outpool_approve.action';
// 直接移出等待池
  var flight_outpool_url = 'flight_outpool.action';
// 拒绝移出等待池
  var flight_outpool_refuse_url = 'flight_outpool_refuse.action';
//标记取消修改
  var flight_cancel_update_url = 'flight_cancel_update.action';
// 标记恢复修改
  var flight_recover_update_url = 'flight_recover_update.action';
// 延误原因修改
  var flight_delay_reason_update_url = 'flight_delay_reason_update.action';
// 机位修改
  var flight_position_update_url = 'flight_position_update.action';
  var flight_position_clear_url = 'flight_position_clear.action';

// 获取机场航班数据URL
  var retrieve_airport_flights_url = 'retrieve_airport_flights.action';

// 获取机场参数配置URL
  var retrieve_airport_configuration_url = 'retrieve_airport_configuration.action';

// 获取用户信息URL
  var retrieve_user_url = 'retrieve_logon_user.action';

// 除冰状态修改
  var retrieve_deice_group_url = 'retrieve_deice_group.action';
  var flight_deice_update_url = 'flight_deice_update.action';

// 时隙分配状态修改
  var flight_assign_slot_status_update_url = 'flight_assign_slot_status_update.action';

// 航班协调记录
  var open_flight_coordination_record_dialog_url = 'open_flight_coordination_record_dialog.action';

// 流控详情
  var flowcontrol_ldr_detail_dialog = 'open_flowcontrol_detail_dialogs.action';
  var flowcontrol_translation_detail_dialog = 'open_flowcontrol_detail_dialogs.action';
  var flowcontrol_detail_dialog = 'open_flowcontrol_detail_dialogs.action';

// 流控影响航班
  var open_flowcontrol_impact_flights_dialog = 'open_flowcontrol_impact_flights_dialog.action';

// 获取基础数据信息
  var retrieve_system_configs_url = 'retrieve_system_configs.action';

  /**
   * 初始化基础数据-机场配置
   */
  var retrieveAirportConfiguration = function () {
    if (logger.isDebugEnabled()) {
      console.debug('retrieve airport configuration start');
    }
    $.ajax({
      url: retrieve_airport_configuration_url,
      type: 'GET',
      dataType: 'json',
      success: function (data, status, xhr) {
        if (logger.isDebugEnabled()) {
          console.debug('retrieve airport configuration end, json: ');
          console.debug(data);
        }
        airport_configuration = data;
      },
      error: function (xhr, status, error) {
        console.error(error);
      },
      complete: function (xhr, status) {
        xhr = null
      }
    });
  };

  /**
   * 初始化基础数据-用户信息
   */
  var retrieveUser = function () {
    if (logger.isDebugEnabled()) {
      console.debug('retrieve user data start');
    }
    $.ajax({
      url: retrieve_user_url,
      type: 'GET',
      dataType: 'json',
      success: function (data, status, xhr) {
        if (logger.isDebugEnabled()) {
          console.debug('retrieve user data end, json: ');
          console.debug(data);
        }
        user = data;
      },
      error: function (xhr, status, error) {
        console.error('retrieve user data failed, state: ');
        console.error(error);
      },
      complete: function (xhr, status) {
        xhr = null
      }
    });
  };
  /**
   * 清除协调操作表格内容以便重新生成
   */
  var clearCollaborateTable = function (flightid) {
    $('#'+flightid+'flight_coordination_record_table tr:first-child').nextAll().remove();
    $('#'+flightid+'flowcontrols_table tr:first-child').nextAll().remove();
    $('#'+flightid+'trajectors_table tr:first-child').nextAll().remove();
  };

  /**
   * 显示dhxMessage提示信息
   * @param text
   * @param type
   */
  var showDhtmlxMessage = function (text, type) {
    // 由下到上显示 'bottom'
    dhtmlx.message.position = 'top';
    if (type == -1) {
      dhtmlx.message({text: text, type: 'error'});
    } else {
      dhtmlx.message({text: text});
    }
  };

  /**
   * 显示dhx popup
   * @param inp 元素
   * @param myPop pop对象
   * @param text 内容
   * @param mode 模式
   */
  var updateDhtmlxPopup = function (inp, myPop, text, mode) {
    if (mode == 'warn') {
      text = '<label class="dhx_popup_warn">' + text + '</label>';
    }
    if (mode == 'error') {
      text = '<label class="dhx_popup_error">' + text + '</label>';
    }
    myPop.attachHTML(text);
    if (myPop.isVisible()) {
      myPop.hide();
    } else {
      var x = window.dhx4.absLeft(inp.get(0));
      var y = window.dhx4.absTop(inp.get(0));
      var w = inp.get(0).offsetWidth;
      var h = inp.get(0).offsetHeight;
      myPop.show(x, y, w, h);
    }
    inp.bind('blur', function () {
      if (myPop) myPop.hide();
    });
  };

  /**
   * 重建页面协调操作规则
   * @param flight
   */
  var rebuildCollaborateRule = function (flight) {

    if (!$.isValidVariable(flight.fmeToday.status)
      || (flight.fmeToday.status != FmeToday.STATUS_SCH
      && flight.fmeToday.status != FmeToday.STATUS_FPL
      && flight.fmeToday.status != FmeToday.STATUS_DLA)
      || !FmeToday.hadFPL(flight.fmeToday)) {

      if (!FmeToday.hadFPL(flight.fmeToday)) {
        $('.flight_detail_table_edit_field:not("#tobt")')
          .removeClass('flight_collaborate_apply')
          .removeClass('flight_detail_table_edit_field');
      } else {
        $('.flight_detail_table_edit_field')
          .removeClass('flight_collaborate_apply')
          .removeClass('flight_detail_table_edit_field');
      }
    }

    // 判断修改权限  时隙状态
    // if (!AuthorizationUtil.hasAuthorizedSlotStatus(user) && !AuthorizationUtil.hasAuthorizedUnSlotStatus(user)) {
    //   $('#'+flightid+'slot_status').removeClass('flight_detail_table_edit_field');
    // }
  };
  /**
   * 格式化日期
   *
   * @param time
   * @returns {*}
   */
  var formatTime = function (time) {
    if ($.isValidVariable(time)) {
      var day = time.substr(6, 2);
      var hhmm = time.substr(8, 4);
      return day + '/' + hhmm;
    } else {
      return '';
    }
  };
  /**
   * 判断优先级状态控制背景图片
   * @param flight
   */
  var changeCollaborateStyle = function (flight,flightid) {
    // 优先级申请
    var records = flight.coordinationRecords;
    var record = null;
    var recordStatus = null;
    if ($.isValidVariable(records)
      && $.isValidVariable(records[FlightCoordinationRecord.TYPE_PRIORITY])) {
      record = records[FlightCoordinationRecord.TYPE_PRIORITY];
      recordStatus = record.status;
      if (recordStatus == FlightCoordinationRecord.STATUS_APPLY) {
        $('#'+flightid+'priority').addClass('flight_collaborate_apply');
      } else {
        $('#'+flightid+'priority').removeClass('flight_collaborate_apply');
      }
    }

    // TOBT申请
    if ($.isValidVariable(records)
      && $.isValidVariable(records[FlightCoordinationRecord.TYPE_TOBT])) {
      record = records[FlightCoordinationRecord.TYPE_TOBT];
      recordStatus = record.status;
      if (recordStatus == FlightCoordinationRecord.STATUS_APPLY) {
        $('#'+flightid+'tobt').addClass('flight_collaborate_apply');
      } else {
        $('#'+flightid+'tobt').removeClass('flight_collaborate_apply');
      }
    }

    // 等待池申请
    if ($.isValidVariable(records)
      && $.isValidVariable(records[FlightCoordinationRecord.TYPE_INPOOL])) {
      record = records[FlightCoordinationRecord.TYPE_INPOOL];
      recordStatus = record.status;
      if ($.isValidVariable(recordStatus)
        && recordStatus == FlightCoordinationRecord.STATUS_APPLY) {
        $('#'+flightid+'pool_status').addClass('flight_collaborate_apply');
      } else {
        $('#'+flightid+'pool_status').removeClass('flight_collaborate_apply');
      }
    }

  };
  /**
   * 绑定流控名称点击事件
   */
  // var bindFlowcontrolDetailDialog = function (flight) {
  //   if (!$.isValidVariable(flight) || !$.isValidVariable(flight.fmeToday)
  //     || !$.isValidVariable(flight.flowcontrols)) {
  //     return;
  //   }
  //   for (var index in flight.flowcontrols) {
  //     var f = flight.flowcontrols[index];
  //     var type = f[1];
  //     (function (f) {
  //       $('#'+flightid+'flowcontrols_table #flowcontrol_' + index + '_' + type).bind('click', function (event) {
  //         var elementId = $(this).attr('id');
  //         var array = elementId.split(/_/);
  //         if ($.isValidVariable(array) && array.length > 2) {
  //           var typeTo = array[2];
  //           if (f[12] == '100') {
  //             var typeTo = "COMPOSITE";
  //           }
  //           showFlowcontrolDetailDialog(array[1], typeTo);
  //         }
  //         event.preventDefault();
  //       });
  //     })(f);
  //
  //   }
  // };
  /**
   * 流控详情dialog
   * @param id
   */
  var showFlowcontrolDetailDialog = function (id, type) {
    if (FlowcontrolUtils.TYPE_LDR == type) {
      window.open(flowcontrol_ldr_detail_dialog + '?id=' + id + '&detail=LDRDETAIL');
      return;
    }
    if (FlowcontrolUtils.TYPE_TRANSLATION == type) {
      window.open(flowcontrol_translation_detail_dialog + '?id=' + id + '&detail=TRANSLATION');
      return;
    }
    var w = 800;
    h = 700;
    var detail = "DETAIL";
    var winTitle = '流控信息详情';
    //var winUrl = flowcontrol_detail_dialog + '?id=' + id + '&&detail=' + detail;
    var winUrl = DialogUrlUtils.flowcontrol.flowcontrol_detail_url + '?id=' + id + '&detail=' + detail;
    var winParams = {
      id: 'flowcontrol_detail_' + winTitle + new Date(),
      width: w,
      height: h,
      center: true,
      move: true,
      modal: true
    };
    DhxIframeDialog.create(winTitle, winUrl, winParams);
    /*var win = dhxWins.createWindow({
     id : id,
     width : 450,
     height : 670,
     center : true,
     move : true
     });
     win.setText(TipsDetail.FLOWCONTROL_TITLE);
     win.attachURL(flowcontrol_detail_dialog + '?id=' + id + '&detail=DETAIL');
     win.adjustPosition();
     win.button('minmax').hide();*/
  };
  /**
   * 资质
   * @param flight
   */
  var fireFlightQualificationsDataChange = function (flight,flightid) {
    if (!$.isValidVariable(flight) || !$.isValidVariable(flight.qualifications)) {
      return;
    }
    $('#'+flightid+'qualifications').text(function () {
      var qualifications = "";
      var qualificationsStr = flight.qualifications;
      if (qualificationsStr.substring(1, 2) == '2') {
        qualifications = "二类飞行";
      }
      return qualifications;
    });

  };
  /**
   * 命中流控
   * @param flight
   */
  var fireFlowcontrolDataChange = function (flight,flightid) {
    if (!$.isValidVariable(flight) || !$.isValidVariable(flight.fmeToday)
      || !$.isValidVariable(flight.flowcontrols)) {
      return;
    }
    var flowcontrolsTable = $('#'+flightid+'flowcontrols_table');
    for (var index in flight.flowcontrols) {
      var f = flight.flowcontrols[index];
      var name = f[0];
      var type = f[1];
      var reason = f[2];
      var value = f[4];
      var placeType = f[7];
      var status = f[5];
      var statusZh = FlowcontrolUtils.getStatusZh2(status);
      if (placeType == "POINT") {
        if (f[5] != f[14] && f[14] == 'RUNNING') {
          statusZh = "(正在执行)";
        }
      }
      var curid = f[6];
      var source = f[8];
      var tr = $('<tr>');
      var tdName = $('<td>').append($('<label>', {
        text: name,
        id: 'flowcontrol_' + index + '_' + type,
        class: 'flowcontrol_detail_dialog'
      }));
      var tdType = $('<td>').append($('<label>', {
        text: type
      }));
      var tdValue = $('<td>').append($('<label>', {
        text: type == FlowcontrolUtils.TYPE_TRANSLATION ? '' : value
      }));
      var tdReason = $('<td>').append($('<label>', {
        text: FlowcontrolUtils.getReasonZh(reason)
      }));
      var tdStatus = $('<td style="width: 200px;">').append($('<span>', {
        text: statusZh
      })).append("&nbsp;&nbsp;").append($('<span>', {
        text: '影响', /*查看*/
        id: "impact_flights_" + curid,
        class: 'flowcontrol_detail_dialog',
        click: function () {
          var curid = $(this).attr("id");
          curid = curid.substring(15, curid.length);
          var winUrl = parent.DialogUrlUtils.flowcontrol.open_flowcontrol_impact_flights_url + "?id=" + curid + "&detail=IMPACT";
          var winTitle = '流控 ' + '' + ' 影响航班';
          var winParams = {
            id: 'flight_detail_' + winTitle + new Date(),
            width: 1280,
            height: 800,
            center: true,
            move: true,
            buttons: {
              //open : false
            }
          };
          //parent.DhxIframeDialog.create(winTitle, winUrl, winParams);
          window.open(winUrl, winTitle)

        }
      }));
      var tdSource = $('<td>').append($('<label>', {
        text: source
      }));

      tr.append(tdName);
      tr.append(tdType);
      tr.append(tdValue);
      tr.append(tdReason);
      tr.append(tdSource);
      tr.append(tdStatus);
      flowcontrolsTable.append(tr);
    }
  };
  /**
   * 命中限制
   * @param flight
   */
  var fireRestrictionDataChange = function (flight,flightid) {
// todo
  };

  /**
   * 协调记录
   * @param flight
   */
  var fireFlightRecordDataChange = function (flight, flightCoordinationRecords,flightid) {
    if (!$.isValidVariable(flight) || !$.isValidVariable(flightCoordinationRecords)) {
      return;
    }
    // 转换数据
    var newFlightCoordinationRecords = new Array();
    for (var id in flightCoordinationRecords) {
      var record = flightCoordinationRecords[id];
      newFlightCoordinationRecords.push(record);
    }
    // 排序
    newFlightCoordinationRecords.sort(function (record1, record2) {
      if ($.isValidVariable(record1.timestamp) && $.isValidVariable(record2.timestamp)) {
        return record2.timestamp.localeCompare(record1.timestamp);
      }
    });
    // 绘制
    var table = $('#'+flightid+'flight_coordination_record_table');
    for (var index in newFlightCoordinationRecords) {
      var record = newFlightCoordinationRecords[index];
      var data = FlightCoordinationRecordGridTableDataUtil.convertData(record);
      var timestamp = data.timestamp.substring(6, 8) +
        "/" + data.timestamp.substring(8, 12);
      var tr = $('<tr>');
      var tdFlightId = $('<td>').append($('<label>', {
        text: data.type
      }));
      var tdOriginalValue = $('<td>').append($('<label>', {
        text: data.originalValue
      }));
      var tdValue = $('<td>').append($('<label>', {
        text: data.value
      }));
      var tdComments = $('<td>').append($('<label>', {
        text: data.comments
      }));
      var tdStatus = $('<td>').append($('<label>', {
        text: data.status
      }));
      var tdTimestamp = $('<td>').append($('<label>', {
        text: timestamp
      }));
      var tdUsername = $('<td>').append($('<label>', {
        text: data.usernameZh
      }));
      var tdIpAddress = $('<td>').append($('<label>', {
        text: data.ipAddress
      }));
      tr.append(tdFlightId);
      tr.append(tdOriginalValue);
      tr.append(tdValue);
      tr.append(tdComments);
      tr.append(tdStatus);
      tr.append(tdTimestamp);
      tr.append(tdUsername);
      tr.append(tdIpAddress);
      table.append(tr);
    }

  };


  /**
   * EFPS进程单
   * @param flight
   */
  var fireFlightEFPSDataChange = function (flight,flightid) {
    if (!$.isValidVariable(flight) || !$.isValidVariable(flight.efpsFlight)) {
      return;
    }
    $('#'+flightid+'efps_sid').text(function () {
      var efpsSid = '';
      if ($.isValidVariable(flight.efpsFlight) && $.isValidVariable(flight.efpsFlight.sid)) {
        efpsSid = flight.efpsFlight.sid;
      }
      return efpsSid;
    });
    $('#'+flightid+'efps_reqTime').text(function () {
      var efpsReqTime = '';
      if ($.isValidVariable(flight.efpsFlight) && $.isValidVariable(flight.efpsFlight.reqTime)) {
        efpsReqTime = formatTime(flight.efpsFlight.reqTime);
      }
      return efpsReqTime;
    });
    $('#'+flightid+'efps_pusTime').text(function () {
      var efpsPusTime = '';
      if ($.isValidVariable(flight.efpsFlight) && $.isValidVariable(flight.efpsFlight.pusTime)) {
        efpsPusTime = formatTime(flight.efpsFlight.pusTime);
      }
      return efpsPusTime;
    });
    $('#'+flightid+'efps_iceId').text(function () {
      var efpsIceId = '';
      if ($.isValidVariable(flight.efpsFlight) && $.isValidVariable(flight.efpsFlight.iceId)) {
        efpsIceId = flight.efpsFlight.iceId;
      }
      return efpsIceId;
    });
    $('#'+flightid+'efps_inIceTime').text(function () {
      var efpsInIceTime = '';
      if ($.isValidVariable(flight.efpsFlight) && $.isValidVariable(flight.efpsFlight.inIceTime)) {
        efpsInIceTime = formatTime(flight.efpsFlight.inIceTime);
      }
      return efpsInIceTime;
    });
    $('#'+flightid+'efps_inDhlTime').text(function () {
      var efpsInDhlTime = '';
      if ($.isValidVariable(flight.efpsFlight) && $.isValidVariable(flight.efpsFlight.inDhlTime)) {
        efpsInDhlTime = formatTime(flight.efpsFlight.inDhlTime);
      }
      return efpsInDhlTime;
    });
    $('#'+flightid+'efps_outDhlTime').text(function () {
      var efpsOutDhlTime = '';
      if ($.isValidVariable(flight.efpsFlight) && $.isValidVariable(flight.efpsFlight.outDhlTime)) {
        efpsOutDhlTime = formatTime(flight.efpsFlight.outDhlTime);
      }
      return efpsOutDhlTime;
    });
    $('#'+flightid+'efps_outIcTime').text(function () {
      var efpsOutIcTime = '';
      if ($.isValidVariable(flight.efpsFlight) && $.isValidVariable(flight.efpsFlight.outIcTime)) {
        efpsOutIcTime = formatTime(flight.efpsFlight.outIcTime);
      }
      return efpsOutIcTime;
    });
    $('#'+flightid+'efps_linTime').text(function () {
      var efpsLinTime = '';
      if ($.isValidVariable(flight.efpsFlight) && $.isValidVariable(flight.efpsFlight.linTime)) {
        efpsLinTime = formatTime(flight.efpsFlight.linTime);
      }
      return efpsLinTime;
    });
  };
  /**
   * 等待池
   * @param flight
   */
  var fireFlightPoolStatusDataChange = function (flight,flightid) {
    if (!$.isValidVariable(flight) || !$.isValidVariable(flight.fmeToday)) {
      return;
    }
    $('#'+flightid+'pool_status').text(function () {
      if ($.isValidVariable(flight.poolStatus)) {
        return FlightCoordination.getPoolStatusZh(flight.poolStatus);
      }
      return '';
    });
  };
  /**
   * 时隙状态
   * @param flight
   */
  var fireFlightSlotStatusDataChange = function (flight, dataTime,flightid) {
    if (!$.isValidVariable(flight) || !$.isValidVariable(flight.fmeToday)) {
      return;
    }
    $('#'+flightid+'slot_status').text(function () {
      var slotStatus = '';
      if (!FmeToday.hadDEP(flight.fmeToday)) {
        if (flight.locked == FlightCoordination.UNLOCK
          && $.isValidVariable(flight.autoSlot)
          && ($.isValidVariable(flight.autoSlot.ctd)
          || $.isValidVariable(flight.autoSlot.cobt))) {
          slotStatus = '自动';
        } else if (flight.locked == FlightCoordination.UNLOCK
          && ($.isValidVariable(flight.cobt) || $.isValidVariable(flight.ctd))) {
          // 添加判断时隙中预锁状态的逻辑
          if ($.isValidVariable(system_configs) && system_configs.cobtPreLockStatus != FlightCoordination.STATUS_COBT_PRE_LOCK) {
            var diff = $.calculateStringTimeDiff(flight.cobt, dataTime) / 60 / 1000;
            if (diff < system_configs.cobtPreLockTime) {
              slotStatus = '锁定';
            } else {
              slotStatus = '预锁';
            }
          } else {
            slotStatus = '锁定';
          }
        } else if (flight.locked == FlightCoordination.LOCKED
          || flight.locked == FlightCoordination.LOCKED_IMPACT) {
          slotStatus = '人工';
        } else if (flight.locked == FlightCoordination.LOCKED_NOSLOT) {
          slotStatus = '不参加';
        }
      }
      return slotStatus;
    });
  };
  /**
   * 放行状态
   * @param flight
   */
  var fireFlightClearanceStatusDataChange = function (flight,flightid) {
    if (!$.isValidVariable(flight) || !$.isValidVariable(flight.fmeToday)) {
      return;
    }
    $('#'+flightid+'clearance_status').text(function () {
      var clearance = '';
      if ($.isValidVariable(flight.coordinationRecords)) {
        var clearanceRecord = flight.coordinationRecords[FlightCoordinationRecord.TYPE_MARK_CLEARANCE];
        if ($.isValidVariable(clearanceRecord)
          && $.isValidVariable(clearanceRecord.status)) {
          var status = clearanceRecord.value;
          if (status == 1) {
            clearance = '已放行';
          }
        }
      }
      return clearance;
    });
  };
  /**
   * 延误原因
   * @param flight
   */
  var fireFlightDelayReasonDataChange = function (flight,flightid) {
    if (!$.isValidVariable(flight) || !$.isValidVariable(flight.fmeToday)) {
      return;
    }
    $('#'+flightid+'delay_reason').text(function () {
      var delayReason = '';
      if ($.isValidVariable(flight.delayReason)) {
        if (flight.delayReason != FlightCoordination.DELAY_REASON_FORMER
          && flight.delayReason != FlightCoordination.DELAY_REASON_AOC) {
          delayReason = FlowcontrolUtils
            .getReasonZh(flight.delayReason);
        } else {
          delayReason = FlightCoordination
            .getDelayReasonZh(flight.delayReason);
        }
      } else if ($.isValidVariable(flight.cdelayReason)) {
        if (flight.cdelayReason != FlightCoordination.DELAY_REASON_FORMER
          && flight.cdelayReason != FlightCoordination.DELAY_REASON_AOC) {
          delayReason = FlowcontrolUtils
            .getReasonZh(flight.cdelayReason);
        } else {
          delayReason = FlightCoordination
            .getDelayReasonZh(flight.cdelayReason);
        }
      }
      return delayReason;
    });
  };
  /**
   *
   * @param flight
   */
  var fireFlightEobtAndEtotDataChange = function (flight,flightid) {
    if (!$.isValidVariable(flight) || !$.isValidVariable(flight.fmeToday)) {
      return;
    }
    var eobt = '';
    var etot = '';

    if ($.isValidVariable(flight.eobt)) {
      eobt = flight.eobt;
    }
    if ($.isValidVariable(flight.etd)) {
      etot = flight.etd;
    }

    $('#'+flightid+'eobt').text(formatTime(eobt));
    $('#'+flightid+'etot').text(formatTime(etot));

    // APP FIX/ACC FIX
    // 解析航迹
    var trajectors = FlightCoordination.parseMonitorPointInfo(flight);
    var controlInnerWaypointName = flight.controlInnerWaypointName; // app fix
    var controlWaypointName = flight.controlWaypointName; // acc fix
    if ($.isValidVariable(controlInnerWaypointName)) {
      var tra = trajectors[controlInnerWaypointName];
      if ($.isValidVariable(tra)) {
        $('#'+flightid+'e_appfix_time').text(formatTime(tra.P));
      }
    }
    if ($.isValidVariable(controlWaypointName)) {
      var tra = trajectors[controlWaypointName];
      if ($.isValidVariable(tra)) {
        $('#'+flightid+'e_accfix_time').text(formatTime(tra.P));
      }
    }
  };
  /**
   * 全国计算
   * @param flight
   */
  var fireFlightNCobtAndNCtotDataChange = function (flight,flightid) {
    if (!$.isValidVariable(flight) || !$.isValidVariable(flight.fmeToday)) {
      return;
    }
    var ncobt = '';
    var nctot = '';
    if ($.isValidVariable(flight.airbusFlightSlot)
      && $.isValidVariable(flight.airbusFlightSlot.cobt)) {
      ncobt = flight.airbusFlightSlot.cobt;
    }
    if ($.isValidVariable(flight.airbusFlightSlot)
      && $.isValidVariable(flight.airbusFlightSlot.ctot)) {
      nctot = flight.airbusFlightSlot.ctot;
    }
    $('#'+flightid+'ncobt').text(formatTime(ncobt));
    $('#'+flightid+'nctot').text(formatTime(nctot));
  };

  /**
   * 优先级
   * @param flight
   */
  var fireFlightPriorityDataChange = function (flight,flightid) {
    if (!$.isValidVariable(flight) || !$.isValidVariable(flight.fmeToday)) {
      return;
    }
    $('#'+flightid+'priority').text(function () {
      if (flight.priority == FlightCoordination.PRIORITY_ICE) {
        return FlightCoordination.getPriorityZh(flight.priority);
      } else if (($.isValidVariable(flight.cpriority)
        && flight.cpriority > FlightCoordination.PRIORITY_NORMAL)) {
        return FlightCoordination.getPriorityZh(flight.cpriority, flight.arrap);
      } else if ($.isValidVariable(flight.priority)) {
        return FlightCoordination.getPriorityZh(flight.priority, flight.arrap);
      } else {
        return FlightCoordination.getPriorityZh(
          FlightCoordination.PRIORITY_NORMAL, flight.arrap);
      }
    });

  };
  /**
   * 上客时间
   * @param flight
   */
  var fireFlightAsbtDataChange = function (flight) {
    var asbt = '';
    if ($.isValidVariable(flight.boardingTime)) {
      asbt = flight.boardingTime;
    }
    return formatTime(asbt);
  };
  /**
   * 关门时间
   * @param flight
   */
  var fireFlightAgctDataChange = function (flight) {
    var agct = '';
    if ($.isValidVariable(flight.closeTime)) {
      agct = flight.closeTime;
    } else if ($.isValidVariable(flight.fmeToday.RCldtime)) {
      agct = flight.fmeToday.RCldtime;
    }
    return formatTime(agct);
  };
  /**
   * fire aobt & atot
   * @param flight
   */
  var fireFlightAobtAndAtotDataChange = function (flight,flightid) {
    if (!$.isValidVariable(flight) || !$.isValidVariable(flight.fmeToday)) {
      return;
    }
    var aobt = '';
    var atot = '';
    if ($.isValidVariable(flight.aobt)) {
      aobt = flight.aobt;
    } else if ($.isValidVariable(flight.fmeToday.ROuttime)) {
      aobt = flight.fmeToday.ROuttime;
    }
    if ($.isValidVariable(flight.fmeToday.RDeptime)) {
      atot = flight.fmeToday.RDeptime;
    }

    $('#'+flightid+'aobt').text(formatTime(aobt));
    $('#'+flightid+'atot').text(formatTime(atot));

    // APP FIX/ACC FIX
    // 解析航迹
    var trajectors = FlightCoordination.parseMonitorPointInfo(flight);
    var controlInnerWaypointName = flight.controlInnerWaypointName; // app fix
    var controlWaypointName = flight.controlWaypointName; // acc fix
    if ($.isValidVariable(controlInnerWaypointName)) {
      var tra = trajectors[controlInnerWaypointName];
      if ($.isValidVariable(tra)) {
        $('#'+flightid+'a_appfix_time').text(formatTime(tra.A));
      }
    }
    if ($.isValidVariable(controlWaypointName)) {
      var tra = trajectors[controlWaypointName];
      if ($.isValidVariable(tra)) {
        $('#'+flightid+'a_accfix_time').text(formatTime(tra.A));
      }
    }
  };
  /**
   * fire hobt & htot
   * @param flight
   */
  var fireFlightHobtAndHtotDataChange = function (flight,flightid) {
    if (!$.isValidVariable(flight) || !$.isValidVariable(flight.fmeToday)) {
      return;
    }
    var hobt = flight.hobt;
    var htot = flight.hctot;
    $('#'+flightid+'hobt').text(formatTime(hobt));
    $('#'+flightid+'htot').text(formatTime(htot));

  };

  /**
   * fire cobt
   * @param flight
   */
  var fireFlightCobtAndCtotDataChange = function (flight,flightid) {
    if (!$.isValidVariable(flight) || !$.isValidVariable(flight.fmeToday)) {
      return;
    }

    var cobt = '';
    var ctot = '';
    if ($.isValidVariable(flight.cobt)) {
      cobt = flight.cobt;
    } else if ($.isValidVariable(flight.autoSlot)
      && $.isValidVariable(flight.autoSlot.cobt)) {
      cobt = flight.autoSlot.cobt;
    }
    if ($.isValidVariable(flight.ctd)) {
      ctot = flight.ctd;
    } else if ($.isValidVariable(flight.autoSlot)
      && $.isValidVariable(flight.autoSlot.ctd)) {
      ctot = flight.autoSlot.ctd;
    }

    $('#'+flightid+'cobt').text(formatTime(cobt));
    $('#'+flightid+'ctot').text(formatTime(ctot));

    // APP FIX/ACC FIX
    // 解析航迹
    var trajectors = FlightCoordination.parseMonitorPointInfo(flight);
    var controlInnerWaypointName = flight.controlInnerWaypointName; // app fix
    var controlWaypointName = flight.controlWaypointName; // acc fix
    if ($.isValidVariable(controlInnerWaypointName)) {
      var tra = trajectors[controlInnerWaypointName];
      if ($.isValidVariable(tra)) {
        $('#'+flightid+'c_appfix_time').text(formatTime(tra.C));
      }
    }
    if ($.isValidVariable(controlWaypointName)) {
      var tra = trajectors[controlWaypointName];
      if ($.isValidVariable(tra)) {
        $('#'+flightid+'c_accfix_time').text(formatTime(tra.C));
      }
    }
  };
  /**
   * fire tobt & ttot
   * @param flight
   */
  var fireFlightTobtAndTtotDataChange = function (flight,flightid) {
    if (!$.isValidVariable(flight) || !$.isValidVariable(flight.fmeToday)) {
      return;
    }
    // TODO 需要根据TOBT来源显示不同的title信息
    var tobt = '';
    var ttot = '';
    var tobtSource = null;
    var tobtArray = FlightCoordination.getTOBT(flight);
    if ($.isValidVariable(tobtArray)) {
      tobt = tobtArray[0];
      tobtSource = tobtArray[1];
    }
    if ($.isValidVariable(tobt) && $.isValidVariable(flight.taxi)) {
      ttot = $.addStringTime(tobt, flight.taxi * 60 * 1000);
    }
    $('#'+flightid+'tobt').text(formatTime(tobt));
    $('#'+flightid+'ttot').text(formatTime(ttot));

    // APP FIX/ACC FIX
    // 解析航迹
    var trajectors = FlightCoordination.parseMonitorPointInfo(flight);
    var controlInnerWaypointName = flight.controlInnerWaypointName; // app fix
    var controlWaypointName = flight.controlWaypointName; // acc fix
    if ($.isValidVariable(controlInnerWaypointName)) {
      var tra = trajectors[controlInnerWaypointName];
      if ($.isValidVariable(tra)) {
        $('#'+flightid+'t_appfix_time').text(formatTime(tra.T));
      }
    }
    if ($.isValidVariable(controlWaypointName)) {
      var tra = trajectors[controlWaypointName];
      if ($.isValidVariable(tra)) {
        $('#'+flightid+'t_accfix_time').text(formatTime(tra.T));
      }
    }

  };
  /**
   * 除冰信息
   * @param flight
   */
  var fireFlightDeiceDataChange = function (flight,flightid) {
    if (!$.isValidVariable(flight) || !$.isValidVariable(flight.fmeToday)) {
      return;
    }
    $('#'+flightid+'deice_status').text(function () {
      if ($.isValidVariable(flight.deiceStatus) && flight.deiceStatus == 1) {
        return '除冰';
      }
      return '否';
    });
    $('#'+flightid+'deice_position').text(function () {
      if ($.isValidVariable(flight.deicePosition)) {
        return flight.deicePosition;
      } else if ($.isValidVariable(flight.deiceStatus)
        && flight.deiceStatus == 1) {
        return '待定';
      }
      return '';
    });
    $('#'+flightid+'deice_group').text(function () {
      if ($.isValidVariable(flight.deiceGroup)) {
        return flight.deiceGroup;
      }
      return '';
    });
  };
  /**
   * 跑道信息
   * @param flight
   */
  var fireFlightRunwayDataChange = function (flight,flightid) {
    if (!$.isValidVariable(flight) || !$.isValidVariable(flight.fmeToday)) {
      return;
    }
    var runway = '';
    if ($.isValidVariable(flight.runway)) {
      runway = flight.runway;

    } else if ($.isValidVariable(flight.crunway)) {
      runway = flight.crunway;
    }
    $('#'+flightid+'runway').text(runway);
    $('#'+flightid+'taxi').text(flight.taxi + ' mins');

    // 如果航班已起飞，taxi由atot - aobt
    if (FmeToday.hadDEP(flight.fmeToday)) {
      var aobt = '';
      var atot = '';
      if ($.isValidVariable(flight.aobt)) {
        aobt = flight.aobt;
      } else if ($.isValidVariable(flight.fmeToday.ROuttime)) {
        aobt = flight.fmeToday.ROuttime;
      }
      if ($.isValidVariable(flight.fmeToday.RDeptime)) {
        atot = flight.fmeToday.RDeptime;
      }
      if ($.isValidVariable(aobt) && $.isValidVariable(atot)) {
        var taxi = $.calculateStringTimeDiff(atot, aobt) / 1000 / 60;
        $('#'+flightid+'taxi').text(taxi + ' mins');
      }
    }
  };
  /**
   * 停机位
   * @param flight
   */
  var fireFlightPositionDataChange = function (flight,flightid) {
    if (!$.isValidVariable(flight)) {
      return;
    }
    var position = '';
    if ($.isValidVariable(flight.position)) {
      position = flight.position;
    }
    $('#'+flightid+'position').text(position);
  };
  /**
   * 航迹信息
   * @param flight
   */
  var fireFlightTrajectorDataChange = function (flight,flightid) {
    if (!$.isValidVariable(flight) || !$.isValidVariable(flight.fmeToday)) {
      return;
    }
    // 航班所属方向
    if ($.isValidVariable(flight.clearanceDirection)) {
      $('#'+flightid+'flight_direction').text('(' + flight.clearanceDirectionZh + ')');
    }
    // 解析航迹
    var trajectors = FlightCoordination.parseMonitorPointInfo(flight);
    var autoSlotTrajectors = null;
    if ($.isValidVariable(flight.autoSlot)) {
      autoSlotTrajectors = FlightCoordination.parseAutoSlotMonitorPointInfo(flight.autoSlot);
    }
    //
    var trajectorsTable = $('#'+flightid+'trajectors_table');
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

      var tr = $('<tr>');
      var th = $('<th>', {
        text: tra.ID
      });
      var tdE = $('<td>').append($('<label>', {
        text: formatTime(traE) + '(E)'
      }));
      var tdP = $('<td>').append($('<label>', {
        text: formatTime(traP)
      }));
      var tdC = $('<td>').append($('<label>', {
        text: formatTime(traC)
      }));
      var tdT = $('<td>').append($('<label>', {
        text: formatTime(traT) + '(T)'
      }));
      var tdA = $('<td>').append($('<label>', {
        text: formatTime(traA)
      }));
      var tdDefault = $('<td>').append($('<label>', {
        text: ''
      }));
      tr.append(th);
      tr.append(tdP);
      tr.append(tdC);
      if ($.isValidVariable(traA)) {
        tr.append(tdA);
      } else if ($.isValidVariable(traT)) {
        tr.append(tdT);
      } else if ($.isValidVariable(flight.atd)
        || $.isValidVariable(flight.estInfo)
        || $.isValidVariable(flight.updateTime)) {
        if ($.isValidVariable(tdE)) {
          tr.append(tdE);
        }
      } else {
        tr.append(tdDefault);
      }
      trajectorsTable.append(tr);
    }
  };
  /**
   * 延误统计
   * @param flight
   */
  var fireFlightDelayDataChange = function (flight,flightid) {
    if (!$.isValidVariable(flight) || !$.isValidVariable(flight.fmeToday)) {
      return;
    }
    $('#'+flightid+'close_wait').text(function () {
      if ($.isValidVariable(flight.closeWait)) {
        return flight.closeWait + ' mins';
      } else {
        return 'N/A';
      }
    });
    $('#'+flightid+'taxi_wait').text(function () {
      if ($.isValidVariable(flight.taxiWait)) {
        return flight.taxiWait + ' mins';
      } else {
        return 'N/A';
      }
    });
    // S延误
    $('#'+flightid+'s_delay').text(function () {
      if ($.isValidVariable(flight.sdelay)) {
        return flight.sdelay + ' mins';
      } else {
        return 'N/A';
      }
    });
    // P延误
    $('#'+flightid+'p_delay').text(function () {
      if ($.isValidVariable(flight.pdelay)) {
        return flight.pdelay + ' mins';
      } else {
        return 'N/A';
      }
    });
    // 推出偏离
    $('#'+flightid+'outtime_deviate').text(function () {
      if ($.isValidVariable(flight.aobtCobtDiff)) {
        return flight.aobtCobtDiff + ' mins';
      } else {
        return 'N/A';
      }
    });
    // 关门偏离
    $('#'+flightid+'colse_deviate').text(function () {
      if ($.isValidVariable(flight.agctCobtDiff)) {
        return flight.agctCobtDiff + ' mins';
      } else {
        return 'N/A';
      }

    });
    // 起飞偏离
    $('#'+flightid+'dep_deviate').text(function () {
      if ($.isValidVariable(flight.atotCtotDiff)) {
        return flight.atotCtotDiff + ' mins';
      } else {
        return 'N/A';
      }
    });
  };
  /**
   * 前段航班信息
   * @param flight 当前航班
   * @param formerFlight 前段航班
   */
  var fireFlightFormerDataChange = function (flight, formerFlight,flightid) {
    if (!$.isValidVariable(flight) || !$.isValidVariable(formerFlight) || !$.isValidVariable(formerFlight.fmeToday)) {
      return;
    }
    var fFmeToday = formerFlight.fmeToday;
    var formerDepap = $.isValidVariable(formerFlight.depap) ? formerFlight.depap : FmeToday.getRPSDepAP(fFmeToday);
    var formerArrap = $.isValidVariable(formerFlight.arrap) ? formerFlight.arrap : FmeToday.getRPSArrAP(fFmeToday);
    var hadRTN = FmeToday.hadRTN(fFmeToday);
    var hadALN = FmeToday.hadALN(fFmeToday);
    if (hadRTN) {
      formerArrap = FmeToday.getSPRArrAP(fFmeToday) + ' (返航至' + FmeToday.getRPSArrAP(fFmeToday) + ')';
    }
    if (hadALN) {
      formerArrap = FmeToday.getSPRArrAP(fFmeToday) + ' (备降至' + FmeToday.getRPSArrAP(fFmeToday) + ')';
    }
    $('#'+flightid+'former_title').text($.isValidVariable(flight.formerId) ? '(人工指定)' : '');
    $('#'+flightid+'former_flightid').text(fFmeToday.flightid + "(ID:" + fFmeToday.id + ")");
    $('#'+flightid+'former_carrier').text(fFmeToday.flightid.substr(0, 3));
    $('#'+flightid+'former_regnum').text(fFmeToday.PRegistenum);
    //机型
    var aircrafttype = "";
    if ($.isValidVariable(fFmeToday.PAircrafttype)) {
      aircrafttype = fFmeToday.PAircrafttype;
    } else if ($.isValidVariable(fFmeToday.SAircrafttype)) {
      aircrafttype = fFmeToday.SAircrafttype;
    }
    $('#'+flightid+'former_actype').text(aircrafttype);
    $('#'+flightid+'former_teletype').text(fFmeToday.teletype);
    $('#'+flightid+'former_telenew').text(fFmeToday.telenew);
    $('#'+flightid+'former_depap').text(formerDepap);
    $('#'+flightid+'former_arrap').text(formerArrap);
    $('#'+flightid+'former_sdeptime').text(formatTime(fFmeToday.SDeptime));
    $('#'+flightid+'former_sarrtime').text(formatTime(fFmeToday.SArrtime));
    $('#'+flightid+'former_sroute').text(fFmeToday.SRoute);
    if (FmeToday.hadFPL(fFmeToday)) {
      $('#'+flightid+'former_pdeptime').text(formatTime(fFmeToday.PDeptime));
      $('#'+flightid+'former_parrtime').text(formatTime(fFmeToday.PArrtime));
      $('#'+flightid+'former_proute').text(fFmeToday.PRoute);
    }
    var formerCplinfo = $.isValidVariable(fFmeToday.cplinfo) ? fFmeToday.cplinfo : '';
    $('#'+flightid+'former_cplinfo').text(formerCplinfo);
    $('#'+flightid+'former_rdeptime').text(formatTime(fFmeToday.RDeptime));
    $('#'+flightid+'former_rarrtime').text(formatTime(fFmeToday.RArrtime));
    // 关门时间
    $('#'+flightid+'former_agct').text(fireFlightAgctDataChange(formerFlight));
    // 推出时间
    var aobt = '';
    if ($.isValidVariable(formerFlight.aobt)) {
      aobt = formerFlight.aobt;
    } else if ($.isValidVariable(fFmeToday.ROuttime)) {
      aobt = fFmeToday.ROuttime;
    }
    $('#'+flightid+'former_aobt').text(formatTime(aobt));

  };
  /**
   * 基本信息
   * @param flight
   */
  var fireFlightBasicDataChange = function (flight, generate_time,flightid) {
    if (!$.isValidVariable(flight) || !$.isValidVariable(flight.fmeToday)) {
      return;
    }
    var fmeToday = flight.fmeToday;
    //document.title = fmeToday.flightid + ' 详情';
    var depap = $.isValidVariable(flight.depap) ? flight.depap : FmeToday.getRPSDepAP(fmeToday);
    var arrap = $.isValidVariable(flight.arrap) ? flight.arrap : FmeToday.getRPSArrAP(fmeToday);

    $('#'+flightid+'title_id').text(fmeToday.id);
    $('#'+flightid+'title_flightid').text(fmeToday.flightid);
    $('#'+flightid+'title_executedate').text(flight.executedate);
    $('#'+flightid+'title_depap').text(depap + '-');
    $('#'+flightid+'title_arrap').text(arrap);
    $('#'+flightid+'title_generatetime').text('数据时间：' + formatTime(generate_time));
    var status = FlightCoordination.getStatusZh(flight);
    if (!$.isValidVariable(status)) {
      status = '';
    }
    $('#'+flightid+'title_status').text(status);

    $('#'+flightid+'flightid').text(fmeToday.flightid);
    $('#'+flightid+'carrier').text(fmeToday.flightid.substr(0, 3));
    $('#'+flightid+'regnum').text(fmeToday.PRegistenum);
    //机型
    var aircrafttype = "";
    if ($.isValidVariable(fmeToday.PAircrafttype)) {
      aircrafttype = fmeToday.PAircrafttype;
    } else if ($.isValidVariable(fmeToday.SAircrafttype)) {
      aircrafttype = fmeToday.SAircrafttype;
    }
    $('#'+flightid+'actype').text(aircrafttype);
    $('#'+flightid+'teletype').text($.isValidVariable(fmeToday.teletype) ? fmeToday.teletype : '');
    $('#'+flightid+'telenew').text($.isValidVariable(fmeToday.telenew) ? fmeToday.telenew : '');
    $('#'+flightid+'depap').text(depap);
    var hadRTN = FmeToday.hadRTN(fmeToday);
    var hadALN = FmeToday.hadALN(fmeToday);
    if (hadRTN) {
      arrap = FmeToday.getSPRArrAP(fmeToday) + ' (返航至' + FmeToday.getRPSArrAP(fmeToday) + ')';
    }
    if (hadALN) {
      arrap = FmeToday.getSPRArrAP(fmeToday) + ' (备降至' + FmeToday.getRPSArrAP(fmeToday) + ')';
    }
    $('#'+flightid+'arrap').text(arrap);
    $('#'+flightid+'sdeptime').text(formatTime(fmeToday.SDeptime));
    $('#'+flightid+'sarrtime').text(formatTime(fmeToday.SArrtime));
    $('#'+flightid+'sroute').text(fmeToday.SRoute);
    if (FmeToday.hadFPL(fmeToday)) {
      $('#'+flightid+'pdeptime').text(formatTime(fmeToday.PDeptime));
      $('#'+flightid+'parrtime').text(formatTime(fmeToday.PArrtime));
      $('#'+flightid+'proute').text(fmeToday.PRoute);
    }
    var cplinfo = $.isValidVariable(fmeToday.cplinfo) ? fmeToday.cplinfo : '';
    $('#'+flightid+'cplinfo').text(cplinfo);


    $('#'+flightid+'appfix').text(flight.controlInnerWaypointName);
    $('#'+flightid+'accfix').text(flight.controlWaypointName);

    $('#'+flightid+'former_arrtime_e').hide();
    $('#'+flightid+'former_arrtime_d').hide();
    $('#'+flightid+'former_arrtime_r').hide();

    // 前段()降落时间
    if ($.isValidVariable(flight.formerArrtime)
      && flight.formerArrtime.length >= 13) {
      var s = flight.formerArrtime.substring(0, 1);
      var time = formatTime(flight.formerArrtime.substring(1, 13));
      $('#'+flightid+'former_earrtime').text(time);
      if (s == 'R') {
        $('#'+flightid+'former_arrtime_r').show();
      } else if (s == 'D') {
        $('#'+flightid+'former_arrtime_d').show();
      } else {
        $('#'+flightid+'former_arrtime_e').show();
      }
    }

    // 本段预计关门时间
    var tobt = '';
    var tobtArray = FlightCoordination.getTOBT(flight);
    if ($.isValidVariable(tobtArray)) {
      tobt = tobtArray[0];
    }
    $('#'+flightid+'basic_tobt').text(formatTime(tobt));

    // 上客时间,关门时间
    $('#'+flightid+'asbt').text(fireFlightAsbtDataChange(flight));
    $('#'+flightid+'agct').text(fireFlightAgctDataChange(flight));

    // 实际起降时间
    $('#'+flightid+'rdeptime').text(formatTime(fmeToday.RDeptime));
    $('#'+flightid+'rarrtime').text(formatTime(fmeToday.RArrtime));

  };
  /**
   * 触发航班详细信息变更
   *
   */
  var fireFlightDetailDataChange = function (flight, formerFlight, flightCoordinationRecords, generate_time,flightid) {
    // 触发数据一系列的变更
    fireFlightBasicDataChange(flight, generate_time,flightid);
    fireFlightFormerDataChange(flight, formerFlight,flightid);
    fireFlightDelayDataChange(flight,flightid);
    fireFlightTrajectorDataChange(flight,flightid);

    fireFlightPositionDataChange(flight,flightid);
    fireFlightRunwayDataChange(flight,flightid);
    fireFlightDeiceDataChange(flight,flightid);

    fireFlightTobtAndTtotDataChange(flight,flightid);
    fireFlightHobtAndHtotDataChange(flight,flightid);
    fireFlightCobtAndCtotDataChange(flight,flightid);
    fireFlightNCobtAndNCtotDataChange(flight,flightid);
    fireFlightAobtAndAtotDataChange(flight,flightid);
    fireFlightEobtAndEtotDataChange(flight,flightid);

    fireFlightPriorityDataChange(flight,flightid);
    fireFlightPoolStatusDataChange(flight,flightid);
    fireFlightSlotStatusDataChange(flight, generate_time,flightid);
    fireFlightClearanceStatusDataChange(flight,flightid);
    fireFlightDelayReasonDataChange(flight,flightid);
    fireFlightQualificationsDataChange(flight,flightid);

    fireFlowcontrolDataChange(flight,flightid);
    fireRestrictionDataChange(flight,flightid);
    fireFlightRecordDataChange(flight, flightCoordinationRecords,flightid);
    fireFlightEFPSDataChange(flight,flightid);
  };
  /**
   * 初始化基础数据-系统信息
   */
  var initializeBasicDataSystem = function () {
    $.ajax({
      url: retrieve_system_configs_url,
      type: 'GET',
      dataType: 'json',
      success: function (data, status, xhr) {
        if (data != null) {
          server_peer_name = data['SERVER_PEER_NAME'];
          system_configs = data['SYSTEM_CONFIGS'];
        }
      },
      error: function (xhr, status, error) {
        console.error('retrieve system data failed, state: ');
        console.error(state);
      }
    });
  };
  /**
   * 获取航班详细信息
   */
  var retrieveFlightDetailData = function (dataobj,flightid,generate_time) {
    var param = {
      'id': $('#'+flightid+'fid').val()
    };

    var flight = dataobj;

    var flightCoordinationRecords = dataobj['coordinationRecords'];
    fc = flight;
    // 前段航班ID
    var formerId = '';
    if($.isValidVariable(dataobj.formerId) ){
      formerId = dataobj.formerId
    }else if($.isValidObject(dataobj.fmeToday) && $.isValidVariable(dataobj.fmeToday.formerId) ){
          formerId = dataobj.fmeToday.formerId;
    }

    if($.isValidVariable(formerId)){
      var userId = localStorage.getItem("userId");
      if($.isValidVariable(userId)){
        $.ajax({
          url: ipHost + "flight?userId="+userId+"&id="+formerId,
          type: 'GET',
          dataType: 'json',
          success: function (data, status, xhr) {
            if ( data!= null &&data.status == 200 &&$.isValidObject(data.result) ) {
              var formerFlight = data.result[formerId]
              clearCollaborateTable(flightid);
              fireFlightDetailDataChange(flight, formerFlight, flightCoordinationRecords, generate_time,flightid);
              //bindFlowcontrolDetailDialog(flight);
              rebuildCollaborateRule(flight);
              changeCollaborateStyle(flight,flightid);
            }
          },
          error: function (xhr, status, error) {
            console.error('retrieve system data failed, state: ');
            console.error(state);
          }
        });
      }
      return
    }
    var formerFlight = {};
    clearCollaborateTable(flightid);
    fireFlightDetailDataChange(flight, formerFlight, flightCoordinationRecords, generate_time,flightid);
    //bindFlowcontrolDetailDialog(flight);
    rebuildCollaborateRule(flight);
    changeCollaborateStyle(flight,flightid);

  };
  /**
   * 获取前段航班
   * @param formerFlightId
   */
  var retrieveFormerFlightDetailData = function (formerFlightId) {
  }

  /**
   * 绑定组件事件
   */
  var bindComponentEvent = function () {
    // 数据项展开/收缩
    $('.flight_detail_item_title').on('click', function (event) {
      $(this).next('.flight_detail_table').toggle();
      event.preventDefault();
    });
    // TODO 隐藏数据操作项
    $('.flight_detail_table_edit_field').removeClass();
  };
  /**
   * 初始化定时服务
   */
  var initializeTimerTask = function () {
    $(document).onTime(
      FreshOnTimeUtil.getFreshTime(FreshOnTimeUtil.interval),
      'retrieve_flight_detail_data_timer',
      retrieveFlightDetailData,
      0);
    $(document).onTime(
      FreshOnTimeUtil.getFreshTime(FreshOnTimeUtil.interval),
      'retrieve_system_config_timer',
      initializeBasicDataSystem,
      0);
  };

  /**
   * 初始化组件
   */
  var initComponent = function () {
    // 初始化dhx window
    dhxWins = new dhtmlXWindows();
  };

  return {
    initComponent: initComponent,
    initializeTimerTask: initializeTimerTask,
    initializeBasicDataSystem: initializeBasicDataSystem,
    bindComponentEvent: bindComponentEvent,
    retrieveFlightDetailData: retrieveFlightDetailData,
    retrieveAirportConfiguration: retrieveAirportConfiguration,
    retrieveUser: retrieveUser
  }
}();