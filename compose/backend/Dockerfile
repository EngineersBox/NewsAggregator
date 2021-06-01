FROM python:3.8.9-buster
ENV PYTHONBUFFERED 1

RUN mkdir -p /app
WORKDIR /app

COPY ../../. .

RUN python3 -m pip install --upgrade pip
RUN python3 -m pip install --no-cache-dir -r requirements.txt
RUN python3 -m spacy download en_core_web_sm

EXPOSE 3001
