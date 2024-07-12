function createPopup(title, content, doTransition = true) {
    // Create the dark background
    const background = document.createElement('div');
    background.className = 'popup-background';
    background.style.display = 'block';
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

    document.body.appendChild(background);

    // Create the popup
    const popup = document.createElement('div');

    window.removePopup = () => {
        popup.remove();
        background.remove();
        document.body.style.overflow = 'initial';
    };

    background.addEventListener('click', removePopup);

    popup.className = 'popup';

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

    closeButton.style.cursor = 'pointer';
    closeButton.style.color = 'white';

    closeButton.onclick = () => {
        document.body.removeChild(background);
        document.body.removeChild(popup);
        document.body.style.overflow = 'initial';
    };
    popup.appendChild(closeButton);

    return popup;
}

function createContactPopup() {
    let popupContent = document.createElement('div');
    popupContent.className = 'popup-content';
    const popup = createPopup('Landscape Design', popupContent);
    popup.classList.add('contact-popup');

    const logo = document.createElement('img');
    logo.src = 'https://settlemyrenursery.com/content/web/sn-logo-medium.png';

    let oldHTML = popup.innerHTML;
    popup.innerHTML = '';
    popup.appendChild(logo);
    popup.innerHTML += oldHTML;

    popupContent = popup.querySelector('.popup-content');

    popupContent.style.display = 'grid';
    popupContent.style.gap = '1rem';

    popupContent.style.placeItems = 'center';
    popupContent.style.width = '100%';
    popupContent.style.height = '100%';

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

        fetch(`https://termite-enormous-hornet.ngrok-free.app/design`, {
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
                let _button = _popup.getElementsByClassName('close-button')[0];
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

    let closeButton = popup.getElementsByClassName('close-button')[0];

    closeButton.textContent = 'Submit';
    closeButton.onclick = submitData;
}

window.createContactPopup = createContactPopup;

window.createPopup = createPopup;
