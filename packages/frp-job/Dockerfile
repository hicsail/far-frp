FROM ubi8/python-39


RUN pip install poetry

WORKDIR /libs/

# Add application sources with correct permissions for OpenShift
USER 0
COPY ./frp .
RUN chown -R 1001:0 ./
USER 1001

RUN poetry config virtualenvs.create false && cd frp && poetry install --without dev

WORKDIR /app

# Add application sources with correct permissions for OpenShift
USER 0
COPY ./frp-job .
RUN chown -R 1001:0 ./
USER 1001

RUN poetry install --without dev

VOLUME /app/data

ENTRYPOINT ["poetry", "run", "python", "frp_job/main.py"]
