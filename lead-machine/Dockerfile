FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    LM_HOST=0.0.0.0 \
    LM_PORT=8000 \
    LM_DB_PATH=/dados/leads.db \
    LM_CONFIG_PATH=/dados/config.json

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /dados
VOLUME ["/dados"]
EXPOSE 8000

CMD ["python", "main.py"]
