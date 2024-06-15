from django.db import models
import json
from django.contrib.postgres.fields import JSONField

class Item(models.Model):
    id = models.CharField(max_length=10, primary_key=True)
    itemName = models.CharField(max_length=100)
    imageUrl = models.CharField(max_length=100)
    description = models.TextField()
    commentCount = models.IntegerField(default=0)
    reviewInfo = models.JSONField(default=list, null=True, blank=True) 

    def __str__(self):
        return self.itemName
    
    def add_review(self, comment, value):
        reviews = json.loads(self.reviewInfo)
        reviews.append({'commentTxt': comment, "value": value})
        self.reviewInfo = json.dump(reviews)
        self.commentCount += 1
        self.save()