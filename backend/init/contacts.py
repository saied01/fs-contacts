from flask import request, jsonify, Blueprint
from . import db
from .models import Contact
from flask_login import login_required, current_user

contacts = Blueprint('contacts', __name__)

#read
@contacts.route('/contacts', methods=['GET', 'OPTIONS'])
@login_required
def get_contact():
    if request.method == "OPTIONS":
        return jsonify({'success': True}), 200
    
    contacts = Contact.query.filter_by(user_id=current_user.id).all()
    contacts_dic = [c.to_json() for c in contacts]
    return jsonify({'contacts': contacts_dic})

#create
@contacts.route('/create_contact', methods=['POST', 'OPTIONS'])
@login_required
def create_contact():
    if request.method == "OPTIONS":
        return jsonify({'success': True}), 200
    
    first_name = request.json.get('firstName')
    last_name = request.json.get('lastName')
    email = request.json.get('email')

    if not email or not last_name or not first_name:
        return jsonify({'message': "You must include email, first and last name."}), 400
    
    new_contact = Contact(
        first_name=first_name, 
        last_name=last_name, 
        email=email,
        user_id=current_user.id
        )

    try:
        db.session.add(new_contact)
        db.session.commit()
    except Exception as e:
        return jsonify({'message': str(e)}), 400
    
    return jsonify({'message': "Contact created."}), 200

#update
@contacts.route('/update_contact/<int:contact_id>', methods=['PATCH', 'OPTIONS'])
@login_required
def update_contact(contact_id):
    if request.method == "OPTIONS":
        return jsonify({'success': True}), 200
    
    contact = Contact.query.filter_by(id=contact_id, user_id=current_user.id).first()

    if not contact:
        return jsonify({'message': "Contact not found."}), 404

    data = request.json
    contact.first_name = data.get('firstName', contact.first_name)
    contact.last_name = data.get('lastName', contact.last_name)
    contact.email = data.get('email', contact.email)

    db.session.commit()

    return jsonify({'message': "Contact updated."}), 201

#delete
@contacts.route('/delete_contact/<int:contact_id>', methods=['DELETE', 'OPTIONS'])
@login_required
def delete_contact(contact_id):
    if request.method == "OPTIONS":
        return jsonify({'success': True}), 200
    
    contact = Contact.query.filter_by(id=contact_id, user_id=current_user.id).first()

    if not contact:
        return jsonify({'message': "Contact not found."}), 404
    
    db.session.delete(contact)
    db.session.commit()

    return jsonify({'message': "Contact deleted."}), 200
