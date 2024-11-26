import datetime
import sqlite3

from fastapi import FastAPI
from pydantic import BaseModel

import config


class LostThingData(BaseModel):
    thing_name: str
    user_contacts: str
    path_to_thing_photo: str
    custom_text: str
    

class FoundThingData(BaseModel):
    thing_name: str
    thing_location: str
    path_to_thing_photo: str
    custom_text: str


app = FastAPI()


@app.get("/get_things_list")
def get_things_list(type: str):
    connection = sqlite3.connect(config.PATH_TO_DB)
    with connection:
        cursor = connection.cursor()
        data = cursor.execute(
            f"""
            SELECT * FROM {type}_thing WHERE status=0;
            """
        ).fetchall()
        formatted_data = []
        if type == "lost":
            for i in range(len(data)):
                formatted_data.append({
                    "id": data[i][0],
                    "publication_date": data[i][1],
                    "publication_time": data[i][2],
                    "thing_name": data[i][3],
                    "user_contacts": data[i][4],
                    "path_to_thing_photo": data[i][5],
                    "custom_text": data[i][6],
                    "status": data[i][7]
                })
        elif type == "found":
            for i in range(len(data)):
                formatted_data.append({
                    "id": data[i][0],
                    "publication_date": data[i][1],
                    "publication_time": data[i][2],
                    "thing_name": data[i][3],
                    "thing_location": data[i][4],
                    "path_to_thing_photo": data[i][5],
                    "custom_text": data[i][6],
                    "status": data[i][7]
                })
    return formatted_data
    

@app.post("/add_new_lost_thing")
def add_new_lost_thing(data: LostThingData):
    connection = sqlite3.connect(config.PATH_TO_DB)
    with connection:
        cursor = connection.cursor()
        cursor.execute(
            f"""
            INSERT INTO lost_thing (
                publication_date,
                publication_time,
                thing_name,
                user_contacts,
                path_to_thing_photo,
                custom_text,
                status
            )
            VALUES (
                '{str(datetime.datetime.now())[0:10]}',
                '{str(datetime.datetime.now())[11:16]}',
                '{data.thing_name}',
                '{data.user_contacts}',
                '{data.path_to_thing_photo}',
                '{data.custom_text}',
                0
            );
            """
        )


@app.post("/add_new_found_thing")
def add_new_found_thing(data: FoundThingData):
    connection = sqlite3.connect(config.PATH_TO_DB)
    with connection:
        cursor = connection.cursor()
        cursor.execute(
            f"""
            INSERT INTO found_thing (
                publication_date,
                publication_time,
                thing_name,
                thing_location,
                path_to_thing_photo,
                custom_text,
                status
            )
            VALUES (
                '{str(datetime.datetime.now())[0:10]}',
                '{str(datetime.datetime.now())[11:16]}',
                '{data.thing_name}',
                '{data.thing_location}',
                '{data.path_to_thing_photo}',
                '{data.custom_text}',
                0
            );
            """
        )


@app.get("/change_thing_status")
def change_thing_status(type: str, id: int):
    connection = sqlite3.connect(config.PATH_TO_DB)
    with connection:
        cursor = connection.cursor()
        cursor.execute(
            f"""
            UPDATE {type}_thing SET status=1 WHERE id={id};
            """
        )

