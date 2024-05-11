from flask import Flask, request, jsonify
import os
import mysql.connector
from dotenv import load_dotenv

# using the password for connecting mysql
load_dotenv()
password = os.getenv('MYSQL_ROOT_PASSWORD')
dbName = "db06"
app = Flask(__name__)


# This function creates a new database connection for each request. we used this pattern  when we wanted parallel access to the DB (in the use effect mainly in statistics.js)
def get_database_connection():
    return mysql.connector.connect(
        user='root',
        password=os.getenv('MYSQL_ROOT_PASSWORD', ''),
        host='127.0.0.1',
        # used for big data retrun from the DB.we Changed this setting for not getting timeout
        connect_timeout=28800,
        database=dbName
    )


# This function close the connection to the database and the cursor object
def close_database_connection(connection, cursor):
    if cursor:
        cursor.close()
    if connection:
        connection.close()


@app.route("/register", methods=["POST"])
def registration():
    try:
        # get the params from the post request.
        data = request.get_json()
        insert_result = insert_user(data)

        if insert_result["status"] == "success":
            return jsonify(
                {"status": "success", "message": "User registered successfully"}), 200
        elif insert_result["status"] == "error":
            return jsonify({"status": "error", "message": insert_result["message"]}), 500


    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": str(e)}), 500


def getUserDifficulty(username, cursor):
    try:
        query = f"""
        SELECT MAX(UseRate) as maxUseRate
        FROM Word
        """

        cursor.execute(query)
        # get the maximum
        maxUseRate = int(cursor.fetchone()[0])

        query = f"""
        SELECT *
        FROM user as u
        WHERE u.username = BINARY"{username}"
        """

        cursor.execute(query)
        _, _, hakbatza, grade = cursor.fetchone()

        # make it so that the user will get a more difficult word, the higher grade and hakbatza that user is
        # the higher the useRate of the word, the more difficult
        # because we have 12 grades and 3 hakbatza for each grade, we divide all the words into 36 sections, where the lower sections are considered "easy" words
        # and the higher sections are considered "difficult" words
        return round((maxUseRate * (12 * (int(grade) - 1) + int(hakbatza))) / 36)

    except Exception as e:
        print(e)
        return None


def insert_user(data):
    username, password, class_year, hakbatza = data['username'], data['password'], data['selectedClass'], data[
        'selectedLevel']
    query_check = f"SELECT * FROM {dbName}.user WHERE username= BINARY '{username}';"
    query_insert = f"INSERT INTO {dbName}.user (Username, Password, Hakbatza, Class) VALUES ( '{username}' , '{password}' , '{hakbatza}', '{class_year}')"
    try:
        cnx = get_database_connection()
        cursor = cnx.cursor(buffered=True)
        cursor.execute(query_check)
        result = cursor.fetchall()
        if not result:
            try:
                cursor.execute(query_insert)
                cnx.commit()
                return {"status": "success", "message": "User inserted successfully"}  # Success
            except Exception as e:
                print(e)
                return {"status": "error", "message": f"Failed to insert user: {str(e)}"}  # Failed to insert
        else:
            return {"status": "error", "message": "User already exists"}  # User already exists
    except Exception as e:
        print(e)
        return {"status": "error",
                "message": f"Database query execution error: {str(e)}"}  # Database query execution error
    finally:
        close_database_connection(cnx, cursor)


@app.route("/login", methods=["POST"])
def log_in():
    try:
        data = request.get_json()  # this taking json object and insert him as dictionary in python
        answer = login_verification(data)

        if answer["status"] == "success":
            return jsonify(
                {"status": "success", "message": "User registered successfully"}), 200  # return data and http status.
        elif answer["status"] == "error":
            return jsonify({"status": "error", "message": answer["message"]}), 500


    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": str(e)}), 500


def login_verification(data):
    username, password = data['username'], data['password']
    query_check = f"SELECT * FROM {dbName}.user WHERE Username = BINARY'{username}' AND Password =BINARY '{password}';"

    try:
        cnx = get_database_connection()
        cursor = cnx.cursor(buffered=True)
        cursor.execute(query_check)
        result = cursor.fetchall()
        # # if result is [] its mean he isn't register yet
        if not result:
            return {"status": "error", "message": "One or more of the data entered is incorrect"}
        else:
            return {"status": "success", "message": "User is registered"}
    except Exception as e:
        return {"status": "error", "message": f"Failed Checking in login: {str(e)}"}
    finally:
        close_database_connection(cnx, cursor)


@app.route("/averageAccuracy", methods=["GET"])
def average_accuracy():
    try:
        username = request.args.get('username')
        cnx = get_database_connection()
        cursor = cnx.cursor(buffered=True)
        queryAverage = f"SELECT IFNULL(ROUND(AVG(Accuracy)), 0) AS Average FROM {dbName}.userlog WHERE username = '{username}';"

        cursor.execute(queryAverage)

        result = cursor.fetchone()

        close_database_connection(cnx, cursor)

        return jsonify({"status": "success", "message": result}), 200

    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        close_database_connection(cnx, cursor)


# this return the rank between all users and not between the class.
@app.route("/classRate", methods=["GET"])
def class_rate():
    try:
        username = request.args.get('username')

        cnx = get_database_connection()
        cursor = cnx.cursor(buffered=True)
        query = (
            "SELECT COUNT(*) + 1 AS position,(SELECT COUNT(*) FROM user) AS total_users "
            "FROM ( "
            "    SELECT * "
            f"    FROM {dbName}.userlog "
            "    WHERE Result = 'Win' "
            "    GROUP BY username "
            "    HAVING COUNT(*) > ( "
            f"        SELECT COUNT(*) "
            f"        FROM {dbName}.userlog "
            f"        WHERE username = '{username}' AND Result = 'Win' "
            "    ) "
            ") AS subquery;"
        )

        cursor.execute(query)
        result = cursor.fetchone()

        result_string = "/".join(map(str, result))

        close_database_connection(cnx, cursor)

        return jsonify({"status": "success", "message": str(result_string)}), 200

    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        close_database_connection(cnx, cursor)


@app.route("/classAndHakbatzaRate", methods=["GET"])
def class_hakbatz_rate():
    try:
        username = request.args.get('username')
        cnx = get_database_connection()
        cursor = cnx.cursor(buffered=True)
        # query = f"""
        #         SELECT
        #             COUNT(*) + 1 AS position,
        #             (SELECT COUNT(*) AS total
        #              FROM (SELECT user.username, Result
        #                    FROM user
        #                    JOIN userlog ON user.username = userlog.username
        #                    WHERE Hakbatza = (SELECT Hakbatza FROM user AS u WHERE "{username}" = u.username)
        #                    AND class = (SELECT class FROM user AS u WHERE "{username}" = u.username)
        #                    GROUP BY user.username) AS hak1) AS totalusers
        #         FROM
        #             (SELECT *
        #              FROM (SELECT user.username, Result
        #                    FROM user, userlog
        #                    WHERE user.username=userlog.username
        #                    AND Hakbatza=(SELECT Hakbatza FROM user AS u WHERE "{username}"=u.username)
        #                    AND class=(SELECT class FROM user AS u WHERE "{username}"=u.username)) AS hak
        #              WHERE Result="Win"
        #              GROUP BY username
        #              HAVING COUNT(*) > (SELECT COUNT(*) FROM userlog WHERE username = "{username}" and Result="Win")) AS subquery
        #         """

        query =f"""   SELECT COUNT(*) as position
                        FROM
                            (SELECT u2.username, (SELECT COUNT(*) FROM userlog WHERE userlog.username = u2.username AND userlog.result = 'Win') AS winCount
                            FROM user as u1, user as u2
                            WHERE u1.username = '{username}' AND u1.hakbatza = u2.hakbatza AND u1.class = u2.class) as temp
                        WHERE winCount >= (SELECT COUNT(*) FROM userlog WHERE username = '{username}' AND result="Win" ) """

        query = query.format(username=username)
        cursor.execute(query)        
        position = cursor.fetchone()

        query =f"""    SELECT COUNT(*) as totalusers 
                        FROM 
                            (SELECT u2.username, u2.Class, u2.Hakbatza
                            FROM user as u1, user as u2
                            WHERE u1.username = '{username}' AND u1.hakbatza = u2.hakbatza AND u1.class = u2.class) as temp"""
        
        query = query.format(username=username)
        cursor.execute(query)
        totalUsers = cursor.fetchone()


        result_string = "/".join([str(position[0]), str(totalUsers[0])])

        close_database_connection(cnx, cursor)
        return jsonify({"status": "success", "message": str(result_string)}), 200
    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        close_database_connection(cnx, cursor)


@app.route("/game1Score", methods=["GET"])
def game1Score():
    try:
        cnx = get_database_connection()
        cursor = cnx.cursor(buffered=True)

        query = """
                 SELECT 
                     username, 
                     COUNT(*) AS num,
                     TypeOfGame
                 FROM 
                     userlog
                 WHERE 
                     TypeOfGame = 'game1' AND Result = 'Win'
                 GROUP BY 
                     username, TypeOfGame
                 ORDER BY 
                     num DESC
                 LIMIT 5;
             """
        cursor.execute(query)

        rows = cursor.fetchall()

        result_dicts = [{'username': row[0], 'Accuracy': row[1]} for row in rows]

        close_database_connection(cnx, cursor)

        return jsonify({"status": "success", "message": result_dicts}), 200

    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/game2Score", methods=["GET"])
def game2Score():
    try:
        cnx = get_database_connection()
        cursor = cnx.cursor(buffered=True)

        query = """
                 SELECT 
                     username, 
                     COUNT(*) AS num,
                     TypeOfGame
                 FROM 
                     userlog
                 WHERE 
                     TypeOfGame = 'game2' AND Result = 'Win'
                 GROUP BY 
                     username, TypeOfGame
                 ORDER BY 
                     num DESC
                 LIMIT 5;
             """
        cursor.execute(query)

        rows = cursor.fetchall()

        result_dicts = [{'username': row[0], 'Accuracy': row[1]} for row in rows]

        close_database_connection(cnx, cursor)

        return jsonify({"status": "success", "message": result_dicts}), 200

    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/removeUserLog", methods=["GET"])
def remove_user():
    try:
        username = request.args.get('username')

        cnx = get_database_connection()
        cursor = cnx.cursor(buffered=True)
        query = f"DELETE FROM Userlog WHERE username = '{username}';"

        cursor.execute(query)
        cnx.commit()
        close_database_connection(cnx, cursor)
        return jsonify({"status": "success", "message": f"Deleted the user {username}"}), 200
    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        close_database_connection(cnx, cursor)


@app.route("/definitionGame", methods=["GET"])
def definitionGame():
    try:
        username = request.args.get('username')
        cnx = get_database_connection()
        cursor = cnx.cursor(buffered=True)

        median_param = getUserDifficulty(username, cursor)
        query = f"""
        SELECT DISTINCT c.Example, c.Definition, w.word,c.type,w.length
        FROM (SELECT word,length FROM word WHERE userate < {median_param}) AS w, 
             (SELECT example, Definition, `index`,type FROM context WHERE example != "") AS c,
             usedin
        WHERE 
            w.word = usedin.word AND
            usedin.index = c.`index`
        ORDER BY RAND() LIMIT 1
        """

        cursor.execute(query)
        answer = cursor.fetchone()
        print("_____________________________________________")
        print("the answer in definition game is ", answer[2])
        print("_____________________________________________")


        close_database_connection(cnx, cursor)
        return jsonify({"status": "success", "message": answer}), 200
    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/updateScore", methods=["POST"])
def update_score():
    try:
        data = request.get_json()  # this taking json object and insert him as dictionary in python

        answer = set_user_score(data)
        if answer["status"] == "success":
            return jsonify(
                {"status": "success", "message": "User registered successfully"}), 200  # return data and http status.
        elif answer["status"] == "error":
            return jsonify({"status": "error", "message": answer["message"]}), 500
    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": str(e)}), 500


def set_user_score(data):
    # split the params.
    username, typeOfGame, result, formattedDate, Accuracy = data['username'], data['typeOfGame'], data['result'], \
                                                            data['formattedDate'], data['Accuracy']
    try:
        cnx = get_database_connection()
        cursor = cnx.cursor(buffered=True)

        if result == "Win":
            query_insert = f"INSERT INTO {dbName}.userlog (Username, TypeOfGame, Result, Date,Accuracy ) VALUES (  '{username}',  '{typeOfGame}',  '{result}',  '{formattedDate}','{Accuracy}');"
            cursor.execute(query_insert)
            cnx.commit()

            return {"status": "success", "message": " inserted won successfully"}
        else:
            query_insert = f"INSERT INTO {dbName}.userlog (Username, TypeOfGame, Result, Date,Accuracy ) VALUES (  '{username}',  '{typeOfGame}',  '{result}',  '{formattedDate}','{Accuracy}');"
            cursor.execute(query_insert)
            cnx.commit()

            return {"status": "success", "message": " inserted lose successfully"}
        # mean its all good

    except Exception as e:
        print(e)
        return {"status": "error", "message": f"Database query execution error: {str(e)}"}
    finally:
        close_database_connection(cnx, cursor)


@app.route("/getLastGames", methods=["GET"])
def get_last_games():
    try:
        username = request.args.get('username')

        cnx = get_database_connection()
        cursor = cnx.cursor(buffered=True)
        query = f"""
            SELECT
                username,
                TypeOfGame,
                Accuracy,
                Date,
                Result
            FROM
                userlog
            WHERE
                username = "{username}"
            
            ORDER BY
                Date Desc    
            LIMIT 5;
        """
        cursor.execute(query)
        rows = cursor.fetchall()
        modified_rows = []
        for row in rows:
            modified_row = list(row)
            for i, value in enumerate(modified_row):
                if value == "Game1":
                    modified_row[i] = "definition game"
                elif value == "Game2":
                    modified_row[i] = "synonym game"
            modified_rows.append(modified_row)
        result_dicts = [
            {
                'username': row[0],
                'TypeOfGame': row[1],
                'Accuracy': row[2],
                'Date': row[3].strftime('%Y-%m-%d %H:%M:%S'),  # Adjust the format as we want to show.
                'Result': row[4]
            }
            for row in modified_rows
        ]
        close_database_connection(cnx, cursor)
        return jsonify({"status": "success", "message": result_dicts}), 200

    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/SynonymsGame", methods=["GET"])
def synonyms_game():
    try:
        cnx = get_database_connection()
        cursor = cnx.cursor(buffered=True)

        username = request.args.get('username')

        query = f"""
      SELECT word, usedin.`index`, a.definition
      FROM usedin, (SELECT `index`, definition FROM context WHERE size > 3  ORDER BY RAND() LIMIT 1) as a
      WHERE usedin.`index` = a.`index`
      LIMIT 3;
        """
        cursor.execute(query)
        answer = cursor.fetchall()

        different_word = get_different_word(answer[0][1], username)  # give the index
        result = [answer[0][0], answer[1][0], answer[2][0], different_word, answer[0][2]]  # answer[0][2] is the clue
        close_database_connection(cnx, cursor)

        return jsonify({"status": "success", "message": result}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


def get_different_word(index, username):
    try:
        cnx = get_database_connection()
        cursor = cnx.cursor(buffered=True)

        median_param = getUserDifficulty(username, cursor)

        query = f"""
            SELECT w.word 
            FROM usedin as u, word as w
            WHERE `Index` != {index} AND u.word = w.word AND useRate < {median_param}
            ORDER BY RAND() 
            LIMIT 1
        """
        cursor.execute(query)
        answer = cursor.fetchone()
        answer = answer[0]
        print("_____________________________________________")
        print("The unrelated word is: ", answer)
        print("_____________________________________________")

        close_database_connection(cnx, cursor)
        return answer
    except Exception as e:
        print(e)
        return None


if __name__ == '__main__':
    # thread=true mean we can run this sever on multi threading (we use it in the use effect in the client)
    app.run(debug=True, threaded=True)
