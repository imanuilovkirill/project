import type { Component } from 'solid-js';

import styles from './thing.module.css';


interface FoundThingProps {
  id: number;
  publication_date: string;
  publication_time: string;
  thing_name: string;
  thing_location: string;
  custom_text: string;
}


const FoundThing: Component = (props: FoundThingProps) => {
  const months = ["января", "февраля", "марта", "апреля", "мая", "июня",
	          "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  const monthNumber = Number(props.props.publication_date.slice(5, 7));

  const day = Number(props.props.publication_date.slice(8, 10));
  const month = months[monthNumber - 1];
  const year = props.props.publication_date.slice(0, 4);

  const time = props.props.publication_time;

  return (
    <div class={styles.thing}>
      <div class={styles.thing__title}>
        {props.props.id}. {props.props.thing_name}
      </div>
      <div class={styles.thing__content}>
        Опубликовано: {day} {month} {year} в {time}<br/>
        Где забрать: {props.props.thing_location}<br/>
	{props.props.custom_text}
	<img class={styles.thing__photo} src={"data:image/jpeg;base64," + props.props.thing_photo}/>
      </div>
    </div>
  );
}

export default FoundThing;

