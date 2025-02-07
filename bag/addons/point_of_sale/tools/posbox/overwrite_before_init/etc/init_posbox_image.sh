#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail
# set -o xtrace

__dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
__file="${__dir}/$(basename "${BASH_SOURCE[0]}")"
__base="$(basename ${__file} .sh)"

# Recommends: antiword, graphviz, ghostscript, python-gevent, poppler-utils
export DEBIAN_FRONTEND=noninteractive

# set locale to en_US
echo "set locale to en_US"
echo "en_US.UTF-8 UTF-8" > /etc/locale.gen
locale-gen
# Environment variables
echo "export LANGUAGE=en_US.UTF-8" >> ~/.bashrc
echo "export LANG=en_US.UTF-8" >> ~/.bashrc
echo "export LC_ALL=en_US.UTF-8" >> ~/.bashrc
echo "export DISPLAY=:0" | tee -a ~/.bashrc /home/pi/.bashrc
echo "export XAUTHORITY=/run/lightdm/pi/xauthority" >> /home/pi/.bashrc
echo "export XAUTHORITY=/run/lightdm/root/:0" >> ~/.bashrc
# Aliases
echo  "alias ll='ls -al'" | tee -a ~/.bashrc /home/pi/.bashrc
echo  "alias bag='sudo systemctl stop bag; /usr/bin/python3 /home/pi/bag/bag-bin --config /home/pi/bag.conf --load=hw_drivers,hw_escpos,hw_posbox_homepage,point_of_sale,web'" | tee -a ~/.bashrc /home/pi/.bashrc
echo  "alias bag_logs='less +F /var/log/bag/bag-server.log'" | tee -a ~/.bashrc /home/pi/.bashrc
echo  "alias write_mode='sudo mount -o remount,rw / && sudo mount -o remount,rw /root_bypass_ramdisks'" | tee -a ~/.bashrc /home/pi/.bashrc
echo  "alias bag_conf='cat /home/pi/bag.conf'" | tee -a ~/.bashrc /home/pi/.bashrc
echo  "alias read_mode='sudo mount -o remount,ro / && sudo mount -o remount,ro /root_bypass_ramdisks'" | tee -a ~/.bashrc /home/pi/.bashrc
echo  "alias install='sudo mount -o remount,rw / && sudo mount -o remount,rw /root_bypass_ramdisks; sudo chroot /root_bypass_ramdisks/; mount -t proc proc /proc'" | tee -a ~/.bashrc /home/pi/.bashrc
echo  "alias blackbox='ls /dev/serial/by-path/'" | tee -a ~/.bashrc /home/pi/.bashrc
echo  "alias nano='write_mode; nano -l'" | tee -a /home/pi/.bashrc
echo  "alias vim='write_mode; sudo vim'" | tee -a /home/pi/.bashrc
echo  "alias bag_luxe='printf \" ______\n< Luxe >\n ------\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\ \n                ||----w |\n                ||     ||\n\"'" | tee -a ~/.bashrc /home/pi/.bashrc
echo  "alias bag_start='sudo systemctl start bag'" >> /home/pi/.bashrc
echo  "alias bag_stop='sudo systemctl stop bag'" >> /home/pi/.bashrc
echo  "alias bag_restart='sudo systemctl restart bag'" >> /home/pi/.bashrc
echo "
bag_help() {
  echo 'Welcome to Bag IoTBox tools'
  echo 'bag                Starts/Restarts Bag server manually (not through bag.service)'
  echo 'bag_logs           Displays Bag server logs in real time'
  echo 'bag_conf           Displays Bag configuration file content'
  echo 'write_mode          Enables system write mode'
  echo 'read_mode           Switches system to read-only mode'
  echo 'install             Bypasses ramdisks to allow package installation'
  echo 'blackbox            Lists all serial connected devices'
  echo 'bag_start          Starts Bag service'
  echo 'bag_stop           Stops Bag service'
  echo 'bag_restart        Restarts Bag service'
  echo 'bag_dev <branch>   Resets Bag on the specified branch from bag-dev repository'
}

bag_dev() {
  if [ -z \"\$1\" ]; then
    bag_help
    return
  fi
  write_mode
  pwd=\$(pwd)
  cd /home/pi/bag
  git remote add dev https://github.com/bag-dev/bag.git
  git fetch dev \$1 --depth=1 --prune
  git reset --hard dev/\$1
  cd \$pwd
}

pip() {
  if [[ -z \"\$1\" || -z \"\$2\" ]]; then
    bag_help
    return 1
  fi
  additional_arg=\"\"
  if [ \"\$1\" == \"install\" ]; then
    additional_arg=\"--user\"
  fi
  pip3 \"\$1\" \"\$2\" --break-system-package \"\$additional_arg\"
}
" | tee -a ~/.bashrc /home/pi/.bashrc

source ~/.bashrc
source /home/pi/.bashrc

# copy the bag.conf file to the overwrite directory
mv -v "/home/pi/bag/addons/point_of_sale/tools/posbox/configuration/bag.conf" "/home/pi/"
chown pi:pi "/home/pi/bag.conf"

apt-get update

# At the first start it is necessary to configure a password
# This will be modified by a unique password on the first start of Bag
password="$(openssl rand -base64 12)"
echo "pi:${password}" | chpasswd

PKGS_TO_INSTALL="
    chromium-browser \
    console-data \
    cups \
    cups-ipp-utils \
    dbus \
    dbus-x11 \
    dnsmasq \
    firefox-esr \
    fswebcam \
    git \
    hostapd \
    iw \
    kpartx \
    libcups2-dev \
    libpq-dev \
    libffi-dev \
    lightdm \
    localepurge \
    nginx-full \
    openbox \
    printer-driver-all \
    python3 \
    python3-cups \
    python3-babel \
    python3-dateutil \
    python3-dbus \
    python3-decorator \
    python3-dev \
    python3-docutils \
    python3-geoip2 \
    python3-jinja2 \
    python3-ldap \
    python3-libsass \
    python3-libcamera \
    python3-lxml \
    python3-mako \
    python3-mock \
    python3-netifaces \
    python3-passlib \
    python3-pil \
    python3-pip \
    python3-psutil \
    python3-psycopg2 \
    python3-pydot \
    python3-qrcode \
    python3-reportlab \
    python3-requests \
    python3-serial \
    python3-stdnum \
    python3-tz \
    python3-vobject \
    rsync \
    screen \
    swig \
    unclutter \
    vim \
    x11-utils \
    xdotool \
    xinput \
    xserver-xorg-input-evdev \
    xserver-xorg-video-dummy \
    xserver-xorg-video-fbdev"

echo "Acquire::Retries "16";" > /etc/apt/apt.conf.d/99acquire-retries
# KEEP OWN CONFIG FILES DURING PACKAGE CONFIGURATION
# http://serverfault.com/questions/259226/automatically-keep-current-version-of-config-files-when-apt-get-install
apt-get -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" install ${PKGS_TO_INSTALL}
apt-get -y autoremove

apt-get clean
localepurge
rm -rfv /usr/share/doc

# python-usb in wheezy is too old
# the latest pyusb from pip does not work either, usb.core.find() never returns
# this may be fixed with libusb>2:1.0.11-1, but that's the most recent one in raspios
# so we install the latest pyusb that works with this libusb.
# Even in stretch, we had an error with langid (but worked otherwise)
# We fixe the version of evdev to 1.2.0 because in 1.3.0 we have a RuntimeError in 'get_event_loop()'
PIP_TO_INSTALL="
    evdev==1.6.0 \
    gatt \
    polib \
    pycups \
    pyusb \
    v4l2 \
    pysmb==1.2.9.1 \
    cryptocode==0.1 \
    PyKCS11 \
    vcgencmd \
    RPi.GPIO \
    rjsmin==1.1.0 \
    websocket-client==1.6.3 \
    PyPDF2==1.26.0 \
    Werkzeug==2.0.2 \
    urllib3==1.26.5 \
    pyOpenssl==22.0.0 \
    cryptography==36.0.2 \
    screeninfo==0.8.1 \
    zeep==4.2.1 \
    num2words==0.5.13 \
    freezegun==1.2.1 \
    schedule==1.2.1"

pip3 install ${PIP_TO_INSTALL} --break-system-package

# Dowload MPD server and library for Six terminals
wget 'https://nightly.bag.com/master/iotbox/eftdvs' -P /usr/local/bin/
chmod +x /usr/local/bin/eftdvs
wget 'https://nightly.bag.com/master/iotbox/eftapi.so' -P /usr/lib/

groupadd usbusers
usermod -a -G usbusers pi
usermod -a -G lp pi
usermod -a -G input lightdm
mkdir -v /var/log/bag
chown pi:pi /var/log/bag
chown pi:pi -R /home/pi/bag/

# logrotate is very picky when it comes to file permissions
chown -R root:root /etc/logrotate.d/
chmod -R 644 /etc/logrotate.d/
chown root:root /etc/logrotate.conf
chmod 644 /etc/logrotate.conf

echo "* * * * * rm /var/run/bag/sessions/*" | crontab -

update-rc.d -f hostapd remove
update-rc.d -f nginx remove
update-rc.d -f dnsmasq remove

systemctl enable ramdisks.service
systemctl enable led-status.service
systemctl disable dphys-swapfile.service
systemctl enable ssh
systemctl set-default graphical.target
systemctl disable getty@tty1.service
systemctl enable systemd-timesyncd.service
systemctl unmask hostapd.service
systemctl disable hostapd.service
systemctl disable cups-browsed.service
systemctl enable bag.service

# disable overscan in /boot/config.txt, we can't use
# overwrite_after_init because it's on a different device
# (/dev/mmcblk0p1) and we don't mount that afterwards.
# This option disables any black strips around the screen
# cf: https://www.raspberrypi.org/documentation/configuration/raspi-config.md
echo "disable_overscan=1" >> /boot/config.txt

# Use the fkms driver instead of the legacy one (RPI3 requires this)
sed -i '/dtoverlay/c\dtoverlay=vc4-fkms-v3d' /boot/config.txt

# exclude /drivers folder from git info to be able to load specific drivers
echo "addons/hw_drivers/iot_devices/" > /home/pi/bag/.git/info/exclude

# create dirs for ramdisks
create_ramdisk_dir () {
    mkdir -v "${1}_ram"
}

create_ramdisk_dir "/var"
create_ramdisk_dir "/etc"
create_ramdisk_dir "/tmp"
mkdir -v /root_bypass_ramdisks

echo "password"
echo ${password}
