FROM registry.access.redhat.com/ubi8/python-39

# Add application sources with correct permissions for OpenShift
USER 0
ADD . .
RUN chown -R 1001:0 ./
USER 1001

# Install the dependencies
RUN pip install -r requirements.txt

ENTRYPOINT ["python", "frp/main.py"]
