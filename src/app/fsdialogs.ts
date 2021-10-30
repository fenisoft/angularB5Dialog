import { Modal } from 'bootstrap';

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

/**
 *
 * @param buttons
 * @param body
 * @param head
 * @param options
 * @returns
 */
export function fsDialog(buttons: IModalButton[],
  body: string,
  head: string = '',
  options: IModalOptions = {}): Promise<string> {

  const modalOptions: IModalOptions = { vcenter: true, hclass: "bg-primary", showClose: true };
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
  let btns: IModalButton[] = [];
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
    const myModal = new Modal(element, { backdrop: "static" });
    myModal.show();

    document.querySelectorAll(".fs-close-modal").forEach(button => {
      button.addEventListener('click', (event) => {
        const r = (event.currentTarget as HTMLElement).dataset.return!;
        myModal.hide();
        element.remove();
        resolve(r);
      })
    });
  });
}

/**
 *
 * @param value
 * @param prompt
 * @param head
 * @param options
 * @returns
 */
export function fsPrompt(value: string, prompt: string, head: string = '', options: IPromptOptions = {}): Promise<IPromptResult> {
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
    const myModal = new Modal(element, { backdrop: "static" });
    myModal.show();

    document.querySelectorAll(".fs-close-modal").forEach(button => {
      button.addEventListener('click', (event) => {
        const r = (event.currentTarget as HTMLElement).dataset.return;
        const value = (document.getElementById(`v${valueId}`) as HTMLInputElement).value;
        myModal.hide();
        element.remove();
        if (r == 'OK') {
          resolve({ button: r, value });
        } else {
          resolve({ button: r! });
        }

      })
    });
  });
}


/**
 *
 * @param value
 * @param prompt
 * @param head
 * @param valueId
 * @param options
 * @returns
 */
function htmlPrompt(value: string, prompt: string, head: string, valueId: string, options: IPromptOptions): string {

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

  if (options === undefined || options === null) {
    options = {}
  }

  if (options.hasOwnProperty('vcenter')) {
    modalOptions.vcenter = options.vcenter!;
  }
  if (options.hasOwnProperty('hclass')) {
    modalOptions.hclass = options.hclass!;
  }
  if (options.hasOwnProperty('showClose')) {
    modalOptions.showClose = options.showClose!;
  }

  if (options.hasOwnProperty('type')) {
    modalOptions.type = options.type!;
  }

  if (options.hasOwnProperty('min')) {
    modalOptions.min = options.min!;
  }

  if (options.hasOwnProperty('max')) {
    modalOptions.max = options.max!;
  }

  if (options.hasOwnProperty('step')) {
    modalOptions.step = options.step!;
  }

  if (options.hasOwnProperty('buttonOk')) {
    modalOptions.buttonOk = options.buttonOk!;
  }

  if (options.hasOwnProperty('buttonClose')) {
    modalOptions.buttonClose = options.buttonClose!;
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
 * @param buttons
 * @param body
 * @param head
 * @param hclass
 * @param center
 * @param showClose
 * @returns
 */
function htmlDialog(
  buttons: IModalButton[],
  body: string,
  head: string,
  hclass: string = 'bg-primary',
  center: boolean = false,
  showClose: boolean = false) {
  const classCenter = center ? 'modal-dialog-centered' : '';
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

