FROM golang:alpine

MAINTAINER TheDuckGoesQuark

ENV GIN_MODE=release
ENV PORT=3004

WORKDIR /go/src/umbreonserver

COPY . /go/src/umbreonserver

RUN go mod download
RUN go build umbreonserver

EXPOSE $PORT

ENTRYPOINT ["./umbreonserver"]