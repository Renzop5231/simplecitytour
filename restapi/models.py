from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone



#returns date after which the purchased items expires
def paymentEndDate():
	return timezone.now() + timezone.timedelta(days=366)
#returns audio file location on server
def audioFileLocation(instance, filename):
	return str(instance.location.pk) + "/" + str(instance.pk) + "/" + filename
#returns landing page location
def landingPageLocation(instance, filename):
	return "landingPage/" + str(instance.pk) + "/" + filename


# Create your models here.


# Polygon class to draw polygons on map
class Polygon(models.Model):
	points = models.CharField(max_length=1000,null=True)
	created = models.DateTimeField(auto_now_add=True, editable=False, null=True)
	last_updated = models.DateTimeField(auto_now=True, editable=False, null=True)
	strokeColor = models.CharField(max_length=255, null=True, blank=True)
	strokeWeight = models.IntegerField(null=True, blank=True)
	strokeOpacity = models.IntegerField(null=True, blank=True)
	fillColor = models.CharField(max_length=255, null=True, blank=True)
	fillOpacity = models.IntegerField(null=True, blank=True)



#landing page location
class LandingPage(models.Model):
	image = models.FileField(null=True, blank=True, upload_to=landingPageLocation)



#Location class for all the locations with their latitudes and longitudes
#models: the database containing location points info
class Location(models.Model):
	name = models.CharField(max_length=255,null=True)
	created = models.DateTimeField(auto_now_add=True, editable=False, null=True)
	last_updated = models.DateTimeField(auto_now=True, editable=False, null=True)
	isReady = models.BooleanField(default=False)
	# adminuser = models.ForeignKey(User, null=True)
	adminuser = models.ForeignKey(User, on_delete=models.PROTECT)
	lat = models.DecimalField(decimal_places=19, max_digits=23,null=True)
	lng = models.DecimalField(decimal_places=19, max_digits=23,null=True)
	price = models.DecimalField(decimal_places=2, max_digits=12,null=True)
	visibility = models.BooleanField(default=True)
	description = models.CharField(max_length=1000,null=True)
	polygon = models.OneToOneField(Polygon, models.PROTECT ,null=True)
	zoom = models.IntegerField(null=True)
	img = models.CharField(max_length=255,default="/not_set")



#This class describes the type of the location point on the map
class PointType(models.Model):
	name = models.CharField(max_length=255, null=True)



# Point class for storing info about one location point
class Point(models.Model):
	location = models.ForeignKey(Location, models.CASCADE, null=True)
	pointtypes =  models.ManyToManyField(PointType, blank=True)
	created = models.DateTimeField(auto_now_add=True, editable=False, null=True)
	last_updated = models.DateTimeField(auto_now=True, editable=False, null=True)
	lat = models.DecimalField(decimal_places=19, max_digits=23,null=True)
	lng = models.DecimalField(decimal_places=19, max_digits=23,null=True)
	name = models.CharField(max_length=255,null=True)
	description = models.CharField(max_length=1000,null=True)
	visibility =  models.BooleanField(default=True)
	radius = models.DecimalField(decimal_places=4, max_digits=10,null=True)
	audioFile = models.FileField(null=True, blank=True, upload_to=audioFileLocation)
	content_type = models.CharField(max_length=255,null=True, blank=True)
	img = models.CharField(max_length=255,null=True)



#Tourist class for the user authentication and updating the account
class Tourist(models.Model):
	user =  models.OneToOneField(User,on_delete=models.PROTECT)
	paymentToken =  models.CharField(max_length=1000, null=True)
	created = models.DateTimeField(auto_now_add=True, editable=False, null=True)
	last_updated = models.DateTimeField(auto_now=True, editable=False, null=True)



#User Payment class storing info about the user and their payments into the database
class UserPayment(models.Model):
	user =  models.ForeignKey(User,on_delete=models.PROTECT)
	startDate = models.DateTimeField(null=True, auto_now=True)
	endDate = models.DateTimeField(null=True,default=paymentEndDate)
	isProcessed = models.BooleanField(default=False)
	location = models.ForeignKey(Location, models.PROTECT)
	paymentId =  models.CharField(max_length=1000, null=True)
	paymentType = models.CharField(max_length=255, null=True)
	paymentAmount = models.DecimalField(decimal_places=2, max_digits=6,null=True,blank=True)



class AdminActiveTime(models.Model):
	user =  models.ForeignKey(User, on_delete=models.PROTECT)
	startDate = models.DateTimeField()
	endDate = models.DateTimeField(null=True)
	location = models.ForeignKey(Location, models.PROTECT)