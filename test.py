import requests 

#modelo llama 2
url = "https://6265-168-90-211-194.ngrok-free.app"
payload ={
  "model": "llama3.1:8b",
  "prompt": "Qual é a capital do Brasil?",
}
resposta = requests.post(f"{url}/api/chat", json=payload)
print(resposta.json())