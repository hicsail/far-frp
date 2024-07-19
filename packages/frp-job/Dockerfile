FROM python:3.11-buster

RUN pip install poetry

WORKDIR /libs/

COPY ./frp .

RUN poetry install

WORKDIR /app

COPY ./frp-job .

RUN poetry install

ENTRYPOINT ["poetry", "run", "python", "-m", "annapurna.main"]
