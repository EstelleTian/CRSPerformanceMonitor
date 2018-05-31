/**
 * 航班计划表格单元格配置
 */
var FlightGridTableCellConfig = {

	/**
	 * 时间格式化工具
	 * 
	 * @param cellvalue
	 *            当前单元格数值
	 * @param options
	 *            JQGrid传入的配置项
	 * @param rowObject
	 *            当前行数据
	 * @returns
	 */
	timeFormater : function(cellvalue, options, rowObject) {
		if ($.isValidVariable(cellvalue)) {
			return cellvalue.substring(8, 12);
		} else {
			return '';
		}
	},
	
	/**
	 * 时间格式化工具
	 * 
	 * @param cellvalue
	 *            当前单元格数值
	 * @param options
	 *            JQGrid传入的配置项
	 * @param rowObject
	 *            当前行数据
	 * @returns
	 */
	timeFormaterByPasstime : function(cellvalue, options, rowObject) {
		var name = options.colModel.name+'_interval';
		if ($.isValidVariable(cellvalue)) {
			if( cellvalue.indexOf("t") > -1){
				var val = cellvalue.substring(2, cellvalue.length);
				var num = val*1 - 49999;
				return "第"+ num +"位";
			}else{
				if(rowObject[name] == true) {
					return '<span class="highlight-grid-table-data">' + cellvalue.substring(8, 12) + '</span>';
				}else if(cellvalue.indexOf("HIDE") > -1){
					//飞越航班不显示数据
					return "";
				} else {
					return cellvalue.substring(8, 12);
				}
			}
			
		} else {
			return "";
		}
	},
	
	timeFormaterByFlowcontrolPoint : function(cellvalue, options, rowObject) {
		if (rowObject.id) {
			var rowId = options.rowId;
			return '<span class="trajectory-for-popover" rowid="' + rowId + '">' + cellvalue;
		} else {
			return cellvalue;
		}
	},
	
	/**
	 * 	流控点格式化
	 */
	htmlFormaterByACCFIX : function( cellvalue, options, rowObject){
		if (rowObject.id) {
			var rowId = options.rowId;
			return '<span class="ACCFIX-for-popover" rowid="' + rowId + '">' + cellvalue;
		} else {
			return cellvalue;
		}
	},
	
	/**
	 * 取正数格式化工具
	 * 
	 * @param cellvalue
	 *            当前单元格数值
	 * @param options
	 *            JQGrid传入的配置项
	 * @param rowObject
	 *            当前行数据
	 * @returns
	 */
	positiveFormater : function(cellvalue, options, rowObject) {
		if ($.isValidVariable(cellvalue)) {
			if (parseInt(cellvalue) < 0) {
				return '';
			} else {
				return cellvalue;
			}
		} else {
			return '';
		}
	},
	
	/**
	 * 查询条件转大写
	 * 
	 * @param e
	 * @returns
	 */
	searchToUpperCase : function(e) {
		//$(this).val($(this).val().toUpperCase());
		$(this).change();
	},
	
	/**
	 * 单元格默认样式配置
	 * 
	 * @param rowId JQGrid当前行ID
	 * @param value 当前单元格显示值
	 * @param rowObject 当前行数据
	 * @param colModel JQGrid当前列colModel对象
	 * @param arrData 将要插入的数据项
	 * @returns {String} 需要赋给单元格的属性 PS：注意不同属性间需要有空格分隔
	 */
	cellattrCustom: function(rowId, value, rowObject, colModel, arrData) {
		// 需要赋予表格的属性
		var attrs = '';

		// 无效数值不做处理
		if (!$.isValidVariable(value)) {
			return attrs;
		}

		// 添加自定义属性
		var cusAttr = "";
		if($.isValidVariable(rowObject[colModel.name + '_cusAttr'])){
			cusAttr =  rowObject[colModel.name + '_cusAttr'];
		}

		attrs = attrs + ' ' + cusAttr + ' ';

		// 显示title
		var title = null;
		if($.isValidVariable(rowObject[colModel.name + '_title'])){
			title =  rowObject[colModel.name + '_title'];
		}else{
			title = rowObject[colModel.name];
		}
		
		if(!$.isValidVariable(title)){
			title = '';
		}
		attrs = attrs + ' title="' + title + '"';
		
		// 显示style
		var style = rowObject[colModel.name + '_style'];
		if ($.isValidVariable(style)) {
			attrs = attrs + ' style="' + style + '"';
		} else {
			attrs = attrs + ' style="' + rowObject['default_style'] + '"';
		}
		
		return attrs;
	}
	
};

/**
 * 航班计划表格列
 */
var FlightGridTableConfig = {
		
	/**
	 * 表格列模式模板（通用效果）
	 */
	colModelTemplate : {
		width : 80,
		align : 'center',
		sortable : true,
		search : true,
		searchoptions : {
			sopt : ['cn','nc','eq','ne','lt','le','gt','ge','bw','bn','in','ni','ew','en'],
			dataEvents:[
				{	type: 'keyup',
					fn: FlightGridTableCellConfig.searchToUpperCase
				}
			]
		},
		cellattr : FlightGridTableCellConfig.cellattrCustom,
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
	
	/**
	 * 表格列模式
	 * 
	 * minWidth：最小列宽,为自定义属性,显示列必填
	 */
	colModel : {
		FLIGHTID : {
			name : 'FLIGHTID',
			minWidth : 70,
			align : 'center',
			frozen: true,
			// formatter : function (cellvalue, options, rowObject) {
			// 	if ($.isValidVariable(cellvalue)) {
			// 		return '<span class="link_cell">'+ cellvalue + '</span>';
			// 	} else {
			// 		return cellvalue
			// 	}
			// }
		},
		PRIORITY : {
			name : 'PRIORITY',
			minWidth : 70,
		},
		REGNUM : {
			name : 'REGNUM'
		},
		ACTYPE : {
			name : 'ACTYPE'
		},
		DEPAP : {
			name : 'DEPAP',
		},
		ARRAP : {
			name : 'ARRAP',
		},
		SOBT : {
			name : 'SOBT',
			formatter : FlightGridTableCellConfig.timeFormater
		},
		EOBT : {
			name : 'EOBT',
			width:100,
			formatter : FlightGridTableCellConfig.timeFormater
		},
		TOBT : {
			name : 'TOBT',
			formatter : FlightGridTableCellConfig.timeFormater
		},
		AGCT : {
			name : 'AGCT',
			formatter : FlightGridTableCellConfig.timeFormater
		},
		COBT : {
			name : 'COBT',
			width:100,
			formatter : FlightGridTableCellConfig.timeFormater
		},
		CTOT : {
			name : 'CTOT',
			width:100,
			formatter : FlightGridTableCellConfig.timeFormater
		},
		ATOT : {
			name : 'ATOT',
			width:100,
			formatter : FlightGridTableCellConfig.timeFormater
		},
		ALDT : {
			name : 'ALDT',
			width:100,
			formatter : FlightGridTableCellConfig.timeFormater
		},
		STATUS : {
			name : 'STATUS',
			width : 70
		},
		GSSEQ : {
			name : 'GSSEQ'
		},
		GSOBT : {
			name : 'GSOBT',
			formatter : FlightGridTableCellConfig.timeFormater
		},
		FLOWCONTROL_POINT : {
			name : 'FLOWCONTROL_POINT',
			formatter : FlightGridTableCellConfig.timeFormaterByFlowcontrolPoint
		},
		FLOWCONTROL_POINT_PASSTIME : {
			name : 'FLOWCONTROL_POINT_PASSTIME',
			width:100,
			formatter : FlightGridTableCellConfig.timeFormaterByPasstime,
			sorttype : function(cell, rowData) {
				if ($.isValidVariable(cell)) {//有值
					if( cell.indexOf("t") > -1 && $.isValidVariable(rowData.FLOWCONTROL_POINT_PASSTIME_E) ){
						return 'B'+rowData.FLOWCONTROL_POINT_PASSTIME_E;
					}else{
						return 'A'+cell;
					}
				} else if ($.isValidVariable(rowData.FLOWCONTROL_POINT_PASSTIME_E)) {//没值但有E
					return 'B'+rowData.FLOWCONTROL_POINT_PASSTIME_E;
				}else {//什么也没有
					return 'C';
				}
			},
			sortfunc : function(a, b, direction) {
				// 字符串类型
				if (direction < 0) {
					if(a.indexOf('A') == 0) {
						a = 'C' + a.substring(1);
					} else if(a.indexOf('C') == 0) {
						a = 'A' + a.substring(1);
					}
				}
				if (direction < 0) {
					if(b.indexOf('A') == 0) {
						b = 'C' + b.substring(1);
					} else if(b.indexOf('C') == 0) {
						b = 'A' + b.substring(1);
					}
				}
				return a.localeCompare(b) * direction;
			}
		},
		ACCFIX : {
			name : 'ACCFIX',
			formatter : FlightGridTableCellConfig.htmlFormaterByACCFIX
		},
		APPFIX : {
			name : 'APPFIX'
		},
		ACWAKES : {
			name : 'ACWAKES'
		},
		ACODE : {
			name : 'ACODE'
		},
		HOBT : {
			name : 'HOBT',
			formatter : FlightGridTableCellConfig.timeFormater
		},
		ASBT : {
			name : 'ASBT',
			formatter : FlightGridTableCellConfig.timeFormater
		},
		AOBT : {
			name : 'AOBT',
			formatter : FlightGridTableCellConfig.timeFormater
		},
		POSITION : {
			name : 'POSITION'
		},
		RUNWAY : {
			name : 'RUNWAY'
		},
		TAXI : {
			name : 'TAXI'
		},
		CTO2 : {
			name : 'CTO2',
			formatter : FlightGridTableCellConfig.timeFormater
		},
		CTO : {
			name : 'CTO',
			formatter : FlightGridTableCellConfig.timeFormater
		},
		FORMER_FLIGHTID : {
			name : 'FORMER_FLIGHTID',
			width : 70,
			fixed : true
		},
		FORMER_DEP : {
			name : 'FORMER_DEP',
			formatter : FlightGridTableCellConfig.timeFormater
		},
		FORMER_ARR : {
			name : 'FORMER_ARR',
			formatter : FlightGridTableCellConfig.timeFormater
		},
		POOL_STATUS : {
			name : 'POOL_STATUS',
			width : 70
		},
		SLOT_STATUS : {
			name : 'SLOT_STATUS',
			width : 70
		},
		CLOSE_WAIT : {
			name : 'CLOSE_WAIT',
			sorttype : 'number',
			formatter : FlightGridTableCellConfig.positiveFormater
		},
		TAXI_WAIT : {
			name : 'CLOSE_WAIT',
			sorttype : 'number',
			formatter : FlightGridTableCellConfig.positiveFormater
		},
		DELAY : {
			name : 'DELAY',
			sorttype : 'number',
			formatter : FlightGridTableCellConfig.positiveFormater
		},
		DELAY_REASON : {
			name : 'DELAY_REASON'
		},
		FLOWCONTROL_STATUS : {
			name : 'FLOWCONTROL_STATUS'
		},
		FLOWCONTROL_POINT_PASSTIME_ETO : {
			name : 'FLOWCONTROL_POINT_PASSTIME_ETO',
			formatter : FlightGridTableCellConfig.timeFormaterByPasstime,
		},
		FLOWCONTROL_POINT_PASSTIME_CTO : {
			name : 'FLOWCONTROL_POINT_PASSTIME_CTO',
			formatter : FlightGridTableCellConfig.timeFormaterByPasstime,
		},
		ENTRY_POINT : {
			name : 'ENTRY_POINT',
		},
		ENTRY_POINT_TIME : {
			name : 'ENTRY_POINT_TIME',
			formatter : FlightGridTableCellConfig.timeFormater,
		},
		EXIT_POINT : {
			name : 'EXIT_POINT',
		},
		EXIT_POINT_TIME : {
			name : 'EXIT_POINT_TIME',
			formatter : FlightGridTableCellConfig.timeFormater,
		},
		FLIGHT_APP_POINT : {
			name : 'FLIGHT_APP_POINT',
			fixed : true,
		},
		FLIGHT_APP_POINT_PASSTIME : {
			name : 'FLIGHT_APP_POINT_PASSTIME',
			formatter : FlightGridTableCellConfig.timeFormaterByPasstime,
			fixed : true
		},
		FLIGHT_ACC_POINT : {
			name : 'FLIGHT_ACC_POINT',
			fixed : true,
		},
		FLIGHT_ACC_POINT_PASSTIME : {
			name : 'FLIGHT_ACC_POINT_PASSTIME',
			formatter : FlightGridTableCellConfig.timeFormaterByPasstime,
			fixed : true
		},
		DEICE_STATUS : {
			name : 'DEICE_STATUS',
			width : 70
		},
		DEICE_POSITION : {
			name : 'DEICE_POSITION'
		},
		DEICE_GROUP:{
			name : 'DEICE_GROUP'
		},
		EFPS_SID : {
			name : 'EFPS_SID'
		},
		EFPS_ICEID : {
			name : 'EFPS_ICEID'
		},
		EFPS_REQTIME : {
			name : 'EFPS_REQTIME',
			formatter : FlightGridTableCellConfig.timeFormater
		},
		EFPS_PUSTIME : {
			name : 'EFPS_PUSTIME',
			formatter : FlightGridTableCellConfig.timeFormater
		},
		EFPS_LINTIME : {
			name : 'EFPS_LINTIME',
			formatter : FlightGridTableCellConfig.timeFormater
		},
		EFPS_IN_DHLTIME : {
			name : 'EFPS_IN_DHLTIME',
			formatter : FlightGridTableCellConfig.timeFormater
		},
		EFPS_OUT_DHLTIME : {
			name : 'EFPS_OUT_DHLTIME',
			formatter : FlightGridTableCellConfig.timeFormater
		},
		EFPS_IN_ICETIME : {
			name : 'EFPS_IN_ICETIME',
			formatter : FlightGridTableCellConfig.timeFormater
		},
		EFPS_OUT_ICETIME : {
			name : 'EFPS_OUT_ICETIME',
			formatter : FlightGridTableCellConfig.timeFormater
		},
		EFPS_STATUS : {
			name : 'EFPS_STATUS',
			width : 70
		},
		EFPS_TAXTIME : {
			name : 'EFPS_TAXTIME',
			formatter : FlightGridTableCellConfig.timeFormater
		},
		NORMAL : {
			name : 'NORMAL',
			width : 70
		},
		COMMENT : {
			name : 'COMMENT',
			width : 70
		},
		READY : {
			name : 'READY',
			formatter : FlightGridTableCellConfig.timeFormater
		},
		TOBT_UPDATE_TIME : {
			name : 'TOBT_UPDATE_TIME',
			formatter : FlightGridTableCellConfig.timeFormater
		},


		FLIGHTID : {
			name : 'FLIGHTID',
			align : 'center',
			width: 100,
			frozen: true
		},
        PRIORITY : {
			name : 'PRIORITY',
			width: 70,
			align : 'center'
		},
		DEPAP : {
			name : 'DEPAP',
			width: 70,
			fixed : true
		},
		ARRAP : {
			name : 'ARRAP',
			width: 70,
			fixed : true
		},
		EOBT : {
			name : 'EOBT',
			width: 100,
			formatter : FlightGridTableCellConfig.timeFormater
		},
		COBT : {
			name : 'COBT',
			width: 100,
			formatter : FlightGridTableCellConfig.timeFormater
		},
		CTOT : {
			name : 'CTOT',
			width: 100,
			formatter : FlightGridTableCellConfig.timeFormater
		},
		ATOT : {
			name : 'ATOT',
			width: 100,
			formatter : FlightGridTableCellConfig.timeFormater
		},
        FLOWCONTROL_POINT : {
			name : 'FLOWCONTROL_POINT',
			fixed : true,
			width: 100,
			formatter : FlightGridTableCellConfig.timeFormaterByFlowcontrolPoint
		},
        FLOWCONTROL_POINT_PASSTIME : {
			name : 'FLOWCONTROL_POINT_PASSTIME',
			width: 100,
			formatter : FlightGridTableCellConfig.timeFormaterByPasstime,
			fixed : true,
			sorttype : function(cell, rowData) {
				if ($.isValidVariable(cell)) {//有值
					if( cell.indexOf("t") > -1 && $.isValidVariable(rowData.FLOWCONTROL_POINT_PASSTIME_E) ){
						return 'B'+rowData.FLOWCONTROL_POINT_PASSTIME_E;
					}else{
						return 'A'+cell;
					}
				} else if ($.isValidVariable(rowData.FLOWCONTROL_POINT_PASSTIME_E)) {//没值但有E
					return 'B'+rowData.FLOWCONTROL_POINT_PASSTIME_E;
				}else {//什么也没有
					return 'C';
				}
			},
			sortfunc : function(a, b, direction) {
				// 字符串类型
				if (direction < 0) {
					if(a.indexOf('A') == 0) {
						a = 'C' + a.substring(1);
					} else if(a.indexOf('C') == 0) {
						a = 'A' + a.substring(1);
					}
				}
				if (direction < 0) {
					if(b.indexOf('A') == 0) {
						b = 'C' + b.substring(1);
					} else if(b.indexOf('C') == 0) {
						b = 'A' + b.substring(1);
					}
				}
				return a.localeCompare(b) * direction;
			}
		},
		TOBT : {
			name : 'TOBT',
			width: 100,
			formatter : FlightGridTableCellConfig.timeFormater
		},
		AOBT : {
			name : 'AOBT',
			width: 100,
			formatter : FlightGridTableCellConfig.timeFormater
		},
		FORMER_ARR : {
			name : 'FORMER_ARR',
			width: 100,
			formatter : FlightGridTableCellConfig.timeFormater
		},
		STATUS : {
			width: 70,
			name : 'STATUS',
		},
		REGNUM : {
			name : 'REGNUM'
		},
		ACTYPE : {
			name : 'ACTYPE'
		},
	},
	colNames : {
		FLIGHTID : {
			en : 'FLIGHTID',
			cn:"航班号",
			width : 70,
			align : 'center',
			frozen: true
		},
		PRIORITY : {
			en : 'PRIORITY',
			cn:"优先级"
		},
		REGNUM : {
			en : 'REGNUM',
			cn:"注册号"
		},
		ACTYPE : {
			en : 'ACTYPE',
			cn:"航班机型"
		},
		DEPAP:{
			en:"DEPAP",
			cn:"起飞机场"
		},
		ARRAP:{
			en:"ARRAP",
			cn:"降落机场"
		},
		SOBT : {
			en : 'SOBT',
			cn : "计划撤轮档"
		},
		EOBT:{
			en:"EOBT",
			cn:"预计撤轮档时间",
		},
		TOBT : {
			en : 'TOBT',
			cn : "目标撤轮档"
		},
		AGCT : {
			en : 'AGCT',
			cn : '实际关门'
		},
		COBT:{
			en:"COBT",
			cn:"计算撤轮档时间",
		},
		CTOT:{
			en:"CTOT",
			cn:"计算起飞时间",
		},
		ATOT:{
			en:"ATOT",
			cn:"实际起飞时间",
		},
		ALDT : {
			en : 'ALDT',
			cn : '实际降落时间'
		},
		STATUS : {
			en : 'STATUS',
			cn : '状态'
		},
		GSSEQ : {
			en : 'GSSEQ',
			cn : 'GSSEQ'
		},
		GSOBT : {
			en : 'GSOBT',
			cn : 'GSOBT',
		},
		FLOWCONTROL_POINT:{
			en:"FFix",
			cn:"受控航路点",
		},
		FLOWCONTROL_POINT_PASSTIME:{
			en:"FFixT",
			cn:"受控过点时间",
		},
		ACCFIX : {
			en : 'ACCFIX',
			cn : "出港ACCFIX"
		},
		APPFIX : {
			en : 'APPFIX',
			cn : '出港APPFIX'
		},

	},
	colDisplay : {
		FLIGHTID : {
			display:1,
		},
		PRIORITY : {
			display:1,
		},
		REGNUM : {
			display:0,
		},
		ACTYPE : {
			display:1,
		},
		DEPAP:{
			display:1,
		},
		ARRAP:{
			display:1,
		},
		SOBT : {
			display:1,
		},
		EOBT:{
			display:1,
		},
		TOBT : {
			display:1,
		},
		AGCT : {
			display:1,
		},
		COBT:{
			display:1,
		},
		CTOT:{
			display:1,
		},
		ATOT:{
			display:1,
		},
		ALDT : {
			display:1,
		},
		STATUS : {
			display:1,
		},
		GSSEQ : {
			display:1,
		},
		GSOBT : {
			display:1,
		},
		FLOWCONTROL_POINT:{
			display:1,
		},
		FLOWCONTROL_POINT_PASSTIME:{
			display:1,
		},
		ACCFIX : {
			display:1,
		},
		APPFIX : {
			display:1,
		},
	},
	colTitle : {
		FLIGHTID : 'FLIGHTID',
		PRIORITY : 'PRIORITY',
		REGNUM : 'REGNUM',
		ACTYPE : 'ACTYPE',
		DEPAP:"DEPAP",
		ARRAP:"ARRAP",
		SOBT : 'SOBT',
		EOBT:"EOBT",
		TOBT :'TOBT',
		AGCT : 'AGCT',
		COBT:"COBT",
		CTOT:"CTOT",
		ATOT:"ATOT",
		ALDT : 'ALDT',
		STATUS : 'STATUS',
		GSSEQ : 'GSSEQ',
		GSOBT : 'GSOBT',
		FLOWCONTROL_POINT:"FFix",
		FLOWCONTROL_POINT_PASSTIME:"FFixT",
		ACCFIX : 'ACCFIX',
		APPFIX : 'APPFIX',
	},
};