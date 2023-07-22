import { Injectable } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai';

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {

  constructor() { }

  configuration = new Configuration({
    apiKey: 'API_KEY_COMES_HERE'
  });

  readonly openai = new OpenAIApi(this.configuration);

  async getDataFromOpenAPI(text: string) {

    const completion = await this.openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{"role": "system", "content": "You are a helpful assistant."}, {role: "user", content: text}],
    });
    
    return completion.data.choices[0].message?.content;
    
  }

}
