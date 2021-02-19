export default function getAppointmentsForDay(state, dayname) {
  //coding golf it's too robotic too clever
  return (
    state.days
      .filter((day) => day.name === dayname)
      .map((day) =>
        day.appointments.map(
          (appointmentid) => state.appointments[appointmentid]
        )
      )[0] || []
  );
  // console.log(dayname, item[0]);
  // return item[0] || [];

  // try to use more methods rather than definitions, BE DECLERATIVE NOT IMPERATIVE!!
  // tell the machine what to do not how to do!!
  // const filtereddays = state.days.filter((key) => key.name === day);
  // if (filtereddays.length > 0) {
  //   return filtereddays[0].appointments.map(
  //     (appointmentid) => state.appointments[appointmentid]
  //   );
  // }
  // return filtereddays;
}
