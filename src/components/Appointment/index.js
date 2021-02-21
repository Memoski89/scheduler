import React, { Fragment } from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import useVisualMode from "hooks/useVisualMode";
import { traverse } from "@babel/core";
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
export default function Appointment(props) {
  const interviewers = props.interviewers;
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };
    transition(SAVING);
    console.log("interview", interview);
    props.bookInterview(props.id, interview).then(() => {
      transition(SHOW);
    });
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === CREATE && (
        <Form
          interviewers={interviewers}
          onCancel={() => back(Empty)}
          onSave={save}
        />
      )}
      {mode === SAVING && <Status message="Saving" />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
        />
      )}
    </article>
  );
}

// {props.interview ? (
//   <Show
//     student={props.interview.student}
//     name={props.interview.interviewer.name}
//   />
// ) : (
//   <Empty />
// )}
