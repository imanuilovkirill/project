import type { Component } from "solid-js";
import { createSignal } from "solid-js";

import type { LostThingData } from "../model/LostThingData";
import type { FoundThingData } from "../model/FoundThingData";
import "../../../app/styles.css";
import { fileToBase64 } from "../../../shared/lib/utils/index";
import { POST } from "../../../shared/lib/utils/index";
import { d } from "../../../shared/assets/index";
import { SVG } from "../../../shared/ui/index";
import { Props } from "../model/Props";

const checkLostThingDataType = (data: LostThingData) => {
  return true;
};

const checkFoundThingDataType = (data: FoundThingData) => {
  return true;
};

export const AddNewThing: Component = ({
  syncLostThingsList,
  syncFoundThingsList,
  setAddNewThing,
}: Props) => {
  const [chooseThingType, setChooseThingType] = createSignal(true);
  const [addNewLostThing, setAddNewLostThing] = createSignal(false);
  const [addNewFoundThing, setAddNewFoundThing] = createSignal(false);

  const [thingName, setThingName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [thingLocation, setThingLocation] = createSignal("");
  const [customText, setCustomText] = createSignal("");
  const [thingPhoto, setThingPhoto] = createSignal();

  const [data, setData] = createSignal({});

  const [uploadPhotoFocus, setUploadPhotoFocus] = createSignal(false);

  return (
    <>
      {chooseThingType() && (
        <>
          <button
            onClick={() => {
              setChooseThingType(false);
              setAddNewLostThing(true);
            }}
          >
            Я потерял вещь
          </button>
          <button
            onClick={() => {
              setChooseThingType(false);
              setAddNewFoundThing(true);
            }}
          >
            Я нашёл вещь
          </button>
        </>
      )}
      {addNewLostThing() && (
        <>
          <div class="box_title">Добавить потерянную вещь</div>
          <form method="post">
            <input
              placeholder="Что Вы потеряли?"
              value={thingName()}
              onInput={(e) => setThingName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email()}
              onInput={(e) => setEmail(e.target.value)}
              required
            />
            <textarea
              placeholder="Здесь можно оставить сообщение"
              value={customText()}
              onInput={(e) => setCustomText(e.target.value)}
              required
            />
            {thingPhoto() && (
              <img
                class="thing__photo"
                src={thingPhoto()}
              />
            )}
            <input
              type="file"
              class="hidden"
              id="upload-photo__input"
              accept="image/jpeg"
              onFocus={() => setUploadPhotoFocus((prev) => !prev)}
              onBlur={() => setUploadPhotoFocus((prev) => !prev)}
              tabindex={thingPhoto() ? "-1" : "0"}
              onInput={(e) =>
                fileToBase64(e.target.files[0]).then((r) => setThingPhoto(r))
              }
            />
            <label
              class={`upload-photo__label${thingPhoto() ? " hidden" : ""}${uploadPhotoFocus() ? " focus" : ""}`}
              for="upload-photo__input"
            >
              Выберите файл
            </label>
            <button
              onClick={(e) => {
                e.preventDefault();
                setData({
                  thing_name: thingName(),
                  email: email(),
                  custom_text: customText(),
                  thing_photo: thingPhoto(),
                });
                if (checkLostThingDataType()) {
                  POST("add_new_lost_thing", data()).then(() =>
                    syncLostThingsList(),
                  );
                } else {
                  console.log("Type error (POST, lost things)");
                }
                setAddNewThing(false);
              }}
            >
              Отправить
            </button>
          </form>
        </>
      )}
      {addNewFoundThing() && (
        <>
          <div class="box_title">Добавить найденную вещь</div>
          <form method="post">
            <input
              placeholder="Что Вы нашли?"
              value={thingName()}
              onInput={(e) => setThingName(e.target.value)}
              required
            />
            <input
              placeholder="Где забрать вещь?"
              value={thingLocation()}
              onInput={(e) => setThingLocation(e.target.value)}
              required
            />
            <textarea
              placeholder="Здесь можно оставить сообщение"
              value={customText()}
              onInput={(e) => setCustomText(e.target.value)}
              required
            />
            {thingPhoto() && (
              <img
                class="thing__photo"
                src={thingPhoto()}
              />
            )}
            <input
              type="file"
              class="hidden"
              id="upload-photo__input"
              accept="image/jpeg"
              onFocus={() => setUploadPhotoFocus((prev) => !prev)}
              onBlur={() => setUploadPhotoFocus((prev) => !prev)}
              tabindex={thingPhoto() ? "-1" : "0"}
              onInput={(e) =>
                fileToBase64(e.target.files[0]).then((r) => setThingPhoto(r))
              }
            />
            <label
              class={`upload-photo__label${thingPhoto() ? " hidden" : ""}${uploadPhotoFocus() ? " focus" : ""}`}
              for="upload-photo__input"
            >
              Выберите файл
            </label>
            <button
              onClick={(e) => {
                e.preventDefault();
                setData({
                  thing_name: thingName(),
                  thing_location: thingLocation(),
                  custom_text: customText(),
                  thing_photo: thingPhoto(),
                });
                if (checkFoundThingDataType()) {
                  POST("add_new_found_thing", data()).then(() =>
                    syncFoundThingsList(),
                  );
                } else {
                  console.log("Type error (POST, found things)");
                }
                setAddNewThing(false);
              }}
            >
              Отправить
            </button>
          </form>
        </>
      )}
    </>
  );
};
