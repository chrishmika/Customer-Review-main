from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('review_submit/', views.submit_view, name='submit-view')
]