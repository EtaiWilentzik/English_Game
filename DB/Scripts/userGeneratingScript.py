import csv
import random
import string
from datetime import datetime, date, timedelta

def generate_passwords(pass_len):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(pass_len))

def generate_random_date_between(start_time, end_time):    
    random_seconds = random.randint(0, int(( end_time - start_time).total_seconds()))
    
    return start_time + timedelta(seconds=random_seconds)

Israeli_names = ['Yael', 'Eli', 'Maya', 'Avi', 'Noa', 'Amir', 'Tamar', 'Omer', 'Adi', 'Yoni', 'Shira', 'Itai', 'Liat', 'Yaniv', 'Orly', 'Eran', 'Dana', 'Guy', 'Noga', 'Roi',
                 'Tali', 'Ron', 'Lior', 'Michal', 'Yair', 'Hadar', 'Yonatan', 'Gal', 'Shay', 'Nirit', 'Nir', 'Shani', 'Tomer', 'Stav', 'Oren', 'Sharon', 'Shlomit', 'Idan', 'Keren',
                 'Eyal', 'Chen', 'Ofir', 'Inbar', 'Yossi', 'Moran', 'Amit', 'Yiftach', 'Lilach', 'Yitzhak', 'Yifat', 'Yigal', 'Shir', 'Arik', 'Shlomo', 'Yaeli', 'Osnat', 'Yehuda',
                 'Iris', 'Eitan', 'Vered', 'Yariv', 'Shoham', 'Zohar', 'Rachel', 'Dror', 'Oren', 'Dikla', 'Aviad', 'Avital', 'Matan', 'Alona', 'Yoav', 'Sivan', 'Yuval', 'Anat', 'Ami',
                 'Lilach', 'Gadi', 'Ofira', 'Yuval', 'Amira', 'Nimrod', 'Sapir', 'Amalia', 'Bar', 'Shmuel', 'Tal', 'Yfat', 'Oz', 'Einav', 'Ronen', 'Keren', 'Oded', 'Tova', 'Amos',
                 'Shaked', 'Yifat', 'Yitzhak', 'Hila', 'Tuvia', 'Vered', 'Asaf', 'Kfir', 'Yifat', 'Avraham', 'Shulamit', 'Tom', 'Esti', 'Moti', 'Limor', 'Nir', 'Rina', 'Natan', 'Ayelet',
                 'Yehudit', 'Yoel', 'Ziva', 'Zvi', 'Tamar', 'Yehoshua', 'Sigal', 'Yehudit', 'Alon', 'Irit', 'Udi', 'Yiska', 'Motti', 'Orit', 'Yehonatan', 'Nurit', 'Yair', 'Ruth', 'Dudi',
                 'Noya', 'Dudu', 'Avital', 'Gideon', 'Bracha', 'Uri', 'Vardit', 'Rafael', 'Yardena', 'Yiftach', 'Revital', 'Amram', 'Nechama', 'Elad', 'Tzipi', 'Asnat', 'Arik', 'Leah',
                 'Yishai', 'Nili', 'Yonina', 'Natan', 'Adva', 'Yakov', 'Hodaya', 'Yanai', 'Dafna', 'Omri', 'Sarit', 'Yechiel', 'Yaelle', 'Zeev', 'Yulia', 'Yuval', 'Mira', 'Erez', 'Chaya',
                 'Yotam', 'Noam', 'Ilanit', 'Yohanan', 'Yulia', 'Yocheved', 'Yishai', 'Lilach', 'Ophir', 'Shani', 'Yael', 'Shmuel', 'Shira', 'Yossi', 'Shirley', 'Shalom', 'Sigalit', 'Yitzhak']

num_users = int(input("Number of users to be generated: "))
num_logs = int(input("Number of logs to be generated: "))

usernames = set()
i = 0
while len(usernames) < num_users - 1:
    if i >= len(Israeli_names):
        username = random.choice(Israeli_names) + str(random.randint(0,9999))
    else:
        username = Israeli_names[i]
    usernames.add(username)
    i+=1

passwords = [generate_passwords(10) for _ in range(num_users)]
Hakbatza = [random.choice([1,2,3]) for _ in range(num_users)]
Class = [random.randint(1, 12) for _ in range(num_users)]

users_data = list(zip(usernames, passwords, Hakbatza, Class))

with open('random_users.csv', 'w', newline='') as csv_file:
    csv_writer = csv.writer(csv_file)
    
    csv_writer.writerow(['Username', 'Password', 'Hakbatza', 'Class'])
    csv_writer.writerow(['user1', '123456', '1', '1'])
    
    csv_writer.writerows(users_data)

list_usernames = list(usernames)
users = [random.choice(list_usernames) for _ in range(num_logs)]
TypeOfGame = [random.choice(['Game1','Game2'])  for _ in range(num_logs)]
Result = [random.choice(['Win','Lose']) for _ in range(num_logs)]
start_date = datetime(2023, 12, 1, 0, 0, 0)
end_date = datetime.now()
Date = [generate_random_date_between(start_date, end_date) for _ in range(num_logs)]
Accuracy = [5*random.randint(0, 20) for _ in range(num_logs)]

logs_data = list(zip(users, TypeOfGame, Result, Date, Accuracy))

with open('random_logs.csv', 'w', newline='') as csv_file:
    csv_writer = csv.writer(csv_file)
    
    csv_writer.writerow(['Username', 'TypeOfGame', 'Result', 'Date', 'Accuracy%'])
    
    csv_writer.writerows(logs_data)