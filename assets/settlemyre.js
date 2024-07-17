// Get Files from NGROK
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
    const ul = document.querySelector('.list-menu--inline');
    const li = Array.from(ul.querySelectorAll('li'));

    const maxWidth = Math.ceil(
        li
            .map((item) => item.getBoundingClientRect().width)
            .reduce((a, b) => a + b)
    );

    ul.style.maxWidth = `${maxWidth}px`;

    ul.classList.remove('chidden');
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

    window.loadJSON('config/navbar-hotlinks.json').then((hotlinks) => {
        hotlinks.forEach((hotlink) => {
            const li = Array.from(
                document.querySelectorAll('.list-menu--inline li')
            ).find((li) => {
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

    if (document.querySelector('.landscape-page') == null)
        throw 'Not a landscape design page';

    Array.from(document.querySelectorAll('.landscape-page .carousel')).forEach(
        (carousel, carouselIndex) => {
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
        }
    );
} catch (e) {
    console.warn(e);
}

// Landscape Design Popup Button Event Listener Assignment
try {
    const as = [
        ...document.querySelectorAll('a[href*="/trigger/landscape-popup"]'),
        ...document.querySelectorAll('.request-info.contact-button'),
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
    const emailSubForm = document.querySelector('#emailSubform');
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
/*
// Product Description Resize
try {
    function onResize() {
        const description = document.querySelector(
            '.product__description.desktop-only'
        );
        const product__info_container = document.querySelector(
            '.product__info-container'
        );

        const mobileDescription = document.querySelector(
            '.product__description.mobile-only'
        );

        if (!description && !mobileDescription)
            throw new Error('No description');
        if (!product__info_container)
            throw new Error('No product__info_container');

        if (window.innerWidth < 750) {
            onMobile();
        } else {
            onDesktop();
        }

        ///////////////
        // Functions //
        ///////////////
        function getHeight(el) {
            return el.getBoundingClientRect().height;
        }

        function getStartY(el) {
            return el.getBoundingClientRect().top;
        }

        function onMobile() {
            const tagLine = mobileDescription.children[0];

            const tagLineHeight = getHeight(tagLine);

            mobileDescription.style.height = `${tagLineHeight + 50}px`;
            mobileDescription.style.overflowY = 'hidden';

            addViewMoreButton();

            function addViewMoreButton() {
                try {
                    const viewMoreButton = mobileDescription.querySelector(
                        '.product__description-view-more'
                    );
                    if (viewMoreButton) return;
                } catch (e) {}

                const viewMoreButton = document.createElement('a');
                viewMoreButton.href = '#';
                viewMoreButton.innerHTML = 'Read more...';
                viewMoreButton.addEventListener('click', () => {
                    mobileDescription.style.height = 'auto';
                    mobileDescription.style.overflowY = 'visible';
                });

                mobileDescription.style.position = 'relative';

                const descriptionBottomContainer =
                    document.createElement('div');
                descriptionBottomContainer.style.position = 'absolute';
                descriptionBottomContainer.style.bottom = '0';
                descriptionBottomContainer.style.left = '0';
                descriptionBottomContainer.style.right = '0';
                descriptionBottomContainer.style.height = '50px';
                descriptionBottomContainer.style.backgroundColor = '#fff';
                descriptionBottomContainer.classList.add(
                    'product__description-view-more'
                );

                descriptionBottomContainer.appendChild(viewMoreButton);
                mobileDescription.appendChild(descriptionBottomContainer);

                // Event Listeners

                viewMoreButton.addEventListener('click', (e) => {
                    e.preventDefault();

                    mobileDescription.style.height = 'auto';
                    mobileDescription.style.overflowY = 'visible';

                    descriptionBottomContainer.remove();
                });
            }

            if (window.LAST_P_RESIZE == 'mobile') return;
        }

        function onDesktop() {
            if (!window.SIZE_DESC_DISABLE) resizeDescriptionToFitProductInfo();
            if (!window.SIZE_DESC_DISABLE) addViewMoreButton();

            function resizeDescriptionToFitProductInfo() {
                const descriptionHeight = getHeight(description);
                const product__info_containerHeight = getHeight(
                    product__info_container
                );

                const startHeight = getStartY(product__info_container);
                const descTop = getStartY(description);

                const topDiff = Math.abs(descTop - startHeight);

                const newHeight = Math.abs(
                    product__info_containerHeight - topDiff
                );

                description.style.height = `${newHeight}px`;
                description.style.overflowY = 'hidden';
            }

            function addViewMoreButton() {
                try {
                    const viewMoreButton = description.querySelector(
                        '.product__description-view-more'
                    );
                    if (viewMoreButton) return;
                } catch (e) {}

                const viewMoreButton = document.createElement('a');
                viewMoreButton.href = '#';
                viewMoreButton.innerHTML = 'Read more...';
                viewMoreButton.addEventListener('click', () => {
                    description.style.height = 'auto';
                    description.style.overflowY = 'visible';
                });

                description.style.position = 'relative';

                const descriptionBottomContainer =
                    document.createElement('div');
                descriptionBottomContainer.style.position = 'absolute';
                descriptionBottomContainer.style.bottom = '0';
                descriptionBottomContainer.style.left = '0';
                descriptionBottomContainer.style.right = '0';
                descriptionBottomContainer.style.height = '50px';
                descriptionBottomContainer.style.backgroundColor = '#fff';
                descriptionBottomContainer.classList.add(
                    'product__description-view-more'
                );

                descriptionBottomContainer.appendChild(viewMoreButton);
                description.appendChild(descriptionBottomContainer);

                // Event Listeners

                viewMoreButton.addEventListener('click', (e) => {
                    e.preventDefault();

                    description.style.height = 'auto';
                    description.style.overflowY = 'visible';

                    window.SIZE_DESC_DISABLE = true;
                    descriptionBottomContainer.remove();
                });
            }

            if (window.LAST_P_RESIZE == 'desktop') return;
        }
    }

    window.addEventListener('resize', onResize);
    onResize();
} catch (e) {
    console.warn("Couldn't load product view");
    console.log(e);
}
*/
// Product Description Accordion
try {
    let CHILDREN = Array.from(
        document.querySelectorAll('.product__description')
    ).map((v) => [...v.children]);

    function onResize() {
        document.querySelectorAll('.PRE_VIEW').forEach((v) => v.remove());

        const descriptions = document.querySelectorAll('.product__description');

        descriptions.forEach((description, dIndex) => {
            const accordion = description.nextElementSibling;
            if (!accordion.classList.contains('product__accordion')) return;

            if (!description || !accordion) throw new Error('No description');

            function grabDescription() {
                const descriptionItems = Array.from(CHILDREN[dIndex]).filter(
                    (v, i) => i > 0
                );

                const accordionContent = accordion.querySelector(
                    '.accordion__content'
                );

                descriptionItems.forEach((item) => {
                    accordionContent.innerHTML = '';

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
}

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
