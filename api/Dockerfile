FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run uvicorn on 0.0.0.0 to allow external access within the container
CMD ["uvicorn", "index:app", "--host", "0.0.0.0", "--port", "8000"]