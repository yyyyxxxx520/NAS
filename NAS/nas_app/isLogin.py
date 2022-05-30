from django.utils.deprecation import MiddlewareMixin
from django.shortcuts import render, redirect
import time


class LoginEstimate(MiddlewareMixin):
    def process_request(self, request):
        white_list = ['/login/', '/register/', '/test/']
        # 判断有没有登录
        if request.path not in white_list:
            login = request.session.get('user', None)
            if not login:
                return redirect('/login/')

    def process_response(self, request, response):
        return response