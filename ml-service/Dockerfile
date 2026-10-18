FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
ENV PORT=9000
ENV HOST=0.0.0.0
EXPOSE 9000
CMD ["python", "score_service.py"]
