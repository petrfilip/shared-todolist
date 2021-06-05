#!/bin/sh

[ -e build ] && rm -r build
mkdir build
cp -r api/ build/
cd build/
echo "build directory created"

rm -r api/database/*
echo "database removed"


chmod 777 api/database

# build php app
EXPECTED_CHECKSUM="$(wget -q -O - https://composer.github.io/installer.sig)"
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
ACTUAL_CHECKSUM="$(php -r "echo hash_file('sha384', 'composer-setup.php');")"
echo "Composer downloaded"


if [ "$EXPECTED_CHECKSUM" != "$ACTUAL_CHECKSUM" ]
then
    >&2 echo 'ERROR: Invalid installer checksum'
    rm composer-setup.php
    exit 1
fi

echo "Starting composer setup"
php composer-setup.php --quiet
RESULT=$?

rm composer-setup.php
rm api/composer.lock
rm -r api/vendor/

echo "origin composer dependencies removed"


./composer.phar install -d api/

rm composer.phar

echo "Dependencies installed"



# build react app
cd ..
cd client/ || exit
npm run build
cp ../.htaccess build/
cp -rT build/ ../build/

echo "Frontend client build done"


# create zip
cd ..
cd build/ || exit
zip -r build.zip .
mv build.zip ../


echo "The build is done"



