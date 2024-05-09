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
                                <span class="icon ion-ios-paper"></span>README
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
                                            'data-bs-target="#controllers-links-module-AppModule-301234cb2cc681e1659c34ea9343035c3406fcb918e2384909deb3a8444fcedfd7889319fd0c57410e51c3ec859e279b68ac13a0f85876a82ec9a6e1d4af0ff3"' : 'data-bs-target="#xs-controllers-links-module-AppModule-301234cb2cc681e1659c34ea9343035c3406fcb918e2384909deb3a8444fcedfd7889319fd0c57410e51c3ec859e279b68ac13a0f85876a82ec9a6e1d4af0ff3"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-301234cb2cc681e1659c34ea9343035c3406fcb918e2384909deb3a8444fcedfd7889319fd0c57410e51c3ec859e279b68ac13a0f85876a82ec9a6e1d4af0ff3"' :
                                            'id="xs-controllers-links-module-AppModule-301234cb2cc681e1659c34ea9343035c3406fcb918e2384909deb3a8444fcedfd7889319fd0c57410e51c3ec859e279b68ac13a0f85876a82ec9a6e1d4af0ff3"' }>
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
                                            'data-bs-target="#controllers-links-module-AuthModule-fbd053ff2b63a4bdf12b9845f5b3c0978c3ab07b12cf3e77d67cfa459dc10542f02da4a66cf9fb8dfefdcfac10635f19da95ce98fb26b128a2e3b7c98bd88435"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-fbd053ff2b63a4bdf12b9845f5b3c0978c3ab07b12cf3e77d67cfa459dc10542f02da4a66cf9fb8dfefdcfac10635f19da95ce98fb26b128a2e3b7c98bd88435"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-fbd053ff2b63a4bdf12b9845f5b3c0978c3ab07b12cf3e77d67cfa459dc10542f02da4a66cf9fb8dfefdcfac10635f19da95ce98fb26b128a2e3b7c98bd88435"' :
                                            'id="xs-controllers-links-module-AuthModule-fbd053ff2b63a4bdf12b9845f5b3c0978c3ab07b12cf3e77d67cfa459dc10542f02da4a66cf9fb8dfefdcfac10635f19da95ce98fb26b128a2e3b7c98bd88435"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-fbd053ff2b63a4bdf12b9845f5b3c0978c3ab07b12cf3e77d67cfa459dc10542f02da4a66cf9fb8dfefdcfac10635f19da95ce98fb26b128a2e3b7c98bd88435"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-fbd053ff2b63a4bdf12b9845f5b3c0978c3ab07b12cf3e77d67cfa459dc10542f02da4a66cf9fb8dfefdcfac10635f19da95ce98fb26b128a2e3b7c98bd88435"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-fbd053ff2b63a4bdf12b9845f5b3c0978c3ab07b12cf3e77d67cfa459dc10542f02da4a66cf9fb8dfefdcfac10635f19da95ce98fb26b128a2e3b7c98bd88435"' :
                                        'id="xs-injectables-links-module-AuthModule-fbd053ff2b63a4bdf12b9845f5b3c0978c3ab07b12cf3e77d67cfa459dc10542f02da4a66cf9fb8dfefdcfac10635f19da95ce98fb26b128a2e3b7c98bd88435"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
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
                                            'data-bs-target="#controllers-links-module-CommentModule-d2fc1e53d721363c98f22136ae4f893f4b1bf39aa5f6346afc927ab9b4b5ed266029b95c10f0f0ea30fcbf5aa7573629fae421fcb9457cffb836702627498adf"' : 'data-bs-target="#xs-controllers-links-module-CommentModule-d2fc1e53d721363c98f22136ae4f893f4b1bf39aa5f6346afc927ab9b4b5ed266029b95c10f0f0ea30fcbf5aa7573629fae421fcb9457cffb836702627498adf"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CommentModule-d2fc1e53d721363c98f22136ae4f893f4b1bf39aa5f6346afc927ab9b4b5ed266029b95c10f0f0ea30fcbf5aa7573629fae421fcb9457cffb836702627498adf"' :
                                            'id="xs-controllers-links-module-CommentModule-d2fc1e53d721363c98f22136ae4f893f4b1bf39aa5f6346afc927ab9b4b5ed266029b95c10f0f0ea30fcbf5aa7573629fae421fcb9457cffb836702627498adf"' }>
                                            <li class="link">
                                                <a href="controllers/CommentController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CommentController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CommentModule-d2fc1e53d721363c98f22136ae4f893f4b1bf39aa5f6346afc927ab9b4b5ed266029b95c10f0f0ea30fcbf5aa7573629fae421fcb9457cffb836702627498adf"' : 'data-bs-target="#xs-injectables-links-module-CommentModule-d2fc1e53d721363c98f22136ae4f893f4b1bf39aa5f6346afc927ab9b4b5ed266029b95c10f0f0ea30fcbf5aa7573629fae421fcb9457cffb836702627498adf"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CommentModule-d2fc1e53d721363c98f22136ae4f893f4b1bf39aa5f6346afc927ab9b4b5ed266029b95c10f0f0ea30fcbf5aa7573629fae421fcb9457cffb836702627498adf"' :
                                        'id="xs-injectables-links-module-CommentModule-d2fc1e53d721363c98f22136ae4f893f4b1bf39aa5f6346afc927ab9b4b5ed266029b95c10f0f0ea30fcbf5aa7573629fae421fcb9457cffb836702627498adf"' }>
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
                                            'data-bs-target="#controllers-links-module-DisqusModule-4281c2b819387f1ff0cb61f970f0965d8ad80200d00e234e09157d5cfca4cf65589bd5649ed1d58ca186484766e7c9e6247076e533ba2193c188f2733c7dfe04"' : 'data-bs-target="#xs-controllers-links-module-DisqusModule-4281c2b819387f1ff0cb61f970f0965d8ad80200d00e234e09157d5cfca4cf65589bd5649ed1d58ca186484766e7c9e6247076e533ba2193c188f2733c7dfe04"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-DisqusModule-4281c2b819387f1ff0cb61f970f0965d8ad80200d00e234e09157d5cfca4cf65589bd5649ed1d58ca186484766e7c9e6247076e533ba2193c188f2733c7dfe04"' :
                                            'id="xs-controllers-links-module-DisqusModule-4281c2b819387f1ff0cb61f970f0965d8ad80200d00e234e09157d5cfca4cf65589bd5649ed1d58ca186484766e7c9e6247076e533ba2193c188f2733c7dfe04"' }>
                                            <li class="link">
                                                <a href="controllers/DisqusController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DisqusController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-DisqusModule-4281c2b819387f1ff0cb61f970f0965d8ad80200d00e234e09157d5cfca4cf65589bd5649ed1d58ca186484766e7c9e6247076e533ba2193c188f2733c7dfe04"' : 'data-bs-target="#xs-injectables-links-module-DisqusModule-4281c2b819387f1ff0cb61f970f0965d8ad80200d00e234e09157d5cfca4cf65589bd5649ed1d58ca186484766e7c9e6247076e533ba2193c188f2733c7dfe04"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-DisqusModule-4281c2b819387f1ff0cb61f970f0965d8ad80200d00e234e09157d5cfca4cf65589bd5649ed1d58ca186484766e7c9e6247076e533ba2193c188f2733c7dfe04"' :
                                        'id="xs-injectables-links-module-DisqusModule-4281c2b819387f1ff0cb61f970f0965d8ad80200d00e234e09157d5cfca4cf65589bd5649ed1d58ca186484766e7c9e6247076e533ba2193c188f2733c7dfe04"' }>
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
                                <a href="modules/ExpansionModule.html" data-type="entity-link" >ExpansionModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ExpansionModule-ec255f1ced7d5659a9cc76032873205f381c09f03395005aa7aff7a8eb3ff16021b59a99c369e464c44e2934c43223ba587a84923aa93ccf48f9fa66d065f995"' : 'data-bs-target="#xs-controllers-links-module-ExpansionModule-ec255f1ced7d5659a9cc76032873205f381c09f03395005aa7aff7a8eb3ff16021b59a99c369e464c44e2934c43223ba587a84923aa93ccf48f9fa66d065f995"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ExpansionModule-ec255f1ced7d5659a9cc76032873205f381c09f03395005aa7aff7a8eb3ff16021b59a99c369e464c44e2934c43223ba587a84923aa93ccf48f9fa66d065f995"' :
                                            'id="xs-controllers-links-module-ExpansionModule-ec255f1ced7d5659a9cc76032873205f381c09f03395005aa7aff7a8eb3ff16021b59a99c369e464c44e2934c43223ba587a84923aa93ccf48f9fa66d065f995"' }>
                                            <li class="link">
                                                <a href="controllers/ExpansionController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExpansionController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ExpansionModule-ec255f1ced7d5659a9cc76032873205f381c09f03395005aa7aff7a8eb3ff16021b59a99c369e464c44e2934c43223ba587a84923aa93ccf48f9fa66d065f995"' : 'data-bs-target="#xs-injectables-links-module-ExpansionModule-ec255f1ced7d5659a9cc76032873205f381c09f03395005aa7aff7a8eb3ff16021b59a99c369e464c44e2934c43223ba587a84923aa93ccf48f9fa66d065f995"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ExpansionModule-ec255f1ced7d5659a9cc76032873205f381c09f03395005aa7aff7a8eb3ff16021b59a99c369e464c44e2934c43223ba587a84923aa93ccf48f9fa66d065f995"' :
                                        'id="xs-injectables-links-module-ExpansionModule-ec255f1ced7d5659a9cc76032873205f381c09f03395005aa7aff7a8eb3ff16021b59a99c369e464c44e2934c43223ba587a84923aa93ccf48f9fa66d065f995"' }>
                                        <li class="link">
                                            <a href="injectables/DBBackupService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DBBackupService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/StatisticService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StatisticService</a>
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
                                        'data-bs-target="#injectables-links-module-HelperModule-309970ca22a927660bf81ea847ff658135570231c2c585e1e6654d44a36f62dc0c95eaace84524eba8a0b3772c6117c4dbd3f215bd111226ff5002a11a0e5db5"' : 'data-bs-target="#xs-injectables-links-module-HelperModule-309970ca22a927660bf81ea847ff658135570231c2c585e1e6654d44a36f62dc0c95eaace84524eba8a0b3772c6117c4dbd3f215bd111226ff5002a11a0e5db5"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-HelperModule-309970ca22a927660bf81ea847ff658135570231c2c585e1e6654d44a36f62dc0c95eaace84524eba8a0b3772c6117c4dbd3f215bd111226ff5002a11a0e5db5"' :
                                        'id="xs-injectables-links-module-HelperModule-309970ca22a927660bf81ea847ff658135570231c2c585e1e6654d44a36f62dc0c95eaace84524eba8a0b3772c6117c4dbd3f215bd111226ff5002a11a0e5db5"' }>
                                        <li class="link">
                                            <a href="injectables/AWSService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AWSService</a>
                                        </li>
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
                                            <a href="injectables/SeoService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SeoService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/OptionModule.html" data-type="entity-link" >OptionModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-OptionModule-94abf8cc40bed7f23aad9555d30538ef6390913db7b8fb9653f672f0abc745f3dcc9918d5a143cad2ffd8ed9d8630aaee825b358eb2f86c08c5e3ad29bdbcf3b"' : 'data-bs-target="#xs-controllers-links-module-OptionModule-94abf8cc40bed7f23aad9555d30538ef6390913db7b8fb9653f672f0abc745f3dcc9918d5a143cad2ffd8ed9d8630aaee825b358eb2f86c08c5e3ad29bdbcf3b"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-OptionModule-94abf8cc40bed7f23aad9555d30538ef6390913db7b8fb9653f672f0abc745f3dcc9918d5a143cad2ffd8ed9d8630aaee825b358eb2f86c08c5e3ad29bdbcf3b"' :
                                            'id="xs-controllers-links-module-OptionModule-94abf8cc40bed7f23aad9555d30538ef6390913db7b8fb9653f672f0abc745f3dcc9918d5a143cad2ffd8ed9d8630aaee825b358eb2f86c08c5e3ad29bdbcf3b"' }>
                                            <li class="link">
                                                <a href="controllers/OptionController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OptionController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-OptionModule-94abf8cc40bed7f23aad9555d30538ef6390913db7b8fb9653f672f0abc745f3dcc9918d5a143cad2ffd8ed9d8630aaee825b358eb2f86c08c5e3ad29bdbcf3b"' : 'data-bs-target="#xs-injectables-links-module-OptionModule-94abf8cc40bed7f23aad9555d30538ef6390913db7b8fb9653f672f0abc745f3dcc9918d5a143cad2ffd8ed9d8630aaee825b358eb2f86c08c5e3ad29bdbcf3b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-OptionModule-94abf8cc40bed7f23aad9555d30538ef6390913db7b8fb9653f672f0abc745f3dcc9918d5a143cad2ffd8ed9d8630aaee825b358eb2f86c08c5e3ad29bdbcf3b"' :
                                        'id="xs-injectables-links-module-OptionModule-94abf8cc40bed7f23aad9555d30538ef6390913db7b8fb9653f672f0abc745f3dcc9918d5a143cad2ffd8ed9d8630aaee825b358eb2f86c08c5e3ad29bdbcf3b"' }>
                                        <li class="link">
                                            <a href="injectables/OptionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OptionService</a>
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
                                            'data-bs-target="#controllers-links-module-VoteModule-77b86ed6da3338b7a7513113e6ae3852031a4c69e692525a876912d3086df7792c6e9ab7791847d2f9d043fe8a914de412a641e4bfcf69d5a0f387bae6415569"' : 'data-bs-target="#xs-controllers-links-module-VoteModule-77b86ed6da3338b7a7513113e6ae3852031a4c69e692525a876912d3086df7792c6e9ab7791847d2f9d043fe8a914de412a641e4bfcf69d5a0f387bae6415569"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-VoteModule-77b86ed6da3338b7a7513113e6ae3852031a4c69e692525a876912d3086df7792c6e9ab7791847d2f9d043fe8a914de412a641e4bfcf69d5a0f387bae6415569"' :
                                            'id="xs-controllers-links-module-VoteModule-77b86ed6da3338b7a7513113e6ae3852031a4c69e692525a876912d3086df7792c6e9ab7791847d2f9d043fe8a914de412a641e4bfcf69d5a0f387bae6415569"' }>
                                            <li class="link">
                                                <a href="controllers/VoteController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VoteController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-VoteModule-77b86ed6da3338b7a7513113e6ae3852031a4c69e692525a876912d3086df7792c6e9ab7791847d2f9d043fe8a914de412a641e4bfcf69d5a0f387bae6415569"' : 'data-bs-target="#xs-injectables-links-module-VoteModule-77b86ed6da3338b7a7513113e6ae3852031a4c69e692525a876912d3086df7792c6e9ab7791847d2f9d043fe8a914de412a641e4bfcf69d5a0f387bae6415569"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-VoteModule-77b86ed6da3338b7a7513113e6ae3852031a4c69e692525a876912d3086df7792c6e9ab7791847d2f9d043fe8a914de412a641e4bfcf69d5a0f387bae6415569"' :
                                        'id="xs-injectables-links-module-VoteModule-77b86ed6da3338b7a7513113e6ae3852031a4c69e692525a876912d3086df7792c6e9ab7791847d2f9d043fe8a914de412a641e4bfcf69d5a0f387bae6415569"' }>
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
                                <a href="classes/Announcement.html" data-type="entity-link" >Announcement</a>
                            </li>
                            <li class="link">
                                <a href="classes/AnnouncementPaginateQueryDTO.html" data-type="entity-link" >AnnouncementPaginateQueryDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/AnnouncementsDTO.html" data-type="entity-link" >AnnouncementsDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppMeta.html" data-type="entity-link" >AppMeta</a>
                            </li>
                            <li class="link">
                                <a href="classes/Article.html" data-type="entity-link" >Article</a>
                            </li>
                            <li class="link">
                                <a href="classes/ArticleCalendarQueryDTO.html" data-type="entity-link" >ArticleCalendarQueryDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ArticleIDsDTO.html" data-type="entity-link" >ArticleIDsDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ArticleMeta.html" data-type="entity-link" >ArticleMeta</a>
                            </li>
                            <li class="link">
                                <a href="classes/ArticlePaginateQueryDTO.html" data-type="entity-link" >ArticlePaginateQueryDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ArticlesStateDTO.html" data-type="entity-link" >ArticlesStateDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/Auth.html" data-type="entity-link" >Auth</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthLoginDTO.html" data-type="entity-link" >AuthLoginDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/Author.html" data-type="entity-link" >Author</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthUpdateDTO.html" data-type="entity-link" >AuthUpdateDTO</a>
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
                                <a href="classes/CommentsStateDTO.html" data-type="entity-link" >CommentsStateDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommentVoteDTO.html" data-type="entity-link" >CommentVoteDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CustomError.html" data-type="entity-link" >CustomError</a>
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
                                <a href="classes/HttpBadRequestError.html" data-type="entity-link" >HttpBadRequestError</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpExceptionFilter.html" data-type="entity-link" >HttpExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpForbiddenError.html" data-type="entity-link" >HttpForbiddenError</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpUnauthorizedError.html" data-type="entity-link" >HttpUnauthorizedError</a>
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
                                <a href="classes/PostVoteDTO.html" data-type="entity-link" >PostVoteDTO</a>
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
                                <a href="classes/ValidationError.html" data-type="entity-link" >ValidationError</a>
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
                                    <a href="injectables/AdminMaybeGuard.html" data-type="entity-link" >AdminMaybeGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AdminOnlyGuard.html" data-type="entity-link" >AdminOnlyGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AkismetService.html" data-type="entity-link" >AkismetService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AWSService.html" data-type="entity-link" >AWSService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CacheInterceptor.html" data-type="entity-link" >CacheInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CorsMiddleware.html" data-type="entity-link" >CorsMiddleware</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EmailService.html" data-type="entity-link" >EmailService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ErrorInterceptor.html" data-type="entity-link" >ErrorInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExposePipe.html" data-type="entity-link" >ExposePipe</a>
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
                                    <a href="injectables/OriginMiddleware.html" data-type="entity-link" >OriginMiddleware</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PermissionPipe.html" data-type="entity-link" >PermissionPipe</a>
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
                                <a href="interfaces/CacheBaseOptions.html" data-type="entity-link" >CacheBaseOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CacheIntervalOptions.html" data-type="entity-link" >CacheIntervalOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CacheManualResult.html" data-type="entity-link" >CacheManualResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CacheOptions.html" data-type="entity-link" >CacheOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CacheScheduleOptions.html" data-type="entity-link" >CacheScheduleOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DecoratorCreatorOption.html" data-type="entity-link" >DecoratorCreatorOption</a>
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
                                <a href="interfaces/GuestRequestOption.html" data-type="entity-link" >GuestRequestOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HandleOption.html" data-type="entity-link" >HandleOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HttpPaginateResult.html" data-type="entity-link" >HttpPaginateResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HttpResponseBase.html" data-type="entity-link" >HttpResponseBase</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPLocation.html" data-type="entity-link" >IPLocation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoggerOptions.html" data-type="entity-link" >LoggerOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoggerRenderOptions.html" data-type="entity-link" >LoggerRenderOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PaginateModel.html" data-type="entity-link" >PaginateModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PaginateOptions.html" data-type="entity-link" >PaginateOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PaginateResult.html" data-type="entity-link" >PaginateResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QueryCookies.html" data-type="entity-link" >QueryCookies</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QueryParamsResult.html" data-type="entity-link" >QueryParamsResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QueryVisitor.html" data-type="entity-link" >QueryVisitor</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RedisStoreOptions.html" data-type="entity-link" >RedisStoreOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Request.html" data-type="entity-link" >Request</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RequestParams.html" data-type="entity-link" >RequestParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ResponserOptions.html" data-type="entity-link" >ResponserOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TokenResult.html" data-type="entity-link" >TokenResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TypegooseClass.html" data-type="entity-link" >TypegooseClass</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UploadResult.html" data-type="entity-link" >UploadResult</a>
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
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});