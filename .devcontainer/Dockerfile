FROM debian

ENV DEBIAN_FRONTEND=noninteractive 

RUN apt-get update && \
    apt-get install -y curl &&\
    apt-get install -y git

RUN curl -sL https://deb.nodesource.com/setup_current.x | bash - && \
    apt-get install -y nodejs

# install yarn
RUN apt-get remove -y cmdtest && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - &&\
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list &&\
    apt-get update && \
    apt-get install -y yarn

ENTRYPOINT [ "bash" ]
