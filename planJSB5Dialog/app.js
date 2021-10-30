function testDialog() {
    fsDialog([{ value: 'OK', text: 'OK', color: 'primary' }, { value: 'CLOSE', text: 'CLOSE', color: 'secondary' }], 'TEST DIALOG', 'DIALOG')
        .then(d => {
            document.getElementById("testDialogResult").textContent = d;
        });
}


function testPrompt() {
    const inputEl = document.getElementById("inputPrompt");

    fsPrompt(inputEl.value, 'numero', 'prompt').then(u => {
        if ("OK" === u.button) {
            inputEl.value = u.value;
        }

    });
}