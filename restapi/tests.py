# from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Polygon, Location, Point, PointType
import json
User = get_user_model()

# from django.contrib.auth.models import User

User = get_user_model()
ip='http://192.178.1.71:8000/'
class test_user(APITestCase):
    def setUp(self):
        polygo1  = Polygon(points='[{"lat": 49.33832241947767, "lng": -123.18763732910156, "types": []}, {"lat": 49.32505206409244, "lng": -123.13839197158813, "types": []}, {"lat": 49.32140173953507, "lng": -123.11008930206299, "types": []}, {"lat": 49.31119058261628, "lng": -123.07305335998535, "types": []}, {"lat": 49.271836861819274, "lng": -123.09785842895508, "types": []}, {"lat": 49.26511616008369, "lng": -123.12583923339844, "types": []}, {"lat": 49.27766072946756, "lng": -123.25115203857422, "types": []}, {"lat": 49.281860207286456, "lng": -123.24746131896973, "types": []}, {"lat": 49.28068438954263, "lng": -123.1648063659668, "types": []}, {"lat": 49.30078141699555, "lng": -123.16557884216309, "types": []}]')
        polygo1.save()
        polygon2  = Polygon(points='[{"lat": 49.33832241947767, "lng": -123.18763732910156, "types": []}, {"lat": 49.32505206409244, "lng": -123.13839197158813, "types": []}, {"lat": 49.32140173953507, "lng": -123.11008930206299, "types": []}, {"lat": 49.31119058261628, "lng": -123.07305335998535, "types": []}, {"lat": 49.271836861819274, "lng": -123.09785842895508, "types": []}, {"lat": 49.26511616008369, "lng": -123.12583923339844, "types": []}, {"lat": 49.27766072946756, "lng": -123.25115203857422, "types": []}, {"lat": 49.281860207286456, "lng": -123.24746131896973, "types": []}, {"lat": 49.28068438954263, "lng": -123.1648063659668, "types": []}, {"lat": 49.30078141699555, "lng": -123.16557884216309, "types": []}]')
        polygon2.save()
        user_obj = User(username='testcfeuser', email='test@test.com')
        user_obj.set_password('randompassword')
        user_obj.save()
        location1 = Location(name='Vancouver', adminuser=user_obj,lat=49.3348822230993, lng=-123.206144670191,price=3,description='test city Vancouver',polygon_id=polygo1.id)
        location1.save()
        pointType1 = PointType(name = 'long walk')
        pointType1.save()
        pointType2 = PointType(name = 'supper long walk')
        pointType2.save()
        point1 = Point(location=location1, lat=49.287696678908, lng=-123.141949928956, name='Amazing Laughter', img='/imgs/points/AmazingL.jpg',radius=10)
        point1.save()
        point1.pointtypes.add(pointType1, pointType2)




    # def test_signup(self):
    #     # signup
    #     data = {"username":"testcfeuser2","password":"randompassword","email":"testsignup@email.com"}
    #     path = "api/signup/"
    #     url  =  ip + path 
    #     response = self.client.post(url,data,format='json')
    #     # print(response._bodyText)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)

    # def test_login(self):
    #     data = {"username":"testcfeuser","password":"randompassword"}
    #     path = 'api/login/'
    #     url  =  ip + path 
    #     response = self.client.post(url,data,format='json')
    #     # print(response.data["token"])


    #     # test verity token
    #     data2 = {'token': response.data["token"]}
    #     path2 = 'api/verify_token/'
    #     url2 = ip + path2
    #     response2 = self.client.post(url2,data2,format='json')
    #     # print('verity')
    #     # print(response2.data)
    #     # print(response.data["token"])
    #     # token = response.data["token"]


    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    

    # def test_get_locations(self):
    #     path = 'api/get_all_locations/'
    #     url = ip + path
    #     response = self.client.get(url)
    #     print(response.data)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)


    # def test_get_imgs(self):
    #     path = 'api/get_imgs/'
    #     url = ip + path
    #     response = self.client.get(url)
    #     # print(response.data)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_points(self):
        # data = {"username":"testcfeuser","password":"randompassword"}
        # path = 'api/login/'
        # url  =  ip + path 
        # response = self.client.post(url,data,format='json')
        # # print(type(response.data['token']))

        path3 = 'api/get_points/'
        url3 = ip + path3
        # data3 = {'token': response.data['token']}
        # jdata = json.dumps(data3)
        # data3={ 'headers': {'Content-Type': 'application/json', 'Authorization': 'JWT '+ response.data['token'] }},
        # jd = json.dumps(data3)
        response3 = self.client.get(url3,format='json')
        # print('point')
        # print(response3.data['Vancouver'][0]['name'])
        self.assertEqual(response3.status_code, status.HTTP_200_OK)

    # def test_get_audio(self):
    #     path = 'api/getaudio/'
    #     url = ip + path
    #     response = self.client.get(url)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)