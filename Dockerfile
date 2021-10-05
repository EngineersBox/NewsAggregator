FROM python:3.8.9-buster
ENV PYTHONBUFFERED 1

RUN mkdir -p /app
WORKDIR /app

COPY app.py app.py
COPY fileLogHandler.py fileLogHandler.py
COPY flask_logging.conf flask_logging.conf
COPY requirements.txt requirements.txt
COPY minitask minitask
COPY knn_indexing knn_indexing
COPY summary summary
COPY summary_1 summary_1
copy modules/RateLimiter modules/RateLimiter

RUN python3 -m pip install --upgrade pip
RUN python3 -m pip install --no-cache-dir -r requirements.txt
RUN python3 -m spacy download en_core_web_trf

EXPOSE 3001
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:3001", "app:app"]