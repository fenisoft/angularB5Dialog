
/*
export interface IModalButton {
	value: string,
	text: string,
	color?: string
}

export interface IModalOptions {
	vcenter?: boolean,
	hclass?: string,
	showClose?: boolean
}

export interface IPromptOptions {
	type?: string,
	vcenter?: boolean,
	hclass?: string,
	showClose?: boolean,
	min?: string,
	max?: string,
	step?: string,
	buttonOk?: string,
	buttonClose?: string
}

export interface IPromptResult {
	button:string,
	value?:string
}

*/

/**
 * 
 * @param {IModalButton[]} buttons 
 * @param {string} body 
 * @param {string} head 
 * @param {IModalOptions} options 
 * @returns {Promise <string>}  IModalButton - value
 */

function fsDialog(buttons, body, head, options) {
	if (options === null || options === undefined) {
		options = {};
	}

	const modalOptions = { vcenter: true, hclass: "bg-primary", showClose: true };

	if (options.hasOwnProperty('vcenter')) {
		modalOptions.vcenter = options.vcenter;
	}
	if (options.hasOwnProperty('hclass')) {
		modalOptions.hclass = options.hclass;
	}
	if (options.hasOwnProperty('showClose')) {
		modalOptions.showClose = options.showClose;
	}

	const element = document.createElement('div');
	let btns = [];
	if (buttons.length == 0) {
		btns = [{ value: 'OK', text: 'OK', color: 'secondary' }];
	} else {
		btns = [...buttons];
	}

	element.classList.add("modal");
	element.classList.add("fade");
	element.dataset.bsBackdrop = "static";
	element.dataset.bsKeyboard = "false";
	element.tabIndex = -1;
	element.setAttribute("aria-labelledby", "staticBackdropLabel");
	element.setAttribute("aria-hidden", "true");
	element.innerHTML = htmlDialog(btns, body, head, modalOptions.hclass, modalOptions.vcenter, modalOptions.showClose);
	document.body.append(element);

	return new Promise((resolve, reject) => {
		const myModal = new bootstrap.Modal(element, { backdrop: "static" });
		myModal.show();

		document.querySelectorAll(".fs-close-modal").forEach(button => {
			button.addEventListener('click', (event) => {
				const r = event.currentTarget.dataset.return;
				myModal.hide();
				element.remove();
				resolve(r);
			})
		});
	});
}

//
/**
 * 
 * @param {string} value
 * @param {string} prompt 
 * @param {string} head 
 * @param {IPromptOptions} options 
 * @returns {Promise<IPromptResult>}
 */
function fsPrompt(value, prompt, head, options) {

	if (head === null || head === undefined) {
		head = '';
	}

	if (options === null || options === undefined) {
		options = {};
	}



	const valueId = `${new Date().getTime()}`;
	const element = document.createElement('div');

	element.classList.add("modal");
	element.classList.add("fade");
	element.dataset.bsBackdrop = "static";
	element.dataset.bsKeyboard = "false";
	element.tabIndex = -1;
	element.setAttribute("aria-labelledby", "staticBackdropLabel");
	element.setAttribute("aria-hidden", "true");
	element.innerHTML = htmlPrompt(value, prompt, head, valueId, options);
	document.body.append(element);

	return new Promise((resolve, reject) => {
		const myModal = new bootstrap.Modal(element, { backdrop: "static" });
		myModal.show();

		document.querySelectorAll(".fs-close-modal").forEach(button => {
			button.addEventListener('click', (event) => {
				const r = event.currentTarget.dataset.return;
				const value = document.getElementById(`v${valueId}`).value;
				myModal.hide();
				element.remove();
				if (r == 'OK') {
					resolve({ button: r, value });
				} else {
					resolve({ button: r });
				}

			})
		});
	});
}


/**
 * 
 * @param {string} value 
 * @param {string} prompt 
 * @param {string} head 
 * @param {string} valueId 
 * @param {object} options 
 * @returns {string}
 */
function htmlPrompt(value, prompt, head, valueId, options) {

	const modalOptions = {
		type: 'text',
		vcenter: true,
		hclass: "bg-primary",
		showClose: true,
		min: '',
		max: '',
		step: '',
		buttonOk: 'OK',
		buttonClose: 'CLOSE'
	};

	if (options.hasOwnProperty('vcenter')) {
		modalOptions.vcenter = options.vcenter;
	}
	if (options.hasOwnProperty('hclass')) {
		modalOptions.hclass = options.hclass;
	}
	if (options.hasOwnProperty('showClose')) {
		modalOptions.showClose = options.showClose;
	}

	if (options.hasOwnProperty('type')) {
		modalOptions.type = options.type;
	}

	if (options.hasOwnProperty('min')) {
		modalOptions.min = options.min;
	}

	if (options.hasOwnProperty('max')) {
		modalOptions.max = options.max;
	}

	if (options.hasOwnProperty('step')) {
		modalOptions.step = options.step;
	}

	if (options.hasOwnProperty('buttonOk')) {
		modalOptions.buttonOk = options.buttonOk;
	}

	if (options.hasOwnProperty('buttonClose')) {
		modalOptions.buttonClose = options.buttonClose;
	}


	let numberOptions = '';
	if (modalOptions.type == 'number') {
		if (value == '') {
			value = '0';
		}


		if (modalOptions.min) {
			numberOptions += ` min="${modalOptions.min}" `;
		}
		if (modalOptions.max) {
			numberOptions += ` max="${modalOptions.max}" `;
		}
		if (modalOptions.step) {
			numberOptions += ` step="${modalOptions.step}" `;
		}
	}


	const closeButton = modalOptions.showClose ? `<button type="button" data-return="CLOSE"
			class="btn-close btn-close-white fs-close-modal" aria-label="Close">
	</button>` : '';

	return `
	<div class="modal-dialog modal-sm ${modalOptions.vcenter ? 'modal-dialog-centered' : ''}">
	<div class="modal-content">
		<div class="modal-header p-2 text-white ${modalOptions.hclass}">
			<h6 class="modal-title">
				 ${head}
			</h6>
			${closeButton}
		</div>
		<div class="modal-body">
			<div class="mb-1">
				<label for="v${valueId}">
						${prompt}
				</label>
				<input class="form-control form-control-sm"  type="${modalOptions.type}" id="v${valueId}" ${numberOptions}
							 value="${value}"  maxlength="50" />
			</div>
		</div>
		<div class="modal-footer">
				<button data-return="OK"  class="fs-close-modal btn btn-primary" type="button" autofocus="true">
						${modalOptions.buttonOk}
				</button>
				<button data-return="CLOSE" class="fs-close-modal btn btn-secondary" type="button">
						${modalOptions.buttonClose}
				</button>
		</div>
	</div>
</div>
	`;
}

/**
 * 
 * @param {Array} buttons 
 * @param {string} body 
 * @param {string} head 
 * @param {string} hclass 
 * @param {boolean} center 
 * @param {boolean} showClose 
 * @returns 
 */

function htmlDialog(buttons, body, head, hclass, center, showClose) {

	if (hclass === null) {
		hclass = "bg-primary";
	}
	if (center === null) {
		center = true;
	}
	if (showClose === null) {
		showClose = false;
	}



	const classCenter = center ? 'modal-dialog-centered' : '';
	//data-bs-dismiss="modal"
	const closeButton = showClose ? `<button type="button"
		data-return="CLOSE"
		class="btn-close btn-close-white fs-close-modal" aria-label="Close">
	</button>` : '';

	const htmlButtons = buttons.map(item => `<button data-return="${item.value}"
				class="fs-close-modal btn btn-${item.color}" type="button">${item.text}</button>`).join(" ");

	return `
	<div class="modal-dialog ${classCenter}">
		<div class="modal-content">
			<div class="modal-header p-2 text-white ${hclass}">
				<h6 class="modal-title">
					 ${head}
				</h6>
			  ${closeButton}
			</div>
			<div class="modal-body" >
        ${body}
			</div>
			<div class="modal-footer">
			   ${htmlButtons}
			</div>
		</div>
	</div>`
}


