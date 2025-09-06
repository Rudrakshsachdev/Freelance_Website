from django.shortcuts import render, redirect
from .models import ContactMessage
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from FreeLance_Website.settings import EMAIL_HOST_USER, EMAIL_HOST_PASSWORD
import os


# def homepage(request):
#     if request.method == 'POST' and request.headers.get('x-requested-with') == 'XMLHttpRequest':
#         name = request.POST.get('name')
#         email = request.POST.get('email')
#         phone = request.POST.get('phone')
#         service = request.POST.get('service')
#         message = request.POST.get('message')

#         if not (name and email and service and message):
#             return JsonResponse({'success': False, 'message': 'All fields are required'})

#         ContactMessage.objects.create(
#             name=name, email=email, phone=phone, service=service, message=message
#         )
#         return JsonResponse({'success': True, 'message': 'Message sent successfully'})

#     return render(request, 'home.html')

def homepage(request):
    if request.method == 'POST':
        print(request.POST)
        name = request.POST.get('name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        service = request.POST.get('service')
        message = request.POST.get('message')

        if not (name and email and service and message):
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'message': 'All fields are required'})
            return render(request, 'home.html', {'error': 'All fields are required'})

        ContactMessage.objects.create(
            name=name, email=email, phone=phone, service=service, message=message
        )

        subject = "Thank You for Contacting R&P Innovations"

        body = f"""
        Dear {name},

        Thank you for reaching out to **R&P Innovations** regarding your interest in our "{service}" services.  
        We’re excited to learn more about your project and help you bring your vision to life!

        Here’s a quick summary of your message:  
        "{message}"

        Our team will carefully review your request and get back to you within **24–48 hours** with the next steps.  

        Meanwhile, let’s stay connected:  
        📲 Join our WhatsApp Community for updates, tips, and priority support: https://chat.whatsapp.com/Izdr6dbHy9e8bCnBnNJpQG  
        📸 Follow us on Instagram for inspiration and our latest projects: https://www.instagram.com/rp_innovations_official?igsh=MTRqNzgxM3Bzand1cg==  

        For urgent queries, you can always reach us at **rpinnovations.info@gmail.com** or **+91 9354712773**.  

        We look forward to building something amazing together. 🚀  

        Warm regards,  
        **The R&P Innovations Team**
        """

        send_mail(
            subject,
            body,
            from_email = os.environ.get('EMAIL_HOST_USER'),
            recipient_list = [email],
            fail_silently = False,
        )

        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'success': True, 'message': 'Message sent successfully'})
        return render(request, 'home.html', {'success': 'Message sent successfully'})
    
        

    return render(request, 'home.html')

def privacy_policy(request):
    return render(request, 'privacy_policy.html')

def terms_and_conditions(request):
    return render(request, 'terms.html')