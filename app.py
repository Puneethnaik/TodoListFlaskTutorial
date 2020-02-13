from flask import Flask, render_template, request, abort, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'

db = SQLAlchemy(app)

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    def __repr__(self):
        return "<Task id=%r>" % (self.id)
@app.route("/", methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        #form handling
        task_content = request.form['content']
        new_task = Todo(content=task_content)
        #push to database
        try:
            db.session.add(new_task)
            db.session.commit()
            return redirect('/')
        except Exception:
            abort(404)
    elif request.method == 'GET':
        tasks = Todo.query.order_by(Todo.date_created).all()
        return render_template('index.html', tasks=tasks)
    else:
        pass

@app.route("/deleteTask/<taskId>")
def deleteTask(taskId):
    Todo.query.filter(Todo.id == taskId).delete()
    db.session.commit()
    return redirect("/")

@app.route("/update", methods=['POST'])
def updateTask():
    task_to_be_modified = Todo.query.filter(Todo.id == request.json["id"]).first()
    task_to_be_modified.content = request.json["content"]
    task_to_be_modified.date_created = datetime.strptime(request.json["date_created"], "%Y-%m-%d")
    print(task_to_be_modified)
    print(db.session.dirty)
    db.session.commit()
    return "successful"

if __name__ == "__main__":
    app.run(debug=True)
