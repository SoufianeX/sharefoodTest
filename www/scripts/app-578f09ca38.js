(function() {
    'use strict';

    angular
        .module('triangular.layouts', [

        ]);
})();
'use strict';

/**
 * @ngdoc function
 * @name AdminController
 * @module triAngular
 * @kind function
 *
 * @description
 *
 * Handles the admin view
 */
(function() {
    'use strict';

    TriangularStateController.$inject = ["$scope", "$rootScope", "$timeout", "$templateRequest", "$compile", "$element", "$window", "triLayout", "triLoaderService"];
    angular
        .module('triangular.layouts')
        .controller('TriangularStateController', TriangularStateController);

    /* @ngInject */
    function TriangularStateController($scope, $rootScope, $timeout, $templateRequest, $compile, $element, $window, triLayout, triLoaderService) {
        var loadingQueue = [];
        var vm = this;

        vm.activateHover = activateHover;
        vm.removeHover  = removeHover;
        vm.showLoader = triLoaderService.isActive();

        // we need to use the scope here because otherwise the expression in md-is-locked-open doesnt work
        $scope.layout = triLayout.layout; //eslint-disable-line


        ////////////////

        function activateHover() {
            if(triLayout.layout.sideMenuSize === 'icon') {
                $element.find('.triangular-sidenav-left').addClass('hover');
                $timeout(function(){
                    $window.dispatchEvent(new Event('resize'));
                }, 300);
            }
        }

        function injectFooterUpdateContent(viewName) {
            var contentView = $element.find('.triangular-content');
            if (viewName === '@triangular' && angular.isDefined(triLayout.layout.footerTemplateUrl)) {
                // add footer to the content view
                $templateRequest(triLayout.layout.footerTemplateUrl)
                .then(function(template) {
                    // compile template with current scope and add to the content
                    var linkFn = $compile(template);
                    var content = linkFn($scope);
                    $timeout(function() {
                        contentView.append(content);
                    });
                });
            }
        }

        function loaderEvent(event, isActive) {
            vm.showLoader = isActive;
        }

        function stateChangeStart() {
            // state has changed so start the loader
            triLoaderService.setLoaderActive(true);
        }

        function removeHover () {
            if(triLayout.layout.sideMenuSize === 'icon') {
                $element.find('.triangular-sidenav-left').removeClass('hover');
                $timeout(function(){
                    $window.dispatchEvent(new Event('resize'));
                }, 300);
            }
        }

        function viewContentLoading($event, viewName) {
            // a view is loading so add it to the queue
            // so we know when to turn off the loader
            loadingQueue.push(viewName);
        }

        function viewContentLoaded($event, viewName) {
            if(angular.isDefined(triLayout.layout.footer) && triLayout.layout.footer === true) {
                // inject footer into content
                injectFooterUpdateContent(viewName);
            }

            // view content has loaded so remove it from queue
            var index = loadingQueue.indexOf(viewName);
            if(-1 !== index) {
                loadingQueue.splice(index, 1);
            }
            // is the loadingQueue empty?
            if(loadingQueue.length === 0) {
                // nothing left to load so turn off the loader
                triLoaderService.setLoaderActive(false);
            }
        }

        // watches

        // register listeners for loader
        $scope.$on('loader', loaderEvent);

        // watch for ui router state change
        $scope.$on('$stateChangeStart', stateChangeStart);

        // watch for view content loading
        $scope.$on('$viewContentLoading', viewContentLoading);

        // watch for view content loaded
        $scope.$on('$viewContentLoaded', viewContentLoaded);
    }
})();

'use strict';

/**
 * @ngdoc function
 * @name AdminController
 * @module triAngular
 * @kind function
 *
 * @description
 *
 * Handles the admin view
 */
(function() {
    'use strict';

    DefaultLayoutController.$inject = ["$scope", "$element", "$timeout", "$window", "triLayout"];
    angular
        .module('triangular.layouts')
        .controller('DefaultLayoutController', DefaultLayoutController);

    /* @ngInject */
    function DefaultLayoutController($scope, $element, $timeout, $window, triLayout) {
        // we need to use the scope here because otherwise the expression in md-is-locked-open doesnt work
        $scope.layout = triLayout.layout; //eslint-disable-line
        var vm = this;

        vm.activateHover = activateHover;
        vm.removeHover  = removeHover;

        ////////////////

        function activateHover() {
            if(triLayout.layout.sideMenuSize === 'icon') {
                $element.find('.admin-sidebar-left').addClass('hover');
                $timeout(function(){
                    $window.dispatchEvent(new Event('resize'));
                },300);
            }
        }

        function removeHover () {
            if(triLayout.layout.sideMenuSize === 'icon') {
                $element.find('.admin-sidebar-left').removeClass('hover');
                $timeout(function(){
                    $window.dispatchEvent(new Event('resize'));
                },300);
            }
        }
    }
})();
(function() {
    'use strict';

    triDefaultContent.$inject = ["$rootScope", "$compile", "$templateRequest", "triLayout"];
    angular
        .module('triangular.layouts')
        .directive('triDefaultContent', triDefaultContent);

    /* @ngInject */
    function triDefaultContent ($rootScope, $compile, $templateRequest, triLayout) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            link: link,
            replace: true,
            restrict: 'A'
        };
        return directive;

        function link($scope, $element) {
            // scroll page to the top when content is loaded (stops pages keeping scroll position even when they have changed url)
            $scope.$on('$stateChangeStart', scrollToTop);

            // when content view has loaded add footer if needed and send mdContentLoaded event
            $scope.$on('$viewContentLoaded', injectFooterUpdateContent);

            ////////////////////////

            function scrollToTop() {
                $element.scrollTop(0);
            }

            function injectFooterUpdateContent() {
                var contentView = $element.find('#admin-panel-content-view');
                var footerElem = contentView.find('#footer');
                if (footerElem.length === 0) {
                    // add footer to the content view
                    $templateRequest(triLayout.layout.footerTemplateUrl)
                    .then(function(template) {
                        // compile template with current scope and add to the content
                        var linkFn = $compile(template);
                        var content = linkFn($scope);
                        contentView.append(content);
                    });

                }
            }
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('triangular.components', [
        ]);
})();
(function() {
    'use strict';

    WizardController.$inject = ["$scope", "$timeout"];
    angular
        .module('triangular.components')
        .directive('triWizard', TriWizard);

    /* @ngInject */
    function TriWizard() {
        // Usage: <div tri-wizard> (put some forms in here) </div>
        //
        // Creates: Nothing
        //
        var directive = {
            bindToController: true,
            controller: WizardController,
            controllerAs: 'triWizard',
            restrict: 'A'
        };
        return directive;
    }

    /* @ngInject */
    function WizardController($scope, $timeout) {
        var vm = this;

        var forms = [];
        var totalRequiredFields = 0;

        vm.currentStep = 0;
        vm.getForm = getForm;
        vm.isFormValid = isFormValid;
        vm.nextStep = nextStep;
        vm.nextStepDisabled = nextStepDisabled;
        vm.prevStep = prevStep;
        vm.prevStepDisabled = prevStepDisabled;
        vm.progress = 0;
        vm.registerForm = registerForm;
        vm.updateProgress = updateProgress;

        ////////////////

        function getForm(index) {
            return forms[index];
        }

        function nextStep() {
            vm.currentStep = vm.currentStep + 1;
        }

        function nextStepDisabled() {
            // get current active form
            var form = $scope.triWizard.getForm(vm.currentStep);
            var formInvalid = true;
            if(angular.isDefined(form) && angular.isDefined(form.$invalid)) {
                formInvalid = form.$invalid;
            }
            return formInvalid;
        }

        function isFormValid(step) {
            if(angular.isDefined(forms[step])) {
                return forms[step].$valid;
            }
        }

        function prevStep() {
            vm.currentStep = vm.currentStep - 1;
        }

        function prevStepDisabled() {
            return vm.currentStep === 0;
        }

        function registerForm(form) {
            forms.push(form);
        }

        function updateProgress() {
            var filledRequiredFields = calculateFilledFields();

            // calculate percentage process for completing the wizard
            vm.progress = Math.floor((filledRequiredFields / totalRequiredFields) * 100);
        }

        function calculateFilledFields() {
            var filledValidFields = 0;
            for (var form = forms.length - 1; form >= 0; form--) {
                angular.forEach(forms[form], function(field) {
                    if(angular.isObject(field) && field.hasOwnProperty('$modelValue') && field.$valid === true){
                        filledValidFields = filledValidFields + 1;
                    }
                });
            }
            return filledValidFields;
        }

        // init

        // wait until this tri wizard is ready (all forms registered)
        // then calculate the total form fields
        $timeout(function() {
            for (var form = forms.length - 1; form >= 0; form--) {
                angular.forEach(forms[form], function(field) {
                    if(angular.isObject(field) && field.hasOwnProperty('$modelValue')){
                        totalRequiredFields = totalRequiredFields + 1;
                    }
                });
            }
            updateProgress();
        });
    }
})();
(function() {
    'use strict';

    angular
        .module('triangular.components')
        .directive('triWizardForm', WizardFormProgress);

    /* @ngInject */
    function WizardFormProgress() {
        // Usage:
        //  <div tri-wizard>
        //      <form tri-wizard-form>
        //      </form>
        //  </div>
        //
        var directive = {
            require: ['form', '^triWizard'],
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs, require) {
            var ngFormCtrl = require[0];
            var triWizardCtrl = require[1];

            // register this form with the parent triWizard directive
            triWizardCtrl.registerForm(ngFormCtrl);

            // watch for form input changes and update the wizard progress
            element.on('input', function() {
                triWizardCtrl.updateProgress();
            });
        }
    }
})();
(function() {
    'use strict';

    widget.$inject = ["$mdTheming"];
    angular
        .module('triangular.components')
        .directive('triWidget', widget);

    /* @ngInject */
    function widget ($mdTheming) {
        // Usage:
        //
        // ```html
        // <widget title="'Nice Title'" subtitle="'Subtitle'" avatar="http://myavatar.jpg" title-position="top|bottom|left|right" content-padding overlay-title>content here</widget>
        // ```

        // Creates:
        //
        // Widget for use in dashboards
        var directive = {
            restrict: 'E',
            templateUrl: 'app/triangular/components/widget/widget.tmpl.html',
            transclude: true,
            replace: true,
            scope: {
                title: '@',
                subtitle: '@',
                avatar: '@'
            },
            bindToController: true,
            controller: Controller,
            controllerAs: 'vm',
            link: link
        };
        return directive;

        function link($scope, $element, attrs) {
            // set the value of the widget layout attribute
            $scope.vm.widgetLayout = attrs.titlePosition === 'left' || attrs.titlePosition === 'right' ? 'row' : 'column';
            // set the layout attribute for the widget content
            $scope.vm.contentLayout = angular.isUndefined(attrs.contentLayout) ? 'column' : attrs.contentLayout;
            // set if the layout-padding attribute will be added
            $scope.vm.contentPadding = angular.isDefined(attrs.contentPadding);
            // set the content align
            $scope.vm.contentLayoutAlign = angular.isUndefined(attrs.contentLayoutAlign) ? '' : attrs.contentLayoutAlign;
            // set the order of the title and content based on title position
            $scope.vm.titleOrder = attrs.titlePosition === 'right' || attrs.titlePosition === 'bottom' ? 2 : 1;
            $scope.vm.contentOrder = attrs.titlePosition === 'right' || attrs.titlePosition === 'bottom' ? 1 : 2;
            // set if we overlay the title on top of the widget content
            $scope.vm.overlayTitle = angular.isUndefined(attrs.overlayTitle) ? undefined : true;

            $mdTheming($element);

            if(angular.isDefined(attrs.class)) {
                $element.addClass(attrs.class);
            }

            if(angular.isDefined(attrs.backgroundImage)) {
                $element.css('background-image', 'url(' + attrs.backgroundImage + ')');
            }

            $scope.menuClick = function($event) {
                if(angular.isUndefined($scope.menu.menuClick)) {
                    $scope.menu.menuClick($event);
                }
            };

            // remove title attribute to stop popup on hover
            $element.attr('title', '');
        }
    }

    /* @ngInject */
    function Controller () {
        var vm = this;
        vm.menu = null;
        vm.loading = false;

        this.setMenu = function(menu) {
            vm.menu = menu;
        };

        this.setLoading = function(loading) {
            vm.loading = loading;
        };
    }
})();
(function() {
    'use strict';

    DefaultToolbarController.$inject = ["$scope", "$injector", "$rootScope", "$mdMedia", "$state", "$element", "$filter", "$mdUtil", "$mdSidenav", "$mdToast", "$timeout", "$document", "triBreadcrumbsService", "triSettings", "triLayout"];
    angular
        .module('triangular.components')
        .controller('DefaultToolbarController', DefaultToolbarController);

    /* @ngInject */
    function DefaultToolbarController($scope, $injector, $rootScope, $mdMedia, $state, $element, $filter, $mdUtil, $mdSidenav, $mdToast, $timeout, $document, triBreadcrumbsService, triSettings, triLayout) {
        var vm = this;
        vm.breadcrumbs = triBreadcrumbsService.breadcrumbs;
        vm.emailNew = false;
        vm.languages = triSettings.languages;
        vm.openSideNav = openSideNav;
        vm.hideMenuButton = hideMenuButton;
        vm.switchLanguage = switchLanguage;
        vm.toggleNotificationsTab = toggleNotificationsTab;
        vm.isFullScreen = false;
        vm.fullScreenIcon = 'zmdi zmdi-fullscreen';
        vm.toggleFullScreen = toggleFullScreen;

        // initToolbar();

        ////////////////

        function openSideNav(navID) {
            $mdUtil.debounce(function(){
                $mdSidenav(navID).toggle();
            }, 300)();
        }

        function switchLanguage(languageCode) {
            if($injector.has('$translate')) {
                var $translate = $injector.get('$translate');
                $translate.use(languageCode)
                .then(function() {
                    $mdToast.show(
                        $mdToast.simple()
                        .content($filter('triTranslate')('Language Changed'))
                        .position('bottom right')
                        .hideDelay(500)
                    );
                    $rootScope.$emit('changeTitle');
                });
            }
        }

        function hideMenuButton() {
            return triLayout.layout.sideMenuSize !== 'hidden' && $mdMedia('gt-sm');
        }

        function toggleNotificationsTab(tab) {
            $rootScope.$broadcast('triSwitchNotificationTab', tab);
            vm.openSideNav('notifications');
        }

        function toggleFullScreen() {
            vm.isFullScreen = !vm.isFullScreen;
            vm.fullScreenIcon = vm.isFullScreen ? 'zmdi zmdi-fullscreen-exit':'zmdi zmdi-fullscreen';
            // more info here: https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
            var doc = $document[0];
            if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement ) {
                if (doc.documentElement.requestFullscreen) {
                    doc.documentElement.requestFullscreen();
                } else if (doc.documentElement.msRequestFullscreen) {
                    doc.documentElement.msRequestFullscreen();
                } else if (doc.documentElement.mozRequestFullScreen) {
                    doc.documentElement.mozRequestFullScreen();
                } else if (doc.documentElement.webkitRequestFullscreen) {
                    doc.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (doc.exitFullscreen) {
                    doc.exitFullscreen();
                } else if (doc.msExitFullscreen) {
                    doc.msExitFullscreen();
                } else if (doc.mozCancelFullScreen) {
                    doc.mozCancelFullScreen();
                } else if (doc.webkitExitFullscreen) {
                    doc.webkitExitFullscreen();
                }
            }
        }

        $scope.$on('newMailNotification', function(){
            vm.emailNew = true;
        });
    }
})();

(function() {
    'use strict';

    triTable.$inject = ["$filter"];
    angular
        .module('triangular.components')
        .directive('triTable', triTable);

    /* @ngInject */
    function triTable($filter) {
        var directive = {
            restrict: 'E',
            scope: {
                columns: '=',
                contents: '=',
                filters: '='
            },
            link: link,
            templateUrl: 'app/triangular/components/table/table-directive.tmpl.html'
        };
        return directive;

        function link($scope, $element, attrs) {
            var sortableColumns = [];
            var activeSortColumn = null;
            var activeSortOrder = false;

            // init page size if not set to default
            $scope.pageSize = angular.isUndefined(attrs.pageSize) ? 0 : attrs.pageSize;

            // init page if not set to default
            $scope.page = angular.isUndefined(attrs.page) ? 0 : attrs.page;

            // make an array of all sortable columns
            angular.forEach($scope.columns, function(column) {
                if(column.sortable) {
                    sortableColumns.push(column.field);
                }
            });

            $scope.refresh = function(resetPage) {
                if(resetPage === true) {
                    $scope.page = 0;
                }
                $scope.contents = $filter('orderBy')($scope.contents, activeSortColumn, activeSortOrder);
            };

            // if we have sortable columns sort by first by default
            if(sortableColumns.length > 0) {
                // sort first column by default
                activeSortOrder = false;
                activeSortColumn = sortableColumns[0];
                $scope.refresh();
            }

            $scope.sortClick = function(field) {
                if(sortableColumns.indexOf(field) !== -1) {
                    if(field === activeSortColumn) {
                        activeSortOrder = !activeSortOrder;
                    }
                    activeSortColumn = field;
                    $scope.refresh();
                }
            };

            $scope.showSortOrder = function(field, orderDown) {
                return field === activeSortColumn && activeSortOrder === orderDown;
            };

            $scope.headerClass = function(field) {
                var classes = [];
                if(sortableColumns.indexOf(field) !== -1) {
                    classes.push('sortable');
                }
                if(field === activeSortColumn) {
                    classes.push('sorted');
                }
                return classes;
            };

            $scope.cellContents = function(column, content) {
                if(angular.isDefined(column.filter)) {
                    return $filter(column.filter)(content[column.field]);
                }
                else {
                    return content[column.field];
                }
            };

            $scope.totalItems = function() {
                return $scope.contents.length;
            };

            $scope.numberOfPages = function() {
                return Math.ceil($scope.contents.length / $scope.pageSize);
            };

            $scope.pageStart = function() {
                return ($scope.page * $scope.pageSize) + 1;
            };

            $scope.pageEnd = function() {
                var end = (($scope.page + 1) * $scope.pageSize);
                if(end > $scope.contents.length) {
                    end = $scope.contents.length;
                }
                return end;
            };

            $scope.goToPage = function (page) {
                $scope.page = page;
            };
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('triangular.components')
        .filter('startFrom', startFrom);

    function startFrom() {
        return filterFilter;

        ////////////////

        function filterFilter(input, start) {
            if (input && input.length > 0) {
                start = +start;
                return input.slice(start);
            }
        }
    }

})();

(function() {
    'use strict';

    tableImage.$inject = ["$sce"];
    angular
        .module('triangular.components')
        .filter('tableImage', tableImage);

    function tableImage($sce) {
        return filterFilter;

        ////////////////

        function filterFilter(value) {
            return $sce.trustAsHtml('<div style=\"background-image: url(\'' + value + '\')\"/>');
        }
    }

})();
(function() {
    'use strict';

    NotificationsPanelController.$inject = ["$scope", "$http", "$mdSidenav", "$state"];
    angular
        .module('triangular.components')
        .controller('NotificationsPanelController', NotificationsPanelController);

    /* @ngInject */
    function NotificationsPanelController($scope, $http, $mdSidenav, $state) {
        var vm = this;
        // sets the current active tab
        vm.close = close;
        vm.currentTab = 0;
        vm.notificationGroups = [{
            name: 'Twitter',
            notifications: [{
                title: 'Mention from oxygenna',
                icon: 'fa fa-twitter',
                iconColor: '#55acee',
                date: moment().startOf('hour')
            },{
                title: 'Oxygenna',
                icon: 'fa fa-twitter',
                iconColor: '#55acee',
                date: moment().startOf('hour')
            },{
                title: 'Oxygenna',
                icon: 'fa fa-twitter',
                iconColor: '#55acee',
                date: moment().startOf('hour')
            },{
                title: 'Followed by Oxygenna',
                icon: 'fa fa-twitter',
                iconColor: '#55acee',
                date: moment().startOf('hour')
            }]
        },{
            name: 'Server',
            notifications: [{
                title: 'Server Down',
                icon: 'zmdi zmdi-alert-circle',
                iconColor: 'rgb(244, 67, 54)',
                date: moment().startOf('hour')
            },{
                title: 'Slow Response Time',
                icon: 'zmdi zmdi-alert-triangle',
                iconColor: 'rgb(255, 152, 0)',
                date: moment().startOf('hour')
            },{
                title: 'Server Down',
                icon: 'zmdi zmdi-alert-circle',
                iconColor: 'rgb(244, 67, 54)',
                date: moment().startOf('hour')
            }]
        },{
            name: 'Sales',
            notifications: [{
                title: 'Triangular Admin $21',
                icon: 'zmdi zmdi-shopping-cart',
                iconColor: 'rgb(76, 175, 80)',
                date: moment().startOf('hour')
            },{
                title: 'Lambda WordPress $60',
                icon: 'zmdi zmdi-shopping-cart',
                iconColor: 'rgb(76, 175, 80)',
                date: moment().startOf('hour')
            },{
                title: 'Triangular Admin $21',
                icon: 'zmdi zmdi-shopping-cart',
                iconColor: 'rgb(76, 175, 80)',
                date: moment().startOf('hour')
            },{
                title: 'Triangular Admin $21',
                icon: 'zmdi zmdi-shopping-cart',
                iconColor: 'rgb(76, 175, 80)',
                date: moment().startOf('hour')
            },{
                title: 'Lambda WordPress $60',
                icon: 'zmdi zmdi-shopping-cart',
                iconColor: 'rgb(76, 175, 80)',
                date: moment().startOf('hour')
            },{
                title: 'Triangular Admin $21',
                icon: 'zmdi zmdi-shopping-cart',
                iconColor: 'rgb(76, 175, 80)',
                date: moment().startOf('hour')
            }]
        }];

        vm.settingsGroups = [{
            name: 'Account Settings',
            settings: [{
                title: 'Show my location',
                icon: 'zmdi zmdi-pin',
                enabled: true
            },{
                title: 'Show my avatar',
                icon: 'zmdi zmdi-face',
                enabled: false
            },{
                title: 'Send me notifications',
                icon: 'zmdi zmdi-notifications-active',
                enabled: true
            }]
        },{
            name: 'Chat Settings',
            settings: [{
                title: 'Show my username',
                icon: 'zmdi zmdi-account',
                enabled: true
            },{
                title: 'Make my profile public',
                icon: 'zmdi zmdi-account-box',
                enabled: false
            },{
                title: 'Allow cloud backups',
                icon: 'zmdi zmdi-cloud-upload',
                enabled: true
            }]
        }];

        vm.statisticsGroups = [{
            name: 'User Statistics',
            stats: [{
                title: 'Storage Space (120/160 Gb)',
                mdClass: 'md-primary',
                value: 60
            },{
                title: 'Bandwidth Usage (10/100 Gb)',
                mdClass: 'md-accent',
                value: 10
            },{
                title: 'Memory Usage (1/8 Gb)',
                mdClass: 'md-warn',
                value: 100
            }]
        },{
            name: 'Server Statistics',
            stats: [{
                title: 'Storage Space (120/160 Gb)',
                mdClass: 'md-primary',
                value: 60
            },{
                title: 'Bandwidth Usage (10/100 Gb)',
                mdClass: 'md-accent',
                value: 10
            },{
                title: 'Memory Usage (1/8 Gb)',
                mdClass: 'md-warn',
                value: 100
            }]
        }];

        ////////////////

        // add an event to switch tabs (used when user clicks a menu item before sidebar opens)
        $scope.$on('triSwitchNotificationTab', function($event, tab) {
            vm.currentTab = tab;
        });
 
        function close() {
            $mdSidenav('notifications').close();
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('triangular.components')
        .provider('triMenu', menuProvider);


    /* @ngInject */
    function menuProvider() {
        // Provider
        var menuArray = [];

        this.addMenu = addMenu;
        this.removeMenu = removeMenu;
        this.removeAllMenu = removeAllMenu;

        function addMenu(item) {
            menuArray.push(item);
        }

        function getMenu(id) {
            return findMenu(menuArray, id);
        }

        function removeMenu(state, params) {
            findAndDestroyMenu(menuArray, state, params);
        }

        function removeAllMenu() {
            for (var i = menuArray.length - 1; i >= 0 ; i--) {
                menuArray.splice(i, 1);
            }
        }

        function findMenu(menu, id) {
            var found;
            if (menu instanceof Array) {
                for (var i = 0; i < menu.length; i++) {
                    if(menu[i].id === id) {
                        found = menu[i];
                        break;
                    }
                    else if(angular.isDefined(menu[i].children)) {
                        found = findMenu(menu[i].children, id);
                        if(angular.isDefined(found)) {
                            break;
                        }
                    }
                }
            }
            return found;
        }

        function findAndDestroyMenu(menu, state, params, isChildren) {
            if (menu instanceof Array) {
                for (var i = menu.length - 1; i >= 0 ; i--) {
                    if(menu[i].state === state && angular.equals(menu[i].params, params)) {
                        menu.splice(i, 1);
                        if (!isNaN(isChildren) && !menuArray[isChildren].children.length) {
                            menuArray.splice(isChildren, 1);
                        }
                        break;
                    }
                    else if(angular.isDefined(menu[i].children)) {
                        findAndDestroyMenu(menu[i].children, state, params, i);
                    }
                }
            }
        }

        // Service
        this.$get = function() {
            return {
                menu: menuArray,
                addMenu: addMenu,
                getMenu: getMenu,
                removeMenu: removeMenu,
                removeAllMenu: removeAllMenu
            };
        };
    }
})();


(function() {
    'use strict';

    triMenuDirective.$inject = ["$location", "$mdTheming", "triTheming"];
    triMenuController.$inject = ["triMenu"];
    angular
        .module('triangular.components')
        .directive('triMenu', triMenuDirective);

    /* @ngInject */
    function triMenuDirective($location, $mdTheming, triTheming) {
        var directive = {
            restrict: 'E',
            template: '<md-content><tri-menu-item permission permission-only="item.permission" ng-repeat="item in triMenuController.menu | orderBy:\'priority\'" item="::item"></tri-menu-item></md-content>',
            scope: {},
            controller: triMenuController,
            controllerAs: 'triMenuController',
            link: link
        };
        return directive;

        function link($scope, $element) {
            $mdTheming($element);
            var $mdTheme = $element.controller('mdTheme'); //eslint-disable-line

            var menuColor = triTheming.getThemeHue($mdTheme.$mdTheme, 'primary', 'default');
            var menuColorRGBA = triTheming.rgba(menuColor.value);
            $element.css({ 'background-color': menuColorRGBA });
            $element.children('md-content').css({ 'background-color': menuColorRGBA });
        }
    }

    /* @ngInject */
    function triMenuController(triMenu) {
        var triMenuController = this;
        // get the menu and order it
        triMenuController.menu = triMenu.menu;
    }
})();

(function() {
    'use strict';

    triMenuItemController.$inject = ["$scope", "$injector", "$mdSidenav", "$state", "$filter", "$window", "triBreadcrumbsService"];
    angular
        .module('triangular.components')
        .directive('triMenuItem', triMenuItemDirective);

    /* @ngInject */
    function triMenuItemDirective() {
        var directive = {
            restrict: 'E',
            require: '^triMenu',
            scope: {
                item: '='
            },
            // replace: true,
            template: '<div ng-include="::triMenuItem.item.template"></div>',
            controller: triMenuItemController,
            controllerAs: 'triMenuItem',
            bindToController: true
        };
        return directive;
    }

    /* @ngInject */
    function triMenuItemController($scope, $injector, $mdSidenav, $state, $filter, $window, triBreadcrumbsService) {
        var triMenuItem = this;
        // load a template for this directive based on the type ( link | dropdown )
        triMenuItem.item.template = 'app/triangular/components/menu/menu-item-' + triMenuItem.item.type + '.tmpl.html';

        switch(triMenuItem.item.type) {
            case 'dropdown':
                // if we have kids reorder them by priority
                triMenuItem.item.children = $filter('orderBy')(triMenuItem.item.children, 'priority');
                triMenuItem.toggleDropdownMenu = toggleDropdownMenu;
                // add a check for open event
                $scope.$on('toggleDropdownMenu', function(event, item, open) {
                    // if this is the item we are looking for
                    if(triMenuItem.item === item) {
                        triMenuItem.item.open = open;
                    }
                    else {
                        triMenuItem.item.open = false;
                    }
                });
                // this event is emitted up the tree to open parent menus
                $scope.$on('openParents', function() {
                    // openParents event so open the parent item
                    triMenuItem.item.open = true;
                    // also add this to the breadcrumbs
                    triBreadcrumbsService.addCrumb(triMenuItem.item);
                });
                break;
            case 'link':
                triMenuItem.openLink = openLink;

                // on init check if this is current menu
                checkItemActive($state.current.name, $state.params);

                $scope.$on('$stateChangeSuccess', function(event, toState, toParams) {
                    checkItemActive(toState.name, toParams);
                });
                break;
        }

        function checkItemActive() {
            // first check if the state is the same
            triMenuItem.item.active = $state.includes(triMenuItem.item.state, triMenuItem.item.params);
            // if we are now the active item reset the breadcrumbs and open all parent dropdown items
            if(triMenuItem.item.active) {
                triBreadcrumbsService.reset();
                triBreadcrumbsService.addCrumb(triMenuItem.item);
                $scope.$emit('openParents');
            }
        }

        function toggleDropdownMenu() {
            $scope.$parent.$parent.$broadcast('toggleDropdownMenu', triMenuItem.item, !triMenuItem.item.open);
        }

        function openLink() {
            if(angular.isDefined(triMenuItem.item.click)) {
                $injector.invoke(triMenuItem.item.click);
            }
            else {
                var params = angular.isUndefined(triMenuItem.item.params) ? {} : triMenuItem.item.params;
                if(angular.isDefined(triMenuItem.item.openInNewTab) && triMenuItem.item.openInNewTab === true) {
                    var url = $state.href(triMenuItem.item.state, params);
                    $window.open(url, '_blank');
                }
                else {
                    $state.go(triMenuItem.item.state, params);
                }
            }
            triMenuItem.item.active = true;
            $mdSidenav('left').close();
        }
    }
})();

(function() {
    'use strict';

    TriLoaderController.$inject = ["$rootScope", "triLoaderService", "triSettings"];
    angular
        .module('triangular.components')
        .directive('triLoader', TriLoader);

    /* @ngInject */
    function TriLoader () {
        var directive = {
            bindToController: true,
            controller: TriLoaderController,
            controllerAs: 'vm',
            template: '<div flex class="loader padding-100" ng-show="vm.isActive()" layout="column" layout-fill layout-align="center center"><h3 class="md-headline">{{vm.triSettings.name}}</h3><md-progress-linear md-mode="indeterminate"></md-progress-linear></div>',
            restrict: 'E',
            replace: true,
            scope: {
            }
        };
        return directive;
    }

    /* @ngInject */
    function TriLoaderController ($rootScope, triLoaderService, triSettings) {
        var vm = this;
        vm.triSettings = triSettings;
        vm.isActive    = triLoaderService.isActive;
    }
})();

(function() {
    'use strict';

    LoaderService.$inject = ["$rootScope"];
    angular
        .module('triangular.components')
        .factory('triLoaderService', LoaderService);

    /* @ngInject */
    function LoaderService($rootScope) {
        var active = false;

        return {
            isActive: isActive,
            setLoaderActive: setLoaderActive
        };

        ////////////////

        function isActive() {
            return active;
        }

        function setLoaderActive(setActive) {
            active = setActive;
            $rootScope.$broadcast('loader', active);
        }
    }
})();

(function() {
    'use strict';

    FooterController.$inject = ["triSettings", "triLayout"];
    angular
        .module('triangular.components')
        .controller('FooterController', FooterController);

    /* @ngInject */
    function FooterController(triSettings, triLayout) {
        var vm = this;
        vm.name = triSettings.name;
        vm.copyright = triSettings.copyright;
        vm.layout = triLayout.layout;
        vm.version = triSettings.version;
    }
})();
(function() {
    'use strict';

    BreadcrumbsService.$inject = ["$rootScope"];
    angular
        .module('triangular.components')
        .factory('triBreadcrumbsService', BreadcrumbsService);

    /* @ngInject */
    function BreadcrumbsService($rootScope) {
        var crumbs = [];

        return {
            breadcrumbs: {
                crumbs: crumbs
            },
            addCrumb: addCrumb,
            reset: reset
        };

        ////////////////

        function addCrumb(item) {
            this.breadcrumbs.crumbs.unshift(item);
            $rootScope.$emit('changeTitle');
        }

        function reset() {
            this.breadcrumbs.crumbs = [];
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('app.products', ['xeditable'
        ])
        // x EDITABLE run function
		.run(['editableOptions', function(editableOptions) {
  				editableOptions.theme = 'hager-pink'; // bootstrap3 theme. Can be also 'bs2', 'default'
		}]);
         
})();
(function() {
    'use strict';

     productsDashboardController.$inject = ["$mdDialog", "$document", "$interval", "$scope", "$state", "$filter", "$stateParams", "$rootScope", "$log", "ProductsManagementService", "PCAManagementService", "UserService", "DocsService", "documentsAPIService", "$timeout", "NotificationService"];
    angular
        .module('app.products')
        .controller('productsDashboardController', productsDashboardController);

    /* @ngInject */ 
    function productsDashboardController($mdDialog, $document , $interval , $scope , $state , $filter , $stateParams ,$rootScope , $log,ProductsManagementService , PCAManagementService, UserService, DocsService , documentsAPIService, $timeout, NotificationService ) {
        var vm = this;

        // Env Vars
        vm.product = null;
        vm.productRef = {};
        vm.CategoryView = {};
        // Loading status 
        vm.status = 'idle';  // idle | uploading | complete
        vm.reports = [];

        // Charts
        vm.series = [];
        //vm.labels = ['P','F','A'];
        vm.labels = [];
        vm.data = {};
        vm.options = {
            datasetFill: false,
            legend: {
                position: 'right'
            }
        };
 
        var AcceptedFileTypes = ["application/pdf"];
        // Public functions
        vm.getStandardColor = getStandardColor;
        vm.backtoproducts = backtoproducts;
        vm.saveproduct = saveproduct;
        vm.getStdProgress = getStdProgress;
        vm.getCategoryProgress = getCategoryProgress;
        vm.GenerateTF = GenerateTF;
        vm.getreport = getreport;
        vm.Gologin = Gologin;
        vm.deleteReport = deleteReport;
        vm.AddReportToDes= AddReportToDes;

        /////////

        // init 
        init(); 
 
        function init()
        {
            var promise1 = new Promise(function(resolve, reject) {
                NotificationService.popAToast('Project Dashboard.', 5000, 'info');
                resolve($timeout( function(){ vm.status = 'loading' ;}  , 100));
            });

            promise1.then(function(value) {
                        if($stateParams.product == null)
                        {
                            $state.go('triangular.products-manage');
                        }
                        else
                        {
                            vm.product = angular.copy($stateParams.product);
                            vm.productRef = angular.copy($stateParams.product);
                            vm.CategoryView = buildCategoryView();

                            DocsService.ReportsStatus(vm.reports)
                                       .then(function(Reports){
                                            UpdateProductsStatus(Reports);
                                       })
                                       .catch(function(error){

                                       })

                            buildStats();
                            vm.status = 'idle';
                            $scope.$apply();
                        }        
            });
        }

        function UpdateProductsStatus(statusList)
        {
            var Standards = Object.keys(vm.product.ProductJSON.Standards);
            var reports = [];
            for(var i = 0; i < Standards.length ; i++)
            {
                for(var j = 0; j < vm.product.ProductJSON.Standards[Standards[i]].Designations.length ; j++)
                {
                    for(var k = 0 ; k < vm.product.ProductJSON.Standards[Standards[i]].Designations[j].Reports.length ; k++)
                    {
                        if(statusList.length == 0)
                        {
                            vm.product.ProductJSON.Standards[Standards[i]].Designations[j].Reports[k]._id = '41224d776a326fb40f000001';
                        }
                        else
                        {
                            for(var h = 0; h < statusList.length ; h++)
                            {
                                if(statusList[h]._id == vm.product.ProductJSON.Standards[Standards[i]].Designations[j].Reports[k]._id)
                                {
                                    vm.product.ProductJSON.Standards[Standards[i]].Designations[j].Reports[k].name = statusList[h].name;
                                    vm.product.ProductJSON.Standards[Standards[i]].Designations[j].Reports[k].Author = statusList[h].Author;
                                    break;
                                }
                                else if(statusList[h]._id != vm.product.ProductJSON.Standards[Standards[i]].Designations[j].Reports[k]._id && h == statusList.length -1)
                                {
                                    vm.product.ProductJSON.Standards[Standards[i]].Designations[j].Reports[k]._id = '41224d776a326fb40f000001';
                                }
                            }                
                        }
                    }
                }
            }
        }

       /* function buildStats()
        {
            initVars();

            for(var i=0; i < vm.series.length ; i++)
            {
                var count = getCategoryProgress(vm.series[i]);
                vm.data[vm.series[i]].push(
                    $filter('number')(count.perP, 2), 
                    $filter('number')(count.perF, 2),
                    $filter('number')(count.perA, 2)
                    );
            }
        } */

        function buildStats()
        {
            initVars();
            var P = 0;
            var F = 0;
            var A = 0;
            var NA= 0;
            vm.labels = [];
            for(var i=0; i < vm.series.length ; i++)
            {
                var count = getCategoryProgress(vm.series[i]);
                P = P + count.P;
                A = A + count.A;
                F = F + count.F;
                NA = NA + count.NA;
            }
            vm.data['ALL Categories'].push(  NA ,F , A, P); 
            vm.labels.push('NA: '+NA,'F: '+ F, 'A: ' + A, 'P: '+ P);
        }

        function getStdProgress(std)
        {
            var count = {
                P: 0,
                A: 0,
                F: 0,
                NA:0,
                '':0,
                perP: 0,
                perC: 0
            };

            var s= vm.product.ProductJSON.Standards[std].Designations.length;
            var len = 0;
            for(var i =0 ; i < s; i++ )
            {
                if(vm.product.ProductJSON.Standards[std].Designations[i].Category !='Titre')
                {
                    count[vm.product.ProductJSON.Standards[std].Designations[i].Status]++;
                    len++;
                } 
            }
            if(len !=  count.NA )
                {
                    count.perP =  count.P / (len - count.NA - count[''] ) * 100;
                    count.perC =  (count.P + count.F + count.NA) * 100 / len;
                }
            return count;
        }

        function getCategoryProgress(CategoryName)
        {
            var Category = vm.CategoryView[CategoryName];
            var SubCat = Object.keys(Category);
            var len = 0;
            var count = {
                P: 0,
                A: 0,
                F: 0,
                NA:0,
                '':0,
                perP: 0,
                perA: 0,
                perF: 0,
                perC: 0
            };

            for(var i = 0; i< SubCat.length ; i++)
            {
                for(var j = 0 ; j < Category[SubCat[i]].length ; j++)
                {
                    if(Category[SubCat[i]][j].Category !='Titre')
                    {
                        count[Category[SubCat[i]][j].Status] = count[Category[SubCat[i]][j].Status] + 1;
                        len++;
                    } 
                }
            }

            if(len != count.NA)
                {
                    count.perP =  count.P / (len - count.NA - count[''] ) * 100;
                    count.perF =  count.F / (len - count.NA - count[''] ) * 100;
                    count.perA =  count.A / (len - count.NA - count[''] ) * 100;
                    count.perC =  (count.P + count.F + count.NA) * 100 / len;
                }

            if(len == 0 )
            {
                count.perC = 100;
            }
            return count;
        }

        function buildCategoryView()
        {
            var Standards = Object.keys(vm.product.ProductJSON.Standards);
            var reports = [];
            for(var i = 0; i < Standards.length ; i++)
            {
                for(var j = 0; j < vm.product.ProductJSON.Standards[Standards[i]].Designations.length ; j++)
                {
                    var Point = vm.product.ProductJSON.Standards[Standards[i]].Designations[j];
                    vm.product.ProductJSON.Standards[Standards[i]].Designations[j] = Point;

                    // find reports 
                    if(Array.isArray(Point.Reports))
                    {
                        Array.prototype.push.apply(reports ,Point.Reports);
                    }

                    // Point having category 
                    if(Point.Category != '')
                    {
                        // is the Object having this Category as key ?
                        if( vm.CategoryView.hasOwnProperty(Point.Category) )
                        {
                            // yes => is this category value is a map having a key named DesignationTitle ?
                            if( vm.CategoryView[Point.Category].hasOwnProperty(Point.SubCategory) )
                            {
                                // yes => push the point to this map
                                vm.CategoryView[Point.Category][Point.SubCategory].push(Point);
                            }
                            else
                            {
                                // No : create a new map having this DesignationTitle as a key and the array of points as value 
                                vm.CategoryView[Point.Category][Point.SubCategory] = [Point] ;
                            }
                        }
                        else 
                        {
                            // No => Create a new key in CategoryView equal to the category, and add to this key a new map of Titles
                            vm.CategoryView[Point.Category] = {} ;
                            vm.CategoryView[Point.Category][Point.SubCategory] = [Point] ;
                        }
                    }
                    else
                    {
                      // No => Add a new key equal to Standard and add a new map to the value of this key
                      if(vm.CategoryView.hasOwnProperty(Standards[i]))
                      {
                          vm.CategoryView[Standards[i]][Point.DesignationTitle] = [Point] ; 
                      }
                      else
                      {
                          vm.CategoryView[Standards[i]] = {};
                          vm.CategoryView[Standards[i]][Point.DesignationTitle] = [Point] ;                         
                      }
                    }    
                }
            }
             vm.reports = unique(reports);
             return vm.CategoryView;
        }

       /* function initVars()
        {
            vm.series = Object.keys(vm.CategoryView);
            for(var i = 0 ; i < vm.series.length ; i++)
            {
                vm.data[vm.series[i]] = [];
            }
        } */

         function initVars()
        {
            vm.series = Object.keys(vm.CategoryView);
            vm.data['ALL Categories'] = [];
        }

        function getStandardColor(standard)
        {
            if(standard.Updates != undefined)
            {
                if(standard.Updates.length == 0)
                {
                    return 'light-green:400';
                }
                else if(standard.Updates.length < 10)
                {
                    return 'deep-orange:'+ standard.Updates.length + '00';
                }
                else 
                {
                    return 'deep-orange:900';
                }
            }
            else
            {
                return 'grey:300'; 
            }
        }

        function backtoproducts()
        {
            if( !angular.equals(vm.productRef, vm.product) && UserService.getCurrentUser().roles[0] != 'ANONYMOUS')
            {
                //NotificationService.popAToastPosition('Project change detected ! Do you you want to save the workspace before leaving ?', 15000 , 'warning', 'bottom right')
                askdialog('Project change detected ! ', 'Do you you want to save the workspace before leaving ?')
                                   .then(function(response){
                                              if(response == true)
                                              {
                                                  saveproduct().then(function(storeStatus){
                                                        $state.go('triangular.products-manage');
                                                  }).catch(function(error){
                                                        // not stored : stay in the page.
                                                  })
                                              }                                       
                                   })
                                   .catch(function(error){
                                           // quit without saving
                                          vm.status = 'idle';
                                          $state.go('triangular.products-manage');     
                                   })
            }
            else{
                $state.go('triangular.products-manage');
            }
            
        }

        function saveproduct()
        {
           vm.status = 'loading';
           vm.productRef = angular.copy(vm.product);
           return Promise.resolve( ProductsManagementService.Updateproduct(vm.product)
                                     .then(function(product){
                                           NotificationService.RightSidebarNotif( 'Products', 'Update' , product.ProductInfo.References , UserService.getCurrentUser().username);
                                           NotificationService.popAToast('Product Saved successfully', 5000, 'success');
                                           vm.status = 'idle';
                                           return Promise.resolve(true);
                                     }).catch(function(err){
                                           //NotificationService.RightSidebarNotif( 'Errors', 'SAVING' , NewProduct.ProductInfo.References );
                                           NotificationService.popAToast('Product saving Error', 5000, 'error');
                                           vm.status = 'idle';
                                           return Promise.reject(false);
                                     })
                                  );              
        }

        $scope.AddReports = function (e , designation) 
        {
            var j = 0;
            var Info ={
                Author: '',
                Category: designation.Category,
                SubCategory: designation.SubCategory
            };

            for(var i = 0 ; i < e.files.length ; i++)
            {
                var file = e.files[i];
                if( true)
                {
                    var reader = new FileReader();
                    reader.readAsBinaryString(file);

                    reader.onerror = function (){
                        reader.abort();
                        new DOMException('Problem parsing input file.');
                        j++;
                    };

                    reader.onload = function () {     
                        Inputdialog('Report Author ?', '').then(function(Author){
                                          Info.Author = Author;
                                          StoreReport(designation, e.files[j].name, Info , reader.result); 
                                          j++; 
                                    })
                                    .catch(function(error){
                                        NotificationService.popAToast('Report not added.', 5000, 'warning');
                                    })
                    };
                }
                else 
                {
                         NotificationService.popAToast('Error: not a pdf File.', 5000, 'error');
                }
            
                $scope.$apply();
            }
        };

        function StoreReport(designation, filename, Info, content)
        {
            vm.status = 'loading';
            if( !Array.isArray(designation.Reports) )
            {
                designation.Reports = [];
            }   
                
            DocsService.storedocument(content, filename, Info)
                       .then(function(report){
                                AddReportToDes({name : report.name , Author: Info.Author , _id : report._id}, designation)
                                UniquePush({name : report.name , Author: Info.Author , _id : report._id});
                                saveproduct();
                                vm.status = 'idle';
                        }).catch(function(error){
                                NotificationService.popAToast('Error: Report not added to the Database ! (check size: less than 12 mb)', 10000, 'error');
                                vm.status = 'idle';
                        })
        }

        function getreport(id, designation) {
            documentsAPIService.getDocumentbyId(id)
                               .then(function(report){

                                    saveAs(new Blob([DocsService.s2ab(report.document)],{type:""}), report.name);
                                    // doc...
                               }).catch(function(error){
                                      askdialog('File Not found !', ' Do you want to delete the report from the project ?')
                                                        .then(function(response){
                                                                 deleteReport(id, designation);
                                                        })
                                                        .catch(function(error){

                                                        })
                               })
        }

        function deleteReport(id, designation){

            askdialog('Confirm Report delete', ' Do you want to delete the report from the test ?')
                        .then(function(response){
                        for(var i = 0 ; i < designation.Reports.length ; i++)
                        {
                            if(designation.Reports[i]._id == id)
                            {
                                designation.Reports.splice(i, 1);
                                NotificationService.popAToast('Report deleted successfully', 5000, 'success');
                                //saveproduct();
                            }
                        }
            })
            .catch(function(error){
                         NotificationService.popAToast('Report not deleted.', 5000, 'warning');
            })
        }
        
        function AddReportToDes(report, designation)
        {
            if( !Array.isArray(designation.Reports) )
            {
               designation.Reports = [];     
            }
            if( !Array.isArray(designation.Reports) )
            {
               designation.Reports = [];     
            }
            if( designation.Reports.length == 0 )
            {
                designation.Reports.push(report);
                NotificationService.popAToast('Report Added successfully', 5000, 'success');
                return true;
            }  

            for(var i = 0 ; i < designation.Reports.length ; i++)
            {
                if(designation.Reports[i].name == report.name)
                {
                    NotificationService.popAToast('Report not added: it already exists in the this test.', 5000, 'warning');
                    break;
                }
                else if(designation.Reports[i].name != report.name && i == designation.Reports.length -1)
                {
                    designation.Reports.push(report);
                    NotificationService.popAToast('Report Added successfully', 5000, 'success');
                }
            }
        }

        // Generate Technichal Folder
        function GenerateTF()
        {
            Inputdialog('MD number ?', '').then(function(MdNumber){
                var res = PCAManagementService.JsontoPCA(vm.product, MdNumber , 'QS');
                var QS = res[0];
                var FileStatus = res[1];
                if(FileStatus == 'Incomplete')
                {
                    askdialog( 'INCOMPLETE TESTS ', 'Do you want to generate Folder ?')
                        .then(function(response){
                            if(response == true)
                            {
                                DocsService.GenerateTF(QS , MdNumber , vm.product.ProductInfo.Brand, vm.reports);
                            }
                        })
                        .catch(function(error){
                            NotificationService.popAToast('Ok!', 5000, 'warning');
                        })
                }  
                else
                 DocsService.GenerateTF(QS , MdNumber , vm.product.ProductInfo.Brand, vm.reports);
            })
            .catch(function(error){
                NotificationService.popAToast('No md Number !', 5000, 'warning');
            })
        }

        function Gologin(){
            $state.go('Authentication.login');
        }

        function keepAlive(){
            
            if($state.current.name == 'triangular.products-dashboard')
            {
                    if(UserService.getCurrentUser().roles[0] != 'ANONYMOUS' && vm.product != null)
                    {
                        ProductsManagementService.keepAlive(vm.product._id)
                                                 .then(function(success){
                                                    // kept alive.
                                                 })
                                                 .catch(function(err)
                                                 {
                                                    // can't keep alive.
                                                 })
                    }                  
            }
        }

            // Local Functions 

        // Product change watcher.
        $scope.$watch('vm.product', function (newVal, oldVal) {
            if(vm.product)
            {
                    if(vm.product.ProductJSON)
                    {
                        buildStats();
                        vm.product = ProductsManagementService.ProductStatus(vm.product);
                    }                
            }
        }, true);

        $scope.$on('saveprojectandquit', function() {
             saveproduct().then(function(storeStatus){
                        $state.go('triangular.products-manage');
             }).catch(function(error){
                // not stored : stay in the page.
             })
        });

        // send a tick to the server each 1 minute, to notify that the user is working on the project.
        setInterval(function(){
           keepAlive();
        }, 120000)

        function unique(a) {
            if(a[0])
                var unique = [a[0]];
            else
                var unique = [];
            for(var i=0 ; i < a.length ; i++)
            {
                for(var j = 0 ; j < unique.length ; j++)
                {
                    if( a[i].name == unique[j].name )
                    {
                        break;
                    }
                    if( a[i].name != unique[j].name && j == unique.length -1)
                    {
                        unique.push(a[i]);
                        break;
                    }  
                }
            }
            return unique;
        }

        function UniquePush(report){

            if(  vm.reports.indexOf(report) == -1)
            {
                vm.reports.push(report);
            }
        }

        function askdialog(message, content) {
            return $mdDialog.show(
                $mdDialog.confirm()
                .title(message)
                .textContent(content)
                .cancel('NO')
                .ok('YES')
            ).then(function(choice){
                return choice;
            })
        }

        function Inputdialog(message, content) {
            return $mdDialog.show(
                $mdDialog.prompt()
                .title(message)
                .textContent(content)
                .cancel('NO')
                .ok('YES')
            ).then(function(choice){
                return choice;
            })
        }
        
     }
})();


(function() {
    'use strict';

    AddProductController.$inject = ["$http", "$mdDialog", "ProductsAPIService", "$scope", "ProductsManagementService", "NotificationService", "StandardsAPIService", "DirectivesAPIService", "StandardsManagementService", "$log", "UserService", "triLoaderService", "triMenu"];
    angular
        .module('app.products')
        .controller('AddProductController', AddProductController);

    /* @ngInject */
    function AddProductController($http, $mdDialog, ProductsAPIService, $scope, ProductsManagementService, NotificationService , StandardsAPIService, DirectivesAPIService , StandardsManagementService, $log , UserService, triLoaderService, triMenu) {
        var vm = this;

        vm.product = '';
        vm.standards= [];

        vm.selectStandard = selectStandard;
        vm.addNewProduct = addNewProduct;

        vm.Product = {
            ProductInfo: {
                Brand : '',
                TechnicalFolder: '',
                References: '',
                ImageBuffer: '',
                RiskAnalysis: '',
                Designation: '',
                hasAnUpdate: '0',
                Links: '',
                CreatedBy:UserService.getCurrentUser().displayName,
                Version: 0,
                Id_UpdateOf: 0
            },
            ProductJSON: {
                Standards:{

                }
            }
        }

        vm.formestatus = formestatus;
        vm.formcheck = formcheck;
        vm.showProgress = false;
        vm.directives = [];
        vm.AddNewDirective = AddNewDirective;
        vm.deleteDirective = deleteDirective;

        vm.DirectiveTmpl = {
            Infos: {
                  Reference: '',
                  Title: '',
                  Date:  ''           
            }
        };
    

        var productsMenu = triMenu.getMenu('Products');

        function init() { 

            getDirectives();
             // pop a toast telling users about the how to:
            NotificationService.popAToast('Add a new product by selecting standards from the list.', 1000, 'info');
            StandardsAPIService.getStandardsList()
                               .then(function(standards) {
                                   vm.standards = StandardsManagementService.FormatStandards(standards) ;
                               })
                               .catch(function(error){})
        }
    
        function selectStandard(standard, state)
        {
            if(state == true)
            {
                // Add some  properties to Standard designations

                for(var i = 0 ; i < standard.Designations.length ; i++)
                {
                    standard.Designations[i].Comments = '';
                    standard.Designations[i].Reports = [];
                    standard.Designations[i].Status = '';
                } 

                vm.Product.ProductJSON.Standards[standard.Infos.Name] = {};
                vm.Product.ProductJSON.Standards[standard.Infos.Name].Designations = standard.Designations;
            } 

            else if(state == false && vm.Product.ProductJSON.Standards.hasOwnProperty(standard.Infos.Name))
               delete vm.Product.ProductJSON.Standards[standard.Infos.Name] ;
        }
 
         function addNewProduct()
        {
            vm.showProgress = true;
            vm.Product.directives = SelectedDirectives();
            ProductsManagementService.addNewProduct(vm.Product)
                                     .then(function(success){
                                                NotificationService.RightSidebarNotif( 'Products', 'Add' , vm.Product.ProductInfo.References , UserService.getCurrentUser().username);
                                                NotificationService.popAToast('New Product Created successfully', 5000, 'success');  
                                                vm.showProgress = false;                                      
                                     })
                                     .catch(function(err){

                                     })
        }

        $scope.TreatImage = function (e) {
           
            var reader = new FileReader();
            var file = e.files[0];

            if(file.size < 500000)
            {
              reader.readAsDataURL(file);
            }
            else 
            {
              NotificationService.popAToast('Error: Image size must be under 500 kB.', 5000, 'warning');
            }

            reader.onerror = function (){
                        reader.abort();
                        new DOMException('Problem parsing input file.');
                        result.status = false;
                        resolve( result );
            };

            reader.onload = function () {
                        vm.Product.ProductInfo.ImageBuffer = reader.result; 
                        NotificationService.popAToast('Image Added successfully.', 5000 , 'success');
                        $scope.$apply();         
            };
        };

        function formestatus()
        {
            var status = false;
            var ErrorStack = '';

            if(vm.Product.ProductInfo.References =='' || vm.Product.ProductInfo.ImageBuffer =='' || vm.Product.ProductInfo.RiskAnalysis =='' || vm.Product.ProductInfo.Designation =='' || vm.Product.ProductInfo.Links =='' || vm.Product.ProductInfo.Brand =='' || vm.Product.ProductInfo.TechnicalFolder =='')
            {
                status = true;
            }
            return status;
        }

        function formcheck()
        {
            var ErrorStack = 'Error: ';

            if( vm.Product.ProductInfo.References   =='')      { ErrorStack = ErrorStack + 'Product References is Empty \n'; }
            if( vm.Product.ProductInfo.ImageBuffer  =='')      { ErrorStack = ErrorStack + ' - ' + 'Product Image is Empty \n'; }
            if( vm.Product.ProductInfo.RiskAnalysis =='')      { ErrorStack = ErrorStack + ' - ' + 'Product RiskAnalysis is Empty \n'; }
            if( vm.Product.ProductInfo.Designation  =='')      { ErrorStack = ErrorStack + ' - ' + 'Product Designation is Empty \n';  }
            if( vm.Product.ProductInfo.Links =='')             { ErrorStack = ErrorStack + ' - ' + 'Product Links is Empty \n'; }
            if( vm.Product.ProductInfo.TechnicalFolder == '' ) { ErrorStack = ErrorStack + ' - ' + 'Product TechnicalFolder is Empty \n'; }
            if( vm.Product.ProductInfo.Brand == '' )           { ErrorStack = ErrorStack + ' - ' + 'Product Brand is Empty \n'; }

            if(ErrorStack != 'Error: ')
            {
                NotificationService.popAToast(ErrorStack, 5000, 'error');
            }
        }


        function AddNewDirective()
        {
            vm.showProgress = true;
            DirectivesAPIService.storeDirective(vm.DirectiveTmpl)
                                .then(function(directive){
                                    vm.directives.push(directive);
                                    vm.showProgress = false;
                                    NotificationService.popAToast('Directive Added successfully', 5000, 'success');

                                    vm.DirectiveTmpl = {
                                        Infos: {
                                              Reference: '',
                                              Title: '',
                                              Date:  ''           
                                        }
                                    };
                                    
                                })
                                .catch(function(err){
                                    NotificationService.popAToast('Directive Not Added', 5000, 'error');
                                })
        }

        function deleteDirective(directive)
        {
            vm.showProgress = true;
            askdialog('Confirm !', ' Do you want to delete the directive ?')
            .then(function(response){
                    DirectivesAPIService.deleteDirectivebyId(directive._id)
                                        .then(function(directive){
                                            getDirectives();
                                            NotificationService.popAToast('Directive deleted successfully', 5000, 'success');
                                            vm.showProgress = false;
                                        })
                                        .catch(function(err){
                                            NotificationService.popAToast('Directive Not Added', 5000, 'error');
                                        })
            })
            .catch(function(error){
                              
            })
        }    



        function SelectedDirectives()
        {
            var  Directives = [];
            for(var i = 0; i < vm.directives.length ; i++)
            {
                if(vm.directives[i].selected == true)
                {
                    Directives.push(vm.directives[i]);
                }
            }
            return Directives;
        }      

        function askdialog(message, content) {
            return $mdDialog.show(
                $mdDialog.confirm()
                .title(message)
                .textContent(content)
                .cancel('NO')
                .ok('YES')
            ).then(function(choice){
                return choice;
            })
        }

        function getDirectives()
        {
            DirectivesAPIService.getDirectives()
                                .then(function(directives){
                                    vm.directives = directives;
                                }) 
        }
        // init
        init();
    }
})();
(function() {
    'use strict';

    angular
        .module('app.pca', ['ngWebworker', 'ngFileSaver'
        ]);
})();
(function() {
    'use strict';

    AddPCAdialogController.$inject = ["ErrStack", "addStatus"];
    angular
        .module('app.pca')
        .controller('AddPCAdialogController', AddPCAdialogController);

    /* @ngInject */
    function AddPCAdialogController(ErrStack, addStatus) {
        var vm = this;

        // init

        vm.ErrStack = ErrStack;
        vm.addStatus = addStatus;
    }
})();
(function() {
    'use strict';

    angular
        .module('triangular.themes', [

        ]);
})();
(function() {
    'use strict';

    themingProvider.$inject = ["$mdThemingProvider"];
    angular
        .module('triangular.themes')
        .provider('triTheming', themingProvider);

    /* @ngInject */
    function themingProvider($mdThemingProvider) {
        var themes = {};

        return {
            theme: function(name) {
                if(angular.isDefined(themes[name])) {
                    return themes[name];
                }

                var theme = new Theme(name);

                themes[name] = theme;

                return themes[name];

            },
            $get: function() {
                return {
                    getTheme: function(themeName) {
                        return themes[themeName];
                    },
                    getThemeHue: function(themeName, intentName, hue) {
                        if(angular.isDefined($mdThemingProvider._THEMES[themeName]) && angular.isDefined($mdThemingProvider._THEMES[themeName].colors[intentName])) {
                            var palette = $mdThemingProvider._THEMES[themeName].colors[intentName];
                            if(angular.isDefined($mdThemingProvider._PALETTES[palette.name]) && angular.isDefined($mdThemingProvider._PALETTES[palette.name][palette.hues[hue]])) {
                                return $mdThemingProvider._PALETTES[palette.name][palette.hues[hue]];
                            }
                        }
                    },
                    getPalette: function(name) {
                        return $mdThemingProvider._PALETTES[name];
                    },
                    getPaletteColor: function(paletteName, hue) {
                        if(angular.isDefined($mdThemingProvider._PALETTES[paletteName]) && angular.isDefined($mdThemingProvider._PALETTES[paletteName][hue])) {
                            return $mdThemingProvider._PALETTES[paletteName][hue];
                        }
                    },
                    rgba: $mdThemingProvider._rgba,
                    palettes: $mdThemingProvider._PALETTES,
                    themes: $mdThemingProvider._THEMES,
                    parseRules: $mdThemingProvider._parseRules
                };
            }
        };
    }

    function Theme(name) {
        var THEME_COLOR_TYPES = ['primary', 'accent', 'warn', 'background'];
        var self = this;
        self.name = name;
        self.colors = {};
        self.isDark = false;

        THEME_COLOR_TYPES.forEach(function(colorType) {
            self[colorType + 'Palette'] = function setPaletteType(paletteName, hues) {
                self.colors[colorType] = {
                    name: paletteName,
                    hues: {}
                };
                if(angular.isDefined(hues)) {
                    self.colors[colorType].hues = hues;
                }
                return self;
            };
        });

        self.dark = function(isDark) {
            // default setting when dark() is called is true
            self.isDark = angular.isUndefined(isDark) ? true : isDark;
        };
    }
})();
(function() {
    'use strict';

    skinsProvider.$inject = ["$mdThemingProvider", "triThemingProvider"];
    Skin.$inject = ["id", "name", "$mdThemingProvider", "triThemingProvider"];
    addSkinToScope.$inject = ["$rootScope", "triSkins"];
    angular
        .module('triangular.themes')
        .provider('triSkins', skinsProvider)
        .run(addSkinToScope);

    /* @ngInject */
    function skinsProvider($mdThemingProvider, triThemingProvider) {
        var skins = {};
        var currentSkin = null;
        var useSkinCookie = false;

        return {
            skin: function(id, name) {
                if(angular.isDefined(skins[id])) {
                    return skins[id];
                }

                var skin = new Skin(id, name, $mdThemingProvider, triThemingProvider);

                skins[id] = skin;

                return skins[id];
            },
            setSkin: function(id) {
                if(angular.isUndefined(skins[id])) {
                    return;
                }

                // set skin to selected skin
                currentSkin = skins[id];

                // override the skin if cookie is enabled and has been set
                if(useSkinCookie) {
                    // we need to check cookies to see if skin has been saved so inject it
                    var $cookies;
                    angular.injector(['ngCookies']).invoke(['$cookies', function(cookies) {
                        $cookies = cookies;
                    }]);
                    // if we have a cookie set then override the currentSkin
                    var triangularSkin = $cookies.get('triangular-skin');
                    if(angular.isDefined(triangularSkin)) {
                        var cookieTheme = angular.fromJson(triangularSkin);
                        currentSkin = angular.isDefined(skins[cookieTheme.skin]) ? skins[cookieTheme.skin] : skins[0];
                    }
                }

                // make material load the themes needed for the skin
                currentSkin.loadThemes();

                return currentSkin;
            },
            useSkinCookie: function(skinCookie) {
                useSkinCookie = skinCookie;
            },
            $get: function() {
                return {
                    getCurrent: function() {
                        return currentSkin;
                    },
                    getSkins: function() {
                        return skins;
                    }
                };
            }
        };
    }

    /* @ngInject */
    function Skin(id, name, $mdThemingProvider, triThemingProvider) {
        var THEMABLE_ELEMENTS = ['sidebar', 'logo', 'toolbar', 'content'];
        var self = this;
        self.id = id;
        self.name = name;
        self.elements = {};

        THEMABLE_ELEMENTS.forEach(function(element) {
            self[element + 'Theme'] = function setElementTheme(themeName) {
                self.elements[element] = themeName;
                return self;
            };
        });

        self.loadThemes = function() {
            // go through each element
            for (var element in self.elements) {
                // register theme with mdThemingProvider (will load css in the header)
                var theme = triThemingProvider.theme(self.elements[element]);

                $mdThemingProvider.theme(theme.name)
                .primaryPalette(theme.colors.primary.name, theme.colors.primary.hues)
                .accentPalette(theme.colors.accent.name, theme.colors.accent.hues)
                .warnPalette(theme.colors.warn.name, theme.colors.warn.hues)
                .dark(theme.isDark);

                if(angular.isDefined(theme.colors.background)) {
                    $mdThemingProvider
                    .theme(theme.name)
                    .backgroundPalette(theme.colors.background.name, theme.colors.background.hues);
                }
            }

            $mdThemingProvider.setDefaultTheme(self.elements.content);
        };
    }

    /* @ngInject */
    function addSkinToScope($rootScope, triSkins) {
        $rootScope.triSkin = triSkins.getCurrent();
    }
})();
(function() {
    'use strict';

    angular
        .module('triangular', [
            'ngMaterial',
            'triangular.layouts', 'triangular.components', 'triangular.themes', 'triangular.directives', 'triangular.router',
            // 'triangular.profiler',
            // uncomment above to activate the speed profiler
            'ui.router'
        ]);
})();
(function() {
    'use strict';

    runFunction.$inject = ["$rootScope", "$window", "$state", "$filter", "$timeout", "$injector", "triRoute", "triBreadcrumbsService"];
    angular
        .module('triangular')
        .run(runFunction);

    /* @ngInject */
    function runFunction($rootScope, $window, $state, $filter, $timeout, $injector, triRoute, triBreadcrumbsService) {
        var breadcrumbs = triBreadcrumbsService.breadcrumbs;

        // change title when language changes - when a menu item is clicked - on app init
        var menuTitleHandler = $rootScope.$on('changeTitle', function(){
            setFullTitle();
        });

        $rootScope.$on('$destroy', function(){
            menuTitleHandler();
        });

        function setFullTitle() {
            $timeout(function(){
                var title = triRoute.title;
                angular.forEach(breadcrumbs.crumbs, function(crumb){
                    var name = crumb.name;
                    if($injector.has('translateFilter')) {
                        name = $filter('translate')(crumb.name);
                    }
                    title +=' ' + triRoute.separator + ' ' + name;
                });
                $window.document.title = title;
            });
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('triangular')
        .provider('triRoute', routeProvider);

    /* @ngInject */
    function routeProvider() {
        // Provider
        var settings = {
            docTitle: '',
            separator: ''
        };

        this.setTitle = setTitle;
        this.setSeparator = setSeparator;
        this.$get = routeHelper;

        function setTitle(title) {
            settings.docTitle = title;
        }

        function setSeparator(separator) {
            settings.separator = separator;
        }

        // Service
        function routeHelper() {
            return {
                title: settings.docTitle,
                separator: settings.separator
            };
        }
    }
})();


(function() {
    'use strict';

    angular
        .module('triangular.router', [

        ]);
})();
(function() {
    'use strict';

    angular
        .module('triangular.profiler', [
            'digestHud'
        ]);
})();
(function() {
    'use strict';

    profilerConfig.$inject = ["digestHudProvider"];
    angular
        .module('triangular.profiler')
        .config(profilerConfig);

    /* @ngInject */
    function profilerConfig(digestHudProvider) {
        digestHudProvider.enable();

        // Optional configuration settings:
        digestHudProvider.setHudPosition('top right'); // setup hud position on the page: top right, bottom left, etc. corner
        digestHudProvider.numTopWatches = 20;  // number of items to display in detailed table
        digestHudProvider.numDigestStats = 25;  // number of most recent digests to use f
    }
})();
(function() {
    'use strict';

    layoutRunner.$inject = ["$rootScope", "triLayout"];
    angular
        .module('triangular')
        .run(layoutRunner)
        .provider('triLayout', layoutProvider);

    /* @ngInject */
    function layoutProvider() {
        var layoutDefaults = {
            toolbarSize: 'default',
            toolbarShrink: true,
            toolbarClass: '',
            contentClass: '',
            innerContentClass: '',
            sideMenuSize: 'full',
            showToolbar: true,
            footer: true,
            contentTemplateUrl: 'app/triangular/layouts/default/default-content.tmpl.html',
            sidebarLeftTemplateUrl: 'app/layouts/leftsidenav/leftsidenav.tmpl.html',
            sidebarLeftController: 'MenuController',
            sidebarRightTemplateUrl: 'app/triangular/components/notifications-panel/notifications-panel.tmpl.html',
            sidebarRightController: 'NotificationsPanelController',
            toolbarTemplateUrl: 'app/triangular/components/toolbars/toolbar.tmpl.html',
            toolbarController: 'DefaultToolbarController',
            footerTemplateUrl: 'app/triangular/components/footer/footer.tmpl.html'
        };
        var resetableOptions = ['toolbarSize', 'toolbarShrink', 'toolbarClass', 'contentClass', 'innerContentClass', 'sideMenuSize', 'showToolbar', 'footer', 'contentTemplateUrl', 'sidebarLeftTemplateUrl', 'sidebarLeftController', 'sidebarRightTemplateUrl', 'sidebarRightController', 'toolbarTemplateUrl', 'toolbarController', 'footerTemplateUrl', 'loaderTemplateUrl', 'loaderController'];
        var layout = {};

        this.getDefaultOption = getDefaultOption;
        this.setDefaultOption = setDefaultOption;

        function getDefaultOption(name) {
            return layoutDefaults[name];
        }

        function setDefaultOption(name, value) {
            layoutDefaults[name] = value;
        }

        // init

        angular.extend(layout, layoutDefaults);

        // Service
        this.$get = function() {
            function setOption(name, value) {
                layout[name] = value;
            }

            function updateLayoutFromState(event, toState) {
                // reset classes
                angular.forEach(resetableOptions, function(option){
                    layout[option] = layoutDefaults[option];
                });
                var layoutOverrides = angular.isDefined(toState.data) && angular.isDefined(toState.data.layout) ? toState.data.layout : {};
                angular.extend(layout, layout, layoutOverrides);
            }

            return {
                layout: layout,
                setOption: setOption,
                updateLayoutFromState: updateLayoutFromState
            };
        };
    }

    /* @ngInject */
    function layoutRunner($rootScope, triLayout) {
        // check for $stateChangeStart and update the layouts if we have data.layout set
        // if nothing set reset to defaults for every state
        var destroyOn = $rootScope.$on('$stateChangeStart', triLayout.updateLayoutFromState);
        $rootScope.$on('$destroy', removeWatch);

        /////////////

        function removeWatch() {
            destroyOn();
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('triangular.directives', [
        ]);
})();
(function() {
    'use strict';

    themeBackground.$inject = ["$mdTheming", "triTheming"];
    angular
        .module('triangular.directives')
        .directive('themeBackground', themeBackground);

    /* @ngInject */
    function themeBackground($mdTheming, triTheming) {
        // Usage:
        // ```html
        // <div md-theme="cyan" theme-background="primary|accent|warn|background:default|hue-1|hue-2|hue-3">Coloured content</div>
        // ```
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link($scope, $element, attrs) {
            $mdTheming($element);

            // make sure we have access to the theme - causes an eslint but nothing we can do about AM naming
            var $mdTheme = $element.controller('mdTheme'); //eslint-disable-line
            if(angular.isDefined($mdTheme)) {
                var intent = attrs.themeBackground;
                var hue = 'default';

                // check if we have a hue provided
                if(intent.indexOf(':') !== -1) {
                    var splitIntent = attrs.themeBackground.split(':');
                    intent = splitIntent[0];
                    hue = splitIntent[1];
                }
                // get the color and apply it to the element
                var color = triTheming.getThemeHue($mdTheme.$mdTheme, intent, hue);
                if(angular.isDefined(color)) {
                    $element.css({
                        'background-color': triTheming.rgba(color.value),
                        'border-color': triTheming.rgba(color.value),
                        'color': triTheming.rgba(color.contrast)
                    });
                }
            }
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('triangular.directives')
        .directive('triSamePassword', samePassword);

    /* @ngInject */
    function samePassword() {
        // Usage:
        //
        // ```html
        // <form name="signup">
        //     <input name="password" type="password" ng-model="user.password" same-password="signup.confirm" />
        //     <input name="confirm" type="password" ng-model="user.confirm" same-password="signup.confirm" />
        // </form>
        // ```
        // Creates:
        //
        // `samePassword` is a directive with the purpose to validate a password input based on the value of another input.
        // When both input values are the same the inputs will be set to valid

        var directive = {
            restrict: 'A',
            require: 'ngModel',
            link: link,
            scope: {
                triSamePassword: '='
            }
        };
        return directive;

        function link(scope, element, attrs, ngModel) {
            ngModel.$viewChangeListeners.push(function() {
                ngModel.$setValidity('samePassword', scope.triSamePassword.$modelValue === ngModel.$modelValue);
                scope.triSamePassword.$setValidity('samePassword', scope.triSamePassword.$modelValue === ngModel.$modelValue);
            });
        }
    }
})();
(function() {
    'use strict';

    paletteBackground.$inject = ["triTheming"];
    angular
        .module('triangular.directives')
        .directive('paletteBackground', paletteBackground);

    /* @ngInject */
    function paletteBackground(triTheming) {
        // Usage:
        // ```html
        // <div palette-background="green:500">Coloured content</div>
        // ```
        //
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link($scope, $element, attrs) {
            var splitColor = attrs.paletteBackground.split(':');
            var color = triTheming.getPaletteColor(splitColor[0], splitColor[1]);

            if(angular.isDefined(color)) {
                $element.css({
                    'background-color': triTheming.rgba(color.value),
                    'border-color': triTheming.rgba(color.value),
                    'color': triTheming.rgba(color.contrast)
                });
            }
        }
    }
})();
(function() {
    'use strict';

    countupto.$inject = ["$timeout"];
    angular
        .module('triangular.directives')
        .directive('countupto', countupto);

    /* @ngInject */
    function countupto($timeout) {
        // Usage:
        //
        // ```html
        // <h1 countupto="100"></h1>
        // ```
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                'countupto': '=',
                'options': '='
            }
        };
        return directive;

        function link($scope, $element, attrs) {
            var options = {
                useEasing: true,
                useGrouping: true,
                separator: ',',
                decimal: '.',
                prefix: '',
                suffix: ''
            };

            var numAnim;

            // override default options?
            if ($scope.options) {
                for(var option in options) {
                    if(angular.isDefined($scope.options[option])) {
                        options[option] = $scope.options[option];
                    }
                }
            }

            attrs.from = angular.isUndefined(attrs.from) ? 0 : parseInt(attrs.from);
            attrs.decimals = angular.isUndefined(attrs.decimals) ? 2 : parseFloat(attrs.decimals);
            attrs.duration = angular.isUndefined(attrs.duration) ? 5 : parseFloat(attrs.duration);

            $timeout(function() {
                numAnim = new CountUp($element[0], attrs.from, $scope.countupto, attrs.decimals, attrs.duration, options);
                numAnim.start();

                $scope.$watch('countupto', function(value, oldValue) {
                    if (angular.isDefined(value) && value != oldValue) {
                        numAnim.update(value);
                    }
                });

            }, 500);            
        }
    }

})();
(function() {
    'use strict';

    angular
        .module('app.permission', [
            'permission', 'permission.ui'
        ]);
})();

(function() {
    'use strict';

    PermissionController.$inject = ["$state", "$window", "$cookies", "RoleStore", "PermissionStore", "UserService", "users"];
    angular
        .module('app.permission')
        .controller('PermissionController', PermissionController);

    /* @ngInject */
    function PermissionController($state, $window, $cookies, RoleStore, PermissionStore, UserService, users) {
        var vm = this;
        vm.userList = users.data;
        vm.roleList = [];
        vm.permissionList = [];
        vm.allRoles = RoleStore.getStore();
        vm.allPermissions = PermissionStore.getStore();

        vm.loginClick = loginClick;
        vm.selectUser = selectUser;

        ////////////////

        function init() {
            var currentUser = UserService.getCurrentUser();
            angular.forEach(users.data, function(user) {
                if(user.username === currentUser.username) {
                    selectUser(user);
                }
            });
        }

        function loginClick() {
            // store username in a cookie so we can load after reload
            $cookies.put('tri-user', vm.selectedUser.username);
            $window.location.reload();
        }

        function selectUser(user) {
            vm.selectedUser = user;
            vm.roleList = [];
            vm.permissionList = [];
            // find first role and select that
            angular.forEach(vm.allRoles, function(role) {
                if(-1 !== vm.selectedUser.roles.indexOf(role.roleName)) {
                    // add this users roles to the list
                    vm.roleList.push(role);
                    angular.forEach(role.validationFunction, function(permission) {
                        vm.permissionList.push(permission);
                    });
                }
            });
        }

        // init

        init();
    }
})();

(function() {
    'use strict';

    DefaultToolbarController.$inject = ["$scope", "$injector", "$rootScope", "$mdMedia", "$state", "$element", "$filter", "$mdUtil", "$mdSidenav", "$mdToast", "$http", "$mdDialog", "$timeout", "$document", "AuthenticationService", "triBreadcrumbsService", "triSettings", "triLayout", "AuthErrorService"];
    angular
        .module('triangular.components')
        .controller('ToolbarController', DefaultToolbarController);

    /* @ngInject */
    function DefaultToolbarController($scope, $injector, $rootScope, $mdMedia, $state, $element, $filter, $mdUtil, $mdSidenav, $mdToast, $http ,$mdDialog, $timeout, $document, AuthenticationService , triBreadcrumbsService, triSettings, triLayout, AuthErrorService) {
        var vm = this;
        vm.breadcrumbs = triBreadcrumbsService.breadcrumbs;
        vm.emailNew = false;
        vm.languages = triSettings.languages;
        vm.openSideNav = openSideNav;
        vm.hideMenuButton = hideMenuButton;
        vm.switchLanguage = switchLanguage;
        vm.toggleNotificationsTab = toggleNotificationsTab;
        vm.logout = logout;
        vm.isFullScreen = false;
        vm.fullScreenIcon = 'zmdi zmdi-fullscreen';
        vm.toggleFullScreen = toggleFullScreen;
        vm.notificationsCount = 0;
        /*vm.options = { datasetFill: false };
        vm.labels = ['NA','F','A', 'P'];
        vm.data = [5, 10 , 3 , 14]; */

        vm.createDialog = createDialog;
        vm.newDialog = {
            title: 'App how to use: ',
            ok: 'Ok',
        };

        if($injector.has('UserService')) {
            var UserService = $injector.get('UserService');
            if(UserService.getCurrentUser().username != undefined)
            {
                vm.currentUser = UserService.getCurrentUser();
            }
            else
            {
                AuthenticationService.getUserByToken()
                                     .then(function(user)
                                                {
                                                    UserService.setCurrentUser(user);
                                                    vm.currentUser = UserService.getCurrentUser();
                                                })
                                     .catch(function(error){
                                            //UserService.setDefaultUser();
                                            vm.currentUser = UserService.getCurrentUser();
                                            //AuthErrorService.AuthError('ChangePermissionDenied');
                                     })         
            }
        }
        else {
            // permissions are turned off so no UserService available
            // just set default user
            vm.currentUser = {
                displayName: 'Christos',
                username: 'christos',
                avatar: 'assets/images/avatars/avatar-5.png',
                roles: []
            };
        }

        ////////////////
 
        function getcontent() {

           return Promise.resolve( 
                        $http.get('howto.tmpl.html')
                        //$http.get('app/layouts/toolbar/howto.tmpl.html')
                         .then(function(htmlcontent){
                              return htmlcontent.data;
                         })
                 );
        }

        function createDialog($event) {
            getcontent().then(function(htmlcontent){
                      $mdDialog.show({
                          parent: angular.element(document.body),
                          clickOutsideToClose: true,
                          template: htmlcontent,
                          controller: 'productsDashboardController',
                        });
            })
        }

        function openSideNav(navID) {
            $mdUtil.debounce(function(){
                $mdSidenav(navID).toggle();
            }, 300)();
        }

        function switchLanguage(languageCode) {
            if($injector.has('$translate')) {
                var $translate = $injector.get('$translate');
                $translate.use(languageCode)
                .then(function() {
                    $mdToast.show(
                        $mdToast.simple()
                        .content($filter('triTranslate')('Language Changed'))
                        .position('bottom right')
                        .hideDelay(500)
                    );
                    $rootScope.$emit('changeTitle');
                });
            }
        }

        function hideMenuButton() {
            switch(triLayout.layout.sideMenuSize) {
                case 'hidden':
                    // always show button if menu is hidden
                    return false;
                case 'off':
                    // never show button if menu is turned off
                    return true;
                default:
                    // show the menu button when screen is mobile and menu is hidden
                    return $mdMedia('gt-sm');
            }
        }

        $scope.$on('ToolbarNotification', function() {
            vm.notificationsCount = vm.notificationsCount + 1;
        });

        $rootScope.$on('AppUserChanged', function() {
            if($injector.has('UserService')) {
                var UserService = $injector.get('UserService');
                vm.currentUser = UserService.getCurrentUser();
                //$scope.$apply();
            }
        });

        function toggleNotificationsTab(tab) {
            vm.notificationsCount = 0;
            $rootScope.$broadcast('triSwitchNotificationTab', tab);
            vm.openSideNav('notifications');
        }

        function logout(a) {
            if($injector.has('UserService')) {
                var UserService = $injector.get('UserService');
                UserService.reinitUser();
            } 
            AuthenticationService.logout(); 
        }

        function toggleFullScreen() {
            vm.isFullScreen = !vm.isFullScreen;
            vm.fullScreenIcon = vm.isFullScreen ? 'zmdi zmdi-fullscreen-exit':'zmdi zmdi-fullscreen';
            // more info here: https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
            var doc = $document[0];
            if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement ) {
                if (doc.documentElement.requestFullscreen) {
                    doc.documentElement.requestFullscreen();
                } else if (doc.documentElement.msRequestFullscreen) {
                    doc.documentElement.msRequestFullscreen();
                } else if (doc.documentElement.mozRequestFullScreen) {
                    doc.documentElement.mozRequestFullScreen();
                } else if (doc.documentElement.webkitRequestFullscreen) {
                    doc.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (doc.exitFullscreen) {
                    doc.exitFullscreen();
                } else if (doc.msExitFullscreen) {
                    doc.msExitFullscreen();
                } else if (doc.mozCancelFullScreen) {
                    doc.mozCancelFullScreen();
                } else if (doc.webkitExitFullscreen) {
                    doc.webkitExitFullscreen();
                }
            }
        }

        $scope.$on('newMailNotification', function(){
            vm.emailNew = true;
        });
    }
})();

(function() {
    'use strict';

RightSidenavController.$inject = ["$scope", "$rootScope", "$http", "$mdSidenav", "$state", "AuthenticationService", "NotificationService"];
    angular
    .module('triangular.components')
    .filter('reverse', function() {
      return function(items) {
        return items.slice().reverse();
      };
    })    
    .controller('RightSidenavController', RightSidenavController);
    /* @ngInject */
    function RightSidenavController($scope,$rootScope, $http, $mdSidenav, $state, AuthenticationService , NotificationService) {
        var vm = this;
        // sets the current active tab
        vm.close = close;
        vm.currentTab = 0;
        vm.notificationGroups = [{
            name: 'Products',
            notifications: []
        },{
            name: 'Standards',
            notifications: []
        },{
            name: 'PCA',
            notifications: []
        }];

        vm.settingsGroups = [{
            name: 'Account Settings',
            settings: [{
                title: 'Show my location',
                icon: 'zmdi zmdi-pin',
                enabled: true
            },{
                title: 'Show my avatar',
                icon: 'zmdi zmdi-face',
                enabled: false
            },{
                title: 'Send me notifications',
                icon: 'zmdi zmdi-notifications-active',
                enabled: true
            }]
        },{
            name: 'Chat Settings',
            settings: [{
                title: 'Show my username',
                icon: 'zmdi zmdi-account',
                enabled: true
            },{
                title: 'Make my profile public',
                icon: 'zmdi zmdi-account-box',
                enabled: false
            },{
                title: 'Allow cloud backups',
                icon: 'zmdi zmdi-cloud-upload',
                enabled: true
            }]
        }];

        vm.statisticsGroups = [{
            name: 'User Statistics',
            stats: [{
                title: 'Storage Space (120/160 Gb)',
                mdClass: 'md-primary',
                value: 60
            },{
                title: 'Bandwidth Usage (10/100 Gb)',
                mdClass: 'md-accent',
                value: 10
            },{
                title: 'Memory Usage (1/8 Gb)',
                mdClass: 'md-warn',
                value: 100
            }]
        },{
            name: 'Server Statistics',
            stats: [{
                title: 'Storage Space (120/160 Gb)',
                mdClass: 'md-primary',
                value: 60
            },{
                title: 'Bandwidth Usage (10/100 Gb)',
                mdClass: 'md-accent',
                value: 10
            },{
                title: 'Memory Usage (1/8 Gb)',
                mdClass: 'md-warn',
                value: 100
            }]
        }];

        init();

        ////////////////

        // add an event to switch tabs (used when user clicks a menu item before sidebar opens)
        $scope.$on('triSwitchNotificationTab', function($event, tab) {
            vm.currentTab = tab;
        });

        function close() {
            $mdSidenav('notifications').close();
        }

        $rootScope.$on('StandardsNotification', function(event, notification){
            UpdateNotificationGroups( 'Standards',notification);
        });   

        $rootScope.$on('ProductsNotification', function(event, notification){
            UpdateNotificationGroups( 'Products',notification);
        });  

        $rootScope.$on('PCANotification', function(event, notification){
            UpdateNotificationGroups( 'PCA',notification);
        });      

        function UpdateNotificationGroups( NotifGroup,notification)
        {
             for(var i=0 ; i < vm.notificationGroups.length ; i++)
             {
                if(vm.notificationGroups[i].name == NotifGroup)
                {
                    vm.notificationGroups[i].notifications.push(notification);
                    break;
                }
                if( i == vm.notificationGroups.length - 1 && vm.notificationGroups[i].name != NotifGroup)
                {
                    var NewNotifGroup = {
                        name: NotifGroup,
                        notifications: notification
                    };
                    vm.notificationGroups.push(NewNotifGroup);
                    break;
                }
            }
            //$scope.$apply(); 
        }

        function init()
        {
            NotificationService.getNotifications()
                               .then(function(notifications) {
                                    for(var i = 0 ; i <  notifications.length ; i++)
                                    {
                                        UpdateNotificationGroups( notifications[i].GroupName , notifications[i]);
                                    }
                               })
                               .catch(function(error){
                                    // error
                                    
                               })
        } 
}
})();

(function() {
    'use strict';

    angular
        .module('app', [
            'ui.router',
            'triangular',
            'ngAnimate', 'ngCookies', 'ngSanitize', 'ngMessages', 'ngMaterial',
            //'googlechart', 
            'chart.js', 'linkify', 'angularMoment',
             //'datatables',
             'textAngular', 
             //'uiGmapgoogle-maps', 
             'hljs', 
             //'md.data.table', 
             angularDragula(angular), 
             'ngFileUpload',

            'app.translate',
            // only need one language?  if you want to turn off translations
            // comment out or remove the 'app.translate', line above
            'app.permission',
            // dont need permissions?  if you want to turn off permissions
            // comment out or remove the 'app.permission', line above
            // also remove 'permission' from the first line of dependencies
            // https://github.com/Narzerus/angular-permission see here for why
            // uncomment above to activate the example seed module
            // 'seed-module',
            'app.examples',
            'app.laboratory',
            //'angular-tour'
        ])

})();

(function() {
    'use strict';

    LoaderController.$inject = ["triSettings"];
    angular
        .module('app')
        .controller('LoaderController', LoaderController);

    /* @ngInject */
    function LoaderController(triSettings) {
        var vm = this;

        vm.triSettings = triSettings;
    }
})();

(function() {
    'use strict';

    LeftSidenavController.$inject = ["triSettings", "triLayout"];
    angular
        .module('triangular.components')
        .controller('LeftSidenavController', LeftSidenavController);

    /* @ngInject */
    function LeftSidenavController(triSettings, triLayout) {
        var vm = this;
        vm.layout = triLayout.layout;
        vm.sidebarInfo = {
            appName: triSettings.name,
            appLogo: triSettings.logo
        };
        vm.toggleIconMenu = toggleIconMenu;

        ////////////

        function toggleIconMenu() {
            var menu = vm.layout.sideMenuSize === 'icon' ? 'full' : 'icon';
            triLayout.setOption('sideMenuSize', menu);
        }
    }
})();

(function() {
    'use strict';

    FooterController.$inject = ["triLayout", "triSettings"];
    angular
        .module('app')
        .controller('AppFooterController', FooterController);

    /* @ngInject */
    function FooterController(triLayout, triSettings) {
        var vm = this;

        vm.layout = triLayout;
        vm.settings = triSettings;
    }
})();

(function() {
    'use strict';

    angular
        .module('app.standards', [ 'ds.objectDiff'
        ]);
})();
(function() {
    'use strict';

    StandardsController.$inject = ["StandardsAPIService", "NotificationService", "$state", "$scope", "$rootScope", "$log", "UserService", "$timeout", "StandardsManagementService", "$mdDialog", "$document", "AuthErrorService"];
    angular
        .module('app.standards')
        .controller('StandardsController', StandardsController);

    /* @ngInject */
    function StandardsController(StandardsAPIService ,NotificationService , $state , $scope , $rootScope , $log , UserService ,$timeout , StandardsManagementService, $mdDialog , $document, AuthErrorService) {

        var vm = this;
        vm.standards = [];
        vm.selectStandard = selectStandard;
        vm.deleteStandard = deleteStandard;
        vm.deleteAllStandards = deleteAllStandards;
        vm.getStandardColor = getStandardColor ;
        vm.Gologin = Gologin;
        vm.showProgress = false;
        ////////////////

        // Standard Update event: 

        //$scope.$on('StandardUpdated', $timeout( init(), 1000));

                // Public functions 
        function init() {  
            // Get Standards List:
            NotificationService.popAToast('Standards Management Service.', 1000, 'info');
            getStandards();
        }

        function getStandards () {
            vm.showProgress = true;
            StandardsAPIService.getStandardsList()
                               .then(function(standards) {
                                if(standards != undefined)
                                    {
                                        angular.copy(StandardsManagementService.FormatStandards(standards), vm.standards);
                                        $scope.$apply();
                                        vm.showProgress = false;                                   
                                    }
                               })
                               .catch(function(error)
                               {
                                  AuthErrorService.httpError(error, 'Problem Get Standard.');
                                  vm.showProgress = false;
                               })
        }

        function selectStandard($event, standard) {
            $state.go('triangular.standard-dialog', {standard:standard});
        }

        function deleteStandard($event, standard) 
        { 
            askdialog('Confirm !', ' Do you want to delete the standard ?')
            .then(function(response){
                    StandardsAPIService.deleteStandard(standard._id)
                                       .then(function(deleted){
                                            NotificationService.RightSidebarNotif( 'Standards', 'Delete' , deleted.Infos.Name, UserService.getCurrentUser().username);
                                            NotificationService.popAToast('Standard deleted successfully: ', 5000, 'success');
                                            //getStandards();
                                        }).catch(function(error){
                                            AuthErrorService.httpError(error, 'Delete Standard Error.');
                                        })
            })
            .catch(function(error){
                              
            })
        }

        function deleteAllStandards()
        {
            for(var i= 0; i < vm.standards.length ; i++)
            {
                deleteStandard('',  vm.standards[i]);
            } 
        }

        function getStandardColor(standard)
        {
            if(standard.Infos.HasUpdate == 0)
            {
                return 'light-green:400';
            }
            else 
            {
                return "deep-orange:500";
            }
        }

        function Gologin(){
            $state.go('Authentication.login');
        }


        $scope.$on('StandardDelete', function(event, Standard) {
           for(var i = 0 ; i < vm.standards.length ; i++)
            {
                var j = 0;
                if( Standard != null && vm.standards[i] != null)
                {
                        if(vm.standards[i]._id == Standard._id)
                        {   
                            vm.standards.splice(i, 1);
                        } 
                }
            } 
        });

        //Standards Ws Events 
        $rootScope.$on('StandardNew', function(event, Standard) 
        { 
            if(!vm.standards.includes(Standard))
            {
                var Std = StandardsManagementService.FormatStandards([Standard]);
                vm.standards.push(Std);
            }
        });


        //Standards Ws Events 
        $rootScope.$on('StandardUpdate', function(event, Standard) 
        {
           for(var i = 0 ; i < vm.standards.length ; i++)
            {
                var j = 0;
                if( Standard != null && vm.standards[i] != null)
                {
                        if(vm.standards[i]._id == Standard._id)
                        {   
                            var Std = StandardsManagementService.FormatStandards([Standard]);
                            vm.standards[i] = Std[0];
                        } 
                }
            }    
        });

        function askdialog(message, content) {
            return $mdDialog.show(
                $mdDialog.confirm()
                .title(message)
                .textContent(content)
                .cancel('NO')
                .ok('YES')
            ).then(function(choice){
                return choice;
            })
        }

        // init
        init();
    }
})();

(function() {
    'use strict';

    config.$inject = ["$stateProvider", "triMenuProvider"];
    angular
        .module('app.standards')
        .config(config);

    /* @ngInject */
    function config($stateProvider, triMenuProvider) {
        $stateProvider
        .state('triangular.standards-manage', {
            url: '/standards',
            templateUrl: 'app/laboratory/standards/standards.tmpl.html',
            controller: 'StandardsController',
            controllerAs: 'vm',
            data: {
                layout: {
                    toolbarSize: 'default',
                    toolbarShrink: true,
                    toolbarClass: 'full-image-background mb-bg-11',
                    contentClass: 'full-image-background mb-bg-11',
                    sideMenuSize: 'icon',
                    footer: false
                },
                permissions: {
                    only: ['viewStd']
                }
            }
        })
        .state('triangular.standard-dialog', {
            url: '/standard-dialog',
            templateUrl: 'app/laboratory/standards/standard.dialog.template.html',
            controller: 'StandardDialogController',
            params: {
                 standard: null
            },
            controllerAs: 'vm',
            data: {
                layout: {
                    toolbarSize: 'default',
                    toolbarShrink: true,
                    contentClass: 'none',
                    sideMenuSize: 'full',
                    footer: false
                },
                permissions: {
                    only: ['viewStd']
                }
            }
        })
        .state('triangular.standards-add', {
            url: '/standards-add',
            templateUrl: 'app/laboratory/standards/add_standard/add_standard.tmpl.html',
            controller: 'PcaController',
            controllerAs: 'vm',
            data: {
                layout: {
                    toolbarSize: 'default',
                    toolbarShrink: true,
                    toolbarClass: 'full-image-background mb-bg-09',
                    contentClass: 'full-image-background mb-bg-09',
                    sideMenuSize: 'icon',
                    footer: false
                },
                permissions: {
                    only: ['viewStd']
                }
            }
        })

        triMenuProvider.addMenu({
            name: 'Standards',
            icon: 'zmdi zmdi-assignment',
            type: 'dropdown',
            priority: 2,
            permission: 'viewStd',
            children: [{
                name: 'Manage Standards',
                icon: 'zmdi zmdi-widgets',
                state: 'triangular.standards-manage',
                type: 'link',
                permission: 'viewStd'
            },{
                name: 'Add Standards',
                icon: 'zmdi zmdi-widgets',
                state: 'triangular.standards-add',
                type: 'link',
                permission: 'viewAddStd'
            }
            ]
        });
    }
})();




(function() {
    'use strict';

    StandardsAPIService.$inject = ["$http", "API_HGLABS", "WS_API", "$rootScope", "AuthenticationService", "NotificationService", "AuthErrorService", "$log"];
    angular
        .module('app.standards')
        .factory('StandardsAPIService', StandardsAPIService);

    /* @ngInject */
    function StandardsAPIService($http, API_HGLABS , WS_API ,  $rootScope ,  AuthenticationService , NotificationService, AuthErrorService, $log) {
        var service = {
            getStandardsList: getStandardsList,
            storeStandardsList: storeStandardsList,
            deleteStandard: deleteStandard,
            getStandard:getStandard,
            UpdateStandardContent:UpdateStandardContent
        };
        
        var Standards = [];

        var socket = io.connect(WS_API.url, {
            'reconnection': true,
            'reconnectionDelay': 500,
            'reconnectionAttempts': Infinity
        });

        socket.on('StandardDelete', function(Standard){
           $rootScope.$broadcast('StandardDelete', Standard);
           $log.info('deleted Standard: '  + Standard._id);
           for(var i = 0 ; i < Standards.length ; i++)
            {
                var j = 0;
                if( Standard != null && Standards[i] != null)
                {
                        if(Standards[i]._id == Standard._id)
                        {   
                            Standards.splice(i, 1);
                        } 
                }
            }            
        });
 
        // Standards broadcast event
        socket.on('StandardNew', function(Standard){
            $rootScope.$broadcast('StandardNew', Standard);
            $log.info('new Standard: '  + Standard._id);
            
            if(!Standards.includes(Standard))
            {
                Standards.push(Standard);
            }
        });

        socket.on('StandardUpdate', function(Standard){
           $rootScope.$broadcast('StandardUpdate', Standard);
           $log.info('Update Standard: '  + Standard._id);
           for(var i = 0 ; i < Standards.length ; i++)
            {
                var j = 0;
                if( Standard != null && Standards[i] != null)
                {
                        if(Standards[i]._id == Standard._id)
                        {   
                            Standards[i] = Standard;
                        } 
                }
            }            
        });

        return service;

        // Standards Management 

        function getStandardsList() {
            if(Standards.length == 0)
            {
                         return Promise.resolve( AuthenticationService.getAuthToken()
                        .then(function (Authentication) {
                            if(Authentication.Authorization == true)
                            {
                            let promise = new Promise(function(resolve, reject){
                                $http({
                                    method: 'GET',
                                    url: API_HGLABS.url + 'standards' ,
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': Authentication.AuthToken
                                    }
                                })
                                .then(function(response) {
                                    Standards = response.data;
                                    resolve(response.data);
                                })
                                .catch(function(error) {
                                    reject(error);
                                    AuthErrorService.httpError(error, "Standard list.");
                                });
                            });
                            return promise;
                            }
                        })
                      .catch(function(error)
                      {
                        error = AuthErrorService.httpError(error, "Standard list.");
                        //return Promise.reject(error);
                      })
                  );
            }
            else
            {
                return Promise.resolve(Standards);          
            }
        }
 
        function getStandard(id) {

            let promise = new Promise(function(resolve, reject){
                $http({
                    method: 'GET',
                    url: API_HGLABS.url + 'standards/'+ id 
                })
                .then(function(response) {
                    resolve(response.data);
                })
                .catch(function(error) {
                    var error = AuthErrorService.httpError(error, "get Standard.");
                    reject(error);
                });
            });
            return promise;
        }

        function storeStandardsList(StandardList) {            
            return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'POST',
                            url: API_HGLABS.url + 'standards',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            },
                            data: { StandardList : StandardList }
                        })
                        .then(function(response) {
                             resolve(response.data);
                        })
                        .catch(function(error) {
                             reject('Update Standard ERROR');
                        });
                    });

                    return promise;
                    }
                })
              .catch(function(error)
              {
                error = AuthErrorService.httpError(error, "Create Standard.");
                Promise.reject(error);
              })
          );
        }

        function UpdateStandardContent(Standard) {            
            return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'PUT',
                            url: API_HGLABS.url + 'standards',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            },
                            data: Standard
                        })
                        .then(function(response) {
                            resolve(response.data);
                        })
                        .catch(function(error) {
                            AuthErrorService.httpError(error, "Update Standard.");
                            reject('Update Standard ERROR');
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                error = AuthErrorService.httpError(error, "Update Standard.");
                //Promise.reject(error);
              })
          );
        }

        function deleteStandard(id) {
            return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'DELETE',
                            url: API_HGLABS.url + 'standards/' + id,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            }
                        })
                        .then(function(response) {
                            resolve(response.data);
                            Standards = [];
                        })
                        .catch(function(error) {
                            AuthErrorService.httpError(error, "delete Standard.");
                            reject('delete Standard ERROR');
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                error = AuthErrorService.httpError(error, "delete Standard.");
                //Promise.reject(error);
              })
          );
        }

    }
})();

(function() {
    'use strict';

     StandardDialogController.$inject = ["$mdDialog", "$document", "$scope", "$state", "$stateParams", "$rootScope", "$log", "PCAManagementService", "StandardsManagementService", "ProductsManagementService", "UserService", "StandardsAPIService", "$timeout", "NotificationService"];
    angular
        .module('app.standards')
        .controller('StandardDialogController', StandardDialogController);

    /* @ngInject */
    function StandardDialogController($mdDialog, $document , $scope , $state , $stateParams ,$rootScope , $log, PCAManagementService, StandardsManagementService , ProductsManagementService , UserService , StandardsAPIService , $timeout, NotificationService ) {
        var vm = this;

        vm.standard = {};
        vm.standardHistory = [];
        vm.rel_products = [];
        vm.closeDialog = closeDialog;
        vm.selectProduct = selectProduct;
        vm.status = 'idle';  // idle | uploading | complete
        vm.getMargin = getMargin;
        vm.backtostandards = backtostandards;
        vm.UpdateStandardContent = UpdateStandardContent;
        vm.events = [];
        vm.getBackground = getBackground; 
        vm.getStandardColor = getStandardColor;
        vm.Gologin = Gologin;
        
        //////////////// Public Functions //////////////

        init();

        $scope.UpdateStandard = function (e) {

            new Promise(function(resolve){

                $timeout( StartTreatment(), 100);
                resolve(PCAManagementService.checkFile(e)); 

            }).then(function(result){

                if(result.status == true)
                {
                    $log.info('workbook: ' + result.workbook.Props.SheetNames); 
                    if(PCAManagementService.isValidPCAFile(result.workbook))
                    {
                        Promise.resolve(StandardsManagementService.UpdateStandard(result.workbook.Sheets.PCA, vm.standard._id, vm.standard.Infos.Version))
                               .then(function(savedStandard) {
                                   FinishTreatment('Standard Updated Successfully.', 'success') ;
                                   // must change this line to give to this property the Id of the new standard: response of the request
                                   // and Update the Standard in DB.
                                    NotificationService.RightSidebarNotif( 'Standards', 'Update' , vm.standard.Infos.Name + ' Updated to : ' + savedStandard[0].Infos.Name, UserService.getCurrentUser().username);

                                   vm.standard.Infos.HasUpdate = savedStandard[0]._id;
                                   $scope.$apply();
                                   //closeDialog();
                               })
                               .catch(function(err) {
                                   FinishTreatment(err, 'error') ;
                               })
                    }
                    else
                    {
                        $timeout( NotificationService.popAToast('PCA sheet not found in the file.', 5000, 'warning'), 500); 
                        ResetTreatment();
                    }
                }
                else
                {
                    ResetTreatment();
                }

            })
            .catch(function(error)
            {
                ResetTreatment();
            })
        };

        function UpdateStandardContent()
        {
           StandardsAPIService.UpdateStandardContent(vm.standard)
                              .then(function(success)
                              {
                                NotificationService.popAToast('Standard Updated Successfully.', 5000, 'success')
                              })

        }
        // this function is getting reccursively the history of a standard and push it 
        // into vm.standardHistory, and it builds the event objects containing the difference
        // between each update of a standard.

        // Must change the behaviour of this process, to get standards by name, not by id
        
        function getStandardHistory(i)
        {
                var Local_standard = angular.copy($stateParams.standard);
                if(i == 0)
                {
                    var id_hist = vm.standard.Infos.Id_UpdateOf;
                    vm.standardHistory.push(Local_standard);
                    i++;
                }
                else
                {
                    var id_hist = vm.standardHistory[vm.standardHistory.length - 1].Infos.Id_UpdateOf;
                }

                // if id_hist != 0 => their is a history to search for.
                // when the history is built => build events. 
                if(id_hist != 0)
                {
                    // Recursive functions mechanisme, replacing while loop for asynchronous process
                    Promise.resolve(StandardsAPIService.getStandard(id_hist))
                           .then(function(standard) {
                                 vm.standardHistory.push( standard );
                                 i++;
                                 if(standard.Infos.Id_UpdateOf != 0)
                                   { 
                                    getStandardHistory(i);
                                   }
                                 else
                                  {
                                    vm.events = StandardsManagementService.buildHistoryEvents(StandardsManagementService.FormatStandards(vm.standardHistory));
                                  }
                            })
                            .catch(function(error) {
                                    vm.events = StandardsManagementService.buildBrokenEvents(StandardsManagementService.FormatStandards(vm.standardHistory), error);
                            })          
                }
                // if id_hist == 0. their is no more history : it's the first version
                else if( id_hist == 0)
                {
                    vm.events = StandardsManagementService.buildHistoryEvents(StandardsManagementService.FormatStandards(vm.standardHistory));
                }
        }
 
        // Treatment Status 

        function StartTreatment() {  
            
            vm.status = 'uploading';
        }

        function FinishTreatment(message, type) {  
                
            vm.status = 'idle';
             // pop a toast telling users about the how to:
            NotificationService.popAToast(message , 5000, type)
                               .catch(function(error){});
        }

        function ResetTreatment() {  

           NotificationService.popAToast('Loading File ERROR.', 5000, 'error')
                              .catch(function(error){});  
            vm.status = 'idle';
        }

        function closeDialog() {
               $rootScope.$broadcast('StandardUpdated', '');
        }
 
        function init() {

            if($stateParams.standard == null)
            {
                $state.go('triangular.standards-manage');
            }
            else
            {
                angular.copy($stateParams.standard , vm.standard);
                
                // start with 0 to tell the first function call 
                getStandardHistory(0);
                Promise.resolve(StandardsManagementService.getrelatedProducts(vm.standard))
                       .then(function(products){
                                vm.rel_products = products;
                                $scope.$apply();
                });
             }
        }

        function selectProduct($event, product) { 
            ProductsManagementService.TagProduct(product)  
                    .then(function(TagedProduct) { 
                            $mdDialog.show({
                                title: 'Product',
                                controller: 'ProductDialogController',
                                controllerAs: 'vm',
                                templateUrl: 'app/laboratory/products/product.dialog.template.html',
                                targetEvent: $event,
                                parent: angular.element($document.body),
                                locals: {
                                    product: TagedProduct
                                },
                                clickOutsideToClose: true
                            });
                    });
        }

        function getMargin(Chapter)
        {
             return Chapter.split(".").length - 1 + '0';
        }

        function backtostandards()
        {
            $state.go('triangular.standards-manage');
        }

        function getStandardColor(standard)
        {
            if(!angular.equals({}, standard))
            {
                if(standard.Infos.HasUpdate == 0)
                {
                    return 'light-green:400';
                }
                else 
                {
                    return "deep-orange:500";
                }
            }
        }
        function getBackground()
        {
            return 'background: url(assets/images/backgrounds/material-backgrounds/mb-bg-08.jpg) no-repeat; background-size: cover;';
        }

        function Gologin(){
            $state.go('Authentication.login');
        }

     }
    
})();


(function() {
    'use strict';

    StandardsManagementService.$inject = ["$log", "StandardsAPIService", "ProductsAPIService", "PCAManagementService", "ObjectDiff", "NotificationService", "$timeout"];
    angular
        .module('app.standards')
        .factory('StandardsManagementService', StandardsManagementService);

    /* @ngInject */
    function StandardsManagementService( $log, StandardsAPIService , ProductsAPIService , PCAManagementService , ObjectDiff , NotificationService, $timeout) {
        var service = {
            PCAtoStandards: PCAtoStandards,
            FormatStandards:FormatStandards,
            getStandardsList:getStandardsList,
            UpdateStandard: UpdateStandard,
            buildHistoryEvents:buildHistoryEvents,
            getrelatedProducts:getrelatedProducts,
            diffStandards:diffStandards,
            buildBrokenEvents:buildBrokenEvents
        };

        return service;

        function getStandardsList()
        {
            StandardsAPIService.getStandardsList()
                               .then(function(standards) {
                                   var AllStandards = FormatStandards(standards) ; 
                                   resolve(AllStandards);
                               });
        }

        function FormatStandards(Standards)
        {
            for(var i = 0; i < Standards.length; i++)
            {
                Standards[i].Designations = angular.fromJson(Standards[i].Designations);
            }
            return TagStandards(Standards);
        }

        function TagStandards(FStandards)
        {
            for(var i = 0; i < FStandards.length; i++)
            {
                for(var j = 0; j < FStandards.length; j++)
                {
                    if(FStandards[i]._id ==  FStandards[j].Infos.Id_UpdateOf )
                    {
                        FStandards[i].Infos.HasUpdate = FStandards[j]._id + ' : ' + FStandards[j].Infos.Name;
                        break;
                    }  
                    else
                    {
                        FStandards[i].Infos.HasUpdate = 0;
                    }
                }  
            }
            return FStandards;
        }
        // This function is used internaly and externaly. 
        function PCAtoStandards(PCA, _id, Version) {

            var Stkeys  = PCAManagementService.getStandardKeys(PCA); 
            var keys = Object.keys(PCA);
            var savedStandards = [];

            for(var i = 0 ; i < Stkeys.length; i++)
            {
                var Standard = {
                    Infos: 
                    {
                        Name: PCA[Stkeys[i]].v,
                        Id_UpdateOf: _id,
                        Version: Version
                    },
                    Designations: []
                };
                
                var Designations = PCAManagementService.getDesignationsList(PCA, keys, Stkeys, Stkeys[i]);

                for(var j =0 ; j < Designations.Designations.length ; j++)
                {
                    var point = { _id : j , Chapters: '', DesignationTitle: '' , Standard : '' , Directive: '' , Category: '', SubCategory: ''};
                    point.Chapters = Designations.Designations[j].Chapters;
                    point.DesignationTitle = Designations.Designations[j].DesignationTitle;
                    point.Standard = Designations.Designations[j].Standard;
                    point.Directive = Designations.Designations[j].Directive;
                    point.Category = Designations.Designations[j].Category;
                    point.SubCategory = Designations.Designations[j].SubCategory;

                    Standard.Designations.push(point);
                } 

                savedStandards.push( Promise.resolve(storeStandard(Standard))
                       .then(function(savedStandard){
                                return savedStandard;
                        })
                       .catch(function(err) {
                                return Promise.reject(err);
                        }) 
                    );
           } 
           return Promise.all(savedStandards);
        }
 
        function storeStandard(Standard)
        {
            return Promise.resolve(

                StandardsAPIService.storeStandardsList(Standard)
                                   .then(function(savedStandard){
                        return Promise.resolve(savedStandard); 
                })
                .catch(function(err) {
                        return Promise.reject(err);
                 })
            );
        }

        function UpdateStandard(PCA,_id, Version) {
 
            var Stkeys  = PCAManagementService.getStandardKeys(PCA); 
            if( Stkeys.length ==  1)
            {
                return Promise.resolve(PCAtoStandards(PCA,_id, Version + 1))
                    .then(function(savedStandard){
                            return Promise.resolve(savedStandard); 
                         })
                    .catch(function(err) { 
                            return Promise.reject(err); 
                            $log.warn('UpdateStandard Error : ' + err);
                        }) 
            }
            else
            {
                return Promise.reject('Error: PCA Sheet should contain a single Standard.'); 
            }
        }

        function buildHistoryEvents(standardHistory)
        {
            var events = [];

            for(var i = 0 ; i < standardHistory.length ; i++)
            {
                var event = {
                            title: '',
                            subtitle: 'Diffs: ',
                            date: '',
                            image: 'assets/images/laboratory/standard2-avatar.png',
                            content: '<div layout="row" layout-align="start center"> <img src="assets/images/laboratory/standard-avatar.png" alt="product-avatar" width="40"/>'  + 'Version : ' + standardHistory[i].Infos.Version + '</div>', //<md-tooltip>' + standardHistory[i].createdAt + '</md-tooltip>',
                            palette: 'amber:400'
                        };                

                if(i != standardHistory.length - 1)
                {
                    var diffValueChangesp = diffStandards( angular.copy(standardHistory[i+1]) , angular.copy(standardHistory[i]) );   

                    var diffValueChangesm = diffStandards( angular.copy(standardHistory[i]) , angular.copy(standardHistory[i+1]) );

                    //var diffValueChanges = ObjectDiff.toJsonDiffView(diff); 
                }
                else
                {
                    var diffValueChangesp = [{Chapters: ' ' , DesignationTitle: 'Creation of standard.'}];
                    var diffValueChangesm = [{Chapters: ' ' , DesignationTitle: '*-*-*-*-*-*-*-*-*-*-*-*-*'}];
                }

                event.title = standardHistory[i].Infos.Name  ;
                event.date  = standardHistory[i].createdAt;
                
                event.subtitle = createSubtitle(diffValueChangesp, diffValueChangesm);
                events.push(event);
            }
            return events;
        }

        function buildBrokenEvents( standardHistory, error)
        {
           var events = buildHistoryEvents(standardHistory);
           var event = {
                            title: error,
                            subtitle: '',
                            date: '',
                            image: 'assets/images/laboratory/standard2-avatar.png',
                            content: '<h1>'+ error.status +'</h1>',
                            palette: 'deep-orange:500'
                        };
           events.push(event);
           return events;     
        }
        // Obj1 is the References, Obj2 is the tested object for diffs
        function diffStandards(Obj1 , Obj2)
        {
            var diff = [];
            for(var i=0 ; i < Obj1.Designations.length ; i++)
            {
                for( var j=0 ; j < Obj2.Designations.length ; j++)
                {
                    if(Obj2.Designations[j] != undefined)
                    {
                        //Comparaison between Chapters and Titles of Designations 
                        if( Obj1.Designations[i].DesignationTitle == Obj2.Designations[j].DesignationTitle && Obj1.Designations[i].Chapters == Obj2.Designations[j].Chapters)
                       {
                        delete Obj2.Designations[j];
                        break;
                       }
                   }
                }
            }
            diff = deleteNullProp(Obj2);
            return diff;
        }

        function deleteNullProp(Obj2)
        {
            var diff = [];
            for(var i=0 ; i < Obj2.Designations.length ; i++)
            {
                if( Obj2.Designations[i] != undefined)
                {
                   diff.push( Obj2.Designations[i] );
                }
            }
            return diff;    
        }

        function createSubtitle(diffValueChangesp, diffValueChangesm)
            {
                var subtitle = 'Differences: ';
                for( var i = 0 ; i < diffValueChangesp.length ; i++ )
                {
                   subtitle = subtitle + '<div class="md-list-item-text"> <h4 style=" color: green;"> (+)' + diffValueChangesp[i].Chapters + ' : ' + diffValueChangesp[i].DesignationTitle + '</h4> </div>';
                }
                for( var j = 0 ; j < diffValueChangesm.length ; j++ )
                {
                   subtitle = subtitle + '<div class="md-list-item-text"> <p style=" color: red;"> (-)' + diffValueChangesm[j].Chapters + ' : ' + diffValueChangesm[j].DesignationTitle + '</p> </div>';
                }
                return subtitle;
            }

        function getrelatedProducts(Standard)
        {
            var rel_products = [];
            return new Promise(function(resolve){
                resolve(ProductsAPIService.getProducts()); 
            }).then(function(products){
                products =  FormatProducts(products);

                for(var i = 0 ; i < products.length ; i++ )
                {
                    if( Object.keys(products[i].ProductJSON.Standards).includes(Standard.Infos.Name))
                    {
                        //products[i].ProductInfo._id = products[i]._id;
                        //rel_products.push(products[i].ProductInfo);
                        rel_products.push(products[i]);
                    }
                }
                 return Promise.resolve(rel_products);
            }); 
        }
 
        function FormatProducts(Products)
        {
            for(var i = 0; i < Products.length; i++)
            {
                Products[i].ProductJSON = angular.fromJson(Products[i].ProductJSON);
            }
            return Products;
        }
 
    }

})();

(function() {
    'use strict';

    ProductsController.$inject = ["$http", "ProductsAPIService", "ProductsManagementService", "PCAManagementService", "$log", "$scope", "$mdToast", "$state", "$mdDialog", "$document", "UserService", "NotificationService", "triLoaderService", "triMenu"];
    angular
        .module('app.products')
        .controller('ProductsController', ProductsController);

    /* @ngInject */
    function ProductsController($http, ProductsAPIService, ProductsManagementService, PCAManagementService , $log, $scope ,$mdToast,$state, $mdDialog, $document,  UserService, NotificationService, triLoaderService, triMenu) {
        var vm = this;

        vm.products = [];
        vm.selectProduct = selectProduct;
        vm.deleteProduct = deleteProduct;
        vm.getProductColor = getProductColor;
        vm.GenerateDashboard = GenerateDashboard;
        vm.GenerateQualifSynthesis = GenerateQualifSynthesis;
        vm.Gologin = Gologin;
        vm.showProgress = true;
        vm.status = 'idle';  // idle | uploading | complete

        var productsMenu = triMenu.getMenu('Products');

        function init() { 

            getProducts();
             // pop a toast telling users about the how to:
            NotificationService.popAToast('Products Management Service.', 5000, 'info');
        }
 
        function getProducts(){
            
            vm.products = [];
            vm.showProgress = true;

            new Promise(function(resolve){
                resolve(ProductsAPIService.getProducts()); 
            }).then(function(products){
                products = ProductsManagementService.FormatProducts(products);

                if(products.length == 0)
                {
                    vm.showProgress = false;
                }
                for(var i = 0 ; i < products.length ; i++)
                {
                    ProductsManagementService.TagProduct(products[i])  
                                             .then(function(TagedProduct) {

                                                     vm.products.push(TagedProduct);
                                                     $scope.$apply();
                                                     if(vm.products.length == products.length )
                                                     {
                                                        vm.showProgress = false;
                                                        updateMenuBadge();
                                                        $scope.$apply();
                                                     }
                                             })
                                             .catch(function(error){
                                                vm.showProgress = false;
                                                // can't tag the product
                                             })                     
                }

            })
            .catch(function (error){
                NotificationService.popAToast("Can't get product list.", 5000, 'warning');
            })
        }


        function selectProduct($event, product) {
            $mdDialog.show({
                title: 'Product',
                controller: 'ProductDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/laboratory/products/product.dialog.template.html',
                targetEvent: $event,
                parent: angular.element($document.body),
                locals: {
                    product: product
                },
                clickOutsideToClose: true
            });
        }

        function deleteProduct($event, product) { 

            askdialog('Confirm !', ' Do you want to delete the product ?')
                    .then(function(response){
                        new Promise(function(resolve){
                            resolve(ProductsAPIService.deleteProduct(product._id)); 
                        }).then(function(deletedproduct){
                            NotificationService.RightSidebarNotif( 'Products', 'Delete' , deletedproduct.ProductInfo.References, UserService.getCurrentUser().username);
                            NotificationService.popAToast('Product '+ deletedproduct.ProductInfo.References+ ' deleted successfully: ', 5000, 'success');  
                            var Idx = vm.products.indexOf(product);
                            if(Idx != -1)
                            {
                                vm.products.splice(Idx, 1);
                            } 
                        }).catch(function(err) {
                            NotificationService.popAToast('Error: ' + err , 5000, 'error');  
                        })
            })
            .catch(function(error){

            })

        }
 
        function ProductsCount() {
            var count = 0;
          
            count = vm.products.length;

            return count;
        }

        function getProductColor(product)
        {
            var UpdateCount = 0;
            var standards = Object.keys(product.ProductJSON.Standards);
            for(var i = 0 ; i < standards.length; i++)
            {
                if(product.ProductJSON.Standards[standards[i]].Updates != undefined)
                        UpdateCount = UpdateCount + product.ProductJSON.Standards[standards[i]].Updates.length ;
                else
                   {
                        return 'grey:300'; 
                        break;
                   }     
            }

            if(UpdateCount == 0)
            {
                return 'light-green:400';
            }
            else if(UpdateCount < 10)
            {
                return 'deep-orange:'+ UpdateCount + '00';
            }
            else 
            {
                return 'deep-orange:900';
            }
            $scope.apply();
        }    

 
         function updateMenuBadge() {
            productsMenu.badge = ProductsCount();
        }
 
        function GenerateDashboard(product)
        {
            vm.status = 'loading';

            if((UserService.getCurrentUser()) )
            { 
                if(product.ProductInfo.LockedBy._id == (UserService.getCurrentUser())._id || product.ProductInfo.LockedBy._id == '')
                {
                    if( UserService.getCurrentUser().roles != 'ANONYMOUS')
                    {
                            ProductsAPIService.LockProduct(product)
                                              .then(function(LockedProduct){
                                                    LockedProduct = ProductsManagementService.FormatProducts([LockedProduct])[0];
                                                    ProductsManagementService.TagProduct(LockedProduct)  
                                                                             .then(function(TagedProduct) {
                                                                                    $state.go('triangular.products-dashboard', {product: LockedProduct});
                                                                              });
                                              })
                                              .catch(function(error){
                                                    // can't lock the file
                                              })                                  
                    }
                    else
                    {
                        $state.go('triangular.products-dashboard', {product: product});
                    }
                }
                else
                {
                    NotificationService.popAToast(product.ProductInfo.References+ " product is locked. It's actualy used by: " + product.ProductInfo.LockedBy.username , 5000, 'warning');  
                }
            }
            else
            {
                NotificationService.popAToast( "You can't access to : " +  product.ProductInfo.References , 5000, 'security');  
            }
        }
        
        // init
        init();

        function GenerateQualifSynthesis(product)
        {
            PCAManagementService.JsontoPCA(product, 'ALL');
        }
        // broadcast update products 

        $scope.$on('GetProducts', function() {
            init();
        });

        $scope.$on('UpdateProduct', function(event, product) {
            for(var i = 0 ; i < vm.products.length ; i++)
            {
                var j = 0;
                if( product != null && vm.products[i] != null)
                {
                        if(vm.products[i]._id == product._id)
                        {
                            j = i;
                            product = ProductsManagementService.FormatProducts([product]);
                            ProductsManagementService.TagProduct(product[0])  
                                                     .then(function(TagedProduct) {
                                                             vm.products[j] = TagedProduct ;
                                                             $scope.$apply();
                                                        })
                            break;
                        } 
                }

            }
        });
 

        $scope.$on('NewProduct', function(event, product) 
        {
            product = ProductsManagementService.FormatProducts([product]);
            ProductsManagementService.TagProduct(product[0])  
                                     .then(function(TagedProduct) {
                                            for(var i = 0 ; i < vm.products.length ; i++)
                                            {
                                                if( TagedProduct != null && vm.products[i] != null)
                                                {
                                                        if(vm.products[i]._id == TagedProduct._id)
                                                        {   
                                                            break;
                                                        } 
                                                        else if(vm.products[i]._id != TagedProduct._id && i == vm.products.length -1)
                                                        {
                                                            vm.products.push(TagedProduct) ;
                                                            $scope.$apply();
                                                        }
                                                }
                                            }
                                     })
        });

        $scope.$on('ProductDelete', function(event, product) {
            for(var i = 0 ; i < vm.products.length ; i++)
            {
                var j = 0;
                if( product != null && vm.products[i] != null)
                {
                        if(vm.products[i]._id == product._id)
                        {   
                            vm.products.splice(i, 1);
                        } 
                }
            }
        });


        function askdialog(message, content) {
            return $mdDialog.show(
                $mdDialog.confirm()
                .title(message)
                .textContent(content)
                .cancel('NO')
                .ok('YES')
            ).then(function(choice){
                return choice;
            })
        }

        function Gologin(){
            $state.go('Authentication.login');
        }
    }
})();
(function() {
    'use strict';

    config.$inject = ["$stateProvider", "triMenuProvider"];
    angular
        .module('app.products')
        .config(config);

    /* @ngInject */
    function config($stateProvider, triMenuProvider) {
        $stateProvider
        .state('triangular.products-manage', {
            url: '/products',
            templateUrl: 'app/laboratory/products/products.tmpl.html',
            controller: 'ProductsController',
            controllerAs: 'vm',
            data: {
                layout: {
                    toolbarSize: 'default',
                    toolbarShrink: true,
                    contentClass: 'full-image-background mb-bg-03',
                    sideMenuSize: 'icon',
                    footer: false
                },
                permissions: {
                    only: ['viewProducts']
                }
            }
        })
        .state('triangular.products-add', {
            url: '/products-manage',
            templateUrl: 'app/laboratory/products/add_product/add_product.tmpl.html',
            controller: 'AddProductController',
            controllerAs: 'vm',
            data: {
                layout: {
                    toolbarSize: 'default',
                    toolbarShrink: true,
                    contentClass: 'full-image-background mb-bg-31',
                    toolbarClass: 'full-image-background mb-bg-31',
                    sideMenuSize: 'icon',
                    footer: false
                },
                permissions: {
                    only: ['viewAddProducts']
                }
            }
        })
        .state('triangular.products-dashboard', {
            url: '/products-dashboard',
            templateUrl: 'app/laboratory/products/dashboard/products.dashboard.template.html',
            params: {
                 product: null
            },
            controller: 'productsDashboardController',
            controllerAs: 'vm',
            data: {
                layout: {
                    toolbarSize: 'default',
                    toolbarShrink: false,
                    sideMenuSize: 'off',
                    footer: false
                },
                permissions: {
                    only: ['viewDashboard']
                }
            }
        })

        triMenuProvider.addMenu({
            id: 'Products',
            badge: 5,
            name: 'Products',
            icon: 'zmdi zmdi-bookmark-outline',
            type: 'dropdown',
            priority: 1,
            permission: 'viewProducts',
            children: [{
                name: 'Manage Products',
                icon: 'zmdi zmdi-view-module',
                state: 'triangular.products-manage',
                type: 'link',
                permission: 'viewProducts'
            },
            {
                name: 'Add',
                icon: 'fa fa-plus-square',
                state: 'triangular.products-add',
                type: 'link',
                permission: 'viewAddProducts'
            }]
        });
    }
})();




(function() {
    'use strict';

    ProductsAPIService.$inject = ["$http", "API_HGLABS", "$log", "$mdToast", "AuthenticationService", "AuthErrorService", "$state", "$cookies"];
    angular
        .module('app.products')
        .factory('ProductsAPIService', ProductsAPIService);

    /* @ngInject */
    function ProductsAPIService($http,API_HGLABS, $log, $mdToast, AuthenticationService, AuthErrorService , $state, $cookies) {
        var service = {
            getProducts: getProducts,
            getProductbyid: getProductbyid,
            createProduct: createProduct,
            deleteProduct:deleteProduct,
            keepAlive:keepAlive,
            Updateproduct:Updateproduct,
            LockProduct: LockProduct,
            UnlockProducts: UnlockProducts
        };

        return service;

        function getProducts() {
                return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'GET',
                            url: API_HGLABS.url + 'products' ,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            }
                        })
                        .then(function(response) {
                            resolve(response.data);
                        })
                        .catch(function(error) {
                            AuthErrorService.httpError(error, "Product list.");
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                error = AuthErrorService.httpError(error, "Product list.");
                //Promise.reject(error);
              })
          );
        }

        function getProductbyid(id) {
                return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'GET',
                            url: API_HGLABS.url + 'products/' + id ,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            }
                        })
                        .then(function(response) {
                            resolve(response.data);
                        })
                        .catch(function(error) {
                            error.status = 4040;
                            error = AuthErrorService.httpError(error, "enable to get Product: " + id);
                            reject(error);
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                error = AuthErrorService.httpError(error, 'get Product: ' + id);
                return Promise.reject(error);
              })
          );
        }

        function keepAlive(id) {
                return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'GET',
                            url: API_HGLABS.url + 'products/keepalive/' + id ,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            }
                        })
                        .then(function(response) {
                            resolve(response.data);
                        })
                        .catch(function(error) {
                            error.status = 4040;
                            error = AuthErrorService.httpError(error, "enable to keep alive product: " + id);
                            reject(error);
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                error = AuthErrorService.httpError(error, 'keep alive product: ' + id);
                return Promise.reject(error);
              })
          );
        }

        function deleteProduct(id) {
                return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'DELETE',
                            url: API_HGLABS.url + 'products/' + id,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            }
                        })
                        .then(function(response) {
                            resolve(response.data);
                        })
                        .catch(function(error) {
                            AuthErrorService.httpError(error, "Delete Product: "+ id);
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                error = AuthErrorService.httpError(error, "Delete Product: " + id);
                //Promise.reject(error);
              })
          );
        }
 
        function createProduct(ProductJSON) {
            return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'POST',
                            url: API_HGLABS.url + 'products' ,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            },
                            data: ProductJSON
                        })
                        .then(function(response) {
                            resolve(response.data);
                        })
                        .catch(function(error) {
                            reject(AuthErrorService.httpError(error, 'Add product.'));
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                AuthErrorService.httpError(error, 'Add Product.');
              })
          );
        }

        function Updateproduct(ProductJSON) {
            return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'PUT',
                            url: API_HGLABS.url + 'products' ,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            },
                            data: ProductJSON
                        })
                        .then(function(response) {
                            resolve(response);
                        })
                        .catch(function(error) {
                            reject(AuthErrorService.httpError(error, 'Update product.'));
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                AuthErrorService.httpError(error, 'Update product.');
              })
          );
        }
 
         function LockProduct(ProductJSON) {
            return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'PUT',
                            url: API_HGLABS.url + 'products/lock' ,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            },
                            data: ProductJSON
                        })
                        .then(function(response) {
                            resolve(response.data);
                        })
                        .catch(function(error) {
                            if(error.data.message)
                            {
                               reject(AuthErrorService.httpError(error, error.data.message));   
                            }
                            else
                            {
                               reject(AuthErrorService.httpError(error, 'Locking Product Error.'));   
                            }
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                AuthErrorService.httpError(error, 'Lock product.');
              })
          );
        }

         function UnlockProducts() {
            return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'PUT',
                            url: API_HGLABS.url + 'products/unlock' ,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            }
                        })
                        .then(function(response) {
                            resolve(response);
                        })
                        .catch(function(error) {
                            reject(AuthErrorService.httpError(error, 'unlock products.'));
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                AuthErrorService.httpError(error, 'unlock products.');
              })
          );
        }

    }

})();

(function() {
    'use strict';

    ProductDialogController.$inject = ["product", "UserService", "$scope", "$rootScope", "$state", "ProductsManagementService", "DirectivesAPIService", "StandardsAPIService", "ProductsAPIService", "NotificationService", "$mdDialog"];
    angular
        .module('app.products')
        .controller('ProductDialogController', ProductDialogController)
        .filter('stdName', function () {
          return function (input) {
              return input.replace('Standard requirements', '');
          };
        });

    /* @ngInject */
    function ProductDialogController(product, UserService, $scope, $rootScope ,  $state , ProductsManagementService , DirectivesAPIService , StandardsAPIService , ProductsAPIService , NotificationService , $mdDialog) {
        var vm = this;
 
        vm.closeDialog = closeDialog;
        vm.getStandardColor = getStandardColor;
        vm.ProductHistory = [];
        vm.events = [];
        vm.product = '';
        vm.UpdatesCount = ''; 
        vm.UpdateProductStd = UpdateProductStd;
        vm.getProductColor = getProductColor;
        vm.Gologin = Gologin;
        vm.AddStd = AddStd;
        vm.deleteStd = deleteStd;
        vm.AllStandards = [];
        vm.DuplicateProduct = DuplicateProduct;

        vm.directives = [];
        vm.addDirective = addDirective;
        vm.deleteDirective = deleteDirective;

        vm.ProductInfo = angular.copy( product.ProductInfo);
        vm.ProductInfo.CreatedBy = UserService.getCurrentUser().username;


        init();

        vm.columns = [{
            title: 'Title',
            field: 'DesignationTitle',
            sortable: true
        },{
            title: 'Standard',
            field: 'Standard',
            sortable: true
        },{
            title: 'Chapters',
            field: 'Chapters',
            sortable: true
        },{
            title: 'Reports',
            field: 'Reports',
            sortable: true
        },{
            title: 'Directive',
            field: 'Directive',
            sortable: true
        },{
            title: 'Comments',
            field: 'Comments',
            sortable: false
        },{
            title: 'Status',
            field: 'Status',
            sortable: true
        }];

        vm.statuses = [
            {value: 1, text: 'P'},
            {value: 2, text: 'F'},
            {value: 3, text: 'NA'},
            {value: 4, text: ' '}
          ]; 
 
        vm.query = {
            order: 'Standard',
            limit: 5,
            page: 1
        };

        vm.events = [ ];

        vm.status = 'idle';  // idle | uploading | complete
 
        function closeDialog() {
                $mdDialog.hide();
        }

        function getStandardColor(standard)
        {
            if(standard.Updates.length == 0)
            {
                return 'green:300';
            }
            else if(standard.Updates.length < 10)
            {
                return 'deep-orange:'+ standard.Updates.length + '00';
            }
            else 
            {
                return 'deep-orange:900';
            }
        }

        function getProductColor()
        {
            var UpdateCount = 0;
            var standards = Object.keys(vm.product.ProductJSON.Standards);
            for(var i = 0 ; i < standards.length; i++)
            {
                UpdateCount = UpdateCount + vm.product.ProductJSON.Standards[standards[i]].Updates.length ;
            }

            if(UpdateCount == 0)
            {
                return 'light-green:400';
            }
            else if(UpdateCount < 10)
            {
                return 'deep-orange:'+ UpdateCount + '00';
            }
            else 
            {
                return 'deep-orange:900';
            }
        } 

         function DuplicateProduct()
        {
            var duplicateProduct =  angular.copy( vm.product );
            duplicateProduct.ProductInfo = vm.ProductInfo;

            duplicateProduct.ProductInfo.Id_UpdateOf = '0';
            duplicateProduct.ProductInfo.LastModifBy = UserService.getCurrentUser().username;
            duplicateProduct.ProductInfo.LockedBy.username = '';
            duplicateProduct.ProductInfo.LockedBy._id = '';
            duplicateProduct.ProductInfo.Version = 0;
            duplicateProduct.ProductInfo.hasAnUpdate = '0';
            delete duplicateProduct.createdAt ;
            delete duplicateProduct._id ;

            ProductsManagementService.addNewProduct(duplicateProduct)
                                     .then(function(success){
                                                NotificationService.RightSidebarNotif( 'Products', 'Add' , duplicateProduct.ProductInfo.References , UserService.getCurrentUser().username);
                                                NotificationService.popAToast('Duplicate Product Created successfully', 5000, 'success');
                                                $rootScope.$broadcast( 'GetProducts');
                                     })
                                     .catch(function(err){

                                     })
        }

        $scope.TreatImage = function (e) {
           
            var reader = new FileReader();
            var file = e.files[0];

            if(file.size < 500000)
            {
              reader.readAsDataURL(file);
            }
            else 
            {
              NotificationService.popAToast('Error: Image size must be under 100 kB.', 5000, 'warning');
            }

            reader.onerror = function (){
                        reader.abort();
                        new DOMException('Problem parsing input file.');
                        result.status = false;
                        resolve( result );
            };

            reader.onload = function () {
                        vm.ProductInfo.ImageBuffer = reader.result; 
                        $scope.$apply();         
            };
        };

        function init()
        {
             vm.product = product;
             vm.UpdatesCount = ProductsManagementService.isUptodate(product); 
             getDirectives();

             if(vm.product.directives)
             {
                vm.product.directives = angular.fromJson(vm.product.directives);
             }

            // start with 0 to tell the first function call 
            getProductHistory(0);

            return new Promise( function(resolve){ 
                resolve(StandardsAPIService.getStandardsList()); 
            })
            .then(function(AllStandards) {
                vm.AllStandards = AllStandards;
            });
        }

        function UpdateProductStd()
        {
             ProductsManagementService.UpdateProductStd(vm.product)
                                     .then(function(AddedProduct) {
                                        AddedProduct.ProductJSON = angular.fromJson(AddedProduct.ProductJSON);
                                        ProductsManagementService.TagProduct(AddedProduct)
                                                                 .then(function(TagedProduct) {
                                                                    vm.product.ProductInfo.hasAnUpdate = TagedProduct._id;
                                                                    saveproduct();
                                                                    vm.product = TagedProduct;
                                                                    $rootScope.$broadcast( 'GetProducts');
                                                                    $scope.$apply();
                                                                })
                               })
        }

        function AddStd(std)
        {
            if(std)
            {
                 ProductsManagementService.AddStd(vm.product, std)
                                          .then(function(res){
                                             vm.product = res;
                                             saveproduct();
                                             vm.UpdatesCount = ProductsManagementService.isUptodate(vm.product); 
                                             //vm.ProductHistory = [];
                                             //getProductHistory(0);
                                             $rootScope.$broadcast( 'UpdateProduct', vm.product);
                                           })
                                          .catch(function(err)
                                          {
                                            NotificationService.popAToast('Standard already exists in the product.', 5000, 'error');
                                          })              
            }
            else
            {
                NotificationService.popAToast('No selected standard. Please choose a standard to add.', 5000, 'warning');
            }
        }

        function deleteStd(stdName)
        {
            if(stdName)
            {
              NotificationService.popAToast('All the tests, comments, status related to the product will be deleted ! Are you sure to delete the standard : '+ stdName + '?', 30000, 'ask')
                       .then(function(response){
                        if(response == true)
                        {
                         ProductsManagementService.deleteStd(vm.product, stdName)
                                                  .then(function(res){
                                                     vm.product = res;
                                                     saveproduct();
                                                     vm.UpdatesCount = ProductsManagementService.isUptodate(vm.product);
                                                     //vm.ProductHistory = [];
                                                     //getProductHistory(0); 
                                                     $rootScope.$broadcast( 'UpdateProduct', vm.product);
                                                   })
                                                  .catch(function(err)
                                                  {
                                                    NotificationService.popAToast('This Standard is not related to this product.', 5000, 'error');
                                                  })   
                        }
                       })
                      .catch(function(error){

                      })           
            }
            else
            {
                NotificationService.popAToast('No selected standard. Please choose a standard to delete.', 5000, 'warning');
            }
        }

        function addDirective(directive)
        {
          if(vm.product.directives.length == 0)
          {
                  vm.product.directives.push(directive);
                  saveproduct();           
          }
          else
          {
              var S =  vm.product.directives.length;
              for(var i = 0 ; i < vm.product.directives.length ; i++)
              {
                if(vm.product.directives[i]._id == directive._id)
                {
                  NotificationService.popAToast('This directive is already added to product.', 5000, 'warning');
                  break;
                }
                if(i == S -1 && vm.product.directives[i]._is != directive._id)
                {
                  vm.product.directives.push(directive);
                  saveproduct();
                  break;
                }
              }
          }
        }

        function deleteDirective(directive)
        {
            vm.product.directives.splice(vm.product.directives.indexOf(directive), 1);
            saveproduct();
        }    
 
        function getDirectives()
        {
            DirectivesAPIService.getDirectives()
                                .then(function(directives){
                                    vm.directives = directives;
                                }) 
        }

        function saveproduct()
        {
           return Promise.resolve( ProductsManagementService.Updateproduct(vm.product)
                                     .then(function(product){
                                           NotificationService.RightSidebarNotif( 'Products', 'Update' , product.ProductInfo.References , UserService.getCurrentUser().username);
                                           NotificationService.popAToast('Product saved successfully', 5000, 'success');
                                           return Promise.resolve(true);
                                     }).catch(function(err){
                                           NotificationService.popAToast('Product saving Error', 5000, 'error');
                                           return Promise.reject(false);
                                     })
                                  );              
        }

        function Gologin(){
            closeDialog();
            $state.go('Authentication.login');
        }

        function askdialog(message, content) {
            return $mdDialog.show(
                $mdDialog.confirm()
                .title(message)
                .textContent(content)
                .cancel('NO')
                .ok('YES')
            ).then(function(choice){
                return choice;
            })
        }

        function getProductHistory(i)
        {
                if(i == 0)
                {
                    var id_hist = vm.product.ProductInfo.Id_UpdateOf;
                    vm.ProductHistory.push(vm.product);
                    i++;
                }
                else
                {
                    var id_hist = vm.ProductHistory[vm.ProductHistory.length - 1].ProductInfo.Id_UpdateOf;
                }

                // if id_hist != 0 => their is a history to search for.
                // when the history is built => build events. 
                if(id_hist != '0')
                {
                    // Recursive functions mechanisme, replacing while loop for asynchronous process
                    Promise.resolve(ProductsAPIService.getProductbyid(id_hist))
                           .then(function(product) {
                                 vm.ProductHistory.push(product);
                                 i++;
                                 if(product.ProductInfo.Id_UpdateOf != '0')
                                   { 
                                    getProductHistory(i);
                                   }
                                 else
                                  {
                                    vm.events = ProductsManagementService.buildHistoryEvents(ProductsManagementService.FormatProducts(vm.ProductHistory));
                                  }
                            })
                            .catch(function(error) {
                                    vm.events = ProductsManagementService.buildBrokenEvents(ProductsManagementService.FormatProducts(vm.ProductHistory), error);
                            })          
                }
                // if id_hist == 0. their is no more history : it's the first version
                else if( id_hist == 0)
                {
                    vm.events = ProductsManagementService.buildHistoryEvents(ProductsManagementService.FormatProducts(vm.ProductHistory));
                }
        }

        $scope.$on('UpdateProduct', function(event, product)
        {
           if(product._id == vm.product._id)
           {
              product = ProductsManagementService.FormatProducts([product]);
              ProductsManagementService.TagProduct(product[0])  
                                       .then(function(TagedProduct) {
                                            vm.product = TagedProduct;
                                       })     
           }
        });

    }
 })();
(function() {
    'use strict';

    ProductsManagementService.$inject = ["$log", "PCAManagementService", "ProductsAPIService", "StandardsManagementService", "StandardsAPIService", "NotificationService", "UserService"];
    angular
    .module('app.products')
    .factory('ProductsManagementService', ProductsManagementService);

    // This service is implementing tools used to manage products.
    /* @ngInject */
    function ProductsManagementService($log,PCAManagementService , ProductsAPIService, StandardsManagementService , StandardsAPIService , NotificationService , UserService) {
        var service = {
            PCAtoProduct: PCAtoProduct,
            FormatProducts: FormatProducts,
            TagProduct:TagProduct,
            ProductStatus: ProductStatus,
            isUptodate:isUptodate,
            UpdateProductStd:UpdateProductStd,
            addNewProduct:addNewProduct,
            Updateproduct:Updateproduct,
            AddStd: AddStd,
            keepAlive: keepAlive,
            deleteStd: deleteStd,
            buildBrokenEvents : buildBrokenEvents,
            buildHistoryEvents: buildHistoryEvents
        };

        return service; 

         /**
         * keepAlive: function notifying the server that the test of a product is still active
         * @property {id: 'Id Object'} : Id of the product in the test
         * @returns {promise (UserObj)}
         * UserObj = {User}
         */
        function keepAlive(id)
        {
           return Promise.resolve( ProductsAPIService.keepAlive(id)
                              .then(function(success){
                                    return success;
                              })
                              .catch(function(err)
                                {
                                    return err;
                                })
                        );
        }

         // Extract Standard Struct and store them into DB
         /* keepAlive: function notifying the server that the test of a product is still active
         * @property {id: 'Id Object'} : Id of the product in the test
         * @returns {promise (UserObj)}
         * UserObj = {User}
         */
        function PCAtoProduct(PCA, Infos) {

            var JsonPCA = PCAManagementService.PCAtoJson(PCA);
            var currentUser = UserService.getCurrentUser();
            var Product = {
                        ProductInfo: Infos,
                        ProductJSON: ExtractUsedStandards(JsonPCA)
            };

            return Promise.resolve( 
                    verifyProduct(Product).then(function(res){
                    return Promise.resolve( res );  
                })
                .catch(function(error){
                    return Promise.reject(error);
                })
            );
        }

        function verifyProduct(Product)
        {
            var testStatus = true;
            var Errstack = {Surplus : [], Absent: [] };
            return new Promise( function(resolve, reject){ 
                resolve(StandardsAPIService.getStandardsList()); 
            })
            .then(function(AllStandards) {

                AllStandards= StandardsManagementService.FormatStandards(AllStandards);
                var PStds   = Object.keys(Product.ProductJSON.Standards);
                var AllStds = [];

                for(var j = 0 ; j < AllStandards.length ; j++)
                {
                    AllStds.push(AllStandards[j].Infos.Name);
                }

                for(var i = 0 ; i < PStds.length ; i++)
                {
                    if( !AllStds.includes(PStds[i]))
                    {
                        testStatus = false;
                        Errstack.Absent.push({Name: PStds[i], Point: 'ALL POINTS.'});

                        break;
                    }
                    else
                    {
                        var RefStd = AllStandards[AllStds.indexOf(PStds[i])];
                        var res  = copyCategoriestoProduct(Product, RefStd);

                        Product = res[0];
                        Errstack.Surplus = Errstack.Surplus.concat(res[1].Surplus);
                        Errstack.Absent  = Errstack.Absent.concat(res[1].Absent);
                    }
                }

                if(testStatus == true )
                     return Promise.resolve([ Product , Errstack ]);
                else
                     return Promise.reject(Errstack);
         });
        }
 
        // This function Hundles reports also
        function copyCategoriestoProduct(Product, RefStd)
        {
            var Errstack = {Surplus : [], Absent: [] };
 
            // Check if there is any Surplus Points
             for( var j = 0 ; j < Product.ProductJSON.Standards[RefStd.Infos.Name].Designations.length ; j++ )
            {
                for(var i = 0 ; i < RefStd.Designations.length ; i++)
                {
                    if(Product.ProductJSON.Standards[RefStd.Infos.Name].Designations[j].DesignationTitle == RefStd.Designations[i].DesignationTitle)
                    {
                        break;
                    }
                    else if(i ==  RefStd.Designations.length -1)
                    {
                        Errstack.Surplus.push({Name: RefStd.Infos.Name , Point: Product.ProductJSON.Standards[RefStd.Infos.Name].Designations[j].DesignationTitle });
                    }
                }
            }

            // Check if there is any Absent points and copy the points 
            for( var i = 0 ; i < RefStd.Designations.length ; i++)
            {
                for( var j = 0 ; j < Product.ProductJSON.Standards[RefStd.Infos.Name].Designations.length ; j++ )
                {
                    if( RefStd.Designations[i].DesignationTitle == Product.ProductJSON.Standards[RefStd.Infos.Name].Designations[j].DesignationTitle )
                    {
                        RefStd.Designations[i].Status   = Product.ProductJSON.Standards[RefStd.Infos.Name].Designations[j].Status;
                        RefStd.Designations[i].Reports  = Product.ProductJSON.Standards[RefStd.Infos.Name].Designations[j].Reports;
                        RefStd.Designations[i].Comments = Product.ProductJSON.Standards[RefStd.Infos.Name].Designations[j].Comments;

                        break;
                    }
                    else if( j == Product.ProductJSON.Standards[RefStd.Infos.Name].Designations.length -1 )
                    {
                        Errstack.Absent.push({Name: RefStd.Infos.Name , Point: RefStd.Designations[i].DesignationTitle });
                        RefStd.Designations[i].Reports  = [];
                        RefStd.Designations[i].Status  = '';
                    }
                }
            }

            Product.ProductJSON.Standards[RefStd.Infos.Name] = RefStd;

            return [ Product , Errstack ];
        }

        // Treat JSON to extract only the used standards
        function ExtractUsedStandards(JsonPCA)
        {
            var keys = Object.keys(JsonPCA.Standards);

            for( var i = 0 ; i < keys.length ; i++ )
            {
                for( var j = 0 ; j < JsonPCA.Standards[keys[i]].Designations.length ; j++ )
                {
                    if(JsonPCA.Standards[keys[i]].Designations[j].Status != '')
                    { 
                        break;
                    }
                    if(j == JsonPCA.Standards[keys[i]].Designations.length -1)
                    {
                        delete JsonPCA.Standards[keys[i]];
                        break;
                    }
                }
            }
            return JsonPCA;
        }

        function FormatProducts(Products)
        {
            for(var i = 0; i < Products.length; i++)
            {
                Products[i].ProductJSON = angular.fromJson(Products[i].ProductJSON);
                if(Products[i].directives)
                 {
                    Products[i].directives = angular.fromJson(Products[i].directives);
                 }
            }
            return Products;
        }

        function TagProduct(product)
        {
            return new Promise( function(resolve){ 
                resolve(StandardsAPIService.getStandardsList()); 
            })
            .then(function(AllStandards) {
             var TagedProduct = TagRelatedStandards(AllStandards, product) ;
             return Promise.resolve(TagedProduct);
         }); 
        }  

        function ProductStatus(product){
            var Stds = Object.keys(product.ProductJSON.Standards);

            var TestStatus = 'Complete'; // 'CompleteF' - 'Incomplete'

            for(var i =0 ; i < Stds.length ; i++)
            {
              if(TestStatus == 'Incomplete')
              {
                break;
              }
              //Designations in Std
              for(var j= 0 ; j < product.ProductJSON.Standards[Stds[i]].Designations.length ; j++)
                {
                    var Status = product.ProductJSON.Standards[Stds[i]].Designations[j].Status;
                    if ( ( Status == '' || Status == 'A' ) && ( TestStatus == 'Complete' ||  TestStatus == 'CompleteF') )
                        {
                            TestStatus = 'Incomplete';
                            break;
                        }
                    else if( Status == 'F' && TestStatus == 'Complete')
                    {
                        TestStatus = 'CompleteF';
                    }
                }                    
            }
            product.TestStatus = TestStatus;
            return product ;
        }

        // Must Treat cases where the standard to search is not found ...
        function TagRelatedStandards(AllStandards, product)
        {
            AllStandards  = StandardsManagementService.FormatStandards(AllStandards);
            var Standards = Object.keys(product.ProductJSON.Standards);
            var TestStatus = 'Complete';

            for(var i = 0 ; i < Standards.length ; i++ )
            {
                delete product.ProductJSON.Standards[Standards[i]].Updates;
                for(var j = 0 ; j < AllStandards.length ; j++)
                {
                    if( Standards[i] == AllStandards[j].Infos.Name )
                    {
                        var Updates = [];
                        var Updates = GetStandardUpdates(AllStandards , j, Updates);
                        product.ProductJSON.Standards[Standards[i]].Updates = Updates;
                        product = UpdateStdPoints(product , AllStandards[j]);
                        //product = res[0];
                        // Change = res[1];
                        // if Change == true => Need to update product.
                    }
                }
            }
            product = ProductStatus(product);
            product.Taged = 'Taged'; 
            return Promise.resolve(product); 
        }

        function  UpdateStdPoints(product , RefStd)
        {
            var Change = false;
            for(var i = 0 ; i < product.ProductJSON.Standards[RefStd.Infos.Name].Designations.length ; i++)
            {
                for(var j = 0 ; j < RefStd.Designations.length ; j++)
                {
                    if(product.ProductJSON.Standards[RefStd.Infos.Name].Designations[i]._id == RefStd.Designations[j]._id)
                    {
                        if(product.ProductJSON.Standards[RefStd.Infos.Name].Designations[i].DesignationTitle != RefStd.Designations[j].DesignationTitle)
                        {
                            product.ProductJSON.Standards[RefStd.Infos.Name].Designations[i].DesignationTitle = RefStd.Designations[j].DesignationTitle;
                            Change = true;
                        }
                        if(product.ProductJSON.Standards[RefStd.Infos.Name].Designations[i].Category != RefStd.Designations[j].Category)
                        {
                            product.ProductJSON.Standards[RefStd.Infos.Name].Designations[i].Category = RefStd.Designations[j].Category;
                            Change = true;
                        }
                        if(product.ProductJSON.Standards[RefStd.Infos.Name].Designations[i].SubCategory != RefStd.Designations[j].SubCategory)
                        {
                            product.ProductJSON.Standards[RefStd.Infos.Name].Designations[i].SubCategory = RefStd.Designations[j].SubCategory;
                            Change = true;
                        }
                    }
                }
            }
            return product;
        }

        function GetStandardUpdates(AllStandards , St_idx , Updates)
        {
            for(var i = 0; i < AllStandards.length; i++)
            {
                if(AllStandards[St_idx]._id ==  AllStandards[i].Infos.Id_UpdateOf )
                {
                    var Infos = { 
                        Name: AllStandards[i].Infos.Name,
                        _id : AllStandards[i]._id
                    }
                    Updates.push(Infos);

                    // search if this update has also an update:
                    GetStandardUpdates(AllStandards , i , Updates);
                }
            }
            // if the loop is finished => great.
            // if not the reccursive function keeps searching for new updates. 
            return Updates;
        }

        function isUptodate(product)
        {
            var UpdateCount = 0;
            var standards = Object.keys(product.ProductJSON.Standards);
            for(var i = 0 ; i < standards.length; i++)
            {
                UpdateCount = UpdateCount + product.ProductJSON.Standards[standards[i]].Updates.length ;
            }

            return UpdateCount;
        }   

        function AddStd(product, std)
        {
            std = angular.fromJson(std);
            std.Designations = angular.fromJson(std.Designations);

            var Standards = Object.keys(product.ProductJSON.Standards);

            return new Promise( function(resolve, reject){ 
                if( !Standards.includes(std.Infos.Name) )
                {
                    for(var i = 0 ; i < std.Designations.length ; i++)
                    {
                        std.Designations[i].Comments = '';
                        std.Designations[i].Reports  = [];
                        std.Designations[i].Status   = '';  
                    }
                    product.ProductJSON.Standards[std.Infos.Name] = { Designations : std.Designations, Updates: []};
                    resolve(TagProduct(product)); 
                }
                else
                {
                   reject(product);
                }
            })
            .then(function(TagedProduct) {
              return Promise.resolve(TagedProduct);
             })
             .catch(function(err){
              return Promise.reject(product);
             }); 
        }

        function deleteStd(product, stdName)
        {
            var Standards = Object.keys(product.ProductJSON.Standards);
            var status    = false ;

            return new Promise( function(resolve, reject){ 
                if( Standards.includes(stdName) )
                {
                    delete product.ProductJSON.Standards[stdName];
                    TagProduct(product);
                    resolve(TagProduct(product)); 
                }
                else
                {
                    reject(product);
                }
            })
            .then(function(TagedProduct) {
              return Promise.resolve(TagedProduct);
             })
             .catch(function(err){
                     return Promise.reject(product);
             });     
        }

        function UpdateProductStd(Up_Tag_Product)
        {
           var P_Standards = Object.keys(Up_Tag_Product.ProductJSON.Standards);
           var NewProduct = angular.copy(Up_Tag_Product);

           return new Promise( function(resolve){ 
            resolve(StandardsAPIService.getStandardsList()); 
        })
           .then(function(AllStandards) { 
            AllStandards = StandardsManagementService.FormatStandards(AllStandards);

            for(var j = 0 ; j < AllStandards.length; j++)
            {
                for(var i = 0 ; i < P_Standards.length; i++)
                {
                                        // if a standard has to be updated => copy the remaining tests -> delete the std 
                                        //-> add the updated st

                                        if( Up_Tag_Product.ProductJSON.Standards[P_Standards[i]].Upgradeto == AllStandards[j]._id )
                                        { 
                                                // Rewrite this part to create :
                                                // - a copy of the existing tests 
                                                // - delete the allready existing tests
                                                // - add the new tests.
                                                // of each standard to be upgraded.

                                                // Standards Infos
                                                var NewStd = copyEqualPoints(AllStandards[j] , Up_Tag_Product.ProductJSON.Standards[P_Standards[i]]);
                                                delete NewProduct.ProductJSON.Standards[P_Standards[i]];
                                                NewProduct.ProductJSON.Standards[NewStd.Infos.Name] = NewStd;
                                            } 
                                        }
                                    }

                                // New Product properties update

                                NewProduct.ProductInfo.CreatedBy = UserService.getCurrentUser().displayName;
                                NewProduct.ProductInfo.Id_UpdateOf = Up_Tag_Product._id;
                                NewProduct.ProductInfo.hasAnUpdate = '0' ;
                                NewProduct.ProductInfo.Version = Up_Tag_Product.ProductInfo.Version + 1;
                                NewProduct.createdAt = Date.now();
                                delete NewProduct.createdAt;

                                // Add Product Update

                                return Promise.resolve( addNewProduct(NewProduct)
                                              .then(function(response) {
                                                    NotificationService.RightSidebarNotif( 'Products', 'Update' , NewProduct.ProductInfo.References , UserService.getCurrentUser().username);
                                                    NotificationService.popAToast('Product Updated successfully', 5000, 'success');
                                                    return response; 
                                                })) 
                            });         
       }

       function copyEqualPoints( StdN , StdP )
       {
        for(var i=0 ; i < StdN.Designations.length ; i++)
        {
            for( var j=0 ; j < StdP.Designations.length ; j++)
            {
                    // Comparaison between Chapters and Titles of Designations 
                    // If equal copy designation comments, reports and status 
                    // to the standard.
                    if( StdN.Designations[i].DesignationTitle == StdP.Designations[j].DesignationTitle && StdN.Designations[i].Chapters == StdP.Designations[j].Chapters)
                    {
                        StdN.Designations[i].Comments = StdP.Designations[j].Comments;
                        StdN.Designations[i].Reports  = StdP.Designations[j].Reports;
                        StdN.Designations[i].Status   = StdP.Designations[j].Status;
                        break;
                    }
                    // if it's not 
                    else
                    { 
                        // and it's the last designation -> this designation is a new one -> initialize it.
                        if(j == StdP.Designations.length -1)
                        {
                            StdN.Designations[i].Comments = '';
                            StdN.Designations[i].Reports  = [];
                            StdN.Designations[i].Status   = '';
                        }
                    }
                }
            }
            return StdN;
        }

        function addNewProduct(product)
        {
            return new Promise(function(resolve, reject){
                ProductsAPIService.createProduct(product)
                                  .then(function(response){
                                         resolve(response);      
                                  })
                                  .catch(function(err){
                                         reject( err );
                                  });
                              });
        }

        function Updateproduct(product)
        {
            return new Promise(function(resolve, reject){
                resolve(ProductsAPIService.Updateproduct(product)); 
            }).then(function(response){
                return Promise.resolve(response.data);
            }).catch(function(err){
                return Promise.reject(err);
            });           
        }

        function buildHistoryEvents(productsHistory)
        {
            var events = [];

            for(var i = 0 ; i < productsHistory.length ; i++)
            {
                var event = {
                            title: '',
                            subtitle: 'Diffs: ',
                            date: '',
                            image: '',
                            content: '<div layout="row" layout-align="start center"> <img src="'+ productsHistory[i].ProductInfo.ImageBuffer + '" width="40"/>'  + 'Version : ' + productsHistory[i].ProductInfo.Version + '</div>',
                            palette: 'amber:400'
                        };                

                if(i != productsHistory.length - 1)
                {
                    var diffValueChangesp = diffStandards( angular.copy(productsHistory[i].ProductJSON.Standards) , angular.copy(productsHistory[i+1].ProductJSON.Standards) );   

                    var diffValueChangesm = diffStandards( angular.copy(productsHistory[i+1].ProductJSON.Standards)   , angular.copy(productsHistory[i].ProductJSON.Standards) );

                    //var diffValueChanges = ObjectDiff.toJsonDiffView(diff); 
                }
                else
                {
                    var diffValueChangesp = [ 'Creation of product.'];
                    var diffValueChangesm = [ '*-*-*-*-*-*-*-*-*-*-*-*-*'];
                }

                event.title = productsHistory[i].ProductInfo.References ;
                event.date  = productsHistory[i].createdAt;
                
                event.subtitle = createSubtitle(diffValueChangesp, diffValueChangesm);
                events.push(event);
            }
            return events;
        }

        function buildBrokenEvents( productsHistory, error)
        {
           var events = buildHistoryEvents(productsHistory);
           var event = {
                            title: error.ErrorType,
                            subtitle: '',
                            date: '',
                            image: 'assets/images/laboratory/product-avatar.jpg',
                            content: '<h1> History Broken.</h1>',
                            palette: 'deep-orange:500'
                        };
           events.push(event);
           return events;     
        }

        function diffStandards(Stds1 , StdS2)
        {
            Stds1 = Object.keys(Stds1);
            StdS2 = Object.keys(StdS2);

            for(var i = 0 ; i < Stds1.length ; i++)
            {
                if( StdS2.includes(Stds1[i]) )
                {
                    Stds1[i] = '';
                }
            }
            return Stds1;
        }

        function createSubtitle(diffValueChangesp, diffValueChangesm)
        {
                var subtitle = 'Differences: ';
                for( var i = 0 ; i < diffValueChangesp.length ; i++ )
                {
                    if(diffValueChangesp[i] != '')
                        subtitle = subtitle + '<div class="md-list-item-text"> <h4 style=" color: green;"> (+)' + diffValueChangesp[i] + '</h4> </div>';
                }
                for( var j = 0 ; j < diffValueChangesm.length ; j++ )
                {
                    if(diffValueChangesm[j] != '')
                        subtitle = subtitle + '<div class="md-list-item-text"> <p style=" color: red;"> (-)' + diffValueChangesm[j] + '</p> </div>';
                }
                return subtitle;
        }
    } 
})();

(function() {
    'use strict';

    PCAManagementService.$inject = ["$log", "$q", "$timeout", "NotificationService", "UserService", "DocsService"];
    angular
        .module('app.pca')
        .factory('PCAManagementService', PCAManagementService);

    /**
     * Service grouping tools managing PCA Files.
     */

    /* @ngInject */
    function PCAManagementService($log, $q ,$timeout , NotificationService, UserService , DocsService) {

        // List of exposed services
        var service = {
            PCAtoJson: PCAtoJson,
            isValidPCAFile:isValidPCAFile,
            getStandardKeys:getStandardKeys,
            checkFile:checkFile,
            getDesignationsList:getDesignationsList,
            JsontoPCA: JsontoPCA
        };

        // List of excell files accepted by the tool.
        var AcceptedFileTypes = ['application/vnd.ms-excel', 
                                'application/msexcel' ,
                                'application/x-msexcel', 
                                'application/x-ms-excel' , 
                                'application/x-excel' , 
                                'application/x-dos_ms_excel',
                                'application/xls' , 
                                'application/x-xls' , 
                                'application/x-xlsm' , 
                                'application/xlsm',
                                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                'application/vnd.ms-excel.sheet.macroEnabled.12'
                                ];

        return service;


         /** Builds JSON Object Strating from PCA excell file.
         * @property {PCA: binary excell file}
         * @returns {JSON: OjectJson} -> Refer to Standards Management Service
         */
        function PCAtoJson(PCA) {
 
            var JSON = {  Standards: {}};

            // All the keys of the PCA
            var keys = Object.keys(PCA);

            // Standards keys in the file
            var Stkeys  = getStandardKeys(PCA); 

            for(var i = 0 ; i < Stkeys.length; i++)
            {
                // For each standard, extract designation points linked to this standard
                var Designations = getDesignationsList(PCA, keys, Stkeys, Stkeys[i]);

                // Push the designations to the standard
                JSON.Standards[PCA[Stkeys[i]].v] = Designations;
            }
            return JSON;
        }

         /** Extract designation points linked to a specefic standard in the PCA file.
         * @property {PCA: binary excell file}
         * @property {keys: Array[String]}: Contains object keys given by the framework JS-XLS. 
         * @property {Stkeys: Array[String]}: Contains keys of all standards present in the PCA file.
         * @property {Stkey: String}: Contains the key of the standard that we want to extract the points from.
         * @returns {Designations: Array[DesignationObj]} 
         * DesignationObj   = {
                    'Chapters': 'String',
                    'DesignationTitle':'String',
                    'Directive': 'String',
                    'Status': 'String',
                    'Reports': Array['ReportObj'],
                    'Comments':'String',
                    'Category':'String',
                    'SubCategory': 'String'
                }
         * ReportObj  = [ {name : 'String' , _id : 'IdObj'} ];   // Ther is additional properties present in ReportObj, refer to DocumentsService.
         */

        function getDesignationsList(PCA, keys, Stkeys, Stkey) {

            var Designations = {
                    'Designations': []
                    //'DesignationKeys': []
                },
                Deskey = '',
                designation   = {
                    'Chapters': '',
                    'DesignationTitle':'',
                    'Directive': '',
                    'Status': '',
                    'Reports': '',
                    'Comments':'',
                    'Category':'',
                    'SubCategory': ''
                },
                // This Flag is due to the disorder caused by the function Object.keys in the PCA properties.
                // This Flag is used to prevent duplicates when searching for designations in a standard 
                Flag = false;

            for(var i = 0 ; i < keys.length ; i++ ){

                // Check if we're in a higher level than the requested standard key
                if(Number(keys[i].slice(1)) >=  Number(Stkey.slice(1)))
                {
                    // Corresponding Designation points 
                    if(Number(keys[i].slice(1)) ==  Number(Stkey.slice(1)) && Flag == false)
                    {
                        Deskey ='C' +(Number(keys[i].slice(1)) +1).toString();
                        Flag = true;
                    }
                    else
                    {
                        Deskey ='C' +(Number(Deskey.slice(1)) +1).toString();
                    }

                    // Check if the Designation key is an existing designation point or it's end of file
                    if(angular.isUndefined(PCA[Deskey])) 
                    {
                        // If the key is a standard or umpty line : we stop 
                        if(Stkeys.indexOf('B' + Deskey.slice(1)) != -1 )
                        {
                            break;
                        }
                        // else: it's a title in a standard, so we continue treating designations
                        else
                        {
                            continue;
                        }
                    }
                    // else if the Designation key exists : Treat the point
                    else
                    {
                        // Build designation object 
                        designation   = {
                            'Standard': '',
                            'Chapters': '',
                            'DesignationTitle':'',
                            'Directive': '',
                            'Status': '',
                            'Reports': '',
                            'Comments':'',
                            'Category':'',
                            'SubCategory': ''
                        };

                        //Build Designations -> push to Designations array 
                        if(!angular.isUndefined(PCA['A' + Deskey.slice(1)])) 
                            designation.Standard  = PCA['A' + Deskey.slice(1)].v.toString();
                        if(!angular.isUndefined(PCA['B' + Deskey.slice(1)])) 
                            designation.Chapters  = PCA['B' + Deskey.slice(1)].v.toString();
                        if(!angular.isUndefined(PCA['C' + Deskey.slice(1)]) ) 
                            designation.DesignationTitle  = PCA['C' + Deskey.slice(1)].v.toString();
                        if(!angular.isUndefined(PCA['D' + Deskey.slice(1)]) ) 
                            designation.Directive = PCA['D' + Deskey.slice(1)].v.toString();
                        if(!angular.isUndefined(PCA['E' + Deskey.slice(1)]) )
                            designation.Status    = PCA['E' + Deskey.slice(1)].v.toString();
                        if(!angular.isUndefined(PCA['F' + Deskey.slice(1)]) )
                        {   
                            if(PCA['F' + Deskey.slice(1)].v.toString() != '')
                            {
                                designation.Reports  = [ {name : PCA['F' + Deskey.slice(1)].v.toString() , _id : '41224d776a326fb40f000001'} ];
                            }
                            else
                            {
                                designation.Reports = [];
                            }
                        }
                        if(!angular.isUndefined(PCA['G' + Deskey.slice(1)]) ) 
                            designation.Comments  = PCA['G' + Deskey.slice(1)].v.toString();
                        if(!angular.isUndefined(PCA['N' + Deskey.slice(1)]) ) 
                            designation.Category  = PCA['N' + Deskey.slice(1)].v.toString();
                        if(!angular.isUndefined(PCA['O' + Deskey.slice(1)]) ) 
                            designation.SubCategory  = PCA['O' + Deskey.slice(1)].v.toString();

                        // Push the object to 
                        if( PCA['C' + Deskey.slice(1)].v.toString().indexOf('Established by') == -1 )
                            Designations.Designations.push(designation);
                        //Designations.DesignationKeys.push(Deskey);
                    }
                }
            }
            return Designations;
        }

         /** Checks the validity of PCA file and return the PCAJSON Object
         * @property {e: input HTML object}
         * @returns {promise(result): JsonObj}
         * result = {
                status : 'boolean', 
                workbook: 'PCAJSON raw file'
            };
         */
        function checkFile(e) {

            var result = {
                status : false, 
                workbook: ''
            };

            // The process above is asynchronous -> use of $q  
            return $q(function(resolve) {

                var file = e.files[0];

                if (!file) {
                    result.status = false;
                    resolve( result );
                }

                // check if the file has a valid type in the AcceptedFileTypes list.
                if( AcceptedFileTypes.indexOf(file.type) !== -1)
                {
                    // Read the file content. Output: binary.
                    var reader = new FileReader();
                    reader.readAsBinaryString(file);

                    // wait for error event
                    reader.onerror = function (){
                        reader.abort();
                        new DOMException('Problem parsing input file.');
                        result.status = false;
                        resolve( result );
                    };

                    // binary file generated
                    reader.onload = function () {
                        var data = reader.result;

                        // Transform binary file to XLS json file
                        var workbook = XLSX.read(data, {type: 'binary'});
 
                        // if excell fil containts sheets.
                        if ( workbook.SheetNames && workbook.SheetNames.length > 0) 
                        {
                            result.status = true;
                            result.workbook = workbook;

                            // resolve result object
                            resolve( result ) ;
                        }         
                    };
                }
                else 
                {
                    $timeout( NotificationService.popAToast('Error: not an excell File.', 5000, 'error'), 500);
                    result.status = false;
                    resolve( result );
                }
            });
        }

         /** Extract Standard keys from PCA json file.
         * @property {PCA: XLS json object}
         * @returns {Stkeys: Array[String]}
         */
        function getStandardKeys(PCA) {
 
            var Stkeys = [];

            var keys = Object.keys(PCA);

            for(var i = 0 ; i < keys.length ; i++ ){
                if(keys[i].indexOf('B') === 0 ){
                    // If an element in the B column in the PCA contains one of the following Strings -> it's a Strandard
                    if( ( PCA[keys[i]].v.toString().indexOf('Standard') === 0 || PCA[keys[i]].v.toString().indexOf('Internal') === 0 || PCA[keys[i]].v.toString().indexOf('Declaration & Certification') === 0 || PCA[keys[i]].v.toString().indexOf('EV ready 1.4') === 0 ) && PCA[keys[i]].v.toString() != 'Standard requirements' )
                    {
                        Stkeys.push(keys[i]);
                    }
                }
            }
            return Stkeys;
        }

         /** Is valid Exell format: checks if a PCA sheet is present in the file. 
         * @property {workbook: XLS json object}
         * @returns {bool} : true = valid. false = not valid. 
         */

        function isValidPCAFile(workbook) {

            if(workbook.SheetNames.indexOf('PCA') !== -1)
                return true;
            else 
                return false;
        }



         /**
         * Function Transforming a JSON product object into a PCA excell file
         * @property {PJSON: Product Object} -> Refer to ProductsManagementService
         * @property {mdNumber:  String}
         * @property {Type: String} -> takes two values: 'QS' or 'ALL'. depending on the value, the first column will be included or not in the final excell file. 
         * @returns {[ wbout , FileStatus ]: Array} -> { wbout: Binary excell file } - { FileStatus : String('Complete', 'Incomplete', 'CompleteF' ) 
         */

        function JsontoPCA(PJSON, mdNumber ,Type)
         {
            // Woorkbook
            var workbook = {};
            var FileStatus = true;

            // row
            var row = 0;

            // options : 
            var wopts = { bookType:'xlsx', bookSST:false, type:'binary' };

            // Docs infos: 
            // var WbInfos = BuildWbInfos(PJSON);

            // Sheet Names
            var SheetNames =  [ "PCA" ];

             // ** Build PCA Sheet ** // 

            var Sheets = {PCA : {}};

            // Build PCA Sheet cols width 
            var wscols = [ {wch: 20}, {wch: 20}, {wch: 60}, {wch: 20}, {wch: 10}, {wch: 25}, {wch: 60} ];

            // Build Header Merges
            var merges = BuildHeaderMerges(); 

            // init Sheet:
            if(Type == 'ALL') { Sheets.PCA['!ref']    = "A1:AT1441"; }
            else if(Type == 'QS') { Sheets.PCA['!ref']    = "B1:AT1441"; }

            Sheets.PCA['!merges'] = merges;
            Sheets.PCA['!cols']   = wscols;

            //Build Sheet Content
            Sheets = BuildFileHeader(Sheets , PJSON, mdNumber);

            //Build PCA conten
            var res = BuildPCAContent(Sheets , PJSON);

            Sheets = res[0];
            row = res[1];
            FileStatus = res[2];

            // Build Sheet Footer
            Sheets = BuildPCAFooter(Sheets , PJSON, row);

            // *** BUILD Workbook **** //

            //workbook.Props = WbInfos;
            workbook.SheetNames = SheetNames;
            workbook.Sheets = Sheets;

            // Workbook to binary
            var wbout = XLSX.write(workbook,wopts);

            /* the saveAs call downloads a file on the local machine */
            //saveAs(new Blob([DocsService.s2ab(wbout)],{type:""}), PJSON.ProductInfo.References+".xlsx");
            //return new Blob([DocsService.s2ab(wbout)],{type:""});
            return [ wbout , FileStatus ];
            
         }

         /** BuildPCAFooter: Joins Footer to Generated Exell Obj 
         * @property {Sheets: }
         * @property {PJSON: Product Json Object}
         * @property {row: String} : the row where to put the Footer
         * @returns {bool} : true = valid. false = not valid. 
         */

        function BuildPCAContent(Sheets , PJSON){
            var Stds = Object.keys(PJSON.ProductJSON.Standards);
            var row = 29;

            var FileStatus = 'Complete';
            if(Stds.length != 0)
            {
                Sheets = BuildStdHeader(Sheets);
            }

            for(var i =0 ; i < Stds.length ; i++)
            {

                    //Add St + merges
                    Sheets.PCA['A' + row ] = StyleCell( 'StdTitle' , ' ');
                    Sheets.PCA['B' + row ] = StyleCell( 'StdTitle' , Stds[i]);
                    Sheets.PCA['!merges'].push({ e: {c: 6, r: row -1}, s: {c: 1, r: row -1} });
                    //next row
                    row = row+1;
                    //Designations in Std
                    for(var j= 0 ; j < PJSON.ProductJSON.Standards[Stds[i]].Designations.length ; j++)
                    {
                        var rep = '';
                        
                        Sheets.PCA['A' + row ] = StyleCell( 'Normal' , PJSON.ProductJSON.Standards[Stds[i]].Designations[j].Standard);
                        Sheets.PCA['B' + row ] = StyleCell( 'NormalCenter' , PJSON.ProductJSON.Standards[Stds[i]].Designations[j].Chapters);
                        Sheets.PCA['C' + row ] = StyleCell( 'Normal' , PJSON.ProductJSON.Standards[Stds[i]].Designations[j].DesignationTitle);
                        Sheets.PCA['D' + row ] = StyleCell( 'Normal' , PJSON.ProductJSON.Standards[Stds[i]].Designations[j].Directive);
                        Sheets.PCA['E' + row ] = StyleCell( 'Status'+  PJSON.ProductJSON.Standards[Stds[i]].Designations[j].Status, PJSON.ProductJSON.Standards[Stds[i]].Designations[j].Status);
                        Sheets.PCA['F' + row ] = StyleCell( 'Normal' , ''); // pour encadrer la case reports au cas ou y'a pas de rapports.

                        for(var k = 0 ; k < PJSON.ProductJSON.Standards[Stds[i]].Designations[j].Reports.length ; k++)
                            {
                                rep = rep + PJSON.ProductJSON.Standards[Stds[i]].Designations[j].Reports[k].name;
                                if(k == PJSON.ProductJSON.Standards[Stds[i]].Designations[j].Reports.length -1)
                                {
                                    Sheets.PCA['F' + row ] = StyleCell( 'Normal' , rep );
                                }
                                else
                                {
                                    rep = rep + ' , ';
                                }
                            }
                        Sheets.PCA['G' + row ] = StyleCell( 'Normal' , PJSON.ProductJSON.Standards[Stds[i]].Designations[j].Comments);
                        row = row +1;                        
                        
                        if (PJSON.ProductJSON.Standards[Stds[i]].Designations[j].Status == '' && FileStatus == 'Complete')
                        {
                            FileStatus = 'Incomplete';
                        }
                    }                    
                
            }
            return [ Sheets , row , FileStatus];
        }

         /** BuildPCAFooter: Joins Footer to Generated Exell Obj 
         * @property {Sheets: }
         * @property {PJSON: Product Json Object}
         * @property {row: String} : the row where to put the Footer
         * @returns {bool} : true = valid. false = not valid. 
         */

         function BuildPCAFooter(Sheets , PJSON, row ){
            row = row + 4;
            Sheets.PCA['B' + row ] = StyleCell( 'Normal' , 'Established by:');
            Sheets.PCA['D' + row ] = StyleCell( 'Normal' , 'Verified by:');

            return Sheets;
         }
 
         /** StyleCell: Function giving style to Excell cells
         * @property {style: 'String'} -> 'StdHeader' 'StdTitle' 'Normal' 'NormalCenter' 'StatusF' 'StatusP' 'StatusA' 'StatusNA' 'Status' 'DesTitle' 'Header' 'SubHeader' 'hager'
         * @property {Content: 'String'} -> Content of the cell.
         * @returns {cell : JSON} : XLS JSON Format
         */

         function StyleCell(style, content)
         {  
            var cell = {
                        v: content,
                        s: { 
                            font: {
                                name: 'Arial',
                                sz: 12,
                                bold: false,
                                italic: false,
                                wrapText: false,
                                underline: false,
                                color:  { rgb: "000000" }
                            },
                            alignment: {
                                wrapText: true,
                                vertical: 'center',
                                horizontal: 'center'
                            },
                            fill: { fgColor: { rgb: "00477e"} },
                            border: {
                                top:    { style: "thin", color: { rgb: '000000'} },
                                right:  { style: "thin", color: { rgb: '000000'} },
                                bottom: { style: "thin", color: { rgb: '000000'} },
                                left:   { style: "thin", color: { rgb: '000000'} }
                            }
                        }
                    }

            switch (style) {
              case 'StdHeader':
                cell.s.fill.fgColor.rgb = 'e46529';
                cell.s.font.bold = true;
                cell.s.font.color.rgb = "ffffff" ;
                break;
              case 'StdTitle':
                cell.s.font.bold = true;
                cell.s.font.color.rgb = "ffffff" ;
                break;
              case 'Normal':
                cell.s.fill.fgColor.rgb = 'ffffff';
                cell.s.alignment.horizontal = '';
              case 'NormalCenter':
                cell.s.fill.fgColor.rgb = 'ffffff';
                break;
              case 'StatusF':
                cell.s.fill.fgColor.rgb = 'ed1c24'; 
                break;
              case 'StatusP':
                cell.s.fill.fgColor.rgb = '0fe51a'; 
                break;
              case 'StatusA':
                cell.s.fill.fgColor.rgb = 'f58220';
                break;
              case 'StatusNA':
                cell.s.fill.fgColor.rgb = 'ffffff';
              case 'Status':
                cell.s.fill.fgColor.rgb = 'ffffff';
                break;
              case 'DesTitle':
                cell.s.fill.fgColor.rgb = 'cccccc';
                break;
              case 'Header':
                cell.s.fill.fgColor.rgb = '646464';
                cell.s.font.bold  = true;
                cell.s.font.color.rgb =  "ffffff" ;
                break;
              case 'SubHeader':
                cell.s.fill.fgColor.rgb = '910049';
                cell.s.font.bold  = true;
                cell.s.font.color.rgb =  "ffffff" ;
                break;    
              case 'hager':
                cell.s.font.bold = true;
                cell.s.font.name = 'Helvetica Neue';
                cell.s.font.sz   = 24;
                cell.s.fill.fgColor.rgb = 'ffffff';
                cell.s.border = {};
                break;  
              default:
              break;
            }
 
            return cell;
        }

         /** BuildWbInfos: Function Building Information of Excell file
         * @property {PJSON: XlS JSON obj} 
         * @returns {WbInfos : JSON}
         */
         function BuildWbInfos(PJSON)
         {
            var WbInfos = {
                "LastAuthor": UserService.getCurrentUser().username, 
                "RevNumber": PJSON.ProductInfo.Version, 
                "Author": PJSON.ProductInfo.CreatedBy, 
                "Comments": "Automatically Generated by Hager Laboratory©.",
                "Language": "English", 
                "Subject": "Qualification synthesis.", 
                "Title": "Qualification synthesis.", 
                "CreatedDate": PJSON.createdAt, 
                "ModifiedDate": moment(Date.now()), 
                "Application": "Hager Laboratory©", 
                "AppVersion": "V4.1", // might change
                "SharedDoc": false,
                "ScaleCrop": true,
                "LinksUpToDate": false,
                "Company": "Hager Group - Saverne.", 
                "Manager": "Soufiane CHERRADI", 
                "Worksheets": 1, 
                "SheetNames":["PCA"]
            };
            return WbInfos;
         }

         /** BuildHeaderMerges: Building the merges in the Excell file
         * @returns {merges : Array[JSON]}
         */

        function BuildHeaderMerges()
         {
            return [{ e: {c: 3, r: 6}, s: {c: 2, r: 6} }, { e: {c: 3, r: 7} , s: {c: 2, r: 7 } }, { e: {c: 3, r: 8 }, s: {c: 2, r: 8} },
                    { e: {c: 3, r: 9}, s: {c: 2, r: 9} }, { e: {c: 3, r: 10}, s: {c: 2, r: 10} }, { e: {c: 3, r: 11}, s: {c: 2, r: 11} },
                    { e: {c: 3, r: 12}, s: {c: 2, r: 12} }, { e: {c: 5, r: 6}, s: {c: 4, r: 6} }, { e: {c: 5, r: 7}, s: {c: 4, r: 7} },  
                    { e: {c: 5, r: 8}, s: {c: 4, r: 8} }, { e: {c: 5, r: 9}, s: {c: 4, r: 9} }, { e: {c: 5, r: 10}, s: {c: 4, r: 10} },  
                    { e: {c: 5, r: 11}, s: {c: 4, r: 11} }, { e: {c: 5, r: 12}, s: {c: 4, r: 12} }, { e: {c: 5, r: 14}, s: {c: 2, r: 14} }, 
                    { e: {c: 5, r: 15}, s: {c: 2, r: 15} }, { e: {c: 5, r: 16}, s: {c: 2, r: 16} }, { e: {c: 5, r: 17}, s: {c: 2, r: 17} }, 
                    { e: {c: 5, r: 18}, s: {c: 2, r: 18} },  { e: {c: 5, r: 19}, s: {c: 2, r: 19} }, { e: {c: 5, r: 20}, s: {c: 2, r: 20} }, 
                    { e: {c: 5, r: 21}, s: {c: 2, r: 21} }, { e: {c: 5, r: 22}, s: {c: 2, r: 22} }, { e: {c: 5, r: 23}, s: {c: 2, r: 23} }, 
                    { e: {c: 5, r: 24}, s: {c: 2, r: 24} } , { e: {c: 2, r: 1}, s: {c: 2, r: 0} }];
         }

         /** BuildStdHeader: Building Header of standards part in Excell -> push the header in Sheets
         * @property {Sheets: XlS JSON obj} 
         * @returns {Sheets : XlS JSON obj}
         */
        function BuildStdHeader(Sheets)
        {
            // Header

            Sheets.PCA.A27 = StyleCell( 'SubHeader' , ' ');
            Sheets.PCA.B27 = StyleCell( 'SubHeader' , 'Chapters');
            Sheets.PCA.C27 = StyleCell( 'SubHeader' , 'Designations');
            Sheets.PCA.D27 = StyleCell( 'SubHeader' , 'Directives');
            Sheets.PCA.E27 = StyleCell( 'SubHeader' , 'Status');
            Sheets.PCA.F27 = StyleCell( 'SubHeader' , 'Reports');
            Sheets.PCA.G27 = StyleCell( 'SubHeader' , 'Comments');

            // St Header
            Sheets.PCA.A28 = StyleCell( 'StdHeader' , ' ');
            Sheets.PCA.B28 = StyleCell( 'StdHeader' , 'Standard requirements');
            Sheets.PCA['!merges'].push({ e: {c: 6, r: 27}, s: {c: 1, r: 27} });

            return Sheets;
        }

         /** BuildFileHeader: Building Header of the file in Excell -> push the header in Sheets
         * @property {Sheets: XlS JSON obj} 
         * @property {PJSON: Product JSON obj}
         * @property {Name: 'String'} : Name of the product 
         * @returns {Sheets : XlS JSON obj} : The changes will be pushed to Sheets JSON
         */
        function BuildFileHeader(Sheets , PJSON, Name)
         {
            // Header 1

            Sheets.PCA.C1 = StyleCell( 'hager' , 'hagergroup');

            Sheets.PCA.D1 = StyleCell( 'Header' , 'Glossary');
            Sheets.PCA.E1 = StyleCell( 'StatusA' , 'A');
            Sheets.PCA.F1 = StyleCell( 'NormalCenter' , 'Applicable');

            Sheets.PCA.B2 = StyleCell( 'Normal' , Name);
            Sheets.PCA.E2 = StyleCell( 'StatusNA' , 'NA');
            Sheets.PCA.F2 = StyleCell( 'NormalCenter' , 'Not Applicable');

            Sheets.PCA.E3 = StyleCell( 'StatusP' , 'P');
            Sheets.PCA.F3 = StyleCell( 'NormalCenter' , 'Pass');            

            Sheets.PCA.A4 = StyleCell( 'Header' , '');
            Sheets.PCA.B4 = StyleCell( 'Header' , 'References');
            Sheets.PCA.C4 = StyleCell( 'Header' , PJSON.ProductInfo.References);
            Sheets.PCA.E4 = StyleCell( 'StatusF' , 'F');
            Sheets.PCA.F4 = StyleCell( 'NormalCenter' , 'Fail');

            Sheets.PCA.A5 = StyleCell( 'Header' , '');
            Sheets.PCA.B5 = StyleCell( 'Header' , 'Risk Analysis');
            Sheets.PCA.C5 = StyleCell( 'Header' , PJSON.ProductInfo.RiskAnalysis); 

            // Array 1 
            Sheets.PCA.A7 = StyleCell( 'SubHeader' , ' ');
            Sheets.PCA.B7 = StyleCell( 'SubHeader' , 'References');
            Sheets.PCA.C7 = StyleCell( 'SubHeader' , 'Title');
            Sheets.PCA.E7 = StyleCell( 'SubHeader' , 'Date');
            Sheets.PCA.G7 = StyleCell( 'SubHeader' , 'Used');
 
            for( var i = 0 ; i < 6 ; i++)
            {
                var a = 8+i;
                if(PJSON.directives.length >= i+1)
                {
                    Sheets.PCA['B'+ a] = StyleCell( 'Normal' , PJSON.directives[i].Infos.Reference);
                    Sheets.PCA['C'+ a] = StyleCell( 'Normal' , PJSON.directives[i].Infos.Title);
                    Sheets.PCA['E'+ a] = StyleCell( 'Normal' , PJSON.directives[i].Infos.Date);
                    Sheets.PCA['G'+ a] = StyleCell( 'Normal' , ' ');
                }
                else
                {
                    Sheets.PCA['B'+ a] = StyleCell( 'Normal' , ' ');
                    Sheets.PCA['C'+ a] = StyleCell( 'Normal' , ' ');
                    Sheets.PCA['E'+ a] = StyleCell( 'Normal' , ' ');
                    Sheets.PCA['G'+ a] = StyleCell( 'Normal' , ' ');
                }
            }
 
            // Array 2 
            Sheets.PCA.A15 = StyleCell( 'SubHeader' , ' ');
            Sheets.PCA.B15 = StyleCell( 'SubHeader' , 'Version');
            Sheets.PCA.C15 = StyleCell( 'SubHeader' , 'History');
            Sheets.PCA.G15 = StyleCell( 'SubHeader' , 'Build Version');

            Sheets.PCA.B16 = StyleCell( 'Normal' , 'Creation');
            Sheets.PCA.C16 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.E16 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.G16 = StyleCell( 'Normal' , ' ');

            for( var i = 0 ; i < 9 ; i++)
            {
                var a = 17+i;
                Sheets.PCA['B'+ a] = StyleCell( 'Normal' , ' ');
                Sheets.PCA['C'+ a] = StyleCell( 'Normal' , ' ');
                Sheets.PCA['E'+ a] = StyleCell( 'Normal' , ' ');
                Sheets.PCA['G'+ a] = StyleCell( 'Normal' , ' ');
            }
            
            return Sheets;
         }
    }

})();

(function() {
    'use strict';

    PcaController.$inject = ["ProductsAPIService", "PCAManagementService", "ProductsManagementService", "StandardsManagementService", "DirectivesAPIService", "NotificationService", "UserService", "Upload", "Webworker", "$timeout", "$mdToast", "$scope", "$log", "$state", "$mdDialog"];
    angular
        .module('app.pca')
        .controller('PcaController', PcaController);

    /* @ngInject */
    function PcaController(ProductsAPIService, PCAManagementService,ProductsManagementService , StandardsManagementService , DirectivesAPIService , NotificationService , UserService , Upload ,Webworker, $timeout, $mdToast , $scope, $log , $state , $mdDialog) {

        var vm = this;

        vm.status = 'idle';  // idle | uploading | complete

        vm.ProductInfo = { 
            Brand : '',
            TechnicalFolder: '',
            References: '',
            ImageBuffer: '',
            RiskAnalysis: '',
            Designation: '',
            Links: '',
            CreatedBy:UserService.getCurrentUser().displayName,
            Version: 0,
            Id_UpdateOf: 0
        };
 
        vm.formestatus = formestatus;
        vm.formcheck = formcheck;

        vm.directives = [];
        vm.AddNewDirective = AddNewDirective;
        vm.deleteDirective = deleteDirective;

        vm.DirectiveTmpl = {
            Infos: {
                  Reference: '',
                  Title: '',
                  Date:  ''           
            }
        };

         //////////////// Public Functions //////////////

        $scope.TreatFile = function (e) {

            new Promise(function(resolve){

                $timeout( StartTreatment(), 100);
                resolve(PCAManagementService.checkFile(e)); 

            }).then(function(result){

                if(result.status == true)
                {
                    $log.info('workbook: ' + result.workbook.Props.SheetNames); 
                    if(PCAManagementService.isValidPCAFile(result.workbook))
                    {
                        vm.ProductInfo.Version = 0;
                        vm.ProductInfo.Id_UpdateOf = 0;

                        ProductsManagementService.PCAtoProduct(result.workbook.Sheets.PCA, vm.ProductInfo)
                                                 .then(function(res){
                                                                res[0].directives = SelectedDirectives();
                                                                if(res[1].Absent.length != 0)
                                                                {
                                                                    ErrorStackDialog(res[1], true);
                                                                } 

                                                                if(Object.keys(res[0].ProductJSON.Standards).length == 0)
                                                                {
                                                                    NotificationService.popAToast("NO STANDARDS WERE FOUND IN THE PCA SHEET !!! Check the PCA STRUCTURE (STANDARADS MUST BE IN THE 'B' COLUMN)", 20000, 'warning' );
                                                                    ResetTreatment();
                                                                }
                                                                else
                                                                {
                                                                  ProductsAPIService.createProduct(res[0])
                                                                                      .then(function(CreatedProduct){
                                                                                            NotificationService.popAToast('Product added successfully', 5000, 'success' );
                                                                                            FinishTreatment();
                                                                                      })
                                                                                      .catch(function(error){
                                                                                            // Error : PRODUCT not addedd !! 
                                                                                            ResetTreatment();
                                                                                       })
                                                                }
  
                                                 })
                                                 .catch(function(ErrStack)
                                                 {
                                                    NotificationService.popAToast('Error Product Add.', 15000, 'error' );
                                                    ErrorStackDialog(ErrStack, false);
                                                    ResetTreatment();
                                                 })

                    }
                    else
                    {
                        NotificationService.popAToast('ERROR: PCA sheet not found in the file ! PRODUCT NOT ADDED.', 20000, 'error' ) ;
                        ResetTreatment();
                    }
                    // Parsing is done. Update UI.
                }
                else
                {
                    ResetTreatment();
                }

            });
        };

        function SelectedDirectives()
        {
            var  Directives = [];
            for(var i = 0; i < vm.directives.length ; i++)
            {
                if(vm.directives[i].selected == true)
                {
                    Directives.push(vm.directives[i]);
                }
            }
            return Directives;
        }

        function ErrorStackDialog(ErrStack, addStatus)
        {
            $mdDialog.show({
                controller: 'AddPCAdialogController',
                controllerAs: 'vm',
                templateUrl: 'app/laboratory/pca/add_pca/error-pca-dialog.tmpl.html',
                locals: {
                    ErrStack: ErrStack,
                    addStatus: addStatus
                },
                clickOutsideToClose: true
            })
        }
        $scope.TreatStdsFile = function (e) {

            new Promise(function(resolve){

                $timeout( StartTreatment(), 100);
                resolve(PCAManagementService.checkFile(e)); 

            }).then(function(result){

                if(result.status == true)
                {
                    $log.info('workbook: ' + result.workbook.Props.SheetNames); 
                    if(PCAManagementService.isValidPCAFile(result.workbook))
                    {
                        Promise.resolve(StandardsManagementService.PCAtoStandards(result.workbook.Sheets.PCA, 0, 0))
                               .then(function(success) {
                                    NotificationService.RightSidebarNotif( 'PCA', 'Add' , vm.ProductInfo.References , UserService.getCurrentUser().username );

                                    // Parsing is done. Update UI.
                                    FinishTreatment();
                                    NotificationService.popAToast('Standards added successfully !', 20000, 'success' );
                                    $timeout( $state.go('triangular.standards-manage'), 10000 );
                                })
                              .catch(function(err) {
                                   ResetTreatment();               
                                })
                    }
                    else
                    {
                        NotificationService.popAToast('ERROR: PCA sheet not found in the file ! Standards NOT ADDED !', 20000, 'error' );
                        ResetTreatment();
                    }
                }
                else
                {
                    ResetTreatment();
                }
            });
        };

        $scope.TreatImage = function (e) {
           
            var reader = new FileReader();
            var file = e.files[0];
            if(file)
            {
                if(file.size < 500000)
                {
                  reader.readAsDataURL(file);
                }
                else 
                {
                  NotificationService.popAToast('Error: Image size must be under 500 kB.', 5000 , 'error');
                }

                reader.onerror = function (){
                            reader.abort();
                            new DOMException('Problem parsing input file.');
                            result.status = false;
                            resolve( result );
                };

                reader.onload = function () {
                            vm.ProductInfo.ImageBuffer = reader.result; 
                            NotificationService.popAToast('Image Added successfully.', 5000 , 'success');
                            $scope.$apply();         
                };         
            }
        };
        // Treatment Status 

        function StartTreatment() {  
            
            vm.status = 'uploading';
        }

        function FinishTreatment() {  
                
            vm.status = 'idle';
             // pop a toast telling users about the how to:
            //$timeout( NotificationService.popAToast('Loading File Ok.', 5000, 'success'), 500);
        }

        function ResetTreatment() {  

            //$timeout( NotificationService.popAToast('Loading File ERROR.', 5000, 'error'), 500);    
            vm.status = 'idle';
        }

        function init() {  

            getDirectives();
            // pop a toast telling users about the how to:
            $timeout( NotificationService.popAToast('Click on the Upload button to add a new reference.', 5000, 'info'), 500);
        }

        function getDirectives()
        {
            DirectivesAPIService.getDirectives()
                                .then(function(directives){
                                    vm.directives = directives;
                                }) 
        }

        function AddNewDirective()
        {
            DirectivesAPIService.storeDirective(vm.DirectiveTmpl)
                                .then(function(directive){
                                    vm.directives.push(directive);
                                    NotificationService.popAToast('Directive Added successfully', 5000, 'success');
                                })
                                .catch(function(err){
                                    NotificationService.popAToast('Directive Not Added', 5000, 'error');
                                })
        }

        function deleteDirective(directive)
        {

            askdialog( 'Delete directive: ' + directive.Infos.Title, 'Are you sure ?')
                        .then(function(response){
                             if(response == true)
                                    DirectivesAPIService.deleteDirectivebyId(directive._id)
                                                        .then(function(directive){
                                                            getDirectives();
                                                            NotificationService.popAToast('Directive deleted successfully', 5000, 'success');
                                                        })
                                                        .catch(function(err){
                                                            NotificationService.popAToast('Directive Not Added', 5000, 'error');
                                                        })
                             })
                            .catch(function(error){

                            }) 
        }
 
        function formestatus()
        {
            var status = false;
            var ErrorStack = '';

            if(vm.ProductInfo.References =='' || vm.ProductInfo.ImageBuffer =='' || vm.ProductInfo.RiskAnalysis =='' || vm.ProductInfo.Designation =='' || vm.ProductInfo.Links =='' || vm.ProductInfo.Brand =='' || vm.ProductInfo.TechnicalFolder =='')
            {
                status = true;
            }
            return status;
        }

        function askdialog(message, content) {
            return $mdDialog.show(
                $mdDialog.confirm()
                .title(message)
                .textContent(content)
                .cancel('NO')
                .ok('YES')
            ).then(function(choice){
                return choice;
            })
        }

        function formcheck()
        {
            var ErrorStack = 'Error: ';

            if( vm.ProductInfo.References   =='') { ErrorStack = ErrorStack + 'Product References is Empty \n'; }
            if( vm.ProductInfo.ImageBuffer  =='') { ErrorStack = ErrorStack + ' - ' + 'Product Image is Empty \n'; }
            if( vm.ProductInfo.RiskAnalysis =='') { ErrorStack = ErrorStack + ' - ' + 'Product RiskAnalysis is Empty \n'; }
            if( vm.ProductInfo.Designation  =='') { ErrorStack = ErrorStack + ' - ' + 'Product Designation is Empty \n';  }
            if( vm.ProductInfo.Links =='') { ErrorStack = ErrorStack + ' - ' + 'Product Links is Empty \n'; }
            if( vm.ProductInfo.TechnicalFolder == '' ) { ErrorStack = ErrorStack + ' - ' + 'Product TechnicalFolder is Empty \n'; }
            if( vm.ProductInfo.Brand == '' ) { ErrorStack = ErrorStack + ' - ' + 'Product Brand is Empty \n'; }

            if( ErrorStack != 'Error: ') { NotificationService.popAToast(ErrorStack, 5000, 'error');  }
        }
 
        // init
        init();

    }
})();


(function() {
    'use strict';

    config.$inject = ["$stateProvider", "triMenuProvider"];
    angular
        .module('app.pca')
        .config(config);

    /* @ngInject */
    function config($stateProvider, triMenuProvider) {
        $stateProvider
        .state('triangular.pca-manage', {
            url: '/PCA',
            templateUrl: 'app/laboratory/pca/pca.tmpl.html',
            controller: 'PcaController',
            controllerAs: 'vm',
            data: {
                layout: {
                    toolbarSize: 'default',
                    toolbarShrink: true,
                    toolbarClass: 'full-image-background mb-bg-11',
                    contentClass: 'full-image-background mb-bg-32',
                    sideMenuSize: 'icon',
                    footer: false
                },
                permissions: {
                    only: ['viewPCA']
                }
            }
        })
        .state('triangular.pca-add', {
            url: '/PCA-add',
            templateUrl: 'app/laboratory/pca/add_pca/add_pca.tmpl.html',
            controller: 'PcaController',
            controllerAs: 'vm',
            data: {
                layout: {
                    toolbarSize: 'default',
                    toolbarShrink: true,
                    toolbarClass: 'full-image-background mb-bg-25',
                    contentClass: 'full-image-background mb-bg-29',
                    sideMenuSize: 'icon',
                    footer: false
                },
                permissions: {
                    only: ['viewPCA']
                }
            }
        });

        triMenuProvider.addMenu({
            name: 'PCAs',
            icon: 'zmdi zmdi-assignment-o',
            type: 'dropdown',
            priority: 1,
            permission: 'viewPCA',
            children: [ 
            {
                name: 'Add',
                icon: 'fa fa-plus-square',
                state: 'triangular.pca-add',
                type: 'link'
            }]
        });
    }
})();




(function() {
    'use strict';

    angular
        .module('app.documents', [ ]);        
})();
(function() {
    'use strict';

    DocsService.$inject = ["$log", "$rootScope", "$q", "$timeout", "documentsAPIService"];
    angular
        .module('app.documents')
        .factory('DocsService', DocsService);

    /* @ngInject */
    function DocsService($log, $rootScope,  $q ,$timeout , documentsAPIService ) {
        var service = {
            storedocument: storedocument,
            GenerateTF: GenerateTF,
            s2ab: s2ab,
            ReportsStatus:ReportsStatus
        };

        return service;

        function s2ab(s) {
              var buf = new ArrayBuffer(s.length);
              var view = new Uint8Array(buf);
              for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
              return buf;
        }

        function storedocument(doc, name, Info)
         {
            var doc = {
                document : doc,
                name     : name,
                Info     : Info 
            };

            return Promise.resolve( documentsAPIService.storeDocument(doc)
                               .then(function(doc)
                               {
                                  return Promise.resolve(doc);
                               })
                               .catch(function(error){
                                  return Promise.reject(error);
                               })
                        );
         }

         function ReportsStatus(reports)
         {  
            var Idx= [];
            for(var i = 0; i < reports.length ; i++)
            {
              if(reports[i]._id != '41224d776a326fb40f000001' )
              {
                Idx.push(reports[i]._id);
              }
            }

            return Promise.resolve( 
              documentsAPIService.ReportsStatus(Idx)
                                 .then(function(Status){
                                    return Promise.resolve(Status);
                                 })
                                 .catch(function(err){
                                    // err handled by httpErr Service
                                 })
              );
         }

        function GenerateTF(QS , TechnicalFolderNbre , Brand, reports )
        {
            var zip = JSZip();

            zip.file(TechnicalFolderNbre + '_' + Brand + '_' + moment().format("YYYY-MMM-D") + ".xlsx", QS , {binary: true});

            var reportsF = zip.folder("reports");
            var j = 0;

            for(var i = 0 ; i < reports.length ; i++)
            {
              if(reports[i]._id != '41224d776a326fb40f000001')
              {
                documentsAPIService.getDocumentbyId(reports[i]._id)
                                   .then(function(report){
                                         reportsF.file(report.name, report.document , {binary: true});
                                         j++;
                                         if(j == reports.length)
                                         {
                                            var content = zip.generate({type:"blob"});
                                            $rootScope.$broadcast('TF-Finish', 'ok');
                                            saveAs(content, "MARKET_"+ TechnicalFolderNbre + '_' + Brand + '_' + moment().format("YYYY-MMM-D") + ".zip");
                                         }
                                   }).catch(function(error){
                                         j++;
                                         if(j == reports.length)
                                         {
                                            var content = zip.generate({type:"blob"});
                                            $rootScope.$broadcast('TF-Finish', 'ok');
                                            saveAs(content, "MARKET_"+ TechnicalFolderNbre + '_' + Brand + '_' + moment().format("YYYY-MMM-D") + ".zip");
                                         }
                                   })
              }
              else
              {
                  j++;
                  if(j == reports.length)
                  {
                      var content = zip.generate({type:"blob"});
                      $rootScope.$broadcast('TF-Finish', 'ok');
                      saveAs(content, "MARKET_"+ TechnicalFolderNbre + '_' + Brand + '_' + moment().format("YYYY-MMM-D") + ".zip");
                  }
              }
            }

            if(reports.length == 0)
            {
              var content = zip.generate({type:"blob"});
              $rootScope.$broadcast('TF-Finish', 'ok');
              saveAs(content, "MARKET_"+ TechnicalFolderNbre + '_' + Brand + '_' + moment().format("YYYY-MMM-D") +  ".zip");
            }
        }

    }
})();

(function() {
    'use strict';

    DocumentsController.$inject = ["$http", "$log", "$scope", "$state", "UserService", "NotificationService", "documentsAPIService", "DocsService", "$mdDialog"];
    angular
        .module('app.documents')
        .controller('DocumentsController', DocumentsController);

    // Documents page controller
    /* @ngInject */
    function DocumentsController($http, $log, $scope ,$state, UserService, NotificationService , documentsAPIService, DocsService , $mdDialog) {
        var vm = this;

        vm.GetDocsByAuthor = GetDocsByAuthor;
        vm.getreport = getreport;
        vm.deleteDocumentbyId = deleteDocumentbyId;

        vm.status = 'idle';  // idle | uploading | complete
        vm.Documents= [];


        function init() {

            getreports();
             // pop a toast telling users about the how to:
            NotificationService.popAToast('Reports Management Service.', 5000, 'info');
        }

        function getreports(){
            vm.status = 'progress';
            documentsAPIService.getDocuments()
                               .then(function(Docs){
                                    vm.Documents = Docs;
                                    vm.status = 'idle';
                               })
                               .catch(function(err){
                                    // Errors are hundled by httpErrService
                                     vm.status = 'idle';
                               })
        }
        
        function GetDocsByAuthor(Author){

            $log.info('hello: ' + Author);
        }

        function getreport(id) {
            documentsAPIService.getDocumentbyId(id)
                               .then(function(report){

                                    saveAs(new Blob([DocsService.s2ab(report.document)],{type:""}), report.name);
                                    // doc...
                               }).catch(function(error){
                                        NotificationService.popAToast('Enable to get Report', 5000, 'error');
                               })
        }


        $scope.Addreport = function (e, report) 
        {
            var j = 0;

            for(var i = 0 ; i < e.files.length ; i++)
            {
                var file = e.files[i];
                if( true)
                {
                    var reader = new FileReader();
                    reader.readAsBinaryString(file);

                    reader.onerror = function (){
                        reader.abort();
                        new DOMException('Problem parsing input file.');
                        j++;
                    };

                    reader.onload = function () {     
                        Inputdialog('Report Author ?', '').then(function(Author){
                                          Update( report._id , e.files[j].name, Author , reader.result); 
                                    })
                                    .catch(function(error){
                                        NotificationService.popAToast('Report not Updated.', 5000, 'warning');
                                    })
                    };
                }
                else 
                {
                         NotificationService.popAToast('Error: File select error.', 5000, 'error');
                }
            
                $scope.$apply();
            }
        };

        function Update(id, Name, Author, Document)
        {
            var report= {
                _id : id,
                name: Name,
                Author: Author,
                document: Document
            };

            documentsAPIService.UpdateReport(report)
                               .then(function(success){
                                    NotificationService.popAToast('Report UPDATED successfully.', 5000, 'success');
                                    getreports();
                               })
                               .catch(function(err){
                                    // err
                               })

        }

        function deleteDocumentbyId(id ){
           askdialog('Confirm Action!', ' Do you want to delete the report from Database ? All related products will be impacted !')
                         .then(function(response){
                                documentsAPIService.deleteDocumentbyId(id)
                                                   .then(function(report){

                                                        NotificationService.popAToast('Report deleted successfully', 5000, 'success');

                                                            for(var i = 0 ; i < vm.Documents.length ; i++)
                                                            {
                                                                if(vm.Documents[i]._id == id)
                                                                {
                                                                    vm.Documents.splice(i, 1);
                                                                }
                                                            }
                                                    // doc...
                                                    }).catch(function(error){
                                                        NotificationService.popAToast('Cannont delete report', 5000, 'error');
                                                    })
                         })
                        .catch(function(error){
                                 NotificationService.popAToast('Report not deleted.', 5000, 'warning');
                         })
        }

        function askdialog(message, content) {
            return $mdDialog.show(
                $mdDialog.confirm()
                .title(message)
                .textContent(content)
                .cancel('NO')
                .ok('YES')
            ).then(function(choice){
                return choice;
            })
        }

        function Inputdialog(message, content) {
            return $mdDialog.show(
                $mdDialog.prompt()
                .title(message)
                .textContent(content)
                .cancel('NO')
                .ok('YES')
            ).then(function(choice){
                return choice;
            })
        }

        init();
    }
})();
(function() {
    'use strict';

    config.$inject = ["$stateProvider", "triMenuProvider"];
    angular
        .module('app.documents')
        .config(config);

    // This service is hundling reports linked to products.
    /* @ngInject */
    function config($stateProvider, triMenuProvider) {
        $stateProvider
        .state('triangular.documents-manage', { 
            url: '/documents',
            templateUrl: 'app/laboratory/documents/documents.tmpl.html',
            controller: 'DocumentsController',
            controllerAs: 'vm',
            data: {
                layout: {
                    toolbarSize: 'default',
                    toolbarShrink: true,
                    //contentClass: 'full-image-background mb-bg-07',
                    sideMenuSize: 'icon',
                    footer: false
                },
                permissions: {
                    only: ['viewDocuments']
                }
            }
        })

        triMenuProvider.addMenu({
            id: 'Documents',
            name: 'Documents',
            icon: 'fa fa-files-o',
            type: 'link',
            state: 'triangular.documents-manage',
            priority: 5,
            permission: 'viewDocuments'
        });
    }
})();




(function() {
    'use strict';

    documentsAPIService.$inject = ["$http", "API_HGLABS", "$log", "$mdToast", "AuthenticationService", "AuthErrorService", "$state", "$cookies"];
    angular
        .module('app.documents')
        .factory('documentsAPIService', documentsAPIService);

    // This service is hundling reports linked to products.
    /* @ngInject */
    function documentsAPIService($http,API_HGLABS, $log, $mdToast, AuthenticationService, AuthErrorService , $state, $cookies) {
        var service = {
            getDocumentbyId: getDocumentbyId,
            storeDocument:storeDocument,
            getDocuments:getDocuments,
            deleteDocumentbyId:deleteDocumentbyId,
            ReportsStatus:ReportsStatus,
            UpdateReport: UpdateReport
        };

        var BaseUrlAPI = API_HGLABS.url + 'documents';

        return service;

         /**
         * Function geting list of documents (name, id)
         * @httpMethod: GET
         * @property {null}
         * @returns {promise Documents: Array[(name, id)]}
         */
        function getDocuments() {
                return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                        let promise = new Promise(function(resolve, reject){
                            $http({
                                method: 'GET',
                                url:  BaseUrlAPI,
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': Authentication.AuthToken
                                }
                            })
                            .then(function(response) {
                                resolve(response.data);
                            })
                            .catch(function(error) {
                                if(error.status != 404) { 
                                    AuthErrorService.httpError(error, "documents."); 
                                    reject('Get File Error.');
                                }
                                else{
                                   error.status = 4040;
                                   AuthErrorService.httpError(error, "File Not Found.");
                                   reject('File Not Found.');
                                }
                            });
                        });
                        return promise;
                    }
                })
              .catch(function(error)
              {
                //AuthErrorService.AuthError(error);
                return Promise.reject(error);
              })
          );
        }

         /**
         * Function geting a document by it's id
         * @httpMethod: GET
         * @property {id: String}
         * @returns {promise Document: DocumentObj}
         */

        function getDocumentbyId(id) {
                return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'GET',
                            url:  BaseUrlAPI + '/' +id ,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            }
                        })
                        .then(function(response) {
                            resolve(response.data);
                        })
                        .catch(function(error) {
                            
                            if(error.status != 404) { 
                                AuthErrorService.httpError(error, "document by id."); 
                                reject('Get File Error.');
                            }
                            else{
                               error.status = 4040;
                               AuthErrorService.httpError(error, "File Not Found.");
                               reject('File Not Found.');
                            }
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                //AuthErrorService.AuthError(error);
                return Promise.reject(error);
              })
          );
        }

         /**
         * Function deleting document from DB
         * @httpMethod: DELETE
         * @property {id: String}
         * @returns {promise Document: deleted Doc}
         */

        function deleteDocumentbyId(id) {
                return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'DELETE',
                            url:  BaseUrlAPI + '/' +id ,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            }
                        })
                        .then(function(response) {
                            resolve(response.data);
                        })
                        .catch(function(error) {
                            
                            if(error.status != 404) { 
                                AuthErrorService.httpError(error, "Delete document by id."); 
                                reject('Get File Error.');
                            }
                            else{
                               error.status = 4040;
                               AuthErrorService.httpError(error, "File Not Found.");
                               reject('File Not Found.');
                            }
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                //AuthErrorService.AuthError(error);
                return Promise.reject(error);
              })
          );
        }

         /**
         * Function store document in DB
         * @httpMethod: POST
         * @property {id: String}
         * @returns {promise Document: DocumentObj}
         */
        function storeDocument(document) {

            return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'POST',
                            url: BaseUrlAPI,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            },
                            data: document
                        })
                        .then(function(response) {
                            resolve(response.data);
                        })
                        .catch(function(error) {
                            reject('store document ERROR');
                            AuthErrorService.httpError(error, 'store document.');
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                AuthErrorService.httpError(error, 'store document.');
              })
          );
        }

         /**
         * Function getting reports status (if a report exists in DB or not anymore)
         * @httpMethod: POST
         * @property {idx: Array[String]}
         * @returns {promise Array[bool]}
         **/
        function ReportsStatus(Idx) {
            return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'POST',
                            url: BaseUrlAPI + '/status',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            },
                            data: { 'Idx': Idx }
                        })
                        .then(function(response) {
                            resolve(response.data);
                        })
                        .catch(function(error) {
                            reject('Get Reports Status ERROR');
                            AuthErrorService.httpError(error, 'Get Reports Status.');
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                AuthErrorService.httpError(error, 'Get Reports Status.');
              })
          );
        }

         /**
         * Function update a report content by a new report
         * @httpMethod: PUT
         * @property {report: DocObj}
         * @returns {promise Document: DocObj}
         */
        function UpdateReport(report) {
                return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'PUT',
                            url:  BaseUrlAPI  ,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            },
                            data: report
                        })
                        .then(function(response) {
                            resolve(response.data);
                        })
                        .catch(function(error) {
                            
                            if(error.status != 404) { 
                                AuthErrorService.httpError(error, "UPDATE document : " + error.data.message); 
                                reject('UPDATE document Error.');
                            }
                            else{
                               error.status = 4040;
                               AuthErrorService.httpError(error, "UPDATE document: " +  error.data.message);
                               reject('UPDATE document.');
                            }
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                //AuthErrorService.AuthError(error);
                return Promise.reject(error);
              })
          );
        }

    }
})();

(function() {
    'use strict';

    // This service is hundling directives.
    angular
        .module('app.directives', [ ]);        
})();

(function() {
    'use strict';

    // This service is hundling directives.
    DirectivesService.$inject = ["$log", "$q", "$timeout", "DirectivesAPIService"];
    angular
        .module('app.directives')
        .factory('DirectivesService', DirectivesService);

    /* @ngInject */
    function DirectivesService($log, $q ,$timeout , DirectivesAPIService ) {
        var service = {
            
        };

        return service;

    }
})();


(function() {
    'use strict';

    // This service is hundling directives.
    DirectivesAPIService.$inject = ["$http", "API_HGLABS", "$log", "$mdToast", "AuthenticationService", "AuthErrorService", "$state", "$cookies"];
    angular
        .module('app.directives')
        .factory('DirectivesAPIService', DirectivesAPIService);

    /* @ngInject */
    function DirectivesAPIService($http,API_HGLABS, $log, $mdToast, AuthenticationService, AuthErrorService , $state, $cookies) {
        var service = {
            getDirectives: getDirectives,
            storeDirective:storeDirective,
            getDirectivebyId:getDirectivebyId,
            deleteDirectivebyId:deleteDirectivebyId
         };

        var BaseUrlAPI = API_HGLABS.url + 'directives'; // Module Constant

        // All the above methods need an Access Token to be used.
        return service;

         /**
         * getDirectives
         * @property {null}
         * @returns {promise (Directives: Array[Directive Object])}
         */
        function getDirectives() {
                return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                        let promise = new Promise(function(resolve, reject){
                            $http({
                                method: 'GET',
                                url:  BaseUrlAPI,
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': Authentication.AuthToken
                                }
                            })
                            .then(function(response) {
                                resolve(response.data);
                            })
                            .catch(function(error) {
                                if(error.status != 404) { 
                                    AuthErrorService.httpError(error, "directives."); 
                                    reject('Get File Error.');
                                }
                                else{
                                   error.status = 4040;
                                   AuthErrorService.httpError(error, "File Not Found.");
                                   reject('File Not Found.');
                                }
                            });
                        });
                        return promise;
                    }
                })
              .catch(function(error)
              {
                //AuthErrorService.AuthError(error);
                return Promise.reject(error);
              })
          );
        }

         /**
         * Get a Directive by it's id
         * @property {id: String}
         * @returns {promise (Directive: Directive Object }
         */

        function getDirectivebyId(id) {
                return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'GET',
                            url:  BaseUrlAPI + '/' +id ,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            }
                        })
                        .then(function(response) {
                            resolve(response.data);
                        })
                        .catch(function(error) {
                            
                            if(error.status != 404) { 
                                AuthErrorService.httpError(error, "directive by id."); 
                                reject('Get File Error.');
                            }
                            else{
                               error.status = 4040;
                               AuthErrorService.httpError(error, "File Not Found.");
                               reject('File Not Found.');
                            }
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                //AuthErrorService.AuthError(error);
                return Promise.reject(error);
              })
          );
        }

         /**
         * delete a Directive by it's id
         * @property {id: String}
         * @returns {promise (Directive: Directive Object }
         */

        function deleteDirectivebyId(id) {
                return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'DELETE',
                            url:  BaseUrlAPI + '/' +id ,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            }
                        })
                        .then(function(response) {
                            resolve(response.data);
                        })
                        .catch(function(error) {
                            
                            if(error.status != 404) { 
                                AuthErrorService.httpError(error, "Delete directive by id."); 
                                reject('Get File Error.');
                            }
                            else{
                               error.status = 4040;
                               AuthErrorService.httpError(error, "File Not Found.");
                               reject('File Not Found.');
                            }
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                //AuthErrorService.AuthError(error);
                return Promise.reject(error);
              })
          );
        }

         /**
         * store a Directive in server's db
         * @property {Directive: Directive Object }
         * @returns {promise (stored directive: Directive Object }
         */

        function storeDirective(directive) {

            return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'POST',
                            url: BaseUrlAPI,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            },
                            data: directive
                        })
                        .then(function(response) {
                            return resolve(response.data);
                        })
                        .catch(function(error) {
                            return reject('store directive ERROR');
                            AuthErrorService.httpError(error, 'store directive.');
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                AuthErrorService.httpError(error, 'store directive.');
              })
          );
        }

 
  

    }
})();

(function() {
    'use strict';

    angular
        .module('app.dashboard', []);        
})();
(function() {
    'use strict';

    DashboardController.$inject = ["$log", "$scope", "$mdDialog", "$state", "UserService", "NotificationService", "DirectivesAPIService", "StandardsAPIService", "PCAManagementService", "ProductsAPIService", "ProductsManagementService", "StandardsManagementService", "documentsAPIService", "DocsService"];
    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    // Documents page controller
    /* @ngInject */
    function DashboardController($log, $scope , $mdDialog ,$state, UserService, NotificationService, DirectivesAPIService, StandardsAPIService , PCAManagementService , ProductsAPIService, ProductsManagementService , StandardsManagementService , documentsAPIService, DocsService ) {

        // This controller
        var vm = this;

        // VARS 
        vm.status = 'idle';  // idle | uploading | complete
        vm.products = [];
 
        vm.Backup = {
            Productidx: 0,
            Status: 'Stop',
            Progress: 0
        };

        vm.StatsStatus = {
           Stds: true,
           Products: true,
        };

        vm.Number = {
            Products: 0,
            Standards:0 ,
            Documents: 0,
            Directives: 0
        };

        vm.Stats = 
        {
            Standards: {
                        labels: [],
                        data: []
                    },
            Products: {
                        Standards : {
                            labels: [],
                            data: []
                        },
                        Tests: {
                            labels: [],
                            data: []
                        }
                    }
        };
 
        vm.options = {
            datasetFill: false,
            legend: {
                position: 'right'
            }
        };

        // Methods 
        vm.BackupProjects = BackupProjects;

        // init

            init(); 

        // Methods Implementation

        function init() {

            getreports();
            getStandards();
            getProducts();
            getDirectives();
        }

        function getreports(){
            vm.status = 'progress';
            documentsAPIService.getDocuments()
                               .then(function(Docs){
                                    vm.Number.Documents = Docs.length;
                                    vm.status = 'idle';
                               })
                               .catch(function(err){
                                    // Errors are hundled by httpErrService
                                     vm.status = 'idle';
                               })
        }
        

        function getStandards () {
            vm.status = 'progress';
            StandardsAPIService.getStandardsList()
                               .then(function(standards) {
                                if(standards != undefined)
                                    {
                                        buildStdStats( StandardsManagementService.FormatStandards(standards) );
                                        vm.Number.Standards = standards.length;
                                        vm.status = 'idle';                                 
                                    }
                               })
                               .catch(function(error)
                               {
                                  AuthErrorService.httpError(error, 'Problem Get Standards.');
                                  vm.status = 'idle';
                               })
        }

        function getProducts(){
             
            vm.status = 'progress';
            vm.products = [];
            
            new Promise(function(resolve){
                resolve(ProductsAPIService.getProducts()); 
            }).then(function(products){
                
                vm.Number.Products = products.length;
                products = ProductsManagementService.FormatProducts(products);
                if(products.length == 0)
                {
                    vm.StatsStatus.Products = false ;
                }
                for(var i = 0 ; i < products.length ; i++)
                {
                    ProductsManagementService.TagProduct(products[i])  
                                             .then(function(TagedProduct) {

                                                     vm.products.push(TagedProduct);
                                                     $scope.$apply();
                                                     if(vm.products.length == products.length )
                                                     {
                                                        buildProductsStdsStats(vm.products);
                                                        buildProductsTestStats(vm.products);
                                                        vm.status = 'idle';
                                                        $scope.$apply();
                                                     }
                                             })
                                             .catch(function(error){
                                                vm.status = 'idle';
                                                // can't tag the product
                                             })                     
                }
            })
            .catch(function (error){
                NotificationService.popAToast("Can't get product list.", 5000, 'warning');
                vm.status = 'idle';
            })
        }     

        function getDirectives()
        {
            DirectivesAPIService.getDirectives()
                                .then(function(directives){
                                    vm.Number.Directives = directives.length;
                                }) 
        }

        function buildStdStats(Standards)
        {
            vm.StatsStatus.Stds = true;
            var U2D  = 0;
            var deprecated = 0;

            for(var i=0 ; i < Standards.length ; i++)
            {
                if(Standards[i].Infos.HasUpdate == 0)
                {
                    U2D = U2D +1;
                }
                else
                {
                    deprecated = deprecated +1;
                }
            }

            vm.Stats.Standards.data.push( U2D , deprecated ); 
            vm.Stats.Standards.labels.push('Uptodate: '+ U2D,'deprecated: '+ deprecated);
            vm.StatsStatus.Stds = false;
        }

        function buildProductsStdsStats(Products)
        {
            vm.StatsStatus.Products = true ;
            var U2D  = 0; //Up-to-date
            var OOD = 0;  //Out-of-date

            for(var i=0 ; i < Products.length ; i++)
            {
                var UpdateStatus = getProductStatus(Products[i]);
                if(UpdateStatus == 0 )
                {
                    U2D = U2D + 1 ;
                }
                else
                {
                    OOD = OOD +1;
                }
            }

            vm.Stats.Products.Standards.data.push( U2D , OOD ); 
            vm.Stats.Products.Standards.labels.push('Up-to-date: '+ U2D ,'Out-of-date: '+ OOD);
            vm.StatsStatus.Products = false ;
        }

        function buildProductsTestStats(Products)
        {
            var Complete = 0;  // Complete Test
            var CompleteF = 0;  // Complete with some failed tests 
            var Incomplete  = 0; // Uncomplete tests
            vm.StatsStatus.Products = true ;

            for(var i=0 ; i < Products.length ; i++)
            {
                if(Products[i].TestStatus == 'Complete')
                {
                    Complete = Complete + 1 ;
                }
                else if (Products[i].TestStatus == 'CompleteF')
                {
                    CompleteF = CompleteF +1;
                }
                else if (Products[i].TestStatus == 'Incomplete')
                {
                    Incomplete = Incomplete +1;
                }
            }

            vm.Stats.Products.Tests.data.push( Complete , CompleteF , Incomplete ); 
            vm.Stats.Products.Tests.labels.push('Complete: '+ Complete ,'CompleteF: '+ CompleteF , 'Incomplete: ' + Incomplete);
            vm.StatsStatus.Products = false ;
        }
       // Backup 
        function BackupProjects(idx)
        {
            if(vm.Backup.Status == 'Stop')
            {
                vm.Backup.Productidx = 0;
                vm.Backup.Progress = ( vm.Backup.Productidx )* 100 / vm.products.length ;
            }
            vm.Backup.Status = 'Ongoing';

            var res = PCAManagementService.JsontoPCA(vm.products[idx], vm.products[idx].ProductInfo.TechnicalFolder , 'ALL'); 
            var QS = res[0];
            DocsService.GenerateTF(QS , vm.products[idx].ProductInfo.TechnicalFolder , vm.products[idx].ProductInfo.Brand, ExtractReportList(vm.products[idx]));
        }

 
        // Listen to Doc service TF generation finish events -> Update progress % and Status
        $scope.$on('TF-Finish', function(event, status) {

                vm.Backup.Productidx = vm.Backup.Productidx +1;
                vm.Backup.Progress = ( vm.Backup.Productidx )* 100 / vm.products.length ;

                if(vm.Backup.Productidx < vm.products.length && vm.Backup.Status == 'Ongoing')
                {
                    BackupProjects(vm.Backup.Productidx);
                }
                if(vm.Backup.Productidx == vm.products.length )
                {
                    vm.Backup.Status = false;
                    vm.Backup.Status = 'Stop'
                    vm.Backup.Productidx = 0;
                    NotificationService.popAToast("Download Completed.", 5000, 'success');
                }
                if(vm.Backup.Status == 'Stop')
                {
                    vm.Backup.Productidx = 0;
                }
        });


        // Tools

        function ExtractReportList(product)
        {
            var Standards = Object.keys(product.ProductJSON.Standards);
            var reports = [];
            for(var i = 0; i < Standards.length ; i++)
            {
                for(var j = 0; j < product.ProductJSON.Standards[Standards[i]].Designations.length ; j++)
                {
                    var Point = product.ProductJSON.Standards[Standards[i]].Designations[j];
                    if(Array.isArray(Point.Reports))
                    {
                        Array.prototype.push.apply(reports ,Point.Reports);
                    }
                }
            }
            return unique(reports);
        }
 
        function getProductStatus(product)
        {
            var UpdateCount = 0;
            var standards = Object.keys(product.ProductJSON.Standards);
            for(var i = 0 ; i < standards.length; i++)
            {
                if(product.ProductJSON.Standards[standards[i]].Updates != undefined)
                        UpdateCount = UpdateCount + product.ProductJSON.Standards[standards[i]].Updates.length ;
                else
                   {
                        UpdateCount = 0;
                        break;
                   }     
            }
            return UpdateCount;
        }    

        function unique(a) {
            if(a[0])
                var unique = [a[0]];
            else
                var unique = [];
            for(var i=0 ; i < a.length ; i++)
            {
                for(var j = 0 ; j < unique.length ; j++)
                {
                    if( a[i].name == unique[j].name )
                    {
                        break;
                    }
                    if( a[i].name != unique[j].name && j == unique.length -1)
                    {
                        unique.push(a[i]);
                        break;
                    }  
                }
            }
            return unique;
        }

    }
})();
(function() {
    'use strict';

    config.$inject = ["$stateProvider", "triMenuProvider"];
    angular
        .module('app.dashboard')
        .config(config);

    // This service is hundling reports linked to products.
    /* @ngInject */
    function config($stateProvider, triMenuProvider) {
        $stateProvider
        .state('triangular.dashboard', { 
            url: '/dashboard',
            templateUrl: 'app/laboratory/dashboard/dashboard.tmpl.html',
            controller: 'DashboardController',
            controllerAs: 'vm',
            data: {
                layout: {
                    toolbarSize: 'default',
                    toolbarShrink: true,
                    //contentClass: 'full-image-background mb-bg-07',
                    sideMenuSize: 'icon',
                    footer: false
                },
                permissions: {
                    only: ['viewDashboard']
                }
            }
        })

        triMenuProvider.addMenu({
            id: 'Dashboard',
            name: 'Dashboard',
            icon: 'fa fa-dashboard',
            type: 'link',
            state: 'triangular.dashboard',
            priority: 0,
            permission: 'viewDashboard'
        });
    }
})();
(function() {
    'use strict';

    angular
        .module('app.examples.extras', [

        ]);
})();
(function() {
    'use strict';

    angular
        .module('app.examples.extras')
        .controller('TimelineController', TimelineController);

    /* @ngInject */
    function TimelineController() {
        var vm = this;
        vm.events = [{
            title: 'Material Design',
            subtitle: 'We challenged ourselves to create a visual language for our users that synthesizes the classic principles of good design with the innovation and possibility of technology and science.',
            date:'27/6/2015',
            image: 'assets/images/avatars/hair-black-eyes-blue-green-skin-tanned.png',
            content: '<img src="assets/images/backgrounds/material-backgrounds/mb-bg-01.jpg"/>',
            palette: ''
        },{
            title: 'Dorothy Lewis',
            subtitle: 'Design Magazine',
            date:'27/6/2015',
            image: 'assets/images/avatars/hair-black-eyes-brown-skin-tanned.png',
            content: '<p class="padding-10 font-size-3 font-weight-200 line-height-big">This spec is a living document that will be updated as we continue to develop the tenets and specifics of material design.</p>',
            palette: 'cyan:500'
        },{
            title: 'Goals',
            subtitle: 'Create a visual language that synthesizes classic principles of good design with the innovation and possibility of technology and science.',
            date:'26/6/2015',
            image: 'assets/images/avatars/hair-blonde-eyes-brown-skin-light.png',
            content: '<img src="assets/images/backgrounds/material-backgrounds/mb-bg-02.jpg"/>',
            palette: 'cyan:500',
            classes: 'widget-overlay-title'
        },{
            title: 'Principles',
            subtitle: 'A material metaphor is the unifying theory of a rationalized space and a system of motion. ',
            date:'24/6/2015',
            image: 'assets/images/avatars/hair-black-eyes-dark-skin-dark.png',
            content: '<img src="assets/images/backgrounds/material-backgrounds/mb-bg-03.jpg"/>'
        },{
            title: 'Joe Ross',
            subtitle: 'CEO Google',
            date:'23/6/2015',
            image: 'assets/images/avatars/hair-blonde-eyes-blue-green-skin-light.png',
            content: '<p class="padding-10 font-size-3 font-weight-200 line-height-big">Surfaces and edges of the material provide visual cues that are grounded in reality. The use of familiar tactile attributes helps users quickly understand affordances.</p> ',
            palette: 'purple:500'
        },{
            title: 'Sam Ross',
            subtitle: 'CEO Facebook',
            date:'23/6/2015',
            image: 'assets/images/avatars/hair-blonde-eyes-blue-green-skin-light.png',
            content: '<p class="padding-10 font-size-3 font-weight-200 line-height-big">The color palette starts with primary colors and fills in the spectrum to create a complete and usable palette for Android, Web, and iOS.</p> ',
            palette: 'deep-orange:700'
        },{
            title: 'John King',
            subtitle: 'Limit your selection of colors by choosing three hues from the primary palette and one accent color from the secondary palette.',
            date:'17/6/2015',
            image: 'assets/images/avatars/hair-black-eyes-brown-skin-dark.png',
            content: '<img src="assets/images/backgrounds/material-backgrounds/mb-bg-04.jpg"/>',
            palette: 'cyan:500',
            classes: 'widget-overlay-title'
        },{
            title: 'Christos Pantazis',
            subtitle: 'CEO Facebook',
            date:'23/6/2015',
            image: 'assets/images/avatars/hair-blonde-eyes-blue-green-skin-light.png',
            content: '<p class="padding-10 font-size-3 font-weight-200 line-height-big">For white or black text on colored backgrounds, see these tables of color palettes for the appropriate contrast ratios and hex values.</p> ',
            palette: 'red:50'
        },{
            title: 'Accent color',
            subtitle: 'Use the accent color for your primary action button and components like switches or sliders.',
            date:'12/6/2015',
            image: 'assets/images/avatars/hair-black-eyes-brown-skin-tanned-2.png',
            content: '<img src="assets/images/backgrounds/material-backgrounds/mb-bg-05.jpg"/>',
            palette: 'cyan:500',
            classes: 'widget-overlay-title'
        }];
    }
})();
(function() {
    'use strict';

    angular
        .module('app.examples.extras')
        .directive('replaceWith', replaceWith);

    /* @ngInject */
    function replaceWith() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$observe('replaceWith', function(value) {
                if (value) {
                    element.replaceWith(angular.isUndefined(value) ? '' : value);
                }
            });
        }
    }
})();
(function() {
    'use strict';

    GalleryController.$inject = ["$mdDialog"];
    angular
        .module('app.examples.extras')
        .controller('GalleryController', GalleryController);

    /* @ngInject */
    function GalleryController($mdDialog) {
        var vm = this;
        vm.feed = [];
        vm.openImage = openImage;

        ////////////////

        // number of days of dummy data to show
        var numberOfFeedDays = 5;
        var loremPixelCategories = ['abstract', 'city', 'people', 'nature', 'food', 'fashion', 'nightlife'];

        function randomImage(title) {
            var randImage = Math.floor((Math.random() * 10) + 1);
            var randomCategory = loremPixelCategories[Math.floor((Math.random() * (loremPixelCategories.length-1)) + 1)];

            var width = [300, 640];
            var height = [225, 480];

            var image = {
                url: 'http://lorempixel.com/',
                urlFull: 'http://lorempixel.com/',
                title: title
            };


            if(Math.random() < 0.7) {
                image.url += width[0] + '/' + height[0];
                image.urlFull += width[1] + '/' + height[1];
                image.rowspan = 2;
                image.colspan = 2;
            }
            else {
                image.url += height[0] + '/' + width[0];
                image.urlFull += height[1] + '/' + width[1];
                image.rowspan = 2;
                image.colspan = 1;
            }

            image.url += '/' + randomCategory + '/' + randImage;
            image.urlFull += '/' + randomCategory + '/' + randImage;

            return image;
        }

        function createDayOfImages(day) {
            var dayFeed = {
                date: moment().subtract(day, 'days'),
                images: []
            };

            var numberOfImages = Math.floor((Math.random() * 4) + 6);
            for(var i = 0; i < numberOfImages; i++) {
                dayFeed.images.push(randomImage('Photo ' + (i+1)));
            }

            return dayFeed;
        }

        function openImage(day, image, $event) {
            $mdDialog.show({
                controller: 'GalleryDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/examples/extras/gallery-dialog.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                targetEvent: $event,
                locals: {
                    day: day,
                    image: image
                }
            });
        }

        function createFeed() {
            for(var day = 0; day < numberOfFeedDays; day++) {
                vm.feed.push(createDayOfImages(day));
            }
        }

        // init

        createFeed();
    }
})();
(function() {
    'use strict';

    GalleryDialogController.$inject = ["$mdDialog", "day", "image"];
    angular
        .module('app.examples.extras')
        .controller('GalleryDialogController', GalleryDialogController);

    /* @ngInject */
    function GalleryDialogController($mdDialog, day, image) {
        var vm = this;
        vm.currentImage = image;
        vm.next = next;
        vm.prev = prev;

        function next() {
            var index = day.images.indexOf(vm.currentImage);
            index = index + 1 < day.images.length ? index + 1 : 0;
            vm.currentImage = day.images[index];
        }

        function prev() {
            var index = day.images.indexOf(vm.currentImage);
            index = index - 1 < 0 ? day.images.length -1 : index - 1;
            vm.currentImage = day.images[index];
        }
    }
})();

(function() {
    'use strict';

    moduleConfig.$inject = ["$stateProvider", "triMenuProvider"];
    angular
        .module('app.examples.extras')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.extra-gallery', {
            url: '/extras/gallery',
            templateUrl: 'app/examples/extras/gallery.tmpl.html',
            controller: 'GalleryController',
            controllerAs: 'vm'
        })
        .state('triangular.extra-avatars', {
            url: '/extras/avatars',
            templateUrl: 'app/examples/extras/avatars.tmpl.html',
            controller: 'AvatarsController',
            controllerAs: 'vm'
        })
        .state('triangular.extra-blank', {
            url: '/extras/blank',
            templateUrl: 'app/examples/extras/blank.tmpl.html',
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.extra-timeline', {
            url: '/extras/timeline',
            templateUrl: 'app/examples/extras/timeline.tmpl.html',
            controller: 'TimelineController',
            controllerAs: 'vm'
        });
 
    }
})();

(function() {
    'use strict';

    angular
        .module('app.examples.extras')
        .controller('AvatarsController', AvatarsController);

    /* @ngInject */
    function AvatarsController() {
        var vm = this;
        vm.avatars = [{
            title: 'Carl Barnes',
            subtitle:'Designer',
            image: 'assets/images/avatars/hair-black-eyes-blue-green-skin-tanned.png',
            color: 'blue',
            hue: '500',
            rowspan: 2,
            colspan: 2
        },{
            title: 'Dorothy Lewis',
            subtitle:'Designer',
            image: 'assets/images/avatars/hair-black-eyes-brown-skin-tanned.png',
            color: 'pink',
            hue: '500',
            rowspan: 1,
            colspan: 1
        },{
            title: 'Harris Kwnst',
            subtitle:'Developer',
            image: 'assets/images/avatars/hair-blonde-eyes-brown-skin-light.png',
            color: 'blue',
            hue: '200',
            rowspan: 1,
            colspan: 1
        },{
            title: 'Sue Ross',
            subtitle:'Marketing',
            image: 'assets/images/avatars/hair-black-eyes-dark-skin-dark.png',
            color: 'green',
            hue: '500',
            rowspan: 2,
            colspan: 2
        },{
            title: 'Joe Ross',
            subtitle:'Finance',
            image: 'assets/images/avatars/hair-blonde-eyes-blue-green-skin-light.png',
            color: 'red',
            hue: '500',
            rowspan: 2,
            colspan: 2
        },{
            title: 'Shirley King',
            subtitle:'Designer',
            image: 'assets/images/avatars/hair-blonde-eyes-brown-skin-tanned.png',
            color: 'blue',
            hue: '200',
            rowspan: 2,
            colspan: 2
        },{
            title: 'John King',
            subtitle:'Developer',
            image: 'assets/images/avatars/hair-black-eyes-brown-skin-dark.png',
            color: 'yellow',
            hue: '900',
            rowspan: 1,
            colspan: 1
        },{
            title: 'Mary Rose',
            subtitle:'Advertising',
            image: 'assets/images/avatars/hair-grey-eyes-dark-skin-tanned.png',
            color: 'pink',
            hue: '800',
            rowspan: 1,
            colspan: 1
        },{
            title: 'Morris Onions',
            subtitle:'Finance',
            image: 'assets/images/avatars/hair-black-eyes-brown-skin-tanned-2.png',
            color: 'orange',
            hue: '800',
            rowspan: 1,
            colspan: 1
        }];
    }
})();

(function() {
    'use strict';

    animateElements.$inject = ["$interval"];
    angular
        .module('app.examples.extras')
        .directive('animateElements', animateElements);

    /* @ngInject */
    function animateElements($interval) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link($scope, $element) {
            var $widgets  = [];
            var $dividers = [];


            function isLoaded(widget) {
                return widget.clientHeight > 1;
            }

            // using interval checking since window load event does not work on some machines
            var widgetsLoaded = $interval(function() {
                $widgets = $element.find('.timeline-widget');
                if($widgets.length > 0 && $widgets.toArray().every(isLoaded)) {
                    $dividers = $element.find('.timeline-x-axis');
                    onScrollCallback();
                    $interval.cancel(widgetsLoaded);
                }
            }, 1000);

            var onScrollCallback =  function() {
                for(var i = 0; i < $widgets.length; i++) {
                    if(angular.element($widgets[i]).offset().top <= angular.element(window).scrollTop() + angular.element(window).height() * 0.80 && angular.element($widgets[i]).height() > 1) {
                        var dir = ( i % 2 === 0 ) ? 'left':'right';
                        angular.element($dividers[i]).addClass('timeline-content-animated '+ dir);
                        angular.element($widgets[i]).addClass('timeline-content-animated '+ dir);
                    }
                }
            };

            angular.element('md-content').bind('scroll', onScrollCallback).scroll();
        }
    }
})();

(function() {
    'use strict';

    /* This Module hundling the Authentication processes in the app, singup , login, accessToken, validity check. */ 

    angular
        .module('app.Authentication', [
        ]);

})();
(function() {
    'use strict';

    signupController.$inject = ["$scope", "$state", "$mdToast", "$http", "$filter", "NotificationService", "AuthenticationAPIService", "AuthErrorService", "triSettings"];
    angular
        .module('app.Authentication')
        .controller('signupController', signupController);

    /* Signup Controller */
    
    /* @ngInject */
    function signupController($scope, $state, $mdToast, $http, $filter, NotificationService, AuthenticationAPIService, AuthErrorService , triSettings) {
        var vm = this;
        vm.triSettings = triSettings;
        vm.signupClick = signupClick;
        vm.avatar = 'avatar-1';
        vm.user = {
            username: '',
            email: '',
            password: '',
            confirm: '',
            avatar: ''
        };

        ////////////////

         /**
         * signup function. This function will try to create a new user in the database.
         * @property {Obj: UserInfo}
         * @UserInfo = { username: '{string}', email: '{string: Format mail}', password: '{string}'}; 
         * @returns {promise (UserObj)}
         * UserObj = {User}
         * @Errors: http error: hundled by AuthErrorService.
         */

        function signupClick() {
            vm.user.avatar = 'assets/images/avatars/'+ vm.avatar +'.png';
            AuthenticationAPIService.signup(vm.user)
                                    .then(function(user)
                                    {
                                         NotificationService.popAToast('login as: ' + user.username + ' ?', 10000)
                                                            .then(function(response){
                                                                if(response == true)
                                                                { 
                                                                    $state.go('Authentication.login', {credentials: vm.user}) ;  
                                                                }
                                                            })      
                                    }).catch(function(error){
                                        AuthErrorService.httpError(error, error.statusText + ' : ' + error.data.message);
                                    })
        }

    }
})();

(function() {
    'use strict';

    angular
        .module('app.Authentication')
        .controller('ProfileController', ProfileController);

    /* @ngInject */
    function ProfileController() {
        var vm = this;
        vm.settingsGroups = [{
            name: 'Account Settings',
            settings: [{
                title: 'Show my location',
                icon: 'zmdi zmdi-pin',
                enabled: true
            },{
                title: 'Show my avatar',
                icon: 'zmdi zmdi-face',
                enabled: false
            },{
                title: 'Send me notifications',
                icon: 'zmdi zmdi-notifications-active',
                enabled: true
            }]
        },{
            name: 'Chat Settings',
            settings: [{
                title: 'Show my username',
                icon: 'zmdi zmdi-account',
                enabled: true
            },{
                title: 'Make my profile public',
                icon: 'zmdi zmdi-account-box',
                enabled: false
            },{
                title: 'Allow cloud backups',
                icon: 'zmdi zmdi-cloud-upload',
                enabled: true
            }]
        }];
        vm.user = {
            name: 'Christos',
            email: 'info@oxygenna.com',
            location: 'Sitia, Crete, Greece',
            website: 'http://www.oxygenna.com',
            twitter: 'oxygenna',
            bio: 'We are a small creative web design agency \n who are passionate with our pixels.',
            current: '',
            password: '',
            confirm: ''
        };
    }
})();
(function() {
    'use strict';

    loginController.$inject = ["$state", "$stateParams", "AuthenticationService", "UserService", "AuthenticationAPIService", "NotificationService", "triSettings", "AuthErrorService"];
    angular
        .module('app.Authentication')
        .controller('loginController', loginController);

    /* @ngInject */
    function loginController($state, $stateParams , AuthenticationService , UserService , AuthenticationAPIService, NotificationService, triSettings , AuthErrorService) {
        var vm = this;
        vm.loginClick = loginClick;
        vm.loginAsGuest = loginAsGuest;
        
        vm.signup     = signup; 
        vm.socialLogins = [{
            icon: 'fa fa-twitter',
            color: '#5bc0de',
            url: '#'
        },{
            icon: 'fa fa-facebook',
            color: '#337ab7',
            url: '#'
        },{
            icon: 'fa fa-google-plus',
            color: '#e05d6f',
            url: '#'
        },{
            icon: 'fa fa-linkedin',
            color: '#337ab7',
            url: '#'
        }];
        vm.triSettings = triSettings;
        // create blank user variable for login form
        vm.credentials = {
            email: '',
            password: ''
        };

        // 
        init();

         /**
         * init controller
         * @property {Obj: UserInfo}
         * @UserInfo = { username: '{string}', email: '{string: Format mail}', password: '{string}'}; 
         * @returns {promise (UserObj)}
         * UserObj = {User}
         * @Errors: http error: hundled by the calling method
         */

        function init()
        {
            if($stateParams.credentials)
                {
                    vm.credentials = angular.copy($stateParams.credentials);
                }

            AutoConnect();
        }
        ////////////////

         /**
         * Auto connection method: this function checks if a Token is available in the app then asks the server for the corresponding user.
         * If a user is available, then the app proposes an auto-connect to the user. After 10 seconds time out, the  corresponding user will 
         * be connected automatically.
         * @property {null}
         * @returns {null}
         */

        function AutoConnect()
        {
            AuthenticationService.getUserByToken()
                                 .then(function(user) {
                                    if(user.username)
                                    {
                                        NotificationService.popAToast('Connect as: ' + user.username + ' ?', 10000, 'ask')
                                        .then(function(response){
                                            if(response == true)
                                            {
                                                NotificationService.popAToast('Wellcome back ' + UserService.getCurrentUser().username, 3000 , 'info');
                                                $state.go('triangular.dashboard');
                                            }
                                        })
                                    }
                        })
                        .catch(function(err) {
                            // it's okey, just conenct with crentials.
                        })
        }

         /**
         * Connect function : Function using credentials to connect the user
         * @property {Obj: credentials}
         * @ credentials = {
            email: '',
            password: ''
          };
         * @returns {promise (UserObj)}
         * UserObj = {User}
         * @Errors: http error: hundled by the calling method
         */
        function loginClick() {
                Promise.resolve(AuthenticationService.login(vm.credentials))
                       .then(function(User) {
                               UserService.setCurrentUser(User);
                               NotificationService.popAToast('Wellcome back ' + UserService.getCurrentUser().username, 3000, 'info');
                               $state.go('triangular.dashboard') ;
                        })
                        .catch(function(err) {
                               AuthErrorService.httpError( err, 'login Error.');
                               //NotificationService.popAToast('Error: '+ err.status + err.statusText + ' : ' + err.data, 5000 , 'security');
                        }) 
        }

         /**
         * Function aking to server for a user having 'ANONYMOUS' role. The app will connect using this user's info.
         * @property {null}
         * @returns {promise (UserObj)}
         * UserObj = {User}
         * @Errors: http error: hundled by AuthErrorService
         */
        function loginAsGuest() {
                Promise.resolve(AuthenticationService.loginAsGuest())
                       .then(function(User) {
                               UserService.setCurrentUser(User);
                               NotificationService.popAToast('Wellcome: ' + UserService.getCurrentUser().username, 3000, 'info');
                               $state.go('triangular.dashboard') ;
                        })
                        .catch(function(err) {
                               AuthErrorService.httpError( err, 'login Error.');
                               //NotificationService.popAToast('Error: '+ err.status + err.statusText + ' : ' + err.data, 5000 , 'security');
                        }) 
        }

         /**
         * Function changing the state of the app to signup page.
         * @property {null}
         * @Errors: http error: hundled by ui.router module
         */
        function signup(){
            $state.go('Authentication.signup') ;
        }


    }
})();

(function() {
    'use strict';

    LockController.$inject = ["$state", "triSettings"];
    angular
        .module('app.Authentication')
        .controller('LockController', LockController);

    /* @ngInject */
    function LockController($state, triSettings) {
        var vm = this;
        vm.loginClick = loginClick;
        vm.user = {
            name: 'Morris Onions',
            email: 'info@oxygenna.com',
            password: ''
        };
        vm.triSettings = triSettings;

        ////////////////

        // controller to handle login check
        function loginClick() {
            // user logged in ok so goto the dashboard
            $state.go('triangular.dashboard-general');
        }
    }
})();
(function() {
    'use strict';

    ForgotController.$inject = ["$scope", "$state", "$mdToast", "$filter", "$http", "triSettings"];
    angular
        .module('app.Authentication')
        .controller('ForgotController', ForgotController);

    /* @ngInject */
    function ForgotController($scope, $state, $mdToast, $filter, $http, triSettings) {
        var vm = this;
        vm.triSettings = triSettings;
        vm.user = {
            email: ''
        };
        vm.resetClick = resetClick;

        ////////////////

        function resetClick() {
            $mdToast.show(
                $mdToast.simple()
                .content($filter('triTranslate')('Your new password has been mailed'))
                .position('bottom right')
                .action($filter('triTranslate')('Login'))
                .highlightAction(true)
                .hideDelay(0)
            ).then(function() {
                $state.go('authentication.login');
            });
        }
    }
})();

(function() {
    'use strict';

    runFunction.$inject = ["$rootScope", "$timeout", "$window"];
    angular
        .module('triangular')
        .run(runFunction);

    /* @ngInject */
    function runFunction($rootScope, $timeout, $window) {
        // add a class to the body if we are on windows
        if($window.navigator.platform.indexOf('Win') !== -1) {
            $rootScope.bodyClasses = ['os-windows'];
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('triangular')
        .provider('triSettings', settingsProvider);

    /* @ngInject */
    function settingsProvider() {
        // Provider
        var settings = {
            languages: [],
            name: '',
            logo: '',
            copyright: '',
            version: ''
        };

        this.addLanguage = addLanguage;
        this.setLogo = setLogo;
        this.setName = setName;
        this.setCopyright = setCopyright;
        this.setVersion = setVersion;

        function addLanguage(newLanguage) {
            settings.languages.push(newLanguage);
        }

        function setLogo(logo) {
            settings.logo = logo;
        }

        function setName(name) {
            settings.name = name;
        }

        function setCopyright(copy) {
            settings.copyright = copy;
        }

        function setVersion(version) {
            settings.version = version;
        }

        // Service
        this.$get = function() {
            return {
                languages: settings.languages,
                name: settings.name,
                copyright: settings.copyright,
                logo: settings.logo,
                version: settings.version,
                defaultSkin: settings.defaultSkin
            };
        };
    }
})();


(function() {
    'use strict';

    routeConfig.$inject = ["$stateProvider"];
    angular
        .module('triangular')
        .config(routeConfig);

    /* @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
        .state('triangular', {
            abstract: true,
            views: {
                'root': {
                    templateUrl: 'app/triangular/layouts/states/triangular/triangular.tmpl.html',
                    controller: 'TriangularStateController',
                    controllerAs: 'stateController'
                },
                'sidebarLeft@triangular': {
                    templateProvider: ["$templateRequest", "triLayout", function($templateRequest, triLayout) {
                        if(angular.isDefined(triLayout.layout.sidebarLeftTemplateUrl)) {
                            return $templateRequest(triLayout.layout.sidebarLeftTemplateUrl);
                        }
                    }],
                    controllerProvider: ["triLayout", function(triLayout) {
                        return triLayout.layout.sidebarLeftController;
                    }],
                    controllerAs: 'vm'
                },
                'sidebarRight@triangular': {
                    templateProvider: ["$templateRequest", "triLayout", function($templateRequest, triLayout) {
                        if(angular.isDefined(triLayout.layout.sidebarRightTemplateUrl)) {
                            return $templateRequest(triLayout.layout.sidebarRightTemplateUrl);
                        }
                    }],
                    controllerProvider: ["triLayout", function(triLayout) {
                        return triLayout.layout.sidebarRightController;
                    }],
                    controllerAs: 'vm'
                },
                'toolbar@triangular': {
                    templateProvider: ["$templateRequest", "triLayout", function($templateRequest, triLayout) {
                        if(angular.isDefined(triLayout.layout.toolbarTemplateUrl)) {
                            return $templateRequest(triLayout.layout.toolbarTemplateUrl);
                        }
                    }],
                    controllerProvider: ["triLayout", function(triLayout) {
                        return triLayout.layout.toolbarController;
                    }],
                    controllerAs: 'vm'
                },
                'loader@triangular': {
                    templateProvider: ["$templateRequest", "triLayout", function($templateRequest, triLayout) {
                        if(angular.isDefined(triLayout.layout.loaderTemplateUrl)) {
                            return $templateRequest(triLayout.layout.loaderTemplateUrl);
                        }
                    }],
                    controllerProvider: ["triLayout", function(triLayout) {
                        return triLayout.layout.loaderController;
                    }],
                    controllerAs: 'loader'
                }
            }
        });
    }
})();

(function() {
    'use strict';

    angular
        .module('app.translate', [
            'pascalprecht.translate',
            'LocalStorageModule'
        ]);
})();

(function() {
    'use strict';

    translateConfig.$inject = ["$translateProvider", "$translatePartialLoaderProvider", "triSettingsProvider"];
    angular
        .module('app.translate')
        .config(translateConfig);

    /* @ngInject */
    function translateConfig($translateProvider, $translatePartialLoaderProvider, triSettingsProvider) {
        /*var appLanguages = [{
            name: 'Chinese',
            key: 'zh'
        },{
            name: 'English',
            key: 'en'
        },{
            name: 'French',
            key: 'fr'
        },{
            name: 'Portuguese',
            key: 'pt'
        }]; */

        var appLanguages = [{
            name: 'English',
            key: 'en'
        },{
            name: 'French',
            key: 'fr'
        }];
        /**
         *  each module loads its own translation file - making it easier to create translations
         *  also translations are not loaded when they aren't needed
         *  each module will have a i18n folder that will contain its translations
         */
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: '{part}/i18n/{lang}.json'
        });

        $translatePartialLoaderProvider.addPart('app');

        // make sure all values used in translate are sanitized for security
        $translateProvider.useSanitizeValueStrategy('sanitize');

        // cache translation files to save load on server
        $translateProvider.useLoaderCache(true);

        // setup available languages in angular translate & triangular
        var angularTranslateLanguageKeys = [];
        for (var language in appLanguages) {
            // add language key to array for angular translate
            angularTranslateLanguageKeys.push(appLanguages[language].key);

            // tell triangular that we support this language
            triSettingsProvider.addLanguage({
                name: appLanguages[language].name,
                key: appLanguages[language].key
            });
        }

        /**
         *  try to detect the users language by checking the following
         *      navigator.language
         *      navigator.browserLanguage
         *      navigator.systemLanguage
         *      navigator.userLanguage
         */
        $translateProvider
        .registerAvailableLanguageKeys(angularTranslateLanguageKeys, {
            'en_US': 'en',
            'en_UK': 'en'
        })
        .use('en');

        // store the users language preference in a cookie
        $translateProvider.useLocalStorage();
    }
})();

(function() {
    'use strict';

    angular
        .module('seed-module', [
        ]);
})();
(function() {
    'use strict';

    moduleConfig.$inject = ["$stateProvider", "triMenuProvider"];
    angular
        .module('seed-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.seed-page', {
            url: '/seed-module/seed-page',
            templateUrl: 'app/seed-module/seed-page.tmpl.html',
            // set the controller to load for this page
            controller: 'SeedPageController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        });

        triMenuProvider.addMenu({
            name: 'Seed Module',
            icon: 'fa fa-tree',
            type: 'dropdown',
            priority: 1.1,
            children: [{
                name: 'Start Page',
                state: 'triangular.seed-page',
                type: 'link'
            }]
        });
    }
})();

(function() {
    'use strict';

    angular
        .module('seed-module')
        .controller('SeedPageController', SeedPageController);

    /* @ngInject */
    function SeedPageController() {
        var vm = this;
        vm.testData = ['triangular', 'is', 'great'];
    }
})();
(function() {
    'use strict';

    UserService.$inject = ["$q", "$http", "$rootScope", "RoleStore", "$cookies", "AuthenticationService", "ErrorService", "AuthErrorService"];
    angular
        .module('app.permission')
        .factory('UserService', UserService);

    /* @ngInject */
    function UserService($q, $http, $rootScope,  RoleStore, $cookies , AuthenticationService, ErrorService, AuthErrorService) {
        var currentUser = {};
        var DefaultUser = {
                            username: 'UnknowsnUser',
                            displayName: 'UNKNOWNUSER',
                            avatar: 'assets/images/avatars/noavatar.png',
                            password: 'hagerhager',
                            roles: ['ANONYMOUS']
                         };

        var service = {
            getCurrentUser: getCurrentUser,
            getUsers: getUsers,
            hasPermission: hasPermission,
            setCurrentUser: setCurrentUser,
            setDefaultUser: setDefaultUser,
            reinitUser: reinitUser
        };

        return service;

        ///////////////

        function setDefaultUser(){
            if(currentUser.username == undefined)
            {
                setCurrentUser(DefaultUser);
            }
        }
        function getCurrentUser() {
            return currentUser;
        }

        function setCurrentUser(user){
            currentUser = user;
            $cookies.put('tri-user', user.username);
            $rootScope.$broadcast('AppUserChanged');
        }

        function getUsers() {
            return $http.get('app/permission/data/users.json');
        }

        function checkPermission(permission)
        {
            let promise = new Promise(function(resolve, reject){
            var hasPermission = false;
                // check if user has permission via its roles
                angular.forEach(currentUser.roles, function(role) {
                    // check role exists
                    if(RoleStore.hasRoleDefinition(role)) {
                        // get the role
                        var roles = RoleStore.getStore();

                        if(angular.isDefined(roles[role])) {
                            // check if the permission we are validating is in this role's permissions
                            if(-1 !== roles[role].validationFunction.indexOf(permission)) {
                                hasPermission = true;
                            }
                        }
                    }
                });

                // if we have permission resolve otherwise reject the promise
                if(hasPermission == true) {
                    resolve(ErrorService.AppError('NoError' , 'user has Permission.'));
                }
                else if(hasPermission == false) {
                    if( getCurrentUser().username)
                        reject(ErrorService.AppError('PermissionError' , 'user has not Permission.'));
                    else
                        reject(ErrorService.AppError('PermissionError' , 'user not Found.'));
                }
            })
            // return promise
            return promise;        
        }

        function hasPermission(permissionName) 
        {
            if(getCurrentUser().username != undefined)
            {
                return checkPermission(permissionName);
            } 
            else
            {
                return Promise.resolve( AuthenticationService.getUserByToken()
                                                             .then(function(user)
                                                                 {
                                                                    setCurrentUser(user);
                                                                    return checkPermission(permissionName);
                                                                 })
                                                             .catch(function(error)
                                                                {
                                                                    //setDefaultUser();
                                                                    if(permissionName == 'viewAuthentication')
                                                                        {
                                                                            return Promise.resolve('Login please.');
                                                                        }
                                                                    else
                                                                    {
                                                                        if(error.ErrorType == 'PermissionError')
                                                                        {
                                                                            if(error.Error == 'has not Permission.')
                                                                               {
                                                                                    $rootScope.$broadcast('$stateChangePermissionDenied');
                                                                                    return Promise.reject(error);
                                                                               }
                                                                            else if(error.Error == 'No user Found.')
                                                                                {
                                                                                    AuthErrorService.AuthError('AuthorisationDenied');
                                                                                    return Promise.reject(error);
                                                                                }
                                                                        }
                                                                        else if(error.ErrorType == 'AuthenticationError')
                                                                        {
                                                                            AuthErrorService.AuthError('AuthorisationDenied');
                                                                            return Promise.reject(error);
                                                                        }
                                                                        else if(error.ErrorType == 'OfflineError')
                                                                        {
                                                                            AuthErrorService.httpError(OfflineError, 'Server is currently offline or your network connection is not active');
                                                                            return Promise.reject(error); 
                                                                        }                                                                   
                                                                    }

                                                                })
                                      );                    
          }           
        }

        function reinitUser() {
                $cookies.remove('tri-user');
                setCurrentUser({});
        };

    }
})();

(function() {
    'use strict';

    permissionRun.$inject = ["$rootScope", "$cookies", "$state", "PermissionStore", "RoleStore", "UserService", "NotificationService"];
    angular
        .module('app.permission')
        .run(permissionRun);

    /* @ngInject */
    function permissionRun($rootScope, $cookies, $state, PermissionStore, RoleStore, UserService, NotificationService) {

        initmodule();

        function initRoles(){
            // create roles for app
            //'viewAuthentication'
            RoleStore.defineManyRoles({
                'SUPERADMIN': ['viewDashboard','viewProducts' , 'viewAddProducts', 'viewDeleteProducts' ,'viewStd' , 'viewAddStd', 'viewDeleteStd' , 'viewUpdateStd' , 'viewPCA' , 'viewDashboard', 'CanSaveProject', 'CanUploadReport', 'CanDeleteReport', 'viewDocuments', 'CanDeleteDirective'],
                'ADMIN':      ['viewDashboard','viewProducts' , 'viewAddProducts', 'viewStd' , 'viewAddStd','viewUpdateStd', 'viewPCA' ,'viewDashboard' , 'CanSaveProject', 'CanUploadReport', 'CanDeleteReport', 'viewDocuments'],
                'USER':       ['viewDashboard','viewStd', 'viewProducts', 'viewDashboard', 'viewDocuments'],
                'ANONYMOUS':  ['viewDashboard','viewStd', 'viewProducts', 'viewDashboard', 'CanSeeWarning', 'viewDocuments']
            });
        }

        function initPermissions(){
            // create permissions and add check function verify all permissions

            var permissions = ['viewDashboard', 'viewProducts' , 'viewUpdateStd', 'viewAddProducts', 'viewStd' ,  'viewAddStd', 'viewDeleteStd' , 'viewDeleteProducts' , 'viewPCA' , 'viewDashboard', 'CanSaveProject', 'CanUploadReport', 'CanDeleteReport' , 'CanSeeWarning' , 'viewDocuments', 'CanDeleteDirective'];
            PermissionStore.defineManyPermissions(permissions, function (permissionName) {
                return UserService.hasPermission(permissionName);
            });
        }

        function initmodule(){
            initRoles();
            initPermissions();
        }
        ///////////////////////

        // default redirect if access is denied
        function accessDenied() {
            $state.go('401');
            //NotificationService.popAToast("you're not allowed to access to this page.", 10000, 'security');
        }

        // watches

        // redirect all denied permissions to 401
        var deniedHandle = $rootScope.$on('$stateChangePermissionDenied', accessDenied);

        // remove watch on destroy
        $rootScope.$on('$destroy', function() {
            deniedHandle();
        });
    }
})();

(function() {
    'use strict';

    permissionConfig.$inject = ["$stateProvider", "triMenuProvider"];
    angular
        .module('app.permission')
        .config(permissionConfig);

    /* @ngInject */
    function permissionConfig($stateProvider, triMenuProvider) {
        $stateProvider
        .state('triangular.permission', {
            url: '/permission',
            templateUrl: 'app/permission/pages/permission.tmpl.html',
            controller: 'PermissionController',
            controllerAs: 'vm',
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        });

    }
})();

(function() {
    'use strict';

    angular
        .module('app.Notification', [
            ]);        
})();
(function() {
    'use strict';

    NotificationService.$inject = ["$http", "$log", "$filter", "$rootScope", "$cookies", "NotificationAPIService", "$timeout", "$mdToast", "triLoaderService"];
    angular
        .module('app.Notification')
        .factory('NotificationService', NotificationService);

    /* @ngInject */
    function NotificationService($http, $log, $filter, $rootScope, $cookies , NotificationAPIService , $timeout, $mdToast , triLoaderService) {
        var service = {
            popAToast: popAToast,
            popAToastPosition: popAToastPosition,
            showLoader: showLoader,
            RightSidebarNotif:RightSidebarNotif,
            getNotifications:getNotifications
        };

        return service;
 
        function popAToast(message, HideDelay , type) {

            switch (type) {
              case 'info':
                var icon = 'zmdi zmdi-info-outline';
                break;
              case 'success':
                var icon = 'zmdi zmdi-check-circle';
                break;
              case 'warning':
                var icon = 'zmdi zmdi-alert-polygon';
                break;
              case 'error':
                var icon = 'zmdi zmdi-close-circle-o';
                break;
              case 'ask':
                var icon = 'zmdi zmdi-help';
                break;
              case 'security':
                var icon = 'zmdi zmdi-shield-security';
                break;
              default: 
                type = 'info';
                var icon = 'zmdi zmdi-info-outline';
                break;
            }

         var toast = $mdToast.simple()
                .textContent($filter('triTranslate')(message)) 
                .highlightAction(true)
                .hideDelay(HideDelay)
                .action('OK')
                .theme(""+ type + "-toast")
                .position('bottom right');

          toast._options.template = '<md-toast md-theme="{{ toast.theme }}" ng-class="{ mdcapsule : toast.capsule}">  <div class="md-toast-content">'+
                                    '<span class="md-toast-text" role="alert" aria-relevant="all" aria-atomic="true">' + 
                                    '   <md-icon md-font-icon="' + icon +'"></md-icon>   {{ toast.content }}    ' + 
                                    '</span>    <md-button class="md-action" ng-if="toast.action" ng-click="toast.resolve()"' +
                                    '         ng-class="highlightClasses">      {{ toast.action }}    </md-button>  </div></md-toast>"';

          return $mdToast.show(toast)
                         .then(function (response) {
                                 if(response == 'ok')
                                        return true;
                                 else
                                        return false;
                        }).catch(function(error){
                            return error; 
                            // do nothing.
                        })
        }

        function popAToastPosition(message, HideDelay , type, position) {

            switch (type) {
              case 'info':
                var icon = 'zmdi zmdi-info-outline';
                break;
              case 'success':
                var icon = 'zmdi zmdi-check-circle';
                break;
              case 'warning':
                var icon = 'zmdi zmdi-alert-polygon';
                break;
              case 'error':
                var icon = 'zmdi zmdi-close-circle-o';
                break;
              case 'ask':
                var icon = 'zmdi zmdi-help';
                break;
              case 'security':
                var icon = 'zmdi zmdi-shield-security';
                break;
              default: 
                type = 'info';
                var icon = 'zmdi zmdi-info-outline';
                break;
            }

         var toast = $mdToast.simple()
                .textContent($filter('triTranslate')(message)) 
                .highlightAction(true)
                .hideDelay(HideDelay)
                .action('YES')
                .theme(""+ type + "-toast")
                .position(position);

          toast._options.template = '<md-toast md-theme="{{ toast.theme }}" ng-class="{ mdcapsule : toast.capsule}">  <div class="md-toast-content">'+
                                    '<span class="md-toast-text" role="alert" aria-relevant="all" aria-atomic="true">' + 
                                    '   <md-icon md-font-icon="' + icon +'"></md-icon>   {{ toast.content }}    ' + 
                                    '</span>    <md-button class="md-action" ng-if="toast.action" ng-click="toast.resolve()"' +
                                    '         ng-class="highlightClasses">      {{ toast.action }}    </md-button>   <md-button ng-click="toast.reject()"> NO </md-button> </div></md-toast>"';

          return $mdToast.show(toast)
                         .then(function (response) {
                            if(response =='ok')
                                return true;
                            else
                                return false;
                        }).catch(function(error){
                            return error; 
                            // do nothing.
                        })
        }

        function closeToast() {
                $mdToast.hide();
        }
        ////////////

        function showLoader(time) {
            // turn the loader on
            triLoaderService.setLoaderActive(true);

            // wait for a while
            $timeout(function() {
                // now turn it off
                triLoaderService.setLoaderActive(false);
            }, time * 1000);
        }

        function RightSidebarNotif(GroupName, Action ,NotificationMessage, User)
            {
                var NotificationObj = {
                    GroupName: GroupName,
                    title: NotificationMessage,
                    icon: '',
                    iconColor: '',
                    date: '',
                    User: User
                };
 
                if(Action == 'Add')
                {
                    NotificationObj.icon = 'fa fa-plus';
                    NotificationObj.iconColor = 'rgb(76, 175, 80)';
                }
                else if(Action == 'Delete')
                {
                    NotificationObj.icon = 'fa fa-minus';
                    NotificationObj.iconColor = 'rgb(244,81,30)';
                }
                else if(Action == 'Update')
                {
                    NotificationObj.icon = 'fa fa-cloud-upload';
                    NotificationObj.iconColor = 'rgb(255,171,0)';
                } 
                
                NotificationObj.date = moment(Date.now());

                NotificationAPIService.storeNotification(NotificationObj);

                $rootScope.$broadcast( GroupName + 'Notification' , NotificationObj);
                $rootScope.$broadcast( 'ToolbarNotification');
            
            }

        function getNotifications()
          {
            return Promise.resolve(NotificationAPIService.getNotifications());
          }
        
    }

})();

(function() {
    'use strict';

    NotificationAPIService.$inject = ["$http", "API_HGLABS", "$log", "$mdToast", "AuthenticationService", "$state", "$cookies"];
    angular
        .module('app.products')
        .factory('NotificationAPIService', NotificationAPIService);

    /* @ngInject */
    function NotificationAPIService($http,API_HGLABS, $log, $mdToast, AuthenticationService , $state, $cookies) {
        var service = {
            getNotifications: getNotifications,
            storeNotification:storeNotification
        };

        var BaseUrlAPI = API_HGLABS.url + 'functionalities/notifications';

        return service;
 
         function getNotifications() {
            return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'GET',
                            url: BaseUrlAPI,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            }
                        })
                        .then(function(response) {
                            resolve(response.data);
                        })
                        .catch(function(error) {
                            reject(error);
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                 return Promise.reject(error);
              })
          );
        }


        function storeNotification(notification) {
            return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'POST',
                            url: BaseUrlAPI,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            },
                            data: { notification : notification }
                        })
                        .then(function(response) {
                            resolve(response);
                        })
                        .catch(function(error) {
                            reject(error);
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                 return Promise.reject(error);
              })
          );
        }
    }

})();


(function() {
    'use strict';

    angular
        .module('app.laboratory', [            
            'app.products',         
            'app.standards',            
            'app.pca',
            'app.Authentication',
            'app.Notification',
            'app.Error',
            'app.Idle',
            'app.documents',
            'app.directives',
            'app.dashboard'
        ])
        // set a constant for the API we are connecting to
       /*.constant('API_HGLABS', {
            'url':  'http://localhost:4040/api/lab/'
        })
        .constant('WS_API', {
            'url':  'http://localhost:4041'
        })
        .constant('API_HGLABS_BASE', {
            'url':  'http://localhost:4040/api/'
        });*/

       .constant('API_HGLABS', {
            'url':  'http://52.174.145.29:8080/api/lab/'
        })
        .constant('WS_API', {
            'url':  'http://52.174.145.29:3030'
        })
        .constant('API_HGLABS_BASE', {
            'url':  'http://52.174.145.29:8080/api/'
        });
})();
(function() {
    'use strict';

    runFunction.$inject = ["$rootScope", "$state", "$cookies", "$log", "WS_API", "ProductsAPIService", "UserService"];
    angular
        .module('app.laboratory')
        .run(runFunction);

    /* @ngInject */
    function runFunction($rootScope, $state, $cookies, $log, WS_API , ProductsAPIService, UserService) {

        var socket = io.connect(WS_API.url, {
            'reconnection': true,
            'reconnectionDelay': 500,
            'reconnectionAttempts': Infinity
        });
        
        socket.on('connection_failed', function(){
            $log.warn('ws connection failed');
        })

        // Products broadcast event
        socket.on('ProductStatusChanged', function(Product){
            $log.info('product update: '+ Product._id);
            $rootScope.$broadcast('UpdateProduct', Product);
        })

        socket.on('NewProduct', function(Product){
            $log.info('product create: '+ Product._id);
            $rootScope.$broadcast('NewProduct', Product);
        })

        socket.on('ProductDelete', function(Product){
            $log.info('product delete: '+ Product._id);
            $rootScope.$broadcast('ProductDelete', Product);
        })

        // Change State         
        $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
            // unlock products if new state is not dashboard.
            if((UserService.getCurrentUser()).roles  != undefined)
            {
                if ( toState.name.indexOf('triangular.products-dashboard') == -1 && UserService.getCurrentUser().roles != 'ANONYMOUS') {

                        ProductsAPIService.UnlockProducts();
                } 
            }
        });

    }
})();
(function() {
    'use strict';

    angular
        .module('app.examples', [
            /*'app.examples.authentication',
            'app.examples.calendar',
            'app.examples.charts',
            'app.examples.dashboards',
            'app.examples.elements',
            'app.examples.email', 
            'app.examples.ui',*/
            'app.examples.extras',
            /*'app.examples.forms',
            'app.examples.github',
            'app.examples.layouts', 
            'app.examples.maps',
            'app.examples.menu',
            'app.examples.todo',*/
           
        ]);
})();
(function() {
    'use strict';

// Module hundling app errors
    angular
        .module('app.Error', [
            ]);        
})();
(function() {
    'use strict';

    ErrorService.$inject = ["$http", "$log", "$rootScope", "$cookies", "$timeout", "$state"];
    angular
        .module('app.Error')
        .factory('ErrorService', ErrorService);

    // This service is hundling errors.

    /* @ngInject */
    function ErrorService($http, $log, $rootScope, $cookies, $timeout, $state ) {
        var service = {
            AppError: AppError
        };

        return service;
 
        ////////////

         /**
         * Function building AppError Object
         * @property {errorType: String}
         * @property {Error: Object}: This Object will be treated differently by functions depending on Error Type
         * @property {Status: String}
         * @returns {ErrorObj}
         * AppError = {AppError Object}
         */

        function AppError(ErrorType , Error, Status)
        {
            var AppError = {
                            ErrorType : ErrorType,
                            Error: Error,
                            status: Status
                          };
            return AppError
        }
        
    }

})();


(function() {
    'use strict';

    AuthErrorService.$inject = ["$http", "$log", "$rootScope", "$cookies", "$timeout", "$state", "NotificationService", "AuthenticationService", "triLoaderService", "ErrorService"];
    angular
        .module('app.Error')
        .factory('AuthErrorService', AuthErrorService);

    // This service is hundling http erros linked to servers responses.

    /* @ngInject */
    function AuthErrorService($http, $log, $rootScope, $cookies, $timeout, $state , NotificationService , AuthenticationService , triLoaderService , ErrorService) {
        var service = {
            httpError: httpError,
            AuthError: AuthError,
            UnauthorisedHundler:UnauthorisedHundler,
        };

        return service;
 
        ////////////

         /**
         * Function hundling Authorization errors: error.status == 401. This function cheks also if the conenction is established error.status == -1
         * @property {null}
         * @returns {promise (UserObj)}
         * UserObj = {User}
         */

        function AuthError(error){

            if(error.status == -1)
            {
                var message = 'Servers are currently offline or your network connection is not active';
                var type    = 'error';
            }
            else 
            {
                var message =  'you are not Authorised to perform this action, please login with a Valid Account.';
                var type    = 'security';
            }

            NotificationService.popAToast(message, 10000, type)
                               .then(function(response)
                               {
                                   if(error.status != -1 && response == true)
                                   {
                                        $state.go('Authentication.login');                                  
                                   }
                               })
                               .catch(function(error){
                                    // Do nothing: the error must be hundled NotificationService 
                               })
            //
        }

         /**
         * Function checking the presence of an AccessToken; if it's not -> orientation to Login page. 
         * @property {appmessage: string} : error message.
         * @returns {null}
         */

        function UnauthorisedHundler(appmessage)
        {
            AuthenticationService.getAuthToken()
                                 .then(function(resolve){
                                        // add control of token validity, to prevent access with false tokens even if the api will not respond.
                                        // idea: give to server, couple of: (Token, username), associate that with a limiter to prevent dictionnary force access.
                                        //$log.error('Unauthorised: ' + appmessage);
                                        $state.go('401');
                                  })
                                .catch(function(err){
                                        //$log.error('Unauthorised: ' + appmessage);
                                        $state.go('Authentication.login');
                                 })
        }

         /**
         * Function hundling http errors. 
         * @property {error: http Error Object}
         * @property {appmessage: string} 
         * @returns {ErrorObj}
         * UserObj = {User}
         */

        function httpError(error, appmessage)
          {
            if(error.status == 401)
                {
                    //UnauthorisedHundler(appmessage);
                    AuthError(error);
                    return ErrorService.AppError('AuthenticationError' , appmessage, error.status);
                }
            else if(error.status == 404)
                {
                    NotificationService.popAToast('Not Found.' + appmessage, 10000, 'error');
                    $state.go('404');
                    return ErrorService.AppError('PageNotFound.' , 'app page error.', error.status);
                }
            else if(error.status == 400)
                {
                    NotificationService.popAToast('Bad Request: ' + appmessage, 10000, 'error');
                    return ErrorService.AppError('Bad Request.' , 'Api error.', error.status);
                }
            else if(error.status == -1)
                {
                    NotificationService.popAToast('Servers are currently offline or your network connection is not active.' + appmessage, 10000, 'error' );
                    return ErrorService.AppError('ServerOffline.' , 'server offline.' , error.status);
                }
            else if(error.status == 500)
                {
                    NotificationService.popAToast('Internal server Error:' + appmessage, 10000, 'error');
                    return ErrorService.AppError('ServerError.' , appmessage , error.status);
                }
            else if(error.status == 4040)
                {
                    NotificationService.popAToast(appmessage, 10000, 'error');
                    return ErrorService.AppError('ServerRessourceNotFound.' , appmessage , error.status);
                }
            else if(error.status == 409)
                {
                    NotificationService.popAToast(appmessage, 10000, 'warning');
                    return ErrorService.AppError('Ressources Conflict. Not Authorised !' , appmessage , error.status);
                }
          }
        
    }

})();

(function() {
    'use strict';

    runFunction.$inject = ["$rootScope", "$state", "$cookies", "AuthenticationService", "$log", "UserService", "ErrorService"];
    angular
        .module('app.Authentication')
        .run(runFunction);

     /* The runFunction executing functions before all modules starting. */

    /* @ngInject */
    function runFunction($rootScope, $state, $cookies , AuthenticationService , $log, UserService, ErrorService) {
 
          /**
         * this rootscope is intercepting the event of stateChangePermissionStart, and try to the supp check in the server.
         */

         $rootScope.$on('$stateChangePermissionStart',  function(event, toState, toParams, options) {
             /* if(toState.name != 'authentication.login')
              {
                AuthenticationService.isAuthenticated()
                                     .then(function(Authentication){
                                            UserService.setCurrentUser(user);
                                     })
                                     .catch(function(error)
                                     {
                                        ErrorService.httpError(error, 'Authentication Error.');
                                     })
              } */
         });   

    }
})();

(function() {
    'use strict';

    moduleConfig.$inject = ["$stateProvider", "triMenuProvider"];
    angular
        .module('app.Authentication')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('Authentication', {
            abstract: true,
            views: {
                'root': {
                    templateUrl: 'app/authentication/layouts/authentication.tmpl.html'
                }
            }
        })
        .state('Authentication.login', {
            url: '/login',
            templateUrl: 'app/authentication/login/login.tmpl.html',
            params: {
                 credentials: null
            },
            controller: 'loginController',
            controllerAs: 'vm'
        }) 
        .state('Authentication.signup', {
            url: '/signup',
            templateUrl: 'app/authentication/signup/signup.tmpl.html',
            controller: 'signupController',
            controllerAs: 'vm'
        });
        
    }
})();

(function() {
    'use strict';

    AuthenticationService.$inject = ["$http", "API_HGLABS", "$log", "AuthenticationAPIService", "ErrorService", "$window", "$state", "$rootScope", "$cookies"];
    angular
        .module('app.Authentication')
        .factory('AuthenticationService', AuthenticationService);


    /**
     * Service Managing authentication processes in the app, linked to app AND server.
     */

    /* @ngInject */
    function AuthenticationService($http,API_HGLABS, $log, AuthenticationAPIService , ErrorService , $window , $state, $rootScope , $cookies) {
        var service = {
            getAuthToken: getAuthToken,
            getUserByToken:getUserByToken,
            isAuthenticated: isAuthenticated,
            login: login,
            loginAsGuest: loginAsGuest,
            logout: logout
        };

        /* This var will be associated to server's token  */ 
        var AuthToken = '';

        return service;
 
         /**
         * Login function. This function will log the user to the server using credentials. The server will return 
         * @property {object} credentials = { email: {string},  password: {string} };
         * @returns {promise (UserObj)}
         * UserObj = {AccessToken , User}
         */

        function login(credentials)
        {
            return Promise.resolve(
            Promise.resolve(AuthenticationAPIService.login(credentials))
                   .then(function(response) {
                                storeAccessToken(response.Auth_token);
                                return Promise.resolve(response.user);
                        })
                        .catch(function(err) {
                                return Promise.reject(err);
                        }) 
            );
        }

         /**
         * Login function. This function will log the user with a user having the role: 'ANONYMOUS'
           @property {null}
         * @returns {promise (UserObj)}
         * UserObj = {AccessToken , User}
         */

        function loginAsGuest()
        {
            return Promise.resolve(
            Promise.resolve(AuthenticationAPIService.loginAsGuest())
                   .then(function(response) {
                                storeAccessToken(response.Auth_token);
                                return Promise.resolve(response.user);
                        })
                        .catch(function(err) {
                                return Promise.reject(err);
                        }) 
            );
        }

         /**
         * Logout function. This function will log out the user by deleting his credentials, accessToken, redirecting him to Login page
         * @property {null} 
         * @returns {null}
         */

        function logout()
        {
             $cookies.remove('Hager_Lab_Auth_Token');
             $state.go('Authentication.login');
             //$window.location.reload();
        }

         /**
         * Function geting user's object from server using his accessToken
         * @property {null} The accessToken is get from cookies
         * @returns {promise (UserObj)}
         * UserObj = {AccessToken , User}
         */

        function getUserByToken()
        {
            return Promise.resolve( getAuthToken()
                          .then(function(Authentication) {
                                return Promise.resolve( AuthenticationAPIService.getUserbyToken(Authentication.AuthToken)
                                                        .then(function(User) {
                                                            return Promise.resolve(User);
                                                        })
                                                        .catch(function(err)
                                                        {
                                                            if(err.status != -1)
                                                                return Promise.reject(ErrorService.AppError('AuthenticationError' , 'Invalid Access Token.', 401));
                                                            else
                                                                return Promise.reject(ErrorService.AppError('OfflineError' , 'Server is offline', -1));
                                                        })
                                                    )
                            })
                            .catch(function(err) {
                                    return Promise.reject(err);
                            })
                    );
        }

         /**
         * Function verifying if a token is valid or not. it uses the couple of (username, accessToken)
         * @property {username}
         * @returns {promise (UserObj)}
         * @UserObj = {AccessToken , User}
         * @Errors: http error: hundled by the workflow AuthErrorService -> ErrorService
         */

        function isAuthenticated(username)
        {
            return Promise.resolve( getAuthToken()
                          .then(function(Authentication) {
                                return Promise.resolve( AuthenticationAPIService.AuthenticationCheck(Authentication.AuthToken, username ) 
                                                        .then(function(response) {
                                                            return Promise.resolve(response);
                                                        })
                                                        .catch(function(err)
                                                        {
                                                            if(err.status != -1)
                                                                return Promise.reject(ErrorService.AppError('AuthenticationError' , 'Invalid Access Token.', 401));
                                                            else
                                                                return Promise.reject(ErrorService.AppError('OfflineError' , 'Server is offline' , -1));
                                                        })
                                                    )
                            })
                            .catch(function(TypeError) {
                                    return Promise.reject(TypeError);
                            })
                    );
        }

         /**
         * Function searching for accessToken in the app. Actual behavior: get access token from cookies. 
         * @property {null}
         * @returns {promise (Authentication)}
         * @Authentication = {Authorization , AuthToken}
         * @Authorization: bool
         * @AuthToken: signed string.
         * @Errors: http error: hundled by the workflow AuthErrorService -> ErrorService
         */

        function getAuthToken() {
            var Authentication = { Authorization: '', AuthToken: ''  };
            let promise = new Promise(function(resolve, reject){
                if($cookies.get('Hager_Lab_Auth_Token'))
                {
                    AuthToken = angular.fromJson($cookies.get('Hager_Lab_Auth_Token'))._Hager_Lab_Auth_Token;
                    Authentication.Authorization = true;
                    Authentication.AuthToken = AuthToken;
                    resolve(Authentication);
                }
                else 
                {
                  Authentication.Authorization = false;
                  reject( ErrorService.AppError('AuthenticationError' , 'Auth Token Not found.', 4040) );
                }
            });
            return promise;
        }

         /**
         * Function storing AccessToken in the app. Actual behavior: set access token in cookies. 
         * @property {Token}
         * @Errors: hundled by the cookies Framework
         */

        function storeAccessToken(Token)
        {
            $cookies.put('Hager_Lab_Auth_Token',angular.toJson({
                    _Hager_Lab_Auth_Token: 'Bearer '+ Token
            }));
        }
    }

})();
(function() {
    'use strict';

    AuthenticationAPIService.$inject = ["$http", "API_HGLABS_BASE", "$log", "$mdToast", "$state", "$cookies"];
    angular
        .module('app.Authentication')
        .factory('AuthenticationAPIService', AuthenticationAPIService);


    /*AuthenticationAPIService : Service Hundling the http communication with the server */

    /* @ngInject */
    function AuthenticationAPIService($http,API_HGLABS_BASE, $log, $mdToast,$state, $cookies) {
        var service = {
            login: login,
            loginAsGuest: loginAsGuest,
            signup:signup,
            getUserbyToken: getUserbyToken,
            AuthenticationCheck: AuthenticationCheck
        };

        var AuthToken = '';

        return service;

       /* init function of the service  */ 
        init();

         /**
         * Function geting user's object from server using his accessToken
         * @property {accessToken} 
         * @returns {promise (UserObj)}
         * UserObj = {AccessToken , User}
         */

        function getUserbyToken(Token)
        {
            let promise = new Promise(function(resolve, reject){
                $http({
                        method: 'GET',
                        url: API_HGLABS_BASE.url + 'users' ,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': Token
                        }
                    })
                .then(function(response) {
                    resolve(response.data);
                })
                .catch(function(error) {
                    reject(error);
                });
            });
            return promise;
        }
 
          /**
         * Function verifying if a token is valid or not. it uses the couple of (username, accessToken)
         * @property {username}
         * @returns {promise (UserObj)}
         * @UserObj = {AccessToken , User}
         * @Errors: http error: hundled by the calling method
         */

        function AuthenticationCheck(Token, username)
        {
            let promise = new Promise(function(resolve, reject){
                $http({
                        method: 'POST',
                        url: API_HGLABS_BASE.url + 'users/AuthCheck' ,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': Token
                        },
                        data: {username: Promise.resolve(username) }
                    })
                .then(function(response) {
                    resolve(response.data);
                })
                .catch(function(error) {
                    reject(error);
                });
            });
            return promise;
        }


         /**
         * Login function. This function will log the user to the server using credentials. The server will return 
         * @property {object} credentials = { email: {string},  password: {string} };
         * @returns {promise (UserObj)}
         * UserObj = {AccessToken , User}
         * @Errors: http error: hundled by the calling method
         */

        function login(credentials) {
            let promise = new Promise(function(resolve, reject){
                $http({
                        method: 'POST',
                        url: API_HGLABS_BASE.url + 'auth/login' ,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        data: credentials
                    })
                .then(function(response) {
                    resolve(response.data);
                })
                .catch(function(error) {
                    reject(error);
                });
            });
            return promise;
        }

         /**
         * Login function. This function will log the user with a user having the role: 'ANONYMOUS'
         * @property {null}
         * @returns {promise (UserObj)}
         * UserObj = {AccessToken , User}
         * @Errors: http error: hundled by the calling method
         */
        function loginAsGuest() {
            let promise = new Promise(function(resolve, reject){
                $http({
                        method: 'POST',
                        url: API_HGLABS_BASE.url + 'auth/loginGuest' ,
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                .then(function(response) {
                    resolve(response.data);
                })
                .catch(function(error) {
                    reject(error);
                });
            });
            return promise;
        }
 
         /**
         * signup function. This function will try to create a new user in the database.
         * @property {Obj: UserInfo}
         * @UserInfo = { username: '{string}', email: '{string: Format mail}', password: '{string}'}; 
         * @returns {promise (UserObj)}
         * UserObj = {User}
         * @Errors: http error: hundled by the calling method
         */

        function signup(infos) {
            let promise = new Promise(function(resolve, reject){
                $http({
                        method: 'POST',
                        url: API_HGLABS_BASE.url + 'users/signup' ,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        data: infos
                    })
                .then(function(response) {
                    resolve(response.data);
                })
                .catch(function(error) {
                    reject(error);
                });
            });
            return promise;
        }
 
    }

})();

(function() {
    'use strict';

    // This service is hundling Idle timeouts.
    angular
        .module('app.Idle', ['ngIdle'
            ]);        
})();

(function() {
    'use strict';

    Idlerun.$inject = ["Idle", "$rootScope", "$log", "$state", "$mdDialog", "UserService", "AuthenticationService", "NotificationService"];
    angular
        .module('app.Idle')
        .run(Idlerun);
    // This service is hundling Idle events.
 
    /* @ngInject */
    function Idlerun(Idle, $rootScope, $log ,$state , $mdDialog ,UserService , AuthenticationService , NotificationService) {

         /**
         * Function checking if there is a user associated to the app
         * @property {null}
         * @returns {status: bool}
         */

        function isConnected() {
            var status = false;
            if(UserService.getCurrentUser().username)
            {
                status = true;
            }
            return status;
        }
 
        function createDialog(dialog) {
            $mdDialog.show({
                title: 'LOGOUT',
                template:
                   '<md-card>' +
                   ' <md-subheader class="md-whiteframe-z3 margin-20 text-center" palette-background="amber:500">' +
                   "  Your project will be saved automatically. Move your mouse to stay in the Dashboard." +
                   " </md-subheader>"+
                   '  </md-card-content>' +
                   '</md-card>',
                clickOutsideToClose: true
            });
        }

        // start watching when the app runs. also starts the Keepalive service by default.
        Idle.watch();

        $rootScope.$on('IdleStart', function() {
            // the user appears to have gone idle
            //$log.info('coucou , tu bouges pas.'+  $state.current.name);
            if($state.current.name == 'triangular.products-dashboard')
            {
                //NotificationService.popAToast("You're going to be loged out soon.", 10000);
                //newDialog.content = '';
                createDialog();
            }
        });

        $rootScope.$on('IdleWarn', function(e, countdown) {
            // follows after the IdleStart event, but includes a countdown until the user is considered timed out
            // the countdown arg is the number of seconds remaining until then.
            // you can change the title or display a warning dialog from here.
            // you can let them resume their session by calling Idle.watch()
            //$log.info('coucou , attention');
            if(isConnected())
            {

            }
        });

        $rootScope.$on('IdleTimeout', function() {
            // the user has timed out (meaning idleDuration + timeout has passed without any activity)
            // this is where you'd log them
            if($state.current.name == 'triangular.products-dashboard')
            {
                NotificationService.popAToast('See you soon ' + UserService.getCurrentUser().username, 3000, 'info');
                /* $mdDialog.hide();
                UserService.reinitUser();
                AuthenticationService.logout(); */
                // Broadcast event to dashboard to save the current project, and quit to home page
                $rootScope.$broadcast('saveprojectandquit');
            }

            Idle.watch();
        });

        $rootScope.$on('IdleEnd', function() {
            // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
            //$log.info('coucou , ouf, t es revenu');
            if($state.current.name == 'triangular.products-dashboard')
            {
                $mdDialog.hide();
                NotificationService.popAToast('Wellcome back ' + UserService.getCurrentUser().username, 3000, 'info');
            }
        });

        $rootScope.$on('Keepalive', function() {
            // do something to keep the user's session alive
            //$log.info('coucou , tu ça bouge artificiellement.');
            if(isConnected())
            {

            }
        });   
    }

})();

(function() {
    'use strict';

    IdleConfig.$inject = ["IdleProvider", "KeepaliveProvider"];
    angular
        .module('app.Idle')
        .config(IdleConfig);

    /* @ngInject */
    function IdleConfig(IdleProvider, KeepaliveProvider) {

        // configure Idle settings
        IdleProvider.idle(600); // in seconds
        IdleProvider.timeout(10); // in seconds
        KeepaliveProvider.interval(2); // in seconds
    }

})();


(function() {
    'use strict';

    angular
        .module('app')
        .value('googleChartApiConfig', {
            version: '1.1',
            optionalSettings: {
                packages: ['line', 'bar', 'geochart', 'scatter'],
                language: 'en'
            }
        });
})();
(function() {
    'use strict';

    triTranslateFilter.$inject = ["$injector", "$filter"];
    angular
        .module('triangular')
        .filter('triTranslate', triTranslateFilter);

    /* @ngInject */
    function triTranslateFilter($injector, $filter) {
        return function(input) {
            // if angular translate installed this will return true
            // so we can translate
            if($injector.has('translateFilter')) {
                return $filter('translate')(input);
            }
            else {
                // no translation active so just return the same input
                return input;
            }
        };
    }
})();

(function() {
    ErrorPageController.$inject = ["$state"];
    angular
        .module('app')
        .controller('ErrorPageController', ErrorPageController);

    /* @ngInject */
    function ErrorPageController($state) {
        var vm = this;

        vm.goHome  = goHome;
        vm.goLogin = goLogin;

        /////////

        function goHome() {
            $state.go('triangular.products-manage');
        }

        function goLogin() {
            $state.go('Authentication.login');
        }
    }
})();

(function() {
    'use strict';

    themesConfig.$inject = ["$mdThemingProvider", "triThemingProvider", "triSkinsProvider"];
    angular
        .module('app')
        .config(themesConfig);

    /* @ngInject */
    function themesConfig ($mdThemingProvider, triThemingProvider, triSkinsProvider) {
        /**
         *  PALETTES
         */
        $mdThemingProvider.definePalette('white', {
            '50': 'ffffff',
            '100': 'fff7d7',
            '200': 'f7ecc1',
            '300': 'f1f1ec',
            '400': 'e2e0db',
            '500': 'd8d5cd',
            '600': 'ffffff',
            '700': 'ffffff',
            '800': 'ffffff',
            '900': 'ffffff',
            'A100': 'ffffff',
            'A200': 'ffffff',
            'A400': 'ffffff',
            'A700': 'ffffff',
            'contrastDefaultColor': 'dark'
        });
 
        $mdThemingProvider.definePalette('blue', {
            '50': 'e1e1e1',
            '100': 'b6b6b6',
            '200': '8c8c8c',
            '300': '646464',
            '400': '3a3a3a',
            '500': 'e1e1e1',
            '600': 'e1e1e1',
            '700': '232323',
            '800': '1a1a1a',
            '900': '00477d',
            'A100': '3a3a3a',
            'A200': 'ffffff',
            'A400': 'ffffff',
            'A700': 'ffffff',
            'contrastDefaultColor': 'light'
        });

        $mdThemingProvider.definePalette('hagerblue', {
            '100': '204f6c',
            '50': '204f6c',
            '200': '204f6c',
            '300': '204f6c',
            '400': '204f6c',
            '500': '204f6c',
            '600': '204f6c',
            '700': '204f6c',
            '800': '204f6c',
            '900': '204f6c',
            'A100': '204f6c',
            'A200': '204f6c',
            'A400': '204f6c',
            'A700': '204f6c',
            'contrastDefaultColor': 'light'
        });
        $mdThemingProvider.definePalette('hageryellow', {
            '100': 'fac003',
            '50': 'fac003',
            '200': 'fac003',
            '300': 'fac003',
            '400': 'fac003',
            '500': 'fac003',
            '600': 'fac003',
            '700': 'fac003',
            '800': 'fac003',
            '900': 'fac003',
            'A100': 'fac003',
            'A200': 'fac003',
            'A400': 'fac003',
            'A700': 'fac003',
            'contrastDefaultColor': 'light'
        });
        $mdThemingProvider.definePalette('hagerorange', {
            '100': 'e25b30',
            '50': 'e25b30',
            '200': 'e25b30',
            '300': 'e25b30',
            '400': 'e25b30',
            '500': 'e25b30',
            '600': 'e25b30',
            '700': 'e25b30',
            '800': 'e25b30',
            '900': 'e25b30',
            'A100': 'e25b30',
            'A200': 'e25b30',
            'A400': 'e25b30',
            'A700': 'e25b30',
            'contrastDefaultColor': 'light'
        });

        $mdThemingProvider.definePalette('hagerpink', {
            '100': '8f004d',
            '50': '8f004d',
            '200': '8f004d',
            '300': '8f004d',
            '400': '8f004d',
            '500': '8f004d',
            '600': '8f004d',
            '700': '8f004d',
            '800': '8f004d',
            '900': '8f004d',
            'A100': '8f004d',
            'A200': '8f004d',
            'A400': '8f004d',
            'A700': '8f004d',
            'contrastDefaultColor': 'light'
        });   
        var triCyanMap = $mdThemingProvider.extendPalette('cyan', {
            'contrastDefaultColor': 'light',
            'contrastLightColors': '500 700 800 900',
            'contrastStrongLightColors': '500 700 800 900'
        });

        // Register the new color palette map with the name triCyan
        $mdThemingProvider.definePalette('triCyan', triCyanMap);

        /**
         *  SKINS
         */

        // CYAN CLOUD SKIN
        triThemingProvider.theme('cyan')
        .primaryPalette('triCyan')
        .accentPalette('amber')
        .warnPalette('deep-orange');

        triThemingProvider.theme('cyan-white')
        .primaryPalette('white')
        .accentPalette('triCyan', {
            'default': '500'
        })
        .warnPalette('deep-orange');

        triSkinsProvider.skin('cyan-cloud', 'Cyan Cloud')
        .sidebarTheme('cyan')
        .toolbarTheme('cyan-white')
        .logoTheme('cyan')
        .contentTheme('cyan');

        // RED DWARF SKIN
        triThemingProvider.theme('red')
        .primaryPalette('red')
        .accentPalette('amber')
        .warnPalette('purple');

        triThemingProvider.theme('white-red')
        .primaryPalette('white')
        .accentPalette('red', {
            'default': '500'
        })
        .warnPalette('purple');

        triSkinsProvider.skin('red-dwarf', 'Red Dwarf')
        .sidebarTheme('red')
        .toolbarTheme('white-red')
        .logoTheme('red')
        .contentTheme('red');

        // PLUMB PURPLE SKIN
        triThemingProvider.theme('purple')
        .primaryPalette('purple')
        .accentPalette('deep-orange')
        .warnPalette('amber');

        triThemingProvider.theme('white-purple')
        .primaryPalette('white')
        .accentPalette('purple', {
            'default': '400'
        })
        .warnPalette('deep-orange');

        triSkinsProvider.skin('plumb-purple', 'Plumb Purple')
        .sidebarTheme('purple')
        .toolbarTheme('white-purple')
        .logoTheme('purple')
        .contentTheme('purple');

        // DARK KNIGHT SKIN
        triThemingProvider.theme('dark')
        .primaryPalette('black', {
            'default': '300',
            'hue-1': '400'
        })
        .accentPalette('amber')
        .warnPalette('deep-orange')
        .backgroundPalette('black')
        .dark();

        triSkinsProvider.skin('dark-knight', 'Dark Knight')
        .sidebarTheme('dark')
        .toolbarTheme('dark')
        .logoTheme('dark')
        .contentTheme('dark');

        // BATTLESHIP GREY SKIN
        triThemingProvider.theme('blue-grey')
        .primaryPalette('blue-grey')
        .accentPalette('amber')
        .warnPalette('orange');

        triThemingProvider.theme('white-blue-grey')
        .primaryPalette('white')
        .accentPalette('blue-grey', {
            'default': '400'
        })
        .warnPalette('orange');

        triSkinsProvider.skin('battleship-grey', 'Battleship Grey')
        .sidebarTheme('blue-grey')
        .toolbarTheme('white-blue-grey')
        .logoTheme('blue-grey')
        .contentTheme('blue-grey');

        // ZESTY ORANGE SKIN
        triThemingProvider.theme('orange')
        .primaryPalette('orange' , {
            'default': '800'
        })
        .accentPalette('lime')
        .warnPalette('amber');

        triThemingProvider.theme('white-orange')
        .primaryPalette('white')
        .accentPalette('orange', {
            'default': '500'
        })
        .warnPalette('lime');

        triSkinsProvider.skin('zesty-orange', 'Zesty Orange')
        .sidebarTheme('orange')
        .toolbarTheme('white-orange')
        .logoTheme('orange')
        .contentTheme('orange');


        // INDIGO ISLAND SKIN
        triThemingProvider.theme('indigo')
        .primaryPalette('indigo' , {
            'default': '600'
        })
        .accentPalette('red')
        .warnPalette('lime');

        triSkinsProvider.skin('indigo-island', 'Indigo Island')
        .sidebarTheme('indigo')
        .toolbarTheme('indigo')
        .logoTheme('indigo')
        .contentTheme('indigo');

        // KERMIT GREEN SKIN
        triThemingProvider.theme('light-green')
        .primaryPalette('light-green' , {
            'default': '400'
        })
        .accentPalette('amber')
        .warnPalette('deep-orange');

        triThemingProvider.theme('white-light-green')
        .primaryPalette('white')
        .accentPalette('light-green', {
            'default': '400'
        })
        .warnPalette('deep-orange');

        triSkinsProvider.skin('kermit-green', 'Kermit Green')
        .sidebarTheme('light-green')
        .toolbarTheme('white-light-green')
        .logoTheme('light-green')
        .contentTheme('light-green');
 
        // Hager SKIN
        triThemingProvider.theme('hager-pink')
        .primaryPalette('hagerpink', {
            'default': '900'
        })
        .accentPalette('hageryellow', {
            'default': '700'
        })
        .warnPalette('hageryellow', {
            'default': '900'
        });

        triThemingProvider.theme('hager-yellow')
        .primaryPalette('hageryellow', {
            'default': '100'
        })
        .accentPalette('hagerorange', {
            'default': '100'
        })
        .warnPalette('hagerpink', {
            'default': '100'
        });

        triThemingProvider.theme('hager-orange')
        .primaryPalette('hagerorange', {
            'default': '100'
        })
        .accentPalette('hageryellow', {
            'default': '100'
        })
        .warnPalette('hagerpink', {
            'default': '100'
        });


        triThemingProvider.theme('hager-blue')
        .primaryPalette('hagerblue', {
            'default': '100'
        })
        .accentPalette('hagerpink', {
            'default': '100'
        })
        .warnPalette('hageryellow', {
            'default': '100'
        });
 
        triSkinsProvider.skin('hager-pink', 'Hager pink')
        .sidebarTheme('hager-pink')
        .toolbarTheme('hager-yellow')
        .logoTheme('hager-yellow')
        .contentTheme('hager-pink');

        triSkinsProvider.skin('hager-yellow', 'Hager yellow')
        .sidebarTheme('cyan')
        .toolbarTheme('hager-yellow')
        .logoTheme('hager-orange')
        .contentTheme('cyan');

        triSkinsProvider.skin('hager-blue', 'Hager blue')
        .sidebarTheme('hager-blue')
        .toolbarTheme('hager-pink')
        .logoTheme('hager-yellow')
        .contentTheme('hager-pink');

        $mdThemingProvider.theme('hager-yellow');

        /**
         *  FOR DEMO PURPOSES ALLOW SKIN TO BE SAVED IN A COOKIE
         *  This overrides any skin set in a call to triSkinsProvider.setSkin if there is a cookie
         *  REMOVE LINE BELOW FOR PRODUCTION SITE
         */
        triSkinsProvider.useSkinCookie(true);

        /**
         *  SET DEFAULT SKIN
         */
        triSkinsProvider.setSkin('hager-yellow');
    }
})();

(function() {
    'use strict';

    translateConfig.$inject = ["triSettingsProvider", "triRouteProvider"];
    angular
        .module('app')
        .config(translateConfig);

    /* @ngInject */
    function translateConfig(triSettingsProvider, triRouteProvider) {
        var now = new Date();
        // set app name & logo (used in loader, sidemenu, footer, login pages, etc)
        triSettingsProvider.setName('Hager Laboratory');
        triSettingsProvider.setCopyright('&copy;' + now.getFullYear() + ' www.hagergroup.com');
        triSettingsProvider.setLogo('assets/images/logo.png');
        // set current version of app (shown in footer)
        triSettingsProvider.setVersion('1.0.0');
        // set the document title that appears on the browser tab
        triRouteProvider.setTitle('Hager Laboratory');
        triRouteProvider.setSeparator('|');
    }
})();

(function() {
    'use strict';

    config.$inject = ["triLayoutProvider"];
    angular
        .module('app')
        .config(config);

    /* @ngInject */
    function config(triLayoutProvider) {
        // set app templates (all in app/layouts folder so you can tailor them to your needs)

        // loader screen HTML & controller
        triLayoutProvider.setDefaultOption('loaderTemplateUrl', 'app/layouts/loader/loader.tmpl.html');
        triLayoutProvider.setDefaultOption('loaderController', 'LoaderController');

        // left sidemenu HTML and controller
        triLayoutProvider.setDefaultOption('sidebarLeftTemplateUrl', 'app/layouts/leftsidenav/leftsidenav.tmpl.html');
        triLayoutProvider.setDefaultOption('sidebarLeftController', 'LeftSidenavController');

        // right sidemenu HTML and controller
        triLayoutProvider.setDefaultOption('sidebarRightTemplateUrl', 'app/layouts/rightsidenav/rightsidenav.tmpl.html');
        triLayoutProvider.setDefaultOption('sidebarRightController', 'RightSidenavController');

        // top toolbar HTML and controller
        triLayoutProvider.setDefaultOption('toolbarTemplateUrl', 'app/layouts/toolbar/toolbar.tmpl.html');
        triLayoutProvider.setDefaultOption('toolbarController', 'ToolbarController');

        // footer HTML
        triLayoutProvider.setDefaultOption('footerTemplateUrl', 'app/layouts/footer/footer.tmpl.html');

        triLayoutProvider.setDefaultOption('toolbarSize', 'default');

        triLayoutProvider.setDefaultOption('toolbarShrink', true);

        triLayoutProvider.setDefaultOption('toolbarClass', '');

        triLayoutProvider.setDefaultOption('contentClass', '');

        triLayoutProvider.setDefaultOption('sideMenuSize', 'full');

        triLayoutProvider.setDefaultOption('showToolbar', true);

        triLayoutProvider.setDefaultOption('footer', false);
    }
})();

(function() {
    'use strict';

    routeConfig.$inject = ["$stateProvider", "$urlRouterProvider"];
    angular
        .module('app')
        .config(routeConfig);

    /* @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        // Setup the apps routes

        // 404 & 500 pages
        $stateProvider
        .state('404', {
            url: '/404',
            views: {
                'root': {
                    templateUrl: '404.tmpl.html',
                    controller: 'ErrorPageController',
                    controllerAs: 'vm'
                }
            }
        })

        .state('401', {
            url: '/401',
            views: {
                'root': {
                    templateUrl: '401.tmpl.html',
                    controller: 'ErrorPageController',
                    controllerAs: 'vm'
                }
            }
        })

        .state('500', {
            url: '/500',
            views: {
                'root': {
                    templateUrl: '500.tmpl.html',
                    controller: 'ErrorPageController',
                    controllerAs: 'vm'
                }
            }
        });

        // set default routes when no path specified
        $urlRouterProvider.when('', '/login');
        $urlRouterProvider.when('/', '/login');

        // always goto 404 if route not found
        $urlRouterProvider.otherwise('/404');
    }
})();

(function() {
    'use strict';

    config.$inject = ["ChartJsProvider"];
    angular
        .module('app')
        .config(config);

    /* @ngInject */
    function config(ChartJsProvider) {
        // Configure all charts to use material design colors
        ChartJsProvider.setOptions({
            colours: [
                '#4285F4',    // blue
                '#DB4437',    // red
                '#F4B400',    // yellow
                '#0F9D58',    // green
                '#AB47BC',    // purple
                '#00ACC1',    // light blue
                '#FF7043',    // orange
                '#9E9D24',    // browny yellow
                '#5C6BC0'     // dark blue
            ],
            responsive: true
        });
    }
})();
(function() {
    'use strict';

    runFunction.$inject = ["$rootScope", "$state", "$cookies", "$log"];
    angular
        .module('app')
        .run(runFunction);

    /* @ngInject */
    function runFunction($rootScope, $state, $cookies, $log) {

        // default redirect if access is denied
        function redirectError() {
            $state.go('500');
        }
        
        // watches
        // redirect all errors to permissions to 500
        var errorHandle = $rootScope.$on('$stateChangeError', redirectError);

        // remove watch on destroy
        $rootScope.$on('$destroy', function() {
            errorHandle();
        });

        function setHagerSkin(skin){
            if(!$cookies.get('triangular-skin'))
            {
                $cookies.put('triangular-skin',angular.toJson({
                            skin: skin 
                 }));
            }
        }

        setHagerSkin("hager-yellow");
 
    }
})();

(function() {
    'use strict';

    appConfig.$inject = ["$compileProvider", "$mdAriaProvider"];
    angular
        .module('app')
        .config(appConfig);

    /* @ngInject */
    function appConfig($compileProvider, $mdAriaProvider) {
        // Make sure this still works in controllers (breaking change in angular 1.6)
        $compileProvider.preAssignBindingsEnabled(true);
        // Disable Aria warnings 
        $mdAriaProvider.disableWarnings();

        // Disable this comment to enable production mode
        //$compileProvider.debugInfoEnabled(false);
    }

})();
 
angular.module("app").run(["$templateCache", function($templateCache) {$templateCache.put("app/seed-module/seed-page.tmpl.html","<md-content class=\"padded-content-page\">\n    <div layout=\"row\" layout-align=\"center center\">\n        <h2 class=\"md-display-3\" translate>Welcome to the triangular test page</h2>\n    </div>\n    <div class=\"margin-20\" layout=\"row\" layout-align=\"center center\">\n        <ul class=\"seed-list\">\n            <li class=\"md-headline\" ng-repeat=\"test in vm.testData\">\n                {{test}}\n            </li>\n        </ul>\n    </div>\n</md-content>");
$templateCache.put("app/authentication/forgot/forgot.tmpl.html","<md-card>\n    <md-toolbar class=\"padding-20 text-center\">\n        <img ng-src=\"{{::vm.triSettings.logo}}\" alt=\"{{vm.triSettings.name}}\">\n        <h1 class=\"md-headline\" translate>Forgot your password?</h1>\n    </md-toolbar>\n\n    <md-content class=\"md-padding\">\n        <p translate>Please enter your email below</p>\n        <form name=\"forgot\">\n            <md-input-container class=\"md-block\">\n                <label for=\"email\" translate>email</label>\n                <input id=\"email\" label=\"email\" name=\"email\" type=\"email\" ng-model=\"vm.user.email\" required/>\n                <div ng-messages=\"forgot.email.$error\" md-auto-hide=\"false\" ng-show=\"forgot.email.$touched\">\n                    <div ng-message when=\"required\"><span translate>Please enter your email address.</span></div>\n                    <div ng-message when=\"email\"><span translate>Please enter a valid email address.</span></div>\n                </div>\n            </md-input-container>\n\n            <md-button class=\"md-raised md-primary full-width margin-left-0 margin-right-0 margin-top-10 margin-bottom-10\" ng-click=\"vm.resetClick()\" ng-disabled=\"forgot.$invalid\" translate=\"Reset\" aria-label=\"{{\'Reset\' | triTranslate}}\"></md-button>\n\n            <md-button class=\"md-primary full-width margin-left-0 margin-right-0 margin-top-10 margin-bottom-10\" href=\"#/login\" translate=\"Remembered it? Login in here\" aria-label=\"{{\'Remembered it? Login in here\' | triTranslate}}\"></md-button>\n        </form>\n    </md-content>\n</md-card>\n");
$templateCache.put("app/authentication/layouts/authentication.tmpl.html","<div class=\"full-image-background mb-bg-08\" layout=\"row\" layout-fill>\n    <div class=\"animate-wrapper\" flex layout=\"column\">\n        <div id=\"ui-login\" class=\"login-frame\" ui-view flex layout=\"column\" layout-align=\"center center\"></div>\n    </div>\n</div>\n");
$templateCache.put("app/authentication/lock/lock.tmpl.html","<md-card>\n    <md-toolbar class=\"padding-20 text-center\">\n        <img ng-src=\"{{::vm.triSettings.logo}}\" alt=\"{{vm.triSettings.name}}\">\n        <h1 class=\"md-headline\">\n            <span translate>Welcome back</span> {{vm.user.name}}\n        </h1>\n    </md-toolbar>\n\n    <md-content class=\"md-padding\">\n        <p class=\"margin-top-20 margin-bottom-20\" translate>You have been logged out due to idleness. Enter your password to log back in.</p>\n\n        <form name=\"lock\">\n            <md-input-container class=\"md-block\">\n                <label for=\"password\" translate>password</label>\n                <input label=\"password\" name=\"password\" type=\"password\" ng-model=\"vm.user.password\" required/>\n                <div ng-messages for=\"lock.password.$error\" md-auto-hide=\"false\" ng-show=\"lock.password.$touched\">\n                    <div ng-message when=\"required\"><span translate>Please enter your password.</span></div>\n                </div>\n            </md-input-container>\n\n            <div layout=\"row\">\n                <md-button flex href=\"#/login\" translate=\"Log out\"></md-button>\n                <md-button flex class=\"md-primary\" ng-click=\"vm.loginClick()\" ng-disabled=\"lock.$invalid\" translate=\"Log in\"></md-button>\n            </div>\n        </form>\n    </md-content>\n</md-card>\n");
$templateCache.put("app/authentication/login/login.tmpl.html","<md-card >\n    <md-toolbar class=\"padding-20 text-center\">\n        <img ng-src=\"{{::vm.triSettings.logo}}\" alt=\"{{vm.triSettings.name}}\">\n        <h1 class=\"md-headline\" translate>Hager© Laboratory</h1>\n    </md-toolbar>\n\n    <md-content class=\"md-padding\">\n        <form name=\"login\">\n            <md-input-container class=\"md-block\">\n                <label for=\"email\" translate>email</label>\n                <input id=\"email\" label=\"email\" name=\"email\" type=\"email\" ng-model=\"vm.credentials.email\" required/>\n                <div ng-messages=\"login.email.$error\" md-auto-hide=\"false\" ng-show=\"login.email.$touched\">\n                    <div ng-message when=\"required\">\n                        <span translate>Please enter your email address</span>\n                    </div>\n                    <div ng-message when=\"email\">\n                        <span translate>Please enter a valid email address</span>\n                    </div>\n                </div>\n            </md-input-container>\n\n            <md-input-container class=\"md-block\">\n                <label for=\"password\" translate>password</label>\n                <input  id=\"password\" label=\"password\" name=\"password\" type=\"password\" ng-model=\"vm.credentials.password\" required/>\n                <div ng-messages for=\"login.password.$error\" md-auto-hide=\"false\" ng-show=\"login.password.$touched\">\n                    <div ng-message when=\"required\"><span translate>Please enter your password.</span></div>\n                </div>\n            </md-input-container>\n \n\n            <md-button class=\"md-raised md-primary full-width margin-left-0 margin-right-0 margin-top-10 margin-bottom-10\" ng-click=\"vm.loginClick()\" ng-disabled=\"login.$invalid\" translate=\"Log in\" aria-label=\"{{\'Log in\' | triTranslate}}\"></md-button>\n            <md-button class=\"md-raised md-primary full-width margin-left-0 margin-right-0 margin-top-10 margin-bottom-10\" ng-click=\"vm.loginAsGuest()\" translate=\"Log in as guest\" aria-label=\"{{\'Log in as guest\' | triTranslate}}\"></md-button>\n\n            <md-button class=\"md-primary full-width margin-left-0 margin-right-0 margin-top-10 margin-bottom-10\" ng-click=\"vm.signup()\" translate=\"Don\'t have an account? Create one now\" aria-label=\"{{\'Don\\\'t have an account? Create one now\' | triTranslate}}\"></md-button>\n\n \n        </form>\n    </md-content>\n</md-card>\n");
$templateCache.put("app/authentication/profile/profile.tmpl.html","<div class=\"full-image-background mb-bg-01 padding-20 padding-top-200 overlay-gradient-30\" layout=\"row\" layout-align=\"center start\">\n    <div class=\"margin-right-20\">\n        <img src=\"assets/images/avatars/avatar-5.png\" alt=\"girl-avatar\" class=\"make-round\" width=\"100\"/>\n    </div>\n    <div class=\"text-light\">\n        <h3 class=\"font-weight-600 margin-bottom-0 text-light\">Christos / Profile</h3>\n        <p class=\"font-weight-300 margin-top-0\">Edit your name, avatar etc</p>\n     </div>\n</div>\n\n<div layout=\"row\" class=\"profile\" layout-wrap>\n    <div flex=\"100\" flex-gt-md=\"100\">\n        <md-tabs md-dynamic-height md-border-bottom>\n            <md-tab label=\"Profile\">\n                <md-content class=\"md-padding\">\n                    <form name=\"profile\">\n                        <md-input-container class=\"md-block\">\n                            <label for=\"name\" translate>name</label>\n                            <input id=\"name\" label=\"name\" name=\"name\" type=\"text\" ng-model=\"vm.user.name\" required/>\n                            <div ng-messages=\"profile.name.$error\" md-auto-hide=\"false\" ng-show=\"profile.name.$touched\">\n                                <div ng-message when=\"required\"><span translate>Please enter your name</span></div>\n                            </div>\n                        </md-input-container>\n                        <md-input-container class=\"md-block\">\n                            <label for=\"email\" translate>email</label>\n                            <input id=\"email\" label=\"email\" name=\"email\" type=\"email\" ng-model=\"vm.user.email\" required/>\n                            <div ng-messages=\"profile.email.$error\" md-auto-hide=\"false\" ng-show=\"profile.email.$touched\">\n                                <div ng-message when=\"required\">\n                                    <span translate>Please enter your email address</span>\n                                </div>\n                                <div ng-message when=\"email\">\n                                    <span translate>Please enter a valid email address</span>\n                                </div>\n                            </div>\n                        </md-input-container>\n\n                        <md-input-container class=\"md-block\">\n                            <label for=\"location\" translate>location</label>\n                            <input id=\"location\" label=\"location\" name=\"location\" type=\"text\" ng-model=\"vm.user.location\"/>\n                        </md-input-container>\n\n                        <md-input-container class=\"md-block\">\n                            <label for=\"website\" translate>website</label>\n                            <input id=\"website\" label=\"website\" name=\"website\" type=\"text\" ng-model=\"vm.user.website\"/>\n                        </md-input-container>\n\n                        <md-input-container class=\"md-block\">\n                            <label for=\"twitter\" translate>twitter</label>\n                            <input id=\"twitter\" label=\"twitter\" name=\"twitter\" type=\"text\" ng-model=\"vm.user.twitter\"/>\n                        </md-input-container>\n\n                        <md-input-container class=\"md-block\">\n                            <label for=\"bio\" translate>bio</label>\n                            <textarea id=\"bio\" label=\"bio\" name=\"bio\" ng-model=\"vm.user.bio\"/>\n                        </md-input-container>\n\n                        <md-button class=\"md-raised md-primary margin-left-0\" ng-disabled=\"profile.$invalid\" translate=\"Update Settings\"></md-button>\n                    </form>\n                </md-content>\n            </md-tab>\n            <md-tab label=\"Password\">\n                <md-content class=\"md-padding\">\n                    <form name=\"password\">\n                        <md-input-container class=\"md-block\">\n                            <label for=\"old-password\" translate>current</label>\n                            <input id=\"old-password\" label=\"old-password\" name=\"old-password\" type=\"text\" ng-model=\"vm.user.current\"/>\n                        </md-input-container>\n\n                        <md-input-container class=\"md-block\">\n                            <label for=\"password\" translate>new password</label>\n                            <input id=\"password\" label=\"password\" name=\"password\" type=\"password\" ng-model=\"vm.user.password\" tri-same-password=\"password.confirm\" ng-minlength=\"8\" required/>\n                            <div ng-messages=\"password.password.$error\" ng-include=\"\'app/examples/authentication/signup/password.messages.html\'\" md-auto-hide=\"false\" ng-show=\"password.password.$touched\"></div>\n                        </md-input-container>\n\n                        <md-input-container class=\"md-block\">\n                            <label for=\"confirm\" translate>confirm password</label>\n                            <input id=\"confirm\" label=\"confirm\" name=\"confirm\" type=\"password\" ng-model=\"vm.user.confirm\" tri-same-password=\"password.password\" ng-minlength=\"8\" required/>\n                            <div ng-messages=\"password.confirm.$error\" ng-include=\"\'app/examples/authentication/signup/password.messages.html\'\" md-auto-hide=\"false\" ng-show=\"password.confirm.$touched\"></div>\n                        </md-input-container>\n\n                        <md-button class=\"md-raised md-primary margin-left-0\" ng-disabled=\"profile.$invalid\" translate=\"Update Settings\"></md-button>\n\n                    </form>\n                </md-content>\n            </md-tab>\n            <md-tab label=\"Notifications\">\n                <md-content class=\"md-padding\">\n                    <md-list>\n                        <div ng-repeat=\"group in ::vm.settingsGroups\">\n                            <md-subheader class=\"md-accent\" translate=\"{{::group.name}}\"></md-subheader>\n                            <md-list-item ng-repeat=\"setting in ::group.settings\" layout=\"row\" layout-align=\"space-around center\">\n                                <md-icon md-font-icon=\"{{::setting.icon}}\"></md-icon>\n                                <p translate>{{::setting.title}}</p>\n                                <md-switch class=\"md-secondary\" ng-model=\"setting.enabled\"></md-switch>\n                            </md-list-item>\n                        </div>\n                    </md-list>\n                    <md-button class=\"md-raised md-primary margin-left-0\" ng-disabled=\"profile.$invalid\" translate=\"Update Settings\"></md-button>\n                </md-content>\n            </md-tab>\n        </md-tabs>\n    </div>\n\n</div>\n");
$templateCache.put("app/authentication/signup/signup.tmpl.html","<md-card>\n    <md-toolbar class=\"padding-20 text-center\">\n        <img ng-src=\"{{::vm.triSettings.logo}}\" alt=\"{{vm.triSettings.name}}\">\n        <h1 class=\"md-headline\" translate>Sign up</h1>\n    </md-toolbar>\n\n    <md-content>\n        <form name=\"signup\">\n            <md-input-container class=\"md-block\">\n                <label for=\"name\" translate>username</label>\n                <input id=\"name\" label=\"name\" name=\"name\" type=\"text\" ng-model=\"vm.user.username\" required/>\n                <div ng-messages=\"signup.name.$error\" md-auto-hide=\"false\" ng-show=\"signup.name.$touched\">\n                    <div ng-message when=\"required\">\n                        <span translate>Please enter your username</span>\n                    </div>\n                </div>\n            </md-input-container>\n            <md-input-container class=\"md-block\">\n                <label for=\"email\" translate>email</label>\n                <input id=\"email\" label=\"email\" name=\"email\" type=\"email\" ng-model=\"vm.user.email\" required/>\n                <div ng-messages=\"signup.email.$error\" md-auto-hide=\"false\" ng-show=\"signup.email.$touched\">\n                    <div ng-message when=\"required\">\n                        <span translate>Please enter your email address</span>\n                    </div>\n                    <div ng-message when=\"email\">\n                        <span translate>Please enter a valid email address</span>\n                    </div>\n                </div>\n            </md-input-container>\n\n            <md-input-container class=\"md-block\">\n                <label for=\"password\" translate>password</label>\n                <input id=\"password\" label=\"password\" name=\"password\" type=\"password\" ng-model=\"vm.user.password\" tri-same-password=\"signup.confirm\" ng-minlength=\"4\" required/>\n                <ng-messages for=\"signup.password.$error\" md-auto-hide=\"false\" ng-show=\"signup.password.$touched\">\n                    <div ng-message when=\"required\">\n                        <span translate>Please enter a password</span>\n                    </div>\n                    <div ng-message when=\"minlength\">\n                        <span translate>Your password must be greater than 8 characters long</span>\n                    </div>\n                    <div ng-message when=\"samePassword\">\n                        <span translate>You need to enter the same password</span>\n                    </div>\n                </ng-messages>\n            </md-input-container>\n\n            <md-input-container class=\"md-block\">\n                <label for=\"password\" translate>confirm password</label>\n                <input id=\"confirm\" label=\"confirm\" name=\"confirm\" type=\"password\" ng-model=\"vm.user.confirm\" tri-same-password=\"signup.password\" ng-minlength=\"4\" required/>\n                <ng-messages for=\"signup.confirm.$error\" md-auto-hide=\"false\" ng-show=\"signup.confirm.$touched\">\n                    <div ng-message when=\"required\">\n                        <span translate>Please enter a password</span>\n                    </div>\n                    <div ng-message when=\"minlength\">\n                        <span translate>Your password must be greater than 8 characters long</span>\n                    </div>\n                    <div ng-message when=\"samePassword\">\n                        <span translate>You need to enter the same password</span>\n                    </div>\n                </ng-messages>\n            </md-input-container>\n\n                <md-radio-group class=\"elements-radio-avatar\" ng-model=\"vm.avatar\" ng-init=\"data.avatar = \'avatar-1\'; avatars = [\'hair-black-eyes-blue-green-skin-tanned\',\'hair-blonde-eyes-blue-green-skin-light\',\'avatar-3\',\'avatar-4\',\'avatar-5\', \'hair-black-eyes-brown-skin-dark\', \'hair-black-eyes-brown-skin-tanned-2\' ,\'hair-blonde-eyes-brown-skin-tanned\' ,\'hair-grey-eyes-dark-skin-tanned\']\">\n                    <div layout=\"column\" style=\"overflow-x: scroll;\">\n                        <div layout=\"row\"  layout-align=\"center center\">\n                            <md-radio-button ng-repeat=\"avatar in ::avatars\" value=\"{{::avatar}}\" aria-label=\"avatar\"> </md-radio-button>\n                        </div>\n                        <div layout=\"row\" >\n                            <div ng-repeat=\"avatar in ::avatars\" aria-label=\"avatar\">\n                                <img ng-if=\"vm.avatar != avatar\" ng-src=\"assets/images/avatars/{{::avatar}}.png\" alt=\"{{::avatar}}\">\n                                <img ng-if=\"vm.avatar == avatar\" style=\'zoom: 1.2;\' class=\"make-round\" ng-src=\"assets/images/avatars/{{::avatar}}.png\" alt=\"{{::avatar}}\">\n                            </div>\n                        </div>\n                    </div>\n                </md-radio-group>\n\n            <md-button class=\"md-raised md-primary full-width margin-left-0 margin-right-0 margin-top-10 margin-bottom-10\" ng-click=\"vm.signupClick()\" ng-disabled=\"signup.$invalid\" translate=\"Sign Up\" aria-label=\"{{\'Sign Up\' | triTranslate}}\"></md-button>\n\n            <md-button  class=\"md-primary full-width margin-left-0 margin-right-0 margin-top-10 margin-bottom-10\" href=\"#/login\" translate=\"Already have an account? Login here.\" aria-label=\"{{\'Already have an account? Login here.\' | triTranslate}}\"></md-button>\n\n        </form>\n    </md-content>\n\n</md-card>\n");
$templateCache.put("app/examples/extras/avatars.tmpl.html","<md-content class=\"padded-content-page\">\n    <p class=\"md-subhead\">Triangular includes an enormous set of Material Design Avatars. Amazing details and 1000s of combinations. Includes original Adobe Illustrator file as well as 1440 exported images</p>\n\n    <md-grid-list md-cols=\"6\" md-cols-xs=\"4\" md-row-height=\"1:1\" md-gutter=\"4px\">\n        <md-grid-tile md-rowspan=\"{{::avatar.rowspan}}\" md-colspan=\"{{::avatar.colspan}}\" ng-repeat=\"avatar in ::vm.avatars\" ng-style=\"::{ \'background-image\': \'url(\' + avatar.image + \')\', \'background-size\' : \'cover\' }\" palette-background=\"{{::avatar.color}}:{{::avatar.hue}}\">\n            <md-grid-tile-footer>\n                <h3>{{::avatar.title}}</h3>\n            </md-grid-tile-footer>\n        </md-grid-tile>\n    </md-grid-list>\n</md-content>");
$templateCache.put("app/examples/extras/blank.tmpl.html","<div class=\"padded-content-page\">\n    <div layout=\"row\" layout-align=\"center center\">\n        <p>Your content here</p>\n    </div>\n</div>");
$templateCache.put("app/examples/extras/gallery-dialog.tmpl.html","<md-dialog aria-label=\"{{vm.currentImage.title}}\">\n    <md-dialog-content class=\"md-dialog-content extras-image-dialog\">\n        <img ng-src=\"{{vm.currentImage.urlFull}}\" alt=\"{{vm.currentImage.title}}\">\n    </md-dialog-content>\n    <md-dialog-actions layout=\"row\">\n        {{vm.currentImage.title}}\n        <span flex></span>\n        <md-button ng-click=\"vm.prev()\" class=\"md-icon-button\" aria-label=\"Close\">\n            <md-icon md-font-icon=\"zmdi zmdi-chevron-left\"></md-icon>\n        </md-button>\n        <md-button ng-click=\"vm.next()\" class=\"md-icon-button\" aria-label=\"Close\">\n            <md-icon md-font-icon=\"zmdi zmdi-chevron-right\"></md-icon>\n        </md-button>\n    </md-dialog-actions>\n</md-dialog>");
$templateCache.put("app/examples/extras/gallery.tmpl.html","<md-content class=\"extras-gallery-container\">\n    <md-list>\n        <div ng-repeat=\"day in ::vm.feed\">\n            <md-subheader>{{day.date | amCalendar}}</md-subheader>\n            <md-list-item>\n                <md-grid-list flex md-cols=\"6\" md-cols-xs=\"4\" md-row-height=\"4:3\" md-gutter=\"4px\">\n                    <md-grid-tile ng-click=\"vm.openImage(day, image, $event)\" md-rowspan=\"{{::image.rowspan}}\" md-colspan=\"{{::image.colspan}}\" ng-repeat=\"image in ::day.images\" ng-style=\"::{ \'background-image\': \'url(\' + image.url + \')\', \'background-size\' : \'cover\' }\">\n                        <md-grid-tile-footer>\n                            <h3>{{::image.title}}</h3>\n                        </md-grid-tile-footer>\n                    </md-grid-tile>\n                </md-grid-list>\n            </md-list-item>\n        </div>\n    </md-list>\n</md-content>\n");
$templateCache.put("app/examples/extras/timeline.tmpl.html","<div class=\"overlay-5 padded-content-page\" animate-elements>\n    <div class=\"timeline\" layout=\"row\" ng-repeat=\"event in ::vm.events\" ng-attr-layout-align=\"{{$odd? \'end end\':\'start start\'}}\">\n        <div layout=\"row\" flex=\"50\" flex-xs=\"100\" ng-attr-layout-align=\"{{$odd? \'end\':\'start\'}} center\">\n            <div class=\"timeline-point md-whiteframe-z1\" theme-background=\"primary\" md-theme=\"{{triSkin.elements.content}}\">\n                <img ng-src=\"{{::event.image}}\" class=\"timeline-point-avatar\"/>\n                <span class=\"timeline-point-date\">{{::event.date}}</span>\n            </div>\n            <md-divider class=\"timeline-x-axis\" class=\"margin-0\" flex flex-order=\"2\"></md-divider>\n            <tri-widget class=\"timeline-widget margin-0 flex-70 flex-xs-100 {{::event.classes}}\" title=\"{{::event.title}}\" subtitle=\"{{::event.subtitle}}\" title-position=\"bottom\" ng-attr-flex-order=\"{{$odd? 2:1}}\" palette-background=\"{{::event.palette}}\" >\n                <div replace-with=\'{{event.content}}\'></div>\n            </tri-widget>\n            <md-divider class=\"timeline-y-axis\"></md-divider>\n        </div>\n    </div>\n</div>\n");
$templateCache.put("app/laboratory/dashboard/dashboard.tmpl.html","<md-toolbar permission=\"\" permission-only=\"\'CanSeeWarning\'\" class=\"md-warn toolbar-default margin-bottom-0\">\n    <div class=\"md-toolbar-tools\">\n        <h2>\n            <md-icon md-font-icon=\"fa fa-warning\"><span> You\'re connected as guest. Please <a class=\"pointille\" ng-click=\"vm.Gologin()\">Connect</a> to have the full access.</span></md-icon>\n        </h2>\n    </div>\n</md-toolbar>\n\n<div class=\"padded-content-page\" layout=\"column\" layout-margin>\n  <div class=\"drag-container\" dragula=\'\"drag-container\"\' layout=\"row\" layout-margin>\n\n            <tri-widget palette-background=\"amber:500\" content-layout=\"column\" content-layout-align=\"space-between\">\n                <div flex=\"20\" layout=\"row\" layout-align=\"space-between center\" layout-padding>\n                    <span> <md-icon md-font-icon=\"zmdi zmdi-bookmark-outline\"></md-icon>All References</span>\n                    <md-button class=\"md-icon-button\" aria-label=\"call\" countupto=\"vm.Number.Products\" duration=\"3\" decimals=\"0\"> </md-button>\n                </div>\n            </tri-widget>\n\n            <tri-widget palette-background=\"teal:500\" content-layout=\"column\" content-layout-align=\"space-between\">\n                <div flex=\"20\" layout=\"row\" layout-align=\"space-between center\" layout-padding>\n                    <span> <md-icon md-font-icon=\"fa fa-files-o\"></md-icon>All Reports</span>\n                    <md-button class=\"md-icon-button\" aria-label=\"call\" countupto=\"vm.Number.Documents\" duration=\"3\" decimals=\"0\"> </md-button>\n                </div>\n            </tri-widget>\n\n            <tri-widget palette-background=\"triCyan:600\" content-layout=\"column\" content-layout-align=\"space-between\">\n                <div flex=\"20\" layout=\"row\" layout-align=\"space-between center\" layout-padding>\n                    <span> <md-icon md-font-icon=\"zmdi zmdi-assignment\"></md-icon>  All Standards</span>\n                    <md-button class=\"md-icon-button\" aria-label=\"call\" countupto=\"vm.Number.Standards\" duration=\"3\" decimals=\"0\"> </md-button>\n                </div>\n            </tri-widget>\n\n            <tri-widget palette-background=\"lime:400\" content-layout=\"column\" content-layout-align=\"space-between\">\n                <div flex=\"20\" layout=\"row\" layout-align=\"space-between center\" layout-padding>\n                    <span> <md-icon md-font-icon=\"fa fa-recycle\"></md-icon>  All Directives</span>\n                    <md-button class=\"md-icon-button\" aria-label=\"call\" countupto=\"vm.Number.Directives\" duration=\"3\" decimals=\"0\"> </md-button>\n                </div>\n            </tri-widget>\n\n           <md-progress-linear ng-show=\"vm.status != \'idle\'\" class=\"md-warn margin-bottom-20\" md-mode=\"indeterminate\"></md-progress-linear>\n  </div>\n\n  <div class=\"drag-container\" dragula=\'\"drag-container\"\' layout=\"row\" layout-margin>\n\n            <tri-widget palette-background=\"amber:500\" content-layout=\"column\" content-layout-align=\"space-between\">\n                Products: Standards Status \n                <div flex=\"20\" layout=\"row\" layout-align=\"space-between center\" layout-padding>\n                    <canvas ng-if=\'vm.StatsStatus.Products == false\' height=\"35%\" width=\"100%\"class=\"chart-pie\" chart-data=\"vm.Stats.Products.Standards.data\" chart-labels=\"vm.Stats.Products.Standards.labels\" chart-legend=\"true\" chart-options=\"vm.options\"></canvas>\n                    <md-progress-circular ng-if=\'vm.StatsStatus.Products == true\' class=\"md-accent\" md-mode=\"indeterminate\"></md-progress-circular>\n                </div>   \n            </tri-widget>\n            <tri-widget palette-background=\"light-blue:500\" content-layout=\"column\" content-layout-align=\"space-between\">\n                <div content-layout=\"row\"> \n                    Products: Tests Status  <md-icon md-font-icon=\"fa fa-check\" style=\"color: rgb(0, 143, 0);\"></md-icon > - <md-icon md-font-icon=\"fa fa-check\" style=\"color: rgb(247, 15, 15);\"></md-icon > \n                </div>\n                <div flex=\"20\" layout=\"row\" layout-align=\"space-between center\" layout-padding>\n                    <canvas ng-if=\'vm.StatsStatus.Products == false\' height=\"35%\" width=\"100%\"class=\"chart-pie\" chart-data=\"vm.Stats.Products.Tests.data\" chart-labels=\"vm.Stats.Products.Tests.labels\" chart-legend=\"true\" chart-options=\"vm.options\"></canvas>\n                    <md-progress-circular ng-if=\'vm.StatsStatus.Products == true\' class=\"md-accent\" md-mode=\"indeterminate\"></md-progress-circular>\n                </div>\n            </tri-widget>\n            <tri-widget palette-background=\"triCyan:600\" content-layout=\"column\" content-layout-align=\"space-between\">\n                Standards\n                <div flex=\"20\" layout=\"row\" layout-align=\"space-between center\" layout-padding>\n                    <canvas  ng-if=\'vm.StatsStatus.Stds == false\' height=\"35%\" width=\"100%\"class=\"chart-pie\" chart-data=\"vm.Stats.Standards.data\" chart-labels=\"vm.Stats.Standards.labels\" chart-legend=\"true\" chart-options=\"vm.options\"></canvas>\n                    <md-progress-circular ng-if=\'vm.StatsStatus.Stds == true\' class=\"md-accent\" md-mode=\"indeterminate\"></md-progress-circular>\n                </div> \n            </tri-widget>\n  </div>\n\n\n      <div class=\"drag-container\" dragula=\'\"drag-container\"\' layout=\"row\" layout-margin>\n\n                <tri-widget palette-background=\"teal:500\" content-layout=\"column\" content-layout-align=\"space-between center\" content-padding>\n                    <div flex=\"20\" layout=\"column\" layout-align=\"space-between center\" layout-padding>\n\n                      <span> <md-icon md-font-icon=\"fa fa-files-o\"></md-icon> Backup Projects</span>\n                      <div flex=\"20\" layout=\"row\" layout-align=\"space-between center\" layout-padding>\n                        <md-button ng-if=\"vm.Backup.Status == \'Stop\'\" ng-click= \'vm.BackupProjects(0)\' class=\"md-primary md-raised\"><md-icon md-font-icon=\"fa fa-cloud-download\" >BACKUP</md-icon></md-button> \n                      </div>\n                      <div class=\"elements-raised-content\" ng-if=\"vm.Backup.Status != \'Stop\'\">\n\n                            <span> Backup Progress: <md-button class=\"md-icon-button\" aria-label=\"call\" countupto=\"vm.Backup.Progress\" duration=\"1\" decimals=\"1\"> </md-button> % - Treating : {{ vm.Backup.Productidx +1 }} / {{ vm.products.length }} - {{ vm.products[vm.Backup.Productidx].ProductInfo.References }} > {{ vm.products[vm.Backup.Productidx].ProductInfo.Brand }} </span>\n                            <md-progress-linear class=\"md-warn\" md-mode=\"buffer\" value=\"{{vm.Backup.Progress}}\" md-buffer-value=\"{{vm.Backup.Progress + 10}}\"></md-progress-linear>\n                            <div class=\"elements-raised-buttons\" layout=\"row\" layout-align=\"end center\">\n                                <md-button class=\"md-raised md-primary\" aria-label=\"pause\" ng-if=\"vm.Backup.Status == \'Ongoing\'\" ng-click=\"vm.Backup.Status = \'Pause\'\">Pause</md-button>\n                                <md-button class=\"md-raised md-primary\" aria-label=\"pause\" ng-if=\"vm.Backup.Status == \'Pause\'\" ng-click=\"vm.BackupProjects(vm.Backup.Productidx)\">Resume</md-button>\n                                <md-button class=\"md-raised md-warn\" aria-label=\"cancel\" ng-click=\"vm.Backup.Status = \'Stop\'\">Cancel</md-button> \n                            </div>\n                     </div>\n                    </div>\n                </tri-widget>\n\n        </div>\n</div>\n\n ");
$templateCache.put("app/laboratory/documents/documents.tmpl.html","<md-toolbar permission=\"\" permission-only=\"\'CanSeeWarning\'\" class=\"md-warn toolbar-default margin-bottom-0\">\n    <div class=\"md-toolbar-tools\">\n        <h2>\n            <md-icon md-font-icon=\"fa fa-warning\"><span> You\'re connected as guest. Please <a class=\"pointille\" ng-click=\"vm.Gologin()\">Connect</a> to have the full access.</span></md-icon>\n        </h2>\n    </div>\n</md-toolbar>\n\n<div class=\"padded-content-page\">\n \n    <div layout=\"row\" flex content-layout-align=\"space-between\">\n        <h2 class=\"md-display-1\" translate>Documents & Reports</h2>\n    </div>\n \n    <md-subheader class=\"md-whiteframe-z3 margin-20 text-center\" palette-background=\"white:500\" >   \n        FILTERS : \n         <md-input-container>\n            <label translate>Search by Name</label>\n                  <input type=\"text\" ng-model=\"Name\">\n        </md-input-container> \n         <md-input-container>\n            <label translate>Search by Author</label>\n                  <input type=\"text\" ng-model=\"Author\">\n        </md-input-container>\n         <md-input-container>\n            <label translate>Search by Category</label>\n                  <input type=\"text\" ng-model=\"Category\">\n        </md-input-container>\n         <md-input-container>\n            <label translate>Search by Subcategory </label>\n                  <input type=\"text\" ng-model=\"SubCategory\">\n        </md-input-container>\n    </md-subheader>\n\n   <md-whiteframe ng-show=\"vm.status != \'idle\'\" class=\"md-warn margin-bottom-20\" md-mode=\"indeterminate\"></md-whiteframe>\n\n   <md-subheader class=\"md-warn margin-bottom-10 text-center\" ng-if=\"vm.Documents.length == 0 && vm.status == \'idle\'\"> NO REPORT FOUND </md-subheader>\n\n    <div class=\"md-whiteframe-z1 margin-10\" palette-background=\"cyan:500\" ng-repeat=\"doc in vm.Documents | filter : { name : Name }  | filter :{  Info: { Author : Author } } | filter :{  Info: { Category : Category } } | filter :{  Info: { SubCategory : SubCategory } }\" ng-click=\'doc.show = !doc.show\'>\n            <span>\n                <span hide-xs> <md-icon md-font-icon=\"fa fa-user\">{{doc.Info.Author || \'No Body\'}} </md-icon> </span>  \n            </span>\n                <md-icon md-font-icon=\"zmdi zmdi-chevron-right\"></md-icon>\n                <md-menu>\n                      <md-icon md-font-icon=\"zmdi zmdi-attachment-alt\" ng-click=\"$mdOpenMenu()\">{{ doc.name }}</md-icon>\n                             <md-menu-content width=\"3\">\n                                    <md-menu-item>\n                                            <md-button ng-click=\"vm.getreport(doc._id)\" aria-label=\"view report\"> <md-icon md-font-icon=\"fa fa-cloud-download\"></md-icon>view report</md-button>\n                                    </md-menu-item>\n                                    <md-menu-item  permission =\"\" permission-only=\"\'CanDeleteReport\'\">\n                                            <md-button ng-click=\"vm.deleteDocumentbyId(doc._id)\" aria-label=\"delete report\" > <md-icon md-font-icon=\"fa fa-trash-o\"></md-icon>delete report</md-button>\n                                    </md-menu-item>\n                             </md-menu-content>\n                </md-menu>\n\n                <md-icon md-font-icon=\"zmdi zmdi-chevron-right\"></md-icon>\n                <input class=\"ng-hide\" id=\'{{doc}}\' type=\"file\" onchange=\"angular.element(this).scope().Addreport(this, angular.element(this).scope().doc)\" multiple>  \n                <label style=\"zoom: 60%;\" permission=\"\" permission-only=\"\'CanUploadReport\'\" for=\'{{doc}}\' class=\"md-button md-warn md-raised\" > <md-icon md-font-icon=\"zmdi zmdi-refresh-sync\"></md-icon> Update Report </label>  \n\n            <div class=\"md-list-item-text\"  ng-if=\'doc.show\'>\n                <p>{{ doc.Info.Category }} - {{ doc.Info.SubCategory }}</p>\n            </div>\n\n    </div>\n\n</div>\n");
$templateCache.put("app/laboratory/pca/pca.tmpl.html"," <div class=\"padded-content-page\">\n\n	<h2 class=\"md-display-1\">PCA & Documents Management.</h2>\n \n\n</div>\n ");
$templateCache.put("app/laboratory/products/product.dialog.template.html","<md-dialog class=\"laboratory-dashboard\">\n<md-toolbar permission=\"\" permission-only=\"\'CanSeeWarning\'\" class=\"md-warn toolbar-default margin-bottom-0\">\n    <div class=\"md-toolbar-tools\">\n        <h2>\n            <md-icon md-font-icon=\"fa fa-warning\"><span> You\'re connected as guest. Please <a class=\"pointille\" ng-click=\"vm.Gologin()\">Connect</a> to have the full access.</span></md-icon>\n        </h2>\n    </div>\n</md-toolbar>\n<div class=\"dashboard-social-header padding-70 padding-top-100 overlay-gradient-30\" layout=\"row\" layout-align=\"start center\" style=\"background: url(assets/images/backgrounds/material-backgrounds/mb-bg-11.jpg) no-repeat; background-size: cover;\">\n    <div class=\"margin-right-20\">\n        <img ng-src=\"{{vm.product.ProductInfo.ImageBuffer}}\" id=\"productImage\" style=\"border-radius: 15%;\" width=\"70\" height= \"70\"/> \n        <md-icon ng-if= \"vm.product.ProductInfo.ImageBuffer == \'\'\" md-font-icon=\"fa fa-camera-retro font-size-4 opacity-50\"></md-icon> \n    </div>\n    <div class=\"text-light\">\n        <h3 class=\"font-weight-600 margin-bottom-0 text-light\"><md-icon ng-if=\"vm.product.TestStatus == \'Complete\'\" md-font-icon=\"fa fa-check\" style=\"color: rgb(0, 143, 0);\"></md-icon >{{ vm.product.ProductInfo.References }}</h3>\n        <p class=\"font-weight-400 margin-top-0 margin-bottom-0\">id: {{ vm.product._id }} </p>\n        <p class=\"font-weight-400 margin-top-0 margin-bottom-0\">Product version:  {{ vm.product.ProductInfo.Version }}</p>\n        <p class=\"font-weight-400 margin-top-0 margin-bottom-0\">Created by :  {{ vm.product.ProductInfo.CreatedBy }}</p>\n        <p class=\"font-weight-300 margin-top-0 margin-bottom-0\">Created at :  {{ vm.product.createdAt }}</p>\n    </div>\n</div>\n\n<md-subheader ng-if= \"vm.UpdatesCount == 0\" palette-background=\"light-green:400\" style=\'zoom: 0.2\'></md-subheader>\n<md-subheader ng-if= \"vm.UpdatesCount != 0\" palette-background=\"deep-orange:400\" style=\'zoom: 0.2\'></md-subheader>\n<md-tabs md-dynamic-height md-border-bottom class=\"tabs-tall\">\n\n        <md-tab>\n            <md-tab-label layout=\"column\">\n                <span>History</span>\n            </md-tab-label>\n            <md-tab-body>\n                \n                <div class=\"overlay-5 padded-content-page\" animate-elements>\n                    <div class=\"timeline\" layout=\"row\" ng-repeat=\"event in vm.events\" ng-attr-layout-align=\"{{$odd? \'end end\':\'start start\'}}\">\n                        <div layout=\"row\" flex=\"50\" flex-xs=\"100\" ng-attr-layout-align=\"{{$odd? \'end\':\'start\'}} center\">\n                            <div class=\"timeline-point md-whiteframe-z1\" theme-background=\"primary\" md-theme=\"{{triSkin.elements.content}}\">\n                                <img ng-src=\"{{::event.image}}\" class=\"timeline-point-avatar\"/>\n                                <span class=\"timeline-point-date\">{{::event.date}}</span>\n                            </div>\n                            <md-divider class=\"timeline-x-axis\" class=\"margin-0\" flex flex-order=\"2\"></md-divider>\n                            <tri-widget class=\"timeline-widget margin-0 flex-70 flex-xs-100 {{::event.classes}}\" title=\"{{::event.title}}\" subtitle=\"{{::event.subtitle}}\" title-position=\"bottom\" ng-attr-flex-order=\"{{$odd? 2:1}}\" palette-background=\"{{::event.palette}}\" >\n                                <div replace-with=\'{{event.content}}\'></div>\n                            </tri-widget>\n                            <md-divider class=\"timeline-y-axis\"></md-divider>\n                        </div>\n                    </div>\n                </div>\n\n            </md-tab-body>\n        </md-tab>\n    \n    <md-tab>\n        <md-tab-label layout=\"column\">\n            <span>Details</span>\n        </md-tab-label>\n        <md-tab-body>\n                            <md-subheader class=\"md-no-sticky\" translate>Applied Standards</md-subheader>\n                            <md-list-item class=\"md-3-line\" ng-repeat=\"(key, value) in vm.product.ProductJSON.Standards\">\n                                <div class=\"md-list-item-text\">\n\n                                    <md-subheader ng-click=\"value.selected = !value.selected\" layout=\"row\" layout-align=\"start end\" palette-background=\"{{ vm.getStandardColor(value) }}\" >   \n                                        <h3 palette-background=\"{{ vm.getStandardColor(value) }}\" >    \n                                            <md-tooltip ng-if=\"value.Updates.length != 0\"> if/hide updates </md-tooltip> {{key}}\n                                            <p class=\"font-weight-300 margin-top-0 margin-bottom-0\" ng-if=\"value.Updates.length == 0\"> Last Version</p>\n                                        </h3>\n                                        <div ng-if=\"value.selected == true\" layout=\"column\" layout-align=\"start start\"> \n\n                                            <p class=\"font-weight-300 margin-top-0 margin-bottom-0\" ng-repeat=\"update in value.Updates\"> \n                                                <img src=\"assets/images/laboratory/standard-avatar.png\" alt=\"product-avatar\" width=\"15\"/> {{update.Name}}\n                                            </p>\n                                        </div>\n                                    </md-subheader>\n                                           <md-list>\n\n                                              <tri-table ng-if=\"value.selected == true\" class=\"elements-image-table-example\" columns=\"::vm.columns\" contents=\"::value.Designations\" page-size=\"200\"></tri-table>\n\n                                              <md-divider ></md-divider>\n                                          </md-list>\n                                </div>\n                            </md-list-item>\n                            <md-divider ></md-divider>\n                        </md-list>\n\n                            <md-subheader class=\"md-no-sticky\" translate>Applied Directives</md-subheader>\n                            <md-subheader layout=\"row\" layout-align=\"start end\" palette-background=\"amber:300\" ng-repeat=\"directive in vm.product.directives\">   \n                                 {{directive.Infos.Reference}} -  {{directive.Infos.Title}} -  {{directive.Infos.Date}}\n                            </md-subheader>\n                            <md-subheader palette-background=\"red:300\" ng-if=\'vm.product.directives.length == 0\'>   \n                                           NO DIRECTIVE APPLIED\n                            </md-subheader>\n                            <md-divider ></md-divider>\n                        </md-list>\n\n        </md-tab-body>\n    </md-tab>\n\n    <md-tab  class=\"padded-content-page\">\n\n        <md-tab-label layout=\"column\">\n            <span>Standards & Directives Update</span>\n        </md-tab-label>\n        <md-tab-body>\n\n    <tri-widget palette-background=\"amber:500\" content-layout=\"column\" content-layout-align=\"space-between\">\n\n            <h2 class=\"md-display-1\"> <md-icon md-font-icon=\"fa fa-cloud-upload\"> Upgrade Product</md-icon></h2>\n            <tri-widget palette-background=\"teal:200\" content-layout=\"column\" content-layout-align=\"space-between\">\n                     <div class=\"padded-content-page\" ng-if= \"vm.UpdatesCount != 0\">\n                                <md-whiteframe layout=\"column\" layout-align=\"start start\" palette-background=\"{{ vm.getStandardColor(value) }}\" \n                                               ng-repeat=\"(key , value) in vm.product.ProductJSON.Standards\" ng-if= \"value.Updates.length != 0\" class=\"md-whiteframe-z1 margin-20\">\n                                \n                                                            {{key | stdName}} \n\n                                        <p  class=\"font-weight-300 margin-top-0 margin-bottom-0\"> upgrade to: {{value.Upgradeto}}</p>\n                                        <md-select placeholder=\"Upgrade Standard to: \" ng-model=\"value.Upgradeto\">\n                                                <md-option ng-repeat=\"update in value.Updates\" value=\"{{update._id}}\">{{update.Name | stdName}}</md-option> \n                                        </md-select>\n                                </md-whiteframe>\n                    </div>\n\n                     <div class=\"padded-content-page\" ng-if= \"vm.UpdatesCount == 0\">\n                        <md-subheader class=\"md-whiteframe-z3 margin-20 text-center\" palette-background=\"light-green:400\" >   \n                             <center> <h1 class=\"md-display-1\"> <md-icon md-font-icon=\"fa fa-check-circle\"> {{ vm.product.ProductInfo.References }} is up to date.</md-icon> </h1> </center>\n                       </md-subheader>\n                    </div> \n                    <div layout=\"column\" layout-align=\"center center\">\n                            <md-button ng-if=\'vm.product.ProductInfo.LockedBy._id != \"\"\'><md-icon md-font-icon=\"fa fa-lock\"></md-icon> {{vm.product.ProductInfo.LockedBy.username}} </md-button>  \n                            <md-button permission permission-only=\"[\'ADMIN\', \'SUPERADMIN\']\" ng-if=\'vm.product.ProductInfo.LockedBy._id == \"\" && vm.UpdatesCount != 0\' class=\"md-primary md-raised\" md-ripple-size=\"full\" aria-label=\"ripple full\" ng-click= \'vm.UpdateProductStd(vm.product)\'> UPDATE </md-button>  \n                    </div>\n            </tri-widget>\n\n                 <h4> \n                    <md-icon md-font-icon=\"fa fa-plus-circle\"></md-icon>\n                    <img src=\"assets/images/laboratory/standard-avatar.png\" alt=\"product-avatar\" width=\"20\"/> Add a Standard to product\n                 </h4>\n\n                 <tri-widget palette-background=\"teal:300\" content-layout=\"column\" content-layout-align=\"space-between\">\n                        <div class=\"padded-content-page\" >\n                                 <md-select placeholder=\"Select a Standard\" ng-model=\"StdToAdd\">\n                                            <md-option ng-repeat=\"std in vm.AllStandards\" value=\"{{std}}\"> {{std.Infos.Name | stdName}}</md-option> \n                                 </md-select>\n                        </div>\n\n                    <div layout=\"column\" layout-align=\"center center\">\n                            <md-button permission permission-only=\"[\'ADMIN\', \'SUPERADMIN\']\" ng-if=\'vm.product.ProductInfo.LockedBy._id == \"\"\' class=\"md-primary md-raised\" md-ripple-size=\"full\" aria-label=\"ripple full\" ng-click= \'vm.AddStd(StdToAdd)\'> Add </md-button>\n                            <md-button ng-if=\'vm.product.ProductInfo.LockedBy._id != \"\"\'><md-icon md-font-icon=\"fa fa-lock\"></md-icon> {{vm.product.ProductInfo.LockedBy.username}} </md-button> \n                    </div>\n                 </tri-widget>\n\n                 <h4>  \n                     <md-icon md-font-icon=\"fa fa-minus-circle\"></md-icon> <img src=\"assets/images/laboratory/standard-avatar.png\" alt=\"product-avatar\" width=\"20\"/> Delete Standard From Product\n                 </h4>\n                 <tri-widget palette-background=\"teal:500\" content-layout=\"column\" content-layout-align=\"space-between\">\n                        <div class=\"padded-content-page\" >\n                                 <md-select placeholder=\"Select a Standard\" ng-model=\"StdToDelete\">\n                                            <md-option ng-repeat=\"(key , value) in vm.product.ProductJSON.Standards\" value=\"{{key}}\"> {{key | stdName}}</md-option> \n                                 </md-select>\n                        </div>\n\n                    <div layout=\"column\" layout-align=\"center center\">\n                            <md-button permission permission-only=\"[\'ADMIN\', \'SUPERADMIN\']\"  ng-if=\'vm.product.ProductInfo.LockedBy._id == \"\"\' class=\"md-primary md-raised\" md-ripple-size=\"full\" aria-label=\"ripple full\" ng-click= \'vm.deleteStd(StdToDelete)\'> Delete </md-button>\n                            <md-button ng-if=\'vm.product.ProductInfo.LockedBy._id != \"\"\'><md-icon md-font-icon=\"fa fa-lock\"></md-icon> {{vm.product.ProductInfo.LockedBy.username}} </md-button> \n                    </div>\n                 </tri-widget>\n\n                 <h2 class=\"md-display-1\"> <md-icon md-font-icon=\"fa fa-plus-circle\"> <md-icon md-font-icon=\"fa fa-recycle\"></md-icon>Add Directive to Product</md-icon></h2>\n                 <tri-widget palette-background=\"teal:600\" content-layout=\"column\" content-layout-align=\"space-between\">\n                        <md-button ng-if=\'vm.product.ProductInfo.LockedBy._id != \"\"\'><md-icon md-font-icon=\"fa fa-lock\"></md-icon> {{vm.product.ProductInfo.LockedBy.username}} </md-button> \n                        <div ng-if=\'vm.product.ProductInfo.LockedBy._id == \"\"\' ng-repeat=\"directive in vm.directives\" layout=\"row\" >\n                            <div layout=\"row\">\n                                <md-icon md-font-icon=\"fa fa-plus-circle\" class=\"md-primary md-raised\" permission permission-only=\"[\'ADMIN\', \'SUPERADMIN\']\" ng-click=\'vm.addDirective(directive)\'> <md-tooltip>Add</md-tooltip> </md-icon>\n                                 <p> {{directive.Infos.Reference}}: {{::directive.Infos.Title}} >  {{::directive.Infos.Date}}</p> \n                            </div>\n                        </div>\n                 </tri-widget>\n\n                 <h2 class=\"md-display-1\"> <md-icon md-font-icon=\"fa fa-minus-circle\"> <md-icon md-font-icon=\"fa fa-recycle\"></md-icon>Delete Directive from Product</md-icon></h2>\n                  <tri-widget palette-background=\"teal:600\" content-layout=\"column\" content-layout-align=\"space-between\">\n \n                        <md-button ng-if=\'vm.product.ProductInfo.LockedBy._id != \"\"\'><md-icon md-font-icon=\"fa fa-lock\"></md-icon> {{vm.product.ProductInfo.LockedBy.username}} </md-button> \n                        <div ng-if=\'vm.product.ProductInfo.LockedBy._id == \"\"\' ng-repeat=\"directive in vm.product.directives\" layout=\"row\" >\n                            <div layout=\"row\">\n                                <md-icon md-font-icon=\"fa fa-minus-circle\" class=\"md-primary md-warn\" permission permission-only=\"[\'ADMIN\', \'SUPERADMIN\']\" ng-click=\'vm.deleteDirective(directive)\'> <md-tooltip>delete</md-tooltip> </md-icon>\n                                 <p> {{directive.Infos.Reference}}: {{::directive.Infos.Title}} >  {{::directive.Infos.Date}}</p> \n                            </div>\n                        </div>\n                 </tri-widget>\n\n      </tri-widget>  \n\n      </md-tab-body>\n    </md-tab>\n\n        <md-tab>\n            <md-tab-label layout=\"column\">\n                <span>Duplicate</span>\n            </md-tab-label>\n            <md-tab-body >\n\n                <h2>Duplicates Infos</h2>\n                    <img ng-src=\"{{vm.ProductInfo.ImageBuffer}}\" id=\"productImage\" class=\"make-round\" style=\"border-radius: 15%;\" width=\"70\" height= \"70\"/>\n\n                    <md-icon ng-show= \"vm.ProductInfo.ImageBuffer == \'\'\" md-font-icon=\"fa fa-camera-retro font-size-4 opacity-50\"></md-icon>  \n                    <md-input-container class=\"md-block\">\n                        <label>Brand  </label>\n                        <input type=\"text\" ng-value =\'vm.product.ProductInfo.Brand\' ng-model=\"vm.ProductInfo.Brand\" >\n                    </md-input-container>\n                    <md-input-container class=\"md-block\">\n                        <label>Technical Folder </label>\n                        <input type=\"text\" ng-value = \'vm.product.ProductInfo.TechnicalFolder\' ng-model=\"vm.ProductInfo.TechnicalFolder\" ng-disabled=\"true\">\n                    </md-input-container>\n                    <md-input-container class=\"md-block\">\n                        <label>References </label>\n                        <input type=\"text\" ng-value = \'vm.product.ProductInfo.References\' ng-model=\"vm.ProductInfo.References\" >\n                    </md-input-container>\n                    <md-input-container class=\"md-block\">\n                        <label>Risk Analysis: MD xx xx xx</label>\n                        <input type=\"text\" ng-value = \'vm.product.ProductInfo.RiskAnalysis\' ng-model=\"vm.ProductInfo.RiskAnalysis\" >\n                    </md-input-container>\n                    <md-input-container class=\"md-block\">\n                        <label>Product Designation</label>\n                        <input type=\"text\" ng-value = \'vm.product.ProductInfo.Designation\' ng-model=\"vm.ProductInfo.Designation\" >\n                    </md-input-container>\n                    <md-input-container class=\"md-block\">\n                        <label>Links Project</label>\n                        <input type=\"text\" ng-value = \'vm.product.ProductInfo.Links\' ng-model=\"vm.ProductInfo.Links\" >\n                    </md-input-container>\n                   <div layout=\"row\" layout-align=\"space-around center\">\n                         <input class=\"ng-hide\" id=\"input-image-id\" multiple type=\"file\" accept=\"image/jpeg,image/png\" onchange=\"angular.element(this).scope().TreatImage(this)\"/>  \n                         <label for=\"input-image-id\" class=\"md-button md-raised md-primary\">Upload New Image</label>\n                   </div>\n                    <md-input-container>\n                        <label>Duplicate Created by:  </label>\n                        <input type=\"text\" ng-model=\"vm.ProductInfo.CreatedBy\" ng-disabled=\"true\">\n                    </md-input-container> \n                \n         <md-button permission permission-only=\"[\'ADMIN\', \'SUPERADMIN\']\" class=\"md-primary md-raised\" md-ripple-size=\"full\" aria-label=\"ripple full\" ng-click= \'vm.DuplicateProduct()\'> Duplicate </md-button>  \n            </md-tab-body>\n        </md-tab>\n\n    <md-tab> \n    </md-tab>\n</md-tabs>\n</md-dialog>\n");
$templateCache.put("app/laboratory/products/products.tmpl.html","<md-toolbar permission=\"\" permission-only=\"\'CanSeeWarning\'\" class=\"md-warn toolbar-default margin-bottom-0\">\n    <div class=\"md-toolbar-tools\">\n        <h2>\n            <md-icon md-font-icon=\"fa fa-warning\"><span> You\'re connected as guest. Please <a class=\"pointille\" ng-click=\"vm.Gologin()\">Connect</a> to have the full access.</span></md-icon>\n        </h2>\n    </div>\n</md-toolbar>\n\n \n<div class=\"padded-content-page\">\n \n    <div layout=\"row\" flex content-layout-align=\"space-between\">\n        <div>\n            <md-switch ng-model=\"ViewArchive\" aria-label=\"Default Switch\" ng-init=\"ViewArchive = false\"> </md-switch>\n            <md-tooltip ng-if=\"ViewArchive == false\">Show Archives</md-tooltip>\n            <md-tooltip ng-if=\"ViewArchive == true\">Hide Archives</md-tooltip>\n        </div>\n        <h2 class=\"md-display-1\" translate style=\'color: white;\'>Products List</h2>\n\n    </div>\n\n    <div layout=\"row\" flex>\n        <md-input-container>\n            <label translate style=\'color: white;\'>Search Reference</label>\n                  <input type=\"text\" ng-model=\"searchProduct\">\n        </md-input-container>\n        <md-input-container>\n            <label translate style=\'color: white;\'>Search Technical Folder</label>\n                  <input type=\"text\" ng-model=\"searchTF\">\n        </md-input-container>\n    </div>\n        <md-progress-linear ng-show=\"vm.showProgress\" class=\"md-warn margin-bottom-20\" md-mode=\"indeterminate\"></md-progress-linear>\n                    <md-card ng-if= \"product.ProductInfo.hasAnUpdate == \'0\' || ViewArchive == true\" style=\"width: 100%; height: 90px;\" layout-align=\"start start\" layout=\"column\" flex ng-repeat=\"product in vm.products | filter :{ ProductInfo: { References : searchProduct  } } | filter :{ ProductInfo: { TechnicalFolder : searchTF  } }\" palette-background=\"{{ vm.getProductColor(product) }}\" layout-wrap>\n                        \n                        <md-card-title style=\"padding: 5px;\">\n                            <div layout=\"row\" flex>\n\n                                <div layout=\"column\" flex>\n                                        <img ng-click=\"vm.GenerateDashboard(product)\" ng-src=\"{{product.ProductInfo.ImageBuffer}}\" id=\"productImage\" style=\"border-radius: 15%;\" width=\"70\" height= \"80\"/>\n                                        <md-icon ng-show= \"product.ProductInfo.ImageBuffer == \'\'\" md-font-icon=\"fa fa-camera-retro font-size-4 opacity-50\"></md-icon>\n                                </div>\n                                <div>\n                                     <div layout=\"row\" ng-click=\"vm.GenerateDashboard(product)\" flex>\n                                        <md-button class=\"md-headline\" style=\"zoom: 60%;\" >\n                                           {{product.ProductInfo.TechnicalFolder}} \n                                        </md-button> \n                                        <md-button style=\"zoom: 60%;\" >\n                                            <md-icon ng-show = \'product.TestStatus == \"Complete\"\'md-font-icon=\"fa fa-check\" style=\"color: rgb(0, 143, 0);\"></md-icon >\n                                            <md-icon ng-show = \'product.TestStatus == \"CompleteF\"\'md-font-icon=\"fa fa-check\" style=\"color: rgb(247, 15, 15);\"></md-icon > \n                                            <md-icon md-font-icon=\"fa fa-bookmark-o\" ng-if =\'product.ProductInfo.References.length > 10\'> {{product.ProductInfo.References | limitTo : 10}}...</md-icon> \n                                            <md-tooltip ng-if =\'product.ProductInfo.References.length > 10\'>{{product.ProductInfo.References}}</md-tooltip>\n                                            <md-icon md-font-icon=\"fa fa-bookmark-o\" ng-if =\'product.ProductInfo.References.length <= 10\'> {{product.ProductInfo.References}}</md-icon> \n                                        </md-button> \n                                         <md-button class=\"md-headline\" style=\"zoom: 60%;\">\n                                           {{product.ProductInfo.Brand}} \n                                         </md-button> \n                                    </div>\n                                     <div layout=\"row\" ng-click=\"vm.GenerateDashboard(product)\" flex>\n                                        <md-button class=\"md-subhead\" style=\"zoom: 60%;\" translate><md-icon md-font-icon=\"fa fa-star\"></md-icon>{{product.ProductInfo.CreatedBy}}</md-button>\n                                        <md-button class=\"md-subhead\" style=\"zoom: 60%;\" translate><md-icon md-font-icon=\"fa fa-edit\"></md-icon>{{product.ProductInfo.LastModifBy}}</md-button>\n                                        <md-button class=\"md-subhead\" style=\"zoom: 60%;\">V : {{product.ProductInfo.Version}}</md-button>   \n                                     </div>\n                                     <div layout=\"row\" flex>\n                                        <md-icon md-font-icon=\"fa fa-trash-o\" permission=\"\" permission-only=\"\'viewDeleteProducts\'\" ng-if=\'product.ProductInfo.LockedBy._id == \"\"\' class=\"md-warn md-raised\" ng-click=\"vm.deleteProduct($event, product)\"> <md-tooltip>Delete</md-tooltip> </md-icon> \n                                        <md-icon md-font-icon=\"zmdi zmdi-edit\" ng-click=\"vm.selectProduct($event, product)\"><md-tooltip>Details</md-tooltip> </md-icon>\n                                        <md-icon  class=\"md-warn md-raised\" md-font-icon=\"fa fa-lock\" ng-if=\'product.ProductInfo.LockedBy._id != \"\"\' > {{product.ProductInfo.LockedBy.username}} <md-tooltip>Locked By</md-tooltip></md-icon> \n                                        <md-icon class=\"md-caption\" md-font-icon=\"fa fa-unlock\" ng-if=\'product.ProductInfo.LockedBy._id == \"\"\'><md-tooltip>Unlocked</md-tooltip></md-icon> \n                                      </div>\n                                </div>\n                                <md-tooltip>Last Update: {{product.LastUpdate}}</md-tooltip> \n                        </md-card-title>\n\n                        </div>\n\n\n                    </md-card>\n</div>\n\n");
$templateCache.put("app/laboratory/standards/standard.dialog.template.html","<md-toolbar permission=\"\" permission-only=\"\'CanSeeWarning\'\" class=\"md-warn toolbar-default margin-bottom-0\">\n    <div class=\"md-toolbar-tools\">\n        <h2>\n            <md-icon md-font-icon=\"fa fa-warning\"><span> You\'re connected as guest. Please <a class=\"pointille\" ng-click=\"vm.Gologin()\">Connect</a> to have the full access.</span></md-icon>\n        </h2>\n    </div>\n</md-toolbar>\n<div class=\"laboratory-dashboard\">\n    <div class=\"dashboard-social-header padding-50 padding-top-20 overlay-gradient-30\" layout=\"row\" layout-align=\"start center\" style=\"background: url(assets/images/backgrounds/material-backgrounds/mb-bg-08.jpg) no-repeat; background-size: cover;\">\n        <md-icon md-font-icon=\"fa fa-arrow-circle-left font-size-10 opacity-50\" ng-click=\"vm.backtostandards()\"></md-icon> \n\n        <div class=\"margin-right-20\">\n        <img src=\"assets/images/laboratory/standard-avatar.png\" alt=\"product-avatar\" width=\"100\"/>\n        </div>\n        <div class=\"text-light\">\n            <span ng-if=\"standard.Infos.HasUpdate == 0\" class=\"md-subhead\">Latest version.</span>\n            <h3 class=\"font-weight-600 margin-bottom-0 text-light\">{{ vm.standard.Infos.Name }}</h3>\n            <p class=\"font-weight-400 margin-top-0 margin-bottom-0\">id: {{ vm.standard._id }} </p>\n            <p class=\"font-weight-400 margin-top-0 margin-bottom-0\">Product version:  {{ vm.standard.Infos.Version }}</p>\n            <p class=\"font-weight-300 margin-top-0 margin-bottom-0\">Created at :  {{ vm.standard.createdAt }}</p>\n            <div layout=\"row\" layout-align=\"start center\">\n                Related Products:  \n                 <h4 ng-if=\"vm.rel_products.length == 0\"> # No related Products.</h4>\n                <h4 ng-repeat=\"product in vm.rel_products\" ng-click=\"vm.selectProduct($event, product)\"> \n                    \" #{{product.ProductInfo.References}} \" <md-tooltip>id: {{product._id}} </md-tooltip></h4> \n            </div>\n        </div>\n    </div>\n\n<md-subheader ng-show=\" vm.standard.Infos.HasUpdate != 0 \" palette-background=\"deep-orange:500\"  style=\'zoom: 0.2\'></md-subheader>\n<md-subheader ng-show=\" vm.standard.Infos.HasUpdate == 0 \" palette-background=\"light-green:400\"  style=\'zoom: 0.2\'></md-subheader>\n    <md-tabs md-dynamic-height md-border-bottom class=\"tabs-tall\">\n        <md-tab>\n            <md-tab-label layout=\"column\" >\n                <span>History</span>\n            </md-tab-label>\n            <md-tab-body>\n                \n                <div class=\"overlay-5 padded-content-page\" animate-elements>\n                    <div class=\"timeline\" layout=\"row\" ng-repeat=\"event in vm.events\" ng-attr-layout-align=\"{{$odd? \'end end\':\'start start\'}}\">\n                        <div layout=\"row\" flex=\"50\" flex-xs=\"100\" ng-attr-layout-align=\"{{$odd? \'end\':\'start\'}} center\">\n                            <div class=\"timeline-point md-whiteframe-z1\" theme-background=\"primary\" md-theme=\"{{triSkin.elements.content}}\">\n                                <img ng-src=\"{{::event.image}}\" class=\"timeline-point-avatar\"/>\n                                <span class=\"timeline-point-date\">{{::event.date}}</span>\n                            </div>\n                            <md-divider class=\"timeline-x-axis\" class=\"margin-0\" flex flex-order=\"2\"></md-divider>\n                            <tri-widget class=\"timeline-widget margin-0 flex-70 flex-xs-100 {{::event.classes}}\" title=\"{{::event.title}}\" subtitle=\"{{::event.subtitle}}\" title-position=\"bottom\" ng-attr-flex-order=\"{{$odd? 2:1}}\" palette-background=\"{{::event.palette}}\" >\n                                <div replace-with=\'{{event.content}}\'></div>\n                            </tri-widget>\n                            <md-divider class=\"timeline-y-axis\"></md-divider>\n                        </div>\n                    </div>\n                </div>\n\n            </md-tab-body>\n        </md-tab>\n\n        <md-tab>\n            <md-tab-label layout=\"column\" >\n                <span>Details</span>\n            </md-tab-label>\n            <md-tab-body>\n\n            <center>\n                    <md-icon md-font-icon=\"fa fa-gear\" class=\"md-accent\" ng-click=\'Modify = !Modify\'><md-tooltip>Edit info</md-tooltip></md-icon>   \n                    <md-button permission=\"\" permission-only=\"\'viewUpdateStd\'\" class=\"md-accent md-raised\" md-ripple-size=\"full\" aria-label=\"ripple full\" ng-click= \'vm.UpdateStandardContent()\' >UPDATE Content</md-button>\n            </center> \n\n    	  <md-subheader class=\"md-no-sticky\">Chapters </md-subheader>\n             \n                <div ng-if=\'Modify == true\' ng-repeat=\'item in ::vm.standard.Designations\'>\n                    <div layout=\"row\" flex>\n \n                        <md-input-container class=\"md-block\" >\n                          <label>  Chapter </label>\n                          <input type=\"text\" value = \'item.Chapters\' ng-model = \"item.Chapters\"> \n                        </md-input-container>\n                        <md-input-container class=\"md-block\" >\n                          <label>  Title </label>\n                          <input type=\"text\" value = \'item.DesignationTitle\' ng-model = \"item.DesignationTitle\"> \n                        </md-input-container>\n                        <md-input-container class=\"md-block\" >\n                          <label>  Category </label>\n                          <input type=\"text\" value = \'item.Category\' ng-model = \"item.Category\"> \n                        </md-input-container>\n                        <md-input-container class=\"md-block\" >\n                            <label>  SubCategory </label>\n                          <input type=\"text\" value = \'item.SubCategory\' ng-model = \"item.SubCategory\"> \n                        </md-input-container>\n                    </div>\n                </div>\n\n                 <p ng-if=\'Modify != true\' ng-repeat=\"item in ::vm.standard.Designations\" class=\"font-weight-{{vm.getMargin(item.Chapters)}}0 margin-left-{{vm.getMargin(item.Chapters)}} margin-top-0 margin-bottom-10\">\n                         {{::item.Chapters}} : {{::item.DesignationTitle}} - <span palette-background=\"cyan:200\"> {{::item.Category || \'empty\' }}  </span> - <span palette-background=\"cyan:400\">  {{::item.SubCategory || \'empty\'}} </span>\n                 </p>   \n\n            </md-tab-body>\n        </md-tab>\n\n        <md-tab  style=\"zoom: 0.8;\">\n            <md-tab-label layout=\"column\">\n                <span>Update</span>\n            </md-tab-label>\n            <md-tab-body >\n \n                <md-subheader class=\"md-whiteframe-z3 margin-20 text-center\" palette-background=\"triCyan:500\" ng-show = \"vm.standard.Infos.HasUpdate == 0\" >   \n\n                 <h2 class=\"center center\">Update the <b> Sdandard: {{ vm.standard.Infos.Name }} </b></h2>\n\n                 <div permission=\"\" permission-only=\"\'viewUpdateStd\'\" layout=\"row\" layout-align=\"space-around center\">\n                     <input class=\"ng-hide\" id=\"input-file-id\" multiple type=\"file\" onchange=\"angular.element(this).scope().UpdateStandard(this)\" />  \n                     <label for=\"input-file-id\" class=\"md-button md-raised md-primary\">Upload File</label>\n                </div>\n         \n                <div layout=\"row\" layout-align=\"space-around center\">\n                    <md-progress-circular class=\"md-accent\" ng-show =\"vm.status != \'idle\'\" md-mode=\"indeterminate\"></md-progress-circular>\n                </div>\n\n                <h1 class=\"ui-typography-heading-example md-body-2\"> <md-icon md-font-icon=\"zmdi zmdi-alert-circle-o\"></md-icon> Add only <b>Microsoft® Exel </b> Files.</h1>\n\n                <md-subheader class=\"md-whiteframe-z3 margin-20 text-center\" permission=\"\" permission-only=\"\'CanSeeWarning\'\" palette-background=\"deep-orange:400\" ng-show= \" vm.standard.Infos.HasUpdate != 0 \">   \n                        <h5> <md-icon md-font-icon=\"fa fa-warning\"><span> You are connected as guest. Please connect with an ADMIN account to have the possibility to update the standard.</span></md-icon> </h5>\n                </md-subheader>\n                \n                </md-subheader>\n\n                <md-subheader class=\"md-whiteframe-z3 margin-20 text-center\" palette-background=\"deep-orange:400\" ng-show=\" vm.standard.Infos.HasUpdate != 0 \">   \n                 <h2 class=\"center center\"> <md-icon md-font-icon=\"fa fa-warning\"> {{ vm.standard.Infos.Name }} already has an update.</b></md-icon></h2>\n                        <p class=\"font-weight-300 margin-top-0 margin-bottom-0\"> Update :  {{ vm.standard.Infos.HasUpdate }}</p>\n                </md-subheader>\n\n            </md-tab-body>\n         \n        </md-tab>\n\n        <md-tab>\n        </md-tab>\n\n    </md-tabs>\n</div>\n \n");
$templateCache.put("app/laboratory/standards/standards.tmpl.html","<md-toolbar permission=\"\" permission-only=\"\'CanSeeWarning\'\" class=\"md-warn toolbar-default margin-bottom-0\">\n    <div class=\"md-toolbar-tools\">\n        <h2>\n            <md-icon md-font-icon=\"fa fa-warning\"><span> You\'re connected as guest. Please <a class=\"pointille\" ng-click=\"vm.Gologin()\">Connect</a> to have the full access.</span></md-icon>\n        </h2>\n    </div>\n</md-toolbar>\n<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">Standards List</h2>\n\n    <div layout=\"column\" layout-align=\"center center\">\n        <md-button permission=\"\" permission-only=\"\'viewDeleteStd\'\" class=\"md-warn md-raised\" md-ripple-size=\"full\" aria-label=\"ripple full\" ng-click= \'vm.deleteAllStandards()\' >delete all</md-button>\n    </div>\n  <md-progress-linear ng-show=\"vm.showProgress\" class=\"md-warn margin-bottom-20\" md-mode=\"indeterminate\"></md-progress-linear>\n    <md-input-container>\n        <label>Search Standard</label>\n              <input type=\"text\" ng-model=\"searchStandards\">\n    </md-input-container>\n            <div layout=\"column\">\n                <div layout=\"column\" layout-wrap>\n                    <md-card layout-align=\"start start\" layout=\"column\" style=\"zoom: 60%;\" layout-align=\"space-around center\" ng-repeat=\"standard in vm.standards | filter : searchStandards : Name \" palette-background=\"{{ vm.getStandardColor(standard) }}\" >\n                        <md-card-title  ng-click=\"vm.selectStandard($event, standard)\">\n                            <md-card-title-media >\n                                <div class=\"md-media-md card-media\">\n                                    <img src=\"assets/images/laboratory/standard-avatar.png\" alt=\"Standard Image\" layout-align=\"right\">\n                                </div>\n                            </md-card-title-media>\n                            <md-card-title-text >\n                                <span class=\"md-headline\">{{standard.Infos.Name}}</span>\n                                <span class=\"md-subhead\">Version: {{standard.Infos.Version}}</span>\n                                <span ng-if=\"standard.Infos.HasUpdate != 0\" class=\"md-subhead\">Has an Update: {{standard.Infos.HasUpdate}}</span>\n                                <span ng-if=\"standard.Infos.HasUpdate == 0\" class=\"md-subhead\">Latest version.</span>\n                            </md-card-title-text> \n                        </md-card-title>\n                        <md-card-actions layout=\"row\" layout-align=\"end center\">\n                            <md-button  ng-click=\"vm.selectStandard($event, standard)\">Details</md-button>\n                            <md-button  permission=\"\" permission-only=\"\'viewDeleteStd\'\" ng-click=\"vm.deleteStandard($event, standard)\">Delete</md-button>\n                        </md-card-actions>\n                    </md-card>\n                </div>\n            </div>\n</div>\n\n");
$templateCache.put("app/layouts/footer/footer.tmpl.html","<div flex=\"noshrink\" layout=\"column\" layout-align=\"end none\">\n    <md-toolbar ng-controller=\"AppFooterController as footer\" md-theme=\"{{triSkin.elements.toolbar}}\">\n        <div class=\"md-toolbar-tools md-body-1\" layout=\"row\" layout-align=\"space-between center\">\n            <h2>{{footer.settings.name}}</h2>\n            <h2 hide-xs ng-bind-html=\"footer.settings.copyright\"></h2>\n            <h2>v{{footer.settings.version}}</h2>\n        </div>\n    </md-toolbar>\n</div>\n");
$templateCache.put("app/layouts/leftsidenav/leftsidenav.tmpl.html","<md-toolbar class=\"sidebar-left-toolbar\" md-theme=\"{{::triSkin.elements.logo}}\">\n    <div class=\"md-toolbar-tools\" layout=\"row\" layout-align=\"start center\">\n\n        <div class=\"sidebar-left-logo\">\n            <img ng-src=\"{{::vm.sidebarInfo.appLogo}}\" alt=\"{{::vm.sidebarInfo.appName}}\">\n        </div>\n\n        <h2 flex class=\"sidebar-left-title\">{{::vm.sidebarInfo.appName}}</h2>\n\n        <md-button class=\"md-icon-button sidebar-left-icon\" ng-click=\"vm.toggleIconMenu()\" aria-label=\"Open side menu\">\n            <md-icon md-font-icon ng-class=\"{ \'zmdi zmdi-chevron-right\' : vm.layout.sideMenuSize == \'icon\', \'zmdi zmdi-chevron-left\' : vm.layout.sideMenuSize == \'full\' }\"></md-icon>\n        </md-button>\n\n    </div>\n</md-toolbar>\n\n<tri-menu md-theme=\"{{triSkin.elements.sidebar}}\" flex layout=\"column\"></tri-menu>\n");
$templateCache.put("app/layouts/loader/loader.tmpl.html","<div class=\"app-loader\" flex layout=\"column\" layout-align=\"center center\">\n    <img src=\"{{loader.triSettings.logo}}\" alt=\"\">\n    <md-progress-linear class=\"padding-bottom-10\" md-mode=\"indeterminate\"></md-progress-linear>\n    <h2 class=\"padding-bottom-100\">{{loader.triSettings.name}}</h2>\n</div>\n");
$templateCache.put("app/layouts/rightsidenav/rightsidenav.tmpl.html","<md-content flex layout class=\"admin-notifications\">\n    <md-tabs flex md-stretch-tabs=\"always\" md-selected=\"vm.currentTab\">\n        <md-tab>\n            <md-tab-label>\n                <md-icon md-font-icon=\"fa fa-bell-o\">Notifications</md-icon>\n            </md-tab-label>\n            <md-tab-body>\n                <md-content>\n\n                     <md-list>\n                        <div ng-repeat=\"group in vm.notificationGroups\">\n                            <md-subheader class=\"md-primary\" palette-background=\"amber:400\">{{group.name}}</md-subheader>\n                            <md-list-item ng-repeat=\"notification in group.notifications | reverse\" layout=\"row\" layout-align=\"space-between center\">\n                                <md-icon md-font-icon=\"{{notification.icon}}\" ng-style=\"{ color: notification.iconColor }\"></md-icon>\n                                <p>{{notification.title}}</p> <md-tooltip>{{notification.title}} - by: {{notification.User}} </md-tooltip>\n                                <span class=\"md-caption\" am-time-ago=\"notification.date\"></span>\n                            </md-list-item>\n                        </div>\n                    </md-list>\n                </md-content>\n            </md-tab-body>\n        </md-tab>\n \n    </md-tabs>\n</md-content>\n");
$templateCache.put("app/layouts/toolbar/howto.tmpl.html"," <div class=\"padded-content-page\">\n\n	<center> <h2 class=\"md-display-1\"><md-icon md-font-icon=\"fa fa-list-alt\">Wiki How To </md-icon</h2> </center>\n	<h2 class=\"md-display-1\"> <md-icon md-font-icon=\"zmdi zmdi-view-module\"> Products </md-icon ></h2>\n		<md-subheader class=\"md-whiteframe-z3 margin-20\" palette-background=\"amber:500\" content-layout=\"column\" content-layout-align=\"space-between\">\n\n        <md-card layout-align=\"start start\" layout=\"column\" palette-background=\"light-green:400\" layout-wrap>\n                        <md-card-title>\n                                <img ng-src=\"assets/images/laboratory/product-avatar.jpg\" id=\"productImage\" style=\"border-radius: 15%;\" width=\"100\" height= \"100\"/> \n                            <md-card-title-text  class=\"padded-content-page\" layout=\"row\" layout-wrap> \n \n                              <md-button class=\"md-headline\" style=\"zoom: 120%;\">\n                                <md-icon md-font-icon=\"fa fa-check\" style=\"color: rgb(0, 143, 0);\"></md-icon >\n                                        Product Sample\n                               </md-button> \n                                <md-button class=\"md-subhead\" style=\"zoom: 80%;\" translate>Created By: Soufiane</md-button> \n                                <md-button class=\"md-subhead\" style=\"zoom: 80%;\" translate>Last Modif By : Seb</md-button>\n                                <md-button class=\"md-subhead\" style=\"zoom: 80%;\" >Version : 3</md-button> \n                                <md-button class=\"md-subhead\" style=\"zoom: 80%;\" translate>Update of :  45408540erf</md-button>\n                                <md-button style=\"zoom: 80%;\" translate><md-icon md-font-icon=\"fa fa-lock\"></md-icon> JONATHAN</md-button>         \n                            </md-card-title-text>\n                        </md-card-title>\n                        <md-grid-tile-footer  layout=\"row\" layout-align=\"end center\">\n                            <md-button ><h4 translate> Dashboard </h4></md-button>\n                            <md-button > <h4 translate> Details   </h4></md-button>\n                            <md-button > <h4 translate> Delete </h4></md-button>\n                        </md-grid-tile-footer>\n        </md-card>\n			<p>\n				1 - This is the card of a product. it can have many colors: \n					<md-button palette-background=\"light-green:400\" class=\"md-subhead\" style=\"zoom: 70%;\" translate>Green</md-button> \n					if the product have all his standards up to date, or  \n					<md-button palette-background=\"deep-orange:100\" class=\"md-subhead\" style=\"zoom: 70%;\" translate>shades</md-button> \n					<md-button palette-background=\"deep-orange:400\" class=\"md-subhead\" style=\"zoom: 70%;\" translate>of</md-button> \n					<md-button palette-background=\"deep-orange:900\" class=\"md-subhead\" style=\"zoom: 70%;\" translate>red</md-button> \n					depending on the normative state of the product. The <md-button palette-background=\"grey:300\" class=\"md-subhead\" style=\"zoom: 70%;\" translate>grey</md-button> color means that the product encounters some trouble with associated standards. <br> \n				2 - you can add a product in two different ways: a - by adding the PCA excell file in the PCA->Add menu. b - by choosing a list of standards in the Products -> Add Menu.<br> \n				3 - The <md-icon md-font-icon=\"fa fa-check\" style=\"color: rgb(0, 143, 0);\"></md-icon > means that the test of a product is complete. The <md-icon md-font-icon=\"fa fa-check\" style=\"color: rgb(247, 15, 15);\"></md-icon > means that the test of a product is complete, but it contains some failed tests. <br> \n				4 - The Info \'Created by\' refers to who created the product in first place. The \'Last Modif\': refers to the last person that modified the product. If a product is an update of another product, you can find the id of the original product in the case: \'Update of\'.  <br> \n                5 - The <md-icon md-font-icon=\"fa fa-lock\"></md-icon> show that the product is actualy used by a certain user. It will be unlocked <md-icon md-font-icon=\"fa fa-unlock\"></md-icon> when the user quits the product\'s dashboard. If the user is disconnected without closing the project, the product will be unlocked in 15 minutes. If the user does not use the dashboard in 10 minutes, the project will be saved, and the product will be unlocked.<br> \n				6 - In <md-button palette-background=\"cyan:A200\" style=\"zoom: 70%;\">Details </md-button> button you can vizualise product history, see the overview of the produt. You can update, remove the standards of a product, and even add a new standards from the database. <br> \n				7 - In the <md-button palette-background=\"cyan:A200\" style=\"zoom: 70%;\">Dashboard </md-button> you can find the testing workspace of the product,you can vizualize the state of the project, and download the reports and technical folder. <br>\n				8 - If you\'re a SUPERADMIN user you can see the  <md-button palette-background=\"cyan:A200\" style=\"zoom: 70%;\">Delete </md-button> button,where you can delete the product. <br> \n \n      		<md-switch ng-model=\"test\" aria-label=\"Default Switch\">9 - In Products page, you can switch the button to vizualize the archives. </md-switch>  <br> \n      	</p>\n        </md-subheader>\n\n\n\n	<h2 class=\"md-display-1\"> <md-icon md-font-icon=\"zmdi zmdi-widgets\"> Standards </md-icon > </b></h2>\n		<md-subheader class=\"md-whiteframe-z3 margin-20\" palette-background=\"amber:500\" content-layout=\"column\" content-layout-align=\"space-between\">\n\n                 <md-card layout-align=\"start start\" layout=\"column\" layout-align=\"space-around center\" palette-background=\"deep-orange:500\" >\n                        <md-card-title>\n                            <md-card-title-media >\n                                <div class=\"md-media-md card-media\">\n                                    <img src=\"assets/images/laboratory/standard-avatar.png\" alt=\"Standard Image\" layout-align=\"right\">\n                                </div>\n                            </md-card-title-media>\n                            <md-card-title-text >\n                                <span class=\"md-headline\">Standard requirements (EN 62321:2009-04)</span>\n                                <span class=\"md-subhead\">Version: 1 </span>\n                                <span class=\"md-subhead\">Has an Update: 5bc7299abfd2653aad159ab9 : Standard requirements (EN 60669-2-5:2018-09)</span>\n                                or <span class=\"md-subhead\">Latest version.</span>\n                            </md-card-title-text> \n                        </md-card-title>\n                        <md-card-actions layout=\"row\" layout-align=\"end center\">\n                            <md-button>Details</md-button>\n                            <md-button>Delete</md-button>\n                        </md-card-actions>\n                  </md-card>   \n\n            <p>\n                1 - This is the card of a standard. it can have two colors: \n                    <md-button palette-background=\"light-green:400\" class=\"md-subhead\" style=\"zoom: 70%;\" translate>Green</md-button> \n                    if it\'s the last version of a standard, or \n                    <md-button palette-background=\"deep-orange:400\" class=\"md-subhead\" style=\"zoom: 70%;\" translate>Red</md-button> \n                    if the standard has an update.<br> \n                3 - In <md-button palette-background=\"cyan:A200\" style=\"zoom: 70%;\"> Details</md-button> button you can vizualise standard details and history, the difference between each evolution of the standard.  <br> \n                4 - You can update a standard by adding an excell PCA file, containing a <b> single </b> Standard. The link between standards and products will be done automatically.<br> \n                5 - In the details you can find the list of related products, you can click to visualize the details. <br> \n                6 - If you\'re a SUPERADMIN user you can see the <md-button palette-background=\"cyan:A200\"style=\"zoom: 70%;\"> Delete </md-button> button,where you can delete the standard. <br> \n                7 - <md-icon md-font-icon=\"fa fa-warning\"></md-icon> You have to fill the database with the standards before adding any product. \n            </p>\n        </md-subheader>\n\n	<h2 class=\"md-display-1\"> <md-icon md-font-icon=\"zmdi zmdi-view-dashboard\"> Dashboard </md-icon >  </b></h2>\n		<md-subheader class=\"md-whiteframe-z3 margin-20\" palette-background=\"amber:500\" content-layout=\"column\" content-layout-align=\"space-between\">\n			<p> 1 - This is the principal workspace where you can: test the product, upload / delete reports, generate Technical folder.</p>\n	         <tri-widget class=\"md-whiteframe-z3 margin-20\" palette-background=\"deep-orange:500\" content-layout=\"column\" content-layout-align=\"space-between\">\n	           <center>\n	            <h1 class=\"font-weight-600 margin-bottom-0 text-light\"><md-icon md-font-icon=\"fa fa-check\" style=\"color: rgb(0, 255, 0); zoom: 1.5;\"></md-icon >Product Sample</h1>\n	          </center>\n	           <div layout=\"row\" layout-align=\"space-between center\" class=\"padding-normal\">\n	               <i class=\"fa fa-arrow-circle-left font-size-4 opacity-50\"><md-tooltip>Back</md-tooltip></i>\n	               <md-icon md-font-icon=\"fa fa-save font-size-4 opacity-50\"><md-tooltip>Save Project</md-tooltip></md-icon>\n	               <md-icon md-font-icon=\"fa fa-download font-size-4 opacity-50\"><md-tooltip>Generate Technical Folder</md-tooltip></md-icon>\n	               <div class=\"widget-buttons\">\n	                        <img ng-src=\"assets/images/laboratory/product-avatar.jpg\" id=\"productImage\" style=\"border-radius: 15%;\" width=\"70\"/> \n	               </div>  \n	           </div>\n	        </tri-widget>\n\n            <p>\n                2 - You can upload a report by clicking on the button. \n                <label style = \'zoom: 70%;\' palette-background=\"amber:400\" for=\"input-file-{{designation}}\" class=\"md-button md-raised md-primary\"> <md-icon md-font-icon=\"zmdi zmdi-upload\"></md-icon> Add Report  </label>.<br>   \n                3 - Two views are available in the Dashboard: Standard View / Category View. you can switch between them by clicking on the chevrons \n                <md-icon md-font-icon=\"zmdi zmdi-chevron-left\"></md-icon> <md-icon md-font-icon=\"zmdi zmdi-chevron-right\"></md-icon>.<br> \n\n                4 - The standard/category contains two information: x % meaning that the standard / category test is completed at x%. If the color is <md-button palette-background=\"light-green:A200\"> Green </md-button> so there is no Failed tests. If the color is <md-button palette-background=\"deep-orange:A200\"> Red</md-button> so the Standard / Category contains Failed tests. <br> \n            </p>\n\n            <tri-widget palette-background=\"blue-grey:300\" content-layout=\"column\" content-layout-align=\"space-between\">\n                    <div layout=\"row\" layout-align=\"space-between center\" class=\"padding-normal\">\n                    <i class=\"fa fa-edit font-size-3 opacity-50\"></i> \n                    <h3 flex hide-xs class=\"md-subhead\" translate>Edit Product</h3>\n                    <div class=\"widget-buttons\">\n                        <i ng-if = \'viewCategory == true\'>Category View</i>  \n                        <i ng-if = \'viewCategory != true\'>Standards View</i>\n                        <md-button class=\"md-icon-button\" aria-label=\"save product\">\n                                <md-icon md-font-icon=\"fa fa-save font-size-2 opacity-50\"></md-icon>\n                                <md-tooltip>Save</md-tooltip>\n                        </md-button>\n                        <md-button class=\"md-icon-button\" ng-click=\"viewCategory = !viewCategory\" aria-label=\"previous view\">  \n                            <md-icon md-font-icon=\"zmdi zmdi-chevron-left\"><md-tooltip>Switch view</md-tooltip></md-icon>\n                        </md-button>\n                        <md-button class=\"md-icon-button\" ng-click=\"viewCategory = !viewCategory\" aria-label=\"next view\">\n                            <md-icon md-font-icon=\"zmdi zmdi-chevron-right\"><md-tooltip>Switch view</md-tooltip></md-icon>\n                        </md-button>\n                    </div>\n                  </div>\n                <md-divider></md-divider>\n	       		<md-subheader ng-if=\"viewCategory == true\" layout=\"row\" layout-align=\"space-between center\" palette-background=\"amber:400\" class=\"md-whiteframe-z3 margin-5 text-center\">\n                    Category 1\n                    <md-button palette-background=\"deep-orange:A200\"> 100 %</md-button> \n                </md-subheader>\n	       		<md-subheader ng-if=\"viewCategory == true\" layout=\"row\" layout-align=\"space-between center\" palette-background=\"amber:400\" class=\"md-whiteframe-z3 margin-5 text-center\">\n                    Category 2\n                    <md-button palette-background=\"light-green:400\"> 65 %</md-button> \n             </md-subheader>\n	       		<md-subheader ng-if=\"viewCategory != true\" layout=\"row\" layout-align=\"space-between center\" palette-background=\"light-green:400\" class=\"md-whiteframe-z3 margin-5 text-center\"> \n                Standard \n                <md-button palette-background=\"deep-orange:A200\"> 80 %</md-button> \n            </md-subheader>\n            </tri-widget>\n        </md-subheader>\n\n    <h2 class=\"md-display-1\"><md-icon md-font-icon=\"zmdi zmdi-notifications\">Notifications</md-icon> </b></h2>\n        <md-subheader class=\"md-whiteframe-z3 margin-20\" palette-background=\"amber:500\" content-layout=\"column\" content-layout-align=\"space-between\">\n            <p> \n                1 - There is a code color of Toast Notifications. <br> \n            </p>\n                 <md-subheader  class=\"md-whiteframe-z3 margin-20\" palette-background=\"cyan:A200\" content-layout=\"column\" content-layout-align=\"space-between\">\n                         <md-icon md-font-icon=\"zmdi zmdi-info-outline\"> Info Toast, where you see information.</md-icon>\n                </md-subheader>\n                 <md-subheader  class=\"md-whiteframe-z3 margin-20\" palette-background=\"light-green:A400\" content-layout=\"column\" content-layout-align=\"space-between\">\n                         <md-icon md-font-icon=\"zmdi zmdi-info-outline\"> Success Toast, it shows that an operation is done successfully.</md-icon>\n                </md-subheader>\n                 <md-subheader  class=\"md-whiteframe-z3 margin-20\" palette-background=\"orange:A400\" content-layout=\"column\" content-layout-align=\"space-between\">\n                         <md-icon md-font-icon=\"zmdi zmdi-alert-polygon\"> Warning Toast, it warns the user with an important message.</md-icon>\n                </md-subheader>        \n                 <md-subheader  class=\"md-whiteframe-z3 margin-20\" palette-background=\"deep-orange:A400\" content-layout=\"column\" content-layout-align=\"space-between\">\n                         <md-icon md-font-icon=\"zmdi zmdi-close-circle-o\"> Error Toast, showing that something has gone wrong.</md-icon>\n                </md-subheader>     \n                 <md-subheader  class=\"md-whiteframe-z3 margin-20\" palette-background=\"deep-purple:200\" content-layout=\"column\" content-layout-align=\"space-between\">\n                         <md-icon md-font-icon=\"zmdi zmdi-help\"> Question Toast, it asks the user about actions to do.</md-icon>\n                </md-subheader>     \n                 <md-subheader  class=\"md-whiteframe-z3 margin-20\" palette-background=\"deep-orange:A400\" content-layout=\"column\" content-layout-align=\"space-between\">\n                         <md-icon md-font-icon=\"zmdi zmdi-shield-security\"> Permission Error Toast, it shows that the user have not the permission to perform a certain action. </md-icon>\n                </md-subheader>   \n        </md-subheader>\n\n	<h2 class=\"md-display-1\"><md-icon md-font-icon=\"zmdi zmdi-lock\">Permissions</md-icon> </b></h2>\n		<md-subheader class=\"md-whiteframe-z3 margin-20\" palette-background=\"amber:500\" content-layout=\"column\" content-layout-align=\"space-between\">\n			<p>	\n				1 - There is different levels of accessibility in featurs off the app depending on the roles: SUPERADMIN - ADMIN - USER - ANONYMOUS. <br> \n				2 - The SUPERADMIN can read, modify, update and delete products / standards / reports. And can also generate Global Technical Folder. <br> \n				3 - The ADMIN can do everything that a SUPERADMIN do except deleting standards and products.<br> \n                4 - The USER can only view standards, project state, generate Technical Folder.<br> \n                5 - The ANONYMOUS have the same permissions as a user except that he\'s not authenticated. <br> \n            </p>\n        </md-subheader>\n</div>\n \n");
$templateCache.put("app/layouts/toolbar/toolbar.tmpl.html","<div class=\"md-toolbar-tools\">\n    <md-button class=\"md-icon-button\" ng-if=\"!vm.hideMenuButton()\" ng-click=\"vm.openSideNav(\'left\')\" aria-label=\"side navigation\">\n        <md-icon md-font-icon=\"zmdi zmdi-menu\"></md-icon>\n    </md-button>\n\n    <h2 hide-xs flex>\n        <span ng-repeat=\"crumb in vm.breadcrumbs.crumbs\">\n            <span translate>{{crumb.name}}</span>\n            <md-icon md-font-icon=\"zmdi zmdi-chevron-right\" ng-if=\"!$last\"></md-icon>\n        </span>\n    </h2>\n\n    <md-button class=\"md-icon-button toolbar-button\" ng-click=\"vm.createDialog()\" aria-label=\"how to app\">\n        <md-icon md-font-icon=\"fa fa-info-circle\"></md-icon>\n        <md-tooltip>how to</md-tooltip>\n    </md-button>\n\n    <md-button class=\"md-icon-button toolbar-button\" ng-click=\"vm.toggleFullScreen()\" aria-label=\"toggle fullscreen\">\n        <md-icon md-font-icon ng-class=\"vm.fullScreenIcon\"></md-icon>\n        <md-tooltip>Full screen</md-tooltip>\n    </md-button>\n\n    <md-menu ng-show=\"vm.languages.length > 0\">\n        <md-button class=\"md-icon-button\" aria-label=\"language\" ng-click=\"$mdOpenMenu()\" aria-label=\"change language\">\n            <md-icon md-font-icon=\"zmdi zmdi-globe-alt\"></md-icon>\n            <md-tooltip>Langue</md-tooltip>\n        </md-button>\n        <md-menu-content width=\"3\">\n            <md-menu-item ng-repeat=\"language in ::vm.languages\">\n                <md-button ng-click=\"vm.switchLanguage(language.key)\" translate=\"{{::language.name}}\" aria-label=\"{{::language.name}}\"></md-button>\n            </md-menu-item>\n        </md-menu-content>\n    </md-menu>\n \n    <md-button class=\"md-icon-button toolbar-button\" ng-click=\"vm.toggleNotificationsTab(1)\">\n        <md-icon md-font-icon=\"fa fa-bell-o\"></md-icon>\n        <span ng-show = \'vm.notificationsCount != 0\' class=\"toolbar-button-badge\" theme-background=\"accent\">{{vm.notificationsCount}}</span>\n        <md-tooltip>Notifications</md-tooltip>\n    </md-button>\n\n    <md-menu>\n        <md-button aria-label=\"Open user menu\" ng-click=\"$mdOpenMenu()\" aria-label=\"side navigation\">\n            <img class=\"toolbar-user-avatar\" ng-src=\"{{vm.currentUser.avatar}}\">\n            {{vm.currentUser.displayName}}\n        </md-button>\n        <md-menu-content width=\"2\">\n            <md-menu-item>\n                <md-button ng-click=\"vm.toggleNotificationsTab(2)\" aria-label=\"side navigation\">\n                    <md-icon md-font-icon=\"zmdi zmdi-settings\"></md-icon>\n                    <span translate=\"Notifications\"></span>\n                </md-button>\n            </md-menu-item>\n\n            <md-menu-divider></md-menu-divider>\n            <md-menu-item>\n                <md-button ng-click=\"vm.logout(2)\" aria-label=\"side navigation\">\n                    <md-icon md-font-icon=\"zmdi zmdi-settings\"></md-icon>\n                    <span translate=\"logout\"></span>\n                </md-button>\n            </md-menu-item>\n        </md-menu-content>\n    </md-menu>\n</div>\n");
$templateCache.put("app/permission/pages/permission-define.tmpl.html","<div class=\"md-padding\">\n    <h2 class=\"md-display-1\">Defining Roles & Permissions</h2>\n\n    <p>To get started we recommend looking at the example app and how the roles and permissions are defined there.</p>\n\n    <p>Take a look at the file <code>permission/permission.run.js</code> to see how the apps roles & permissions.</p>\n    <p>For example</p>\n\n    <div class=\"md-whiteframe-1dp\" layout=\"column\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>permission/permission.run.js</h2>\n            </div>\n        </md-toolbar>\n        <div flex hljs hljs-language=\"js\">\n    // create permissions and add check function verify all permissions\n    var permissions = [\'viewEmail\', \'viewGitHub\', \'viewCalendar\', \'viewLayouts\', \'viewTodo\', \'viewElements\', \'viewAuthentication\', \'viewCharts\', \'viewMaps\'];\n    PermissionStore.defineManyPermissions(permissions, function (permissionName) {\n        return UserService.hasPermission(permissionName);\n    });\n\n    // create roles for app\n    RoleStore.defineManyRoles({\n        \'SUPERADMIN\': [\'viewEmail\', \'viewGitHub\', \'viewCalendar\', \'viewLayouts\', \'viewTodo\', \'viewElements\', \'viewAuthentication\', \'viewCharts\', \'viewMaps\'],\n        \'ADMIN\': [\'viewLayouts\', \'viewTodo\', \'viewElements\', \'viewAuthentication\', \'viewCharts\', \'viewMaps\'],\n        \'USER\': [\'viewAuthentication\', \'viewCharts\', \'viewMaps\'],\n        \'ANONYMOUS\': []\n    });\n        </div>\n    </div>\n\n    <p>First of all we create a list of permissions then tell permission store about them and assign a function to verify them.  We use a service called UserService to check if the current user has a permission.</p>\n\n    <p>Next we define the roles SUPERADMIN, ADMIN, USER, and ANONYMOUS.  These roles each have their own permissions except for ANONYMOUS which doesn\'t have any permissions set.</p>\n\n    <p>Thats all you need to do to create Roles and Permissions which you can now use to hide / show menu items and page elements.</p>\n\n    <p>For more in depth information see the <a href=\"https://github.com/Narzerus/angular-permission\">Angular Permissions Module</a></p>\n</div>\n");
$templateCache.put("app/permission/pages/permission-routes.tmpl.html","<div class=\"md-padding\">\n    <h2 class=\"md-display-1\">Route Permissions</h2>\n\n    <h3 class=\"md-subheading\">Blocking Routes</h3>\n    <p>In order to block routes from being accessed when a usre doesn\'t have permission just add the following code to your <code>$stateProvider</code> declaration inside your config file.</p>\n\n    <p>For example</p>\n\n    <div class=\"md-whiteframe-1dp\" layout=\"column\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>my-module.config.js</h2>\n            </div>\n        </md-toolbar>\n        <div flex hljs hljs-language=\"js\">\n    $stateProvider\n    .state(\'triangular.my-page\', {\n        url: \'/mypage\',\n        templateUrl: \'app/my-module/my-page.tmpl.html\',\n        data: {\n            permissions: {\n                only: [\'viewMyPage\']\n            }\n        }\n    });\n        </div>\n    </div>\n\n    <p>So now if any user that doesn\'t have the permission <code>viewMyPage</code> tries to access <code>/mypage</code> in the browser they will be redirected to the <a href=\"#/401\">401 Page</a></p>\n\n    <h3 class=\"md-subheading\">Hiding menus</h3>\n    <p>As well as blocking the route you will also want to hide the menu item.  This is also easy, just add a permission to the menu item when you add it in your config file.</p>\n\n    <div class=\"md-whiteframe-1dp\" layout=\"column\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>my-module.config.js</h2>\n            </div>\n        </md-toolbar>\n        <div flex hljs hljs-language=\"js\">\n    triMenuProvider.addMenu({\n        name: \'My Page\',\n        type: \'link\',\n        permission: \'viewMyPage\',\n    });\n        </div>\n    </div>\n\n    <p>Now unless the user has the <code>viewMyPage</code> permission they will not see the menu item in the left sidebar.</p>\n</div>\n");
$templateCache.put("app/permission/pages/permission-views.tmpl.html","<div class=\"md-padding\">\n    <h2 class=\"md-display-1\">View Permissions</h2>\n\n    <h3 class=\"md-subheading\">Hiding view elements</h3>\n\n    <p>You can also use angular permission to hide elements on the page.</p>\n\n    <p>For example to a button on your app unless the user has a <code>canDelete</code> permission you would do the following.</p>\n\n    <div class=\"md-whiteframe-1dp\" layout=\"column\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>my-page.tmpl.html</h2>\n            </div>\n        </md-toolbar>\n        <div flex hljs hljs-language=\"html\">\n            <md-button permission permission-only=\"\'canDelete\'\">Delete</md-button>\n        </div>\n    </div>\n\n    <p>So now if any user that doesn\'t have the permission <code>canDelete</code> they wont see this button.</p>\n</div>\n");
$templateCache.put("app/permission/pages/permission.tmpl.html","<div class=\"md-padding\">\n    <h2 class=\"md-display-1\">Permissions</h2>\n\n    <p>Many people have requested a way to restrict access to pages inside triangular.</p>\n\n    <p>So for that reason we have added an optional module that works with the <a href=\"https://github.com/Narzerus/angular-permission\">Angular Permission Module</a></p>\n\n    <p>To show how this works we have created some mock users, roles and permissions for triangular.</p>\n\n    <p>This will show you how they can be used to restrict user access to routes / pages and HTML elements in your app.</p>\n\n    <p>In the demo app we have 4 users with different roles assigned to each.  Each role has a set of permissions that we will use to show and hide menu items on the left as well as disable the routes to those pages.</p>\n\n    <div layout=\"row\" layout-xs=\"column\" layout-margin layout-align=\"space-between stretch\">\n        <div class=\"md-whiteframe-1dp\" flex layout=\"column\">\n            <md-toolbar>\n                <div class=\"md-toolbar-tools\">\n                    <span translate>Users</span>\n                </div>\n            </md-toolbar>\n            <md-content>\n                <md-list flex>\n                    <md-list-item class=\"md-primary\" ng-repeat=\"user in vm.userList\" ng-click=\"vm.selectUser(user)\">\n                        <img ng-src=\"{{user.avatar}}\" class=\"md-avatar\" alt=\"{{user.displayName}}\" />\n                        <p>{{user.displayName}}</p>\n                        <md-icon md-font-icon=\"zmdi zmdi-circle\" ng-show=\"vm.selectedUser == user\"></md-icon>\n                    </md-list-item>\n                </md-list>\n            </md-content>\n        </div>\n        <div class=\"md-whiteframe-1dp\" flex layout=\"column\">\n            <md-toolbar>\n                <div class=\"md-toolbar-tools\">\n                    <span translate>Roles</span>\n                </div>\n            </md-toolbar>\n            <md-content>\n                <md-list flex>\n                    <md-list-item ng-repeat=\"role in vm.roleList\">\n                        <p>{{role.roleName}}</p>\n                    </md-list-item>\n                </md-list>\n            </md-content>\n        </div>\n        <div class=\"md-whiteframe-1dp\" flex layout=\"column\">\n            <md-toolbar>\n                <div class=\"md-toolbar-tools\">\n                    <span translate>Permissions</span>\n                </div>\n            </md-toolbar>\n            <md-content>\n                <md-list flex>\n                    <md-list-item ng-repeat=\"permission in vm.permissionList\">\n                        <p>{{permission}}</p>\n                    </md-list-item>\n                </md-list>\n            </md-content>\n        </div>\n    </div>\n\n    <md-button class=\"md-primary md-raised\" ng-click=\"vm.loginClick()\">Login as {{vm.selectedUser.displayName}}</md-button>\n\n    <p>Go ahead and log in as one of the users to see it\'s effect on the side menu items and routes</p>\n\n    <p>For more details on how to set this up read about permissions for routes and permissions for views.</p>\n</div>\n");
$templateCache.put("app/laboratory/pca/add_pca/add_pca.tmpl.html"," <div class=\"padded-content-page\">\n\n	<h2 class=\"md-display-1\">Add new <b> PCA </b></h2>\n\n        <tri-widget calendar-widget flex class=\"widget-calendar\" palette-background=\"amber:500\" content-layout=\"column\" content-layout-align=\"space-between\">\n           <div layout=\"row\" layout-align=\"space-between center\" class=\"padding-normal\" alt=\"product-avatar\">\n           	   <img ng-src=\"{{vm.ProductInfo.ImageBuffer}}\" id=\"productImage\" class=\"make-round\" width=\"100\"/> \n           	    <md-icon ng-show= \"vm.ProductInfo.ImageBuffer == \'\'\" md-font-icon=\"fa fa-camera-retro font-size-4 opacity-50\"></md-icon>      	  \n	         	<h1>{{vm.ProductInfo.References}}</h1>\n           </div>\n        </tri-widget>\n		<h2>Products Infos</h2>\n		<md-input-container class=\"md-block\">\n		    <label>Brand: Hager / Berker</label>\n		    <input type=\"text\" ng-model=\"vm.ProductInfo.Brand\" >\n		</md-input-container>\n		<md-input-container class=\"md-block\">\n		    <label>Technical Folder </label>\n		    <input type=\"text\" ng-model=\"vm.ProductInfo.TechnicalFolder\" >\n		</md-input-container>\n		<md-input-container class=\"md-block\">\n		    <label>References: : XXXX / XXXX / XXXX</label>\n		    <input type=\"text\" ng-model=\"vm.ProductInfo.References\" >\n		</md-input-container>\n		<md-input-container class=\"md-block\">\n		    <label>Risk Analysis: MD xx xx xx</label>\n		    <input type=\"text\" ng-model=\"vm.ProductInfo.RiskAnalysis\" >\n		</md-input-container>\n		<md-input-container class=\"md-block\">\n		    <label>Product Designation</label>\n		    <input type=\"text\" ng-model=\"vm.ProductInfo.Designation\" >\n		</md-input-container>\n		<md-input-container class=\"md-block\">\n		    <label>Links Project</label>\n		    <input type=\"text\" ng-model=\"vm.ProductInfo.Links\" >\n		</md-input-container>\n	   <div layout=\"row\" layout-align=\"space-around center\">\n			 <input class=\"ng-hide\" id=\"input-image-id\" multiple type=\"file\" \n			     accept=\"image/jpeg,image/png\"\n			     onchange=\"angular.element(this).scope().TreatImage(this)\"/>  \n			 <label for=\"input-image-id\" class=\"md-button md-raised md-primary\">Upload Image</label>\n	   </div>\n		<md-input-container>\n		    <label> Created by:  </label>\n		    <input type=\"text\" ng-model=\"vm.ProductInfo.CreatedBy\" ng-disabled=\"true\">\n		</md-input-container>\n    <md-divider ></md-divider>\n 	<h2 class=\"md-display-1\">Select Directives </h2>\n\n	<div ng-repeat=\"directive in vm.directives\" layout=\"row\" >\n		 <md-switch class=\"md-secondary\" ng-model=\"directive.selected\"></md-switch>\n\n		<div layout=\"row\">\n			 <md-icon md-font-icon=\"fa fa-recycle\"></md-icon>\n			 <md-icon md-font-icon=\"fa fa-minus-circle\"  class=\"md-warn md-raised\" permission=\"\" permission-only=\"\'CanDeleteDirective\'\" ng-click=\'vm.deleteDirective(directive)\'></md-icon>\n	 		 <p> {{directive.Infos.Reference}}: {{::directive.Infos.Title}} >  {{::directive.Infos.Date}}</p> \n 		</div>\n	</div>\n \n	<md-icon md-font-icon=\"fa fa-plus-circle\" class=\"md-primary md-raised\" ng-click=\'vm.AddNewDirective()\'>	<md-tooltip>Add</md-tooltip> </md-icon>	Add new directive :\n	\n	<div layout=\"row\"  flex>\n		<md-input-container class=\"md-block\">\n		    <label>Reference </label>\n		    <input type=\"text\" ng-model=\"vm.DirectiveTmpl.Infos.Reference\" >\n		</md-input-container>\n		<md-input-container class=\"md-block\">\n		    <label>Title </label>\n		    <input type=\"text\" ng-model=\"vm.DirectiveTmpl.Infos.Title\" >\n		</md-input-container>\n		<md-input-container class=\"md-block\">\n		    <label>Date: Feb-14</label>\n		    <input type=\"text\" ng-model=\"vm.DirectiveTmpl.Infos.Date\" >\n		</md-input-container>\n	</div>\n\n    <md-divider ></md-divider>\n 	<h2 class=\"md-display-1\">Add PCA </h2>\n\n		<div layout=\"row\" layout-align=\"space-around center\">\n			 <input class=\"ng-hide\" id=\"input-file-id\" multiple type=\"file\" ng-disabled=\"vm.formestatus()\" onchange=\"angular.element(this).scope().TreatFile(this)\" />  \n			 <label for=\"input-file-id\" class=\"md-button md-raised md-primary\" ng-click=\"vm.formcheck()\">Upload File</label>\n		</div>\n   \n	<div layout=\"row\" layout-align=\"space-around center\">\n		<md-progress-circular class=\"md-accent\" ng-show =\"vm.status != \'idle\'\" md-mode=\"indeterminate\"></md-progress-circular>\n	</div>\n\n	<h1 class=\"ui-typography-heading-example md-body-2\"> <md-icon md-font-icon=\"zmdi zmdi-alert-circle-o\"></md-icon> Add only <b>Microsoft® Exel </b> Files.</h1>\n\n</div>\n ");
$templateCache.put("app/laboratory/pca/add_pca/error-pca-dialog.tmpl.html","<md-dialog flex=\"60\" flex-xs=\"100\">\n    <md-toolbar class=\"md-warn toolbar-default margin-bottom-0\">\n        <div class=\"md-toolbar-tools\">\n            <h2 flex> Add PCA Report</h2>\n            <md-button class=\"md-icon-button\" ng-click=\"vm.cancelClick()\" aria-label=\"cancel\">\n            </md-button>\n        </div>\n    </md-toolbar>\n\n    <md-dialog-content class=\"md-dialog-content\">\n        <md-list>\n\n            <md-subheader ng-if= \'vm.addStatus == true\' palette-background=\"light-green:500\" class=\"md-no-sticky\"> \n                <md-icon md-font-icon=\"fa fa-check-square-o\"></md-icon> Product added to the Database. \n            </md-subheader>\n            <md-subheader ng-if= \'vm.addStatus == false\' palette-background=\"red:500\" class=\"md-no-sticky\"> \n               <md-icon md-font-icon=\"fa fa-times\"></md-icon> Product not added to the Database. \n            </md-subheader>\n            <md-subheader ng-if= \'vm.ErrStack.Surplus.length != 0\' palette-background=\"red:500\" class=\"md-no-sticky\"> \n                <md-icon md-font-icon=\"zmdi zmdi-close-circle\"></md-icon> PCA contains contains these extra points in comparison with standards in Database : \n                <h5><md-icon md-font-icon=\"fa fa-info-circle\"></md-icon> These missing points are NOT taken into account in the Technical Folder.</h5>\n            </md-subheader>\n            <md-list-item class=\"md-2-line\" ng-repeat=\"item in ::vm.ErrStack.Surplus\">\n                <div class=\"md-list-item-text\">\n                    <h3>{{::item.Name}}</h3>\n                    <p>{{::item.Point}}</p>\n                </div>\n            </md-list-item>\n            <md-divider ></md-divider>\n            <md-subheader ng-if= \'vm.ErrStack.Absent.length != 0\' palette-background=\"orange:500\" class=\"md-no-sticky\">\n                <md-icon md-font-icon=\"fa fa-warning\"></md-icon>PCA does not contain these points / standards in comparison with standards in Database :\n                <h5><md-icon md-font-icon=\"fa fa-info-circle\"></md-icon> these missing points are now added automatically to the Technical Folder.</h5>\n            </md-subheader>                  \n\n            <md-list-item class=\"md-2-line\" ng-repeat=\"item in ::vm.ErrStack.Absent\">\n                <div class=\"md-list-item-text\">\n                    <h3>{{::item.Name}}</h3>  \n                    <md-icon class=\"md-warn\" ng-if= \"item.Point == \'ALL POINTS.\'\" md-font-icon=\"fa fa-times\"> FATAL ERROR : THIS IS A MISSING STANDARD IN THE DATABASE. PLEASE UPDATE YOUR STANDARD LIST IN THE DATABASE.</md-icon>  \n                    <p> {{::item.Point}}</p>\n                </div>\n            </md-list-item>\n        </md-list>\n    </md-dialog-content>\n</md-dialog>");
$templateCache.put("app/laboratory/products/add_product/add_product.tmpl.html"," <div class=\"padded-content-page\">\n\n	<h2 class=\"md-display-1\">Add new <b> Product <md-icon md-font-icon=\"zmdi zmdi-bookmark-outline\"></md-icon></b></h2>\n		<md-subheader class=\"md-whiteframe-z3 margin-20 text-center\" palette-background=\"amber:500\" content-layout=\"column\" content-layout-align=\"space-between\">\n           <div layout=\"row\" layout-align=\"space-between center\" class=\"padding-normal\" alt=\"product-avatar\">\n           	   <img ng-src=\"{{vm.Product.ProductInfo.ImageBuffer}}\" id=\"productImage\" class=\"make-round\" width=\"100\"/> \n           	    <md-icon ng-show= \"vm.Product.ProductInfo.ImageBuffer == \'\'\" md-font-icon=\"fa fa-camera-retro font-size-4 opacity-50\"></md-icon>      	  \n	         	<h1>{{vm.Product.ProductInfo.References}}</h1>\n           </div>\n        </md-subheader>\n		<h2>Product Infos</h2>\n		<md-input-container class=\"md-block\">\n		    <label style=\'color: white;\'>Brand: Hager / Berker</label>\n		    <input type=\"text\" ng-model=\"vm.Product.ProductInfo.Brand\" >\n		</md-input-container>\n		<md-input-container class=\"md-block\">\n		    <label style=\'color: white;\'>Technical Folder </label>\n		    <input type=\"text\" ng-model=\"vm.Product.ProductInfo.TechnicalFolder\" >\n		</md-input-container>\n		<md-input-container class=\"md-block\">\n		    <label style=\'color: white;\'>References:</label>\n		    <input type=\"text\" ng-model=\"vm.Product.ProductInfo.References\" >\n		</md-input-container>\n		<md-input-container class=\"md-block\">\n		    <label style=\'color: white;\'>Risk Analysis: MD xx xx xx</label>\n		    <input type=\"text\" ng-model=\"vm.Product.ProductInfo.RiskAnalysis\" >\n		</md-input-container>\n		<md-input-container class=\"md-block\">\n		    <label style=\'color: white;\'>Product Designation</label>\n		    <input type=\"text\" ng-model=\"vm.Product.ProductInfo.Designation\" >\n		</md-input-container>\n		<md-input-container class=\"md-block\">\n		    <label style=\'color: white;\'>Links Project</label>\n		    <input type=\"text\" ng-model=\"vm.Product.ProductInfo.Links\" >\n		</md-input-container>\n	   <div layout=\"row\" layout-align=\"space-around center\">\n			 <input class=\"ng-hide\" id=\"input-image-id\" multiple type=\"file\" \n			     accept=\"image/jpeg,image/png\"\n			     onchange=\"angular.element(this).scope().TreatImage(this)\"/>  \n			 <label for=\"input-image-id\" class=\"md-button md-raised md-primary\">Upload Image</label>\n	   </div>\n		<md-input-container>\n		    <label> Created by:  </label>\n		    <input type=\"text\" ng-model=\"vm.Product.ProductInfo.CreatedBy\" ng-disabled=\"true\">\n		</md-input-container> \n\n\n    <md-divider ></md-divider>\n 	<h2 class=\"md-display-1\">Select Directives </h2>\n\n	<div ng-repeat=\"directive in vm.directives\" layout=\"row\" >\n		 <md-switch class=\"md-secondary\" ng-model=\"directive.selected\"></md-switch>\n\n		<div layout=\"row\">\n			 <md-icon md-font-icon=\"fa fa-recycle\"></md-icon>\n			 <md-icon md-font-icon=\"fa fa-minus\" class=\"md-warn md-raised\" permission=\"\" permission-only=\"\'CanDeleteDirective\'\" ng-click=\'vm.deleteDirective(directive)\'> <md-tooltip>delete</md-tooltip> </md-icon>\n	 		 <p> {{directive.Infos.Reference}}: {{::directive.Infos.Title}} >  {{::directive.Infos.Date}}</p> \n 		</div>\n	</div>\n\n	<md-icon md-font-icon=\"fa fa-plus-circle\" class=\"md-primary md-raised\" ng-click=\'vm.AddNewDirective()\'>	<md-tooltip>Add</md-tooltip> </md-icon>	Add new directive :\n	\n	<div layout=\"row\" flex>\n		<md-input-container class=\"md-block\">\n		    <label>Reference </label>\n		    <input type=\"text\" ng-model=\"vm.DirectiveTmpl.Infos.Reference\" >\n		</md-input-container>\n		<md-input-container class=\"md-block\">\n		    <label>Title </label>\n		    <input type=\"text\" ng-model=\"vm.DirectiveTmpl.Infos.Title\" style=\"width: 500px;\">\n		</md-input-container>\n		<md-input-container class=\"md-block\">\n		    <label>Date: Feb-14</label>\n		    <input type=\"text\" ng-model=\"vm.DirectiveTmpl.Infos.Date\" >\n		</md-input-container>\n	</div>\n\n    <md-divider ></md-divider>\n    \n		<md-list>\n		    <md-divider ></md-divider>\n		   \n		    <md-subheader class=\"md-whiteframe-z3 margin-20 text-center\" palette-background=\"amber:500\" >	\n\n		    	<h1 class=\"ui-typography-heading-example md-body-2\"> <md-icon md-font-icon=\"zmdi zmdi-alert-circle-o\"></md-icon> Select the Standards to use in this product.</h1>\n			    <md-input-container>\n			        <label>Search Standard</label>\n			              <input type=\"text\" ng-model=\"searchStandards\">\n			    </md-input-container>\n\n			    <md-progress-linear ng-show=\"vm.showProgress ==  true\" class=\"md-warn margin-bottom-20\" md-mode=\"indeterminate\"></md-progress-linear>\n 			</md-subheader>\n\n\n		    <md-list-item ng-repeat=\"standard in vm.standards  | filter :{ Infos: { Name : searchStandards  } }\">\n		        <img ng-src=\"assets/images/laboratory/standard-avatar.png\" class=\"md-avatar\" alt=\"{{::standard.Infos.Name}}\"/>\n		        <p ng-if=\"standard.Infos.HasUpdate != 0\" style=\'color: rgb(255, 151, 119);\'> v{{standard.Infos.Version}}: {{::standard.Infos.Name}}</p>\n		        <p ng-if=\"standard.Infos.HasUpdate == 0\" style=\'color: white;\'> v{{standard.Infos.Version}}: {{::standard.Infos.Name}}</p>\n		       	<md-switch class=\"md-secondary\" ng-model=\"standard.selected\" ng-change=\"vm.selectStandard(standard, standard.selected)\"></md-switch>\n		    </md-list-item>\n		</md-list>\n\n		\n    <div layout=\"column\" layout-align=\"center center\">\n        <md-button ng-hide=\"vm.formestatus()\" class=\"md-primary md-raised\" md-ripple-size=\"full\" aria-label=\"ripple full\" ng-click= \'vm.addNewProduct()\' >Submit</md-button>\n   		<label ng-show=\"vm.formestatus()\" for=\"input-file-id\" class=\"md-button md-raised md-primary\" ng-click=\"vm.formcheck()\">Submit</label>\n    </div>\n</div>\n ");
$templateCache.put("app/laboratory/products/dashboard/products.dashboard.template.html","<md-toolbar permission=\"\" permission-only=\"\'CanSeeWarning\'\" class=\"md-warn toolbar-default margin-bottom-0\">\n    <div class=\"md-toolbar-tools\">\n        <h2>\n            <md-icon md-font-icon=\"fa fa-warning\"><span> You\'re connected as guest. Please <a class=\"pointille\" ng-click=\"vm.Gologin()\">Connect</a> to have the full access.</span></md-icon>\n        </h2>\n    </div>\n</md-toolbar>\n<div class=\"dashboard-container overlay-5 padded-content-page\">\n    <div layout=\"row\" layout-xs=\"column\" layout-margin>\n        <tri-widget calendar-widget flex class=\"widget-calendar\" palette-background=\"cyan:500\" content-layout=\"column\" content-layout-align=\"space-between\">\n          <md-icon md-font-icon=\"fa fa-gear\" ng-click=\'Modify = !Modify\'><md-tooltip>Edit info</md-tooltip></md-icon>\n\n             <center ng-if=\'Modify == true\'>\n                <md-input-container class=\"md-block\" >\n                  <label>Brand </label>\n                  <input type=\"text\" value = \'vm.product.ProductInfo.Brand\' ng-model = \"vm.product.ProductInfo.Brand\">\n                </md-input-container>\n\n                <md-input-container class=\"md-block\" >\n                  <label> Technical Folder Number </label>\n                  <input type=\"text\" value = \'vm.product.ProductInfo.TechnicalFolder\' ng-model = \"vm.product.ProductInfo.TechnicalFolder\">\n                </md-input-container>\n\n                <md-input-container class=\"md-block\" >\n                  <label>References </label>\n                  <input type=\"text\" value = \'vm.product.ProductInfo.References\' ng-model = \"vm.product.ProductInfo.References\">\n                </md-input-container>\n                <md-input-container class=\"md-block\" >\n                  <label>Risk Analysis </label>\n                  <input type=\"text\" value = \'vm.product.ProductInfo.RiskAnalysis\' ng-model = \"vm.product.ProductInfo.RiskAnalysis\">\n                </md-input-container>\n                <md-input-container class=\"md-block\" >\n                  <label>Product Designation </label>\n                  <input type=\"text\" value = \'vm.product.ProductInfo.Designation\' ng-model = \"vm.product.ProductInfo.Designation\">\n                </md-input-container>\n                <md-input-container class=\"md-block\" >\n                  <label>Links Project </label>\n                  <input type=\"text\" value = \'vm.product.ProductInfo.Links\' ng-model = \"vm.product.ProductInfo.Links\">\n                </md-input-container>\n            </center>\n\n             <center ng-if=\'Modify != true\'>\n                <h5> {{ vm.product.ProductInfo.Brand }} - {{ vm.product.ProductInfo.TechnicalFolder }} </h5>\n                <h2 class=\"font-weight-600 margin-bottom-0 text-light\" ng-if =\'vm.product.ProductInfo.References.length > 30\'>\n                  <md-icon ng-if=\"vm.product.TestStatus == \'Complete\'\" md-font-icon=\"fa fa-check\" style=\"color: rgb(0, 255, 0);   zoom: 1.5;\"></md-icon >\n                  <md-icon ng-if=\'vm.product.TestStatus == \"CompleteF\"\' md-font-icon=\"fa fa-check\" style=\"color: rgb(247, 15, 15); zoom: 1.5;\"></md-icon > \n                  <md-tooltip ng-if =\'vm.product.ProductInfo.References.length > 10\'>{{vm.product.ProductInfo.References}}</md-tooltip>\n                      {{ vm.product.ProductInfo.References | limitTo : 30}} ... \n                </h2>\n                <h2 class=\"font-weight-600 margin-bottom-0 text-light\" ng-if =\'vm.product.ProductInfo.References.length <= 30\'>\n                  <md-icon ng-if=\"vm.product.TestStatus == \'Complete\'\"  md-font-icon=\"fa fa-check\" style=\"color: rgb(0, 255, 0);   zoom: 1.5;\"></md-icon >\n                  <md-icon ng-if=\'vm.product.TestStatus == \"CompleteF\"\' md-font-icon=\"fa fa-check\" style=\"color: rgb(247, 15, 15); zoom: 1.5;\"></md-icon > \n                      {{ vm.product.ProductInfo.References }}\n                </h2>\n            </center> \n \n           <div layout=\"row\" layout-align=\"space-between center\" class=\"padding-normal\">\n               <i class=\"fa fa-arrow-circle-left font-size-4 opacity-50\" ng-click=\"vm.backtoproducts()\"><md-tooltip>Back</md-tooltip></i>\n               <md-icon permission=\"\" permission-only=\"\'CanSaveProject\'\" md-font-icon=\"fa fa-save font-size-4 opacity-50\" ng-click=\"vm.saveproduct()\"><md-tooltip>Save Project</md-tooltip></md-icon>\n               <md-icon md-font-icon=\"fa fa-download font-size-4 opacity-50\" ng-click=\"vm.GenerateTF()\"><md-tooltip>Generate Technical Folder</md-tooltip></md-icon>\n               <div class=\"widget-buttons\">\n                <img ng-src=\"{{vm.product.ProductInfo.ImageBuffer}}\" id=\"productImage\" style=\"border-radius: 15%;\" width=\"150\" height= \"150\"/>\n                        <md-icon ng-if= \"vm.product.ProductInfo.ImageBuffer == \'\'\" md-font-icon=\"fa fa-camera-retro font-size-4 opacity-50\"></md-icon> \n               </div>  \n           </div>\n        </tri-widget>\n        <div layout=\"column\" flex layout-margin>\n            <tri-widget palette-background=\"teal:400\" content-layout=\"column\" content-layout-align=\"space-between\">\n                <h5 class=\"md-display-5 font-weight-100 margin-0\" flex layout-padding translate>Statistics</h2>\n                <md-divider></md-divider>\n                <div ng-repeat=\"(key, value) in vm.data\" layout=\"row\" layout-xs=\"column\" layout-margin>\n                    <tri-widget calendar-widget flex class=\"widget-calendar\" palette-background=\"teal:700\" content-layout=\"column\" content-layout-align=\"space-between\" style=\"height:180px\">\n                         <i>Category: {{key}} </i>\n                         <canvas  height=\"10%\" width=\"100%\"class=\"chart-pie\" chart-data=\"value\" chart-labels=\"vm.labels\" chart-legend=\"true\" chart-options=\"vm.options\"></canvas>\n                    </tri-widget>\n                </div>\n            </tri-widget>\n        </div> \n    </div>\n    <div layout=\"row\" layout-xs=\"column\" layout-margin ng-cloak layout-fill>\n            <tri-widget palette-background=\"blue-grey:300\" content-layout=\"column\" content-layout-align=\"space-between\">\n                    <div layout=\"row\" layout-align=\"space-between center\" class=\"padding-normal\">\n                    <i class=\"fa fa-edit font-size-3 opacity-50\"></i> \n                    <h3 flex hide-xs class=\"md-subhead\" translate>Edit Product</h3>\n                    <div class=\"widget-buttons\">\n                        <i ng-if = \'value.viewCategory == true\'>Category View</i>  \n                        <i ng-if = \'value.viewCategory != true\'>Standards View</i>\n                        <md-button permission=\"\" permission-only=\"\'CanSaveProject\'\" class=\"md-icon-button\" ng-click=\"vm.saveproduct()\" aria-label=\"save product\">\n                                <md-icon md-font-icon=\"fa fa-save font-size-2 opacity-50\"></md-icon>\n                                <md-tooltip>Save</md-tooltip>\n                        </md-button>\n                        <md-button class=\"md-icon-button\" ng-click=\"value.viewCategory = !value.viewCategory\" aria-label=\"previous view\">  \n                            <md-icon md-font-icon=\"zmdi zmdi-chevron-left\"><md-tooltip>Switch view</md-tooltip></md-icon>\n                        </md-button>\n                        <md-button class=\"md-icon-button\" ng-click=\"value.viewCategory = !value.viewCategory\" aria-label=\"next view\">\n                            <md-icon md-font-icon=\"zmdi zmdi-chevron-right\"><md-tooltip>Switch view</md-tooltip></md-icon>\n                        </md-button>\n                    </div>\n                  </div>\n                <md-divider></md-divider>\n                <div layout=\"row\" layout-align=\"space-around center\">\n                  <md-progress-circular class=\"md-accent\" ng-if =\"vm.status != \'idle\'\" md-mode=\"indeterminate\"></md-progress-circular>\n                </div>\n                <div ng-if = \'value.viewCategory != true\'>\n                    <md-list-item class=\"md-2-line\" ng-repeat=\"(key, value) in vm.product.ProductJSON.Standards\">\n                        <div class=\"md-list-item-text\">\n                            <md-subheader layout=\"row\" layout-align=\"space-between center\" palette-background=\"{{ vm.getStandardColor(value) }}\" ng-click=\'selected = !selected\' class=\"md-whiteframe-z3 margin-0\" content-layout-align=\"space-between\">   \n \n                                <span class=\"md-caption\"> <b> {{vm.getStdProgress(key).perC | number:0}} % </b> - {{key}} <span translate> </span></span>\n                                      <div flex>\n                                        <md-progress-linear  ng-if=\"vm.getStdProgress(key).F == 0\" class=\"md-md-accent\" md-mode=\"determinate\" value=\"{{vm.getStdProgress(key).perC | number:0}}\"></md-progress-linear>\n                                        <md-progress-linear  ng-if=\"vm.getStdProgress(key).F != 0\" class=\"md-warn\" md-mode=\"determinate\" value=\"{{vm.getStdProgress(key).perC | number:0}}\"></md-progress-linear>\n                                     </div>\n \n                                <!-- buttons -->\n              \n                                <div ng-if=\"selected == true\" layout=\"column\" layout-align=\"start start\"> \n                                    <p class=\"font-weight-300 margin-top-0 margin-bottom-0\" ng-repeat=\"update in value.Updates\"> \n                                         Updates: <img src=\"assets/images/laboratory/standard-avatar.png\" alt=\"product-avatar\" width=\"15\"/> {{update.Name}}\n                                    </p>\n                                </div>\n                           </md-subheader>\n                               <md-list>\n                                  <div style=\"overflow-x: scroll;\" ng-if=\"selected == true\" >\n                                        <table class=\"table table-bordered table-hover table-condensed\" palette-background=\"white:50\">\n                                              <tr style=\"font-weight: bold ; zoom: 60%;\">\n                                                  <td style=\"width:5%\">Chapters</td>\n                                                  <td style=\"width:10%\">Category</td>\n                                                  <td style=\"width:20%\">\n                                                    <md-input-container style=\"margin: 0px;\">\n                                                        <label>search Title</label>\n                                                              <input type=\"text\" ng-model=\"searchTitle\">\n                                                    </md-input-container>\n                                                </td>\n                                                  <td style=\"width:60%\">Comments</td>\n                                                  <td style=\"width:5%\">\n                                                    <md-input-container style=\"margin: 0px;\">\n                                                        <label>search status</label>\n                                                              <input type=\"text\" ng-model=\"searchStatus\">\n                                                    </md-input-container>\n                                                  </td>\n                                                  <td style=\"width:10%\">Reports</td>\n                                              </tr>\n                                              <tr ng-repeat=\"designation in value.Designations | filter :  { DesignationTitle : searchTitle} | filter : { Status : searchStatus}\">\n                                                    <td style=\"padding:0px\"> <span class=\"md-caption\">  {{ designation.Chapters || \'empty\' }} </span> </td>\n                                                    <td style=\"padding:0px\"> <span class=\"md-caption\">  {{ designation.Category || \'empty\' }} </span> </td>\n                                                    <td  ng-if=\"designation.Category != \'Titre\'\"> \n                                                        <span class=\"md-caption\" ng-if =\'designation.DesignationTitle.length > 90\' >  {{ designation.DesignationTitle | limitTo : 90 }} ...</span> \n                                                        <span class=\"md-caption\" ng-if =\'designation.DesignationTitle.length <= 90\' >  {{ designation.DesignationTitle || \'empty\' }} </span> \n                                                        <md-tooltip ng-if =\'designation.DesignationTitle.length > 90\'>{{ designation.DesignationTitle }}</md-tooltip>\n                                                    </td>\n                                                    <td  ng-if=\"designation.Category == \'Titre\'\"> \n                                                        <span class=\"md-caption\" ng-if =\'designation.DesignationTitle.length > 90\'  style=\"color: rgb(0,188,212);\">  {{ designation.DesignationTitle | limitTo : 90 }} ...</span> \n                                                        <span class=\"md-caption\" ng-if =\'designation.DesignationTitle.length <= 90\' style=\"color: rgb(0,188,212);\">  {{ designation.DesignationTitle || \'empty\' }} </span> \n                                                        <md-tooltip ng-if =\'designation.DesignationTitle.length > 90\'>{{ designation.DesignationTitle }}</md-tooltip>\n                                                    </td>\n                                                    <td style=\"padding:0px\"> \n                                                      <md-input-container class=\"md-block\" style=\"margin: 0px;\" ng-if=\"designation.Category != \'Titre\'\">\n                                                            <label>Comments</label>\n                                                            <input type=\"text\" value = \'designation.Comments\' ng-model = \"designation.Comments\" >\n                                                      </md-input-container>\n                                                    </td>\n                                                    <td style=\"padding:0px\">\n                                                          <md-select placeholder=\"Status\" ng-model=\"designation.Status\" e-form=\"tableform\" style=\"margin: 0px;\" ng-if=\"designation.Category != \'Titre\'\">\n                                                            <md-option value=\"P\"> <i style=\"color: #6faf27; \"> Passed</i></md-option>\n                                                            <md-option value=\"F\"> <i style=\"color: #f12214;\"> Failed</md-option>\n                                                            <md-option value=\"A\"> <i style=\"color: rgb(255,171,0);\"> Applicable</md-option>\n                                                            <md-option value=\"NA\"><i style=\"color: #14b0f1;\"> Not Applicable</md-option>\n                                                            <md-option value=\"\">  <i style=\"color: #14f114;\"> </md-option>\n                                                        </md-select>\n                                                    </td>\n                                                    <td  style=\"padding:0px\"  ng-if=\"designation.Category != \'Titre\'\"> \n                                                        <div layout=\"column\" layout-align=\"space-around center\">\n\n                                                          <md-menu ng-repeat= \'report in designation.Reports\' ng-if=\"report._id != \'41224d776a326fb40f000001\'\" >               \n                                                                  <md-icon md-font-icon=\"fa fa-paperclip\" class=\"font-size-1\"> \n                                                                    <a class=\"pointille\" ng-click=\"$mdOpenMenu()\"> {{ report.name | limitTo : 16 }} </a>\n                                                                    <md-tooltip>{{ report.name }} </md-tooltip>\n                                                                  </md-icon>\n                                                                   <md-menu-content width=\"2\">\n                                                                      <md-menu-item>\n                                                                          <md-button ng-click=\"vm.getreport(report._id, designation)\" aria-label=\"view report\"> <md-icon md-font-icon=\"fa fa-cloud-download\"></md-icon>view report</md-button>\n                                                                      </md-menu-item>\n                                                                      <md-menu-item permission =\"\" permission-only=\"\'CanDeleteReport\'\">\n                                                                          <md-button ng-click=\"vm.deleteReport(report._id, designation)\" aria-label=\"delete report\"> <md-icon md-font-icon=\"fa fa-trash-o\"></md-icon>delete report</md-button>\n                                                                      </md-menu-item>\n                                                                 </md-menu-content>\n                                                          </md-menu> \n                                                          <md-menu ng-repeat= \'report in designation.Reports\' ng-if=\"report._id == \'41224d776a326fb40f000001\'\">\n                                                                  <md-icon md-font-icon=\"fa fa-unlink\" class=\"font-size-1\"><a class=\"pointille\" ng-click=\"$mdOpenMenu()\" >{{ report.name }}</a></md-icon>\n                                                                  <md-menu-content width=\"2\">\n                                                                      <md-menu-item permission =\"\" permission-only=\"\'CanDeleteReport\'\">\n                                                                          <md-button ng-click=\"vm.deleteReport(report._id, designation)\" aria-label=\"delete report\"> <md-icon md-font-icon=\"fa fa-trash-o\"></md-icon>delete report</md-button>\n                                                                      </md-menu-item>\n                                                                 </md-menu-content>\n                                                          </md-menu> \n\n                                                            <md-select placeholder=\"Add Report\" ng-model=\"ReportChoice\" style=\"margin: 0px;\">\n                                                                <md-option value=\"input-file-{{designation}}\">\n                                                                 <input class=\"ng-hide\" id=\"input-file-{{designation}}\" type=\"file\" onchange=\"angular.element(this).scope().AddReports(this, angular.element(this).scope().designation)\" multiple>  \n                                                                 <label permission=\"\" permission-only=\"\'CanUploadReport\'\" style = \'zoom: 70%;\' palette-background=\"amber:400\" for=\"input-file-{{designation}}\" class=\"md-button md-raised md-primary\"> <md-icon md-font-icon=\"zmdi zmdi-upload\"></md-icon> New report  </label>                                                                  \n                                                                </md-option>\n                                                                <md-option ng-repeat=\'report in vm.reports\' value={{report.name}} ng-click=\'vm.AddReportToDes(report, designation)\'>{{report.name}}</md-option>\n                                                            </md-select>\n\n                                                        </div>\n                                                    </td>\n                                            </tr>\n                                        </table>\n                                    </div>\n                             </md-list>\n                        </div>\n                    </md-list-item>\n                </div>\n\n                <div ng-if = \'value.viewCategory == true\'>\n                    <div class=\"md-3-line margin-20\" ng-repeat=\"(key, value) in vm.CategoryView\">\n                        <div class=\"md-list-item-text\">\n\n                            <md-subheader layout=\"row\" layout-align=\"space-between center\" palette-background=\"amber:400\" ng-click=\'selected = !selected\' class=\"md-whiteframe-z3 margin-0\" content-layout-align=\"space-between\">   \n                                <span class=\"md-caption\"> <b> {{vm.getCategoryProgress(key).perC | number:0}} % </b> - {{key}} <span translate> </span></span>\n                                      <div flex>\n                                        <md-progress-linear  ng-if=\"vm.getCategoryProgress(key).F == 0\" class=\"md-md-accent\" md-mode=\"determinate\" value=\"{{vm.getCategoryProgress(key).perC | number:0}}\"></md-progress-linear>\n                                        <md-progress-linear  ng-if=\"vm.getCategoryProgress(key).F != 0\" class=\"md-warn\" md-mode=\"determinate\" value=\"{{vm.getCategoryProgress(key).perC | number:0}}\"></md-progress-linear>\n                                     </div>\n                           </md-subheader>\n\n                        </div>\n                \n                    <div>\n                      <div style=\"overflow-x: scroll;\" ng-if=\"selected == true\" >\n                        <table class=\"table table-bordered table-hover table-condensed\" palette-background=\"white:400\">\n                            <tr style=\"font-weight: bold\">\n                                <td class=\"md-caption\" style=\"width:10%\">Points</td>\n                                <td style=\"width:90%\"> \n                                    <md-input-container style=\'zoom: 60%;\'>\n                                      <label>search status</label>\n                                      <input type=\"text\" ng-model=\"searchStatus2\">\n                                  </md-input-container>\n                                </td>\n                            </tr>\n                            <tr ng-repeat=\"(key2, value2) in value\" ng-if = \"key2 != \'selected\'\">\n                                <td style=\"padding:0px;\"> <span class=\"md-caption\">  {{ key2 }} </span> </td>\n                                <td style=\"padding:0px\">\n                                    <table class=\"table table-bordered table-hover table-condensed\" palette-background=\"grey:50\" >\n                                        <tr style=\"font-weight: bold\">\n                                            <td class=\"md-caption\" style=\"width:20%\">Title</td> \n                                            <td class=\"md-caption\" style=\"width:10%\">Standards</td>\n                                            <td class=\"md-caption\" style=\"width:65%\">Comments</td>\n                                            <td class=\"md-caption\" style=\"width:5%\"> Status</td>\n                                            <td class=\"md-caption\" style=\"width:10%\">Reports</td>\n                                        </tr>\n                                        <tr ng-repeat=\"point in value2 | filter :  { Status : searchStatus2} \" style=\"padding:0px\">\n                                            <td style=\"padding:0px;\" ng-if=\"point.Category != \'Titre\'\"> \n                                                <span class=\"md-caption\" ng-if =\'point.DesignationTitle.length > 90\' >  {{ point.DesignationTitle | limitTo : 90 }} ...</span> \n                                                <span class=\"md-caption\" ng-if =\'point.DesignationTitle.length <= 90\' >  {{ point.DesignationTitle || \'empty\' }} </span> \n                                                <md-tooltip ng-if =\'point.DesignationTitle.length > 90\'>{{ point.DesignationTitle }}</md-tooltip>\n                                            </td>\n                                            <td style=\"padding:0px;\" ng-if=\"point.Category == \'Titre\'\"> \n                                                <span class=\"md-caption\" ng-if =\'point.DesignationTitle.length > 90\'  style=\"color: rgb(0,188,212);\">  {{ point.DesignationTitle | limitTo : 90 }} ...</span> \n                                                <span class=\"md-caption\" ng-if =\'point.DesignationTitle.length <= 90\' style=\"color: rgb(0,188,212);\">  {{ point.DesignationTitle || \'empty\' }} </span> \n                                                <md-tooltip ng-if =\'point.DesignationTitle.length > 90\'>{{ point.DesignationTitle }}</md-tooltip>\n                                            </td>\n                                            <td style=\"padding:0px\"> <span class=\"md-caption\">  {{ point.Standard || \'empty\' }} </span> </td>\n                                            <td style=\"padding:0px\"> \n                                                <md-input-container class=\"md-block\" style=\"margin: 0px;\" ng-if=\"point.Category != \'Titre\'\">\n                                                    <label>Comments</label>\n                                                    <input type=\"text\" value = \'point.Comments\' ng-model = \"point.Comments\">\n                                                </md-input-container>\n                                            </td>\n                                            <td style=\"padding:0px\">\n                                                <md-select placeholder=\"Status\" ng-model=\"point.Status\" e-form=\"tableform\" style=\"margin: 0px;\" ng-if=\"point.Category != \'Titre\'\">\n                                                    <md-option value=\"P\"> <i style=\"color: #6faf27;\"> Passed</i></md-option>\n                                                    <md-option value=\"F\"> <i style=\"color: #f12214;\"> Failed</md-option>\n                                                    <md-option value=\"A\"> <i style=\"color: rgb(255,171,0);\"> Applicable</md-option>\n                                                    <md-option value=\"NA\"><i style=\"color: #14b0f1;\"> Not Applicable</md-option>\n                                                    <md-option value=\"\">  <i style=\"color: #14f114;\"> </md-option>\n                                                </md-select>\n                                            </td>\n                                            <td style=\"padding:0px\"  ng-if=\"point.Category != \'Titre\'\"> \n                                                <div layout=\"column\" layout-align=\"space-around center\">\n\n                                                          <md-menu ng-repeat= \'report in point.Reports\' ng-if=\"report._id != \'41224d776a326fb40f000001\'\">               \n                                                                  <md-icon md-font-icon=\"fa fa-paperclip\" class=\"font-size-1\">\n                                                                      <a class=\"pointille\"  ng-click=\"$mdOpenMenu()\" >{{ report.name | limitTo : 16 }}</a>\n                                                                      <md-tooltip>{{ report.name }} </md-tooltip>\n                                                                  </md-icon>\n                                                                  <md-menu-content width=\"2\">\n                                                                      <md-menu-item>\n                                                                          <md-button ng-click=\"vm.getreport(report._id, designation)\" aria-label=\"view report\"> <md-icon md-font-icon=\"fa fa-cloud-download\"></md-icon>view report</md-button>\n                                                                      </md-menu-item>\n                                                                      <md-menu-item permission =\"\" permission-only=\"\'CanDeleteReport\'\">\n                                                                          <md-button ng-click=\"vm.deleteReport(report._id, designation)\" aria-label=\"delete report\"> <md-icon md-font-icon=\"fa fa-trash-o\"></md-icon>delete report</md-button>\n                                                                      </md-menu-item>\n                                                                 </md-menu-content>\n                                                          </md-menu> \n\n                                                          <md-menu ng-repeat= \'report in point.Reports\' ng-if=\"report._id == \'41224d776a326fb40f000001\'\">\n                                                                  <md-icon md-font-icon=\"fa fa-unlink\" class=\"font-size-1\"><a class=\"pointille\"  ng-click=\"$mdOpenMenu()\">{{ report.name | limitTo : 16 }}</a></md-icon>\n                                                                  <md-menu-content width=\"2\">\n                                                                      <md-menu-item permission =\"\" permission-only=\"\'CanDeleteReport\'\">\n                                                                          <md-button ng-click=\"vm.deleteReport(report._id, designation)\" aria-label=\"delete report\"> <md-icon md-font-icon=\"fa fa-trash-o\"></md-icon>delete report</md-button>\n                                                                      </md-menu-item>\n                                                                 </md-menu-content>\n                                                          </md-menu>\n\n                                                            <md-select placeholder=\"Add Report\" ng-model=\"ReportChoice2\" style=\"margin: 0px;\">\n                                                                <md-option value=\"input-file-{{point}}-C\">\n                                                                 <input class=\"ng-hide\" id=\"input-file-{{point}}-C\" type=\"file\" onchange=\"angular.element(this).scope().AddReports(this, angular.element(this).scope().point)\" multiple>  \n                                                                 <label permission=\"\" permission-only=\"\'CanUploadReport\'\" style = \'zoom: 70%;\' palette-background=\"amber:400\" for=\"input-file-{{point}}-C\" class=\"md-button md-raised md-primary\"> <md-icon md-font-icon=\"zmdi zmdi-upload\"></md-icon> New report  </label>                                                           \n                                                                </md-option>\n                                                                <md-option ng-repeat=\'report in vm.reports\' value={{report.name}} ng-click=\'vm.AddReportToDes(report, point)\'>\n                                                                    {{report.name | limitTo : 16 }}\n                                                                </md-option>\n                                                            </md-select>\n \n                                                </div>\n                                            </td>\n\n                                        </tr>\n                                    </table>\n\n                                </td>\n                            </tr>\n                        </table>\n                      </div>\n                    </div>\n                </div>\n                \n                </div>\n            \n            </tri-widget>\n    </div>\n</div> \n");
$templateCache.put("app/laboratory/products/delete_product/delete_standard.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">File Upload Examples</h2>\n    <p class=\"md-subhead\">Triangular includes the <a href=\"https://github.com/danialfarid/ng-file-upload\">ng-file-upload directive</a> to allow easy upload form creation.</p>\n\n    <p>Here are some examples</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h3>Simple upload button (allow multiple)</h3>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"padding-40 md-tabs-content\">\n                    <md-card>\n                        <md-card-content ng-controller=\"ElementsUpload1Controller as vm\" ng-include=\"\'app/examples/elements/examples/upload-1.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/upload-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/elements/examples/upload-1.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h3>Upload button with animation</h3>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"padding-40 md-tabs-content\">\n                    <md-card>\n                        <md-card-content ng-controller=\"ElementsUploadAnimateController as vm\" ng-include=\"\'app/examples/elements/examples/upload-animate.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/upload-animate.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/elements/examples/upload-animate.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>\n");
$templateCache.put("app/laboratory/products/modify_product/modify_standard.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">File Upload Examples</h2>\n    <p class=\"md-subhead\">Triangular includes the <a href=\"https://github.com/danialfarid/ng-file-upload\">ng-file-upload directive</a> to allow easy upload form creation.</p>\n\n    <p>Here are some examples</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h3>Simple upload button (allow multiple)</h3>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"padding-40 md-tabs-content\">\n                    <md-card>\n                        <md-card-content ng-controller=\"ElementsUpload1Controller as vm\" ng-include=\"\'app/examples/elements/examples/upload-1.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/upload-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/elements/examples/upload-1.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h3>Upload button with animation</h3>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"padding-40 md-tabs-content\">\n                    <md-card>\n                        <md-card-content ng-controller=\"ElementsUploadAnimateController as vm\" ng-include=\"\'app/examples/elements/examples/upload-animate.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/upload-animate.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/elements/examples/upload-animate.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>\n");
$templateCache.put("app/laboratory/standards/add_standard/add_standard.tmpl.html","<md-toolbar permission=\"\" permission-only=\"\'CanSeeWarning\'\" class=\"md-warn toolbar-default margin-bottom-0\">\n    <div class=\"md-toolbar-tools\">\n        <h2>\n            <md-icon md-font-icon=\"fa fa-warning\"><span> You\'re connected as guest. Please <a class=\"pointille\" ng-click=\"vm.Gologin()\">Connect</a> to have the full access.</span></md-icon>\n        </h2>\n    </div>\n</md-toolbar>\n\n <div class=\"padded-content-page\">\n\n	<h2 class=\"md-display-1\">Add new <b> Standards by PCA </b></h2>\n  \n		<md-input-container>\n		    <label> Created by:  </label>\n		    <input type=\"text\" ng-model=\"vm.ProductInfo.CreatedBy\" ng-disabled=\"true\">\n		</md-input-container>\n\n		<div layout=\"row\" layout-align=\"space-around center\" permission=\"\" permission-only=\"\'viewAddStd\'\">\n			 <input class=\"ng-hide\" id=\"input-file-id\" multiple type=\"file\" onchange=\"angular.element(this).scope().TreatStdsFile(this)\" />  \n			 <label for=\"input-file-id\" class=\"md-button md-raised md-primary\">Upload File</label>\n		</div>\n\n	<div layout=\"row\" layout-align=\"space-around center\">\n		<md-progress-circular class=\"md-accent\" ng-show =\"vm.status != \'idle\'\" md-mode=\"indeterminate\"></md-progress-circular>\n	</div>\n\n	<h1 class=\"ui-typography-heading-example md-body-2\"> <md-icon md-font-icon=\"zmdi zmdi-alert-circle-o\"></md-icon> Add only <b>Microsoft® Exel </b> Files.</h1>\n\n</div>\n ");
$templateCache.put("app/laboratory/standards/delete_standard/delete_standard.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">File Upload Examples</h2>\n    <p class=\"md-subhead\">Triangular includes the <a href=\"https://github.com/danialfarid/ng-file-upload\">ng-file-upload directive</a> to allow easy upload form creation.</p>\n\n    <p>Here are some examples</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h3>Simple upload button (allow multiple)</h3>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"padding-40 md-tabs-content\">\n                    <md-card>\n                        <md-card-content ng-controller=\"ElementsUpload1Controller as vm\" ng-include=\"\'app/examples/elements/examples/upload-1.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/upload-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/elements/examples/upload-1.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h3>Upload button with animation</h3>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"padding-40 md-tabs-content\">\n                    <md-card>\n                        <md-card-content ng-controller=\"ElementsUploadAnimateController as vm\" ng-include=\"\'app/examples/elements/examples/upload-animate.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/upload-animate.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/elements/examples/upload-animate.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>\n");
$templateCache.put("app/laboratory/standards/modify_standard/modify_standard.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">File Upload Examples</h2>\n    <p class=\"md-subhead\">Triangular includes the <a href=\"https://github.com/danialfarid/ng-file-upload\">ng-file-upload directive</a> to allow easy upload form creation.</p>\n\n    <p>Here are some examples</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h3>Simple upload button (allow multiple)</h3>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"padding-40 md-tabs-content\">\n                    <md-card>\n                        <md-card-content ng-controller=\"ElementsUpload1Controller as vm\" ng-include=\"\'app/examples/elements/examples/upload-1.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/upload-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/elements/examples/upload-1.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h3>Upload button with animation</h3>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"padding-40 md-tabs-content\">\n                    <md-card>\n                        <md-card-content ng-controller=\"ElementsUploadAnimateController as vm\" ng-include=\"\'app/examples/elements/examples/upload-animate.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/upload-animate.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/elements/examples/upload-animate.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>\n");
$templateCache.put("app/triangular/components/footer/footer.tmpl.html","<md-toolbar id=\"footer\" md-theme=\"{{triSkin.elements.toolbar}}\" ng-controller=\"FooterController as vm\" ng-show=\"vm.layout.footer\">\n    <div class=\"md-toolbar-tools md-body-1\" layout=\"row\" layout-align=\"space-between center\">\n        <h2>{{vm.name}}</h2>\n        <h2 hide-xs ng-bind-html=\"vm.copyright\"></h2>\n        <h2>v{{vm.version}}</h2>\n    </div>\n</md-toolbar>\n");
$templateCache.put("app/triangular/components/menu/menu-item-divider.tmpl.html","<md-divider></md-divider>");
$templateCache.put("app/triangular/components/menu/menu-item-dropdown.tmpl.html","<md-button ng-click=\"triMenuItem.toggleDropdownMenu()\" class=\"md-raised md-primary side-menu-link\">\n    <md-icon ng-if=\"::(triMenuItem.item.icon !== undefined)\" class=\"side-menu-icon\" md-font-icon=\"{{::triMenuItem.item.icon}}\"></md-icon>\n    <span translate>{{::triMenuItem.item.name}}</span>\n    <md-icon class=\"menu-toggle-icon\" md-font-icon=\"zmdi zmdi-chevron-right\" ng-class=\"{ open: triMenuItem.item.open }\"></md-icon>\n</md-button>\n<ul class=\"drop-down-list\" ng-show=\"triMenuItem.item.open\">\n    <li ng-repeat=\"child in triMenuItem.item.children\">\n        <tri-menu-item item=\"::child\"></tri-menu-item>\n    </li>\n</ul>");
$templateCache.put("app/triangular/components/menu/menu-item-link.tmpl.html","<md-button permission permission-only=\"triMenuItem.item.permission\" ng-click=\"triMenuItem.openLink(triMenuItem.item)\" class=\"md-primary md-raised side-menu-link\" ng-class=\"{ \'md-hue-1\': triMenuItem.item.active }\">\n    <md-icon ng-if=\"::(triMenuItem.item.icon !== undefined)\" class=\"side-menu-icon\" md-font-icon=\"{{::triMenuItem.item.icon}}\"></md-icon>\n    <span translate>{{::triMenuItem.item.name}}</span>\n    <small ng-if=\"triMenuItem.item.badge\" theme-background=\"accent\" class=\"side-menu-badge\">{{triMenuItem.item.badge}}</small>\n</md-button>");
$templateCache.put("app/triangular/components/notifications-panel/notifications-panel.tmpl.html","<md-content flex layout class=\"admin-notifications\">\n    <md-tabs flex md-stretch-tabs=\"always\" md-selected=\"vm.currentTab\">\n        <md-tab>\n            <md-tab-label>\n                <md-icon md-font-icon=\"zmdi zmdi-email\"></md-icon>\n            </md-tab-label>\n            <md-tab-body>\n                <md-content>\n                    <md-list class=\"md-dense\">\n                        <md-list-item class=\"md-2-line\" ng-repeat=\"email in ::vm.emails\" ng-click=\"vm.openMail(email)\">\n                            <img class=\"md-avatar\" ng-src=\"{{::email.from.image}}\" alt=\"{{::email.from.name}}\">\n                            <div class=\"md-list-item-text\">\n                                <h3>{{::email.from.name}}</h3>\n                                <h4>{{::email.subject}}</h4>\n                                <p class=\"md-caption\" am-time-ago=\"::email.date\"></p>\n                            </div>\n                            <md-divider ng-hide=\"$last\"></md-divider>\n                        </md-list-item>\n                    </md-list>\n                </md-content>\n            </md-tab-body>\n        </md-tab>\n        <md-tab>\n            <md-tab-label>\n                <md-icon md-font-icon=\"fa fa-bell-o\"></md-icon>\n            </md-tab-label>\n            <md-tab-body>\n                <md-content>\n                    <md-list>\n                        <div ng-repeat=\"group in ::vm.notificationGroups\">\n                            <md-subheader class=\"md-primary\">{{::group.name}}</md-subheader>\n                            <md-list-item ng-repeat=\"notification in ::group.notifications\" layout=\"row\" layout-align=\"space-between center\">\n                                <md-icon md-font-icon=\"{{::notification.icon}}\" ng-style=\"{ color: notification.iconColor }\"></md-icon>\n                                <p>{{::notification.title}}</p>\n                                <span class=\"md-caption\" am-time-ago=\"::notification.date\"></span>\n                            </md-list-item>\n                        </div>\n                    </md-list>\n                </md-content>\n            </md-tab-body>\n        </md-tab>\n        <md-tab>\n            <md-tab-label>\n                <md-icon md-font-icon=\"zmdi zmdi-account\"></md-icon>\n            </md-tab-label>\n            <md-tab-body>\n                <md-content>\n                    <md-list>\n                        <div ng-repeat=\"group in ::vm.settingsGroups\">\n                            <md-subheader class=\"md-primary\"><span translate>{{::group.name}}</span></md-subheader>\n                            <md-list-item ng-repeat=\"setting in ::group.settings\" layout=\"row\" layout-align=\"space-around center\">\n                                <md-icon md-font-icon=\"{{::setting.icon}}\"></md-icon>\n                                <p translate>{{::setting.title}}</p>\n                                <md-switch class=\"md-secondary\" ng-model=\"setting.enabled\"></md-switch>\n                            </md-list-item>\n                        </div>\n                        <div ng-repeat=\"group in ::vm.statisticsGroups\">\n                            <md-subheader class=\"md-primary\"><span translate>{{::group.name}}</span></md-subheader>\n                            <md-list-item ng-repeat=\"stat in ::group.stats\" layout=\"column\" layout-align=\"space-around start\">\n                                <md-progress-linear class=\"margin-top-20\" ng-class=\"::stat.mdClass\" md-mode=\"determinate\" ng-value=\"::stat.value\"></md-progress-linear>\n                                <p translate>{{::stat.title}}</p>\n                            </md-list-item>\n                        </div>\n                    </md-list>\n                </md-content>\n            </md-tab-body>\n        </md-tab>\n    </md-tabs>\n</md-content>\n");
$templateCache.put("app/triangular/components/table/table-directive.tmpl.html","<table class=\"md-table\">\n    <thead>\n        <tr>\n            <th ng-repeat=\"column in columns\" ng-click=\"sortClick(column.field)\" ng-class=\"headerClass(column.field)\">\n                <md-icon ng-show=\"showSortOrder(column.field, true)\" class=\"zmdi-hc-rotate-90\" md-font-icon=\"zmdi zmdi-arrow-back\"></md-icon>\n                <md-icon ng-show=\"showSortOrder(column.field, false)\" class=\"zmdi-hc-rotate-270\" md-font-icon=\"zmdi zmdi-arrow-back\"></md-icon>\n                <span>\n                    {{column.title | triTranslate}}\n                </span>\n            </th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr ng-repeat=\"content in contents | filter:filters | startFrom:page * pageSize | limitTo: pageSize\">\n            <td ng-repeat=\"column in columns\" ng-bind-html=\"cellContents(column, content)\" ng-class=\"column.field + \'-cell\'\"></td>\n        </tr>\n    </tbody>\n    <tfoot>\n        <tr>\n            <td colspan=\"{{columns.length}}\">\n                <div class=\"md-table-footer\" layout=\"row\" layout-align=\"end center\">\n                    <div class=\"md-table-page-select\" layout=\"row\" layout-align=\"center center\">\n                        <span translate>Rows per page:</span>\n                        <md-select ng-model=\"pageSize\" ng-change=\"refresh(true)\">\n                            <md-option value=\"5\">5</md-option>\n                            <md-option value=\"10\">10</md-option>\n                            <md-option value=\"25\">25</md-option>\n                            <md-option value=\"50\">50</md-option>\n                            <md-option value=\"100\">100</md-option>\n                        </md-select>\n                    </div>\n                    <span class=\"md-table-info\">\n                        {{pageStart()}}\n                        -\n                        {{pageEnd()}}\n                        <span translate>of</span>\n                        {{totalItems()}}\n                    </span>\n                    <div class=\"md-table-page-nav\">\n                        <md-button ng-disabled=\"page == 0\" ng-click=\"page = page - 1\" aria-label=\"{{\'Previous Page\' | triTranslate}}\" class=\"md-primary md-icon-button\">\n                            <md-icon md-font-icon=\"zmdi zmdi-chevron-left\"></md-icon>\n                        </md-button>\n                        <md-button ng-disabled=\"page == numberOfPages() - 1\" ng-click=\"page = page + 1\" aria-label=\"{{\'Next Page\' | triTranslate}}\" class=\"md-primary md-icon-button\">\n                            <md-icon md-font-icon=\"zmdi zmdi-chevron-right\"></md-icon>\n                        </md-button>\n                    </div>\n                </div>\n            </td>\n        </tr>\n    </tfoot>\n</table>\n");
$templateCache.put("app/triangular/components/toolbars/toolbar.tmpl.html","<div class=\"md-toolbar-tools\">\n    <md-button class=\"md-icon-button\" ng-if=\"!vm.hideMenuButton()\" ng-click=\"vm.openSideNav(\'left\')\" aria-label=\"side navigation\">\n        <md-icon md-font-icon=\"zmdi zmdi-menu\"></md-icon>\n    </md-button>\n\n    <h2 hide-xs flex>\n        <span ng-repeat=\"crumb in vm.breadcrumbs.crumbs\">\n            <span translate>{{crumb.name}}</span>\n            <md-icon md-font-icon=\"zmdi zmdi-chevron-right\" ng-if=\"!$last\"></md-icon>\n        </span>\n    </h2>\n\n    <md-button class=\"md-icon-button toolbar-button\" ng-click=\"vm.toggleFullScreen()\" aria-label=\"toggle fullscreen\">\n        <md-icon md-font-icon ng-class=\"vm.fullScreenIcon\"></md-icon>\n    </md-button>\n\n    <md-menu ng-show=\"vm.languages.length > 0\">\n        <md-button class=\"md-icon-button\" aria-label=\"language\" ng-click=\"$mdOpenMenu()\" aria-label=\"change language\">\n            <md-icon md-font-icon=\"zmdi zmdi-globe-alt\"></md-icon>\n        </md-button>\n        <md-menu-content width=\"3\">\n            <md-menu-item ng-repeat=\"language in ::vm.languages\">\n                <md-button ng-click=\"vm.switchLanguage(language.key)\" translate=\"{{::language.name}}\" aria-label=\"{{::language.name}}\"></md-button>\n            </md-menu-item>\n        </md-menu-content>\n    </md-menu>\n\n    <md-button class=\"md-icon-button toolbar-button animated\" ng-click=\"vm.toggleNotificationsTab(0)\" aria-label=\"side navigation\">\n        <md-icon md-font-icon=\"zmdi zmdi-email\"></md-icon>\n        <span class=\"toolbar-button-badge animated\" theme-background=\"accent\" ng-class=\"{ \'toolbar-button-badge-new\' : vm.emailNew }\">5</span>\n    </md-button>\n\n    <md-button class=\"md-icon-button toolbar-button\" ng-click=\"vm.toggleNotificationsTab(1)\">\n        <md-icon md-font-icon=\"fa fa-bell-o\"></md-icon>\n        <span class=\"toolbar-button-badge\" theme-background=\"accent\">2</span>\n    </md-button>\n\n    <md-menu>\n        <md-button aria-label=\"Open user menu\" ng-click=\"$mdOpenMenu()\" aria-label=\"side navigation\">\n            <img class=\"toolbar-user-avatar\" src=\"assets/images/avatars/avatar-5.png\">\n            Christos\n        </md-button>\n        <md-menu-content width=\"4\">\n            <md-menu-item>\n                <md-button ng-click=\"vm.toggleNotificationsTab(2)\" aria-label=\"side navigation\">\n                    <md-icon md-font-icon=\"zmdi zmdi-settings\"></md-icon>\n                    <span translate=\"Settings\"></span>\n                </md-button>\n            </md-menu-item>\n            <md-menu-item>\n                <md-button href=\"#/profile\" aria-label=\"side navigation\">\n                    <md-icon md-font-icon=\"zmdi zmdi-account\"></md-icon>\n                    <span translate=\"Profile\"></span>\n                </md-button>\n            </md-menu-item>\n            <md-menu-divider></md-menu-divider>\n            <md-menu-item>\n                <md-button href=\"#/login\" aria-label=\"side navigation\">\n                    <md-icon md-font-icon=\"zmdi zmdi-sign-in\"></md-icon>\n                    <span translate=\"Logout\"></span>\n                </md-button>\n            </md-menu-item>\n        </md-menu-content>\n    </md-menu>\n</div>\n");
$templateCache.put("app/triangular/components/widget/widget.tmpl.html","<div class=\"widget md-whiteframe-z2\" ng-class=\"::{\'widget-overlay-title\': vm.overlayTitle}\" flex layout=\"{{vm.widgetLayout}}\">\n\n    <div class=\"widget-title\" ng-if=\"::(vm.title || vm.subtitle)\" layout=\"row\" layout-padding layout-align=\"start center\" flex-order=\"{{vm.titleOrder}}\">\n        <div ng-if=\"::vm.avatar\">\n            <img ng-src=\"{{::vm.avatar}}\" class=\"widget-avatar\"/>\n        </div>\n        <div flex layout=\"column\">\n            <h3 class=\"md-subhead\" ng-if=\"::vm.title\" translate>{{::vm.title}}</h3>\n            <p class=\"md-body-1\" ng-if=\"::vm.subtitle\" translate>{{::vm.subtitle}}</p>\n        </div>\n        <md-menu ng-if=\"::vm.menu\">\n            <md-button class=\"widget-button md-icon-button\" ng-click=\"$mdOpenMenu()\" aria-label=\"open menu\">\n                <md-icon md-font-icon=\"{{::vm.menu.icon}}\"></md-icon>\n            </md-button>\n            <md-menu-content>\n                <md-menu-item ng-repeat=\"item in ::vm.menu.items\">\n                    <md-button ng-click=\"item.click($event)\">\n                        <md-icon ng-if=\"::item.icon\" md-font-icon=\"{{::item.icon}}\"></md-icon>\n                        <span translate>{{::item.title}}</span>\n                    </md-button>\n                </md-menu-item>\n            </md-menu-content>\n        </md-menu>\n    </div>\n\n    <div class=\"widget-content\" layout=\"{{vm.contentLayout}}\" layout-align=\"{{vm.contentLayoutAlign}}\" ng-class=\"{\'layout-padding\': vm.contentPadding}\" ng-transclude flex-order=\"{{vm.contentOrder}}\"></div>\n\n    <div class=\"widget-loading ng-hide\" ng-show=\"vm.loading\" layout layout-fill layout-align=\"center center\">\n        <div class=\"widget-loading-inner\" ng-show=\"vm.loading\">\n            <md-progress-circular md-mode=\"indeterminate\"></md-progress-circular>\n        </div>\n    </div>\n\n</div>");
$templateCache.put("app/triangular/layouts/default/default-content.tmpl.html","<div id=\"admin-panel-content-view\" class=\"{{layout.innerContentClass}}\" flex ui-view></div>");
$templateCache.put("app/triangular/layouts/default/default-no-scroll.tmpl.html","<div layout=\"row\" class=\"full-height\">\n    <!-- left sidebar -->\n\n    <md-sidenav class=\"admin-sidebar-left md-sidenav-left hide-scrollbars md-whiteframe-z2\" md-component-id=\"left\" md-is-locked-open=\"layout.sideMenuSize !== \'hidden\' && $mdMedia(\'gt-sm\')\" ui-view=\"sidebarLeft\" ng-class=\"{ \'admin-sidebar-collapsed\': layout.sideMenuSize == \'icon\' }\" ng-mouseover=\"layoutController.activateHover()\" ng-mouseleave=\"layoutController.removeHover()\"></md-sidenav>\n\n    <!-- main content -->\n    <div id=\"admin-panel\" layout=\"column\" flex>\n        <!-- loading animation -->\n        <tri-loader></tri-loader>\n\n        <!-- top toolbar -->\n        <md-toolbar class=\"admin-toolbar\" md-theme=\"{{triSkin.elements.toolbar}}\" ui-view=\"toolbar\" ng-class=\"[layout.toolbarSize,layout.toolbarClass]\"></md-toolbar>\n\n        <!-- scrollable content -->\n        <div ui-view=\"content\" layout=\"column\" flex class=\"overflow-hidden\"></div>\n\n        <div ui-view=\"belowContent\"></div>\n    </div>\n\n    <!-- right sidebar -->\n    <md-sidenav layout layout-fill class=\"md-sidenav-right md-whiteframe-z2\" md-component-id=\"notifications\" ui-view=\"sidebarRight\"></md-sidenav>\n</div>\n");
$templateCache.put("app/triangular/layouts/default/default.tmpl.html","<div layout=\"row\" class=\"full-height\">\n    <!-- left sidebar -->\n\n    <md-sidenav class=\"admin-sidebar-left md-sidenav-left hide-scrollbars md-whiteframe-z2\" md-component-id=\"left\" md-is-locked-open=\"layout.sideMenuSize !== \'hidden\' && $mdMedia(\'gt-sm\')\" ui-view=\"sidebarLeft\" ng-class=\"{ \'admin-sidebar-collapsed\': layout.sideMenuSize == \'icon\' }\" ng-mouseover=\"layoutController.activateHover()\" ng-mouseleave=\"layoutController.removeHover()\"></md-sidenav>\n\n    <!-- main content -->\n    <div id=\"admin-panel\" layout=\"column\" flex>\n        <!-- loading animation -->\n        <tri-loader></tri-loader>\n\n        <!-- top toolbar -->\n        <md-toolbar class=\"admin-toolbar\" ng-if=\"layout.showToolbar\" md-theme=\"{{triSkin.elements.toolbar}}\" ui-view=\"toolbar\" ng-class=\"[layout.toolbarSize,layout.toolbarClass]\"></md-toolbar>\n\n        <!-- scrollable content -->\n        <md-content ng-class=\"layout.contentClass\" flex tri-default-content ui-view=\"content\"></md-content>\n\n        <div ui-view=\"belowContent\"></div>\n    </div>\n\n    <!-- right sidebar -->\n    <md-sidenav layout layout-fill class=\"md-sidenav-right md-whiteframe-z2\" md-component-id=\"notifications\" ui-view=\"sidebarRight\"></md-sidenav>\n</div>\n");
$templateCache.put("app/triangular/layouts/states/triangular/triangular.tmpl.html","<!-- left sidebar -->\n<md-sidenav md-colors=\"{ background: \'primary\' }\" class=\"triangular-sidenav-left md-sidenav-left hide-scrollbars md-whiteframe-z2\" ng-if=\"layout.sideMenuSize !== \'off\'\" md-component-id=\"left\" md-is-locked-open=\"layout.sideMenuSize !== \'hidden\' && $mdMedia(\'gt-sm\')\" ui-view=\"sidebarLeft\" ng-class=\"{ \'admin-sidebar-collapsed\': layout.sideMenuSize == \'icon\' }\" ng-mouseover=\"stateController.activateHover()\" ng-mouseleave=\"stateController.removeHover()\"></md-sidenav>\n\n<!-- main content -->\n<div class=\"triangular-toolbar-and-content\" layout=\"column\" flex>\n\n    <!-- top toolbar -->\n    <md-toolbar class=\"triangular-toolbar md-whiteframe-z1\" ng-if=\"layout.showToolbar\" ng-class=\"[layout.toolbarSize,layout.toolbarClass]\" md-theme=\"{{triSkin.elements.toolbar}}\" ui-view=\"toolbar\"></md-toolbar>\n\n    <!-- scrollable content -->\n    <md-content class=\"triangular-content\" ng-class=\"layout.contentClass\" flex ui-view></md-content>\n\n    <div ui-view=\"belowContent\"></div>\n\n    <div class=\"triangular-loader\" ng-show=\"stateController.showLoader\" layout=\"column\" ui-view=\"loader\"></div>\n</div>\n\n<!-- right sidebar -->\n<md-sidenav layout layout-fill class=\"triangular-sidenav-right md-sidenav-right md-whiteframe-z2\" md-component-id=\"notifications\" ui-view=\"sidebarRight\"></md-sidenav>\n");}]);