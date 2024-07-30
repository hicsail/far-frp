FROM python:3.11-buster

RUN pip install poetry

WORKDIR /libs/

COPY ./frp .

RUN poetry config virtualenvs.create false && cd frp && poetry install

WORKDIR /app

COPY ./frp-job .

RUN poetry install

VOLUME /app/data

ENTRYPOINT ["poetry", "run", "python", "frp_job/main.py"]
