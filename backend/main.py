from flask import request, jsonify
from config import app, db
from models import Contact

# CRUD (Create Rread Update Delete) <- what we are building, so we need an operation for each

#read
@app.route('/contacts', methods=['GET'])
def get_contact():
    contacts = Contact.query.all()
    contacts_dic = list(map(lambda x: x.to_json(), contacts)) # eq.: contacts.to_json()
    # now with the dictionary I can jsonify it
    return jsonify({'contacts': contacts_dic})

#create
@app.route('/create_contact', methods=['POST'])
def create_contact():
    first_name = request.json.get('firstName')
    last_name = request.json.get('lastName')
    email = request.json.get('email')

    if not email or not last_name or not first_name:
        return jsonify({'message': "You must include email, first and last name."}), 400
    
    new_contact = Contact(first_name=first_name, last_name=last_name, email=email)

    try:
        db.session.add(new_contact)
        db.session.commit()
    except Exception as e:
        return jsonify({'message': str(e)}), 400
    
    return jsonify({'message': "Contact created."}), 200


#update
@app.rout('/update_contact/<int:user_id>', methods=['PATCH'])
def update_contact(user_id):
    contact = Contact.query.get(user_id)

    if not contact:
        return jsonify({'message': "Contact not found."}), 404

    data = request.json
    contact.first_name = data.get('firstName', contact.first_name)
    contact.last_name = data.get('lastName', contact.last_name)
    contact.email = data.get('email', contact.email)

    db.session.commit()

    return jsonify({'message': "Contact updated."}), 201


#delete
@app.route('/delete_contact', methods=['DELETE'])
def delete_contact(user_id):
    contact = Contact.query.get(user_id)

    if not contact:
        return jsonify({'message': "Contact not found."}), 404
    
    db.session.delete(contact)
    db.session.commit()

    return jsonify({'message': "Contact deleted."}), 200


#run flask app
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)