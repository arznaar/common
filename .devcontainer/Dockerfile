FROM debian

ENV DEBIAN_FRONTEND=noninteractive 

RUN apt-get update && \
    apt-get install -y curl &&\
    apt-get install -y git

RUN curl -sL https://deb.nodesource.com/setup_current.x | bash - && \
    apt-get install -y nodejs

ENTRYPOINT [ "bash" ]
