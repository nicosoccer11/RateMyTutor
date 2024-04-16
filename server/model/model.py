import psycopg2
from psycopg2 import Error
import chromadb
from sentence_transformers import SentenceTransformer
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def getInfo():
    try:
        # Connect to an existing database
        connection = psycopg2.connect(user="ratemytutor",
                                    password="ratemytutor",
                                    host="ratemytutor-db-instance.cn6kmc0ka3p3.us-east-2.rds.amazonaws.com",
                                    port="5432",
                                    database="rate_my_tutor_db")

        # Create a cursor to perform database operations
        cursor = connection.cursor()
        # Print PostgreSQL details
        # print("PostgreSQL server information")
        # print(connection.get_dsn_parameters(), "\n")
        # Executing a SQL query
        cursor.execute("SELECT * FROM users")
        colnames = [desc[0] for desc in cursor.description]
        # Fetch result
        record = cursor.fetchall()
        #print(colnames)
        #print(record)
        students = {'name': [], 'bio': []}
        for student in record:
            students['name'].append(student[0])
            bio = ""
            if student[9] is not None:
                bio = student[9]
            elif student[8] is not None:
                bio = student[8]
            students['bio'].append(bio)
        

    except (Exception, Error) as error:
        print("Error while connecting to PostgreSQL", error)
    finally:
        if (connection):
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")
            return students


@app.route("/findTutors/<username>", methods=['GET'])
def FindTutor(username):
    if (request.method == 'GET'):
        students = getInfo()
        tutors = {'name': students['name'][5:], 'bio': students['bio'][5:]}
        client = chromadb.Client()
        model = SentenceTransformer("all-MiniLM-L6-v2")

        #Initialize Vector Database
        def init_vectordb():
            studentdb = client.get_or_create_collection("student_collection")
            tutordb = client.get_or_create_collection("tutordb_collection")
            return studentdb, tutordb

        def getDataFrames(students, tutors):
            # pd.set_option('display.max_colwidth', None)
            student_data = pd.DataFrame.from_dict(students)
            tutor_data = pd.DataFrame.from_dict(tutors)
            return student_data, tutor_data

        student_data, tutor_data = getDataFrames(students, tutors)
        # print(student_data)

        #Retrieve and Store Collection Data
        def get_collection_data(file_data):
            documents = []
            embeddings = []
            metadatas = []
            ids = []

            for person in file_data.itertuples():
                bio = person[2]
                name = person[1]

                embeddings.append(model.encode(bio).tolist())
                metadatas.append({'Name': name})
                ids.append(str(len(documents)))
                documents.append(bio)
            return documents, embeddings, metadatas, ids

        #Insert Data to Vector Database
        def insert_to_vectordb():
            studentdb, tutordb = init_vectordb()

            student_col = get_collection_data(student_data)
            tutor_col = get_collection_data(tutor_data)
            studentdb.add(documents=student_col[0], embeddings = student_col[1], metadatas=student_col[2], ids=student_col[3])
            tutordb.add(documents=tutor_col[0], embeddings = tutor_col[1], metadatas=tutor_col[2], ids=tutor_col[3])
            return 

        def search_vectordb(name, n=1):
            studentdb, tutordb = init_vectordb()
            if name in student_data['name'].tolist():
                bio = student_data[student_data['name'] == name].iloc[0]['bio']
                results = tutordb.query(query_texts=[bio], n_results=n)
            else:
                bio = tutor_data[tutor_data['name'] == name].iloc[0]['bio']
                results = studentdb.query(query_texts=[bio], n_results=n)
            return results

        insert_to_vectordb()
        #Raise n for more results if you have larger datasets 
        n=3
        results = search_vectordb(username, n)
        ret = {"names": []}
        for name in results['metadatas'][0]:
            ret['names'].append(name['Name'])
        return jsonify(ret)


if __name__ == "__main__":
    # insert_to_vectordb()
    # name="test"
    # #Raise n for more results if you have larger datasets 
    # n=2
    # results = search_vectordb(name, n)
    # print(results)
    app.run(debug=True)

