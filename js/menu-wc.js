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
                                            'data-bs-target="#controllers-links-module-AdminModule-643474275ac2a1d22f85a810e23f22390a12dc552b782786009d2e2d54ff2f722a1a020af88f6699e16fb32d49b3674a9d2975439ac5f9970a3e735e8d1c5116"' : 'data-bs-target="#xs-controllers-links-module-AdminModule-643474275ac2a1d22f85a810e23f22390a12dc552b782786009d2e2d54ff2f722a1a020af88f6699e16fb32d49b3674a9d2975439ac5f9970a3e735e8d1c5116"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AdminModule-643474275ac2a1d22f85a810e23f22390a12dc552b782786009d2e2d54ff2f722a1a020af88f6699e16fb32d49b3674a9d2975439ac5f9970a3e735e8d1c5116"' :
                                            'id="xs-controllers-links-module-AdminModule-643474275ac2a1d22f85a810e23f22390a12dc552b782786009d2e2d54ff2f722a1a020af88f6699e16fb32d49b3674a9d2975439ac5f9970a3e735e8d1c5116"' }>
                                            <li class="link">
                                                <a href="controllers/AdminController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AdminModule-643474275ac2a1d22f85a810e23f22390a12dc552b782786009d2e2d54ff2f722a1a020af88f6699e16fb32d49b3674a9d2975439ac5f9970a3e735e8d1c5116"' : 'data-bs-target="#xs-injectables-links-module-AdminModule-643474275ac2a1d22f85a810e23f22390a12dc552b782786009d2e2d54ff2f722a1a020af88f6699e16fb32d49b3674a9d2975439ac5f9970a3e735e8d1c5116"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AdminModule-643474275ac2a1d22f85a810e23f22390a12dc552b782786009d2e2d54ff2f722a1a020af88f6699e16fb32d49b3674a9d2975439ac5f9970a3e735e8d1c5116"' :
                                        'id="xs-injectables-links-module-AdminModule-643474275ac2a1d22f85a810e23f22390a12dc552b782786009d2e2d54ff2f722a1a020af88f6699e16fb32d49b3674a9d2975439ac5f9970a3e735e8d1c5116"' }>
                                        <li class="link">
                                            <a href="injectables/AdminService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminService</a>
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
                                            'data-bs-target="#controllers-links-module-AppModule-1d69e6191291873105bc418c3df27d6167466002cd76cbadeb145e4e8c889c9d0639e321a2c9aa70ef29f7b8b2d57b49656c67ccf40993a0e72f434678ce1cd1"' : 'data-bs-target="#xs-controllers-links-module-AppModule-1d69e6191291873105bc418c3df27d6167466002cd76cbadeb145e4e8c889c9d0639e321a2c9aa70ef29f7b8b2d57b49656c67ccf40993a0e72f434678ce1cd1"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-1d69e6191291873105bc418c3df27d6167466002cd76cbadeb145e4e8c889c9d0639e321a2c9aa70ef29f7b8b2d57b49656c67ccf40993a0e72f434678ce1cd1"' :
                                            'id="xs-controllers-links-module-AppModule-1d69e6191291873105bc418c3df27d6167466002cd76cbadeb145e4e8c889c9d0639e321a2c9aa70ef29f7b8b2d57b49656c67ccf40993a0e72f434678ce1cd1"' }>
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
                                            'data-bs-target="#controllers-links-module-ArticleModule-4c2a37f9ac549d5046ebcdf3c5605005f59c697d495fdd8f7d580e72e2482e1f59289ad5094b3f7da865471ca5e600b3247fe542cd3045f81b2f6dff60ca18d3"' : 'data-bs-target="#xs-controllers-links-module-ArticleModule-4c2a37f9ac549d5046ebcdf3c5605005f59c697d495fdd8f7d580e72e2482e1f59289ad5094b3f7da865471ca5e600b3247fe542cd3045f81b2f6dff60ca18d3"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ArticleModule-4c2a37f9ac549d5046ebcdf3c5605005f59c697d495fdd8f7d580e72e2482e1f59289ad5094b3f7da865471ca5e600b3247fe542cd3045f81b2f6dff60ca18d3"' :
                                            'id="xs-controllers-links-module-ArticleModule-4c2a37f9ac549d5046ebcdf3c5605005f59c697d495fdd8f7d580e72e2482e1f59289ad5094b3f7da865471ca5e600b3247fe542cd3045f81b2f6dff60ca18d3"' }>
                                            <li class="link">
                                                <a href="controllers/ArticleController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ArticleController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ArticleModule-4c2a37f9ac549d5046ebcdf3c5605005f59c697d495fdd8f7d580e72e2482e1f59289ad5094b3f7da865471ca5e600b3247fe542cd3045f81b2f6dff60ca18d3"' : 'data-bs-target="#xs-injectables-links-module-ArticleModule-4c2a37f9ac549d5046ebcdf3c5605005f59c697d495fdd8f7d580e72e2482e1f59289ad5094b3f7da865471ca5e600b3247fe542cd3045f81b2f6dff60ca18d3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ArticleModule-4c2a37f9ac549d5046ebcdf3c5605005f59c697d495fdd8f7d580e72e2482e1f59289ad5094b3f7da865471ca5e600b3247fe542cd3045f81b2f6dff60ca18d3"' :
                                        'id="xs-injectables-links-module-ArticleModule-4c2a37f9ac549d5046ebcdf3c5605005f59c697d495fdd8f7d580e72e2482e1f59289ad5094b3f7da865471ca5e600b3247fe542cd3045f81b2f6dff60ca18d3"' }>
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
                                        'data-bs-target="#injectables-links-module-CacheModule-1bfb92b262e654a93f67aebc9f8adbe91f5beaa0ddcfc0ab7762094db6686c0336e0f2093fbc853bf972769c655d00a9ba14bf46f81bae8c3bb2f090ba631db2"' : 'data-bs-target="#xs-injectables-links-module-CacheModule-1bfb92b262e654a93f67aebc9f8adbe91f5beaa0ddcfc0ab7762094db6686c0336e0f2093fbc853bf972769c655d00a9ba14bf46f81bae8c3bb2f090ba631db2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CacheModule-1bfb92b262e654a93f67aebc9f8adbe91f5beaa0ddcfc0ab7762094db6686c0336e0f2093fbc853bf972769c655d00a9ba14bf46f81bae8c3bb2f090ba631db2"' :
                                        'id="xs-injectables-links-module-CacheModule-1bfb92b262e654a93f67aebc9f8adbe91f5beaa0ddcfc0ab7762094db6686c0336e0f2093fbc853bf972769c655d00a9ba14bf46f81bae8c3bb2f090ba631db2"' }>
                                        <li class="link">
                                            <a href="injectables/CacheService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CacheService</a>
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
                                            'data-bs-target="#controllers-links-module-CommentModule-29ee9f7f9469c61629f4e161cb8ae98a9e0be63bd1d00bd8ea5073c8f297ceb483b58758a51d7b9c3c6647548019639cd5997a2b1aa95f67fe14b6d457880876"' : 'data-bs-target="#xs-controllers-links-module-CommentModule-29ee9f7f9469c61629f4e161cb8ae98a9e0be63bd1d00bd8ea5073c8f297ceb483b58758a51d7b9c3c6647548019639cd5997a2b1aa95f67fe14b6d457880876"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CommentModule-29ee9f7f9469c61629f4e161cb8ae98a9e0be63bd1d00bd8ea5073c8f297ceb483b58758a51d7b9c3c6647548019639cd5997a2b1aa95f67fe14b6d457880876"' :
                                            'id="xs-controllers-links-module-CommentModule-29ee9f7f9469c61629f4e161cb8ae98a9e0be63bd1d00bd8ea5073c8f297ceb483b58758a51d7b9c3c6647548019639cd5997a2b1aa95f67fe14b6d457880876"' }>
                                            <li class="link">
                                                <a href="controllers/CommentController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CommentController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CommentModule-29ee9f7f9469c61629f4e161cb8ae98a9e0be63bd1d00bd8ea5073c8f297ceb483b58758a51d7b9c3c6647548019639cd5997a2b1aa95f67fe14b6d457880876"' : 'data-bs-target="#xs-injectables-links-module-CommentModule-29ee9f7f9469c61629f4e161cb8ae98a9e0be63bd1d00bd8ea5073c8f297ceb483b58758a51d7b9c3c6647548019639cd5997a2b1aa95f67fe14b6d457880876"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CommentModule-29ee9f7f9469c61629f4e161cb8ae98a9e0be63bd1d00bd8ea5073c8f297ceb483b58758a51d7b9c3c6647548019639cd5997a2b1aa95f67fe14b6d457880876"' :
                                        'id="xs-injectables-links-module-CommentModule-29ee9f7f9469c61629f4e161cb8ae98a9e0be63bd1d00bd8ea5073c8f297ceb483b58758a51d7b9c3c6647548019639cd5997a2b1aa95f67fe14b6d457880876"' }>
                                        <li class="link">
                                            <a href="injectables/CommentService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CommentService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DatabaseModule.html" data-type="entity-link" >DatabaseModule</a>
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
                                            'data-bs-target="#controllers-links-module-FeedbackModule-1515f28560c78b8560560e46f606c11aa17a57f960a7747c1b36bb095531f04cf0023fd820b577d87748e0a41bfb4bd0a418078365a5717ca2a1d37dab81f74e"' : 'data-bs-target="#xs-controllers-links-module-FeedbackModule-1515f28560c78b8560560e46f606c11aa17a57f960a7747c1b36bb095531f04cf0023fd820b577d87748e0a41bfb4bd0a418078365a5717ca2a1d37dab81f74e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-FeedbackModule-1515f28560c78b8560560e46f606c11aa17a57f960a7747c1b36bb095531f04cf0023fd820b577d87748e0a41bfb4bd0a418078365a5717ca2a1d37dab81f74e"' :
                                            'id="xs-controllers-links-module-FeedbackModule-1515f28560c78b8560560e46f606c11aa17a57f960a7747c1b36bb095531f04cf0023fd820b577d87748e0a41bfb4bd0a418078365a5717ca2a1d37dab81f74e"' }>
                                            <li class="link">
                                                <a href="controllers/FeedbackController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FeedbackController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-FeedbackModule-1515f28560c78b8560560e46f606c11aa17a57f960a7747c1b36bb095531f04cf0023fd820b577d87748e0a41bfb4bd0a418078365a5717ca2a1d37dab81f74e"' : 'data-bs-target="#xs-injectables-links-module-FeedbackModule-1515f28560c78b8560560e46f606c11aa17a57f960a7747c1b36bb095531f04cf0023fd820b577d87748e0a41bfb4bd0a418078365a5717ca2a1d37dab81f74e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-FeedbackModule-1515f28560c78b8560560e46f606c11aa17a57f960a7747c1b36bb095531f04cf0023fd820b577d87748e0a41bfb4bd0a418078365a5717ca2a1d37dab81f74e"' :
                                        'id="xs-injectables-links-module-FeedbackModule-1515f28560c78b8560560e46f606c11aa17a57f960a7747c1b36bb095531f04cf0023fd820b577d87748e0a41bfb4bd0a418078365a5717ca2a1d37dab81f74e"' }>
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
                                        'data-bs-target="#injectables-links-module-HelperModule-2cec61fb8ee80028523c3340a54540361b53147e89f46cef0ec438c9b5772c7942ecceb1cecdf175b74a68ac10ad75547f7305e0a9f76b778194fbd7541028a2"' : 'data-bs-target="#xs-injectables-links-module-HelperModule-2cec61fb8ee80028523c3340a54540361b53147e89f46cef0ec438c9b5772c7942ecceb1cecdf175b74a68ac10ad75547f7305e0a9f76b778194fbd7541028a2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-HelperModule-2cec61fb8ee80028523c3340a54540361b53147e89f46cef0ec438c9b5772c7942ecceb1cecdf175b74a68ac10ad75547f7305e0a9f76b778194fbd7541028a2"' :
                                        'id="xs-injectables-links-module-HelperModule-2cec61fb8ee80028523c3340a54540361b53147e89f46cef0ec438c9b5772c7942ecceb1cecdf175b74a68ac10ad75547f7305e0a9f76b778194fbd7541028a2"' }>
                                        <li class="link">
                                            <a href="injectables/AkismetService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AkismetService</a>
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
                                <a href="interfaces/CacheScheduleOptions.html" data-type="entity-link" >CacheScheduleOptions</a>
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