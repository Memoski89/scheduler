import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
    remainingSpotsForDay: [],
  });

  // reloads data from the database, and then setState
  function getData() {
    return Promise.all([
      Promise.resolve(axios.get("/api/days")),
      Promise.resolve(axios.get("/api/appointments")),
      Promise.resolve(axios.get("/api/interviewers")),
    ]).then((all) => {
      return setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }

  useEffect(() => {
    getData();
  }, []);
  function getDay(id) {
    //loop through state.days
    let days = state.days.filter((day) => {
      return day.appointments.includes(id);
    });
    return days[0];
  }

  function bookInterview(id, interview) {
    // console.log("newinterview", newInterview);
    // const appointmentsCopy = { ...state.appointments };
    // const newAppointment = { ...appointmentsCopy[id], interview: interview };
    // appointmentsCopy[id] = newAppointment;

    let day = getDay(id);

    let new_day = {
      ...day,
      spots: day.spots - 1,
    };

    let new_days = state.days;

    for (let i = 0; i < state.days.length; i++) {
      if (state.days[i].id === new_day.id) {
        new_days.splice(i, 1, new_day);
      }
    }

    const apptURLId = `/api/appointments/${id}`;

    return axios
      .put(apptURLId, { interview })
      .then(() => {
        const appointment = {
          ...state.appointments[id],
          interview: { ...interview },
        };
        const appointments = { ...state.appointments, [id]: appointment };
        setState({ ...state, appointments: appointments });
      })
      .catch((err) => {
        console.log("error LINE 51:", err);
      });
  }

  function cancelInterview(id, interview) {
    interview = null;
    let day = getDay(id);

    let new_day = {
      ...day,
      spots: day.spots + 1,
    };
    let new_days = state.days;
    for (let i = 0; i < state.days.length; i++) {
      if (state.days[i].id === new_day.id) {
        new_days.splice(i, 1, new_day);
      }
    }

    const apptURLId = `/api/appointments/${id}`;

    return axios.delete(apptURLId, { interview }).then(() => {
      const appointment = {
        ...state.appointments[id],
        interview: { ...interview },
      };

      const appointments = { ...state.appointments, [id]: appointment };

      setState({ ...state, appointments: appointments });
    });
  }

  return { state, setState, getData, bookInterview, cancelInterview };
}
