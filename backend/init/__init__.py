from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS

db = SQLAlchemy()
login_manager = LoginManager()
login_manager.login_view = 'auth.login'
login_manager.session_protection = None

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///contactsdb.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'qn)d)p7o$!wg+l%$1mxc=o1$b0+1c9xv_4k%xfm1pej=nsiw3v'
    
    # Configuración de sesiones para desarrollo local
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # Cambiar de 'None' a 'Lax'
    app.config['SESSION_COOKIE_SECURE'] = False
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['REMEMBER_COOKIE_SAMESITE'] = 'Lax'  # Cambiar de 'None' a 'Lax'
    app.config['REMEMBER_COOKIE_SECURE'] = False
    
    # CORS - Configuración para desarrollo local
    CORS(app, 
         supports_credentials=True,
         origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
    )
    
    # Resto del código igual...
    db.init_app(app)
    login_manager.init_app(app)
    
    from .auth import auth as auth_bp
    from .contacts import contacts as contacts_bp
    from .notes import notes as notes_bp
    
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(contacts_bp, url_prefix='/')
    app.register_blueprint(notes_bp, url_prefix='/notes')
    
    from .models import User
    @login_manager.user_loader
    def load_user(id):
        return User.query.get(int(id))
    
    with app.app_context():
        db.create_all()
    
    return app
