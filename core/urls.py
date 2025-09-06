from django.urls import path
from . import views

urlpatterns = [
    path('', views.homepage, name='homepage'),
    path('privacy-policy/', views.privacy_policy, name='privacy_policy'),
    path('terms-and-conditions/', views.terms_and_conditions, name='terms_and_conditions'),
]
