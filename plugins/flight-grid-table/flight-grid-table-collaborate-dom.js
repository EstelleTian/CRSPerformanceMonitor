/**
 * 航班计划表格协同操作DOM
 */
var FlightGridTableCollaborateDom =function() {
	//航班
	var FLIGHT_DOM = '<div class="form-group">' +
		'<label class="sr-only" for="flightid">flightid</label>' +
		'<div class="input-group form-group-custom"><span class="input-group-addon">航班</span>' +
		'<input type="text" id="flightid" class="form-control" title="" value="" readonly="">' +
		'</div>' +
		'</div>';
	//机场
	var AIRPORT_DOM = '<div class="form-group">' +
		'<label class="sr-only" for="airport">airport</label>' +
		'<div class="input-group form-group-custom"><span class="input-group-addon">机场</span>' +
		'<input type="text" id="airport" class="form-control" title="" value="" readonly="">' +
		'</div>' +
		'</div>' ;
	//日期
	var DATE_DOM = '<div class="form-group">' +
		'<label class="sr-only" for="update-ctd-date">Date</label>' +
		'<div class="input-group form-group-custom has-feedback"><span class="input-group-addon">日期</span>' +
		'<input type="text" maxlength="8" name="date" id="update-date" class="form-control date_input" readonly placeholder="请选择日期">' +
		'<span class="glyphicon form-control-feedback" aria-hidden="true"></span>' +
		'<span id="inputSuccess1Status" class="sr-only"></span>' +
		'</div>' +
		'</div>' ;
	//时间
	var TIME_DOM = '<div class="form-group">' +
		'<label class="sr-only" for="update-ctd-time">Time</label>' +
		'<div class="input-group form-group-custom has-feedback"><span class="input-group-addon">时间</span>' +
		'<input type="text" maxlength="4" name="time" id="update-time" class="form-control" placeholder="请输入时间">' +
		'<span class="glyphicon form-control-feedback" aria-hidden="true"></span>' +
		'<span id="inputSuccess1Status" class="sr-only"></span>' +
		'</div>' +
		'</div>' ;
	//禁止系统自动调整
	var LOCKED_DOM = '<div class="form-group"><div class="checkbox"><label><input type="checkbox" name="lockedValue" value="1">禁止系统自动调整 </label></div></div>';
	//协调备注
	var	COMMENT_DOM = '<div class="form-group form-group-custom">' +
		'<textarea id="comment" name="comment" class="form-control collaborate-textarea" maxlength="100" rows="4" placeholder="协调备注（可选最大长度100个文字）"></textarea>' +
		'</div>';
	//原始
	var ORIGINAL_DOM = '<div class="form-group">' +
		'<label class="sr-only" for="original-value">original-value</label>' +
		'<div class="input-group form-group-custom">' +
		'<span class="input-group-addon">原始</span>' +
		'<input type="text" id="original-value" class="form-control" title="" value="" readonly />' +
		'</div>' +
		'</div>' ;
	//申请
	var APPLY_DOM = '<div class="form-group">' +
		'<label class="sr-only" for="apply-value">apply-value</label>' +
		'<div class="input-group form-group-custom">' +
		'<span class="input-group-addon">申请</span>' +
		'<input type="text" id="apply-value" class="form-control" title="" value="" readonly />' +
		'</div>' +
		'</div>' ;
	//申请备注
	var APPLY_COMMENT_DOM = '<div class="form-group">' +
		'<label>申请备注</label>'+
		'<textarea id="apply-comment" name="comment" class="form-control collaborate-textarea form-group-custom" maxlength="100" rows="4" title=""  placeholder="申请备注(最大长度100个文字)"></textarea>' +
		'</div>';
	//批复备注
	var APPROVE_COMMENT_DOM = '<div class="form-group">' +
		'<label>批复备注</label>'+
		'<textarea id="approve-comment" name="comment" class="form-control collaborate-textarea form-group-custom" maxlength="100" rows="4" placeholder="批复备注(最大长度100个文字)"></textarea>' +
		'</div>';

	return {
		/**
		 * FLIGHTID操作
		 */
		UPDATE_FLIGHTID :
		'<div class="flight-grid-table-collaborate-container flight-grid-table-collaborate-container-flightid">'	+
		'<input type="button" id="open-flight-detail" class="atfm-btn atfm-btn-blue collaborate-content-button form-group-custom" value="查看航班详情"/>' +
		// '<input type="button" id="open-flight-record" class="atfm-btn atfm-btn-blue collaborate-content-button form-group-custom" value="查看协调记录"/>' +
		// '<input type="button" id="open-flight-tele" class="atfm-btn atfm-btn-blue collaborate-content-button form-group-custom" value="查看航班报文"/>' +
		// '<input type="button" id="update-former-flight" class="atfm-btn atfm-btn-blue collaborate-content-button form-group-custom" value="指定前序航班"/>' +
		// '<input type="button" id="mark-cancel" class="atfm-btn atfm-btn-red collaborate-content-button form-group-custom" value="标记航班取消"/>' +
		// '<input type="button" id="mark-un-cancel" class="atfm-btn atfm-btn-green collaborate-content-button form-group-custom" value="标记取消恢复"/>' +
		// '<input type="button" id="ready-complete" class="atfm-btn atfm-btn-green collaborate-content-button form-group-custom" value="标记准备完毕"/>' +
		// '<input type="button" id="ready-un-complete" class="atfm-btn atfm-btn-red collaborate-content-button form-group-custom" value="标记未准备完毕"/>' +
		// '<input type="button" id="apply-out-pool" class="atfm-btn atfm-btn-yellow collaborate-content-button form-group-custom" value="申请移出等待池"/>' +
		// '<input type="button" id="approve-out-pool" class="atfm-btn atfm-btn-green collaborate-content-button form-group-custom" value="批复移出等待池"/>' +
		// '<input type="button" id="refuse-out-pool" class="atfm-btn atfm-btn-red collaborate-content-button form-group-custom" value="拒绝移出等待池"/>' +
		// '<input type="button" id="direct-in-pool" class="atfm-btn atfm-btn-red collaborate-content-button form-group-custom" value="移入等待池"/>' +
		// '<input type="button" id="direct-out-pool" class="atfm-btn atfm-btn-green collaborate-content-button form-group-custom" value="移出等待池"/>' +
		// '<input type="button" id="mark-un-clearance" class="atfm-btn atfm-btn-red collaborate-content-button form-group-custom" value="标记未放行"/>' +
		// '<input type="button" id="mark-clearance" class="atfm-btn atfm-btn-green collaborate-content-button form-group-custom" value="标记已放行"/>' +
		// '<input type="button" id="mark-assign-slot" class="atfm-btn atfm-btn-green collaborate-content-button form-group-custom" value="参加时隙分配"/>' +
		// '<input type="button" id="mark-un-assign-slot" class="atfm-btn atfm-btn-red collaborate-content-button form-group-custom" value="退出时隙分配"/>' +
		// '<input type="button" id="mark-exempt" class="atfm-btn atfm-btn-green collaborate-content-button form-group-custom" value="标记豁免"/>' +
		// '<input type="button" id="mark-exempt-cancel" class="atfm-btn atfm-btn-red collaborate-content-button form-group-custom" value="取消豁免"/>' +
			//'<input type="button" id="apply-ctot" class="atfm-btn atfm-btn-yellow collaborate-content-button form-group-custom" value="CTOT申请"/>' +
			//'<input type="button" id="approve-ctot" class="atfm-btn atfm-btn-green collaborate-content-button form-group-custom" value="CTOT批复"/>' +
		'<form action="" method="post">' +
		'<input type="hidden" name="id" value="" />' +
		'<input type="hidden" name="status" value="" />' +
		'<input type="hidden" name="inpoolStatus" value="" />' +
		'<input type="hidden" name="assignSlotStatus" value="" />' +
		'<textarea id="comment" name="comment" class="form-control collaborate-textarea form-group-custom" maxlength="100" rows="4" placeholder="协调备注（可选最大长度100个文字）"></textarea>' +
		'</form>' +
		'</div>',

		/**
		 * 优先级申请
		 */
		APPLY_PRIORITY :
		'<div class="panel panel-info flight-grid-table-collaborate-container"><div class="panel-heading"><h3 class="panel-title">优先级申请</h3><a class="glyphicon glyphicon-remove modal-close-btn"></a></div><div class="panel-body">' +
		'<form action="" method="post">' +
		'<div class="form-group form-group-custom" id="priority">'+
		'<div class="radio">' +
		'<label>' +
		'<input type="radio" name="priority" value="0" />' +
		'普通' +
		'</label>' +
		'</div>' +
		'<div class="radio">' +
		'<label>' +
		'<input type="radio" name="priority" value="10" />' +
		'特别协调' +
		'</label>' +
		'</div>' +
		'<div class="radio">' +
		'<label>' +
		'<input type="radio" name="priority" value="30" />' +
		'国内转国际' +
		'</label>' +
		'</div>' +
		'<div class="radio">' +
		'<label>' +
		'<input type="radio" name="priority" value="48" />' +
		'豁免' +
		'</label>' +
		'</div>' +
		'<div class="radio">' +
		'<label>' +
		'<input type="radio" name="priority" value="50" />' +
		'航班要客' +
		'</label>' +
		'</div>' +
		'</div>' +
		'<div class="form-group form-group-custom">' +
		'<textarea id="apply-comment" name="comment" class="form-control collaborate-textarea" maxlength="100" rows="4" placeholder="协调备注（可选最大长度100个文字）"></textarea>' +
		'</div>' +
		'<input type="hidden" name="id" value="" />' +
		'<div class="form-group form-group-custom">' +
		'<button type="button" id="apply" class="atfm-btn atfm-btn-yellow collaborate-content-level pos-right">申请</button>' +
			//'<button type="button" id="cancel" class="btn btn-default collaborate-content-level">取消</button>' +
		'</div>' +
		'</form>' +
		'</div></div>',

		/**
		 * 优先级批复
		 */
		APPROVE_PRIORITY :
		'<div class="panel panel-info flight-grid-table-collaborate-container"><div class="panel-heading"><h3 class="panel-title">优先级批复</h3><a class="glyphicon glyphicon-remove modal-close-btn"></a></div><div class="panel-body">' +
		'<form action="" method="post">' +
		ORIGINAL_DOM +
		APPLY_DOM +
		APPLY_COMMENT_DOM +
		APPROVE_COMMENT_DOM +
		'<input type="hidden" name="id" value="" />' +
		'<input type="hidden" name="priority" value="" />' +
		'<div class="form-group form-group-custom">' +
		'<button type="button" id="approve" class="atfm-btn atfm-btn-green collaborate-content-level pos-right">批复</button>' +
		'<button type="button" id="refuse" class="atfm-btn atfm-btn-red collaborate-content-level">拒绝</button>' +
		'</div>' +
		'</form>' +
		'</div></div>',

		/**
		 * TOBT申请
		 */

		APPLY_TOBT : '<div class="panel panel-info flight-grid-table-collaborate-container">' +
		'<div class="panel-heading"><h3 class="panel-title">TOBT申请变更</h3><a class="glyphicon glyphicon-remove modal-close-btn"></a></div>' +
		'<div class="panel-body">' +
		'<form action="" method="post" class="valid_form">' +
		FLIGHT_DOM +
		AIRPORT_DOM +
		DATE_DOM +
		TIME_DOM +
		APPLY_COMMENT_DOM +
		'<input type="hidden" name="id" value="28299343">' +
		'<div class="form-group form-group-custom">' +
		'<button type="submit" id="apply" class="atfm-btn atfm-btn-yellow collaborate-content-level pos-right">申请</button>' +
		'</div>' +
		'</form></div></div>',

		/**
		 * TOBT批复
		 */
		APPROVE_TOBT :
		'<div class="panel panel-info flight-grid-table-collaborate-container">' +
		'<div class="panel-heading"><h3 class="panel-title">TOBT批复变更</h3><a class="glyphicon glyphicon-remove modal-close-btn"></a></div><div class="panel-body">' +
		'<form action="" method="post">' +
		FLIGHT_DOM +
		AIRPORT_DOM +
		ORIGINAL_DOM +
		APPLY_DOM +
		APPLY_COMMENT_DOM +
		DATE_DOM +
		TIME_DOM +
		APPROVE_COMMENT_DOM +
		'<input type="hidden" name="id" value="" />' +
		'<div class="form-group form-group-custom">' +
		'<button type="submit" id="approve" class="atfm-btn atfm-btn-green collaborate-content-level pos-right">批复</button>' +
		'<button type="button" id="refuse" class="atfm-btn atfm-btn-red collaborate-content-level">拒绝</button>' +
		'</div>' +
		'</form>' +
		'</div></div>',

		/**
		 * HOBT申请
		 */
		APPLY_HOBT :
		'<div class="panel panel-info flight-grid-table-collaborate-container"><div class="panel-heading">' +
		'<h3 class="panel-title">HOBT申请变更</h3><a class="glyphicon glyphicon-remove modal-close-btn"></a></div><div class="panel-body">' +
		'<form action="" method="post">' +
		FLIGHT_DOM +
		AIRPORT_DOM +
		DATE_DOM +
		TIME_DOM +
		APPLY_COMMENT_DOM +
		'<input type="hidden" name="id" value="" />' +
		'<div class="form-group form-group-custom"">' +
		'<button type="submit" id="apply" class="atfm-btn atfm-btn-yellow collaborate-content-level pos-right">申请</button>' +
		'</div>' +
		'</form>' +
		'</div></div>',
		/**
		 * 预留时隙添加
		 */
		RESERVED_SLOT :
		'<div class="panel panel-info flight-grid-table-collaborate-container"><div class="panel-heading">' +
		'<h3 class="panel-title">预留时隙添加</h3><a class="glyphicon glyphicon-remove modal-close-btn"></a></div><div class="panel-body">' +
		'<form action="" method="post">'+
		'<div class="form-group">' +
		'<label class="sr-only" for="update-ctd-time">Flight</label>' +
		'<div class="input-group form-group-custom has-feedback"><span class="input-group-addon">航班号</span>' +
		'<input type="text" name="flightId" id="flightId" class="form-control flightId-toupper" placeholder="输入航班号">' +
		'<span class="glyphicon form-control-feedback" aria-hidden="true"></span>' +
		'<span id="inputSuccess1Status" class="sr-only"></span>' +
		'</div>' +
		'</div>'+
		'<div class="form-group form-group-custom"">' +
		'<textarea id="slot-comment" name="comment" class="form-control collaborate-textarea" maxlength="100" rows="4" placeholder="预留备注（可选最大长度100个文字）"> </textarea> <span class="commetTip">备注最大长度为100个文字</span>'+
		'</div>' +
		'<button type="button" id="add-slot" class="atfm-btn atfm-btn-blue collaborate-content-level pos-right">指定</button>' +
	    '</div>' +
		'</form>' +
		'</div></div>',
		/**
		 * HOBT批复
		 */
		APPROVE_HOBT :
		'<div class="panel panel-info flight-grid-table-collaborate-container"><div class="panel-heading">' +
		'<h3 class="panel-title">HOBT批复变更</h3><a class="glyphicon glyphicon-remove modal-close-btn"></a></div><div class="panel-body">' +
		'<form action="" method="post">' +
		FLIGHT_DOM +
		AIRPORT_DOM +
		ORIGINAL_DOM +
		APPLY_DOM +
		APPLY_COMMENT_DOM +
		DATE_DOM +
		TIME_DOM +
		APPROVE_COMMENT_DOM +
		'<input type="hidden" name="id" value="" />' +
		'<div class="form-group form-group-custom">' +
		'<button type="submit" id="approve" class="atfm-btn atfm-btn-green collaborate-content-level pos-right">批复</button>' +
		'<button type="button" id="refuse" class="atfm-btn atfm-btn-red collaborate-content-level">拒绝</button>' +
		'</div>' +
		'</form>' +
		'</div></div>',

		/**
		 * 上客时间修改
		 */
		UPDATE_ASBT :
		'<div class="panel panel-info flight-grid-table-collaborate-container"><div class="panel-heading">' +
		'<h3 class="panel-title">上客时间修改</h3><a class="glyphicon glyphicon-remove modal-close-btn"></a></div><div class="panel-body">' +
		'<form action="" method="post">' +
		FLIGHT_DOM +
		AIRPORT_DOM +
		DATE_DOM +
		TIME_DOM +
		COMMENT_DOM +
		'<input type="hidden" name="id" value="" />' +
		'<div class="form-group form-group-custom">' +
		'<button type="submit" id="update" class="atfm-btn atfm-btn-blue collaborate-content-level pos-right">确定</button>' +
		'<button type="button" id="clear" class="atfm-btn atfm-btn-red collaborate-content-level">清除</button>' +
		'</div>' +
		'</form>' +
		'</div></div>',

		/**
		 * 关舱门时间修改
		 */
		UPDATE_AGCT :
		'<div class="panel panel-info flight-grid-table-collaborate-container"><div class="panel-heading">' +
		'<h3 class="panel-title">关舱门时间修改</h3><a class="glyphicon glyphicon-remove modal-close-btn"></a></div><div class="panel-body">' +
		'<form action="" method="post">' +
		FLIGHT_DOM +
		AIRPORT_DOM +
		DATE_DOM +
		TIME_DOM +
		COMMENT_DOM +
		'<input type="hidden" name="id" value="" />' +
		'<div class="form-group form-group-custom">' +
		'<button type="submit" id="update" class="atfm-btn atfm-btn-blue collaborate-content-level pos-right">确定</button>' +
		'<button type="button" id="clear" class="atfm-btn atfm-btn-red collaborate-content-level">清除</button>' +
		'</div>' +
		'</form>' +
		'</div></div>',

		/**
		 * COBT变更
		 */
		UPDATE_COBT :
		'<div class="panel panel-info flight-grid-table-collaborate-container"><div class="panel-heading">' +
		'<h3 class="panel-title">COBT时间变更</h3><a class="glyphicon glyphicon-remove modal-close-btn"></a></div>' +
		'<div class="panel-body">' +
		'<form action="" method="post">' +
		FLIGHT_DOM +
		AIRPORT_DOM +
		DATE_DOM +
		TIME_DOM +
		LOCKED_DOM +
		COMMENT_DOM +
		'<input type="hidden" name="id" value="28308673">' +
		'<input type="hidden" name="ctd" value="">' +
		'<input type="hidden" name="caseId" value="">' +
		'<div class="form-group form-group-custom">' +
		'<button type="button" id="update" class="atfm-btn atfm-btn-blue collaborate-content-level pos-right">指定</button>' +
		'<button type="button" id="clear" class="atfm-btn atfm-btn-red collaborate-content-level">撤销</button>' +
		'</div>' +
		'</form></div></div>',

		/**
		 * CTOT变更
		 */
		UPDATE_CTOT :
		'<div class="panel panel-info flight-grid-table-collaborate-container">' +
		'<div class="panel-heading">' +
		'<h3 class="panel-title">CTOT时间变更</h3><a class="glyphicon glyphicon-remove modal-close-btn"></a>' +
		'</div>' +
		'<div class="panel-body">' +
		'<form class="valid_form" action="" method="post">' +
		FLIGHT_DOM +
		AIRPORT_DOM +
		DATE_DOM +
		TIME_DOM +
		LOCKED_DOM +
		COMMENT_DOM +
		'<input type="hidden" name="id" value="28307656">' +
		'<input type="hidden" name="cobt" value="">' +
		'<input type="hidden" name="caseId" value="">' +
		'<div class="form-group form-group-custom">' +
		'<button type="button" id="update" class="atfm-btn atfm-btn-blue collaborate-content-level pos-right">指定</button>' +
		'<button type="button" id="clear" class="atfm-btn atfm-btn-red collaborate-content-level">撤销</button>' +
		'</div>' +
		'</form>' +
		'</div></div>',
		/**
		 * 停机位修改
		 */
		UPDATE_POSITION :
		'<div class="panel panel-info flight-grid-table-collaborate-container pos-width"><div class="panel-heading"><h3 class="panel-title">停机位修改</h3><a class="glyphicon glyphicon-remove modal-close-btn"></a></div><div class="panel-body">' +
		'<form action="" method="post">' +
		'<div class="form-group">' +
		'<label class="sr-only" for="position">Name</label>' +
		'<div class="input-group form-group-custom has-feedback">' +
		'<span class="input-group-addon">停机位</span>' +
		'<input type="text" maxlength="10" name="position" id="position" class="form-control" placeholder="请输入停机位" />' +
		'<span class="glyphicon form-control-feedback" aria-hidden="true"></span>' +
		'<span id="inputSuccess1Status" class="sr-only"></span>' +
		'</div>' +
		'</div>' +
		'<div class="form-group form-group-custom">' +
		'<textarea id="comment" name="comment" class="form-control collaborate-textarea" maxlength="100" rows="4" placeholder="协调备注（可选最大长度100个文字）"></textarea>' +
		'<input type="hidden" name="id" value="" />' +
		'</div>' +
		'<div class="form-group form-group-custom">' +
		'<button type="button" id="update" class="atfm-btn atfm-btn-blue collaborate-content-level pos-right">确定</button>' +
		'<button type="button" id="clear" class="atfm-btn atfm-btn-red collaborate-content-level">清除</button>' +
		'</div>' +
		'</div></div>',

		/**
		 * 跑道修改
		 */
		UPDATE_RUNWAY :
		'<div class="panel panel-info flight-grid-table-collaborate-container"><div class="panel-heading"><h3 class="panel-title">跑道修改</h3><a class="glyphicon glyphicon-remove modal-close-btn"></a></div><div class="panel-body">' +
		'<form action="" method="post">' +
		'<div class="form-group form-group-custom">' +
		'<div id="orunway">' +
		'</div>' +
		'</div>' +
		'<div class="form-group form-group-custom">' +
		'<textarea id="comment" name="comment" class="form-control collaborate-textarea" maxlength="100" rows="4" placeholder="协调备注（可选最大长度100个文字）"></textarea>' +
		'<input type="hidden" name="id" value="" />' +
		'</div>' +
		'<div class="form-group form-group-custom">' +
		'<button type="button" id="update" class="atfm-btn atfm-btn-blue collaborate-content-level pos-right">确定</button>' +
		'<button type="button" id="clear" class="atfm-btn atfm-btn-red collaborate-content-level">清除</button>' +
		'</div>' +
		'</form>' +
		'</div></div>',

		/**
		 * 延误原因修改
		 */
		UPDATE_DELAY_REASON :
		'<div class="panel panel-info flight-grid-table-collaborate-container"><div class="panel-heading"><h3 class="panel-title">延误原因修改</h3><a class="glyphicon glyphicon-remove modal-close-btn"></a></div><div class="panel-body">'+
		'<form action="" method="post">' +
		'<div class="from-group form-group-custom" id="delay-reason">' +
		'<div class="radio" >' +
		'<label>' +
		'<input type="radio" name="delay-reason" value="MILITARY">' +
		'军方' +
		'</label>' +
		'</div>' +
		'<div class="radio" >' +
		'<label>' +
		'<input type="radio" name="delay-reason" value="WEATHER">' +
		'天气' +
		'</label>' +
		'</div>' +
		'<div class="radio" >' +
		'<label>' +
		'<input type="radio" name="delay-reason" value="CONTROL">' +
		'流量' +
		'</label>' +
		'</div>' +
		'<div class="radio" >' +
		'<label>' +
		'<input type="radio" name="delay-reason" value="EQUIPMENT">' +
		'设备' +
		'</label>' +
		'</div>' +
		'<div class="radio" >' +
		'<label>' +
		'<input type="radio" name="delay-reason" value="FORMER">' +
		'前序' +
		'</label>' +
		'</div>' +
		'<div class="radio" >' +
		'<label>' +
		'<input type="radio" name="delay-reason" value="AOC">' +
		'公司' +
		'</label>' +
		'</div>' +
		'<div class="radio" >' +
		'<label>' +
		'<input type="radio" name="delay-reason" value="OTHER">' +
		'其他' +
		'</label>' +
		'</div>' +
		'</div>' +
		'<div class="form-group form-group-custom has-feedback" id="other-delay-reason-container">' +
		'<label class="sr-only" for="other-delay-reason">otherDelayReason</label>' +
		'<input type="text" name="otherDelayReason" id="other-delay-reason" class="form-control" placeholder="请输入其他原因" />' +
		'<span class="glyphicon form-control-feedback" aria-hidden="true"></span>' +
		'<span id="inputSuccess1Status" class="sr-only"></span>' +
		'</div>' +
		'<div class="from-group form-group-custom">' +
		'<button type="button" id="update" class="atfm-btn atfm-btn-blue collaborate-content-level pos-right">确定</button>' +
		'<button type="button" id="clear" class="atfm-btn atfm-btn-red collaborate-content-level">清除</button>' +
		'<input type="hidden" name="id" value="" />' +
		'<input type="hidden" name="delayReason" value="" />' +
		'</div>' +
		'</form>' +
		'</div></div>',

		/**
		 * 除冰状态
		 */
		UPDATE_DEICE_POSITION  :
		'<div class="panel panel-info flight-grid-table-collaborate-container"><div class="panel-heading"><h3 class="panel-title">除冰位修改</h3><a class="glyphicon glyphicon-remove modal-close-btn"></a></div><div class="panel-body">'+
		'<form action="" method="post">' +
		'<div class="form-group form-group-custom">' +
		'<div class="input-group">' +
		'<span class="input-group-addon">冰坪</span>' +
		'<select name="deice-position-select" class="form-control" id="deice-position-select"></select>'+
		'</div>' +
		'</div>' +
		'<div class="form-group form-group-custom">' +
		'<textarea id="comment" name="comment" class="form-control collaborate-textarea" maxlength="100" rows="4" placeholder="协调备注（可选最大长度100个文字）"></textarea>' +
		'<input type="hidden" name="id" value="" />' +
		'<input type="hidden" name="deicePosition" value="" />'+
		'</div>' +
		'<div class="form-group form-group-custom">' +
		'<button type="button" id="update" class="atfm-btn atfm-btn-blue collaborate-content-level pos-right">确定</button>' +
		'<button type="button" id="clear" class="atfm-btn atfm-btn-red collaborate-content-level">清除</button>' +
		'</div>' +
		'</form>' +
		'</div></div>',
		UPDATE_DEICE_STATUS:
		'<div class="panel panel-info flight-grid-table-collaborate-container pos-width"><div class="panel-heading"><h3 class="panel-title">除冰状态修改</h3><a class="glyphicon glyphicon-remove modal-close-btn"></a></div><div class="panel-body">'+
		'<form action="" method="post">' +
		'<div class="form-group">' +
		'<div class="input-group form-group-custom">' +
		'<span class="input-group-addon">' +
		'<input type="radio" name="deice-position" id="deice-position-radio" value="0">&nbsp;冰坪' +
		'</span>' +
		'<select name="deice-position-select" class="form-control" id="deice-position-select"></select>'+
		'</div>' +
		'</div>' +
		'<div class="form-group">' +
		'<div class="input-group form-group-custom has-feedback">' +
		'<span class="input-group-addon">' +
		'<input type="radio" name="deice-position" id="position-radio" value="1">&nbsp;机位' +
		'</span>' +
		'<input type="text" maxlength="10" name="position" aria-label="停机位号" id="position" class="form-control" placeholder="请输入停机位" />' +
		'<span class="glyphicon form-control-feedback" aria-hidden="true"></span>' +
		'</div>' +
		'</div>' +
		'<div class="form-group">' +
		'<label class="sr-only" for="deice_group">deice_group</label>' +
		'<div class="input-group form-group-custom">' +
		'<span class="input-group-addon">除冰分组</span>' +
		'<select name="deice-group-select" id="deice-group-select" class="form-control"></select>'+
		'</div>' +
		'</div>' +
		'<div class="form-group form-group-custom">' +
		'<textarea id="comment" name="comment" class="form-control collaborate-textarea" maxlength="100" rows="4" placeholder="协调备注（可选最大长度100个文字）"></textarea>' +
		'<input type="hidden" name="id" value="" />' +
		'<input type="hidden" name="deiceStatus" value="" />' +
		'<input type="hidden" name="deicePosition" value="" />'+
		'<input type="hidden" name="deiceGroup" value="" />' +
		'</div>' +
		'<div class="form-group form-group-custom">' +
		'<button type="button" id="update" class="atfm-btn atfm-btn-blue collaborate-content-level pos-right">确定</button>' +
		'<button type="button" id="clear" class="atfm-btn atfm-btn-red collaborate-content-level">清除</button>' +
		'</div>' +
		'</form>'+
		'</div></div>',

		/**
		 * 受控过点时间修改
		 */
		UPDATE_FLOWCONTROL_POINT_PASSTIME :
		'<div class="panel panel-info flight-grid-table-collaborate-container row" style="width:233px"><div class="panel-heading">' +
		'<h3 class="panel-title">受控过点时间修改</h3><a class="glyphicon glyphicon-remove modal-close-btn"></a></div><div class="panel-body">'+
		'<form class="FFixT_form" method="post">' +
		'<div id="left" class="col-md-11 ffixt_left" >' +
		FLIGHT_DOM +
		AIRPORT_DOM +
		DATE_DOM +
		TIME_DOM +
		LOCKED_DOM +
		COMMENT_DOM +
		'<input type="hidden" name="id" value="" />' +
		'<input type="hidden" name="sceneCaseId" value="" />' +
			//'<div class="form-group">' +
			//	'<div class="form-group-custom">' +
			//		'<label class="sr-only" for="flightid">flightid</label>' +
			//		'<div class="input-group form-group-custom">' +
			//			'<span class="input-group-addon">航班</span>' +
			//			'<input type="text" id="flightid" class="form-control" title="" value="" readonly />' +
			//		'</div>' +
			//		'<label class="sr-only" for="airport">airport</label>' +
			//		'<div class="input-group form-group-custom">' +
			//			'<span class="input-group-addon">机场</span>' +
			//			'<input type="text" id="airport" class="form-control" title="" value="" readonly />' +
			//		'</div>' +
			//	'</div>' +
			//	'<div class="form-group-custom">' +
			//		'<label class="sr-only" for="update-flowcontrol-point-passtime-date">Date</label>' +
			//		'<div class="input-group has-feedback">' +
			//			'<span class="input-group-addon">日期</span>' +
			//			'<input type="text" maxlength="8" name="date" id="update-flowcontrol-point-passtime-date" class="form-control" placeholder="请选择日期" readonly />' +
			//			'<span class="glyphicon form-control-feedback" aria-hidden="true"></span>' +
			//		'</div>' +
			//	'</div>' +
			//	'<div class="form-group-custom has-feedback">' +
			//		'<label class="sr-only" for="update-flowcontrol-point-passtime-time">Time</label>' +
			//		'<div class="input-group has-feedback">' +
			//			'<span class="input-group-addon">时间</span>' +
			//			'<input type="text" maxlength="4" name="time" id="update-flowcontrol-point-passtime-time" class="form-control" placeholder="请输入时间" />' +
			//			'<span class="glyphicon form-control-feedback" aria-hidden="true"></span>' +
			//		'</div>' +
			//	'</div>' +
			//
			//	'<div class="form-group-custom">' +
			//	'<div class="checkbox">' +
			//	    '<label>' +
			//	    	'<input type="checkbox" name="lockedValue" value="1" checked="checked"/>' +
			//	      	'禁止系统自动调整 ' +
			//	    '</label>' +
			//   '</div>' +
			//   '</div>' +
			//   '<div class="form-group-custom">' +
			//       '<textarea id="comment" name="comment" class="form-control collaborate-textarea"  maxlength="100" rows="4" placeholder="协调备注（可选最大长度100个文字）"></textarea>' +
			//       '<input type="hidden" name="id" value="" />' +
			//       '<input type="hidden" name="sceneCaseId" value="" />' +
			//	'</div>' +
		'<div class="form-group-custom">' +
		'<button type="button" id="update" class="atfm-btn atfm-btn-blue collaborate-content-level pos-right">指定</button>' +
		'<button type="button" id="clear" class="atfm-btn atfm-btn-red collaborate-content-level">撤销</button>' +
		'<button type="button" id="reset" class="atfm-btn atfm-btn-default collaborate-content-level">重置</button>' +
			//'<button type="button" id="more" class="btn btn-primary collaborate-content-level">更多</button>' +
		'</div>' +
			//'</div>' +
		'</div>' +

		'<div id="center" class="col-md-1 ffixt_center">' +
		'<input id="more" class="ffixt_more right_icon" type="button"/>'+
		'</div>' +
		'<div id="right" class="col-md-6 ffixt_right">'+
		'</div>' +
		'</form>' +
		'</div></div>',
		/**
		 *
		 */
		MULTI_FLIGHT_SLOCK:
		'<div class="flight-multi-operation-container">' +
		'<form action="">' +
		'<div class="container-fluid flight-multi-operation-top" id="flight-multi-flights">' +
		'<table class="table flight-multi-flights-table" id="flight-multi-flights-table">' +
		'<thead>' +
		'<tr>' +
		'<th>航班号</th>' +
		'<th>起飞机场</th>' +
		'<th>降落机场</th>' +
		'<th>EOBT</th>' +
		'<th class="flight-multi-info-time-cobt">COBT</th>' +
		'<th class="flight-multi-info-time-ctot">CTOT</th>' +
		'<th class="flight-multi-info-time-cto">CTO</th>' +
		'</tr>' +
		'</thead>' +
		'</table>' +
		'</div>' +
		'<div class="flight-multi-operation-bottom">' +
		'<div class="row flight-multi-value">' +
		'<span class="col-md-4 checkbox flight-multi-value-checkbox">' +
		'<label class="checkbox-inline"><input type="checkbox" value="COBT" />COBT</label>' +
		'<label class="checkbox-inline"><input type="checkbox" value="CTOT" />CTOT</label>' +
		'<label class="checkbox-inline"><input type="checkbox" value="CTO" checked="checked" />CTO</label>' +
		'</span>' +
		'<span class="col-md-6 flight-multi-value-set"> <label>批量移动:</label>' +
		'<label><input class="form-control input-sm" type="text"' +
		'id="flight-multi-value-set" /></label> <label>分钟</label>' +
		'<input class="atfm-btn atfm-btn-blue btn-xs" type="button" id="flight-multi-calculate" value="计算" />' +
		'</span>' +
		'</div>' +
		'</div>' +
		'</form>' +
		'</div>' ,
		/**
		 * 推出时间修改
		 */
		UPDATE_AOBT :
		'<div class="panel panel-info flight-grid-table-collaborate-container"><div class="panel-heading">' +
		'<h3 class="panel-title">推出时间修改</h3><a class="glyphicon glyphicon-remove modal-close-btn"></a></div><div class="panel-body">' +
		'<form action="" method="post">' +
		FLIGHT_DOM +
		AIRPORT_DOM +
		DATE_DOM +
		TIME_DOM +
		COMMENT_DOM +
		'<input type="hidden" name="id" value="" />' +
		'<div class="form-group form-group-custom">' +
		'<button type="submit" id="update" class="atfm-btn atfm-btn-blue collaborate-content-level pos-right">确定</button>' +
		'<button type="button" id="clear" class="atfm-btn atfm-btn-red collaborate-content-level">清除</button>' +
		'</div>' +
		'</form>' +
		'</div></div>'

	}
}();
