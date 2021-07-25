FROM golang:alpine

MAINTAINER TheDuckGoesQuark

ENV GIN_MODE=release
ENV PORT=3004

WORKDIR /go/src/umbreonserver

COPY . /go/src/umbreonserver

# Run the two commands below to install git and dependencies for the project.
# RUN apk update && apk add --no-cache git
# RUN go get ./...

RUN go build umbreonserver

EXPOSE $PORT

ENTRYPOINT ["./umbreonserver"]