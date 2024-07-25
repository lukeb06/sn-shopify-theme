const el = ([s]) => document.querySelector(s);
const els = ([s]) => Array.from(document.querySelectorAll(s));
const mkel = ([s]) => document.createElement(s);
const ol = 'to';

Element.prototype.el = function ([s]) {
    return this.querySelector(s);
};

Element.prototype.els = function ([s]) {
    return Array.from(this.querySelectorAll(s));
};

Element.prototype.mkel = function ([s]) {
    return this.appendChild(mkel(s));
};

try {
    /*

fetch('https://api.ipify.org?format=json')
    .then((r) => r.json())
    .then(({ ip }) => {
        fetch(`http://ip-api.com/json/${ip}`)
            .then((r) => r.json())
            .then((r) => console.log(r));
    });

*/

    async function getClientIP() {
        return new Promise((resolve, reject) => {
            fetch('https://api.ipify.org?format=json')
                .then((r) => r.json())
                .then(({ ip }) => resolve(ip));
        });
    }

    async function getClientZip(ip) {
        return new Promise((resolve, reject) => {
            fetch(`https://ipinfo.io/${ip}?${ol}ken=49bf257e5521e4`)
                .then((r) => r.json())
                .then(({ postal }) => resolve(postal));
        });
    }

    async function fetchZone(zip) {
        let response = await fetch(`https://phzmapi.org/${zip}.json`);
        let { zone } = await response.json();
        if (!zone) return 'ERR';
        return zone;
    }

    function getClientZone() {
        return new Promise((resolve, reject) => {
            getClientIP().then(getClientZip).then(fetchZone).then(resolve);
        });
    }

    window.getClientZone = getClientZone;
    window.getClientIP = getClientIP;
    window.getClientZip = getClientZip;
    window.fetchZone = fetchZone;

    function setZoneContent(zone) {
        els`.myZone`.forEach((z) => {
            z.textContent = zone;
        });
    }

    // Remove all non-numeric characters from the zone
    function convertZoneToInt(zone) {
        return zone.replace(/[^0-9]/g, '');
    }

    function setLocalZone(zone) {
        localStorage.setItem('zone', zone);
        localStorage.setItem('zone-int', convertZoneToInt(zone));
        setZoneContent(zone);
    }

    function toggleZoneDropdown() {
        el`#zoneDropdownContent`.classList.toggle('d-none');
    }

    window.getLocalZone = () => {
        return +localStorage.getItem('zone-int');
    };

    if (!localStorage.getItem('zipcode') || !localStorage.getItem('zone')) {
        window
            .getClientIP()
            .then(window.getClientZip)
            .then((zip) => {
                localStorage.setItem('zipcode', zip);
                document.getElementById('myZip').textContent = zip;
                window.fetchZone(zip).then((zone) => {
                    setLocalZone(zone);
                });
            });
    } else {
        setZoneContent(localStorage.getItem('zone'));

        document.getElementById('myZip').textContent =
            localStorage.getItem('zipcode');
    }

    el`#zipInput`.addEventListener('input', (e) => {
        const zip = e.target.value;
        if (zip.length == 5) {
            localStorage.setItem('zipcode', zip);
            document.getElementById('myZip').textContent = zip;
            window.fetchZone(zip).then((zone) => {
                setLocalZone(zone);
            });
        }
    });

    el`.zone-btn.zone-muted`.addEventListener('click', async (e) => {
        e.target.disabled = true;
        const ip = await window.getClientIP();
        const zip = await window.getClientZip(ip);
        localStorage.setItem('zipcode', zip);
        document.getElementById('myZip').textContent = zip;
        window.fetchZone(zip).then((zone) => {
            setLocalZone(zone);
            e.target.disabled = false;
        });
    });

    el`.zone-btn:not(.zone-muted)`.addEventListener('click', (e) => {
        el`#zoneDropdownContent`.classList.add('d-none');
    });

    els`.page-width:has(.zone-dropdown-content) > div:not(.zone-dropdown-content)`.forEach(
        (e) => e.addEventListener('click', toggleZoneDropdown)
    );
} catch (e) {}

// Get JSON Files from NGROK
try {
    window.shopifyCDN = (file) => {
        return `https://cdn.shopify.com/s/files/1/0886/9658/6534/files/${file}?t=${Math.floor(
            Math.random() * 100000
        )}`;
    };

    window.loadJSON = (url) => {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then((response) => response.json())
                .then((data) => resolve(data));
        });
    };

    window.loadImage = (coll) => {
        return new Promise((resolve, reject) => {
            fetch(
                'https://api.settlemyrenursery.com/files/catalog_images/collection_header_images/' +
                    coll.replaceAll('_', '-') +
                    '.jpg',
                {
                    method: 'GET',
                    headers: {
                        'ngrok-skip-browser-warning': 'skip',
                    },
                }
            )
                .then((response) => response.blob())
                .then((blob) => resolve(blob));
        });
    };
} catch (e) {
    console.warn("Couldn't load files");
    console.log(e);
}

// Dynamic Hompage
try {
    const handleHeader = (r) => {
        console.log('HANDLE');

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

        const shopSelect = el`.shop-select`;
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

        // headerA.textContent = itemA.title;
        // headerB.textContent = itemB.title;

        // paraA.textContent = itemA.content;
        // paraB.textContent = itemB.content;

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

    // const handlers = [handleHeader, handleHeaderGrid, handleLandscape];
    // const handlers = [handleLandscape, handleHeaderGrid];
    const handlers = [];

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
            // newGrid(
            //     '.beautify__section--3x1grid',
            //     '3x1_config',
            //     (data, child) => {
            //         const image_url = data['image_url'];
            //         const href = data['href'];
            //         const target = data['target'];
            //         const caption = data['caption'];
            //         const showCaption = caption['show'];
            //         const text = caption['text'];
            //         const position = caption['position'];
            //         const alt = data['alt'];

            //         child.setAttribute('title', alt);

            //         child.style.backgroundImage = `url("${image_url}")`;
            //         child.setAttribute('href', href);
            //         if (target != null) child.setAttribute('target', target);

            //         if (showCaption) {
            //             const overlay = document.createElement('div');
            //             overlay.className = `block-overlay block-overlay-${position}`;

            //             const overlayContent = document.createElement('div');
            //             overlayContent.className = 'block-overlay-content';
            //             overlayContent.textContent = text;

            //             overlay.appendChild(overlayContent);
            //             child.appendChild(overlay);
            //         }
            //     }
            // ),
            // newGrid(
            //     '.beautify__section--blocks',
            //     'blocks_config',
            //     (data, child) => {
            //         const image_url = data['image_url'];
            //         const href = data['href'];
            //         const alt = data['alt'];

            //         child.setAttribute('title', alt);

            //         child.style.backgroundImage = `url("${image_url}")`;
            //         child.setAttribute('href', href);
            //     }
            // ),
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
        // grids = [];

        loadJSON(window.shopifyCDN('homepage-config.json')).then((r) => {
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
} catch (e) {
    console.log(e);
}

// Grab and Release [THE SECTION DIRECTLY BELOW THE HOMEGRID]
try {
    function grab() {
        window.LAST_RESIZE = 'grab';

        const homeBelowGridSection = document.querySelector(
            '.shopify-section:has(.home-below-grid-wrapper)'
        );
        if (!homeBelowGridSection)
            throw new Error('No home below grid section');

        const featuredForHomeBelowGrid =
            homeBelowGridSection.nextElementSibling;
        if (!featuredForHomeBelowGrid)
            throw new Error('No featured for home below grid');

        const gridRegion_c = homeBelowGridSection.querySelector('.region-c');
        if (!gridRegion_c) throw new Error('No grid region c');

        gridRegion_c.appendChild(featuredForHomeBelowGrid);
    }

    function release() {
        window.LAST_RESIZE = 'release';

        const homeBelowGridSection = document.querySelector(
            '.shopify-section:has(.home-below-grid-wrapper)'
        );
        if (!homeBelowGridSection)
            throw new Error('No home below grid section');

        const featuredForHomeBelowGrid =
            homeBelowGridSection.querySelector('.shopify-section');

        if (!featuredForHomeBelowGrid)
            throw new Error('No featured for home below grid');

        const gridRegion_c = homeBelowGridSection.querySelector('.region-c');

        if (!gridRegion_c) throw new Error('No grid region c');

        gridRegion_c.removeChild(featuredForHomeBelowGrid);

        homeBelowGridSection.after(featuredForHomeBelowGrid);
    }

    if (window.innerWidth >= 801) {
        grab();
    }

    window.onresize = () => {
        if (window.innerWidth < 801) {
            if (window.LAST_RESIZE == 'release') return;
            release();
        } else {
            if (window.LAST_RESIZE == 'grab') return;
            grab();
        }
    };
} catch (e) {
    console.log(e);
}

// Navbar Hotlinks
try {
    window.stripText = (text) => {
        return text
            .replace(/[^a-zA-Z0-9]/g, ' ')
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-');
    };

    window
        .loadJSON(window.shopifyCDN('navbar-hotlinks.json'))
        .then((hotlinks) => {
            hotlinks.forEach((hotlink) => {
                const li =
                    els`.header__inline-menu > .list-menu--inline > li`.find(
                        (li) => {
                            return li.el`a`.innerText
                                .toLowerCase()
                                .includes(hotlink.find.toLowerCase());
                        }
                    );

                if (!li) return;

                const className = `${stripText(hotlink.find)}-hotlink`;

                li.classList.add(className);

                const newStyle = `
                .${className}:before {
                    content: '${hotlink.hot_text}';
                    display: block;
                    color: #ff4500;
                    background-color: #eee;
                    font-size: 0.8rem;
                    border-radius: 999px;
                    padding: 2px 8px;
                    font-weight: 700;
                    width: -webkit-fit-content;
                    width: -moz-fit-content;
                    width: fit-content;
                    margin: 0 auto;
                    -webkit-transform: translateY(11px);
                    -ms-transform: translateY(11px);
                    transform: translateY(11px);
                    font-family: serif;
                }
            `;

                const style = document.createElement('style');
                style.innerHTML = newStyle;

                li.before(style);
            });
        });
} catch (e) {
    console.warn("Couldn't load hotlinks");
    console.log(e);
}

try {
    // window.loadJSON(window.shopifyCDN('navbar-config.json')).then((r) => {
    //     const navItems = els`.list-menu li`;
    //     r.forEach((item) => {
    //         const li = navItems.find(
    //             (li) => li.innerText.toLowerCase() === item.find.toLowerCase()
    //         );

    //         if (!li) return;
    //         if (!item.visible) return li.classList.add('d-none');

    //         const { visibleFrom, visibleTo } = item.visible_when;

    //         let visibleFromDate = new Date(
    //             `${visibleFrom} ${new Date().getFullYear()}`
    //         ).getTime();
    //         let visibleToDate = new Date(
    //             `${visibleTo} ${new Date().getFullYear()}`
    //         ).getTime();

    //         if (Date.now() < visibleFromDate || Date.now() > visibleToDate) {
    //             // li.classList.add('d-none');
    //             li.classList.add('strike');
    //         }
    //     });
    // });

    parseItems();

    el`header-drawer span`.addEventListener('click', (event) => {
        for (let i = 5; i < 1000; i += 25) {
            setTimeout(() => {
                parseItems();
            }, i);
        }
    });

    function parseItems() {
        const navItems = [...document.querySelectorAll(`.list-menu > li`)];
        const navItemConfigs = document.querySelectorAll(`.nav-item-config`);

        navItemConfigs.forEach((config) => {
            const find = config.dataset.find;
            const visible = config.dataset.visible;
            const variableVisibility = config.dataset.variablevisibility;
            const startDate = config.dataset.startdate;
            const endDate = config.dataset.enddate;

            const lis = navItems.filter((li) => {
                let isIt =
                    li.innerText.toLowerCase().trim() ==
                    find.toLowerCase().trim();
                return isIt;
            });

            lis.forEach((li) => {
                if (!li) return;

                if (visible == 'false') return li.classList.add('d-none');

                if (variableVisibility == 'true') {
                    const visibleFromDate = new Date(
                        `${startDate} ${new Date().getFullYear()}`
                    ).getTime();
                    const visibleToDate = new Date(
                        `${endDate} ${new Date().getFullYear()}`
                    ).getTime();

                    if (
                        Date.now() < visibleFromDate ||
                        Date.now() > visibleToDate
                    ) {
                        li.classList.add('d-none');
                    }
                }
            });
        });
    }
} catch (e) {
    console.warn("Couldn't load navbar config");
    console.log(e);
}

// Navbar
try {
    const ul = el`.list-menu--inline`;
    const li = Array.from(ul.querySelectorAll('li'));

    const maxWidth = Math.ceil(
        li
            .map((item) => item.getBoundingClientRect().width)
            .reduce((a, b) => a + b)
    );

    ul.style.maxWidth = `${maxWidth}px`;

    ul.classList.remove('chidden');
} catch (e) {
    console.warn('Test');
    console.log(e);
}

// Landscape Design Carousels
try {
    console.log('Landscape Design Init');

    if (el`.landscape-page` == null) throw 'Not a landscape design page';

    els`.landscape-page .carousel`.forEach((carousel, carouselIndex) => {
        const images = Array.from(carousel.querySelectorAll('.carousel-image'));
        const dots = Array.from(carousel.querySelectorAll('.carousel-dot'));
        const arrows = Array.from(carousel.querySelectorAll('.carousel-arrow'));
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

// Landscape Design Popup Button Event Listener Assignment
try {
    const as = [
        ...els`a[href*="/trigger/landscape-popup"]`,
        ...els`.request-info.contact-button`,
    ];

    as.forEach((a) => {
        a.style.cursor = 'pointer';

        a.addEventListener('click', (e) => {
            e.preventDefault();
            createContactPopup();
        });
    });
} catch (e) {
    console.log(e);
}

// Contact Triggers
try {
    let calls = els`a[href*="/trigger/call"]`;
    let emails = els`a[href*="/trigger/email"]`;
    let texts = els`a[href*="/trigger/text"]`;

    calls.forEach((a) => {
        a.setAttribute('href', 'tel:+18288740679');
    });

    emails.forEach((a) => {
        a.setAttribute('href', 'mailto:sales@settlemyrenursery.com');
    });

    texts.forEach((a) => {
        a.setAttribute('href', 'sms:+18288740679');
    });
} catch (e) {}

// Email Subscription Form
try {
    const emailSubForm = el`#emailSubform`;
    emailSubForm.addEventListener('submit', async (e) => {
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
                ? 'Please check your email to receive a discount code.'
                : rText;
        createPopup(_head, _cont);
    });
} catch (e) {
    console.log(e);
}

// Product Description Accordion
try {
    const descriptions = els`.product__description`;
    let CHILDREN = descriptions.map((v) => [...v.children]);

    if (CHILDREN.length == 0) throw new Error('No descriptions');

    function onResize() {
        els`.PRE_VIEW`.forEach((v) => v.remove());

        descriptions.forEach((description, dIndex) => {
            const accordion = description.nextElementSibling;
            if (!accordion.classList.contains('product__accordion')) return;

            if (CHILDREN[dIndex].length < 2) {
                accordion.remove();
                description.classList.add('no-extra-content');

                throw new Error('Not enough content');
            }

            if (!description || !accordion) throw new Error('No description');

            function grabDescription() {
                const descriptionItems = Array.from(CHILDREN[dIndex]).filter(
                    (v, i) => i > 0
                );

                const accordionContent = accordion.querySelector(
                    '.accordion__content'
                );

                accordionContent.innerHTML = '';

                descriptionItems.forEach((item) => {
                    accordionContent.appendChild(item);
                });

                let preview = document.createElement('p');
                preview.innerHTML = getLinesOfText(
                    accordionContent.textContent,
                    description,
                    3
                );
                preview.classList.add('PRE_VIEW');
                description.appendChild(preview);

                return;
            }

            grabDescription();
        });
    }

    window.addEventListener('resize', onResize);
    onResize();
} catch (e) {
    console.warn("Couldn't load product view");
    console.log(e);

    const accordions = els`.accordion`;

    accordions.forEach((accordion) => {
        accordion.remove();
    });
}

// Buy Buttons
try {
    if (window.location.pathname.includes('gift-card'))
        throw new Error('Gift Card');

    if (window.innerWidth > 750) {
        desktopInit();
        throw new Error('Not Mobile');
    }

    desktopInit();

    function onDesktop() {
        if (window.LAST_RESIZE_BTNS == 'desktop') return;
        desktopInit();
        window.LAST_RESIZE_BTNS = 'desktop';

        console.log('DESKTOP');

        const productViewPickup = el`.productView-pickup`;
        const quantityButtonsWrapper = el`.quantity__buttons_wrapper`;

        productViewPickup.before(quantityButtonsWrapper);
    }

    function onMobile() {
        if (window.LAST_RESIZE_BTNS == 'mobile') return;
        window.LAST_RESIZE_BTNS = 'mobile';

        console.log('MOBILE');

        const quantityButtonsWrapper = el`.quantity__buttons_wrapper`;
        const productFormButtons = el`.product-form__buttons`;
        const quantityInput = el`.product-form__quantity`;

        // let topWrapper;

        // try {
        //     topWrapper = el`.product-top__wrapper`;
        //     if (!topWrapper) throw new Error('No top wrapper');
        // } catch (e) {
        //     topWrapper = mkel`div`;
        //     topWrapper.classList.add('product-top__wrapper');

        //     topWrapper.appendChild(quantityInput);
        //     topWrapper.appendChild(productFormButtons.querySelector('button'));

        //     productFormButtons.children[0].before(topWrapper);
        // }
        document.body.appendChild(quantityButtonsWrapper);

        window.showQuantityButtons = () => {
            quantityButtonsWrapper.classList.remove('hide');
        };

        window.hideQuantityButtons = () => {
            quantityButtonsWrapper.classList.add('hide');
        };

        window.onScroll = () => {
            const scrollTop = getScrollTop();
            const scrollHeight = getScrollHeight() - window.innerHeight;

            const threshold = 5;

            // Hide the quantity buttons if the user is within 5% of the bottom of the page
            if (scrollTop > scrollHeight * (1 - threshold / 100)) {
                quantityButtonsWrapper.classList.add('hide');
            } else {
                // Hide the quantity buttons if the user is within 5% of the top of the page
                if (scrollTop < window.innerHeight * (threshold / 100)) {
                    quantityButtonsWrapper.classList.add('hide');
                } else {
                    quantityButtonsWrapper.classList.remove('hide');
                }
            }
        };

        onScroll();
        window.addEventListener('scroll', onScroll);
    }

    function onResize() {
        if (window.innerWidth > 750) {
            window.removeEventListener('scroll', window.onScroll);
            window.onScroll = undefined;
            onDesktop();
        } else {
            try {
                onMobile();
            } catch (e) {
                console.log(e);
            }
        }
    }

    function desktopInit() {
        // onMobile();
        // onDesktop();
        const productFormButtons = el`.product-form__buttons`;
        const quantityInput = el`.product-form__quantity`;

        let topWrapper = mkel`div`;
        topWrapper.classList.add('product-top__wrapper');

        topWrapper.appendChild(quantityInput);
        topWrapper.appendChild(productFormButtons.querySelector('button'));

        productFormButtons.children[0].before(topWrapper);
    }

    onResize();
    window.addEventListener('resize', onResize);
} catch (e) {
    console.log(e);
}

// Landscape Design QR Code
try {
    console.log('Landscape Design QR Code');
    if (!el`.landscape-d-wrapper`) throw 'Not a landscape design page';

    async function logQr() {
        const urlObj = new URL(window.location.href);
        const params = urlObj.searchParams.get('qr');
        if (!params) return;
        const url = `https://api.settlemyrenursery.com/qr/${params}`;
        try {
            const response = await fetch(url, {
                headers: {
                    'ngrok-skip-browser-warning': 'skip',
                },
            });

            const data = await response.json();
            console.log(data);
        } catch (e) {
            console.error('Landscape Design QR Code Error');
            console.error(e);
        }
    }

    logQr();
} catch (e) {
    console.log(e);
}

// WIP COME BACK TO THIS
// TODO: Add icons to get in touch links
try {
    let getInTouch = Array.from(
        document
            .querySelector('.footer')
            .querySelectorAll('.footer-block__details-content')
    ).filter((v) => v.innerHTML.toLowerCase().includes('call now'))[0];

    if (!getInTouch) throw new Error('No get in touch');

    const links = Array.from(getInTouch.querySelectorAll('a'));

    let callNow = getLink('call');
    let chatNow = getLink('chat');
    let emailNow = getLink('email');
    let textNow = getLink('text');

    function getLink(query) {
        return links.find((v) => v.innerHTML.toLowerCase().includes(query));
    }
} catch (e) {
    console.log(e);
}

// Collection List Clickable Image
try {
    let collectionItems = [
        ...els`.collection-list__item`,
        ...els`.grid.product-grid .grid__item`,
    ];

    collectionItems.forEach((item) => {
        const s = mkel`style`;
        s.innerHTML = `
            .collection-list__item {
                cursor: pointer;
            }

            .grid__item {
                cursor:pointer;
            }
        `;
        item.before(s);

        const link = item.querySelector('a');
        const href = link.getAttribute('href');

        item.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = href;
        });
    });
} catch (e) {
    console.log(e);
}

// Mega Menu Images
try {
    async function getPageImage(url) {
        const response = await fetch(url);
        const data = await response.text();
        // Convert to DOM
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');

        const image = doc.querySelector(
            '.collection-hero__image-container img'
        );
        if (!image) throw new Error('No image');

        return image.src;
    }

    els`.mega-menu__list`.forEach((list) => {
        list.style.display = 'flex';
        list.style.flexDirection = 'row';
        list.style.gap = '1rem';
        list.style.flexWrap = 'wrap';
        list.style.overflowX = 'hidden';
    });

    els`.mega-menu__link`.forEach((link) => {
        const href = link.getAttribute('href');
        getPageImage(href).then((src) => {
            link.style.backgroundImage = `url('${src}')`;
            link.style.backgroundColor = '#379c44';
            link.style.color = 'white';
            link.style.width = '20rem';
            link.style.height = '20rem';
            link.style.display = 'block';
            link.style.backgroundSize = 'cover';
            link.style.backgroundPosition = 'center';
            link.style.backgroundRepeat = 'no-repeat';
            const text = link.textContent.trim();
            link.textContent = '';
            link.style.position = 'relative';
            link.classList.add('block-without-wrapper');

            const sty = mkel`style`;
            sty.innerHTML = `
                #${link.id}::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    display: block;
                    background-color: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(5px);
                    border-radius: 0.5rem;
                }

                #${link.id}::after {
                    content: '${text}';
                    position: absolute;
                    inset: 1rem;
                    display: grid;
                    place-items: center;
                    white-space: wrap;
                    text-align: center;
                    font-size: 3.5rem;
                }
            `;

            link.before(sty);
        });
    });
} catch (e) {
    console.error("COULDN'T LOAD MEGA MENU IMAGES");
    console.log(e);
} finally {
    console.log('MEGA MENU IMAGES LOADED');
}

// Replace "View full details" text on product page IF...
// ...the product is a gift card
// NOTE: This is a hack to improve UX.
// ISSUE: For whatever reason, you can't select...
//        product variants when using the product section.
// TODO: Investiage why this is happening and remove this.
try {
    document.getElementById('fullDetails').nextElementSibling.textContent =
        'View full product page';
} catch (e) {}

// Redirect /pages/gift-cards -> /products/gift-card
// NOTE: Gift Card page content is visible on the gift card product page
try {
    if (window.location.pathname.includes('/pages/gift-cards')) {
        window.location.href = '/products/gift-card';
    }
} catch (e) {}

// Collection Hero Title Background
try {
    console.log('COLLECTION HERO INIT');

    function resetCollectionHeroCache() {
        localStorage.setItem('time-of-last-collection-hero-reset', Date.now());

        let keys = Object.keys(localStorage).filter((v) =>
            v.includes('collection-hero-image')
        );

        keys.forEach((key) => {
            localStorage.removeItem(key);
        });
    }

    window.resetCache = resetCollectionHeroCache;

    if (!localStorage.getItem('time-of-last-collection-hero-reset')) {
        resetCollectionHeroCache();
    } else if (
        new Date().getTime() -
            +localStorage.getItem('time-of-last-collection-hero-reset') >
        1000 * 60 * 60 * 12
    ) {
        resetCollectionHeroCache();
    }

    if (!window.location.pathname.includes('collections'))
        throw new Error('Not Collection');

    let imageUrl;

    function setBackground(_imageUrl) {
        const title = el`.collection-hero__title`;
        title.style.backgroundImage = `url('${_imageUrl}')`;
    }

    try {
        let coll = window.location.pathname.replace('/collections/', '');

        if (localStorage.getItem(`collection-hero-image-${coll}`)) {
            imageUrl = localStorage.getItem(`collection-hero-image-${coll}`);

            setBackground(imageUrl);
        } else {
            window.loadImage(coll).then((blob) => {
                if (blob.size > 30) {
                    imageUrl = URL.createObjectURL(blob);
                    console.log(blob);

                    setBackground(imageUrl);

                    const reader = new FileReader();
                    reader.addEventListener('load', (event) => {
                        localStorage.setItem(
                            `collection-hero-image-${coll}`,
                            event.target.result
                        );
                    });

                    reader.readAsDataURL(blob);
                } else {
                    try {
                        imageUrl = el`#product-grid`.el`li`.el`img`.src.trim();

                        // convert image url to data url
                        const img = new Image();
                        img.src = imageUrl;
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            canvas.width = img.width;
                            canvas.height = img.height;
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0);
                            const dataURL = canvas.toDataURL('image/png');
                            localStorage.setItem(
                                `collection-hero-image-${coll}`,
                                dataURL
                            );
                        };

                        setBackground(imageUrl);
                    } catch (e) {
                        console.error("COULDN'T LOAD COLLECTION HERO");
                        console.log(e);
                    }
                }
            });
        }
    } catch (e) {
        console.log('no file');
    }
} catch (e) {
    console.error("COULDN'T LOAD COLLECTION HERO");
    console.log(e);
}

try {
    function parseItem(item) {
        return {
            url: item.dataset.url,
            title: item.dataset.title,
            src: item.dataset.src,
        };
    }
    async function getCollectionImage(url) {
        const response = await fetch(url);
        const data = await response.text();
        // Convert to DOM
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');

        const image = doc.querySelector(
            '.collection-hero__image-container img'
        );
        if (!image) return '';

        return image.src;
    }

    let parent = document.querySelector(
        `.top-link[data-url='${window.location.pathname}']`
    );

    parent.classList.add('collection-parent-style');

    Array.from(parent.children).forEach(async (item, index) => {
        if (!item.classList.contains('top-link')) return;
        let { url, title, src } = parseItem(item);

        // item.classList.add('block-without-wrapper');
        // item.innerHTML = '';
        item.classList.add(`c-blocks-${index}`);

        let size = '177px';

        item.style.width = size;
        item.style.height = size;
        item.style.minWidth = size;
        item.style.minHeight = size;
        // item.textContent = title;

        item.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = url;
        });

        let style = mkel`style`;
        style.innerHTML = `
            .c-blocks-${index} {
                scroll-snap-align: center;
                position: relative;
                display: grid;
                place-items: center;
                text-align: center;
                color: white;
                font-weight:bold;
                border-radius:0.5rem;
                background-color: gray;
                box-shadow: 0 0 5px whitesmoke;
                font-size: 1.75rem;
                cursor: pointer;
                width: 10rem;
                height: 10rem;
                transition: color 0.3s ease-in-out, text-shadow 0.3s ease-in-out;
                text-shadow: 0 0 0.5rem black;
            }

            .c-blocks-${index}:hover {
                color: black;
                text-shadow:none;
            }

            .c-blocks-${index}::before {
                content: '';
                display:grid;
                place-items: center;
                position: absolute;
                inset: 0;
                backdrop-filter: blur(1px) brightness(75%);
                border-radius: 0.5rem;
                transition: background-color 0.3s ease-in-out, backdrop-filter 0.3s ease-in-out, border-radius 0.3s ease-in-out;
            }

            .c-blocks-${index}:hover::before {
                background-color: rgba(255, 255, 255, 0.5);
                backdrop-filter: blur(4px) brightness(100%) contrast(40%);
            }

            .c-blocks-${index}::after {
                content: '${title}';
                position: absolute;
                inset: 1rem;
                display: grid;
                place-items: center;
                border-radius: 0.5rem;
            }
        `;
        item.before(style);

        // let image = await getCollectionImage(url);
        // if (src.includes('Liquid'))
        //     src = `https://picsum.photos/id/${index * 5}/300/300`;
        item.style.backgroundImage = `url(${src})`;
        item.style.backgroundSize = 'cover';
        item.style.backgroundPosition = 'center';
        item.style.backgroundRepeat = 'no-repeat';
    });
} catch (e) {
    console.log(e);
}

try {
    els`.hp-int`.forEach((e) => {
        e.closest('form').addEventListener('submit', (ev) => {
            if (e.value != '') {
                ev.preventDefault();
                window.location.reload();
            }
        });
    });
} catch (e) {}

// Utility Functions

function getRemSize() {
    return parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function getLinesOfText(text, container, lines) {
    return `${text
        .split(' ')
        .slice(
            0,
            Math.ceil(
                (container.getBoundingClientRect().width /
                    getRemSize() /
                    (text
                        .replaceAll(' ', '')
                        .replaceAll('.', '')
                        .replaceAll(',', '').length /
                        text.split(' ').length)) *
                    lines
            )
        )
        .join(' ')}...`.replaceAll('....', '...');
}

function getScrollLeft() {
    return (
        window.pageXOffset ||
        (document.documentElement || document.body.parentNode || document.body)
            .scrollLeft
    );
}

function getScrollTop() {
    return (
        window.pageYOffset ||
        (document.documentElement || document.body.parentNode || document.body)
            .scrollTop
    );
}

function getScrollHeight() {
    return (
        document.documentElement.scrollHeight ||
        document.body.parentNode.scrollHeight
    );
}

function getScrollWidth() {
    return (
        document.documentElement.scrollWidth ||
        document.body.parentNode.scrollWidth
    );
}
