from flask import Flask, jsonify, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
import psycopg2
from flask_cors import CORS
import json
import hcl
import fileinput
import json
import os
import datetime
import time
from shutil import copyfile
from python_terraform import *


app = Flask(__name__)
db = SQLAlchemy()
cors = CORS(app)


def get_results(db_cursor):
    desc = [d[0] for d in db_cursor.description]
    return [dotdict(dict(zip(desc, res))) for res in db_cursor.fetchall()]


class dotdict(dict):
    __getattr__ = dict.get
    __setattr__ = dict.__setitem__
    __delattr__ = dict.__delitem__


conn = psycopg2.connect(database="postgres", user="postgres",
                        password="root@123", host="localhost")


from datetime import datetime # datetime object containing current date and time 
now = datetime.now() 
print("now =", now) # dd/mm/YY H:M:S 
dt_string = now.strftime("%m/%d/%Y %H:%M:%S") 
print("date and time =", dt_string)

@app.route("/hello")
def index():
    mycursor = conn.cursor()
    mycursor.execute('select * from jobs order by id desc')
    results = get_results(mycursor)
    newjob = 'job_'+str(results[0]['id'] +1)
    t = time.time()
    print(type(t))
    mycursor.execute('insert into jobs(jobid, date, description) values(%s, %s, %s);', (newjob, t, "Desc4"))
    conn.commit()
    os.mkdir(os.path.join("./jobs/",newjob))
    print(newjob)
    return jsonify(results)


fn = ""
# @app.route("/get-dictionary-values/<filename>")
# @app.route("/get-dictionary-values")


def get_dictionary_values(filename):
    q = {}
    x = {}
    y = {}

    if filename == "":
        print("hi"+filename)
        with open('./template_to_edit/GCP.tf', 'r') as fp:
            obj = hcl.load(fp)
        q, p = get_json(obj, obj, x, y)
        print("Inside if")
        print(q)
        return jsonify(q)
    else:
        fa = "./template_to_edit/"+filename
        print("inside Else")
        print(fa)
        with open(fa, 'r') as fp:
            obj = hcl.load(fp)
        print(obj)
        q, p = get_json(obj, obj, x, y)
        print(q)
        return jsonify(q)


def get_json(obj1, fixedobj, x, y):
    for key1, value1 in obj1.items():
        if key1.__contains__('ANGULAR_EDIT'):
            x[key1] = value1
            # m.append(x)
        if type(value1) == str:
            if value1.__contains__('ANGULAR_EDIT'):
                # y['name'] = value1
                # y['type'] = value1
                # y['lable'] = key1
                # l.append(y)
                y[key1] = value1
                y[value1] = find_key(fixedobj, value1)
                # print(y)
            pass
        if type(value1) == dict:
            get_json(value1, fixedobj, x, y)
    return y, x


def find_key(d, value):
    for k, v in d.items():
        if isinstance(v, dict):
            p = find_key(v, value)
            if p:
                return [k] + p
        elif v == value:
            return [k]


@app.route("/get-files")
def get_files():
    destdir = './template_to_edit/'
    files = [f for f in os.listdir(
        destdir) if os.path.isfile(os.path.join(destdir, f))]
    files = dict(enumerate(files))
    return jsonify(files)


@app.route("/selected-file", methods=['POST'])
def selected_file():
    print('inside selected')
    if request.method == 'POST':
        # print("Hi")
        data = request.get_json()
        global fn
        fn = data['file']
        print(fn)
        # return redirect(url_for('get_dictionary_values',filename = data['file']))
        return get_dictionary_values(data['file'])
        # return jsonify('File got successfully created')


@app.route("/find-and-replace", methods=['POST'])
def data_for_replace():
    print('inside find')
    if request.method == 'POST':
        data = request.get_json()
        print('hi'+fn)
        print(data)
        find_and_replace(fn, data)
        return jsonify('File got successfully created')
    else:
        return jsonify('Unsuccessful File Creation')


def find_and_replace(filename, replacedata):
    print('hi'+filename)
    filelocation = 'template_to_edit/'+filename
    # Opening TF file
    f = open(filelocation, 'r')
    filedata = f.read()
    f.close()
    for i in replacedata[0]:
        filedata = filedata.replace(i['name'], i['type'])
    mycursor = conn.cursor()
    mycursor.execute('select * from jobs order by id desc')
    results = get_results(mycursor)
    global newjob
    newjob = 'job_'+str(results[0]['id'] +1)
    t = time.time()
    print(type(t))
    mycursor.execute('insert into jobs(jobid, date, description) values(%s, %s, %s);', (newjob, t, "pending"))
    conn.commit()
    os.mkdir(os.path.join("./jobs/",newjob))
    print(newjob)
    #return jsonify(results)
    # opening Tempfile
    path = './jobs/'+newjob+'/gcp-key.json'
    copyfile('./tfrun/gcp-key.json', path)
    path = './jobs/'+newjob+'/main.tf'
    f = open(path, 'w')
    f.write(filedata)
    f.close()
    print("Directory Created")


    


@app.route("/create-instance", methods=['POST'])
def create_instance():
    # print('inside find')
    if request.method == 'POST':
        data = request.get_json()
        path = './jobs/'+newjob
        tf = Terraform(working_dir = path)
        # destdir = './template_to_edit/'
        # files = [f for f in os.listdir(
        #     destdir) if os.path.isfile(os.path.join(destdir, f))]
        # print(files)
        tf.init()
        tf.plan()
        temp = tf.apply(skip_plan=True, capture_output=True)
        mycursor = conn.cursor()
        mycursor.execute('update jobs set description = %s where jobid like %s;', (temp, newjob))
        conn.commit()

    return jsonify(temp)


if __name__ == '__main__':
    app.config['DEBUG'] = True
    app.config['CORS_HEADERS'] = 'Content-Type'
    #app.run(debug= True)
    app.run(host="0.0.0.0")
