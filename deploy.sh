echo 'Switching to branch production'
git checkout production

echo 'Buildning app...'
npm run build

echo 'Deploying files to server...'
scp -i ~/.ssh/movie_rsa -r build/* victor@192.168.0.145:/var/www/192.168.0.145/

echo 'Done!'