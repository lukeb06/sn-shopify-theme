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

    // const handlers = [handleHeader, handleHeaderGrid, handleLandscape];
    const handlers = [handleLandscape, handleHeaderGrid];

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
        // grids = [];

        fetch(
            'https://cdn.shopify.com/s/files/1/0886/9658/6534/files/homepage-config.json'
        )
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
} catch (e) {
    console.log(e);
}

// Experimental
try {
    function grab() {
        console.log('Attempting to grab');

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
        console.log('Attempting to release');

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
