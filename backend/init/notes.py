from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from .models import Note
from . import db

notes = Blueprint('notes', __name__)

# Obtener todas las notas del usuario logueado
@notes.route("/", methods=["GET"])
@login_required
def get_notes():
    notes = Note.query.filter_by(user_id=current_user.id).all()
    return jsonify({'notes': [note.to_json() for note in notes]}), 200

# Crear una nota nueva
@notes.route("/", methods=["POST"])
@login_required
def create_note():
    data = request.json
    text = data.get('data')
    if not text:
        return jsonify({'message': "Note text required."}), 400

    new_note = Note(data=text, user_id=current_user.id)
    db.session.add(new_note)
    db.session.commit()
    return jsonify({'success': True, 'note': new_note.to_json()}), 201

# Borrar una nota
@notes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_note(id):
    note = Note.query.filter_by(id=id, user_id=current_user.id).first()
    if not note:
        return jsonify({'message': "Note not found."}), 404

    db.session.delete(note)
    db.session.commit()
    return jsonify({'success': True, 'message': "Note deleted."}), 200