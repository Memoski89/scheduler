import React, { Fragment } from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import useVisualMode from "hooks/useVisualMode";
import { traverse } from "@babel/core";
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETE = "DELETE";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
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
    props.bookInterview(props.id, interview).then(() => {
      transition(SHOW);
    });
  }
  function deleteAppointment() {
    transition(DELETE);
    props.cancelInterview(props.id).then(() => {
      transition(EMPTY);
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
      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you want to delete?"
          onCancel={() => back(Show)}
          onConfirm={deleteAppointment}
        />
      )}

      {mode === SAVING && <Status message="Saving" />}
      {mode === DELETE && <Status message="Deleting" />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={()=> transition(EDIT)}
        />
      )}
      {mode === EDIT && (
        <Form
          value={props.interview.student}
          interviewers={interviewers}
          onCancel={() => back(Show)}
          onSave={save}
        /> )}
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
