FROM python:3.12
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /server_app
COPY requirements.txt /server_app/
RUN pip install -r requirements.txt
COPY . /server_app/