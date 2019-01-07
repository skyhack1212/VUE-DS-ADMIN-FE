#!/bin/bash
#if [ $# -ne 1 ];
#then
#	echo "[usage]: sh admin_build_auto.sh remote_ip"
#	exit
#fi


echo "npm install..."
npm install
echo "npm install finished!!!!!!!!!!"

echo "npm run build..."
npm run build
echo "npm build finished!!!!!!!!!"
tar -zcvf dist.tar.gz dist
echo "tar dist.tar.gz finished!!!!!!"
#scp dist.tar.gz root@xx.x.xx.xxx:/home/wangjie
#scp dist.tar.gz root@$1:/usr/share/nginx/html_vue
#echo "scp to $1:/usr/share/nginx/html_vue finished!"
mv dist.tar.gz /usr/share/nginx/html_vue/

