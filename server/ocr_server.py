# ocr_server.py
from fastapi import FastAPI, Body
import ddddocr
import uvicorn
import base64

app = FastAPI()
ocr = ddddocr.DdddOcr() # 不需要 show_ad=False，也不需 patch

@app.post("/solve")
async def solve_captcha(data: dict = Body(...)):
    try:
        img_base64 = data.get("image")
        if not img_base64: return {"error": "No image", "status": "fail"}
        
        img_bytes = base64.b64decode(img_base64)
        result = ocr.classification(img_bytes)
        print(f"Result: {result}")
        return {"code": result, "status": "success"}
    except Exception as e:
        print(f"Error: {e}")
        return {"error": str(e), "status": "fail"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8888)