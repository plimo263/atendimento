FROM ubuntu:16.04

RUN mkdir /dados
ADD . /dados
RUN apt-get update && apt-get install python3.5 python3-pip -y && apt-get clean
ENV TZ='America/Sao_Paulo'
RUN pip3 install openpyxl bottle pillow pymysql paste requests

VOLUME /dados

CMD ["python3", "/dados/controlador.py"]
