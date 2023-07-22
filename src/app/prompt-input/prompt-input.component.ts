import { Component } from '@angular/core';
import { OpenAiService } from '../open-ai.service';

@Component({
  selector: 'app-prompt-input',
  templateUrl: './prompt-input.component.html',
  styleUrls: ['./prompt-input.component.css']
})

export class PromptInputComponent {
  response:string | undefined;
  send(value:string, clipboard:boolean) {
    sendPrompt(value, clipboard).then((res) => {
      if (res) {
        navigator['clipboard'].writeText(res)
        this.response = res;
      } else {
        this.response = 'Houve um problema!';
      }
    })
  }
}

async function sendPrompt(value:string, clipboard:boolean) {
  let prompt:string;
  let openAI = new OpenAiService();

  prompt = value
  if (clipboard) prompt += (await navigator['clipboard'].readText()).toString();

  return await openAI.getDataFromOpenAPI(prompt)
}