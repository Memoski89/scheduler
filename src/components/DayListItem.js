import React from "react";
import "components/DayListItem.scss";
import classnames from "classnames";
export default function DayListItem(props) {
  let formatSpots = function (arg) {
    if (!arg) {
      return `no spots remaining`;
    }
    if (arg === 1) {
      return `1 spot remaining`;
    } else return `${arg} spots remaining`;
  };
  const liClass = classnames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": !props.spots,
  });
  return (
    <li
      className={liClass}
      onClick={() => props.setDay(props.name)}
      data-testid="day"
    >
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}
