FROM ubuntu:16.04

RUN apt-get update \ 
  && apt-get -y install curl wget \
  && apt-get -y install default-jre \
  && apt-get -y install default-jdk \
  && apt-get -y install python-pip python-dev build-essential \
  && pip install --upgrade pip \
  && pip install cherrypy

ARG SPARK_ARCHIVE=http://d3kbcqa49mib13.cloudfront.net/spark-2.1.0-bin-hadoop2.7.tgz
ENV HOME=/dashboard/
RUN curl -s $SPARK_ARCHIVE | tar -xz -C /usr/local \
  && ln -s /usr/local/spark-2.1.0-bin-hadoop2.7 /opt/spark

EXPOSE 4040 6066 7077 8080

WORKDIR /opt/spark

