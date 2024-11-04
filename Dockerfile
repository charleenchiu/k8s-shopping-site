FROM python:3.9-slim
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["uvicorn", "site-service:app", "--host", "0.0.0.0", "--port", "3000"]