/**
 * date:2020/02/27
 * author:Mr.Chung
 * version:2.0
 * description:layuimini 菜单框架扩展
 */
layui.define(["element","laytpl" ,"jquery"], function (exports) {
    var element = layui.element,
        $ = layui.$,
        laytpl = layui.laytpl,
        layer = layui.layer;

    var miniMenu = {

        /**
         * 菜单初始化
         * @param options.menuList   菜单数据信息
         * @param options.multiModule 是否开启多模块
         * @param options.menuChildOpen 是否展开子菜单
         */
        render: function (options) {
            options.notTabButPage = options.notTabButPage || false;
            options.menuList = options.menuList || [];
            options.multiModule = options.multiModule || false;
            options.menuChildOpen = options.menuChildOpen || false;

            console.log('options.menuList');
            console.log(options.menuList);
            console.log('options.menuChildOpen');
            console.log(options.menuChildOpen); // 是否展开子菜单
            console.log('options.notTabButPage');
            console.log(options.notTabButPage);
            console.log('options.multiModule');
            console.log(options.multiModule);
            console.log('---------------------------开始渲染');


            // 把菜单的上级都加上_active=true
            
            let isActive = {ok:false};
            miniMenu.detectActive(options.menuList,0,1,isActive); // 第一次去重，保证唯一
            //（这里保证notTabButPage：true时，其他菜单项不会被选中，否则在新页面打开就导致旧页面出错了）
            miniMenu.detectActive(options.menuList,0,2,isActive); // 第二次建立链路（可以写一次，不想改了）
            console.log('------------检测后的：options.menuList');
            console.log(options.menuList);



            if (options.multiModule) {
                console.log('********多模块*******************');
                miniMenu.renderMultiModule(options.menuList, options.menuChildOpen,options.notTabButPage);
            } else {
                console.log('-----------单模块----------------');
                miniMenu.renderSingleModule(options.menuList, options.menuChildOpen,options.notTabButPage);
            }

            miniMenu.changeTable();
            

            miniMenu.listen();
        },

        changeTable:function(){
            console.log("初始菜单模块切换");
                var loading = layer.load(0, {shade: false, time: 2 * 1000});
                var menuId = $('.y-top-m-active-z').attr('data-menu');
                // header
                $(".layuimini-header-menu .layui-nav-item.layui-this").removeClass('layui-this');
                $('.y-top-m-active-z').addClass('layui-this');
                // left
                $(".layuimini-menu-left .layui-nav.layui-nav-tree.layui-this").addClass('layui-hide');
                $(".layuimini-menu-left .layui-nav.layui-nav-tree.layui-this.layui-hide").removeClass('layui-this');
                $("#" + menuId).removeClass('layui-hide');
                $("#" + menuId).addClass('layui-this');
                layer.close(loading);
        },

        detectActive: function (menuList,i,op,isActive) {
            // op = 1 表示第一次检测，把所有active改为false，只留一个active
            i+=1;
            console.log('第' + i + '层检测');
            // menuList = []
            for(let i=0;i<menuList.length;i++){

                if(menuList[i].child!=undefined){
                    if(miniMenu.detectActive(menuList[i].child,i,op,isActive) === true){
                        if(op!==1){
                            menuList[i]._active=true;
                            menuList[i].active = false; // 全局只有一个active和多个_active链
                            return true; // 这里就实现了只有一个被选中
                        }
                    }else{
                        if(op!==1){
                            // 只有其中一个孩子被选中父菜单才能被选中
                            menuList[i]._active=false;
                            menuList[i].active = false;
                        }
                    }
                }
                    

                if(op!==1){
                    if(menuList[i].active === true){
                        menuList[i]._active = true; // 这里设置是让被选中的也展开
                        return true;
                    }
                }else{
                    if(menuList[i].active === true && isActive.ok === false){
                        isActive.ok = true;
                    }else{
                        menuList[i].active = false;
                    }
                }
            }
            return false;
        },


        /**
         * 单模块
         * @param menuList 菜单数据
         * @param menuChildOpen 是否默认展开
         */
        renderSingleModule: function (menuList, menuChildOpen,notTabButPage) {
            console.log('单模块');
            menuList = menuList || [];
            var leftMenuHtml = '',
                childOpenClass = '',
                leftMenuCheckDefault = 'layui-this';
                
              
            var me = this ;
           childOpenClass = ' layui-nav-itemed';

            //if (menuChildOpen) childOpenClass = ' layui-nav-itemed';
            console.log('菜单列表开始传递');
            leftMenuHtml = this.renderLeftMenu(menuList,{ 
                childOpenClass:childOpenClass,
                menuChildOpen:menuChildOpen },notTabButPage) ;
            $('.layui-layout-body').addClass('layuimini-single-module'); //单模块标识
            $('.layuimini-header-menu').remove();
            $('.layuimini-menu-left').html(leftMenuHtml);

            element.init();
        },

        /**
         * 渲染一级菜单
         */
        compileMenu: function(menu,isSub,notTabButPage,isTop){

            // menu中多了这两个玩意：
            // page:val.page,
            // active:val.active
            // _active:val._active
            // 多了个 notTabButPage


            // menu['thisClass'] = ""; // 展示没加选中
             menu['thisClass'] = "layui-this"; // 选中需要加的类
             if(isTop === true && menu['_active'] === true){
                menu['_top'] = "y-top-m-active-z"; // 选中需要加的类
             }else{
                menu['_top'] = ""; 
             }
             if(menu['childOpenClass'] === undefined){
                menu['childOpenClass'] = '';
             }
             if(menu['className'] === undefined){
                menu['className'] = '';
             }
            // layui-nav-item menu-li   layui-this
            console.log('完成菜单');
            console.log('menu');
            console.log(menu);
            console.log('想办法把Active和notTabButPage搞到这儿');
            console.log('isSub');
            console.log(isSub);

            if(notTabButPage){ // 如果是 页面级的
                if(menu.page === undefined){
                    menu.page = 'javascript:void(0);';
                    console.log(menu.title + '没有设置page属性');
                }
                // 应该是左边
                // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------      1      -------------------------------------------------------------------------------------------------------在这里使用page------------------------------------------------------------------------------
                var menuHtml = '<li {{#if( d.menu){ }}  data-menu="{{d.menu}}" {{#}}} class=" {{d._top}}  layui-nav-item menu-li {{# if (d.active) { }}{{d.thisClass}}{{# } }} {{d.childOpenClass}} {{d.className}}"  {{#if( d.id){ }}  id="{{d.id}}" {{#}}} lay-unselect> <a {{#if( d.href){ }} layuimini-href="{{d.href}}" {{#}}} {{#if( d.target){ }}  target="{{d.target}}" {{#}}} href="{{d.page}}">{{#if( d.icon){ }}  <i class="{{d.icon}}"></i> {{#}}} <span class="layui-left-nav">{{d.title}}</span></a>  {{# if(d.children){}} {{d.children}} {{#}}} </li>' ;
                if(isSub){
                    // 应该是顶部
                    //---------------------------------------------------------------------------------------------------------------------------        1               ----在这里使用------------
                    menuHtml = '<dd class="menu-dd {{d._top}} {{d.childOpenClass}} {{# if (d.active) { }}{{d.thisClass}}{{# } }} {{ d.className }}" lay-unselect> <a href="{{d.page}}"  {{#if( d.menu){ }}  data-menu="{{d.menu}}" {{#}}} {{#if( d.id){ }}  id="{{d.id}}" {{#}}} {{#if(( !d.child || !d.child.length ) && d.href){ }} layuimini-href="{{d.href}}" {{#}}} {{#if( d.target){ }}  target="{{d.target}}" {{#}}}> {{#if( d.icon){ }}  <i class="{{d.icon}}"></i> {{#}}} <span class="layui-left-nav"> {{d.title}}</span></a> {{# if(d.children){}} {{d.children}} {{#}}}</dd>'
                }
                console.log('渲染前：'+menuHtml);
                let res = laytpl(menuHtml).render(menu);
                console.log('结果：'+res);
                return res;
            }else{
                // 这是原来的代码
                var menuHtml = '<li {{#if( d.menu){ }}  data-menu="{{d.menu}}" {{#}}} class=" {{d._top}}  layui-nav-item menu-li {{# if (d.active) { }}{{d.thisClass}}{{# } }} {{d.childOpenClass}} {{d.className}}"  {{#if( d.id){ }}  id="{{d.id}}" {{#}}}> <a {{#if( d.href){ }} layuimini-href="{{d.href}}" {{#}}} {{#if( d.target){ }}  target="{{d.target}}" {{#}}} href="javascript:void(0);">{{#if( d.icon){ }}  <i class="{{d.icon}}"></i> {{#}}} <span class="layui-left-nav">{{d.title}}</span></a>  {{# if(d.children){}} {{d.children}} {{#}}} </li>' ;
                if(isSub){
                    menuHtml = '<dd class="menu-dd  {{d._top}}  {{d.childOpenClass}} {{# if (d.active) { }}{{d.thisClass}}{{# } }} {{ d.className }}"> <a href="javascript:void(0);"  {{#if( d.menu){ }}  data-menu="{{d.menu}}" {{#}}} {{#if( d.id){ }}  id="{{d.id}}" {{#}}} {{#if(( !d.child || !d.child.length ) && d.href){ }} layuimini-href="{{d.href}}" {{#}}} {{#if( d.target){ }}  target="{{d.target}}" {{#}}}> {{#if( d.icon){ }}  <i class="{{d.icon}}"></i> {{#}}} <span class="layui-left-nav"> {{d.title}}</span></a> {{# if(d.children){}} {{d.children}} {{#}}}</dd>'
                }
                console.log('渲染前：'+menuHtml);
                let res = laytpl(menuHtml).render(menu);
                console.log('结果：'+res);
                return res;
            }
        },
        compileMenuContainer :function(menu,isSub){
            console.log('完成菜单容器');
            console.log('menu');
            console.log(menu);
            console.log('isSub');
            console.log(isSub);
            var wrapperHtml = '<ul class="layui-nav layui-nav-tree layui-left-nav-tree {{d.className}}" id="{{d.id}}">{{d.children}}</ul>' ;
            if(isSub){
                wrapperHtml = '<dl class="layui-nav-child ">{{d.children}}</dl>' ;
            }
            if(!menu.children){
                return "";
            }
            return laytpl(wrapperHtml).render(menu);
        },

        each:function(list,callback){
            var _list = [];
            for(var i = 0 ,length = list.length ; i<length ;i++ ){
                _list[i] = callback(i,list[i]) ;
            }
            return _list ;
        },
        renderChildrenMenu:function(menuList,options,notTabButPage){
            console.log('渲染菜单孩子');

            console.log('menuList');
            console.log(menuList);
            console.log('options');
            console.log(options);


            var me = this ;
            menuList = menuList || [] ;
            var html = this.each(menuList,function (idx,menu) {
                var isThis = "";
                if(options.menuChildOpen||menu._active){
                    isThis = options.childOpenClass;
                }
                if(menu.child && menu.child.length){
                    menu.children = me.renderChildrenMenu(menu.child,{ 
                        childOpenClass: isThis || '',
                        menuChildOpen:options.menuChildOpen },notTabButPage);
                }
                menu.className = "" ;
                menu.childOpenClass = isThis || ''
                return me.compileMenu(menu,true,notTabButPage)
            }).join("");
            return me.compileMenuContainer({ children:html },true)
        },
        renderLeftMenu :function(leftMenus,options,notTabButPage){
            console.log('渲染左边菜单');
            console.log('leftMenus');
            console.log(leftMenus);
            options = options || {};
            var me = this ;
            console.log('开始遍历');
            var leftMenusHtml =  me.each(leftMenus || [],function (idx,leftMenu) { // 左侧菜单遍历
                console.log('当前遍历：leftMenu');
                console.log(leftMenu);
                console.log('传递：leftMenu.child');
                console.log(leftMenu.child);
                var isThis = "";
                if(options.menuChildOpen||leftMenu._active){
                    isThis = options.childOpenClass;
                }
                var children = me.renderChildrenMenu(leftMenu.child, { 
                    childOpenClass:isThis,
                    menuChildOpen:options.menuChildOpen },notTabButPage);
                
                var leftMenuHtml = me.compileMenu({
                    href: leftMenu.href,
                    target: leftMenu.target,
                    childOpenClass: isThis,
                    icon: leftMenu.icon,
                    title: leftMenu.title,
                    children: children,
                    className: '',
                    /************************在这改渲染格式******************************** */
                    active:leftMenu.active,
                    page: leftMenu.page,
                    _active:leftMenu._active
                },undefined,notTabButPage);
                return leftMenuHtml ;
            }).join("");

            leftMenusHtml = me.compileMenuContainer({ id:options.parentMenuId,className:options.leftMenuCheckDefault,children:leftMenusHtml }) ;
            return leftMenusHtml ;
        },
        /**
         * 多模块
         * @param menuList 菜单数据
         * @param menuChildOpen 是否默认展开
         */
        renderMultiModule: function (menuList, menuChildOpen,notTabButPage) {
            // menuChildOpen ： 是否展开子菜单
            console.log("多模块1")
            menuList = menuList || [];
            var me = this ;
            var headerMenuHtml = '',
                headerMobileMenuHtml = '',
                leftMenuHtml = '',
                leftMenuCheckDefault = 'layui-this',
                childOpenClass = '',
                headerMenuCheckDefault = 'layui-this';

                // 这个变成了打开的类，由 _active或menuChildOpen来指导用不用
                childOpenClass = ' layui-nav-itemed';

                //电脑
            // if (menuChildOpen) childOpenClass = ' layui-nav-itemed';
            var headerMenuHtml = this.each(menuList, function (index, val) { //顶部菜单渲染
                var menu = 'multi_module_' + index ;
                var id = menu+"HeaderId";
                var topMenuItemHtml = "" ;
                // 完成
                topMenuItemHtml = me.compileMenu({
                    className:headerMenuCheckDefault,
                    menu:menu,
                    id:id,
                    title:val.title,
                    href:"",
                    target:"",
                    children:"",
                    page:val.page,
                    // 由 active或menuChildOpen来指导用不用
                    active:val.active,
                    _active:val._active
                },undefined,notTabButPage,true); // 传参正确
                leftMenuHtml+=me.renderLeftMenu(val.child,{
                    parentMenuId:menu,
                    childOpenClass:childOpenClass, // 这是表示类
                    menuChildOpen:menuChildOpen, // 多了这个参数，指示是否开启
                    leftMenuCheckDefault:leftMenuCheckDefault
                },notTabButPage);// 传参正确
                 //手机
                headerMobileMenuHtml +=me.compileMenu({ id:id,menu:menu,id:id,icon:val.icon, title:val.title,
                    page:val.page,
                    active:val.active,
                    _active:val._active },true,notTabButPage);// 传参正确
                headerMenuCheckDefault = "";
                leftMenuCheckDefault = "layui-hide" ;
                return topMenuItemHtml ;
            }).join("");
            $('.layui-layout-body').addClass('layuimini-multi-module'); //多模块标识
            $('.layuimini-menu-header-pc').html(headerMenuHtml); //电脑
            $('.layuimini-menu-left').html(leftMenuHtml);
            $('.layuimini-menu-header-mobile').html(headerMobileMenuHtml); //手机
            element.init();
        },

        /**
         * 监听
         */
        listen: function () {

            /**
             * 菜单模块切换
             */
            $('body').on('click', '[data-menu]', function () {
                console.log("菜单模块切换");
                var loading = layer.load(0, {shade: false, time: 2 * 1000});
                var menuId = $(this).attr('data-menu');
                // header
                $(".layuimini-header-menu .layui-nav-item.layui-this").removeClass('layui-this');
                $(this).addClass('layui-this');
                // left
                $(".layuimini-menu-left .layui-nav.layui-nav-tree.layui-this").addClass('layui-hide');
                $(".layuimini-menu-left .layui-nav.layui-nav-tree.layui-this.layui-hide").removeClass('layui-this');
                $("#" + menuId).removeClass('layui-hide');
                $("#" + menuId).addClass('layui-this');
                layer.close(loading);
            });

            /**
             * 菜单缩放
             */
            $('body').on('click', '.layuimini-site-mobile', function () {
                
                console.log("菜单缩放");
                var loading = layer.load(0, {shade: false, time: 2 * 1000});
                var isShow = $('.layuimini-tool [data-side-fold]').attr('data-side-fold');
                if (isShow == 1) { // 缩放
                    $('.layuimini-tool [data-side-fold]').attr('data-side-fold', 0);
                    $('.layuimini-tool [data-side-fold]').attr('class', 'fa fa-indent');
                    $('.layui-layout-body').removeClass('layuimini-all');
                    $('.layui-layout-body').addClass('layuimini-mini');
                } else { // 正常
                    $('.layuimini-tool [data-side-fold]').attr('data-side-fold', 1);
                    $('.layuimini-tool [data-side-fold]').attr('class', 'fa fa-outdent');
                    $('.layui-layout-body').removeClass('layuimini-mini');
                    $('.layui-layout-body').addClass('layuimini-all');
                    layer.close(window.openTips);
                }
                element.init();
                layer.close(loading);
            });
            /**
             * 菜单缩放
             */
            $('body').on('click', '[data-side-fold]', function () {
                
                console.log("菜单缩放1");
                var loading = layer.load(0, {shade: false, time: 2 * 1000});
                var isShow = $('.layuimini-tool [data-side-fold]').attr('data-side-fold');
                if (isShow == 1) { // 缩放
                    $('.layuimini-tool [data-side-fold]').attr('data-side-fold', 0);
                    $('.layuimini-tool [data-side-fold]').attr('class', 'fa fa-indent');
                    $('.layui-layout-body').removeClass('layuimini-all');
                    $('.layui-layout-body').addClass('layuimini-mini');
                    // $(".menu-li").each(function (idx,el) {
                    //     $(el).addClass("hidden-sub-menu");
                    // });

                } else { // 正常
                    $('.layuimini-tool [data-side-fold]').attr('data-side-fold', 1);
                    $('.layuimini-tool [data-side-fold]').attr('class', 'fa fa-outdent');
                    $('.layui-layout-body').removeClass('layuimini-mini');
                    $('.layui-layout-body').addClass('layuimini-all');
                    // $(".menu-li").each(function (idx,el) {
                    //     $(el).removeClass("hidden-sub-menu");
                    // });
                    layer.close(window.openTips);
                }
                element.init();
                layer.close(loading);
            });

            /**
             * 手机端点开模块
             */
            $('body').on('click', '.layuimini-header-menu.layuimini-mobile-show dd', function () {
                
                console.log("手机端点开模块");
                var loading = layer.load(0, {shade: false, time: 2 * 1000});
                var check = $('.layuimini-tool [data-side-fold]').attr('data-side-fold');
                if(check === "1"){
                    $('.layuimini-site-mobile').trigger("click");
                    element.init();
                }
                layer.close(loading);
            });
        },

    };


    exports("miniMenu", miniMenu);
});
