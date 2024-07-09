import requests
import json


def askQuestion(context):
    while True:
        text = input( "\n send a message (new to clear context, bye for bye): ")
        if text == "bye":
            break
        if text == "new":
            context = []
        url = 'http://localhost:11434/api/chat'
        context.append({"role":"user", "content": text})
        payload = { "model": "llama3", "messages": context ,"stream": True}
        headers = {}
        res = requests.post(url, data=json.dumps(payload), headers=headers, stream=True)
        finalAnswer = ""

        if res.status_code == 200:
            try:
                print(res)
                for line in res.iter_lines():
                    if line:
                        l = line.decode('utf-8')
                        data = json.loads(l)
                        content = data.get("message").get("content")
                        finalAnswer += content
                        print(content, end='')
            except Exception as err:
                print(err)
        else:
            print(res.status_code)
        context.append({"role": "assistant", "content":finalAnswer})

askQuestion([])