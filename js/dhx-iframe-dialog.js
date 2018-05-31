/**
 *
 * @type {{}}
 */
var DhxDialogFactory = function () {

    /**
     * DHX Window窗口工厂
     */
    var dhxWinsFactory = null;

    /**
     * 初始化dhxWinsFactory
     */
    var init = function () {
        if (dhxWinsFactory) {
            return;
        }
        // 初始化dhxWinsFactory
        dhxWinsFactory = new dhtmlXWindows();
        // 默认使用body作为Viewport
        dhxWinsFactory.attachViewportTo(document.body);
    }();

    /**
     *
     */
    return {
        init: init,
        factory: dhxWinsFactory
    }
}();

/**
 * DHX Iframe Window组件
 *
 * @type {{create, close}}
 */
var DhxIframeDialog = function () {

    /**
     * 打开
     *
     * @param title 标题
     * @param url URL
     * @param params 参数
     */
    var create = function (title, url, params) {
        // 判断Window是否已经打开，若已打开则不处理
        if ($.isValidVariable(DhxDialogFactory.factory.window(params['id']))) {
            return;
        }
        // 创建Window
        var w1 = DhxDialogFactory.factory.createWindow(params);
        // 设置Window标题
        w1.setText(title);
        // 打开加载动画
        w1.progressOn();
        // Window内容加载完成后关闭加载动画
        w1.attachEvent("onContentLoaded", function (win) {
            win.progressOff();
        });
        // 关联引用URL
        w1.attachURL(url);
        // 添加自定义按钮open
        w1.addUserButton("open", 4, "Open in new tab");
        w1.button("open").attachEvent("onClick", function (win) {
            win.close();
            window.open(url);
        });
        // 自适应位置
        w1.adjustPosition();
        // 显示/隐藏Window右上方按钮
        if ($.isValidVariable(params['buttons'])) {
            var buttons = params['buttons'];
            if (buttons['help'] === false) {
                w1.button('help').hide();
            }
            if (buttons['stick'] === false) {
                w1.button('stick').hide();
            }
            if (buttons['park'] === false) {
                w1.button('park').hide();
            }
            if (buttons['minmax'] === false) {
                w1.button('minmax').hide();
            }
            if (buttons['open'] === false) {
                w1.button('open').hide();
            }
            if (buttons['close'] === false) {
                w1.button('close').hide();
            }
        }
        return w1;
    };

    /**
     * 关闭
     *
     * @param winId Window ID
     */
    var close = function (winId) {
        var win = DhxDialogFactory.factory.window(winId);
        if (win) {
            win.close();
            win.unload();
            win = null;
        } else {
            window.close();
        }
    };
    /**
     *
     */
    return {
        create: create,
        close: close
    }
}();

/**
 * DHX Modal Window组件
 *
 * @returns {{create: Function, close: Function}}
 * @constructor
 */
var DhxModalDialog = function () {

    /**
     * 打开
     * @param title 标题
     * @param content 内容
     * @param params 参数
     */
    var create = function (title, content, params) {
        // 判断Window是否已经打开，若已打开则不处理
        if ($.isValidVariable(DhxDialogFactory.factory.window(params['id']))) {
            return;
        }
        // 创建Window
        var w1 = DhxDialogFactory.factory.createWindow(params);
        // 设置Window标题
        w1.setText(title);
        //// 打开加载动画
        //w1.progressOn();
        //// Window内容加载完成后关闭加载动画
        //w1.attachEvent("onContentLoaded", function (win) {
        //    win.progressOff();
        //});
        w1.attachHTMLString(content);
        // 自适应位置
        w1.adjustPosition();
        // 显示/隐藏Window右上方按钮
        if ($.isValidVariable(params['buttons'])) {
            var buttons = params['buttons'];
            if (buttons['help'] === false) {
                w1.button('help').hide();
            }
            if (buttons['stick'] === false) {
                w1.button('stick').hide();
            }
            if (buttons['park'] === false) {
                w1.button('park').hide();
            }
            if (buttons['minmax'] === false) {
                w1.button('minmax').hide();
            }
            if (buttons['close'] === false) {
                w1.button('close').hide();
            }
        }
        return w1;
    };

    /**
     * 关闭
     *
     * @param winId Window ID
     */
    var close = function (winId) {
        var win = DhxDialogFactory.factory.window(winId);
        win.close();
        win.unload();
        win = null;
    };

    /**
     *
     */
    return {
        create: create,
        close: close
    }
}();





