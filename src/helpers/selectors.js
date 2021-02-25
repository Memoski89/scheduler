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
}

export function getInterview(state, interview) {
  //  return a new object containing the interview data when we pass it an object that contains the interviewer.
  if (!interview) {
    return null;
  }

  const interviewerId = interview.interviewer;
  const interviewer = state.interviewers[interviewerId];
  const result = { ...interview, interviewer };

  return result;
}
export function getInterviewersForDay(state, dayname) {
  const result = [];
  const dayObj = state.days.find((d) => d.name === dayname);
  if (!dayObj) {
    return result;
  }

  for (let id of dayObj.interviewers) {
    if (state.interviewers[id]) {
      result.push(state.interviewers[id]);
    }
  }

  return result;
}
