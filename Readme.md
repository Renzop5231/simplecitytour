//.........linux server execution environment setup.
pip install virtualenv
virtualenv simplecitytour
cd simplecitytour
//...get existing repo......
git clone http://.....
pip install django
pip install djangorestframework
pip install djangorestframework-jwt



//......start a djnago project..........
mkdir SimpleCityTourServer
cd SimpleCityTourServer
django-admin.py startproject simplecitytour .
cd simplecitytour
django-admin.py startapp restapi
cd ..



..........in linux
apt-get install ffmpeg libavcodec-extra-53