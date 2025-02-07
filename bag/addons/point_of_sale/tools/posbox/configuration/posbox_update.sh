#!/usr/bin/env bash

sudo service led-status stop

cd /home/pi/bag
localbranch=$(git symbolic-ref -q --short HEAD)
localremote=$(git config branch.$localbranch.remote)

if [[ "$(git remote get-url "$localremote")" != *bag/bag* ]]; then
    git remote set-url "${localremote}" "https://github.com/bag/bag.git"
fi

echo "addons/point_of_sale/tools/posbox/overwrite_after_init/home/pi/bag" >> .git/info/sparse-checkout

git fetch "${localremote}" "${localbranch}" --depth=1
git reset "${localremote}"/"${localbranch}" --hard

sudo git clean -dfx
if [ -d /home/pi/bag/addons/point_of_sale/tools/posbox/overwrite_after_init ]; then
    cp -a /home/pi/bag/addons/point_of_sale/tools/posbox/overwrite_after_init/home/pi/bag/* /home/pi/bag/
    rm -r /home/pi/bag/addons/point_of_sale/tools/posbox/overwrite_after_init
fi

# TODO: Remove this code when v16 is deprecated
bag_conf="addons/point_of_sale/tools/posbox/configuration/bag.conf"
if ! grep -q "server_wide_modules" $bag_conf; then
    echo "server_wide_modules=hw_drivers,hw_escpos,hw_posbox_homepage,point_of_sale,web" >> $bag_conf
fi

sudo service led-status start
