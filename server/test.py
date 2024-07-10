import requests
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# CORS(app, resources={r"/api/*": {"origins": "*"}})
# @app.route("/members")
# def members():
#     return {"members": ["Member1","Member2","Member3"]}im 

@app.route("/api/send", methods=["POST"])
def processInput():
    data = request.json
    print("Received data:", data)
    
    return jsonify({"message": "Data received successfully!    " + data }), 200


if __name__ == "__main__":
    app.run(debug=True, port=5000)
 
def askQuestion(text,context):
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
    
    return context

# context = []
# while True:
#     text = input("\nsend a message:  ")
#     if text == "bye":
#         break
#     if text == "new":
#         context = []
#     context = askQuestion(text, context)
