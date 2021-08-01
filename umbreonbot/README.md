scp ./umbreonbot/startupscript.sh robot@ev3dev.local:/home/robot/

/etc/systemd/system/myprogram.service.

[Unit]
Description=My Program
After=multi-user.target

[Install]
WantedBy=multi-user.target

[Service]
Type=simple
ExecStart=/home/user/bin/myprogram