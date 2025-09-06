from django.db import models

# Create your models here.
class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    services_choice = [
        ('select a service', 'Select a Service'),
        ('portfolio website', 'Portfolio Website'),
        ('dynamic website', 'Dynamic Website'),
        ('e-commerce website', 'E-commerce Website'),
        ('custom solution', 'Custom Solution')
    ]
    service = models.CharField(max_length=100, choices=services_choice)
    message = models.TextField()
    phone = models.CharField(max_length=15, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.email}"