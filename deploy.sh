# echo "npm install..."
# npm install
# echo "npm install finished!!!!!!!!!!"

echo "npm run build..."
npm run build
echo "npm build finished!!!!!!!!!"
tar -zcvf dist.tar.gz dist
echo "tar dist.tar.gz finished!!!!!!"
scp dist.tar.gz root@$1:/usr/share/nginx/html_vue/
echo "scp to $1:/usr/share/nginx/html_vue done!"
