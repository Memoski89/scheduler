import React, { useState, useEffect } from "react";
import axios from "axios";
import "components/Application.scss";
import DayList from "components/DayList";
import "components/Appointment";
import Appointment from "components/Appointment";
import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay,
} from "helpers/selectors";
import useVisualMode from "hooks/useVisualMode";

export default function Application(props) {
  /*   const [days, setDays] = useState([]);
  const [day, setDay] = useState("Monday"); */
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });
  const setDay = (day) => setState({ ...state, day });

  useEffect(() => {
    const dayURL = `/api/days`;
    const apptURL = `/api/appointments`;
    const intURL = `/api/interviewers`;

    Promise.all([
      axios.get(dayURL),
      axios.get(apptURL),
      axios.get(intURL),
    ]).then((all) => {
      const days = all[0].data;
      const appointments = all[1].data;
      const interviewers = all[2].data;
      setState((prev) => ({ ...prev, days, appointments, interviewers }));
    });
  }, []);

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const dailyInterviewers = getInterviewersForDay(state, state.day);

  function bookInterview(id, interview) {
    // console.log("newinterview", newInterview);
    // const appointmentsCopy = { ...state.appointments };
    // const newAppointment = { ...appointmentsCopy[id], interview: interview };
    // appointmentsCopy[id] = newAppointment;
    const apptURLId = `/api/appointments/${id}`;

    // console.log("newappointment", newAppointment);

    return axios.put(apptURLId, { interview }).then(() => {
      const appointment = {
        ...state.appointments[id],
        interview: { ...interview },
      };
      const appointments = { ...state.appointments, [id]: appointment };
      setState({ ...state, appointments: appointments });
    });
  }
  function cancelInterview(id, interview) {
    interview = null;
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

  const appointments = dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    const interviewer = function () {
      dailyInterviewers.forEach((interviewer) => {
        if (appointment.interview.interviewer === interviewer.id) {
          return interviewer;
        }
      });
    };

    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={dailyInterviewers}
        interviewer={interviewer}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointments}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
