'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">NodePress documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                        <li class="link">
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AdminModule.html" data-type="entity-link" >AdminModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AdminModule-24b2e9c03cf8b75d5d14a902ec9b6eb1f301ecdfbda65bd40d55277f14444ea353e377cc45bf7c2d4a295371951353e530159e2d6a5ef33d48dd6ae0ff051ecd"' : 'data-bs-target="#xs-controllers-links-module-AdminModule-24b2e9c03cf8b75d5d14a902ec9b6eb1f301ecdfbda65bd40d55277f14444ea353e377cc45bf7c2d4a295371951353e530159e2d6a5ef33d48dd6ae0ff051ecd"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AdminModule-24b2e9c03cf8b75d5d14a902ec9b6eb1f301ecdfbda65bd40d55277f14444ea353e377cc45bf7c2d4a295371951353e530159e2d6a5ef33d48dd6ae0ff051ecd"' :
                                            'id="xs-controllers-links-module-AdminModule-24b2e9c03cf8b75d5d14a902ec9b6eb1f301ecdfbda65bd40d55277f14444ea353e377cc45bf7c2d4a295371951353e530159e2d6a5ef33d48dd6ae0ff051ecd"' }>
                                            <li class="link">
                                                <a href="controllers/AdminController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AdminModule-24b2e9c03cf8b75d5d14a902ec9b6eb1f301ecdfbda65bd40d55277f14444ea353e377cc45bf7c2d4a295371951353e530159e2d6a5ef33d48dd6ae0ff051ecd"' : 'data-bs-target="#xs-injectables-links-module-AdminModule-24b2e9c03cf8b75d5d14a902ec9b6eb1f301ecdfbda65bd40d55277f14444ea353e377cc45bf7c2d4a295371951353e530159e2d6a5ef33d48dd6ae0ff051ecd"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AdminModule-24b2e9c03cf8b75d5d14a902ec9b6eb1f301ecdfbda65bd40d55277f14444ea353e377cc45bf7c2d4a295371951353e530159e2d6a5ef33d48dd6ae0ff051ecd"' :
                                        'id="xs-injectables-links-module-AdminModule-24b2e9c03cf8b75d5d14a902ec9b6eb1f301ecdfbda65bd40d55277f14444ea353e377cc45bf7c2d4a295371951353e530159e2d6a5ef33d48dd6ae0ff051ecd"' }>
                                        <li class="link">
                                            <a href="injectables/AdminListener.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminListener</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AdminService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AiModule.html" data-type="entity-link" >AiModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AiModule-64b1894928eded6945f0908faf5b9a1d6230af1f5951fc32de95ef88c0023ea1f4f3a32aef5af3529d33d15d211bd30053304329f6c7cb344b16440e3d172030"' : 'data-bs-target="#xs-controllers-links-module-AiModule-64b1894928eded6945f0908faf5b9a1d6230af1f5951fc32de95ef88c0023ea1f4f3a32aef5af3529d33d15d211bd30053304329f6c7cb344b16440e3d172030"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AiModule-64b1894928eded6945f0908faf5b9a1d6230af1f5951fc32de95ef88c0023ea1f4f3a32aef5af3529d33d15d211bd30053304329f6c7cb344b16440e3d172030"' :
                                            'id="xs-controllers-links-module-AiModule-64b1894928eded6945f0908faf5b9a1d6230af1f5951fc32de95ef88c0023ea1f4f3a32aef5af3529d33d15d211bd30053304329f6c7cb344b16440e3d172030"' }>
                                            <li class="link">
                                                <a href="controllers/AiController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AiController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AiModule-64b1894928eded6945f0908faf5b9a1d6230af1f5951fc32de95ef88c0023ea1f4f3a32aef5af3529d33d15d211bd30053304329f6c7cb344b16440e3d172030"' : 'data-bs-target="#xs-injectables-links-module-AiModule-64b1894928eded6945f0908faf5b9a1d6230af1f5951fc32de95ef88c0023ea1f4f3a32aef5af3529d33d15d211bd30053304329f6c7cb344b16440e3d172030"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AiModule-64b1894928eded6945f0908faf5b9a1d6230af1f5951fc32de95ef88c0023ea1f4f3a32aef5af3529d33d15d211bd30053304329f6c7cb344b16440e3d172030"' :
                                        'id="xs-injectables-links-module-AiModule-64b1894928eded6945f0908faf5b9a1d6230af1f5951fc32de95ef88c0023ea1f4f3a32aef5af3529d33d15d211bd30053304329f6c7cb344b16440e3d172030"' }>
                                        <li class="link">
                                            <a href="injectables/AiListener.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AiListener</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AiService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AiService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AnnouncementModule.html" data-type="entity-link" >AnnouncementModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AnnouncementModule-df825db0209c59c5df807ac2ffdfc30fee549aa78c4ae790cada98c3bdf34792a3228d8541a06c5e8763d916d6c65ab6977ec43e784bfe2aa8e38459d65b45ce"' : 'data-bs-target="#xs-controllers-links-module-AnnouncementModule-df825db0209c59c5df807ac2ffdfc30fee549aa78c4ae790cada98c3bdf34792a3228d8541a06c5e8763d916d6c65ab6977ec43e784bfe2aa8e38459d65b45ce"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AnnouncementModule-df825db0209c59c5df807ac2ffdfc30fee549aa78c4ae790cada98c3bdf34792a3228d8541a06c5e8763d916d6c65ab6977ec43e784bfe2aa8e38459d65b45ce"' :
                                            'id="xs-controllers-links-module-AnnouncementModule-df825db0209c59c5df807ac2ffdfc30fee549aa78c4ae790cada98c3bdf34792a3228d8541a06c5e8763d916d6c65ab6977ec43e784bfe2aa8e38459d65b45ce"' }>
                                            <li class="link">
                                                <a href="controllers/AnnouncementController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AnnouncementController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AnnouncementModule-df825db0209c59c5df807ac2ffdfc30fee549aa78c4ae790cada98c3bdf34792a3228d8541a06c5e8763d916d6c65ab6977ec43e784bfe2aa8e38459d65b45ce"' : 'data-bs-target="#xs-injectables-links-module-AnnouncementModule-df825db0209c59c5df807ac2ffdfc30fee549aa78c4ae790cada98c3bdf34792a3228d8541a06c5e8763d916d6c65ab6977ec43e784bfe2aa8e38459d65b45ce"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AnnouncementModule-df825db0209c59c5df807ac2ffdfc30fee549aa78c4ae790cada98c3bdf34792a3228d8541a06c5e8763d916d6c65ab6977ec43e784bfe2aa8e38459d65b45ce"' :
                                        'id="xs-injectables-links-module-AnnouncementModule-df825db0209c59c5df807ac2ffdfc30fee549aa78c4ae790cada98c3bdf34792a3228d8541a06c5e8763d916d6c65ab6977ec43e784bfe2aa8e38459d65b45ce"' }>
                                        <li class="link">
                                            <a href="injectables/AnnouncementService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AnnouncementService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-b88ba8ddad9bc502a6fcbfa7932442593caf6362d40cde7719f1f0e934fec714ba0875c02652222afd02bfd3adddaf7590f596bb285acc674243e8dd92969f95"' : 'data-bs-target="#xs-controllers-links-module-AppModule-b88ba8ddad9bc502a6fcbfa7932442593caf6362d40cde7719f1f0e934fec714ba0875c02652222afd02bfd3adddaf7590f596bb285acc674243e8dd92969f95"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-b88ba8ddad9bc502a6fcbfa7932442593caf6362d40cde7719f1f0e934fec714ba0875c02652222afd02bfd3adddaf7590f596bb285acc674243e8dd92969f95"' :
                                            'id="xs-controllers-links-module-AppModule-b88ba8ddad9bc502a6fcbfa7932442593caf6362d40cde7719f1f0e934fec714ba0875c02652222afd02bfd3adddaf7590f596bb285acc674243e8dd92969f95"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ArchiveModule.html" data-type="entity-link" >ArchiveModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ArchiveModule-b0b66b2ece09e377605ec64f1abf3523d7b56f94cc904a7b9c68ab87e04fcd204ef4b38c812ddd6aa2bcdf09a4729b5df956896909940fafa0c1dc914559286d"' : 'data-bs-target="#xs-controllers-links-module-ArchiveModule-b0b66b2ece09e377605ec64f1abf3523d7b56f94cc904a7b9c68ab87e04fcd204ef4b38c812ddd6aa2bcdf09a4729b5df956896909940fafa0c1dc914559286d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ArchiveModule-b0b66b2ece09e377605ec64f1abf3523d7b56f94cc904a7b9c68ab87e04fcd204ef4b38c812ddd6aa2bcdf09a4729b5df956896909940fafa0c1dc914559286d"' :
                                            'id="xs-controllers-links-module-ArchiveModule-b0b66b2ece09e377605ec64f1abf3523d7b56f94cc904a7b9c68ab87e04fcd204ef4b38c812ddd6aa2bcdf09a4729b5df956896909940fafa0c1dc914559286d"' }>
                                            <li class="link">
                                                <a href="controllers/ArchiveController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ArchiveController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ArchiveModule-b0b66b2ece09e377605ec64f1abf3523d7b56f94cc904a7b9c68ab87e04fcd204ef4b38c812ddd6aa2bcdf09a4729b5df956896909940fafa0c1dc914559286d"' : 'data-bs-target="#xs-injectables-links-module-ArchiveModule-b0b66b2ece09e377605ec64f1abf3523d7b56f94cc904a7b9c68ab87e04fcd204ef4b38c812ddd6aa2bcdf09a4729b5df956896909940fafa0c1dc914559286d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ArchiveModule-b0b66b2ece09e377605ec64f1abf3523d7b56f94cc904a7b9c68ab87e04fcd204ef4b38c812ddd6aa2bcdf09a4729b5df956896909940fafa0c1dc914559286d"' :
                                        'id="xs-injectables-links-module-ArchiveModule-b0b66b2ece09e377605ec64f1abf3523d7b56f94cc904a7b9c68ab87e04fcd204ef4b38c812ddd6aa2bcdf09a4729b5df956896909940fafa0c1dc914559286d"' }>
                                        <li class="link">
                                            <a href="injectables/ArchiveService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ArchiveService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ArticleModule.html" data-type="entity-link" >ArticleModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ArticleModule-baa4a8fe7a28b91e0fa5f174722606d40c4aef6840bee41a05c0cc2563cebc8bb46aeabf7a4ecdf325e29e7fdfe349810142040a602822556f58658f1947abfa"' : 'data-bs-target="#xs-controllers-links-module-ArticleModule-baa4a8fe7a28b91e0fa5f174722606d40c4aef6840bee41a05c0cc2563cebc8bb46aeabf7a4ecdf325e29e7fdfe349810142040a602822556f58658f1947abfa"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ArticleModule-baa4a8fe7a28b91e0fa5f174722606d40c4aef6840bee41a05c0cc2563cebc8bb46aeabf7a4ecdf325e29e7fdfe349810142040a602822556f58658f1947abfa"' :
                                            'id="xs-controllers-links-module-ArticleModule-baa4a8fe7a28b91e0fa5f174722606d40c4aef6840bee41a05c0cc2563cebc8bb46aeabf7a4ecdf325e29e7fdfe349810142040a602822556f58658f1947abfa"' }>
                                            <li class="link">
                                                <a href="controllers/ArticleController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ArticleController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ArticleModule-baa4a8fe7a28b91e0fa5f174722606d40c4aef6840bee41a05c0cc2563cebc8bb46aeabf7a4ecdf325e29e7fdfe349810142040a602822556f58658f1947abfa"' : 'data-bs-target="#xs-injectables-links-module-ArticleModule-baa4a8fe7a28b91e0fa5f174722606d40c4aef6840bee41a05c0cc2563cebc8bb46aeabf7a4ecdf325e29e7fdfe349810142040a602822556f58658f1947abfa"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ArticleModule-baa4a8fe7a28b91e0fa5f174722606d40c4aef6840bee41a05c0cc2563cebc8bb46aeabf7a4ecdf325e29e7fdfe349810142040a602822556f58658f1947abfa"' :
                                        'id="xs-injectables-links-module-ArticleModule-baa4a8fe7a28b91e0fa5f174722606d40c4aef6840bee41a05c0cc2563cebc8bb46aeabf7a4ecdf325e29e7fdfe349810142040a602822556f58658f1947abfa"' }>
                                        <li class="link">
                                            <a href="injectables/ArticleListener.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ArticleListener</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ArticleService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ArticleService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-a5d902e18596ea0628535522ecfa459dbe3f2fa7514716911c3ba12f4d0e55c68b4c9aeac6fc9acdd7463bce5f033c96a5a72ce794070d8147a6d41ef7d3d0cf"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-a5d902e18596ea0628535522ecfa459dbe3f2fa7514716911c3ba12f4d0e55c68b4c9aeac6fc9acdd7463bce5f033c96a5a72ce794070d8147a6d41ef7d3d0cf"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-a5d902e18596ea0628535522ecfa459dbe3f2fa7514716911c3ba12f4d0e55c68b4c9aeac6fc9acdd7463bce5f033c96a5a72ce794070d8147a6d41ef7d3d0cf"' :
                                        'id="xs-injectables-links-module-AuthModule-a5d902e18596ea0628535522ecfa459dbe3f2fa7514716911c3ba12f4d0e55c68b4c9aeac6fc9acdd7463bce5f033c96a5a72ce794070d8147a6d41ef7d3d0cf"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CacheModule.html" data-type="entity-link" >CacheModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CacheModule-d47b88de9a42b0c1c67f71e0c66ca77288902d2d2f8dadaaca30d193ffb094b397c058d9bc071c4bdaaed0cd9833d248856fcb33f3c1bb239e44a57d27fe7ba9"' : 'data-bs-target="#xs-injectables-links-module-CacheModule-d47b88de9a42b0c1c67f71e0c66ca77288902d2d2f8dadaaca30d193ffb094b397c058d9bc071c4bdaaed0cd9833d248856fcb33f3c1bb239e44a57d27fe7ba9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CacheModule-d47b88de9a42b0c1c67f71e0c66ca77288902d2d2f8dadaaca30d193ffb094b397c058d9bc071c4bdaaed0cd9833d248856fcb33f3c1bb239e44a57d27fe7ba9"' :
                                        'id="xs-injectables-links-module-CacheModule-d47b88de9a42b0c1c67f71e0c66ca77288902d2d2f8dadaaca30d193ffb094b397c058d9bc071c4bdaaed0cd9833d248856fcb33f3c1bb239e44a57d27fe7ba9"' }>
                                        <li class="link">
                                            <a href="injectables/CacheService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CacheService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RedisListener.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RedisListener</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RedisService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RedisService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CategoryModule.html" data-type="entity-link" >CategoryModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-CategoryModule-abfe14eb06cc50d0ce734dcaa0d2ceb8db784144be63facc0d4e67ce323028cec27b9b1ae888f2ee98d2e870de7874e3cb5a4bb4c4b49b7a9f9bc78f039f2696"' : 'data-bs-target="#xs-controllers-links-module-CategoryModule-abfe14eb06cc50d0ce734dcaa0d2ceb8db784144be63facc0d4e67ce323028cec27b9b1ae888f2ee98d2e870de7874e3cb5a4bb4c4b49b7a9f9bc78f039f2696"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CategoryModule-abfe14eb06cc50d0ce734dcaa0d2ceb8db784144be63facc0d4e67ce323028cec27b9b1ae888f2ee98d2e870de7874e3cb5a4bb4c4b49b7a9f9bc78f039f2696"' :
                                            'id="xs-controllers-links-module-CategoryModule-abfe14eb06cc50d0ce734dcaa0d2ceb8db784144be63facc0d4e67ce323028cec27b9b1ae888f2ee98d2e870de7874e3cb5a4bb4c4b49b7a9f9bc78f039f2696"' }>
                                            <li class="link">
                                                <a href="controllers/CategoryController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CategoryController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CategoryModule-abfe14eb06cc50d0ce734dcaa0d2ceb8db784144be63facc0d4e67ce323028cec27b9b1ae888f2ee98d2e870de7874e3cb5a4bb4c4b49b7a9f9bc78f039f2696"' : 'data-bs-target="#xs-injectables-links-module-CategoryModule-abfe14eb06cc50d0ce734dcaa0d2ceb8db784144be63facc0d4e67ce323028cec27b9b1ae888f2ee98d2e870de7874e3cb5a4bb4c4b49b7a9f9bc78f039f2696"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CategoryModule-abfe14eb06cc50d0ce734dcaa0d2ceb8db784144be63facc0d4e67ce323028cec27b9b1ae888f2ee98d2e870de7874e3cb5a4bb4c4b49b7a9f9bc78f039f2696"' :
                                        'id="xs-injectables-links-module-CategoryModule-abfe14eb06cc50d0ce734dcaa0d2ceb8db784144be63facc0d4e67ce323028cec27b9b1ae888f2ee98d2e870de7874e3cb5a4bb4c4b49b7a9f9bc78f039f2696"' }>
                                        <li class="link">
                                            <a href="injectables/CategoryService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CategoryService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CommentModule.html" data-type="entity-link" >CommentModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-CommentModule-b284cc3d2c7bde47195d8af0631da52fe66b8b1e15afe189dd7e47745cc29175c452f3b82bee3abba4faa540f2963ec1e622cc4a0546e812ed7197c65487bc75"' : 'data-bs-target="#xs-controllers-links-module-CommentModule-b284cc3d2c7bde47195d8af0631da52fe66b8b1e15afe189dd7e47745cc29175c452f3b82bee3abba4faa540f2963ec1e622cc4a0546e812ed7197c65487bc75"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CommentModule-b284cc3d2c7bde47195d8af0631da52fe66b8b1e15afe189dd7e47745cc29175c452f3b82bee3abba4faa540f2963ec1e622cc4a0546e812ed7197c65487bc75"' :
                                            'id="xs-controllers-links-module-CommentModule-b284cc3d2c7bde47195d8af0631da52fe66b8b1e15afe189dd7e47745cc29175c452f3b82bee3abba4faa540f2963ec1e622cc4a0546e812ed7197c65487bc75"' }>
                                            <li class="link">
                                                <a href="controllers/CommentController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CommentController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CommentModule-b284cc3d2c7bde47195d8af0631da52fe66b8b1e15afe189dd7e47745cc29175c452f3b82bee3abba4faa540f2963ec1e622cc4a0546e812ed7197c65487bc75"' : 'data-bs-target="#xs-injectables-links-module-CommentModule-b284cc3d2c7bde47195d8af0631da52fe66b8b1e15afe189dd7e47745cc29175c452f3b82bee3abba4faa540f2963ec1e622cc4a0546e812ed7197c65487bc75"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CommentModule-b284cc3d2c7bde47195d8af0631da52fe66b8b1e15afe189dd7e47745cc29175c452f3b82bee3abba4faa540f2963ec1e622cc4a0546e812ed7197c65487bc75"' :
                                        'id="xs-injectables-links-module-CommentModule-b284cc3d2c7bde47195d8af0631da52fe66b8b1e15afe189dd7e47745cc29175c452f3b82bee3abba4faa540f2963ec1e622cc4a0546e812ed7197c65487bc75"' }>
                                        <li class="link">
                                            <a href="injectables/CommentListener.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CommentListener</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CommentService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CommentService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DatabaseModule.html" data-type="entity-link" >DatabaseModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-DatabaseModule-5ba946085e23c339b37bc37984e9213679ccac74bce2d61b09a77bf220da40bee3dccbae646c87ee3ea1f9d18739715ae8a6972a74cfb4ffe193223b24049024"' : 'data-bs-target="#xs-injectables-links-module-DatabaseModule-5ba946085e23c339b37bc37984e9213679ccac74bce2d61b09a77bf220da40bee3dccbae646c87ee3ea1f9d18739715ae8a6972a74cfb4ffe193223b24049024"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-DatabaseModule-5ba946085e23c339b37bc37984e9213679ccac74bce2d61b09a77bf220da40bee3dccbae646c87ee3ea1f9d18739715ae8a6972a74cfb4ffe193223b24049024"' :
                                        'id="xs-injectables-links-module-DatabaseModule-5ba946085e23c339b37bc37984e9213679ccac74bce2d61b09a77bf220da40bee3dccbae646c87ee3ea1f9d18739715ae8a6972a74cfb4ffe193223b24049024"' }>
                                        <li class="link">
                                            <a href="injectables/DatabaseListener.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DatabaseListener</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DisqusModule.html" data-type="entity-link" >DisqusModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-DisqusModule-9de6331a5d61b112ed6c7a26cae17d70641bbfa80feac20a7191074e202a8d1b31a3159e4671a26a297c3b8093345ceba4c5fc7be7ef450b63480c78c200b7f3"' : 'data-bs-target="#xs-controllers-links-module-DisqusModule-9de6331a5d61b112ed6c7a26cae17d70641bbfa80feac20a7191074e202a8d1b31a3159e4671a26a297c3b8093345ceba4c5fc7be7ef450b63480c78c200b7f3"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-DisqusModule-9de6331a5d61b112ed6c7a26cae17d70641bbfa80feac20a7191074e202a8d1b31a3159e4671a26a297c3b8093345ceba4c5fc7be7ef450b63480c78c200b7f3"' :
                                            'id="xs-controllers-links-module-DisqusModule-9de6331a5d61b112ed6c7a26cae17d70641bbfa80feac20a7191074e202a8d1b31a3159e4671a26a297c3b8093345ceba4c5fc7be7ef450b63480c78c200b7f3"' }>
                                            <li class="link">
                                                <a href="controllers/DisqusController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DisqusController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-DisqusModule-9de6331a5d61b112ed6c7a26cae17d70641bbfa80feac20a7191074e202a8d1b31a3159e4671a26a297c3b8093345ceba4c5fc7be7ef450b63480c78c200b7f3"' : 'data-bs-target="#xs-injectables-links-module-DisqusModule-9de6331a5d61b112ed6c7a26cae17d70641bbfa80feac20a7191074e202a8d1b31a3159e4671a26a297c3b8093345ceba4c5fc7be7ef450b63480c78c200b7f3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-DisqusModule-9de6331a5d61b112ed6c7a26cae17d70641bbfa80feac20a7191074e202a8d1b31a3159e4671a26a297c3b8093345ceba4c5fc7be7ef450b63480c78c200b7f3"' :
                                        'id="xs-injectables-links-module-DisqusModule-9de6331a5d61b112ed6c7a26cae17d70641bbfa80feac20a7191074e202a8d1b31a3159e4671a26a297c3b8093345ceba4c5fc7be7ef450b63480c78c200b7f3"' }>
                                        <li class="link">
                                            <a href="injectables/DisqusPrivateService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DisqusPrivateService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DisqusPublicService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DisqusPublicService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/FeedbackModule.html" data-type="entity-link" >FeedbackModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-FeedbackModule-de4a933f460b6f45ed49c87773063b7e46a644c6d5c80b50ca308b316c15ded0919a71f69b4075f66d6d43266cdc35188529b9f8dd462e7108f4d4cfbb3ddd06"' : 'data-bs-target="#xs-controllers-links-module-FeedbackModule-de4a933f460b6f45ed49c87773063b7e46a644c6d5c80b50ca308b316c15ded0919a71f69b4075f66d6d43266cdc35188529b9f8dd462e7108f4d4cfbb3ddd06"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-FeedbackModule-de4a933f460b6f45ed49c87773063b7e46a644c6d5c80b50ca308b316c15ded0919a71f69b4075f66d6d43266cdc35188529b9f8dd462e7108f4d4cfbb3ddd06"' :
                                            'id="xs-controllers-links-module-FeedbackModule-de4a933f460b6f45ed49c87773063b7e46a644c6d5c80b50ca308b316c15ded0919a71f69b4075f66d6d43266cdc35188529b9f8dd462e7108f4d4cfbb3ddd06"' }>
                                            <li class="link">
                                                <a href="controllers/FeedbackController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FeedbackController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-FeedbackModule-de4a933f460b6f45ed49c87773063b7e46a644c6d5c80b50ca308b316c15ded0919a71f69b4075f66d6d43266cdc35188529b9f8dd462e7108f4d4cfbb3ddd06"' : 'data-bs-target="#xs-injectables-links-module-FeedbackModule-de4a933f460b6f45ed49c87773063b7e46a644c6d5c80b50ca308b316c15ded0919a71f69b4075f66d6d43266cdc35188529b9f8dd462e7108f4d4cfbb3ddd06"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-FeedbackModule-de4a933f460b6f45ed49c87773063b7e46a644c6d5c80b50ca308b316c15ded0919a71f69b4075f66d6d43266cdc35188529b9f8dd462e7108f4d4cfbb3ddd06"' :
                                        'id="xs-injectables-links-module-FeedbackModule-de4a933f460b6f45ed49c87773063b7e46a644c6d5c80b50ca308b316c15ded0919a71f69b4075f66d6d43266cdc35188529b9f8dd462e7108f4d4cfbb3ddd06"' }>
                                        <li class="link">
                                            <a href="injectables/FeedbackListener.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FeedbackListener</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FeedbackService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FeedbackService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/HelperModule.html" data-type="entity-link" >HelperModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-HelperModule-fb3aee93276a0f5b7dd7af75d01fa415b0bbdeec6bf1be97f75e1e53f6abebf418b5e67f6528212e2442a33b9d8f411e619b61bb9eeaad27e79f517dc3eecfcc"' : 'data-bs-target="#xs-injectables-links-module-HelperModule-fb3aee93276a0f5b7dd7af75d01fa415b0bbdeec6bf1be97f75e1e53f6abebf418b5e67f6528212e2442a33b9d8f411e619b61bb9eeaad27e79f517dc3eecfcc"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-HelperModule-fb3aee93276a0f5b7dd7af75d01fa415b0bbdeec6bf1be97f75e1e53f6abebf418b5e67f6528212e2442a33b9d8f411e619b61bb9eeaad27e79f517dc3eecfcc"' :
                                        'id="xs-injectables-links-module-HelperModule-fb3aee93276a0f5b7dd7af75d01fa415b0bbdeec6bf1be97f75e1e53f6abebf418b5e67f6528212e2442a33b9d8f411e619b61bb9eeaad27e79f517dc3eecfcc"' }>
                                        <li class="link">
                                            <a href="injectables/AkismetService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AkismetService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CounterService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CounterService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EmailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GoogleService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GoogleService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/IPService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IPService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/S3Service.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >S3Service</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SeoService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SeoService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/OptionsModule.html" data-type="entity-link" >OptionsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-OptionsModule-0c56ac8b7c085bfa209c3c683b2f22cb9a2882c0f80b64ee52219ad28441858bd875cb4f551a0afa12466e5b62136d746f8e7c959dddc7187678580f3a1dbad1"' : 'data-bs-target="#xs-controllers-links-module-OptionsModule-0c56ac8b7c085bfa209c3c683b2f22cb9a2882c0f80b64ee52219ad28441858bd875cb4f551a0afa12466e5b62136d746f8e7c959dddc7187678580f3a1dbad1"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-OptionsModule-0c56ac8b7c085bfa209c3c683b2f22cb9a2882c0f80b64ee52219ad28441858bd875cb4f551a0afa12466e5b62136d746f8e7c959dddc7187678580f3a1dbad1"' :
                                            'id="xs-controllers-links-module-OptionsModule-0c56ac8b7c085bfa209c3c683b2f22cb9a2882c0f80b64ee52219ad28441858bd875cb4f551a0afa12466e5b62136d746f8e7c959dddc7187678580f3a1dbad1"' }>
                                            <li class="link">
                                                <a href="controllers/OptionsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OptionsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-OptionsModule-0c56ac8b7c085bfa209c3c683b2f22cb9a2882c0f80b64ee52219ad28441858bd875cb4f551a0afa12466e5b62136d746f8e7c959dddc7187678580f3a1dbad1"' : 'data-bs-target="#xs-injectables-links-module-OptionsModule-0c56ac8b7c085bfa209c3c683b2f22cb9a2882c0f80b64ee52219ad28441858bd875cb4f551a0afa12466e5b62136d746f8e7c959dddc7187678580f3a1dbad1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-OptionsModule-0c56ac8b7c085bfa209c3c683b2f22cb9a2882c0f80b64ee52219ad28441858bd875cb4f551a0afa12466e5b62136d746f8e7c959dddc7187678580f3a1dbad1"' :
                                        'id="xs-injectables-links-module-OptionsModule-0c56ac8b7c085bfa209c3c683b2f22cb9a2882c0f80b64ee52219ad28441858bd875cb4f551a0afa12466e5b62136d746f8e7c959dddc7187678580f3a1dbad1"' }>
                                        <li class="link">
                                            <a href="injectables/OptionsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OptionsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SystemModule.html" data-type="entity-link" >SystemModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-SystemModule-9875ffd91f7e1c6a9ee56d54ab071a18509925189e820d34e720d03b8c3cb6433fe07ccf68d7bcaf333c43f79ecffa5c0cdf885c558ba5d74454dbd0af0b573e"' : 'data-bs-target="#xs-controllers-links-module-SystemModule-9875ffd91f7e1c6a9ee56d54ab071a18509925189e820d34e720d03b8c3cb6433fe07ccf68d7bcaf333c43f79ecffa5c0cdf885c558ba5d74454dbd0af0b573e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-SystemModule-9875ffd91f7e1c6a9ee56d54ab071a18509925189e820d34e720d03b8c3cb6433fe07ccf68d7bcaf333c43f79ecffa5c0cdf885c558ba5d74454dbd0af0b573e"' :
                                            'id="xs-controllers-links-module-SystemModule-9875ffd91f7e1c6a9ee56d54ab071a18509925189e820d34e720d03b8c3cb6433fe07ccf68d7bcaf333c43f79ecffa5c0cdf885c558ba5d74454dbd0af0b573e"' }>
                                            <li class="link">
                                                <a href="controllers/SystemController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SystemController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-SystemModule-9875ffd91f7e1c6a9ee56d54ab071a18509925189e820d34e720d03b8c3cb6433fe07ccf68d7bcaf333c43f79ecffa5c0cdf885c558ba5d74454dbd0af0b573e"' : 'data-bs-target="#xs-injectables-links-module-SystemModule-9875ffd91f7e1c6a9ee56d54ab071a18509925189e820d34e720d03b8c3cb6433fe07ccf68d7bcaf333c43f79ecffa5c0cdf885c558ba5d74454dbd0af0b573e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SystemModule-9875ffd91f7e1c6a9ee56d54ab071a18509925189e820d34e720d03b8c3cb6433fe07ccf68d7bcaf333c43f79ecffa5c0cdf885c558ba5d74454dbd0af0b573e"' :
                                        'id="xs-injectables-links-module-SystemModule-9875ffd91f7e1c6a9ee56d54ab071a18509925189e820d34e720d03b8c3cb6433fe07ccf68d7bcaf333c43f79ecffa5c0cdf885c558ba5d74454dbd0af0b573e"' }>
                                        <li class="link">
                                            <a href="injectables/DBBackupService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DBBackupService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/StatisticsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StatisticsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TagModule.html" data-type="entity-link" >TagModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-TagModule-fcdc676b43270adb4c1b889c467ea0065c4d25c3183b8c9725d5ae8a5b616a8477deb40af02cfa59acdc148d7544e1e405bb51afedf2172f921405fbfa3aac28"' : 'data-bs-target="#xs-controllers-links-module-TagModule-fcdc676b43270adb4c1b889c467ea0065c4d25c3183b8c9725d5ae8a5b616a8477deb40af02cfa59acdc148d7544e1e405bb51afedf2172f921405fbfa3aac28"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-TagModule-fcdc676b43270adb4c1b889c467ea0065c4d25c3183b8c9725d5ae8a5b616a8477deb40af02cfa59acdc148d7544e1e405bb51afedf2172f921405fbfa3aac28"' :
                                            'id="xs-controllers-links-module-TagModule-fcdc676b43270adb4c1b889c467ea0065c4d25c3183b8c9725d5ae8a5b616a8477deb40af02cfa59acdc148d7544e1e405bb51afedf2172f921405fbfa3aac28"' }>
                                            <li class="link">
                                                <a href="controllers/TagController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TagController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TagModule-fcdc676b43270adb4c1b889c467ea0065c4d25c3183b8c9725d5ae8a5b616a8477deb40af02cfa59acdc148d7544e1e405bb51afedf2172f921405fbfa3aac28"' : 'data-bs-target="#xs-injectables-links-module-TagModule-fcdc676b43270adb4c1b889c467ea0065c4d25c3183b8c9725d5ae8a5b616a8477deb40af02cfa59acdc148d7544e1e405bb51afedf2172f921405fbfa3aac28"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TagModule-fcdc676b43270adb4c1b889c467ea0065c4d25c3183b8c9725d5ae8a5b616a8477deb40af02cfa59acdc148d7544e1e405bb51afedf2172f921405fbfa3aac28"' :
                                        'id="xs-injectables-links-module-TagModule-fcdc676b43270adb4c1b889c467ea0065c4d25c3183b8c9725d5ae8a5b616a8477deb40af02cfa59acdc148d7544e1e405bb51afedf2172f921405fbfa3aac28"' }>
                                        <li class="link">
                                            <a href="injectables/TagService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TagService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/VoteModule.html" data-type="entity-link" >VoteModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-VoteModule-753e14a49074bed47fd194b9c151705011466b8021265af2118f4602448d53bce1b1eac256b6307531d015dd409594b209a508c855f8c1018535ba4450cddd3c"' : 'data-bs-target="#xs-controllers-links-module-VoteModule-753e14a49074bed47fd194b9c151705011466b8021265af2118f4602448d53bce1b1eac256b6307531d015dd409594b209a508c855f8c1018535ba4450cddd3c"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-VoteModule-753e14a49074bed47fd194b9c151705011466b8021265af2118f4602448d53bce1b1eac256b6307531d015dd409594b209a508c855f8c1018535ba4450cddd3c"' :
                                            'id="xs-controllers-links-module-VoteModule-753e14a49074bed47fd194b9c151705011466b8021265af2118f4602448d53bce1b1eac256b6307531d015dd409594b209a508c855f8c1018535ba4450cddd3c"' }>
                                            <li class="link">
                                                <a href="controllers/VoteController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VoteController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-VoteModule-753e14a49074bed47fd194b9c151705011466b8021265af2118f4602448d53bce1b1eac256b6307531d015dd409594b209a508c855f8c1018535ba4450cddd3c"' : 'data-bs-target="#xs-injectables-links-module-VoteModule-753e14a49074bed47fd194b9c151705011466b8021265af2118f4602448d53bce1b1eac256b6307531d015dd409594b209a508c855f8c1018535ba4450cddd3c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-VoteModule-753e14a49074bed47fd194b9c151705011466b8021265af2118f4602448d53bce1b1eac256b6307531d015dd409594b209a508c855f8c1018535ba4450cddd3c"' :
                                        'id="xs-injectables-links-module-VoteModule-753e14a49074bed47fd194b9c151705011466b8021265af2118f4602448d53bce1b1eac256b6307531d015dd409594b209a508c855f8c1018535ba4450cddd3c"' }>
                                        <li class="link">
                                            <a href="injectables/VoteService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VoteService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/WebhookModule.html" data-type="entity-link" >WebhookModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-WebhookModule-0b96511d5ad4f7da002a2e5ec85de8cdf49acf63853c0069c4e96e1d0ae0ac9bdc59a8ea62f2ed199d25d8c66e9c745aea4f84780b77229e6a0b291ca4be86b6"' : 'data-bs-target="#xs-injectables-links-module-WebhookModule-0b96511d5ad4f7da002a2e5ec85de8cdf49acf63853c0069c4e96e1d0ae0ac9bdc59a8ea62f2ed199d25d8c66e9c745aea4f84780b77229e6a0b291ca4be86b6"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-WebhookModule-0b96511d5ad4f7da002a2e5ec85de8cdf49acf63853c0069c4e96e1d0ae0ac9bdc59a8ea62f2ed199d25d8c66e9c745aea4f84780b77229e6a0b291ca4be86b6"' :
                                        'id="xs-injectables-links-module-WebhookModule-0b96511d5ad4f7da002a2e5ec85de8cdf49acf63853c0069c4e96e1d0ae0ac9bdc59a8ea62f2ed199d25d8c66e9c745aea4f84780b77229e6a0b291ca4be86b6"' }>
                                        <li class="link">
                                            <a href="injectables/WebhookListener.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WebhookListener</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/WebhookService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WebhookService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link" >AppController</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Admin.html" data-type="entity-link" >Admin</a>
                            </li>
                            <li class="link">
                                <a href="classes/AdminUpdateDTO.html" data-type="entity-link" >AdminUpdateDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/AiGenerateResult.html" data-type="entity-link" >AiGenerateResult</a>
                            </li>
                            <li class="link">
                                <a href="classes/Announcement.html" data-type="entity-link" >Announcement</a>
                            </li>
                            <li class="link">
                                <a href="classes/AnnouncementPaginateQueryDTO.html" data-type="entity-link" >AnnouncementPaginateQueryDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/AnnouncementsDTO.html" data-type="entity-link" >AnnouncementsDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/Article.html" data-type="entity-link" >Article</a>
                            </li>
                            <li class="link">
                                <a href="classes/ArticleCalendarQueryDTO.html" data-type="entity-link" >ArticleCalendarQueryDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ArticleIdsDTO.html" data-type="entity-link" >ArticleIdsDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ArticlePaginateQueryDTO.html" data-type="entity-link" >ArticlePaginateQueryDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ArticlesStatusDTO.html" data-type="entity-link" >ArticlesStatusDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ArticleStats.html" data-type="entity-link" >ArticleStats</a>
                            </li>
                            <li class="link">
                                <a href="classes/ArticleVoteDTO.html" data-type="entity-link" >ArticleVoteDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthLoginDTO.html" data-type="entity-link" >AuthLoginDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/Author.html" data-type="entity-link" >Author</a>
                            </li>
                            <li class="link">
                                <a href="classes/Blocklist.html" data-type="entity-link" >Blocklist</a>
                            </li>
                            <li class="link">
                                <a href="classes/BooleanQueryDTO.html" data-type="entity-link" >BooleanQueryDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CallbackCodeDTO.html" data-type="entity-link" >CallbackCodeDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CategoriesDTO.html" data-type="entity-link" >CategoriesDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/Category.html" data-type="entity-link" >Category</a>
                            </li>
                            <li class="link">
                                <a href="classes/CategoryPaginateQueryDTO.html" data-type="entity-link" >CategoryPaginateQueryDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/Comment.html" data-type="entity-link" >Comment</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommentBase.html" data-type="entity-link" >CommentBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommentCalendarQueryDTO.html" data-type="entity-link" >CommentCalendarQueryDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommentIdDTO.html" data-type="entity-link" >CommentIdDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommentPaginateQueryDTO.html" data-type="entity-link" >CommentPaginateQueryDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommentsDTO.html" data-type="entity-link" >CommentsDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommentsStatusDTO.html" data-type="entity-link" >CommentsStatusDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommentVoteDTO.html" data-type="entity-link" >CommentVoteDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/DateQueryDTO.html" data-type="entity-link" >DateQueryDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/Disqus.html" data-type="entity-link" >Disqus</a>
                            </li>
                            <li class="link">
                                <a href="classes/Feedback.html" data-type="entity-link" >Feedback</a>
                            </li>
                            <li class="link">
                                <a href="classes/FeedbackBase.html" data-type="entity-link" >FeedbackBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/FeedbackPaginateQueryDTO.html" data-type="entity-link" >FeedbackPaginateQueryDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/FeedbacksDTO.html" data-type="entity-link" >FeedbacksDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/FriendLink.html" data-type="entity-link" >FriendLink</a>
                            </li>
                            <li class="link">
                                <a href="classes/GenerateAiArticleContentDTO.html" data-type="entity-link" >GenerateAiArticleContentDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/GenerateAiCommentReplyDTO.html" data-type="entity-link" >GenerateAiCommentReplyDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/GenerateAiContentDTO.html" data-type="entity-link" >GenerateAiContentDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpExceptionFilter.html" data-type="entity-link" >HttpExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/KeyValueModel.html" data-type="entity-link" >KeyValueModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/KeywordQueryDTO.html" data-type="entity-link" >KeywordQueryDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/Option.html" data-type="entity-link" >Option</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginateBaseOptionDTO.html" data-type="entity-link" >PaginateBaseOptionDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginateOptionDTO.html" data-type="entity-link" >PaginateOptionDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginateOptionWithHotSortDTO.html" data-type="entity-link" >PaginateOptionWithHotSortDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/Tag.html" data-type="entity-link" >Tag</a>
                            </li>
                            <li class="link">
                                <a href="classes/TagPaginateQueryDTO.html" data-type="entity-link" >TagPaginateQueryDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/TagsDTO.html" data-type="entity-link" >TagsDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ThreadPostIdDTO.html" data-type="entity-link" >ThreadPostIdDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/Vote.html" data-type="entity-link" >Vote</a>
                            </li>
                            <li class="link">
                                <a href="classes/VoteAuthorDTO.html" data-type="entity-link" >VoteAuthorDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/VotePaginateQueryDTO.html" data-type="entity-link" >VotePaginateQueryDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/VotesDTO.html" data-type="entity-link" >VotesDTO</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AkismetService.html" data-type="entity-link" >AkismetService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CounterService.html" data-type="entity-link" >CounterService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EmailService.html" data-type="entity-link" >EmailService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GoogleService.html" data-type="entity-link" >GoogleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IPService.html" data-type="entity-link" >IPService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoggingInterceptor.html" data-type="entity-link" >LoggingInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MultipartValidationPipe.html" data-type="entity-link" >MultipartValidationPipe</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NoopMiddleware.html" data-type="entity-link" >NoopMiddleware</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PermissionPipe.html" data-type="entity-link" >PermissionPipe</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/S3Service.html" data-type="entity-link" >S3Service</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SeoService.html" data-type="entity-link" >SeoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TransformInterceptor.html" data-type="entity-link" >TransformInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ValidationPipe.html" data-type="entity-link" >ValidationPipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AdminOnlyGuard.html" data-type="entity-link" >AdminOnlyGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/AdminOptionalGuard.html" data-type="entity-link" >AdminOptionalGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AccessToken.html" data-type="entity-link" >AccessToken</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AkismetPayload.html" data-type="entity-link" >AkismetPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ArchiveData.html" data-type="entity-link" >ArchiveData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ArgGetOptions.html" data-type="entity-link" >ArgGetOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CacheBaseOptions.html" data-type="entity-link" >CacheBaseOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CacheIntervalOptions.html" data-type="entity-link" >CacheIntervalOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CacheManualResult.html" data-type="entity-link" >CacheManualResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CommentBaseWithExtras.html" data-type="entity-link" >CommentBaseWithExtras</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CommentCreateFailedEventPayload.html" data-type="entity-link" >CommentCreateFailedEventPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DisqusConfig.html" data-type="entity-link" >DisqusConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EmailOptions.html" data-type="entity-link" >EmailOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FileUploader.html" data-type="entity-link" >FileUploader</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GeneralDisqusParams.html" data-type="entity-link" >GeneralDisqusParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GuestRequestPermission.html" data-type="entity-link" >GuestRequestPermission</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HttpErrorResponse.html" data-type="entity-link" >HttpErrorResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HttpSuccessResponse.html" data-type="entity-link" >HttpSuccessResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPLocation.html" data-type="entity-link" >IPLocation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRequestContext.html" data-type="entity-link" >IRequestContext</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUploadedFile.html" data-type="entity-link" >IUploadedFile</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoggerOptions.html" data-type="entity-link" >LoggerOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoggerRenderOptions.html" data-type="entity-link" >LoggerRenderOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MultipartValidationOptions.html" data-type="entity-link" >MultipartValidationOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PaginateOptions.html" data-type="entity-link" >PaginateOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PaginateResult.html" data-type="entity-link" >PaginateResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PaginationPayload.html" data-type="entity-link" >PaginationPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QueryVisitor.html" data-type="entity-link" >QueryVisitor</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RedisStoreOptions.html" data-type="entity-link" >RedisStoreOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RequestOptions.html" data-type="entity-link" >RequestOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RequestParams.html" data-type="entity-link" >RequestParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/S3FileObject.html" data-type="entity-link" >S3FileObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SuccessResponseOptions.html" data-type="entity-link" >SuccessResponseOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TokenResult.html" data-type="entity-link" >TokenResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TypegooseClass.html" data-type="entity-link" >TypegooseClass</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WebhookPayload.html" data-type="entity-link" >WebhookPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/XMLItemData.html" data-type="entity-link" >XMLItemData</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});