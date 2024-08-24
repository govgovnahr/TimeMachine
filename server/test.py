import requests
import json
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin



def askQuestion(text,context):
    url = 'http://localhost:11434/api/chat'
    print("CONTEXT:  ", context)
    context.append({"role":"user", "content": text})
    payload = { "model": "llama3", "messages": context ,"stream": False}
    headers = {}
    res = requests.post(url, data=json.dumps(payload), headers=headers, stream=False)
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
    
    return content, context

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
# CORS(app, resources={r"/api/*": {"origins": "*"}})
# @app.route("/members")
# def members():
#     return {"members": ["Member1","Member2","Member3"]}im 

@app.route("/api/send", methods=["POST"])
@cross_origin()
def processInput():
    data = request.json
    print("Received data:", data)
    text = data.get("value")
    context = data.get("context")
    content, context2 = askQuestion(text, context)
    return jsonify({"message": content, "context": context2 }), 200

@app.route("/api/context", methods=["POST"])
@cross_origin()
def setContext():
    data = request.json
    print("Received system prompt data:  ", data)
    text = data.get("value")
    return text


if __name__ == "__main__":
    app.run(debug=True, port=5050)
 

# context = []
# while True:
#     text = input("\nsend a message:  ")
#     if text == "bye":
#         break
#     if text == "new":
#         context = []
#     context = askQuestion(text, context)
