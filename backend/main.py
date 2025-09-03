from init import create_app, db

app = create_app()

#run flask app
if __name__ == '__main__':
    app.run(debug=True)