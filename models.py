from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Shortcut(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    query = db.Column(db.String(255), nullable=False)
    response = db.Column(db.String(255), nullable=False)
