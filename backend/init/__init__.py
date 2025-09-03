from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS

db = SQLAlchemy()
login_manager = LoginManager()
login_manager.login_view = 'auth.login'

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///contactsdb.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'qn)d)p7o$!wg+l%$1mxc=o1$b0+1c9xv_4k%xfm1pej=nsiw3v'

    # CORS
    CORS(app)

    # Inicializar extensiones
    db.init_app(app)
    login_manager.init_app(app)

    # Importar blueprints
    from .auth import auth as auth_bp
    from .contacts import contacts as contacts_bp
    from .notes import notes as notes_bp

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(contacts_bp, url_prefix='/api/contacts')
    app.register_blueprint(notes_bp, url_prefix='/api/notes')

    # User loader
    from .models import User
    @login_manager.user_loader
    def load_user(id):
        return User.query.get(int(id))

    # Crear DB
    with app.app_context():
        db.create_all()

    return app