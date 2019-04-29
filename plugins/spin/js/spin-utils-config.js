/**
 * Created by lenovo on 2016/11/28.
 */
/**
 *  加载spin参数配置
 */
;(function($){
    var ProgressDialog = function( container, options){
        this.$container = $(container);
        this.options = options;

        this.spinnerObj;

        this._init();
    };

    ProgressDialog.prototype = {
        //init progress
        _init : function( ){
            this._initField();

            this._initSimpleLoading();
        },
        //init spin
        _initSimpleLoading : function(){
            var opts = {
                lines: 10, // 花瓣数目
                length: 8, // 花瓣长度
                width: 5, // 花瓣宽度
                radius: 8, // 花瓣距中心半径
                corners: 1, // 花瓣圆滑度 (0-1)
                rotate: 0, // 花瓣旋转角度
                direction: 1, // 花瓣旋转方向 1: 顺时针, -1: 逆时针
                color: '#646464', // 花瓣颜色
                speed: 1, // 花瓣旋转速度
                trail: 60, // 花瓣旋转时的拖影(百分比)
                shadow: false, // 花瓣是否显示阴影
                hwaccel: false, //spinner 是否启用硬件加速及高速旋转
                className: 'spinner', // spinner css 样式名称
                zIndex: 2e9, // spinner的z轴 (默认是2000000000)
                top: 'auto', // spinner 相对父容器Top定位 单位 px
                left: 'auto'// spinner 相对父容器Left定位 单位 px
            };
            this.spinnerObj = new Spinner(opts);
        },
        //init loading html
        _initField : function(){
            var str = '<div class="progress_mask"><div class="progress_container"><div class="progress_loading"></div><div class="progress_message"></div></div></div>';
            this.$container.append( str );
        },
        //适配容器，居中显示
        _posCenter : function($mask){
            var conDom = $(".progress_container",$mask);
            var width = conDom.width();
            var height = conDom.height();
            conDom.css({
                "margin-top": -(height/2) + 'px',
                "margin-left": -(width/2) + 'px'
            })
        },
        //展示
        show : function(msg, container){
            if( container == undefined || container == null){
                container = $("body");
            }
            var $mask = $(".progress_mask", container);
            var _this = this;
            msg = $.isValidVariable(msg) ? msg : "正在查询中，请稍候";
            $(".progress_message",$mask).html(msg);
            $mask.show();
            _this._posCenter($mask);
            var target = $(".progress_loading", $mask)[0];
            _this.spinnerObj.spin(target);

        },
        //隐藏
        hide : function( msg ){
            $(".progress_message").html(msg);
            var _this = this;
            setTimeout(function(){
                _this.spinnerObj.spin();
                $(".progress_mask").hide();
            }, 500);
        },
        //销毁
        destory : function(){
            var $mask = $(".progress_mask")
            $mask.parent().data('progressDialog', "");
            $mask.remove();
        }
    };
    //Entry JQuery Plugins
    $.fn.progressDialog = function( option ){
        var $this = $($(this)[0]);
        var data = $this.data('progressDialog');
        var options = "object" === option && option;
        //prevent duplicate initialize
        if( !data ){
            data = new ProgressDialog($this, options);
            $this.data('progressDialog', data);
        }
    };

    //show
    $.fn.showProgress = function( msg ){
        var $this = $(this);
        var data = $this.data('progressDialog');
        if( data ){
            data.show( msg, $this );
        }
    };

    //hide
    $.fn.hideProgress = function( msg ){
        var $this = $(this);
        var data = $this.data('progressDialog');
        if( data ){
            data.hide( msg );
        }
    };

    //destory
    $.fn.destoryProgressDialog = function(  ){
        var $this = $(this);
        var data = $this.data('progressDialog');
        if( data ){
            data.destory();
        }
    };


}(window.jQuery));

