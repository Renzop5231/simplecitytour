import os
import base64
# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# import model objects 
from django.contrib.auth.models import User
from .models import Polygon, LandingPage, Location, PointType, Point, Tourist, UserPayment, AdminActiveTime
# from .serializers import UserSerializer, PolygonSerializer, LandingPageSerializer, LocationSerializer,PointTypeSerializer, PointSerializer, TouristSerializer, UserPaymentSerializer,AdminActiveTimeSerializer

from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes

import json
from django.db import transaction
from django.db.models import Q
from django.core import serializers
from rest_framework_jwt.settings import api_settings

from rest_framework.response import Response


from django.http import HttpResponse


# @api_view(['GET', 'POST'])
# def test_resp(request, format=None):
#     if request.method == 'GET':
#         print(User.objects.get(email = 'kvmmvv@gmail.com').username)
#         return Response({'hello':'apiview'})
#     elif request.method == 'POST':
#         print('the request data is: ')
#         print(request.data)
#         return Response(request.data)
#     return



# these variable for checking update in client side
imageSequence       = 2
citySequence        = 2
pointSequene        = 2

@api_view(['POST'])
@permission_classes((permissions.AllowAny, ))
def signup_user(request):
    if request.method == 'POST':

        #allow only letters, numbers, dash or underscore in username 
        allowed_chars = set('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-')

        #verify username and password, delete trailing whitespaces
        if len(request.data['username'].rstrip()) <5 or len(request.data['password'].rstrip())<6 or not set(request.data['username'].rstrip()).issubset(allowed_chars) or request.data['username'].rstrip().lower() =='username' or request.data['password'].rstrip().lower() == 'password' :
            return Response({'failed':'invaild_username_or_password'})

        try:
            with transaction.atomic():
                new_user = User(username=request.data['username'].rstrip(), email=request.data['email'].rstrip())
                new_user.set_password(request.data['password'].rstrip())
                new_user.save()
        except Exception as ex:

            if ex.args[0] == 'UNIQUE constraint failed: auth_user.username':
                print('User: '+request.data['username'].rstrip()+ 'attemp to register an existing username')
                return Response({'failed':'username existed'})
            print(ex)
            return Response({'failed':'unknown'})

        print('User: '+request.data['username']+ 'signup successfully.')
        return Response({'succeed':'created'})  

    return Response({'failed':'unknown'})



@api_view(['GET'])
@permission_classes((permissions.AllowAny, ))
def check_sequence(request):
    if request.method == 'GET':
        backendSequences          = {'serverCitySequence': str(citySequence),'serverImageSequence':str(imageSequence),'serverPointSequence':str(pointSequene)}
    return Response(backendSequences)



@api_view(['GET'])
@permission_classes((permissions.AllowAny, ))
def get_all_locations(request):

    if request.method == 'GET':
        # all_locations       = Location.objects.all()
        all_locations       = Location.objects.all()
        all_cities          = {'citySequence': str(citySequence)}
        for i in range(len(all_locations)):
            all_cities[all_locations[i].name] = []
            all_cities[all_locations[i].name].append(len(Point.objects.filter(location_id= all_locations[i].id)))
            all_cities[all_locations[i].name].append(all_locations[i].lat)
            all_cities[all_locations[i].name].append(all_locations[i].lng)
            all_cities[all_locations[i].name].append(all_locations[i].description)

    return Response(all_cities)


@api_view(['GET'])
@permission_classes((permissions.AllowAny, ))
def get_points(request):
    if request.method == 'GET':
        all_locations           = Location.objects.all()
        all_points              = Point.objects.all()
        formatted_points        = {'pointSequence': str(pointSequene)}
        for i in range(len(all_locations)):
            formatted_points[all_locations[i].name] = []
            ponits_in_location          = Point.objects.filter(location_id =all_locations[i].id)
            
            for j in range(len(ponits_in_location)):
                point = {}
                pointId             = ponits_in_location[j].id
                name                = ponits_in_location[j].name
                lat                 = ponits_in_location[j].lat
                lng                 = ponits_in_location[j].lng
                description         = ponits_in_location[j].description
                radius              = ponits_in_location[j].radius

                types = []
                for k in range(len(ponits_in_location[j].pointtypes.all())):
                    types.append(ponits_in_location[j].pointtypes.all()[k].name)

                 
                img                 = ponits_in_location[j].img
                imgPath             = BASE_DIR+img
                # print(imgPath)
                if os.path.exists(imgPath):
                    with open(imgPath, "rb") as image_file:
                        encoded_string = base64.b64encode(image_file.read())
                else:
                    with open(BASE_DIR+"/imgs/No_img.jpg", "rb") as image_file:
                        encoded_string = base64.b64encode(image_file.read())

                point['id']           = pointId
                point['types']        = types
                point['name']         = name
                point['lat']          = lat
                point['lng']          = lng
                point['description']  = description
                point['radius']       = radius
                point['img']          = encoded_string
                formatted_points[all_locations[i].name].append(point)
    return Response(formatted_points)




@api_view(['GET'])
@permission_classes((permissions.AllowAny, ))
def get_cities_imgs(request):

    if request.method == 'GET':
        all_locations           = Location.objects.all()
        formated_cities_img     = {'imageSequence':str(imageSequence)}
        for i in range(len(all_locations)):
            city_name = all_locations[i].name
            img_path = all_locations[i].img
            file_path = BASE_DIR+img_path
            if os.path.exists(file_path):
                with open(file_path, "rb") as image_file:
                    encoded_string = base64.b64encode(image_file.read())
            else:
                with open(BASE_DIR+"/imgs/No_img.jpg", "rb") as image_file:
                    encoded_string = base64.b64encode(image_file.read())

            formated_cities_img[city_name] = encoded_string   
        return Response(formated_cities_img)




# @api_view(['POST'])
# @permission_classes((permissions.IsAdminUser ))
# def create_location(request):
    
#     if request.method == 'GET':
#         # return all the data from location database as a string
#         all_data        = serializers.serialize('json',Location.objects.all())

#         # load the string to be a list
#         all_data_list       = json.loads(all_data)

#         # iterate to remove api info in the list 
#         resp_list = []
#         for i in range(len(all_data_list)):
#             resp_list.append(all_data_list[i]['fields'])

#     return Response(resp_list)


@api_view(['POST'])
@permission_classes((permissions.IsAuthenticated, ))
def getPointTypes(request):
    if request.method == 'POST':
        all_type = PointType.objects.all()
        types = []
        for i in range(len(all_type)):
            type_name = all_type[i].name
            types.append(type_name)
    return Response(types)




@api_view(['GET'])
@permission_classes((permissions.AllowAny, ))
def get_all_polygons(request):
    
    if request.method == 'GET':

        # return all the data from location database as a string
        all_data        = Polygon.objects.all()

        # load the string to be a list
        all_data_list       = json.loads(all_data)

        # iterate to remove api info in the list 
        resp_list = []
        for i in range(len(all_data_list)):
            resp_list.append(all_data_list[i]['fields'])

    return Response(resp_list)

@api_view(['GET'])
@permission_classes((permissions.AllowAny, ))
def get_audio(request):
    if request.method == 'GET':
        # some mp3 is not support for ios
        file_path = BASE_DIR+'/audio/1/4/3.mp3'
        if os.path.exists(file_path):
            # print(file_path)
            # sound = AudioSegment.from_mp3(file_path)
            # sound.export('test.mp3', format="mp3")
            with open(file_path, "rb") as image_file: 
                fsock = image_file 
                return HttpResponse(fsock, content_type='audio/mpeg')
                # return Response(fsock, content_type='audio/m4a')
    

        # resp =  HttpResponse(FileIterWrapper(open('/.../test.mp3',"rb")),mimetype='audio/mpeg')  
        # resp['Content-Length'] = os.path.getsize("/.../test.mp3")  
        # resp['Content-Disposition'] = 'filename=test.mp3'  
        # return resp
