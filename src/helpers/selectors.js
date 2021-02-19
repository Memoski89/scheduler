export function getAppointmentsForDay(state, dayname) {
  const result = [];

  const dayObj = state.days.find((d) => d.name === dayname);
  if (!dayObj) {
    return result;
  }

  for (let id of dayObj.appointments) {
    result.push(state.appointments[id]);
  }
  return result;

  //coding golf it's too robotic too clever
  // return (
  //   state.days
  //     .filter((day) => day.name === dayname)
  //     .map((day) =>
  //       day.appointments.map(
  //         (appointmentid) => state.appointments[appointmentid]
  //       )
  //     )[0] || []
  // );
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

export function getInterview(state, interview) {
  //  return a new object containing the interview data when we pass it an object that contains the interviewer.
  if (!interview) {
    return null;
  }

  const interviewerId = interview.interviewer;
  const interviewer = state.interviewers[interviewerId];
  const result = { ...interview, interviewer };
  console.log(result);
  return result;

  // return (
  //   state.appointments
  //     .filter(
  //       (appointmentid) =>
  //         state.appointmentid[appointmentid].interview === interview
  //     )
  //     .map((appointmentid) =>
  //       appointmentid.interview.interviewer.map(
  //         (interviewerid) => state.interviewers[interviewerid]
  //       )
  //     )[0] || null
  // );
}
