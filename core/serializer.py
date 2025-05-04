from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Item, Category, Sale

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']  # Add fields according to your User model

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'  # or list specific fields like ['id', 'name', 'price', ...]

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class SalesReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale  # Replace with your model
        fields = '__all__'