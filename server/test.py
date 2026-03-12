import requests
import json
import uuid
from flask import Flask, request, Response, stream_with_context
from flask_cors import CORS, cross_origin


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Server-side session storage: { session_id: [{"role": ..., "content": ...}, ...] }
sessions = {}

# Keep system prompt + last N messages to stay within llama3's context window
MAX_MESSAGES = 20


@app.route("/api/session", methods=["POST"])
@cross_origin()
def createSession():
    data = request.json
    system_prompt = data.get("system_prompt")
    restore_context = data.get("restore_context", [])
    session_id = str(uuid.uuid4())
    context = [{"role": "system", "content": system_prompt}] + restore_context
    if len(context) - 1 > MAX_MESSAGES:
        context = [context[0]] + context[-MAX_MESSAGES:]
    sessions[session_id] = context
    return json.dumps({"session_id": session_id})


@app.route("/api/send", methods=["POST"])
@cross_origin()
def processInput():
    data = request.json
    text = data.get("value")
    session_id = data.get("session_id")

    if session_id not in sessions:
        return json.dumps({"error": "Session not found. Please reconfigure your time period."}), 404

    context = sessions[session_id]
    context.append({"role": "user", "content": text})

    # Sliding window: always keep the system prompt, drop oldest messages if over limit
    if len(context) - 1 > MAX_MESSAGES:
        sessions[session_id] = [context[0]] + context[-(MAX_MESSAGES):]
        context = sessions[session_id]

    payload = {"model": "llama3", "messages": context, "stream": True}

    def generate():
        final_answer = ""
        try:
            with requests.post(
                'http://localhost:11434/api/chat',
                data=json.dumps(payload),
                stream=True
            ) as res:
                for line in res.iter_lines():
                    if line:
                        chunk = json.loads(line.decode('utf-8'))
                        content = chunk.get("message", {}).get("content", "")
                        if content:
                            final_answer += content
                            yield f"data: {json.dumps({'content': content})}\n\n"
        except Exception as err:
            yield f"data: {json.dumps({'error': str(err)})}\n\n"
            return

        context.append({"role": "assistant", "content": final_answer})
        yield f"data: {json.dumps({'done': True})}\n\n"

    return Response(
        stream_with_context(generate()),
        mimetype='text/event-stream',
        headers={'X-Accel-Buffering': 'no'}
    )


if __name__ == "__main__":
    app.run(debug=True, port=5050)
