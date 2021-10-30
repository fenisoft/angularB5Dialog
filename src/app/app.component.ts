import { Component } from '@angular/core';
import { fsDialog, fsPrompt, IModalButton, IPromptResult } from './fsdialogs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angularB5Dialog';
  promptValue: string = 'Alex';
  dialogResult: string = '';

  testDialog() {
    const buttons: IModalButton[] = [
      { value: 'OK', text: 'OK', color: 'primary' },
      { value: 'CLOSE', text: 'CLOSE', color: 'secondary' }];


    fsDialog(buttons, 'TEST DIALOG<b class="ms-2 text-danger">HTML</b>', 'DIALOG').then((response: string) => {
        this.dialogResult = response;
      });
  }


  testPrompt() {

    fsPrompt(this.promptValue, 'value', 'prompt').then((response: IPromptResult) => {

      if ("OK" === response.button) {
        this.promptValue = response.value!
      }

    });
  }

}
