package main

import (
	"log"
	"time"

	"github.com/ev3go/ev3"
)

func main() {
	var bright byte
	var err error
	for i := 0; i < 10; i++ {
		err = ev3.GreenLeft.SetBrightness(int(bright)).Err()
		if err != nil {
			log.Fatal(err)
		}
		time.Sleep(time.Second)

		bright = ^bright

		err = ev3.GreenRight.SetBrightness(int(bright)).Err()
		if err != nil {
			log.Fatal(err)
		}
		time.Sleep(time.Second)
	}
}