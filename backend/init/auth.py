from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
from .models import User
from . import db

auth = Blueprint('auth', __name__)

@auth.route("/login", methods=["GET", "POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        return jsonify({'success': True}), 200
    
    if request.method == "GET":
        return jsonify({'success': False, 'message': "Please login"}), 401
    
    # POST logic
    data = request.json
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    
    if user and check_password_hash(user.password, password):
        login_user(user, remember=True)
        return jsonify({'success': True, 'user': user.to_json()}), 200
    
    return jsonify({'success': False, 'message': "Invalid credentials."}), 401@auth.route("/logout", methods=['POST', 'OPTIONS'])



@login_required
def logout():
    if request.method == "OPTIONS":
        return jsonify({'success': True}), 200
    
    logout_user()
    return jsonify({'success': True, 'message': "Logged out."}), 200

@auth.route("/sign-up", methods=['POST', 'OPTIONS'])
def sign_up():
    if request.method == "OPTIONS":
        return jsonify({'success': True}), 200
    
    data = request.json
    email = data.get('email')
    password1 = data.get('password1')
    password2 = data.get('password2')
    first_name = data.get('first_name')
    user = User.query.filter_by(email=email).first()
    
    if user:
        return jsonify({'success': False, 'message': "Email already exists."}), 400
    elif len(email) < 10:
        return jsonify({'success': False, 'message': "Email must be at least 10 characters long."}), 400
    elif len(first_name) < 3:
        return jsonify({'success': False, 'message': "Name must be at least 3 characters long."}), 400
    elif len(password1) < 7:
        return jsonify({'success': False, 'message': "Password must be at least 7 characters long."}), 400
    elif password1 != password2:
        return jsonify({'success': False, 'message': "Passwords don't match."}), 400
    else:
        new_user = User(email=email, first_name=first_name, password=generate_password_hash(password1, method='pbkdf2:sha256'))
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'success': True, 'message': "Account created."}), 200
