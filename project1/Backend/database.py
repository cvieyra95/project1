from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*" : {"origins": "http://secure-chat.free.nf"}})
bcrypt = Bcrypt(app)

# Configure MySQL database
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://if0_38731683:z7ailhKmanQrkeQ@sql204.infinityfree.com/if0_38731683_chatdb"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

# Route to handle user signup
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    username = data.get("username")
    password = bcrypt.generate_password_hash(data.get("password")).decode("utf-8")

    if User.query.filter_by(username=username).first():
        return jsonify({"success": False, "message": "Username already taken"}), 400

    new_user = User(username=username, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"success": True, "message": "Signup successful!"})

# Route to handle user login
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(username=data.get("username")).first()

    if user and bcrypt.check_password_hash(user.password, data.get("password")):
        return jsonify({"success": True, "message": "Login successful!"})
    
    return jsonify({"success": False, "message": "Invalid credentials"}), 401

if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Create the database tables
    app.run(host="0.0.0.0",debug = True, port=5001)
