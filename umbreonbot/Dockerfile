FROM ev3dev/ev3dev-stretch-ev3-generic

MAINTAINER TheDuckGoesQuark

COPY .

RUN go mod download
RUN GOOS=linux GOARCH=arm GOARM=5 go umbreonbot

ENTRYPOINT ["./umbreonbot"]
