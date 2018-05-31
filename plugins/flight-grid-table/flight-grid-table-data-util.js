/**
 * 转换航班计划表格数据
 */
var FlightGridTableDataUtil = {

	/**
	 *  TODO
	 */
	codeType : "",

	/**
	 *
	 */
	showLongFlowcontrol : true,

	/**
	 * 样式
	 */
	displayStyle : {},

	/**
	 *
	 */
	displayStyleComment : "",

	/**
	 * 系统参数配置信息
	 */
	systemConfigs : "",

	/**
	 * 失效数据样式
	 */
	invalidDataStyle : 'text-decoration:line-through;font-style:italic;',

	/**
	 * 样式字符串
	 *
	 * @param dataKey
	 * @returns
	 */
	getDisplayStyle : function(dataKey) {
		var tempStr = "";
		if (!$.isValidVariable(this.displayStyle)
			|| !$.isValidVariable(this.displayStyle[dataKey])) {
			return "";
		}
		if ($.isValidVariable(this.displayStyle[dataKey])) {
			tempStr = this.displayStyle[dataKey];
			if(tempStr.indexOf('transparent') != -1) {
				tempStr = tempStr.replace('transparent', "");
			}
		}
		return tempStr;
	},
	/**
	 *
	 *
	 * @param dataKey
	 */
	getDisplayStyleZh : function(dataKey) {
		if (!$.isValidVariable(this.displayStyleComment)
			|| !$.isValidVariable(this.displayStyleComment[dataKey])) {
			return "";
		} else {
			return this.displayStyleComment[dataKey];
		}
	},

	/**
	 * 转换为保留时隙航班（虚构）
	 *
	 * @param slot
	 * @param point
	 * @param isShowAttr
	 * @param rowid
	 * @param realFlowId
	 *
	 */
	convertReserveSlots: function ( sceneCaseId, slot, point, rowid, realFlowId, flowObj ) {
		// 创建结果对象
		if(!$.isValidVariable(flowObj)){
			flowObj={};
			flowObj[realFlowId]={
				"flightId": "",
				"reserveSlot": "",
				"comment": ""
			}
		};
		//创建预留时隙添加普通时隙识别 标记为1 预发布的预留时隙 标记为2
		var data = {};
		data.id = rowid;
		data.FLIGHTID=flowObj[realFlowId].flightId;
		var comment = flowObj[realFlowId].comment || "";
		data.FLIGHTID_title="备注:"+comment;
		if(sceneCaseId){
			data.FLIGHTID_cusAttr="data-slot='1'";
		}else{
			data.FLIGHTID_cusAttr="data-slot='2'";
		}
		data.MULTI_OPERATE = "";
		data.FLOWCONTROL_POINT = point;
		data.FLOWCONTROL_POINT_title = point;
		data.FLOWCONTROL_POINT_PASSTIME = slot;
		data.FLOWCONTROL_POINT_PASSTIME_E = slot;
		data.FLOWCONTROL_POINT_PASSTIME_interval = "";
		data.FLOWCONTROL_POINT_PASSTIME_style = "";
		data.FLOWCONTROL_POINT_PASSTIME_title = ('预留: ' + this.formatTime(slot));
		return data;
	},


	/**
	 *
	 * @param flight
	 * @returns {___anonymous11039_11962}
	 */
	convertData : function(flight, dataTime, authoritys, points, flowId) {
		// 判断数据有效性
		if (!$.isValidVariable(flight) || !$.isValidVariable(flight.fmeToday)) {
			return "";
		}
		// 创建结果对象
		var data = new Object();
		var points = points;
		// 设置默认显示样式
		var defaultStyle = this.getDisplayStyle('DEFAULT');
		data.default_style = defaultStyle;
		var flowcontrols = flight.flowcontrols;
		//若有航路点则不处理，没有则获取航路点集合
		if(!$.isValidVariable(points)){
			// 获取一条航班对应的受控航路点集合(用于受控过点时间取值)
			if ($.isValidVariable(flowcontrols)) {
				for (var flowId in flowcontrols) {
					var flowcontrol = flowcontrols[flowId];
					if ($.isValidVariable(flowcontrol) && $.isValidVariable(flowcontrol[9])) {
						points = flowcontrol[9];
					}
				}
			}
		}

		// 处理数据
		this.setId(flight, dataTime, data);
		this.setsceneCaseId(flight, dataTime, data);
		this.setFlightid(flight, dataTime, data);
		this.setAircraftType(flight, dataTime, data);
		this.setAircraftWakes(flight, dataTime, data);
		this.setACode(flight, dataTime, data);
		this.setRegistenum(flight, dataTime, data);
		this.setDepapAndArrap(flight, dataTime, data);
		this.setAppfixAndAccFix(flight, dataTime, data);

		this.setPriority(flight, dataTime, data);
		this.setSOBT(flight, dataTime, data);
		this.setEOBT(flight, dataTime, data);
		this.setTOBT(flight, dataTime, data);
		this.setHOBT(flight, dataTime, data);
		this.setCOBT(flight, dataTime, data);
		this.setCTOT(flight, dataTime, data);
		this.setASBT(flight, dataTime, data);
		this.setAGCT(flight, dataTime, data);
		this.setAOBT(flight, dataTime, data);
		this.setATOT(flight, dataTime, data);
		this.setFormerFlight(flight, dataTime, data);
		// this.setArrTime(flight, dataTime, data);
		this.setALDT(flight, dataTime, data);

		this.setSPOT(flight, dataTime, data);
		this.setDeiceStatus(flight, dataTime, data);
		this.setDeicePosition(flight, dataTime, data);
		this.setDeiceGroup(flight, dataTime, data);
		this.setRunway(flight, dataTime, data);
		this.setTaxi(flight, dataTime, data);

		this.setStatus(flight, dataTime, data);
		this.setPoolStatus(flight, dataTime, data);
		this.setSlotStatus(flight, dataTime, data);
		this.setFlowcontrolStatus(flight, dataTime, data);
		this.setFlowcontrolPoint(flight, dataTime, data, points, flowId);
		this.setFlightAppPoint(flight, dataTime, data);
		this.setFlightAccPoint(flight, dataTime, data);
		this.setInvalidData(flight, dataTime, data);
		this.setEntryOrExitEPoint(flight, dataTime, data, "entry");
		this.setEntryOrExitEPoint(flight, dataTime, data, "exit");

		this.setNormal(flight, dataTime, data);
		this.setCloseWait(flight, dataTime, data);
		this.setTaxiWait(flight, dataTime, data);
		this.setDelay(flight, dataTime, data);
		this.setDelayReason(flight, dataTime, data);
		this.setGSOBTAndSEQ(flight, dataTime, data);

		// EFPS
		this.setEfpsFlight(flight, dataTime, data);

		this.setARDT(flight, dataTime, data);

		this.markFlightidStyle(flight, dataTime, data);
		this.markDEPFlightStyle(flight, dataTime, data);
		this.markCNLFlightStyle(flight, dataTime, data);
		this.markStatusStyle(flight, dataTime, data);

		this.clearInvalidData(flight, dataTime, data);

		/*
		 // 临时性逻辑，记录有HOBT无COBT、CTOT记录
		 if ($.isValidVariable(data.HOBT)
		 && (!$.isValidVariable(data.COBT)
		 || !$.isValidVariable(data.CTOT))) {
		 console.warn('flight have hobt, no cobt or ctot, flight.id='
		 + flight.id + ', flightid=' + flight.fmeToday.flightid);
		 console.warn(flight);
		 }
		 */

		// 返回结果
		return data;
	},

	/**
	 * Id
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setId : function(flight, dataTime, data) {
		// 行id(默认情况下,jqGrid行数据包含key为id)
		data.id = flight.id;
		data.ID = flight.id;

	},

	/**
	 * SCENECASEID
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setsceneCaseId : function(flight, dataTime, data) {
		// 行id(默认情况下,jqGrid行数据包含key为id)
		data.SCENECASEID = "";
		if($.isValidVariable(flight.sceneCaseId)) {
			data.SCENECASEID = flight.sceneCaseId;
		}
	},

	/**
	 * Flightid
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setFlightid : function(flight, dataTime, data) {
		data.FLIGHTID = "";
		data.FLIGHTID_title = "";
		if ($.isValidVariable(flight.fmeToday.flightid)) {
			data.FLIGHTID = flight.fmeToday.flightid;
			data.FLIGHTID_title = 'ID:' + flight.id;
		}
		if (this.codeType == 'IATA' && $.isValidVariable(data.FLIGHTID)) {
			var code = data.FLIGHTID.substring(0, 3);
			data.FLIGHTID = data.FLIGHTID.replace(code, BasicAirlines
				.getICAO2IATACode(code));
		}
	},

	/**
	 * Registenum
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setRegistenum : function(flight, dataTime, data) {
		data.REGNUM = "";
		if ($.isValidVariable(flight.fmeToday.PRegistenum)) {
			data.REGNUM = flight.fmeToday.PRegistenum;
		}
	},

	/**
	 * ACode
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setACode : function(flight, dataTime, data) {
		data.ACODE = "";
		if ($.isValidVariable(flight.fmeToday.RAcode)) {
			data.ACODE = flight.fmeToday.RAcode;
		}
	},

	/**
	 * AircraftType
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setAircraftType : function(flight, dataTime, data) {
		data.ACTYPE = "";
		if ($.isValidVariable(flight.fmeToday.PAircrafttype)) {
			data.ACTYPE = flight.fmeToday.PAircrafttype;
		} else if ($.isValidVariable(flight.fmeToday.SAircrafttype)) {
			data.ACTYPE = flight.fmeToday.SAircrafttype;
		}
	},

	/**
	 * AircraftWakes
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setAircraftWakes : function(flight, dataTime, data) {
		data.ACWAKES = "";
		if ($.isValidVariable(flight.aircraftWakes)) {
			data.ACWAKES = flight.aircraftWakes;
		}
	},

	/**
	 * Depap & Arrap
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setDepapAndArrap : function(flight, dataTime, data) {
		data.DEPAP = "";
		data.ARRAP = "";
		if ($.isValidVariable(FmeToday.getRPSDepAP(flight.fmeToday))) {
			data.DEPAP = FmeToday.getRPSDepAP(flight.fmeToday);
		}
		if ($.isValidVariable(FmeToday.getRPSArrAP(flight.fmeToday))) {
			data.ARRAP = FmeToday.getRPSArrAP(flight.fmeToday);
		}
		if ($.isValidVariable(data.DEPAP) && this.codeType == 'IATA') {
			data.DEPAP = BasicAddress.getICAO2IATACode(data.DEPAP);
		}
		if ($.isValidVariable(data.ARRAP) && this.codeType == 'IATA') {
			data.ARRAP = BasicAddress.getICAO2IATACode(data.ARRAP);
		}
	},

	/**
	 * Appfix & Accfix
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setAppfixAndAccFix : function(flight, dataTime, data) {
		data.APPFIX = "";
		data.APPFIX_title = "";
		data.ACCFIX = "";
		data.ACCFIX_title = "";
		var slotMpi = "";
		if($.isValidVariable(flight.autoSlot)){
			slotMpi = FlightCoordination.parseAutoSlotMonitorPointInfo(flight.autoSlot);
		}
		//
		if ($.isValidVariable(flight.controlInnerWaypointName)) {
			data.APPFIX = flight.controlInnerWaypointName;
			if($.isValidVariable(flight.eto2)){
				data.APPFIX_title += '预计:' + flight.eto2.substring(6, 8) + '/' + flight.eto2.substring(8, 12) + '\n';
			}
			if(slotMpi != "" && $.isValidVariable(slotMpi[flight.controlInnerWaypointName])){
				data.APPFIX_title += '计算:' + slotMpi[flight.controlInnerWaypointName]['C'].substring(6, 8) + '/' + slotMpi[flight.controlInnerWaypointName]['C'].substring(8, 12) + '\n';
			}
			if($.isValidVariable(flight.cto2)){
				data.APPFIX_title += '锁定:' + flight.cto2.substring(6, 8) + '/' + flight.cto2.substring(8, 12) + '\n';
			}
			if($.isValidVariable(flight.ato2)){
				data.APPFIX_title += '实际:' + flight.ato2.substring(6, 8) + '/' + flight.ato2.substring(8, 12);
			}
		}
		if ($.isValidVariable(flight.controlWaypointName)) {
			data.ACCFIX = flight.controlWaypointName;
			if($.isValidVariable(flight.eto)){
				data.ACCFIX_title += '预计:' + flight.eto.substring(6, 8) + '/' + flight.eto.substring(8, 12) + '\n';
			}
			if(slotMpi != "" && $.isValidVariable(slotMpi[flight.controlWaypointName])){
				data.ACCFIX_title += '计算:' + slotMpi[flight.controlWaypointName]['C'].substring(6, 8) + '/' + slotMpi[flight.controlWaypointName]['C'].substring(8, 12) + '\n';
			}
			if($.isValidVariable(flight.cto)){
				data.ACCFIX_title += '锁定:' + flight.cto.substring(6, 8) + '/' + flight.cto.substring(8, 12) + '\n';
			}
			if($.isValidVariable(flight.ato)){
				data.ACCFIX_title += '实际:' + flight.ato.substring(6, 8) + '/' + flight.ato.substring(8, 12);
			}
		}

		// 显示顺序A、C、SLOT_C、E
		data.CTO2 = "";
		data.CTO2_title = "";
		if ($.isValidVariable(flight.controlInnerWaypointName)) {
			if($.isValidVariable(flight.ato2)){
				// 实际过点时间
				data.CTO2 = flight.ato2;
			} else if($.isValidVariable(flight.cto2)) {
				// 计算过点时间
				data.CTO2 = flight.cto2;
			} else if(slotMpi != "" && $.isValidVariable(slotMpi[flight.controlInnerWaypointName])) {
				// slot_c
				data.CTO2 = slotMpi[flight.controlInnerWaypointName]['C'];
			} else if($.isValidVariable(flight.eto2)){
				// 预计过点时间
				data.CTO2 = flight.eto2;
			}
			if($.isValidVariable(flight.eto2)){
				data.CTO2_title = '预计:' + flight.eto2.substring(6, 8) + '/' + flight.eto2.substring(8, 12) + '\n';
			}
			if(slotMpi != "" && $.isValidVariable(slotMpi[flight.controlInnerWaypointName])){
				data.CTO2_title += '计算:' + slotMpi[flight.controlInnerWaypointName]['C'].substring(6, 8) + '/' + slotMpi[flight.controlInnerWaypointName]['C'].substring(8, 12) + '\n';
			}
			if($.isValidVariable(flight.cto2)) {
				data.CTO2_title += '锁定:' + flight.cto2.substring(6, 8) + '/' + flight.cto2.substring(8, 12) + '\n';
			}
			if($.isValidVariable(flight.ato2)){
				data.CTO2_title += '实际:' + flight.ato2.substring(6, 8) + '/' + flight.ato2.substring(8, 12);
			}
		}

		// 显示顺序A、C、SLOT_C、E
		data.CTO = "";
		data.CTO_title = "";
		if ($.isValidVariable(flight.controlWaypointName)) {
			if($.isValidVariable(flight.ato)){
				// 实际过点时间
				data.CTO = flight.ato;
			} else if($.isValidVariable(flight.cto)){
				// 计算过点时间
				data.CTO = flight.cto;
			} else if(slotMpi != "" && $.isValidVariable(slotMpi[flight.controlWaypointName])) {
				// slot_c
				data.CTO = slotMpi[flight.controlWaypointName]['C'];
			} else if($.isValidVariable(flight.eto)){
				// 预计过点时间
				data.CTO = flight.eto;
			}
			if($.isValidVariable(flight.eto)){
				data.CTO_title = '预计:' + flight.eto.substring(6, 8) + '/' + flight.eto.substring(8, 12) + '\n';
			}
			if(slotMpi != "" && $.isValidVariable(slotMpi[flight.controlWaypointName])){
				data.CTO_title += '计算:' + slotMpi[flight.controlWaypointName]['C'].substring(6, 8) + '/' + slotMpi[flight.controlWaypointName]['C'].substring(8, 12) + '\n';
			}
			if($.isValidVariable(flight.cto)){
				data.CTO_title += '锁定:' + flight.cto.substring(6, 8) + '/' + flight.cto.substring(8, 12) + '\n';
			}
			if($.isValidVariable(flight.ato)){
				data.CTO_title += '实际:' + flight.ato.substring(6, 8) + '/' + flight.ato.substring(8, 12);
			}
		}
	},

	/**
	 * Priority
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setPriority : function(flight, dataTime, data) {
		data.PRIORITY = "";
		data.PRIORITY_title = "";
		data.PRIORITY_style = "";
		data.priority = "";
		var style = this.getDisplayStyle('DEFAULT');

		// 判断来源
		if (($.isValidVariable(flight.cpriority)
			&& flight.cpriority > FlightCoordination.PRIORITY_NORMAL
			&& flight.cpriority > flight.priority)) {
			// 系统
			data.priority = flight.cpriority;
		} else if ($.isValidVariable(flight.priority)) {
			// 航班
			data.priority = flight.priority;
		} else {
			// 默认普通
			data.priority = FlightCoordination.PRIORITY_NORMAL;
		}
		data.PRIORITY = FlightCoordination.getPriorityZh(
			data.priority, data.ARRAP);

		// 判断协调情况
		if ($.isValidVariable(flight.coordinationRecords)) {
			var record = flight.coordinationRecords[FlightCoordinationRecord.TYPE_PRIORITY];
			if ($.isValidVariable(record) && $.isValidVariable(record.status)) {
				var status = record.status;
				if (status == FlightCoordinationRecord.STATUS_APPLY) {
					// 申请
					data.PRIORITY_style = this.getDisplayStyle('PRIORITY_APPLY');
					data.PRIORITY_title = this.getDisplayStyleZh('PRIORITY_APPLY');
				}
				if (status == FlightCoordinationRecord.STATUS_APPROVE
					|| FlightCoordination.PRIORITY_ICE == flight.priority) {
					// 批复
					data.PRIORITY_style = this.getDisplayStyle('PRIORITY_APPROVE');
					data.PRIORITY_title = this.getDisplayStyleZh('PRIORITY_APPROVE');
				}
				if (status == FlightCoordinationRecord.STATUS_REFUSE) {
					// 拒绝
					data.PRIORITY_style = this.getDisplayStyle('PRIORITY_REFUSE');
					data.PRIORITY_title = this.getDisplayStyleZh('PRIORITY_REFUSE');
				}

			}
		}
	},

	/**
	 * SOBT
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setSOBT : function(flight, dataTime, data) {
		data.SOBT = "";
		data.SOBT_style = "";
		data.SOBT_title = "";

		//
		if ($.isValidVariable(flight.fmeToday.SDeptime)) {
			data.SOBT = flight.fmeToday.SDeptime;
			data.SOBT_style = this.getDisplayStyle('SOBT');
			data.SOBT_title = data.SOBT.substring(6, 8) + '/'
				+ data.SOBT.substring(8, 12) + '\n'
				+ this.getDisplayStyleZh('SOBT');
		}
	},

	setEOBT : function(flight, dataTime, data) {
		data.EOBT = "";
		data.EOBT_style = "";
		data.EOBT_title = "";
		var style = this.getDisplayStyle('DEFAULT');
		//
		if ($.isValidVariable(flight.fmeToday.PDeptime)
			&& !FmeToday.hadTele(flight.fmeToday, 'MRR')
			&& FmeToday.hadFPL(flight.fmeToday)) {
			data.EOBT = flight.fmeToday.PDeptime;
			data.EOBT_style = this.getDisplayStyle('EOBT');
			data.EOBT_title = data.EOBT.substring(6, 8) + '/'
				+ data.EOBT.substring(8, 12) + '\n'
				+ this.getDisplayStyleZh('EOBT');
			// 判断来源
			if (FmeToday.hadTele(flight.fmeToday, 'DLA')) {
				data.EOBT_title = 'DLA ' + data.EOBT_title;
			} else if (FmeToday.hadTele(flight.fmeToday, 'CHG')) {
				data.EOBT_title = 'CHG ' + data.EOBT_title;
			} else if (FmeToday.hadTele(flight.fmeToday, 'FPL')) {
				data.EOBT_title = 'FPL ' + data.EOBT_title;
			}
		}
	},

	/**
	 * TOBT
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setTOBT : function(flight, dataTime, data) {
		data.TOBT = "";
		data.TOBT_style = "";
		data.TOBT_title = "";
		data.TOBT_UPDATE_TIME = "";
		data.TOBT_UPDATE_TIME_title = "";

		var array = FlightCoordination.getTOBT(flight);
		if($.isValidVariable(array)){
			// 判断来源
			data.TOBT = array[0];

			if(FlightCoordination.TOBT_PREDICT == array[1]){
				// 系统
				data.TOBT_style = this.getDisplayStyle('TOBT_SYSTEM');
				data.TOBT_title = data.TOBT.substring(6, 8) + '/'
					+ data.TOBT.substring(8, 12) + '\n'
					+ this.getDisplayStyleZh('TOBT_SYSTEM');
				data.STATUS_style = this.getDisplayStyle('TOBT_SYSTEM');
			} else if (FlightCoordination.TOBT_FPL == array[1]){
				// 报文
				data.TOBT_style = this.getDisplayStyle('TOBT_EOBT');
				data.TOBT_title = data.TOBT.substring(6, 8) + '/'
					+ data.TOBT.substring(8, 12) + '\n'
					+ this.getDisplayStyleZh('TOBT_EOBT');
			}

		}

		// 判断协调情况
		if ($.isValidVariable(data.TOBT)) {
			if ($.isValidVariable(flight.coordinationRecords)) {
				var tobtRecord = flight.coordinationRecords[FlightCoordinationRecord.TYPE_TOBT];
				if ($.isValidVariable(tobtRecord)
					&& $.isValidVariable(tobtRecord.status)) {
					var status = tobtRecord.status;
					var value = tobtRecord.value;
					var originalValue = tobtRecord.originalValue;
					if (status == FlightCoordinationRecord.STATUS_APPLY
						&& (originalValue == data.TOBT || undefined == originalValue) ) {
						// 申请
						data.TOBT_style = this.getDisplayStyle('TOBT_APPLY');
						data.TOBT_title = data.TOBT.substring(6, 8) + '/'
							+ data.TOBT.substring(8, 12) + '\n'
							+ this.getDisplayStyleZh('TOBT_APPLY');
					} else if (status == FlightCoordinationRecord.STATUS_APPROVE
						&& value == data.TOBT) {
						// 批复
						data.TOBT_style = this.getDisplayStyle('TOBT_APPROVE');
						data.TOBT_title = data.TOBT.substring(6, 8) + '/'
							+ data.TOBT.substring(8, 12) + '\n'
							+ this.getDisplayStyleZh('TOBT_APPROVE');
					} else if (status == FlightCoordinationRecord.STATUS_REFUSE
						&& originalValue == data.TOBT) {
						// 拒绝
						data.TOBT_style = this.getDisplayStyle('TOBT_REFUSE');
						data.TOBT_title = data.TOBT.substring(6, 8) + '/'
							+ data.TOBT.substring(8, 12) + '\n'
							+ this.getDisplayStyleZh('TOBT_REFUSE');
					} else if (status == FlightCoordinationRecord.STATUS_MODIFY
						&& value == data.TOBT) {
						// 调整
						data.TOBT_style = this.getDisplayStyle('TOBT_IMPROVE');
						data.TOBT_title = data.TOBT.substring(6, 8) + '/'
							+ data.TOBT.substring(8, 12) + '\n'
							+ this.getDisplayStyleZh('TOBT_IMPROVE');
					}
				}
			}
		}
		if($.isValidVariable(flight.tobtUpdateTime)) {
			data.TOBT_UPDATE_TIME = flight.tobtUpdateTime;
			data.TOBT_UPDATE_TIME_title  = '录入时间: ' + flight.tobtUpdateTime.substring(6, 8) + '/'
				+ flight.tobtUpdateTime.substring(8, 12);

			//
			if($.isValidVariable(data.TOBT_title)) {
				data.TOBT_title = data.TOBT_title  +  '\n' + '录入时间: ' + flight.tobtUpdateTime.substring(6, 8) + '/'
					+ flight.tobtUpdateTime.substring(8, 12);
			} else {
				data.TOBT_title ='录入时间: ' + flight.tobtUpdateTime.substring(6, 8) + '/'
					+ flight.tobtUpdateTime.substring(8, 12);
			}
		}
	},

	/**
	 * HOBT
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setHOBT : function(flight, dataTime, data) {
		data.HOBT = "";
		data.HOBT_style = "";
		data.HOBT_title = "";

		//
		if ($.isValidVariable(flight.hobt)) {
			data.HOBT = flight.hobt;
			// 判断协调情况
			if ($.isValidVariable(flight.coordinationRecords)) {
				// 有协调
				var hobtRecord = flight.coordinationRecords[FlightCoordinationRecord.TYPE_HOBT];
				if ($.isValidVariable(hobtRecord)
					&& $.isValidVariable(hobtRecord.status)) {
					// 判断协调状态
					var status = hobtRecord.status;
					if (status == FlightCoordinationRecord.STATUS_APPLY) {
						// 申请
						data.HOBT_style = this.getDisplayStyle('HOBT_APPLY');
						data.HOBT_title = data.HOBT.substring(6, 8) + '/'
							+ data.HOBT.substring(8, 12) + '\n'
							+ this.getDisplayStyleZh('HOBT_APPLY');
					} else if (status == FlightCoordinationRecord.STATUS_APPROVE) {
						// 批复
						data.HOBT_style = this.getDisplayStyle('HOBT_APPROVE');
						data.HOBT_title = data.HOBT.substring(6, 8) + '/'
							+ data.HOBT.substring(8, 12) + '\n'
							+ this.getDisplayStyleZh('HOBT_APPROVE');
					} else if (status == FlightCoordinationRecord.STATUS_REFUSE) {
						// 拒绝
						data.HOBT_style = this.getDisplayStyle('HOBT_REFUSE');
						data.HOBT_title = data.HOBT.substring(6, 8) + '/'
							+ data.HOBT.substring(8, 12) + '\n'
							+ this.getDisplayStyleZh('HOBT_REFUSE');
					}
				} else {
					// 无协调默认显示
					data.HOBT_title = data.HOBT.substring(6, 8) + '/'
						+ data.HOBT.substring(8, 12) + '\n';
					data.HOBT_style = this.getDisplayStyle('DEFAULT');
				}
			} else {
				// 无协调默认显示
				data.HOBT_title = data.HOBT.substring(6, 8) + '/'
					+ data.HOBT.substring(8, 12) + '\n';
				data.HOBT_style = this.getDisplayStyle('DEFAULT');
			}
		}
	},

	/**
	 * COBT 预撤时间
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setCOBT : function(flight, dataTime, data) {
		data.COBT = "";
		data.COBT_style = "";
		data.COBT_title = "";
		if(flight.locked == FlightCoordination.LOCKED
			|| flight.locked == FlightCoordination.LOCKED_IMPACT) {
			// 人工
			data.COBT = flight.cobt;
			if($.isValidVariable(data.COBT)){
				data.COBT_style = this.getDisplayStyle('COBT_MANUAL');
				data.COBT_title = data.COBT.substring(6, 8) + '/'
					+ data.COBT.substring(8, 12) + '\n'
					+ this.getDisplayStyleZh('COBT_MANUAL');
			}
		} else if(flight.locked == FlightCoordination.UNLOCK
			&& ($.isValidVariable(flight.cobt)
			|| $.isValidVariable(flight.ctd))) {
			// 锁定
			data.COBT = flight.cobt;
			if($.isValidVariable(this.systemConfigs.cobtPreLockStatus)) {
				var diff = $.calculateStringTimeDiff(flight.cobt, dataTime)/60/1000;
				if( this.systemConfigs.cobtPreLockStatus != FlightCoordination.STATUS_COBT_PRE_LOCK && diff >= this.systemConfigs.cobtPreLockTime) {
					data.COBT_style = this.getDisplayStyle('COBT_LOCK');
					data.COBT_title = data.COBT.substring(6, 8) + '/'
						+ data.COBT.substring(8, 12) + '\n'
						+ this.getDisplayStyleZh('COBT_LOCK');
				} else {
					data.COBT_style = this.getDisplayStyle('COBT');
					data.COBT_title = data.COBT.substring(6, 8) + '/'
						+ data.COBT.substring(8, 12) + '\n'
						+ this.getDisplayStyleZh('COBT');
				}
			} else {
				data.COBT_style = this.getDisplayStyle('COBT');
				data.COBT_title = data.COBT.substring(6, 8) + '/'
					+ data.COBT.substring(8, 12) + '\n'
					+ this.getDisplayStyleZh('COBT');
			}
		} else if(flight.locked == FlightCoordination.UNLOCK
			&& $.isValidVariable(flight.autoSlot)
			&& $.isValidVariable(flight.autoSlot.ctd)) {
			// 自动
			data.COBT = flight.autoSlot.cobt;
			data.COBT_style = this.getDisplayStyle('COBT_AUTO');
			data.COBT_title = data.COBT.substring(6, 8) + '/'
				+ data.COBT.substring(8, 12) + '\n'
				+ this.getDisplayStyleZh('COBT_AUTO');
		}
	},

	/**
	 * CTOT 预起时间
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setCTOT : function(flight, dataTime, data) {
		data.CTOT = "";
		data.CTOT_style = "";
		data.CTOT_title = "";
		if(flight.locked == FlightCoordination.LOCKED
			|| flight.locked == FlightCoordination.LOCKED_IMPACT) {
			// 人工
			data.CTOT = flight.ctd != undefined ? flight.ctd : "";
			if($.isValidVariable(data.CTOT)){
				data.CTOT_style = this.getDisplayStyle('CTOT_MANUAL');
				data.CTOT_title = data.CTOT.substring(6, 8) + '/'
					+ data.CTOT.substring(8, 12) + '\n'
					+ this.getDisplayStyleZh('CTOT_MANUAL');
			}
		} else if(flight.locked == FlightCoordination.UNLOCK
			&& ($.isValidVariable(flight.cobt)
			|| $.isValidVariable(flight.ctd))) {
			// 锁定
			data.CTOT = flight.ctd != undefined ? flight.ctd : "";
			// 判断锁定状态：预锁/锁定  （锁定值<Now+参数为锁定，否则为预锁状态）
			if(!$.isValidVariable(this.systemConfigs.cobtPreLockTime)) {
				// console.info('error : systemConfigs.cobtPreLockTime is null');
			}
			if($.isValidVariable(this.systemConfigs.cobtPreLockStatus)) {
				var diff = $.calculateStringTimeDiff(flight.cobt, dataTime)/60/1000;
				if( this.systemConfigs.cobtPreLockStatus != FlightCoordination.STATUS_COBT_PRE_LOCK && diff >= this.systemConfigs.cobtPreLockTime) {
					data.CTOT_style = this.getDisplayStyle('CTOT_LOCK');
					data.CTOT_title = data.CTOT.substring(6, 8) + '/'
						+ data.CTOT.substring(8, 12) + '\n'
						+ this.getDisplayStyleZh('CTOT_LOCK');
				} else {
					data.CTOT_style = this.getDisplayStyle('CTOT');
					data.CTOT_title = data.CTOT.substring(6, 8) + '/'
						+ data.CTOT.substring(8, 12) + '\n'
						+ this.getDisplayStyleZh('CTOT');
				}
			} else {
				data.CTOT_style = this.getDisplayStyle('CTOT');
				data.CTOT_title = data.CTOT.substring(6, 8) + '/'
					+ data.CTOT.substring(8, 12) + '\n'
					+ this.getDisplayStyleZh('CTOT');
			}
		} else if(flight.locked == FlightCoordination.UNLOCK
			&& $.isValidVariable(flight.autoSlot)
			&& $.isValidVariable(flight.autoSlot.ctd)) {
			// 自动
			data.CTOT = flight.autoSlot.ctd != undefined ? flight.autoSlot.ctd : "";
			data.CTOT_style = this.getDisplayStyle('CTOT_AUTO');
			data.CTOT_title = data.CTOT.substring(6, 8) + '/'
				+ data.CTOT.substring(8, 12) + '\n'
				+ this.getDisplayStyleZh('CTOT_AUTO');
		}
	},

	/**
	 * ASBT
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setASBT : function(flight, dataTime, data) {
		data.ASBT = "";
		data.ASBT_style = "";
		data.ASBT_title = "";

		//
		if ($.isValidVariable(flight.boardingTime)) {
			data.ASBT = flight.boardingTime;
			data.ASBT_title = flight.boardingTime.substring(6, 8) + '/'
				+ flight.boardingTime.substring(8, 12) + '\n';
			// 判断来源
			if ($.isValidVariable(flight.coordinationRecords)
				&& $.isValidVariable(flight.coordinationRecords[FlightCoordinationRecord.TYPE_BOARDINGTIME])) {
				// 人工
				var record = flight.coordinationRecords[FlightCoordinationRecord.TYPE_BOARDINGTIME];
				data.ASBT_title = data.ASBT_title
					+ this.getDisplayStyleZh('ASBT_MENUAL');
				data.ASBT_style = this.getDisplayStyle('ASBT_MENUAL');
				// 显示录入时间
				data.ASBT_title = data.ASBT_title + '\n'
					+ '录入时间: ' + record.timestamp.substring(6, 8) + '/'
					+ record.timestamp.substring(8, 12);
			} else {
				// 引接
				data.ASBT_title = data.ASBT_title
					+ this.getDisplayStyleZh('ASBT_IMPORT');
				data.ASBT_style = this.getDisplayStyle('ASBT_IMPORT');
			}
		}
	},

	/**
	 * AGCT
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setAGCT : function(flight, dataTime, data) {
		data.AGCT = "";
		data.AGCT_style = "";
		data.AGCT_title = "";

		// 判断来源
		if ($.isValidVariable(flight.closeTime)) {
			// 人工或引接
			data.AGCT = flight.closeTime;
			// 判断是否有协调记录
			if ($.isValidVariable(flight.coordinationRecords)
				&& $.isValidVariable(flight.coordinationRecords[FlightCoordinationRecord.TYPE_CLOSETIME])) {
				// 人工
				data.AGCT_style = this.getDisplayStyle('AGCT_MANUAL');
				data.AGCT_title = data.AGCT.substring(6, 8) + '/'
					+ data.AGCT.substring(8, 12) + '\n'
					+ this.getDisplayStyleZh('AGCT_MANUAL');
				// 显示录入时间
				var record = flight.coordinationRecords[FlightCoordinationRecord.TYPE_CLOSETIME];
				data.AGCT_title = data.AGCT_title + '\n' + '录入时间: '
					+ record.timestamp.substring(6, 8) + '/'
					+ record.timestamp.substring(8, 12);
			} else {
				// 引接
				data.AGCT_style = this.getDisplayStyle('AGCT_IMPORT');
				data.AGCT_title = data.AGCT.substring(6, 8) + '/'
					+ data.AGCT.substring(8, 12) + '\n'
					+ this.getDisplayStyleZh('AGCT_IMPORT');
			}

			// 如同时存在报文，则在title中同时显示
			if ($.isValidVariable(flight.fmeToday.RCldtime)) {
				data.AGCT_title = data.AGCT_title + '\n'
					+ flight.fmeToday.RCldtime.substring(6, 8) + '/'
					+ flight.fmeToday.RCldtime.substring(8, 12) + '\n'
					+ this.getDisplayStyleZh('AGCT_TELE');
			}

		} else if ($.isValidVariable(flight.fmeToday.RCldtime)) {
			// 报文
			data.AGCT = flight.fmeToday.RCldtime;
			data.AGCT_style = this.getDisplayStyle('AGCT_TELE');
			data.AGCT_title = data.AGCT.substring(6, 8) + '/'
				+ data.AGCT.substring(8, 12) + '\n'
				+ this.getDisplayStyleZh('AGCT_TELE');
		}
	},

	/**
	 * AOBT
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setAOBT : function(flight, dataTime, data) {
		data.AOBT = "";
		data.AOBT_style = "";
		data.AOBT_title = "";

		// 判断来源
		if(flight.efpsFlight != null && $.isValidVariable(flight.efpsFlight.pusTime)) {
			// 进程单许可的推出时间
			data.AOBT = flight.efpsFlight.pusTime;
			data.AOBT_style = this.getDisplayStyle('AOBT_EFPS');
			data.AOBT_title = data.AOBT.substring(6, 8) + '/'
				+ data.AOBT.substring(8, 12) + '\n'
				+ this.getDisplayStyleZh('AOBT_EFPS');
			// 录入时间
			if($.isValidVariable(flight.aobtAirline)){
				data.AOBT_title = data.AOBT_title + '\n'
					+ flight.aobtAirline.substring(6, 8) + '/'
					+ flight.aobtAirline.substring(8, 12) + '\n'
					+ this.getDisplayStyleZh('AOBT_MANUAL');
				// 显示录入时间
				var record = flight.coordinationRecords[FlightCoordinationRecord.TYPE_AOBT];
				data.AOBT_title = data.AOBT_title + '\n' + '录入时间: '
					+ record.timestamp.substring(6, 8) + '/'
					+ record.timestamp.substring(8, 12);
			}
			// 引接
			if ($.isValidVariable(flight.aobt)) {
				data.AOBT_title = data.AOBT_title + '\n'
					+ flight.aobt.substring(6, 8) + '/'
					+ flight.aobt.substring(8, 12) + '\n'
					+ this.getDisplayStyleZh('AOBT_IMPORT');
			}
			// 如同时存在报文，则在title中同时显示
			if ($.isValidVariable(flight.fmeToday.ROuttime)) {
				data.AOBT_title = data.AOBT_title + '\n'
					+ flight.fmeToday.ROuttime.substring(6, 8) + '/'
					+ flight.fmeToday.ROuttime.substring(8, 12) + '\n'
					+ this.getDisplayStyleZh('AOBT_TELE');
			}
		} else if ($.isValidVariable(flight.aobt)) {
			// 引接
			data.AOBT = flight.aobt;
			data.AOBT_style = this.getDisplayStyle('AOBT_IMPORT');
			data.AOBT_title = data.AOBT.substring(6, 8) + '/'
				+ data.AOBT.substring(8, 12) + '\n'
				+ this.getDisplayStyleZh('AOBT_IMPORT');
			// 录入时间
			if($.isValidVariable(flight.aobtAirline)){
				data.AOBT_title = data.AOBT_title + '\n'
					+ flight.aobtAirline.substring(6, 8) + '/'
					+ flight.aobtAirline.substring(8, 12) + '\n'
					+ this.getDisplayStyleZh('AOBT_MANUAL');
				// 显示录入时间
				var record = flight.coordinationRecords[FlightCoordinationRecord.TYPE_AOBT];
				data.AOBT_title = data.AOBT_title + '\n' + '录入时间: '
					+ record.timestamp.substring(6, 8) + '/'
					+ record.timestamp.substring(8, 12);
			}
			// 如同时存在报文，则在title中同时显示
			if ($.isValidVariable(flight.fmeToday.ROuttime)) {
				data.AOBT_title = data.AOBT_title + '\n'
					+ flight.fmeToday.ROuttime.substring(6, 8) + '/'
					+ flight.fmeToday.ROuttime.substring(8, 12) + '\n'
					+ this.getDisplayStyleZh('AOBT_TELE');
			}
		} else if($.isValidVariable(flight.aobtAirline)){
			data.AOBT = flight.aobtAirline;
			data.AOBT_style = this.getDisplayStyle('AOBT_MANUAL');
			data.AOBT_title = data.AOBT.substring(6, 8) + '/'
				+ data.AOBT.substring(8, 12) + '\n'
				+ this.getDisplayStyleZh('AOBT_MANUAL');
			// 显示录入时间
			var record = flight.coordinationRecords[FlightCoordinationRecord.TYPE_AOBT];
			data.AOBT_title = data.AOBT_title + '\n' + '录入时间: '
				+ record.timestamp.substring(6, 8) + '/'
				+ record.timestamp.substring(8, 12);

			// 如同时存在报文，则在title中同时显示
			if ($.isValidVariable(flight.fmeToday.ROuttime)) {
				data.AOBT_title = data.AOBT_title + '\n'
					+ flight.fmeToday.ROuttime.substring(6, 8) + '/'
					+ flight.fmeToday.ROuttime.substring(8, 12) + '\n'
					+ this.getDisplayStyleZh('AOBT_TELE');
			}
		} else if ($.isValidVariable(flight.fmeToday.ROuttime)) {
			// 报文
			data.AOBT = flight.fmeToday.ROuttime;
			data.AOBT_style = this.getDisplayStyle('AOBT_TELE');
			data.AOBT_title = data.AOBT.substring(6, 8) + '/'
				+ data.AOBT.substring(8, 12) + '\n'
				+ this.getDisplayStyleZh('AOBT_TELE');
		}
	},

	/**
	 * ATOT
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setATOT : function(flight, dataTime, data) {
		data.ATOT = "";
		data.ATOT_style = "";
		data.ATOT_title = "";
		if ($.isValidVariable(flight.fmeToday.RDeptime)) {
			data.ATOT = flight.fmeToday.RDeptime;
			data.ATOT_style = this.getDisplayStyle('ATOT');
			data.ATOT_title = data.ATOT.substring(6, 8) + '/'
				+ data.ATOT.substring(8, 12) + '\n'
				+ this.getDisplayStyleZh('ATOT');
		}
	},

	/**
	 * ALDT
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setALDT : function(flight, dataTime, data) {
		data.ALDT = "";
		data.ALDT_style = "";
		data.ALDT_title = "";
		if ($.isValidVariable(flight.fmeToday.RArrtime)) {
			data.ALDT = flight.fmeToday.RArrtime;
			data.ALDT_style = this.getDisplayStyle('ATOT');
			data.ALDT_title = data.ALDT.substring(6, 8) + '/'
				+ data.ALDT.substring(8, 12) + '\n'
				+ this.getDisplayStyleZh('ATOT');
		}
	},

	/**
	 * 本厂离港航班的落地时间eta  TODO
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	/*setArrTime : function(flight, dataTime, data){
	 data.ALDT = "";
	 data.ALDT_style = "";
	 data.ALDT_title = "";

	 // 前段降落
	 if ($.isValidVariable(flight.arrTime)
	 && flight.arrTime.length >= 13) {
	 // 降落时间
	 data.ALDT = flight.arrTime.substring(1);
	 // 降落时间缩写
	 var arrTime = flight.arrTime.substring(7, 9) + '/'
	 + flight.arrTime.substring(9, 13);

	 // 判断降落时间类型
	 if (flight.arrTime.indexOf('R') == 0) {
	 // 实际
	 data.ALDT_style = this
	 .getDisplayStyle('FORMER_ARR_REALITY');
	 data.ALDT_title = '实际降落: ' + arrTime;
	 } else if (flight.arrTime.indexOf('D') == 0) {
	 // 雷达降落
	 data.ALDT_style = this
	 .getDisplayStyle('FORMER_ARR_RADAR');
	 data.ALDT_title = '雷达降落: ' + arrTime;
	 } else if (flight.arrTime.indexOf('P') == 0) {
	 // 预计
	 data.ALDT_style = this
	 .getDisplayStyle('FORMER_ARR_PREDICT');
	 data.ALDT_title = '预计降落: ' + arrTime;
	 } else if (flight.arrTime.indexOf('T') == 0) {
	 // 预计-未起飞超时
	 data.ALDT_style = this
	 .getDisplayStyle('FORMER_ARR_TIMEOUT');
	 data.ALDT_title = '未起飞超时: ' + arrTime;
	 } else if (flight.arrTime.indexOf('N') == 0) {
	 // 预计-未正常起飞
	 data.ALDT_style = this
	 .getDisplayStyle('FORMER_ARR_NORMAL');
	 data.ALDT_title = '未起飞正常: ' + arrTime;
	 }
	 }
	 },
	 */

	/**
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setInvalidData : function(flight, dataTime, data) {
		// 若航班已经入池  则认为航班原先锁定或者指定的CTOT,COBT时间失效时间以下划线显示
		// 判断是否进入等待池
		var invalid = false;
		if(flight.poolStatus == FlightCoordination.IN_POOL
			|| flight.poolStatus == FlightCoordination.IN_POOL_M) {
			invalid = true;
		}

		// 判断时间是否失效
		if(invalid){
			if ($.isValidVariable(data.CTOT)) {
				data.CTOT_style = this.getDisplayStyle('DEFAULT')
					+ this.invalidDataStyle;
				data.CTOT_title = data.CTOT.substring(6, 8) + '/'
					+ data.CTOT.substring(8, 12) + '\n失效CTOT时间';
			}
			if ($.isValidVariable(data.COBT)) {
				data.COBT_style = this.getDisplayStyle('DEFAULT')
					+ this.invalidDataStyle;
				data.COBT_title = data.COBT.substring(6, 8) + '/'
					+ data.COBT.substring(8, 12) + '\n失效COBT时间';
			}
			if ($.isValidVariable(data.HOBT)) {
				data.HOBT_style = this.getDisplayStyle('DEFAULT')
					+ this.invalidDataStyle;
				data.HOBT_title = data.HOBT.substring(6, 8) + '/'
					+ data.HOBT.substring(8, 12) + '\n失效HOBT时间';
			}
			if ($.isValidVariable(data.FLOWCONTROL_POINT_PASSTIME)) {
				if(!$.isValidVariable(flight.fmeToday.RDeptime)) {
					data.FLOWCONTROL_POINT_PASSTIME_style = this.getDisplayStyle('DEFAULT')
						+ this.invalidDataStyle;
					data.FLOWCONTROL_POINT_PASSTIME_title = data.FLOWCONTROL_POINT_PASSTIME.substring(6, 8) + '/'
						+ data.FLOWCONTROL_POINT_PASSTIME.substring(8, 12) + '\n失效CTO时间';
				}
			}
			if ($.isValidVariable(data.FLIGHT_ACC_POINT_PASSTIME)) {
				if(!$.isValidVariable(flight.fmeToday.RDeptime)) {
					data.FLIGHT_ACC_POINT_PASSTIME_style = this.getDisplayStyle('DEFAULT')
						+ this.invalidDataStyle;
					data.FLIGHT_ACC_POINT_PASSTIME_title = data.FLIGHT_ACC_POINT_PASSTIME.substring(6, 8) + '/'
						+ data.FLOWCONTROL_POINT_PASSTIME.substring(8, 12) + '\n失效ACC_FIX时间';
				}
			}
			if ($.isValidVariable(data.FLIGHT_APP_POINT_PASSTIME)) {
				if(!$.isValidVariable(flight.fmeToday.RDeptime)) {
					data.FLIGHT_APP_POINT_PASSTIME_style = this.getDisplayStyle('DEFAULT')
						+ this.invalidDataStyle;
					data.FLIGHT_APP_POINT_PASSTIME_title = data.FLIGHT_APP_POINT_PASSTIME.substring(6, 8) + '/'
						+ data.FLIGHT_APP_POINT_PASSTIME.substring(8, 12) + '\n失效APP_FIX时间';
				}
			}
		}
	},

	/**
	 * FormerFlight
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setFormerFlight : function(flight, dataTime, data) {
		data.FORMER_FLIGHTID = flight.formerFlightid;
		data.FORMER_DEP = "";
		data.FORMER_ARR = "";
		data.FORMER_DEP_title = "";
		data.FORMER_DEP_style = "";
		data.FORMER_ARR_title = "";
		data.FORMER_ARR_style = "";

		// 前段航班号
		if ($.isValidVariable(flight.formerFlightid)) {
			if ($.isValidVariable(flight.formerId)) {
				data.FORMER_FLIGHTID_title = 'ID:' + flight.formerId + '\n';
			} else if ($.isValidVariable(flight.fmeToday.formerId)) {
				data.FORMER_FLIGHTID_title = 'ID:' + flight.fmeToday.formerId + '\n';
			}
		}
		if (this.codeType == 'IATA' && $.isValidVariable(data.FORMER_FLIGHTID)) {
			var code = data.FORMER_FLIGHTID.substring(0, 3);
			data.FORMER_FLIGHTID = data.FORMER_FLIGHTID.replace(code,
				BasicAirlines.getICAO2IATACode(code));
		}

		// 前段起飞&前段降落信息
		if ($.isValidVariable(data.FORMER_FLIGHTID)) {
			// 前段起飞
			if ($.isValidVariable(flight.formerDeptime)
				&& flight.formerDeptime.length >= 13) {
				// 起飞时间
				data.FORMER_DEP = flight.formerDeptime.substring(1);
				// 起飞时间缩写
				var formerDeptime = flight.formerDeptime.substring(7, 9) + '/'
					+ flight.formerDeptime.substring(9, 13);
				// 起飞机场
				var formerDepap = flight.formerDepap;

				// 判断起飞时间类型
				if (flight.formerDeptime.indexOf('R') == 0) {
					// 实际
					data.FORMER_FLIGHTID_title = data.FORMER_FLIGHTID_title
						+ data.FORMER_FLIGHTID + '\n' + '起飞机场: '
						+ formerDepap + '\n' + '实际起飞: ' + formerDeptime;
					data.FORMER_DEP_title = '实际起飞: ' + formerDeptime;
				} else if (flight.formerDeptime.indexOf('P') == 0) {
					// 预计
					data.FORMER_FLIGHTID_title = data.FORMER_FLIGHTID_title
						+ data.FORMER_FLIGHTID + '\n' + '起飞机场: '
						+ formerDepap + '\n' + '预计起飞: ' + formerDeptime;
					data.FORMER_DEP_title = '预计起飞: ' + formerDeptime;
				} else if (flight.formerDeptime.indexOf('S') == 0) {
					// 计划
					data.FORMER_FLIGHTID_title = data.FORMER_FLIGHTID_title
						+ data.FORMER_FLIGHTID + '\n' + '起飞机场: '
						+ formerDepap + '\n' + '计划起飞: ' + formerDeptime;
					data.FORMER_DEP_title = '计划起飞: ' + formerDeptime;
				}
			}
			// 前段降落
			if ($.isValidVariable(flight.formerArrtime)
				&& flight.formerArrtime.length >= 13) {
				// 降落时间
				data.FORMER_ARR = flight.formerArrtime.substring(1);
				// 降落时间缩写
				var formerArrtime = flight.formerArrtime.substring(7, 9) + '/'
					+ flight.formerArrtime.substring(9, 13);

				// 判断降落时间类型
				if (flight.formerArrtime.indexOf('R') == 0) {
					// 实际
					data.FORMER_FLIGHTID_title = data.FORMER_FLIGHTID_title
						+ '\n' + '实际降落: ' + formerArrtime;
					data.FORMER_ARR_style = this
						.getDisplayStyle('FORMER_ARR_REALITY');
					data.FORMER_ARR_title = '实际降落: ' + formerArrtime;
				} else if (flight.formerArrtime.indexOf('D') == 0) {
					// 雷达
					data.FORMER_FLIGHTID_title = data.FORMER_FLIGHTID_title
						+ '\n' + '雷达降落: ' + formerArrtime;
					data.FORMER_ARR_style = this
						.getDisplayStyle('FORMER_ARR_RADAR');
					data.FORMER_ARR_title = '雷达降落: ' + formerArrtime;
				} else if (flight.formerArrtime.indexOf('P') == 0) {
					// 预计
					data.FORMER_FLIGHTID_title = data.FORMER_FLIGHTID_title
						+ '\n' + '预计降落: ' + formerArrtime;
					data.FORMER_ARR_style = this
						.getDisplayStyle('FORMER_ARR_PREDICT');
					data.FORMER_ARR_title = '预计降落: ' + formerArrtime;
				} else if (flight.formerArrtime.indexOf('T') == 0) {
					// 预计-未起飞超时
					data.FORMER_FLIGHTID_title = data.FORMER_FLIGHTID_title
						+ '\n' + '预计降落: ' + formerArrtime;
					data.FORMER_ARR_style = this
						.getDisplayStyle('FORMER_ARR_TIMEOUT');
					data.FORMER_ARR_title = '未起飞超时: ' + formerArrtime;
				} else if (flight.formerArrtime.indexOf('N') == 0) {
					// 预计-未正常起飞
					data.FORMER_FLIGHTID_title = data.FORMER_FLIGHTID_title
						+ '\n' + '预计降落: ' + formerArrtime;
					data.FORMER_ARR_style = this
						.getDisplayStyle('FORMER_ARR_NORMAL');
					data.FORMER_ARR_title = '未起飞正常: ' + formerArrtime;
				}
			}
		}
	},

	/**
	 * SPOT
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setSPOT : function(flight, dataTime, data) {
		data.POSITION = "";
		data.POSITION_style = "";
		data.POSITION_title = "";

		//
		if ($.isValidVariable(flight.position)) {
			data.POSITION = flight.position;
			// 判断来源
			if ($.isValidVariable(flight.coordinationRecords)
				&& $.isValidVariable(flight.coordinationRecords[FlightCoordinationRecord.TYPE_POSITION])) {
				// 人工
				data.POSITION_style = this.getDisplayStyle('SPOT_MANUAL');
				data.POSITION_title = flight.position + '\n'
					+ this.getDisplayStyleZh('SPOT_MANUAL');

				// 显示录入时间
				var record = flight.coordinationRecords[FlightCoordinationRecord.TYPE_POSITION];
				data.POSITION_title = data.POSITION_title + '\n' + '录入时间: '
					+ record.timestamp.substring(6, 8) + '/'
					+ record.timestamp.substring(8, 12);
			} else {
				// 引接
				data.POSITION_style = this.getDisplayStyle('SPOT_IMPORT');
				data.POSITION_title = flight.position + '\n'
					+ this.getDisplayStyleZh('SPOT_IMPORT');
			}
		}
	},

	/**
	 * DeiceStatus
	 * @param {} flight
	 * @param {} dataTime
	 * @param {} data
	 */
	setDeiceStatus: function(flight, dataTime, data){
		data.DEICE_STATUS='';
		if($.isValidVariable(flight.deiceStatus) && flight.deiceStatus==FlightCoordination.STATUS_DEICE_ON){
			data.DEICE_STATUS='除冰';
		}
	},

	/**
	 * DeicePosition
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setDeicePosition : function(flight, dataTime, data) {
		data.DEICE_POSITION = "";
		data.DEICE_POSITION_title = "";
		data.DEICE_POSITION_style = "";
		if ($.isValidVariable(flight.deicePosition)) {
			data.DEICE_POSITION = flight.deicePosition;
			data.DEICE_POSITION_title = flight.deicePosition;
			data.DEICE_POSITION_style = this.getDisplayStyle('DEICE_POSITION');
		}else if($.isValidVariable(flight.deiceStatus) && flight.deiceStatus == 1){
			data.DEICE_POSITION = '待定';
			data.DEICE_POSITION_title ='待定';
			data.DEICE_POSITION_style = this.getDisplayStyle('DEICE_POSITION');
		}
	},

	/**
	 * DeiceGroup
	 * @param {} flight
	 * @param {} dataTime
	 * @param {} data
	 */
	setDeiceGroup: function(flight, dataTime, data){
		data.DEICE_GROUP='';
		if ($.isValidVariable(flight.deiceGroup)) {
			data.DEICE_GROUP=flight.deiceGroup;
		}
	},

	/**
	 * Runway
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setRunway : function(flight, dataTime, data) {
		data.RUNWAY = "";
		data.RUNWAY_style = "";
		data.RUNWAY_title = "";

		// 判断来源
		if ($.isValidVariable(flight.runway)
			&& $.isValidVariable(flight.coordinationRecords)
			&& $.isValidVariable(flight.coordinationRecords[FlightCoordinationRecord.TYPE_RUNWAY])) {
			// 人工
			data.RUNWAY = flight.runway;
			data.RUNWAY_style = this.getDisplayStyle('RUNWAY_MANUAL');
			data.RUNWAY_title = data.RUNWAY + '\n'
				+ this.getDisplayStyleZh('RUNWAY_MANUAL');
			// 显示录入时间
			var record = flight.coordinationRecords[FlightCoordinationRecord.TYPE_RUNWAY];
			data.RUNWAY_title = data.RUNWAY_title + '\n' + '录入时间: '
				+ record.timestamp.substring(6, 8) + '/'
				+ record.timestamp.substring(8, 12);
		} else if ($.isValidVariable(flight.runway)) {
			// 系统（时隙分配程序录入）
			data.RUNWAY = flight.runway;
			data.RUNWAY_style = this.getDisplayStyle('RUNWAY_MANUAL');
			data.RUNWAY_title = data.RUNWAY + '\n'
				+ this.getDisplayStyleZh('RUNWAY_SLOT');
		} else if ($.isValidVariable(flight.crunway)) {
			// 系统-推算
			data.RUNWAY = flight.crunway;
			data.RUNWAY_style = this.getDisplayStyle('RUNWAY_SYSTEM');
			data.RUNWAY_title = data.RUNWAY + '\n'
				+ this.getDisplayStyleZh('RUNWAY_SYSTEM');
		}
	},

	/**
	 * Taxi
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setTaxi : function(flight, dataTime, data) {
		data.TAXI = "";
		if ($.isValidVariable(flight.taxi)) {
			data.TAXI = flight.taxi;
		}
	},

	/**
	 * Status
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setStatus : function(flight, dataTime, data) {
		data.STATUS = "";
		if ($.isValidVariable(flight.status)) {
			data.STATUS = FlightCoordination.getStatusZh(flight);
		}
	},

	/**
	 * PoolStatus
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setPoolStatus : function(flight, dataTime, data) {
		data.POOL_STATUS = "";
		if ($.isValidVariable(flight.poolStatus)) {
			//判断如果是没有发报
			if( !FmeToday.hadFPL(flight.fmeToday) ){
				//未发报不显示
				data.POOL_STATUS = "";
			}else{
				data.POOL_STATUS = FlightCoordination.getPoolStatusZh(flight.poolStatus);
			}

		}
	},

	/**
	 * FlowcontrolStatus
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setFlowcontrolStatus : function(flight, dataTime, data) {
		data.FLOWCONTROL_STATUS = '';
		data.FLOWCONTROL_STATUS_title = '';
		var flowcontrolCount = 0;
		var flowcontrolInfo = '';
		var isGS = false;
		var isREQ = false;

		// 判断是否受流控影响
		if ($.isValidVariable(flight.flowcontrols)) {
			for ( var id in flight.flowcontrols) {
				var fc = flight.flowcontrols[id];
				var fcname = fc[0];
				var fctype = fc[1];
				var fcreason = fc[2];
				var flowcontrolType = fc[3];
				var flowcontrolValue = fc[4];
				if (!this.showLongFlowcontrol && flowcontrolType == 0) {
					continue;
				}
				if (fctype == FlowcontrolUtils.TYPE_GS) {
					isGS = true;
				}
				if (fctype == FlowcontrolUtils.TYPE_REQ) {
					isREQ = true;
				}

				flowcontrolInfo += '[ ' + fcname + ' '
					+ FlowcontrolUtils.getReasonZh(fcreason) + ' '
					+ FlowcontrolUtils.getTypeZh(fctype) + ' ';
				if(fctype == FlowcontrolUtils.TYPE_TIME){
					flowcontrolInfo += flowcontrolValue + '分钟  ]\n';
				} else {
					flowcontrolInfo += ']\n';
				}
				flowcontrolCount++;
			}
		}
		if (flowcontrolCount > 0) {
			if (isGS) {
				data.FLOWCONTROL_STATUS = '停止';
			} else if(isREQ){
				data.FLOWCONTROL_STATUS = '申请';
			}else {
				data.FLOWCONTROL_STATUS = '受控';
			}
			data.FLOWCONTROL_STATUS_title += ('受影响流控:\n' + flowcontrolInfo);
		}
	},

	/**
	 * SlotStatus
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setSlotStatus : function(flight, dataTime, data) {
		data.SLOT_STATUS = '';
		// 判断航班是否已经起飞
		if (!FmeToday.hadDEP(flight.fmeToday)) {
			// 未起飞
			if (FlightCoordination.isInPoolFlight(flight)) {
				data.SLOT_STATUS = '入池';
			} else if (flight.locked == FlightCoordination.LOCKED_IMPACT
				|| flight.locked == FlightCoordination.LOCKED) {
				data.SLOT_STATUS = '人工';
			} else if (flight.locked == FlightCoordination.UNLOCK
				&& ($.isValidVariable(flight.cobt) || $.isValidVariable(flight.ctd))) {
				data.SLOT_STATUS = '锁定';
			} else if (flight.locked == FlightCoordination.UNLOCK
				&& ($.isValidVariable(flight.autoSlot)
				&& ($.isValidVariable(flight.autoSlot.ctd)
				|| $.isValidVariable(flight.autoSlot.cobt)))) {
				data.SLOT_STATUS = '自动';
			} else if (flight.locked == FlightCoordination.LOCKED_NOSLOT) {
				data.SLOT_STATUS = '不参加';
			}
		}
	},

	/**
	 * Normal
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setNormal : function(flight, dataTime, data) {
		data.NORMAL = "";
		var aobt = "";
		var sobt = "";
		var atot = "";
		//
		if ($.isValidVariable(flight.aobt)) {
			aobt = flight.aobt;
		} else if ($.isValidVariable(flight.fmeToday.ROuttime)) {
			aobt = flight.fmeToday.ROuttime;
		}
		if ($.isValidVariable(flight.fmeToday.SDeptime)) {
			sobt = flight.fmeToday.SDeptime;
		} else if ($.isValidVariable(flight.fmeToday.PDeptime)) {
			sobt = flight.fmeToday.PDeptime;
		}
		if ($.isValidVariable(flight.fmeToday.RDeptime)) {
			atot = flight.fmeToday.RDeptime;
		} else if ($.isValidVariable(flight.atd)) {
			atot = flight.atd;
		}
		// 判断是否取消
		if (FmeToday.isCNLStatus(flight.fmeToday) || FmeToday.isPCancel(flight.fmeToday)) {
			data.NORMAL = '取消';
			data.NORMAL_style = this.getDisplayStyle('NORMAL_CNL');
		} else
		// 判断是否返航备降
		if (FmeToday.isCPLStatus(flight.fmeToday)) {
			data.NORMAL = '返航/备降';
			data.NORMAL_style = this.getDisplayStyle('NORMAL_CPL');
		} else
		// 判断AOBT - SOBT
		if ($.isValidVariable(aobt) && $.isValidVariable(sobt)) {
			var diff = $.calculateStringTimeDiff(aobt, sobt) / 1000 / 60;
			if (diff > 5) {
				data.NORMAL = '延误';
				data.NORMAL_title = data.NORMAL + (diff - 5) + '分钟';
				data.NORMAL_style = this.getDisplayStyle('ABNORMAL_DELAY');
			} else if (diff < -5) {
				data.NORMAL = '提前';
				data.NORMAL_title = data.NORMAL + (diff + 5) + '分钟';
				data.NORMAL_style = this.getDisplayStyle('ABNORMAL_BEFORE');
			} else {
				data.NORMAL = '正常';
				data.NORMAL_style = this.getDisplayStyle('NORMAL');
			}
		} else
		// 判断ATOT - TAXI - SOBT
		if ($.isValidVariable(atot) && $.isValidVariable(sobt)
			&& $.isValidVariable(data.TAXI)) {
			var diff = ($.calculateStringTimeDiff(atot, sobt) / 1000 / 60)
				- data.TAXI;
			if (diff > 5) {
				data.NORMAL = '延误-推测';
				data.NORMAL_title = data.NORMAL + (diff - 5) + '分钟';
				data.NORMAL_style = this.getDisplayStyle('ABNORMAL_C_DELAY');
			} else if (diff < -5) {
				data.NORMAL = '提前-推测';
				data.NORMAL_title = data.NORMAL + (diff + 5) + '分钟';
				data.NORMAL_style = this.getDisplayStyle('ABNORMAL_C_BEFORE');
			} else {
				data.NORMAL = '正常';
				data.NORMAL_style = this.getDisplayStyle('NORMAL');
			}
		} else
		// 判断NOW - SOBT
		if ($.isValidVariable(dataTime) && $.isValidVariable(sobt)) {
			var diff = ($.calculateStringTimeDiff(dataTime, sobt) / 1000 / 60);
			if (diff > 5) {
				data.NORMAL = '延误-推测';
				data.NORMAL_title = data.NORMAL + (diff - 5) + '分钟';
				data.NORMAL_style = this.getDisplayStyle('ABNORMAL_C_DELAY');
			} else {
				data.NORMAL = '正常';
				data.NORMAL_style = this.getDisplayStyle('NORMAL');
			}
		} else {
			data.NORMAL = '正常';
			data.NORMAL_style = this.getDisplayStyle('NORMAL');
		}
	},

	/**
	 * CloseWait
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setCloseWait : function(flight, dataTime, data) {
		data.CLOSE_WAIT = -1;
		if ($.isValidVariable(flight.closeWait) && flight.closeWait > 0) {
			data.CLOSE_WAIT = flight.closeWait;
		}
	},

	/**
	 * TaxiWait
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setTaxiWait : function(flight, dataTime, data) {
		data.TAXIWait = -1;
		if ($.isValidVariable(flight.taxiWait) && flight.taxiWait > 0) {
			data.TAXIWait = flight.taxiWait;
		}
	},

	/**
	 * Delay
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setDelay : function(flight, dataTime, data) {
		data.DELAY = -1;
		if ($.isValidVariable(flight.delay) && flight.delay > 0) {
			data.DELAY = flight.delay;
		}
	},

	/**
	 * DelayReason
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setDelayReason : function(flight, dataTime, data) {
		data.DELAY_REASON = "";

		// 判断延误原因类型
		if ($.isValidVariable(flight.delayReason)) {
			if (flight.delayReason != FlightCoordination.DELAY_REASON_FORMER
				&& flight.delayReason != FlightCoordination.DELAY_REASON_AOC) {
				// 流控
				data.DELAY_REASON = FlowcontrolUtils.getReasonZh(flight.delayReason);
				data.DELAY_REASON_title = data.DELAY_REASON;
			} else {
				// 前序或公司
				data.DELAY_REASON = FlightCoordination.getDelayReasonZh(flight.delayReason);
				data.DELAY_REASON_title = data.DELAY_REASON;
			}
		}
		else if ($.isValidVariable(flight.cdelayReason)) {
			if (flight.cdelayReason != FlightCoordination.DELAY_REASON_FORMER
				&& flight.cdelayReason != FlightCoordination.DELAY_REASON_AOC) {
				// 流控
				data.DELAY_REASON = FlowcontrolUtils.getReasonZh(flight.cdelayReason);
				data.DELAY_REASON_title = data.DELAY_REASON;
			} else {
				// 前序或公司
				data.DELAY_REASON = FlightCoordination
					.getDelayReasonZh(flight.cdelayReason);
				data.DELAY_REASON_title = data.DELAY_REASON;
			}
		}

		// 判断公司延误情况下具体原因
		if ($.isValidVariable(data.DELAY_REASON)
			&& data.DELAY_REASON == FlightCoordination.DELAY_REASON_AOC) {
			// 原因1：申请时间 > 计划时间
			if ($.isValidVariable(flight.fmeToday.teletype)
				&& FmeToday.hadFPL(flight.fmeToday)
				&& $.isValidVariable(data.EOBT)
				&& $.isValidVariable(data.SOBT)
				&& data.EOBT > data.SOBT) {
				data.DELAY_REASON_title = data.DELAY_REASON + '\n'
					+ '原因：申请时间晚于计划时间';
			}
			// 原因2：实关时间 > 协关时间
			if ($.isValidVariable(data.AGCT)
				&& $.isValidVariable(data.HOBT)
				&& data.AGCT > data.HOBT) {
				data.DELAY_REASON_title = data.DELAY_REASON + '\n'
					+ '原因：实关时间晚于协关时间';
			}
		}
	},

	/**
	 * GSOBT & GSSEQ
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setGSOBTAndSEQ : function(flight, dataTime, data) {
		data.GSSEQ = "";
		if ($.isValidVariable(flight.gsseq)) {
			data.GSSEQ = flight.gsseq;
		}
		data.GSOBT = "";
		data.GSOBT_title = "";
		if ($.isValidVariable(flight.gsobt)) {
			data.GSOBT = flight.gsobt;
			data.GSOBT_title = flight.gsobt.substring(6, 8) + '/'
				+ flight.gsobt.substring(8, 12);
		}
	},

	/**
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 * @param points
	 */
	setFlowcontrolPoint: function (flight, dataTime, data, points, flowId) {

		// 初始化受控过点信息
		data.FLOWCONTROL_POINT = "";
		data.FLOWCONTROL_POINT_title = "";
		data.FLOWCONTROL_POINT_PASSTIME = "";
		data.FLOWCONTROL_POINT_PASSTIME_style = "";
		data.FLOWCONTROL_POINT_PASSTIME_title = "";
		data.FLOWCONTROL_POINT_PASSTIME_E = "";
		data.FLOWCONTROL_POINT_PASSTIME_interval = false;
		// 初始化受控过点信息ETO
		data.FLOWCONTROL_POINT_PASSTIME_ETO = "";
		data.FLOWCONTROL_POINT_PASSTIME_ETO_style = "";
		data.FLOWCONTROL_POINT_PASSTIME_ETO_title = "";
		// 初始化受控过点信息CTO
		data.FLOWCONTROL_POINT_PASSTIME_CTO = "";
		data.FLOWCONTROL_POINT_PASSTIME_CTO_style = "";
		data.FLOWCONTROL_POINT_PASSTIME_CTO_title = "";

		// 无受控航路点 不计算受控过点时间
		if(!$.isValidVariable(points)){
			return;
		}

		// 航班起飞机场
		var depap = FmeToday.getRPSDepAP(flight.fmeToday);

		// 获取FC、SLOT的过点信息
		var fcMpi = FlightCoordination.parseMonitorPointInfo(flight);
		var slotMpi = FlightCoordination.parseAutoSlotMonitorPointInfo(flight.autoSlot);
		// 获取航班所过的受控航路点
		var hitPoint = "";
		for ( var point in fcMpi) {
			if (points.indexOf(point) >= 0) {
				hitPoint = point;
				break;
			}
		}
		// 拆解出受控的航路点过点信息
		var hitPointFcInfo = fcMpi[hitPoint];
		var hitPointSlotInfo = slotMpi[hitPoint];

		// 确定航班所过的受控航路点
		data.FLOWCONTROL_POINT = hitPoint;

		// 计算受控过点时间
		var passtime_A = "";
		var passtime_C = "";
		var passtime_Auto_C = "";
		var passtime_E = "";
		var passtime_T = "";
		var passtime_P = "";
		if ($.isValidVariable(hitPointFcInfo)) {
			if($.isValidVariable(hitPointFcInfo['A'])){
				passtime_A = hitPointFcInfo['A'];
			}
			if($.isValidVariable(hitPointFcInfo['C'])){
				passtime_C = hitPointFcInfo['C'];
			}
			if($.isValidVariable(hitPointFcInfo['E'])){
				passtime_E = hitPointFcInfo['E'];
			}
			if($.isValidVariable(hitPointFcInfo['T'])){
				passtime_T = hitPointFcInfo['T'];
			}
			if($.isValidVariable(hitPointFcInfo['P'])){
				passtime_P = hitPointFcInfo['P'];
			}
		}
		if ($.isValidVariable(hitPointSlotInfo) && $.isValidVariable(hitPointSlotInfo['C'])) {
			passtime_Auto_C = hitPointSlotInfo['C'];
		}

		// 已起飞按照A、T、E、C、AUTO_C的顺序显示航班受控点时间
		if ($.isValidVariable(flight.atd)
			|| $.isValidVariable(flight.estInfo)
			|| $.isValidVariable(flight.updateTime)) {
			// FLOWCONTROL_POINT_PASSTIME
			if ($.isValidVariable(passtime_A)){
				data.FLOWCONTROL_POINT_PASSTIME = passtime_A;
			} else if ($.isValidVariable(passtime_T)){
				data.FLOWCONTROL_POINT_PASSTIME = passtime_T;
			} else if ($.isValidVariable(passtime_E)){
				data.FLOWCONTROL_POINT_PASSTIME = passtime_E;
			} else if ($.isValidVariable(passtime_C)){
				data.FLOWCONTROL_POINT_PASSTIME = passtime_C;
			} else if ($.isValidVariable(passtime_Auto_C)){
				data.FLOWCONTROL_POINT_PASSTIME = passtime_Auto_C;
			} else {
				data.FLOWCONTROL_POINT_PASSTIME = '';
			}
			// FLOWCONTROL_POINT_PASSTIME_ETO
			if($.isValidVariable(passtime_E)){
				data.FLOWCONTROL_POINT_PASSTIME_ETO = passtime_E;
			}
			// FLOWCONTROL_POINT_PASSTIME_CTO
			if ($.isValidVariable(passtime_T)){
				data.FLOWCONTROL_POINT_PASSTIME_CTO = passtime_T;
			} else if ($.isValidVariable(passtime_C)){
				data.FLOWCONTROL_POINT_PASSTIME_CTO = passtime_C;
			} else if ($.isValidVariable(passtime_Auto_C)){
				data.FLOWCONTROL_POINT_PASSTIME_CTO = passtime_Auto_C;
			} else {
				data.FLOWCONTROL_POINT_PASSTIME_CTO = '';
			}
		} else {
			// FLOWCONTROL_POINT_PASSTIME
			if ($.isValidVariable(passtime_C)){
				data.FLOWCONTROL_POINT_PASSTIME = passtime_C;
			} else if ($.isValidVariable(passtime_Auto_C)){
				data.FLOWCONTROL_POINT_PASSTIME = passtime_Auto_C;
			} else if (flight.clearanceType == FlightCoordination.CLEARANCE_OVERFLY
				&& $.isValidVariable(passtime_E)
				&& this.checkFlightIsInternationalDepap(depap)){
				// 国内飞越航班受控过点时间（不存在C值时，使用E/P值参与已分配时隙表格排序）
				data.FLOWCONTROL_POINT_PASSTIME = passtime_E + "_HIDE";
			} else {
				// 航班受控过点时间（不存在C值时，使用E/P值参与未分配时隙表格排序）
				data.FLOWCONTROL_POINT_PASSTIME_E = passtime_E;
				data.FLOWCONTROL_POINT_PASSTIME = '';
			}

// 			暂时屏蔽功能 未分配时隙航班 后续分配顺序
//			else if( $.isValidObject(flight.flowcontrols)
//					&& $.isValidVariable(flowId)
//					&& $.isValidVariable(flight.flowcontrols[flowId][11])){
//				// 航班未分配分配时隙航班 排序（流控信息提供）
//				var num = flight.flowcontrols[flowId][11];
//				data.FLOWCONTROL_POINT_PASSTIME = 't_' + num;
//			}

			// FLOWCONTROL_POINT_PASSTIME_CTO
			if ($.isValidVariable(passtime_C)){
				data.FLOWCONTROL_POINT_PASSTIME_CTO = passtime_C;
			} else if ($.isValidVariable(passtime_Auto_C)){
				data.FLOWCONTROL_POINT_PASSTIME_CTO = passtime_Auto_C;
			} else {
				data.FLOWCONTROL_POINT_PASSTIME_CTO = '';
			}

			// 没有预起时间和预撤时间，不显示受控过点时间
			if (flight.clearanceType == FlightCoordination.CLEARANCE_FLIGHTS
				&& !$.isValidVariable(data.COBT)
				&& !$.isValidVariable(data.CTOT)
				&& data.FLOWCONTROL_POINT_PASSTIME.indexOf("t") <= -1){
				data.FLOWCONTROL_POINT_PASSTIME = '';
				data.FLOWCONTROL_POINT_PASSTIME_CTO = '';
				return;
			}
		}

		// 受控过点时间样式显示
		if ($.isValidVariable(passtime_A)
			&& data.FLOWCONTROL_POINT_PASSTIME == passtime_A){
			data.FLOWCONTROL_POINT_PASSTIME_style = this.getDisplayStyle('ATOT');
		} else if ($.isValidVariable(passtime_T)
			&& data.FLOWCONTROL_POINT_PASSTIME == passtime_T){
			if (flight.locked == FlightCoordination.LOCKED
				|| flight.locked == FlightCoordination.LOCKED_IMPACT) {
				data.FLOWCONTROL_POINT_PASSTIME_style = this.getDisplayStyle('CTOT_MANUAL');
				data.FLOWCONTROL_POINT_PASSTIME_CTO_style = this.getDisplayStyle('CTOT_MANUAL');
			}
		} else if($.isValidVariable(passtime_C)
			&& data.FLOWCONTROL_POINT_PASSTIME == passtime_C){
			if (flight.locked == FlightCoordination.LOCKED
				|| flight.locked == FlightCoordination.LOCKED_IMPACT) {
				data.FLOWCONTROL_POINT_PASSTIME_style = this.getDisplayStyle('CTOT_MANUAL');
				data.FLOWCONTROL_POINT_PASSTIME_CTO_style = this.getDisplayStyle('CTOT_MANUAL');
			} else {
				var COBTStyleStr = data.COBT_style;
				var COBTLockStr = this.getDisplayStyle('COBT_LOCK');
				if ($.isValidVariable(COBTStyleStr) && $.isValidVariable(COBTLockStr) && COBTStyleStr.indexOf(COBTLockStr) > -1) {
					data.FLOWCONTROL_POINT_PASSTIME_style = this.getDisplayStyle('CTOT_LOCK');
					data.FLOWCONTROL_POINT_PASSTIME_CTO_style = this.getDisplayStyle('CTOT_LOCK');
				} else {
					data.FLOWCONTROL_POINT_PASSTIME_style = this.getDisplayStyle('CTOT');
					data.FLOWCONTROL_POINT_PASSTIME_CTO_style = this.getDisplayStyle('CTOT');
				}
			}
		} else if ($.isValidVariable(passtime_Auto_C)
			&& data.FLOWCONTROL_POINT_PASSTIME == passtime_Auto_C){
			data.FLOWCONTROL_POINT_PASSTIME_style = this.getDisplayStyle('CTOT_AUTO');
			data.FLOWCONTROL_POINT_PASSTIME_CTO_style = this.getDisplayStyle('CTOT_AUTO');
		}

		//  入池航班
		if (!$.isValidVariable(flight.atd)
			&& !$.isValidVariable(flight.estInfo)
			&& !$.isValidVariable(flight.updateTime)
			&& FlightCoordination.isInPoolFlight(flight)) {
			data.FLOWCONTROL_POINT_PASSTIME = passtime_C;
		}

		// 提示信息显示所有过点时间
		data.FLOWCONTROL_POINT_PASSTIME_title = '';
		data.FLOWCONTROL_POINT_PASSTIME_ETO_title = '';
		data.FLOWCONTROL_POINT_PASSTIME_CTO_title = '';
		if($.isValidVariable(passtime_A)){
			data.FLOWCONTROL_POINT_PASSTIME_title += ('实际: '
			+ this.formatTime(passtime_A) + '\n');
		}
		if ($.isValidVariable(passtime_T)) {
			data.FLOWCONTROL_POINT_PASSTIME_title += ('已起飞人工: '
			+ this.formatTime(passtime_T) + '\n');
			data.FLOWCONTROL_POINT_PASSTIME_CTO_title += ('已起飞人工: '
			+ this.formatTime(passtime_T) + '\n');
		}
		if($.isValidVariable(passtime_E)){
			data.FLOWCONTROL_POINT_PASSTIME_title += ('预计: '
			+ this.formatTime(passtime_E) + '\n');
			data.FLOWCONTROL_POINT_PASSTIME_ETO_title += ('预计: '
			+ this.formatTime(passtime_E) + '\n');
		}
		if($.isValidVariable(passtime_C)){
			if (flight.locked == FlightCoordination.LOCKED
				|| flight.locked == FlightCoordination.LOCKED_IMPACT) {
				data.FLOWCONTROL_POINT_PASSTIME_title += ('人工: '
				+ this.formatTime(passtime_C) + '\n');
				data.FLOWCONTROL_POINT_PASSTIME_CTO_title += ('人工: '
				+ this.formatTime(passtime_C) + '\n');
			} else {
				data.FLOWCONTROL_POINT_PASSTIME_title += ('锁定: '
				+ this.formatTime(passtime_C) + '\n');
				data.FLOWCONTROL_POINT_PASSTIME_CTO_title += ('锁定: '
				+ this.formatTime(passtime_C) + '\n');
			}
		}
		if($.isValidVariable(passtime_Auto_C)){
			data.FLOWCONTROL_POINT_PASSTIME_title += ('计算: '
			+ this.formatTime(passtime_Auto_C) + '\n');
			data.FLOWCONTROL_POINT_PASSTIME_CTO_title += ('计算: '
			+ this.formatTime(passtime_Auto_C) + '\n');
		}
	},


	/**
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 * @param points
	 */
	setEntryOrExitEPoint : function (flight, dataTime, data, name){
		if(!$.isValidVariable(name)
			|| !$.isValidVariable(data.FLOWCONTROL_POINT_PASSTIME)
			|| data.FLOWCONTROL_POINT_PASSTIME.indexOf("HIDE") > -1){
			return;
		}
		var upperStr = name.toUpperCase();
		var baseName = upperStr + "_POINT";
		var baseNameTitle = upperStr + "_POINT_title";
		var baseNameStyle = upperStr + "_POINT_style";
		var baseNameTime = upperStr + "_POINT_TIME";
		var baseNameTimeTitle = upperStr + "_POINT_TIME_title";
		var baseNameTimeStyle = upperStr + "_POINT_TIME_style";
		//入境点/处境点
		data[baseName] = "";
		//入境点/处境点  title
		data[baseNameTitle] = "";
		//入境点/处境点  style
		data[baseNameStyle] = this.getDisplayStyle('DEFAULT');
		//入境时间/处境时间
		data[baseNameTime] = "";
		//入境时间/处境时间 title
		data[baseNameTimeTitle] = "";
		//入境点/处境点  style
		data[baseNameTimeStyle] = this.getDisplayStyle('DEFAULT');


		// 获取FC、SLOT的过点信息
		var fcMpi = FlightCoordination.parseMonitorPointInfo(flight);
		var slotMpi = FlightCoordination.parseAutoSlotMonitorPointInfo(flight.autoSlot);

		// 拆解出受控的航路点过点信息
		var pointStr = name + "Point";
		if( $.isValidVariable(flight[pointStr]) ){
			var fPoint = flight[pointStr];
			//入境点/处境点 赋值
			data[baseName] = fPoint;
			data[baseNameTitle] = fPoint;
			var pointFcInfo = fcMpi[fPoint];
			var pointSlotInfo = slotMpi[fPoint];
			// 计算受控过点时间,逐一赋值
			if ($.isValidVariable(pointFcInfo)) {
				var pointtime_A = $.isValidVariable(pointFcInfo['A']) ? pointFcInfo['A'] : "";
				var pointtime_C = $.isValidVariable(pointFcInfo['C']) ? pointFcInfo['C'] : "";
				var pointtime_E = $.isValidVariable(pointFcInfo['E']) ? pointFcInfo['E'] : "";
				var pointtime_T = $.isValidVariable(pointFcInfo['T']) ? pointFcInfo['T'] : "";
				var pointtime_P = $.isValidVariable(pointFcInfo['P']) ? pointFcInfo['P'] : "";
			}
			var pointtime_Auto_C = "";
			if ($.isValidVariable(pointSlotInfo) && $.isValidVariable(pointSlotInfo['C'])) {
				pointtime_Auto_C = pointSlotInfo['C'];
			}
			// 已起飞按照A、T、E、C、AUTO_C的顺序显示航班受控点时间
			if ($.isValidVariable(flight.atd)
				|| $.isValidVariable(flight.estInfo)
				|| $.isValidVariable(flight.updateTime)) {
				if ($.isValidVariable(pointtime_A)){
					data[baseNameTime] = pointtime_A;
					data[baseNameTimeTitle] =('实际: '+ this.formatTime(pointtime_A) + '\n');
					data[baseNameTimeStyle] = this.getDisplayStyle('ATOT');
				} else if ($.isValidVariable(pointtime_T)){
					data[baseNameTime] = pointtime_T;
					data[baseNameTimeTitle] =('已起飞人工: '+ this.formatTime(pointtime_T) + '\n');
					if (flight.locked == FlightCoordination.LOCKED || flight.locked == FlightCoordination.LOCKED_IMPACT) {
						data[baseNameTimeStyle] = this.getDisplayStyle('CTOT_MANUAL');
					}
				} else if ($.isValidVariable(pointtime_E)){
					data[baseNameTime] = pointtime_E;
					data[baseNameTimeTitle] =('预计: '+ this.formatTime(pointtime_E) + '\n');
				} else if ($.isValidVariable(pointtime_C)){
					data[baseNameTime] = pointtime_C;
					if (flight.locked == FlightCoordination.LOCKED || flight.locked == FlightCoordination.LOCKED_IMPACT) {
						data[baseNameTimeTitle] =('人工: '+ this.formatTime(pointtime_C) + '\n');
						data[baseNameTimeStyle] = this.getDisplayStyle('CTOT_MANUAL');
					} else {
						data[baseNameTimeTitle] =('锁定: '+ this.formatTime(pointtime_C) + '\n');
						if( data.COBT_style == this.getDisplayStyle('COBT_LOCK') ){
							data[baseNameTimeStyle] = this.getDisplayStyle('CTOT_LOCK');
						}else{
							data[baseNameTimeStyle] = this.getDisplayStyle('CTOT');
						}
					}
				} else if ($.isValidVariable(pointtime_Auto_C)){
					data[baseNameTime] = pointtime_Auto_C;
					data[baseNameTimeTitle] =('计算: '+ this.formatTime(pointtime_Auto_C) + '\n');
					data[baseNameTimeStyle] = this.getDisplayStyle('CTOT_AUTO');
				}
			} else {
				// 未起飞按照 C、AUTO_C的顺序显示航班受控点时间
				if ($.isValidVariable(pointtime_C)){
					data[baseNameTime] = pointtime_C;
					if (flight.locked == FlightCoordination.LOCKED
						|| flight.locked == FlightCoordination.LOCKED_IMPACT) {
						data[baseNameTimeTitle] =('人工: '+ this.formatTime(pointtime_C) + '\n');
						data[baseNameTimeStyle] = this.getDisplayStyle('CTOT_MANUAL');
					} else {
						data[baseNameTimeTitle] =('锁定: '+ this.formatTime(pointtime_C) + '\n');
						if( data.COBT_style == this.getDisplayStyle('COBT_LOCK') ){
							data[baseNameTimeStyle] = this.getDisplayStyle('CTOT_LOCK');
						}else{
							data[baseNameTimeStyle] = this.getDisplayStyle('CTOT');
						}
					}
				} else if ($.isValidVariable(pointtime_Auto_C)){
					data[baseNameTime] = pointtime_Auto_C;
					data[baseNameTimeTitle] =('计算: '+ this.formatTime(pointtime_Auto_C) + '\n');
					data[baseNameTimeStyle] = this.getDisplayStyle('CTOT_AUTO');
				}  else if ($.isValidVariable(pointtime_P)){
					data[baseNameTime] = pointtime_P;
					data[baseNameTimeTitle] =('报文: '+ this.formatTime(pointtime_P) + '\n');
				}  else if ($.isValidVariable(pointtime_E)){
					data[baseNameTime] = pointtime_E;
					data[baseNameTimeTitle] =('预计: '+ this.formatTime(pointtime_E) + '\n');
				}
			}
		}

	},

	/**
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setFlightAccPoint: function (flight, dataTime, data) {

		// 初始化关注出区域点信息
		data.FLIGHT_ACC_POINT = "";
		data.FLIGHT_ACC_POINT_title = "";
		data.FLIGHT_ACC_POINT_PASSTIME = "";
		data.FLIGHT_ACC_POINT_PASSTIME_style = "";
		data.FLIGHT_ACC_POINT_PASSTIME_title = "";

		// 获取航班关注出区域点
		var hitPoint = flight.controlWaypointName;
		// 无 关注出区域点 不计算受控过点时间
		if(!$.isValidVariable(hitPoint)){
			return;
		}
		//  受控过点时间为空时 不显示关注出区域点时间
		if(!$.isValidVariable(data.FLOWCONTROL_POINT_PASSTIME)){
			return;
		}
		// 获取FC、SLOT的过点信息
		var fcMpi = FlightCoordination.parseMonitorPointInfo(flight);
		var slotMpi = FlightCoordination.parseAutoSlotMonitorPointInfo(flight.autoSlot);

		// 拆解出受控的航路点过点信息
		var hitPointFcInfo = fcMpi[hitPoint];
		var hitPointSlotInfo = slotMpi[hitPoint];

		// 确定航班所过的受控航路点
		data.FLIGHT_ACC_POINT = hitPoint;

		// 计算受控过点时间
		var passtime_A = "";
		var passtime_C = "";
		var passtime_Auto_C = "";
		var passtime_E = "";
		var passtime_T = "";
		if ($.isValidVariable(hitPointFcInfo)) {
			if($.isValidVariable(hitPointFcInfo['A'])){
				passtime_A = hitPointFcInfo['A'];
			}
			if($.isValidVariable(hitPointFcInfo['C'])){
				passtime_C = hitPointFcInfo['C'];
			}
			if($.isValidVariable(hitPointFcInfo['E'])){
				passtime_E = hitPointFcInfo['E'];
			}
			if($.isValidVariable(hitPointFcInfo['T'])){
				passtime_T = hitPointFcInfo['T'];
			}
		}
		if ($.isValidVariable(hitPointSlotInfo) && $.isValidVariable(hitPointSlotInfo['C'])) {
			passtime_Auto_C = hitPointSlotInfo['C'];
		}

		// 已起飞按照A、E、C、AUTO_C的顺序显示航班受控点时间
		if ($.isValidVariable(flight.atd)
			|| $.isValidVariable(flight.estInfo)
			|| $.isValidVariable(flight.updateTime)) {
			// 实际过点时间
			if ($.isValidVariable(passtime_A)){
				data.FLIGHT_ACC_POINT_PASSTIME = passtime_A;
				data.FLIGHT_ACC_POINT_PASSTIME_style = this.getDisplayStyle('ATOT');
			} else if ($.isValidVariable(passtime_T)){
				// 已起飞 人工指定过点时间
				data.FLIGHT_ACC_POINT_PASSTIME = passtime_T;
				data.FLIGHT_ACC_POINT_PASSTIME_style = data.FLOWCONTROL_POINT_PASSTIME_style;
			} else if ($.isValidVariable(passtime_E)){
				data.FLIGHT_ACC_POINT_PASSTIME = passtime_E;
			} else {
				data.FLIGHT_ACC_POINT_PASSTIME = '';
			}
		} else {
			// 未起飞按照 C、AUTO_C的顺序显示航班受控点时间
			if ($.isValidVariable(passtime_C)){
				data.FLIGHT_ACC_POINT_PASSTIME = passtime_C;
			} else if ($.isValidVariable(passtime_Auto_C)){
				data.FLIGHT_ACC_POINT_PASSTIME = passtime_Auto_C;
			} else {
				data.FLIGHT_ACC_POINT_PASSTIME = '';
			}
			data.FLIGHT_ACC_POINT_PASSTIME_style = data.FLOWCONTROL_POINT_PASSTIME_style;
		}

		//  入池航班
		if (!$.isValidVariable(flight.fmeToday.RDeptime)
			&& FlightCoordination.isInPoolFlight(flight)) {
			data.FLIGHT_ACC_POINT_PASSTIME = passtime_C;
			data.FLIGHT_ACC_POINT_PASSTIME_style = this.getDisplayStyle('DEFAULT')
				+ this.invalidDataStyle;
		}

		// 提示信息显示所有过点时间
		data.FLIGHT_ACC_POINT_PASSTIME_title = '';
		if($.isValidVariable(passtime_A)){
			data.FLIGHT_ACC_POINT_PASSTIME_title += ('实际: '
			+ this.formatTime(passtime_A) + '\n');
		}
		if ($.isValidVariable(passtime_T)) {
			data.FLIGHT_ACC_POINT_PASSTIME_title += ('已起飞人工: '
			+ this.formatTime(passtime_T) + '\n');
		}
		if($.isValidVariable(passtime_E)){
			data.FLIGHT_ACC_POINT_PASSTIME_title += ('预计: '
			+ this.formatTime(passtime_E) + '\n');
		}
		if($.isValidVariable(passtime_C)){
			if (flight.locked == FlightCoordination.LOCKED
				|| flight.locked == FlightCoordination.LOCKED_IMPACT) {
				data.FLIGHT_ACC_POINT_PASSTIME_title += ('人工: '
				+ this.formatTime(passtime_C) + '\n');
			} else {
				data.FLIGHT_ACC_POINT_PASSTIME_title += ('锁定: '
				+ this.formatTime(passtime_C) + '\n');
			}
		}
		if($.isValidVariable(passtime_Auto_C)){
			data.FLIGHT_ACC_POINT_PASSTIME_title += ('计算: '
			+ this.formatTime(passtime_Auto_C) + '\n');
		}
	},

	/**
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setFlightAppPoint: function (flight, dataTime, data) {

		// 初始化关注进区域点信息
		data.FLIGHT_APP_POINT = "";
		data.FLIGHT_APP_POINT_title = "";
		data.FLIGHT_APP_POINT_PASSTIME = "";
		data.FLIGHT_APP_POINT_PASSTIME_style = "";
		data.FLIGHT_APP_POINT_PASSTIME_title = "";

		// 获取航班关注进区域点
		var hitPoint = flight.controlInnerWaypointName;
		// 无关注进区域点 不计算受控过点时间
		if(!$.isValidVariable(hitPoint)){
			return;
		}
		//  受控过点时间为空时 不显示关注出区域点时间
		if(!$.isValidVariable(data.FLOWCONTROL_POINT_PASSTIME)){
			return;
		}
		// 获取FC、SLOT的过点信息
		var fcMpi = FlightCoordination.parseMonitorPointInfo(flight);
		var slotMpi = FlightCoordination.parseAutoSlotMonitorPointInfo(flight.autoSlot);

		// 拆解出受控的航路点过点信息
		var hitPointFcInfo = fcMpi[hitPoint];
		var hitPointSlotInfo = slotMpi[hitPoint];

		// 确定航班所过的受控航路点
		data.FLIGHT_APP_POINT = hitPoint;

		// 计算受控过点时间
		var passtime_A = "";
		var passtime_C = "";
		var passtime_Auto_C = "";
		var passtime_E = "";
		var passtime_T = "";
		if ($.isValidVariable(hitPointFcInfo)) {
			if($.isValidVariable(hitPointFcInfo['A'])){
				passtime_A = hitPointFcInfo['A'];
			}
			if($.isValidVariable(hitPointFcInfo['C'])){
				passtime_C = hitPointFcInfo['C'];
			}
			if($.isValidVariable(hitPointFcInfo['E'])){
				passtime_E = hitPointFcInfo['E'];
			}
			if($.isValidVariable(hitPointFcInfo['T'])){
				passtime_T = hitPointFcInfo['T'];
			}
		}
		if ($.isValidVariable(hitPointSlotInfo) && $.isValidVariable(hitPointSlotInfo['C'])) {
			passtime_Auto_C = hitPointSlotInfo['C'];
		}

		// 已起飞按照A、E、C、AUTO_C的顺序显示航班受控点时间
		if ($.isValidVariable(flight.atd)
			|| $.isValidVariable(flight.estInfo)
			|| $.isValidVariable(flight.updateTime)) {
			if ($.isValidVariable(passtime_A)){
				data.FLIGHT_APP_POINT_PASSTIME = passtime_A;
				data.FLIGHT_APP_POINT_PASSTIME_style = this.getDisplayStyle('ATOT');
			} else if ($.isValidVariable(passtime_T)){
				data.FLIGHT_APP_POINT_PASSTIME = passtime_T;
				data.FLIGHT_APP_POINT_PASSTIME_style = data.FLOWCONTROL_POINT_PASSTIME_style;
			} else if ($.isValidVariable(passtime_E)){
				data.FLIGHT_APP_POINT_PASSTIME = passtime_E;
			} else {
				data.FLIGHT_APP_POINT_PASSTIME = '';
			}
		} else {
			// 未起飞按照 C、AUTO_C的顺序显示航班受控点时间
			if ($.isValidVariable(passtime_C)){
				data.FLIGHT_APP_POINT_PASSTIME = passtime_C;
			} else if ($.isValidVariable(passtime_Auto_C)){
				data.FLIGHT_APP_POINT_PASSTIME = passtime_Auto_C;
			} else {
				data.FLIGHT_APP_POINT_PASSTIME = '';
			}
			data.FLIGHT_APP_POINT_PASSTIME_style = data.FLOWCONTROL_POINT_PASSTIME_style;
		}

		//  入池航班
		if (!$.isValidVariable(flight.fmeToday.RDeptime)
			&& FlightCoordination.isInPoolFlight(flight)) {
			data.FLIGHT_APP_POINT_PASSTIME = passtime_C;
			data.FLIGHT_APP_POINT_PASSTIME_style = this.getDisplayStyle('DEFAULT')
				+ this.invalidDataStyle;
		}

		// 提示信息显示所有过点时间
		data.FLIGHT_APP_POINT_PASSTIME_title = '';
		if($.isValidVariable(passtime_A)){
			data.FLIGHT_APP_POINT_PASSTIME_title += ('实际: '
			+ this.formatTime(passtime_A) + '\n');
		}
		if ($.isValidVariable(passtime_T)) {
			data.FLIGHT_APP_POINT_PASSTIME_title += ('已起飞人工: '
			+ this.formatTime(passtime_T) + '\n');
		}
		if($.isValidVariable(passtime_E)){
			data.FLIGHT_APP_POINT_PASSTIME_title += ('预计: '
			+ this.formatTime(passtime_E) + '\n');
		}
		if($.isValidVariable(passtime_C)){
			if (flight.locked == FlightCoordination.LOCKED
				|| flight.locked == FlightCoordination.LOCKED_IMPACT) {
				data.FLIGHT_APP_POINT_PASSTIME_title += ('人工: '
				+ this.formatTime(passtime_C) + '\n');
			} else {
				data.FLIGHT_APP_POINT_PASSTIME_title += ('锁定: '
				+ this.formatTime(passtime_C) + '\n');
			}
		}
		if($.isValidVariable(passtime_Auto_C)){
			data.FLIGHT_APP_POINT_PASSTIME_title += ('计算: '
			+ this.formatTime(passtime_Auto_C) + '\n');
		}
	},

	/**
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	setEfpsFlight : function(flight, dataTime, data) {
		//
		data.EFPS_SID = "";
		if(flight.efpsFlight != null && flight.efpsFlight.sid != null){
			data.EFPS_SID = flight.efpsFlight.sid;
		}
		//
		data.EFPS_ICEID = "";
		if(flight.efpsFlight != null && flight.efpsFlight.iceId != null){
			data.EFPS_ICEID = flight.efpsFlight.iceId;
		}
		//
		data.EFPS_REQTIME = "";
		data.EFPS_REQTIME_title = "";
		if(flight.efpsFlight != null && $.isValidVariable(flight.efpsFlight.reqTime)){
			data.EFPS_REQTIME = flight.efpsFlight.reqTime;
			data.EFPS_REQTIME_title = flight.efpsFlight.reqTime.substring(6, 8)
				+ '/' + flight.efpsFlight.reqTime.substring(8, 12);
		}
		//
		data.EFPS_PUSTIME = "";
		data.EFPS_PUSTIME_title = "";
		if(flight.efpsFlight != null && $.isValidVariable(flight.efpsFlight.pusTime)){
			data.EFPS_PUSTIME = flight.efpsFlight.pusTime;
			data.EFPS_PUSTIME_title = flight.efpsFlight.pusTime.substring(6, 8)
				+ '/' + flight.efpsFlight.pusTime.substring(8, 12);
		}
		//
		data.EFPS_LINTIME = "";
		data.EFPS_LINTIME_title = "";
		if(flight.efpsFlight != null && $.isValidVariable(flight.efpsFlight.linTime)){
			data.EFPS_LINTIME = flight.efpsFlight.linTime;
			data.EFPS_LINTIME_title = flight.efpsFlight.linTime.substring(6, 8)
				+ '/' + flight.efpsFlight.linTime.substring(8, 12);
		}
		//
		data.EFPS_IN_DHLTIME = "";
		data.EFPS_IN_DHLTIME_title = "";
		if(flight.efpsFlight != null && $.isValidVariable(flight.efpsFlight.inDhlTime)){
			data.EFPS_IN_DHLTIME = flight.efpsFlight.inDhlTime;
			data.EFPS_IN_DHLTIME_title = flight.efpsFlight.inDhlTime.substring(6, 8)
				+ '/' + flight.efpsFlight.inDhlTime.substring(8, 12);
		}
		//
		data.EFPS_OUT_DHLTIME = "";
		data.EFPS_OUT_DHLTIME_title = "";
		if(flight.efpsFlight != null && $.isValidVariable(flight.efpsFlight.outDhlTime)){
			data.EFPS_OUT_DHLTIME = flight.efpsFlight.outDhlTime;
			data.EFPS_OUT_DHLTIME_title = flight.efpsFlight.outDhlTime.substring(6, 8)
				+ '/' + flight.efpsFlight.outDhlTime.substring(8, 12);
		}
		//
		data.EFPS_IN_ICETIME = "";
		data.EFPS_IN_ICETIME_title = "";
		if(flight.efpsFlight != null && $.isValidVariable(flight.efpsFlight.inIceTime)){
			data.EFPS_IN_ICETIME = flight.efpsFlight.inIceTime;
			data.EFPS_IN_ICETIME_title = flight.efpsFlight.inIceTime.substring(6, 8)
				+ '/' + flight.efpsFlight.inIceTime.substring(8, 12);
		}
		//
		data.EFPS_OUT_ICETIME = "";
		data.EFPS_OUT_ICETIME_title = "";
		if(flight.efpsFlight != null && $.isValidVariable(flight.efpsFlight.outIcTime)){
			data.EFPS_OUT_ICETIME = flight.efpsFlight.outIcTime;
			data.EFPS_OUT_ICETIME_title = flight.efpsFlight.outIcTime.substring(6, 8)
				+ '/' + flight.efpsFlight.outIcTime.substring(8, 12);
		}
		//
		data.EFPS_STATUS = "";
		if(flight.efpsFlight != null && $.isValidVariable(flight.efpsFlight.status)){
			data.EFPS_STATUS = FlightCoordination.getEfpsStatusZh(flight.efpsFlight.status);
		}
		//
		data.EFPS_TAXTIME = "";
		data.EFPS_TAXTIME_title = "";
		if(flight.efpsFlight != null && $.isValidVariable(flight.efpsFlight.taxTime)){
			data.EFPS_TAXTIME = flight.efpsFlight.taxTime;
			data.EFPS_TAXTIME_title = flight.efpsFlight.taxTime.substring(6, 8)
				+ '/' + flight.efpsFlight.taxTime.substring(8, 12);
		}
	},

	setARDT : function(flight, dataTime, data) {
		data.READY = "";
		if(flight.ardtManual != null){
			data.READY = flight.ardtManual;
			data.READY_title = '准备完毕时间: ' + flight.ardtManual.substring(6, 8)
				+ '/' + flight.ardtManual.substring(8, 12);
		}
	},

	/**
	 *
	 * 取消、退出、入池、豁免、放行、准备完毕 延误起飞告警
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	markFlightidStyle : function(flight, dataTime, data) {
		// 豁免
		if(data.priority == FlightCoordination.PRIORITY_EXEMPT){
			data.FLIGHTID_style = this.getDisplayStyle('MARK_EXEMPT');
			data.FLIGHTID_title = data.FLIGHTID_title + '\n' + '已豁免';
		}
        //延误航班起飞告警
		if($.isValidVariable(data.CTOT)&& $.isValidVariable(data.SOBT)){
			if($.calculateStringTimeDiff(data.CTOT,data.SOBT)/1000/60>25){
				data.FLIGHTID_style = this.getDisplayStyle('DELAY_DEP_ALARM');
				data.FLIGHTID_title = data.FLIGHTID_title + '\n' + '延误起飞告警';
			}
		}

//		// 已放行
//		if ($.isValidVariable(flight.coordinationRecords)) {
//			var clearanceRecord = flight.coordinationRecords[FlightCoordinationRecord.TYPE_MARK_CLEARANCE];
//			if ($.isValidVariable(clearanceRecord)
//					&& $.isValidVariable(clearanceRecord.status)) {
//				var status = clearanceRecord.value;
//				if (status == 1) {
//					data.FLIGHTID_style = this
//							.getDisplayStyle('CLEARANCE_MANUAL');
//					data.FLIGHTID_title = data.FLIGHTID_title + '\n' + '已放行';
//				}
//			}
//		}

		// 已入池
		if (!$.isValidVariable(data.FLIGHTID_style)
			&& FlightCoordination.isInPoolFlight(flight)
			&& !FmeToday.hadDEP(flight.fmeToday)) {
			data.FLIGHTID_style = this.getDisplayStyle('IN_WAIT_POOL');
			data.FLIGHTID_title = data.FLIGHTID_title + '\n' + '已入池';
		}

		// 已被流控影响（航班受流控影响&&COBT-TOBT>5）
//		if (!$.isValidVariable(data.FLIGHTID_style)
//				&& $.isValidVariable(data.COBT) 
//				&& $.isValidVariable(data.TOBT)
//				&& $.isValidVariable(data.FLOWCONTROL_STATUS)
//				&& !FmeToday.hadDEP(flight.fmeToday)) {
//			var subtract = $.calculateStringTimeDiff(data.COBT, data.TOBT);
//			if ($.isValidVariable(subtract) && subtract > (60 * 1000 * 5)) {
//				data.FLIGHTID_style = this
//						.getDisplayStyle('FLOWCONTROL_IMPACT_FLIGHT');
//				data.FLIGHTID_title = data.FLIGHTID_title + '\n' + '已被流控影响';
//			}
//		}

		// 添加航班号字体大小 TODO
//		if (!$.isValidVariable(data.FLIGHTID_style)) {
//			data.FLIGHTID_style = this.getDisplayFontSize('flight_id');
//		}
	},

	/**
	 *
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	markDEPFlightStyle : function(flight, dataTime, data) {
		if ($.isValidVariable(flight.fmeToday.RDeptime)) {
			for ( var pro in data) {
				if (pro.indexOf('_style') < 0 && pro.indexOf('_title') < 0
					&& $.isValidVariable(data[pro])) {
					if (
						//pro == 'TOBT'||
					pro == 'HOBT'
					|| pro == 'COBT'
					|| pro == 'CTOT'
					|| pro == 'ASBT'
					|| pro == 'AGCT'
					|| pro == 'AOBT') {
						if ((pro == 'COBT' || pro == 'CTOT')
							&& data[pro + '_style'] == (this.getDisplayStyle('DEFAULT')
							+ this.invalidDataStyle)) {
							data[pro + '_style'] = this.getDisplayStyle('DEFAULT')
								+ this.invalidDataStyle + this.getDisplayStyle('OUT_OR_DEP');
						} else {
							data[pro + '_style'] = this.getDisplayStyle('OUT_OR_DEP');
						}
					}
				}
			}
			/*
			 if ($.isValidVariable(data.COBT)) {
			 data.COBT_style = data.COBT_style
			 + this.getDisplayStyle('OUT_OR_DEP');
			 }
			 if ($.isValidVariable(data.HOBT)) {
			 data.HOBT_style = data.HOBT_style
			 + this.getDisplayStyle('OUT_OR_DEP');
			 }
			 if ($.isValidVariable(data.CTOT)) {
			 data.CTOT_style = data.CTOT_style
			 + this.getDisplayStyle('OUT_OR_DEP');
			 }
			 if ($.isValidVariable(data.TOBT)) {
			 data.TOBT_style = data.TOBT_style
			 + this.getDisplayStyle('OUT_OR_DEP');
			 data.STATUS_style = "";
			 }
			 if ($.isValidVariable(data.AGCT)) {
			 data.AGCT_style = data.AGCT_style
			 + this.getDisplayStyle('OUT_OR_DEP');
			 }
			 if ($.isValidVariable(data.ASBT)) {
			 data.ASBT_style = data.ASBT_style
			 + this.getDisplayStyle('OUT_OR_DEP');
			 }
			 if ($.isValidVariable(data.AOBT)) {
			 data.AOBT_style = data.AOBT_style
			 + this.getDisplayStyle('OUT_OR_DEP');
			 }
			 */
		}

	},

	/**
	 *
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	markCNLFlightStyle : function(flight, dataTime, data) {
		if (flight.fmeToday.editStatusToday == FmeToday.EDIT_STATUS_TODAY_AOC_CANCEL) {
			for ( var pro in data) {
				if (pro.indexOf('_style') < 0
					&& pro.indexOf('_title') < 0
					&& $.isValidVariable(data[pro])) {
					data[pro + '_style'] = this.getDisplayStyle('FLIGHT_CANCEL');
				}
			}
		}
	},

	/**
	 *
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	markStatusStyle : function(flight, dataTime, data) {
		// 判断前段航班降落时间情况
		if ($.isValidVariable(flight.formerArrtime)
			&& flight.formerArrtime.indexOf('T') >= 0
			&& !FmeToday.hadDEP(flight.fmeToday)) {
			data.STATUS_style = this.getDisplayStyle('FORMER_ARR_TIMEOUT');
//			data.TOBT_style = this.getDisplayStyle('FORMER_ARR_TIMEOUT');
		}
	},

	/**
	 *
	 *
	 * @param flight
	 * @param dataTime
	 * @param data
	 */
	clearInvalidData : function(flight, dataTime, data) {
		for ( var key in data) {
			if (!$.isValidVariable(data[key])) {
				data[key] = '';
			} else if (data[key].constructor == String
				&& data[key].indexOf('undefined') >= 0) {
				data[key] = data[key].replace(/undefined/g, '');
			}
		}
	},

	/**
	 * 格式化日期
	 *
	 * @param time
	 * @returns {*}
	 */
	formatTime : function(time) {
		if($.isValidVariable(time)) {
			var day = time.substr(6, 2);
			var hhmm = time.substr(8, 4);
			return day + '/' + hhmm;
		} else {
			return '';
		}
	},
	/**
	 * 校验是否为过国内起飞航班
	 * @param depap
	 * @returns {Boolean}
	 */
	checkFlightIsInternationalDepap : function(depap){
		if ($.isValidVariable(depap)
			&& (depap == 'VHHH'
			|| depap == 'VMMC'
			|| depap.substring(0, 2) == 'RC')
			|| depap.substring(0, 1) == 'Z') {
			return true;
		} else {
			return false;
		}
	},
};
