import { throttle, debounce, create, add } from 'lodash';
import utils from '@bigcommerce/stencil-utils';
import './jquery-ui';
import mobileMenuToggleFactory from '../theme/global/mobile-menu-toggle';
import mediaQueryListFactory from '../theme/common/media-query-list';
import { inert } from '../papathemes/utils';

const ENDPOINTS = {
    biotone: '/bio-tone-starter-plus-starter-fertilizer',
    raisedBedMix: '/raised-bed-soil-mix',
    permaTill: '/permatill-permanent-aeration-with-slate',
    jacksClassic: '/jacks-classic-blossom-booster',
    organicPottingMix: '/organic-potting-mix',
};

const isTopInViewport = (elem) => {
    const distance = elem.getBoundingClientRect();
    return (
        distance.top >= 0 &&
        distance.top <=
            (window.innerHeight || document.documentElement.clientHeight)
    );
};

const mediumMediaQueryList = mediaQueryListFactory('medium');

function inhealth() {
    const $shopByCategoryRow = $(
        '[data-layout-name="SHOP BY CATEGORY"] .beautify__calloutIcons ._row'
    );
    const initShopByCategory = () => {
        if (!mediumMediaQueryList.matches) {
            $shopByCategoryRow.not('.slick-initialized').slick({
                arrows: true,
                dots: true,
                mobileFirst: true,
                slidesToScroll: 3,
                slidesToShow: 3,
                lazyLoad: 'progressive',
                // variableWidth: true,
                responsive: [
                    {
                        breakpoint: 551,
                        settings: {
                            slidesToScroll: 4,
                            slidesToShow: 4,
                        },
                    },
                    {
                        breakpoint: 801,
                        settings: 'unslick',
                    },
                ],
            });
        }
    };
    mediumMediaQueryList.addListener(initShopByCategory);
    initShopByCategory();

    // const initMarquee = () => {
    //     const animateEl = (el) => {
    //         const $el = $(el);
    //         if (el.scrollWidth <= $el.width()) {
    //             return;
    //         }
    //         const speed = (el.scrollWidth - $el.scrollLeft() - Math.round($el.outerWidth())) / el.scrollWidth * 8000;
    //         $el.animate({
    //             opacity: 1,
    //         }, 1000, () => {
    //             $el.animate({
    //                 scrollLeft: el.scrollWidth - Math.round($el.outerWidth()),
    //             }, speed, 'linear', () => {
    //                 $el.animate({
    //                     opacity: 0,
    //                 }, 1000, () => {
    //                     $el.scrollLeft(0);
    //                     $el.animate({
    //                         opacity: 1,
    //                     }, 500, () => {
    //                         animateEl(el);
    //                     });
    //                 });
    //             });
    //         });
    //     };
    //     $('[data-marquee]')
    //         .off('mouseenter touchstart mouseleave touchend')
    //         .stop()
    //         .each((i, el) => {
    //             const $el = $(el);
    //             if (el.scrollWidth <= Math.round($el.outerWidth())) {
    //                 return;
    //             }
    //             $el.on('mouseenter touchstart', () => $el.stop());
    //             $el.on('mouseleave touchend', () => animateEl(el));
    //             animateEl(el);
    //         });
    // };
    const animateMarquee = (el) => {
        const $el = $(el);
        if (el.scrollWidth <= Math.round($el.outerWidth()) + 5) {
            return;
        }
        const speed =
            ((el.scrollWidth -
                $el.scrollLeft() -
                Math.round($el.outerWidth())) /
                el.scrollWidth) *
            8000;
        $el.stop().animate(
            {
                opacity: 1,
            },
            1000,
            () => {
                $el.animate(
                    {
                        scrollLeft:
                            el.scrollWidth - Math.round($el.outerWidth()),
                    },
                    speed,
                    'linear',
                    () => {
                        $el.animate(
                            {
                                opacity: 0,
                            },
                            1000,
                            () => {
                                $el.scrollLeft(0);
                                $el.animate(
                                    {
                                        opacity: 1,
                                    },
                                    500,
                                    () => {
                                        animateMarquee(el);
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    };
    $(window).on(
        'resize load',
        debounce(() => {
            $('[data-marquee]')
                .get()
                .filter((el) => isTopInViewport(el))
                .forEach((el) => animateMarquee(el));
        }, 500)
    );
    $('body').on('touchstart', () => {
        $('[data-marquee]').stop();
    });
    $('body').on('touchend', () => {
        $('[data-marquee]')
            .get()
            .filter((el) => isTopInViewport(el))
            .forEach((el) => animateMarquee(el));
    });
}

export default function (context) {
    // const $header = $('.header').first();
    // const $navPagesRootMenuList = $('.navPages-rootMenu-list');
    const $body = $('body');
    const $menuToggle = $('[data-mobile-menu-toggle]');
    const $searchToggle = $('[data-mobile-search-toggle]');
    const $quickSearch = $('.papathemes-quickSearch');
    const mobileMenu = mobileMenuToggleFactory();

    // Init Card Color Swatches
    if (context.card_show_swatches && context.graphQLToken) {
        import('../papathemes/card-swatches/ProductSwatches').then(
            ({ default: ProductSwatches }) =>
                new ProductSwatches({
                    graphQLToken: context.graphQLToken,
                    imageSize: context.productgallery_size,
                    includeOptions: context.card_swatch_name
                        .split(',')
                        .map((s) => s.trim())
                        .filter((s) => s !== ''),
                })
        );
    }

    // const updateHeaderPaddingDependingNavHeight = () => {
    //     const updateFunc = () => {
    //         if (mediumMediaQueryList.matches) {
    //             const height = $navPagesRootMenuList.filter('.is-open').not('.navPages-rootMenu-list--standard').outerHeight() || '';
    //             $header.css('padding-bottom', height);
    //             $('.stickyHeader-placeholder').css('height', $header.outerHeight());
    //         } else {
    //             $header.css('padding-bottom', '');
    //         }
    //     };
    //     updateFunc();
    //     $(window).on('resize', throttle(updateFunc, 300, { leading: false }));
    //     $('.navPages-rootMenu-action[data-collapsible]').on('toggle.collapsible', debounce(updateFunc));
    // };

    const stickyHeader = () => {
        $('[data-sticky-header]')
            .not('.sticky-header-loaded')
            .each((i, el) => {
                const $el = $(el).addClass('sticky-header-loaded', true);
                const $placeholder = $(
                    '<div class="stickyHeader-placeholder"></div>'
                )
                    .show()
                    .css('height', $el.outerHeight())
                    .insertAfter($el);
                let lastScrollTop = 0;

                const onScroll = throttle(
                    (event) => {
                        const st =
                            window.pageYOffset ||
                            document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
                        const headerHeight = $el.outerHeight();
                        const placeholderTop = $placeholder.offset().top;

                        $placeholder.css('height', headerHeight);

                        if (st > lastScrollTop) {
                            // scroll down
                            if (st > placeholderTop + headerHeight) {
                                if (!$el.hasClass('_scrollDown')) {
                                    $el.removeClass('_scrollUp').addClass(
                                        '_scrollDown'
                                    );
                                    $el.one('transitionend', () => {
                                        // still scroll down?
                                        if ($el.hasClass('_scrollDown')) {
                                            const newSt =
                                                window.pageYOffset ||
                                                document.documentElement
                                                    .scrollTop;
                                            $el.addClass('_shadow');
                                            $el.css({
                                                top: newSt - $el.outerHeight(),
                                                position: 'absolute',
                                                transition: 'none',
                                            });
                                            $el.stop().animate({}, 10, () => {
                                                $el.css({
                                                    transition: '',
                                                });
                                            });
                                        }
                                    }).css({
                                        top: -$el.outerHeight(),
                                    });
                                }
                            }
                        } else if (
                            !$body.hasClass('_skipCheckScrollUpStickyHeader')
                        ) {
                            // scroll up
                            // eslint-disable-next-line no-lonely-if
                            if (st > placeholderTop + headerHeight) {
                                $el.removeClass('_scrollDown').addClass(
                                    '_shadow'
                                );
                                if (!$el.hasClass('_scrollUp')) {
                                    $el.addClass('_scrollUp');
                                    $el.css({
                                        top: -$el.outerHeight(),
                                        position: '',
                                        transition: 'none',
                                    });
                                    $el.stop().animate({}, 10, () => {
                                        $el.css({
                                            top: 0,
                                            transition: '',
                                        });
                                    });
                                }
                            } else if (st <= placeholderTop) {
                                $el.removeClass('_shadow _scrollDown').css({
                                    top: '',
                                    position: '',
                                });
                            } else if (
                                $el.hasClass('_shadow') &&
                                $el.offset().top < 0
                            ) {
                                $el.removeClass('_shadow _scrollDown').css({
                                    top: '',
                                    position: '',
                                });
                            }
                        }

                        lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
                    },
                    100,
                    {
                        leading: false,
                    }
                );

                const onResize = throttle(
                    () => {
                        const headerHeight = $el.outerHeight();
                        $placeholder.css('height', headerHeight);
                    },
                    300,
                    {
                        leading: false,
                    }
                );

                $(window).on('scroll', onScroll);
                $(window).on('resize', onResize);
            });
    };

    const onScroll = throttle(
        () => {
            if (
                mediumMediaQueryList.matches &&
                !$body.hasClass('has-quickSearchOpen')
            ) {
                // Auto click the tab when scrolling to a section in viewport on PDP
                $('.productView-description')
                    .get()
                    .map((el) => $(el))
                    .forEach(($el) => {
                        const arr = $el
                            .find('.tab-content')
                            .get()
                            .map((el) => $(el).find('> *:visible').get(0));
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i] && isTopInViewport(arr[i])) {
                                const id = $(arr[i])
                                    .closest('.tab-content')
                                    .attr('id');
                                const $tab = $el
                                    .find(`.tab-title[href="#${id}"]`)
                                    .closest('.tab');
                                if ($tab.not('.is-active')) {
                                    $tab.siblings().removeClass('is-active');
                                    $tab.addClass('is-active');
                                }
                                break;
                            }
                        }
                    });
            }
        },
        500,
        {
            leading: false,
        }
    );

    $menuToggle.on('click', (event) => {
        event.preventDefault();
        $searchToggle.removeClass('is-open');
        $quickSearch.removeClass('is-open');
    });

    $searchToggle.on('click', (event) => {
        event.preventDefault();
        if (mobileMenu.isOpen) {
            mobileMenu.hide();
        }
        $searchToggle.toggleClass('is-open');
        $quickSearch.toggleClass('is-open');
    });

    // updateHeaderPaddingDependingNavHeight();
    stickyHeader();

    $('body').on('click', '[data-toggle]', (event) => {
        event.preventDefault();

        const $el = $(event.currentTarget);
        const id = $el.data('toggle');
        const $otherEls = $(`[data-toggle=${id}]`).not($el);
        const $target = $(`#${id}`);

        $el.toggleClass('is-open');

        if ($el.hasClass('is-open')) {
            $el.attr('aria-expanded', true);
            $target.addClass('is-open');
            $otherEls.addClass('is-open').attr('aria-expanded', true);
            $target.trigger('open.toggle', [$el]);
        } else {
            $el.attr('aria-expanded', false);
            $target.removeClass('is-open');
            $otherEls.removeClass('is-open').attr('aria-expanded', false);
            $target.trigger('close.toggle', [$el]);
        }
    });

    const $sidebarTop = $('#sidebar-top');

    $sidebarTop.on('open.toggle', (event, $toggle) => {
        $('body').addClass('has-sidebarTopOpened');
        // papathemes-inhealth: Accessibility - Make other elements not focusable
        inert($sidebarTop);
        $sidebarTop.data('lastToggle', $toggle);
        $sidebarTop
            .find('a,button[tabindex!="-1"]')
            .first()
            .each((i, el) => el.focus());
    });
    $sidebarTop.on('close.toggle', () => {
        $('body').removeClass('has-sidebarTopOpened');
        // papathemes-inhealth: Accessibility - Make other elements not focusable
        inert($sidebarTop, false);
        const $toggle = $sidebarTop.data('lastToggle');
        if ($toggle) {
            $toggle.get(0).focus();
            $sidebarTop.data('lastToggle', null);
        }
    });

    $(document).on('scroll', onScroll);
    $('body').on('loaded.quickview', () => {
        $('.modal-body.quickView').off('scroll').on('scroll', onScroll);
    });

    // open quick search form on homepage
    // if (!$searchToggle.hasClass('is-open')) {
    //     $searchToggle.trigger('click');
    // }

    const fixMobileMenuShiftedWhenClickCollapsible = () => {
        const $el = $('#bf-fix-menu-mobile');
        const el = $el.get(0);
        let openEl;
        let openElTop;

        $el.on('open.collapsible', (event) => {
            openEl = event.target;
            openElTop = $(openEl).offset().top;
        });

        $el.on('close.collapsible', () => {
            if (mediumMediaQueryList.matches || !openEl) {
                return;
            }
            const relY =
                $(openEl).offset().top - $el.offset().top + el.scrollTop;
            const scrollTop = relY - openElTop + $el.offset().top;
            el.scrollTop = Math.max(0, scrollTop);
        });
    };

    fixMobileMenuShiftedWhenClickCollapsible();

    const initContactFormUrl = () => {
        $('[data-contact-form-url]').each((i, el) => {
            const $el = $(el);

            if ($el.data('contactFormUrlLoaded')) {
                return;
            }

            $el.data('contactFormUrlLoaded', true);

            const url = $el.data('contactFormUrl');
            const template = 'beautify/contact-form-remote';

            utils.api.getPage(
                url,
                {
                    template,
                },
                (err, resp) => {
                    if (err || !resp) {
                        return;
                    }
                    $el.append(resp);
                }
            );
        });
    };

    initContactFormUrl();

    // --------------------------------------------------------------------------------------------
    // Product Card quantity input changes
    // --------------------------------------------------------------------------------------------
    $('body').on('click', '[data-card-quantity-change] button', (event) => {
        event.preventDefault();
        const $target = $(event.currentTarget);
        const $input = $target
            .closest('[data-card-quantity-change]')
            .find('input');
        const quantityMin = parseInt($input.data('quantityMin'), 10);
        const quantityMax = parseInt($input.data('quantityMax'), 10);

        let qty = parseInt($input.val(), 10);

        // If action is incrementing
        if ($target.data('action') === 'inc') {
            // If quantity max option is set
            if (quantityMax > 0) {
                // Check quantity does not exceed max
                if (qty + 1 <= quantityMax) {
                    qty++;
                }
            } else {
                qty++;
            }
        } else if (qty > 1) {
            // If quantity min option is set
            if (quantityMin > 0) {
                // Check quantity does not fall below min
                if (qty - 1 >= quantityMin) {
                    qty--;
                }
            } else {
                qty--;
            }
        }

        // update hidden input
        $input.val(qty);
    });

    // --------------------------------------------------------------------------------------------
    // brand quick view
    // --------------------------------------------------------------------------------------------
    $('body').on('click', '[data-brand-quick-view]', (event) => {
        const $button = $(event.currentTarget);
        const $brand = $button.closest('.brand');
        $button.toggleClass('is-open');
        const isOpen = $button.hasClass('is-open');
        if (isOpen) {
            $brand.addClass('is-open');
            utils.api.getPage(
                $button.data('brandQuickView'),
                {
                    template: 'beautify/bottom-banner',
                },
                (err, resp) => {
                    $brand.find('[data-brand-quick-view-body]').html(resp);
                }
            );
        } else {
            $brand.removeClass('is-open');
        }
        $('[data-brand-quick-view].is-open')
            .not(event.currentTarget)
            .each((i, el) => {
                $(el).removeClass('is-open');
                $(el).closest('.brand').removeClass('is-open');
            });
    });

    inhealth();

    // LUKE CODE

    // sortUl('.navPage-subMenu-list');
    // sortUl('.navPage-childList');
    sortUl('.footer-info-list');
    // try {
    //     console.log(document.querySelector(".papathemes-productView-optionsGrid .form-field"));

    //     sortOptions(".papathemes-productView-optionsGrid .form-field");
    // } catch(e) {
    //     console.log(e);
    // }

    function sortUl(selector) {
        let subMenus = Array.from(document.querySelectorAll(selector));

        subMenus.forEach((subMenu, j) => {
            let children = Array.from(subMenu.children);

            let childrenText = children.map((v) => v.innerText);
            childrenText = childrenText.sort();

            children = childrenText.map((v) => {
                for (let i = 0; i < children.length; i++) {
                    if (children[i].innerText == v) {
                        return children[i];
                    }
                }
            });

            subMenu.innerHTML = '';
            children.forEach((child) => {
                subMenu.append(child);
            });
        });
    }

    // function sortOptions(formFieldSelector) {
    //     let formFields = Array.from(document.querySelectorAll(formFieldSelector));

    //     formFields.forEach(formField => {
    //         let options = Array.from(formField.querySelectorAll("option"));

    //         let optionsText = options.map(v => v.textContent);
    //         optionsText = optionsText.sort();

    //         options = optionsText.map(v => {
    //             for (let i = 0; i < options.length; i++) {
    //                 if (options[i].textContent == v) {
    //                     return options[i];
    //                 }
    //             }
    //         });

    //         formField.innerHTML = "";
    //         options.forEach(option => {
    //             formField.append(option);
    //         });
    //     });
    // }

    try {
        if (window.location.pathname == '/search.php') {
            document.querySelector('.beautify__filters').remove();
            document.querySelector('.button._filters-toggle').remove();
        } else {
            document.body.classList.add('not-search-page');
            console.warn('No filters to remove');
        }
    } catch (e) {
        console.warn('No filters to remove');
        console.log(e);
    }

    try {
        let breadcrumbs = document.querySelector('.breadcrumbs');
        let pageName = breadcrumbs.children[
            breadcrumbs.children.length - 1
        ].textContent
            .trim()
            .toLowerCase()
            .replaceAll(' ', '-');

        let imageURL = `https://cdn11.bigcommerce.com/s-wmonsw2bbs/images/stencil/original/image-manager/${pageName}-header.jpg?t=${Date.now()}`;

        (async () => {
            let response = await fetch(imageURL);
            if (response.status == 404) return;

            let pageHeading = document.querySelector('.page-heading');
            pageHeading.style.backgroundImage = `url(${imageURL})`;
            pageHeading.classList.add('page-heading--custom');
        })();

        if (pageName == 'planters') {
            let wrapper = document.querySelector(
                `[data-content-region="category_below_header--global"]`
            );
            let content = document.createElement('div');

            content.textContent = 'Select planter and date below.';
            content.style.textAlign = 'center';
            content.style.margin = '0.5rem 0';
            content.style.fontSize = '1.85rem';
            // underline
            content.style.textDecoration = 'underline';

            wrapper.prepend(content);
        }
    } catch (e) {
        console.log(e);
    }

    try {
        let ra = document
            .querySelector(
                '[data-content-region="product_below_addtocart--global"]'
            )
            .querySelector('[href="../rewards/"]');
        ra.addEventListener('click', (e) => {
            e.preventDefault();
            createRewardsPopup();
        });
    } catch (e) {}

    if (window.location.pathname == '/landscape-design') {
        // document.getElementsByClassName("page-sidebar page-sidebar--right")[0].style.display = "none";
        // const main = document.getElementsByClassName("page page--hasRightSidebar")[0];
        // main.style.display = "flex";
        // main.style.alignItems = "center";
        // main.style.flexDirection = "column-reverse";
        // main.getElementsByClassName("page-content")[0].style.borderLeft = "none";
        // // Programatically create a new div with a green border and append it
        // let container = document.createElement("div");
        // let div = document.createElement("div");
        // div.style.border = "2px solid lightgray";
        // div.style.borderRadius = "0.5rem";
        // div.style.display = "grid";
        // div.style.placeItems = "center";
        // div.style.padding = "1.25rem 0.5rem";
        // div.style.boxShadow = "inset 0 0 0.5rem lightgray";
        // container.className = "landscape-design-div";
        // // container.style.width = "75%";
        // // container.style.padding = "0 1.5rem";
        // // container2.style.padding = "0 10.5px";
        // container.append(div);
        // main.append(container);
        // const header = document.getElementsByClassName("page-heading")[0];
        // header.classList.add("landscape-design");
        // header.style.marginBottom = "0.5rem";
        // // header.style.border = "solid 2px #379c44";
        // // header.style.padding = "0.5rem 0";
        // // header.style.margin = "0 10vw";
        // // Creating lasting landscape since 1973
        // div.append(header);
        // const subheader = document.createElement("h2");
        // subheader.textContent = "Creating Lasting Landscape Since 1973";
        // subheader.style.margin = "0";
        // subheader.style.textAlign = "center";
        // div.append(subheader);
    }

    function createPopup(title, content, doTransition = true) {
        // Create the dark background
        const background = document.createElement('div');
        background.className = 'popup-background';
        background.style.position = 'fixed';
        background.style.top = '0';
        background.style.left = '0';
        background.style.width = '100%';
        background.style.height = '100%';
        background.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        background.style.zIndex = '998';
        //   Blur everything behind background
        background.style.backdropFilter = 'blur(5px)';
        // disable scrolling behind the background
        document.body.style.overflow = 'hidden';
        // background.addEventListener("click", () => {
        //     document.body.removeChild(background);
        //     document.body.removeChild(popup);
        //     document.body.style.overflow = "initial";
        // });
        document.body.appendChild(background);

        // Create the popup
        const popup = document.createElement('div');

        window.removePopup = () => {
            // document.body.removeChild(document.querySelector(".popup-background"));
            // document.body.removeChild(document.querySelector(".popup"));
            popup.remove();
            background.remove();
            document.body.style.overflow = 'initial';
        };

        background.addEventListener('click', removePopup);

        popup.className = 'popup';
        // popup.style.position = "fixed";
        // popup.style.top = "50%";
        // popup.style.left = "50%";
        // popup.style.transform = "translate(-50%, -50%)";
        // popup.style.width = "95vmin";
        // popup.style.aspectRatio = "300/218";
        // popup.style.backgroundColor = "white";
        // popup.style.border = "1px solid lightgray";
        // popup.style.borderRadius = "5px";
        // popup.style.padding = "10px";
        // popup.style.display = "flex";
        // popup.style.flexDirection = "column";
        // popup.style.justifyContent = "space-between";
        // popup.style.alignItems = "center";
        // popup.style.zIndex = "999";
        document.body.appendChild(popup);

        if (doTransition) {
            //   use css transitions to make the popup appear
            popup.style.transition = 'transform 0.5s ease-in-out';
            popup.style.transform = 'translate(-50%, -50%) scale(0)';
            background.style.backgroundColor = 'rgba(0, 0, 0, 0)';
            background.style.transition = 'background-color 0.5s ease-in-out';

            setTimeout(() => {
                popup.style.transform = 'translate(-50%, -50%) scale(1)';
                background.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            }, 100);
        }

        // background.style.transition = "background-color 0.5s ease-in-out";
        // // background.style.transform = "scale(0)";
        // background.style.backgroundColor = "rgba(0, 0, 0, 0)"
        // setTimeout(() => {
        //     // popup.style.transform = "scale(1)";
        //     background.style.backgroundColor = "rgba(0, 0, 0, 0.5)"
        // }, 100);

        // Create the title
        const popupTitle = document.createElement('h2');
        popupTitle.textContent = title;
        popupTitle.style.margin = '0';
        //   popupTitle.style.marginBottom = "1rem";
        popupTitle.style.textAlign = 'center';
        popup.appendChild(popupTitle);

        // Create the content div
        const contentDiv = document.createElement('div');
        contentDiv.style.width = '100%';
        contentDiv.className = 'content-div';

        contentDiv.append(content);

        popup.appendChild(contentDiv);

        // Create the close button
        const closeButton = document.createElement('button');
        closeButton.className = 'close-button';
        closeButton.textContent = 'Close';
        closeButton.style.padding = '0.5rem 1rem';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.backgroundColor = '#379c44';
        // make a red similar in lightness to the green
        // closeButton.style.backgroundColor = "#ff4d4d";
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = 'white';
        // closeButton.addEventListener("click", () => {
        //     document.body.removeChild(background);
        //     document.body.removeChild(popup);
        //     document.body.style.overflow = "initial";
        // });
        closeButton.onclick = () => {
            document.body.removeChild(background);
            document.body.removeChild(popup);
            document.body.style.overflow = 'initial';
        };
        popup.appendChild(closeButton);

        return popup;
    }

    function printFile(fileUrl) {
        // Create the overlay div
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'white';
        overlay.style.zIndex = '1000';
        overlay.style.display = 'grid';
        overlay.style.placeItems = 'center';
        document.body.appendChild(overlay);

        // Create the image
        const img = document.createElement('img');
        img.src = fileUrl;
        img.style.width = '80%';
        img.style.height = '80%';
        img.style.objectFit = 'contain';

        // img.style.
        overlay.appendChild(img);

        window.print();

        // Remove the overlay
        document.body.removeChild(overlay);
    }

    function createPlantingGuidePopup() {
        const content = document.createElement('div');
        content.style.display = 'grid';
        content.style.gap = '1rem';

        const img = document.createElement('img');
        img.src =
            'https://cdn11.bigcommerce.com/s-wmonsw2bbs/images/stencil/original/image-manager/plantinguide800.jpg?t=1692108368';
        img.style.width = '100%';
        // img.style.border = "1px solid lightgray";
        // img.style.borderRadius = "5px";
        content.appendChild(img);

        let popup = createPopup('', content);
        let closeButton = popup.getElementsByClassName('close-button')[0];

        let buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.width = '100%';
        buttonContainer.style.justifyContent = 'space-around';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.marginTop = '1rem';
        buttonContainer.appendChild(closeButton);

        let printButton = document.createElement('button');
        printButton.textContent = 'Print';
        printButton.style.padding = '0.5rem 1rem';
        printButton.style.border = 'none';
        printButton.style.borderRadius = '5px';
        printButton.style.backgroundColor = '#379c44';
        printButton.style.cursor = 'pointer';
        printButton.style.color = 'white';
        printButton.addEventListener('click', () => {
            printFile(img.src);
        });
        // buttonContainer.appendChild(printButton);

        popup.appendChild(buttonContainer);
    }

    function createContactPopup() {
        let popupContent = document.createElement('div');
        popupContent.className = 'popup-content';
        const popup = createPopup('Landscape Design', popupContent);
        popup.classList.add('contact-popup');

        const logo = document.createElement('img');
        logo.src =
            'https://settlemyrenursery.com/content/web/sn-logo-medium.png';
        // logo.style.width = "10%";
        // logo.style.height = "100px";
        let oldHTML = popup.innerHTML;
        popup.innerHTML = '';
        popup.appendChild(logo);
        popup.innerHTML += oldHTML;

        popupContent = popup.querySelector('.popup-content');

        popupContent.style.display = 'grid';
        popupContent.style.gap = '1rem';
        // popupContent.style.textAlign = "center";
        popupContent.style.placeItems = 'center';
        popupContent.style.width = '100%';
        popupContent.style.height = '100%';

        // const text = document.createElement("center");
        // text.textContent = "Please fill out the form to receive an email with information about landscape design.";
        // popupContent.appendChild(text);

        const contentForm = document.createElement('form');
        contentForm.style.display = 'grid';
        contentForm.style.gap = '0.5rem';
        contentForm.style.placeItems = 'center';
        contentForm.style.width = '100%';

        const firstNameWrapper = document.createElement('div');
        firstNameWrapper.style.display = 'flex';
        firstNameWrapper.style.flexDirection = 'column';
        const firstNameInput = document.createElement('input');
        firstNameInput.name = 'firstName';
        firstNameInput.id = 'firstName';
        firstNameInput.classList.add('required-field');
        firstNameInput.placeholder = 'First Name';
        firstNameWrapper.appendChild(firstNameInput);
        firstNameInput.required = true;
        const firstNameLabel = document.createElement('span');
        firstNameLabel.textContent = '* Required';
        firstNameLabel.style.color = 'red';
        firstNameLabel.style.fontSize = '0.75rem'; // Set the font size to a smaller value
        firstNameWrapper.appendChild(firstNameLabel);
        contentForm.appendChild(firstNameWrapper);

        const lastNameWrapper = document.createElement('div');
        lastNameWrapper.style.display = 'flex';
        lastNameWrapper.style.flexDirection = 'column';
        const lastNameInput = document.createElement('input');
        lastNameInput.name = 'lastName';
        lastNameInput.id = 'lastName';
        lastNameInput.classList.add('required-field');
        lastNameInput.placeholder = 'Last Name';
        lastNameWrapper.appendChild(lastNameInput);
        lastNameInput.required = true;
        const lastNameLabel = document.createElement('span');
        lastNameLabel.textContent = '* Required';
        lastNameLabel.style.color = 'red';
        lastNameLabel.style.fontSize = '0.75rem'; // Set the font size to a smaller value
        lastNameWrapper.appendChild(lastNameLabel);
        contentForm.appendChild(lastNameWrapper);

        const emailWrapper = document.createElement('div');
        emailWrapper.style.display = 'flex';
        emailWrapper.style.flexDirection = 'column';
        const emailInput = document.createElement('input');
        emailInput.name = 'email';
        emailInput.id = 'email';
        emailInput.type = 'email';
        emailInput.classList.add('required-field');
        emailInput.placeholder = 'Email Address';
        emailWrapper.appendChild(emailInput);
        emailInput.required = true;
        const emailLabel = document.createElement('span');
        emailLabel.textContent = '* Required';
        emailLabel.style.color = 'red';
        emailLabel.style.fontSize = '0.75rem'; // Set the font size to a smaller value
        emailWrapper.appendChild(emailLabel);
        contentForm.appendChild(emailWrapper);

        const phoneNumberWrapper = document.createElement('div');
        phoneNumberWrapper.style.display = 'flex';
        phoneNumberWrapper.style.flexDirection = 'column';
        // const phoneNumberLabel = document.createElement("span");
        // phoneNumberLabel.setAttribute("for", "phoneNumber");
        // phoneNumberLabel.textContent = "Phone Number";
        const phoneNumberInput = document.createElement('input');
        phoneNumberInput.name = 'phoneNumber';
        phoneNumberInput.id = 'phoneNumber';
        phoneNumberInput.type = 'tel';
        phoneNumberInput.placeholder = 'Mobile Phone';
        phoneNumberInput.required = true;
        phoneNumberWrapper.appendChild(phoneNumberInput);
        const phoneNumberLabel = document.createElement('span');
        phoneNumberLabel.textContent = '* Required';
        phoneNumberLabel.style.color = 'red';
        phoneNumberLabel.style.fontSize = '0.75rem'; // Set the font size to a smaller value
        phoneNumberWrapper.appendChild(phoneNumberLabel);
        contentForm.appendChild(phoneNumberWrapper);

        const addRequired = (inputEl) => {
            inputEl.required = true;

            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.flexDirection = 'column';
            wrapper.style.gridArea = inputEl.name;

            const label = document.createElement('span');
            label.textContent = '* Required';
            label.style.color = 'red';
            label.style.fontSize = '0.75rem'; // Set the font size to a smaller value
            label.classList.add('dynamic-required-label');
            label.classList.add('off');

            wrapper.appendChild(inputEl);
            wrapper.appendChild(label);

            return wrapper;
        };

        const interestedDiv = document.createElement('div');
        interestedDiv.style.display = 'flex';
        interestedDiv.style.flexDirection = 'column';
        interestedDiv.style.justifyContent = 'center';
        interestedDiv.style.alignItems = 'center';
        contentForm.appendChild(interestedDiv);

        // Create form subsection "Im interested in:"
        const interestedInLabel = document.createElement('span');
        interestedInLabel.textContent = "I'm interested in:";
        interestedInLabel.style.fontSize = '1.25rem';
        interestedDiv.appendChild(interestedInLabel);

        // Create smaller text below the "I'm interested in:" label that says "(Choose all that apply)"
        const chooseAllThatApply = document.createElement('span');
        chooseAllThatApply.textContent = '(Choose all that apply)';
        chooseAllThatApply.style.fontSize = '0.75rem';
        interestedDiv.appendChild(chooseAllThatApply);

        // Add checkbox options: "FREE Sketch-N-Go Service", "Scaled Drawing", "Digital Renderings", "On-Site Consultation", "Delivery & Placement Service"
        const options = [
            'FREE Sketch-N-Go Service',
            'Scaled Drawing',
            'Digital Renderings',
            'On-Site Consultation',
            'Delivery & Placement Service',
            'Professional Installation',
        ];
        const optionsDiv = document.createElement('div');
        const optionsDivs = [];
        optionsDiv.style.display = 'grid';
        optionsDiv.style.gap = '0.25rem';
        optionsDiv.style.gridTemplateColumns = '2rem auto';
        optionsDiv.style.width = '75%';

        options.forEach((option) => {
            const label = document.createElement('label');
            label.htmlFor = option;
            label.textContent = option;
            label.style.userSelect = 'none';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = option;
            checkbox.id = option;
            checkbox.style.margin = '0 0.5rem';
            checkbox.style.width = '1rem';

            optionsDiv.appendChild(checkbox);
            optionsDiv.appendChild(label);

            optionsDivs.push(checkbox);
        });

        contentForm.appendChild(optionsDiv);

        // Create form subsection "I want to get started:"
        const getStartedLabel = document.createElement('span');
        getStartedLabel.textContent = 'I want to get started:';
        getStartedLabel.style.fontSize = '1.25rem';
        contentForm.appendChild(getStartedLabel);

        // Add radio button options: "Right Now!", "This Weekend", "2-4 Weeks", "4 Weeks or longer"
        const radioOptions = [
            'Today',
            'This Weekend',
            '2-4 Weeks',
            '4 Weeks or Longer',
        ];
        const radioOptionsDiv = document.createElement('div');
        const radioOptionsDivs = [];
        radioOptionsDiv.style.display = 'grid';
        radioOptionsDiv.style.gap = '0.25rem';
        radioOptionsDiv.style.gridTemplateColumns = '2rem auto';
        radioOptionsDiv.style.width = '75%';

        radioOptions.forEach((option) => {
            const label = document.createElement('label');
            label.htmlFor = option;
            label.textContent = option;
            label.style.userSelect = 'none';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'getStarted';
            radio.id = option;
            radio.style.margin = '0 0.5rem';
            radio.style.width = '1rem';

            radioOptionsDiv.appendChild(radio);
            radioOptionsDiv.appendChild(label);

            radioOptionsDivs.push(radio);
        });

        contentForm.appendChild(radioOptionsDiv);

        // Make the SUBSECTION labels bigger

        // Create form subsection "For expedited service, enter your address below."
        const expeditedServiceLabel = document.createElement('span');
        expeditedServiceLabel.textContent =
            'For expedited service, enter your address below:';
        expeditedServiceLabel.style.fontSize = '1.25rem';
        expeditedServiceLabel.style.textAlign = 'center';
        contentForm.appendChild(expeditedServiceLabel);

        // Create a div to hold the address inputs
        const addressDiv = document.createElement('div');
        // addressDiv.style.gap = "0.25rem";
        addressDiv.classList.add('address-div');
        // addressDiv.style.width = "100%";

        // Create the street address inputs
        const streetInput = document.createElement('input');
        streetInput.type = 'text';
        streetInput.name = 'street';
        streetInput.id = 'street';
        streetInput.placeholder = 'Street Address';
        streetInput.style.gridArea = 'street';
        addressDiv.appendChild(addRequired(streetInput));

        // Create the city input
        const cityInput = document.createElement('input');
        cityInput.type = 'text';
        cityInput.name = 'city';
        cityInput.id = 'city';
        cityInput.placeholder = 'City';
        cityInput.style.gridArea = 'city';
        addressDiv.appendChild(addRequired(cityInput));

        // Create the state dropdown
        const stateDropdown = document.createElement('select');
        stateDropdown.name = 'state';
        stateDropdown.id = 'state';
        stateDropdown.style.gridArea = 'state';
        addressDiv.appendChild(addRequired(stateDropdown));

        // Add options to the state dropdown
        // NC SC VA WV GA TN
        const states = ['State', 'NC', 'SC', 'VA', 'WV', 'GA', 'TN'];
        states.forEach((state) => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateDropdown.appendChild(option);
        });

        // Create the zip input
        const zipInput = document.createElement('input');
        zipInput.type = 'text';
        zipInput.name = 'zip';
        zipInput.id = 'zip';
        zipInput.placeholder = 'Zip';
        zipInput.style.gridArea = 'zip';
        addressDiv.appendChild(addRequired(zipInput));

        // Create the blank divs
        const blankDiv1 = document.createElement('div');
        blankDiv1.style.gridArea = 'blanka';
        addressDiv.appendChild(blankDiv1);

        const blankDiv2 = document.createElement('div');
        blankDiv2.style.gridArea = 'blankb';
        addressDiv.appendChild(blankDiv2);
        contentForm.appendChild(addressDiv);

        // Create comments label and box
        const commentsLabel = document.createElement('span');
        commentsLabel.textContent = 'Comments:';
        commentsLabel.style.fontSize = '1.25rem';
        contentForm.appendChild(commentsLabel);

        const commentsInput = document.createElement('textarea');
        commentsInput.name = 'comments';
        commentsInput.id = 'comments';
        commentsInput.placeholder = 'Comments';
        commentsInput.style.width = '90%';
        commentsInput.style.height = '5rem';
        contentForm.appendChild(commentsInput);

        const consult = optionsDivs[3];

        consult.addEventListener('change', () => {
            if (consult.checked) {
                streetInput.required = true;
                cityInput.required = true;
                stateDropdown.required = true;
                zipInput.required = true;

                document
                    .querySelectorAll('.dynamic-required-label')
                    .forEach((label) => {
                        label.classList.remove('off');
                    });
            } else {
                streetInput.required = false;
                cityInput.required = false;
                stateDropdown.required = false;
                zipInput.required = false;

                document
                    .querySelectorAll('.dynamic-required-label')
                    .forEach((label) => {
                        label.classList.add('off');
                    });
            }
        });

        // Wrap the contentForm in a scrollable div
        const scrollableDiv = document.createElement('div');
        scrollableDiv.style.overflowY = 'auto';
        scrollableDiv.style.height = '100%';
        scrollableDiv.style.width = '100%';
        // Style the scrollbar to be skinny and #379c44
        scrollableDiv.style.scrollbarWidth = 'thin';
        scrollableDiv.style.scrollbarColor = '#379c44 white';

        scrollableDiv.appendChild(contentForm);

        popupContent.appendChild(scrollableDiv);

        function validateEmail(email) {
            var re = /\S+@\S+\.\S+/;
            return re.test(email);
        }

        function validatePhoneNumber(phoneNumber) {
            var re = /^(\+\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
            return re.test(phoneNumber);
        }

        let submitData = () => {
            let firstName = firstNameInput.value;
            let lastName = lastNameInput.value;
            let email = emailInput.value;
            let phoneNumber = phoneNumberInput.value;

            let interestedIn = optionsDivs
                .filter((v) => v.checked)
                .map((v) => v.name);
            let getStarted = radioOptionsDivs.filter((v) => v.checked)[0];
            getStarted = getStarted ? getStarted.id : null;

            let street = streetInput.value;
            let city = cityInput.value;
            let state = stateDropdown.value;
            let zip = zipInput.value;

            let comments = commentsInput.value;

            const invalidData = (
                message = 'Invalid Form Data! Please check your responses and try again.'
            ) => alert(message);

            if (!firstName || !lastName) return invalidData();
            if (!validateEmail(email))
                return invalidData(
                    'Invalid Email Address! Please check your email and try again.'
                );
            if (!validatePhoneNumber(phoneNumber))
                return invalidData(
                    'Invalid Phone Number! Please check your phone number and try again.'
                );
            if (interestedIn.length == 0)
                return invalidData(
                    "Please select at least one option for 'I'm interested in:'"
                );
            if (!getStarted)
                return invalidData(
                    "Please select an option for 'I want to get started:'"
                );

            // Turn button into an animated progress bar
            let button = document.querySelector('.close-button');
            button.textContent = '';
            button.style.width = '2rem';
            button.style.height = '2rem';
            button.style.borderRadius = '50%';
            button.style.border = '0.25rem solid #379c44';
            button.style.borderTop = '0.25rem solid white';
            button.style.backgroundColor = 'white';
            button.style.padding = '0';
            button.style.animation = 'spin 1s linear infinite';
            button.style.marginTop = '2rem';

            fetch(`https://api.settlemyrenursery.com/design`, {
                method: 'POST',
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    phone: phoneNumber,
                    interested_in: interestedIn,
                    timeline: getStarted,
                    street: street,
                    city: city,
                    state: state,
                    zip_code: zip,
                    comments: comments,
                    'ngrok-skip-browser-warning': 'skip',
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.text())
                .then((data) => {
                    removePopup();
                    createPopup('Thank you!', data);
                })
                .catch((error) => {
                    removePopup();
                    let _popup = createPopup(
                        'Oops!',
                        'Something went wrong. Please try again.'
                    );
                    let _button =
                        _popup.getElementsByClassName('close-button')[0];
                    _button.textContent = 'Try again';
                    _button.onclick = () => {
                        removePopup();
                        createContactPopup();
                    };
                });
        };

        // Create a hidden submit input in the content form in order to submit the form with the enter key
        let submitInput = document.createElement('input');
        submitInput.type = 'submit';
        submitInput.style.display = 'none';
        contentForm.appendChild(submitInput);

        contentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitData();
        });

        // popup.style.overflowY = "auto";
        // // Style the scrollbar to be skinny and #379c44
        // popup.style.scrollbarWidth = "thin";
        // popup.style.scrollbarColor = "#379c44 white";

        // popup.style.borderRadius = "0.5rem 0 0 0.5rem";

        let closeButton = popup.getElementsByClassName('close-button')[0];
        // closeButton.removeEventListener("click");
        closeButton.textContent = 'Submit';
        closeButton.onclick = submitData;

        // contentForm.appendChild(closeButton);

        // let center = document.createElement("center");
        // let p = document.createElement("p");
        // p.style.fontSize = "0.8rem";
        // p.textContent = "Settlemyre Nursery never sells your data to third parties.";

        // center.appendChild(p);

        // popup.appendChild(center);
    }

    window.createContactPopup = createContactPopup;

    // createContactPopup();

    window.createPopup = createPopup;

    function createPlantSizesPopup() {
        const containerDiv = document.createElement('div');
        containerDiv.classList.add('plant-sizes-container');

        const popup = createPopup('Plant Sizes Explained', containerDiv);
        popup.classList.add('plant-sizes-popup');

        // Create the container div

        // Create the first section
        const section1 = document.createElement('section');
        containerDiv.appendChild(section1);

        // Create the h1 element for the first section
        const h1_1 = document.createElement('h1');
        h1_1.textContent = 'How Our Plants Are Sized';
        section1.appendChild(h1_1);

        // Create the p element for the first section
        const p1 = document.createElement('p');
        p1.textContent =
            'In the plant nursery world, plants are generally sized by their pot size. You may hear these sizes called a "#3 container" or a "3 gallon" pot. These terms are used interchangeably. We sell plants in 1 gallon pots all the way up to 30 gallon pots. Some of our smaller plants are sold in 4.5 inch or 6 inch cups.';
        section1.appendChild(p1);

        // Create the second section
        const section2 = document.createElement('section');
        containerDiv.appendChild(section2);

        // Create the h1 element for the second section
        const h1_2 = document.createElement('h1');
        h1_2.textContent = 'Is bigger better?';
        section2.appendChild(h1_2);

        // Create the p element for the second section
        const p2 = document.createElement('p');
        p2.textContent =
            'We recommend purchasing the plant size that aligns with your expectations, needs, and budget. Larger plants are often older with more mature root structures, which means they will provide a more instant landscaping impact. Smaller shrubs and trees represent a great value and allow you to lower the overall cost of your landscaping project. They often require more initial care as they get established, and they will take longer to reach maturity.';
        section2.appendChild(p2);

        // Create the third section
        const section3 = document.createElement('section');
        containerDiv.appendChild(section3);

        // Create the h1 element for the third section
        const h1_3 = document.createElement('h1');
        h1_3.textContent = 'Typical Size Comparison';
        section3.appendChild(h1_3);

        // Create the div for the image container
        const imgContainerDiv = document.createElement('div');
        imgContainerDiv.classList.add('plant-sizes-img-container');
        section3.appendChild(imgContainerDiv);

        // Create the img element
        const img = document.createElement('img');
        img.src =
            'https://cdn11.bigcommerce.com/s-wmonsw2bbs/images/stencil/original/image-manager/green-giant-comparison.jpeg?t=1699379233';
        img.alt = 'Plant Sizes Explained Image';
        imgContainerDiv.appendChild(img);
    }

    function createRewardsPopup() {
        const containerDiv = document.createElement('div');
        containerDiv.classList.add('rewards-container');

        const popup = createPopup('Rewards', containerDiv);
        popup.classList.add('rewards-popup');

        function createSection(title, content) {
            const section = document.createElement('section');
            containerDiv.appendChild(section);

            const h1 = document.createElement('h1');
            h1.textContent = title;
            section.appendChild(h1);

            const p = document.createElement('p');
            p.innerHTML = content;
            section.appendChild(p);
        }

        const section3 = document.createElement('section');
        containerDiv.appendChild(section3);

        const imgContainerDiv = document.createElement('div');
        imgContainerDiv.classList.add('rewards-img-container');
        section3.appendChild(imgContainerDiv);

        const img = document.createElement('img');
        img.src = 'https://settlemyrenursery.com/content/web/rewards.jpg';
        img.alt = 'Rewards Image';
        imgContainerDiv.appendChild(img);

        // June 30 and December 31st of each year

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const day = today.getDate();

        let nextExpirationDate = new Date(year, 5, 30);
        if (month > 5) {
            nextExpirationDate = new Date(year, 11, 31);
        }

        // Next expiration date should have no day of the week and the month should be the full name of the month
        nextExpirationDate = nextExpirationDate
            .toDateString()
            .split(' ')
            .slice(1)
            .join(' ');

        const abbMonths = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ];
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];

        let newMonthStr = nextExpirationDate.split(' ')[0];
        let newMonth = months[abbMonths.indexOf(newMonthStr)];
        let newDay = nextExpirationDate.split(' ')[1];
        let newYear = nextExpirationDate.split(' ')[2];

        nextExpirationDate = `${newMonth} ${newDay}, ${newYear}`;

        createSection(
            'Earn rewards for shopping with us!',
            'We are so thankful for your business both online and in-store. To reward you, we offer a free rewards prorgam that allows you to earn 5% back with us.'
        );
        createSection(
            'How it works',
            'When you shop with us, both online and in-store, all purchases pver $20 will be rewarded with a 5% store credit reward, you can earn up XXX on each purchase, and you can redeem XXX amount on your purchase. Accounts logged in online will display their rewards balance. Balance may be use online or in-store. Rewards expire 6/30 & 12/31'
        );
        createSection(
            'How can I check my balance?',
            "Check your balance at the bottom or your receipt or <a href='/account.php?action=order_status' target='_blank'>in your online user account</a>."
        );
        createSection(
            'Do points expire?',
            `All points expire ${nextExpirationDate}. Don't lose your points. Come see us, and take home the healthiest plants alive!`
        );
    }

    // createRewardsPopup();
    // createPlantSizesPopup();

    try {
        const nav = document.querySelector('nav.navPages');
        const ul1 = nav.querySelector('ul.navPages-list');
        const maxWidth = Array.from(ul1.children)
            .map((child) => Math.ceil(child.getBoundingClientRect().width) + 28)
            .reduce((a, b) => a + b);

        nav.style.maxWidth = `${maxWidth}px`;
    } catch {
        console.log('Failed to get the nav bar');
    }

    try {
        const items = Array.from(document.querySelectorAll('.navPages-item'));

        items.forEach((item) => {
            if (item.childElementCount > 0) return;

            item.remove();
        });
    } catch (e) {
        console.log(e);
    }

    // ON SALE PAGE

    try {
        if (!document.querySelector('.item-name--OnSale'))
            throw 'The category is missing...?';

        const onSaleLi = document.querySelector('.item-name--OnSale');

        const updateSalePage = async () => {
            const url = new URL('/on-sale', window.origin).href;
            const response = await fetch(url);
            const text = await response.text();

            if (!response.ok) throw new Error('Failed to get on-sale items.');

            const noItems = text.includes(
                'There are no products listed under this category.'
            );
            if (noItems) {
                document.querySelector('nav').classList.remove('nav-hidden');
                return;
            }

            onSaleLi.classList.remove('item-name--OnSale');
            onSaleLi.classList.add('item-on-sale');

            document.querySelector('nav').classList.remove('nav-hidden');
        };

        updateSalePage();
    } catch (e) {
        document.querySelector('nav').classList.remove('nav-hidden');
        console.warn('Failed to get on-sale items.');
        console.error(e);
    }

    try {
        if (!document.getElementById('plantingGuideButton'))
            throw 'Not a product page';
        if (!document.getElementById('rewardsButton'))
            throw 'No rewards button';
        if (!document.getElementById('plantingGuideButton'))
            throw 'No planting guide button';
        if (!document.getElementById('plantSizesButton'))
            throw 'No plant sizes button';

        document
            .getElementById('rewardsButton')
            .addEventListener('click', createRewardsPopup);
        document
            .getElementById('plantingGuideButton')
            .addEventListener('click', createPlantingGuidePopup);
        document
            .getElementById('plantSizesButton')
            .addEventListener('click', createPlantSizesPopup);
    } catch (e) {
        console.warn(e);
    }

    function isPlantOrTreePage() {
        const breadcrumbsElement = document.querySelector('.breadcrumbs');
        if (breadcrumbsElement) {
            const breadcrumbsText = breadcrumbsElement.textContent;
            return (
                breadcrumbsText.includes('Plants') ||
                breadcrumbsText.includes('Trees')
            );
        }
        return false;
    }

    function isProductPage() {
        if (document.getElementById('plantingGuideButton')) return true;
        return false;
    }

    if (!isPlantOrTreePage() && isProductPage()) {
        const wrapper = document.querySelector('.under-specs');
        const climateZoneFinder = wrapper.querySelector('.zone-finder');
        const plantSizes = wrapper.querySelector('#plantSizesButton');
        const specs = Array.from(
            document.querySelectorAll('.beautify__page-heading')
        ).filter((v) => v.textContent.includes('Specifications'))[0];
        const howToPlant = document.querySelector('#plantingGuideButton');

        climateZoneFinder.remove();
        plantSizes.remove();
        specs.remove();
        howToPlant.remove();
    }

    const requestInfoButtons = Array.from(
        document.querySelectorAll('.request-info')
    );
    requestInfoButtons.forEach((button) => {
        button.addEventListener('click', createContactPopup);
    });

    if (window.location.pathname == '/landscape-design') {
        // const container = document.createElement("div");
        // container.style.display = "flex";
        // container.style.flexDirection = "column";
        // container.style.alignItems = "center";
        // container.style.width = "100%";
        // container.style.padding = "1rem";
        // container.style.gap = "1rem";

        // const button = document.createElement("button");
        // button.style.backgroundColor = "#379c44";
        // button.style.color = "white";
        // button.style.padding = "1rem 2rem";
        // button.style.border = "none";
        // button.style.borderRadius = "5px";
        // button.style.cursor = "pointer";
        // button.style.fontSize = "1.5rem";
        // button.style.boxShadow = "0 0 0.5rem lightgray";

        // container.appendChild(button);

        // button.textContent = "Request Information";
        // button.addEventListener("click", createContactPopup);
        // document.querySelector('[data-content-region="page_builder_bottom--global"]').appendChild(container);

        const salesBanner = document.querySelector(
            '[data-content-region="header_bottom--global"]'
        );
        salesBanner.remove();

        const table = document.querySelector('.table-responsive');
        const ths = Array.from(table.querySelectorAll('th'));
        ths.forEach((th) => {
            th.style.textAlign = 'center';
        });
    }

    async function submitNotifyStockForm(e) {
        e.preventDefault();

        const form = e.target;
        const submitButton = form.querySelector("button[type='submit']");
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        data['sku'] = document.querySelector(
            '.productView-info-value--sku'
        ).textContent;
        data['ngrok-skip-browser-warning'] = 'skip';

        const loadingDiv = document.createElement('div');
        loadingDiv.textContent = '';
        loadingDiv.style.width = '5rem';
        loadingDiv.style.height = '5rem';
        loadingDiv.style.borderRadius = '50%';
        loadingDiv.style.border = '0.25rem solid #379c44';
        loadingDiv.style.borderTop = '0.25rem solid white';
        loadingDiv.style.backgroundColor = 'white';
        loadingDiv.style.padding = '0';
        loadingDiv.style.animation = 'spin 1s linear infinite';
        loadingDiv.style.marginTop = '5rem';

        const loadingDivContainer = document.createElement('div');
        loadingDivContainer.appendChild(loadingDiv);

        let popup = createPopup('Settlemyre Nursery', loadingDivContainer);

        const response = await fetch(
            `https://api.settlemyrenursery.com/stock_notify`,
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        const responseData = await response.text();
        loadingDiv.remove();
        loadingDivContainer.innerHTML = responseData;
        loadingDivContainer.style.fontSize = '1.5rem';
        form.reset();
    }

    try {
        if (!document.getElementById('notifyStockForm'))
            throw 'No notify stock form';
        document
            .getElementById('notifyStockForm')
            .addEventListener('submit', submitNotifyStockForm);
    } catch (e) {
        console.warn(e);
    }

    async function submitNewsletterForm(e) {
        e.preventDefault();
        const form = e.target;

        const button = form.querySelector('button.button');
        button.disabled = true;

        const emailInput = form.querySelector("input[type='email']");
        emailInput.id = 'email';
        emailInput.name = 'email';

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        data['ngrok-skip-browser-warning'] = 'skip';

        const response = await fetch(
            `https://api.settlemyrenursery.com/newsletter`,
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        const [rText, rStatus] = await Promise.all([
            response.text(),
            response.status,
        ]);
        const _head = rStatus == 200 ? 'Thank you!' : 'Oops!';
        let _cont =
            rStatus == 200
                ? 'Please check your email to receive your discount code.'
                : rText;

        button.disabled = false;
        createPopup(_head, _cont);
    }

    const newsletterForm = document
        .querySelector('.beautify__newsletter')
        .querySelector('form');
    newsletterForm.removeAttribute('action');
    newsletterForm.addEventListener('submit', submitNewsletterForm);

    function createPromotionalPopup() {
        let popup = createPopup('', '', false);
        popup.className = 'promotion-popup';
        popup.innerHTML = '';
        // popup.style.transition = "none";
        // popup.style.transform = "none";

        // const promotionPopup = document.createElement('div');
        // promotionPopup.classList.add('promotion-popup');

        // const proBackground = document.createElement('div');
        // proBackground.classList.add('pro-background');
        // promotionPopup.appendChild(proBackground);

        const proContainer = document.createElement('div');
        proContainer.classList.add('pro-container');
        popup.appendChild(proContainer);

        const proClose = document.createElement('div');
        proClose.classList.add('pro-close');
        proClose.textContent = 'X';
        proContainer.appendChild(proClose);

        proClose.addEventListener('click', removePopup);

        const proContent = document.createElement('div');
        proContent.classList.add('pro-content');
        proContainer.appendChild(proContent);

        const h2SaveNow = document.createElement('h2');
        h2SaveNow.textContent = 'SAVE NOW!';
        proContent.appendChild(h2SaveNow);

        const h1Off = document.createElement('h1');
        h1Off.textContent = '$10 OFF';
        proContent.appendChild(h1Off);

        const h2Orders = document.createElement('h2');
        h2Orders.textContent = 'YOUR FIRST ORDER*';
        proContent.appendChild(h2Orders);

        const proForm = document.createElement('form');
        proForm.id = 'proForm';
        proForm.classList.add('pro-form');
        proContent.appendChild(proForm);

        proForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target;

            const emailInput = form.querySelector("input[type='email']");
            emailInput.id = 'email';
            emailInput.name = 'email';

            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            data['ngrok-skip-browser-warning'] = 'skip';

            removePopup();

            const response = await fetch(
                `https://api.settlemyrenursery.com/newsletter`,
                {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            const [rText, rStatus] = await Promise.all([
                response.text(),
                response.status,
            ]);
            const _head = rStatus == 200 ? 'Thank you!' : 'Oops!';
            let _cont =
                rStatus == 200
                    ? 'Please check your email to receive your discount code.'
                    : rText;
            createPopup(_head, _cont);

            localStorage.setItem('promotionalAccepted', 'true');
        });

        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.name = 'email';
        emailInput.id = 'email';
        emailInput.placeholder = 'Email Address *';
        emailInput.required = true;
        proForm.appendChild(emailInput);

        const submitButton = document.createElement('input');
        submitButton.type = 'submit';
        submitButton.value = 'Submit';
        proForm.appendChild(submitButton);

        const proDisclaimer = document.createElement('p');
        proDisclaimer.classList.add('pro-disclaimer');
        proDisclaimer.textContent =
            '*Exclusions Apply. Valid on orders of $50 or more. Cannot be combined with other discounts';
        proContent.appendChild(proDisclaimer);

        const _proDisclaimer = document.createElement('b');
        _proDisclaimer.classList.add('pro-disclaimer');
        _proDisclaimer.textContent = 'Local Pickup in Valdese, NC';
        proContent.appendChild(_proDisclaimer);

        const __proDisclaimer = document.createElement('b');
        __proDisclaimer.classList.add('pro-disclaimer');
        __proDisclaimer.textContent =
            'Local Delivery within 60 Miles of Valdese, NC';
        proContent.appendChild(__proDisclaimer);
    }

    const neverSeen = localStorage.getItem('promotionalLastSeen') == null;
    const accepted = localStorage.getItem('promotionalAccepted') == 'true';
    const weekPassed =
        Date.now() - localStorage.getItem('promotionalLastSeen') >= 604800000;

    if (!accepted && (neverSeen || weekPassed)) {
        createPromotionalPopup();
        localStorage.setItem('promotionalLastSeen', Date.now());
    }

    window.createPromotionalPopup = createPromotionalPopup;

    // try {
    //     const priceSection = document.querySelector(".form-action--addToCart").querySelector(".price-section")

    // } catch (e) {
    //     console.log(e);
    // }

    // <div class="media carousel">
    //     <div class="carousel-image active" id="CI1" data-index="0"></div>
    //     <div class="carousel-image" id="CI2" data-index="1"></div>
    //     <div class="carousel-overlay">
    //         <div class="carousel-arrow left">▲</div>
    //         <div class="carousel-arrow right">▲</div>
    //         <div class="carousel-dots">
    //             <div class="carousel-dot active" id="CD1" data-index="0"></div>
    //             <div class="carousel-dot" id="CD2" data-index="1"></div>
    //         </div>
    //     </div>
    // </div>

    try {
        const start = new Date('6-27-24').getTime();
        const end = new Date('7-7-24').getTime();
        const now = Date.now();

        if (now >= start && now <= end) throw 'Not the right time';

        const closingLi = document.getElementById('temporaryHour');
        closingLi.remove();
    } catch {}

    try {
        console.log('Landscape Design Init');

        if (document.querySelector('.landscape-page') == null)
            throw 'Not a landscape design page';

        Array.from(
            document.querySelectorAll('.landscape-page .carousel')
        ).forEach((carousel, carouselIndex) => {
            const images = Array.from(
                carousel.querySelectorAll('.carousel-image')
            );
            const dots = Array.from(carousel.querySelectorAll('.carousel-dot'));
            const arrows = Array.from(
                carousel.querySelectorAll('.carousel-arrow')
            );
            const captions = Array.from(
                carousel.querySelectorAll('.carousel-caption')
            );

            let activeIndex = 0;

            const setActive = (index) => {
                images[activeIndex].classList.remove('active');
                dots[activeIndex].classList.remove('active');

                images[index].classList.add('active');
                dots[index].classList.add('active');

                try {
                    captions[activeIndex].classList.remove('active');
                    captions[index].classList.add('active');
                } catch (e) {
                    console.warn('No captions found');
                }

                activeIndex = index;
            };

            dots.forEach((dot, dotIndex) => {
                dot.addEventListener('click', () => {
                    setActive(dotIndex);
                });
            });

            arrows.forEach((arrow, arrowIndex) => {
                arrow.addEventListener('click', () => {
                    let newIndex = activeIndex + (arrowIndex == 0 ? -1 : 1);
                    if (newIndex < 0) newIndex = images.length - 1;
                    if (newIndex >= images.length) newIndex = 0;
                    setActive(newIndex);
                });
            });
        });
    } catch (e) {
        console.warn(e);
    }

    if (window.location.pathname == '/checkout') {
        const createDeliveryContent = () => {
            const deliveryPopup = document.createElement('div');
            deliveryPopup.classList.add('delivery-popup');
            const deliveryImage = document.createElement('img');
            deliveryImage.src =
                'https://cdn11.bigcommerce.com/s-wmonsw2bbs/images/stencil/original/image-manager/map.jpg?t=1710449769';
            deliveryImage.alt = 'Delivery Image';
            deliveryPopup.appendChild(deliveryImage);
            const deliveryText = document.createElement('p');
            deliveryText.textContent =
                'Plants and trees are for local pickup in Valdese, NC. Local delivery available within 60 miles of Valdese, North Carolina.';
            deliveryPopup.appendChild(deliveryText);

            return deliveryPopup;
        };

        const popup = createPopup('We Do Not Ship', createDeliveryContent());
    }

    // try {
    //     const header = document.querySelector(".header");
    //     const mainHeader = document.querySelector(".beautify__mainHeader");
    //     const headerLogo = mainHeader.querySelector(".header-logo");
    //     const navPages = document.querySelector(".navPages-container");

    //     const newHeaderContainer = document.createElement("div");
    //     newHeaderContainer.class = "new-header-container";

    //     const newLogoContainer = document.createElement("div");
    //     newLogoContainer.class = "new-logo-container";

    //     const newNavContainer = document.createElement("div");
    //     newNavContainer.class = "new-nav-container";

    //     newLogoContainer.appendChild(headerLogo);
    //     newNavContainer.appendChild(mainHeader);
    //     newNavContainer.appendChild(navPages);

    //     newHeaderContainer.appendChild(newLogoContainer);
    //     newHeaderContainer.appendChild(newNavContainer);
    // }

    try {
        console.log('Recommended Products Init');

        if (!document.querySelector('#tab-addition'))
            throw 'Not a product page';

        const isSingleProductPage =
            document.querySelector(
                '.papathemes-productView-optionsGrid .form-field'
            ) == null;
        let productSize = isSingleProductPage
            ? document.querySelector(
                  '#tab-addition .productView-info-row--cfSize .productView-info-value'
              )
            : null;
        const hasSize = productSize != null;
        productSize = hasSize ? productSize.textContent : null;

        function getProductDetailsFromEndpoint(endpoint) {
            return new Promise((resolve, reject) => {
                fetch(endpoint)
                    .then((r) => r.text())
                    .then((r) => {
                        let dom = new DOMParser().parseFromString(
                            r,
                            'text/html'
                        );
                        let addToCartForm =
                            dom.querySelector('.form--addToCart');
                        if (!addToCartForm)
                            return resolve({
                                product_id: null,
                                product_options: null,
                            });
                        let formField = addToCartForm.querySelector(
                            `[data-product-attribute="set-rectangle"]`
                        );
                        let product_id = addToCartForm.querySelector(
                            `input[name="product_id"]`
                        ).value;

                        let product_options = {};

                        let attribute_id = '';

                        let product_name = dom
                            .querySelector('.productView-title')
                            .textContent.trim();

                        let thumbnail = dom.querySelector(
                            '.productView-imageCarousel-main-item img'
                        ).src;

                        if (formField) {
                            attribute_id =
                                formField.querySelector('.form-radio').name;

                            let options = Array.from(
                                formField.querySelectorAll('.form-option')
                            );
                            let getOptionsRadio = (option) => {
                                return formField.querySelector(
                                    `[value="${option.dataset.productAttributeValue}"]`
                                );
                            };
                            options = options.map((v) => {
                                return { option: v, radio: getOptionsRadio(v) };
                            });

                            options.forEach((pair) => {
                                product_options[
                                    pair.option.textContent.trim()
                                ] = pair.radio.value;
                            });
                        }

                        resolve({
                            product_id,
                            product_options,
                            attribute_id,
                            product_name,
                            thumbnail,
                        });
                    });
            });
        }

        let IDS = {};
        (async () => {
            IDS.biotone = getProductDetailsFromEndpoint(ENDPOINTS.biotone);
            IDS.raisedBedMix = getProductDetailsFromEndpoint(
                ENDPOINTS.raisedBedMix
            );
            IDS.permaTill = getProductDetailsFromEndpoint(ENDPOINTS.permaTill);

            let data = await Promise.all(Object.values(IDS));
            IDS.biotone = data[0];
            IDS.raisedBedMix = data[1];
            IDS.permaTill = data[2];

            console.log(IDS);

            window.IDS = IDS;
        })();

        function getProductDetailsFromIDsUsingAttributeID(attribute_id) {
            let targetAttributeId = `attribute[${
                Object.keys(attribute_id)[0]
            }]`;
            let targetObj = Object.values(IDS).filter((v) => {
                return v.attribute_id == targetAttributeId;
            })[0];

            return targetObj;
        }

        function getProductDetailsFromIDsUsingProductID(product_id) {
            let targetObj = Object.values(IDS).filter((v) => {
                return v.product_id == product_id;
            })[0];

            return targetObj;
        }

        const startTheShow = () => {
            // if (!window.IDS) return setTimeout(startTheShow, 1000);
            const SELECTED = document.querySelector(
                '.form-radio:checked + .form-option'
            );
            if (!SELECTED && !hasSize) return;

            const openCart = () => {
                // console.log(document, document.querySelector(".navUser-item--cart a"));
                document.querySelector('.navUser-item--cart a').click();
            };

            const REQUEST_HEADERS = {
                accept: '*/*',
                'accept-language': 'en-US,en;q=0.9',
                'content-type':
                    'multipart/form-data; boundary=----WebKitFormBoundary8Ub3q4FeZPdXd7MI',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'stencil-config': '{}',
                'stencil-options': '{}',
                'x-requested-with': 'stencil-utils',
                'x-xsrf-token':
                    '6cd16d765bfe613b044edcb5958244cdbdd25775ed9a4eaca16aa6c350993cb3',
            };

            const convertJSONToFormDataString = (_json) => {
                const convertValuePair = (key, value) => {
                    return `------WebKitFormBoundary8Ub3q4FeZPdXd7MI\r\nContent-Disposition: form-data; name=\"${key}\"\r\n\r\n${value}\r\n`;
                };

                let formDataString = '';
                for (const [key, value] of Object.entries(_json)) {
                    formDataString += convertValuePair(key, value);
                }

                formDataString +=
                    '------WebKitFormBoundary8Ub3q4FeZPdXd7MI--\r\n';

                return formDataString;
            };

            const extractProduct = (product_id, body) => {
                return new Promise(async (resolve, reject) => {
                    const response = await fetch(
                        `/remote/v1/product-attributes/${product_id}`,
                        {
                            headers: {
                                accept: '*/*',
                                'accept-language': 'en-US,en;q=0.9',
                                'content-type':
                                    'application/x-www-form-urlencoded; charset=UTF-8',
                                'sec-fetch-mode': 'cors',
                                'sec-fetch-site': 'same-origin',
                                'stencil-config': '{}',
                                'stencil-options':
                                    '{"render_with":"products/bulk-discount-rates"}',
                                'x-requested-with': 'stencil-utils',
                                'x-xsrf-token':
                                    'f82833130deb8e9bd277bdc5ba45f1b4ba08a502f047b8e1c738bcb26491f2c6',
                            },
                            referrerPolicy: 'strict-origin-when-cross-origin',
                            body: body,
                            method: 'POST',
                            mode: 'cors',
                            credentials: 'include',
                        }
                    );
                    const data = await response.json();
                    resolve(data.data);
                });
            };

            const convertJSONToURLQuery = (json) => {
                let query = '';
                for (const [key, value] of Object.entries(json)) {
                    query += `&${key}=${value}`;
                }
                if (query[0] == '&') query = query.slice(1);
                return query;
            };

            const extractProductDataWithOptions = (gData) => {
                let newOptions = {
                    action: 'add',
                    product_id: gData.product_id,
                    'qty[]': gData.quantity,
                };
                for (const [key, value] of Object.entries(gData.options)) {
                    newOptions[encodeURIComponent(key)] =
                        encodeURIComponent(value);
                }

                return extractProduct(
                    gData.product_id,
                    convertJSONToURLQuery(newOptions)
                );
            };

            const extractProductData = (product_id) => {
                return extractProduct(product_id, '');
            };

            const extractProductCardData = (gData) => {
                return new Promise(async (resolve, reject) => {
                    const response = await extractProductDataWithOptions(gData);
                    const price = response.price.without_tax.value;
                    let thumbnail = '';
                    let name = '';

                    let proDetails = getProductDetailsFromIDsUsingProductID(
                        gData.product_id
                    );

                    console.log('YOO');
                    console.log(gData.product_id, proDetails);

                    if (gData.product_id == IDS.raisedBedMix.product_id) {
                        thumbnail = proDetails.thumbnail;
                        name = 'Raised Bed Soil Mix';
                    } else if (response.image) {
                        thumbnail = response.image.data.replaceAll(
                            '{:size}',
                            '500x500'
                        );
                        name = response.image.alt;
                    } else if (
                        response.sku ==
                        document
                            .querySelector(
                                '.productView-info-value.productView-info-value--sku'
                            )
                            .textContent.trim()
                    ) {
                        thumbnail = document.querySelector(
                            '.productView-imageCarousel-main-item img'
                        ).src;
                        name = document
                            .querySelector('.productView-title')
                            .textContent.trim();
                    } else if (response.image == null && proDetails) {
                        thumbnail = proDetails.thumbnail;
                        name = proDetails.product_name;
                    } else {
                        return resolve({});
                    }

                    const instock = response.instock;

                    resolve({
                        price,
                        thumbnail,
                        name,
                        quantity: gData.quantity,
                        instock,
                        gData: gData,
                    });
                });
            };

            window.extractProductCardData = extractProductCardData;

            const getClosestGallon = (gals) => {
                let closest = gals[0];
                let found = false;
                gals.forEach((gal) => {
                    if (gals <= 6 && !found) {
                        closest = gal;
                        found = true;
                    }
                });
                return closest;
            };

            const gallons = [1, 2, 3, 5, 7, 10, 15, 20, 25, 30, 45];
            const biotoneDecimal = [
                0.33, 0.33, 0.5, 0.66, 1, 1, 1.33, 2, 2, 2, 8,
            ];
            const raisedBedDecimal = [
                0.066, 0.2, 0.25, 0.33, 0.5, 1, 2, 3, 3, 4, 5,
            ];

            const __form = document.querySelector('.form--addToCart');
            const __quantity = __form.querySelector(
                "input[name='qty[]']"
            ).value;

            const getBiotoneDecimal = (g) => {
                return gallons.indexOf(g) != -1
                    ? biotoneDecimal[gallons.indexOf(g)]
                    : '';
            };
            const getBiotoneAmount = (g) => {
                const decimal = getBiotoneDecimal(g);
                const poundsNeeded = decimal * __quantity;

                if (poundsNeeded == 0.33) return ['5 Oz'];
                if (poundsNeeded <= 4) return ['4 Pounds'];
                if (poundsNeeded <= 8) return ['8 Pounds'];
                if (poundsNeeded <= 18) return ['18 Pounds'];
                if (poundsNeeded <= 25) return ['25 Pounds'];
                if (poundsNeeded > 25) {
                    const _poundsNeeded = Math.ceil(poundsNeeded / 25);

                    let _pounds = [];
                    for (let i = 0; i < _poundsNeeded; i++) {
                        _pounds.push('25 Pounds');
                    }

                    return _pounds;
                }
            };

            // fetch("/bio-tone-starter-plus-starter-fertilizer/").then(r => r.text()).then(r => {
            //     const parser = new DOMParser();
            //     const doc = parser.parseFromString(r, "text/html");
            //     const form = doc.querySelector(".form--addToCart");
            //     const quantity = form.querySelector("input[name='qty[]']").value;
            //     const product_id = form.querySelector("input[name='product_id']").value;
            //     const options = {};
            //     const optionInputs = Array.from(form.querySelectorAll("input[type='hidden']"));
            //     optionInputs.forEach(input => {
            //         options[input.name] = input.value;
            //     });

            //     const biotone = { product_id, quantity, options };
            //     console.log(biotone);
            // });

            const getRaisedBedDecimal = (g) => {
                return gallons.indexOf(g) != -1
                    ? raisedBedDecimal[gallons.indexOf(g)]
                    : '';
            };
            const getRaisedBedMixAmount = (g) => {
                return Math.ceil(getRaisedBedDecimal(g) * __quantity);
            };

            const getPermaTill = (g) => {
                const totalGallons = g * __quantity;
                console.log(g, totalGallons);
                if (totalGallons <= 10)
                    return {
                        product_id: IDS.permaTill.product_id,
                        quantity: 1,
                        options: {
                            [IDS.permaTill.attribute_id]:
                                IDS.permaTill.product_options['20 Pounds'],
                        },
                    };
                if (10 < totalGallons && totalGallons < 30)
                    return {
                        product_id: IDS.permaTill.product_id,
                        quantity: 1,
                        options: {
                            [IDS.permaTill.attribute_id]:
                                IDS.permaTill.product_options['40 Pounds'],
                        },
                    };
                if (30 <= totalGallons && totalGallons <= 45)
                    return {
                        product_id: IDS.permaTill.product_id,
                        quantity: 2,
                        options: {
                            [IDS.permaTill.attribute_id]:
                                IDS.permaTill.product_options['40 Pounds'],
                        },
                    };
                if (totalGallons > 45) {
                    const __g = Math.ceil(totalGallons / 40);
                    return {
                        product_id: IDS.permaTill.product_id,
                        quantity: __g,
                        options: {
                            [IDS.permaTill.attribute_id]:
                                IDS.permaTill.product_options['40 Pounds'],
                        },
                    };
                }
            };

            const getBiotone = (g) => {
                const pounds = getBiotoneAmount(g);
                const biotoneOptions = IDS.biotone.product_options;

                return {
                    product_id: IDS.biotone.product_id,
                    quantity: pounds.length,
                    options: {
                        [IDS.biotone.attribute_id]: biotoneOptions[pounds[0]],
                    },
                };
            };

            const getRaisedBedMix = (g) => {
                const bags = getRaisedBedMixAmount(g);
                return {
                    product_id: IDS.raisedBedMix.product_id,
                    quantity: bags,
                    options: {},
                };
            };

            const getNumberInString = (string) => {
                const numRegex = /\d+/;
                return string.match(numRegex)[0];
            };

            const getGallonsForSingleProduct = () => {
                let gallons = {};
                let gallonNum = parseInt(getNumberInString(productSize));
                gallons[gallonNum] = {
                    biotone: getBiotone(gallonNum),
                    raisedBedMix: getRaisedBedMix(gallonNum),
                    permaTill: getPermaTill(gallonNum),
                };
                return gallons;
            };

            const getGallons = () => {
                if (hasSize) return getGallonsForSingleProduct();

                let gallons = {};
                let gallonOptions = Array.from(
                    document.querySelectorAll('.form-radio + .form-option')
                );
                gallonOptions = gallonOptions
                    .map((option) => getNumberInString(option.textContent))
                    .map((option) => parseInt(option))
                    .forEach((option) => {
                        gallons[option] = {
                            biotone: getBiotone(option),
                            raisedBedMix: getRaisedBedMix(option),
                            permaTill: getPermaTill(option),
                        };
                    });
                return gallons;
            };

            // console.log(getGallons());

            const addToCart = async (product_id, quantity, options) => {
                let body = {
                    action: 'add',
                    product_id: product_id,
                    'qty[]': quantity,
                };

                let optionKey = '';
                let optionValue = '';

                for (const [key, value] of Object.entries(options)) {
                    body[key] = value;
                    optionKey = key;
                    optionValue = value;
                }

                const data = await fetch('/remote/v1/cart/add', {
                    headers: REQUEST_HEADERS,
                    referrerPolicy: 'strict-origin-when-cross-origin',
                    body: convertJSONToFormDataString(body),
                    method: 'POST',
                    mode: 'cors',
                    credentials: 'include',
                });

                return data.json();
            };

            const addAllRecommendedToCart = (recommended) => {
                return new Promise(async (resolve, reject) => {
                    let totalPrice = 0;

                    for (let i = 0; i < recommended.length; i++) {
                        const recommendation = recommended[i];
                        const response = await addToCart(
                            recommendation.product_id,
                            recommendation.quantity,
                            recommendation.options
                        );
                        totalPrice += response.data.product_value;
                    }

                    resolve(totalPrice);
                });
            };

            const addGsToCart = (gs) => {
                return addAllRecommendedToCart([
                    gs.biotone,
                    gs.raisedBedMix,
                    gs.permaTill,
                ]);
            };

            // let CURRENT_OPTION = null;

            // Array.from(document.querySelectorAll(".form-radio + .form-option")).forEach(radio => {
            //     addEventListener("click", (e) => {
            //         if (CURRENT_OPTION == e.target || e.target.className != "form-option") return;
            //         CURRENT_OPTION = e.target;
            //         const gs = getGallons()[getNumberInString(e.target.textContent)];

            //         // addGsToCart(gs);
            //     });
            // });

            async function createRecommendedPopup(_g, gs) {
                const popup = createPopup(
                    'Add These for Best Planting Practice',
                    '',
                    true
                );
                const popupContent = popup.querySelector('.content-div');
                const recommendedContainer = document.createElement('div');
                recommendedContainer.classList.add('recommended-container');
                recommendedContainer.style.padding = '1rem';
                recommendedContainer.style.height = 'fit-content';
                recommendedContainer.style.display = 'grid';
                recommendedContainer.style.placeItems = 'center';
                recommendedContainer.style.width = '100%';
                popupContent.appendChild(recommendedContainer);

                popupContent.style.paddingTop = '0';
                popupContent.style.paddingBottom = '0';

                popup.classList.add('recommended-popup');

                const loadingDiv = document.createElement('div');
                loadingDiv.textContent = '';
                loadingDiv.style.width = '5rem';
                loadingDiv.style.height = '5rem';
                loadingDiv.style.borderRadius = '50%';
                loadingDiv.style.border = '0.25rem solid #379c44';
                loadingDiv.style.borderTop = '0.25rem solid white';
                loadingDiv.style.backgroundColor = 'white';
                loadingDiv.style.padding = '0';
                loadingDiv.style.margin = '0 auto';
                loadingDiv.style.marginTop = '3.25rem';
                loadingDiv.style.animation = 'spin 1s linear infinite';

                recommendedContainer.appendChild(loadingDiv);

                const cartDataText = `<div class="previewCart" data-cart-quantity="6">    <div class="_body">        <ul class="previewCartList">            <li                class="previewCartItem"                data-cart-itemid="51909dea-2856-4c45-b32e-4be09d31e7a6">                <div class="previewCartItem-image">                    <img                        src="https://cdn11.bigcommerce.com/s-wmonsw2bbs/images/stencil/80x80/attribute_rule_images/1274_source_1710877022.jpg"                        alt="Muskogee Lavender Crape Mrytle Tree"                        title="Muskogee Lavender Crape Mrytle Tree"                        data-sizes="auto"                        srcset="                            https://cdn11.bigcommerce.com/s-wmonsw2bbs/images/stencil/80w/attribute_rule_images/1274_source_1710877022.jpg     80w,                            https://cdn11.bigcommerce.com/s-wmonsw2bbs/images/stencil/160w/attribute_rule_images/1274_source_1710877022.jpg   160w,                            https://cdn11.bigcommerce.com/s-wmonsw2bbs/images/stencil/320w/attribute_rule_images/1274_source_1710877022.jpg   320w,                            https://cdn11.bigcommerce.com/s-wmonsw2bbs/images/stencil/640w/attribute_rule_images/1274_source_1710877022.jpg   640w,                            https://cdn11.bigcommerce.com/s-wmonsw2bbs/images/stencil/960w/attribute_rule_images/1274_source_1710877022.jpg   960w,                            https://cdn11.bigcommerce.com/s-wmonsw2bbs/images/stencil/1280w/attribute_rule_images/1274_source_1710877022.jpg 1280w,                            https://cdn11.bigcommerce.com/s-wmonsw2bbs/images/stencil/1920w/attribute_rule_images/1274_source_1710877022.jpg 1920w,                            https://cdn11.bigcommerce.com/s-wmonsw2bbs/images/stencil/2560w/attribute_rule_images/1274_source_1710877022.jpg 2560w                        "                        data-srcset="https://cdn11.bigcommerce.com/s-wmonsw2bbs/images/stencil/80w/attribute_rule_images/1274_source_1710877022.jpg 80w, https://cdn11.bigcommerce.com/s-wmonsw2bbs/images/stencil/160w/attribute_rule_images/1274_source_1710877022.jpg 160w, https://cdn11.bigcommerce.com/s-wmonsw2bbs/images/stencil/320w/attribute_rule_images/1274_source_1710877022.jpg 320w, https://cdn11.bigcommerce.com/s-wmonsw2bbs/images/stencil/640w/attribute_rule_images/1274_source_1710877022.jpg 640w, https://cdn11.bigcommerce.com/s-wmonsw2bbs/images/stencil/960w/attribute_rule_images/1274_source_1710877022.jpg 960w, https://cdn11.bigcommerce.com/s-wmonsw2bbs/images/stencil/1280w/attribute_rule_images/1274_source_1710877022.jpg 1280w, https://cdn11.bigcommerce.com/s-wmonsw2bbs/images/stencil/1920w/attribute_rule_images/1274_source_1710877022.jpg 1920w, https://cdn11.bigcommerce.com/s-wmonsw2bbs/images/stencil/2560w/attribute_rule_images/1274_source_1710877022.jpg 2560w"                        class="lazyautosizes ls-is-cached lazyloaded"                        sizes="155px" />                </div>                <div class="previewCartItem-content">                    <h6 class="previewCartItem-name">                        <a                            href="/muskogee-lavender-crape-mrytle-tree/"                            alt="Muskogee Lavender Crape Mrytle Tree"                            title="Muskogee Lavender Crape Mrytle Tree"                            >Muskogee Lavender Crape Mrytle Tree</a                        >                    </h6>                    <span class="previewCartItem-price">                        <span>$169.99</span>                    </span>                </div>            </li>        </ul>    </div>    <div class="_footer">        <div class="previewCartAction">            <ul class="previewCartAction-totals">                <li class="cart-total cart-total--subtotal">                    <div class="cart-total-label">Subtotal</div>                    <div class="cart-total-value"><span>$0.00</span></div>                </li>            </ul>            <div class="previewCartAction-checkout">                <a class="checkout button button--primary">                    Add All to Cart                </a>            </div>        </div>    </div></div>`;

                const cartDataDOM = new DOMParser().parseFromString(
                    cartDataText,
                    'text/html'
                );
                // cartDataDOM.querySelector(".previewCart-additionalCheckoutButtons").remove();
                // Array.from(cartDataDOM.querySelectorAll(".previewCartItem-remove")).forEach(v => v.remove());
                cartDataDOM.querySelector('.previewCart').style.display =
                    'none';

                const addAllToCartButton =
                    cartDataDOM.querySelector('.checkout');
                // addAllToCartButton.textContent = "Add All to Cart";

                cartDataDOM.querySelector(
                    '.previewCartAction-totals'
                ).style.margin = '0';

                const OG_CART_ITEM =
                    cartDataDOM.querySelector('.previewCartItem');
                OG_CART_ITEM.remove();

                const previewCart = cartDataDOM.querySelector('.previewCart');
                previewCart.remove();

                recommendedContainer.appendChild(previewCart);

                let TOTAL_PRICE = 0;

                const createCartItem = (
                    name,
                    price,
                    thumbnail,
                    quantity,
                    instock = true
                ) => {
                    const cartItem = OG_CART_ITEM.cloneNode(true);
                    cartItem.querySelector(
                        '.previewCartItem-name a'
                    ).textContent = name;
                    cartItem
                        .querySelector('.previewCartItem-name a')
                        .removeAttribute('alt');
                    cartItem
                        .querySelector('.previewCartItem-name a')
                        .removeAttribute('title');
                    cartItem.querySelector('.previewCartItem-name a').onclick =
                        (e) => e.preventDefault();
                    cartItem
                        .querySelector('.previewCartItem-name a')
                        .removeAttribute('href');
                    cartItem.querySelector(
                        '.previewCartItem-name a'
                    ).style.cursor = 'default';
                    cartItem.querySelector(
                        '.previewCartItem-name a'
                    ).style.textDecoration = 'none';
                    cartItem.querySelector(
                        '.previewCartItem-name a'
                    ).style.color = 'black';
                    cartItem.querySelector(
                        '.previewCartItem-price span'
                    ).textContent = instock
                        ? `${quantity < 2 ? '' : quantity + ' x '}$${price}`
                        : 'Out of Stock';
                    cartItem.querySelector(
                        '.previewCartItem-image img'
                    ).srcset = '';
                    cartItem.querySelector(
                        '.previewCartItem-image img'
                    ).dataset.srcset = '';
                    cartItem
                        .querySelector('.previewCartItem-image img')
                        .setAttribute('src', thumbnail);

                    if (instock) TOTAL_PRICE += price * quantity;
                    return cartItem;
                };

                // const addCartItem = (cartItem) => {
                //     console.log(cartDataDOM, previewCart);
                //     previewCart.querySelector(".previewCartList").appendChild(cartItem);
                // }

                const createProduct = (productData) => {
                    // if (!productData.instock) return;
                    if (!productData.name) return;
                    const newItem = createCartItem(
                        productData.name,
                        +productData.price,
                        productData.thumbnail,
                        +productData.quantity,
                        productData.instock
                    );

                    newItem.dataset.productData = JSON.stringify(productData);

                    const contentDiv = newItem.querySelector(
                        '.previewCartItem-content'
                    );
                    const addToCartButton = document.createElement('button');
                    addToCartButton.textContent = 'Add to Cart';
                    addToCartButton.className =
                        'addToCartButtonPop button button--primary';
                    addToCartButton.disabled = !productData.instock;

                    previewCart
                        .querySelector('.previewCartList')
                        .appendChild(newItem);

                    addToCartButton.style.padding = '0.5rem 1rem';
                    addToCartButton.style.marginTop = '1rem';
                    addToCartButton.style.fontSize = '1rem';

                    // contentDiv.innerHTML += "<br />";
                    contentDiv.appendChild(addToCartButton);

                    return newItem;
                };

                window.gs = gs;

                let biotoneData = extractProductCardData(gs.biotone);
                let raisedBedMixData = extractProductCardData(gs.raisedBedMix);
                let permaTillData = extractProductCardData(gs.permaTill);

                [biotoneData, raisedBedMixData, permaTillData] =
                    await Promise.all([
                        biotoneData,
                        raisedBedMixData,
                        permaTillData,
                    ]);

                const _form = document.querySelector('.form--addToCart');
                const _product_id = _form.querySelector(
                    "input[name='product_id']"
                ).value;
                const _quantity = _form.querySelector(
                    "input[name='qty[]']"
                ).value;

                const checkedOptionEl = document.querySelector(
                    '.form-radio:checked'
                );

                let _options = {};

                if (!hasSize) {
                    _options = {
                        [checkedOptionEl.name]: checkedOptionEl.value,
                    };
                }

                const itemData = await extractProductCardData({
                    product_id: _product_id,
                    quantity: _quantity,
                    options: _options,
                });

                createProduct(itemData);
                createProduct(biotoneData);
                createProduct(raisedBedMixData);
                createProduct(permaTillData);

                previewCart.querySelector(
                    '.cart-total-value span'
                ).textContent = `$${TOTAL_PRICE.toFixed(2)}`;

                Array.from(
                    previewCart.querySelectorAll('.addToCartButtonPop')
                ).forEach((button) => {
                    button.addEventListener('click', (e) => {
                        let originalAttributes = {};

                        originalAttributes.textContent = button.textContent;
                        originalAttributes.width = button.style.width;
                        originalAttributes.height = button.style.height;
                        originalAttributes.borderRadius =
                            button.style.borderRadius;
                        originalAttributes.border = button.style.border;
                        originalAttributes.borderTop = button.style.borderTop;
                        originalAttributes.backgroundColor =
                            button.style.backgroundColor;
                        originalAttributes.padding = button.style.padding;
                        originalAttributes.animation = button.style.animation;
                        originalAttributes.margin = button.style.margin;
                        originalAttributes.marginTop = button.style.marginTop;

                        // Turn button into loader
                        button.textContent = '';
                        button.style.width = '2rem';
                        button.style.height = '2rem';
                        button.style.borderRadius = '50%';
                        button.style.border = '0.25rem solid #379c44';
                        button.style.borderTop = '0.25rem solid white';
                        button.style.backgroundColor = 'white';
                        button.style.padding = '0';
                        button.style.animation = 'spins 1s linear infinite';
                        button.style.margin = '0 auto';
                        button.style.marginTop = '1rem';

                        let productData = JSON.parse(
                            button.parentElement.parentElement.dataset
                                .productData
                        );
                        addToCart(
                            productData.gData.product_id,
                            productData.gData.quantity,
                            productData.gData.options
                        ).then((data) => {
                            button.textContent = 'Added to Cart';
                            button.style.width = originalAttributes.width;
                            button.style.height = originalAttributes.height;
                            button.style.borderRadius =
                                originalAttributes.borderRadius;
                            button.style.border = originalAttributes.border;
                            button.style.borderTop =
                                originalAttributes.borderTop;
                            button.style.backgroundColor =
                                originalAttributes.backgroundColor;
                            button.style.padding = originalAttributes.padding;
                            button.style.animation =
                                originalAttributes.animation;
                            button.style.margin = originalAttributes.margin;
                            button.style.marginTop =
                                originalAttributes.marginTop;
                            button.disabled = true;

                            new Promise((resolve) =>
                                setTimeout(resolve, 3000)
                            ).then(() => {
                                button.textContent =
                                    originalAttributes.textContent;
                                button.disabled = false;
                            });
                        });
                    });
                });

                addAllToCartButton.addEventListener('click', () => {
                    addAllToCartButton.textContent = '';
                    addAllToCartButton.style.width = '2rem';
                    addAllToCartButton.style.height = '2rem';
                    addAllToCartButton.style.borderRadius = '50%';
                    addAllToCartButton.style.border = '0.25rem solid #379c44';
                    addAllToCartButton.style.borderTop = '0.25rem solid white';
                    addAllToCartButton.style.backgroundColor = 'white';
                    addAllToCartButton.style.padding = '0';
                    addAllToCartButton.style.animation =
                        'spin 1s linear infinite';
                    addAllToCartButton.style.margin = '0 auto';
                    addAllToCartButton.style.marginTop = '2rem';
                    addAllToCartButton.style.display = 'block';

                    addGsToCart(gs).then(() => {
                        document.querySelector('.popup-background').click();
                        // openCart();
                        document
                            .querySelector('#form-action-addToCart')
                            .click();
                    });
                });

                loadingDiv.remove();
                previewCart.style.display = 'block';

                // const totalString = `We recommended that you purchase ${biotoneStr} of Biotone, ${raisedBedMixStr} of Raised Bed Mix, and ${permaTillStr} of PermaTill.`;
                // const totalStringEl = document.createElement("p");
                // totalStringEl.textContent = totalString;
                // recommendedContainer.appendChild(totalStringEl);

                // const addAllToCartButton = document.createElement("button");
                // addAllToCartButton.textContent = "Add All to Cart";
                // addAllToCartButton.addEventListener("click", () => {
                //     addGsToCart(gs);
                // });
                // recommendedContainer.appendChild(addAllToCartButton);
            }

            const _g = +getNumberInString(
                SELECTED ? SELECTED.textContent : productSize
            );
            const gs = getGallons()[_g];

            createRecommendedPopup(_g, gs);

            // console.log(_g, gs);

            // const biotoneStr = getBiotoneAmount(_g);
            // console.log(getBiotoneAmount(_g));
            // const raisedBedMixStr = getRaisedBedString(_g);
            // const permaTillStr = (() => {
            //     if (_g <= 10) return "1 20 lb. bag"
            //     if (10 < _g < 30) return "1 40 lb. bag"
            //     if (_g >= 30) return "2 40 lb. bags"
            // })();

            // const totalString = `We recommended that you purchase ${biotoneStr} of Biotone, ${raisedBedMixStr} of Raised Bed Mix, and ${permaTillStr} of PermaTill.`;
        };
        window.startTheShow = startTheShow;

        let BUTTON_CREATED = false;

        function createTheButton() {
            if (BUTTON_CREATED) return;
            BUTTON_CREATED = true;
            const optionsWrapper = document.querySelector(
                '.productView-options'
            );
            function buildButton() {
                let btn = document.createElement('button');
                btn.textContent = 'Recommended Products';
                btn.className =
                    'recommended-products-option button button--primary';
                btn.style.textTransform = 'none';
                btn.style.margin = '0.5rem 0';

                btn.addEventListener('click', async (e) => {
                    e.preventDefault();

                    // Turn the button into a loader
                    btn.textContent = '';
                    btn.style.width = '2rem';
                    btn.style.height = '2rem';
                    btn.style.borderRadius = '50%';
                    btn.style.border = '0.25rem solid #379c44';
                    btn.style.borderTop = '0.25rem solid transparent';
                    btn.style.backgroundColor = 'transparent';
                    btn.style.padding = '0';
                    btn.style.animation = 'spin 1s linear infinite';
                    btn.style.margin = '0 auto';
                    btn.style.marginTop = '2rem';

                    while (!window.IDS) {
                        await new Promise((resolve) =>
                            setTimeout(resolve, 500)
                        );
                    }

                    startTheShow();

                    btn.remove();
                    btn = buildButton();
                    optionsWrapper.appendChild(btn);
                });

                return btn;
            }

            const recommendedProductOption = buildButton();

            optionsWrapper.appendChild(recommendedProductOption);

            return recommendedProductOption;
        }

        if (hasSize) createTheButton();

        if (
            document
                .querySelector('.breadcrumbs')
                .textContent.includes('Trees') ||
            document
                .querySelector('.breadcrumbs')
                .textContent.includes('Plants')
        ) {
            let btn = createTheButton();
            btn.disabled = true;

            Array.from(document.querySelectorAll('.form-radio')).forEach(
                (radio) => {
                    radio.addEventListener(
                        'click',
                        () => (btn.disabled = false)
                    );
                }
            );
        }
    } catch (e) {
        console.warn(e);
    }

    try {
        const getPromotionProducts = async () => {
            const response = await fetch('/content/web/promotion-config.json');
            const data = await response.json();

            return data;
        };

        const prod_id = document.querySelector(`[name='product_id']`).value;

        getPromotionProducts().then((promotionProducts) => {
            const prod = promotionProducts['promotion_products'].find(
                (pprod) => pprod.product_id == prod_id
            );
            if (prod) {
                const info = document.querySelector('.productView-info');
                const promo = document.createElement('div');
                promo.className = 'promo-badge';
                promo.textContent =
                    promotionProducts['promotions'][prod.promotion];
                info.after(promo);

                // Add Sale label to items in promotions-config.json
                const saleDiv = document.querySelector('.productView-product')
                    .children[0];
                const sale = document.createElement('div');
                sale.className = 'productView-saleLabel';
                sale.textContent = ' Sale ';
                saleDiv.before(sale);
            }
        });
    } catch (e) {
        console.log('');
        console.log('');
        console.log('');
        console.log('');
        console.log(e);
    }

    try {
        const productImgContainers = Array.from(
            document.querySelectorAll('.card-img-container')
        );

        const getPromotionProducts = async () => {
            const response = await fetch('/content/web/promotion-config.json');
            const data = await response.json();

            return data;
        };

        getPromotionProducts().then((promotionProducts) => {
            productImgContainers
                .filter((container) => {
                    const img = container.querySelector('img');
                    const arr = img.src.split('/');
                    const productID = arr[arr.indexOf('products') + 1];

                    return promotionProducts['promotion_products'].find(
                        (pprod) => pprod.product_id == productID
                    );
                })
                .forEach((container) => {
                    const img = container.querySelector('img');
                    const arr = img.src.split('/');
                    const productID = arr[arr.indexOf('products') + 1];

                    const figure = container.closest('figure').children[0];

                    const promo = document.createElement('div');

                    promo.className = 'sale-flag-side';

                    const promoText = document.createElement('span');
                    promoText.className = 'sale-text';
                    promoText.textContent = 'SALE';

                    promo.appendChild(promoText);
                    figure.before(promo);
                });
        });
    } catch (e) {
        console.log('WARNING WARNING WARNING');
        console.error(e);
    }

    const handleHeader = (r) => {
        const data = r['sales_banner_config'];
        const {
            show: showBanner,
            background_color,
            text_color,
            title,
            href,
            content,
        } = data;
        const {
            show: showContent,
            is_scrolling,
            static_text,
            scrolling_items,
        } = content;

        const shopSelect = document.querySelector('.shop-select');
        const ssHeader = shopSelect.querySelector('.ss-header');
        const ssItems = shopSelect.querySelector('.ss-items');

        if (!showBanner) {
            shopSelect.remove();
            return;
        }

        if (href != null) shopSelect.setAttribute('href', href);

        ssHeader.textContent = title;

        shopSelect.style.backgroundColor = background_color;
        shopSelect.style.color = text_color;

        if (!showContent) {
            ssItems.remove();
            return;
        }

        if (is_scrolling) {
            ssItems.classList.add('marquee');

            let ps = [
                document.createElement('p'),
                document.createElement('p'),
                document.createElement('p'),
                document.createElement('p'),
            ];
            ps.forEach((p) => {
                let ptext = '';
                scrolling_items.forEach((item) => {
                    ptext += item + '&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;';
                });
                p.innerHTML = ptext;
            });
            ps.forEach((p) => ssItems.appendChild(p));
        } else {
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.flexDirection = 'column';
            div.style.justifyContent = 'center';
            div.style.alignItems = 'center';
            div.style.height = '100%';
            div.style.width = '100%';
            div.style.fontSize = '1.5rem';

            div.textContent = static_text;

            ssItems.appendChild(div);
        }
    };

    const handleHeaderGrid = (r) => {
        const data = r['header_grid_config'];
        const [itemA, itemB] = data;

        const section = document.querySelector(
            '.beautify__section--header-grid'
        );
        const regionA = section.querySelector('.region-a');
        const regionB = section.querySelector('.region-b');

        const headerA = regionA
            .querySelector('.header')
            .querySelector('strong');
        const headerB = regionB.querySelector('.header');

        const paraA = regionA.querySelector('.para');
        const paraB = regionB.querySelector('.para');

        headerA.textContent = itemA.title;
        headerB.textContent = itemB.title;

        paraA.textContent = itemA.content;
        paraB.textContent = itemB.content;

        if (itemA.image.src) {
            const img = document.createElement('img');
            img.src = itemA.image.src;
            img.alt = itemA.image.alt;
            let img_css = itemA.image.css;
            for (let prop in img_css) {
                img.style[prop] = img_css[prop];
            }

            regionA.appendChild(img);
        }
    };

    const handleLandscape = (r) => {
        const data = r['landscape_config'];
        const { title, content, image_url, button } = data;
        const { text, href, color } = button;

        const section = document.querySelector(
            '.beautify__section--below-section1'
        );
        const wrapper = section.querySelector('.wrapper');

        const headerW = wrapper.querySelector('.header');
        const header = headerW.querySelector('h2');

        headerW.style.backgroundImage = `url("${image_url}")`;
        header.textContent = title;

        const more = wrapper.querySelector('.more');
        const more_p = more.querySelector('p');
        const more_btn = more.querySelector('a');

        more_p.textContent = content;
        more_btn.textContent = text;
        more_btn.setAttribute('href', href);
        more_btn.style.backgroundColor = color;
    };

    const handlers = [handleHeader, handleHeaderGrid, handleLandscape];

    try {
        const newGrid = (selector, reqData, onData) => {
            return {
                element: document.querySelector(selector),
                requestedData: reqData,
                ondata: (response, child, i) => {
                    const data = response[reqData][i];
                    onData(data, child);
                },
            };
        };

        let grids = [
            newGrid(
                '.beautify__section--3x1grid',
                '3x1_config',
                (data, child) => {
                    const image_url = data['image_url'];
                    const href = data['href'];
                    const target = data['target'];
                    const caption = data['caption'];
                    const showCaption = caption['show'];
                    const text = caption['text'];
                    const position = caption['position'];
                    const alt = data['alt'];

                    child.setAttribute('title', alt);

                    child.style.backgroundImage = `url("${image_url}")`;
                    child.setAttribute('href', href);
                    if (target != null) child.setAttribute('target', target);

                    if (showCaption) {
                        const overlay = document.createElement('div');
                        overlay.className = `block-overlay block-overlay-${position}`;

                        const overlayContent = document.createElement('div');
                        overlayContent.className = 'block-overlay-content';
                        overlayContent.textContent = text;

                        overlay.appendChild(overlayContent);
                        child.appendChild(overlay);
                    }
                }
            ),
            newGrid(
                '.beautify__section--blocks',
                'blocks_config',
                (data, child) => {
                    const image_url = data['image_url'];
                    const href = data['href'];
                    const alt = data['alt'];

                    child.setAttribute('title', alt);

                    child.style.backgroundImage = `url("${image_url}")`;
                    child.setAttribute('href', href);
                }
            ),
            newGrid(
                '.beautify__section--4x2grid',
                '4x2_config',
                (data, child) => {
                    const image_url = data['image_url'];
                    const href = data['href'];
                    const title = data['title'];
                    const alt = data['alt'];

                    child.querySelector('.image').setAttribute('title', alt);

                    child.querySelector(
                        '.image'
                    ).style.backgroundImage = `url("${image_url}")`;
                    child.setAttribute('href', href);
                    child.querySelector('.title').textContent = title;
                }
            ),
        ];

        grids = grids.filter((grid) => grid.element != null);
        grids = grids.map((grid) => {
            return {
                ...grid,
                wrapper: grid.element.querySelector('.block-wrapper'),
            };
        });
        grids = grids.filter((grid) => grid.wrapper != null);

        fetch('https://settlemyrenursery.com/content/web/homepage-config.json')
            .then((r) => r.json())
            .then((r) => {
                console.log(r);

                grids.forEach((grid) => {
                    Array.from(grid.wrapper.children).forEach((child, i) => {
                        grid.ondata(r, child, i);
                    });
                });

                handlers.forEach((handler) => handler(r));
            });
    } catch (e) {
        console.log(e);
    }

    try {
        document.querySelector(
            `img[src="https://cdn11.bigcommerce.com/s-wmonsw2bbs/images/stencil/original/image-manager/planters-header.jpg?t=1715979235388"]`
        ).src = `https://cdn11.bigcommerce.com/s-wmonsw2bbs/images/stencil/original/image-manager/planters-header.jpg?t=${Date.now()}`;
    } catch (e) {
        console.log(e);
    }

    try {
        const sels = ['', '#giftPageOne', '#giftPageTwo', '#giftPageThree'];

        const getPage = (num) => document.querySelector(sels[num]);

        const pages = Array.from(document.querySelectorAll('.gift-page'));

        const pagesToListen = [getPage(2)];

        let pageContent = {};

        function initPages() {
            pages.forEach((page) => {
                pageContent[page.id] = page.innerHTML;
                if (page.id == 'giftPageOne') return;
                page.innerHTML = '';
            });
        }

        function hideAllPages() {
            pages.forEach((page) => {
                page.innerHTML = '';
            });
        }

        function showPage(page) {
            hideAllPages();
            page.innerHTML = pageContent[page.id];

            if (page.id == 'giftPageTwo') registerListeners();
        }

        function initRadios() {
            document.querySelectorAll('.gift-radio').forEach((radio) => {
                radio.onclick = () => {
                    document.querySelector(
                        '.gift-radio:checked'
                    ).checked = false;
                    radio.checked = true;

                    const gift = radio.value;

                    const page = getPage(+gift);
                    showPage(page);
                };
            });
        }

        function registerListeners() {
            pagesToListen.forEach((page) => {
                const fromEmail = page.querySelector('#from_email');
                const toEmail = page.querySelector('#to_email');

                const fromName = page.querySelector('#from_name');
                const toName = page.querySelector('#to_name');

                toEmail.parentElement.style.display = 'none';
                toName.parentElement.style.display = 'none';

                const fromEmailHandler = (e) => {
                    toEmail.value = e.target.value;
                };

                const fromNameHandler = (e) => {
                    toName.value = e.target.value;
                };

                fromName.value = '';
                fromEmail.value = '';

                ['change', 'keydown', 'paste', 'input'].forEach((event) => {
                    fromEmail.addEventListener(event, fromEmailHandler);
                    fromName.addEventListener(event, fromNameHandler);
                });
            });
        }

        initPages();
        initRadios();
    } catch (e) {}
}
