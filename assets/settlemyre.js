const el = ([s]) => document.querySelector(s);
const els = ([s]) => Array.from(document.querySelectorAll(s));
const mkel = ([s]) => document.createElement(s);

Element.prototype.el = function ([s]) {
    return this.querySelector(s);
};

Element.prototype.els = function ([s]) {
    return Array.from(this.querySelectorAll(s));
};

Element.prototype.mkel = function ([s]) {
    return this.appendChild(mkel(s));
};

// Get JSON Files from NGROK
try {
    window.loadJSON = (path) => {
        return new Promise((resolve, reject) => {
            fetch(
                `https://termite-enormous-hornet.ngrok-free.app/files/${path}`,
                {
                    method: 'GET',
                    headers: {
                        'ngrok-skip-browser-warning': 'skip',
                    },
                }
            )
                .then((response) => response.json())
                .then((data) => resolve(data));
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

        loadJSON('config/homepage-config.json').then((r) => {
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

// Navbar Hotlinks
try {
    window.stripText = (text) => {
        return text
            .replace(/[^a-zA-Z0-9]/g, ' ')
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-');
    };

    window.loadJSON('config/navbar-hotlinks.json').then((hotlinks) => {
        hotlinks.forEach((hotlink) => {
            const li = els`.list-menu--inline li`.find((li) => {
                return li.innerText
                    .toLowerCase()
                    .includes(hotlink.find.toLowerCase());
            });

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

            document.head.appendChild(style);
        });
    });
} catch (e) {
    console.warn("Couldn't load hotlinks");
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
            `https://termite-enormous-hornet.ngrok-free.app/newsletter`,
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
        const url = `https://termite-enormous-hornet.ngrok-free.app/qr/${params}`;
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
    let collectionItems = els`.collection-list__item`;

    collectionItems.forEach((item) => {
        const s = mkel`style`;
        s.innerHTML = `
            .collection-list__item {
                cursor: pointer;
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
    });

    els`.mega-menu__link`.forEach((link) => {
        const href = link.getAttribute('href');
        getPageImage(href).then((src) => {
            link.style.backgroundImage = `url('${src}')`;
            link.style.backgroundColor = '#379c44';
            link.style.color = 'white';
            link.style.width = '20rem';
            link.style.height = '20rem';
            link.textContent = '';
            link.style.display = 'block';
            link.style.backgroundSize = 'cover';
            link.style.backgroundPosition = 'center';
            link.style.backgroundRepeat = 'no-repeat';
        });
    });
} catch (e) {
    console.error("COULDN'T LOAD MEGA MENU IMAGES");
    console.log(e);
}

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
