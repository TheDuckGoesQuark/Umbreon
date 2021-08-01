FROM golang:alpine

MAINTAINER TheDuckGoesQuark

ENV GIN_MODE=release
ENV PORT=3000
ENV BOT_CODE_VERSION=1

WORKDIR /go/src/umbreonserver

COPY . /go/src/umbreonserver

RUN go mod download
RUN go build umbreonserver

EXPOSE $PORT

ENTRYPOINT ["./umbreonserver"]